let isActive = false;
let tooltip = null;
let fontHistory = [];
let lastPosition = null;

const MAX_HISTORY = 20;

const updateTooltip = throttle((e) => {
    if (!isActive) return;
    // Existing logic
  }, 50);


chrome.runtime.onMessage.addListener((message) => {
  isActive = message.active;
  if (!isActive) removeTooltip();
});

function createTooltip(element, styles) {
  const rect = element.getBoundingClientRect();
  tooltip = document.createElement('div');
  tooltip.className = 'font-tooltip';
  
  tooltip.innerHTML = `
    <div class="font-property">
      <span class="label">Font:</span>
      <span class="value">${styles.fontFamily}</span>
    </div>
    <div class="font-property">
      <span class="label">Size:</span>
      <span class="value">${styles.fontSize}</span>
    </div>
    <div class="font-property">
      <span class="label">Weight:</span>
      <span class="value">${styles.fontWeight}</span>
    </div>
    <div class="font-property">
      <span class="label">Color:</span>
      <span class="value" style="color:${styles.color}">${styles.color}</span>
    </div>
  `;

  tooltip.style.position = 'absolute';
  tooltip.style.top = `${rect.top + window.scrollY - 30}px`;
  tooltip.style.left = `${rect.left + window.scrollX + 10}px`;
  
  document.body.appendChild(tooltip);
}

function removeTooltip() {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
}

document.addEventListener('mousemove', (e) => {
  if (!isActive) return;
  
  const element = document.elementFromPoint(e.clientX, e.clientY);
  if (element && element !== tooltip) {
    const styles = window.getComputedStyle(element);
    if (tooltip) removeTooltip();
    createTooltip(element, {
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      color: styles.color
    });
  }
});

document.addEventListener('mousemove', updateTooltip);

    // Use CSS containments
    .font-tooltip {
    contain: strict;
    will-change: transform;
    }

    // Virtualize history lists
    class VirtualList {
    constructor(container, items, renderItem) {
        // Implement virtualization
    }
    }

document.addEventListener('click', (e) => {
  if (isActive && tooltip) e.preventDefault();
});

function enhanceTooltip(element, styles) {
    // Font Preview Section
    const preview = document.createElement('div');
    preview.className = 'font-preview';
    preview.style.fontFamily = styles.fontFamily;
    preview.textContent = 'Sample Text 123';
    
    // Contrast Ratio Calculation
    const bgColor = getContrastColor(styles.backgroundColor);
    const contrastRatio = getContrastRatio(styles.color, bgColor);
    
    // Service Integration
    const serviceLinks = getFontServiceLinks(styles.fontFamily);
  
    // Add to tooltip HTML
    tooltip.innerHTML += `
      <div class="font-property">
        <span class="label">Preview:</span>
        <div class="preview-box">${preview.outerHTML}</div>
      </div>
      <div class="font-property">
        <span class="label">Contrast:</span>
        <span class="value">${contrastRatio}:1</span>
      </div>
      <div class="service-links">${serviceLinks}</div>
      <div class="tooltip-actions">
        <button class="copy-css">Copy CSS</button>
        <button class="bookmark-font">★ Bookmark</button>
      </div>
    `;
  
    // Add interaction handlers
    tooltip.querySelector('.copy-css').addEventListener('click', () => {
      copyToClipboard(`font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  color: ${styles.color};`);
    });
  
    tooltip.querySelector('.bookmark-font').addEventListener('click', () => {
      chrome.runtime.sendMessage({
        action: 'bookmarkFont',
        font: styles.fontFamily,
        details: styles
      });
    });
  
    // Update history
    fontHistory.unshift({
      font: styles.fontFamily,
      time: new Date().toISOString(),
      styles
    });
    fontHistory = fontHistory.slice(0, MAX_HISTORY);
    chrome.storage.local.set({ fontHistory });
  }
  
  // Contrast utilities
  function getContrastRatio(color1, color2) {
    // Implement WCAG contrast calculation
  }
  
  function getContrastColor(bgColor) {
    // Get appropriate contrasting text color
  }
  
  function getFontServiceLinks(fontFamily) {
    // Generate service links
    return `
      <a href="https://fonts.google.com/?query=${encodeURIComponent(fontFamily)}" 
         target="_blank" class="service-link google-fonts">
        View in Google Fonts
      </a>
      <a href="https://fonts.adobe.com/fonts/${encodeURIComponent(fontFamily)}"
         target="_blank" class="service-link adobe-fonts">
        View in Adobe Fonts
      </a>
    `;
  }

  // Add to content.js
function getAccessibilityInfo(element, styles) {
    const contrast = getContrastRatio(styles.color, styles.backgroundColor);
    const fontSize = parseFloat(styles.fontSize);
    const lineHeight = parseFloat(styles.lineHeight) || fontSize * 1.2;
    
    return {
      contrastRating: contrast >= 4.5 ? 'AA' : contrast >= 7 ? 'AAA' : 'Fail',
      readableSize: fontSize >= 16 ? 'Good' : 'Consider increasing',
      lineHeightRating: lineHeight/fontSize >= 1.5 ? 'Good' : 'Could improve'
    };
  }