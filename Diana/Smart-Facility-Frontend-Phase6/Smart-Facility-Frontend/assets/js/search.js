/**
 * search.js
 * Pure search/filtering utilities — no UI here. The command palette overlay
 * lives in command-palette.js; this module is also reused by list-page
 * inline search boxes (projects list, users list, alerts list, etc.).
 */

/**
 * Filters an array of {label, group, ...} objects by a query string,
 * matching against `label` and `group` case-insensitively.
 */
export function filterIndex(query, index = []) {
  const q = query.trim().toLowerCase();
  if (!q) return index;
  return index.filter(item =>
    item.label?.toLowerCase().includes(q) || item.group?.toLowerCase().includes(q)
  );
}

/**
 * Wires a debounced live-search input (used on list pages) to a callback.
 * Usage:
 *   bindLiveSearch(document.querySelector('[data-live-search]'), (value) => { ... });
 */
export function bindLiveSearch(inputEl, onChange, delay = 250) {
  if (!inputEl) return;
  let timer;
  inputEl.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onChange(inputEl.value), delay);
  });
}

/** Initializes any [data-live-search] inputs found on the page against
 *  their sibling [data-searchable] row list, filtering by data-search-text. */
export function initInlineSearch() {
  document.querySelectorAll('[data-live-search]').forEach(input => {
    const scope = document.querySelector(input.dataset.liveSearch);
    if (!scope) return;
    const rows = () => scope.querySelectorAll('[data-search-text]');

    bindLiveSearch(input, (value) => {
      const q = value.trim().toLowerCase();
      let visibleCount = 0;
      rows().forEach(row => {
        const match = !q || row.dataset.searchText.toLowerCase().includes(q);
        row.style.display = match ? '' : 'none';
        if (match) visibleCount += 1;
      });
      scope.dispatchEvent(new CustomEvent('search:filtered', { detail: { visibleCount, query: q } }));
    });
  });
}
