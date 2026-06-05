# KiKxxl-evroTarget Organization Chart

A web-based organization chart and employee management system. It visualizes company structure — departments, positions, reporting lines, client projects, divisions, and compliance standards — in an interactive chart and a full admin panel.

## What It Does

- **Interactive org chart** — tree view of all employees with their positions, departments, and reporting lines. Filterable by department or project.
- **Employee management** — add, edit, and remove employees with positions, contact info, education, experience, multiple email addresses, and location.
- **Departments & positions** — create departments, assign positions to them, set department heads, define inter-department relationships (inputs/outputs).
- **Client projects** — track active projects with assigned team members, project heads, divisions, and status.
- **Divisions** — sub-groups within departments or projects, each with their own head and members.
- **Standards & compliance** — attach ISO/regulatory standards to departments and projects, track clause-level compliance.
- **User roles** — five levels of access: viewer, editor, admin, developer, superadmin.
- **Invitations & password reset** — invite new users via email and handle password resets (requires SMTP configuration).
- **Record locking** — prevents two editors from modifying the same record at the same time.
- **Automatic reporting line** — when adding or editing an employee, if no "Reports To" is selected, the system automatically assigns them to the head of their department or project. If no head is set (or they don't belong to any department/project), they default to reporting to the CEO.

## Requirements

- **Node.js** 18 or newer
- **npm** (comes with Node.js)
- No external database needed — uses SQLite (via `better-sqlite3`), created automatically on first run.

## Quick Setup

```bash
# 1. Clone the repo
git clone https://github.com/besartgrabanica/orgchart-ket-prod.git
cd orgchart-ket-prod

# 2. Run the setup script (installs deps, creates superadmin, imports sample data)
node setup.js

# 3. Start the server
npm start
```

Open http://localhost:3000 and log in:

- **Username:** `besart.grabanica`
- **Password:** `Password123`
- **Role:** superadmin

**Change the default password after first login** via the admin panel.

Admin panel: http://localhost:3000/admin.html

From there you can invite other users via email (requires SMTP configuration below).

## Email Configuration (Invitations & Password Reset)

The app can send invitation and password-reset emails. By default it runs in **dry-run mode** — emails are printed to the console log instead of being sent.

To enable real email delivery, set the following environment variables (either in `ecosystem_config.js` for PM2, or as standard env vars):

| Variable        | Description                                           | Example                                              |
|-----------------|-------------------------------------------------------|------------------------------------------------------|
| `SMTP_HOST`     | SMTP server hostname                                  | `smtp.office365.com`                                 |
| `SMTP_PORT`     | SMTP port (587 for STARTTLS, 465 for SSL)             | `587`                                                |
| `SMTP_USER`     | SMTP login / email address                            | `orgchart@yourcompany.com`                           |
| `SMTP_PASS`     | SMTP password or app password                         | `your-app-password`                                  |
| `MAIL_FROM`     | The "From" header on outgoing emails                  | `OrgChart <orgchart@yourcompany.com>`                |
| `APP_BASE_URL`  | Public URL of the app (used in email links)           | `https://orgchart.yourcompany.com`                   |

**Important:** Use a dedicated company email account for this app (e.g. `orgchart@yourcompany.com`). Do not use a personal email address.

### Example: ecosystem_config.js (for PM2)

Copy the example file and fill in your values:

```bash
cp ecosystem_config_example.js ecosystem_config.js
```

Edit `ecosystem_config.js`:

```js
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  SESSION_SECRET: 'generate-a-long-random-string-here',
  APP_BASE_URL: 'https://orgchart.yourcompany.com',
  SMTP_HOST: 'smtp.office365.com',
  SMTP_PORT: '587',
  SMTP_USER: 'orgchart@yourcompany.com',
  SMTP_PASS: 'your-app-password',
  MAIL_FROM: 'OrgChart <orgchart@yourcompany.com>',
}
```

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### Running with PM2

```bash
npm install -g pm2
pm2 start ecosystem_config.js
pm2 save
```

## User Management (CLI)

`manage-users.js` is a command-line tool for managing users without the web UI. It is not included in this repository (kept private). If you have it, usage is:

```bash
# Create a user
node manage-users.js add <username> <password> <role> <email>

# List all users
node manage-users.js list

# Change a user's role
node manage-users.js role <username> <new-role>

# Reset a password (emergency CLI fallback)
node manage-users.js passwd <username> <new-password>

# Delete a user
node manage-users.js delete <username>
```

Roles: `viewer`, `editor`, `admin`, `developer`, `superadmin`

## Project Structure

```
orgchart-ket/
├── server.js                   Main Express server (all API routes)
├── database.js                 SQLite schema, migrations, seed data
├── mailer.js                   Email sending (invites, password resets)
├── setup.js                    One-command install + first-user bootstrap
├── ecosystem_config_example.js PM2 config template (copy → ecosystem_config.js)
├── package.json
└── public/
    ├── index.html              Interactive org chart (read-only view)
    ├── admin.html              Full admin panel (CRUD for everything)
    ├── login.html              Login page
    ├── accept-invite.html      Invitation acceptance page
    └── reset-password.html     Password reset page
```

> `ecosystem_config.js`, `manage-users.js`, `import-employees.js`, and `data.json` are excluded from this repository as they contain credentials or sensitive company data.

The SQLite database (`orgchart.db`) is created automatically in the project root on first run. Back it up regularly.
