const isYTL = (el) => {
  if (!el) {
    return false;
  }
  if (!el.classList || !el.parentNode) {
    return false;
  }
  if (el.classList.contains('bluesea')) {
    return true;
  } else {
    if (el.parentNode && el.parentNode.classList) {
      return isYTL(el.parentNode);
    } else {
      return false;
    }
  }
};

// 跳过特殊的节点
const isSpecialEl = (el) => {
  const names = ['SCRIPT', 'STYLE', 'PRE', 'CODE']; // 后续做成配置项，允许过滤代码标签
  if (names.includes(el.nodeName)) {
    return true;
  }
  return false;
};

const dFSTraverse = (rootNodes, result = []) => {
  const roots = Array.from(rootNodes);
  while (roots.length) {
    const root = roots.shift();

    // 跳过特殊节点 script style之类的
    if (isSpecialEl(root)) {
      continue;
    }

    // 跳过自己构建的tip
    if (isYTL(root)) {
      continue;
    }

    result.push(root);
    if (root.childNodes.length) {
      dFSTraverse(root.childNodes, result);
    }
  }
  return result;
};

const clearHighlighterGlobal = () => {
  const nodes = document.querySelectorAll(`xmark[data-marked="true"]`);
  nodes.forEach((el) => {
    const text = document.createTextNode(el.innerText);
    const p = el.parentNode;
    p.replaceChild(text, el);
    p.normalize();
  });
  axTip.clear();
};

const forLowerCase = (text) => {
  return text.toLowerCase();
};

const calcEls = (a, b) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'calcEls', payload: [a, b] }, (r) => {
      resolve(r);
    });
  });
};

const forReadyNodes = async (materialList) => {
  if (materialList.length === 0) {
    return [];
  }

  const els = dFSTraverse([document])
    .filter((el) => el.nodeType === 3)
    .filter((el) => el.nodeValue.trim())
    .filter((it) => !!it)
    .filter((it) => it.length > 3);

  // 匹配时性能消耗过高，交由worker后台处理
  const elIndexs = await calcEls(
    els.map((it) => it.nodeValue),
    materialList
  );

  // const els2 = els.filter((el) => {
  //   return materialList.some((it) => {
  //     // 处理多种情况，阻止将一个长单词分为多个
  //     const hasExist = forLowerCase(el.nodeValue).includes(
  //       forLowerCase(it.text)
  //     );
  //     return hasExist;
  //   });
  // });

  return elIndexs
    .map((i) => els[i])
    .filter((el) => {
      if (el.parentNode.nodeName === 'XMARKSUB') {
        return false;
      }
      return !(
        el.parentNode.nodeName === 'XMARK' && el.parentNode.dataset.marked
      );
    })
    .reduce((pre, curEl) => {
      // 一个元素内可能存在多个单词
      // 一个元素内可能存在，同一个单词出现多次，这时候如果第一次解析失败，react -> If you're using Preact or React.
      const materials = materialList.reduce((pre2, cur) => {
        const startIndex = forLowerCase(curEl.nodeValue).indexOf(
          forLowerCase(cur.text)
        );
        if (startIndex === -1) {
          return pre2;
        }

        // 检查单词是否重复出现在元素内
        let i = startIndex;
        let indexList = [i];

        while (i !== -1) {
          const index = forLowerCase(curEl.nodeValue)
            .slice(i + cur.text.length)
            .indexOf(forLowerCase(cur.text));
          if (index === -1) {
            i = -1;
          } else {
            i = i + cur.text.length + index;
            indexList.push(i);
          }
        }

        return [
          ...pre2,
          ...indexList.map((it) => ({
            ...cur,
            startIndex: it,
          })),
        ];
      }, []);

      if (!materials.length) {
        return pre;
      }

      // 先排序，按先后排序
      materials.sort((a, b) => {
        if (a.startIndex === b.startIndex) {
          // 存在覆盖叠加的情况， abc abcde，展示比较长的那个
          return b.text.length - a.text.length;
        }
        return a.startIndex - b.startIndex;
      });

      // 每次切割完需要更改节点，基于下一个去做切割，暂时不考虑特殊情况
      let nowEl = curEl;
      let resultNodes = [];
      let preMate = {};
      materials.forEach((it) => {
        const hanldeEl = (start) => {
          if (start === -1) {
            // 存在首尾相连的情况，第二个不展示
            return false;
          }
          // 防止将完整单词从中间切割
          const regex = /[A-Za-z]/;

          if (regex.test(nowEl.nodeValue[start - 1] || '')) {
            return false;
          }
          if (regex.test(nowEl.nodeValue[start + it.text.length] || '')) {
            return false;
          }

          nowEl.splitText(start);
          const passedNode = nowEl.nextSibling;
          passedNode.splitText(it.text.length);
          // 切割完毕
          resultNodes.push({ node: passedNode, material: it });
          nowEl = passedNode.nextSibling;
          return true;
        };

        // 特殊情况处理，Preact or React.
        if (preMate.text === it.text && !preMate.isCut) {
          const index = forLowerCase(nowEl.nodeValue)
            .slice(preMate.start + it.text.length)
            .indexOf(forLowerCase(it.text));

          if (index === -1) {
            return;
          }

          preMate = {
            text: it.text,
            isCut: hanldeEl(preMate.start + it.text.length + index),
            start: index,
          };
          return;
        }

        let start = forLowerCase(nowEl.nodeValue).indexOf(
          forLowerCase(it.text)
        );

        preMate = {
          text: it.text,
          isCut: hanldeEl(start),
          start,
        };
      });

      return [...pre, ...resultNodes];
    }, []);
};

