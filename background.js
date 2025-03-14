let active = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle') {
    active = message.active;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { active });
    });
  }
  
  if (message.action === 'getState') {
    sendResponse({ active });
  }
  return true;
});

// Add to existing background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle new actions
    switch(message.action) {
      case 'bookmarkFont':
        handleBookmark(message.font, message.details);
        break;
        
      case 'getFontDetails':
        getFontDetails(message.fontFamily).then(sendResponse);
        return true;
        
      case 'getHistory':
        chrome.storage.local.get('fontHistory', ({ fontHistory }) => {
          sendResponse(fontHistory || []);
        });
        return true;
    }
  });
  
  async function getFontDetails(fontFamily) {
    try {
      const [googleResponse, adobeResponse] = await Promise.allSettled([
        fetch(`https://www.googleapis.com/webfonts/v1/webfonts?family=${fontFamily}`),
        fetch(`https://typekit.com/api/v1/json/families/${fontFamily}/`)
      ]);
  
      const results = {
        google: { error: null, data: null },
        adobe: { error: null, data: null }
      };
  
      if (googleResponse.status === 'fulfilled') {
        if (googleResponse.value.ok) {
          results.google.data = await googleResponse.value.json();
        } else {
          results.google.error = `Google API: ${googleResponse.value.status}`;
        }
      }
  
      if (adobeResponse.status === 'fulfilled') {
        if (adobeResponse.value.ok) {
          results.adobe.data = await adobeResponse.value.json();
        } else {
          results.adobe.error = `Adobe API: ${adobeResponse.value.status}`;
        }
      }
  
      return results;
    } catch (error) {
      console.error('Font detail error:', error);
      return { 
        error: 'Service temporarily unavailable',
        retryAfter: 60 // Seconds
      };
    }
  }
  
  function handleBookmark(font, details) {
    chrome.storage.sync.get(['bookmarks'], ({ bookmarks = [] }) => {
      const newBookmarks = [...bookmarks, { font, details, timestamp: Date.now() }];
      chrome.storage.sync.set({ bookmarks: newBookmarks });
    });
  }