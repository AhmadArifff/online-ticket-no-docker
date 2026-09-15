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

document.querySelectorAll('[data-preview-state]').forEach((button) => {
  button.addEventListener('click', () => setPaymentState(button.dataset.previewState));
});

function setPaymentState(state) {
  const card = document.querySelector('[data-payment-state]');
  const content = {
    success: { symbol: '✓', eyebrow: 'You are all set', title: 'Payment is<br><em>confirmed.</em>', copy: 'Your ticket is ready. We sent the details and QR code to you@example.com.', action: 'View your ticket' },
    pending: { symbol: '...', eyebrow: 'Payment status', title: 'Payment is<br><em>processing.</em>', copy: 'We have your order. Stripe is confirming the payment now, and your ticket will appear as soon as it is complete.', action: 'View order status' },
    failed: { symbol: '!', eyebrow: 'Something got in the way', title: 'Payment did not<br><em>go through.</em>', copy: 'No money was taken. Check your payment details and try again, or choose another method.', action: 'Try payment again' },
    cancelled: { symbol: '—', eyebrow: 'Checkout cancelled', title: 'Your order is<br><em>still here.</em>', copy: 'Nothing was charged. Your reserved tickets will be held for a short while longer.', action: 'Return to checkout' },
  }[state];
  card.dataset.paymentState = state;
  document.querySelector('[data-result-symbol]').textContent = content.symbol;
  document.querySelector('[data-result-eyebrow]').textContent = content.eyebrow;
  document.querySelector('[data-result-title]').innerHTML = content.title;
  document.querySelector('[data-result-copy]').textContent = content.copy;
  document.querySelector('[data-primary-action]').innerHTML = `${content.action} <span aria-hidden="true">&#8594;</span>`;
  card.classList.remove('state-refresh');
  requestAnimationFrame(() => card.classList.add('state-refresh'));
}

document.querySelector('[data-copy-reference]')?.addEventListener('click', async (event) => {
  const reference = document.querySelector('.order-reference strong').textContent;
  try { await navigator.clipboard.writeText(reference); } catch { /* fixture-only fallback */ }
  event.currentTarget.textContent = 'Copied';
  showToast('Order reference copied');
  setTimeout(() => { event.currentTarget.textContent = 'Copy'; }, 1800);
});

const state = new URLSearchParams(window.location.search).get('state');
if (state && ['success', 'pending', 'failed', 'cancelled'].includes(state)) setPaymentState(state);
