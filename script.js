/* =============================================
   FOREVER WITH MY BUSHU — script.js
   ============================================= */

/* =============================================
   1. PARTICLES CANVAS
   ============================================= */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 55;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomRange(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x    = randomRange(0, W);
      this.y    = init ? randomRange(0, H) : H + 20;
      this.size = randomRange(1.5, 4);
      this.speedY = randomRange(0.15, 0.55);
      this.speedX = randomRange(-0.15, 0.15);
      this.opacity = randomRange(0.1, 0.55);
      this.fade   = randomRange(0.001, 0.004);
      this.shape  = Math.random() < 0.3 ? 'heart' : 'dot';
      this.color  = Math.random() < 0.5
        ? `rgba(200,131,106,${this.opacity})`
        : `rgba(240,200,192,${this.opacity})`;
    }
    drawHeart(ctx) {
      const s = this.size * 1.4;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(s * 0.08, s * 0.08);
      ctx.beginPath();
      ctx.moveTo(0, -3);
      ctx.bezierCurveTo(3.5, -7, 9, -4, 9, 0);
      ctx.bezierCurveTo(9, 4.5, 4, 8, 0, 12);
      ctx.bezierCurveTo(-4, 8, -9, 4.5, -9, 0);
      ctx.bezierCurveTo(-9, -4, -3.5, -7, 0, -3);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fade;
      if (this.opacity <= 0 || this.y < -30) this.reset(false);
    }
    draw(ctx) {
      if (this.shape === 'heart') {
        this.drawHeart(ctx);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(ctx); });
    requestAnimationFrame(animate);
  }
  animate();
})();


/* =============================================
   2. LIVE TIMER
   ============================================= */
(function initTimer() {
  // January 23, 2026 at 13:30:00 local time
  const START = new Date(2026, 0, 23, 13, 30, 0).getTime();

  const dEl = document.getElementById('t-days');
  const hEl = document.getElementById('t-hours');
  const mEl = document.getElementById('t-mins');
  const sEl = document.getElementById('t-secs');

  function pad(n, w = 2) { return String(n).padStart(w, '0'); }

  function tick() {
    const diff = Math.max(0, Date.now() - START);
    const totalSecs = Math.floor(diff / 1000);
    const secs  = totalSecs % 60;
    const mins  = Math.floor(totalSecs / 60) % 60;
    const hours = Math.floor(totalSecs / 3600) % 24;
    const days  = Math.floor(totalSecs / 86400);

    dEl.textContent = pad(days, 3);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(mins);
    sEl.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
})();


/* =============================================
   3. TIMER CLICK — BURST CELEBRATION
   ============================================= */
(function initTimerBurst() {
  const timerBox      = document.getElementById('timerBox');
  const burstContainer = document.getElementById('burst-container');
  const emojis = ['💖','💗','✨','🎉','💕','🌸','💫','🌹','💝','🎊','🌺','💞'];

  function spawnEmoji(x, y) {
    const el = document.createElement('div');
    el.className = 'burst-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const angle  = Math.random() * Math.PI * 2;
    const dist1  = 80  + Math.random() * 140;
    const dist2  = 140 + Math.random() * 200;
    const bx  = Math.cos(angle) * dist1;
    const by  = Math.sin(angle) * dist1 - 30;
    const bx2 = Math.cos(angle) * dist2;
    const by2 = Math.sin(angle) * dist2 - 60;
    const rot1 = (Math.random() - 0.5) * 90  + 'deg';
    const rot2 = (Math.random() - 0.5) * 180 + 'deg';

    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.style.setProperty('--bx',  bx  + 'px');
    el.style.setProperty('--by',  by  + 'px');
    el.style.setProperty('--bx2', bx2 + 'px');
    el.style.setProperty('--by2', by2 + 'px');
    el.style.setProperty('--br',  rot1);
    el.style.setProperty('--br2', rot2);
    el.style.transform = 'translate(-50%, -50%)';

    burstContainer.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  let celebrating = false;

  timerBox.addEventListener('click', function(e) {
    if (celebrating) return;
    celebrating = true;
    timerBox.classList.add('celebrating');

    const rect = timerBox.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    const count = 20 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const ox = (Math.random() - 0.5) * rect.width;
        const oy = (Math.random() - 0.5) * rect.height;
        spawnEmoji(cx + ox, cy + oy);
      }, i * 40);
    }

    setTimeout(() => {
      timerBox.classList.remove('celebrating');
      celebrating = false;
    }, 800);
  });
})();


/* =============================================
   4. NAVBAR — scroll effect + mobile toggle
   ============================================= */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
})();


/* =============================================
   5. SCROLL REVEAL
   ============================================= */
(function initScrollReveal() {
  const classes = [
    '.reveal-up',
    '.reveal-fade',
    '.reveal-left',
    '.reveal-right',
    '.reveal-timeline',
    '.msg-card'
  ];

  const elements = document.querySelectorAll(classes.join(','));

  // Hero section — trigger immediately on load
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach(el => {
    // CSS handles the delay via transition-delay, we just add the class
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('visible'));
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => {
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
})();


/* =============================================
   6. SUBTLE CURSOR TRAIL
   ============================================= */
(function initCursorTrail() {
  // Only on desktop
  if (window.matchMedia('(pointer: fine)').matches === false) return;
  if (window.innerWidth < 768) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; top:0; left:0; width:100%; height:100%;
    pointer-events: none; z-index: 1; opacity: 0.6;
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const trail = [];
  const MAX   = 18;
  let mx = -100, my = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    trail.push({ x: mx, y: my, age: 0 });
    if (trail.length > MAX) trail.shift();
  });

  function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((pt, i) => {
      pt.age++;
      const alpha = Math.max(0, (1 - i / MAX) * 0.18);
      const r     = (1 - i / MAX) * 4;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,131,106,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
})();