const handleHighlighter = (nodes, hasZhNote) => {
  nodes.forEach((it) => {
    const markWrap = document.createElement('xmark');
    markWrap.appendChild(it.node.cloneNode(false));

    if (hasZhNote) {
      markWrap.setAttribute('style', 'position: relative;');
      const t = document.createElement('xmarksub');
      t.innerText = it.material.translation;
      t.setAttribute(
        'style',
        'position: absolute;left: 3px; top: -8px;color: #f00; user-select: none;font-size:12px;white-space: nowrap;'
      );
      t.classList.add('notranslate');
      markWrap.appendChild(t);
    }

    it.node.parentNode.replaceChild(markWrap, it.node);
    markWrap.classList.add('bluesea', 'gloab-xmark', 'notranslate');
    markWrap.setAttribute(`data-text`, it.material.text);
    markWrap.setAttribute(`data-marked`, true);

    let clearTime = null;
    let time2 = null;
    // 处理为悬停超过0.5s然后就显示
    markWrap.addEventListener('mouseenter', () => {
      clearTimeout(clearTime);

      time2 = setTimeout(() => {
        const tipRoot = axTip.render(markWrap.getBoundingClientRect(), {
          isExist: true,
          text: it.material.text,
          onCancelMark: () => {
            document
              .querySelectorAll(`xmark[data-marked="true"]`)
              .forEach((el) => {
                const text = document.createTextNode(el.innerText);
                const p = el.parentNode;
                p.replaceChild(text, el);
                p.normalize();
              });
            axTip.clear();
          },
        });

        tipRoot.addEventListener('mouseenter', () => {
          clearTimeout(clearTime);
        });
        tipRoot.addEventListener('mouseleave', () => {
          axTip.clear();
        });
      }, 400); // 后续设置为可配置
    });
    markWrap.addEventListener('mouseleave', (e) => {
      clearTimeout(time2);
      clearTime = setTimeout(() => {
        axTip.clear();
      }, 400);
    });
  });
};

const debounce = (fn) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
    }, 1000);
  };
};

const handleStatistics = debounce(async () => {
  const nodes = document.querySelectorAll(`xmark[data-marked="true"]`);
  const kList = [...nodes].reduce((pre, cur) => {
    const text = cur.dataset.text;
    const obj = pre.find((it) => it.text === text);
    if (obj) {
      obj.count += 1;
      return pre;
    } else {
      return [...pre, { text, count: 1 }];
    }
  }, []);

  const l = await bluesea.getMaterials();
  const today = dayjs().format('YYYY-MM-DD');
  l.forEach((it) => {
    const statistic = kList.find((it2) => it2.text === it.text);
    if (!statistic) {
      return;
    }

    if (!it.statistics) {
      it.statistics = {};
    }
    if (!it.statistics[today]) {
      it.statistics[today] = {};
    }
    // 计算最高的那次
    const oldCount = it.statistics[today][location.href] || 0;
    it.statistics[today][location.href] =
      oldCount > statistic.count ? oldCount : statistic.count;
  });
  materialsDB.set(l);
});

class Highlighter {
  targetList = [];
  config = {};

  async render() {
    this.targetList = await bluesea.getMaterials();
    const nodes = await forReadyNodes(this.targetList);
    handleHighlighter(nodes, this.config['中文注解']);
    handleStatistics();
  }
  clear() {
    const nodes = document.querySelectorAll(`xmark[data-marked="true"]`);
    nodes.forEach((el) => {
      const text = document.createTextNode(el.dataset.text);
      const p = el.parentNode;
      p.replaceChild(text, el);
      p.normalize();
    });
  }

  async initData() {
    this.targetList = await bluesea.getMaterials();
    this.config = await bluesea.getConfig();
  }

  watch() {
    this.watchTimer = setInterval(async () => {
      this.render();
    }, 2 * 1000);

    // const config = { attributes: true, childList: true, subtree: true };
    // this.observer = new MutationObserver((mutations, observer) => {
    //   // 大部分应用自身导致的变更，后续单独创建容器用于处理
    //   const isInYTL = mutations.every((it) => {
    //     const a = isYTL(it.target);
    //     const b = isYTL(it.previousSibling);
    //     const c = [...it.addedNodes].every((el) => isYTL(el));
    //     return a || b || c;
    //   });
    //   if (isInYTL) {
    //     return;
    //   }
    //   this.observer.disconnect();
    //   this.render();
    //   this.observer.observe(document, config);
    // });
    // this.observer.observe(document, config);
    // chrome.storage.onChanged.addListener(this.onMaterialListChange);
  }
  // onMaterialListChange = (changes, namespace) => {
  //   if (namespace === 'local' && changes['materials']) {
  //     if (this.observer) {
  //       const value = changes['materials'].newValue;
  //       this.targetList = value;
  //       this.observer.disconnect();
  //       this.render();
  //       const config = { attributes: true, childList: true, subtree: true };
  //       this.observer.observe(document, config);
  //     }
  //   }
  // };
  stopWatch() {
    // chrome.storage.onChanged.removeListener(this.onMaterialListChange);
    // this.observer.disconnect();
    clearInterval(this.watchTimer);
    this.clear();
  }
}

const highlighter = new Highlighter();

document.addEventListener('DOMContentLoaded', () => {

  funCtrl.run(
    '划词高亮域名黑名单',
    async () => {
      await highlighter.initData();
      highlighter.render();
      highlighter.watch();
    },
    () => {
      highlighter.stopWatch();
    }
  );
});
