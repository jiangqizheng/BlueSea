const {
  html,
  Component,
  render,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} = window.$htm || {};

class Storage {
  constructor(key) {
    this.key = key;
  }
  async _getRootStorage() {
    if (chrome.storage) {
      return chrome.storage;
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (chrome.storage) {
            resolve(chrome.storage);
          } else {
            reject(new Error('等待后，依旧没有获取到chrome.storage'));
          }
        }, 1000);
      });
    }
  }
  async get() {
    return new Promise(async (resolve) => {
      const storage = await this._getRootStorage();
      storage.local.get(this.key, (obj) => {
        resolve(obj[this.key]);
      });
    });
  }
  async set(value) {
    return new Promise(async (resolve) => {
      const storage = await this._getRootStorage();
      storage.local.set({ [this.key]: value }, () => {
        resolve();
      });
    });
  }
  async watch(cb) {
    const storage = await this._getRootStorage();

    storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes[this.key]) {
        cb(changes[this.key].newValue);
      }
    });
  }
}

const materialsDB = new Storage('materials');
const configDB = new Storage('config');

const defaultConfig = {
  划词翻译: true,
  单词高亮: true,
  单词弹幕: true,
  黑名单: [],
  单词弹幕数量上限: 10,
  自动发音: true,
  中文注解: false,
  隐藏完成复习的单词: true,
  单词弹幕速度: 12,
  有道智云key: '',
  有道智云appkey: ''
  // 记忆曲线自定义: [],
  // 高亮单词样式: '',
  // 黑名单内标签，将不会激活划词功能
  // 标签黑名单: ['style', 'script', 'pre', 'code'],
};

class BlueSea {
  constant = {
    sortRule: {
      ctime: '创建时间（近->远）',
      learnTime: '复习时间（近->远）',
      learnLevel: '复习级别(低->高)',
      tabCount: '当前页面词频（高->低）',
      todayCount: '当天词频（高->低）',
      count: '总词频（高->低）',
    },
  };
  forgettingCurve = [
    5,
    30,
    12 * 60,
    24 * 60,
    2 * 24 * 60,
    4 * 24 * 60,
    7 * 24 * 60,
    15 * 24 * 60,
    30 * 24 * 60,
  ];
  // forgettingCurve = [0.5, 2, 4, 8, 16]; // 调试时使用
  constructor() {
    this.init();
  }
  async init() {
    const config = await configDB.get();
    if (!config) {
      configDB.set(defaultConfig);
    }
    const materialList = await materialsDB.get();
    if (!materialList) {
      materialsDB.set([]);
    }
  }
  async resetConfig() {
    return configDB.set(defaultConfig);
  }
  async getConfig() {
    return configDB.get();
  }
  async setConfig(config) {
    return configDB.set(config);
  }

  async getMaterials() {
    const l = await materialsDB.get();
    const config = await this.getConfig();
    const hideLearnedWord = config['隐藏完成复习的单词'];
    if (hideLearnedWord) {
      return l.filter(({ learn }) => {
        return !learn.done;
      });
    } else {
      return l;
    }
  }


  async setMaterials(l) {
    return materialsDB.set(l);
  }

  createMaterialObj(text, youdao) {
    let t = text;
    let textExts = [];
    if (youdao.returnPhrase) {
      t = youdao.returnPhrase[0];
      if (t.toLowerCase() !== text.toLowerCase()) {
        textExts.push(text);
      }
    }

    const material = {
      text: t,
      textExts,
      translation: youdao.translation[0],
      ctime: dayjs().format(),
      learn: this.createLearnObj(),
      // 保留完整数据，后面可能会使用
      youdao,
      addFrom: location.href,
    };
    return material;
  }

  async updateMaterialObj(material) {
    const l = await this.getMaterials();
    const i = l.findIndex(it => it.text === material.text)
    l.splice(i, 1, material)
    await this.setMaterials(l);
  }

  async addMaterialObj(material) {
    const l = await this.getMaterials();
    const existMaterial = l.find((it) => it.text === material.text);
    if (existMaterial) {
      existMaterial.textExts = Array.from(
        new Set([...(existMaterial.textExts || []), ...material.textExts])
      );
      await this.setMaterials(l);
      return;
    }
    await this.setMaterials([...l, material]);
  }

  async delMaterial(text) {
    const materialList = await materialsDB.get();
    const newL = materialList.filter((it) => it.text !== text);
    materialsDB.set(newL);
  }

  useConfig() {
    const [_config, _setConfig] = useState(null);
    useEffect(() => {
      (async () => {
        const config = await configDB.get();
        _setConfig(config);
        configDB.watch(async (val) => {
          _setConfig(val);
        });
      })();
    }, []);
    return _config;
  }
  forStatisticTodayCount(material) {
    const today = dayjs().format('YYYY-MM-DD');
    if (!material.statistics) {
      return 0;
    }
    if (!material.statistics[today]) {
      return 0;
    }
    return Object.values(material.statistics[today]).reduce((pre, cur) => {
      return pre + cur;
    }, 0);
  }
  forStatisticAllCount(material) {
    if (!material.statistics) {
      return 0;
    }
    return Object.values(material.statistics).reduce((pre, cur) => {
      return (
        pre +
        Object.values(cur).reduce((pre2, cur2) => {
          return pre2 + cur2;
        }, 0)
      );
    }, 0);
  }
  forStatisticTabCount(material, url) {
    const today = dayjs().format('YYYY-MM-DD');
    if (!material.statistics) {
      return 0;
    }
    if (!material.statistics[today]) {
      return 0;
    }
    return material.statistics[today][url] || 0;
  }

