(function () {
  const S = window.SALON;
  const C = window.BookingCore;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const STATUS = ['offen', 'bestätigt', 'erledigt', 'storniert'];
  const PIN_KEY = 'artofhair.pin';

  let pin = '';
  let all = [];
  let timer = null;

  const stylistName = (id) => (S.team.find((t) => t.id === id) || {}).name || id;
  const endTime = (r) => C.toHHMM(C.toMin(r.uhrzeit) + r.dauer);
  const today = () => C.isoDate(new Date());

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove('is-visible'), 2600);
  }

  // ---------- Login ----------
  async function tryLogin(value, silent) {
    try {
      await Store.checkPin(value);
      pin = value;
      try {
        sessionStorage.setItem(PIN_KEY, value);
      } catch {}
      $('#login').hidden = true;
      $('#board').hidden = false;
      $('#logout').hidden = false;
      $('#demo-notice').hidden = Store.mode() !== 'lokal';
      await refresh();
      timer = setInterval(refresh, 30000);
      return true;
    } catch (err) {
      if (!silent) $('#login-error').textContent = err.status === 401 ? 'Die PIN ist nicht korrekt.' : err.message || 'Anmeldung fehlgeschlagen.';
      return false;
    }
  }

  $('#login').addEventListener('submit', async (e) => {
    e.preventDefault();
    $('#login-error').textContent = '';
    tryLogin($('#pin').value);
  });

  // Lokaler Demo-Modus prüft die PIN hier:
  const origCheck = Store.checkPin;
  Store.checkPin = async (value) => {
    const ok = await origCheck(value);
    if (!ok) {
      const err = new Error('Die PIN ist nicht korrekt.');
      err.status = 401;
      throw err;
    }
    return true;
  };

  $('#logout').addEventListener('click', () => {
    try {
      sessionStorage.removeItem(PIN_KEY);
    } catch {}
    location.reload();
  });

  // ---------- Daten ----------
  async function refresh() {
    try {
      all = await Store.list(pin);
      $('#updated').textContent = `${all.length} Reservierungen gesamt · aktualisiert ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`;
      render();
    } catch (err) {
      if (err.status === 401) location.reload();
      else toast('Aktualisierung fehlgeschlagen');
    }
  }

  function filtered() {
    const range = $('#f-range').value;
    const stylist = $('#f-stylist').value;
    const status = $('#f-status').value;
    const q = $('#f-search').value.trim().toLowerCase();
    const t = today();
    const week = C.isoDate(new Date(Date.now() + 7 * 864e5));
    const date = $('#f-date').value;

    return all
      .filter((r) => {
        if (range === 'kommend' && r.datum < t) return false;
        if (range === 'heute' && r.datum !== t) return false;
        if (range === 'woche' && (r.datum < t || r.datum > week)) return false;
        if (range === 'datum' && date && r.datum !== date) return false;
        if (range === 'vergangen' && r.datum >= t) return false;
        if (stylist && r.stylist !== stylist) return false;
        if (status === '' && r.status === 'storniert') return false;
        if (status && status !== '*' && r.status !== status) return false;
        if (q && ![r.name, r.telefon, r.email, r.id, r.leistungName, r.notiz].join(' ').toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        const k = (a.datum + a.uhrzeit).localeCompare(b.datum + b.uhrzeit);
        return range === 'vergangen' ? -k : k;
      });
  }

  function renderKpis() {
    const t = today();
    const active = all.filter((r) => r.status !== 'storniert');
    const k = [
      [active.filter((r) => r.datum === t).length, 'Termine heute'],
      [active.filter((r) => r.datum >= t).length, 'Kommende Termine'],
      [all.filter((r) => r.status === 'offen' && r.datum >= t).length, 'Noch zu bestätigen'],
      [all.filter((r) => r.erstellt && Date.now() - Date.parse(r.erstellt) < 864e5).length, 'Neu in 24 Std.'],
    ];
    $('#kpis').innerHTML = k.map(([n, l]) => `<div class="kpi"><b>${n}</b><span>${l}</span></div>`).join('');
  }

  function render() {
    renderKpis();
    const list = filtered();
    const rows = $('#rows');
    const empty = $('#empty');
    if (!list.length) {
      rows.innerHTML = '';
      empty.hidden = false;
      empty.innerHTML = all.length
        ? '<strong>Keine Treffer</strong>Für diese Filter gibt es keine Reservierungen. Zeitraum auf „Alle“ stellen?'
        : '<strong>Noch keine Reservierungen</strong>Sobald Kund:innen online buchen, erscheinen die Termine hier – nach Tag sortiert.';
      return;
    }
    empty.hidden = true;
    let lastDay = '';
    let html = '';
    for (const r of list) {
      if (r.datum !== lastDay) {
        lastDay = r.datum;
        const d = C.parseDate(r.datum);
        const count = list.filter((x) => x.datum === r.datum).length;
        html += `<tr class="day-row"><td colspan="7">${TAGE[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]} ${d.getFullYear()}${r.datum === today() ? ' · heute' : ''}<small>${count} ${count === 1 ? 'Termin' : 'Termine'}</small></td></tr>`;
      }
      const tel = r.telefon.replace(/[^\d+]/g, '');
      html += `<tr class="${r.status === 'storniert' ? 'is-cancelled' : ''}">
        <td class="time">${esc(r.uhrzeit)}<div class="muted">bis ${endTime(r)}</div></td>
        <td><strong>${esc(r.name)}</strong><div class="muted"><a href="tel:${esc(tel)}">${esc(r.telefon)}</a></div>${r.email ? `<div class="muted"><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></div>` : ''}</td>
        <td>${esc(r.leistungName)}<div class="muted">${esc(r.preis)} · ${r.dauer} Min. · ${esc(r.id)}</div></td>
        <td>${esc(stylistName(r.stylist))}${r.wunschStylist === 'egal' ? '<div class="muted">zugeteilt</div>' : ''}</td>
        <td class="note">${esc(r.notiz) || '<span class="muted">—</span>'}</td>
        <td><select class="status" data-id="${esc(r.id)}" data-v="${esc(r.status)}" aria-label="Status für ${esc(r.name)}">${STATUS.map((s) => `<option value="${s}" ${s === r.status ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select></td>
        <td><button class="icon-btn" data-del="${esc(r.id)}" title="Löschen" aria-label="Reservierung von ${esc(r.name)} löschen"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5"/></svg></button></td>
      </tr>`;
    }
    rows.innerHTML = html;
  }

  // ---------- Aktionen ----------
  $('#rows').addEventListener('change', async (e) => {
    const sel = e.target.closest('select.status');
    if (!sel) return;
    const r = all.find((x) => x.id === sel.dataset.id);
    const prev = r.status;
    r.status = sel.value;
    render();
    try {
      await Store.setStatus(pin, r.id, r.status);
      toast(`Status: ${r.status}`);
    } catch {
      r.status = prev;
      render();
      toast('Speichern fehlgeschlagen');
    }
  });

  $('#rows').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-del]');
    if (!b) return;
    const r = all.find((x) => x.id === b.dataset.del);
    // Zweistufig bestätigen: erster Klick fragt nach, zweiter löscht
    if (!b.classList.contains('is-armed')) {
      b.classList.add('is-armed');
      b.textContent = 'Wirklich löschen?';
      setTimeout(() => render(), 4000);
      return;
    }
    try {
      await Store.remove(pin, r.id);
      all = all.filter((x) => x !== r);
      render();
      toast('Reservierung gelöscht');
    } catch {
      toast('Löschen fehlgeschlagen');
    }
  });

  ['#f-range', '#f-stylist', '#f-status', '#f-date'].forEach((s) => $(s).addEventListener('change', render));
  $('#f-search').addEventListener('input', render);
  $('#f-range').addEventListener('change', () => {
    const isDate = $('#f-range').value === 'datum';
    $('#f-date-wrap').hidden = !isDate;
    if (isDate && !$('#f-date').value) $('#f-date').value = today();
    render();
  });
  $('#f-stylist').innerHTML += S.team.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join('');

  $('#export') && $('#export').addEventListener('click', () => {
    const cols = ['id', 'datum', 'uhrzeit', 'dauer', 'name', 'telefon', 'email', 'leistungName', 'preis', 'stylist', 'status', 'notiz', 'erstellt'];
    const cell = (v) => {
      let s = String(v == null ? '' : v);
      if (/^[=+\-@]/.test(s)) s = "'" + s; // Formel-Injection in Excel verhindern
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const lines = [cols.join(';')].concat(filtered().map((r) => cols.map((c) => cell(c === 'stylist' ? stylistName(r[c]) : r[c])).join(';')));
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `reservierungen-${today()}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  // Automatisch anmelden, wenn PIN in dieser Sitzung schon eingegeben wurde
  let saved = '';
  try {
    saved = sessionStorage.getItem(PIN_KEY) || '';
  } catch {}
  if (saved) tryLogin(saved, true);
})();
