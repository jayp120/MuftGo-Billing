# MuftGo Billing — printing setup & troubleshooting (Windows 10/11)

Works with **every thermal printer (58/80mm ESC/POS)** and **every normal A4
printer**: Xprinter, Epson, TVS, Rongta, HP, Canon — USB or network. Two paths:

- **Thermal receipts** → raw ESC/POS bytes to the queue (fast, no dialog).
- **A4 invoices/reports** → hidden print window → silent Electron print →
  PDF fallback. Only this path can ever show a save dialog.

## The OneDrive bug (fixed in this fork)

**Symptom:** click Print → a window opens, loads OneDrive, then errors.

**Cause:** the job was addressed to a *file-writer*, not a printer —
`Microsoft Print to PDF`, `XPS Document Writer`, `OneNote`, `Fax`. A silent
job there has nowhere physical to go, so Windows opens a "save to file"
picker defaulting to OneDrive Documents; on sync-stalled tills it hangs and
fails. Fresh Windows 10/11 machines default to Print-to-PDF, so this bit new
installs hardest.

**Fixes in code:**

1. `src/virtual-printers.js` + `src/hardware-manager.js`: virtual queues are
   detected, skipped when picking a default, and refused for silent jobs with
   an actionable message naming Hardware Manager.
2. `src/main.js` `will-download`: save dialog wrapped in try/catch with a
   temp-folder fallback, target directory ensured, and real errors shown in a
   message box (not a console line). Failed exports now say *where* and *why*.
3. `src/print-pdf.js`: Windows fallback errors name the printer and point at
   the spooler/Hardware Manager check.

## Correct setup (do this on the till)

1. Install the printer's **actual driver** (not just plug-and-play generic).
   Print a Windows test page first — if that fails, MuftGo Billing can't help.
2. **Never** leave `Microsoft Print to PDF` / XPS / OneNote as the Windows
   default on the till. Set the thermal as default (or pick explicitly below).
3. MuftGo Billing → **Hardware Manager**:
   - **Receipt Printer** → your thermal (e.g. `Xprinter XP-80C`, `POS-80C`).
     Paper: `80mm` (3-inch) or `58mm` (2-inch) to match the roll.
   - **Report Printer** → your A4 laser/inkjet. Paper: `A4`.
   - **Kitchen Printer** (restaurant only) → the kitchen roll, never the counter.
4. OneDrive: if Documents/Downloads are OneDrive-synced and slow, either let
   sync finish, pause it during trading, or save exports to **Desktop** (local).
5. Cash drawer kicking but no print? The drawer pulse rides the receipt job —
   fix the printer choice first.

## If it still fails

| Message | Meaning | Fix |
|---|---|---|
| `Printer not found: X. Available printers: …` | Queue renamed/removed | Re-pick in Hardware Manager |
| `"…Print to PDF…" cannot print receipts…` | Virtual queue chosen/default | Pick the physical printer |
| `Could not print on "X" (…). Check the printer…` | Spooler/offline/paper | Power, paper, `services.msc` → Print Spooler running |
| `CUPS printing is not available` | Non-Windows without CUPS | Install CUPS (`lp` missing) |
| `No printer found. Choose one in Hardware Manager` | No queues at all | Install a driver first |
| Save dialog hangs on OneDrive then `Download failed` | Sync stall / no space | Pause OneDrive or save to Desktop; check disk space |

Logs: `%APPDATA%\MuftGo Billing\logs\app.log` + Hardware Manager receipt/KOT
logs. Include them (via Contact Support → copy log) when reporting.
