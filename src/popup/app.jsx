import React, { useState } from 'react';
import { PageSearch } from './p_search.jsx';
import { PageSetting } from './p_setting.jsx';
import { PageMaterial } from './p_material.jsx'

const TabItemMap = {
  Search: {
    key: 'Search',
    Component: PageSearch,
  },
  Material: {
    key: 'Material',
    Component: PageMaterial,
  },
  Sentence: {
    key: 'Sentence',
    Component: () => '开发中...',
  },
  Setting: {
    key: 'Setting',
    Component: PageSetting,
  },
};

export const App = () => {
  const [tabKey, setTableKey] = useState(TabItemMap.Material.key);

  const menus = [
    {
      label: '查询',
      key: TabItemMap.Search.key,
      icons: ['/imgs/tab-search-off.png', '/imgs/tab-search-on.png'],
    },
    {
      label: '单词',
      key: TabItemMap.Material.key,
      icons: ['/imgs/tab-library-off.png', '/imgs/tab-library-on.png'],
    },
    {
      label: '句子',
      key: TabItemMap.Sentence.key,
      icons: ['/imgs/tab-library-off.png', '/imgs/tab-library-on.png'],
    },
    {
      label: '配置',
      key: TabItemMap.Setting.key,
      icons: ['/imgs/tab-me-off.png', '/imgs/tab-me-on.png'],
    },
  ];

  const C = TabItemMap[tabKey].Component;

  return (
    <div
      style={{
        fontSize: '12px',
        width: 375,
        background: '#f5f5f5 url(/imgs/bg.png) no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div style={{ height: 480 }}>
        <C />
      </div>

      <div
        style={{
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          height: 48,
        }}
      >
        {menus.map((it) => {
          const isActived = it.key === tabKey;
          return (
            <div
              key={it.label}
              style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                color: isActived ? '#3E8AF3' : '#999',
              }}
              onClick={() => {
                setTableKey(it.key);
              }}
            >
              <img
                src={it.icons[Number(isActived)]}
                style={{
                  width: '14px',
                  height: '14px',
                  marginRight: '6px',
                }}
              />
              <span>{it.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
