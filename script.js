/* ===========================
   PORTFOLIO SCRIPT — Mohan K
=========================== */

// ── Init Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  initAOS();
  initNavbar();
  initTypingEffect();
  initHamburger();
  initSmoothScroll();
  initSkillBars();
  initProjectFilter();
  initBackToTop();
  initContactForm();
  initScrollSpy();
});

/* ===========================
   AOS
=========================== */
function initAOS() {
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });
}

/* ===========================
   NAVBAR — glass on scroll
=========================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===========================
   TYPING EFFECT
=========================== */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  const phrases = [
    'Cyber Security Student',
    'Creative Video Editor',
    'Web Developer',
    'AI Agents Builder',
    'Freelancer & Collaborator',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 50 : 90;

    if (!isDeleting && charIdx === current.length) {
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }

    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(type, speed);
  }

  type();
}

/* ===========================
   HAMBURGER MENU
=========================== */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  const closeMenu = () => {
    links.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Navigate to section and close mobile menu
  links.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      if (target) {
        e.preventDefault();
        const navbar = document.getElementById('navbar');
        const offset = (navbar ? navbar.offsetHeight : 72) + 8;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      closeMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ===========================
   SMOOTH SCROLL
=========================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ===========================
   SCROLL SPY — active nav link
=========================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ===========================
   SKILL BARS — animate on view
=========================== */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width;
        // Small delay for stagger feel
        setTimeout(() => { bar.style.width = `${width}%`; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ===========================
   PROJECT FILTER
=========================== */
function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (match) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

/* ===========================
   BACK TO TOP
=========================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===========================
   CONTACT FORM
=========================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input, .form-textarea');

  // Floating label effect via class
  inputs.forEach(input => {
    input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
    input.addEventListener('blur', () => input.parentElement.classList.remove('focused'));
  });
}

async function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  const nameErr = document.getElementById('nameError');
  const emailErr = document.getElementById('emailError');
  const msgErr = document.getElementById('messageError');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const successEl = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  [nameErr, emailErr, msgErr].forEach(el => el.textContent = '');
  successEl.classList.remove('show');
  if (formError) {
    formError.textContent = '';
    formError.classList.remove('show');
  }

  let valid = true;

  if (!name.value.trim()) {
    nameErr.textContent = 'Please enter your name.';
    valid = false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    emailErr.textContent = 'Please enter a valid email address.';
    valid = false;
  }
  if (!message.value.trim() || message.value.trim().length < 10) {
    msgErr.textContent = 'Message must be at least 10 characters.';
    valid = false;
  }

  if (!valid) return;

  submitBtn.disabled = true;
  submitText.textContent = 'Sending...';

  const icon = submitBtn.querySelector('[data-lucide]');
  if (icon) { icon.setAttribute('data-lucide', 'loader'); lucide.createIcons(); }

  try {
    const apiUrl = window.location.protocol === 'file:'
      ? 'http://localhost:3000/api/contact'
      : '/api/contact';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject && subject.value.trim() ? subject.value.trim() : 'Portfolio Contact Message',
        message: message.value.trim(),
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to send message.');
    }

    successEl.classList.add('show');
    document.getElementById('contactForm').reset();
    setTimeout(() => successEl.classList.remove('show'), 6000);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown error';
    if (formError) {
      formError.textContent = `Could not send your message (${reason}).`;
      formError.classList.add('show');
    }
    const mailtoSubject = encodeURIComponent(subject && subject.value.trim() ? subject.value.trim() : 'Portfolio Contact Message');
    const mailtoBody = encodeURIComponent(
      `Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\nMessage:\n${message.value.trim()}`
    );
    window.location.href = `mailto:mohankmy18@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = 'Send Message';
    if (icon) { icon.setAttribute('data-lucide', 'send'); lucide.createIcons(); }
  }
}
/* ===========================
   PROJECT MODAL
=========================== */
const modalData = {
  'reel-factory': {
    title: 'Reel Factory',
    category: 'Video Editing',
    icon: 'play-square',
    color: 'var(--orange)',
    desc: 'A high-output reel production workflow for brands across Instagram and YouTube. Edited 100+ short-form videos using After Effects and CapCut with engaging transitions and color grading.',
    stats: [
      { label: 'Reels Edited', value: '100+' },
      { label: 'Platforms', value: 'IG / YouTube' },
      { label: 'Avg. reach boost', value: '3x' },
    ],
    tags: ['After Effects', 'CapCut', 'Motion Graphics', 'Color Grading'],
  },
  'promo-studio': {
    title: 'Promotional Studio',
    category: 'Video Editing',
    icon: 'megaphone',
    color: 'var(--orange)',
    desc: '65+ promotional brand videos for digital businesses. Focused on storytelling, brand identity, and compelling CTAs using motion graphics and cinematic color grading.',
    stats: [
      { label: 'Videos Produced', value: '65+' },
      { label: 'Brands Served', value: '10+' },
      { label: 'Tools Used', value: '2' },
    ],
    tags: ['After Effects', 'Branding', 'Storytelling', 'Color Correction'],
  },
  'client-projects': {
    title: 'Client Portfolio',
    category: 'Video Editing',
    icon: 'users',
    color: 'var(--green)',
    desc: 'End-to-end handling of 10+ client projects for digital brands and businesses. From initial brief to final delivery, managing revisions, feedback loops and deadlines.',
    stats: [
      { label: 'Clients', value: '10+' },
      { label: 'On-time delivery', value: '100%' },
      { label: 'Satisfaction rate', value: 'High' },
    ],
    tags: ['Client Management', 'Video Editing', 'Revisions', 'Delivery'],
  },
  'portfolio-site': {
    title: 'Portfolio Website',
    category: 'Web Development',
    icon: 'globe',
    color: 'var(--primary-light)',
    desc: 'This very portfolio site — built with semantic HTML5, advanced CSS animations, and vanilla JavaScript. Features AOS scroll animations, a typing effect, project filtering, smooth scrolling and a contact form.',
    stats: [
      { label: 'Lines of CSS', value: '600+' },
      { label: 'Sections', value: '8' },
      { label: 'Responsive', value: 'Yes' },
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'AOS', 'Lucide Icons'],
  },
  'web-projects': {
    title: 'Web Applications',
    category: 'Web Development',
    icon: 'layout-dashboard',
    color: 'var(--purple)',
    desc: 'A collection of 5 completed web development projects including responsive landing pages, interactive UI components and personal dashboard designs. All built with HTML, CSS and JavaScript.',
    stats: [
      { label: 'Projects', value: '5' },
      { label: 'Stack', value: 'HTML/CSS/JS' },
      { label: 'Responsive', value: 'All' },
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
  },
  'security-project': {
    title: 'Deep Learning Project',
    category: 'Deep Learning',
    icon: 'brain',
    color: 'var(--primary-light)',
    desc: 'A deep learning project focused on model training, evaluation, and practical AI applications with neural networks and data-driven experimentation.',
    stats: [
      { label: 'Domain', value: 'Deep Learning' },
      { label: 'Model', value: 'Neural Network' },
      { label: 'Focus', value: 'Evaluation' },
    ],
    tags: ['Python', 'TensorFlow/PyTorch', 'Data Processing', 'Model Tuning'],
  },
  'ai-agent-bot': {
    title: 'AI Agent Workflows',
    category: 'AI Agents',
    icon: 'bot',
    color: 'var(--ai-color)',
    desc: 'Exploring agentic AI systems — building prompt chains, automating multi-step LLM workflows, and experimenting with intelligent agents that can reason, plan and act autonomously.',
    stats: [
      { label: 'Type', value: 'Agentic AI' },
      { label: 'Focus', value: 'Automation' },
      { label: 'Stack', value: 'LLMs + APIs' },
    ],
    tags: ['LLM Prompting', 'Agentic Workflows', 'Automation', 'AI Tools'],
  },
  'ai-content': {
    title: 'AI-Assisted Content',
    category: 'AI Agents',
    icon: 'sparkles',
    color: 'var(--ai-color)',
    desc: 'Combining AI tools with video editing expertise to accelerate content creation pipelines — AI-generated scripts, automated thumbnails, smart cut suggestions, and faster turnaround for clients.',
    stats: [
      { label: 'Domain', value: 'Creative AI' },
      { label: 'Impact', value: '2x Faster' },
      { label: 'Tools', value: 'AI + AE' },
    ],
    tags: ['AI Video Tools', 'Prompt Engineering', 'Content Automation', 'After Effects'],
  },
};

function openModal(id) {
  const data = modalData[id];
  if (!data) return;

  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
      <div style="width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;color:${data.color};">
        <i data-lucide="${data.icon}" style="width:24px;height:24px;"></i>
      </div>
      <div>
        <div style="font-size:0.72rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px;">${data.category}</div>
        <h3 style="font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:800;">${data.title}</h3>
      </div>
    </div>
    <p style="color:var(--text-muted);font-size:0.92rem;line-height:1.75;margin-bottom:24px;">${data.desc}</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;">
      ${data.stats.map(s => `
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-family:'Space Grotesk',sans-serif;font-size:1.2rem;font-weight:800;color:${data.color};">${s.value}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);margin-top:3px;">${s.label}</div>
        </div>
      `).join('')}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${data.tags.map(t => `<span style="font-size:0.75rem;font-weight:500;padding:5px 13px;border-radius:100px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:var(--text-muted);">${t}</span>`).join('')}
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Re-init lucide for modal icons
  lucide.createIcons();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ESC key closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ===========================
   CARD HOVER GLOW — subtle
=========================== */
document.querySelectorAll('.skill-card, .service-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  });
});

/* ===========================
   COUNTER ANIMATION — stats
=========================== */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + '+';
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Trigger counters when hero stats come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      const targets = [100, 5, 10];
      nums.forEach((el, i) => animateCounter(el, targets[i]));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

