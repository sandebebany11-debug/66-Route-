/*
 * Terminlogik (freie Zeiten, Überschneidungen) – identisch auf Website und Server.
 */
(function (root) {
  function toMin(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  function toHHMM(min) {
    return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
  }

  function parseDate(dateStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || '')) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    return date;
  }

  function isoDate(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  function hoursFor(salon, dateStr) {
    const date = parseDate(dateStr);
    if (!date) return null;
    const h = salon.oeffnungszeiten[date.getDay()];
    return h ? { open: toMin(h[0]), close: toMin(h[1]) } : null;
  }

  function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
  }

  function stylistFree(reservations, stylistId, dateStr, start, end) {
    return !reservations.some(
      (r) =>
        r.status !== 'storniert' &&
        r.datum === dateStr &&
        r.stylist === stylistId &&
        overlaps(start, end, toMin(r.uhrzeit), toMin(r.uhrzeit) + r.dauer)
    );
  }

  /** Liefert alle Startzeiten mit den jeweils freien Stylist:innen. */
  function freeSlots(salon, reservations, dateStr, serviceId, stylistId, now) {
    const hours = hoursFor(salon, dateStr);
    const service = salon.leistungen.find((l) => l.id === serviceId);
    if (!hours || !service) return [];

    const current = now || new Date();
    const today = isoDate(current);
    if (dateStr < today) return [];
    const lastDay = new Date(current.getFullYear(), current.getMonth(), current.getDate() + salon.vorlaufTage);
    if (dateStr > isoDate(lastDay)) return [];
    // Heute: frühestens eine Stunde ab jetzt
    const earliest = dateStr === today ? current.getHours() * 60 + current.getMinutes() + 60 : 0;

    const candidates = stylistId && stylistId !== 'egal' ? [stylistId] : salon.team.map((t) => t.id);
    const slots = [];
    for (let start = hours.open; start + service.dauer <= hours.close; start += salon.slotMinuten) {
      if (start < earliest) continue;
      const free = candidates.filter((id) => stylistFree(reservations, id, dateStr, start, start + service.dauer));
      if (free.length) slots.push({ uhrzeit: toHHMM(start), frei: free });
    }
    return slots;
  }

  /** Prüft eine Buchungsanfrage. Gibt { error } oder { reservation } zurück. */
  function buildReservation(salon, reservations, input, now) {
    const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
    const data = {
      leistung: clean(input.leistung, 60),
      stylist: clean(input.stylist, 60) || 'egal',
      datum: clean(input.datum, 10),
      uhrzeit: clean(input.uhrzeit, 5),
      name: clean(input.name, 80),
      telefon: clean(input.telefon, 40),
      email: clean(input.email, 120),
      notiz: clean(input.notiz, 500),
    };
    const service = salon.leistungen.find((l) => l.id === data.leistung);
    if (!service) return { error: 'Bitte eine Leistung wählen.' };
    if (data.stylist !== 'egal' && !salon.team.some((t) => t.id === data.stylist)) return { error: 'Unbekannte Stylistin / unbekannter Stylist.' };
    if (!parseDate(data.datum)) return { error: 'Bitte ein gültiges Datum wählen.' };
    if (data.name.length < 2) return { error: 'Bitte Ihren Namen angeben.' };
    if (!/^[+\d][\d\s/()-]{5,}$/.test(data.telefon)) return { error: 'Bitte eine gültige Telefonnummer angeben.' };
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: 'Die E-Mail-Adresse ist ungültig.' };

    const slot = freeSlots(salon, reservations, data.datum, data.leistung, data.stylist, now).find((s) => s.uhrzeit === data.uhrzeit);
    if (!slot) return { error: 'Diese Uhrzeit ist leider nicht mehr frei. Bitte eine andere wählen.' };

    return {
      reservation: {
        id: 'R' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase(),
        leistung: service.id,
        leistungName: service.name,
        preis: service.preis,
        dauer: service.dauer,
        stylist: slot.frei[0],
        wunschStylist: data.stylist,
        datum: data.datum,
        uhrzeit: data.uhrzeit,
        name: data.name,
        telefon: data.telefon,
        email: data.email,
        notiz: data.notiz,
        status: 'offen',
        erstellt: new Date().toISOString(),
      },
    };
  }

  const api = { toMin, toHHMM, parseDate, isoDate, hoursFor, freeSlots, buildReservation };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BookingCore = api;
})(typeof self !== 'undefined' ? self : this);
