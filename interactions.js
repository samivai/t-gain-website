/* ============================================================
   T-Gain — Interactive polish
   Safe additions only: NO scroll-reveal on hero text.
   - Scroll-reveal on below-the-fold sections
   - Animated metric counters
   - Nav glass on scroll
   - 3D tilt on cards (desktop only)
   - Magnetic primary buttons (desktop only)
   - Smooth anchor scroll
   ============================================================ */
(function () {
  'use strict';

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const reduceMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll reveal (only below-the-fold sections) ─────── */
  if (!reduceMotion) {
    const revealSelectors = [
      '.pillar',
      '.feature',
      '.quote',
      '.faq details',
      '.stores',
      '.metric'
    ];
    revealSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(i * 70, 350)}ms`;
      });
    });

    // Pure-text fade-in for section headings and paragraphs (children stagger)
    const textFadeSelectors = [
      '#pillars .section-head h2',  '#pillars .section-head p',
      '#features .section-head h2', '#features .section-head p',
      '#loved .section-head h2',    '#loved .section-head p',
      '#faq .section-head h2',
      '.final h2',                  '.final p'
    ];
    textFadeSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('text-fade');
        el.style.transitionDelay = `${i * 90}ms`;
      });
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .text-fade').forEach(el => obs.observe(el));
  }

  /* ── Animated metric counters ─────────────────────────── */
  function animateCount(el) {
    const raw = el.textContent.trim();
    const m   = raw.match(/[\d.]+/);
    if (!m) return;
    const target   = parseFloat(m[0]);
    const prefix   = raw.slice(0, m.index);
    const suffix   = raw.slice(m.index + m[0].length);
    const decimals = m[0].includes('.') ? m[0].split('.')[1].length : 0;
    const duration = 1600;
    const start    = performance.now();
    function step(now) {
      const p    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = prefix + (target * ease).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.metric .num').forEach(el => counterObs.observe(el));

  /* ── Nav glass on scroll ──────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 3D tilt on cards (desktop only) ──────────────────── */
  if (isFinePointer && !reduceMotion) {
    function addTilt(selector, strength) {
      document.querySelectorAll(selector).forEach(card => {
        let raf = 0;
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width  - 0.5;
          const y = (e.clientY - r.top)  / r.height - 0.5;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            card.style.transform =
              `perspective(700px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateY(-6px)`;
          });
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }
    addTilt('.pillar',  10);
    addTilt('.feature',  7);
    addTilt('.quote',    6);
  }

  /* ── Magnetic primary buttons (desktop only) ──────────── */
  if (isFinePointer && !reduceMotion) {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.25;
        const y = (e.clientY - r.top  - r.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px) scale(1.04)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── Smooth anchor scroll for in-page links ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

})();
