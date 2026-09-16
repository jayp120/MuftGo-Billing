'use strict';
/*
 * Shop barcode numbering: every product gets a scannable code, even when the
 * person creating it never typed one.
 *
 * Why sequential numbers. A clothing shop receives 40 shirts in mixed sizes
 * and needs 40 stickers before the lunch rush - nobody is inventing 40
 * "clever" codes under that pressure, and clever codes collide. So a blank
 * barcode means "give me the next free number for this branch". Numbers are
 * plain (200001, 200002, …): CODE128 prints them, the camera reads them,
 * and a cashier can type them when the scanner battery dies.
 *
 * Why 200001. Six digits are short enough to type when a scanner battery
 * dies, and the 200001+ block is reserved for generated codes - a shop must
 * not hand out the same numbers as PLU quick-codes, or one number answers
 * as two products. Real printed EAN/UPC ranges (8-14 digits) never collide
 * with it.
 */

const START_CODE = 200001;

function isNumericCode(value) {
  return typeof value === 'string' && /^\d{1,18}$/.test(value);
}

/*
 * Pure arithmetic, no database: hand it every code the branch already uses
 * (primary and alternates) and how many fresh ones are needed, and it
 * returns that many free numbers above the current maximum. Skips over
 * collisions rather than assuming max+1 is free, because alternates can
 * sit above the primary maximum.
 */
function allocateBarcodeCodes(existingCodes, count, start = START_CODE) {
  const used = new Set((existingCodes || []).filter(isNumericCode));
  let candidate = start;
  for (const code of used) {
    const n = Number(code);
    if (Number.isSafeInteger(n) && n >= candidate) candidate = n + 1;
  }
  const fresh = [];
  while (fresh.length < count) {
    const code = String(candidate);
    candidate += 1;
    if (used.has(code)) continue;
    used.add(code);
    fresh.push(code);
  }
  return fresh;
}

module.exports = { START_CODE, isNumericCode, allocateBarcodeCodes };
