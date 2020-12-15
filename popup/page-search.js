const Search = () => {
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

  return html`
    <div style="height: 400px; overflow-y: auto; box-sizing: border-box;">
      <div>
        <input
          class="search-input"
          placeholder="查词"
          value=${text}
          onInput=${(e) => {
            setText(e.target.value);
            setMaterial(null);
          }}
        />
      </div>
      ${!material &&
      html`
        <div
          style="
        background: #fff;
        width: 260px;
        margin: 0 auto;
        margin-top: 16px;
        border-radius: 4px;"
        >
          ${options.length === 0 &&
          text &&
          html`<div class="search-tip">暂无数据...</div>`}
          ${options.length === 0 &&
          !text &&
          html`<div class="search-tip">
            请在上方输入框中，输入英文进行数据检索。目前仅支持对已收藏单词进行检索。
          </div>`}
          ${options.map(
            (it) =>
              html`<div
                class="search-item"
                onClick=${() => {
                  setMaterial(it);
                  setText(it.text);
                }}
              >
                ${it.text}: ${it.translation}
              </div>`
          )}
        </div>
      `}
      ${material &&
      html`<div
        style="
        width: 260px;
        margin: 0 auto;
        margin-top: 16px;
        min-height: 100px;
        border-radius: 4px;
        background: #fff;"
      >
        <${TfCard} tfData=${material.youdao} />
      </div>`}
    </div>
  `;
};
