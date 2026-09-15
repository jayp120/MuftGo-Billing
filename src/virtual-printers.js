'use strict';

/*
 * Virtual/file printers that must never receive a silent receipt or report.
 *
 * A silent job to one of these opens a "save to file" dialog defaulting to
 * OneDrive Documents on Windows 10/11 with Known-Folder-Move — the dialog
 * hangs loading OneDrive and then errors, which is the shop symptom the
 * MuftGo Billing fork fixes. Matching is substring-based and deliberately
 * broad: Windows localises some display names ("Fax", "PDF") and vendors add
 * suffixes ("... (Copy 1)"). Physical printers whose model name contains
 * these words are vanishingly rare; a shop that genuinely owns one can still
 * print by choosing it explicitly in flows that pass silent:false.
 *
 * Dependency-free on purpose: required by hardware-manager.js (Electron main)
 * and by plain node --test unit tests without native modules.
 */
function isVirtualPrinter(name) {
  const n = String(name || '').toLowerCase();
  if (!n) return false;
  return (
    n.includes('print to pdf') ||
    n.includes('microsoft xps') ||
    n.includes('xps document writer') ||
    n.includes('onenote') ||
    /\bfax\b/.test(n) ||
    n.includes('send to onenote') ||
    n.includes('pdf writer') ||
    n.includes('pdfcreator') ||
    n.includes('cutepdf') ||
    n.includes('snagit') ||
    n.includes('anydesk printer') ||
    n.includes('do-pdf') ||
    n.includes('dopdf')
  );
}

module.exports = { isVirtualPrinter };
