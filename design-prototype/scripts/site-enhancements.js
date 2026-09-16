const themeKey = 'gather-theme';
const languageKey = 'gather-language';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const translations = {
  id: {
    'Discover': 'Jelajahi', 'Categories': 'Kategori', 'Saved': 'Tersimpan', 'My tickets': 'Tiket saya',
    'Back to discover': 'Kembali ke jelajah', '← Back to discover': '← Kembali ke jelajah', 'Back to tickets': 'Kembali ke tiket', 'Back to tickets ↗': 'Kembali ke tiket ↗', 'Home': 'Beranda', 'Home ↗': 'Beranda ↗',
    'Search': 'Cari', 'Filters': 'Filter', 'Filter': 'Filter', 'Cards': 'Kartu', 'List': 'Daftar',
    'Sign in': 'Masuk', 'Create account': 'Buat akun', 'Checkout': 'Pembayaran', 'Secure checkout': 'Pembayaran aman',
    'Secure payment': 'Pembayaran aman', 'Continue to checkout': 'Lanjut ke pembayaran', 'View event': 'Lihat acara',
    'View order status': 'Lihat status pesanan', 'Contact support': 'Hubungi dukungan', 'Open ticket': 'Buka tiket',
    'View details': 'Lihat detail', 'Transfer': 'Transfer', 'Refund': 'Ajukan refund', 'Download ticket': 'Unduh tiket',
    'Added to wallet': 'Tersimpan di dompet', 'Bright scan mode': 'Mode scan terang', 'Normal scan mode': 'Mode scan normal',
    'Go home': 'Ke beranda', 'Try again': 'Coba lagi', 'Report issue': 'Laporkan masalah', 'Reconnect': 'Hubungkan lagi',
    'View saved tickets': 'Lihat tiket tersimpan', 'Browse events': 'Jelajahi acara', 'Clear filters': 'Hapus filter',
    'Access denied': 'Akses ditolak', 'Upcoming': 'Mendatang', 'Past': 'Selesai', 'Apply': 'Terapkan',
    'Payment result': 'Hasil pembayaran', 'Ticket wallet': 'Dompet tiket', 'Ticket / QR': 'Tiket / QR',
    'System states': 'Status sistem', 'Organizer dashboard': 'Dasbor penyelenggara', 'Event editor': 'Editor acara',
    'Admin operations': 'Operasi admin', 'Prototype map': 'Peta prototype', 'Light mode': 'Mode terang', 'Dark mode': 'Mode gelap',
  },
};

function getPageLanguage() {
  return localStorage.getItem(languageKey) || 'en';
}

function getTheme() {
  return localStorage.getItem(themeKey) || 'light';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  });
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171816' : '#f4efe7');
}

function translateElement(element, language) {
  const originals = JSON.parse(element.dataset.i18nTexts || '[]');
  const textNodes = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
  textNodes.forEach((node, index) => {
    const original = originals[index] || node.textContent.trim();
    const translated = language === 'id' ? translations.id[original] : original;
    if (!translated) return;
    const leading = node.textContent.match(/^\s*/)?.[0] || '';
    const trailing = node.textContent.match(/\s*$/)?.[0] || '';
    node.textContent = `${leading}${translated}${trailing}`;
  });
}

function applyLanguage(language, animate = true) {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  const update = () => {
    document.querySelectorAll('[data-i18n]').forEach((element) => translateElement(element, language));
    document.querySelectorAll('[data-language-toggle]').forEach((button) => {
      button.textContent = language === 'id' ? 'EN' : 'ID';
      button.setAttribute('aria-label', language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia');
      button.title = language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia';
    });
    document.body.classList.remove('is-translating');
  };
  if (!animate || reducedMotion) { update(); return; }
  document.body.classList.add('is-translating');
  window.setTimeout(update, 150);
}

function injectSiteTools() {
  const header = document.querySelector('.site-header');
  if (!header || header.querySelector('.site-tools')) return;
  const tools = document.createElement('div');
  tools.className = 'site-tools';
  tools.innerHTML = '<button class="site-tool" type="button" data-theme-toggle aria-pressed="false"><span class="theme-moon" aria-hidden="true">◐</span><span class="theme-sun" aria-hidden="true">☼</span><span class="site-tool-label">Theme</span></button><button class="site-tool language-toggle" type="button" data-language-toggle>EN</button>';
  header.append(tools);
  tools.querySelector('[data-theme-toggle]').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeKey, theme);
    applyTheme(theme);
  });
  tools.querySelector('[data-language-toggle]').addEventListener('click', () => {
    const language = getPageLanguage() === 'id' ? 'en' : 'id';
    localStorage.setItem(languageKey, language);
    applyLanguage(language);
  });
}

function markTranslatableContent() {
  const selector = 'h1, h2, h3, p, .eyebrow, .nav-link, .text-link, .button, .outline-button, .filter-trigger, .segment, .filter-chip, .category-pill, .profile-name, .ticket-status, .offline-status, .site-header .brand > span:last-child';
  document.querySelectorAll(selector).forEach((element) => {
    if (element.dataset.i18n) return;
    const textNodes = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
    if (!textNodes.length) return;
    element.dataset.i18n = '';
    element.dataset.i18nTexts = JSON.stringify(textNodes.map((node) => node.textContent.trim()));
  });
}

function enableTilt() {
  if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.ticket-object, .detail-poster, .auth-ticket, .status-envelope, [data-tilt]').forEach((element) => {
    element.dataset.tilt = 'true';
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      element.style.setProperty('--tilt-x', `${y * -4}deg`);
      element.style.setProperty('--tilt-y', `${x * 5}deg`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--tilt-x', '0deg');
      element.style.setProperty('--tilt-y', '0deg');
    });
  });
}

applyTheme(getTheme());
injectSiteTools();
applyTheme(getTheme());
markTranslatableContent();
applyLanguage(getPageLanguage(), false);
enableTilt();
