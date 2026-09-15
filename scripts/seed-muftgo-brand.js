'use strict';

/*
 * Seed builds/brand-seed with the MuftGo Billing brand.
 *
 * Upstream `clear:brand-seed` empties builds/brand-seed on every prebuild so a
 * stock installer never ships wearing a customer's logo. That guard stays.
 * For a white-label build we re-populate the directory from the checked-in
 * source in branding/muftgo AFTER the clear step, so the brand is versioned,
 * reviewable, and never a leftover from a previous run on the build machine.
 *
 * Usage:
 *   node scripts/seed-muftgo-brand.js
 *   npm run build:muftgo   (clear -> seed -> electron-builder)
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'branding', 'muftgo');
const DEST = path.join(__dirname, '..', 'builds', 'brand-seed');

if (!fs.existsSync(SRC)) {
  console.error('[muftgo-brand] missing source directory: branding/muftgo');
  process.exit(1);
}

fs.mkdirSync(DEST, { recursive: true });

const wanted = ['brand.json', 'brand-logo.png', 'brand-login-logo.png'];
let copied = 0;
for (const file of wanted) {
  const from = path.join(SRC, file);
  if (!fs.existsSync(from)) {
    console.error(`[muftgo-brand] missing ${file} in branding/muftgo`);
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(DEST, file));
  copied += 1;
}

// Validate brand.json parses and carries the white-label name.
try {
  const brand = JSON.parse(fs.readFileSync(path.join(DEST, 'brand.json'), 'utf8'));
  if (!brand || brand.name !== 'MuftGo Billing') {
    console.error('[muftgo-brand] brand.json must carry name "MuftGo Billing"');
    process.exit(1);
  }
} catch (e) {
  console.error('[muftgo-brand] brand.json is not valid JSON:', e.message);
  process.exit(1);
}

console.log(`[muftgo-brand] seeded builds/brand-seed with ${copied} files (MuftGo Billing)`);
