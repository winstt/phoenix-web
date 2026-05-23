/* ============================================================
   PHOENIX COMMUNITY TRUST — script.js
   Scroll reveal, parallax, smooth nav, counter animation
   ============================================================ */

'use strict';

/* ---- SCROLL REVEAL (IntersectionObserver) ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal-up').forEach((el) => revealObserver.observe(el));

/* ---- HEADER SCROLL EFFECT ---- */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- MOBILE NAV ---- */
const hamburger        = document.getElementById('hamburger');
const mobileNav        = document.getElementById('mobile-nav');
const mobileNavClose   = document.getElementById('mobile-nav-close');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

function openMobileNav() {
  mobileNav.classList.add('open');
  mobileNavOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav.classList.remove('open');
  mobileNavOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileNav);
mobileNavClose.addEventListener('click', closeMobileNav);
mobileNavOverlay.addEventListener('click', closeMobileNav);

// Close on mobile link click
document.querySelectorAll('.mobile-nav-link, .mobile-join').forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === id);
      });
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => sectionObserver.observe(s));

/* ---- SMOOTH SCROLL for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- COUNTER ANIMATION for stat numbers ---- */
function animateCounter(el) {
  const raw   = el.textContent.trim();
  // Extract numeric part + suffix (£, +, etc.)
  const match = raw.match(/^([£$€]?)(\d+)(\+?)$/);
  if (!match) return;

  const prefix = match[1];
  const target = parseInt(match[2], 10);
  const suffix = match[3];
  const duration = 1600;
  const start    = performance.now();

  const step = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out-expo
    const eased = 1 - Math.pow(2, -10 * progress);
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/* Trigger counter when stat card becomes visible */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const numEl = entry.target.querySelector('.stat-number');
      if (numEl) animateCounter(numEl);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-card').forEach((card) => counterObserver.observe(card));

/* ---- PARALLAX on hero glow ---- */
const heroBg = document.querySelector('.hero-bg-glow');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
}

/* ---- PARTNER CARD tilt effect (desktop only) ---- */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.partner-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- KEYBOARD: close mobile nav on Escape ---- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
});
