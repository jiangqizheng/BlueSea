import { render, unmountComponentAtNode } from 'react-dom';
import React, { useEffect, useState, useRef } from 'react';

const Arrow = ({ isTop }) => {
  const base = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%) rotate(45deg)',
    width: '10px',
    height: '10px',
  };

  base[isTop ? 'top' : 'bottom'] = -2;

  return (
    <React.Fragment>
      <div
        style={{
          ...base,
          background: '#f5f5d5',
          border: '3px solid #444',
          boxSizing: 'content-box',
          zIndex: -1,
        }}
      ></div>
      <div
        style={{
          ...base,
          border: '5px solid #f5f5d5',
          borderLeft: '5px solid rgba(0,0,0,0)',
          borderTop: '5px solid rgba(0,0,0,0)',
          zIndex: 1,
        }}
      ></div>
    </React.Fragment>
  );
};

class Tip {
  constructor() {}
  render({ root, component, ...props }) {
    const rect = root.getBoundingClientRect();

    const App = () => {
      return React.cloneElement(component, {
        ...props,
        clear: (name) => {
          this.clear(name || props.name);
        },
      });
    };
    const rootEl = this.forRootEl(props.name);
    render(
      <React.Fragment>
        <App />
        <Arrow isTop={rect.top < 150} />
      </React.Fragment>,
      rootEl
    );

    this.setPos(rootEl, rect);
    return rootEl;
  }
  clear(name) {
    const boxWraps = document.querySelectorAll(`.${name}`);
    boxWraps.forEach((it) => {
      unmountComponentAtNode(it);
      document.documentElement.removeChild(it);
    });
  }
  forRootEl(name) {
    const rootEl = document.createElement('div');
    rootEl.classList.add('bluesea', name);
    rootEl.style.position = 'absolute';
    rootEl.style.zIndex = 2147483646;
    rootEl.style.userSelect = 'none';

    return rootEl;
  }
  setPos(boxWrap, rangeRect) {
    // 设定位置
    document.documentElement.appendChild(boxWrap);

    const containerWidth = boxWrap.offsetWidth;
    const rangeWidth = rangeRect.right - rangeRect.left;
    const left = rangeRect.left + window.pageXOffset;
    const top = rangeRect.top + window.pageYOffset;
    let containerLeft = left - (containerWidth - rangeWidth) / 2;

    if (containerLeft < window.pageXOffset) {
      containerLeft = window.pageXOffset;
    } else if (
      containerLeft + containerWidth >
      window.pageXOffset + document.documentElement.clientWidth
    ) {
      containerLeft =
        window.pageXOffset +
        document.documentElement.clientWidth -
        containerWidth;
    }

    var clientHeight = 0;
    clientHeight =
      document.documentElement.clientHeight > document.body.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight;
    if (clientHeight === 0) {
      clientHeight = document.documentElement.clientHeight;
    }

    let pos;
    if (rangeRect.top >= 150) {
      const bottom = clientHeight - top + 10;
      pos = {
        left: containerLeft,
        bottom: bottom,
      };
    } else {
      pos = {
        left: containerLeft,
        top: top + rangeRect.height + 12,
      };
    }

    boxWrap.style.left = pos.left + 'px';
    // 设置箭头
    if (pos.bottom) {
      boxWrap.style.bottom = pos.bottom + 'px';
    }
    if (pos.top) {
      boxWrap.style.top = pos.top + 'px';
    }
  }
}

export const tip = new Tip();
export * from './translation';
