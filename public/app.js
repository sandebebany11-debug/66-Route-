(function () {
  const S = window.SALON;
  const C = window.BookingCore;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const TAGE_KURZ = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const fmtDate = (iso) => {
    const d = C.parseDate(iso);
    return `${TAGE[d.getDay()].slice(0, 2)}., ${d.getDate()}. ${MONATE[d.getMonth()]}`;
  };
  const fmtDauer = (m) => (m < 60 ? `${m} Min.` : `${Math.floor(m / 60)} Std.${m % 60 ? ' ' + (m % 60) + ' Min.' : ''}`);
  const stylistName = (id) => (id === 'egal' ? 'Egal – erste freie Person' : (S.team.find((t) => t.id === id) || {}).name || id);

  // ---------- Navigation ----------
  const nav = $('#nav');
  const toggle = $('.nav__toggle');
  const mobileCta = $('#mobile-cta');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', scrollY > 20);
    const termin = $('#termin').getBoundingClientRect();
    mobileCta.classList.toggle('is-visible', scrollY > innerHeight * 0.8 && (termin.top > innerHeight || termin.bottom < 0));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  $('#nav-links').addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ---------- Scroll-Reveal ----------
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------- Kontaktdaten ----------
  const tel = 'tel:' + S.telefon.replace(/[^\d+]/g, '');
  const adresse = `${S.strasse}, ${S.plz} ${S.stadt}`;
  const mapsQuery = encodeURIComponent(`Art of Hair ${S.strasse} ${S.plz} Leverkusen`);
  $('#hero-address').textContent = adresse;
  $('#hero-phone').textContent = S.telefonAnzeige;
  $('#hero-phone').href = tel;
  $('#c-address').innerHTML = `${esc(S.strasse)}<br>${esc(S.plz)} Leverkusen<br><em style="color:var(--brass)">${esc(S.ort)}</em>`;
  $('#c-phone').textContent = S.telefonAnzeige;
  $('#c-phone').href = tel;
  $('#c-mail').textContent = S.email;
  $('#c-mail').href = 'mailto:' + S.email;
  $('#c-route').href = 'https://www.google.com/maps/dir/?api=1&destination=' + mapsQuery;
  $('#c-map').src = 'https://www.google.com/maps?q=' + mapsQuery + '&output=embed';
  $('#insta-link').href = S.instagram;
  $('#year').textContent = new Date().getFullYear();

  // Öffnungszeiten
  const now = new Date();
  const order = [1, 2, 3, 4, 5, 6, 0];
  $('#c-hours').innerHTML = order
    .map((d) => {
      const h = S.oeffnungszeiten[d];
      const cls = d === now.getDay() ? ' class="is-today"' : '';
      return `<dt${cls}>${TAGE[d]}</dt><dd${cls}>${h ? `${h[0]} – ${h[1]} Uhr` : 'geschlossen'}</dd>`;
    })
    .join('');

  const todayHours = S.oeffnungszeiten[now.getDay()];
  const mins = now.getHours() * 60 + now.getMinutes();
  const isOpen = todayHours && mins >= C.toMin(todayHours[0]) && mins < C.toMin(todayHours[1]);
  $('#open-dot').classList.toggle('is-open', !!isOpen);
  if (isOpen) {
    $('#open-now').textContent = `Jetzt geöffnet · bis ${todayHours[1]} Uhr`;
  } else {
    for (let i = 0; i < 8; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const h = S.oeffnungszeiten[d.getDay()];
      if (h && (i > 0 || mins < C.toMin(h[0]))) {
        $('#open-now').textContent = `Geschlossen · öffnet ${i === 0 ? 'heute' : i === 1 ? 'morgen' : TAGE[d.getDay()]} ${h[0]} Uhr`;
        break;
      }
    }
  }

  // ---------- Leistungen ----------
  const tabs = $('#menu-tabs');
  const list = $('#menu-list');
  function showKategorie(id) {
    tabs.querySelectorAll('[role=tab]').forEach((t) => t.setAttribute('aria-selected', t.dataset.kat === id));
    list.innerHTML = S.leistungen
      .filter((l) => l.kat === id)
      .map(
        (l) => `<li class="menu__item">
          <span class="menu__name">${esc(l.name)}</span>
          <span class="menu__price">${esc(l.preis)}</span>
          <span class="menu__meta"><span>ca. ${fmtDauer(l.dauer)}</span><button type="button" class="menu__book" data-id="${l.id}">Buchen →</button></span>
        </li>`
      )
      .join('');
  }
  tabs.innerHTML = S.kategorien
    .map((k, i) => `<button role="tab" class="menu__tab" data-kat="${k.id}" aria-controls="menu-panel"><small>0${i + 1}</small>${esc(k.titel)}</button>`)
    .join('');
  tabs.addEventListener('click', (e) => {
    const t = e.target.closest('[role=tab]');
    if (t) showKategorie(t.dataset.kat);
  });
  tabs.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const all = [...tabs.children];
    const i = all.indexOf(document.activeElement);
    const next = all[(i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length];
    next.focus();
    showKategorie(next.dataset.kat);
  });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.menu__book');
    if (!b) return;
    selLeistung.value = b.dataset.id;
    selLeistung.dispatchEvent(new Event('change'));
    $('#termin').scrollIntoView({ behavior: 'smooth' });
  });
  showKategorie(S.kategorien[0].id);

  // ---------- Team ----------
  const teamImgs = [
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1554519515-242161756769?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80',
  ];
  $('#team-grid').innerHTML = S.team
    .map(
      (t, i) => `<figure class="member reveal">
        <div class="member__portrait">
          <span class="member__initials" aria-hidden="true">${esc(t.initialen)}</span>
          ${teamImgs[i] ? `<img src="${teamImgs[i]}" alt="" loading="lazy" onerror="this.remove()">` : ''}
        </div>
        <figcaption><h3>${esc(t.name)}</h3><p>${esc(t.rolle)}</p></figcaption>
      </figure>`
    )
    .join('');
  document.querySelectorAll('#team-grid .reveal').forEach((el) => io.observe(el));

  // ---------- Buchung ----------
  const state = { leistung: '', stylist: 'egal', datum: '', uhrzeit: '', monat: null };
  const selLeistung = $('#f-leistung');
  const stepDate = $('#step-date');
  const stepContact = $('#step-contact');
  const slotsEl = $('#slots');
  const cal = $('#cal');
  const errEl = $('#form-error');

  selLeistung.innerHTML += S.kategorien
    .map(
      (k) =>
        `<optgroup label="${esc(k.titel)}">${S.leistungen
          .filter((l) => l.kat === k.id)
          .map((l) => `<option value="${l.id}">${esc(l.name)} · ${esc(l.preis)}</option>`)
          .join('')}</optgroup>`
    )
    .join('');

  $('#f-stylist').innerHTML = [{ id: 'egal', name: 'Egal' }, ...S.team]
    .map(
      (t) => `<label class="chip"><input type="radio" name="stylist" value="${t.id}" ${t.id === 'egal' ? 'checked' : ''}><span>${esc(t.name)}</span></label>`
    )
    .join('');

  function updateSummary() {
    const l = S.leistungen.find((x) => x.id === state.leistung);
    const vals = {
      leistung: l ? l.name : '',
      stylist: state.leistung ? stylistName(state.stylist) : '',
      datum: state.datum ? fmtDate(state.datum) : '',
      uhrzeit: state.uhrzeit ? `${state.uhrzeit} Uhr · ca. ${fmtDauer(l.dauer)}` : '',
      preis: l ? l.preis : '',
    };
    document.querySelectorAll('#summary dd').forEach((dd) => {
      const v = vals[dd.dataset.k];
      dd.textContent = v || '—';
      dd.classList.toggle('empty', !v);
    });
    stepDate.classList.toggle('is-locked', !state.leistung);
    stepContact.classList.toggle('is-locked', !state.uhrzeit);
  }

  selLeistung.addEventListener('change', () => {
    state.leistung = selLeistung.value;
    state.uhrzeit = '';
    renderCal();
    loadSlots();
    updateSummary();
  });
  $('#f-stylist').addEventListener('change', (e) => {
    state.stylist = e.target.value;
    state.uhrzeit = '';
    loadSlots();
    updateSummary();
  });

  function renderCal() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last = new Date(today.getFullYear(), today.getMonth(), today.getDate() + S.vorlaufTage);
    if (!state.monat) state.monat = new Date(today.getFullYear(), today.getMonth(), 1);
    const m = state.monat;
    const first = new Date(m.getFullYear(), m.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const canPrev = m > new Date(today.getFullYear(), today.getMonth(), 1);
    const canNext = new Date(m.getFullYear(), m.getMonth() + 1, 1) <= last;

    let html = `<div class="cal__head"><strong>${MONATE[m.getMonth()]} ${m.getFullYear()}</strong>
      <div class="cal__nav"><button type="button" data-nav="-1" aria-label="Vorheriger Monat" ${canPrev ? '' : 'disabled'}>←</button>
      <button type="button" data-nav="1" aria-label="Nächster Monat" ${canNext ? '' : 'disabled'}>→</button></div></div>
      <div class="cal__grid" role="group" aria-label="Datum wählen">${TAGE_KURZ.map((d) => `<span class="cal__dow">${d}</span>`).join('')}`;
    for (let i = 0; i < offset; i++) html += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const date = new Date(m.getFullYear(), m.getMonth(), d);
      const iso = C.isoDate(date);
      const closed = !S.oeffnungszeiten[date.getDay()];
      const disabled = closed || date < today || date > last;
      const label = `${TAGE[date.getDay()]}, ${d}. ${MONATE[m.getMonth()]}${closed ? ' – geschlossen' : ''}`;
      html += `<button type="button" class="cal__day${+date === +today ? ' is-today' : ''}" data-date="${iso}" aria-label="${label}" aria-pressed="${state.datum === iso}" ${disabled ? 'disabled' : ''}>${d}</button>`;
    }
    cal.innerHTML = html + '</div>';
  }

  cal.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav) {
      state.monat = new Date(state.monat.getFullYear(), state.monat.getMonth() + Number(nav.dataset.nav), 1);
      return renderCal();
    }
    const day = e.target.closest('[data-date]');
    if (day) {
      state.datum = day.dataset.date;
      state.uhrzeit = '';
      renderCal();
      loadSlots();
      updateSummary();
    }
  });

  let slotReq = 0;
  async function loadSlots() {
    if (!state.leistung || !state.datum) {
      slotsEl.innerHTML = state.leistung ? '<p class="slots__empty">Bitte zuerst einen Tag im Kalender wählen.</p>' : '';
      return;
    }
    const req = ++slotReq;
    slotsEl.innerHTML = '<p class="slots__empty">Freie Zeiten werden geladen …</p>';
    try {
      const slots = await Store.slots(state.datum, state.leistung, state.stylist);
      if (req !== slotReq) return;
      slotsEl.innerHTML = slots.length
        ? slots.map((t) => `<button type="button" class="slot" data-time="${t}" aria-pressed="${state.uhrzeit === t}">${t}</button>`).join('')
        : '<p class="slots__empty">An diesem Tag ist leider nichts mehr frei. Probieren Sie einen anderen Tag oder eine andere Person.</p>';
    } catch (err) {
      slotsEl.innerHTML = `<p class="slots__empty">Zeiten konnten nicht geladen werden. Bitte rufen Sie uns an: ${esc(S.telefonAnzeige)}</p>`;
    }
  }

  slotsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-time]');
    if (!b) return;
    state.uhrzeit = b.dataset.time;
    slotsEl.querySelectorAll('.slot').forEach((s) => s.setAttribute('aria-pressed', s === b));
    updateSummary();
    if (matchMedia('(max-width: 960px)').matches) stepContact.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.textContent = '';
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const btn = $('#submit');
    btn.disabled = true;
    btn.firstChild.textContent = 'Wird gesendet … ';
    try {
      const r = await Store.create({
        leistung: state.leistung,
        stylist: state.stylist,
        datum: state.datum,
        uhrzeit: state.uhrzeit,
        name: form.name.value,
        telefon: form.telefon.value,
        email: form.email.value,
        notiz: form.notiz.value,
      });
      $('#booking-box').innerHTML = `<div class="confirm" role="status">
        <div class="confirm__mark"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14.5l5 5L22 8.5" stroke="currentColor" stroke-width="1.6"/></svg></div>
        <h3>Vielen Dank, ${esc(r.name.split(' ')[0])}!</h3>
        <p>Ihre Reservierung für <strong>${esc(r.leistungName)}</strong> am <strong>${fmtDate(r.datum)} um ${r.uhrzeit} Uhr</strong> bei ${esc(stylistName(r.stylist))} ist eingegangen.</p>
        <p>Reservierungsnummer: <span class="code">${esc(r.id)}</span><br>Wir melden uns in Kürze zur Bestätigung. Falls Sie verhindert sind, rufen Sie uns bitte unter <a href="${tel}">${esc(S.telefonAnzeige)}</a> an.</p>
        <p style="margin-top:2rem"><button type="button" class="btn btn--ghost" onclick="location.hash='termin';location.reload()">Weiteren Termin buchen</button></p>
      </div>`;
    } catch (err) {
      errEl.textContent = err.message;
      btn.disabled = false;
      btn.firstChild.textContent = 'Verbindlich reservieren ';
      state.uhrzeit = '';
      updateSummary();
      loadSlots();
    }
  });

  renderCal();
  updateSummary();
  Store.detect();
})();
