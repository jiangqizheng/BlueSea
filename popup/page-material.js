

const SuperCard = ({ material, needLearn }) => {
  const [isCardReverse, setIsCardReverse] = useState(false);

  return html`
    <div
      style="
        user-select: none;
        flex: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        perspective: 1000px;"
    >
      <div
        style="
        position: relative;
        border-radius: 16px;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        transition: all 240ms;
        transform-style: preserve-3d;
        transform: ${isCardReverse ? 'rotateY(180deg)' : undefined};
        "
      >
        <div class="r-card">
          <!-- 单词 -->
          <div class="card_content">
            <div
              style="
                font-size: 18px;
                width: 100%;
                font-weight: bold;
                text-align: center;
                border: 1px dashed transparent;"
            >
              ${material.text}
            </div>
            ${needLearn
              ? ''
              : html`<div
                  style="
                    margin-top: 8px;
                    width: 100%;
                    text-align: center;
                    border: 1px dashed transparent;"
                >
                  ${material.translation}
                </div>`}
          </div>
          <!-- 操作 -->
          <div
            style="
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;"
          >
            <svg
              onClick=${() => {
                setIsCardReverse(true);
              }}
              t="1586595843384"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8185"
              width="40"
              height="40"
            >
              <path
                d="M856 376H648V168c0-8.8-7.2-16-16-16H168c-8.8 0-16 7.2-16 16v464c0 8.8 7.2 16 16 16h208v208c0 8.8 7.2 16 16 16h464c8.8 0 16-7.2 16-16V392c0-8.8-7.2-16-16-16z m-480 16v188H220V220h360v156H392c-8.8 0-16 7.2-16 16z m204 52v136H444V444h136z m224 360H444V648h188c8.8 0 16-7.2 16-16V444h156v360z"
                p-id="8186"
                fill="#2c2c2c"
              ></path>
            </svg>
          </div>
        </div>

        <div
          class="r-card card_back"
          onclick=${() => {
            setIsCardReverse(false);
          }}
        >
          <div>
            <${TfCard} tfData=${material.youdao} />
          </div>
          <div class="card_content">
            <div style="color: #888;">
              <div style="margin-bottom: 4px;">
                <div>收藏时间：</div>
                <div>${material.ctime}</div>
              </div>
              <div style="margin-bottom: 4px;">
                <div>学习等级：</div>
                <div>${material.learn.level}</div>
              </div>
              <div style="margin-bottom: 4px;">
                <div>下一次学习时间：</div>
                <div>${material.learn.learnDate}</div>
              </div>
              <div style="margin-bottom: 4px;">
                <div>当日词频：</div>
                <div>${bluesea.forStatisticTodayCount(material)}</div>
              </div>
              <div style="margin-bottom: 4px;">
                <div>总词频：</div>
                <div>${bluesea.forStatisticAllCount(material)}</div>
              </div>
              <div style="margin-bottom: 4px;">
                <div>添加自：</div>
                <div>
                  <a href="${material.addFrom}" target="_blank" onClick=${(e) => {
                    e.stopPropagation()
                  }}>${material.addFrom ? "点击此可跳转" : "未知来源"}</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const ModalLearnCard = ({ visible, onClose, material, allowLearnOperation }) => {
  if (!visible) {
    return '';
  }

  const needLearn = dayjs().format() > material.learn.learnDate;

  return html`
    <div
      style=${{
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
      onClick=${() => {
        onClose();
      }}
    >
      <div
        onClick=${(e) => {
          e.stopPropagation();
        }}
        style=${{
          position: 'relative',
          width: 200,
          height: 300,
          marginTop: 40,
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <${SuperCard} material=${material} needLearn=${needLearn} />

        ${(needLearn && allowLearnOperation)
          ? html` <div
              style="
                display: flex;
                align-items: center;
                padding: 8px 4px;"
            >
              <div
                style="
                  flex: 1;
                  text-align: center;
                  color: #fff;
                  border-radius: 4px;
                  padding: 8px;
                  cursor: pointer;
                  user-select: none;
                  background: #ff4d4f;"
                onClick=${async () => {
                  await bluesea.toLearnBack(material.text);
                  onClose();
                }}
              >
                不认识
              </div>
              <div style="width: 8px"></div>
              <div
                style="
                  flex: 1;
                  text-align: center;
                  color: #fff;
                  border-radius: 4px;
                  padding: 8px;
                  cursor: pointer;
                  user-select: none;
                  background: #61bd4f;"
                onClick=${async () => {
                  await bluesea.toLearnNext(material.text);
                  onClose();
                }}
              >
                认识
              </div>
            </div>`
          : ''}
      </div>
    </div>
    ;
  `;
};

const ModalSortRules = ({ visible, onClose: close }) => {
  if (!visible) {
    return '';
  }

  return html`
    <div
      style=${{
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
      onClick=${() => {
        close();
      }}
    >
      <div
        onClick=${(e) => {
          e.stopPropagation();
        }}
        style=${{
          position: 'relative',
          width: 200,
          marginTop: 40,
          background: '#f4f5f7',
          zIndex: 25,
          padding: 16,
        }}
      >
        ${Object.entries(bluesea.constant.sortRule).map(([key, label]) => {
          return html`<div style="margin-bottom: 16px">
            <div
              class="btn"
              onClick=${async () => {
                close(key);
              }}
            >
              ${label}
            </div>
          </div>`;
        })}
      </div>
    </div>
  `;
};

const ModalExport = ({ visible, onClose: close, list }) => {
  if (!visible) {
    return '';
  }

  return html`
    <div
      style=${{
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
      onClick=${() => {
        close();
      }}
    >
      <div
        onClick=${(e) => {
          e.stopPropagation();
        }}
        style=${{
          position: 'relative',
          width: 200,
          marginTop: 40,
          background: '#f4f5f7',
          zIndex: 25,
          padding: 16,
        }}
      >
        <div style="margin-bottom: 16px">
          <div
            class="btn"
            onClick=${() => {
              const data = list.map((it) => it.text).join('\n');
              const fileBlob = new Blob([data], {
                type: 'text/plain',
              });
              var objectURL = window.URL.createObjectURL(fileBlob);
              const a = document.createElement('a');
              a.href = objectURL;
              a.download = 'word.txt';
              a.click();
              window.URL.revokeObjectURL(objectURL);
            }}
          >
            默认导出（.txt）
          </div>
        </div>
        <div style="margin-bottom: 16px">
          <div
            class="btn"
            onClick=${() => {
              const data = JSON.stringify(list, null, '\t');
              const fileBlob = new Blob([data], {
                type: 'application/json',
              });
              var objectURL = window.URL.createObjectURL(fileBlob);
              const a = document.createElement('a');
              a.href = objectURL;
              a.download = 'word.json';
              a.click();
              window.URL.revokeObjectURL(objectURL);
            }}
          >
            原始数据导出（.json）
          </div>
        </div>
      </div>
    </div>
  `;
};

const formatDate = (minute) => {
  if (minute < 60) {
    return `${minute}分钟`;
  } else if (minute >= 60 && minute < 24 * 60) {
    return `${(minute / 60).toFixed(1)}小时`;
  } else if (minute >= 24 * 60) {
    return `${(minute / (24 * 60)).toFixed(1)}天`;
  } else {
    return '数据异常，请反馈';
  }
};

const Material = () => {
  const { list, sortRule, setSortRule } = bluesea.useMaterialsMate();
  let config = bluesea.useConfig();

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [visibleModalSortRules, setVisibleModalSortRules] = useState(false);
  const [visibleModalExport, setVisibleModalExport] = useState(false);

  const [tabUrl, setTabUrl] = useState('');

  useEffect(() => {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      ([tab]) => {
        setTabUrl(tab.url);
      }
    );
  }, []);

  if (!config) {
    return 'loading...';
  }

  return html`
    <div style="height: 400px; overflow-y: auto; box-sizing: border-box;">
      <${ModalLearnCard}
        allowLearnOperation=${!config['单词弹幕']}
        visible=${!!selectedMaterial}
        material=${selectedMaterial}
        onClose=${() => {
          setSelectedMaterial(null);
        }}
      />

      <${ModalSortRules}
        visible=${visibleModalSortRules}
        onClose=${(rule) => {
          if (rule) {
            setSortRule(rule);
          }
          setVisibleModalSortRules(false);
        }}
      />

      <${ModalExport}
        list=${list}
        visible=${visibleModalExport}
        onClose=${() => {
          setVisibleModalExport(false);
        }}
      />

      <div
        style="
        position: sticky;
        top: 0;
        padding: 4px;
        background: #fff;
        display: flex;
        align-items: center;"
      >
        <div style="flex: 1;">
          <span>排序：</span>
          <span
            className="btn_hover"
            style=${{
              flex: 1,
              padding: '2px 4px',
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: 2,
            }}
            onclick=${() => {
              setVisibleModalSortRules(true);
            }}
            >${bluesea.constant.sortRule[sortRule]}</span
          >
        </div>

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
              userSelect: 'none',
              borderRadius: 2,
              // cursor: 'not-allowed',
            }}
            onClick=${() => {
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
                        materialsDB.set([...list, ...l]);
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

                      materialsDB.set([...list, ...result]);

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
          <div style=${{ padding: 2 }}></div>
          <div
            className="btn_hover"
            style=${{
              flex: 1,
              padding: '2px 4px',
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: 2,
            }}
            onClick=${() => {
              setVisibleModalExport(true);
            }}
          >
            导出
          </div>
        </div>
      </div>
      <div style="padding: 4px;flex: 1;" onMouseUp=${e => {
        const target = e.target;
        if (!target) 
          return;
        
        let indexElement = target;
        
        while (indexElement && indexElement.dataset.index === undefined) {
          indexElement = indexElement.parentElement;
        }
        if (indexElement === null)
          return;
        const index = parseInt(indexElement.dataset.index)
        const item = list[index];

        switch (e.button) {
          case 0: // 左键
            if(target.dataset.action === "delete") {
              bluesea.delMaterial(item.text);
            } else {
              setSelectedMaterial(item);
            }
            break;
          case 1: // 中键
            if(item.addFrom) {
              window.open(item.addFrom, '_blank');
            } else {
              // alert("当前单词不存在添加源")
            }
            break;
          default:
            break;
        }
      }}>
        <div style="padding: 4px;border-bottom: 1px solid #ccc;display: flex;">
          <div style="color: #888;">单词词组（${list.length}）</div>
          <div style="flex:1;"></div>
          <div style="color: #888;margin-right: 12px;">排序数据</div>
          <div style="color: #888;">复习倒计时</div>
        </div>

        ${list.map((it, index) => {
          let countdown = 'now';
          const nowDate = dayjs().format();
          if (nowDate < it.learn.learnDate) {
            //如果获取的差异为0，那么默认为1分钟，不存在0分钟的情况
            const diffMinute = dayjs().diff(it.learn.learnDate, 'minute') || 1;
            countdown = formatDate(Math.abs(diffMinute));
          }
          if (it.learn.done) {
            countdown = 'done';
          }

          let infoText = {
            ctime: dayjs(it.ctime).format('YYYY-MM-DD'),
            learnTime: dayjs(it.learn.learnDate).format('YYYY-MM-DD'),
            learnLevel: it.learn.level,
            todayCount: bluesea.forStatisticTodayCount(it),
            count: bluesea.forStatisticAllCount(it),
            tabCount: bluesea.forStatisticTabCount(it, tabUrl),
          }[sortRule];

          return html`<div class="word-row" data-index="${index}">
            <div
              style="flex: 1;display: flex;"
            >
              <div style="cursor: default">${it.text}</div>
              <div style="margin-left:16px; font-weight:300; cursor:default;">
                ${it.translation}
              </div>
              <div style="flex:1;"></div>

              <div
                style="color: #888;margin-right: 16px;text-align: right;min-width: 24px;"
              >
                ${infoText}
              </div>
              <div
                style="color: #888;margin-right: 0px;text-align: right;min-width: 24px;"
              >
                ${countdown}
              </div>
            </div>

            <div class="word-options">
              <span
                style="color:#f00; margin-left: 8px;"
                data-action="delete"
              >删除</span
            >
            </div>
          </div>`;
        })}
      </div>
    </div>
  `;
};