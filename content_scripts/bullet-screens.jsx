function makeBulletApp(root, { material, onOperate, destroy, autoAudio, bulletSpeed }) {
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
          audioRef.current.play();
        }
        setAnimationRunning(false);
      };
      const listenLeave = () => {
        setAnimationRunning(true);
      };

      const listenAnimationiteration = () => {
        if (operated) {
          destroy();
        } else {
          setTop(
            Math.random() * (document.documentElement.clientHeight - 150) + 32
          );
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
  async getConfig() {
    return await bluesea.getConfig();;
  }

  async getOneMaterial() {
    const list = await bluesea.getNeedLearnList();
    const l2 = list.filter((it) => {
      return !this.buttelList.some((a) => a.text === it.text);
    });
    return l2[0];
  }

  async addButtel(material) {
    const l = await bluesea.getNeedLearnList();
    // 过滤掉非学习清单中的单词
    this.buttelList = this.buttelList.filter((it) => {
      return l.some((a) => a.text === it.text);
    });
    this.buttelList.push(material);
  }
  async delButtel(material) {
    const i = this.buttelList.findIndex((it) => it.text === material.text);
    this.buttelList.splice(i, 1);
  }

  async makeBullet(material) {
    const buttelRoot = document.createElement('div');
    buttelRoot.classList.add('bluesea', 'bluesea-bullet-screens');
    buttelRoot.style.userSelect = 'none';
    document.body.appendChild(buttelRoot);
    makeBulletApp(buttelRoot, {
      bulletSpeed: this.config['单词弹幕速度'] || 10, //可能存在未更新配置的用户，后续将删除默认值
      autoAudio: this.config['自动发音'],
      material,
      onOperate: (flag) => {
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

    this.addButtel(material);
  }

  async start() {
    this.timer = setInterval(async () => {
      this.config = await this.getConfig();
      const material = await this.getOneMaterial();
      if (!material) {
        return;
      }
      if (this.buttelList.length > this.config['单词弹幕数量上限']) {
        return;
      }
      this.makeBullet(material);
    }, 3000);
  }
  clear() {
    clearInterval(this.timer);
    this.buttelList = [];
    document.querySelectorAll('.bluesea-bullet-screens').forEach((it) => {
      render(null, it);
      it.parentNode.removeChild(it);
    });
  }
}

const buttelScreens = new ButtelScreens();

const listenVisibilitychange = () => {
  if (document.visibilityState === 'visible') {
    buttelScreens.start();
  } else {
    buttelScreens.clear();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  funCtrl.run(
    '单词弹幕域名黑名单',
    () => {
      document.addEventListener('visibilitychange', listenVisibilitychange);
      if (window.self === window.top) {
        buttelScreens.start();
      }
    },
    () => {
      document.removeEventListener('visibilitychange', listenVisibilitychange);
      buttelScreens.clear();
    }
  );
});
