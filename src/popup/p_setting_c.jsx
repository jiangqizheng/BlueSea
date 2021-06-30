import React, { useRef, useEffect, useState } from 'react';
import { Button, Switch, message } from 'antd';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import { fnConfig } from '../fnConfig';

export const RowOptions = ({ rowKey, children }) => {
  const { rt: fnConfigx } = fnConfig.useX();

  console.log('rowKey', rowKey);

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
      <div style={{ flex: '1', color: '#333' }}>
        {fnConfig[`${rowKey}_desc`] || rowKey}
      </div>
      {children ? (
        children
      ) : (
        <Switch
          checked={fnConfigx[rowKey]}
          onChange={async (flag) => {
            fnConfig[rowKey] = flag;
          }}
        />
      )}
    </div>
  );
};

export const ModalRawConfig = ({ config, visible, onClose: close }) => {
  const configStr = useRef('');
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    if (visible) {
      configStr.current = JSON.stringify(config, null, '\t');
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
            禁用站点列表
          </span>

          <Button
            type="link"
            size="small"
            onClick={async () => {
              try {
                const l = JSON.parse(configStr.current);
                fnConfig.domainBlackList = l;
                message.success('操作成功！');
                setTimeout(() => {
                  close();
                }, 200);
              } catch (e) {
                message.error('操作失败！请重试');
              }
            }}
          >
            更新
          </Button>
          <Button
            type="link"
            size="small"
            onClick={async () => {
              close();
            }}
          >
            关闭
          </Button>
        </div>
        <CodeMirror
          key={renderKey}
          value={configStr.current}
          options={{
            mode: { name: 'javascript' },
            // lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            configStr.current = value;
          }}
        />
      </div>
    </div>
  );
};
