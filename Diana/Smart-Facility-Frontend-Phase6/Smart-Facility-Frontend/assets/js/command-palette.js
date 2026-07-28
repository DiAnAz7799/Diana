/**
 * command-palette.js
 * The ⌘K / Ctrl+K overlay UI. Delegates actual filtering to search.js so the
 * matching logic is shared with inline list-page search boxes.
 */

import { filterIndex } from './search.js';

let paletteEl, inputEl, resultsEl, activeIndex = 0, filtered = [];

export function initCommandPalette() {
  const trigger = document.querySelector('[data-search-trigger]');
  paletteEl = document.querySelector('.command-palette-backdrop');
  if (!paletteEl) return;

  inputEl = paletteEl.querySelector('input');
  resultsEl = paletteEl.querySelector('.command-palette-results');

  trigger?.addEventListener('click', open);
  paletteEl.addEventListener('click', (e) => { if (e.target === paletteEl) close(); });

  document.addEventListener('keydown', (e) => {
    const isShortcut = (e.key.toLowerCase() === 'k') && (e.metaKey || e.ctrlKey);
    if (isShortcut) { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
    if (paletteEl.classList.contains('is-open')) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
      if (e.key === 'Enter') { e.preventDefault(); selectActive(); }
    }
  });

  inputEl?.addEventListener('input', () => runQuery(inputEl.value));
}

function open() {
  paletteEl.classList.add('is-open');
  inputEl.value = '';
  inputEl.focus();
  runQuery('');
}
function close() { paletteEl.classList.remove('is-open'); }

function runQuery(query) {
  const index = window.SFLMS_SEARCH_INDEX || [];
  filtered = query.trim() ? filterIndex(query, index) : index.slice(0, 8);
  activeIndex = 0;
  render();
}

function render() {
  if (!resultsEl) return;
  if (filtered.length === 0) {
    resultsEl.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-faint); font-size:13px;">لا توجد نتائج مطابقة</div>`;
    return;
  }
  resultsEl.innerHTML = filtered.map((item, i) => `
    <div class="command-palette-item ${i === activeIndex ? 'is-active' : ''}" data-url="${item.url}">
      <span>${item.label}</span>
      ${item.group ? `<span class="command-palette-kbd" style="margin-inline-start:auto;">${item.group}</span>` : ''}
    </div>
  `).join('');
  resultsEl.querySelectorAll('.command-palette-item').forEach((el, i) => {
    el.addEventListener('mouseenter', () => { activeIndex = i; render(); });
    el.addEventListener('click', () => { window.location.href = el.dataset.url; });
  });
}

function moveActive(delta) {
  if (!filtered.length) return;
  activeIndex = (activeIndex + delta + filtered.length) % filtered.length;
  render();
}
function selectActive() {
  const item = filtered[activeIndex];
  if (item) window.location.href = item.url;
}
