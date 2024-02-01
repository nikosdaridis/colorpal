interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): ColorRGB;
function hexToRgb(hex: string, returnType: "string"): string;
function hexToRgb(
  hex: string,
  returnType?: "string" | "ColorRGB"
): string | ColorRGB {
  const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    .exec(hex)
    ?.map((val) => parseInt(val, 16)) || [0, 0, 0];

  return returnType === "string" ? `rgb(${r}, ${g}, ${b})` : { r, g, b };
}

function hexToHsl(hex: string): ColorHSL {
  return rgbToHsl(hexToRgb(hex), "ColorHSL");
}

function rgbToHex(rgb: ColorRGB): string {
  const toHex = (num: number) => Math.round(num).toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toLowerCase();
}

function rgbToHsl(rgb: ColorRGB): string;
function rgbToHsl(rgb: ColorRGB, returnType: "ColorHSL"): ColorHSL;
function rgbToHsl(
  rgb: ColorRGB,
  returnType?: "ColorHSL" | "string"
): string | ColorHSL {
  const normalizedRgb = normalizeRgb(rgb);
  const max = Math.max(normalizedRgb.r, normalizedRgb.g, normalizedRgb.b);
  const min = Math.min(normalizedRgb.r, normalizedRgb.g, normalizedRgb.b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case normalizedRgb.r:
        h =
          (normalizedRgb.g - normalizedRgb.b) / d +
          (normalizedRgb.g < normalizedRgb.b ? 6 : 0);
        break;
      case normalizedRgb.g:
        h = (normalizedRgb.b - normalizedRgb.r) / d + 2;
        break;
      case normalizedRgb.b:
        h = (normalizedRgb.r - normalizedRgb.g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return returnType === "ColorHSL" ? { h, s, l } : `hsl(${h}, ${s}%, ${l}%)`;
}

function rgbToHsv(rgb: ColorRGB): string {
  const normalizedRgb = normalizeRgb(rgb);
  let v = Math.max(normalizedRgb.r, normalizedRgb.g, normalizedRgb.b);
  const diff = v - Math.min(normalizedRgb.r, normalizedRgb.g, normalizedRgb.b);

  const diffc = (c: number) => (v - c) / 6 / diff + 1 / 2;
  const rr = diffc(normalizedRgb.r),
    gg = diffc(normalizedRgb.g),
    bb = diffc(normalizedRgb.b);

  let h, s;

  if (v === 0) {
    h = s = 0;
  } else {
    if (diff === 0) {
      h = 0;
    } else {
      if (normalizedRgb.r === v) h = bb - gg;
      else if (normalizedRgb.g === v) h = 1 / 3 + rr - bb;
      else if (normalizedRgb.b === v) h = 2 / 3 + gg - rr;

      h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
    }

    s = diff === 0 ? 0 : Math.round((diff / v) * 100);
  }

  h = Math.round(h * 360);
  s = Math.round(s);
  v = Math.round(v * 100);

  return `hsv(${h}, ${s}%, ${v}%)`;
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    function hueToRgb(p: number, q: number, t: number): number {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      return t < 1 / 6
        ? p + (q - p) * 6 * t
        : t < 1 / 2
        ? q
        : t < 2 / 3
        ? p + (q - p) * (2 / 3 - t) * 6
        : p;
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return `#${Math.round(r * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(g * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(b * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

function normalizeRgb(rgb: ColorRGB) {
  return { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 };
}
