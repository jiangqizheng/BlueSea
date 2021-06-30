import React, { useEffect, useState, useRef } from 'react';
import { axAnalysis } from '../analysis';
import { materialStore } from '../../store';
import { fnConfig } from '../../fnConfig';
import { Input, Button } from 'antd';

const forPhonetic = (text) => {
  if (!text) {
    return '';
  }
  return text.split(';')[0].split(',')[0];
};

const Icon = ({ onClick }) => {
  return (
    <svg
      style={{
        marginLeft: '4px',
        marginBottom: '-3px',
        cursor: 'pointer',
      }}
      t="1606215479613"
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1940"
      width="16"
      height="16"
      onClick={onClick}
    >
      <path
        d="M552.96 152.064v719.872c0 16.11776-12.6976 29.184-28.3648 29.184a67.4816 67.4816 0 0 1-48.39424-20.64384l-146.8416-151.12192A74.5472 74.5472 0 0 0 275.8656 706.56h-25.3952C146.08384 706.56 61.44 619.45856 61.44 512s84.64384-194.56 189.0304-194.56h25.3952c20.0704 0 39.30112-8.192 53.47328-22.79424l146.8416-151.1424A67.4816 67.4816 0 0 1 524.61568 122.88C540.2624 122.88 552.96 135.94624 552.96 152.064z m216.96512 101.5808a39.936 39.936 0 0 1 0-57.42592 42.25024 42.25024 0 0 1 58.7776 0c178.4832 174.40768 178.4832 457.15456 0 631.56224a42.25024 42.25024 0 0 1-58.7776 0 39.936 39.936 0 0 1 0-57.40544 359.50592 359.50592 0 0 0 0-516.75136z m-103.38304 120.23808a39.7312 39.7312 0 0 1 0-55.23456 37.51936 37.51936 0 0 1 53.94432 0c104.30464 106.78272 104.30464 279.92064 0 386.70336a37.51936 37.51936 0 0 1-53.94432 0 39.7312 39.7312 0 0 1 0-55.23456c74.48576-76.288 74.48576-199.94624 0-276.23424z"
        p-id="1941"
        fill="#666"
      ></path>
    </svg>
  );
};

