import { render, unmountComponentAtNode } from 'react-dom';
import React, { useEffect, useState } from 'react';
import { Displacy } from './analysis_displacy';
import iconClose from './icon-close.png';
import {noio} from '../io'

function makeAnalysisEl(root, options) {
  const App = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
      noio.nlp(options.text, {auto: false}).then((rt) => {
        setData(rt)
      })
    }, []);

    if (!data) {
      return <d-loading />;
    }

    return (
      <React.Fragment>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            position: 'relative',
            width: '90%',
            margin: '0 auto',
            marginTop: 120,
            background: '#f1f1f1',
            // textAlign: 'center',
            borderRadius: '8px',
            padding: 16,
          }}
        >
          <img
            src={iconClose}
            style={{
              position: 'absolute',
              right: 4,
              top: 4,
              width: 40,
              height: 40,
              cursor: 'pointer',
            }}
            onClick={() => {
              axAnalysis.clear();
            }}
          />
          <div
            style={{
              minHeight: 200,
              overflowX: 'auto',
              background: '#272822',
              textAlign: 'center',
              borderRadius: '8px',
            }}
          >
            <Displacy parse={data} />
          </div>
          <div
            style={{
              marginTop: 8,
              height: 60,
              lineHeight: '60px',
              overflowX: 'auto',
              background: '#272822',
              textAlign: 'center',
              borderRadius: '8px',
              padding: '0 16px',
              color: '#fff',
              fontSize: '18px',
              whiteSpace: 'nowrap',
            }}
          >
            {options.translation}
          </div>
        </div>
      </React.Fragment>
    );
  };

  render(<App />, root);
}

class AxAnalysis {
  constructor(wrapName) {
    this.wrapName = wrapName || 'bluesea-analysis-wrap';
  }
  render(props) {
    const root = document.createElement('div');
    root.classList.add('bluesea', this.wrapName);
    document.documentElement.appendChild(root);
    makeAnalysisEl(root, props);
    return root;
  }
  clear() {
    const boxWraps = document.querySelectorAll(`.${this.wrapName}`);
    boxWraps.forEach((it) => {
      unmountComponentAtNode(it);
      document.documentElement.removeChild(it);
    });
  }
}

export const axAnalysis = new AxAnalysis();

// document.addEventListener('DOMContentLoaded', () => {
//   chrome.runtime.sendMessage({ type: 'nlp', payload: 'hello world' }, (r) => {
//     console.log('x', r)
//   });
// });
