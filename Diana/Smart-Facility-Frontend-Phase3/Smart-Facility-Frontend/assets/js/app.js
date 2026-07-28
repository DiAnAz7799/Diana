/**
 * app.js — Entry point.
 * Loaded once via <script type="module" src="../../assets/js/app.js"></script>
 * near the end of every page's <body>.
 *
 * Load order matters: initIncludes() fetches and injects the sidebar/navbar/
 * notifications/modals partials from /components/*.html first — every other
 * module queries elements that only exist after that injection completes.
 */

import { initIncludes } from './include.js';
import { initSidebar } from './sidebar.js';
import { initNotifications, showToast } from './notifications.js';
import { initCommandPalette } from './command-palette.js';
import { initInlineSearch } from './search.js';
import { initFilters } from './filters.js';
import { initAnimations } from './animations.js';
import { initDeclarativeCharts } from './charts.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initIncludes();

  initSidebar();
  initNotifications();
  initCommandPalette();
  initInlineSearch();
  initFilters();
  initAnimations();
  initDeclarativeCharts();
  initTabs();
  initDropdowns();
  initModals();
  initAlerts();

  document.body.classList.add('is-ready'); // hook for a page fade-in if desired
});

// Expose showToast globally for inline onclick handlers on static pages,
// e.g. a "save" button calling SFLMS.showToast(...) before a real backend exists.
window.SFLMS = window.SFLMS || {};
window.SFLMS.showToast = showToast;

/* ---------- Tabs (used on Project Details / Facility Details workspaces) ---------- */
function initTabs(){
  document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
    const triggers = tabGroup.querySelectorAll('[data-tab-trigger]');
    const panels = tabGroup.querySelectorAll('[data-tab-panel]');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const target = trigger.dataset.tabTrigger;
        triggers.forEach(t => t.classList.toggle('is-active', t === trigger));
        panels.forEach(p => p.classList.toggle('is-active', p.dataset.tabPanel === target));
      });
    });
  });
}

/* ---------- Dropdowns (profile menu, table row actions, filters) ---------- */
function initDropdowns(){
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('[data-dropdown-trigger]');
    const menu = dropdown.querySelector('.dropdown-menu');
    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.dropdown-menu.is-open').forEach(m => { if (m !== menu) m.classList.remove('is-open'); });
      menu?.classList.toggle('is-open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.is-open').forEach(m => m.classList.remove('is-open'));
  });
}

/* ---------- Alerts (dismissible banners) ---------- */
function initAlerts(){
  document.querySelectorAll('[data-alert-dismiss]').forEach(btn => {
    btn.addEventListener('click', () => {
      const alert = btn.closest('.alert');
      if (!alert) return;
      alert.style.transition = 'opacity 180ms ease, transform 180ms ease, margin 180ms ease, max-height 180ms ease';
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-4px)';
      setTimeout(() => alert.remove(), 180);
    });
  });
}

/* ---------- Modals ---------- */
function initModals(){
  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modal = document.getElementById(trigger.dataset.modalTrigger);
      modal?.classList.add('is-open');
    });
  });
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => backdrop.classList.remove('is-open'));
    });
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('is-open');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      document.querySelectorAll('.modal-backdrop.is-open').forEach(b => b.classList.remove('is-open'));
    }
  });
}
