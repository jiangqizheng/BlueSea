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