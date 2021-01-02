// 实验功能版本
function makeAnalysisEl(root, options) {
  const App = () => {
    return html`<div>
      <div>123</div>

      <style>
        .bluesea-analysis-wrap {
          position: fixed;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background: rgba(0, 0, 0, 0.64);
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

class AxAnalysis {
  constructor(wrapName) {
    this.wrapName = wrapName || 'bluesea-analysis-wrap';
  }
  render(props) {
    const root = document.createElement('div');
    root.classList.add('bluesea', this.wrapName);
    document.body.appendChild(root);
    makeAnalysisEl(root, props);
    return root;
  }
  clear() {
    const boxWraps = document.querySelectorAll(`.${this.wrapName}`);
    boxWraps.forEach((it) => {
      document.documentElement.removeChild(it);
    });
  }
}

const axAnalysis = new AxAnalysis();

// document.addEventListener('DOMContentLoaded', () => {
//   axAnalysis.render();
// });
