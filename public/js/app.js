(function () {
  'use strict';

  // availability state: aptId → 'available' | 'unavailable' | 'unknown' | 'loading' | null
  const _state = new Map();

  let _checkIn = null;
  let _checkOut = null;

  function getLang() {
    return window.APP_LANG || window.APP_DEFAULT_LANG || 'en';
  }

  function getTodayISO() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDays(dateString, days) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    const nextYear = date.getFullYear();
    const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
    const nextDay = String(date.getDate()).padStart(2, '0');
    return `${nextYear}-${nextMonth}-${nextDay}`;
  }

  function hasValidDateRange() {
    return Boolean(_checkIn && _checkOut && _checkOut > _checkIn);
  }

  function updateSearchButton() {
    const btn = document.getElementById('btn-search');
    if (!btn) return;
    btn.disabled = !hasValidDateRange();
  }

  function getApartmentDetails(apt) {
    const id = String(apt.id || '');
    const startsWithA = id.startsWith('a');
    const startsWithB = id.startsWith('b');
    const location = {
      address: 'Via Privata Mario Bianco, 13/1',
      googleMapsUrl: 'https://maps.app.goo.gl/1HrYYdhJ2okZqfP58',
      nearby: [
        { key: 'distance_piola', minutes: 12 },
        { key: 'distance_lambrate', minutes: 10 },
        { key: 'distance_loreto', minutes: 15 },
        { key: 'distance_poly', minutes: 15 },
        { key: 'distance_statale', minutes: 20 },
      ],
    };

    return {
      capacity: 2,
      sofaBed: true,
      bathroomLocation: ['a1', 'a2', 'b1', 'b2'].includes(id) ? 'ensuite' : 'corridor',
      floorLevel: startsWithA ? 'ground' : (startsWithB ? 'first' : null),
      services: ['washing_machine', 'dryer', 'wifi', 'vacuum_cleaner', 'elevator'],
      location,
    };
  }

  function syncLanguageUI() {
    const lang = getLang();
    const selector = document.getElementById('language-switch');
    const checkInEl = document.getElementById('check-in');
    const checkOutEl = document.getElementById('check-out');
    if (selector && selector.value !== lang) selector.value = lang;

    document.documentElement.lang = lang;
    document.title = t('siteTitle');

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t('siteDescription'));

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', t('ogDescription'));

    const staticMap = [
      ['language-label', 'language'],
      ['hero-eyebrow', 'heroEyebrow'],
      ['hero-title', 'heroTitle'],
      ['hero-sub', 'heroSub'],
      ['label-check-in', 'checkIn'],
      ['label-check-out', 'checkOut'],
      ['apartments-title', 'apartments'],
      ['footer-text', 'footer'],
    ];

    staticMap.forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = t(key);
    });

    const countEl = document.getElementById('apartments-count');
    if (countEl) countEl.textContent = t('listings', { count: window.APARTMENTS_CONFIG.length });

    if (checkInEl) checkInEl.setAttribute('aria-label', t('checkIn'));
    if (checkOutEl) checkOutEl.setAttribute('aria-label', t('checkOut'));

    const btn = document.getElementById('btn-search');
    if (btn && btn.dataset.state !== 'checking') {
      btn.textContent = t('checkAvailability');
    }
  }

  function init() {
    syncLanguageUI();
    bindLanguageSwitcher();
    Modal.init();
    renderGrid();
    bindDatePickers();
    bindSearchButton();
  }

  function bindLanguageSwitcher() {
    const selector = document.getElementById('language-switch');
    if (!selector) return;

    selector.addEventListener('change', () => {
      window.setAppLanguage(selector.value);
      syncLanguageUI();
      renderGrid();
      Modal.refreshLanguage();
    });
  }

  // ─── Date pickers ────────────────────────────────────────────

  function bindDatePickers() {
    const checkInEl = document.getElementById('check-in');
    const checkOutEl = document.getElementById('check-out');
    const btn = document.getElementById('btn-search');

    if (!checkInEl || !checkOutEl || !btn) return;

    const today = getTodayISO();

    function syncDateConstraints() {
      checkInEl.min = today;
      checkOutEl.min = _checkIn ? addDays(_checkIn, 1) : today;

      if (_checkOut && _checkIn && _checkOut <= _checkIn) {
        _checkOut = null;
        checkOutEl.value = '';
      }
    }

    function handleCheckInChange() {
      _checkIn = checkInEl.value || null;
      syncDateConstraints();
      updateSearchButton();
    }

    function handleCheckOutChange() {
      _checkOut = checkOutEl.value || null;
      syncDateConstraints();
      updateSearchButton();
    }

    checkInEl.addEventListener('input', handleCheckInChange);
    checkInEl.addEventListener('change', handleCheckInChange);
    checkOutEl.addEventListener('input', handleCheckOutChange);
    checkOutEl.addEventListener('change', handleCheckOutChange);

    syncDateConstraints();
    updateSearchButton();
  }

  // ─── Search ───────────────────────────────────────────────────

  function bindSearchButton() {
    document.getElementById('btn-search').addEventListener('click', runSearch);
  }

  async function runSearch() {
    if (!hasValidDateRange()) return;

    const btn = document.getElementById('btn-search');
    btn.disabled = true;
    btn.dataset.state = 'checking';
    btn.textContent = t('checking');

    // Mark all as loading
    window.APARTMENTS_CONFIG.forEach((apt) => {
      _state.set(apt.id, 'loading');
    });
    renderGrid();

    // Fetch all in parallel
    const results = await Promise.allSettled(
      window.APARTMENTS_CONFIG.map(async (apt) => {
        const bookedRanges = await Availability.fetchAvailability(apt);
        const avail = Availability.isAvailable(bookedRanges, _checkIn, _checkOut);
        return { id: apt.id, status: avail ? 'available' : 'unavailable' };
      })
    );

    results.forEach((result, i) => {
      const apt = window.APARTMENTS_CONFIG[i];
      if (result.status === 'fulfilled') {
        _state.set(apt.id, result.value.status);
      } else {
        _state.set(apt.id, 'unknown');
      }
    });

    renderGrid();

    btn.disabled = false;
    btn.dataset.state = 'idle';
    btn.textContent = t('checkAvailability');
  }

  // ─── Grid rendering ───────────────────────────────────────────

  function renderGrid() {
    const grid = document.getElementById('apartments-grid');
    grid.innerHTML = window.APARTMENTS_CONFIG.map(buildCard).join('');
    grid.querySelectorAll('.apt-card').forEach((card) => {
      card.addEventListener('click', () => {
        const aptId = card.dataset.aptId;
        const apt = window.APARTMENTS_CONFIG.find((a) => a.id === aptId);
        if (!apt) return;
        const status = _state.get(aptId) || null;
        Modal.open(apt, status);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  function buildCard(apt) {
    const status = _state.get(apt.id) || null;
    const thumb = apt.photos && apt.photos.length > 0
      ? apt.photos[0]
      : 'images/placeholder.svg';
    const details = getApartmentDetails(apt);

    const badgeHTML = buildStatusBadge(status);
    const statsHTML = buildCardStats(apt);
    const metaHTML = buildCardMeta(details);

    const cardClass = ['apt-card', statusClass(status)].filter(Boolean).join(' ');

    return `
      <article class="${cardClass}" data-apt-id="${apt.id}" tabindex="0" role="button" aria-label="${t('apartment')} ${apt.label}">
        <div class="apt-card__thumb">
          <img src="${escapeAttr(thumb)}" alt="${t('apartment')} ${apt.label}" loading="lazy">
          ${badgeHTML}
        </div>
        <div class="apt-card__body">
          <h3 class="apt-card__title">${t('apartment')} ${escapeHTML(apt.label)}</h3>
          ${statsHTML}
          ${metaHTML}
          <p class="apt-card__zone">${escapeHTML(apt.zone || '')}</p>
          <span class="apt-card__cta">${t('viewDetails')}</span>
        </div>
      </article>
    `;
  }

  function buildStatusBadge(status) {
    if (!status || status === 'loading') {
      return status === 'loading'
        ? `<span class="apt-badge apt-badge--loading">${t('checking')}</span>`
        : '';
    }
    const map = {
      available: ['apt-badge--available', t('available')],
      unavailable: ['apt-badge--unavailable', t('unavailable')],
      unknown: ['apt-badge--unknown', t('unknown')],
    };
    const [cls, label] = map[status] || ['', status];
    return `<span class="apt-badge ${cls}">${label}</span>`;
  }

  function buildCardStats(apt) {
    const parts = [];
    if (apt.rooms) parts.push(apt.rooms === 1 ? t('people', { count: apt.rooms }) : t('peoplePlural', { count: apt.rooms }));
    if (apt.bathrooms) parts.push(apt.bathrooms === 1 ? t('baths', { count: apt.bathrooms }) : t('bathsPlural', { count: apt.bathrooms }));
    if (apt.sqm) parts.push(`${apt.sqm} m²`);
    if (!parts.length) return '';
    return `<p class="apt-card__stats">${parts.join(' · ')}</p>`;
  }

  function buildCardMeta(details) {
    const meta = [];
    if (details.sofaBed) meta.push(t('sofaBed'));
    if (details.floorLevel === 'ground') meta.push(t('groundFloor'));
    if (details.floorLevel === 'first') meta.push(t('firstFloor'));
    if (!meta.length) return '';
    return `<p class="apt-card__meta">${meta.join(' · ')}</p>`;
  }

  function formatNearbyLabel(item) {
    return t(item.key, { minutes: item.minutes });
  }

  function statusClass(status) {
    if (status === 'unavailable') return 'apt-card--unavailable';
    if (status === 'available') return 'apt-card--available';
    return '';
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return String(str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ─── Bootstrap ───────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);
})();
