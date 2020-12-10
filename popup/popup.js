const forPhonetic = (text) => {
  if (!text) {
    return '';
  }
  return text.split(';')[0].split(',')[0];
};

const TfCard = ({ tfData }) => {
  return html`<div class="card notranslate">
    <div style="flex: 1;padding: 8px;">
      <div class="card-row">
        <div style="font-size: 18px;font-weight: bold;">
          ${tfData.returnPhrase ? tfData.returnPhrase[0] : tfData.query}
        </div>
        <svg
          style="margin-left: 4px;margin-bottom: -3px;cursor: pointer;"
          t="1606215479613"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1940"
          width="16"
          height="16"
          onClick=${() => {
            var audioBlock = document.createElement('audio');
            audioBlock.setAttribute(
              'src',
              `https://dict.youdao.com/dictvoice?audio=${tfData.query}`
            );
            audioBlock.play();
            audioBlock.addEventListener('ended', function () {
              // console.log('声音播放完了');
            });
          }}
        >
          <path
            d="M552.96 152.064v719.872c0 16.11776-12.6976 29.184-28.3648 29.184a67.4816 67.4816 0 0 1-48.39424-20.64384l-146.8416-151.12192A74.5472 74.5472 0 0 0 275.8656 706.56h-25.3952C146.08384 706.56 61.44 619.45856 61.44 512s84.64384-194.56 189.0304-194.56h25.3952c20.0704 0 39.30112-8.192 53.47328-22.79424l146.8416-151.1424A67.4816 67.4816 0 0 1 524.61568 122.88C540.2624 122.88 552.96 135.94624 552.96 152.064z m216.96512 101.5808a39.936 39.936 0 0 1 0-57.42592 42.25024 42.25024 0 0 1 58.7776 0c178.4832 174.40768 178.4832 457.15456 0 631.56224a42.25024 42.25024 0 0 1-58.7776 0 39.936 39.936 0 0 1 0-57.40544 359.50592 359.50592 0 0 0 0-516.75136z m-103.38304 120.23808a39.7312 39.7312 0 0 1 0-55.23456 37.51936 37.51936 0 0 1 53.94432 0c104.30464 106.78272 104.30464 279.92064 0 386.70336a37.51936 37.51936 0 0 1-53.94432 0 39.7312 39.7312 0 0 1 0-55.23456c74.48576-76.288 74.48576-199.94624 0-276.23424z"
            p-id="1941"
            fill="#666"
          ></path>
        </svg>
      </div>

      <div class="flex: 1">
        <!-- 英标 -->
        ${tfData.basic && tfData.basic['uk-phonetic']
          ? html` <div>
              <div class="card-row">
                <span>英</span
                ><span style="color: #f00; margin-left: 2px"
                  >[${forPhonetic(tfData.basic['uk-phonetic'])}]</span
                >
              </div>
              <div class="card-row">
                <span>美</span
                ><span style="color: #f00; margin-left: 2px"
                  >[${forPhonetic(tfData.basic['us-phonetic'])}]</span
                >
              </div>
            </div>`
          : ''}
        <div style="height: 4px;"></div>
        ${tfData.basic
          ? tfData.basic.explains.map((it) => {
              return html`<div class="card-row">${it}</div>`;
            })
          : tfData.translation.map((it) => {
              return html`<div class="card-row">${it}</div>`;
            })}
      </div>
    </div>

    <style>
      .card {
        position: relative;
        font-size: 14px;
        color: #222;
        padding: 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .card-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
    </style>
  </div>`;
};

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
          <${TfCard} tfData=${material.youdao} />

          <div class="card_content">
            <div style="color: #888;">
              <div style="margin-bottom: 8px;">
                <div>创建时间：</div>
                <div>${material.ctime}</div>
              </div>
              <div style="margin-bottom: 8px;">
                <div>学习等级</div>
                <div>${material.learn.level}</div>
              </div>
              <div style="margin-bottom: 8px;">
                <div>下一次学习时间</div>
                <div>${material.learn.learnDate}</div>
              </div>
              <div style="margin-bottom: 8px;">
                <div>当日词频</div>
                <div>${bluesea.forStatisticTodayCount(material)}</div>
              </div>
              <div style="margin-bottom: 8px;">
                <div>总词频</div>
                <div>${bluesea.forStatisticAllCount(material)}</div>
              </div>
              <div style="margin-bottom: 8px;">
                <div>上下文句子：</div>
                <div>待开发</div>
              </div>
              <div style="margin-bottom: 8px;">
                <div>单词来源：</div>
                <div>待开发</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const ModalLearnCard = ({ visible, onClose, material }) => {
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

        ${needLearn
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
    return `${minute / (24 * 60).toFixed(1)}天`;
  } else {
    return '数据异常，请反馈';
  }
};

const Material = () => {
  const { list, sortRule, setSortRule } = bluesea.useMaterialsMate();
  const config = bluesea.useConfig();

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
        visible=${!!selectedMaterial}
        material=${selectedMaterial}
        onClose=${() => {
          setSelectedMaterial(null);
        }}
      />

      <${ModalSortRules}
        visible=${visibleModalSortRules}
        onClose=${(rule) => {
          setSortRule(rule);
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
                          'statistics',
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
                        const tfData = await tf(it);
                        const material = {
                          text: it,
                          translation: tfData.translation[0],
                          ctime: dayjs().format(),
                          learn: bluesea.createLearnObj(),
                          // 保留完整数据，后面可能会使用
                          youdao: tfData,
                        };
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
      <div style="padding: 4px;flex: 1;">
        <div style="padding: 4px;border-bottom: 1px solid #ccc;display: flex;">
          <div style="color: #888;">单词词组（${list.length}）</div>
          <div style="flex:1;"></div>
          <div style="color: #888;margin-right: 12px;">排序数据</div>
          <div style="color: #888;">复习倒计时</div>
        </div>

        ${list.map((it) => {
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

          return html`<div class="word-row">
            <div
              style="flex: 1;display: flex;"
              onClick=${() => {
                setSelectedMaterial(it);
              }}
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
                style="color: #888;margin-right: 16px;text-align: right;min-width: 24px;"
              >
                ${countdown}
              </div>
            </div>

            <div class="word-options">
              <span
                style="color:#f00"
                onClick=${() => {
                  bluesea.delMaterial(it.text);
                }}
                >删除</span
              >
            </div>
          </div>`;
        })}
      </div>
    </div>
  `;
};

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
  const config = bluesea.useConfig();

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

  const key1 = '划词高亮域名黑名单';
  const key2 = '单词弹幕域名黑名单';

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
    <div>
      <div style="padding: 8px;">
        <span> ${hostname} </span>
        <span style="margin-left: 8px;color: #888">
          (针对当前域名的快捷操作)
        </span>
      </div>
      <div
        style="display: flex;align-items: center; background: #fff; padding: 8px; border-bottom: 1px solid #f1f1f1"
      >
        <div style="flex: 1">划词高亮</div>
        <${Btns}
          value=${!((config || {})[key1] || []).some((it) => it === hostname)}
          onChange=${async (flag) => {
            const config = await bluesea.getConfig();
            let list = [];
            if (flag) {
              list = config[key1].filter((it) => it !== hostname);
            } else {
              list = Array.from(new Set([...config[key1], hostname]));
            }
            const newConfig = {
              ...config,
              [key1]: list,
            };
            bluesea.setConfig(newConfig);

            editor.current.setValue(JSON.stringify(newConfig, null, '\t'));
          }}
        />
      </div>
      <div
        style="display: flex; align-items: center; background: #fff; padding: 8px; "
      >
        <div style="flex: 1">单词弹幕</div>
        <${Btns}
          value=${!((config || {})[key2] || []).some((it) => it === hostname)}
          onChange=${async (flag) => {
            const config = await bluesea.getConfig();
            let list = [];
            if (flag) {
              list = config[key2].filter((it) => it !== hostname);
            } else {
              list = Array.from(new Set([...config[key2], hostname]));
            }
            const newConfig = {
              ...config,
              [key2]: list,
            };
            bluesea.setConfig(newConfig);

            editor.current.setValue(JSON.stringify(newConfig, null, '\t'));
          }}
        />
      </div>
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
        >重置</span
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
      更新配置后如果没有生效，可以尝试刷新页面
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

const TabItemMap = {
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
