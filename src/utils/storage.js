// todo:改成同步的
class Storage {
  constructor(key) {
    this.key = key;
    this._val = '';
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
      try {
        storage.local.get(this.key, (obj) => {
          resolve(obj[this.key]);
        });
      } catch (e) {
        console.error(e);
        // location.href = location.href;
      }
    });
  }
  async set(value) {
    return new Promise(async (resolve) => {
      const storage = await this._getRootStorage();
      storage.local.set({ [this.key]: value }, () => {
        // 写入用
        this._val = value;
        resolve();
      });
    });
  }
  async rm() {
    return new Promise(async (resolve) => {
      const storage = await this._getRootStorage();
      storage.local.remove(this.key, () => {
        this._val = null;
        resolve();
      });
    });
  }
  async watch(cb) {
    const storage = await this._getRootStorage();
    const ref = (changes, namespace) => {
      if (namespace === 'local' && changes[this.key]) {
        console.log('数据毁--', changes);
        cb(changes[this.key].newValue);
      }
    };
    storage.onChanged.addListener(ref);
    // 用于解除观察
    return () => {
      storage.onChanged.removeListener(ref);
    };
  }
}
export { Storage };
