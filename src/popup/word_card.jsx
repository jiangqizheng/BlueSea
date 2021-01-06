import React from 'react';

const forPhonetic = (text) => {
  if (!text) {
    return '';
  }
  return text.split(';')[0].split(',')[0];
};

const row = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  color: '#999',
};

export const WordCard = ({ tfData }) => {
  return (
    <div
      className="notranslate"
      style={{
        position: 'relative',
        fontSize: '14px',
        color: '#222',
        padding: '12px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: '1', padding: '4px' }}>
        <div style={row}>
          <div
            style={{ fontSize: '14px', fontWeight: 'bold', color: '#3E8AF3' }}
          >
            {tfData.returnPhrase ? tfData.returnPhrase[0] : tfData.query}
          </div>
          <img
            src="./imgs/btn-voice.png"
            style={{
              width: '14px',
              height: '14px',
              marginLeft: '6px',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              var audioBlock = document.createElement('audio');
              audioBlock.setAttribute(
                'src',
                `https://dict.youdao.com/dictvoice?audio=${tfData.query}`
              );
              audioBlock.play();
              audioBlock.addEventListener('ended', () => {});
            }}
          />
        </div>

        <div>
          {tfData.basic && tfData.basic['uk-phonetic'] ? (
            <div style={{ ...row, color: '#3E8AF3' }}>
              <span>
                <span>英</span>
                <span style={{ marginLeft: 2 }}>
                  [{forPhonetic(tfData.basic['uk-phonetic'])}]
                </span>
              </span>
              <span style={{ marginLeft: 8 }}>
                <span>美</span>
                <span style={{ marginLeft: 2 }}>
                  [{forPhonetic(tfData.basic['us-phonetic'])}]
                </span>
              </span>
            </div>
          ) : (
            ''
          )}
          <div style={{ height: 4 }}></div>
          {tfData.basic
            ? tfData.basic.explains.map((it) => {
                return (
                  <div style={row} key={it}>
                    {it}
                  </div>
                );
              })
            : tfData.translation.map((it) => {
                return (
                  <div style={row} key={it}>
                    {it}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};
