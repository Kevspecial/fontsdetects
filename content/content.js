let isActive = false;
let tooltip = null;
let fontHistory = [];
const MAX_HISTORY = 20;

// Throttle function to prevent excessive updates
function throttle(func, limit) {
    let lastFunc, lastRan;
    return function () {
        const context = this, args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Update tooltip based on mouse movement
const updateTooltip = throttle((e) => {
    if (!isActive) return;
    const currentElement = document.elementFromPoint(e.clientX, e.clientY);
    if (currentElement && currentElement !== tooltip) {
        const styles = window.getComputedStyle(currentElement);
        if (tooltip) removeTooltip();
        createTooltip(currentElement, styles);
    }
}, 50);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
    isActive = message.active;
    if (!isActive) removeTooltip();
});

// Create tooltip element
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
    enhanceTooltip(styles);
}

// Remove tooltip from DOM
function removeTooltip() {
    if (tooltip) {
        tooltip.remove();
        tooltip = null;
    }
}

// Add event listeners
document.addEventListener('mousemove', updateTooltip);
document.addEventListener('click', (e) => {
    if (isActive && tooltip) e.preventDefault();
});

// Enhance tooltip with contrast and font preview
function enhanceTooltip(styles) {
    const preview = document.createElement('div');
    preview.className = 'font-preview';
    preview.style.fontFamily = styles.fontFamily;
    preview.textContent = 'Sample Text 123';

    const bgColor = getContrastColor(styles.backgroundColor);
    const contrastRatio = getContrastRatio(styles.color, bgColor);

    const serviceLinks = getFontServiceLinks(styles.fontFamily);

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

    // Add event listener to copy CSS
    tooltip.querySelector('.copy-css').addEventListener('click', () => {
        copyToClipboard(`
            font-family: ${styles.fontFamily};
            font-size: ${styles.fontSize};
            font-weight: ${styles.fontWeight};
            color: ${styles.color};
        `);
    });

    // Save font to history
    fontHistory.unshift({
        font: styles.fontFamily,
        time: new Date().toISOString(),
        styles
    });
    fontHistory = fontHistory.slice(0, MAX_HISTORY);
    chrome.storage.local.set({ fontHistory });
}

// Utility: Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('CSS copied to clipboard!');
    }).catch((err) => console.error('Copy failed', err));
}

// Utility: Calculate contrast ratio
function getContrastRatio(color1, color2) {
    return '4.5'; // Placeholder for actual WCAG contrast calculation
}

// Utility: Determine appropriate contrast color
function getContrastColor(bgColor) {
    return '#FFFFFF'; // Placeholder for logic to calculate contrast color
}

// Generate font service links
function getFontServiceLinks(fontFamily) {
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
