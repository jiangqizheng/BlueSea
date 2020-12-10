const filesInDirectory = (dir) => {
  return new Promise((resolve) => {
    dir.createReader().readEntries((entries) => {
      Promise.all(
        entries
          .filter((e) => e.name[0] !== '.')
          .map((entrie) =>
            entrie.isDirectory
              ? filesInDirectory(entrie)
              : new Promise((resolve2) => entrie.file(resolve2))
          )
      )
        .then((files) => [].concat(...files))
        .then(resolve);
    });
  });
};

const timestampForFilesInDirectory = (dir) => {
  return filesInDirectory(dir).then((files) =>
    files.map((f) => f.name + f.lastModifiedDate).join()
  );
};

const reload = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // NB: see https://github.com/xpl/crx-hotreload/issues/5

    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
    }

    chrome.runtime.reload();
  });
};

const watchChanges = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then((timestamp) => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
    } else {
      reload();
    }
  });
};

chrome.management.getSelf((self) => {
  if (self.installType === 'development') {
    // console.log('初始化脚本:', Date());
    chrome.runtime.getPackageDirectoryEntry((dir) => watchChanges(dir));
  }
});
