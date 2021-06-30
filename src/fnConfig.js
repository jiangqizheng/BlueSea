import { Storage } from './utils/storage';
import { useState, useEffect } from 'react';

const sp = (sp) => {
  return (target, name, spriptor) => {
    const initVal = spriptor.initializer();
    if (!target.realVal) {
      target.realVal = {
        [name]: initVal,
      };
    } else {
      target.realVal[name] = initVal;
    }

    // 中文描述
    target[`${name}_desc`] = sp;
    // 自身key
    target[`${name}_key`] = name;

    return {
      get() {
        return this.realVal[name];
      },
      set(val) {
        this.realVal[name] = val;
        const update = async (val) => {
          const full = await this.db.get();
          this.db.set({ ...full, [name]: val });
        };
        update(val);
      },
    };
  };
};

// 存在多个实例，每次调用数据互通需要等待异步读写，需要设计一个类来做这个事情，本地属性读写同步

class FnConfig {
  @sp('划词翻译')
  translation = true;
  @sp('单词高亮')
  highlight = true;
  @sp('自动发音')
  autoSpeech = true;
  @sp('中文注解')
  annotation = false;
  @sp('复习弹幕')
  bullets = false;
  @sp('弹幕数量')
  bulletsMax = 10;
  @sp('弹幕速度')
  bulletsSpeed = 12;
  @sp('网站黑名单')
  domainBlackList = [];
  @sp('标签黑名单')
  tagBlackList = [];
  // 存一个或者多个字段
  constructor() {
    this.sync = this.initSync();
  }
  async initSync() {
    this.db = new Storage(`fnConfigx`);
    const conf = await this.db.get();
    if (!conf) {
      this.db.set(this.realVal);
    } else {
      this.realVal = conf;
    }
    this.db.watch((val) => {
      this.realVal = val;
      this._watchs.forEach(async (fn, i) => {
        const clear = this._watchsClear[i];
        if (clear) {
          clear();
        }
        const inBlack = await this.testBlack();
        if (inBlack) {
          return;
        }
        this._watchsClear[i] = await fn(val);
      });
    });
  }
  useX() {
    const [data, setData] = useState(this.realVal);
    useEffect(() => {
      (async () => {
        this.db.watch((val) => {
          setData(val);
        });
      })();
    }, []);
    return { rt: data };
  }
  _watchs = [];
  _watchsClear = [];
  async run(cb) {
    await this.sync;
    // 插入监听队列
    const i = this._watchs.push(cb);

    const inBlack = await this.testBlack();
    if (inBlack) {
      return;
    }

    const clear = await this._watchs[i - 1](this.realVal);
    this._watchsClear[i - 1] = clear;
  }
  async testBlack() {
    await this.sync;
    const hostname = new URL(window.location).hostname;
    const rt = this.realVal.domainBlackList.some((it) => it === hostname);
    console.log('testBlack', rt);
    return rt;
  }
}

export const fnConfig = new FnConfig();
