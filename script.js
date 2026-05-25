/* ============================================================
   PHOENIX COMMUNITY TRUST — script.js
   WCAG 2.2 AA keyboard/ARIA | Search inline | Map cards | Partner panel
   ============================================================ */
'use strict';

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.reveal-up').forEach((el) => revealObs.observe(el));

/* ============================================================
   HEADER — scroll state + active nav
   ============================================================ */
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Active nav link — track by section in view
const sections = document.querySelectorAll('main section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((l) => {
      const active = l.dataset.section === e.target.id;
      l.classList.toggle('active', active);
      l.setAttribute('aria-current', active ? 'true' : 'false');
    });
  });
}, { threshold: 0.35 });
sections.forEach((s) => sectionObs.observe(s));

/* ============================================================
   SMOOTH SCROLL — anchor links
   Bug fix: read offsetHeight directly instead of CSS variable
   ============================================================ */
function scrollToSection(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  const headerH = document.getElementById('site-header').offsetHeight;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - headerH,
    behavior: 'smooth',
  });
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const hash = a.getAttribute('href');
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    scrollToSection(hash);
    closeMobileNav();
    closeSearch();
    // Move keyboard focus to the section so Tab continues from there
    setTimeout(() => {
      target.focus({ preventScroll: true });
    }, 420);
  });
});

/* ============================================================
   MOBILE NAV
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');
const mobileClose= document.getElementById('mobile-close');
const navOverlay = document.getElementById('nav-overlay');

function openMobileNav() {
  mobileNav.classList.add('open');
  mobileNav.removeAttribute('aria-hidden');
  navOverlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  mobileClose.focus();
}
function closeMobileNav() {
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  navOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger)  hamburger.addEventListener('click', openMobileNav);
if (mobileClose)mobileClose.addEventListener('click', closeMobileNav);
if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);

/* Escape closes everything */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeMobileNav();
  closeSearch();
  closeMapCard();
  // Close any open partner cards
  document.querySelectorAll('.pcard.is-open').forEach((c) => {
    c.classList.remove('is-open');
    c.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================================
   INLINE SEARCH
   ============================================================ */
const hSearchBtn    = document.getElementById('h-search-btn');
const searchBarDrop = document.getElementById('search-bar-drop');
const hsi = document.getElementById('hsi');   // search input
const hsd = document.getElementById('hsd');   // search dropdown

const searchIndex = [
  { section: 'about',         label: 'About Us',                text: 'phoenix community trust global majority movement funding justice systems change uk' },
  { section: 'impact',        label: 'Our Impact',              text: 'impact 9 regions 100 organisations 4m grants national lottery 2026 uniting people leadership innovation' },
  { section: 'where-we-work', label: 'Where We Work',           text: 'where we work north east cumbria north west yorkshire humber east midlands west midlands east england greater london south east south west active regions' },
  { section: 'network',       label: 'Anti Racist Cumbria',     text: 'anti racist cumbria dismantling racism advancing justice community led network cumbria north east' },
  { section: 'network',       label: 'Inclusive North',         text: 'inclusive north championing racial unity lancashire north west global majority policy innovation' },
  { section: 'network',       label: 'Impact Hub Yorkshire',    text: 'impact hub yorkshire powering positive change entrepreneurs innovators social environmental' },
  { section: 'network',       label: 'The Ubele Initiative',    text: 'ubele initiative equity justice london south east east england global majority social economic' },
  { section: 'network',       label: 'Black South West Network',text: 'black south west network building power creating change racial justice south west' },
  { section: 'network',       label: 'South Asian Health Action',text: 'south asian health action improving health equity midlands research advocacy' },
  { section: 'grants',        label: 'Grants',                  text: 'grants funding justice action 4m national lottery 2026 strategic development register interest' },
  { section: 'news',          label: 'News & Updates',          text: 'news updates announcements community grants cheltenham partnership strategy 2026' },
  { section: 'join',          label: 'Join Our Community',      text: 'join community movement be part phoenix trust' },
  { section: 'contact',       label: 'Contact',                 text: 'contact get in touch email info@phoenix-trust.co.uk collaboration media press' },
];

function openSearch() {
  if (searchBarDrop) {
    searchBarDrop.classList.add('open');
    searchBarDrop.removeAttribute('aria-hidden');
    if (hSearchBtn) hSearchBtn.setAttribute('aria-expanded', 'true');
    if (hsi) { hsi.focus(); }
  }
}
function closeSearch() {
  if (searchBarDrop) {
    searchBarDrop.classList.remove('open');
    searchBarDrop.setAttribute('aria-hidden', 'true');
    if (hSearchBtn) hSearchBtn.setAttribute('aria-expanded', 'false');
  }
  if (hsd) hsd.setAttribute('hidden', '');
  if (hsi) hsi.setAttribute('aria-expanded', 'false');
}

if (hSearchBtn) {
  hSearchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (searchBarDrop && searchBarDrop.classList.contains('open')) {
      closeSearch();
    } else {
      openSearch();
    }
  });
}

