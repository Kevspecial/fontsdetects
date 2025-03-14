// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "detectFonts") {
    const fonts = detectAllFonts();
    sendResponse({ fonts });
  }
  return true;
});

function detectAllFonts() {
  const elements = document.querySelectorAll('*');
  const fontSet = new Set();

  elements.forEach(element => {
    const style = window.getComputedStyle(element);
    const fontFamily = style.fontFamily.replace(/["']/g, '');
    const fontSize = style.fontSize;
    const fontWeight = style.fontWeight;
    
    if (fontFamily && fontFamily !== 'inherit') {
      fontSet.add(`${fontFamily} | ${fontSize} | ${fontWeight}`);
    }
  });

  return Array.from(fontSet);
}