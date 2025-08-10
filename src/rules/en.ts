// Simple rules for English
// Note: oriented to tolerant searching, not strict IPA transcription.

export const enRules: [RegExp, string][] = [
  // digraphs before single letters
  [/ph/g, "f"],
  [/ck/g, "k"],
  [/kn/g, "n"],
  [/wr/g, "r"],
  [/wh/g, "w"],
  [/qu/g, "kw"],
  [/ch/g, "ch"],
  [/sh/g, "sh"],
  [/th/g, "t"], // neutralized th

  // sequences with gh/ough/eigh (simplified)
  [/eigh/g, "ei"],
  [/ough/g, "o"],
  [/augh/g, "a"],
  [/gh/g, ""], // most ghs are silent or /f/; we simplify to nothing

  // remove final silent 'e'
  [/e\b/g, ""],

  // various normalizations
  [/x/g, "ks"], // x ~ ks
  [/h(?![rwl])/g, ""], // h is sometimes silent (kept in wh, ch, sh)
];
