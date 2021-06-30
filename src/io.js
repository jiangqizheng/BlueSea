import { clientFetch, useFetch } from './utils/fetch';
import { bluesea } from './logic';

export { clientFetch, useFetch };

// 注册系统，非background使用时，先注册，后调用

class IO {
  constructor() {
    const callBusiness = new.target.name.toLowerCase();
    if (window.env_coderun === 'background') {
      chrome.runtime.onMessage.addListener(
        ({ type, payload, config }, sender, sendResponse) => {
          (async () => {
            const [business, method] = type.split('.');
            if (business === callBusiness && method in this) {
              const rt = await this[method](payload);
              if (config.auto) {
                const rtx = await clientFetch(type, rt || payload);
                sendResponse(rtx);
              } else {
                sendResponse(rt);
              }
            }
          })();
          return true;
        }
      );
    }

    this.proxy = new Proxy(
      {},
      {
        get: (target, propKey, b) => {
          return async (payload, conf = {}) => {
            const config = {
              auto: true, // 自动发起请求
              ...conf,
            };
            if (window.env_coderun === 'background') {
              const rt = await this[propKey](payload);
              if (config.auto) {
                const rtx = await clientFetch(
                  `${callBusiness}.${propKey}`,
                  rt || payload
                );
                return rtx;
              } else {
                return rt;
              }
            }
            return new Promise((resolve) => {
              chrome.runtime.sendMessage(
                { type: `${callBusiness}.${propKey}`, payload, config },
                (rt) => {
                  resolve(rt);
                }
              );
            });
          };
        },
      }
    );
    return this.proxy;
  }
}

class NOIO extends IO {
  async tf(payload) {
    const materialList = await bluesea.getMaterials();
    const material = materialList.find((it) => it.text === payload);
    if (material && material.youdao) {
      return material.youdao;
    } else {
      const config = await bluesea.getConfig();
      const res = await fetch(
        `https://service-pnrys8g3-1254074572.bj.apigw.tencentcs.com/release?text=${payload}&appkey=${
          config['有道智云appkey'] || ''
        }&key=${config['有道智云key'] || ''}`
      ).then((raw) => raw.json());
      if (res.success) {
        return res.content;
      }
    }
  }
  async nlp(payload) {
    const res = await nlp(payload);
    return res;
  }
  async calcEls(payload) {
    const forLowerCase = (text) => {
      return text.toLowerCase();
    };
    const result = payload[0].reduce((pre, cur, index) => {
      const hasExist = payload[1].some((it) => {
        return forLowerCase(cur).includes(forLowerCase(it.text));
      });
      return hasExist ? [...pre, index] : pre;
    }, []);
    return result;
  }
}

class User extends IO {
  async userLogin({ identifier, credential, identity_type, LOGIN_TOKEN }) {
    return {
      identifier,
      credential,
      identity_type,
      LOGIN_TOKEN,
    };
  }
  async userInfo() {}
  async getAuths() {}
  async login(_a, _b) {
    const forIdentifier = () => {
      return Math.random().toString(32).slice(2);
    };
    const forCredential = () => {
      return Math.random().toString(32).slice(2);
    };
    return new Promise((resolve) => {
      chrome.cookies.get(
        { url: 'http://127.0.0.1:8090', name: 'LOGIN_TOKEN' },
        async (cookie) => {
          // cookie = false
          //todo:要考虑过期问题
          if (cookie) {
            const rt = await this.proxy.userLogin({
              LOGIN_TOKEN: cookie.value,
            });
            const auths = await this.proxy.getAuths(cookie.value);
            chrome.storage.sync.set({
              type_identifier_credential: `${auths[0].identity_type}__chrome__${auths[0].identifier}__chrome__${auths[0].credential}`,
            });
            resolve(true);
            // 重新走登陆流程
          } else {
            chrome.storage.sync.get(
              'type_identifier_credential',
              async ({ type_identifier_credential }) => {
                // type_identifier_credential = 'chrome_extensions__chrome__prafgrj822__chrome__tesbee9v38'
                let LOGIN_TOKEN = '';
                if (type_identifier_credential) {
                  const [
                    identity_type,
                    identifier,
                    credential,
                  ] = type_identifier_credential.split('__chrome__');
                  const rt = await this.proxy.userLogin({
                    identity_type,
                    identifier,
                    credential,
                  });
                  LOGIN_TOKEN = rt.LOGIN_TOKEN;
                } else {
                  // 首次使用插件
                  const identity_type = 'chrome_extensions';
                  const identifier = forIdentifier();
                  const credential = forCredential();
                  const rt = await this.proxy.userLogin({
                    identity_type,
                    identifier,
                    credential,
                  });
                  chrome.storage.sync.set({
                    type_identifier_credential: `${identity_type}__chrome__${identifier}__chrome__${credential}`,
                  });
                  LOGIN_TOKEN = rt.LOGIN_TOKEN;
                }
                //写入token用于同步网站登录态
                chrome.cookies.set({
                  url: 'http://127.0.0.1:8090',
                  name: 'LOGIN_TOKEN',
                  value: LOGIN_TOKEN,
                });
                resolve(true);
              }
            );
          }
        }
      );
    });
  }
}

