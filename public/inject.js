window.bluesea = {
  login: () => {
    window.postMessage(
      { type: 'login', payload: '' },
      '*'
    );
  },
};
