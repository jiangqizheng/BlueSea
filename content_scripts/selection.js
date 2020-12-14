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

      // 出于节约资源考虑，默认限制翻译长句，如有需要自行修改
      if (selectText.split(' ') > 10) {
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
        onMark: async (youdao) => {
          const material = bluesea.createMaterialObj(youdao.query, youdao)
          await bluesea.addMaterialObj(material)
          selectedAxTip.clear();
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
    '划词翻译',
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
