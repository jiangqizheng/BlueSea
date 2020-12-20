const forPhonetic = (text) => {
  if (!text) {
    return '';
  }
  return text.split(';')[0].split(',')[0];
};

const TfCard = ({ tfData }) => {
  return html`<div class="card notranslate">
    <div style="flex: 1;padding: 8px;">
      <div class="card-row">
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
          onClick=${(e) => {
             e.stopPropagation()
            var audioBlock = document.createElement('audio');
            audioBlock.setAttribute(
              'src',
              `https://dict.youdao.com/dictvoice?audio=${tfData.query}`
            );
            audioBlock.play();
            audioBlock.addEventListener('ended', function () {
              // console.log('声音播放完了');
            });
          }}
        >
          <path
            d="M552.96 152.064v719.872c0 16.11776-12.6976 29.184-28.3648 29.184a67.4816 67.4816 0 0 1-48.39424-20.64384l-146.8416-151.12192A74.5472 74.5472 0 0 0 275.8656 706.56h-25.3952C146.08384 706.56 61.44 619.45856 61.44 512s84.64384-194.56 189.0304-194.56h25.3952c20.0704 0 39.30112-8.192 53.47328-22.79424l146.8416-151.1424A67.4816 67.4816 0 0 1 524.61568 122.88C540.2624 122.88 552.96 135.94624 552.96 152.064z m216.96512 101.5808a39.936 39.936 0 0 1 0-57.42592 42.25024 42.25024 0 0 1 58.7776 0c178.4832 174.40768 178.4832 457.15456 0 631.56224a42.25024 42.25024 0 0 1-58.7776 0 39.936 39.936 0 0 1 0-57.40544 359.50592 359.50592 0 0 0 0-516.75136z m-103.38304 120.23808a39.7312 39.7312 0 0 1 0-55.23456 37.51936 37.51936 0 0 1 53.94432 0c104.30464 106.78272 104.30464 279.92064 0 386.70336a37.51936 37.51936 0 0 1-53.94432 0 39.7312 39.7312 0 0 1 0-55.23456c74.48576-76.288 74.48576-199.94624 0-276.23424z"
            p-id="1941"
            fill="#666"
          ></path>
        </svg>
      </div>

      <div class="flex: 1">
        <!-- 英标 -->
        ${tfData.basic && tfData.basic['uk-phonetic']
          ? html` <div>
              <div class="card-row">
                <span>英</span
                ><span style="color: #f00; margin-left: 2px"
                  >[${forPhonetic(tfData.basic['uk-phonetic'])}]</span
                >
              </div>
              <div class="card-row">
                <span>美</span
                ><span style="color: #f00; margin-left: 2px"
                  >[${forPhonetic(tfData.basic['us-phonetic'])}]</span
                >
              </div>
            </div>`
          : ''}
        <div style="height: 4px;"></div>
        ${tfData.basic
          ? tfData.basic.explains.map((it) => {
              return html`<div class="card-row">${it}</div>`;
            })
          : tfData.translation.map((it) => {
              return html`<div class="card-row">${it}</div>`;
            })}
      </div>
    </div>

    <style>
      .card {
        position: relative;
        font-size: 14px;
        color: #222;
        padding: 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .card-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
    </style>
  </div>`;
};