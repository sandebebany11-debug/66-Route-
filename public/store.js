/*
 * Datenzugriff für Website und Reservierungsliste.
 * Nutzt die Server-API; ist kein Server erreichbar (z. B. reines Static-Hosting),
 * wird im Browser (localStorage) gespeichert – dann nur als Demo geeignet.
 */
(function (root) {
  const KEY = 'artofhair.reservierungen';
  let mode = null; // 'server' | 'lokal'

  function localAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }
  function localSave(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* Speicher nicht verfügbar */
    }
  }

  async function request(method, url, body, pin) {
    const headers = { 'Content-Type': 'application/json' };
    if (pin) headers['X-Admin-Pin'] = pin;
    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || 'Anfrage fehlgeschlagen');
      err.status = res.status;
      throw err;
    }
    return data;
  }

  async function detect() {
    if (mode) return mode;
    if (location.protocol === 'file:') return (mode = 'lokal');
    try {
      const res = await fetch('/api/verfuegbarkeit?datum=2000-01-01&leistung=x', { cache: 'no-store' });
      const type = res.headers.get('content-type') || '';
      mode = res.ok && type.includes('json') ? 'server' : 'lokal';
    } catch {
      mode = 'lokal';
    }
    return mode;
  }

  const Store = {
    mode: () => mode,
    detect,

    async slots(datum, leistung, stylist) {
      if ((await detect()) === 'server') {
        const q = new URLSearchParams({ datum, leistung, stylist });
        return (await request('GET', '/api/verfuegbarkeit?' + q)).slots;
      }
      return BookingCore.freeSlots(SALON, localAll(), datum, leistung, stylist).map((s) => s.uhrzeit);
    },

    async create(input) {
      if ((await detect()) === 'server') return (await request('POST', '/api/reservierungen', input)).reservation;
      const list = localAll();
      const result = BookingCore.buildReservation(SALON, list, input);
      if (result.error) throw new Error(result.error);
      list.push(result.reservation);
      localSave(list);
      return result.reservation;
    },

    async checkPin(pin) {
      if ((await detect()) === 'server') {
        await request('GET', '/api/admin/check', null, pin);
        return true;
      }
      return pin === '1234';
    },

    async list(pin) {
      if ((await detect()) === 'server') return (await request('GET', '/api/reservierungen', null, pin)).reservations;
      return localAll();
    },

    async setStatus(pin, id, status) {
      if ((await detect()) === 'server') return request('PATCH', '/api/reservierungen/' + encodeURIComponent(id), { status }, pin);
      const list = localAll();
      const r = list.find((x) => x.id === id);
      if (r) r.status = status;
      localSave(list);
    },

    async remove(pin, id) {
      if ((await detect()) === 'server') return request('DELETE', '/api/reservierungen/' + encodeURIComponent(id), null, pin);
      localSave(localAll().filter((x) => x.id !== id));
    },
  };

  root.Store = Store;
})(self);
