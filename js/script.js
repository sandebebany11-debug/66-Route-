(() => {
  'use strict';

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);

    const doc = document.documentElement;
    const scrollTop = window.scrollY;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    floatingCta.classList.toggle('visible', scrollTop > 400);

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      el.style.setProperty('--py', `${scrollTop * speed}px`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const mainNav = document.getElementById('mainNav');
  burger.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    burger.classList.toggle('active');
  });
  mainNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mainNav.classList.remove('open'))
  );

  /* ---------- Floating CTA visibility ---------- */
  const floatingCta = document.querySelector('.floating-cta');

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('in-view'), Number(delay));
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(target).includes('.');
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Set footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Live opening-hours status ---------- */
  const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const HOURS = { 0: [9.5, 22], 1: [8.5, 22], 2: [8.5, 22], 3: [8.5, 22], 4: [8.5, 22], 5: [8.5, 22], 6: [8.5, 22] };

  const formatTime = (decimalHours) => {
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours % 1) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const findNextOpening = (now, day) => {
    for (let i = 0; i <= 7; i++) {
      const d = (day + i) % 7;
      const [openAt] = HOURS[d];
      const candidate = new Date(now);
      candidate.setDate(now.getDate() + i);
      candidate.setHours(Math.floor(openAt), Math.round((openAt % 1) * 60), 0, 0);
      if (candidate > now) {
        const when = i === 0 ? 'heute' : i === 1 ? 'morgen' : WEEKDAYS[d];
        return `${when} um ${formatTime(openAt)} Uhr`;
      }
    }
    return '';
  };

  const updateOpenStatus = () => {
    const heroEl = document.getElementById('heroOpenStatus');
    const liveStatus = document.getElementById('liveStatus');
    const liveStatusSub = document.getElementById('liveStatusSub');
    if (!heroEl || !liveStatus || !liveStatusSub) return;

    const now = new Date();
    const day = now.getDay();
    const hoursNow = now.getHours() + now.getMinutes() / 60;
    const [openAt, closeAt] = HOURS[day];
    const isOpen = hoursNow >= openAt && hoursNow < closeAt;

    if (isOpen) {
      const closeStr = formatTime(closeAt);
      heroEl.innerHTML = `<i></i> Jetzt geöffnet · schließt um ${closeStr} Uhr`;
      heroEl.classList.remove('is-closed');
      liveStatus.textContent = 'Aktuell geöffnet';
      liveStatusSub.textContent = `Schließt heute um ${closeStr} Uhr`;
    } else {
      const nextOpen = findNextOpening(now, day);
      heroEl.innerHTML = `<i></i> Aktuell geschlossen · öffnet ${nextOpen}`;
      heroEl.classList.add('is-closed');
      liveStatus.textContent = 'Aktuell geschlossen';
      liveStatusSub.textContent = `Öffnet ${nextOpen}`;
    }

    document.querySelectorAll('#hoursTable tr').forEach(tr => {
      tr.classList.toggle('today', Number(tr.dataset.day) === day);
    });
  };
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  onScroll();
})();
