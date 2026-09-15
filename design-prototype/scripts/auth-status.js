const toastRegion = document.querySelector('[data-toast-region]');
let toastTimer;

function showToast(message) {
  toastRegion.textContent = message;
  toastRegion.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastRegion.classList.remove('is-visible'), 2400);
}

const interactiveSelector = 'button, a:not(.skip-link)';
document.addEventListener('pointerdown', (event) => {
  const control = event.target.closest(interactiveSelector);
  if (!control || event.button > 0) return;
  const bounds = control.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.setAttribute('aria-hidden', 'true');
  ripple.style.left = `${event.clientX - bounds.left}px`;
  ripple.style.top = `${event.clientY - bounds.top}px`;
  control.append(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
});

document.querySelectorAll('[data-status-mode]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.statusMode;
    document.querySelectorAll('[data-status-mode]').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('status-mode-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-status-view]').forEach((view) => { view.hidden = view.dataset.statusView !== mode; });
    document.querySelector('#status-title').innerHTML = mode === 'reset' ? 'Make a new<br><em>password.</em>' : 'Check your<br><em>inbox.</em>';
  });
});

document.querySelector('[data-resend]')?.addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.classList.add('is-pending');
  button.innerHTML = '<span>Sending...</span><span aria-hidden="true">...</span>';
  setTimeout(() => {
    button.classList.remove('is-pending');
    button.innerHTML = '<span>Email sent</span><span aria-hidden="true">&#10003;</span>';
    document.querySelector('[data-resend-note]').textContent = 'A fresh link is on its way. It expires in 24 hours.';
    showToast('Verification email resent');
  }, 650);
});

document.querySelector('[data-reset-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.querySelector('input').value.trim();
  const error = document.querySelector('[data-reset-error]');
  const note = document.querySelector('[data-reset-note]');
  const submit = form.querySelector('.status-action');
  error.textContent = '';
  if (!email || !email.includes('@')) {
    error.textContent = 'Enter a valid email address.';
    form.querySelector('input').closest('.form-field').classList.add('has-error');
    return;
  }
  form.querySelector('.form-field').classList.remove('has-error');
  submit.classList.add('is-pending');
  setTimeout(() => {
    submit.classList.remove('is-pending');
    note.textContent = 'If an account exists, a reset link will arrive shortly.';
    showToast('Reset link requested');
  }, 650);
});

const hashMode = window.location.hash === '#reset' ? 'reset' : 'verify';
document.querySelector(`[data-status-mode="${hashMode}"]`)?.click();
