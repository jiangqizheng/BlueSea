const Btns = ({ value, onChange }) => {
  const activeStyle = {
    background: '#61bd4f',
    color: '#fff',
  };

  let style1 = {};
  let style2 = {};
  if (value) {
    style1 = activeStyle;
  } else {
    style2 = activeStyle;
  }
  return html`
    <div
      style=${{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="btn_hover"
        style=${{
          flex: 1,
          padding: '2px 4px',
          cursor: 'pointer',
          userSelect: 'none',
          borderRadius: 2,
          ...style1,
        }}
        onClick=${() => {
          onChange(true);
        }}
      >
        启动
      </div>
      <div style=${{ padding: 2 }}></div>
      <div
        className="btn_hover"
        style=${{
          flex: 1,
          padding: '2px 4px',
          cursor: 'pointer',
          userSelect: 'none',
          borderRadius: 2,
          ...style2,
        }}
        onClick=${() => {
          onChange(false);
        }}
      >
        关闭
      </div>
    </div>
  `;
};

const Setting = () => {
  const ref = useRef();
  const editor = useRef();
  let config = bluesea.useConfig();

  const url = bluesea.useTabUrl();
  let hostname = '';
  if (url) {
    hostname = new URL(url).hostname;
  }
  useEffect(() => {
    if (ref.current) {
      (async () => {
        const config = await bluesea.getConfig();
        editor.current = CodeMirror(ref.current, {
          lineNumbers: true,
          value: JSON.stringify(config, null, '\t'),
          mode: 'javascript',
        });
      })();
    }
  }, [ref]);

  useEffect(() => {
    (async () => {
      const c = await bluesea.getConfig();
      editor.current.setValue(JSON.stringify(c, null, '\t'));
    })();
  }, [config]);


  config = config || {}

  return html`<div
    style="padding-bottom: 16px;height: 400px;overflow-y: auto; box-sizing: border-box;"
  >
    <style>
      .CodeMirror {
        height: 300px;
        margin-right: 29px;
        margin-top: 16px;
      }
    </style>

    <div style="padding: 8px;">
      <span>基础功能启用</span>
      <span style="margin-left: 8px;color: #888">
        (快捷操作)
      </span>
    </div>
    <div
      style="display: flex;align-items: center; background: #fff; padding: 4px 8px; border-bottom: 1px solid #f1f1f1"
    >
      <div style="flex: 1">划词翻译</div>
      <${Btns}
        value=${config['划词翻译']}
        onChange=${async (flag) => {
          const c = await bluesea.getConfig();
          const newConfig = {
            ...c,
            ['划词翻译']: flag,
          };
          bluesea.setConfig(newConfig);
          editor.current.setValue(JSON.stringify(newConfig, null, '\t'));
        }}
      />
    </div>
    <div
      style="display: flex;align-items: center; background: #fff; padding:4px 8px; border-bottom: 1px solid #f1f1f1"
    >
      <div style="flex: 1">单词高亮</div>
      <${Btns}
        value=${config['单词高亮']}
        onChange=${async (flag) => {
          const c = await bluesea.getConfig();
          const newConfig = {
            ...c,
            ['单词高亮']: flag,
          };
          bluesea.setConfig(newConfig);
          editor.current.setValue(JSON.stringify(newConfig, null, '\t'));
        }}
      />
    </div>
    <div
      style="display: flex; align-items: center; background: #fff; padding: 4px 8px; "
    >
      <div style="flex: 1">单词弹幕</div>
      <${Btns}
        value=${config['单词弹幕']}
        onChange=${async (flag) => {
          const c = await bluesea.getConfig();
          const newConfig = {
            ...c,
            ['单词弹幕']: flag,
          };
          bluesea.setConfig(newConfig);
          editor.current.setValue(JSON.stringify(newConfig, null, '\t'));
        }}
      />
    </div>

    <div style="padding: 8px;">
      <span>是否在当前域名启用</span>
      <span style="margin-left: 8px;color: #888">
        (黑名单快捷操作)
      </span>
    </div>

    <div
      style="display: flex; align-items: center; background: #fff; padding: 4px 8px; "
    >
      <div style="flex: 1">${hostname}</div>
      <${Btns}
        value=${!((config || {})['黑名单'] || []).some((it) => it === hostname)}
        onChange=${async (flag) => {
          const c = await bluesea.getConfig();
          let list = [];
          if (flag) {
            list = c['黑名单'].filter((it) => it !== hostname);
          } else {
            list = Array.from(new Set([...config['黑名单'], hostname]));
          }
          const newConfig = {
            ...c,
            ['黑名单']: list,
          };
          bluesea.setConfig(newConfig);

          editor.current.setValue(JSON.stringify(newConfig, null, '\t'));
        }}
      />
    </div>

    <div style="padding: 8px;margin-top: 32px;">
      <span>配置文件</span>
      <span
        style="color: #1890ff; margin-left: 8px; cursor: pointer"
        onClick=${async () => {
          await bluesea.resetConfig();
          const c = await bluesea.getConfig();
          editor.current.setValue(JSON.stringify(c, null, '\t'));
          setTimeout(() => {
            alert('重置成功');
          }, 200);
        }}
        >重置为初始配置</span
      >
      <span
        style="color: #1890ff; margin-left: 8px; cursor: pointer"
        onClick=${async () => {
          try {
            const c = JSON.parse(editor.current.getValue());
            await bluesea.setConfig(c);
            alert('更新配置成功');
          } catch (e) {
            alert(`更新配置异常, 即将恢复原配置: ${e.toString()}`);
            const c = await bluesea.getConfig();
            editor.current.setValue(JSON.stringify(c, null, '\t'));
          }
        }}
        >更新并保存</span
      >
    </div>
    <small style="color: #aaa; margin-left: 8px">
      更新配置后，需要刷新页面
    </small>

    <div ref=${ref}></div>

    <div
      style="color: #f00; margin: 0 auto; margin-top: 32px; cursor: pointer; text-align: center;border: 1px solid #f00;padding: 4px; width: 120px; "
      onClick=${async () => {
        await materialsDB.set([]);
        alert('完成清空');
      }}
    >
      清空单词列表
    </div>
  </div>`;
};