class Word extends IO {
  async getList() {}
  async batchDel(ids) {}
  async batchAdd(ids) {}
  async syncFrequency(obj) {}
}

class Fy extends IO {
  async forDictWord(word) {}
  async query({ text }) {}
}

// http://dict.youdao.com/wordbook/wordlist?keyfrom=null#/
class Youdao extends IO {
  async verifyCookie() {
    const loginURL =
      'http://account.youdao.com/login?service=dict&back_url=http://dict.youdao.com/wordbook/wordlist%3Fkeyfrom%3Dnull';
    return new Promise((resolve, reject) => {
      chrome.cookies.get(
        { url: 'http://dict.youdao.com', name: 'DICT_SESS' },
        async (cookie) => {
          if (cookie) {
            resolve(cookie);
          } else {
            chrome.tabs.create({
              url: loginURL,
            });
            reject();
          }
        }
      );
    });
  }
  async fetch(text, action) {
    const host = 'http://dict.youdao.com';
    const rt = await fetch(
      `${host}/wordbook/ajax?q=${text.toLowerCase()}&action=${action}&date=${encodeURI(
        new Date().toString()
      )}&le=eng`,
      {
        method: 'GET',
        withCredentials: true,
        headers: {
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    ).then((rt) => rt.json());
    return rt;
  }
  async add(text) {
    await this.verifyCookie();
    const rt = await this.fetch(text, 'addword');
    return rt;
  }
  async del(text) {
    await this.verifyCookie();
    const rt = await this.fetch(text, 'delword');
    return rt;
  }
}

export const youdao = new Youdao();
export const noio = new NOIO();
export const user = new User();
export const word = new Word();
export const fy = new Fy();

// ----新改造聚合接口
// class Material extends IO {
//   async query(text) {}
//   async add(dt) {}
//   async del(id) {}
//   async update(dt) {}
//   async getList() {}
// }

// export const material = new Material();

// chrome.runtime.onMessage.addListener(
//   ({ type, payload, handleStr }, sender, sendResponse) => {
//     (async () => {
//       if (type === 'runcode') {
//         console.log(`(${handleStr})(${
//           typeof payload === 'object' ? JSON.stringify(payload) : payload
//         })`)
//         const rt = await eval(
//           `(${handleStr})(${
//             JSON.stringify({wrap: payload})
//           }['wrap'])`
//         );
//         sendResponse(rt);
//       }
//     })();
//     return true;
//   }
// );

function ioWrap(handle) {
  //动态构建一个onMessage handle
  //判断当前环境，先注册一遍，background直接调用
  const handleKey = handle.toString();
  // console.log('handleKey', handleKey);
  if (window.env_coderun === 'background') {
    // 注册，通过db来校验是否唯一注册，一个handle只能注册一次
    chrome.runtime.onMessage.addListener(
      ({ type, payload }, sender, sendResponse) => {
        (async () => {
          if (type === handleKey) {
            const rt = await handle(payload);
            sendResponse(rt);
          }
        })();
        return true;
      }
    );
  }
  return (payload) => {
    if (window.env_coderun === 'background') {
      return handle(payload);
    } else {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: handleKey, payload }, (rt) => {
          resolve(rt);
        });
        // chrome.runtime.sendMessage(
        //   { type: 'runcode', payload, handleStr: handleKey },
        //   (rt) => {
        //     resolve(rt);
        //   }
        // );
      });
    }
  };
}

// class Material extends IO {
//   async query(text) {}
//   async add(dt) {}
//   async del(id) {}
//   async update(dt) {}
//   async getList() {}
// }

export const material = {
  query: ioWrap(async (dt) => {
    return clientFetch(`material.query`, dt);
  }),
  add: (dt) => {},
  del: (id) => {},
  update: (dt) => {},
  getList: () => {},
};
