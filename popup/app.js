const TabItemMap = {
  Search: {
    key: 'Search',
    Component: Search,
  },
  Material: {
    key: 'Material',
    Component: Material,
  },
  Setting: {
    key: 'Setting',
    Component: Setting,
  },
};

const App = () => {
  const [tabKey, setTableKey] = useState(TabItemMap.Setting.key);

  const menus = [
    {
      label: '查词',
      key: TabItemMap.Search.key,
      icons: ['./imgs/tab-search-off.png', './imgs/tab-search-on.png'],
    },
    {
      label: '词库',
      key: TabItemMap.Material.key,
      icons: ['./imgs/tab-library-off.png', './imgs/tab-library-on.png'],
    },
    {
      label: '配置',
      key: TabItemMap.Setting.key,
      icons: ['./imgs/tab-me-off.png', './imgs/tab-me-on.png'],
    },
  ];

  return html`
    <div
      style=${{
        fontSize: '12px',
        width: 375,
        background: '#f5f5f5 url(./imgs/bg.png) no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div style="height: 480px">
        <${TabItemMap[tabKey].Component} />
      </div>

      <div
        style=${{
          // borderTop: '1px solid #d8d8d8',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          height: 48,
        }}
      >
        ${menus.map((it) => {
          const isActived = it.key === tabKey;
          return html`
            <div
              style="flex: 1;display: flex;align-items: center;justify-content: center;padding: 8px; cursor: pointer; text-align: center; color: ${isActived
                ? '#3E8AF3'
                : '#999'}"
              onClick=${() => {
                setTableKey(it.key);
              }}
            >
              <img
                src=${it.icons[Number(isActived)]}
                style="width: 14px; height: 14px; margin-right: 6px;"
              />
              <span> ${it.label} </span>
            </div>
          `;
        })}
      </div>
    </div>
  `;
};

render(html`<${App} />`, document.body);
