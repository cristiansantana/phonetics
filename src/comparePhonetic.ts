import { phoneticKey } from "./phoneticKey";
import type { ISO639_1 } from "./types";

export type CompareMode = "total" | "a-in-b" | "b-in-a";

/** Tokenize a string into words (Unicode letters only) */
function tokenize(text: string): string[] {
  if (!text) return [];
  const words = text.match(/\p{L}+/gu) || [];
  return words.map((w) => w.toLowerCase());
}

/** Convert an array into a multiset (map key -> count) */
function toMultiSet(keys: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const k of keys) m.set(k, (m.get(k) || 0) + 1);
  return m;
}

/** Intersection size of two multisets (sum of min counts) */
function multisetIntersectionSize(
  a: Map<string, number>,
  b: Map<string, number>
): number {
  let total = 0;
  for (const [k, ca] of a) total += Math.min(ca, b.get(k) || 0);
  return total;
}

/** Union size of two multisets (sum of max counts) */
function multisetUnionSize(
  a: Map<string, number>,
  b: Map<string, number>
): number {
  const keys = new Set([...a.keys(), ...b.keys()]);
  let total = 0;
  for (const k of keys) total += Math.max(a.get(k) || 0, b.get(k) || 0);
  return total;
}

/** Generate phonetic keys per word */
function keysPerWord(text: string, lang: ISO639_1): string[] {
  const words = tokenize(text);
  return words.map((w) => phoneticKey(w, lang)).filter((k) => k.length > 0);
}

/** Round a number to two decimal places */
function round2(value: number) {
  return Number(value.toFixed(2));
}

/**
 * Compare two strings using per-word phonetic keys.
 *
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @param {ISO639_1} lang - ISO 639-1 language code.
 * @param {CompareMode} [mode='total'] - Comparison mode:
 *   - `'total'`: symmetric Jaccard over multisets (intersection / union) × 100
 *   - `'a-in-b'`: coverage of A in B (intersection / |A|) × 100
 *   - `'b-in-a'`: coverage of B in A (intersection / |B|) × 100
 * @param {boolean} [orderMatters=false] - If true, compares words positionally instead of as a bag of words.
 * @returns {number} A float in the range 0..100 with two decimal precision.
 */
export const comparePhonetic = (
  a: string,
  b: string,
  lang: ISO639_1,
  mode: CompareMode = "total",
  orderMatters: boolean = false
): number => {
  const aKeys = keysPerWord(a, lang);
  const bKeys = keysPerWord(b, lang);

  // Empty cases
  // If both inputs are empty, treat them as perfectly equal
  if (aKeys.length === 0 && bKeys.length === 0) return 100.0;

  // For containment modes, an empty reference cannot be covered
  if (mode === "a-in-b" && aKeys.length === 0) return 0.0;
  if (mode === "b-in-a" && bKeys.length === 0) return 0.0;

  // Positional comparison when order matters
  if (orderMatters) {
    let matches = 0;
    const minLen = Math.min(aKeys.length, bKeys.length);

    if (mode === "total") {
      for (let i = 0; i < minLen; i++) {
        if (aKeys[i] === bKeys[i]) matches++;
      }
      return round2((matches / Math.max(aKeys.length, bKeys.length)) * 100);
    }

    if (mode === "a-in-b") {
      for (let i = 0; i < aKeys.length && i < bKeys.length; i++) {
        if (aKeys[i] === bKeys[i]) matches++;
      }
      return round2((matches / aKeys.length) * 100);
    }

    if (mode === "b-in-a") {
      for (let i = 0; i < bKeys.length && i < aKeys.length; i++) {
        if (bKeys[i] === aKeys[i]) matches++;
      }
      return round2((matches / bKeys.length) * 100);
    }
  }

  // Bag-of-words comparison (order does not matter)
  const aMS = toMultiSet(aKeys);
  const bMS = toMultiSet(bKeys);
  const inter = multisetIntersectionSize(aMS, bMS);

  if (mode === "total") {
    const uni = multisetUnionSize(aMS, bMS);
    return round2(uni === 0 ? 0 : (inter / uni) * 100);
  }
  if (mode === "a-in-b") {
    return round2((inter / aKeys.length) * 100);
  }
  if (mode === "b-in-a") {
    return round2((inter / bKeys.length) * 100);
  }

  return 0;
};
