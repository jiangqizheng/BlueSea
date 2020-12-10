const inBlackEl = (el) => {
  const blackElList = ['pre', 'code'].map((it) => it.toUpperCase());
  if (!el.parentNode) {
    return false;
  }

  if (blackElList.includes(el.nodeName)) {
    return true;
  } else {
    return inBlackEl(el.parentNode);
  }
};

let lastText = '';

const listenMouseup = (e) => {
  if (isYTL(e.target)) {
    return;
  }
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (!range.collapsed) {
      const selectText = selection.toString().trim();

      if (lastText === selectText) {
        lastText = '';
        return;
      }

      if (selectText.split(' ') > 30) {
        // console.log('太长不翻译');
        return;
      }

      if (selectText === '' || !/^[^\u4e00-\u9fa5]+$/.test(selectText)) {
        // console.log('空或者是中文，不进行展开');
        return;
      }

      // 开始和边界不在黑名单标签内
      if (inBlackEl(range.startContainer) || inBlackEl(range.endContainer)) {
        // console.log('选中的内容存在特殊标签内，不展开');
        return;
      }
      const rangeRect = range.getBoundingClientRect();

      selectedAxTip.render(rangeRect, {
        text: selectText,
        onMark: async (tf) => {
          const text = tf.returnPhrase ? tf.returnPhrase[0] : tf.query;
          const l = await bluesea.getMaterials();
          const isExist = l.find((it) => it.text === text);
          if (isExist) {
            selectedAxTip.clear();
            return;
          }
          const material = {
            text,
            translation: tf.translation[0],
            ctime: dayjs().format(),
            learn: bluesea.createLearnObj(),
            // 保留完整数据，后面可能会使用
            youdao: tf,
          };
          await materialsDB.set([...l, material]);
          selectedAxTip.clear();
          highlighter.render()
        },
      });
    }
  }
};

const listenMousedown = (e) => {
  if (isYTL(e.target)) {
    return;
  }
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    lastText = selection.toString().trim();
  }
  axTip.clear()
  selectedAxTip.clear();
};

document.addEventListener('DOMContentLoaded', () => {
  funCtrl.run(
    '划词高亮域名黑名单',
    () => {
      document.addEventListener('mouseup', listenMouseup);
      document.addEventListener('mousedown', listenMousedown);
    },
    () => {
      selectedAxTip.clear();
      document.removeEventListener('mouseup', listenMouseup);
      document.removeEventListener('mousedown', listenMousedown);
    }
  );
});
