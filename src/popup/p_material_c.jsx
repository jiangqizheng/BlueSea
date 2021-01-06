import React, { useState, useRef, useEffect } from 'react';
import { WordCard } from './word_card.jsx';
import { bluesea } from '../logic';
import dayjs from 'dayjs';

const formatDate = (minute) => {
  if (minute < 60) {
    return `${minute}分钟`;
  } else if (minute >= 60 && minute < 24 * 60) {
    return `${(minute / 60).toFixed(1)}小时`;
  } else if (minute >= 24 * 60) {
    return `${(minute / (24 * 60)).toFixed(1)}天`;
  } else {
    return '数据异常，请反馈';
  }
};

export const forLearnState = (it) => {
  let countdown = 'now';
  const nowDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
  if (nowDate < it.learn.learnDate) {
    //如果获取的差异为0，那么默认为1分钟，不存在0分钟的情况
    const diffMinute = dayjs().diff(it.learn.learnDate, 'minute') || 1;
    countdown = formatDate(Math.abs(diffMinute));
  }
  if (it.learn.done) {
    countdown = 'done';
  }
  return countdown;
};

const SuperCard = ({ material, needLearn }) => {
  const [isCardReverse, setIsCardReverse] = useState(false);

  return (
    <div
      style={{
        userSelect: 'none',
        flex: '1',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        perspective: '1000px',
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: '8px',
          width: '100%',
          height: '100%',
          margin: '0 auto',
          transition: 'all 240ms',
          transformStyle: 'preserve-3d',
          transform: isCardReverse ? 'rotateY(180deg)' : undefined,
        }}
      >
        <div className="r-card">
          <div
            style={{ background: '#fff', height: '160px', overflowY: 'auto' }}
          >
            <WordCard tfData={material.youdao} />
          </div>

          <img src="/imgs/icon-separate-long.png" style={{ width: '100%' }} />

          <div
            style={{
              background: '#fff',
              height: '160px',
              overflowY: 'auto',
              padding: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '3px 0px',
              }}
            >
              <div style={{ flex: '1', color: '#999' }}>收藏时间：</div>
              <div style={{ color: '#333' }}>{material.ctime}</div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '3px 0px',
              }}
            >
              <div style={{ flex: '1', color: '#999' }}>复习级别：</div>
              <div style={{ color: '#333' }}>{material.learn.level}</div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '3px 0px',
              }}
            >
              <div style={{ flex: '1', color: '#999' }}>复习时刻：</div>
              <div style={{ color: '#333' }}>{forLearnState(material)}</div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '3px 0px',
              }}
            >
              <div style={{ flex: '1', color: '#999' }}>累计词频：</div>
              <div style={{ color: '#333' }}>
                {bluesea.forStatisticAllCount(material)}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '3px 0px',
              }}
            >
              <div style={{ flex: '1', color: '#999' }}>来源：</div>
              <a
                href={material.addFrom}
                target="_blank"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {material.addFrom ? '点此跳转' : '未知来源'}
              </a>
            </div>

            <div
              onClick={() => {
                setIsCardReverse(true);
              }}
              style={{
                background: 'rgba(62, 138, 243, 0.06)',
                color: '#3e8af3',
                width: '192px',
                height: '32px',
                lineHeight: '32px',
                margin: '0 auto',
                textAlign: 'center',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '24px',
              }}
            >
              更多信息
            </div>
          </div>
        </div>

        <div
          className="r-card card_back"
          onClick={() => {
            setIsCardReverse(false);
          }}
        >
          开发中...
        </div>
      </div>
    </div>
  );
};

{
  /* ${needLearn && allowLearnOperation
          ? html` <div
              style="
                display: flex;
                align-items: center;
                padding: 8px 4px;"
            >
              <div
                style="
                  flex: 1;
                  text-align: center;
                  color: #fff;
                  border-radius: 4px;
                  padding: 8px;
                  cursor: pointer;
                  user-select: none;
                  background: #ff4d4f;"
                onClick=${async () => {
                  await bluesea.toLearnBack(material.text);
                  onClose();
                }}
              >
                不认识
              </div>
              <div style="width: 8px"></div>
              <div
                style="
                  flex: 1;
                  text-align: center;
                  color: #fff;
                  border-radius: 4px;
                  padding: 8px;
                  cursor: pointer;
                  user-select: none;
                  background: #61bd4f;"
                onClick=${async () => {
                  await bluesea.toLearnNext(material.text);
                  onClose();
                }}
              >
                认识
              </div>
            </div>`
          : ''} */
}

export const ModalLearnCard = ({
  visible,
  onClose,
  material,
  allowLearnOperation,
}) => {
  if (!visible) {
    return '';
  }

  const needLearn = dayjs().format('YYYY-MM-DD HH:mm:ss') > material.learn.learnDate;

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'rgba(0,0,0,0.64)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
      onClick={() => {
        onClose();
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          position: 'relative',
          width: 240,
          height: 320,
          marginTop: 64,
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SuperCard material={material} needLearn={needLearn} />
      </div>
    </div>
  );
};

export const ModalSortRules = ({ visible, onClose: close }) => {
  if (!visible) {
    return '';
  }

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'rgba(0,0,0,0.64)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
      onClick={() => {
        close();
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          position: 'relative',
          width: 240,
          marginTop: 64,
          background: '#f4f5f7',
          zIndex: 25,
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            height: '48px',
            padding: '0px 16px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div>排序选择</div>
          <div style={{ flex: 1 }}></div>
          <img
            src="./imgs/icon-close.png"
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            onClick={() => {
              close();
            }}
          />
        </div>
        {Object.entries(bluesea.constant.sortRule).map(([key, label]) => {
          return (
            <div
              key={key}
              className="hover-row"
              style={{
                height: '42px',
                lineHeight: '42px',
                padding: '0px 12px',
                userSelect: 'none',
              }}
              onClick={async () => {
                close(key);
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ModalExport = ({ visible, onClose: close, list }) => {
  if (!visible) {
    return '';
  }

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'rgba(0,0,0,0.64)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
      onClick={() => {
        close();
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          position: 'relative',
          width: 200,
          marginTop: 40,
          background: '#f4f5f7',
          zIndex: 25,
          padding: 16,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div
            className="btn"
            onClick={() => {
              const data = list.map((it) => it.text).join('\n');
              const fileBlob = new Blob([data], {
                type: 'text/plain',
              });
              var objectURL = window.URL.createObjectURL(fileBlob);
              const a = document.createElement('a');
              a.href = objectURL;
              a.download = 'word.txt';
              a.click();
              window.URL.revokeObjectURL(objectURL);
            }}
          >
            默认导出（.txt）
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div
            className="btn"
            onClick={() => {
              const data = JSON.stringify(list, null, '\t');
              const fileBlob = new Blob([data], {
                type: 'application/json',
              });
              var objectURL = window.URL.createObjectURL(fileBlob);
              const a = document.createElement('a');
              a.href = objectURL;
              a.download = 'word.json';
              a.click();
              window.URL.revokeObjectURL(objectURL);
            }}
          >
            原始数据导出（.json）
          </div>
        </div>
      </div>
    </div>
  );
};
