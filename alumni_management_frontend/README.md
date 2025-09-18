# Alumni Management Frontend (Ocean Professional)

A React JS frontend prototype for the Alumni Management System featuring:
- Authentication (login/register), role-based routing
- Dashboards for Student, Alumni, Admin, Placement Officer, Mentor
- Workflows: Webinars, Mentorship, Job postings/applications
- Reports page with basic aggregates
- TailwindCSS styling in the Ocean Professional theme
- In-memory/mock data only (no backend)

## Quick start
1. Install dependencies
   - npm install
2. Start the dev server
   - npm start
3. Open http://localhost:3000

## TailwindCSS
Tailwind is configured via tailwind.config.js and postcss.config.js. Classes are used directly in components.

## Roles and quick accounts
Use the Login page's quick buttons or these credentials (password: pass1234):
- student@example.com
- alumni@example.com
- mentor@example.com
- placement@example.com
- admin@example.com

## Structure
- src/context/AuthContext.jsx — in-memory auth and session
- src/context/DataContext.jsx — in-memory data and actions
- src/components/layout/AppLayout.jsx — topbar + sidebar
- src/pages/** — pages for auth, dashboard, features

No external APIs are called. All state is local to the browser.
