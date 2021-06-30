export const isYTL = (el) => {
  if (!el) {
    return false;
  }
  if (!el.classList || !el.parentNode) {
    return false;
  }
  if (el.classList.contains('bluesea')) {
    return true;
  } else {
    if (el.parentNode && el.parentNode.classList) {
      return isYTL(el.parentNode);
    } else {
      return false;
    }
  }
};

// 在某个元素内
export const inEl = (el, elNames = []) => {
  if (!el || !el.nodeName) {
    return false;
  }
  if (elNames.includes(el.nodeName)) {
    return true;
  }
  return inEl(el.parentNode, elNames);
};
