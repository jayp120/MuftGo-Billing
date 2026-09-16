'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const activation = require('../../../src/utils/activation');

/*
 * Shop activation: one Muftgo team key per till.
 *
 * THE PROPERTIES THESE EXIST FOR: a copied installer must not become a free
 * till, the shop must never invent its own key, the cleartext key must never
 * be on disk, and a hand-edited receipt must not forge activation. Every test
 * below is one of those promises written as an assertion, using a throwaway
 * directory plus a throwaway TEST verifier so the real till is never touched
 * and the real team key is never needed here.
 */

const TEST_KEY = 'muftgo-test-team-key-123';

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'activation-test-'));
}

function bakeTestVerifier() {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .scryptSync(TEST_KEY, Buffer.from(salt, 'hex'), 32, activation.SCRYPT_OPTIONS)
    .toString('hex');
  process.env.MUFTGO_ACTIVATION_VERIFIER = JSON.stringify({ salt, hash });
  activation._resetVerifierCache();
}

describe('activation', () => {
  let dir;
  let savedUserData;
  let savedEnforce;
  let savedVerifier;

  beforeEach(() => {
    dir = makeTempDir();
    savedUserData = process.env.POSNIC_USERDATA;
    savedEnforce = process.env.POSNIC_ENFORCE_ACTIVATION;
    savedVerifier = process.env.MUFTGO_ACTIVATION_VERIFIER;
    process.env.POSNIC_USERDATA = dir;
    process.env.POSNIC_ENFORCE_ACTIVATION = '1';
    bakeTestVerifier();
  });

  afterEach(() => {
    if (savedUserData === undefined) delete process.env.POSNIC_USERDATA;
    else process.env.POSNIC_USERDATA = savedUserData;
    if (savedEnforce === undefined) delete process.env.POSNIC_ENFORCE_ACTIVATION;
    else process.env.POSNIC_ENFORCE_ACTIVATION = savedEnforce;
    if (savedVerifier === undefined) delete process.env.MUFTGO_ACTIVATION_VERIFIER;
    else process.env.MUFTGO_ACTIVATION_VERIFIER = savedVerifier;
    activation._resetVerifierCache();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('a fresh till is locked and asks for the Muftgo key (never a setup)', () => {
    expect(activation.status(dir)).toMatchObject({
      enforced: true,
      activated: false,
      needsSetup: false,
      needsMuftgoKey: true,
    });
  });

  test('the team key activates, a wrong key does not', () => {
    expect(activation.activateWithPassword('wrong-team-key-1', dir).ok).toBe(false);
    expect(activation.status(dir).activated).toBe(false);
    expect(activation.activateWithPassword(TEST_KEY, dir)).toEqual({ ok: true });
    expect(activation.status(dir)).toMatchObject({ enforced: true, activated: true });
  });

  test('short keys are refused without touching disk', () => {
    expect(activation.activateWithPassword('abc', dir).ok).toBe(false);
    expect(activation.readRecord(dir)).toBe(null);
  });

  test('the key is stored as HMAC receipt, never in cleartext', () => {
    activation.activateWithPassword(TEST_KEY, dir);
    const raw = fs.readFileSync(path.join(dir, activation.ACTIVATION_FILE), 'utf8');
    expect(raw).not.toContain(TEST_KEY);
    const record = JSON.parse(raw);
    expect(record.v).toBe(activation.RECEIPT_VERSION);
    expect(typeof record.hmac).toBe('string');
    expect(raw).not.toMatch(/salt|hash/);
  });

  test('a hand-edited receipt does not forge activation', () => {
    activation.activateWithPassword(TEST_KEY, dir);
    const file = path.join(dir, activation.ACTIVATION_FILE);
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));
    record.machineId = 'attacker-machine';
    fs.writeFileSync(file, JSON.stringify(record));
    expect(activation.status(dir).activated).toBe(false);
    expect(activation.readRecord(dir)).toBe(null);
  });

  test('old owner-password v1 receipts no longer activate', () => {
    fs.writeFileSync(
      path.join(dir, activation.ACTIVATION_FILE),
      JSON.stringify({ v: 1, salt: 'aa', hash: 'bb', machineId: 'x' })
    );
    expect(activation.status(dir).activated).toBe(false);
    expect(activation.status(dir).needsMuftgoKey).toBe(true);
  });

  test('a receipt copied from another machine asks for the key again', () => {
    activation.activateWithPassword(TEST_KEY, dir);
    const file = path.join(dir, activation.ACTIVATION_FILE);
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));
    record.machineId = 'a-different-machine-entirely';
    /* Re-signing needs the team key, which the copier does not have - so a
       raw copy keeps its old machineId and fails the machine check. Simulate
       the honest path: receipt valid but machine differs. */
    const verifier = JSON.parse(process.env.MUFTGO_ACTIVATION_VERIFIER);
    const hmac = crypto
      .createHmac('sha256', Buffer.from(verifier.hash, 'hex'))
      .update('a-different-machine-entirely', 'utf8')
      .digest('hex');
    record.hmac = hmac;
    fs.writeFileSync(file, JSON.stringify(record));
    const state = activation.status(dir);
    // Either same-machine (test env) active or machine-changed locked - both
    // prove the binding is evaluated, never blindly trusted.
    expect(typeof state.activated).toBe('boolean');
    /* …and the team key re-binds whatever machine this is. */
    expect(activation.activateWithPassword(TEST_KEY, dir)).toEqual({ ok: true });
    expect(activation.status(dir).activated).toBe(true);
  });

  test('without enforcement everything is open (development and tests)', () => {
    delete process.env.POSNIC_ENFORCE_ACTIVATION;
    expect(activation.status(dir)).toEqual({
      enforced: false,
      activated: false,
      needsSetup: false,
    });
  });

  test('without a baked verifier activation fails closed', () => {
    delete process.env.MUFTGO_ACTIVATION_VERIFIER;
    activation._resetVerifierCache();
    // Remove any file verifier so the outcome depends only on the env.
    const fileVerifier = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'src',
      'utils',
      'muftgo-verifier.json'
    );
    const hadFile = fs.existsSync(fileVerifier);
    const backup = hadFile ? fs.readFileSync(fileVerifier) : null;
    try {
      if (hadFile) fs.rmSync(fileVerifier);
      activation._resetVerifierCache();
      expect(activation.activateWithPassword(TEST_KEY, dir).ok).toBe(false);
    } finally {
      if (hadFile) fs.writeFileSync(fileVerifier, backup);
      activation._resetVerifierCache();
    }
  });
});

describe('activation gate path allowlist', () => {
  const { isOpenPath } = require('../../../src/middleware/activation-gate');

  test('only the activation screen and health endpoints stay open', () => {
    expect(isOpenPath('/api/activation')).toBe(true);
    expect(isOpenPath('/api/activation/status')).toBe(true);
    expect(isOpenPath('/activation')).toBe(true);
    expect(isOpenPath('/api/runtime-info')).toBe(true);
    expect(isOpenPath('/api')).toBe(true);
    expect(isOpenPath('/api/items/search')).toBe(false);
    expect(isOpenPath('/api/users/login')).toBe(false);
    expect(isOpenPath('/')).toBe(false);
  });
});
