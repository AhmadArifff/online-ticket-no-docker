const toastRegion = document.querySelector('[data-toast-region]');
let toastTimer;
let quantity = 2;
let voucherDiscount = 0;

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

document.querySelectorAll('[data-payment-method]').forEach((method) => {
  method.addEventListener('click', () => {
    document.querySelectorAll('[data-payment-method]').forEach((item) => {
      const active = item === method;
      item.classList.toggle('payment-method-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  });
});

document.querySelectorAll('[data-order-quantity]').forEach((button) => {
  button.addEventListener('click', () => {
    quantity = button.dataset.orderQuantity === 'increase' ? Math.min(quantity + 1, 6) : Math.max(quantity - 1, 1);
    updateSummary();
  });
});

document.querySelector('[data-apply-voucher]')?.addEventListener('click', () => {
  const input = document.querySelector('[data-voucher]');
  const message = document.querySelector('[data-voucher-message]');
  if (input.value.trim().toUpperCase() === 'GATHER10') {
    voucherDiscount = 90000;
    message.textContent = 'Voucher applied: −Rp90k';
    updateSummary();
    showToast('Voucher applied');
    return;
  }
  message.textContent = 'Try GATHER10 for this prototype.';
  showToast('Voucher not recognised');
});

function updateSummary() {
  const subtotal = 450000 * quantity;
  const fee = Math.round(subtotal * .03);
  const total = subtotal + fee - voucherDiscount;
  document.querySelector('[data-order-quantity-value]').textContent = quantity;
  document.querySelector('[data-subtotal]').textContent = `Rp${subtotal / 1000}k`;
  document.querySelector('[data-fee]').textContent = `Rp${fee / 1000}k`;
  document.querySelector('[data-summary-total]').textContent = `Rp${total / 1000}k`;
}

document.querySelector('[data-checkout-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const terms = form.elements.terms.checked;
  document.querySelectorAll('.form-field').forEach((field) => field.classList.remove('has-error'));
  document.querySelectorAll('[data-error]').forEach((error) => { error.textContent = ''; });
  let valid = true;
  if (!name) { setError('name', 'Enter your full name.'); valid = false; }
  if (!email || !email.includes('@')) { setError('email', 'Enter a valid email address.'); valid = false; }
  if (!terms) { document.querySelector('[data-error="terms"]').textContent = 'Please accept the event terms.'; valid = false; }
  if (!valid) { document.querySelector('[data-checkout-status]').textContent = 'Check the highlighted details before continuing.'; return; }
  const submit = form.querySelector('[data-checkout-submit]');
  submit.classList.add('is-pending');
  submit.innerHTML = '<span>Securing your order...</span><span aria-hidden="true">...</span>';
  setTimeout(() => {
    submit.classList.remove('is-pending');
    window.location.href = 'payment-result.html?state=pending';
  }, 750);
});

function setError(field, message) {
  const input = document.querySelector(`#checkout-${field}`);
  if (input) input.closest('.form-field').classList.add('has-error');
  document.querySelector(`[data-error="${field}"]`).textContent = message;
}

let secondsLeft = 582;
const countdown = document.querySelector('[data-countdown]');
setInterval(() => {
  if (secondsLeft <= 0) return;
  secondsLeft -= 1;
  countdown.textContent = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
}, 1000);
