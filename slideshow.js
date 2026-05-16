/* =============================================
   SLIDESHOW.JS — Romantic Memory Gallery
   ============================================= */

/* ---- 1. LOADING SCREEN ---- */
(function initLoader() {
  const loader    = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    loaderBar.style.width = progress + '%';

    if (progress >= 100) {
      setTimeout(() => {
        loader.classList.add('hidden');
        startSlideshow();
      }, 400);
    }
  }, 90);
})();


/* ---- 2. PARTICLES CANVAS ---- */
(function initParticles() {
  const canvas = document.getElementById('slide-particles');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const SHAPES = ['dot', 'star', 'ring'];
  const COLORS = [
    'rgba(244,166,190,',
    'rgba(201,184,232,',
    'rgba(184,212,240,',
    'rgba(249,208,220,',
  ];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 20;
      this.size  = 1.5 + Math.random() * 3.5;
      this.speedY = 0.12 + Math.random() * 0.4;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = 0.08 + Math.random() * 0.35;
      this.fade   = 0.001 + Math.random() * 0.003;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.shape  = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fade;
      if (this.opacity <= 0 || this.y < -30) this.reset(false);
    }
    draw() {
      const c = `${this.color}${this.opacity})`;
      ctx.beginPath();
      if (this.shape === 'ring') {
        ctx.strokeStyle = c;
        ctx.lineWidth   = 0.8;
        ctx.arc(this.x, this.y, this.size * 1.6, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.shape === 'star') {
        ctx.fillStyle = c;
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const r = i % 2 === 0 ? this.size : this.size * 0.4;
          const fn = i === 0 ? 'moveTo' : 'lineTo';
          ctx[fn](
            this.x + r * Math.cos(angle),
            this.y + r * Math.sin(angle)
          );
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = c;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const particles = Array.from({ length: 60 }, () => new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ---- 3. FLOATING HEARTS ---- */
(function initFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const heartEmojis = ['💗','💖','💕','🌸','✨','💫','🌺'];

  function spawn() {
    const el = document.createElement('div');
    el.className = 'fheart';
    el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    el.style.left    = Math.random() * 100 + 'vw';
    el.style.fontSize = (0.7 + Math.random() * 1.2) + 'rem';
    const dur = 8 + Math.random() * 10;
    el.style.animationDuration  = dur + 's';
    el.style.animationDelay     = Math.random() * 4 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 4) * 1000);
  }

  // Initial batch
  for (let i = 0; i < 12; i++) setTimeout(spawn, i * 700);
  // Continuous
  setInterval(spawn, 2200);
})();


/* ---- 4. HEART CURSOR (desktop) ---- */
(function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const el = document.createElement('div');
  el.id = 'custom-cursor';
  el.textContent = '💗';
  document.body.appendChild(el);

  let cx = -100, cy = -100, tx = -100, ty = -100;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  function animateCursor() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    el.style.transform = `translate(${cx - 9}px, ${cy - 9}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();


/* ---- 5. MUSIC TOGGLE ---- */
(function initMusic() {
  const btn   = document.getElementById('musicBtn');
  const icon  = document.getElementById('musicIcon');
  let playing = false;

  // Oscillator-based ambient hum (no file needed)
  let audioCtx, osc1, osc2, gainNode;

  function startAmbient() {
    audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
    gainNode  = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 2);

    osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, audioCtx.currentTime);
    osc1.connect(gainNode);

    osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(277.18, audioCtx.currentTime);
    osc2.connect(gainNode);

    gainNode.connect(audioCtx.destination);
    osc1.start(); osc2.start();
  }

  function stopAmbient() {
    if (!gainNode) return;
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    setTimeout(() => {
      try { osc1.stop(); osc2.stop(); audioCtx.close(); } catch(e) {}
    }, 1600);
  }

  btn.addEventListener('click', () => {
    playing = !playing;
    if (playing) {
      startAmbient();
      icon.textContent = '♬';
      btn.classList.add('playing');
      btn.querySelector('.music-label').textContent = 'On';
    } else {
      stopAmbient();
      icon.textContent = '♪';
      btn.classList.remove('playing');
      btn.querySelector('.music-label').textContent = 'Music';
    }
  });
})();


/* ---- 6. SLIDESHOW ENGINE ---- */
let currentSlide = 0;
let autoTimer    = null;
const AUTO_DELAY = 5000; // 5 seconds per slide
let progressStart = null;
let progressRunning = false;

const slides       = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('slideDots');
const progressFill  = document.getElementById('progressFill');
const TOTAL        = slides.length;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function getDots() { return dotsContainer.querySelectorAll('.dot'); }

function activateSlide(idx, direction = 1) {
  const prev = currentSlide;

  // Exit current
  slides[prev].classList.remove('active');
  slides[prev].classList.add(direction >= 0 ? 'exit-left' : 'exit-right');
  setTimeout(() => slides[prev].classList.remove('exit-left', 'exit-right'), 750);

  currentSlide = (idx + TOTAL) % TOTAL;

  // Enter new
  slides[currentSlide].style.transform = direction >= 0
    ? 'translateX(60px) scale(0.96)'
    : 'translateX(-60px) scale(0.96)';
  slides[currentSlide].style.opacity = '0';
  slides[currentSlide].classList.add('active');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      slides[currentSlide].style.transform = '';
      slides[currentSlide].style.opacity   = '';
    });
  });

  // Update dots
  getDots().forEach((d, i) => d.classList.toggle('active', i === currentSlide));

  // Check for ending
  if (currentSlide === TOTAL - 1 && direction >= 0) {
    // Show ending after last slide has been displayed for AUTO_DELAY
    // (handled in auto-advance)
  }

  resetProgress();
}

function goTo(idx) {
  const dir = idx > currentSlide ? 1 : -1;
  activateSlide(idx, dir);
  resetAuto();
}
function next() {
  if (currentSlide === TOTAL - 1) { showEnding(); return; }
  activateSlide(currentSlide + 1, 1);
}
function prev() {
  activateSlide(currentSlide - 1, -1);
}

// Progress bar animation
function resetProgress() {
  progressFill.style.transition = 'none';
  progressFill.style.width = '0%';
  progressStart = Date.now();
  progressRunning = true;
  animateProgress();
}
function animateProgress() {
  if (!progressRunning) return;
  const elapsed = Date.now() - progressStart;
  const pct = Math.min((elapsed / AUTO_DELAY) * 100, 100);
  progressFill.style.transition = 'none';
  progressFill.style.width = pct + '%';
  if (pct < 100) requestAnimationFrame(animateProgress);
}

// Auto advance
function resetAuto() {
  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => {
    if (currentSlide === TOTAL - 1) { showEnding(); }
    else { next(); resetAuto(); }
  }, AUTO_DELAY);
}

// Controls
document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentSlide === TOTAL - 1) { showEnding(); return; }
  next(); resetAuto();
});
document.getElementById('prevBtn').addEventListener('click', () => {
  prev(); resetAuto();
});

// Keyboard
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { if (currentSlide === TOTAL - 1) showEnding(); else { next(); resetAuto(); } }
  if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
});

// Touch / swipe
let touchStartX = null;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) { if (currentSlide === TOTAL - 1) showEnding(); else { next(); resetAuto(); } }
    else { prev(); resetAuto(); }
  }
  touchStartX = null;
}, { passive: true });

// Ending screen
function showEnding() {
  progressRunning = false;
  clearTimeout(autoTimer);
  document.getElementById('endingScreen').classList.add('show');
}

document.getElementById('restartBtn').addEventListener('click', () => {
  document.getElementById('endingScreen').classList.remove('show');
  // Reset to first slide
  slides.forEach(s => s.classList.remove('active', 'exit-left', 'exit-right'));
  currentSlide = 0;
  slides[0].classList.add('active');
  getDots().forEach((d, i) => d.classList.toggle('active', i === 0));
  startSlideshow();
});

// Called after loader finishes
function startSlideshow() {
  slides[0].classList.add('active');
  resetAuto();
  resetProgress();
}