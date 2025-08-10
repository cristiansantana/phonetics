// Simple rules for French
// Note: oriented to tolerant searching, not strict IPA transcription.

export const frRules: [RegExp, string][] = [
  // Digraphs and compound vowels
  [/eau/g, "o"],
  [/\bau(x)?\b/g, "o"], // au/aux -> o
  [/(ai|ei)/g, "e"],
  [/ou/g, "u"],
  [/oi/g, "wa"],
  [/ch/g, "sh"],
  [/gn/g, "ny"],
  [/qu/g, "k"],
  [/h/g, ""], // mute h
  [/ç/g, "s"],

  // common silent endings
  [/[stdxp]\b/g, ""],

  // 'ille' -> 'iy' (p. ej., fille ~ 'fiy')
  [/ille\b/g, "iy"],
];
