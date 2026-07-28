# Smart-Facility-Frontend
### Phase 1 — Global Structure, Design System & Components (pure static HTML/CSS/JS)

No Django, no Python, no build step. This is a standalone frontend project
that opens directly in a browser (or any static file server) and is ready to
be wired to a Django backend later without any architectural rework.

---

## 1. Folder structure

```
Smart-Facility-Frontend/
    preview.html                Phase 1 wiring-check page (not a product page — see §5)

    assets/
        css/
            variables.css        design tokens: color, type, spacing, radius, shadow, motion
            design-system.css    resets, typography classes, layout primitives, icon grammar
            components.css       every component's default/hover/active/disabled/loading states
            animations.css       all keyframes + motion utilities + prefers-reduced-motion guard
            responsive.css       sidebar/topbar/grid breakpoints
            auth.css             the one page-specific layout (auth split-screen)
        js/
            app.js                entry point — awaits includes, then initializes every module
            include.js             fetch()-based HTML partial loader (the static equivalent of {% include %})
            nav-config.js           per-role sidebar navigation data + icon library
            sidebar.js               renders nav from nav-config.js, collapse, mobile drawer
            notifications.js         toast queue + notification drawer
            command-palette.js       Ctrl+K overlay, keyboard nav
            search.js                 pure filtering utilities (shared by palette + inline search)
            filters.js                 list-page filter pills, URL query-param sync
            charts.js                  dependency-free SVG area/donut/ring renderers
            animations.js               animated counters, scroll reveal, stagger
        icons/                      (reserved — standalone icon assets if ever needed beyond inline SVG)
        images/                     (reserved — project photos, illustrations)

    components/                  reusable partials — see §3 for the two different kinds
        sidebar.html
        navbar.html
        breadcrumbs.html
        notifications.html
        modals.html
        buttons.html
        cards.html
        tables.html
        forms.html
        dropdowns.html
        charts.html
        timeline.html
        loading.html
        empty-states.html

    pages/                       Phase 2 onward — currently empty folders, ready to fill
        authentication/
        super-admin/
        construction-manager/
        operations-manager/
        security-officer/
        shared/
```

---

## 2. How to run it

