(function () {
  'use strict';

  let _currentApt = null;
  let _currentAvailStatus = null;
  let _overlay = null;
  let _prevFocus = null;

  function init() {
    _overlay = document.getElementById('modal-overlay');
    _overlay.addEventListener('click', (e) => {
      if (e.target === _overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _overlay.classList.contains('is-open')) close();
    });
  }

  function open(apt, availStatus) {
    _currentApt = apt;
    _currentAvailStatus = availStatus || null;
    _prevFocus = document.activeElement;
    _overlay.innerHTML = buildModalHTML(apt, _currentAvailStatus);
    _overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const closeBtn = _overlay.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();

    // Keyboard trap
    _overlay.addEventListener('keydown', trapFocus);
  }

  function close() {
    _overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    _overlay.removeEventListener('keydown', trapFocus);
    if (_prevFocus) _prevFocus.focus();
  }

  function refreshLanguage() {
    if (!_overlay || !_overlay.classList.contains('is-open') || !_currentApt) return;
    _overlay.innerHTML = buildModalHTML(_currentApt, _currentAvailStatus);
    const closeBtn = _overlay.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      _overlay.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function buildModalHTML(apt, availStatus) {
    const whatsappHref = buildWhatsAppLink(apt);
    const galleryHTML = buildGallery(apt);
    const metaHTML = buildMeta(apt);
    const badgeHTML = buildBadge(availStatus);
    const ctaHTML = buildCTA(whatsappHref, availStatus);

    return `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${t('apartment')} ${apt.label}">
        <button class="modal__close" aria-label="${t('close')}">&times;</button>
        ${galleryHTML}
        <div class="modal__body">
          <div class="modal__header">
            <h2 class="modal__title">${t('apartment')} ${apt.label}</h2>
            ${badgeHTML}
          </div>
          ${metaHTML}
          ${ctaHTML}
        </div>
      </div>
    `;
  }

  function buildGallery(apt) {
    if (!apt.photos || apt.photos.length === 0) {
      return `
        <div class="modal__gallery modal__gallery--empty">
          <img src="images/placeholder.svg" alt="${t('photoComingSoon')}" class="modal__placeholder-img">
          <span class="modal__placeholder-label">${t('photosComingSoon')}</span>
        </div>
      `;
    }

    const slides = apt.photos
      .map(
        (src, i) =>
          `<div class="gallery__slide">
            <img src="${escapeAttr(src)}" alt="${t('apartment')} ${escapeAttr(apt.label)} ${i + 1}" loading="lazy">
          </div>`
      )
      .join('');

    const dots =
      apt.photos.length > 1
        ? `<div class="gallery__dots" aria-hidden="true">${apt.photos
            .map((_, i) => `<span class="gallery__dot${i === 0 ? ' is-active' : ''}"></span>`)
            .join('')}</div>`
        : '';

    const controls =
      apt.photos.length > 1
        ? `
          <button type="button" class="gallery__nav gallery__nav--prev" data-gallery-action="prev" aria-label="${t('previousPhoto')}">
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" class="gallery__nav gallery__nav--next" data-gallery-action="next" aria-label="${t('nextPhoto')}">
            <span aria-hidden="true">›</span>
          </button>
        `
        : '';

    return `
      <div class="modal__gallery">
        <div class="gallery__track" id="gallery-track-${apt.id}">${slides}</div>
        ${controls}
        ${dots}
      </div>
    `;
  }

  function getGalleryIndex(track) {
    if (!track) return 0;
    return Math.round(track.scrollLeft / track.clientWidth);
  }

  function updateGalleryDots(track) {
    if (!track || !track.parentElement) return;
    const dots = track.parentElement.querySelectorAll('.gallery__dot');
    if (!dots.length) return;
    const idx = getGalleryIndex(track);
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === idx));
  }

  function goToGallerySlide(track, index) {
    if (!track) return;
    track.scrollTo({
      left: index * track.clientWidth,
      behavior: 'smooth',
    });
  }

  function stepGallery(track, direction) {
    if (!track) return;
    const slides = track.querySelectorAll('.gallery__slide');
    if (!slides.length) return;
    const currentIndex = getGalleryIndex(track);
    const nextIndex = (currentIndex + direction + slides.length) % slides.length;
    goToGallerySlide(track, nextIndex);
  }

  function buildMeta(apt) {
    const items = [];
    if (apt.rooms) items.push(`<span>${apt.rooms === 1 ? t('people', { count: apt.rooms }) : t('peoplePlural', { count: apt.rooms })}</span>`);
    if (apt.bathrooms) items.push(`<span>${apt.bathrooms === 1 ? t('baths', { count: apt.bathrooms }) : t('bathsPlural', { count: apt.bathrooms })}</span>`);
    if (apt.sqm) items.push(`<span>${apt.sqm} m²</span>`);
    if (apt.floor) items.push(`<span>${escapeHTML(apt.floor)}</span>`);

    const statsHTML = items.length
      ? `<div class="modal__stats">${items.join('<span class="modal__sep">·</span>')}</div>`
      : '';

    const zoneHTML = apt.zone
      ? `<p class="modal__zone">${escapeHTML(apt.zone)}</p>`
      : '';

    const addrHTML = apt.address && apt.address !== 'Via …'
      ? `<p class="modal__address">${escapeHTML(apt.address)}</p>`
      : '';

    const details = getApartmentDetails(apt);
    const sleepingHTML = buildInfoSection(
      t('sleeping'),
      [
        details.capacity ? (details.capacity === 1 ? t('people', { count: details.capacity }) : t('peoplePlural', { count: details.capacity })) : null,
        details.sofaBed ? t('sofaBed') : null,
      ].filter(Boolean)
    );

    const bathroomHTML = details.bathroomLocation
      ? buildInfoSection(t('bathroom'), [details.bathroomLocation === 'ensuite' ? t('privateEnsuiteBathroom') : t('privateCorridorBathroom')])
      : '';

    const floorHTML = details.floorLevel
      ? buildInfoSection(t('floor'), [details.floorLevel === 'ground' ? t('groundFloor') : t('firstFloor')])
      : '';

    const locationHTML = details.location
      ? buildLocationSection(details.location)
      : '';

    const servicesHTML = details.services.length
      ? buildInfoSection(t('services'), details.services.map((service) => t(`service_${service}`)))
      : '';

    return `<div class="modal__meta">${statsHTML}${zoneHTML}${addrHTML}${sleepingHTML}${bathroomHTML}${floorHTML}${locationHTML}${servicesHTML}</div>`;
  }

  function buildInfoSection(title, values) {
    if (!values || !values.length) return '';
    return `
      <section class="modal__info-block">
        <h3 class="modal__info-title">${escapeHTML(title)}</h3>
        <p class="modal__info-value">${values.map((value) => escapeHTML(value)).join(' · ')}</p>
      </section>
    `;
  }

  function buildLocationSection(location) {
    const nearbyHTML = location.nearby && location.nearby.length
      ? `
        <div class="modal__chips">
          ${location.nearby.map((item) => `<span class="modal__chip">${escapeHTML(t(item.key, { minutes: item.minutes }))}</span>`).join('')}
        </div>
      `
      : '';

    const mapLink = location.googleMapsUrl
      ? `<a class="modal__maps-link" href="${escapeAttr(location.googleMapsUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(t('mapLink'))}</a>`
      : '';

    return `
      <section class="modal__info-block modal__info-block--location">
        <h3 class="modal__info-title">${escapeHTML(t('location'))}</h3>
        <p class="modal__info-value">${escapeHTML(location.address || '')}</p>
        ${nearbyHTML}
        ${mapLink}
      </section>
    `;
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

  function buildBadge(availStatus) {
    if (availStatus === 'available') {
      return `<span class="badge badge--available">${t('available')}</span>`;
    } else if (availStatus === 'unavailable') {
      return `<span class="badge badge--unavailable">${t('unavailable')}</span>`;
    }
    return '';
  }

  function buildCTA(whatsappHref, availStatus) {
    const disabled = availStatus === 'unavailable';
    const label = disabled
      ? t('notAvailableSelectedDates')
      : t('contactWhatsApp');
    const cls = disabled ? 'btn-whatsapp btn-whatsapp--disabled' : 'btn-whatsapp';
    const attrs = disabled ? 'aria-disabled="true" tabindex="-1"' : `href="${whatsappHref}" target="_blank" rel="noopener noreferrer"`;
    const tag = disabled ? 'span' : 'a';

    return `
      <div class="modal__cta">
        <${tag} class="${cls}" ${attrs}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          ${label}
        </${tag}>
      </div>
    `;
  }

  function buildWhatsAppLink(apt) {
    const msg = encodeURIComponent(buildWhatsAppMessage(apt));
    return `https://wa.me/${window.WHATSAPP_NUMBER}?text=${msg}`;
  }

  function buildWhatsAppMessage(apt) {
    if (window.APP_LANG === 'it') {
      return `Ciao, sono interessato all'appartamento ${apt.label}. Mi puoi dare maggiori informazioni su disponibilità e prezzo?`;
    }
    return `Hi, I'm interested in apartment ${apt.label}. Could you tell me more about availability and pricing?`;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Close button is injected dynamically — delegate click
  document.addEventListener('click', (e) => {
    if (e.target.closest('.modal__close')) close();

    const navBtn = e.target.closest('[data-gallery-action]');
    if (!navBtn) return;

    const gallery = navBtn.closest('.modal__gallery');
    const track = gallery ? gallery.querySelector('.gallery__track') : null;
    if (!track) return;

    const direction = navBtn.dataset.galleryAction === 'prev' ? -1 : 1;
    stepGallery(track, direction);
  });

  document.addEventListener('keydown', (e) => {
    if (!_overlay || !_overlay.classList.contains('is-open')) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    const track = _overlay.querySelector('.gallery__track');
    if (!track) return;

    e.preventDefault();
    stepGallery(track, e.key === 'ArrowLeft' ? -1 : 1);
  });

  // Gallery scroll → update active dot
  document.addEventListener('scroll', (e) => {
    const track = e.target;
    if (!track || !track.id || !track.id.startsWith('gallery-track-')) return;
    updateGalleryDots(track);
  }, true);

  window.Modal = { init, open, close, refreshLanguage };
})();
