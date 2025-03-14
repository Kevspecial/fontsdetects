document.getElementById('toggle').addEventListener('change', (e) => {
    const active = e.target.checked;
    chrome.runtime.sendMessage({ action: 'toggle', active });
    document.getElementById('status').textContent = active ? 'Active' : 'Inactive';
  });
  
  // Get initial state
  chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
    document.getElementById('toggle').checked = response.active;
    document.getElementById('status').textContent = response.active ? 'Active' : 'Inactive';
  });