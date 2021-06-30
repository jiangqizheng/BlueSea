import React, { useState } from 'react';

const l = Array.from({ length: 1 }, (v, k) => ({ text: k, isTmp: true }));
const wh = 382;
const h = 42;

export const Vlist = ({ source, children }) => {
  let list = source;
  let defaultIndex = 1;
  // if (source.length > Math.ceil(wh / h)) {
    list = [...l, ...source];
    defaultIndex = 1;
  // }

  const [si, setSI] = useState(defaultIndex);

  const forData = (startIndex = 0) => {
    const bufferSize = 20;
    const visibleCount = Math.ceil(wh / h) + bufferSize;
    const endIndex = visibleCount + startIndex;

    return {
      visibleItems: list.slice(startIndex, endIndex),
      startOffset: startIndex * h,
      endOffset: (list.length - endIndex) * h,
    };
  };

  const forSi = (scrollTop) => {
    const i = Math.ceil(scrollTop / h);
    setSI(i);
  };

  const { visibleItems, startOffset, endOffset } = forData(si);

  const wrap = React.useRef();

  React.useEffect(() => {
    if (wrap) {
      wrap.current.addEventListener('scroll', (e) => {
        const scrollTop = wrap.current.scrollTop;
        forSi(scrollTop);
      });
    }
  }, [wrap, si]);

  return (
    <div
      ref={wrap}
      className="word-list"
      style={{
        height: wh,
        overflowY: 'scroll',
        background: '#fff',
        margin: '0px',
        borderRadius: '6px',
      }}
    >
      <div
        style={{
          paddingTop: startOffset,
          paddingBottom: endOffset,
          transform: `translateY(-${defaultIndex * h}px)`,
        }}
      >
        {children(visibleItems)}
      </div>
    </div>
  );
};