No build step, no server required for basic use — but `fetch()` (used by
`include.js`) needs `http://`, not `file://`, in most browsers. From this
folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/preview.html
```

Any static file server works identically (VS Code Live Server, `npx serve`, etc).

---

## 3. Two different meanings of "component" here

Static HTML has no `{% include with variant="..." %}` equivalent, so the
14 requested component files split into two real, different patterns:

**A. Fetchable partials** (`sidebar.html`, `navbar.html`, `breadcrumbs.html`,
`notifications.html`, `modals.html`) — genuinely shared markup, loaded once
per page at runtime via:

```html
<div data-include="../../components/sidebar.html"></div>
```

`assets/js/include.js` fetches and injects these before any other JS module
runs. Change `components/sidebar.html` once, every page picks it up.

**B. Pattern-library references** (`buttons.html`, `cards.html`, `tables.html`,
`forms.html`, `dropdowns.html`, `charts.html`, `timeline.html`, `loading.html`,
`empty-states.html`) — these are **not** fetched. A button, badge, or table
row is too small and too context-specific (different label/data per usage)
to justify a network round-trip per instance. Instead, each file is a
copy-paste reference showing every variant and state, all built on the exact
same CSS classes in `components.css` — so there is no duplicated *styling*,
only duplicated *markup*, which is unavoidable in a build-tool-free static
site and is exactly what Django's `{% include %}` will replace later.

---

## 4. Role-based sidebar without a backend

`assets/js/nav-config.js` holds `ROLE_CONFIG` — the exact nav structure and
identity for all four roles, ported directly from the Django context
processor used in the Django-templates build. `sidebar.js` reads
`document.body.dataset.role` and renders the matching nav + identity into
both the sidebar and navbar (both carry `[data-role-*]` placeholders).

Every real page sets this on `<body>`:

```html
<body data-role="construction_manager" data-active-page="construction-dashboard">
```

When Django is wired in later, the backend can render this same attribute
server-side from `request.user.role` — `nav-config.js`'s `ROLE_CONFIG`
object maps almost line-for-line onto the Django context processor it will
eventually replace.

---

## 5. About `preview.html`

Not a product page. It exists solely to prove, before Phase 2 starts, that:
includes load, the sidebar renders the correct role's nav, breadcrumbs render
from `data-breadcrumbs`, the KPI counter animates, and the toast/command-palette
JS actually fires. Safe to delete once Phase 2 pages exist — it was never in
the requested page inventory.

---

## 6. Phase 2 — Authentication (complete)

`pages/authentication/` now has four real, working pages:

- **`login.html`** — validated form, "remember me" (currently cosmetic —
  session handling is a backend concern), forgot-password link, and a
  working **authentication error state**: try any credentials other than
  the demo pair to see the invalid-login alert render live.
- **`forgot-password.html`** — one page, two states toggled by JS
  (`data-forgot-request-state` / `data-forgot-success-state`): request form
  → "check your email" success screen, with a working resend link (toast).
- **`reset-password.html`** — new-password form with a live JS strength
  meter and match validation, plus the **expired-link error state**,
  reachable at `reset-password.html?invalid=1` since there's no backend yet
  to determine real link validity.
- **`reset-password-success.html`** — the dedicated success confirmation page.

**Demo credentials** (frontend-only, clearly marked `DEMO ONLY` in `auth.js`
for easy removal once a backend exists): `demo@sflms.sa` / `Demo@1234`.

Two components were added to support this phase:
- **`components/auth-brand-panel.html`** — a new *fetchable* partial (not a
  pattern-library reference) since the split-screen brand panel is identical
  across all four auth pages, same reasoning as `sidebar.html`/`navbar.html`.
- **`components/alerts.html`** — the alert pattern-library reference that
  was missing from Phase 1's component set; the CSS for it already existed
  in `components.css`, this just adds the copy-paste markup reference.
- **`assets/js/auth.js`** — new module, loaded only on the three interactive
  auth pages (after `app.js`), holding real field validation plus the
  clearly-marked demo logic standing in for backend calls.

**Next: Phase 3 — Super Admin complete interfaces.**

## 7. Phase 3 — Super Admin (complete)

All 13 pages built in `pages/super-admin/`, sharing the same sidebar/navbar/
breadcrumbs includes and role context (`data-role="super_admin"`):

- **`dashboard.html`** — the executive command center (KPI band, area +
  donut charts via `charts.js`, asset health bars, risk indicators, live
  activity timeline, quick actions, facility status strip).
- **`projects.html`** — grid/list view toggle, client-side status filters,
  live search, both views kept in sync.
- **`create-project.html` / `edit-project.html`** — full forms (name, type,
  location, description, dates, status, manager assignment, image upload
  zone), `edit` adds a danger-zone delete flow wired to the shared confirm
  modal.
- **`project-details.html`** — header with progress ring + 8 tabs (Overview,
  Stages, Progress, Materials, Quality, Reports, Documents, Activity Log)
  using the new `.tabs-bar` / `.tab-panel` component.
- **`users.html`** — searchable/filterable table, role badges, add-user modal.
- **`user-details.html`** — profile header, activity timeline, permissions
  summary, account-suspend toggle.
- **`roles-permissions.html`** — a real interactive permission matrix
  (click any cell to toggle, persists visually + toast confirmation).
- **`reports.html`** — six report-type cards with PDF/Excel export buttons,
  plus a table of previously generated reports.
- **`analytics.html`** — trend chart, facility comparison bars, project-type
  donut, and a written executive summary.
- **`notifications.html`** — the full notification center (distinct from the
  navbar drawer): categorized, searchable, filterable, bulk mark-as-read.
- **`audit-logs.html`** — filterable action log with a details modal per row.
- **`settings.html`** — a 7-section settings shell (General, Appearance,
  Security, Notifications, Roles, Integrations, System Information).

New reusable components added to `components.css` in this phase — usable by
every future module, not just Super Admin: **tabs**, **view-toggle**
(grid/list), **entity-grid** (project/user/asset cards), **permission
matrix**, **settings shell**, and a **toggle switch**.

All content is real Arabic engineering/facility-management content specific
to this platform — no Lorem Ipsum, no placeholder cards.

**Next: Phase 4 — Construction Manager complete interfaces.**
