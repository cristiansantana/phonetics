// Simple rules for Spanish
// Note: oriented to tolerant searching, not strict IPA transcription.

export const esRules: [RegExp, string][] = [
  // digraphs and special cases first
  [/(g)(u)(?=[ei])/g, "g"], // gue/gui -> ge/gi (mute u)
  [/(q)(u)(?=[ei])/g, "k"], // que/qui -> ke/ki
  [/ch/g, "x"], // "ch" -> x (unique mark)
  [/ll/g, "y"], // "ll" -> y
  [/ñ/g, "ny"], // "ñ" -> ny

  // sound equivalences
  [/j([ei])/g, "x$1"], // j(e/i) -> x + vowel
  [/(^|[^g])ge/g, "$1xe"], // ge -> xe (soft g)
  [/(^|[^g])gi/g, "$1xi"], // gi -> xi
  [/z/g, "s"], // z -> s
  [/(^|[^s])c([ei])/g, "$1s$2"], // ce/ci -> se/si
  [/h/g, ""], // mute h
  [/v/g, "b"], // v ~ b
  [/w/g, "b"], // w ~ b
  [/rr/g, "r"], // collapses strong r to r
  [/y$/g, "i"], // 'y' vowel at the end to 'i' (soft simplification)
];
