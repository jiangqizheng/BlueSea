function makeBulletApp(
  root,
  { material, onOperate, destroy, autoAudio, bulletSpeed }
) {
  const App = () => {
    const ytlBulletRef = useRef();
    const ytlBulletContentRef = useRef();

    const [top, setTop] = useState(0);
    const [operated, setOperated] = useState(null);
    const [animationRunning, setAnimationRunning] = useState(true);

    const audioRef = useRef();

    useEffect(() => {
      const t =
        Math.random() * (document.documentElement.clientHeight - 250) + 32;
      setTop(t);
    }, []);

    useEffect(() => {
      const listenEnter = () => {
        if (audioRef.current) {
          audioRef.current.play().catch((e) => {
            console.error(e);
          });
        }
        setAnimationRunning(false);
      };
      const listenLeave = () => {
        setAnimationRunning(true);
      };

      const listenAnimationiteration = async () => {
        // 每次动画结束后，就校验当前单词是否还在复习清单内（可能在其他地方被操作）
        await buttelScreens.updateButteList();
        const exist = buttelScreens.buttelList.some(
          (it) => it.text === material.text
        );
        if (exist) {
          if (operated) {
            destroy();
          } else {
            setTop(
              Math.random() * (document.documentElement.clientHeight - 150) + 32
            );
          }
        } else {
          destroy();
        }
      };

      ytlBulletContentRef.current.addEventListener('mouseenter', listenEnter);
      ytlBulletRef.current.addEventListener('mouseleave', listenLeave);
      ytlBulletRef.current.addEventListener(
        'animationiteration',
        listenAnimationiteration
      );
      return () => {
        ytlBulletContentRef.current.removeEventListener(
          'mouseenter',
          listenEnter
        );
        ytlBulletRef.current.removeEventListener('mouseleave', listenLeave);
        ytlBulletRef.current.removeEventListener(
          'animationiteration',
          listenAnimationiteration
        );
      };
    }, [operated, ytlBulletRef]);

    // let color = `#${Math.floor(Math.random() * (2 << 23)).toString(16)}`;
    return html`<div
      class="notranslate bluesea-bullet"
      translate="no"
      ref=${ytlBulletRef}
      style=${{
        ['-webkit-animation-play-state']: animationRunning
          ? 'running'
          : 'paused',
        ['box-shadow']: animationRunning
          ? 'none'
          : '0 0 8px rgba(0, 0, 0, 0.4)',
        background: animationRunning ? 'none' : '#fff',
        top,
      }}
    >
      ${autoAudio
        ? html`<audio
            style="display: none"
            src="https://dict.youdao.com/dictvoice?audio=${material.text}"
            ref=${audioRef}
            preload="true"
          ></audio>`
        : ''}
      <div
        style="margin: 0 auto;
          background: rgba(0, 0, 0, 0.7);
          padding: 0 8px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          display: inline-block;
          border-radius: 16px;
          color: #fff;"
        ref=${ytlBulletContentRef}
        onmouseup=${(e) => {
          if (e.button === 1 && material.addFrom) {
            window.open(material.addFrom, '_blank');
          }
        }}
      >
        <span style="color: #fff">${material.text}</span>
        <span
          style=${{
            paddingLeft: 2,
            color: operated === 'yes' ? '#61bd4f' : '#ff4d4f',
            display: operated ? 'inline-block' : 'none',
          }}
          >${material.translation}</span
        >
      </div>

      <div
        style=${{
          alignItems: 'center',
          padding: '4px 2px;',
          marginTop: 4,
          display: animationRunning ? 'none' : operated ? 'flex' : 'none',
        }}
      >
        <div
          style="
            flex: 1;
            text-align: center;
            color: #fff;
            border-radius: 4px;
            padding: 4px;
            cursor: pointer;
            user-select: none;
            background: #0070f3;"
          onClick=${() => {
            setOperated(null);
            onOperate('revoke');
          }}
        >
          记错了，重来
        </div>
      </div>

      <div
        style=${{
          alignItems: 'center',
          padding: '4px 2px;',
          marginTop: 4,
          display: animationRunning ? 'none' : operated ? 'none' : 'flex',
        }}
      >
        <div
          style="
            flex: 1;
            text-align: center;
            color: #fff;
            border-radius: 4px;
            padding: 4px;
            cursor: pointer;
            user-select: none;
            background: #ff4d4f;"
          onClick=${() => {
            setOperated('no');
            onOperate(false);
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
            padding: 4px;
            cursor: pointer;
            user-select: none;
            background: #61bd4f;"
          onClick=${() => {
            setOperated('yes');
            onOperate(true);
          }}
        >
          认识
        </div>
      </div>

      <style>
        .bluesea-bullet {
          position: fixed;
          text-align: center;
          left: 500px;
          width: 180px;
          z-index: 2147483647;
          border-radius: 4px;
          padding: 8px;
          animation: bluesea-bullet-animation ${bulletSpeed}s infinite linear 0s;
        }
        .bluesea-bullet,
        .bluesea-bullet > * {
          font-size: 14px;
        }

        @keyframes bluesea-bullet-animation {
          from {
            left: 100%;
            transform: translateX(0);
            transform: translate3d(0, 0, 0);
          }
          to {
            left: 0;
            transform: translate3d(-100%, 0, 0);
          }
        }
      </style>
    </div>`;
  };

  render(html`<${App} />`, root);
}