  async getTabUrl() {
    return new Promise((resolve) => {
      chrome.tabs.query(
        {
          active: true,
          lastFocusedWindow: true,
        },
        ([tab]) => {
          resolve(tab.url);
        }
      );
    });
  }
  useTabUrl() {
    const [_url, setUrl] = useState('');
    useEffect(() => {
      (async () => {
        const url = await this.getTabUrl();
        setUrl(url);
      })();
    }, []);
    return _url;
  }
  async handleSort(list, sortRule) {
    const l = JSON.parse(JSON.stringify(list));
    const handle = {
      ctime: () => {
        return l.sort((a, b) => {
          return a.ctime < b.ctime ? 1 : -1;
        });
      },
      learnTime: () => {
        return l.sort((a, b) => {
          return a.learn.learnDate < b.learn.learnDate ? -1 : 1;
        });
      },
      learnLevel: () => {
        return l.sort((a, b) => {
          return a.learn.level < b.learn.level ? -1 : 1;
        });
      },
      todayCount: () => {
        return l.sort((a, b) => {
          return this.forStatisticTodayCount(a) < this.forStatisticTodayCount(b)
            ? 1
            : -1;
        });
      },
      tabCount: async () => {
        return new Promise((resolve) => {
          chrome.tabs.query(
            {
              active: true,
              lastFocusedWindow: true,
            },
            ([tab]) => {
              resolve(
                l.sort((a, b) => {
                  return this.forStatisticTabCount(a, tab.url) <
                    this.forStatisticTabCount(b, tab.url)
                    ? 1
                    : -1;
                })
              );
            }
          );
        });
      },
      count: () => {
        return l.sort((a, b) => {
          return this.forStatisticAllCount(a) < this.forStatisticAllCount(b)
            ? 1
            : -1;
        });
      },
    }[sortRule];

    return handle();
  }

  useMaterialsMate() {
    const [list, setList] = useState([]);
    const [sortRule, setSortRule] = useState('ctime');

    const refresh = async () => {
      const l = await materialsDB.get();
      const l2 = await this.handleSort(l, sortRule);
      setList(l2);
    };

    useEffect(() => {
      materialsDB.watch(refresh);
    }, []);

    useEffect(() => {
      refresh();
    }, [sortRule]);

    return {
      list,
      sortRule,
      setSortRule,
    };
  }

  createLearnObj() {
    return {
      level: 0,
      // 在一个时间节点内出现几次才进入下一个节点，并计算下个节点的时间。如果多次点没记住，那么就回滚到上个级别，以此类推。
      learnDate: dayjs().add(this.forgettingCurve[0], 'm').format(),
    };
  }

  async getNeedLearnList() {
    const materialList = await this.getMaterials();
    const l2 = materialList.filter(({ learn }) => {
      return dayjs().format() > learn.learnDate;
    });

    return l2;
  }

  async toLearnNext(text) {
    const materialList = await this.getMaterials();
    const material = materialList.find((it) => it.text === text);
    const level = material.learn.level + 1;

    if (this.forgettingCurve[level]) {
      const time = dayjs().add(this.forgettingCurve[level], 'm').format();
      material.learn = {
        level,
        learnDate: time,
      };
    } else {
      material.learn = {
        learnDate: dayjs().format(),
        done: true,
      };
    }
    await this.setMaterials(materialList);
  }

  async toLearnBack(text) {
    const materialList = await this.getMaterials();
    const material = materialList.find((it) => it.text === text);
    material.learn = {
      level: 0,
      learnDate: dayjs().add(this.forgettingCurve[0], 'm').format(),
    };
    await this.setMaterials(materialList);
  }
}

const bluesea = new BlueSea();

class FunCtrl {
  fns = [];
  constructor() {
    configDB.watch(() => {
      this.fns.forEach(async (it) => {
        it.clear();
        const inBlack = await this.testBlack();
        const config = await bluesea.getConfig();
        const isActived = config[it.fnKey];
        if (!inBlack && isActived) {
          it.start();
        } else {
          it.clear();
        }
      });
    });
  }
  async run(fnKey, start, clear) {
    this.fns.push({
      fnKey,
      start,
      clear,
    });
    const inBlack = await this.testBlack();
    const config = await bluesea.getConfig();
    const isActived = config[fnKey];

    if (!inBlack && isActived) {
      start();
    }
  }
  async testBlack() {
    const config = await bluesea.getConfig();
    const blackList = config['黑名单'];
    const hostname = new URL(window.location).hostname;
    return blackList.some((it) => it === hostname);
  }
}

const funCtrl = new FunCtrl();
