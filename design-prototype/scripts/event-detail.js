const toastRegion = document.querySelector('[data-toast-region]');
let toastTimer;
let quantity = 1;
let selectedPrice = 280000;

function showToast(message) {
  toastRegion.textContent = message;
  toastRegion.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastRegion.classList.remove('is-visible'), 2600);
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

document.querySelectorAll('[data-save]').forEach((button) => {
  button.addEventListener('click', () => {
    const saved = button.classList.toggle('is-saved');
    button.textContent = saved ? '♥' : '♡';
    button.setAttribute('aria-label', saved ? 'Remove from saved events' : 'Save event');
    showToast(saved ? 'Event saved' : 'Event removed from saved');
  });
});

document.querySelectorAll('[data-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('tab-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== tab.dataset.tab;
    });
  });
});

document.querySelectorAll('[data-ticket]').forEach((option) => {
  option.addEventListener('click', () => {
    selectedPrice = Number(option.dataset.price);
    document.querySelectorAll('[data-ticket]').forEach((item) => {
      const active = item === option;
      item.classList.toggle('ticket-option-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    updateTotal();
  });
});

document.querySelectorAll('[data-quantity]').forEach((button) => {
  button.addEventListener('click', () => {
    quantity = button.dataset.quantity === 'increase' ? Math.min(quantity + 1, 6) : Math.max(quantity - 1, 1);
    updateTotal();
  });
});

function updateTotal() {
  document.querySelector('[data-quantity-value]').textContent = quantity;
  document.querySelector('[data-total]').textContent = `Rp${Math.round(selectedPrice * quantity / 1000)}k`;
}

document.querySelector('[data-purchase]')?.addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.classList.add('is-pending');
  button.innerHTML = '<span>Preparing checkout...</span><span aria-hidden="true">...</span>';
  setTimeout(() => {
    button.classList.remove('is-pending');
    button.innerHTML = '<span>Continue to checkout</span><span aria-hidden="true">&#8594;</span>';
    window.location.href = 'checkout.html';
  }, 850);
});
