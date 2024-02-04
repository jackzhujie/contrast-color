type RgbaColor = { r: number; g: number; b: number; a: number; l: number };
let colorCache = new Map<string, string>();
/**
 * 计算背景与容器背景的对比度
 * @param backgroundColor 背景色
 * @param containerBackgroundColor 容器颜色
 */
export default (backgroundColor: string, containerBackgroundColor = 'white') => {
  const key = `${backgroundColor}-${containerBackgroundColor}`;
  if (colorCache.has(key)) return colorCache.get(key);

  // 报错缓存并返回数据
  function saveAndReturn(brightness: number = 1) {
    const calculateTextColor = brightness > 0.5 ? '#000' : '#fff';
    colorCache.set(key, calculateTextColor);
    return calculateTextColor;
  }

  // 特殊情况都是黑，透明背景当做白色来对比
  if (backgroundColor === '' || backgroundColor === undefined || backgroundColor === null) return saveAndReturn();
  // 将颜色解析为RGBA格式
  const rgbaColor = parseColor(backgroundColor);
  const containerRGBAColor = parseColor(containerBackgroundColor);
  // 如果颜色是透明的，可以根据实际情况进行处理
  if (rgbaColor.a < 1) {
    // 处理透明色的情况，比如选择一个与容器背景色对比度较大的文字颜色
    const contrastColor =
      containerRGBAColor.l > 0.5
        ? { r: 0, g: 0, b: 0, a: 1, l: 0 }
        : {
            r: 255,
            g: 255,
            b: 255,
            a: 1,
            l: 0,
          };
    const finalColor = blendColors(contrastColor, rgbaColor, rgbaColor.a);
    return saveAndReturn(finalColor.a);
  }

  // 计算亮度（brightness）
  const brightness = (0.299 * rgbaColor.r + 0.587 * rgbaColor.g + 0.114 * rgbaColor.b) / 255;
  // 根据亮度选择文字颜色
  return saveAndReturn(brightness);
};

// 辅助函数：混合两个颜色
function blendColors(foregroundColor: RgbaColor, backgroundColor: RgbaColor, alpha: number) {
  const blend = (c1: number, c2: number, alpha: number) => Math.round(c1 + (c2 - c1) * alpha);
  return {
    r: blend(backgroundColor.r, foregroundColor.r, alpha),
    g: blend(backgroundColor.g, foregroundColor.g, alpha),
    b: blend(backgroundColor.b, foregroundColor.b, alpha),
    a: alpha,
  };
}

// 辅助函数：解析颜色字符串为RGBA格式
function parseColor(color: string) {
  const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  const rgbaRegex = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/;

  if (hexRegex.test(color)) {
    // 处理HEX格式的颜色
    return hexToRGBA(color + color.substring(1));
  } else if (rgbRegex.test(color)) {
    // 处理RGB格式的颜色
    const [, r, g, b] = color.match(rgbRegex)!.map(Number);
    return { r, g, b, a: 1, l: (0.299 * r + 0.587 * g + 0.114 * b) / 255 };
  } else if (rgbaRegex.test(color)) {
    // 处理RGBA格式的颜色
    const [, r, g, b, a] = color.match(rgbaRegex)!.map(Number);
    return { r, g, b, a, l: (0.299 * r + 0.587 * g + 0.114 * b) / 255 };
  } else {
    // 处理命名颜色
    const namedColors = {
      black: { r: 0, g: 0, b: 0, a: 1, l: 0 },
      white: { r: 255, g: 255, b: 255, a: 1, l: 1 },
      red: { r: 255, g: 0, b: 0, a: 1, l: 0.2126 },
      green: { r: 0, g: 128, b: 0, a: 1, l: 0.7152 },
      blue: { r: 0, g: 0, b: 255, a: 1, l: 0.0722 },
      yellow: { r: 255, g: 255, b: 0, a: 1, l: 0.9278 },
      orange: { r: 255, g: 165, b: 0, a: 1, l: 0.3932 },
      purple: { r: 128, g: 0, b: 128, a: 1, l: 0.2126 },
      pink: { r: 255, g: 182, b: 193, a: 1, l: 0.5647 },
      brown: { r: 165, g: 42, b: 42, a: 1, l: 0.1686 },
      gray: { r: 128, g: 128, b: 128, a: 1, l: 0.5 },
      lightgray: { r: 211, g: 211, b: 211, a: 1, l: 0.8275 },
      darkgray: { r: 169, g: 169, b: 169, a: 1, l: 0.3333 },
      silver: { r: 192, g: 192, b: 192, a: 1, l: 0.5019 },
      gold: { r: 255, g: 215, b: 0, a: 1, l: 0.6372 },
      navy: { r: 0, g: 0, b: 128, a: 1, l: 0.0352 },
      olive: { r: 128, g: 128, b: 0, a: 1, l: 0.2159 },
      teal: { r: 0, g: 128, b: 128, a: 1, l: 0.139 },
      maroon: { r: 128, g: 0, b: 0, a: 1, l: 0.0722 },
      lime: { r: 0, g: 255, b: 0, a: 1, l: 0.7152 },
    };
    if (namedColors[color as keyof typeof namedColors]) return namedColors[color as keyof typeof namedColors];
  }
  // 默认返回黑色
  return { r: 0, g: 0, b: 0, a: 1, l: 0 };
}

// 辅助函数：将HEX格式的颜色转换为RGBA格式
function hexToRGBA(hex: string) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b, a: 1, l: (0.299 * r + 0.587 * g + 0.114 * b) / 255 };
}

export function destroy() {
  colorCache.clear();
}
