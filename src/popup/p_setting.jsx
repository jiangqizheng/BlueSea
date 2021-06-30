import React, { useRef, useEffect, useState } from 'react';
import { bluesea } from '../logic';
import { Button, Switch, InputNumber, Input } from 'antd';
import { RowOptions, ModalRawConfig } from './p_setting_c';
import { userStore } from '../store';
import { fnConfig } from '../fnConfig';

export const PageSetting = () => {
  const [visibleModalBlack, setVisibleModalBlack] = useState(false);
  const { rt: userInfo } = userStore.useX();

  const url = bluesea.useTabUrl();
  let hostname = '';
  if (url) {
    hostname = new URL(url).hostname;
  }

  const { rt: conf } = fnConfig.useX();

  console.log(conf);

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        padding: '18px',
      }}
    >
      <ModalRawConfig
        config={fnConfig.domainBlackList}
        visible={visibleModalBlack}
        onClose={() => {
          setVisibleModalBlack(false);
        }}
      />
      <div
        style={{
          height: '66px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '6px',
        }}
      >
        <img
          src="./imgs/icon-member-ordinary.png"
          style={{ width: '42px', height: '42px', marginLeft: '12px' }}
        />

        <div style={{ marginLeft: '16px' }}>
          <div>
            {userInfo.nickname}（{userInfo.uid}）
          </div>
          <div style={{ color: '#999', marginTop: '4px' }}>
            {userInfo.email || (
              <a
                href="#"
                onClick={() => {
                  chrome.tabs.create({
                    url: 'http://127.0.0.1:8090/bind-email',
                  });
                }}
              >
                未绑定邮箱
              </a>
            )}
          </div>
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ padding: 12 }}>
          <a
            href="#"
            onClick={() => {
              chrome.tabs.create({
                url: 'http://127.0.0.1:8090/login',
              });
            }}
          >
            切换账号
          </a>
        </div>
      </div>

      <div
        style={{
          background: '#191D26',
          color: '#fff',
          // height: '48px',
          // lineHeight: '48px',
          padding: 18,
          borderRadius: '6px',
          marginTop: '18px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>积分：123</div>
        <div>积分中心</div>
      </div>

      <div style={{ marginTop: '18px', color: '#999' }}>基础功能</div>

      <div style={{ marginTop: '12px' }}>
        <RowOptions rowKey={fnConfig.translation_key} />
        <RowOptions rowKey={fnConfig.highlight_key} />
        <RowOptions rowKey={fnConfig.bullets_key} />
        {/* <RowOptions rowKey="聊天弹幕" /> */}
      </div>

      <div style={{ marginTop: '18px', color: '#999' }}>
        <span>在当前站点禁用</span>
        <span
          style={{ color: '#1890ff', marginLeft: 8, cursor: 'pointer' }}
          onClick={() => {
            setVisibleModalBlack(true);
          }}
        >
          其他
        </span>
      </div>
      <div style={{ marginTop: '12px' }}>
        <RowOptions rowKey={hostname}>
          <Switch
            checked={fnConfig.domainBlackList.some((it) => it === hostname)}
            onChange={async (flag) => {
              if (flag) {
                fnConfig.domainBlackList = [
                  ...fnConfig.domainBlackList,
                  hostname,
                ];
              } else {
                fnConfig.domainBlackList = fnConfig.domainBlackList.filter(
                  (it) => it !== hostname
                );
              }
            }}
          />
        </RowOptions>
      </div>

      <div style={{ marginTop: '18px', color: '#999' }}>
        <span>更多</span>
      </div>

      <div style={{ marginTop: '12px' }}>
        <RowOptions rowKey={fnConfig.annotation_key} />
        <RowOptions rowKey={fnConfig.autoSpeech_key} />
        <RowOptions rowKey={fnConfig.bulletsMax_key}>
          <InputNumber
            style={{ width: 60 }}
            min={1}
            max={100}
            value={conf.bulletsMax}
            onChange={(val) => {
              fnConfig.bulletsMax = val;
            }}
          />
        </RowOptions>
        <RowOptions rowKey={fnConfig.bulletsSpeed_key}>
          <InputNumber
            style={{ width: 60 }}
            min={1}
            max={100}
            value={conf.bulletsSpeed}
            onChange={(val) => {
              fnConfig.bulletsSpeed = val;
            }}
          />
        </RowOptions>
        {/* <RowOptions rowKey="有道智云key">
          <Input
            style={{ width: 220 }}
            value={config['有道智云key']}
            onChange={async (e) => {
              const val = e.target.value;
              const c = await bluesea.getConfig();
              const newConfig = {
                ...c,
                ['有道智云key']: val,
              };
              bluesea.setConfig(newConfig);
            }}
          />
        </RowOptions> */}
      </div>
    </div>
  );
};
