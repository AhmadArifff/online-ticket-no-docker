const toastRegion = document.querySelector('[data-toast-region]');
let toastTimer;

function showToast(message) {
  toastRegion.textContent = message;
  toastRegion.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastRegion.classList.remove('is-visible'), 2800);
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

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const control = event.target.closest(interactiveSelector);
  if (!control) return;
  control.classList.add('keyboard-press');
  setTimeout(() => control.classList.remove('keyboard-press'), 180);
});

document.querySelectorAll('[data-toast]').forEach((element) => {
  element.addEventListener('click', () => showToast(element.dataset.toast));
});

document.querySelector('[data-filter-toggle]')?.addEventListener('click', (event) => {
  const panel = document.querySelector('[data-filter-panel]');
  const isOpen = !panel.hidden;
  panel.hidden = isOpen;
  event.currentTarget.setAttribute('aria-expanded', String(!isOpen));
});

document.querySelectorAll('.filter-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach((item) => item.classList.remove('chip-active'));
    chip.classList.add('chip-active');
    showToast(`${chip.textContent} filter selected`);
  });
});

document.querySelectorAll('[data-save]').forEach((button) => {
  button.addEventListener('click', () => {
    const isSaved = button.classList.toggle('is-saved');
    button.textContent = isSaved ? '♥' : '♡';
    button.setAttribute('aria-label', isSaved ? 'Remove from saved events' : 'Save event');
    showToast(isSaved ? 'Event saved' : 'Event removed from saved');
  });
});

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    const grid = document.querySelector('[data-event-grid]');
    const isList = button.dataset.view === 'list';
    grid.classList.toggle('view-list', isList);
    document.querySelectorAll('[data-view]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('segment-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  });
});

document.querySelector('[data-search-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.querySelector('#event-search').value.trim().toLowerCase();
  const cards = [...document.querySelectorAll('[data-event-card]')];
  let visibleCount = 0;
  cards.forEach((card) => {
    const matches = !query || card.dataset.searchable.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  document.querySelector('[data-empty-state]').hidden = visibleCount !== 0;
  showToast(query ? `${visibleCount} event${visibleCount === 1 ? '' : 's'} found` : 'Showing all events');
});

document.querySelector('[data-menu-toggle]')?.addEventListener('click', (event) => {
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
  event.currentTarget.setAttribute('aria-expanded', String(!expanded));
  showToast(expanded ? 'Menu closed' : 'Menu preview opened');
});
