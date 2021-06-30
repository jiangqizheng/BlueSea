import { useState, useEffect } from 'react';

// let reloading = false

export const clientFetch = (serverApi, params = {}) => {
  if (typeof params !== 'object') {
    params = {
      // 只有一个直接参数
      onlyQuery: params,
    };
  }
  const API_HOST = 'http://localhost:3001';
  const url = `${API_HOST}/api/${serverApi}`;

  // const headers = {
  //   'content-type': 'application/json',
  // };
  const extHeaders = params._headers || {};

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
      ...extHeaders,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((rt) => {
      if (rt.success) {
        // reloading = false
        return rt.content;
      } else {
        if (rt.code === -1) {
          // reloading = true
          // 登录失败，强制重新加载插件与页面
          // chrome.runtime.reload();
          // chrome.tabs.query(
          //   { active: true, lastFocusedWindow: true },
          //   (tabs) => {
          //     if (tabs[0]) {
          //       chrome.tabs.reload(tabs[0].id);
          //     }
          //   }
          // );
        }
        return Promise.reject(rt.message || '接口异常');
      }
    });
};

export function adpWrap(handleKey, handle) {
  //动态构建一个onMessage handle
  //判断当前环境，先注册一遍，background直接调用
  // console.log('handleKey', handleKey);
  if (window.env_coderun === 'background') {
    // 注册，通过db来校验是否唯一注册，一个handle只能注册一次
    chrome.runtime.onMessage.addListener(
      function ({ type, payload }, sender, sendResponse){
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
      });
    }
  };
}

// 提供给codegen使用
export const createClientFetchProxy = (a, b) => {
  return adpWrap(`${a}.${b}`, async (dt) => {
    return clientFetch(`${a}.${b}`, dt);
  });
};

export const useFetch = (fetch, initial) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const fetchData = async (query) => {
    try {
      setLoading(true);
      const rt = await fetch(query);
      setData(rt);
      setLoading(false);
    } catch (e) {
      if (e === 'Authentication Error') {
        console.log('登陆态异常');
      } else {
        throw new Error(e || '接口异常');
      }
    }
  };

  useEffect(() => {
    fetchData(initial);
  }, []);
  const refresh = (query = undefined) => {
    return fetchData(query);
  };
  return { rt: data, refresh, loading };
};
