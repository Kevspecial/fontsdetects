// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set({
    trackUsage: false,
    showPreview: true
  });
});

// Optional: Track font usage statistics
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'fontUsage') {
    chrome.storage.local.get(['fontStats'], (data) => {
      const stats = data.fontStats || {};
      stats[message.font] = (stats[message.font] || 0) + 1;
      chrome.storage.local.set({ fontStats: stats });
    });
  }
});