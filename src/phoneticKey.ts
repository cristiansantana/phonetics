import type { ISO639_1 } from "./types";
import { stripDiacritics, collapseRepeats, sanitize } from "./rules/common";
import { esRules } from "./rules/es";
import { enRules } from "./rules/en";
import { frRules } from "./rules/fr";
import { itRules } from "./rules/it";

type Rule = [RegExp, string];

const applyRules = (input: string, rules: Rule[]): string => {
  let out = input;
  for (const [pattern, replacement] of rules) {
    out = out.replace(pattern, replacement);
  }
  return out;
};

const vowelPass = (s: string) =>
  s
    // normalizes all vowels to a/e/i/o/u and collapses vowel runs
    .replace(/[aeiou]+/g, (m) => {
      const map: Record<string, string> = {
        a: "a",
        e: "e",
        i: "i",
        o: "o",
        u: "u",
      };
      const first = m[0];
      return map[first] ?? first;
    });

export const phoneticKey = (text: string, lang: ISO639_1): string => {
  if (!text || typeof text !== "string") return "";
  if (!["es", "en", "fr", "it"].includes(lang)) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  // Common pre-processing
  let s = stripDiacritics(text.toLowerCase());
  s = sanitize(s);

  // Rules by language
  switch (lang) {
    case "es":
      s = applyRules(s, esRules);
      break;
    case "en":
      s = applyRules(s, enRules);
      break;
    case "fr":
      s = applyRules(s, frRules);
      break;
    case "it":
      s = applyRules(s, itRules);
      break;
  }

  // Common post-processing
  s = collapseRepeats(s);
  s = vowelPass(s);
  s = collapseRepeats(s);
  return s;
};
