// Unified storage manager (content/storage.js)
const StorageManager = {
    async get(key) {
      const useSync = await this._shouldUseSync();
      return new Promise(resolve => {
        chrome.storage[useSync ? 'sync' : 'local'].get(key, resolve);
      });
    },
  
    async set(data) {
      const useSync = await this._shouldUseSync();
      return new Promise(resolve => {
        chrome.storage[useSync ? 'sync' : 'local'].set(data, resolve);
      });
    },
  
    async _shouldUseSync() {
      const { enableSync } = await new Promise(resolve => {
        chrome.storage.local.get('enableSync', resolve);
      });
      return !!enableSync;
    }
  };