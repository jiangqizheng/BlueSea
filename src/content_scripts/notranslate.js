// 为所有代码相关的dom节点增加notranslate，阻止chrome翻译代码
document.addEventListener('DOMContentLoaded', () => {
  // const config = { attributes: false, childList: true, subtree: true };
  // const observer = new MutationObserver(() => {
    const f = () => {
      const preList = document.querySelectorAll('pre');
      preList.forEach((el) => {
        el.setAttribute('translate', 'no');
        el.classList.add('notranslate');
      });
    }

    f()

    setInterval(f, 2000)

  // });
  // observer.observe(document, config);
});
