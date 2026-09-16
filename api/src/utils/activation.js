'use strict';
/*
 * Shop activation: one Muftgo team key per till.
 *
 * Why this exists. The installer can be copied to any computer, and a fresh
 * copy opens straight into the setup wizard - so handing a client the .exe
 * used to hand them unlimited free copies for every cousin's shop. Activation
 * puts one Muftgo-held key between a copied installer and a working till:
 * without it the app and its API refuse to serve anything except this screen.
 *
 * Muftgo-team key, NOT an owner password. The shop owner never chooses,
 * sets or changes this key. Only the Muftgo team knows it. The shop calls
 * Muftgo once per computer, types the key Muftgo reads out, and the till
 * opens. A copied installer without the key is a locked screen.
 *
 * What it is and is not. It is a single shared team secret, verified with
 * scrypt against a salt+hash verifier baked into the build - the cleartext
 * key is NEVER in this repository, NEVER in the shipped .exe, and NEVER on
 * the shop PC. The activation receipt on the shop PC carries only an HMAC,
 * so hand-editing the receipt cannot forge activation. It is not per-shop
 * keys issued by a server: anybody who learns the team key can activate any
 * machine, so a leaked key unlocks every shop on this build. If that stops
 * being acceptable, replace activateWithPassword with server-issued signed
 * licences (Ed25519) and keep everything else - the gate, the page and the
 * receipt's machine binding stay the same.
 *
 * Honest limit. This is offline software whose JavaScript ships inside the
 * .exe. A determined reverser with the .exe CAN patch the check out - no
 * offline check survives that, whatever anyone promises. What this does is
 * raise the cost from "copy the installer" to "reverse-engineer two
 * enforcement points and forge HMAC receipts", while making casual sharing
 * useless. Per-shop signed licences (private key stays at Muftgo) are the
 * next step when one leaked key for all shops becomes too much risk.
 *
 * Deliberately database-free. Activation must work on a till whose database
 * has never started and during first setup, so the receipt lives in a JSON
 * file beside the other local secrets, never in Mongo. Both the Electron
 * shell and the API read it through this module; neither imports the other.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ACTIVATION_FILE = '.activation.json';
const VERIFIER_FILE = 'muftgo-verifier.json';
const MIN_PASSWORD_LENGTH = 8;
/* scrypt cost: ~50ms on a shop PC - slow enough to hurt guessing, fast
   enough that nobody notices it once per activation. */
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 };
const KEY_BYTES = 32;
const RECEIPT_VERSION = 2;

function userDataDir(override) {
  if (override) return override;
  return process.env.POSNIC_USERDATA || null;
}

function activationFilePath(overrideDir) {
  const dir = userDataDir(overrideDir);
  if (!dir) return null;
  return path.join(dir, ACTIVATION_FILE);
}

/* Enforcement is explicit, never inferred. The packaged app sets
   POSNIC_ENFORCE_ACTIVATION=1 before the API boots; the contributor
   dev-server and the test suite do not, so neither is ever gated. */
function isEnforcementOn() {
  return process.env.POSNIC_ENFORCE_ACTIVATION === '1';
}

/*
 * This computer, read from the operating system every time - never trusted
 * from the file, or a copied file would vouch for its own thief.
 */
let cachedMachineId = null;

function readSystemMachineId() {
  const { execFileSync } = require('child_process');
  const run = (cmd, args) =>
    execFileSync(cmd, args, { encoding: 'utf8', timeout: 5000, windowsHide: true });
  const plat = process.platform;
  try {
    if (plat === 'win32') {
      const out = run('reg', [
        'query',
        'HKLM\\SOFTWARE\\Microsoft\\Cryptography',
        '/v',
        'MachineGuid',
      ]);
      const m = out.match(/MachineGuid\s+REG_SZ\s+([0-9a-f-]{36})/i);
      if (m) return m[1].toLowerCase();
    } else if (plat === 'darwin') {
      const out = run('ioreg', ['-rd1', '-c', 'IOPlatformExpertDevice']);
      const m = out.match(/"IOPlatformUUID"\s*=\s*"([^"]+)"/);
      if (m) return m[1].toLowerCase();
    } else {
      for (const f of ['/etc/machine-id', '/var/lib/dbus/machine-id']) {
        try {
          const v = fs.readFileSync(f, 'utf8').trim();
          if (v) return v.toLowerCase();
        } catch (e) {
          /* try the next one */
        }
      }
    }
  } catch (e) {
    /* A locked-down machine can refuse all of these; the caller decides. */
  }
  return null;
}

