/**
 * notifications.js
 * Toast queue (transient) + persistent notification drawer (bell icon).
 * Usage from any other module:
 *   import { showToast } from './notifications.js';
 *   showToast({ type: 'success', title: 'تم الحفظ', desc: 'تم حفظ المشروع بنجاح' });
 */

const ICONS = {
  success: '<path d="M5 13l4 4L19 7"/>',
  critical: '<path d="M12 3l8.5 3.5v6c0 5.5-3.6 8.5-8.5 10.5-4.9-2-8.5-5-8.5-10.5v-6L12 3z"/><path d="M12 9v5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/>',
};

let stack = null;

export function initNotifications(){
  stack = document.querySelector('.toast-stack');
  if (!stack){
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  }
  initDrawer();
}

export function showToast({ type = 'info', title, desc = '', duration = 4500 }){
  if (!stack) initNotifications();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <svg class="gi" width="16" height="16" viewBox="0 0 24 24">${ICONS[type] || ICONS.info}</svg>
    </div>
    <div>
      <div class="toast-title">${title}</div>
      ${desc ? `<div class="toast-desc">${desc}</div>` : ''}
    </div>
  `;
  stack.appendChild(toast);

  const remove = () => {
    toast.classList.add('is-leaving');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };
  const timer = setTimeout(remove, duration);
  toast.addEventListener('click', () => { clearTimeout(timer); remove(); });
}

function initDrawer(){
  const bellBtn = document.querySelector('[data-notif-toggle]');
  const drawer = document.querySelector('.notif-drawer');
  const closeBtn = drawer?.querySelector('[data-notif-close]');
  if (!bellBtn || !drawer) return;

  const open = () => drawer.classList.add('is-open');
  const close = () => drawer.classList.remove('is-open');

  bellBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Mark all as read
  drawer.querySelector('[data-notif-mark-all-read]')?.addEventListener('click', () => {
    drawer.querySelectorAll('.notif-row.is-unread').forEach(row => {
      row.classList.remove('is-unread');
      row.querySelector('.notif-unread-dot')?.remove();
    });
    bellBtn.querySelector('.dot')?.remove();
  });
}
