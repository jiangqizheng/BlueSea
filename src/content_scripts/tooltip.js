import { render, unmountComponentAtNode } from 'react-dom';
import React, { useEffect, useState, useRef } from 'react';
import { axAnalysis } from './analysis';
// import { wordStore, materialStore } from '../store';
import { fnConfig } from '../fnConfig';

function setPos(boxWrap, rangeRect) {
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

const forPhonetic = (text) => {
  if (!text) {
    return '';
  }
  return text.split(';')[0].split(',')[0];
};

function makeTipEl(root, options, isBottom) {
  const App = () => {
    // 仅单词时发音
    const isOneWord = options.text.split(' ').length === 1;

    const audioRef = useRef();
    const [tfData, setTfData] = useState(null);
    const [ableTranslation, setAbleTranslation] = useState(isOneWord);

    useEffect(() => {
      // chrome.runtime.sendMessage(
      //   { type: 'audio', payload: options.text },
      //   (r) => {
      //     const audio = new Audio('data:audio/wav;base64,UklGRhwMAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0Ya4LAACAgICAgICAgICAgICAgICAgICAgICAgICAf3hxeH+AfXZ1eHx6dnR5fYGFgoOKi42aloubq6GOjI2Op7ythXJ0eYF5aV1AOFFib32HmZSHhpCalIiYi4SRkZaLfnhxaWptb21qaWBea2BRYmZTVmFgWFNXVVVhaGdbYGhZbXh1gXZ1goeIlot1k6yxtKaOkaWhq7KonKCZoaCjoKWuqqmurK6ztrO7tbTAvru/vb68vbW6vLGqsLOfm5yal5KKhoyBeHt2dXBnbmljVlJWUEBBPDw9Mi4zKRwhIBYaGRQcHBURGB0XFxwhGxocJSstMjg6PTc6PUxVV1lWV2JqaXN0coCHhIyPjpOenqWppK6xu72yxMu9us7Pw83Wy9nY29ve6OPr6uvs6ezu6ejk6erm3uPj3dbT1sjBzdDFuMHAt7m1r7W6qaCupJOTkpWPgHqAd3JrbGlnY1peX1hTUk9PTFRKR0RFQkRBRUVEQkdBPjs9Pzo6NT04Njs+PTxAPzo/Ojk6PEA5PUJAQD04PkRCREZLUk1KT1BRUVdXU1VRV1tZV1xgXltcXF9hXl9eY2VmZmlna3J0b3F3eHyBfX+JgIWJiouTlZCTmpybnqSgnqyrqrO3srK2uL2/u7jAwMLFxsfEv8XLzcrIy83JzcrP0s3M0dTP0drY1dPR1dzc19za19XX2dnU1NjU0dXPzdHQy8rMysfGxMLBvLu3ta+sraeioJ2YlI+MioeFfX55cnJsaWVjXVlbVE5RTktHRUVAPDw3NC8uLyknKSIiJiUdHiEeGx4eHRwZHB8cHiAfHh8eHSEhISMoJyMnKisrLCszNy8yOTg9QEJFRUVITVFOTlJVWltaXmNfX2ZqZ21xb3R3eHqAhoeJkZKTlZmhpJ6kqKeur6yxtLW1trW4t6+us7axrbK2tLa6ury7u7u9u7vCwb+/vr7Ev7y9v8G8vby6vru4uLq+tri8ubi5t7W4uLW5uLKxs7G0tLGwt7Wvs7avr7O0tLW4trS4uLO1trW1trm1tLm0r7Kyr66wramsqaKlp52bmpeWl5KQkImEhIB8fXh3eHJrbW5mYGNcWFhUUE1LRENDQUI9ODcxLy8vMCsqLCgoKCgpKScoKCYoKygpKyssLi0sLi0uMDIwMTIuLzQ0Njg4Njc8ODlBQ0A/RUdGSU5RUVFUV1pdXWFjZGdpbG1vcXJ2eXh6fICAgIWIio2OkJGSlJWanJqbnZ2cn6Kkp6enq62srbCysrO1uLy4uL+/vL7CwMHAvb/Cvbq9vLm5uba2t7Sysq+urqyqqaalpqShoJ+enZuamZqXlZWTkpGSkpCNjpCMioqLioiHhoeGhYSGg4GDhoKDg4GBg4GBgoGBgoOChISChISChIWDg4WEgoSEgYODgYGCgYGAgICAgX99f398fX18e3p6e3t7enp7fHx4e3x6e3x7fHx9fX59fn1+fX19fH19fnx9fn19fX18fHx7fHx6fH18fXx8fHx7fH1+fXx+f319fn19fn1+gH9+f4B/fn+AgICAgH+AgICAgIGAgICAgH9+f4B+f35+fn58e3t8e3p5eXh4d3Z1dHRzcXBvb21sbmxqaWhlZmVjYmFfX2BfXV1cXFxaWVlaWVlYV1hYV1hYWVhZWFlaWllbXFpbXV5fX15fYWJhYmNiYWJhYWJjZGVmZ2hqbG1ub3Fxc3V3dnd6e3t8e3x+f3+AgICAgoGBgoKDhISFh4aHiYqKi4uMjYyOj4+QkZKUlZWXmJmbm52enqCioqSlpqeoqaqrrK2ur7CxsrGys7O0tbW2tba3t7i3uLe4t7a3t7i3tre2tba1tLSzsrKysbCvrq2sq6qop6alo6OioJ+dnJqZmJeWlJKSkI+OjoyLioiIh4WEg4GBgH9+fXt6eXh3d3V0c3JxcG9ubWxsamppaWhnZmVlZGRjYmNiYWBhYGBfYF9fXl5fXl1dXVxdXF1dXF1cXF1cXF1dXV5dXV5fXl9eX19gYGFgYWJhYmFiY2NiY2RjZGNkZWRlZGVmZmVmZmVmZ2dmZ2hnaGhnaGloZ2hpaWhpamlqaWpqa2pra2xtbGxtbm1ubm5vcG9wcXBxcnFycnN0c3N0dXV2d3d4eHh5ent6e3x9fn5/f4CAgIGCg4SEhYaGh4iIiYqLi4uMjY2Oj5CQkZGSk5OUlJWWlpeYl5iZmZqbm5ybnJ2cnZ6en56fn6ChoKChoqGio6KjpKOko6SjpKWkpaSkpKSlpKWkpaSlpKSlpKOkpKOko6KioaKhoaCfoJ+enp2dnJybmpmZmJeXlpWUk5STkZGQj4+OjYyLioqJh4eGhYSEgoKBgIB/fn59fHt7enl5eHd3dnZ1dHRzc3JycXBxcG9vbm5tbWxrbGxraWppaWhpaGdnZ2dmZ2ZlZmVmZWRlZGVkY2RjZGNkZGRkZGRkZGRkZGRjZGRkY2RjZGNkZWRlZGVmZWZmZ2ZnZ2doaWhpaWpra2xsbW5tbm9ub29wcXFycnNzdHV1dXZ2d3d4eXl6enp7fHx9fX5+f4CAgIGAgYGCgoOEhISFhoWGhoeIh4iJiImKiYqLiouLjI2MjI2OjY6Pj46PkI+QkZCRkJGQkZGSkZKRkpGSkZGRkZKRkpKRkpGSkZKRkpGSkZKRkpGSkZCRkZCRkI+Qj5CPkI+Pjo+OjY6Njo2MjYyLjIuMi4qLioqJiomJiImIh4iHh4aHhoaFhoWFhIWEg4SDg4KDgoKBgoGAgYCBgICAgICAf4CAf39+f35/fn1+fX59fHx9fH18e3x7fHt6e3p7ent6e3p5enl6enl6eXp5eXl4eXh5eHl4eXh5eHl4eXh5eHh3eHh4d3h4d3h3d3h4d3l4eHd4d3h3eHd4d3h3eHh4eXh5eHl4eHl4eXh5enl6eXp5enl6eXp5ent6ent6e3x7fHx9fH18fX19fn1+fX5/fn9+f4B/gH+Af4CAgICAgIGAgYCBgoGCgYKCgoKDgoOEg4OEg4SFhIWEhYSFhoWGhYaHhoeHhoeGh4iHiIiHiImIiImKiYqJiYqJiouKi4qLiouKi4qLiouKi4qLiouKi4qLi4qLiouKi4qLiomJiomIiYiJiImIh4iIh4iHhoeGhYWGhYaFhIWEg4OEg4KDgoOCgYKBgIGAgICAgH+Af39+f359fn18fX19fHx8e3t6e3p7enl6eXp5enl6enl5eXh5eHh5eHl4eXh5eHl4eHd5eHd3eHl4d3h3eHd4d3h3eHh4d3h4d3h3d3h5eHl4eXh5eHl5eXp5enl6eXp7ent6e3p7e3t7fHt8e3x8fHx9fH1+fX59fn9+f35/gH+AgICAgICAgYGAgYKBgoGCgoKDgoOEg4SEhIWFhIWFhoWGhYaGhoaHhoeGh4aHhoeIh4iHiIeHiIeIh4iHiIeIiIiHiIeIh4iHiIiHiIeIh4iHiIeIh4eIh4eIh4aHh4aHhoeGh4aHhoWGhYaFhoWFhIWEhYSFhIWEhISDhIOEg4OCg4OCg4KDgYKCgYKCgYCBgIGAgYCBgICAgICAgICAf4B/f4B/gH+Af35/fn9+f35/fn1+fn19fn1+fX59fn19fX19fH18fXx9fH18fXx9fH18fXx8fHt8e3x7fHt8e3x7fHt8e3x7fHt8e3x7fHt8e3x7fHt8e3x8e3x7fHt8e3x7fHx8fXx9fH18fX5+fX59fn9+f35+f35/gH+Af4B/gICAgICAgICAgICAgYCBgIGAgIGAgYGBgoGCgYKBgoGCgYKBgoGCgoKDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KCgoGCgYKBgoGCgYKBgoGCgYKBgoGCgYKBgoGCgYKBgoGCgYKBgoGCgYKBgoGBgYCBgIGAgYCBgIGAgYCBgIGAgYCBgIGAgYCBgIGAgYCAgICBgIGAgYCBgIGAgYCBgIGAgYCBgExJU1RCAAAASU5GT0lDUkQMAAAAMjAwOC0wOS0yMQAASUVORwMAAAAgAAABSVNGVBYAAABTb255IFNvdW5kIEZvcmdlIDguMAAA')
      //     audio.play()
      //     console.log('x-audio', r);
      //   }
      // );

      if (ableTranslation) {
        // wordStore.getOne(options.text).then((rt) => {
        //   setTfData(rt);
        // });
        // noio.tf(options.text).then((rt) => {
        //   setTfData(rt);
        // });
      }
    }, [ableTranslation]);

    if (!ableTranslation) {
      return (
        <div
          style={{
            position: 'relative',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#222',
            boxSizing: 'border-box',
            minHeight: '130px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '36px',
              height: '24px',
              lineHeight: '24px',
              background: '#f5f5d5',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '2px',
              border: '1px solid #444',
              bottom: isBottom ? '0' : 'initial',
            }}
            onClick={() => {
              setAbleTranslation(true);
            }}
          >
            译
          </div>
          <div
            style={{
              bottom: isBottom && '-4px',
              top: !isBottom && '-4px',
              position: 'absolute',
              zIndex: '-1',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '20px',
              height: '20px',
              background: '#f5f5d5',
              border: '1px solid #444',
            }}
          ></div>
        </div>
      );
    }

    if (!tfData) {
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
            minHeight: '130px',
          }}
        >
          <d-loading />
          <div
            style={{
              position: 'absolute',
              zIndex: '-1',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '20px',
              height: '20px',
              background: '#f5f5d5',
              border: '1px solid #444',
              bottom: isBottom && '-4px',
              top: !isBottom && '-4px',
            }}
          ></div>
        </div>
      );
    }

    return (
      <div className="bluesea-tip notranslate" translate="no">
        {isOneWord ? (
          fnConfig.autoSpeech ? (
            <audio
              src={`https://dict.youdao.com/dictvoice?audio=${tfData.word}`}
              ref={audioRef}
              autoPlay={true}
            ></audio>
          ) : (
            <audio
              src={`https://dict.youdao.com/dictvoice?audio=${tfData.word}`}
              ref={audioRef}
              preload="true"
            ></audio>
          )
        ) : (
          ''
        )}
        <div style={{ flex: '1', padding: '8px' }}>
          {isOneWord ? (
            <div className="bluesea-tip-row">
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {tfData.word}
              </div>
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
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.play();
                  }
                }}
              >
                <path
                  d="M552.96 152.064v719.872c0 16.11776-12.6976 29.184-28.3648 29.184a67.4816 67.4816 0 0 1-48.39424-20.64384l-146.8416-151.12192A74.5472 74.5472 0 0 0 275.8656 706.56h-25.3952C146.08384 706.56 61.44 619.45856 61.44 512s84.64384-194.56 189.0304-194.56h25.3952c20.0704 0 39.30112-8.192 53.47328-22.79424l146.8416-151.1424A67.4816 67.4816 0 0 1 524.61568 122.88C540.2624 122.88 552.96 135.94624 552.96 152.064z m216.96512 101.5808a39.936 39.936 0 0 1 0-57.42592 42.25024 42.25024 0 0 1 58.7776 0c178.4832 174.40768 178.4832 457.15456 0 631.56224a42.25024 42.25024 0 0 1-58.7776 0 39.936 39.936 0 0 1 0-57.40544 359.50592 359.50592 0 0 0 0-516.75136z m-103.38304 120.23808a39.7312 39.7312 0 0 1 0-55.23456 37.51936 37.51936 0 0 1 53.94432 0c104.30464 106.78272 104.30464 279.92064 0 386.70336a37.51936 37.51936 0 0 1-53.94432 0 39.7312 39.7312 0 0 1 0-55.23456c74.48576-76.288 74.48576-199.94624 0-276.23424z"
                  p-id="1941"
                  fill="#666"
                ></path>
              </svg>
            </div>
          ) : (
            ''
          )}

          <div>
            <div className="bluesea-tip-row">
              <span>
                <span>英</span>
                <span style={{ color: '#f00', marginLeft: '2px' }}>
                  [{forPhonetic(tfData.phonetic)}]
                </span>
              </span>
            </div>
            <div style={{ height: 4 }}></div>
            <div className="bluesea-tip-row">{tfData.translation}</div>
          </div>
        </div>

        {options.wordId ? (
          <div className="bluesea-tip-row">
            <div style={{ flex: '1' }}></div>
            <div className="bluesea-tip-btn-wrap">
              <div
                className="bluesea-tip-btn"
                onClick={() => {
                  // axAnalysis.render({
                  //   text: options.text,
                  //   translation: tfData.translation[0],
                  // });
                  //处理为归档，通常情况下不做删除
                  // wordStore.delOne({ id: options.wordId, text: options.text });
                  axTip.clear();
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
                  axAnalysis.render({
                    text: options.text,
                    // translation: tfData.translation[0],
                  });
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
                onClick={() => {
                  if (isOneWord) {
                    // wordStore.addOne(options.text);
                    selectedAxTip.clear();
                  }
                }}
              >
                收藏
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            zIndex: '-1',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '20px',
            height: '20px',
            background: '#f5f5d5',
            border: '1px solid #444',
            bottom: isBottom && '-4px',
            top: !isBottom && '-4px',
          }}
        ></div>
      </div>
    );
  };

  render(<App />, root);
}

class AxTip {
  constructor(wrapName) {
    this.wrapName = wrapName || 'bluesea-box-wrap';
  }
  render(rect, props) {
    if (!rect.top && !rect.left) {
      return;
    }
    const tipRoot = document.createElement('div');
    tipRoot.classList.add('bluesea', this.wrapName);
    tipRoot.style.width = '250px';
    tipRoot.style.position = 'absolute';
    tipRoot.style.zIndex = 2147483646;
    tipRoot.style.userSelect = 'none';

    makeTipEl(tipRoot, props, rect.top >= 150);

    setPos(tipRoot, rect);

    return tipRoot;
  }
  clear() {
    const boxWraps = document.querySelectorAll(`.${this.wrapName}`);

    boxWraps.forEach((it) => {
      unmountComponentAtNode(it);
      document.documentElement.removeChild(it);
    });
  }
}

export const axTip = new AxTip();
export const selectedAxTip = new AxTip('bluesea-selected-box-wrap');
