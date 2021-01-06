import React, { useRef, useEffect, useState } from 'react';
import { bluesea } from '../logic';
import { Button, Switch, InputNumber, Input, message } from 'antd';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

export const RowOptions = ({ rowKey, children }) => {
  let config = bluesea.useConfig();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        height: '42px',
        lineHeight: '42px',
        padding: '0 12px',
      }}
    >
      <div style={{ flex: '1', color: '#333' }}>{rowKey}</div>
      {children ? (
        children
      ) : (
        <Switch
          checked={config && config[rowKey]}
          onChange={async (flag) => {
            const c = await bluesea.getConfig();
            const newConfig = {
              ...c,
              [rowKey]: flag,
            };
            bluesea.setConfig(newConfig);
          }}
        />
      )}
    </div>
  );
};

export const ModalBlack = ({ config, visible, onClose: close }) => {
  const blackStr = useRef('');
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    if (visible) {
      blackStr.current = JSON.stringify(config, null, '\t');
      setRenderKey((pre) => pre + 1);
    }
  }, [visible, config]);

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
          width: 300,
          marginTop: 64,
          background: '#f4f5f7',
          zIndex: 25,
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: 1, padding: '0 8px', color: '#999' }}>
            黑名单
          </span>
          <Button
            type="link"
            size="small"
            danger
            onClick={async () => {
              console.time('清空')
              await bluesea.clearMaterials()
              message.success('操作成功！');
              console.timeEnd('清空')
            }}
          >
            清空单词与句子
          </Button>
          <Button
            type="link"
            size="small"
            onClick={async () => {
              await bluesea.resetConfig();
              const c = await bluesea.getConfig();
              editor.current.setValue(JSON.stringify(c, null, '\t'));
              setTimeout(() => {
                message.success('操作成功！');
              }, 200);
            }}
          >
            初始化
          </Button>
          <Button
            type="link"
            size="small"
            onClick={async () => {
              try {
                const l = JSON.parse(blackStr.current);
                const c = await bluesea.getConfig();
                const newConfig = {
                  ...c,
                  黑名单: l,
                };
                bluesea.setConfig(newConfig);
                message.success('操作成功！');
                close();
              } catch (e) {
                message.error('操作失败！请重试');
              }
            }}
          >
            更新
          </Button>
        </div>
        <CodeMirror
          key={renderKey}
          value={blackStr.current}
          options={{
            mode: { name: 'javascript' },
            // lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            blackStr.current = value;
          }}
        />
      </div>
    </div>
  );
};
