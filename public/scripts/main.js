/*
  NAUTERA - Client-Side Interactions & Dynamic Live Animations
*/

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initContinuousCounters();
  highlightActiveLink();
  initImageSlots();
  initTimelineFlowCanvas();
  initSubtleParallax();
  initEcosystemInteractions();
  initDashProgress();
});

/* Sticky Header & Mobile Drawer Menu */
function initNavbar() {
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.overlay');

  if (!header || !hamburger || !mobileNav || !overlay) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const toggleDrawer = () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleDrawer);
  overlay.addEventListener('click', toggleDrawer);

  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleDrawer();
      }
    });
  });
}

/* Scroll Animation Reveal System */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => observer.observe(el));
}

/* Highlight Active Page in Navbars */
function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (
      (currentPath === '/' && (href === 'index.html' || href === '/')) ||
      currentPath.includes(href) ||
      (currentPath === '' && href === 'index.html')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* Image Slot Loader */
function initImageSlots() {
  document.querySelectorAll('.img-slot').forEach(slot => {
    const img = slot.querySelector('img');
    if (!img) return;

    const markLoaded = () => {
      slot.classList.remove('img-error');
      slot.classList.add('loaded');
    };
    const markError = () => {
      slot.classList.remove('loaded');
      slot.classList.add('img-error');
    };

    if (img.complete) {
      img.naturalWidth > 0 ? markLoaded() : markError();
    } else {
      img.addEventListener('load',  markLoaded, { once: true });
      img.addEventListener('error', markError,  { once: true });
    }
  });
}

/* Continuous Smooth Counter System (requestAnimationFrame-based) */
function initContinuousCounters() {
  const elements = document.querySelectorAll('[data-counter-target]');
  if (!elements.length) return;

  elements.forEach(el => {
    let targetVal = parseFloat(el.getAttribute('data-counter-target')) || 0;
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const prefix = el.getAttribute('data-counter-prefix') || '';

    const formatNumber = (val) => {
      const integerPart = Math.floor(val).toString();
      return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    let hasStarted = false;

    const startCounter = () => {
      if (hasStarted) return;
      hasStarted = true;

      /* Phase 1: Initial count-up from 0 to target */
      const duration = 3000;
      const startTime = performance.now();
      const baseVal = targetVal;

      const countUp = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        /* Quintic ease-out for ultra-smooth deceleration */
        const ease = 1 - Math.pow(1 - progress, 5);
        const displayVal = baseVal * ease;

        el.textContent = `${prefix}${formatNumber(displayVal)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(countUp);
        } else {
          el.textContent = `${prefix}${formatNumber(baseVal)}${suffix}`;
          startLiveIncrement(baseVal);
        }
      };

      requestAnimationFrame(countUp);

      /* Phase 2: Live increment with 2-second pause interval */
      const startLiveIncrement = (startVal) => {
        let liveVal = startVal;
        const stepAttr = parseFloat(el.getAttribute('data-counter-step'));
        const exactStep = (!isNaN(stepAttr) && stepAttr > 0) ? Math.round(stepAttr) : null;

        const scheduleNextJump = () => {
          setTimeout(() => {
            animateJump();
          }, 1000); /* Pause 1 second before next increment */
        };

        const animateJump = () => {
          const fromVal = liveVal;
          let currentJump;
          if (exactStep !== null) {
            currentJump = exactStep;
          } else if (startVal >= 1000000) {
            currentJump = 8392;
          } else if (startVal >= 100000) {
            currentJump = 134;
          } else {
            currentJump = 1;
          }

          const toVal = fromVal + currentJump;
          liveVal = toVal;

          /* Quick smooth count-up transition (250ms) */
          const jumpDuration = 250;
          const jumpStart = performance.now();

          const stepAnim = (t) => {
            const progress = Math.min((t - jumpStart) / jumpDuration, 1);
            const ease = 1 - Math.pow(1 - progress, 2);
            const currentDisplay = fromVal + (toVal - fromVal) * ease;
            el.textContent = `${prefix}${formatNumber(currentDisplay)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(stepAnim);
            } else {
              el.textContent = `${prefix}${formatNumber(toVal)}${suffix}`;
              scheduleNextJump(); /* Wait 1 second, then continue */
            }
          };

          requestAnimationFrame(stepAnim);
        };

        /* First pause: wait 1 second after hitting initial target */
        scheduleNextJump();
      };
    };

    /* Trigger on scroll into view */
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCounter();
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(el);
    } else {
      startCounter();
    }
  });
}

