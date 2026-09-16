#!/usr/bin/env node
"use strict";

/*
 * Muftgo-team tool: bake the team key into builds + activate shop PCs.
 *
 * THE KEY IS NEVER A COMMIT. The cleartext team key lives with the Muftgo
 * team (and CI secrets) only. This repository and the shipped .exe carry
 * just the scrypt verifier { salt, hash } - enough to CHECK a key, never
 * enough to RECOVER it. Anyone reading the .exe with an AI sees a hash,
 * not the key, and patching the check out means defeating two enforcement
 * points plus HMAC receipts (see api/src/utils/activation.js).
 *
 * Run on the MUFTGO TEAM PC before building (never on a shop PC):
 *
 *   $env:MUFTGO_ACTIVATION_SECRET='type-it-here'   # PowerShell, same window only
 *   node scripts/set-activation-password.js --make-verifier
 *
 * --make-verifier with no env asks interactively, so the key never lands in
 * a shell history file. It writes api/src/utils/muftgo-verifier.json (salt +
 * hash only). Rebuild the .exe after - that build then trusts ONLY that key.
 *
 * Run ON the client PC while installing, as the same Windows user who will
 * run the till:
 *
 *   node scripts/set-activation-password.js --status
 *   node scripts/set-activation-password.js --activate
 *
 * --activate asks for the team key interactively and writes a machine-bound
 * receipt. Prefer typing it yourself - never send the key to the shop in
 * writing that survives (no WhatsApp forward, no sticker on the monitor).
 *
 * Flags:
 *   --user-data PATH   data folder to write to (default: this machine's
 *                      MuftGo Billing folder, falling back to Posnic)
 *   --app-name NAME    which app folder to look for (default muftgo-billing)
 */

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const readline = require("readline");

const activation = require("../api/src/utils/activation");

const VERIFIER_PATH = path.join(__dirname, "..", "api", "src", "utils", "muftgo-verifier.json");

function die(what, fix) {
  console.error(`\n  ${what}`);
  if (fix) console.error(`  -> ${fix}`);
  process.exit(1);
}

function defaultUserData(appName) {
  const plat = process.platform;
  const base =
    plat === "win32"
      ? process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming")
      : plat === "darwin"
        ? path.join(os.homedir(), "Library", "Application Support")
        : process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
  const primary = path.join(base, appName);
  if (fs.existsSync(primary)) return primary;
  const fallback = path.join(base, "posnic");
  if (fs.existsSync(fallback)) return fallback;
  return primary;
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i += 1;
      } else {
        out[key] = true;
      }
    } else {
      out._.push(arg);
    }
  }
  return out;
}

function askSecret(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.replace(/[\r\n]+$/, ""));
    });
  });
}

async function makeVerifier() {
  const fromEnv = process.env.MUFTGO_ACTIVATION_SECRET;
  const key = fromEnv && fromEnv.length >= 8 ? fromEnv : await askSecret("Muftgo team key (min 8 characters, typed, never saved): ");
  if (!key || key.length < activation.MIN_PASSWORD_LENGTH) {
    die(`Key must be at least ${activation.MIN_PASSWORD_LENGTH} characters.`);
  }
  if (process.env.MUFTGO_ACTIVATION_VERIFIER) {
    die("MUFTGO_ACTIVATION_VERIFIER is set - unset it before baking a new verifier.");
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .scryptSync(key, Buffer.from(salt, "hex"), 32, activation.SCRYPT_OPTIONS)
    .toString("hex");
  fs.mkdirSync(path.dirname(VERIFIER_PATH), { recursive: true });
  fs.writeFileSync(
    VERIFIER_PATH,
    JSON.stringify({ v: 1, algo: "scrypt-16384-8-1-32", salt, hash }, null, 2) + "\n"
  );
  // The key variable dies with this process; only salt+hash hit the disk.
  console.log(`\n  Done. Verifier written (salt+hash ONLY, no key):`);
  console.log(`    ${path.relative(process.cwd(), VERIFIER_PATH)}`);
  console.log("  Rebuild the installer now: npm run build:muftgo");
  console.log("  That build trusts ONLY the key just typed.\n");
}

(async () => {
  const args = parseArgs(process.argv.slice(2));

  if (args["make-verifier"]) {
    await makeVerifier();
    return;
  }

  const dir =
    args["user-data"] || defaultUserData(args["app-name"] || "muftgo-billing");
  process.env.POSNIC_USERDATA = dir;
  /* The tool runs where the till runs, so enforcement answers apply here. */
  process.env.POSNIC_ENFORCE_ACTIVATION =
    process.env.POSNIC_ENFORCE_ACTIVATION || "1";

  if (args.status) {
    const state = activation.status(dir);
    const record = activation.readRecord(dir);
    console.log(`\n  Data folder : ${dir}`);
    console.log(`  Machine id  : ${activation.machineId() || "(unreadable)"}`);
    if (!record) {
      console.log("  Activation  : LOCKED - needs the Muftgo team key\n");
    } else if (state.activated) {
      console.log(`  Activation  : ACTIVE on this machine since ${record.activatedAt}\n`);
    } else {
      console.log("  Activation  : KEY NEEDED (data came from another machine)\n");
    }
    return;
  }

  if (args.activate || args.set) {
    if (args.set) {
      console.log("\n  NOTE: --set is the old owner-password flow and is gone.");
      console.log("  Shops never set their own key. Using --activate instead.\n");
    }
    const key = await askSecret("Muftgo team key: ");
    const result = activation.activateWithPassword(key, dir);
    if (!result.ok) die(`Could not activate: ${result.reason}`);
    console.log(`\n  Done. Till in ${dir} is activated on this machine.`);
    console.log("  The key itself was NOT stored - only a receipt for this PC.\n");
    return;
  }

  if (args.change) {
    die("Shops cannot change this key. Only the Muftgo team re-issues builds/keys.");
  }

  console.log(`
  Muftgo till activation (team key only - shops never set it).

    Team PC before building:
      node scripts/set-activation-password.js --make-verifier

    Shop PC while installing:
      node scripts/set-activation-password.js --status
      node scripts/set-activation-password.js --activate
      node scripts/set-activation-password.js --activate --user-data "PATH"
  `);
})().catch((e) => die(e.message || String(e)));
