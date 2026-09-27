/* ANGUS · Steakhouse Leverkusen — interactions (vanilla JS, no dependencies) */
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

  /* ---------- Intro sequence ---------- */
  const heroEl = document.querySelector(".hero");
  const phoneIntro = !reduced && matchMedia("(max-width: 900px)").matches && scrollY < 40;
  const endIntro = () => { heroEl.classList.remove("hero-intro"); body.classList.remove("hero-intro-active"); };
  if (phoneIntro) body.classList.add("hero-intro-active"); else endIntro();
  const start = () => requestAnimationFrame(() => {
    body.classList.add("is-ready");
    body.classList.remove("is-loading");
    if (phoneIntro) {
      const t = setTimeout(endIntro, 1500);
      // any interaction skips straight to the full hero
      ["pointerdown", "wheel", "touchmove", "keydown"].forEach(ev =>
        addEventListener(ev, () => { clearTimeout(t); endIntro(); }, { once: true, passive: true }));
    }
  });
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 250))]).then(start);

  /* ---------- Image fallback: never show a broken image ---------- */
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

  // Stagger siblings in lists
  $$(".trust__grid, .exp__list").forEach(list =>
    $$(".reveal", list).forEach((el, i) => el.style.setProperty("--d", `${i * 0.09}s`)));

  /* ---------- Counters ---------- */
  const fmt = (v, dec) => v.toLocaleString("de-DE", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target;
      const from = parseFloat(el.dataset.count);
      const dec = +(el.dataset.decimals || 0);
      const suffix = el.dataset.suffix || "";
      const range = el.hasAttribute("data-range");
      const to = range ? parseFloat(el.dataset.to) : from;
      const startV = range ? from : 0;
      if (reduced) return;
      const dur = 1800, t0 = performance.now();
      const tick = now => {
        const k = clamp((now - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 4);
        const v = startV + (to - startV) * eased;
        el.textContent = range ? `${from}–${Math.round(v)}` : fmt(dec ? v : Math.round(v), dec) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(el => {
    if (!reduced) el.textContent = el.hasAttribute("data-range") ? `${el.dataset.count}–${el.dataset.count}` : "0";
    countIO.observe(el);
  });

  /* ---------- Menu tabs ---------- */
  const tabs = $$(".menu__tabs [role=tab]");
  const ink = $(".menu__ink");
  const lists = $$(".menu__list");
  const moveInk = btn => {
    ink.style.width = `${btn.offsetWidth}px`;
    ink.style.transform = `translateX(${btn.offsetLeft}px)`;
  };
  const showCat = (cat, instant) => {
    lists.forEach(l => {
      const on = l.dataset.cat === cat;
      if (!on) { l.hidden = true; l.classList.remove("is-in"); return; }
      l.hidden = false;
      $$("li", l).forEach((li, i) => li.style.setProperty("--i", i));
      if (instant) l.classList.add("is-in");
      else requestAnimationFrame(() => requestAnimationFrame(() => l.classList.add("is-in")));
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
    showCat("steaks");
  }, { threshold: 0.2 });
  menuIO.observe($(".menu__panel"));
  const syncInk = () => moveInk($(".menu__tabs [aria-selected=true]"));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(syncInk);
  addEventListener("resize", syncInk);

  /* ---------- Scroll-driven scenes ---------- */
  const hero = $(".hero");
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
  const progressOf = el => {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / (r.height - vh));
  };
  const setActive = i => {
    if (i === activeSlide) return;
    activeSlide = i;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
    showIdx.textContent = String(i + 1).padStart(2, "0");
  };

  const update = () => {
    ticking = false;
    const y = scrollY;

    // Laptop/desktop: while the hero film is on stage the bar stays transparent and the
    // hero shows the only logo; the bar (with its logo) takes over once the hero is left behind.
    const heroRect = hero.getBoundingClientRect();
    const inHero = desktop.matches && heroRect.bottom > vh * 1.02;
    nav.classList.toggle("is-scrolled", desktop.matches ? !inHero : y > 40);
    body.classList.toggle("hero-brand", inHero && !hero.classList.contains("is-swapped") && y < heroRect.height);

    // Hero: steak recedes, light lines appear, headline swaps
    if (!reduced) {
      const p = progressOf(hero);
      heroSticky.style.setProperty("--p", p.toFixed(4));
      heroScene.style.setProperty("--p", p.toFixed(4));
      hero.classList.toggle("is-swapped", p > 0.32);
      body.classList.toggle("hero-brand", desktop.matches && p < 0.32 && hero.getBoundingClientRect().bottom > vh * 1.02);
    }

    // Steak showcase: vertical scroll → horizontal travel (desktop)
    if (desktop.matches && !reduced) {
      const p = progressOf(show);
      const max = track.scrollWidth - vw;
      track.style.transform = `translate3d(${(-max * p).toFixed(1)}px,0,0)`;
      showBar.style.transform = `scaleX(${p})`;
      setActive(Math.min(slides.length - 1, Math.round(p * (slides.length - 1))));
    }

    // Food moment: slow zoom
    if (!reduced) {
      const r = moment.getBoundingClientRect();
      const z = clamp((vh - r.top) / (r.height + vh * 0.2));
      momentSticky.style.setProperty("--z", z.toFixed(4));
    }

    // Parallax images
    if (!reduced) {
      parallax.forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const c = (r.top + r.height / 2 - vh / 2) / vh;
        img.style.transform = `translate3d(0,${(c * parseFloat(img.dataset.parallax) * -100).toFixed(2)}px,0)`;
      });
    }

    // Mobile sticky CTA: after the hero, hidden at the final reservation block
    if (stickyCta) {
      const rr = reserveSec.getBoundingClientRect();
      const inReserve = rr.top < vh && rr.bottom > 0;
      const on = y > vh * 0.9 && !inReserve;
      stickyCta.classList.toggle("is-visible", on);
      stickyCta.setAttribute("aria-hidden", !on);
      $$("a", stickyCta).forEach(a => a.tabIndex = on ? 0 : -1);
    }
  };
  const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", () => {
    vh = innerHeight; vw = innerWidth;
    if (!desktop.matches) { track.style.transform = ""; }
    requestUpdate();
  });
  update();

  // Mobile showcase: native swipe → update counter + bar
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

  /* ---------- Hero film: sharp reel everywhere, blurred copy behind on desktop ---------- */
  {
    const bgVid = $(".hero__video--bg");
    const reelVid = $(".hero__video--reel");
    const ring = $(".hero__reel-ring");
    const soundBtn = $(".hero__sound");
    const saveData = navigator.connection && navigator.connection.saveData;
    const still = reduced || saveData;
    const onDesktop = () => desktop.matches;
    let heroVisible = true;

    const safePlay = v => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    const load = v => { if (v.preload !== "auto") { v.preload = "auto"; v.load(); } };
    const run = () => {
      if (still || !heroVisible) return;
      load(reelVid); safePlay(reelVid);
      if (onDesktop()) {
        load(bgVid);
        if (Math.abs(bgVid.currentTime - reelVid.currentTime) > 0.3) bgVid.currentTime = reelVid.currentTime;
        safePlay(bgVid);
      } else bgVid.pause(); // phones: one decoder only, the poster stays blurred behind
    };

    if (still) {
      soundBtn.hidden = true;
    } else {
      run();
      desktop.addEventListener("change", run);
      new IntersectionObserver(([e]) => {
        heroVisible = e.isIntersecting;
        if (heroVisible) run(); else { bgVid.pause(); reelVid.pause(); }
      }).observe(heroSticky);
    }

    const setSound = on => {
      reelVid.muted = !on; bgVid.muted = true;
      if (on) safePlay(reelVid);
      soundBtn.setAttribute("aria-pressed", on);
      soundBtn.setAttribute("aria-label", on ? "Ton ausschalten" : "Ton einschalten");
      $(".hero__sound-label", soundBtn).textContent = on ? "Ton aus" : "Ton an";
    };
    soundBtn.addEventListener("click", () => setSound(soundBtn.getAttribute("aria-pressed") !== "true"));

    // Loop progress ring on the reel
    if (!still && ring) {
      const tick = () => {
        if (heroVisible && reelVid.duration) ring.style.setProperty("--t", (reelVid.currentTime / reelVid.duration).toFixed(4));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------- Reservation form (same flow as Casa Ducale) ---------- */
  /* ==== EINSTELLUNGEN – nur diese Werte eintragen ====
     web3formsKey:   Zugangsschlüssel von https://web3forms.com (kostenlos). Reservierungen gehen an die
                     E-Mail-Adresse, mit der der Schlüssel erstellt wurde. Leer = Demo-Modus (nichts wird verschickt).
     whatsappNumber: WhatsApp-Nummer des Restaurants, international ohne + und Leerzeichen, z. B. '4917612345678'.
                     Leer = WhatsApp-Button bleibt ausgeblendet. */
  const RESERVATION_CONFIG = {
    web3formsKey: "",
    whatsappNumber: "",
    restaurantPhone: "0214 2029955",
    restaurantPhoneLink: "tel:+492142029955"
  };
  {
    const form = $("#reserveForm");
    const success = $("#formSuccess");
    const successText = $("#formSuccessText");
    const submitBtn = $("#reserveSubmit");
    const waBtn = $("#reserveWhatsApp");
    const errorBox = $("#reserveError");
    const f = form.elements;

    // no dates in the past
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
          "Hallo ANGUS, ich möchte gern einen Tisch reservieren:", "",
          `Name: ${d.name}`, `Datum: ${d.datum}`, `Uhrzeit: ${d.uhrzeit} Uhr`, `Personen: ${d.personen}`, `Telefon: ${d.telefon}`,
          d.anmerkungen ? `Anmerkungen: ${d.anmerkungen}` : ""
        ].filter(Boolean).join("\n");
        window.open(`https://wa.me/${RESERVATION_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
        showSuccess("Deine Nachricht ist in WhatsApp vorbereitet – einfach dort auf „Senden“ tippen. Wir bestätigen deinen Tisch so schnell wie möglich.");
      });
    }

    form.addEventListener("submit", async e => {
      e.preventDefault();
      errorBox.hidden = true;
      if (f.botcheck.checked) return; // spam bot
      if (!form.reportValidity()) return;

      if (!RESERVATION_CONFIG.web3formsKey) { // demo mode
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
            from_name: "ANGUS Website",
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
        showError(`Das Senden hat leider nicht geklappt. Bitte ruf uns kurz an: <a href="${RESERVATION_CONFIG.restaurantPhoneLink}">${RESERVATION_CONFIG.restaurantPhone}</a>`);
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

  /* ---------- Canvas: smoke + embers (paused when off-screen) ---------- */
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

  // Soft smoke — a handful of large blurred sprites drifting upward.
  const smokeSprite = (() => {
    const s = document.createElement("canvas"); s.width = s.height = 128;
    const g = s.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(235,220,200,.22)");
    grd.addColorStop(0.5, "rgba(210,190,165,.08)");
    grd.addColorStop(1, "rgba(200,180,160,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    return s;
  })();
  $$("canvas.smoke").forEach(c => {
    if (reduced) return;
    const ctx = c.getContext("2d");
    const scale = 0.5;
    const N = lowPower ? 10 : 22;
    let parts = [];
    const reset = (p, init) => {
      p.x = c.width * (0.25 + Math.random() * 0.6);
      p.y = init ? Math.random() * c.height : c.height * (0.75 + Math.random() * 0.3);
      p.s = c.width * (0.12 + Math.random() * 0.2);
      p.vx = (Math.random() - 0.5) * 0.15;
      p.vy = -(0.15 + Math.random() * 0.35);
      p.a = 0; p.life = 0; p.max = 500 + Math.random() * 500;
      p.rot = Math.random() * Math.PI; p.vr = (Math.random() - 0.5) * 0.002;
      return p;
    };
    const init = () => { fitCanvas(c, scale); parts = Array.from({ length: N }, () => reset({}, true)); };
    init(); addEventListener("resize", init);
    runWhenVisible(c, () => {
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach(p => {
        p.life++; p.x += p.vx + Math.sin(p.life / 90) * 0.12; p.y += p.vy; p.s += 0.06; p.rot += p.vr;
        const k = p.life / p.max;
        p.a = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
        if (p.life > p.max) reset(p);
        ctx.globalAlpha = clamp(p.a) * 0.9;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.drawImage(smokeSprite, -p.s / 2, -p.s / 2, p.s, p.s * 0.8);
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    });
  });

  // Glowing embers rising from the grill.
  const embers = $(".fire__embers");
  if (embers && !reduced) {
    const ctx = embers.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const N = lowPower ? 35 : 80;
    let parts = [];
    const reset = (p, init) => {
      p.x = Math.random() * embers.width;
      p.y = init ? Math.random() * embers.height : embers.height + 10;
      p.r = (0.6 + Math.random() * 1.8) * dpr;
      p.vy = -(0.4 + Math.random() * 1.3) * dpr;
      p.vx = (Math.random() - 0.5) * 0.4 * dpr;
      p.w = Math.random() * Math.PI * 2;
      p.h = 18 + Math.random() * 28;
      return p;
    };
    const init = () => { fitCanvas(embers, dpr); parts = Array.from({ length: N }, () => reset({}, true)); };
    init(); addEventListener("resize", init);
    runWhenVisible(embers, () => {
      ctx.clearRect(0, 0, embers.width, embers.height);
      ctx.globalCompositeOperation = "lighter";
      parts.forEach(p => {
        p.w += 0.03; p.x += p.vx + Math.sin(p.w) * 0.35; p.y += p.vy;
        const life = clamp(p.y / embers.height);
        if (p.y < -10) reset(p);
        const flick = 0.6 + Math.sin(p.w * 3) * 0.4;
        ctx.globalAlpha = life * flick;
        ctx.fillStyle = `hsl(${p.h}, 100%, ${55 + flick * 15}%)`;
        ctx.shadowColor = "rgba(255,140,40,.9)";
        ctx.shadowBlur = 8 * dpr;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
    });
  }

  /* ---------- Misc ---------- */
  const yr = $(".js-year"); if (yr) yr.textContent = new Date().getFullYear();
})();
