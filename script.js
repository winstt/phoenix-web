/* ============================================================
   PHOENIX COMMUNITY TRUST — script.js
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
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up').forEach((el) => revealObs.observe(el));

/* ============================================================
   HEADER — scroll class + active nav link
   ============================================================ */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Highlight active nav link based on current section
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((l) => {
      l.classList.toggle('active', l.dataset.section === e.target.id);
    });
  });
}, { threshold: 0.35 });

sections.forEach((s) => sectionObs.observe(s));

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--h')) || 68;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
    // Close mobile nav if open
    closeMobileNav();
  });
});

/* ============================================================
   MOBILE NAV
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');
const mobileClose= document.getElementById('mobile-close');
const navOverlay = document.getElementById('nav-overlay');

function openMobileNav()  {
  mobileNav.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  mobileNav.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileNav);
mobileClose.addEventListener('click', closeMobileNav);
navOverlay.addEventListener('click', closeMobileNav);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeMobileNav(); closeSearch(); }
});

/* ============================================================
   SEARCH
   ============================================================ */
const searchBtn     = document.getElementById('search-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchClose   = document.getElementById('search-close');
const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Searchable content index
const searchIndex = [
  { section: 'about',         label: 'About Us',           text: 'phoenix community trust global majority movement funding justice systems change redistribution power resources uk' },
  { section: 'impact',        label: 'Our Impact',         text: 'our impact 9 regions 100 community organisations 4m grants national lottery 2026 uniting people organisations uk leadership innovation' },
  { section: 'where-we-work', label: 'Where We Work',      text: 'where we work north east cumbria north west yorkshire humber east midlands west midlands east of england greater london south east south west active regions' },
  { section: 'network',       label: 'Anti Racist Cumbria',text: 'anti racist cumbria dismantling racism advancing justice community led network collective power cumbria north east' },
  { section: 'network',       label: 'Inclusive North',    text: 'inclusive north championing racial unity lancashire north west research policy innovation investment global majority' },
  { section: 'network',       label: 'Impact Hub Yorkshire',text: 'impact hub yorkshire powering positive change entrepreneurs innovators social environmental change yorkshire humber' },
  { section: 'network',       label: 'The Ubele Initiative',text: 'ubele initiative equity justice greater london south east east england global majority social economic change' },
  { section: 'network',       label: 'Black South West Network',text: 'black south west network building power creating change racial justice black voices equity south west' },
  { section: 'network',       label: 'South Asian Health Action',text: 'south asian health action improving health advancing equity midlands research advocacy south asian communities' },
  { section: 'grants',        label: 'Grants',             text: 'grants funding justice action 4m national lottery community fund 2026 strategic development register interest global majority' },
  { section: 'news',          label: 'News & Updates',     text: 'news updates stories insights announcements community grants cheltenham partnership 2026 grants round strategy development' },
  { section: 'contact',       label: 'Contact',            text: 'contact get in touch collaboration conversation connection info@phoenix-trust.co.uk media press enquiries' },
];

function openSearch() {
  searchOverlay.classList.add('open');
  searchInput.focus();
  document.body.style.overflow = 'hidden';
}
function closeSearch() {
  searchOverlay.classList.remove('open');
  searchInput.value = '';
  searchResults.innerHTML = '';
  document.body.style.overflow = '';
}

searchBtn.addEventListener('click', openSearch);
searchClose.addEventListener('click', closeSearch);
searchOverlay.addEventListener('click', (e) => {
  if (e.target === searchOverlay) closeSearch();
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = '';

  if (!q) return;

  const matches = searchIndex.filter((item) =>
    item.text.includes(q) || item.label.toLowerCase().includes(q)
  );

  if (!matches.length) {
    searchResults.innerHTML = '<p class="search-empty">No results found.</p>';
    return;
  }

  // Deduplicate by section+label
  const seen = new Set();
  matches.forEach((item) => {
    const key = item.section + item.label;
    if (seen.has(key)) return;
    seen.add(key);

    const btn = document.createElement('button');
    btn.className = 'search-result-item';
    btn.innerHTML = `
      <span class="search-result-section">${item.label}</span>
      <span class="search-result-text">#${item.section}</span>
    `;
    btn.addEventListener('click', () => {
      closeSearch();
      const target = document.getElementById(item.section);
      if (!target) return;
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--h')) || 68;
      setTimeout(() => {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth',
        });
      }, 100);
    });
    searchResults.appendChild(btn);
  });
});

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCount(el) {
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  const dur = 1400;
  const start = performance.now();

  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
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
   ENGLAND MAP — dots tooltip
   ============================================================ */
const mapWrap   = document.querySelector('.map-wrap');
const tooltip   = document.getElementById('map-tooltip');
const regionDots= document.querySelectorAll('.region-dot');

regionDots.forEach((dot) => {
  dot.addEventListener('mouseenter', (e) => {
    const name = dot.dataset.name;
    const svgEl = dot.closest('svg');
    const core  = dot.querySelector('.dot-core');
    if (!svgEl || !core || !tooltip) return;

    const svgRect  = svgEl.getBoundingClientRect();
    const dotRect  = core.getBoundingClientRect();

    tooltip.textContent = name;
    tooltip.style.left  = (dotRect.left - svgRect.left + dotRect.width / 2) + 'px';
    tooltip.style.top   = (dotRect.top  - svgRect.top) + 'px';
    tooltip.classList.add('show');
  });
  dot.addEventListener('mouseleave', () => {
    if (tooltip) tooltip.classList.remove('show');
  });
});

/* ============================================================
   PARTNER FLOATING CARDS — expand/collapse
   ============================================================ */
const partnerCards = document.querySelectorAll('.partner-float');

partnerCards.forEach((card) => {
  card.addEventListener('click', () => {
    const isOpen = card.classList.contains('open');
    // Close all
    partnerCards.forEach((c) => c.classList.remove('open'));
    // Open clicked (toggle)
    if (!isOpen) card.classList.add('open');
  });
});

/* ============================================================
   NEWS FILTER TABS
   ============================================================ */
const newsTabs  = document.querySelectorAll('.news-tab');
const newsCards = document.querySelectorAll('.news-card');

newsTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;
    newsTabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    newsCards.forEach((card) => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ============================================================
   CONTACT FORM — basic validation + feedback
   ============================================================ */
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'Message sent ✓';
  btn.style.background = 'rgba(34,197,94,0.2)';
  btn.style.border = '1px solid rgba(34,197,94,0.4)';
  btn.style.color = '#22c55e';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send message';
    btn.style = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
});

/* ============================================================
   HERO — parallax glow
   ============================================================ */
const heroGlow = document.querySelector('.hero-glow');
if (heroGlow) {
  window.addEventListener('scroll', () => {
    heroGlow.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}
