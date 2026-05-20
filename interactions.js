/* ============================================================
   T-Gain — Interactive Layer
   Custom cursor · Particle hero · 3D card tilts ·
   Magnetic buttons · Scroll reveals · Animated counters
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. CUSTOM CURSOR ─────────────────────────────────── */
  const cursorDot   = document.createElement('div');
  const cursorRing  = document.createElement('div');
  cursorDot.className  = 'c-dot';
  cursorRing.className = 'c-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mx = -200, my = -200, rx = -200, ry = -200;
  let isPointer = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.transform = `translate(${mx}px,${my}px)`;
  });

  document.addEventListener('mouseover', e => {
    const t = e.target.closest('a,button,.pillar,.feature,.quote,.store,.faq summary,.btn');
    isPointer = !!t;
  });

  // Ring lags behind dot for a smooth trailing feel
  (function ringLoop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.transform = `translate(${rx}px,${ry}px) scale(${isPointer ? 1.65 : 1})`;
    requestAnimationFrame(ringLoop);
  })();

  /* ── 2. HERO PARTICLE CANVAS ──────────────────────────── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const canvas  = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    heroSection.insertBefore(canvas, heroSection.firstChild);
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];
    let cmx = 0, cmy = 0; // canvas-relative mouse

    function resize() {
      W = canvas.width  = heroSection.offsetWidth;
      H = canvas.height = heroSection.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    heroSection.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      cmx = e.clientX - r.left;
      cmy = e.clientY - r.top;
    });

    const COUNT = 90;

    function Particle() {
      this.reset(true);
    }
    Particle.prototype.reset = function (random) {
      this.x  = Math.random() * W;
      this.y  = random ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.15);
      this.r  = Math.random() * 1.6 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.2;
    };
    Particle.prototype.update = function () {
      // Slight attraction to cursor
      const dx = cmx - this.x, dy = cmy - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 180) {
        this.vx += dx / dist * 0.018;
        this.vy += dy / dist * 0.018;
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
    };

    function initParticles() {
      particles = Array.from({length: COUNT}, () => new Particle());
    }
    initParticles();

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i], p2 = particles[j];
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34,224,122,${(1 - d/110) * 0.15})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.update();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,224,122,${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── 3. HERO MOUSE PARALLAX ───────────────────────────── */
  const heroTitle = document.querySelector('.hero h1');
  const heroLead  = document.querySelector('.hero .lead');
  document.addEventListener('mousemove', e => {
    const xFrac = (e.clientX / window.innerWidth  - 0.5);
    const yFrac = (e.clientY / window.innerHeight - 0.5);
    if (heroTitle) heroTitle.style.transform = `translate(${xFrac * 12}px, ${yFrac * 8}px)`;
    if (heroLead)  heroLead.style.transform  = `translate(${xFrac * 6}px,  ${yFrac * 4}px)`;
  });

  /* ── 4. 3D TILT ON CARDS ─────────────────────────────── */
  function addTilt(selector, strength) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left) / r.width  - 0.5;
        const y  = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform =
          `perspective(600px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(6px)`;
        card.style.boxShadow =
          `${-x * 12}px ${-y * 12}px 30px rgba(34,224,122,0.12)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.boxShadow  = '';
        card.style.transition = 'transform .5s ease, box-shadow .5s ease';
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }
  addTilt('.pillar',  14);
  addTilt('.feature', 10);
  addTilt('.quote',    8);

  /* ── 5. MAGNETIC BUTTONS ─────────────────────────────── */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const x  = (e.clientX - r.left - r.width  / 2) * 0.35;
      const y  = (e.clientY - r.top  - r.height / 2) * 0.35;
      btn.style.transform    = `translate(${x}px, ${y}px) scale(1.05)`;
      btn.style.transition   = 'transform .1s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform .4s cubic-bezier(.23,1,.32,1)';
    });
  });

  /* ── 6. SCROLL REVEAL ────────────────────────────────── */
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity .7s cubic-bezier(.25,.46,.45,.94),
                  transform .7s cubic-bezier(.25,.46,.45,.94);
    }
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(revealStyle);

  const revealTargets = [
    '.section-head', '.pillar', '.feature', '.quote',
    '.metric', '.faq details', '.hero-mockup', '.eyebrow',
    '.hero h1', '.hero .lead', '.hero-cta', '.final h2',
    '.final p', '.stores'
  ];

  revealTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 60}ms`;
    });
  });

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── 7. ANIMATED METRIC COUNTERS ─────────────────────── */
  function animateCount(el) {
    const raw = el.textContent.trim(); // e.g. "120k+", "4.8 ★★★★★", "#1"
    const numMatch = raw.match(/[\d.]+/);
    if (!numMatch) return;
    const target   = parseFloat(numMatch[0]);
    const prefix   = raw.slice(0, numMatch.index);
    const suffix   = raw.slice(numMatch.index + numMatch[0].length);
    const decimals = (numMatch[0].includes('.')) ? numMatch[0].split('.')[1].length : 0;
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      const val  = (target * ease).toFixed(decimals);
      el.textContent = prefix + val + suffix;
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

  /* ── 8. NAV SCROLL GLASS ─────────────────────────────── */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(10,10,10,0.92)';
    } else {
      nav.style.background = 'rgba(10,10,10,0.7)';
    }
  }, { passive: true });

  /* ── 9. FAQ SMOOTH OPEN ──────────────────────────────── */
  document.querySelectorAll('.faq details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        const p = d.querySelector('p');
        p.style.animation = 'faqSlide .3s ease forwards';
      }
    });
  });

  const faqStyle = document.createElement('style');
  faqStyle.textContent = `
    @keyframes faqSlide {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(faqStyle);

})();
