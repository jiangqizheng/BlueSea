chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    for (var i = 0; i < details.responseHeaders.length; i++) {
      if (
        details.responseHeaders[i].name.toLowerCase() ===
        'content-security-policy'
      ) {
        details.responseHeaders[i].value = '';
      }
    }
    return {
      responseHeaders: details.responseHeaders,
    };
  },
  {
    urls: ['*://*/*'],
    types: ['main_frame', 'sub_frame'],
    // tabId,
  },
  ['blocking', 'responseHeaders']
);

// browser.webRequest.onHeadersReceived.hasListener()
// browser.webRequest.onHeadersReceived.removeListener(callback);

// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   chrome.browsingData.remove({}, { serviceWorkers: true }, () => {});
// });