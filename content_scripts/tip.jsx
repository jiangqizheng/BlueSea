// 注册html组件
document.addEventListener('DOMContentLoaded', () => {
  fetch(chrome.runtime.getURL('content_scripts/d-loading.html'))
    .then((raw) => raw.text())
    .then((res) => {
      let fragment = document.createElement('div');
      fragment.innerHTML = res;
      class DLoading extends HTMLElement {
        constructor() {
          super();
          var shadow = this.attachShadow({ mode: 'closed' });
          var content = fragment.childNodes[0].content.cloneNode(true);
          shadow.appendChild(content);
        }
      }
      window.customElements.define('d-loading', DLoading);
    });
});

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
      if (ableTranslation) {
        chrome.runtime.sendMessage(
          { type: 'tf', payload: options.text },
          (r) => {
            setTfData(r);
          }
        );
      }
    }, [ableTranslation]);

    const config = bluesea.useConfig();

    if (!ableTranslation) {
      return html`<div
        style="
      position: relative;
      border-radius: 4px;
      font-size: 14px;
      color: #222;
      box-sizing: border-box;
      min-height: 130px;
    "
      >
        <div
          style="position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: ${isBottom ? '0' : 'initial'};
        width: 36px;
        height: 24px;
        line-height: 24px;
        background: #f5f5d5;
        text-align: center;
        cursor: pointer;
        border-radius: 2px;
        border: 1px solid #444;"
          onClick=${() => {
            setAbleTranslation(true);
          }}
        >
          译
        </div>
        <div
          style="position: absolute;
        z-index: -1;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        bottom: ${isBottom && '-4px'};
        top: ${!isBottom && '-4px'};
        width: 20px;
        height: 20px;
        background: #f5f5d5;
        border: 1px solid #444;"
        ></div>
      </div>`;
    }

    if (!tfData || !config) {
      return html`<div
        style="
        position: relative;
        background: #f5f5d5;
        border-radius: 4px;
        font-size: 14px;
        color: #222;
        border: 1px solid #444;
        box-sizing: border-box;
        min-height: 130px;
      "
      >
        <d-loading />
        <div
          style="position: absolute;
          z-index: -1;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          bottom: ${isBottom && '-4px'};
          top: ${!isBottom && '-4px'};
          width: 20px;
          height: 20px;
          background: #f5f5d5;
          border: 1px solid #444;"
        ></div>
      </div>`;
    }

    return html`<div class="bluesea-tip notranslate" translate="no">
      ${isOneWord
        ? config['自动发音']
          ? html`<audio
              src="https://dict.youdao.com/dictvoice?audio=${tfData.query}"
              ref=${audioRef}
              autoplay="true"
            ></audio>`
          : html`<audio
              src="https://dict.youdao.com/dictvoice?audio=${tfData.query}"
              ref=${audioRef}
              preload="true"
            ></audio>`
        : ''}
      <!-- <d-loading /> -->
      <div style="flex: 1;padding: 8px;">
        ${isOneWord
          ? html`<div class="bluesea-tip-row">
              <div style="font-size: 18px;font-weight: bold;">
                ${tfData.returnPhrase ? tfData.returnPhrase[0] : tfData.query}
              </div>
              <svg
                style="margin-left: 4px;margin-bottom: -3px;cursor: pointer;"
                t="1606215479613"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1940"
                width="16"
                height="16"
                onClick=${() => {
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
            </div>`
          : ''}

        <div class="flex: 1">
          <!-- 英标 -->
          ${tfData.basic && tfData.basic['uk-phonetic']
            ? html` <div class="bluesea-tip-row">
                <span>
                  <span>英</span
                  ><span style="color: #f00; margin-left: 2px"
                    >[${forPhonetic(tfData.basic['uk-phonetic'])}]</span
                  ></span
                >
                <span style="margin-left: 8px;">
                  <span>美</span
                  ><span style="color: #f00; margin-left: 2px"
                    >[${forPhonetic(tfData.basic['us-phonetic'])}]</span
                  ></span
                >
              </div>`
            : ''}

          <!-- 分割 -->
          <div style="height: 4px;"></div>
          <!-- 翻译，分为是否单词 -->
          ${tfData.basic
            ? tfData.basic.explains.map((it) => {
                return html`<div class="bluesea-tip-row">${it}</div>`;
              })
            : tfData.translation.map((it) => {
                return html`<div class="bluesea-tip-row">${it}</div>`;
              })}
        </div>
      </div>

      ${options.isExist
        ? html`<div class="bluesea-tip-row">
            <div style="flex:1"></div>
            <div class="bluesea-tip-btn-wrap">
              <div
                class="bluesea-tip-btn"
                style="color: #888; cursor: not-allowed; "
              >
                编辑
              </div>
            </div>
          </div>`
        : html`<div class="bluesea-tip-row">
            <div style="flex:1"></div>
            <div class="bluesea-tip-btn-wrap">
              <div
                class="bluesea-tip-btn"
                style="color: #888; cursor: not-allowed; "
              >
                编辑
              </div>
              <div
                style="
                  width: 1px;
                  height: 16px;
                  background: #666;
                  "
              ></div>
              <div
                style=${{
                  color: !isOneWord && '#888',
                  cursor: !isOneWord && 'not-allowed',
                }}
                class="bluesea-tip-btn"
                onclick=${() => {
                  if (isOneWord) {
                    options.onMark(tfData);
                  }
                }}
              >
                收藏
              </div>
            </div>
          </div>`}

      <div
        style="position: absolute;
          z-index: -1;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          bottom: ${isBottom && '-4px'};
          top: ${!isBottom && '-4px'};
          width: 20px;
          height: 20px;
          background: #f5f5d5;
          border: 1px solid #444;"
      ></div>
      <style>
        .bluesea-tip {
          position: relative;
          background: #f5f5d5;
          border-radius: 4px;
          font-size: 14px;
          color: #222;
          border: 1px solid #444;
          box-sizing: border-box;
          min-height: 130px;
          display: flex;
          flex-direction: column;
        }
        .bluesea-tip > * {
          font-size: 14px;
          box-sizing: border-box;
        }
        .bluesea-tip-row {
          display: flex;
          align-items: center;
        }
        .bluesea-tip-btn-wrap {
          display: flex;
          align-items: center;
          display: flex;
          align-items: center;
          border-radius: 4px;
        }
        .bluesea-tip-btn {
          flex: 1;
          text-align: center;
          cursor: pointer;
          padding: 6px 8px;
          transition: 200ms all;
        }
        /* 覆盖chrome翻译的默认小按钮 */
        #gtx-trans {
          z-index: 2147483646;
        }
      </style>
    </div>`;
  };

  const result = render(html`<${App} />`, root);
  return result;
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
    tipRoot.style.zIndex = 2147483647;
    tipRoot.style.userSelect = 'none';

    makeTipEl(tipRoot, props, rect.top >= 150);

    setPos(tipRoot, rect);

    return tipRoot;
  }
  clear() {
    const boxWraps = document.querySelectorAll(`.${this.wrapName}`);
    boxWraps.forEach((it) => {
      document.documentElement.removeChild(it);
    });
  }
}

window.AxTip = AxTip;

const axTip = new window.AxTip();
const selectedAxTip = new window.AxTip('bluesea-selected-box-wrap');
