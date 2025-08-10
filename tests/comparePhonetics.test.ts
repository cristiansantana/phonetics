import { comparePhonetic } from "../src/comparePhonetic";

describe("comparePhonetic - total mode (bag-of-words, default)", () => {
  test("full match with typos -> 100.00", () => {
    const a = "Nueva cerveza helada";
    const b = "Nueba servesa elada";
    const score = comparePhonetic(a, b, "es", "total", false);
    expect(score).toBe(100.0);
  });

  test("partial overlap -> (0,100)", () => {
    const a = "gran cerveza artesanal";
    const b = "cerveza helada";
    const score = comparePhonetic(a, b, "es", "total", false);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  test("orderMatters=false equals orderMatters=true when order is identical", () => {
    const a = "rojo verde azul";
    const b = "rojo verde azul";
    const s1 = comparePhonetic(a, b, "es", "total", false);
    const s2 = comparePhonetic(a, b, "es", "total", true);
    expect(s1).toBe(100.0);
    expect(s2).toBe(100.0);
  });

  test("orderMatters=true penalizes word reordering", () => {
    const a = "rojo verde azul";
    const b = "verde rojo azul";
    const sNoOrder = comparePhonetic(a, b, "es", "total", false);
    const sOrder = comparePhonetic(a, b, "es", "total", true);
    expect(sNoOrder).toBe(100.0); // same bag of words
    expect(sOrder).toBeLessThan(100.0); // penalized due to different positions
  });
});

describe("comparePhonetic - a-in-b mode", () => {
  test("A contained in B -> 100.00 when orderMatters=false", () => {
    const a = "cerveza helada";
    const b = "nueva cerveza helada artesanal";
    const score = comparePhonetic(a, b, "es", "a-in-b", false);
    expect(score).toBe(100.0);
  });

  test("A contained in B but order changed -> may drop when orderMatters=true", () => {
    const a = "uno dos";
    const b = "dos uno";
    const score = comparePhonetic(a, b, "es", "a-in-b", true);
    expect(score).toBe(0.0);
  });

  test("returns float with two decimals (example ~66.67)", () => {
    const a = "rojo verde azul"; // 3 words
    const b = "rojo verde negro"; // 2 matches over |A|=3
    const score = comparePhonetic(a, b, "es", "a-in-b", false);
    expect(score).toBeCloseTo(66.67, 2);
  });
});

describe("comparePhonetic - b-in-a mode", () => {
  test("B contained in A -> 100.00 when orderMatters=false", () => {
    const a = "nueva cerveza helada artesanal";
    const b = "cerveza helada";
    const score = comparePhonetic(a, b, "es", "b-in-a", false);
    expect(score).toBe(100.0);
  });

  test("B contained in A but order changed -> may drop when orderMatters=true", () => {
    const a = "rojo verde azul";
    const b = "verde rojo";
    const score = comparePhonetic(a, b, "es", "b-in-a", true);
    expect(score).toBeLessThan(100.0);
  });

  test("returns float with two decimals (example ~66.67)", () => {
    const a = "rojo verde negro"; // 2 matches over |B|=3 below -> 66.67
    const b = "rojo verde azul";
    const score = comparePhonetic(a, b, "es", "b-in-a", false);
    expect(score).toBeCloseTo(66.67, 2);
  });
});

describe("comparePhonetic - cross-language sanity checks", () => {
  test("English: colour vs color (total)", () => {
    const score = comparePhonetic(
      "bright colour tones",
      "bright color tones",
      "en",
      "total",
      false
    );
    expect(score).toBe(100.0);
  });

  test("French: beaux vs beau (total)", () => {
    const score = comparePhonetic(
      "beaux jardins",
      "beau jardin",
      "fr",
      "total",
      false
    );
    expect(score).toBeGreaterThan(0.0);
    expect(score).toBeLessThanOrEqual(100.0);
  });

  test("Italian: acqua vs ackwa (total)", () => {
    const score = comparePhonetic(
      "acqua fresca",
      "ackwa fresca",
      "it",
      "total",
      false
    );
    expect(score).toBe(100.0);
  });
});

describe("comparePhonetic - edge cases", () => {
  test("empty vs empty -> 100.00 in total (order=false)", () => {
    expect(comparePhonetic("", "", "es", "total", false)).toBe(100.0);
  });
  test("empty vs empty -> 100.00 in total (order=true)", () => {
    expect(comparePhonetic("", "", "es", "total", true)).toBe(100.0);
  });
  test("empty vs empty -> 100.00 in a-in-b (order=false)", () => {
    expect(comparePhonetic("", "", "es", "a-in-b", false)).toBe(100.0);
  });
  test("empty vs empty -> 100.00 in a-in-b (order=true)", () => {
    expect(comparePhonetic("", "", "es", "a-in-b", true)).toBe(100.0);
  });
  test("empty vs empty -> 100.00 in b-in-a (order=false)", () => {
    expect(comparePhonetic("", "", "es", "b-in-a", false)).toBe(100.0);
  });
  test("empty vs empty -> 100.00 in b-in-a (order=true)", () => {
    expect(comparePhonetic("", "", "es", "b-in-a", true)).toBe(100.0);
  });

  test("unsupported language should throw in comparePhonetic", () => {
    expect(() => comparePhonetic("hola", "adios", "pt" as any)).toThrow(
      /Unsupported language/
    );
  });

  test("returns two-decimal floats consistently", () => {
    const score = comparePhonetic("a b c", "a x c", "en", "total", false);
    // Ensure numeric and 2-decimal rounding behavior
    expect(typeof score).toBe("number");
    expect(score).toBeCloseTo(Number(score.toFixed(2)), 5);
  });
});
