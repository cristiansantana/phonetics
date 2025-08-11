# Phonetics

TypeScript library for generating **phonetic keys from text strings** to improve **sound-based fuzzy matching/searching**.  
Includes utilities to compare phrases word-by-word using phonetic similarity.

- Supported languages: **Spanish (`es`)**, **English (`en`)**, **French (`fr`)**, **Italian (`it`)**.
- Designed for **typo-tolerant search** based on how words sound.

## Installation

```bash
# with npm
npm install @cristiansantana/phonetics

# with pnpm
pnpm add @cristiansantana/phonetics

# with yarn
yarn add @cristiansantana/phonetics
```

## Requirements

- Node.js 18+ (20+ recommended)
- TypeScript 5+ (if using TS)

## Importing

ESM (recommended):

```ts
import { phoneticKey, comparePhonetic } from "@cristiansantana/phonetics";
```

CommonJS:

```js
const { phoneticKey, comparePhonetic } = require("@cristiansantana/phonetics");
```

## Quick usage

```ts
import { phoneticKey, comparePhonetic } from "@cristiansantana/phonetics";

// Generate a phonetic key for a word
const k1 = phoneticKey("nueva", "es"); // will match 'nueba'
const k2 = phoneticKey("phone", "en"); // will match 'fone'

// Compare full sentences (total mode, bag-of-words)
const s1 = comparePhonetic(
  "Nueva cerveza helada",
  "Nueba servesa elada",
  "es",
  "total"
);
// s1 -> 100.00

// Containment: Is A contained in B?
const s2 = comparePhonetic(
  "cerveza helada",
  "nueva cerveza helada artesanal",
  "es",
  "a-in-b"
);
// s2 -> 100.00

// Respecting word order
const s3 = comparePhonetic(
  "rojo verde azul",
  "verde rojo azul",
  "es",
  "total",
  true
);
// s3 < 100.00 (penalizes different order)
```

## API

### `phoneticKey(text: string, lang: ISO639_1): string`

Generates a **normalized phonetic key** for `text`, useful for indexing and comparing by sound.

- `text`: word or text (internally tokenized but returns a normalized string).
- `lang`: ISO 639-1 language code: `'es' | 'en' | 'fr' | 'it'`.
- Returns: a string containing the phonetic key.

**Examples**

```ts
phoneticKey("llave", "es") === phoneticKey("yave", "es"); // true
phoneticKey("colour", "en") === phoneticKey("color", "en"); // true
phoneticKey("beaux", "fr") === phoneticKey("beau", "fr"); // true
phoneticKey("acqua", "it") === phoneticKey("ackwa", "it"); // true
```

---

### `comparePhonetic(a: string, b: string, lang: ISO639_1, mode?: CompareMode, orderMatters?: boolean): number`

Compares two strings **per word** using phonetic keys.  
Returns a **float between 0 and 100** with **two decimal precision**.

#### Parameters

- `a`: First string to compare.
- `b`: Second string to compare.
- `lang`: ISO 639-1 language code: `'es' | 'en' | 'fr' | 'it'`.
- `mode` (optional, default `'total'`):
  - `'total'`: symmetric Jaccard over multisets `(intersection / union) × 100`
  - `'a-in-b'`: coverage of A in B `(intersection / |A|) × 100`
  - `'b-in-a'`: coverage of B in A `(intersection / |B|) × 100`
- `orderMatters` (optional, default `false`): if `true`, compares words positionally instead of as a bag of words.

#### Returns

`number` — a float in the range **0..100**.

**Examples**

```ts
comparePhonetic("red green blue", "green red blue", "es", "total", false);
// -> 100.00 (same words, order ignored)

comparePhonetic("red green blue", "green red blue", "es", "total", true);
// -> less than 100.00 (order matters)
```

---

## Error handling

If an unsupported language code is provided, both `phoneticKey` and `comparePhonetic` will throw an error:

```ts
phoneticKey("hola", "pt" as any);
// Error: Unsupported language: pt
```
