export function capitalizeWords(input: string): string {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatNumber(num: number | null): string {
  if (num === null) {
    return "";
  }

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

export function formatNumberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * A mapping of theme color names to their corresponding hex values.
 *
 * This object is used to convert Tailwind CSS theme color names to their
 * respective hexadecimal color codes.
 *
 * @example
 * ```typescript
 * import { themeTailwindColorsToHex } from './converters';
 *
 * const hexColor = themeTailwindColorsToHex['golden-yellow']; // "#D8A114"
 * ```
 *
 * @typeParam {Object.<string, string>} - An object where the keys are color names and the values are hex color codes.
 */
export const themeTailwindColorsToHex: { [key: string]: string } = {
  "almost-white": "#F9F9F9",
  "almost-black": "#151515",
  "silver-gray": "#333333",
  "golden-yellow": "#D8A114",
  "golden-yellow-dark": "#C99103",
  "golden-yellow-darker": "#A97E03",
  "golden-yellow-light": "#E0B21B",
  "golden-yellow-lighter": "#E9C02F",
  "silver-gray-light": "#3b3b3b",
  "silver-gray-lighter": "#666666",
  "silver-gray-lightest": "#999999",
  "silver-gray-dark": "#262626",
  "silver-gray-darker": "#1a1a1a",
  "silver-gray-darkest": "#0d0d0d",
  "silver-gray-black": "#000000"
};

/**
 * Determines the appropriate text color (either "text-almost-black" or "text-almost-white")
 * based on the contrast of the given RGB color values using the YIQ color space.
 *
 * @param {Object} param0 - An object containing the RGB color values.
 * @param {number} param0.r - The red component of the color (0-255).
 * @param {number} param0.g - The green component of the color (0-255).
 * @param {number} param0.b - The blue component of the color (0-255).
 * @returns {string} - Returns "text-almost-black" if the YIQ value is >= 128, otherwise "text-almost-white".
 */
export function getContrastYIQ({ r, g, b }: { r: number; g: number; b: number }) {
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "text-almost-black" : "text-almost-white";
}

/**
 * Converts a hexadecimal color code to an RGB color object.
 *
 * @param {string} hex - The hexadecimal color code (e.g., "#FFFFFF").
 * @returns {{ r: number, g: number, b: number }} An object containing the red, green, and blue color values.
 */
export function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
