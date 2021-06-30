import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import * as io from './io';
import { fnConfig } from './fnConfig';
import { Storage } from './utils/storage';

// import {useFetch} from 'utils/fetch'
// import * as material from 'api/material.ts';
import * as material from 'api/material';

// console.log(useFetch)

// storage | io -> store -> businessStore -> userx

// 提取页面内句子进行预处理，后续鼠标移入
// 根据坐标获取处理的句子

declare global {
  interface Window {
    env_coderun: 'background' | 'content_scripts' | 'popup';
  }
  const chrome: any;
}

class Store {
  db: Storage;
  constructor() {
    const callBusiness = new.target.name.toLowerCase();
    this.db = new Storage(callBusiness);
    if (window.env_coderun === 'background') {
      this.refresh();
    }
  }
  useX() {
    const [data, setData] = useState([]);
    useEffect(() => {
      (async () => {
        const list = await this.refresh();
        setData(list);
        this.db.watch(async () => {
          const rt = await this.db.get();
          setData(rt);
        });
      })();
    }, []);
    return { rt: data };
  }
  async refresh(): Promise<any> {} // 必须实现
}

// 所有涉及单词或者句子的接口聚合在此处，修改状态前置
class MaterialStore extends Store {
  async addAndUpdate({ id, text, comment }) {
    let _id = id;
    if (!id) {
      _id = await material.add({ content: text });
    }
    await material.update({ id: _id, comment });
    this.refresh();
  }
  private async localAdd(text) {
    const l = await this.db.get();
    const tmp = {
      id: Date.now(),
      text,
      translation: '', // 从dict中提取，一定有结果
      dict: {}, // 单词时存在
      material: {
        id: 'tmp',
      },
    };
    await this.db.set([...l, tmp]);
  }
  async add(text) {
    await this.localAdd(text);
    await material.add({ content: text });
    this.refresh();
  }
  private async localDel(id) {
    const l = await this.db.get();
    await this.db.set([...l.filter((it) => it.id !== id)]);
  }
  async del(id) {
    await this.localDel(id);
    await material.del(id);
    this.refresh();
  }

  async update(dt) {
    await material.update(dt);
    this.refresh();
  }
  async getList() {
    return this.db.get();
  }
  async refresh() {
    const list = await material.getList();
    this.db.set(list);
    return list;
  }
  async query(text) {
    return material.query(text);
  }
  // async syncFrequency(ids) {
  //   const date = dayjs().format('YYYY-MM-DD');
  //   const href = location.href;
  //   await io.word.syncFrequency({ ids, date, href: encodeURI(href) });
  // }
}

// 在图里的表现，结合上下文翻译单词

class UserStore extends Store {
  async refresh() {
    const userInfo = await io.user.userInfo();
    this.db.set(userInfo);
    return userInfo;
  }
  async login() {
    await io.user.login(null, { auto: false });
  }
}

export const userStore = new UserStore();

if (window.env_coderun === 'content_scripts') {
  console.log('injectCustomJs');
  const injectCustomJs = (jsPath = 'inject.js') => {
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
      // 执行完后移除掉
      (this as any).parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
  };
  // 同步网站更换登陆态，
  document.addEventListener('DOMContentLoaded', () => {
    injectCustomJs();
    window.addEventListener(
      'message',
      (e) => {
        if (e.origin === 'http://127.0.0.1:8090') {
          if (e.data.type === 'login') {
            userStore.login();
          }
        }
      },
      false
    );
  });
}

export const materialStore = new MaterialStore();
