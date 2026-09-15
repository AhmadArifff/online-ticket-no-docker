const toastRegion = document.querySelector('[data-toast-region]');
let toastTimer;
let zoom = 100;

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

document.querySelectorAll('[data-preview-state]').forEach((button) => {
  button.addEventListener('click', () => setTicketState(button.dataset.previewState));
});

document.querySelector('[data-brightness]').addEventListener('click', (event) => {
  const enabled = document.body.classList.toggle('bright-scan');
  event.currentTarget.setAttribute('aria-pressed', String(enabled));
  event.currentTarget.textContent = enabled ? 'Normal scan mode' : 'Bright scan mode';
  showToast(enabled ? 'Bright scan mode enabled' : 'Normal scan mode enabled');
});

document.querySelectorAll('[data-zoom]').forEach((button) => {
  button.addEventListener('click', () => {
    zoom = button.dataset.zoom === 'in' ? Math.min(130, zoom + 10) : Math.max(80, zoom - 10);
    document.querySelector('[data-qr-frame]').style.setProperty('--qr-scale', `${zoom / 100}`);
    document.querySelector('[data-zoom-value]').textContent = `${zoom}%`;
  });
});

document.querySelector('[data-download]').addEventListener('click', () => {
  const ticket = 'Gather ticket\nNight Market Radio\n24 September 2026\nTicket NMR-0142-02';
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([ticket], { type: 'text/plain' }));
  link.download = 'gather-ticket-NMR-0142-02.txt';
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('Ticket download started');
});

document.querySelector('[data-wallet]').addEventListener('click', (event) => {
  event.currentTarget.textContent = 'Saved to wallet';
  event.currentTarget.disabled = true;
  showToast('Ticket is available offline');
});

function setTicketState(state) {
  const label = document.querySelector('[data-ticket-state-label]');
  const status = document.querySelector('[data-ticket-status]');
  const copy = {
    valid: ['Valid ticket', 'Ready to scan. Saved offline.', 'ticket-state-valid'],
    used: ['Used ticket', 'This ticket was already checked in.', 'ticket-state-used'],
    invalid: ['Invalid ticket', 'Ticket verification failed. Ask support for help.', 'ticket-state-invalid'],
    offline: ['Offline copy', 'Connection unavailable. Showing the last verified ticket.', 'ticket-state-offline'],
  }[state];
  label.className = `ticket-state ${copy[2]}`;
  label.innerHTML = `<i></i> ${copy[0]}`;
  status.textContent = copy[1];
  document.querySelector('[data-scan-surface]').dataset.ticketState = state;
}
