import React, { useRef, useEffect, useState } from 'react';
import { WordCard } from './word_card.jsx';
import { bluesea } from '../logic';

export const PageSearch = () => {
  const { list } = bluesea.useMaterialsMate();

  const [text, setText] = useState('');
  const [material, setMaterial] = useState(null);

  const options = list
    .filter((it) => {
      if (!text) {
        return false;
      }
      return it.text.startsWith(text);
    })
    .slice(0, 8);

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <div>
        <input
          className="search-input"
          placeholder="输入单词或文字"
          value={text}
          onInput={(e) => {
            setText(e.target.value);
            setMaterial(null);
          }}
        />
      </div>
      {!material && (
        <div
          style={{
            background: '#fff',
            width: '240px',
            margin: '0 auto',
            marginTop: '16px',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {options.length === 0 && text && (
            <div className="search-tip">暂无数据...</div>
          )}
          {options.length === 0 && !text && (
            <div className="search-tip">目前仅支持对已收藏单词进行检索</div>
          )}
          {options.map((it) => (
            <div
              className="search-item"
              onClick={() => {
                setMaterial(it);
                setText(it.text);
              }}
            >
              <span
                style={{
                  fontWeight: 'bold',
                  color: '#3E8AF3',
                }}
              >
                {it.text}
              </span>
              <span
                style={{
                  marginLeft: '12px',
                  color: '#999',
                }}
              >
                {it.translation}
              </span>
            </div>
          ))}
        </div>
      )}
      {material && (
        <div
          style={{
            width: '240px',
            margin: '0 auto',
            marginTop: '16px',
            minHeight: '100px',
            borderRadius: '4px',
            background: '#fff',
          }}
        >
          <WordCard tfData={material.youdao} />
        </div>
      )}
    </div>
  );
};
