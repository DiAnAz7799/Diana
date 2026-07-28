/**
 * sidebar.js
 * Renders the role-specific nav into the injected sidebar partial (from
 * components/sidebar.html), then wires up collapse/mobile-drawer behavior.
 *
 * Reads role + current page from <body data-role="..." data-active-page="...">,
 * set manually per page for now. When connected to Django, the backend can
 * set these two attributes server-side instead of JS reading a default.
 */

import { ROLE_CONFIG, ICONS } from './nav-config.js';

const STORAGE_KEY = 'sflms:sidebar-collapsed';

export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  renderIdentity();
  renderNav(sidebar);

  const collapseBtn = sidebar.querySelector('[data-sidebar-collapse]');
  const mobileToggle = document.querySelector('[data-sidebar-mobile-toggle]');
  const scrim = document.querySelector('[data-sidebar-scrim]');

  if (localStorage.getItem(STORAGE_KEY) === '1') sidebar.classList.add('is-collapsed');

  collapseBtn?.addEventListener('click', () => {
    const collapsed = sidebar.classList.toggle('is-collapsed');
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
  });

  const openMobile = () => {
    sidebar.classList.add('is-mobile-open');
    scrim?.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };
  const closeMobile = () => {
    sidebar.classList.remove('is-mobile-open');
    scrim?.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', openMobile);
  scrim?.addEventListener('click', closeMobile);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-mobile-open')) closeMobile();
  });
  sidebar.querySelectorAll('.nav-item[href]').forEach(link => link.addEventListener('click', closeMobile));
}

function getRoleConfig() {
  const roleKey = document.body.dataset.role || 'super_admin';
  return { roleKey, config: ROLE_CONFIG[roleKey] || ROLE_CONFIG.super_admin };
}

function renderIdentity() {
  const { config } = getRoleConfig();
  document.querySelectorAll('[data-role-avatar]').forEach(el => el.textContent = config.avatar);
  document.querySelectorAll('[data-role-name]').forEach(el => el.textContent = config.name);
  document.querySelectorAll('[data-role-label]').forEach(el => el.textContent = `${config.labelAr} · ${config.labelEn}`);
  document.querySelectorAll('[data-role-label-short]').forEach(el => el.textContent = config.labelAr);
}

function renderNav(sidebar) {
  const { config } = getRoleConfig();
  const activePage = document.body.dataset.activePage;
  const container = sidebar.querySelector('[data-nav-container]');
  if (!container) return;

  container.innerHTML = config.nav.map(group => `
    <div class="nav-group">
      <div class="nav-title">${group.title}</div>
      ${group.items.map(([label, href, pageId, iconKey]) => `
        <a href="${href}" class="nav-item ${pageId === activePage ? 'active' : ''}" data-page="${pageId}">
          <span class="ic">
            <svg class="gi" viewBox="0 0 24 24" style="width:19px;height:19px;">${ICONS[iconKey] || ''}</svg>
          </span>
          <span class="lbl">${label}</span>
        </a>
      `).join('')}
    </div>
  `).join('');
}
