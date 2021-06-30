import { isYTL, inEl } from '../common';
import { fnConfig } from '../fnConfig';
import { tip, Translation } from './tip';
import React from 'react';

let hasMove = false;
let lastText = '';

// 鼠标移开会自动销毁窗口

const listenMove = () => {
  hasMove = true;
};

const inBlackEl = (el) => {
  const blackElList = ['pre', 'code'].map((it) => it.toUpperCase());
  if (!el.parentNode) {
    return false;
  }

  if (blackElList.includes(el.nodeName)) {
    return true;
  } else {
    return inBlackEl(el.parentNode);
  }
};

const showTip = (e) => {
  if (isYTL(e.target)) {
    return;
  }
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (!range.collapsed) {
      let selectText = selection.toString().trim();

      if (lastText === selectText) {
        lastText = '';
        return;
      }

      if (selectText === '') {
        return;
      }

      // 不翻译中文
      if (!/^[^\u4e00-\u9fa5]+$/.test(selectText)) {
        return;
      }

      if (!/.*[a-zA-Z]{3,}.*/.test(selectText)) {
        // console.log('所选内容必须存在连续3个及以上字母时，才展开翻译');
        return;
      }

      const selectTextArr = selectText.split(' ');

      if (selectTextArr.length === 1) {
        // 非句子情况下，仅匹配纯粹单词，如果匹配到特殊符号就跳过，这里是为了避免干扰复制各类命令或url
        // 是否需要兼容，可能存在左右端误选了标点符号的情况呢？
        const symbolReg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
        if (symbolReg.test(selectText)) {
          return;
        }
      }

      // 过滤类似日志文件之类的奇怪玩意。
      // 最长的单词45个字母，Pneumonoultramicroscopicsilicovolcanoconiosis
      if (selectTextArr.some((it) => it.length > 45)) {
        return;
      }

      // 开始和边界不在黑名单标签内
      if (inBlackEl(range.startContainer) || inBlackEl(range.endContainer)) {
        // console.log('选中的内容存在特殊标签内，不展开');
        return;
      }

      // console.log('1122')

      tip.render({
        root: range,
        component: <Translation text={selectText} />,
        name: 'bluesea-selection-tip',
      });
    }
  }
};

const listenMouseup = (e) => {
  // console.log('up');
  document.removeEventListener('mousemove', listenMove);
  setTimeout(() => {
    showTip(e);
  }, 100);
};

const listenMousedown = (e) => {
  // console.log('down');
  hasMove = false;
  document.addEventListener('mousemove', listenMove);
  if (isYTL(e.target)) {
    return;
  }
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    lastText = selection.toString().trim();
  }

  tip.clear('bluesea-selection-tip');
};

document.addEventListener('DOMContentLoaded', () => {
  fnConfig.run((conf) => {
    if (conf.translation) {
      // document.addEventListener('click', click);
      document.addEventListener('mousedown', listenMousedown);
      document.addEventListener('mouseup', listenMouseup);

      return () => {
        // document.removeEventListener('click', click);
        document.removeEventListener('mousedown', listenMousedown);
        document.removeEventListener('mouseup', listenMouseup);
      };
    }
  });
});

// 辅助点选
function click(e) {
  // console.log('click');
  if (hasMove) {
    return;
  }
  if (isYTL(e.target)) {
    return;
  }

  console.log(inEl(e.target, ['P', 'ARTICLE']));
  const elRoot = e.target;

  const findX = () => {
    let tmp = [];
    let selectedEl = null;

    const checkoutText = (cur) => {
      const z = document.createElement('tmpsp');
      z.appendChild(cur.cloneNode(false));
      cur.parentNode.replaceChild(z, cur);
      tmp.push(z);
      const rect = z.getBoundingClientRect();
      if (
        rect.left < e.x &&
        rect.left + rect.width > e.x &&
        rect.top < e.y &&
        rect.top + rect.height > e.y
      ) {
        console.log('选中=-', z.innerText);
        selectedEl = z;

        const clearEl = (el) => {
          const text = document.createTextNode(el.innerText);
          const p = el.parentNode;
          p.replaceChild(text, el);
          p.normalize();
        };

        //当前选中最后再处理
        tmp.slice(0, tmp.length - 1).forEach(clearEl);

        const selection = window.getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(z); // 需要选中的dom节点
        selection.addRange(range);

        z.addEventListener('mouseleave', () => {
          document.querySelectorAll('tmpsp').forEach(clearEl);
        });
      }
    };

    for (let el of Array.from(elRoot.childNodes)) {
      if (el.nodeType !== 3) {
        continue;
      }
      const n = el;

      while (true) {
        if (selectedEl) {
          return tmp;
        }

        const i = n.nodeValue.search(/[^0-9a-zA-Z_']/);
        if (i === -1) {
          if (n.nodeValue.length > 1) {
            checkoutText(n);

            // if (checkoutText(n)) {
            //   return tmp;
            // }
          }
          break;
        }
        if (i === 0) {
          n.splitText(1);
          n = n.nextSibling;
          continue;
        }

        n.splitText(i);
        const cur = n;
        // let nextEl = n.nextSibling;
        n = n.nextSibling;

        // if (checkoutText(cur)) {
        //   return tmp;
        // }

        checkoutText(cur);

        // nextEl.splitText(1);
        // n = nextEl.nextSibling;
      }
    }
    return tmp;
  };

  findX();
}
