# MuftGo Billing — white-label notes

**Product name:** MuftGo Billing
**Website / support:** https://muftgo.com — info@muftgo.com
**Upstream:** [Posnic POS](https://github.com/Posnic/POS) v1.6.1 (AGPL-3.0-only)
**This repo:** https://github.com/jayp120/MuftGo-Billing

This is a white-label fork of Posnic POS for a clothing-retail client in
Janata Vasahat, Pune. The Posnic name and logo are trademarks of Posnic
Innovations Private Limited and are **not** used as the product identity here.

## What was renamed (user-visible)

- `package.json`: `name` → `muftgo-billing`, `productName` → `MuftGo Billing`,
  `appId` → `com.muftgo.billing`, protocol → `muftgo-billing://`,
  installer shortcut → `MuftGo Billing`, publish → `jayp120/MuftGo-Billing`.
- Windows installer (`builds/installer.nsh`): welcome/finish pages, desktop +
  Start Menu shortcuts, `Documents\MuftGo-Billing-Backups`, Run key
  `MuftGoBilling`. Uninstaller also cleans the old `Posnic` shortcuts/keys.
- Splash, loading screen, setup wizard logo → `builds/512-muftgo.png` (MuftGo mark).
- **Known limitation:** the window/installer icon `builds/app.ico` is still the
  upstream artwork (the MuftGo favicon ICO is only 16–48px, too small for a
  Windows installer). Before the final client build, regenerate it from
  `branding/muftgo/logo-mark-512.png` (e.g. `npx png-to-ico`) and overwrite
  `builds/app.ico` + `builds/icon.ico`.
- Tray tooltip + menu: `MuftGo Billing`, `Cloud Sync...`, `Quit MuftGo Billing`.
- About dialog: `MuftGo Billing · by MuftGo · Based on Posnic POS (AGPL-3.0-only)`,
  repo link → this repo, upstream credited.
- Receipt footers (`order/receipt.html`, `order/thankyou.html`, `PosnicPro.js`
  `print_url` footer): `Powered by MuftGo Billing · muftgo.com`.
- Backup defaults: `Documents\MuftGo-Billing-Backups` (new installs).
- Update feed + support links → `jayp120/MuftGo-Billing` releases/issues.
- Linux metainfo: new `com.muftgo.billing.metainfo.xml` (old file kept for reference).
- Installer licence header (`builds/installer-license.txt`): MuftGo Billing
  terms + origin/licence block. Full AGPL text unchanged.
- `codemeta.json`, `dev-app-update.yml`: MuftGo identity.

## What was deliberately NOT renamed (data + compat)

- Mongo database name `PosnicPro`, env `POSNIC_MONGO_PORT`, IPC channel names,
  `PosnicPro.js` object name, internal log prefixes. Renaming these orphans a
  shop's existing data or breaks the frontend ↔ main-process contract.
- `LICENSE` (AGPL-3.0-only), `THIRD-PARTY-NOTICES.md`,
  `licenses/MONGODB-SSPL-1.0.txt`: shipped unchanged, as the licence requires.
- Upstream attribution in this file, README header, About dialog, installer
  licence. AGPL §4–§6 require keeping copyright/licence notices and stating changes.

## Brand seed (installer logo/name on first run)

- Source of truth: `branding/muftgo/` (`brand.json`, `brand-logo.png`,
  `brand-login-logo.png`). Versioned in git.
- `builds/brand-seed/` is build output populated by `npm run seed:muftgo-brand`.
- `npm run build:muftgo` = `clear:brand-seed` → `seed:muftgo-brand` → checks → bundle → `electron-builder --win --x64`.
- Never hand-copy files into `builds/brand-seed` — `clear:brand-seed` wipes it on every prebuild by design (upstream guard against shipping one customer's brand in another build).

## Printing fix in this fork (Windows 10/11, all printers)

Symptom from the shop: click Print → a dialog opens, loads OneDrive, then errors.
Root causes fixed here:

1. **Virtual printers as default** (`Microsoft Print to PDF`, `XPS Writer`,
   `OneNote`, `Fax`): a silent receipt sent to these lands in a PDF-save dialog
   that defaults to OneDrive `Documents`, which hangs on sync and then fails.
   Fix: `src/hardware-manager.js` now detects virtual printers, skips them when
   resolving/picking a default, and refuses a silent job addressed to one with an
   actionable message ("Choose your thermal/A4 printer in Hardware Manager…").
2. **Save-dialog failures** (`src/main.js` `will-download`): the handler now
   guards `showSaveDialogSync`/`setSavePath` with try/catch, ensures the target
   directory exists, and surfaces `Download failed` with the real path instead of
   a silent cancel. Reports/exports no longer die quietly when OneDrive
   Known-Folder-Move stalls.
3. **PDF-fallback errors** (`src/print-pdf.js`): Windows failures now name the
   printer and suggest the spooler/Hardware Manager check instead of raw ENOENT.

Shop guidance is in `docs/MUFTGO-PRINTING.md`: set the thermal (80/58mm) as
Receipt Printer and the A4 as Report Printer in Hardware Manager, never leave a
PDF/XPS writer as the Windows default on the till.

## Sample data for the Janata Vasahat clothing shop

- `api/utils/demoData.js` → `textile` pack replaced with a dedicated
  Janata Vasahat clothing catalogue (42 products, 9 categories: shirts,
  jeans, t-shirts, track pants & joggers, kurtis & tops, women's jeans &
  sarees, kids wear, winter & festive, accessories & services; Pune price
  points, MRP + cost, GST-friendly HSN hints in descriptions, a picture for
  every product - 4 photos + 35 original MuftGo icons).
- MuftGo Billing installs **clothing retail only**: setup offers no other
  trade, and clothing installs always seed this local catalogue (never the
  website datasets, which carry other trades' data).
- Details: `docs/MUFTGO-SAMPLE-DATA.md`.

## Your AGPL duties when you give this to the client

- Give them the Corresponding Source: point them at this repo (About dialog and
  installer licence already do). Keep the licence/attribution notices intact.
- State your changes (this file + git history does that).
- Bundled components keep their own licences (MongoDB SSPL etc.) — don't claim
  the whole package is AGPL.
- Need to keep modifications private? That needs a commercial licence from the
  upstream copyright holders — contributors keep their copyright and there is no
  CLA, so MuftGo cannot relicense upstream code alone. See upstream GOVERNANCE.md.
- `npm run check:attribution` before any PR (credits humans, never tools).
