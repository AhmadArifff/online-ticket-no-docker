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

document.querySelectorAll('[data-filter]').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('chip-active'));
    chip.classList.add('chip-active');
    filterCards(chip.dataset.filter, document.querySelector('#listing-search').value);
  });
});

document.querySelector('#listing-search')?.addEventListener('input', (event) => {
  const activeFilter = document.querySelector('[data-filter].chip-active')?.dataset.filter || 'all';
  filterCards(activeFilter, event.target.value);
});

function filterCards(category, query) {
  const normalizedQuery = query.trim().toLowerCase();
  let visibleCount = 0;
  document.querySelectorAll('.listing-card').forEach((card) => {
    const categoryMatch = category === 'all' || card.dataset.category === category || card.dataset.city === category;
    const textMatch = !normalizedQuery || card.dataset.search.includes(normalizedQuery);
    const visible = categoryMatch && textMatch;
    card.hidden = !visible;
    card.classList.toggle('is-filtering', visible);
    if (visible) visibleCount += 1;
  });
  document.querySelector('[data-result-count]').textContent = String(visibleCount).padStart(2, '0');
  document.querySelector('[data-empty-state]').hidden = visibleCount > 0;
  showToast(visibleCount ? `${visibleCount} event${visibleCount === 1 ? '' : 's'} found` : 'No events found');
}

document.querySelectorAll('[data-save]').forEach((button) => {
  button.addEventListener('click', () => {
    const saved = button.classList.toggle('is-saved');
    button.textContent = saved ? '♥' : '♡';
    button.setAttribute('aria-label', saved ? 'Remove from saved events' : 'Save event');
    showToast(saved ? 'Event saved' : 'Event removed from saved');
  });
});

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    const isList = button.dataset.view === 'list';
    document.querySelector('[data-listing-grid]').classList.toggle('view-list', isList);
    document.querySelectorAll('[data-view]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('segment-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  });
});

document.querySelector('[data-sort]')?.addEventListener('change', (event) => {
  const cards = [...document.querySelectorAll('.listing-card')];
  const grid = document.querySelector('[data-listing-grid]');
  const key = event.target.value;
  cards.sort((left, right) => {
    if (key === 'price-low') return Number(left.dataset.price) - Number(right.dataset.price);
    if (key === 'name') return left.dataset.name.localeCompare(right.dataset.name);
    return left.dataset.date.localeCompare(right.dataset.date);
  });
  cards.forEach((card) => grid.append(card));
  showToast(`Sorted by ${event.target.options[event.target.selectedIndex].textContent.toLowerCase()}`);
});
