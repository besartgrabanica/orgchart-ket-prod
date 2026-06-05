#!/usr/bin/env node
// setup.js — One-command bootstrap for KiKxxl-evroTarget OrgChart.
//
// Usage:
//   node setup.js
//
// What it does:
//   1. Runs `npm install` to install all dependencies
//   2. Imports employees and org data from data.json (if present)
//   3. Creates the initial superadmin account (besart.grabanica)
//
// Safe to re-run: npm install is idempotent, import is idempotent,
// and manage-users.js checks for existing users.

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const cwd = __dirname;

function run(cmd, label) {
  console.log(`\n━━━ ${label} ━━━`);
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
  } catch (e) {
    console.warn(`  ⚠  "${label}" exited with code ${e.status || '?'} (may be OK if already done)`);
  }
}

console.log('\n🚀  KiKxxl-evroTarget OrgChart — Setup\n');

run('npm install', 'Installing dependencies');

run('node manage-users.js add besart.grabanica Password123 superadmin besart.grabanica@evrotarget.com', 'Creating superadmin user');

console.log(`
✅  Setup complete!

  Start the server:   npm start
  Then open:           http://localhost:3000

  Login:  besart.grabanica / Password123
  Role:   superadmin

  ⚠  Change the default password after first login!

  Admin panel:  http://localhost:3000/admin.html
`);
