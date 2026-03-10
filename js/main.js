/* ═══════════════════════════════════════════════
   CHEMPAKASSERIL DENTAL CARE — Main JS
   ═══════════════════════════════════════════════ */

'use strict';

/* ── LOADER ──────────────────────────────────────
   Hide loader once page is ready
   ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
});


/* ── NAVBAR ──────────────────────────────────────
   Scroll-based state + hamburger toggle
   ─────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
  updateBackToTop();
  animateParallax();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});


/* ── ACTIVE NAV LINK ─────────────────────────────
   Highlight nav link for current section
   ─────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id], div[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}


/* ── PARALLAX ────────────────────────────────────
   Smooth parallax for hero bg + dividers
   ─────────────────────────────────────────────── */
const heroBg         = document.getElementById('heroBg');
const parallaxLayers = document.querySelectorAll('.parallax-layer');

function animateParallax() {
  const scrollY = window.scrollY;

  // Hero background
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
  }

  // Section dividers
  parallaxLayers.forEach(layer => {
    const parent = layer.parentElement;
    const rect   = parent.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const speed  = parseFloat(layer.dataset.speed) || 0.3;
      const offset = (window.innerHeight - rect.top) * speed * 0.5;
      layer.style.transform = `translateY(${offset}px)`;
    }
  });
}

// About image subtle parallax
const aboutImgParallax = document.getElementById('aboutImgParallax');
if (aboutImgParallax) {
  const aboutImg = aboutImgParallax.querySelector('img');
  window.addEventListener('scroll', () => {
    const rect = aboutImgParallax.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = (window.innerHeight - rect.top) * 0.08;
      if (aboutImg) aboutImg.style.transform = `translateY(-${offset}px)`;
    }
  }, { passive: true });
}


/* ── SCROLL REVEAL ───────────────────────────────
   Intersection Observer for fade/slide-in elements
   ─────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Hero elements animate immediately on load
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-content .reveal-up').forEach(el => {
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay + 700);
  });
});


/* ── STAT COUNTERS ───────────────────────────────
   Count-up animation when stats enter viewport
   ─────────────────────────────────────────────── */
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counters.forEach(counter => animateCounter(counter));
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const statsBand = document.querySelector('.stats-band');
if (statsBand) statsObserver.observe(statsBand);

function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 1800;
  const start    = performance.now();

  function update(time) {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}


/* ── TESTIMONIALS SLIDER ─────────────────────────
   Manual slider with auto-play + dots
   ─────────────────────────────────────────────── */
const track      = document.getElementById('testimonialsTrack');
const tPrev      = document.getElementById('tPrev');
const tNext      = document.getElementById('tNext');
const dotsWrap   = document.getElementById('tDots');
const cards      = track ? track.querySelectorAll('.testimonial-card') : [];
let   currentIdx = 0;
let   autoTimer;

function buildDots() {
  dotsWrap.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('t-dot');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
}

function goTo(idx) {
  currentIdx = (idx + cards.length) % cards.length;
  track.style.transform = `translateX(calc(-${currentIdx * 100}% - ${currentIdx * 1.5}rem))`;
  dotsWrap.querySelectorAll('.t-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentIdx);
  });
  resetAutoPlay();
}

function resetAutoPlay() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(currentIdx + 1), 5000);
}

if (track && cards.length) {
  buildDots();
  tPrev.addEventListener('click', () => goTo(currentIdx - 1));
  tNext.addEventListener('click', () => goTo(currentIdx + 1));

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIdx + 1 : currentIdx - 1);
  });

  resetAutoPlay();
}


/* ── CONTACT FORM → GOOGLE SHEETS ────────────────
   Submits appointment data to a Google Apps Script
   Web App which writes rows into a Google Sheet.

   SETUP:
   1. Deploy your Apps Script (see Code.gs) as a Web App
   2. Paste the deployed URL below as APPS_SCRIPT_URL
   ─────────────────────────────────────────────── */
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Sending…</span><i class="fa fa-spinner fa-spin"></i>';

    // Hide previous messages
    formSuccess.classList.remove('show');
    formError.classList.remove('show');

    // Collect form data
    const data = {
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name:      contactForm.querySelector('#cf-name').value.trim(),
      phone:     contactForm.querySelector('#cf-phone').value.trim(),
      email:     contactForm.querySelector('#cf-email').value.trim(),
      service:   contactForm.querySelector('#cf-service').value,
      message:   contactForm.querySelector('#cf-message').value.trim(),
    };

    try {
      // Google Apps Script requires no-cors mode when called from a plain HTML file
      await fetch(APPS_SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      // no-cors responses are opaque — we assume success if fetch didn't throw
      contactForm.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);

    } catch (err) {
      console.error('Submission error:', err);
      formError.classList.add('show');
      setTimeout(() => formError.classList.remove('show'), 6000);

    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span><i class="fa fa-arrow-right"></i>';
    }
  });
}


/* ── BACK TO TOP ─────────────────────────────────── */
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  backToTop.classList.toggle('show', window.scrollY > 400);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── SMOOTH SCROLL ───────────────────────────────
   Offset for fixed navbar
   ─────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH   = navbar.offsetHeight;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── CURSOR GLOW (desktop only) ───────────────────
   Subtle ambient glow that follows the cursor
   ─────────────────────────────────────────────── */
if (window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  Object.assign(glow.style, {
    position: 'fixed',
    width: '320px', height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '9998',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s',
    opacity: '0',
  });
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  (function animateGlow() {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.left = `${gx}px`;
    glow.style.top  = `${gy}px`;
    requestAnimationFrame(animateGlow);
  })();
}


/* ── APPOINTMENT MODAL ───────────────────────────
   Open on any [data-modal] button, close on backdrop/Esc
   ─────────────────────────────────────────────── */
const apptModal  = document.getElementById('apptModal');
const modalClose = document.getElementById('modalClose');
const modalForm  = document.getElementById('modalForm');
const modalSuccess = document.getElementById('modalSuccess');
const modalError   = document.getElementById('modalError');

function openModal() {
  apptModal.classList.add('open');
  apptModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  apptModal.classList.remove('open');
  apptModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', openModal);
});
modalClose.addEventListener('click', closeModal);
apptModal.addEventListener('click', (e) => {
  if (e.target === apptModal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

if (modalForm) {
  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = modalForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Sending…</span><i class="fa fa-spinner fa-spin"></i>';
    modalSuccess.classList.remove('show');
    modalError.classList.remove('show');

    const data = {
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name:    modalForm.querySelector('#mf-name').value.trim(),
      phone:   modalForm.querySelector('#mf-phone').value.trim(),
      email:   modalForm.querySelector('#mf-email').value.trim(),
      service: modalForm.querySelector('#mf-service').value,
      message: modalForm.querySelector('#mf-message').value.trim(),
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      modalForm.reset();
      modalSuccess.classList.add('show');
      setTimeout(() => { modalSuccess.classList.remove('show'); closeModal(); }, 4000);
    } catch {
      modalError.classList.add('show');
      setTimeout(() => modalError.classList.remove('show'), 5000);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Send Request</span><i class="fa fa-arrow-right"></i>';
    }
  });
}


/* ── FAQ ACCORDION ───────────────────────────────
   Toggle open/close on question click
   ─────────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});


/* ── INITIAL RUN ─────────────────────────────────── */
animateParallax();
updateActiveNav();
updateBackToTop();
