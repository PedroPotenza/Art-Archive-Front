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
