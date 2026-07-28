/**
 * include.js
 * Since this is a plain static site (no Django, no build step), reusable
 * markup in /components/*.html is loaded at runtime via fetch() into any
 * element carrying [data-include]. This is the direct static-HTML
 * equivalent of Django's {% include "components/sidebar.html" %} — when
 * this project is later connected to Django, each [data-include] container
 * maps 1:1 onto a real {% include %} call, and this file can be deleted.
 *
 * Usage in any page:
 *   <div data-include="../../components/sidebar.html"></div>
 *   <div data-include="../../components/navbar.html"></div>
 *
 * Paths are relative to the PAGE, not to this script, since fetch()
 * resolves against the document location.
 *
 * IMPORTANT: other modules (sidebar.js, notifications.js, command-palette.js)
 * depend on the injected markup existing in the DOM. app.js awaits
 * initIncludes() before calling any other init function — see app.js.
 */

export async function initIncludes() {
  const nodes = [...document.querySelectorAll('[data-include]')];
  await Promise.all(nodes.map(loadInclude));
  applyBodyDataHooks();
}

/**
 * A few small per-page customizations are passed via <body data-*> attributes
 * rather than duplicating markup per page. Applied here, once, after every
 * partial has been injected (scripts inside fetched HTML do NOT execute —
 * that's a browser limitation of innerHTML — so this logic can't live inside
 * the component .html files themselves).
 */
function applyBodyDataHooks() {
  const searchLabel = document.querySelector('[data-search-placeholder-label]');
  const customPlaceholder = document.body.dataset.searchPlaceholder;
  if (searchLabel && customPlaceholder) searchLabel.textContent = customPlaceholder;

  renderBreadcrumbs();
}

function renderBreadcrumbs() {
  const container = document.querySelector('[data-breadcrumbs-container]');
  const raw = document.body.dataset.breadcrumbs;
  if (!container || !raw) return;

  let crumbs;
  try { crumbs = JSON.parse(raw); } catch { return; }

  container.innerHTML = crumbs.map((crumb, i) => {
    const separator = i > 0 ? '<span>/</span>' : '';
    const isLast = i === crumbs.length - 1;
    const content = (crumb.url && !isLast)
      ? `<a href="${crumb.url}" style="color:inherit;">${crumb.label}</a>`
      : `<span style="color:var(--text); font-weight:600;">${crumb.label}</span>`;
    return separator + content;
  }).join('');
}

async function loadInclude(node) {
  const path = node.getAttribute('data-include');
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const html = await res.text();
    node.innerHTML = html;
    node.removeAttribute('data-include');
    // Re-dispatch a custom event so late-binding code (e.g. nav renderer)
    // can react to a specific partial finishing, if it needs to.
    node.dispatchEvent(new CustomEvent('include:loaded', { bubbles: true, detail: { path } }));
  } catch (err) {
    node.innerHTML = `<div style="padding:16px; font-size:12px; color:var(--critical-dark, #B3384A);">
      تعذّر تحميل المكوّن: ${path}
    </div>`;
    console.error(`[include.js] Failed to load ${path}:`, err);
  }
}
