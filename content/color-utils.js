function parseColor(color) {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      return [
        parseInt(hex.slice(0, 2), 
        parseInt(hex.slice(2, 4),
        parseInt(hex.slice(4, 6))
      ].map(v => v / 255);
    }
    
    if (color.startsWith('rgb')) {
      return color.match(/\d+/g).map(Number).slice(0, 3)
        .map(v => v / 255);
    }
    
    return [0, 0, 0]; // Fallback
  }
  
  function getLuminance(rgb) {
    const [r, g, b] = rgb.map(v => 
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  
  export function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(parseColor(color1));
    const lum2 = getLuminance(parseColor(color2));
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    return ratio.toFixed(2);
  }
  
  export function getContrastColor(bgColor) {
    const luminance = getLuminance(parseColor(bgColor));
    return luminance > 0.179 ? '#000000' : '#ffffff';
  }