class ButtelScreens {
  timer = null;
  buttelList = [];
  config = {};

  async updateButteList() {
    const l = await bluesea.getNeedLearnList();
    // 过滤掉非学习清单中的单词
    this.buttelList = this.buttelList.filter((it) => {
      return l.some((a) => a.text === it.text);
    });
  }

  async getConfig() {
    return await bluesea.getConfig();
  }

  async getOneMaterial() {
    const list = await bluesea.getNeedLearnList();
    const l2 = list.filter((it) => {
      return !this.buttelList.some((a) => a.text === it.text);
    });
    return l2[0];
  }

  addButtel(material) {
    this.buttelList.push(material);
  }
  delButtel(material) {
    const i = this.buttelList.findIndex((it) => it.text === material.text);
    this.buttelList.splice(i, 1);
  }

  async makeBullet() {
    this.config = await this.getConfig();
    const material = await this.getOneMaterial();
    if (!material) {
      return;
    }
    if (this.buttelList.length > this.config['单词弹幕数量上限']) {
      return;
    }

    const buttelRoot = document.createElement('div');
    buttelRoot.classList.add('bluesea', 'bluesea-bullet-screens');
    // buttelRoot.style.userSelect = 'none';
    document.body.appendChild(buttelRoot);
    makeBulletApp(buttelRoot, {
      bulletSpeed: this.config['单词弹幕速度'] || 10, //可能存在未更新配置的用户，后续将删除默认值
      autoAudio: this.config['自动发音'],
      material,
      onOperate: async (flag) => {
        if (flag === 'revoke') {
          await bluesea.updateMaterialObj(material)
          this.addButtel(material)
          return 
        }

        if (flag) {
          bluesea.toLearnNext(material.text);
        } else {
          bluesea.toLearnBack(material.text);
        }
        this.delButtel(material);
      },
      destroy: () => {
        render(null, buttelRoot);
        buttelRoot.parentNode.removeChild(buttelRoot);
      },
    });
    await this.updateButteList();
    this.addButtel(material);
  }

  start() {
    if (
      !(document.visibilityState === 'visible' && window.self === window.top)
    ) {
      return;
    }
    this.focusFn = () => {
      if (this.timer) {
        return;
      }
      this.timer = setInterval(() => {
        this.makeBullet();
      }, 3000);
    };
    this.focusFn();
    window.addEventListener('focus', this.focusFn);

    this.blurFn = () => {
      this.clear();
    };
    window.addEventListener('blur', this.blurFn);
  }
  clear(full) {
    if (full) {
      window.removeEventListener('focus', this.focusFn);
      window.removeEventListener('blur', this.blurFn);
    }
    clearInterval(this.timer);
    this.timer = null;
    this.buttelList = [];
    document.querySelectorAll('.bluesea-bullet-screens').forEach((it) => {
      render(null, it);
      it.parentNode.removeChild(it);
    });
  }
}

const buttelScreens = new ButtelScreens();

document.addEventListener('DOMContentLoaded', () => {
  funCtrl.run(
    '单词弹幕',
    () => {
      buttelScreens.start();
    },
    () => {
      buttelScreens.clear(true);
    }
  );
});