function machineId() {
  if (!cachedMachineId) cachedMachineId = readSystemMachineId();
  return cachedMachineId;
}

function hashKey(key, saltHex) {
  return crypto
    .scryptSync(key, Buffer.from(saltHex, 'hex'), KEY_BYTES, SCRYPT_OPTIONS)
    .toString('hex');
}

/*
 * The Muftgo verifier: salt + scrypt hash of the team key, baked into the
 * build by the Muftgo team (scripts/set-activation-password.js
 * --make-verifier). The cleartext key never touches git or the .exe - only
 * this hash ships. Resolution: explicit env override first (CI), then the
 * JSON file sitting next to this module (packaged build + dev checkout).
 * Missing verifier fails CLOSED: activation is impossible until Muftgo bakes
 * a build with --make-verifier. That is deliberate - an app that cannot prove
 * what key it trusts must not invent one.
 */
let cachedVerifier = null;
let cachedVerifierLoaded = false;

function loadVerifier() {
  if (cachedVerifierLoaded) return cachedVerifier;
  cachedVerifierLoaded = true;
  try {
    const fromEnv = process.env.MUFTGO_ACTIVATION_VERIFIER;
    if (fromEnv) {
      const parsed = JSON.parse(fromEnv);
      if (parsed && typeof parsed.salt === 'string' && typeof parsed.hash === 'string') {
        cachedVerifier = { salt: parsed.salt, hash: parsed.hash };
        return cachedVerifier;
      }
    }
    const file = path.join(__dirname, VERIFIER_FILE);
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (parsed && typeof parsed.salt === 'string' && typeof parsed.hash === 'string') {
      cachedVerifier = { salt: parsed.salt, hash: parsed.hash };
      return cachedVerifier;
    }
  } catch (e) {
    /* Missing or corrupt verifier: fail closed below. */
  }
  cachedVerifier = null;
  return null;
}

/* Test-only reset: the suite swaps verifiers per test. Never used in prod. */
function _resetVerifierCache() {
  cachedVerifier = null;
  cachedVerifierLoaded = false;
}

function verifyMuftgoKey(key) {
  const verifier = loadVerifier();
  if (!verifier) return false;
  if (typeof key !== 'string' || key.length < MIN_PASSWORD_LENGTH) return false;
  try {
    const candidate = hashKey(key, verifier.salt);
    return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(verifier.hash, 'hex'));
  } catch (e) {
    return false;
  }
}

/*
 * Receipt HMAC: proves the receipt was written by someone holding the team
 * key, without storing anything reversible. Key = verifier hash (only the
 * team key reproduces a matching HMAC). Hand-editing .activation.json to
 * flip machineId or invent a receipt fails the HMAC and the till stays
 * locked. Verified with timingSafeEqual so a local probe learns nothing.
 */
function signMachineId(machine) {
  const verifier = loadVerifier();
  if (!verifier) return null;
  return crypto
    .createHmac('sha256', Buffer.from(verifier.hash, 'hex'))
    .update(String(machine), 'utf8')
    .digest('hex');
}

