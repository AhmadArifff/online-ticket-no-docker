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

const states = {
  '404': ['!', 'Something needs a second look', 'We lost<br><em>that page.</em>', 'The page may have moved, or the link may have expired. Let\'s get you somewhere useful.', 'Go home', 'Try again'],
  '500': ['!', 'A temporary interruption', 'The room is<br><em>quiet for now.</em>', 'Something went wrong on our side. Your saved tickets and orders are still safe.', 'Go home', 'Try again'],
  maintenance: ['~', 'A short pause', 'We are making<br><em>things better.</em>', 'Gather is temporarily offline for maintenance. Please check back in a little while.', 'Go home', 'Report issue'],
  offline: ['•', 'You are offline', 'Some plans are<br><em>still available.</em>', 'Reconnect to browse fresh events. Your saved tickets remain available on this device.', 'View saved tickets', 'Reconnect'],
  loading: ['...', 'Just a moment', 'Finding your<br><em>next room.</em>', 'We are loading the latest information. This should only take a moment.', 'Go home', 'Wait'],
  empty: ['0', 'Nothing here yet', 'There is room<br><em>for more.</em>', 'No events match this view. Try another category or widen your search.', 'Browse events', 'Clear filters'],
  denied: ['×', 'Permission required', 'This room is<br><em>not yours yet.</em>', 'Sign in with an account that has access, or return to public events.', 'Sign in', 'Go home'],
};

function setSystemState(state) {
  const content = states[state];
  document.body.dataset.systemState = state;
  document.querySelector('[data-system-symbol]').textContent = content[0];
  document.querySelector('[data-system-eyebrow]').textContent = content[1];
  document.querySelector('[data-system-title]').innerHTML = content[2];
  document.querySelector('[data-system-copy]').textContent = content[3];
  document.querySelector('[data-system-primary]').innerHTML = `${content[4]} <span aria-hidden="true">&#8594;</span>`;
  document.querySelector('[data-system-secondary]').textContent = content[5];
  document.querySelector('[data-system-feedback]').textContent = '';
}

document.querySelectorAll('[data-system-state]').forEach((button) => {
  button.addEventListener('click', () => setSystemState(button.dataset.systemState));
});

document.querySelector('[data-system-primary]').addEventListener('click', () => {
  const state = document.body.dataset.systemState;
  if (state === 'denied') { window.location.href = 'auth.html'; return; }
  if (state === 'offline') { window.location.href = 'ticket-wallet.html'; return; }
  if (state === 'empty') { window.location.href = 'events.html'; return; }
  window.location.href = '../index.html';
});

document.querySelector('[data-system-secondary]').addEventListener('click', () => {
  const state = document.body.dataset.systemState;
  const feedback = document.querySelector('[data-system-feedback]');
  if (state === 'loading') { feedback.textContent = 'Still loading fixture data...'; return; }
  if (state === 'offline') { feedback.textContent = 'No connection detected. Showing cached content.'; showToast('Offline mode remains active'); return; }
  if (state === 'empty') { feedback.textContent = 'Filters cleared. Events are ready to browse.'; showToast('Filters cleared'); return; }
  feedback.textContent = state === 'maintenance' ? 'Issue report fixture opened.' : 'Retry requested. The fixture is ready.';
  showToast(state === 'maintenance' ? 'Issue report preview' : 'Retry requested');
});

setSystemState('404');
