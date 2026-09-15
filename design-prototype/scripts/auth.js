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

document.querySelectorAll('[data-toast]').forEach((element) => element.addEventListener('click', () => showToast(element.dataset.toast)));

document.querySelectorAll('[data-auth-mode]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const signup = tab.dataset.authMode === 'signup';
    document.querySelectorAll('[data-auth-mode]').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('switch-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.signup-only').forEach((field) => { field.hidden = !signup; });
    document.querySelector('[data-submit-label]').textContent = signup ? 'Create account' : 'Sign in';
    document.querySelector('.auth-heading h1').innerHTML = signup ? 'Make room<br><em>for more.</em>' : 'Welcome<br><em>back.</em>';
    document.querySelector('.auth-heading > p:last-child').textContent = signup ? 'A few details, then you are ready to find your next one.' : 'Keep your plans in one place, and find the next one.';
    clearErrors();
  });
});

document.querySelector('[data-password-toggle]')?.addEventListener('click', (event) => {
  const input = document.querySelector('#password');
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  event.currentTarget.textContent = visible ? 'Show' : 'Hide';
  event.currentTarget.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
});

document.querySelector('[data-auth-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();
  const form = event.currentTarget;
  const signup = document.querySelector('[data-auth-mode].switch-active').dataset.authMode === 'signup';
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  let valid = true;
  if (!email || !email.includes('@')) { setError('email', 'Enter a valid email address.'); valid = false; }
  if (password.length < 8) { setError('password', 'Use at least 8 characters.'); valid = false; }
  if (signup && !form.elements.name.value.trim()) { setError('name', 'Tell us your name first.'); valid = false; }
  if (!valid) { form.querySelector('[data-form-status]').textContent = 'Please check the highlighted fields.'; form.querySelector('[data-form-status]').classList.add('status-error'); return; }
  const submit = form.querySelector('[data-auth-submit]');
  submit.classList.add('is-pending');
  submit.querySelector('[data-submit-label]').textContent = 'Checking...';
  setTimeout(() => {
    submit.classList.remove('is-pending');
    submit.classList.add('is-success');
    submit.querySelector('[data-submit-label]').textContent = signup ? 'Account ready' : 'Signed in';
    form.querySelector('[data-form-status]').textContent = signup ? 'Check your inbox to verify your email.' : 'Welcome back. Taking you to your plans.';
    showToast(signup ? 'Account preview created' : 'Sign in preview complete');
  }, 700);
});

function setError(field, message) {
  const input = document.querySelector(`#${field === 'name' ? 'full-name' : field}`);
  input.closest('.form-field').classList.add('has-error');
  document.querySelector(`[data-error="${field}"]`).textContent = message;
}
function clearErrors() {
  document.querySelectorAll('.form-field').forEach((field) => field.classList.remove('has-error'));
  document.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
  document.querySelector('[data-form-status]').textContent = '';
  document.querySelector('[data-form-status]').classList.remove('status-error');
}