function readRecord(overrideDir) {
  const file = activationFilePath(overrideDir);
  if (!file) return null;
  try {
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));
    /* v1 owner-password receipts (salt+hash) are dead: they prove nothing
       about the Muftgo key, so a shop upgraded to this build reactivates
       once with the team key. Anything without a valid v2 HMAC is ignored. */
    if (!record || record.v !== RECEIPT_VERSION) return null;
    if (typeof record.machineId !== 'string' || typeof record.hmac !== 'string') return null;
    const expected = signMachineId(record.machineId);
    if (!expected) return null;
    const a = Buffer.from(record.hmac, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    return record;
  } catch (e) {
    return null;
  }
}

function writeRecord(record, overrideDir) {
  const file = activationFilePath(overrideDir);
  if (!file) throw new Error('No user-data directory is configured (POSNIC_USERDATA).');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(record, null, 2), { mode: 0o600 });
}

function checkKey(key) {
  if (typeof key !== 'string' || key.length < MIN_PASSWORD_LENGTH) {
    return `Key must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

/*
 * The whole gate in one answer, so the shell and the API cannot disagree:
 * enforced + no valid receipt -> locked, needs the Muftgo team key
 * enforced + receipt, same PC -> open the till
 * enforced + receipt, other PC -> data was copied here, ask the key again
 * not enforced -> development and tests, always open
 * There is deliberately NO "needsSetup / choose your own password" state:
 * the shop never invents this key. Only Muftgo issues it.
 */
function status(overrideDir) {
  if (!isEnforcementOn()) return { enforced: false, activated: false, needsSetup: false };
  const record = readRecord(overrideDir);
  if (!record) return { enforced: true, activated: false, needsSetup: false, needsMuftgoKey: true };
  const current = machineId();
  if (current && record.machineId && record.machineId !== current) {
    return {
      enforced: true,
      activated: false,
      needsSetup: false,
      needsMuftgoKey: true,
      machineChanged: true,
    };
  }
  return { enforced: true, activated: true, needsSetup: false };
}

/*
 * The ONLY network path to activation: type the Muftgo team key, it is
 * checked against the baked-in verifier, and a machine-bound HMAC receipt is
 * written. A copied data folder landing on a new PC fails the machine check,
 * so the key must be typed again there - the copy and the original cannot
 * both stay silently activated without Muftgo knowing.
 */
function activateWithPassword(key, overrideDir) {
  const bad = checkKey(key);
  if (bad) return { ok: false, reason: bad };
  if (!loadVerifier())
    return {
      ok: false,
      reason: 'This build has no Muftgo key baked in. Ask Muftgo for a licensed installer.',
    };
  if (!verifyMuftgoKey(key)) return { ok: false, reason: 'Wrong key.' };
  const machine = machineId() || 'unknown';
  const hmac = signMachineId(machine);
  if (!hmac) return { ok: false, reason: 'Could not sign this machine. Try again.' };
  writeRecord(
    { v: RECEIPT_VERSION, machineId: machine, activatedAt: new Date().toISOString(), hmac },
    overrideDir
  );
  return { ok: true };
}

/*
 * Muftgo-team reset ON the machine itself: writes a valid receipt without
 * asking for the key. Safe only because it must run where the till's data
 * lives - anybody who can run this already owns the machine, same standing
 * as scripts/recover-access.js. This file is never packaged into the .exe
 * and this function is NEVER exposed over the API.
 */
function forceActivate(overrideDir) {
  const machine = machineId() || 'unknown';
  const hmac = signMachineId(machine);
  if (!hmac) return { ok: false, reason: 'No Muftgo verifier available in this checkout.' };
  writeRecord(
    { v: RECEIPT_VERSION, machineId: machine, activatedAt: new Date().toISOString(), hmac },
    overrideDir
  );
  return { ok: true };
}

module.exports = {
  MIN_PASSWORD_LENGTH,
  ACTIVATION_FILE,
  RECEIPT_VERSION,
  SCRYPT_OPTIONS,
  isEnforcementOn,
  userDataDir,
  activationFilePath,
  machineId,
  status,
  readRecord,
  verifyMuftgoKey,
  activateWithPassword,
  forceActivate,
  loadVerifier,
  _resetVerifierCache,
};
