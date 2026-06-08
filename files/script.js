/* ============================
   CYBER NEON PORTFOLIO - script.js
   ============================ */

// ============================
// CUSTOM CURSOR
// ============================
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Expand cursor on interactive elements
document.querySelectorAll('a, button, .project-card, .tech-badge, .info-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
});


// ============================
// PARTICLE CANVAS BACKGROUND
// ============================
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

const PARTICLE_COUNT = 80;
let particles = [];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    const palette = ['168,85,247', '59,130,246', '34,211,238', '192,132,252'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// ============================
// NAVBAR SCROLL EFFECT
// ============================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  backTopBtn.classList.toggle('visible', window.scrollY > 400);
});


// ============================
// HAMBURGER MOBILE MENU
// ============================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


// ============================
// TYPING TEXT EFFECT
// ============================
const typingEl = document.getElementById('typingText');
const phrases  = [
  'amazing websites.',
  'full-stack apps.',
  'AI-powered tools.',
  'seamless UX.',
  'clean, scalable code.',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingDelay = 100;

function typeEffect() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      typingDelay = 2000; // pause before deleting
    } else {
      typingDelay = 100;
    }
  } else {
    typingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting    = false;
      phraseIndex   = (phraseIndex + 1) % phrases.length;
      typingDelay   = 400;
    } else {
      typingDelay = 55;
    }
  }
  setTimeout(typeEffect, typingDelay);
}
setTimeout(typeEffect, 800);


// ============================
// SCROLL REVEAL
// ============================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings inside the same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay    = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


// ============================
// SKILL BAR ANIMATION
// ============================
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach(fill => skillObserver.observe(fill));


// ============================
// COUNTER ANIMATION (Hero Stats)
// ============================
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = +entry.target.dataset.target;
      let count    = 0;
      const step   = target / 40;
      const timer  = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(timer); }
        entry.target.textContent = Math.floor(count);
      }, 40);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));


// ============================
// SMOOTH SCROLLING
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ============================
// BACK TO TOP BUTTON
// ============================
const backTopBtn = document.getElementById('backTop');

backTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ============================
// PROJECT CARD TILT EFFECT
// ============================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const tiltX  = dy * -6;
    const tiltY  = dx *  6;
    card.style.transform    = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    card.style.transition   = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.4s ease';
  });
});


// ============================
// TECH BADGE HOVER RIPPLE
// ============================
document.querySelectorAll('.tech-badge').forEach(badge => {
  badge.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = badge.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: rgba(168,85,247,0.25);
      top:  ${e.clientY - rect.top  - size / 2}px;
      left: ${e.clientX - rect.left - size / 2}px;
      transform: scale(0);
      animation: ripple-out 0.5s ease-out forwards;
      pointer-events: none;
    `;
    badge.style.position = 'relative';
    badge.style.overflow = 'hidden';
    badge.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-out {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);


// ============================
// CONTACT FORM SEND BUTTON
// ============================
const sendBtn = document.getElementById('sendBtn');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const nameEl  = document.querySelector('.form-input[placeholder="John Doe"]');
    const emailEl = document.querySelector('.form-input[placeholder="john@example.com"]');
    const msgEl   = document.querySelector('.form-textarea');

    if (!nameEl.value || !emailEl.value || !msgEl.value) {
      sendBtn.querySelector('span').textContent = 'Fill all fields!';
      sendBtn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
      setTimeout(() => {
        sendBtn.querySelector('span').textContent = 'Send Message';
        sendBtn.style.background = '';
      }, 2000);
      return;
    }

    sendBtn.querySelector('span').textContent = 'Sending...';
    sendBtn.disabled = true;

    setTimeout(() => {
      sendBtn.querySelector('span').textContent = '✓ Message Sent!';
      sendBtn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      sendBtn.style.boxShadow  = '0 0 30px rgba(34,197,94,0.4)';
      nameEl.value = emailEl.value = msgEl.value = '';
      setTimeout(() => {
        sendBtn.querySelector('span').textContent = 'Send Message';
        sendBtn.style.background = '';
        sendBtn.style.boxShadow  = '';
        sendBtn.disabled = false;
      }, 3000);
    }, 1400);
  });
}


// ============================
// ACTIVE NAV LINK ON SCROLL
// ============================
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// Active nav link style
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
  .nav-link.active { color: var(--text) !important; }
  .nav-link.active::after { left: 14px !important; right: 14px !important; box-shadow: 0 0 8px var(--purple); }
`;
document.head.appendChild(activeNavStyle);


// ============================
// NEON GLOW ON HERO TITLE
// ============================
const titleName = document.querySelector('.title-name');
if (titleName) {
  setInterval(() => {
    titleName.style.textShadow = `0 0 ${20 + Math.random() * 10}px rgba(168,85,247,${0.5 + Math.random() * 0.3})`;
    setTimeout(() => titleName.style.textShadow = '', 200);
  }, 3000);
}


// ============================
// KEYBOARD SHORTCUT: Press 'T' to scroll to top
// ============================
document.addEventListener('keydown', (e) => {
  if (e.key === 't' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

console.log('%c⚡ Alex.dev Portfolio Loaded', 'color:#a855f7;font-size:14px;font-weight:bold;');
console.log('%cBuilt with HTML5 + CSS3 + Vanilla JS', 'color:#60a5fa;font-size:11px;');
