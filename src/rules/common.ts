export const stripDiacritics = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "");

export const sanitize = (s: string) =>
  s
    .replace(/['’`´\-_.]/g, "") // removes simple punctuation
    .replace(/ß/g, "ss")
    .replace(/[^a-zñç ]+/g, ""); // only letters and spaces (keep ñ/ç until rules)

export const collapseRepeats = (s: string) => s.replace(/(.)\1+/g, "$1");
