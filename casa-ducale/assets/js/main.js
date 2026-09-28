/* Casa Ducale · Ristorante Leverkusen — interactions (vanilla JS, no dependencies) */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const body = document.body;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const desktop = matchMedia("(min-width: 901px)");
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 ||
    (navigator.connection && navigator.connection.saveData) || reduced;

  /* ---------- Intro sequence (phones: the food film owns the screen first) ---------- */
  const heroEl = $(".hero");
  const phoneIntro = !reduced && matchMedia("(max-width: 900px)").matches && scrollY < 40;
  const endIntro = () => { heroEl.classList.remove("hero-intro"); body.classList.remove("hero-intro-active"); };
  if (phoneIntro) body.classList.add("hero-intro-active"); else endIntro();
  const start = () => requestAnimationFrame(() => {
    body.classList.add("is-ready");
    body.classList.remove("is-loading");
    if (phoneIntro) {
      const t = setTimeout(endIntro, 1600);
      ["pointerdown", "wheel", "touchmove", "keydown"].forEach(ev =>
        addEventListener(ev, () => { clearTimeout(t); endIntro(); }, { once: true, passive: true }));
    }
  });
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 250))]).then(start);

  /* ---------- Image fallback ---------- */
  $$(".media img").forEach(img => {
    const fail = () => img.closest(".media").classList.add("is-fallback");
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
    img.addEventListener("error", fail, { once: true });
  });

  /* ---------- Navigation ---------- */
  const nav = $("#nav");
  const burger = $(".nav__burger");
  const mmenu = $("#site-menu");
  const setMenu = open => {
    body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    mmenu.setAttribute("aria-hidden", !open);
  };
  burger.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  $$("a", mmenu).forEach(a => a.addEventListener("click", () => setMenu(false)));
  $$(".js-reserve").forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      revealIO.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
  $$(".reveal, .reveal-img").forEach(el => revealIO.observe(el));
  $$(".trust__grid, .exp__list, .service__row").forEach(list =>
    $$(".reveal", list).forEach((el, i) => el.style.setProperty("--d", `${i * 0.09}s`)));

  /* ---------- Counters ---------- */
  const fmt = (v, dec) => v.toLocaleString("de-DE", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target;
      const to = parseFloat(el.dataset.count);
      const dec = +(el.dataset.decimals || 0);
      const suffix = el.dataset.suffix || "";
      if (reduced) return;
      const dur = 1800, t0 = performance.now();
      const tick = now => {
        const k = clamp((now - t0) / dur);
        const v = to * (1 - Math.pow(1 - k, 4));
        el.textContent = fmt(dec ? v : Math.round(v), dec) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(el => {
    if (!reduced) el.textContent = "0";
    countIO.observe(el);
  });

  /* ---------- Opening hours: live status + today's row ---------- */
  {
    // Mo–Sa 08:30–22:00, So 09:30–22:00 (Europe/Berlin)
    const HOURS = { 0: ["09:30", "22:00"], 1: ["08:30", "22:00"], 2: ["08:30", "22:00"], 3: ["08:30", "22:00"], 4: ["08:30", "22:00"], 5: ["08:30", "22:00"], 6: ["08:30", "22:00"] };
    const DAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const toMin = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
    const now = (() => {
      try {
        const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
        const get = t => (parts.find(p => p.type === t) || {}).value;
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
        return { day, min: (+get("hour") % 24) * 60 + +get("minute") };
      } catch (_) { const d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
    })();
    const [o, c] = HOURS[now.day];
    const isOpen = now.min >= toMin(o) && now.min < toMin(c);
    let text;
    if (isOpen) text = `Jetzt geöffnet · bis ${c} Uhr`;
    else if (now.min < toMin(o)) text = `Geschlossen · öffnet heute um ${o} Uhr`;
    else { const nd = (now.day + 1) % 7; text = `Geschlossen · öffnet ${DAYS[nd]} um ${HOURS[nd][0]} Uhr`; }
    $$(".js-open-status").forEach(el => { el.classList.toggle("is-closed", !isOpen); $("span", el).textContent = text; });
    const row = $(`#hoursTable tr[data-day="${now.day}"]`); if (row) row.classList.add("is-today");
  }

  /* ---------- Menu tabs ---------- */
  const tabs = $$(".menu__tabs [role=tab]");
  const ink = $(".menu__ink");
  const lists = $$(".menu__list");
  const moveInk = btn => { ink.style.width = `${btn.offsetWidth}px`; ink.style.transform = `translateX(${btn.offsetLeft}px)`; };
  const showCat = cat => {
    lists.forEach(l => {
      const on = l.dataset.cat === cat;
      if (!on) { l.hidden = true; l.classList.remove("is-in"); return; }
      l.hidden = false;
      $$("li", l).forEach((li, i) => li.style.setProperty("--i", i));
      requestAnimationFrame(() => requestAnimationFrame(() => l.classList.add("is-in")));
    });
  };
  tabs.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.setAttribute("aria-selected", b === btn));
      moveInk(btn);
      btn.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest", inline: "center" });
      showCat(btn.dataset.cat);
    });
    btn.addEventListener("keydown", e => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      const next = tabs[(idx + dir + tabs.length) % tabs.length];
      next.focus(); next.click();
    });
  });
  const menuIO = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    menuIO.disconnect();
    showCat("vorspeisen");
  }, { threshold: 0.2 });
  menuIO.observe($(".menu__panel"));
  const syncInk = () => moveInk($(".menu__tabs [aria-selected=true]"));
  fontsReady.then(syncInk);
  addEventListener("resize", syncInk);

  /* ---------- Scroll-driven scenes ---------- */
  const hero = heroEl;
  const heroSticky = $(".hero__sticky");
  const heroScene = $(".hero__scene");
  const show = $(".show");
  const track = $(".show__track");
  const slides = $$(".slide");
  const showIdx = $(".js-show-idx");
  const showBar = $(".js-show-bar");
  const moment = $(".moment");
  const momentSticky = $(".moment__sticky");
  const parallax = $$("[data-parallax]");
  const stickyCta = $(".sticky-cta");
  const reserveSec = $("#reservierung");

  let vh = innerHeight, vw = innerWidth, ticking = false, activeSlide = -1;
  const progressOf = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - vh)); };
  const setActive = i => {
    if (i === activeSlide) return;
    activeSlide = i;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
    showIdx.textContent = String(i + 1).padStart(2, "0");
  };

  const update = () => {
    ticking = false;
    const y = scrollY;
    const heroRect = hero.getBoundingClientRect();
    const inHero = desktop.matches && heroRect.bottom > vh * 1.02;
    nav.classList.toggle("is-scrolled", desktop.matches ? !inHero : y > 40);

    if (!reduced) {
      const p = progressOf(hero);
      heroSticky.style.setProperty("--p", p.toFixed(4));
      heroScene.style.setProperty("--p", p.toFixed(4));
      hero.classList.toggle("is-swapped", p > 0.32);
      body.classList.toggle("hero-brand", inHero && p < 0.32);
    } else body.classList.toggle("hero-brand", inHero);

    if (desktop.matches && !reduced) {
      const p = progressOf(show);
      const max = track.scrollWidth - vw;
      track.style.transform = `translate3d(${(-max * p).toFixed(1)}px,0,0)`;
      showBar.style.transform = `scaleX(${p})`;
      setActive(Math.min(slides.length - 1, Math.round(p * (slides.length - 1))));
    }

    if (!reduced) {
      const r = moment.getBoundingClientRect();
      momentSticky.style.setProperty("--z", clamp((vh - r.top) / (r.height + vh * 0.2)).toFixed(4));
      parallax.forEach(img => {
        const pr = img.parentElement.getBoundingClientRect();
        if (pr.bottom < -100 || pr.top > vh + 100) return;
        const c = (pr.top + pr.height / 2 - vh / 2) / vh;
        img.style.transform = `translate3d(0,${(c * parseFloat(img.dataset.parallax) * -100).toFixed(2)}px,0)`;
      });
    }

    const rr = reserveSec.getBoundingClientRect();
    const on = y > vh * 0.9 && !(rr.top < vh && rr.bottom > 0);
    stickyCta.classList.toggle("is-visible", on);
    stickyCta.setAttribute("aria-hidden", !on);
    $$("a", stickyCta).forEach(a => a.tabIndex = on ? 0 : -1);
  };
  const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", () => {
    vh = innerHeight; vw = innerWidth;
    if (!desktop.matches) track.style.transform = "";
    requestUpdate();
  });
  update();

  track.addEventListener("scroll", () => {
    if (desktop.matches && !reduced) return;
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    showBar.style.transform = `scaleX(${Math.max(p, 1 / slides.length)})`;
    setActive(Math.round(p * (slides.length - 1)));
  }, { passive: true });
  if (!desktop.matches || reduced) { setActive(0); showBar.style.transform = `scaleX(${1 / slides.length})`; }

  /* ---------- Subtle 3D depth in hero (mouse) ---------- */
  if (finePointer && !reduced) {
    const layers = $$("[data-depth]", heroScene);
    const reelEl = $(".hero__reel");
    let mx = 0, my = 0, cx = 0, cy = 0, raf = null;
    const loop = () => {
      cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06;
      layers.forEach(l => {
        const d = parseFloat(l.dataset.depth);
        l.style.transform = `translate3d(${(cx * d * 14).toFixed(2)}px,${(cy * d * 10).toFixed(2)}px,0)`;
      });
      reelEl.style.setProperty("--mx", cx.toFixed(3));
      reelEl.style.setProperty("--my", cy.toFixed(3));
      raf = Math.abs(mx - cx) + Math.abs(my - cy) > 0.001 ? requestAnimationFrame(loop) : null;
    };
    heroSticky.addEventListener("pointermove", e => {
      mx = e.clientX / vw - 0.5; my = e.clientY / vh - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    layers.forEach(l => (l.style.transition = "none"));
  }

  /* ---------- Hero photo film: crossfading dishes, ring shows time to the next one ---------- */
  {
    const bg = $$(".hero__slides--bg img");
    const reel = $$(".hero__slides--reel img");
    const cap = $(".js-reel-cap");
    const ring = $(".hero__reel-ring");
    const CAPS = ["Hausgemachte Lasagne", "Grillplatte", "Antipasti", "Pasta vom Buffet"];
    const STEP = 4200;
    let i = 0, t0 = performance.now(), visible = true;
    const show = n => {
      [bg, reel].forEach(set => set.forEach((img, k) => {
        if (k === n) { img.classList.remove("is-on"); void img.offsetWidth; img.classList.add("is-on"); }
        else img.classList.remove("is-on");
      }));
      if (cap) cap.textContent = CAPS[n] || "";
    };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; t0 = performance.now(); }).observe(heroSticky);
    if (!reduced) {
      const tick = now => {
        if (visible) {
          const k = (now - t0) / STEP;
          if (k >= 1) { i = (i + 1) % reel.length; show(i); t0 = now; }
          if (ring) ring.style.setProperty("--t", clamp(k).toFixed(4));
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------- Reservation form ---------- */
  /* ==== EINSTELLUNGEN – nur diese Werte eintragen ====
     web3formsKey:   Zugangsschlüssel von https://web3forms.com (kostenlos). Reservierungen gehen an die
                     E-Mail-Adresse, mit der der Schlüssel erstellt wurde. Leer = Demo-Modus (nichts wird verschickt).
     whatsappNumber: WhatsApp-Nummer des Restaurants, international ohne + und Leerzeichen, z. B. '4917612345678'.
                     Leer = WhatsApp-Button bleibt ausgeblendet. */
  const RESERVATION_CONFIG = {
    web3formsKey: "",
    whatsappNumber: "",
    restaurantPhone: "0214 43444",
    restaurantPhoneLink: "tel:+4921443444"
  };
  {
    const form = $("#reserveForm");
    const success = $("#formSuccess");
    const successText = $("#formSuccessText");
    const submitBtn = $("#reserveSubmit");
    const waBtn = $("#reserveWhatsApp");
    const errorBox = $("#reserveError");
    const f = form.elements;

    const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    f.datum.min = today.toISOString().slice(0, 10);

    const readForm = () => ({
      name: f.name.value.trim(), telefon: f.telefon.value.trim(), email: f.email.value.trim(),
      datum: f.datum.value ? new Date(f.datum.value + "T00:00").toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }) : "",
      uhrzeit: f.uhrzeit.value, personen: (form.querySelector("input[name=personen]:checked") || {}).value || "",
      anmerkungen: f.anmerkungen.value.trim()
    });
    const showError = html => { errorBox.innerHTML = html; errorBox.hidden = false; };
    const showSuccess = text => {
      if (text) successText.textContent = text;
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
      success.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    };

    if (RESERVATION_CONFIG.whatsappNumber) {
      waBtn.hidden = false;
      waBtn.addEventListener("click", () => {
        if (!form.reportValidity()) return;
        const d = readForm();
        const text = [
          "Hallo Casa Ducale, ich möchte gern einen Tisch reservieren:", "",
          `Name: ${d.name}`, `Datum: ${d.datum}`, `Uhrzeit: ${d.uhrzeit} Uhr`, `Personen: ${d.personen}`, `Telefon: ${d.telefon}`,
          d.anmerkungen ? `Anmerkungen: ${d.anmerkungen}` : ""
        ].filter(Boolean).join("\n");
        window.open(`https://wa.me/${RESERVATION_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
        showSuccess("Ihre Nachricht ist in WhatsApp vorbereitet – einfach dort auf „Senden“ tippen. Wir bestätigen Ihren Tisch so schnell wie möglich.");
      });
    }

    form.addEventListener("submit", async e => {
      e.preventDefault();
      errorBox.hidden = true;
      if (f.botcheck.checked) return;
      if (!form.reportValidity()) return;

      if (!RESERVATION_CONFIG.web3formsKey) {
        console.warn("Reservierung: kein Web3Forms-Schlüssel eingetragen – Demo-Modus, es wurde nichts verschickt.");
        showSuccess();
        return;
      }

      const d = readForm();
      const label = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = "Wird gesendet …";
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: RESERVATION_CONFIG.web3formsKey,
            subject: `Neue Tischreservierung: ${d.personen}, ${d.datum}, ${d.uhrzeit} Uhr`,
            from_name: "Casa Ducale Website",
            replyto: d.email || undefined,
            Name: d.name, Telefon: d.telefon, "E-Mail": d.email || "–",
            Datum: d.datum, Uhrzeit: d.uhrzeit + " Uhr", Personen: d.personen,
            Anmerkungen: d.anmerkungen || "–"
          })
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.message || res.status);
        showSuccess();
      } catch (err) {
        console.error("Reservierung fehlgeschlagen:", err);
        showError(`Das Senden hat leider nicht geklappt. Bitte rufen Sie uns kurz an: <a href="${RESERVATION_CONFIG.restaurantPhoneLink}">${RESERVATION_CONFIG.restaurantPhone}</a>`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = label;
      }
    });
  }

  /* ---------- Custom cursor (desktop) ---------- */
  if (finePointer && !reduced && !lowPower) {
    body.classList.add("has-cursor");
    const cur = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring");
    let x = -100, y = -100, rx = -100, ry = -100;
    addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; }, { passive: true });
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener("pointerover", e => {
      cur.classList.toggle("is-hover", !!e.target.closest("a, button, [role=tab], .g"));
    });
  }

  /* ---------- Canvas: steam + warm sparks (paused when off-screen) ---------- */
  const runWhenVisible = (canvas, draw) => {
    let on = false, raf = 0;
    const frame = t => { if (!on) return; draw(t); raf = requestAnimationFrame(frame); };
    new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(frame);
    }).observe(canvas);
  };
  const fitCanvas = (c, scale) => {
    const r = c.getBoundingClientRect();
    c.width = Math.max(1, Math.round(r.width * scale));
    c.height = Math.max(1, Math.round(r.height * scale));
  };
  const smokeSprite = (() => {
    const s = document.createElement("canvas"); s.width = s.height = 128;
    const g = s.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(245,232,215,.22)");
    grd.addColorStop(0.5, "rgba(220,200,175,.08)");
    grd.addColorStop(1, "rgba(210,190,170,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    return s;
  })();
  $$("canvas.smoke").forEach(c => {
    if (reduced) return;
    const ctx = c.getContext("2d");
    const N = lowPower ? 10 : 22;
    let parts = [];
    const reset = (p, init) => {
      p.x = c.width * (0.25 + Math.random() * 0.6);
      p.y = init ? Math.random() * c.height : c.height * (0.75 + Math.random() * 0.3);
      p.s = c.width * (0.12 + Math.random() * 0.2);
      p.vx = (Math.random() - 0.5) * 0.15; p.vy = -(0.15 + Math.random() * 0.35);
      p.life = 0; p.max = 500 + Math.random() * 500;
      p.rot = Math.random() * Math.PI; p.vr = (Math.random() - 0.5) * 0.002;
      return p;
    };
    const init = () => { fitCanvas(c, 0.5); parts = Array.from({ length: N }, () => reset({}, true)); };
    init(); addEventListener("resize", init);
    runWhenVisible(c, () => {
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach(p => {
        p.life++; p.x += p.vx + Math.sin(p.life / 90) * 0.12; p.y += p.vy; p.s += 0.06; p.rot += p.vr;
        const k = p.life / p.max;
        const a = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
        if (p.life > p.max) reset(p);
        ctx.globalAlpha = clamp(a) * 0.9;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.drawImage(smokeSprite, -p.s / 2, -p.s / 2, p.s, p.s * 0.8);
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    });
  });

  const embers = $(".fire__embers");
  if (embers && !reduced) {
    const ctx = embers.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const N = lowPower ? 25 : 55;
    let parts = [];
    const reset = (p, init) => {
      p.x = Math.random() * embers.width;
      p.y = init ? Math.random() * embers.height : embers.height + 10;
      p.r = (0.6 + Math.random() * 1.6) * dpr;
      p.vy = -(0.3 + Math.random() * 1.0) * dpr;
      p.vx = (Math.random() - 0.5) * 0.4 * dpr;
      p.w = Math.random() * Math.PI * 2;
      p.h = 20 + Math.random() * 22;
      return p;
    };
    const init = () => { fitCanvas(embers, dpr); parts = Array.from({ length: N }, () => reset({}, true)); };
    init(); addEventListener("resize", init);
    runWhenVisible(embers, () => {
      ctx.clearRect(0, 0, embers.width, embers.height);
      ctx.globalCompositeOperation = "lighter";
      parts.forEach(p => {
        p.w += 0.03; p.x += p.vx + Math.sin(p.w) * 0.35; p.y += p.vy;
        if (p.y < -10) reset(p);
        const flick = 0.6 + Math.sin(p.w * 3) * 0.4;
        ctx.globalAlpha = clamp(p.y / embers.height) * flick;
        ctx.fillStyle = `hsl(${p.h}, 95%, ${55 + flick * 15}%)`;
        ctx.shadowColor = "rgba(240,140,70,.9)";
        ctx.shadowBlur = 8 * dpr;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
    });
  }

  const yr = $(".js-year"); if (yr) yr.textContent = new Date().getFullYear();
})();
