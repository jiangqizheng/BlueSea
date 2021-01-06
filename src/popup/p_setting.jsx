import React, { useRef, useEffect, useState } from 'react';
import { bluesea } from '../logic';
import { Button, Switch, InputNumber, Input } from 'antd';
import { RowOptions, ModalBlack } from './p_setting_c';

export const PageSetting = () => {
  const [visibleModalBlack, setVisibleModalBlack] = useState(false);
  let config = bluesea.useConfig();

  const url = bluesea.useTabUrl();
  let hostname = '';
  if (url) {
    hostname = new URL(url).hostname;
  }

  config = config || {};

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        padding: '18px',
      }}
    >
      <ModalBlack
        config={config}
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
          <div>访客</div>
          <div style={{ color: '#999', marginTop: '4px' }}>未登录</div>
        </div>
      </div>

      <div
        style={{
          background: '#191D26',
          color: '#fff',
          height: '48px',
          lineHeight: '48px',
          paddingLeft: '18px',
          borderRadius: '6px',
          marginTop: '18px',
        }}
      >
        持续迭代中，敬请期待：）
      </div>

      <div style={{ marginTop: '18px', color: '#999' }}>基础功能</div>

      <div style={{ marginTop: '12px' }}>
        <RowOptions rowKey="划词翻译" />
        <RowOptions rowKey="单词高亮" />
        <RowOptions rowKey="单词弹幕" />
      </div>

      <div style={{ marginTop: '18px', color: '#999' }}>
        <span>黑名单</span>
      </div>

      <div style={{ marginTop: '12px' }}>
        <RowOptions rowKey={hostname}>
          <Switch
            checked={
              !((config || {})['黑名单'] || []).some((it) => it === hostname)
            }
            onChange={async (flag) => {
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
            }}
          />
        </RowOptions>
      </div>

      <div style={{ marginTop: '18px', color: '#999' }}>
        <span>其他</span>
        <span
          style={{ color: '#1890ff', marginLeft: 8, cursor: 'pointer' }}
          onClick={() => {
            setVisibleModalBlack(true);
          }}
        >
          完整配置
        </span>
      </div>

      <div style={{ marginTop: '12px' }}>
        <RowOptions rowKey="中文注解" />
        <RowOptions rowKey="自动发音" />
        <RowOptions rowKey="隐藏完成复习的单词" />
        <RowOptions rowKey="单词弹幕数量上限">
          <InputNumber
            style={{ width: 60 }}
            min={1}
            max={100}
            value={config['单词弹幕数量上限']}
            onChange={async (val) => {
              const c = await bluesea.getConfig();
              const newConfig = {
                ...c,
                ['单词弹幕数量上限']: val,
              };
              bluesea.setConfig(newConfig);
            }}
          />
        </RowOptions>
        <RowOptions rowKey="单词弹幕速度">
          <InputNumber
            style={{ width: 60 }}
            min={1}
            max={100}
            value={config['单词弹幕速度']}
            onChange={async (val) => {
              const c = await bluesea.getConfig();
              const newConfig = {
                ...c,
                ['单词弹幕速度']: val,
              };
              bluesea.setConfig(newConfig);
            }}
          />
        </RowOptions>
        <RowOptions rowKey="有道智云key">
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
        </RowOptions>
        <RowOptions rowKey="有道智云appkey">
          <Input
            style={{ width: 220 }}
            value={config['有道智云appkey']}
            onChange={async (e) => {
              const val = e.target.value;
              const c = await bluesea.getConfig();
              const newConfig = {
                ...c,
                ['有道智云appkey']: val,
              };
              bluesea.setConfig(newConfig);
            }}
          />
        </RowOptions>
      </div>
    </div>
  );
};
