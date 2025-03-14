document.addEventListener('DOMContentLoaded', () => {
    const trackUsage = document.getElementById('trackUsage');
    const showPreview = document.getElementById('showPreview');
    const saveBtn = document.getElementById('saveBtn');
  
    // Load saved settings
    chrome.storage.sync.get(['trackUsage', 'showPreview'], (data) => {
      trackUsage.checked = data.trackUsage || false;
      showPreview.checked = data.showPreview !== undefined ? data.showPreview : true;
    });
  
    // Save settings
    saveBtn.addEventListener('click', () => {
      chrome.storage.sync.set({
        trackUsage: trackUsage.checked,
        showPreview: showPreview.checked
      }, () => {
        alert('Settings saved!');
      });
    });
  });