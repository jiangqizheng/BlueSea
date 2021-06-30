import './notranslate';
export const env_coderun = 'content_scripts';
window.env_coderun = env_coderun;

// 注册html组件
document.addEventListener('DOMContentLoaded', () => {
  fetch(chrome.runtime.getURL('d-loading.htm'))
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
