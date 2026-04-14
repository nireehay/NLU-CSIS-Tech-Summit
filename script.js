(function() {
  'use strict';

  /* ——————————————— NAV SCROLL ——————————————— */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ——————————————— HAMBURGER / MOBILE MENU ——————————————— */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link, .btn');

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ——————————————— COUNTDOWN TIMER ——————————————— */
  const eventDate = new Date('2026-05-08T09:00:00').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  const pad = n => String(n).padStart(2, '0');

  const tickCountdown = () => {
    const now = Date.now();
    const diff = eventDate - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }

    cdDays.textContent  = pad(Math.floor(diff / 86400000));
    cdHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    cdMins.textContent  = pad(Math.floor((diff % 3600000) / 60000));
    cdSecs.textContent  = pad(Math.floor((diff % 60000) / 1000));
  };

  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ——————————————— SCROLL FADE-IN ——————————————— */
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  const scrollToSection = (selector) => {
    const target = document.querySelector(selector);
    if (!target) return;

    const navOffset = nav ? nav.offsetHeight + 16 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  };

  document.querySelectorAll('.timeline-item-jump').forEach(item => {
    item.addEventListener('click', () => {
      scrollToSection(item.dataset.scrollTarget);
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToSection(item.dataset.scrollTarget);
      }
    });
  });

  /* ——————————————— SPEAKER MODAL ——————————————— */
  const modal = document.getElementById('speakerModal');
  const modalClose = document.getElementById('modalClose');
  const modalName = document.getElementById('modalName');
  const modalRole = document.getElementById('modalRole');
  const modalCompany = document.getElementById('modalCompany');
  const modalBio = document.getElementById('modalBio');
  const modalImg = document.getElementById('modalImg');
  const modalLinkedin = document.getElementById('modalLinkedin');
  const modalWebsite = document.getElementById('modalWebsite');
  const modalAvatarWrap = document.getElementById('modalAvatarWrap');

  const openModal = (card) => {
    const name = card.dataset.name;
    const initials = card.dataset.initials;
    const img = card.dataset.img;
    const bioParagraphs = (card.dataset.bio || '')
      .split('||')
      .map(paragraph => paragraph.trim())
      .filter(Boolean);

    modalName.textContent = name;
    modalRole.textContent = card.dataset.title;
    modalCompany.textContent = card.dataset.company;
    modalBio.innerHTML = bioParagraphs
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
    modalLinkedin.href = card.dataset.linkedin;
    if (card.dataset.website) {
      modalWebsite.href = card.dataset.website;
      modalWebsite.hidden = false;
    } else {
      modalWebsite.hidden = true;
      modalWebsite.removeAttribute('href');
    }
    modal.setAttribute('aria-label', `Speaker profile: ${name}`);

    // Build avatar
    modalAvatarWrap.innerHTML = `
      <img src="${img}" alt="${name} headshot"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
      <div class="modal-avatar-fallback" style="display:none">${initials}</div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.speaker-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
