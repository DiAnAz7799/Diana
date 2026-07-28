/**
 * auth.js
 * Client-side validation and interaction for the three auth pages. Since
 * this is a pure frontend project with no backend yet, form "submission"
 * is simulated: real field validation runs for real, but the
 * success/failure branch after that is driven by a demo rule documented
 * inline below each function, clearly marked for replacement once a
 * backend exists.
 *
 * Loaded only on the three auth pages (after app.js), not globally —
 * dashboards etc. have no use for it.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initForgotPasswordForm();
  initResetPasswordForm();
});

/* ============================== LOGIN ============================== */
function initLoginForm() {
  const form = document.querySelector('[data-login-form]');
  if (!form) return;

  const emailField = form.querySelector('[name="username"]');
  const passwordField = form.querySelector('[name="password"]');
  const submitBtn = form.querySelector('[type="submit"]');
  const alertSlot = document.querySelector('[data-auth-alert-slot]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFieldErrors(form);
    clearAlert(alertSlot);

    let valid = true;
    if (!emailField.value.trim()) valid = fieldError(emailField, 'هذا الحقل مطلوب') && false;
    if (!passwordField.value.trim()) valid = fieldError(passwordField, 'هذا الحقل مطلوب') && false;
    if (!valid) return;

    submitBtn.classList.add('is-loading');

    // ---- DEMO ONLY: replace with a real POST to the backend ----
    // Demo credentials: demo@sflms.sa / Demo@1234 — anything else shows the
    // "invalid credentials" alert, exercising the authentication error state.
    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      const isDemoMatch = emailField.value.trim() === 'demo@sflms.sa' && passwordField.value === 'Demo@1234';

      if (isDemoMatch) {
        window.SFLMS?.showToast({ type: 'success', title: 'تم تسجيل الدخول بنجاح', desc: 'جارٍ تحويلك إلى لوحة التحكم...' });
        setTimeout(() => { window.location.href = '../../preview.html'; }, 900);
      } else {
        renderAlert(alertSlot, 'critical', 'بيانات الدخول غير صحيحة', 'تحقق من البريد الإلكتروني وكلمة المرور ثم حاول مرة أخرى. (جرّب demo@sflms.sa / Demo@1234)');
      }
    }, 700);
  });
}

/* ============================== FORGOT PASSWORD ============================== */
function initForgotPasswordForm() {
  const form = document.querySelector('[data-forgot-form]');
  if (!form) return;

  const emailField = form.querySelector('[name="email"]');
  const submitBtn = form.querySelector('[type="submit"]');
  const requestState = document.querySelector('[data-forgot-request-state]');
  const successState = document.querySelector('[data-forgot-success-state]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFieldErrors(form);

    if (!isValidEmail(emailField.value)) {
      fieldError(emailField, 'أدخل بريدًا إلكترونيًا صالحًا');
      return;
    }

    submitBtn.classList.add('is-loading');

    // ---- DEMO ONLY: replace with a real POST to the backend ----
    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      requestState.style.display = 'none';
      successState.style.display = '';
      successState.classList.add('anim-fade-in-up');
    }, 700);
  });

  document.querySelector('[data-forgot-resend]')?.addEventListener('click', () => {
    window.SFLMS?.showToast({ type: 'success', title: 'تم إعادة إرسال الرابط', desc: 'تحقق من بريدك الإلكتروني مرة أخرى.' });
  });
}

/* ============================== RESET PASSWORD ============================== */
function initResetPasswordForm() {
  const form = document.querySelector('[data-reset-form]');
  if (!form) return;

  // ---- DEMO ONLY: a real backend determines link validity server-side
  // (Django's PasswordResetConfirmView sets `validlink`). Here it's read
  // from a query param so the "expired link" state is reachable for review:
  // reset-password.html?invalid=1
  const params = new URLSearchParams(window.location.search);
  if (params.get('invalid') === '1') {
    document.querySelector('[data-reset-valid-state]').style.display = 'none';
    document.querySelector('[data-reset-invalid-state]').style.display = '';
    return;
  }

  const pw1 = form.querySelector('[name="new_password1"]');
  const pw2 = form.querySelector('[name="new_password2"]');
  const submitBtn = form.querySelector('[type="submit"]');
  const segs = document.querySelectorAll('[data-pw-strength-meter] .pw-strength-seg');
  const label = document.querySelector('[data-pw-strength-label]');

  const LEVELS = [
    { color: 'var(--surface-alt)', text: 'قوة كلمة المرور: —' },
    { color: 'var(--critical)', text: 'قوة كلمة المرور: ضعيفة' },
    { color: 'var(--warning)', text: 'قوة كلمة المرور: متوسطة' },
    { color: 'var(--primary)', text: 'قوة كلمة المرور: جيدة' },
    { color: 'var(--success)', text: 'قوة كلمة المرور: قوية' },
  ];

  function score(value) {
    let s = 0;
    if (value.length >= 8) s += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) s += 1;
    if (/\d/.test(value)) s += 1;
    if (/[^A-Za-z0-9]/.test(value)) s += 1;
    return Math.min(s, 4);
  }

  pw1?.addEventListener('input', () => {
    const s = score(pw1.value);
    const level = LEVELS[s];
    segs.forEach((seg, i) => { seg.style.background = i < s ? level.color : 'var(--surface-alt)'; });
    if (label) { label.textContent = level.text; label.style.color = s === 0 ? 'var(--text-faint)' : level.color; }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFieldErrors(form);

    let valid = true;
    if (pw1.value.length < 8) { fieldError(pw1, 'يجب أن تتكوّن كلمة المرور من 8 أحرف على الأقل'); valid = false; }
    if (pw2.value !== pw1.value) { fieldError(pw2, 'كلمتا المرور غير متطابقتين'); valid = false; }
    if (!valid) return;

    submitBtn.classList.add('is-loading');

    // ---- DEMO ONLY: replace with a real POST to the backend ----
    setTimeout(() => {
      window.location.href = 'reset-password-success.html';
    }, 700);
  });
}

/* ============================== SHARED HELPERS ============================== */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function fieldError(input, message) {
  const field = input.closest('.field');
  field?.classList.add('has-error');
  let msg = field?.querySelector('.error-msg');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'error-msg';
    field?.appendChild(msg);
  }
  msg.textContent = message;
  msg.style.display = 'block';
  return true;
}

function clearFieldErrors(form) {
  form.querySelectorAll('.field.has-error').forEach(f => f.classList.remove('has-error'));
  form.querySelectorAll('.error-msg').forEach(m => { m.style.display = 'none'; });
}

function renderAlert(slot, variant, title, desc) {
  if (!slot) return;
  slot.innerHTML = `
    <div class="alert alert-${variant}" role="alert">
      <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
      <div class="alert-body">
        <div class="alert-title">${title}</div>
        <div class="alert-desc">${desc}</div>
      </div>
      <div class="alert-close" data-alert-dismiss>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </div>
    </div>`;
  slot.querySelector('[data-alert-dismiss]')?.addEventListener('click', () => clearAlert(slot));
}

function clearAlert(slot) {
  if (slot) slot.innerHTML = '';
}
