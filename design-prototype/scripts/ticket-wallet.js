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

document.querySelector('[data-filter-toggle]')?.addEventListener('click', (event) => {
  const panel = document.querySelector('[data-filter-panel]');
  const isOpen = !panel.hidden;
  panel.hidden = isOpen;
  event.currentTarget.setAttribute('aria-expanded', String(!isOpen));
});

document.querySelectorAll('[data-wallet-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const view = tab.dataset.walletTab;
    document.querySelectorAll('[data-wallet-tab]').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('wallet-tab-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    filterTickets(view, document.querySelector('[data-ticket-filter].chip-active')?.dataset.ticketFilter || 'all', document.querySelector('[data-ticket-search]').value);
  });
});

document.querySelectorAll('[data-ticket-filter]').forEach((filter) => {
  filter.addEventListener('click', () => {
    document.querySelectorAll('[data-ticket-filter]').forEach((item) => item.classList.remove('chip-active'));
    filter.classList.add('chip-active');
    filterTickets(document.querySelector('[data-wallet-tab].wallet-tab-active').dataset.walletTab, filter.dataset.ticketFilter, document.querySelector('[data-ticket-search]').value);
  });
});

document.querySelector('[data-ticket-search]')?.addEventListener('input', (event) => {
  filterTickets(document.querySelector('[data-wallet-tab].wallet-tab-active').dataset.walletTab, document.querySelector('[data-ticket-filter].chip-active')?.dataset.ticketFilter || 'all', event.target.value);
});

function filterTickets(view, status, query) {
  const normalized = query.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('[data-ticket-item]').forEach((ticket) => {
    const viewMatch = ticket.dataset.ticketTab === view;
    const statusMatch = status === 'all' || ticket.dataset.ticketStatus === status;
    const searchMatch = !normalized || ticket.dataset.ticketSearch.includes(normalized);
    const show = viewMatch && statusMatch && searchMatch;
    ticket.hidden = !show;
    if (show) visible += 1;
  });
  document.querySelector('[data-empty-state]').hidden = visible > 0;
  showToast(`${visible} ticket${visible === 1 ? '' : 's'} in this view`);
}
