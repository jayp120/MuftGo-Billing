'use strict';
/*
 * Shop activation endpoints + the activation screen.
 *
 * Deliberately a plain page served by the API rather than a screen in the
 * frontend bundle (same reason as pair.routes.js): it has to work on a till
 * that is mid-setup, with no database running and no built frontend, and be
 * openable by reading a URL off a support call. It depends on nothing but
 * this process.
 *
 * Brute force is counted in this process's memory, not the database - the
 * database may not exist yet when this is needed, and each shop has exactly
 * one API process, so per-process is per-shop here.
 */

const express = require('express');
const activation = require('../utils/activation');

const router = express.Router();

const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map();

function attemptKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    (typeof forwarded === 'string' && forwarded.split(',')[0].trim()) ||
    req.ip ||
    req.socket?.remoteAddress ||
    'unknown';
  return String(ip);
}

function isLockedOut(req) {
  const entry = attempts.get(attemptKey(req));
  if (!entry) return false;
  if (Date.now() - entry.firstAt > ATTEMPT_WINDOW_MS) {
    attempts.delete(attemptKey(req));
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(req) {
  const key = attemptKey(req);
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.firstAt > ATTEMPT_WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: Date.now() });
  } else {
    entry.count += 1;
  }
}

function recordSuccess(req) {
  attempts.delete(attemptKey(req));
}

function lockoutResponse(res) {
  return res.status(429).json({
    status: false,
    code: 'TOO_MANY_ATTEMPTS',
    message: 'Too many wrong keys. Wait ten minutes and try again.',
  });
}

router.get('/status', (req, res) => {
  res.json({ status: true, data: activation.status() });
});

/*
 * Removed: POST /setup and POST /change. The shop must never invent or rotate
 * this key - only the Muftgo team holds it. They return 410 Gone (not 404) so
 * an old client screen says "update your app" instead of silently failing.
 */
router.post('/setup', express.json({ limit: '10kb' }), (req, res) => {
  return res.status(410).json({
    status: false,
    code: 'GONE',
    message: 'Shops cannot set their own key. Call the Muftgo team to activate this till.',
  });
});

router.post('/activate', express.json({ limit: '10kb' }), (req, res) => {
  if (!activation.isEnforcementOn()) {
    return res
      .status(404)
      .json({ status: false, message: 'Activation is not enabled on this server.' });
  }
  if (isLockedOut(req)) return lockoutResponse(res);
  const result = activation.activateWithPassword(req.body?.password);
  if (!result.ok) {
    recordFailure(req);
    return res
      .status(401)
      .json({ status: false, code: 'ACTIVATION_FAILED', message: result.reason });
  }
  recordSuccess(req);
  return res.json({ status: true, message: 'Till activated. You can now sign in.' });
});

router.post('/change', express.json({ limit: '10kb' }), (req, res) => {
  return res.status(410).json({
    status: false,
    code: 'GONE',
    message: 'Shops cannot change this key. Call the Muftgo team.',
  });
});

/* One screen: enter the Muftgo team key. The shop never sets a key here -
   first launch, moved data and wrong keys all land on the same screen. */
router.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Activate MuftGo Billing</title>
<style>
  body { font: 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif;
         margin: 0; padding: 3rem 1rem; color: #111827; background: #f9fafb; }
  main { max-width: 26rem; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb;
         border-radius: 12px; padding: 2rem; }
  h1 { font-size: 1.3rem; margin: 0 0 .25rem; }
  p { color: #4b5563; }
  label { display: block; font-weight: 600; margin: 1rem 0 .25rem; }
  input { width: 100%; box-sizing: border-box; font-size: 1rem; padding: .6rem .75rem;
          border: 1px solid #d1d5db; border-radius: 8px; }
  button { width: 100%; margin-top: 1.25rem; font-size: 1rem; font-weight: 700;
           padding: .7rem; border: 0; border-radius: 8px; background: #111827; color: #fff;
           cursor: pointer; }
  button:disabled { opacity: .5; cursor: wait; }
  #msg { min-height: 1.6em; margin-top: 1rem; font-weight: 600; }
  #msg.ok { color: #047857; } #msg.err { color: #b91c1c; }
  .hint { font-size: .85rem; color: #6b7280; }
</style>
</head>
<body>
<main>
  <h1 id="title">Activate MuftGo Billing</h1>
  <p id="desc">Checking this machine…</p>
  <div id="form" style="display:none">
    <label for="pw">Muftgo activation key</label>
    <input id="pw" type="password" autocomplete="current-password" placeholder="Enter the key from the Muftgo team">
    <button id="go">Activate</button>
    <p class="hint">Only the Muftgo team has this key - call them once per computer.
    Minimum ${activation.MIN_PASSWORD_LENGTH} characters. After 10 wrong tries this screen locks for ten minutes.</p>
  </div>
  <p id="msg" role="status"></p>
</main>
<script>
(function () {
  var msg = document.getElementById('msg');
  var form = document.getElementById('form');
  var desc = document.getElementById('desc');
  var title = document.getElementById('title');
  var pw = document.getElementById('pw');
  var go = document.getElementById('go');
  var mode = 'activate';
  var csrfToken = null;
  function learn(r) {
    try { var t = r.headers && r.headers.get && r.headers.get('X-CSRF-TOKEN'); if (t) csrfToken = t; } catch (e) {}
    return r;
  }
  function say(text, ok) {
    msg.textContent = text;
    msg.className = ok ? 'ok' : 'err';
  }
  fetch('./activation/status', { cache: 'no-store', credentials: 'same-origin' }).then(learn).then(function (r) { return r.json(); }).then(function (body) {
    var s = body.data || {};
    if (!s.enforced) { title.textContent = 'No activation needed'; desc.textContent = 'This server does not require activation.'; return; }
    if (s.activated) {
      title.textContent = 'Already activated';
      desc.textContent = 'This till is activated. You can close this page and sign in.';
      say('Activated on this machine.', true);
      return;
    }
    if (s.machineChanged) {
      desc.textContent = 'This data was copied from another computer. Call the Muftgo team and enter the key to activate this machine.';
    } else {
      desc.textContent = 'Call the Muftgo team, enter the key they give you, and press Activate. One key entry per computer.';
    }
    form.style.display = 'block';
    pw.focus();
  }).catch(function () { say('Could not reach the server. Is the billing app running?'); });
  function submit(retry) {
    if (!pw.value) { say('Type the key first.'); return; }
    go.disabled = true;
    say('Checking…', true);
    var headers = { 'Content-Type': 'application/json' };
    if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken;
    fetch('./activation/' + mode, {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers,
      body: JSON.stringify({ password: pw.value })
    }).then(function (r) { learn(r); return r.json().then(function (b) { return { http: r.status, body: b }; }); }).then(function (out) {
      if (out.http === 403 && !retry && out.body && out.body.message && /security token/i.test(out.body.message) && csrfToken) {
        go.disabled = false;
        return submit(true);
      }
      go.disabled = false;
      if (out.body && out.body.status) {
        say('Activated. Restart the app or open the login page to sign in.', true);
        form.style.display = 'none';
      } else {
        say((out.body && out.body.message) || 'Activation failed (error ' + out.http + ').');
      }
    }).catch(function () { go.disabled = false; say('Could not reach the server.'); });
  }
  go.addEventListener('click', function () { submit(false); });
  pw.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(false); });
})();
</script>
</body>
</html>`);
});

module.exports = router;