/* ========================
   Timeline Flow Canvas Particle Animation (like amalproduktif.or.id)
======================== */
function initTimelineFlowCanvas() {
  const canvas = document.getElementById('timelineFlowCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let animationFrameId = null;
  let isRunning = false;

  function setCanvasSize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.offsetWidth;
    canvas.height = 100;
  }

  window.addEventListener('resize', () => {
    setCanvasSize();
    initParticles();
  });
  setCanvasSize();

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * canvas.width : 0;
      this.y = (canvas.height / 2) + (Math.random() * 16 - 8);
      this.size = Math.random() * 3 + 2;
      this.speedX = Math.random() * 1.6 + 0.9;
      const colors = ['#367F2D', '#77AB59', '#C9DF8A', '#234C20'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = initial ? Math.random() * 0.7 : 0;
    }

    update() {
      this.x += this.speedX;

      if (this.x < 60) {
        this.alpha = Math.min(0.8, this.alpha + 0.04);
      } else if (this.x > canvas.width - 60) {
        this.alpha = Math.max(0, this.alpha - 0.04);
      } else {
        this.alpha = 0.75;
      }

      if (this.x > canvas.width || (this.x > canvas.width - 60 && this.alpha <= 0.02)) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particlesArray = [];
    const count = Math.max(14, Math.floor(canvas.width / 26));
    for (let i = 0; i < count; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw smooth dashed connecting flowline
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.06, canvas.height / 2);
    ctx.lineTo(canvas.width * 0.94, canvas.height / 2);
    ctx.strokeStyle = 'rgba(119, 171, 89, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.restore();

    // Update and draw particles
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }

    if (isRunning) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  initParticles();

  // Run canvas loop only when visible
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isRunning) {
            isRunning = true;
            animate();
          }
        } else {
          isRunning = false;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  } else {
    isRunning = true;
    animate();
  }
}

/* ========================
   Desktop Subtle Mouse Parallax & Micro-Tilt
======================== */
function initSubtleParallax() {
  if (window.innerWidth < 1024) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltCards = document.querySelectorAll('.dash-card-light, .budidaya-photo-card, .article-card, .variant-card, .tilt-card');
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    let bounds;
    const onMouseEnter = () => {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
    };

    const onMouseMove = (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = (mouseX / bounds.width) - 0.5;
      const yPct = (mouseY / bounds.height) - 0.5;

      const rotX = -yPct * 4; /* Max 2 deg tilt */
      const rotY = xPct * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-6px)`;
    };

    const onMouseLeave = () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/* ========================
   Ecosystem Diagram Node Hover Interactions (For Growers)
======================== */
function initEcosystemInteractions() {
  const dashCards = document.querySelectorAll('.dash-card-light');
  const coreHub = document.querySelector('.dash-core-hub-light');
  if (!dashCards.length || !coreHub) return;

  dashCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      coreHub.style.transform = 'scale(1.05)';
      coreHub.style.boxShadow = '0 0 30px rgba(119, 171, 89, 0.4)';
    });

    card.addEventListener('mouseleave', () => {
      coreHub.style.transform = 'scale(1)';
      coreHub.style.boxShadow = '';
    });
  });
}

/* ========================
   Dashboard Progress Bars & Live Percent Count-Up
   Animates .dash-progress-fill + .live-percent-counter when scrolled into view
======================== */
function initDashProgress() {
  const fills = document.querySelectorAll('.dash-progress-fill');
  if (!fills.length) return;

  /* Ease-out cubic for smooth count-up */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animatePercent = (counterEl, target) => {
    const duration = 1200;
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOut(progress);
      const current = from + (target - from) * eased;
      counterEl.textContent = current.toFixed(1) + '%';
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const fill = entry.target;
      const pct = parseFloat(fill.getAttribute('data-progress-target')) || 0;

      /* Animate bar width */
      requestAnimationFrame(() => {
        fill.style.width = pct + '%';
      });

      /* Animate matching counter in same parent card */
      const card = fill.closest('.dash-card-light');
      if (card) {
        const counter = card.querySelector('.live-percent-counter');
        if (counter) animatePercent(counter, pct);
      }

      obs.unobserve(fill);
    });
  }, { threshold: 0.35 });

  fills.forEach(fill => observer.observe(fill));
}