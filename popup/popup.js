document.addEventListener('DOMContentLoaded', () => {
  const fontsList = document.getElementById('fontsList');
  const copyBtn = document.getElementById('copyBtn');
  const refreshBtn = document.getElementById('refreshBtn');

  function getFonts() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "detectFonts" },
        (response) => {
          if (chrome.runtime.lastError) {
            fontsList.innerHTML = '<p>Error detecting fonts. Refresh the page.</p>';
            return;
          }
          displayFonts(response?.fonts || []);
        }
      );
    });
  }

  function displayFonts(fonts) {
    fontsList.innerHTML = '';
    if (fonts.length === 0) {
      fontsList.innerHTML = '<p>No fonts detected</p>';
      return;
    }

    fonts.forEach(font => {
      const [family, size, weight] = font.split(' | ');
      const div = document.createElement('div');
      div.className = 'font-item';
      div.innerHTML = `
        <div class="font-preview" style="font-family: ${family}">Aa</div>
        <div class="font-details">
          <div class="font-family">${family}</div>
          <div class="font-meta">${size} • ${weight}</div>
        </div>
      `;
      fontsList.appendChild(div);
    });
  }

  copyBtn.addEventListener('click', async () => {
    const fonts = Array.from(document.querySelectorAll('.font-family'))
      .map(item => item.textContent).join('\n');
    
    try {
      await navigator.clipboard.writeText(fonts);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy List', 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });

  refreshBtn.addEventListener('click', getFonts);
  getFonts(); // Initial load
});