if (hsi) {
  hsi.addEventListener('input', () => {
    const q = hsi.value.trim().toLowerCase();
    hsd.innerHTML = '';
    if (!q) { hsd.setAttribute('hidden', ''); return; }

    const seen = new Set();
    const matches = searchIndex.filter((item) => {
      const key = item.section + item.label;
      if (seen.has(key)) return false;
      if (item.text.includes(q) || item.label.toLowerCase().includes(q)) {
        seen.add(key);
        return true;
      }
      return false;
    });

    if (!matches.length) {
      hsd.innerHTML = '<p class="sdr-empty">No results found.</p>';
    } else {
      matches.slice(0, 6).forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'sdr-item';
        btn.setAttribute('role', 'option');
        btn.innerHTML = `<span class="sdr-section">${item.label}</span><span class="sdr-text">#${item.section}</span>`;
        btn.addEventListener('click', () => {
          scrollToSection('#' + item.section);
          hsi.value = '';
          closeSearch();
          hsi.blur();
        });
        hsd.appendChild(btn);
      });
    }
    hsd.removeAttribute('hidden');
  });

  hsi.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); hsi.blur(); }
    // Arrow key navigation within dropdown
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = hsd.querySelector('.sdr-item');
      if (first) first.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#search-bar-drop') && !e.target.closest('#h-search-btn')) {
      closeSearch();
    }
  });
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCount(el) {
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = prefix + target + suffix;
    return;
  }
  const dur = 1400;
  const start = performance.now();
  const tick = (now) => {
    const p     = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(2, -10 * p);
    el.textContent = prefix + Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const n = e.target.querySelector('.stat-n');
    if (n) animateCount(n);
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-card').forEach((c) => counterObs.observe(c));

/* ============================================================
   UK MAP — region dots → floating data card
   ============================================================ */
const mapCard   = document.getElementById('map-card');
const mcName    = document.getElementById('mc-name');
const mcPartner = document.getElementById('mc-partner');
let   mapCardTimeout;

function showMapCard(dot, container) {
  const name    = dot.dataset.name    || '';
  const partner = dot.dataset.partner || '';
  if (!mapCard || !name) return;

  mcName.textContent    = name;
  mcPartner.textContent = partner ? `Partner: ${partner}` : '';
  mcPartner.style.display = partner ? '' : 'none';

  // Position: get dot core circle coords relative to container
  const dotCore   = dot.querySelector('.dc');
  const svgEl     = dot.closest('svg');
  const ctRect    = container.getBoundingClientRect();
  const svgRect   = svgEl.getBoundingClientRect();
  const cx        = parseFloat(dotCore.getAttribute('cx'));
  const cy        = parseFloat(dotCore.getAttribute('cy'));
  const vb        = svgEl.viewBox.baseVal;

  // Map SVG coords to pixel coords relative to container
  const scaleX    = svgRect.width  / vb.width;
  const scaleY    = svgRect.height / vb.height;
  const pxX       = (svgRect.left - ctRect.left) + cx * scaleX;
  const pxY       = (svgRect.top  - ctRect.top)  + cy * scaleY;

  // Place card: right of dot if room, else left
  const cardW = 200;
  const gap   = 16;
  let   left  = pxX + gap;
  if (left + cardW > ctRect.width) left = pxX - cardW - gap;

  mapCard.style.left   = Math.max(0, left) + 'px';
  mapCard.style.top    = (pxY - 20) + 'px';
  mapCard.removeAttribute('hidden');
}

function closeMapCard() {
  if (mapCard) mapCard.setAttribute('hidden', '');
}

document.querySelectorAll('.rdot').forEach((dot) => {
  const container = dot.closest('.map-container');

  // Mouse hover
  dot.addEventListener('mouseenter', () => {
    clearTimeout(mapCardTimeout);
    showMapCard(dot, container);
  });
  dot.addEventListener('mouseleave', () => {
    mapCardTimeout = setTimeout(closeMapCard, 300);
  });

  // Keyboard focus
  dot.addEventListener('focus', () => {
    clearTimeout(mapCardTimeout);
    showMapCard(dot, container);
  });
  dot.addEventListener('blur', () => {
    mapCardTimeout = setTimeout(closeMapCard, 300);
  });

  // Enter/Space activates (scrolls to network)
  dot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToSection('#network');
    }
  });
});

