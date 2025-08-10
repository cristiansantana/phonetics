import { phoneticKey } from "../src/phoneticKey";

describe("phoneticKey - spanish", () => {
  test("v/b and mute h", () => {
    expect(phoneticKey("nueva", "es")).toBe(phoneticKey("nueba", "es"));
    expect(phoneticKey("huevo", "es")).toBe(phoneticKey("uevo", "es"));
  });

  test("ce/ci vs z vs s", () => {
    expect(phoneticKey("cerveza", "es")).toBe(phoneticKey("servesa", "es"));
  });

  test("j and g(e/i) equivalents", () => {
    expect(phoneticKey("jirafa", "es")).toBe(phoneticKey("girafa", "es"));
  });

  test("ll ~ y and ch", () => {
    expect(phoneticKey("llave", "es")).toBe(phoneticKey("yave", "es"));
    expect(phoneticKey("chico", "es")).toBe(phoneticKey("xico", "es")); // rule ch->x
  });
});

describe("phoneticKey - english", () => {
  test("ph ~ f", () => {
    expect(phoneticKey("phone", "en")).toBe(phoneticKey("fone", "en"));
  });

  test("kn-, -gh-, silent e", () => {
    expect(phoneticKey("knight", "en")).toBe(phoneticKey("nite", "en"));
  });

  test("colour vs color", () => {
    expect(phoneticKey("colour", "en")).toBe(phoneticKey("color", "en"));
  });
});

describe("phoneticKey - french", () => {
  test("eau/au/aux -> o", () => {
    expect(phoneticKey("eau", "fr")).toBe(phoneticKey("au", "fr"));
    expect(phoneticKey("beaux", "fr")).toBe(phoneticKey("beau", "fr"));
  });

  test("ç and silent endings", () => {
    expect(phoneticKey("garçon", "fr")).toBe(phoneticKey("garcon", "fr"));
    expect(phoneticKey("grand", "fr")).toBe(phoneticKey("gran", "fr")); // silent final d
  });

  test("gn and ch", () => {
    expect(phoneticKey("champagne", "fr")).toBe(phoneticKey("shampanye", "fr"));
  });
});

describe("phoneticKey - italian", () => {
  test("gn -> ny, gli -> y", () => {
    expect(phoneticKey("gnocchi", "it")).toBe(phoneticKey("nyocchi", "it"));
    expect(phoneticKey("famiglia", "it")).toBe(phoneticKey("famiya", "it"));
  });

  test("c/ci/ce/ch and sc", () => {
    expect(phoneticKey("cena", "it")).toBe(phoneticKey("xena", "it")); // ce -> x
    expect(phoneticKey("che", "it")).toBe(phoneticKey("ke", "it")); // che -> ke
    expect(phoneticKey("scelta", "it")).toBe(phoneticKey("shelta", "it")); // sce -> she
  });

  test("qu -> kw", () => {
    expect(phoneticKey("acqua", "it")).toBe(phoneticKey("ackwa", "it"));
  });
});

describe("errors and edges", () => {
  test("unsupported language", () => {
    expect(() => phoneticKey("hola", "es" as any)).not.toThrow();
    expect(() => phoneticKey("hola", "pt" as any)).toThrow(
      /Unsupported language/
    );
  });

  test("empty string", () => {
    expect(phoneticKey("", "es")).toBe("");
  });
});
