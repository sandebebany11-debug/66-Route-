/*
 * Art of Hair – kleiner Webserver ohne externe Abhängigkeiten.
 * Start:  ADMIN_PIN=geheim PORT=3000 node server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SALON = require('./public/config.js');
const Core = require('./public/booking-core.js');

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'reservations.json');
const STATUSES = ['offen', 'bestätigt', 'erledigt', 'storniert'];

if (!process.env.ADMIN_PIN) {
  console.warn('⚠  ADMIN_PIN ist nicht gesetzt – Standard-PIN "1234" aktiv. Bitte vor dem Livegang ändern!');
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

// ---------- Datenspeicher ----------
function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

let reservations = load();
let writing = Promise.resolve();

function persist() {
  const snapshot = JSON.stringify(reservations, null, 2);
  writing = writing.then(async () => {
    await fs.promises.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const tmp = DATA_FILE + '.tmp';
    await fs.promises.writeFile(tmp, snapshot);
    await fs.promises.rename(tmp, DATA_FILE);
  });
  return writing;
}

// ---------- Helfer ----------
function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > 20000) {
        reject(new Error('zu groß'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(new Error('ungültiges JSON'));
      }
    });
    req.on('error', reject);
  });
}

function isAdmin(req) {
  const given = Buffer.from(String(req.headers['x-admin-pin'] || ''));
  const expected = Buffer.from(ADMIN_PIN);
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

function serveStatic(req, res, pathname) {
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/admin' || pathname === '/reservierungen') pathname = '/admin.html';
  const file = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!file.startsWith(PUBLIC_DIR)) return send(res, 403, { error: 'Verboten' });
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Seite nicht gefunden');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(data);
  });
}

// ---------- API ----------
async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean); // ['api', ...]

  if (req.method === 'GET' && parts[1] === 'verfuegbarkeit') {
    const q = url.searchParams;
    const slots = Core.freeSlots(SALON, reservations, q.get('datum'), q.get('leistung'), q.get('stylist'));
    return send(res, 200, { slots: slots.map((s) => s.uhrzeit) });
  }

  if (parts[1] === 'reservierungen') {
    const id = parts[2];

    if (req.method === 'POST' && !id) {
      const body = await readBody(req);
      const result = Core.buildReservation(SALON, reservations, body);
      if (result.error) return send(res, 409, { error: result.error });
      reservations.push(result.reservation);
      await persist();
      console.log(`Neue Reservierung ${result.reservation.id}: ${result.reservation.datum} ${result.reservation.uhrzeit} – ${result.reservation.name}`);
      return send(res, 201, { reservation: result.reservation });
    }

    if (!isAdmin(req)) return send(res, 401, { error: 'PIN falsch' });

    if (req.method === 'GET' && !id) return send(res, 200, { reservations });

    const r = reservations.find((x) => x.id === id);
    if (!r) return send(res, 404, { error: 'Reservierung nicht gefunden' });

    if (req.method === 'PATCH') {
      const body = await readBody(req);
      if (!STATUSES.includes(body.status)) return send(res, 400, { error: 'Ungültiger Status' });
      r.status = body.status;
      await persist();
      return send(res, 200, { reservation: r });
    }

    if (req.method === 'DELETE') {
      reservations = reservations.filter((x) => x.id !== id);
      await persist();
      return send(res, 200, { ok: true });
    }
  }

  if (req.method === 'GET' && parts[1] === 'admin' && parts[2] === 'check') {
    return isAdmin(req) ? send(res, 200, { ok: true }) : send(res, 401, { error: 'PIN falsch' });
  }

  send(res, 404, { error: 'Unbekannte Anfrage' });
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (url.pathname.startsWith('/api/')) return await api(req, res, url);
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Methode nicht erlaubt' });
      serveStatic(req, res, decodeURIComponent(url.pathname));
    } catch (err) {
      send(res, 400, { error: err.message || 'Fehler' });
    }
  })
  .listen(PORT, () => {
    console.log(`Art of Hair läuft auf http://localhost:${PORT}`);
    console.log(`Reservierungsliste: http://localhost:${PORT}/admin`);
  });
