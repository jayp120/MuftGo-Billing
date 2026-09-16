'use strict';
/*
 * The activation gate: without a valid activation, the API answers nothing
 * except the activation screen itself.
 *
 * Mounted in front of every API router (both the /api and the legacy /
 * mounts), so a copied installer reached over the browser at :5555 is as
 * locked as the desktop window. Static pages stay open - the activation
 * screen and the login page have to load before anybody can type anything -
 * but every data call behind them answers 403 NOT_ACTIVATED until then.
 *
 * Inert unless POSNIC_ENFORCE_ACTIVATION=1, which only the packaged shell
 * sets. Development, tests and the contributor server never see it.
 */

const activation = require('../utils/activation');

const OPEN_PREFIXES = ['/api/activation', '/activation', '/api/runtime-info'];
/* Exact matches only: '/api' must stay open as the info root without opening
   everything beneath it - prefix-matching it would exempt the whole API,
   which is precisely the routes this gate exists to guard. */
const OPEN_EXACT = new Set(['/api']);

function isOpenPath(urlPath) {
  const clean =
    String(urlPath || '/')
      .split('?')[0]
      .replace(/\/+$/, '') || '/';
  if (OPEN_EXACT.has(clean)) return true;
  return OPEN_PREFIXES.some((open) => clean === open || clean.startsWith(`${open}/`));
}

function activationGate(req, res, next) {
  if (!activation.isEnforcementOn()) return next();
  /* originalUrl, not req.path: this gate is mounted under /api and /,
     which strip the prefix before req.path is computed. */
  if (isOpenPath(req.originalUrl || req.url)) return next();
  const state = activation.status();
  if (state.activated) return next();
  return res.status(403).json({
    status: false,
    code: 'NOT_ACTIVATED',
    message: 'This till is not activated. Open the activation screen and enter the Muftgo key.',
    activationUrl: '/api/activation',
    needsSetup: false,
    needsMuftgoKey: true,
  });
}

module.exports = { activationGate, isOpenPath };
