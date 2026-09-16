'use strict';

const { START_CODE, allocateBarcodeCodes } = require('../../../src/utils/barcode-sequence');

/*
 * Shop barcode numbering.
 *
 * THE PROPERTY THESE EXIST FOR: two products must never answer one scan.
 * The till adds whichever row the index returns first, so a duplicated code
 * silently sells the wrong garment. Allocation therefore starts above every
 * code the branch already uses - primary and alternates alike - and skips
 * over anything already taken.
 */

describe('allocateBarcodeCodes', () => {
  test('starts at 200001 on an empty branch', () => {
    expect(allocateBarcodeCodes([], 3)).toEqual(['200001', '200002', '200003']);
  });

  test('continues above the highest code in use', () => {
    expect(allocateBarcodeCodes(['200001', '200005', '199999'], 2)).toEqual(['200006', '200007']);
  });

  test('ignores non-numeric codes (SKUs, EANs with letters, blanks)', () => {
    expect(allocateBarcodeCodes(['', 'SHIRT-M', '200010'], 1)).toEqual(['200011']);
  });

  test('never backfills gaps below the maximum in use', () => {
    /* A gap is usually a deleted product whose printed tags still hang in
       somebody's wardrobe. Reusing its number would resurrect it at the
       till the next time that old tag is scanned. */
    expect(allocateBarcodeCodes(['200001', '200003'], 3)).toEqual(['200004', '200005', '200006']);
  });

  test('never returns a code twice in one batch', () => {
    const batch = allocateBarcodeCodes(['200001'], 50);
    expect(new Set(batch).size).toBe(50);
    expect(batch[0]).toBe('200002');
  });

  test('codes are short six-digit numbers, easy to type when a scanner dies', () => {
    expect(allocateBarcodeCodes([], 1)).toEqual([String(START_CODE)]);
    expect(String(START_CODE).length).toBe(6);
  });
});
