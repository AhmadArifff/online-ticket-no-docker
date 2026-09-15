const toastRegion = document.querySelector('[data-toast-region]');
let toastTimer;
function showToast(message) { toastRegion.textContent = message; toastRegion.classList.add('is-visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastRegion.classList.remove('is-visible'), 2400); }
const interactiveSelector = 'button, a:not(.skip-link)';
document.addEventListener('pointerdown', (event) => { const control = event.target.closest(interactiveSelector); if (!control || event.button > 0) return; const bounds = control.getBoundingClientRect(); const ripple = document.createElement('span'); ripple.className = 'ripple'; ripple.setAttribute('aria-hidden', 'true'); ripple.style.left = `${event.clientX - bounds.left}px`; ripple.style.top = `${event.clientY - bounds.top}px`; control.append(ripple); ripple.addEventListener('animationend', () => ripple.remove(), { once: true }); });
document.querySelectorAll('[data-toast]').forEach((element) => element.addEventListener('click', () => showToast(element.dataset.toast)));
document.querySelector('[data-export]')?.addEventListener('click', () => { showToast('Report export preview started'); });
document.querySelector('[data-event-switcher]')?.addEventListener('click', (event) => { const showingAll = event.currentTarget.textContent.includes('All events'); event.currentTarget.innerHTML = showingAll ? 'Night Market Radio <span aria-hidden="true">&#8964;</span>' : 'All events <span aria-hidden="true">&#8964;</span>'; showToast(showingAll ? 'Showing Night Market Radio' : 'Showing all events'); });