export const Translation = (props) => {
  // 仅单词时发音
  const isOneWord = props.text.split(' ').length === 1;

  const audioRef = useRef();
  const [tfData, setTfData] = useState(null);
  const [showTranslation, setShowtranslation] = useState(isOneWord);

  const [editing, setEditing] = useState(false);

  const textareaRef = useRef();

  useEffect(() => {
    if (showTranslation) {
      materialStore.query(props.text).then((rt) => {
        setTfData(rt);
      });
    }
  }, [showTranslation]);

  if (!showTranslation) {
    return (
      <div
        style={{
          position: 'relative',
          borderRadius: '2px',
          fontSize: '14px',
          color: '#222',
          boxSizing: 'border-box',
          minHeight: '130px',
          width: 250,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '36px',
            height: '26px',
            lineHeight: '26px',
            background: '#f5f5d5',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '2px',
            border: '1px solid #444',
            // bottom: 'initial',
            bottom: 0,
            // bottom: isBottom ? '0' : 'initial',
          }}
          onClick={() => {
            setShowtranslation(true);
          }}
        >
          译
        </div>
      </div>
    );
  }

  if (!tfData) {
    return (
      <div
        style={{
          position: 'relative',
          background: '#f5f5d5',
          borderRadius: '2px',
          fontSize: '14px',
          color: '#222',
          border: '1px solid #444',
          boxSizing: 'border-box',
          minHeight: '130px',
          width: 250,
        }}
      >
        <d-loading />
      </div>
    );
  }

  if (tfData.dict) {
    if (editing) {
      return (
        <div
          className="bluesea-tip notranslate"
          translate="no"
          style={{ width: 250 }}
        >
          <audio
            src={`https://dict.youdao.com/dictvoice?audio=${tfData.text}`}
            ref={audioRef}
            {...(fnConfig.autoSpeech
              ? { autoPlay: true }
              : { preload: 'true' })}
            autoPlay={true}
          ></audio>

          <div
            style={{
              flex: '1',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="bluesea-tip-row">
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {tfData.text}
              </div>
              <Icon
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.play();
                  }
                }}
              />
            </div>

            {tfData.dict.phonetic && (
              <div className="bluesea-tip-row">
                <span>
                  <span>英</span>
                  <span style={{ color: '#f00', marginLeft: '2px' }}>
                    [{tfData.dict.phonetic}]
                  </span>
                </span>
              </div>
            )}
            <div style={{ height: 4 }}></div>
            <div
              className="bluesea-tip-row bluesea-tip-editable"
              style={{ cursor: 'text', flex: 1 }}
            >
              <textarea
                ref={textareaRef}
                style={{ width: '100%' }}
                defaultValue={tfData.translation}
              />
            </div>
          </div>

          <div className="bluesea-tip-row">
            <div style={{ flex: '1' }}></div>
            <div className="bluesea-tip-btn-wrap">
              <div
                className="bluesea-tip-btn"
                onClick={async () => {
                  const translation = textareaRef.current.value;
                  setTfData({ ...tfData, translation });
                  await materialStore.addAndUpdate({
                    id: props.id,
                    text: props.text,
                    comment: translation,
                  });
                  setEditing(false);
                }}
              >
                更新
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 翻译单词
    return (
      <div
        className="bluesea-tip notranslate"
        translate="no"
        style={{ width: 250 }}
      >
        <audio
          src={`https://dict.youdao.com/dictvoice?audio=${tfData.text}`}
          ref={audioRef}
          {...(fnConfig.autoSpeech ? { autoPlay: true } : { preload: 'true' })}
          autoPlay={true}
        ></audio>

        <div
          style={{
            flex: '1',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="bluesea-tip-row">
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {tfData.text}
            </div>
            <Icon
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.play();
                }
              }}
            />
          </div>

          {tfData.dict.phonetic && (
            <div className="bluesea-tip-row">
              <span>
                <span>英</span>
                <span style={{ color: '#f00', marginLeft: '2px' }}>
                  [{tfData.dict.phonetic}]
                </span>
              </span>
            </div>
          )}
          <div style={{ height: 4 }}></div>
          <div
            className="bluesea-tip-row bluesea-tip-editable"
            style={{ cursor: 'text', flex: 1 }}
            onClick={() => {
              setEditing(true);
              setTimeout(() => {
                textareaRef.current.focus({ cursor: 'end' });
              }, 100);
            }}
          >
            {tfData.translation}
          </div>
        </div>

        {props.id ? (
          <div className="bluesea-tip-row">
            <div style={{ flex: '1' }}></div>
            <div className="bluesea-tip-btn-wrap">
              <div
                className="bluesea-tip-btn"
                onClick={async () => {
                  console.log('123');
                  // axAnalysis.render({
                  //   text: props.text,
                  //   translation: tfData.translation[0],
                  // });
                  //处理为归档，通常情况下不做删除
                  // wordStore.delOne({ id: props.id, text: props.text });
                  console.log(props.id);
                  await materialStore.del(props.id);
                  props.clear();
                }}
              >
                归档
              </div>
            </div>
          </div>
        ) : (
          <div className="bluesea-tip-row">
            <div style={{ flex: '1' }}></div>
            <div className="bluesea-tip-btn-wrap">
              <div
                className="bluesea-tip-btn"
                style={{ color: '#888', cursor: 'not-allowed' }}
                onClick={() => {
                  // axAnalysis.render({
                  //   text: props.text,
                  //   // translation: tfData.translation[0],
                  // });
                }}
              >
                解析
              </div>
              <div
                style={{ width: '1px', height: '16px', background: '#666' }}
              ></div>
              <div
                style={{
                  color: !isOneWord && '#888',
                  cursor: !isOneWord && 'not-allowed',
                }}
                className="bluesea-tip-btn"
                onClick={async () => {
                  if (isOneWord) {
                    const id = await materialStore.add(props.text);
                    props.clear();
                  }
                }}
              >
                收藏
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 翻译句子
  return (
    <div
      className="bluesea-tip notranslate"
      translate="no"
      style={{ width: 250 }}
    >
      <div style={{ flex: '1', padding: '8px' }}>
        <div className="bluesea-tip-row">{tfData.translation}</div>
      </div>

      {props.id ? (
        <div className="bluesea-tip-row">
          <div style={{ flex: '1' }}></div>
          <div className="bluesea-tip-btn-wrap">
            <div
              className="bluesea-tip-btn"
              onClick={async () => {
                console.log(props.id);
                await materialStore.del(props.id);
                props.clear();
              }}
            >
              归档
            </div>
          </div>
        </div>
      ) : (
        <div className="bluesea-tip-row">
          <div style={{ flex: '1' }}></div>
          <div className="bluesea-tip-btn-wrap">
            <div
              className="bluesea-tip-btn"
              style={{ color: '#888', cursor: 'not-allowed' }}
              onClick={() => {}}
            >
              解析
            </div>
            <div
              style={{ width: '1px', height: '16px', background: '#666' }}
            ></div>
            <div
              style={{
                color: !isOneWord && '#888',
                cursor: !isOneWord && 'not-allowed',
              }}
              className="bluesea-tip-btn"
              onClick={() => {
                if (isOneWord) {
                  materialStore.add(props.text);
                  props.clear();
                }
              }}
            >
              收藏
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