// Keep card open when hovering over it
if (mapCard) {
  mapCard.addEventListener('mouseenter', () => clearTimeout(mapCardTimeout));
  mapCard.addEventListener('mouseleave', () => { mapCardTimeout = setTimeout(closeMapCard, 300); });
}

/* ============================================================
   PARTNER CARDS — in-card accordion (class-driven CSS transition)
   ============================================================ */
document.querySelectorAll('.pcard').forEach((card) => {
  const activate = () => {
    const isOpen = card.classList.contains('is-open');
    // Close all
    document.querySelectorAll('.pcard').forEach((c) => {
      c.classList.remove('is-open');
      c.setAttribute('aria-expanded', 'false');
    });
    // Open this one (toggle)
    if (!isOpen) {
      card.classList.add('is-open');
      card.setAttribute('aria-expanded', 'true');
    }
  };

  card.addEventListener('click', activate);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
  });
});

/* ============================================================
   GRANTS ACCORDION (smooth open + close via max-height + opacity)
   ============================================================ */

// Wrap inner content for padding without affecting max-height transition
document.querySelectorAll('.gstep-body').forEach((body) => {
  const inner = document.createElement('div');
  inner.className = 'gstep-body-inner';
  while (body.firstChild) inner.appendChild(body.firstChild);
  body.appendChild(inner);
});

document.querySelectorAll('.gstep-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const step   = toggle.closest('.gstep');
    const isOpen = step.classList.contains('is-open');

    // Close all — CSS handles .gstep-body via .gstep.is-open child selector
    document.querySelectorAll('.gstep').forEach((s) => {
      s.classList.remove('is-open');
      s.querySelector('.gstep-toggle').setAttribute('aria-expanded', 'false');
    });

    // Open this one (toggle)
    if (!isOpen) {
      step.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ============================================================
   NEWS FILTER TABS
   ============================================================ */
const ntabs     = document.querySelectorAll('.ntab');
const newsCards = document.querySelectorAll('.ncard');

ntabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;
    ntabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    newsCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
const form      = document.getElementById('contact-form');
const formError = document.getElementById('form-error');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach((el) => { if (!el.value.trim()) valid = false; });

    if (!valid) {
      if (formError) {
        formError.textContent = 'Please fill in all required fields.';
        formError.removeAttribute('hidden');
        formError.focus();
      }
      return;
    }
    if (formError) formError.setAttribute('hidden', '');

    btn.textContent = 'Message sent ✓';
    btn.style.cssText = 'background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);color:#22c55e;';
    btn.setAttribute('aria-label', 'Message sent successfully');
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Send message';
      btn.style = '';
      btn.removeAttribute('aria-label');
      btn.disabled = false;
      form.reset();
    }, 5000);
  });
}

/* ============================================================
   HERO PARALLAX
   ============================================================ */
const heroGlow = document.querySelector('.hero-glow');
if (heroGlow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    heroGlow.style.transform = `translateY(${window.scrollY * 0.22}px)`;
  }, { passive: true });
}
