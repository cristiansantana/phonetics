// Simple rules for Italian
// Note: oriented to tolerant searching, not strict IPA transcription.

export const itRules: [RegExp, string][] = [
  // preserve combinations before deleting single h
  [/gli/g, "y"], // 'gli' v ~ 'ʎ' -> y
  [/gn/g, "ny"], // gn -> ny
  [/(sch)([e|i])/g, "sk$2"], // sche/schi ~ 'ske/ski'
  [/(sc)([e|i])/g, "sh$2"], // sce/sci ~ 'she/shi'
  [/(ch)([e|i])/g, "k$2"], // che/chi ~ 'ke/ki'
  [/(c)([e|i])/g, "x$2"], // ce/ci ~ 'tʃ' -> x
  [/(gh)([e|i])/g, "g$2"], // ghe/ghi -> ge/gi strong
  [/qu/g, "kw"],
  [/h/g, ""], // rest of h => silent

  // z and s sometimes sounded; we neutralize
  [/zz/g, "z"],
  [/z/g, "s"],

  // explicit x already used as 'tʃ' marking
];
