import { tip } from './tip';
import React, { useEffect, useState, useRef } from 'react';

// https://github.com/developit/htm

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
      root.parentNode.removeChild(root);
      continue;
    }

    result.push(root);
    if (root.childNodes.length) {
      dFSTraverse(root.childNodes, result);
    }
  }
  return result;
};

const debounce = (fn) => {
  let timer;
  return (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(e);
    }, 30);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const readme = document.querySelector('#readme');
  dFSTraverse([readme]);

  const paragraphs = readme.innerText
    .split('\n')
    .filter((it) => it.split(' ').length > 5);

  const paragraphsMap = paragraphs.map((it, index) => ({
    text: it,
    id: index,
  }));

  console.log(paragraphsMap);

  const forEl = debounce((e) => {
    // console.log('client', e.clientX, e.clientY);
    const selectEl = document.elementFromPoint(e.clientX, e.clientY);

    const paragraph = paragraphsMap.find((it) =>
      it.text.includes(selectEl.innerText.trim())
    );

    if (!paragraph) {
      return;
    }

    // 误差值90%,获取到主段落

    const forTargetEl = (el, deep = 0) => {
      let elText = el.innerText.trim();
      const x = elText.split(' ').length / paragraph.text.split(' ').length;
      if (x > 0.9) {
        return el;
      } else {
        if (deep > 5) {
          return null;
        }
        return forTargetEl(el.parentNode, deep + 1);
      }
    };

    const el = forTargetEl(selectEl);

    if (!el || el.classList.contains('svo')) {
      return;
    }

    console.log('paragraph', paragraph);
    const original = el.innerHTML;
    let htmlText = el.innerHTML;

    const nlp = forNLP()[paragraph.id];

    if (nlp.length === 0) {
      return;
    }

    nlp.forEach((n) => {
      // 每项
      n.forEach((text, i) => {
        if (i !== 1) {
          return;
        }

        let x = text.replace('!', '');
        if (text === `!are`) {
          x = `aren't`;
        }

        // const svoMode = ['S', 'V', 'O'][i];
        const reg = RegExp(`([^\/|^\.]|^)\\b${x}\\b`, 'g');
        // <span style="position: absolute;right: 0px; bottom:1em;color: #f00; user-select: none;font-size:14px;white-space: nowrap;">${svoMode}</span>
        htmlText = htmlText.replace(
          reg,
          `$1<span style="color: #f00;position: relative;">${x}</span>`
        );
      });
    });

    el.innerHTML = htmlText;
    el.classList.add('svo');

    const E = () => {
      return (
        <div
          style={{
            position: 'relative',
            background: '#f5f5d5',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#222',
            border: '1px solid #444',
            boxSizing: 'border-box',
            padding: 4,
          }}
        >
          {nlp.map((it, i) => {
            const l = it.map((text, i) => {
              // const svoMode = ['S', 'V', 'O'][i];
              const bgs = ['rgb(57, 136, 255)', '#f5222d', 'rgb(57, 136, 255)'];
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    padding: '0px 8px',
                    marginRight: 8,
                    boxShadow: 'rgba(0, 0, 0, 0.3) 1px 1px 3px',
                    borderRadius: '3px',
                    color: '#fff',
                    background: bgs[i],
                  }}
                >
                  {text}
                </span>
              );
            });
            return (
              <div key={i} style={{ padding: 4 }}>
                {l}
              </div>
            );
          })}
        </div>
      );
    };

    tip.render({
      root: el,
      component: <E />,
      name: 'bluesea-selection-x',
    });

    // console.log(document.querySelector(`.sovid-${id}`));
    // setTimeout(() => {

    const mouseleaveF = () => {
      // setTimeout(() => {
      console.log('text', paragraph.id);
      el.innerHTML = original;
      el.classList.remove('svo');
      el.removeEventListener('mouseleave', mouseleaveF);
      tip.clear('bluesea-selection-x');
      // }, 2000);
    };

    el.addEventListener('mouseleave', mouseleaveF);

    // const mouseenterF = () => {
    // console.log('text', paragraph.id);
    // el.innerHTML = original;
    // el.classList.remove('svo');
    // el.removeEventListener('mouseleave', mouseenterF);
    // toolTip.clear();
    // };
    // el.addEventListener('mouseenter', f);
    // document
    //   .querySelector(`.sovid-${id}`)
    //   .addEventListener('mouseleave', () => {
    //     console.log(998);
    //   });
    // }, 200);

    // const f = () => () => {
    //   console.log('123')
    //   el.innerHTML = original
    //   el.classList.remove('svo');
    //   // el.removeEventListener('mouseleave', f);
    // };

    // console.log('el', el)
    // el.parentNode.addEventListener('mouseleave', f);

    // 后续向上找到最匹配的元素
    // console.log(el.innerText)
  });
  document.addEventListener('mousemove', forEl);
});

function forNLP() {
  return [
    [],
    [],
    [['It', 'uses', 'standard JavaScript Tagged Templates']],
    [['🐣 < 600 bytes', 'used']],
    [['( thanks 🌈 )', 'gzip']],
    [
      ['🏅 bytes', 'compiled'],
      ['🏅 bytes', 'using', 'plugin htm'],
    ],
    [],
    [
      ['you', 'write'],
      ['The syntax', 'using', 'HTM'],
    ],
    [['Components : of )', 'is']],
    [],
    [
      ['you', 'get'],
      ['some ergonomic features', '!are'],
    ],
    [['html', 'lit']],
    [],
    [['build tool', 'needed']],
    [
      ['you', 'using', 'Preact'],
      ['we', 'included', 'off bindings'],
      ['They', 'have', 'the benefit of'],
      ['the benefit of', 'added'],
      ['the benefit of', 'sharing', 'a template cache'],
    ],
    [
      ['we', 'tell', 'it'],
      ['You', 'bind'],
      ['This function', 'return', 'anything'],
    ],
    [['an example function', 'returns', 'tree nodes']],
    [['we', 'create', 'our own tag function']],
    [
      ['an template tag', 'have', 'we'],
      ['objects in the format', 'produce', 'an template tag'],
      ['objects in', 'produce', 'an template tag'],
      ['we', 'created'],
    ],
    [],
    [['the template', 'has', 'multiple element at the root level']],
    [
      ['build template strings ,', 'means'],
      ['it', 'return', 'the same Javascript object'],
      ['you', '!want', 'this behaviour'],
      ['you', 'have', 'three options'],
    ],
    [],
    [
      ['your function ,', 'disables', 'caching of elements'],
      ['elements', 'created'],
    ],
    [],
    [
      ['it all', 'looks'],
      ['a app', 'working'],
    ],
    [
      ['there', "!'s", 'build'],
      ['there', "'s", 'tooling'],
      ['You', 'edit', 'it'],
    ],
    [],
    [
      ['we', 'using', 'the prebuilt Preact integration'],
      ['it', "'s"],
    ],
    [['The same example', 'works']],
    [
      ['it', 'use', 'you'],
      ['JSX', 'use', 'you'],
    ],
    [['Webpack configuration via : details', '!do', 'this']],
    [['A full app', 'using', 'HTM Rendering']],
    [],
    [
      ['a wrapper around', 'felt'],
      ['I', 'use', 'Virtual DOM'],
      ['I', 'wanted'],
    ],
    [
      ['the closest alternative', 'was', 'Tagged Templates'],
      ['I', 'wrote', 'this library'],
      ['The technique', 'turns'],
      ['it', 'work'],
      ['any library', 'works'],
    ],
    [],
  ];
}
