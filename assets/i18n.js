/* Tiny i18n helper used across all pages
 * - Injects a 6-language switcher into [data-i18n-switcher]
 * - Persists selection in localStorage
 * - Defaults to browser language on first visit
 * - Applies window.I18N_STRINGS to elements with [data-i18n]
 * - Dispatches a `i18n:change` event for page-specific handlers (e.g. dynamic content)
 */
(function(){
  const STORE_KEY = 'i18n.lang';
  const SUPPORTED = ['en','ja','zh','ko','fr','es'];
  const LABELS = { en:'EN', ja:'JA', zh:'ZH', ko:'KO', fr:'FR', es:'ES' };

  function detectFromBrowser(){
    const langs = (navigator.languages || [navigator.language || '']).map(s => String(s).toLowerCase());
    for (const l of langs) {
      const base = l.split('-')[0];
      if (SUPPORTED.includes(base)) return base;
    }
    return 'en';
  }

  function readSaved(){
    try { const v = localStorage.getItem(STORE_KEY); if (v && SUPPORTED.includes(v)) return v; } catch(_) {}
    return null;
  }

  function save(lang){ try { localStorage.setItem(STORE_KEY, lang); } catch(_) {} }

  function applyStrings(lang){
    const dict = window.I18N_STRINGS && window.I18N_STRINGS[lang];
    const fallback = window.I18N_STRINGS && window.I18N_STRINGS['en'];
    if (!window.I18N_STRINGS) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = dict && key in dict ? dict[key] : (fallback && fallback[key]);
      if (typeof val === 'string') el.textContent = val;
    });
  }

  function buildSwitcher(container, lang){
    if (!container) return;
    // Clear and rebuild
    container.innerHTML = '';
    container.classList.add('lang-switcher');
    for (const code of SUPPORTED) {
      const btn = document.createElement('button');
      btn.className = 'lang-btn' + (code === lang ? ' active' : '');
      btn.type = 'button';
      btn.textContent = LABELS[code] || code.toUpperCase();
      btn.setAttribute('aria-label', code);
      btn.addEventListener('click', () => I18N.setLang(code));
      container.appendChild(btn);
    }
  }

  function setActive(lang){
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(b => {
      const isActive = (b.textContent || '').trim().toLowerCase() === (LABELS[lang]||lang).toLowerCase();
      b.classList.toggle('active', isActive);
    });
  }

  function dispatch(lang){
    const ev = new CustomEvent('i18n:change', { detail: { lang } });
    window.dispatchEvent(ev);
    if (typeof window.I18N_ON_CHANGE === 'function') {
      try { window.I18N_ON_CHANGE(lang); } catch(_) {}
    }
  }

  const I18N = {
    supported: SUPPORTED.slice(),
    current: 'en',
    init(){
      const initial = readSaved() || detectFromBrowser();
      this.current = initial;
      // Build or enhance switcher
      const host = document.querySelector('[data-i18n-switcher]');
      buildSwitcher(host, initial);
      // First apply
      applyStrings(initial);
      setActive(initial);
      document.documentElement.lang = initial;
      dispatch(initial);
    },
    setLang(lang){
      if (!SUPPORTED.includes(lang)) lang = 'en';
      if (lang === this.current) return;
      this.current = lang;
      save(lang);
      applyStrings(lang);
      setActive(lang);
      document.documentElement.lang = lang;
      dispatch(lang);
    },
    getLang(){ return this.current; },
    t(key){
      const dict = window.I18N_STRINGS && (window.I18N_STRINGS[this.current] || window.I18N_STRINGS['en']);
      return dict && dict[key] || key;
    }
  };

  // Expose globally
  window.I18N = I18N;

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18N.init());
  } else {
    I18N.init();
  }
})();
