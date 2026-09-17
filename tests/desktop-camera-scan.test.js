/*
 * Desktop front-camera scanning.
 *
 * Windows desktop Chromium - including this app's own window - ships no
 * BarcodeDetector, so the sales-page camera button used to hide itself on
 * exactly the tills that need it most. The button now shows wherever a
 * camera exists and decodes through the vendored ZXing bundle where the
 * native detector is absent. Main grants the camera to local pages only;
 * a microphone-only request is never scanning and stays denied.
 *
 * These tests pin the wiring: the vendored file, the lazy-load plumbing,
 * the fallback decode path, and the main-process permission shape.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(ROOT, f));

test('the ZXing decoder is vendored locally - no network at scan time', () => {
  assert.ok(
    exists('frontend/static/script/js/zxing.min.js'),
    'missing vendored decoder: frontend/static/script/js/zxing.min.js',
  );
  const src = read('frontend/static/script/js/zxing.min.js');
  assert.match(src, /Apache/, 'vendored decoder lost its licence header');
  assert.match(
    src,
    /BrowserMultiFormatReader/,
    'vendored file is not the ZXing browser build',
  );
});

test('the decoder rides the lazy channel, not every page bundle', () => {
  const gulpfile = read('frontend/gulpfile.js/index.js');
  /* Either quote style: a formatter normalises these, and the mapping is what
     ships zxing.js - the first desktop scan 404s without it. */
  assert.match(
    gulpfile,
    /\[['"]static\/script\/js\/zxing\.min\.js['"],\s*['"]zxing\.js['"]\]/,
    'gulp copyLazyScripts does not ship zxing.js - the first desktop scan would 404',
  );
  const core = read('frontend/static/script/js/core/PosnicPro.js');
  assert.match(
    core,
    /zxing:\s*\['script\/lazy\/zxing\.js'\]/,
    'PosnicPro.lazy has no zxing set - cameraScan._zxingReady has nothing to load',
  );
});

test('the camera button shows wherever a camera exists, not only native', () => {
  const sales = read('frontend/static/script/js/modules/js/sales.js');
  assert.doesNotMatch(
    sales,
    /if \('BarcodeDetector' in window && navigator\.mediaDevices/,
    'button gating still requires the native detector Windows never has',
  );
  assert.match(
    sales,
    /\$\('#camera_scan_btn'\)\.show\(\)/,
    'nothing ever reveals the camera button',
  );
});

test('the fallback decodes locally and rejoins the wedge path', () => {
  const sales = read('frontend/static/script/js/modules/js/sales.js');
  for (const want of [
    'BrowserMultiFormatReader',
    'decodeFromConstraints',
    'result.getText',
    '_zxReader',
  ]) {
    assert.ok(
      sales.includes(want),
      `sales.js fallback missing: ${want}`,
    );
  }
  /* One resolution path for every way a barcode arrives: the fallback must
     land in addByBarcode like the gun and the native detector do. */
  const heard = sales.indexOf('_heard: function');
  assert.ok(heard !== -1, 'no shared _heard step');
  assert.ok(
    sales.indexOf('addByBarcode', heard) !== -1,
    'fallback result does not reach addByBarcode',
  );
});

test('closing the modal always releases the camera', () => {
  const sales = read('frontend/static/script/js/modules/js/sales.js');
  const stopAt = sales.indexOf('stop: function');
  assert.ok(stopAt !== -1, 'cameraScan.stop is gone');
  const stopBody = sales.slice(stopAt, stopAt + 800);
  assert.ok(stopBody.includes('_zxReader'), 'stop() leaves the ZXing reader running');
  assert.ok(stopBody.includes('_timer'), 'stop() leaves the native interval running');
  assert.ok(stopBody.includes('_stream'), 'stop() leaves native tracks running');
});

test('main grants video to local pages, never the microphone', () => {
  const main = read('src/main.js');
  assert.ok(main.includes('CAMERA_PERMISSIONS'), 'camera permission set removed');
  assert.ok(
    main.includes('isLocalCameraOrigin'),
    'local-origin check removed - a remote page could claim the camera',
  );
  assert.ok(
    /mediaTypes.*includes\('video'\)/.test(main),
    'microphone-only requests are no longer refused',
  );
});
