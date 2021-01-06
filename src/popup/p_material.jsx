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

export const PageMaterial = () => {
  const { list, sortRule, setSortRule } = bluesea.useMaterialsMate();
  let config = bluesea.useConfig();

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [visibleModalSortRules, setVisibleModalSortRules] = useState(false);
  const [visibleModalExport, setVisibleModalExport] = useState(false);

  const tabUrl = bluesea.useTabUrl();

  if (!config) {
    return 'loading...';
  }

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
        allowLearnOperation={!config['单词弹幕']}
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
            setSortRule(rule);
          }
          setVisibleModalSortRules(false);
        }}
      />

      <ModalExport
        list={list}
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
            onClick={() => {
              const inputEl = document.createElement('input');
              inputEl.type = 'file';
              inputEl.accept = '.txt,.json';
              inputEl.click();
              inputEl.addEventListener(
                'change',
                async () => {
                  var reader = new FileReader();
                  reader.readAsText(inputEl.files[0]);
                  reader.onload = async (evt) => {
                    const { type } = inputEl.files[0];

                    if (type === 'application/json') {
                      // 需要校验格式
                      // 目前为覆盖，不做增量处理，后续要调整为增量模式
                      try {
                        let l = JSON.parse(evt.target.result);
                        // 简单校验格式，确保每条数据拥有以下字段，后续可以用json schema验证
                        const keys = [
                          'ctime',
                          'learn',
                          'text',
                          'translation',
                          'youdao',
                        ];
                        const isFull = l.reduce((pre, cur) => {
                          if (!pre) {
                            return false;
                          }
                          return keys.every((it) => it in cur);
                        }, true);

                        if (!isFull) {
                          alert('格式校验未通过，数据异常或不完整');
                          return;
                        }

                        l = l.filter((it) => {
                          return !list.some((it2) => it.text === it2.text);
                        });

                        const newList = [...list, ...l].reduce((pre, cur) => {
                          const isExist = pre.find(
                            (it) => it.text === cur.text
                          );
                          return isExist ? pre : [...pre, cur];
                        }, []);

                        await bluesea.setMaterials(newList);

                        alert(
                          `增量导入 ${l.length} 条数据（重复数据会被过滤）`
                        );
                      } catch (e) {
                        alert(`导入失败: ${e}`);
                      }
                    } else if (type === 'text/plain') {
                      let l = evt.target.result
                        .split('\n')
                        .filter((it) => {
                          return !list.some((it2) => it === it2.text);
                        })
                        .map((it) => it.trim())
                        .filter(Boolean);

                      const tf = async (text) => {
                        return new Promise((resolve) => {
                          chrome.runtime.sendMessage(
                            { type: 'tf', payload: text },
                            (r) => {
                              resolve(r);
                            }
                          );
                        });
                      };

                      if (l.length > 20) {
                        alert('使用.txt进行导入时，一次性不能超过20条数据');
                        return;
                      }

                      let result = [];
                      for (let it of l) {
                        const youdao = await tf(it);
                        const material = bluesea.createMaterialObj(it, youdao);
                        result.push(material);
                      }

                      const newList = [...list, ...result].reduce(
                        (pre, cur) => {
                          const isExist = pre.find(
                            (it) => it.text === cur.text
                          );
                          return isExist ? pre : [...pre, cur];
                        },
                        []
                      );

                      await bluesea.setMaterials(newList);

                      alert(
                        `增量导入 ${result.length} 条数据（重复数据会被过滤）`
                      );
                    }
                  };
                },
                false
              );
            }}
          >
            导入
          </div>
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
            onClick={() => {
              setVisibleModalExport(true);
            }}
          >
            导出
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
        <div>单词词组（{list.length}）</div>
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
              {bluesea.constant.sortRule[sortRule]}
            </span>
          </div>
        </div>
        <div style={{ width: '48px' }}>复习时刻</div>
      </div>

      <Vlist source={list}>
        {(l) => {
          return l.map((it, index) => {
            if (it.isTmp) {
              return <div className="word-row" key={it.text}></div>;
            }

            let infoText = {
              ctime: dayjs(it.ctime).format('YYYY-MM-DD'),
              learnTime: dayjs(it.learn.learnDate).format('YYYY-MM-DD'),
              learnLevel: it.learn.level,
              todayCount: bluesea.forStatisticTodayCount(it),
              count: bluesea.forStatisticAllCount(it),
              tabCount: bluesea.forStatisticTabCount(it, tabUrl),
            }[sortRule];

            return (
              <div
                className="word-row"
                key={it.text}
                onClick={() => {
                  setSelectedMaterial(it);
                }}
              >
                <div style={{ cursor: 'default' }}>{it.text}</div>
                <div
                  style={{
                    marginLeft: '16px',
                    fontWeight: '300',
                    cursor: 'default',
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
                    {infoText}
                  </div>
                  <div
                    style={{
                      marginRight: '0px',
                      textAlign: 'right',
                      minWidth: '48px',
                    }}
                  >
                    {forLearnState(it)}
                  </div>
                </div>

                <div className="word-options">
                  <span
                    style={{ color: '#ff4d4f', marginLeft: '16px' }}
                    data-action="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.time('del');
                      bluesea.delMaterial(it.text);
                      console.timeEnd('del');
                    }}
                  >
                    删除
                  </span>
                </div>
              </div>
            );
          });
        }}
      </Vlist>

      {/* <div
        className="word-list"
        style={{
          flex: '1',
          overflowY: 'scroll',
          background: '#fff',
          margin: '0px',
          borderRadius: '6px',
        }}
      >
        {list.map((it, index) => {
          let infoText = {
            ctime: dayjs(it.ctime).format('YYYY-MM-DD'),
            learnTime: dayjs(it.learn.learnDate).format('YYYY-MM-DD'),
            learnLevel: it.learn.level,
            todayCount: bluesea.forStatisticTodayCount(it),
            count: bluesea.forStatisticAllCount(it),
            tabCount: bluesea.forStatisticTabCount(it, tabUrl),
          }[sortRule];

          return (
            <div
              className="word-row"
              key={it.text}
              onClick={() => {
                setSelectedMaterial(it);
              }}
            >
              <div style={{ cursor: 'default' }}>{it.text}</div>
              <div
                style={{
                  marginLeft: '16px',
                  fontWeight: '300',
                  cursor: 'default',
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
                  {infoText}
                </div>
                <div
                  style={{
                    marginRight: '0px',
                    textAlign: 'right',
                    minWidth: '48px',
                  }}
                >
                  {forLearnState(it)}
                </div>
              </div>

              <div className="word-options">
                <span
                  style={{ color: '#ff4d4f', marginLeft: '16px' }}
                  data-action="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.time('del');
                    bluesea.delMaterial(it.text);
                    console.timeEnd('del');
                  }}
                >
                  删除
                </span>
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};
