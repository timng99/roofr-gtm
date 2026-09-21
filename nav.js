// Shared site header. Drop these two tags near the end of <body> on any page:
//   <script src="pages.js"></script>
//   <script src="nav.js"></script>
// Renders two small floating pills — logo + "Home" on the left, a page
// switcher + light/dark toggle on the right — and keeps the theme choice in
// one shared localStorage key so it carries across pages.
//
// The switcher always lists Home plus every page in pages.js, with whichever
// one you're currently on pre-selected, so the closed dropdown itself shows
// "you are here" rather than a generic placeholder.
//
// If a page has its own fixed/sticky header that the pills would sit on top
// of, set window.NAV_TOP_OFFSET (in px) to a value that clears it, in an
// inline <script> BEFORE this file loads. Defaults to 16.
(function () {
  var THEME_KEY = 'roofrCaseTheme';
  var pages = window.SITE_PAGES || [];
  var current = location.pathname.split('/').pop() || 'index.html';
  var isHome = current === '' || current === 'index.html';
  var topOffset = (typeof window.NAV_TOP_OFFSET === 'number') ? window.NAV_TOP_OFFSET : 16;

  function isDarkNow() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  // Apply any saved choice immediately (before paint where possible).
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {}

  var style = document.createElement('style');
  style.textContent = [
    '.rc-pill{position:fixed;top:16px;z-index:9999;display:flex;align-items:center;gap:10px;',
    'background:rgba(10,12,14,0.86);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);',
    'border:1px solid rgba(255,255,255,0.14);border-radius:999px;padding:7px 12px;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:13px;',
    'box-shadow:0 4px 16px rgba(0,0,0,0.30);}',
    '.rc-pill-left{left:16px;}',
    '.rc-pill-right{right:16px;}',
    '.rc-pill a{color:#e7eeec;text-decoration:none;opacity:0.92;white-space:nowrap;}',
    '.rc-pill a:hover{opacity:1;text-decoration:underline;}',
    '.rc-logo{height:15px;width:auto;display:block;flex:none;}',
    '.rc-pill select{background:rgba(255,255,255,0.10);color:#e7eeec;border:1px solid rgba(255,255,255,0.18);',
    'border-radius:999px;padding:4px 10px;font-size:12px;font-family:inherit;cursor:pointer;max-width:34vw;}',
    '.rc-pill select:focus-visible{outline:2px solid rgba(255,255,255,0.5);outline-offset:1px;}',
    '.rc-toggle{background:none;border:none;color:#e7eeec;cursor:pointer;display:flex;',
    'align-items:center;padding:0;line-height:0;}',
    '.rc-toggle svg{width:15px;height:15px;display:block;}',
    '@media (max-width:520px){.rc-pill{padding:6px 10px;font-size:12px;}.rc-pill select{max-width:28vw;}}'
  ].join('');
  document.head.appendChild(style);

  var LOGO =
    '<svg class="rc-logo" viewBox="0 0 345 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M158.487 24.4121C157.451 24.1004 155.896 23.8927 154.342 23.8927C150.197 23.8927 143.669 25.5548 140.975 31.3721V24.4121H125.743V76.041H141.493V53.4988C141.493 43.2146 147.192 39.4749 153.513 39.4749C155.067 39.4749 156.725 39.5787 158.487 39.9943V24.4121Z" fill="white"/>' +
    '<path d="M187.634 63.0559C181.727 63.0559 176.028 58.7968 176.028 50.1746C176.028 41.4486 181.727 37.3972 187.634 37.3972C193.644 37.3972 199.239 41.4486 199.239 50.1746C199.239 58.9006 193.644 63.0559 187.634 63.0559ZM187.634 22.8539C172.298 22.8539 160.278 34.1769 160.278 50.1746C160.278 66.1723 172.298 77.5992 187.634 77.5992C203.073 77.5992 214.99 66.1723 214.99 50.1746C214.99 34.1769 203.073 22.8539 187.634 22.8539Z" fill="white"/>' +
    '<path d="M244.426 63.0559C238.519 63.0559 232.82 58.7968 232.82 50.1746C232.82 41.4486 238.519 37.3972 244.426 37.3972C250.436 37.3972 256.031 41.4486 256.031 50.1746C256.031 58.9006 250.436 63.0559 244.426 63.0559ZM244.426 22.8539C229.09 22.8539 217.07 34.1769 217.07 50.1746C217.07 66.1723 229.09 77.5992 244.426 77.5992C259.865 77.5992 271.782 66.1723 271.782 50.1746C271.782 34.1769 259.865 22.8539 244.426 22.8539Z" fill="white"/>' +
    '<path d="M306.917 37.7089V24.4121H295.726V20.4646C295.726 14.7511 299.664 13.5046 302.461 13.5046C304.948 13.5046 306.295 13.8162 307.124 14.024V1.1427C305.674 0.415528 302.876 0 299.664 0C287.125 0 279.976 8.10273 279.976 19.9452V24.4121H271.789V37.7089H279.976V76.041H295.726V37.7089H306.917Z" fill="white"/>' +
    '<path d="M344.554 24.4121C343.518 24.1004 341.964 23.8927 340.41 23.8927C336.265 23.8927 329.737 25.5548 327.042 31.3721V24.4121H311.81V76.041H327.561V53.4988C327.561 43.2146 333.26 39.4748 339.581 39.4748C341.135 39.4748 342.793 39.5787 344.554 39.9943V24.4121Z" fill="white"/>' +
    '<path d="M0 33.3333C0 14.9238 14.9238 0 33.3333 0H66.6667C85.0762 0 100 14.9238 100 33.3333V66.6667C100 85.0762 85.0762 100 66.6667 100H33.3333C14.9238 100 0 85.0762 0 66.6667V33.3333Z" fill="url(#rcGrad)"/>' +
    '<path d="M49.2142 31.1587L13.0078 67.3652C12.3078 68.0652 12.8036 69.262 13.7935 69.262H39.0364C39.3311 69.262 39.6137 69.1449 39.8221 68.9365L49.2148 59.5438C49.6487 59.1099 50.3522 59.1099 50.7862 59.5438L60.1789 68.9365C60.3873 69.1449 60.6699 69.262 60.9646 69.262H86.2075C87.1974 69.262 87.6931 68.0651 86.9931 67.3652L74.4445 54.817V38.1509H75.2777C75.4311 38.1509 75.5555 38.0265 75.5555 37.8731V36.2064C75.5555 36.053 75.4311 35.9286 75.2777 35.9286H62.4999C62.3465 35.9286 62.2221 36.053 62.2221 36.2064V37.8731C62.2221 38.0265 62.3465 38.1509 62.4999 38.1509H63.3334V43.7062L50.7856 31.1587C50.3516 30.7248 49.6481 30.7248 49.2142 31.1587Z" fill="white"/>' +
    '<defs><linearGradient id="rcGrad" x1="100" y1="-6.11041e-06" x2="-17.4045" y2="28.6309" gradientUnits="userSpaceOnUse"><stop stop-color="#4E73D1"/><stop offset="1" stop-color="#269BD6"/></linearGradient></defs>' +
    '</svg>';

  var SUN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line>' +
    '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>' +
    '<line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line>' +
    '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  var MOON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  // ---- left pill: logo + Home ----
  var left = document.createElement('div');
  left.className = 'rc-pill rc-pill-left';
  left.style.top = topOffset + 'px';
  left.innerHTML = LOGO + (isHome ? '' : '<a href="index.html">← Home</a>');
  document.body.appendChild(left);

  // ---- right pill: page switcher (Home + every page, current preselected) + theme toggle ----
  var right = document.createElement('div');
  right.className = 'rc-pill rc-pill-right';
  right.style.top = topOffset + 'px';

  var allOptions = [{ title: 'Home', href: 'index.html' }].concat(pages);
  if (allOptions.length > 1) {
    var select = document.createElement('select');
    select.setAttribute('aria-label', 'Jump to another page');
    allOptions.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p.href;
      opt.textContent = p.title;
      if (p.href === current) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () {
      if (select.value && select.value !== current) location.href = select.value;
    });
    right.appendChild(select);
  }

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'rc-toggle';
  toggle.setAttribute('aria-label', 'Switch between light and dark mode');
  function paintToggle() { toggle.innerHTML = isDarkNow() ? SUN : MOON; }
  paintToggle();
  toggle.addEventListener('click', function () {
    var next = isDarkNow() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    paintToggle();
    document.dispatchEvent(new CustomEvent('roofr-theme-changed', { detail: { theme: next } }));
  });
  right.appendChild(toggle);

  document.body.appendChild(right);
})();
