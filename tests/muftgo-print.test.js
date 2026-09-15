'use strict';

/*
 * MuftGo Billing white-label guards.
 *
 * 1. Virtual printers (PDF/XPS/OneNote/Fax) must never receive a silent
 *    receipt: on Windows 10/11 with OneDrive Known-Folder-Move that route
 *    opens a save dialog into OneDrive, hangs, and errors — the exact shop
 *    symptom this fork fixes.
 * 2. The Janata Vasahat clothing pack must stay installable: categories agree,
 *    prices/stock are numbers, names are unique, and at least one photo exists.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { isVirtualPrinter } = require('../src/virtual-printers');

test('virtual/file printers are detected', () => {
  for (const name of [
    'Microsoft Print to PDF',
    'Microsoft XPS Document Writer',
    'OneNote (Desktop)',
    'Send To OneNote 16',
    'FAX',
    'Fax - HP OfficeJet',
    'PDFCreator',
    'CutePDF Writer',
  ]) {
    assert.equal(isVirtualPrinter(name), true, `${name} should be virtual`);
  }
});

test('real thermal and office printers are not flagged', () => {
  for (const name of [
    'POS-80C',
    'Xprinter XP-80C',
    'Epson TM-T82',
    'TVS RP-45',
    'HP LaserJet Pro M12w',
    'Canon PIXMA G3000',
    'Rongta RP80',
  ]) {
    assert.equal(isVirtualPrinter(name), false, `${name} should be physical`);
  }
});

test('empty/odd inputs do not throw', () => {
  assert.equal(isVirtualPrinter(''), false);
  assert.equal(isVirtualPrinter(null), false);
  assert.equal(isVirtualPrinter(undefined), false);
});

test('Janata Vasahat clothing pack is installable', () => {
  const demo = require('../api/utils/demoData');
  const pack = demo.textileDemoData;
  assert.ok(pack.categories.length >= 5, 'clothing pack needs its categories');
  assert.ok(pack.products.length >= 40, 'clothing pack needs a full catalogue');
  const cats = new Set(pack.categories.map((c) => c.name));
  for (const p of pack.products) {
    assert.ok(cats.has(p.category), `product "${p.name}" names a missing category`);
    assert.equal(typeof p.price, 'number');
    assert.ok(p.price > 0);
    assert.equal(typeof p.stock, 'number');
  }
  const names = pack.products.map((p) => p.name.trim().toLowerCase());
  assert.equal(new Set(names).size, names.length, 'duplicate product names');
  assert.ok(
    pack.products.filter((p) => p.image).length > 0,
    'clothing pack needs at least one photo'
  );
});
