/**
 * Capitalizes the first letter of each word in a given string.
 *
 * @param input - The string to be transformed.
 * @returns The transformed string with each word capitalized.
 */
export function capitalizeWords(input: string): string {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Formats a number into a string representation with appropriate suffixes.
 *
 * - Numbers greater than or equal to 1,000,000 are formatted with an "M" suffix.
 * - Numbers greater than or equal to 1,000 but less than 1,000,000 are formatted with a "K" suffix.
 * - Numbers less than 1,000 are returned as-is.
 *
 * @param num - The number to format.
 * @returns The formatted number as a string.
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}
