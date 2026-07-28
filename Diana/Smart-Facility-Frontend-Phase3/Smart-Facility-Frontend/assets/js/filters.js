/**
 * filters.js
 * Powers the filter bar used on every list page (Projects, Users, Assets,
 * Security Alerts, etc.): status pills, dropdown filters, and date range —
 * synced to the URL query string so filtered views are shareable/bookmarkable
 * and work correctly with Django's request.GET on the server for real
 * filtering once the backend is connected (this module only handles the
 * client-side UI state + optional instant client-side row filtering).
 *
 * Markup contract:
 *   <div data-filter-bar>
 *     <button data-filter="status" data-filter-value="active">نشط</button>
 *     <button data-filter="status" data-filter-value="delayed">متأخر</button>
 *     ...
 *   </div>
 * Clicking a pill toggles .is-active and updates ?status=active in the URL.
 * If data-filter-mode="client" is set on the bar, matching rows are also
 * shown/hidden immediately via each row's [data-filter-status] etc.
 */

export function initFilters() {
  document.querySelectorAll('[data-filter-bar]').forEach(bar => {
    const mode = bar.dataset.filterMode || 'server'; // 'server' = just navigates with query params
    const pills = bar.querySelectorAll('[data-filter]');

    // Restore active state from current URL on load
    const params = new URLSearchParams(window.location.search);
    pills.forEach(pill => {
      const key = pill.dataset.filter;
      const value = pill.dataset.filterValue;
      if (params.get(key) === value) pill.classList.add('is-active');
    });

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const key = pill.dataset.filter;
        const value = pill.dataset.filterValue;
        const alreadyActive = pill.classList.contains('is-active');

        // Only one active value per filter key (single-select pill group)
        bar.querySelectorAll(`[data-filter="${key}"]`).forEach(p => p.classList.remove('is-active'));

        const url = new URL(window.location.href);
        if (alreadyActive) {
          url.searchParams.delete(key);
        } else {
          pill.classList.add('is-active');
          url.searchParams.set(key, value);
        }

        if (mode === 'client') {
          applyClientFilter(bar, key, alreadyActive ? null : value);
          window.history.replaceState({}, '', url); // keep URL in sync without reload
        } else {
          window.location.href = url.toString(); // full navigation — Django view re-filters via request.GET
        }
      });
    });

    // Clear-all button, if present
    bar.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
      const url = new URL(window.location.href);
      pills.forEach(p => {
        p.classList.remove('is-active');
        url.searchParams.delete(p.dataset.filter);
      });
      if (mode === 'client') {
        window.history.replaceState({}, '', url);
        document.querySelectorAll('[data-filterable]').forEach(row => { row.style.display = ''; });
      } else {
        window.location.href = url.toString();
      }
    });
  });

  // Empty-state "مسح الفلاتر" button rendered by empty_states.html
  document.querySelectorAll('[data-clear-filters]').forEach(btn => {
    btn.addEventListener('click', () => window.location.href = window.location.pathname);
  });
}

function applyClientFilter(bar, key, value) {
  const scopeSelector = bar.dataset.filterScope || '[data-filterable]';
  document.querySelectorAll(scopeSelector).forEach(row => {
    if (!value) { row.style.display = ''; return; }
    const rowValue = row.dataset[toCamelCase('filter-' + key)];
    row.style.display = rowValue === value ? '' : 'none';
  });
}

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
