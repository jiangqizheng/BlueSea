import React, { useRef, useEffect, useState } from 'react';
import {
  ModalExport,
  ModalLearnCard,
  ModalSortRules,
  forLearnState,
} from './p_material_c.jsx';
import { bluesea } from '../logic';
import dayjs from 'dayjs';
import { Vlist } from './vlist';
import { materialStore } from '../store';
import { Button, Switch, message } from 'antd';

export const PageMaterial = () => {
  // const [list] = io.useFetchData(io.getWordList)
  // useEffect(async () => {
  //   const rt = await word.getList();
  //   console.log('rt---1', rt);
  // }, []);

  const { rt: wordList } = materialStore.useX();
  console.log('wordList', wordList);

  // const { list, sortRule, setSortRule } = bluesea.useMaterialsMate();
  // let config = bluesea.useConfig();

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [visibleModalSortRules, setVisibleModalSortRules] = useState(false);
  const [visibleModalExport, setVisibleModalExport] = useState(false);

  // const tabUrl = bluesea.useTabUrl();

  // if (loading) {
  //   return 'loading...';
  // }

  // if (!config) {
  //   return 'loading...';
  // }

  return (
    <div
      style={{
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: '14px 16px',
      }}
    >
      <ModalLearnCard
        allowLearnOperation={true}
        visible={!!selectedMaterial}
        material={selectedMaterial}
        onClose={() => {
          setSelectedMaterial(null);
        }}
      />

      <ModalSortRules
        visible={visibleModalSortRules}
        onClose={(rule) => {
          if (rule) {
            // setSortRule(rule);
          }
          setVisibleModalSortRules(false);
        }}
      />

      <ModalExport
        list={[]}
        visible={visibleModalExport}
        onClose={() => {
          setVisibleModalExport(false);
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <span
            style={{
              color: '#999',
            }}
          >
            默认分组
          </span>
          <img
            src="./imgs/btn-drop.png"
            style={{ width: '18px', height: '18px' }}
          />
        </div>

        <div style={{ flex: 1 }}></div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* <div
            style={{
              width: 48,
              height: 24,
              lineHeight: '24px',
              userSelect: 'none',
              borderRadius: '2px',
              color: '#fff',
              background: '#3E8AF3',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={() => {
              setVisibleModalExport(true);
            }}
          >
            导出
          </div> */}
          {/* <div style={{ color: '#ccc' }}>最近更新：08:10</div> */}
          {/* <div
            style={{
              width: 48,
              height: 24,
              lineHeight: '24px',
              userSelect: 'none',
              borderRadius: '2px',
              color: '#fff',
              background: '#3E8AF3',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={() => {}}
          >
            网站
          </div> */}
          <div style={{ width: 12 }}></div>
          <div
            style={{
              width: 48,
              height: 24,
              lineHeight: '24px',
              userSelect: 'none',
              borderRadius: '2px',
              color: '#fff',
              background: '#3E8AF3',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={async () => {
              await materialStore.refresh();
              message.success('刷新成功！');
            }}
          >
            刷新
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          background: '#fff',
          borderRadius: '6px',
          margin: '8px 0',
          padding: '6px 12px',
          color: '#999',
        }}
      >
        <div>单词（{wordList.length}）</div>
        <div style={{ flex: '1' }}></div>
        <div style={{ marginRight: '16px' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              setVisibleModalSortRules(true);
            }}
          >
            <span
              style={{
                color: '#999',
              }}
            >
              {/* {bluesea.constant.sortRule[sortRule]} */}1
            </span>
          </div>
        </div>
        <div style={{ width: '48px' }}>操作</div>
      </div>

      <Vlist source={wordList}>
        {(l) => {
          return l.map((it, index) => {
            if (it.isTmp) {
              return <div className="word-row" key={it.text}></div>;
            }

            // let infoText = {
            //   ctime: dayjs(it.ctime).format('YYYY-MM-DD'),
            //   learnTime: dayjs(it.learn.learnDate).format('YYYY-MM-DD'),
            //   learnLevel: it.learn.level,
            //   todayCount: bluesea.forStatisticTodayCount(it),
            //   count: bluesea.forStatisticAllCount(it),
            //   tabCount: bluesea.forStatisticTabCount(it, tabUrl),
            // }[sortRule];

            return (
              <div
                className="word-row"
                key={it.text}
                onClick={() => {
                  // setSelectedMaterial(it);
                }}
              >
                <div style={{ cursor: 'default' }}>{it.text}</div>
                <div
                  style={{
                    marginLeft: '16px',
                    fontWeight: '300',
                    cursor: 'default',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    wordBreak: 'break-all',
                    width: 160,
                  }}
                >
                  {it.translation}
                </div>

                <div style={{ flex: '1' }}></div>

                <div className="word-infos">
                  <div
                    style={{
                      marginRight: '16px',
                      textAlign: 'right',
                      minWidth: '24px',
                    }}
                  >
                    {/* {infoText} */}1
                  </div>
                  <div
                    style={{
                      marginRight: '0px',
                      textAlign: 'right',
                      minWidth: '48px',
                    }}
                  >
                    {/* {forLearnState(it)} */}1
                  </div>
                </div>

                <div
                  className="word-options"
                  onClick={(e) => {
                    // e.stopPropagation();
                    // bluesea.delMaterial(it.text);
                    // word.batchDel([it.id])
                    materialStore.del(it.material.id);
                  }}
                >
                  <span
                    style={{
                      color: '#ff4d4f',
                      marginLeft: '16px',
                      userSelect: 'none',
                    }}
                  >
                    归档
                  </span>
                </div>
              </div>
            );
          });
        }}
      </Vlist>
    </div>
  );
};
