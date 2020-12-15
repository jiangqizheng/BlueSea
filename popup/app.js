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
  const [tabKey, setTableKey] = useState(TabItemMap.Material.key);

  const menus = [
    { label: '查词', key: TabItemMap.Search.key },
    { label: '词库', key: TabItemMap.Material.key },
    { label: '配置', key: TabItemMap.Setting.key },
  ];

  return html`
    <div
      style=${{
        fontSize: 12,
        width: 330,
        background: '#f1f1f1',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div style="height: 400px">
        <${TabItemMap[tabKey].Component} />
      </div>
      <div
        style=${{
          borderTop: '1px solid #f1f1f1',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        ${menus.map((it, index) => {
          const color = it.key === tabKey ? '#0070f3' : 'initial';
          return html`
            <div
              style="flex: 1; padding: 8px; cursor: pointer; text-align: center; color: ${color}"
              onClick=${() => {
                setTableKey(it.key);
              }}
            >
              ${it.label}
            </div>
          `;
        })}
      </div>
    </div>
  `;
};

render(html`<${App} />`, document.body);
