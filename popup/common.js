const forPhonetic = (text) => {
  if (!text) {
    return '';
  }
  return text.split(';')[0].split(',')[0];
};

const TfCard = ({ tfData }) => {
  return html`<div class="card notranslate">
    <div style="flex: 1;padding: 4px;">
      <div class="card-row">
        <div style="font-size: 14px;font-weight: bold;color: #3E8AF3">
          ${tfData.returnPhrase ? tfData.returnPhrase[0] : tfData.query}
        </div>
        <img
          src="./imgs/btn-voice.png"
          style="width: 14px;height: 14px;margin-left: 6px;cursor: pointer;"
          onClick=${(e) => {
            e.stopPropagation();
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
        />
      </div>

      <div class="flex: 1">
        <!-- 英标 -->
        ${tfData.basic && tfData.basic['uk-phonetic']
          ? html` <div>
              <div class="card-row" style="color: #3E8AF3">
                <span>英</span
                ><span style="margin-left: 2px"
                  >[${forPhonetic(tfData.basic['uk-phonetic'])}]</span
                >
              </div>
              <div class="card-row" style="color: #3E8AF3">
                <span>美</span
                ><span style="margin-left: 2px"
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
        padding: 12px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .card-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: #999;
      }
    </style>
  </div>`;
};
