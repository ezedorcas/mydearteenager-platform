/* MyDearTeenager website script. No libraries. Every module checks for its own elements first. */
(() => {
  "use strict";

  /* ======================================================================
     SETTINGS: the only things you should need to change
     ====================================================================== */
  const MDT = {
    launched: false,                 // flip to true on launch day: "Join the waitlist" buttons become "Start learning"
    appUrl: "#app-url",              // PLACEHOLDER: the learner app's sign-up link
    loginUrl: "#app-login-url",      // PLACEHOLDER: the learner app's log-in link
    waitlistEndpoint: "",            // PLACEHOLDER: form backend for waitlist sign-ups (receives JSON POST)
    contactEndpoint: ""              // PLACEHOLDER: form backend for contact, teach, schools and suggestion forms
  };

  const root = document.documentElement;
  root.classList.add("js");
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const reduce = () => mqReduce.matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const css = name => getComputedStyle(root).getPropertyValue(name).trim();
  const quiet = p => p && p.catch(() => {});
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const io = (cb, opts) => ("IntersectionObserver" in window) ? new IntersectionObserver(cb, opts) : null;

  /* ---------- Launch switch ---------- */
  if (MDT.launched) {
    $$("[data-cta='join']").forEach(a => {
      a.href = MDT.appUrl;
      const label = a.querySelector(".label") || a;
      label.textContent = "Start learning";
    });
    $$("[data-cta='login']").forEach(a => { a.href = MDT.loginUrl; });
  }

  /* ---------- Split headlines into words ---------- */
  function splitWords(el) {
    let i = 0;
    const label = el.textContent.replace(/\s+/g, " ").trim();
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(t => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
            const s = document.createElement("span"); s.textContent = t; s.style.setProperty("--i", i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          const w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
          n.style.setProperty("--i", i++); n.setAttribute("aria-hidden", "true");
          n.replaceWith(w); w.appendChild(n);
        }
      });
    };
    walk(el);
    el.setAttribute("aria-label", label);
    el.classList.add("split");
  }
  const splitEls = $$("[data-split]");
  splitEls.forEach(splitWords);
  const splitObs = io(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("go"); splitObs.unobserve(e.target); } }), { threshold: .2 });
  splitEls.forEach(el => {
    if (!splitObs || el.getBoundingClientRect().top < innerHeight) el.classList.add("go");
    else splitObs.observe(el);
  });

  /* ---------- Reveal on scroll (only for things that start below the fold) ---------- */
  // A fully clipped element never counts as visible, so "write" reveals watch their parent instead.
  const watchers = new Map();
  const revealObs = !reduce() && io(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      (watchers.get(e.target) || []).forEach(el => el.classList.remove("pre"));
      watchers.delete(e.target); revealObs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  function armReveal(scope = document) {
    $$("[data-reveal]", scope).forEach(el => {
      if (revealObs && el.getBoundingClientRect().top > innerHeight * 0.9) {
        el.classList.add("pre");
        const target = el.dataset.reveal === "write" ? el.parentElement : el;
        if (!watchers.has(target)) { watchers.set(target, []); revealObs.observe(target); }
        watchers.get(target).push(el);
      } else el.classList.remove("pre");
    });
  }
  armReveal();

  /* ---------- Words that ink in as you read ---------- */
  $$(".inked").forEach(p => {
    p.innerHTML = p.textContent.split(/(\s+)/).map(t => /\s+/.test(t) ? t : `<span class="wd">${esc(t)}</span>`).join("");
  });

  /* ---------- Count tween + bump ---------- */
  function tween(el, to, ms = 600) {
    const from = +el.textContent || 0;
    if (reduce() || from === to) { el.textContent = to; return; }
    const t0 = performance.now();
    (function f(now) {
      const k = clamp((now - t0) / ms, 0, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }
  function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }

  /* ---------- Confetti (paper bits) ---------- */
  function confetti(x, y, count = 90, spread = 1) {
    if (reduce()) return;
    const c = document.createElement("canvas");
    c.id = "confetti"; document.body.appendChild(c);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    const ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
    const colors = [css("--accent"), css("--ink"), css("--wash"), css("--c-amber"), css("--c-mint")];
    const parts = Array.from({ length: count }, () => {
      const a = Math.random() * Math.PI * 2, s = (4 + Math.random() * 9) * spread;
      return { x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6 * spread, w: 6 + Math.random() * 7, h: 4 + Math.random() * 6,
        r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: colors[(Math.random() * colors.length) | 0], f: Math.random() * 6, life: 0 };
    });
    let last = performance.now();
    (function tick(now) {
      const dt = Math.min(2, (now - last) / 16.7); last = now;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      let alive = 0;
      for (const p of parts) {
        p.life += dt; p.vy += .32 * dt; p.vx *= .985; p.vy *= .985;
        p.x += (p.vx + Math.sin(p.f + p.life * .15) * .8) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        if (p.y < innerHeight + 30 && p.life < 220) alive++;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.cos(p.life * .2 + p.f));
        ctx.globalAlpha = clamp(1 - (p.life - 150) / 70, 0, 1);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      }
      if (alive) requestAnimationFrame(tick); else c.remove();
    })(last);
  }
  const burstFrom = (el, n, s) => { const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, n, s); };

  /* ---------- Menu sheet ---------- */
  const menuBtn = $("#menu-btn"), menu = $("#menu-sheet");
  if (menuBtn && menu) {
    const close = () => {
      if (menu.hidden) return;
      const done = () => { menu.hidden = true; document.body.classList.remove("locked"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); };
      if (reduce()) return done();
      quiet(menu.animate([{ clipPath: "inset(0 0 0 0 round 0)" }, { clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" }], { duration: 380, easing: "cubic-bezier(.5,0,.75,0)" }).finished.then(done));
    };
    menuBtn.addEventListener("click", () => {
      menu.hidden = false; menu.classList.remove("open"); void menu.offsetWidth; menu.classList.add("open");
      document.body.classList.add("locked"); menuBtn.setAttribute("aria-expanded", "true");
      $("a, button", menu).focus();
    });
    $$("[data-close-menu]", menu).forEach(b => b.addEventListener("click", close));
    $$(".menu-links a", menu).forEach(a => a.addEventListener("click", () => { menu.hidden = true; document.body.classList.remove("locked"); }));
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer) {
    $$(".magnetic").forEach(b => {
      b.addEventListener("pointermove", e => {
        if (reduce()) return;
        const r = b.getBoundingClientRect();
        b.classList.add("pulling");
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      b.addEventListener("pointerleave", () => { b.classList.remove("pulling"); b.style.transform = ""; });
    });
  }

  /* ---------- Hero collage: drag, throw and parallax ---------- */
  const collage = $("#collage");
  if (collage) {
    const hint = $("#drag-hint");
    const pieces = $$(".piece", collage).map(el => ({ el, depth: +el.dataset.depth || 1, dx: 0, dy: 0, vx: 0, vy: 0, tilt: 0, px: 0, py: 0, tpx: 0, tpy: 0, drag: false, lx: 0, ly: 0 }));
    let zTop = 5, loopOn = false;
    const apply = p => {
      const s = p.el.style;
      s.setProperty("--dx", p.dx.toFixed(1) + "px"); s.setProperty("--dy", p.dy.toFixed(1) + "px");
      s.setProperty("--px", p.px.toFixed(1) + "px"); s.setProperty("--py", p.py.toFixed(1) + "px");
      s.setProperty("--tilt", p.tilt.toFixed(2) + "deg");
    };
    const loop = () => {
      let busy = false;
      const box = collage.getBoundingClientRect();
      for (const p of pieces) {
        if (!p.drag) {
          p.dx += p.vx; p.dy += p.vy; p.vx *= .9; p.vy *= .9; p.tilt += (0 - p.tilt) * .12;
          const r = p.el.getBoundingClientRect(), slack = 70;
          if (r.left < box.left - slack) p.dx += (box.left - slack - r.left) * .15;
          if (r.right > box.right + slack) p.dx -= (r.right - box.right - slack) * .15;
          if (r.top < box.top - slack) p.dy += (box.top - slack - r.top) * .15;
          if (r.bottom > box.bottom + slack) p.dy -= (r.bottom - box.bottom - slack) * .15;
          if (Math.abs(p.vx) > .05 || Math.abs(p.vy) > .05 || Math.abs(p.tilt) > .05) busy = true;
        }
        p.px += (p.tpx - p.px) * .08; p.py += (p.tpy - p.py) * .08;
        if (Math.abs(p.tpx - p.px) > .1 || Math.abs(p.tpy - p.py) > .1) busy = true;
        apply(p);
      }
      if (busy || pieces.some(p => p.drag)) requestAnimationFrame(loop); else loopOn = false;
    };
    const kick = () => { if (!loopOn) { loopOn = true; requestAnimationFrame(loop); } };
    pieces.forEach(p => {
      p.el.addEventListener("pointerdown", e => {
        if (e.button !== 0) return;
        if (e.pointerType !== "mouse" && p.el.classList.contains("c-shot")) return;
        p.drag = true; p.lx = e.clientX; p.ly = e.clientY; p.vx = p.vy = 0;
        p.el.setPointerCapture(e.pointerId); p.el.classList.add("grabbing"); p.el.style.zIndex = ++zTop;
        if (hint) hint.classList.add("gone");
        kick();
      });
      p.el.addEventListener("pointermove", e => {
        if (!p.drag) return;
        const mx = e.clientX - p.lx, my = e.clientY - p.ly;
        p.dx += mx; p.dy += my; p.lx = e.clientX; p.ly = e.clientY; p.vx = mx; p.vy = my;
        p.tilt = clamp(p.tilt * .6 + mx * .9, -16, 16);
      });
      const end = () => { if (!p.drag) return; p.drag = false; p.el.classList.remove("grabbing"); p.vx = clamp(p.vx, -30, 30); p.vy = clamp(p.vy, -30, 30); kick(); };
      p.el.addEventListener("pointerup", end); p.el.addEventListener("pointercancel", end);
    });
    const hero = collage.closest("section");
    if (finePointer && hero) {
      hero.addEventListener("pointermove", e => {
        if (reduce()) return;
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
        pieces.forEach(p => { p.tpx = -nx * 26 * p.depth; p.tpy = -ny * 20 * p.depth; });
        kick();
      });
      hero.addEventListener("pointerleave", () => { pieces.forEach(p => { p.tpx = p.tpy = 0; }); kick(); });
    }
  }

  /* ---------- Gentle tilt for any [data-tilt] element ---------- */
  if (finePointer) {
    $$("[data-tilt]").forEach(el => {
      const zone = el.closest("[data-tilt-zone]") || el;
      zone.addEventListener("pointermove", e => {
        if (reduce()) return;
        const r = zone.getBoundingClientRect();
        el.style.transform = `perspective(1400px) rotateY(${((e.clientX - r.left) / r.width - .5) * 10}deg) rotateX(${-((e.clientY - r.top) / r.height - .5) * 8}deg)`;
      });
      zone.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Lesson demo ---------- */
  const wrapEl = $("#screen-wrap");
  if (wrapEl) {
    const screens = $$(".screen", wrapEl), stepItems = $$("#steps li"), bars = $$("#lesson-bar i");
    const xpEl = $("#xp"), streakEl = $("#streak");
    let cur = 0, xp = 0, nudgeTimer = null;
    const done = new Set();
    const setSteps = () => {
      stepItems.forEach((li, i) => {
        li.classList.toggle("is-current", i === cur);
        li.classList.toggle("is-done", done.has(i) && i !== cur);
        const b = $("button", li);
        if (i === cur) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      });
      bars.forEach((b, i) => b.classList.toggle("on", i <= cur));
    };
    const primaryOf = i => $(i === 0 ? "[data-next]" : i === 2 ? "#submit-project" : i === 3 ? ".show-btns .app-btn" : ".poster-opt", screens[i]);
    const armNudge = () => {
      clearTimeout(nudgeTimer); $$(".nudge", wrapEl).forEach(n => n.classList.remove("nudge"));
      if (reduce()) return;
      nudgeTimer = setTimeout(() => { const t = primaryOf(cur); if (t && cur !== 1) t.classList.add("nudge"); }, 3500);
    };
    const contrast = $("#contrast"), sample = $("#sample");
    const syncContrast = () => { const v = +contrast.value; sample.style.setProperty("--c", v + "%"); contrast.style.setProperty("--fill", v + "%"); };
    const go = i => {
      if (i === cur) return;
      const out = screens[cur], inn = screens[i], dir = i > cur ? 1 : -1;
      screens.forEach(s => { if (s !== out && s !== inn) { s.getAnimations().forEach(a => a.cancel()); s.hidden = true; } });
      for (let k = 0; k < i; k++) done.add(k);
      inn.hidden = false; cur = i;
      if (!reduce()) {
        quiet(out.animate([{ transform: "none", opacity: 1 }, { transform: `translateX(${-40 * dir}%) rotate(${-4 * dir}deg)`, opacity: 0 }], { duration: 420, easing: "cubic-bezier(.5,0,.75,0)" })
          .finished.then(() => { if (screens[cur] !== out) out.hidden = true; }));
        inn.animate([{ transform: `translateX(${60 * dir}%) rotate(${5 * dir}deg)`, opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 620, delay: 120, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
      } else out.hidden = true;
      setSteps(); armNudge();
      if (i === 3) celebrate();
      if (i === 0) { contrast.value = 12; syncContrast(); }
    };
    const flyXP = (fromEl, amount) => {
      const wr = wrapEl.getBoundingClientRect(), fr = fromEl.getBoundingClientRect(), tr = $("#pill-xp").getBoundingClientRect();
      const land = () => { xp += amount; tween(xpEl, xp); bump($("#pill-xp")); };
      if (reduce()) return land();
      const chip = document.createElement("span");
      chip.className = "xp-fly"; chip.textContent = `+${amount} XP`; wrapEl.appendChild(chip);
      const sx = fr.left + fr.width / 2 - wr.left - 30, sy = fr.top + fr.height / 2 - wr.top - 12;
      quiet(chip.animate([
        { transform: `translate(${sx}px, ${sy}px) scale(.6)`, opacity: 0 },
        { transform: `translate(${sx}px, ${sy - 40}px) scale(1.15)`, opacity: 1, offset: .3 },
        { transform: `translate(${tr.left - wr.left}px, ${tr.top - wr.top}px) scale(.7)`, opacity: .9 }
      ], { duration: 900, easing: "cubic-bezier(.5,0,.3,1)" }).finished.then(() => { chip.remove(); land(); }));
    };
    contrast.addEventListener("input", () => { syncContrast(); armNudge(); });
    syncContrast();
    $("[data-next]", wrapEl).addEventListener("click", e => { if (cur !== 0) return; flyXP(e.currentTarget, 10); go(1); });

    const feedback = $("#feedback");
    const resetQuiz = () => { $$(".poster-opt").forEach(x => { delete x.dataset.locked; x.classList.remove("right", "wrong"); }); feedback.className = "feedback"; feedback.textContent = "Tap a poster."; };
    $$(".poster-opt").forEach(b => b.addEventListener("click", () => {
      if (cur !== 1 || b.dataset.locked) return;
      if (b.dataset.answer === "right") {
        $$(".poster-opt").forEach(x => x.dataset.locked = "1");
        b.classList.add("right");
        feedback.className = "feedback good"; feedback.textContent = "Yes! High contrast reads from far away.";
        flyXP(b, 20);
        setTimeout(() => { if (cur === 1) go(2); }, 1300);
      } else {
        b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong");
        feedback.className = "feedback"; feedback.textContent = "Look again. Squint at A. Can you still read it?";
      }
    }));

    const pInput = $("#poster-input"), pText = $("#poster-text"), myPoster = $("#my-poster");
    const syncFolio = () => {
      const t = pText.textContent;
      $("#folio-text").textContent = t; $("#folio-title").textContent = "Poster: " + t;
      const fp = $("#folio-poster");
      fp.style.setProperty("--pb", myPoster.style.getPropertyValue("--pb") || "var(--p-navy)");
      fp.style.setProperty("--pf", myPoster.style.getPropertyValue("--pf") || "var(--p-paper)");
    };
    pInput.addEventListener("input", () => { pText.textContent = pInput.value.trim() || "Your headline"; armNudge(); });
    $$(".swatch").forEach(s => s.addEventListener("click", () => {
      $$(".swatch").forEach(x => x.setAttribute("aria-pressed", String(x === s)));
      myPoster.style.setProperty("--pb", s.dataset.bg); myPoster.style.setProperty("--pf", s.dataset.fg);
      if (!reduce()) myPoster.animate([{ transform: "scale(.96) rotate(-1deg)" }, { transform: "none" }], { duration: 450, easing: "cubic-bezier(.34,1.56,.64,1)" });
      armNudge();
    }));
    $("#submit-project").addEventListener("click", e => {
      if (cur !== 2) return;
      syncFolio(); flyXP(e.currentTarget, 50);
      streakEl.textContent = "1"; bump($("#pill-streak"));
      go(3);
    });
    function celebrate() {
      done.add(3); setTimeout(setSteps, 900);
      const badge = $("#badge");
      if (reduce()) return;
      badge.animate([{ transform: "scale(0) rotate(-200deg)" }, { transform: "scale(1.25) rotate(10deg)", offset: .65 }, { transform: "none" }], { duration: 900, delay: 250, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" });
      $$(".show-head, .folio, .show-btns", screens[3]).forEach((el, i) =>
        el.animate([{ transform: "translateY(20px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 600, delay: 650 + i * 120, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }));
      setTimeout(() => { if (cur === 3) burstFrom(badge, 70, .8); }, 750);
    }
    $("#restart").addEventListener("click", () => { done.clear(); xp = 0; xpEl.textContent = "0"; streakEl.textContent = "0"; resetQuiz(); go(0); });
    stepItems.forEach((li, i) => $("button", li).addEventListener("click", () => { if (i === 3) syncFolio(); if (i === 1) resetQuiz(); go(i); }));
    setSteps();
    const pio = io(es => { if (es[0].isIntersecting) { armNudge(); pio.disconnect(); } }, { threshold: .5 });
    if (pio) pio.observe(wrapEl);
  }

  /* ---------- Sticker sheet + board ---------- */
  const stickerSheet = $("#stickers"), slotsEl = $("#slots");
  if (stickerSheet && slotsEl) {
    const stickers = $$(".sticker", stickerSheet), slots = $$(".slot", slotsEl);
    const boardEmpty = $("#board-empty"), boardCount = $("#board-count"), boardNote = $("#board-note");
    const total = stickers.length;
    let picks = [];
    const box = k => $(`#i-${k}`);
    const stickerOf = k => $(`.sticker[data-k="${k}"]`, stickerSheet);
    const hasForm = !!box(stickers[0].dataset.k);
    const renderBoard = prevRects => {
      slots.forEach(s => s.innerHTML = "");
      picks.forEach((k, i) => {
        const src = stickerOf(k);
        const item = document.createElement("button");
        item.type = "button"; item.className = "board-item"; item.dataset.k = k;
        item.style.setProperty("--r", ((i % 2 ? 1 : -1) * (1 + (i * 37 % 3))) + "deg");
        item.innerHTML = `<span class="ms" aria-hidden="true">${esc($(".ms", src).textContent)}</span><span>${esc($("b", src).textContent)}</span>`;
        item.setAttribute("aria-label", `Remove ${$("b", src).textContent} from your board`);
        item.addEventListener("click", () => toggle(k));
        slots[i].appendChild(item);
        if (prevRects && prevRects[k] && !reduce()) {
          const now = item.getBoundingClientRect(), was = prevRects[k];
          item.animate([{ transform: `translate(${was.left - now.left}px, ${was.top - now.top}px)` }, { transform: "none" }], { duration: 450, easing: "cubic-bezier(.16,1,.3,1)" });
        }
      });
      stickers.forEach(s => { const on = picks.includes(s.dataset.k); s.classList.toggle("peeled", on); s.setAttribute("aria-pressed", String(on)); });
      boardEmpty.style.opacity = picks.length ? 0 : 1;
      boardCount.textContent = `${picks.length} of ${total}`;
      boardNote.textContent = picks.length ? (hasForm ? "Nice. These go straight into your waitlist form below." : "Nice mix. We'll use these to shape our first paths.") : "Can't decide? Pick more than one.";
    };
    const flight = (fromEl, toEl, html, cls) => {
      if (reduce()) return Promise.resolve();
      const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
      const g = document.createElement("div");
      g.className = "flyer " + cls; g.innerHTML = html;
      Object.assign(g.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
      document.body.appendChild(g);
      const dx = b.left - a.left, dy = b.top - a.top, sx = b.width / a.width, sy = b.height / a.height;
      const lift = -Math.max(80, Math.abs(dx) * .25);
      return g.animate([
        { transform: "translate(0,0) rotate(0deg) scale(1)", transformOrigin: "top left" },
        { transform: `translate(${dx * .5}px, ${dy * .5 + lift}px) rotate(${dx > 0 ? 14 : -14}deg) scale(${((1 + sx) / 2 * 1.12).toFixed(3)})`, transformOrigin: "top left", offset: .5 },
        { transform: `translate(${dx}px, ${dy}px) rotate(-2deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`, transformOrigin: "top left" }
      ], { duration: 720, easing: "cubic-bezier(.45,.05,.25,1)" }).finished.catch(() => {}).then(() => g.remove());
    };
    const rectsOfBoard = () => { const m = {}; $$(".board-item", slotsEl).forEach(b => m[b.dataset.k] = b.getBoundingClientRect()); return m; };
    async function toggle(k) {
      const src = stickerOf(k);
      if (!picks.includes(k)) {
        picks.push(k); if (hasForm && box(k)) box(k).checked = true;
        const html = src.innerHTML;
        renderBoard();
        const item = $(`.board-item[data-k="${k}"]`, slotsEl);
        item.style.visibility = "hidden"; src.classList.remove("peeled");
        await flight(src, item, html, "sticker");
        if (picks.includes(k)) src.classList.add("peeled");
        item.style.visibility = "";
        if (!reduce()) item.animate([{ transform: "scale(1.12)" }, { transform: "scale(.96)", offset: .6 }, { transform: "none" }], { duration: 420, easing: "ease-out" });
      } else {
        const item = $(`.board-item[data-k="${k}"]`, slotsEl), prev = rectsOfBoard(), html = item ? item.innerHTML : "";
        picks = picks.filter(x => x !== k); if (hasForm && box(k)) box(k).checked = false;
        if (item) {
          const fly = flight(item, src, html, "board-item");
          renderBoard(prev); src.classList.add("peeled");
          await fly;
          if (!picks.includes(k)) src.classList.remove("peeled");
        } else renderBoard();
      }
    }
    stickers.forEach(s => {
      s.addEventListener("click", () => toggle(s.dataset.k));
      if (finePointer) {
        s.addEventListener("pointermove", e => {
          if (reduce() || s.classList.contains("peeled")) return;
          const r = s.getBoundingClientRect();
          s.style.setProperty("--rx", (((e.clientX - r.left) / r.width - .5) * 14).toFixed(1) + "deg");
          s.style.setProperty("--ry", (-((e.clientY - r.top) / r.height - .5) * 18).toFixed(1) + "deg");
        });
        s.addEventListener("pointerleave", () => { s.style.setProperty("--rx", "0deg"); s.style.setProperty("--ry", "0deg"); });
      }
    });
    if (hasForm) $$('input[name="interests"]').forEach(i => i.addEventListener("change", () => {
      const k = i.value;
      if (!stickerOf(k)) return;
      if (i.checked && !picks.includes(k)) picks.push(k);
      if (!i.checked) picks = picks.filter(x => x !== k);
      renderBoard();
    }));
    document.addEventListener("mdt:formreset", () => { picks = []; renderBoard(); });
    renderBoard();
  }

  /* ---------- Screen-time calculator ---------- */
  const mins = $("#mins");
  if (mins) {
    const projRow = $("#proj-row");
    const calc = () => {
      const m = +mins.value, hours = Math.round(m * 5 * 12 / 60), proj = Math.max(1, Math.round(hours / 5));
      $("#mins-label").textContent = m;
      tween($("#hours"), hours, 400); tween($("#projects"), proj, 400);
      mins.style.setProperty("--fill", ((m - 10) / 50 * 100) + "%");
      const live = $$(".mini-polaroid:not(.leaving)", projRow);
      const cols = [css("--accent"), css("--ink"), css("--c-amber"), css("--good"), css("--c-orange")];
      for (let i = live.length; i < proj; i++) {
        const d = document.createElement("span");
        d.className = "mini-polaroid";
        d.style.setProperty("--r", ((i * 53 % 9) - 4) + "deg"); d.style.setProperty("--c", cols[i % cols.length]);
        d.innerHTML = "<i></i>"; projRow.appendChild(d);
        if (!reduce()) d.animate([{ transform: "translateY(-30px) scale(.4) rotate(-30deg)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 500, delay: (i - live.length) * 50, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" });
      }
      live.slice(proj).forEach(d => {
        d.classList.add("leaving");
        if (reduce()) return d.remove();
        quiet(d.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(16px) scale(.5) rotate(20deg)", opacity: 0 }], { duration: 260, easing: "ease-in", fill: "forwards" }).finished.then(() => d.remove()));
      });
    };
    mins.addEventListener("input", calc); calc();
  }

  /* ---------- Rows: fill enters from the side the pointer came in ---------- */
  $$(".build-row").forEach(row => {
    const side = e => { const r = row.getBoundingClientRect(); return e.clientY - r.top < r.height / 2 ? "top" : "bottom"; };
    row.addEventListener("pointerenter", e => { row.style.setProperty("--origin", side(e)); requestAnimationFrame(() => row.classList.add("on")); });
    row.addEventListener("pointerleave", e => { row.style.setProperty("--origin", side(e)); row.classList.remove("on"); });
  });

  /* ---------- Accordions: smooth open and close ---------- */
  $$(".faq-list details").forEach(d => {
    const s = $("summary", d);
    s.addEventListener("click", e => {
      if (reduce()) return;
      e.preventDefault();
      if (d.dataset.anim) return;
      d.dataset.anim = "1";
      const start = d.offsetHeight, shut = s.offsetHeight + (d.offsetHeight - d.clientHeight);
      if (d.open) {
        quiet(d.animate([{ height: start + "px" }, { height: shut + "px" }], { duration: 320, easing: "cubic-bezier(.16,1,.3,1)" }).finished.then(() => { d.open = false; delete d.dataset.anim; }));
      } else {
        d.open = true;
        const end = d.offsetHeight;
        quiet(d.animate([{ height: start + "px" }, { height: end + "px" }], { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" }).finished.then(() => { delete d.dataset.anim; }));
        const body = d.querySelector(":scope > div");
        if (body) body.animate([{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: 80, easing: "ease-out", fill: "backwards" });
      }
    });
  });

  /* ---------- Tabs ---------- */
  $$("[data-tabs]").forEach(group => {
    const tabs = $$("[role=tab]", group);
    const show = (t, focus) => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute("aria-controls"));
        if (!p) return;
        p.hidden = !on;
        if (on && !reduce()) p.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.16,1,.3,1)" });
      });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(t));
      t.addEventListener("keydown", e => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); show(tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length], true); }
      });
    });
  });

  /* ---------- Filter helper with FLIP animation ---------- */
  function flipFilter(items, test, container) {
    const first = new Map(items.filter(i => !i.hidden).map(i => [i, i.getBoundingClientRect()]));
    items.forEach(i => { i.hidden = !test(i); });
    if (reduce()) return;
    items.forEach(i => {
      if (i.hidden) return;
      const f = first.get(i), l = i.getBoundingClientRect();
      if (f) i.animate([{ transform: `translate(${f.left - l.left}px, ${f.top - l.top}px)` }, { transform: "none" }], { duration: 500, easing: "cubic-bezier(.16,1,.3,1)", composite: "add" });
      else i.animate([{ opacity: 0, transform: "scale(.85) rotate(-4deg)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.34,1.56,.64,1)", composite: "add" });
    });
  }

  /* ---------- FAQ page: search + categories ---------- */
  const faqSearch = $("#faq-search");
  if (faqSearch) {
    const items = $$("#faq-all details"), cats = $$("[data-faq-cat]");
    const empty = $("#faq-empty");
    let cat = "all";
    const run = () => {
      const q = faqSearch.value.trim().toLowerCase();
      items.forEach(d => { d.hidden = !((cat === "all" || d.dataset.cat === cat) && (!q || d.textContent.toLowerCase().includes(q))); });
      $$("[data-faq-group]").forEach(g => { g.hidden = !$$("details", g).some(d => !d.hidden); });
      empty.hidden = items.some(d => !d.hidden);
    };
    cats.forEach(b => b.addEventListener("click", () => { cat = b.dataset.faqCat; cats.forEach(x => x.setAttribute("aria-pressed", String(x === b))); run(); }));
    faqSearch.addEventListener("input", run);
  }

  /* ---------- Badges: flip on tap ---------- */
  $$(".flip").forEach(b => b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(on));
  }));

  /* ---------- XP ladder ---------- */
  const xpPlay = $("#xp-play");
  if (xpPlay) {
    const PER_LEVEL = 100; // example numbers
    let total = 0;
    const lvl = $("#lvl"), meter = $("#meter"), label = $("#meter-label");
    const render = () => {
      const level = Math.floor(total / PER_LEVEL) + 1, into = total % PER_LEVEL;
      meter.style.setProperty("--w", (into / PER_LEVEL * 100) + "%");
      label.textContent = `${total} XP total. ${PER_LEVEL - into} XP to level ${level + 1}.`;
      if (+lvl.textContent !== level) {
        const up = level > +lvl.textContent;
        lvl.textContent = level;
        if (up) { bump(lvl.parentElement); burstFrom(lvl.parentElement, 60, .7); }
      }
    };
    $$(".xp-act", xpPlay).forEach(b => b.addEventListener("click", () => {
      total += +b.dataset.xp;
      if (!reduce()) {
        const f = document.createElement("span");
        f.className = "xp-fly"; f.textContent = `+${b.dataset.xp} XP`;
        const host = xpPlay; host.appendChild(f);
        const hr = host.getBoundingClientRect(), br = b.getBoundingClientRect();
        f.animate([{ transform: `translate(${br.left - hr.left + br.width / 2 - 30}px, ${br.top - hr.top}px)`, opacity: 1 }, { transform: `translate(${br.left - hr.left + br.width / 2 - 30}px, ${br.top - hr.top - 60}px)`, opacity: 0 }], { duration: 800, easing: "cubic-bezier(.16,1,.3,1)" }).finished.then(() => f.remove());
      }
      render();
    }));
    $("#xp-reset").addEventListener("click", () => { total = 0; lvl.textContent = "1"; render(); });
    render();
  }

  /* ---------- Opportunities filter ---------- */
  const oppFilters = $$("[data-opp]");
  if (oppFilters.length) {
    const tickets = $$(".tickets .ticket");
    oppFilters.forEach(b => b.addEventListener("click", () => {
      oppFilters.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const t = b.dataset.opp;
      flipFilter(tickets, i => t === "all" || i.dataset.type === t);
    }));
  }

  /* ---------- Academy: books, filter, search, drawer ---------- */
  const booksEl = $("#books");
  if (booksEl && window.MDT_COURSES) {
    const courses = window.MDT_COURSES;
    const CAT = { design: "Design", tech: "Technology", media: "Media", business: "Business", money: "Money", growth: "Personal growth", comms: "Communication" };
    booksEl.innerHTML = courses.map(c => `
      <button type="button" class="book" data-id="${c.id}" data-cat="${c.cat}" style="--cover: var(${c.cover})" aria-haspopup="dialog">
        <span class="book-cover">
          <span class="book-brand">MDT exercise book</span>
          <span class="ms book-icon" aria-hidden="true">${c.icon}</span>
          <span class="book-stamp">In development</span>
          <span class="book-label">
            <span class="row">Subject <span>${esc(c.title)}</span></span>
            <span class="row">Class <span>${esc(c.level)}</span></span>
            <span class="row">Length <span>${esc(c.length)}</span></span>
          </span>
        </span>
        <span class="book-meta"><b>${esc(c.title)}</b><small>${esc(CAT[c.cat])}. ${esc(c.blurb)}</small></span>
      </button>`).join("");
    const books = $$(".book", booksEl);
    armReveal(booksEl);
    const search = $("#course-search"), chips = $$("[data-cat-filter]"), empty = $("#books-empty");
    let cat = "all";
    const run = () => {
      const q = search.value.trim().toLowerCase();
      flipFilter(books, b => {
        const c = courses.find(x => x.id === b.dataset.id);
        const hay = (c.title + " " + c.blurb + " " + c.modules.map(m => m[0]).join(" ") + " " + CAT[c.cat]).toLowerCase();
        return (cat === "all" || c.cat === cat) && (!q || hay.includes(q));
      });
      empty.hidden = books.some(b => !b.hidden);
    };
    chips.forEach(b => b.addEventListener("click", () => { cat = b.dataset.catFilter; chips.forEach(x => x.setAttribute("aria-pressed", String(x === b))); run(); }));
    search.addEventListener("input", run);

    const drawer = $("#drawer"), backdrop = $("#drawer-backdrop"), body = $("#drawer-body");
    let opener = null;
    const openDrawer = (c, from) => {
      opener = from;
      body.innerHTML = `
        <span class="hand-note">${esc(CAT[c.cat])}</span>
        <h2 id="drawer-title">${esc(c.title)}</h2>
        <div class="meta"><span class="chip"><span class="ms" aria-hidden="true">signal_cellular_alt</span>${esc(c.level)}</span><span class="chip"><span class="ms" aria-hidden="true">schedule</span>${esc(c.length)}</span><span class="chip"><span class="ms" aria-hidden="true">construction</span>In development</span></div>
        <p class="lede">${esc(c.about)}</p>
        <h3>What you'll learn</h3>
        <ol class="modules">${c.modules.map(m => `<li><span><b>${esc(m[0])}</b><small>${esc(m[1])}</small></span></li>`).join("")}</ol>
        <h3>What you'll make</h3>
        <div class="make-card"><span class="ms" aria-hidden="true">palette</span><span><b>${esc(c.make)}</b><br><small class="help">Your finished project goes straight into your portfolio.</small></span></div>
        <h3>Who'll teach it</h3>
        <div class="tutor-slot"><span class="avatar"><span class="ms" aria-hidden="true">person_add</span></span><span><b>Tutor to be announced</b><br><small class="help">Know this subject? <a href="teach.html">Apply to teach it</a>.</small></span></div>
        <p class="fine">Module plan is a draft and may change before launch.</p>
        <div class="cta-row"><a class="btn" href="join.html" data-cta="join"><span class="label">Join the waitlist</span></a></div>`;
      drawer.hidden = false; backdrop.hidden = false; document.body.classList.add("locked");
      if (!reduce()) {
        drawer.animate([{ transform: "translateX(100%) rotate(3deg)" }, { transform: "none" }], { duration: 560, easing: "cubic-bezier(.16,1,.3,1)" });
        backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
        $$(".modules li", body).forEach((li, i) => li.animate([{ opacity: 0, transform: "translateX(24px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 200 + i * 70, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }));
      }
      if (MDT.launched) $$("[data-cta='join']", body).forEach(a => { a.href = MDT.appUrl; a.querySelector(".label").textContent = "Start learning"; });
      $(".drawer-close", drawer).focus();
    };
    const closeDrawer = async () => {
      if (drawer.hidden) return;
      if (!reduce()) {
        backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280 });
        await quiet(drawer.animate([{ transform: "none" }, { transform: "translateX(100%)" }], { duration: 320, easing: "cubic-bezier(.5,0,.75,0)" }).finished);
      }
      drawer.hidden = true; backdrop.hidden = true; document.body.classList.remove("locked");
      if (opener) opener.focus();
    };
    books.forEach(b => b.addEventListener("click", () => openDrawer(courses.find(c => c.id === b.dataset.id), b)));
    $(".drawer-close", drawer).addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
    drawer.addEventListener("keydown", e => {
      if (e.key !== "Tab") return;
      const f = $$("a, button, input", drawer).filter(x => !x.disabled);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    const want = location.hash.slice(1);
    if (want) { const c = courses.find(x => x.id === want); if (c) openDrawer(c, $(`.book[data-id="${want}"]`)); }
  }

  /* ---------- Tutor card live preview ---------- */
  const tName = $("#t-name");
  if (tName) {
    const out = { name: $("#tc-name"), role: $("#tc-role"), init: $("#tc-init"), chips: $("#tc-chips"), quote: $("#tc-quote") };
    const sync = () => {
      const n = tName.value.trim();
      out.name.textContent = n || "Your name";
      out.init.textContent = (n.split(/\s+/).map(x => x[0]).join("").slice(0, 2) || "?").toUpperCase();
      out.role.textContent = $("#t-role").value.trim() || "What you do";
      const skills = $("#t-skill").value.split(",").map(s => s.trim()).filter(Boolean).slice(0, 4);
      out.chips.innerHTML = (skills.length ? skills : ["Your skill"]).map(s => `<span class="chip">${esc(s)}</span>`).join("");
      out.quote.textContent = $("#t-why").value.trim().slice(0, 90) || "Why you want to teach";
    };
    ["#t-name", "#t-role", "#t-skill", "#t-why"].forEach(id => $(id).addEventListener("input", sync));
    sync();
  }

  /* ======================================================================
     FORMS
     ====================================================================== */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(form, id, msg) {
    const f = $("#" + id, form) || $("#" + id);
    delete f.dataset.invalid; void f.offsetWidth; f.dataset.invalid = "";
    const e = $(".err", f); e.textContent = msg; e.hidden = false;
    const ctl = $("input, select, textarea", f); if (ctl) ctl.setAttribute("aria-invalid", "true");
  }
  function clearErrors(form) {
    $$("[data-invalid]", form).forEach(f => delete f.dataset.invalid);
    $$(".err", form).forEach(e => { e.hidden = true; e.textContent = ""; });
    $$("[aria-invalid]", form).forEach(c => c.removeAttribute("aria-invalid"));
    const fe = $(".form-error", form); if (fe) fe.hidden = true;
  }
  async function send(endpoint, data) {
    if (!endpoint) { await wait(450); return; }
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error(res.status);
  }

  /* Envelope success animation, shared by waitlist and contact */
  async function playEnvelope(formEl, successEl, letterHTML) {
    const sheet = formEl.closest(".form-sheet") || formEl.parentElement, cs = getComputedStyle(sheet);
    successEl.style.minHeight = (sheet.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) + "px";
    const env = $(".envelope", successEl), letter = $(".env-letter", successEl), flap = $(".env-flap", successEl), seal = $(".env-seal", successEl);
    letter.innerHTML = letterHTML;
    const textEls = $$(".big, p, .btn", successEl);
    if (reduce()) { formEl.hidden = true; successEl.hidden = false; successEl.focus(); return; }
    const sr = sheet.getBoundingClientRect();
    if (sr.top < 70 || sr.bottom > innerHeight) sheet.scrollIntoView({ behavior: "smooth", block: sr.height > innerHeight ? "start" : "center" });
    try {
      await formEl.animate([
        { transform: "none", opacity: 1 },
        { transform: "perspective(900px) rotateX(18deg) scale(.9)", opacity: 1, offset: .4 },
        { transform: "translateY(60px) scale(.35) rotate(-6deg)", opacity: 0 }
      ], { duration: 650, easing: "cubic-bezier(.55,0,.4,1)" }).finished;
      formEl.hidden = true; successEl.hidden = false; successEl.focus({ preventScroll: true });
      textEls.forEach(el => el.style.opacity = 0);
      seal.style.opacity = 0; flap.style.zIndex = 0; flap.style.transform = "rotateX(180deg)";
      env.animate([{ transform: "translateY(40px) scale(.9)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 500, easing: "cubic-bezier(.16,1,.3,1)" });
      await letter.animate([{ transform: "translateY(-95%)" }, { transform: "translateY(-95%)", offset: .3 }, { transform: "none" }], { duration: 1000, easing: "cubic-bezier(.65,0,.35,1)" }).finished;
      flap.style.zIndex = 3;
      await flap.animate([{ transform: "rotateX(180deg)" }, { transform: "rotateX(0deg)" }], { duration: 480, easing: "cubic-bezier(.5,0,.2,1)" }).finished;
      flap.style.transform = ""; seal.style.opacity = 1;
      await seal.animate([{ transform: "scale(2.4) rotate(-40deg)", opacity: 0 }, { transform: "scale(.9) rotate(4deg)", opacity: 1, offset: .7 }, { transform: "none", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.3,1.4,.6,1)" }).finished;
      burstFrom(seal, 120, 1.1);
      env.animate([{ transform: "none" }, { transform: "translateY(-6px) rotate(-2deg)" }, { transform: "none" }], { duration: 500, easing: "ease-out" });
      textEls.forEach((el, i) => { el.style.opacity = ""; el.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: 150 + i * 120, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }); });
    } catch (_) {
      formEl.hidden = true; successEl.hidden = false; textEls.forEach(el => el.style.opacity = ""); seal.style.opacity = 1; flap.style.transform = "";
    }
  }
  function resetEnvelope(formEl, successEl) {
    formEl.reset(); successEl.hidden = true; formEl.hidden = false; successEl.style.minHeight = "";
    if (!reduce()) formEl.animate([{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: "cubic-bezier(.16,1,.3,1)" });
  }

  /* Stamp success for simple forms */
  async function playStamp(formEl, title, body) {
    const wrap = document.createElement("div");
    wrap.className = "form-sent"; wrap.tabIndex = -1;
    wrap.innerHTML = `<span class="stamp">Sent</span><span class="big">${esc(title)}</span><p>${esc(body)}</p><button type="button" class="btn ghost small">Send another</button>`;
    const h = formEl.offsetHeight;
    if (!reduce()) await quiet(formEl.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(20px) scale(.97)" }], { duration: 300, easing: "ease-in" }).finished);
    formEl.hidden = true; formEl.after(wrap); wrap.style.minHeight = Math.min(h, 520) + "px"; wrap.style.alignContent = "center";
    wrap.focus({ preventScroll: true });
    const stamp = $(".stamp", wrap);
    if (!reduce()) {
      stamp.animate([{ transform: "scale(2.6) rotate(-40deg)", opacity: 0 }, { transform: "scale(.92)", opacity: 1, offset: .7 }, { transform: "none", opacity: 1 }], { duration: 520, easing: "cubic-bezier(.3,1.4,.6,1)" });
      $$(".big, p, .btn", wrap).forEach((el, i) => el.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 380 + i * 110, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }));
      setTimeout(() => burstFrom(stamp, 60, .7), 360);
    }
    $(".btn", wrap).addEventListener("click", () => { formEl.reset(); wrap.remove(); formEl.hidden = false; formEl.dispatchEvent(new Event("mdt:reset")); });
  }

  /* ---------- Waitlist form (roles, guardian consent) ---------- */
  const wl = $("#wl-form");
  if (wl) {
    const success = $("#wl-success"), submitBtn = $("button[type=submit]", wl), formError = $(".form-error", wl);
    const emailLabel = $("#email-label"), age = $("#age"), guardianField = $("#f-guardian");
    const role = () => $('input[name="role"]:checked', wl).value;
    const needsGuardian = () => role() === "teen" && age.value !== "" && Number(age.value) < 18;
    const showField = (el, show) => {
      const was = !el.hidden; el.hidden = !show;
      if (show && !was && !reduce()) { el.classList.remove("appear"); void el.offsetWidth; el.classList.add("appear"); }
    };
    const syncRole = () => {
      const r = role();
      $$("[data-for]", wl).forEach(el => showField(el, el.dataset.for.split(" ").includes(r) && (el !== guardianField || needsGuardian())));
      emailLabel.textContent = r === "school" ? "Work email" : "Your email";
      clearErrors(wl);
    };
    $$('input[name="role"]', wl).forEach(i => i.addEventListener("change", syncRole));
    age.addEventListener("change", () => showField(guardianField, needsGuardian()));
    const preset = new URLSearchParams(location.search).get("role") || (location.hash.match(/role-(\w+)/) || [])[1];
    const presetRole = r => { const input = $("#role-" + r); if (input) { input.checked = true; syncRole(); } };
    if (preset) presetRole(preset);
    $$("[data-role]").forEach(a => a.addEventListener("click", () => { if (!success.hidden) reset(); presetRole(a.dataset.role); }));
    const validate = () => {
      clearErrors(wl);
      const r = role(), v = id => $("#" + id, wl).value.trim();
      let ok = true;
      if (!v("name")) { setError(wl, "f-name", "Add your first name."); ok = false; }
      if (!emailRe.test(v("email"))) { setError(wl, "f-email", "Enter an email like name@example.com."); ok = false; }
      if (r === "teen") {
        if (!age.value) { setError(wl, "f-age", "Choose your age. MDT is for ages 13 to 18."); ok = false; }
        if (needsGuardian()) {
          const g = v("guardian");
          if (!emailRe.test(g)) { setError(wl, "f-guardian", "Add a parent or guardian's email so they can confirm."); ok = false; }
          else if (g.toLowerCase() === v("email").toLowerCase()) { setError(wl, "f-guardian", "This needs to be a different email from yours."); ok = false; }
        }
      }
      if (r === "tutor" && !v("skill")) { setError(wl, "f-skill", "Tell us what you could teach."); ok = false; }
      if (r === "school" && !v("org")) { setError(wl, "f-org", "Add the name of your school or organisation."); ok = false; }
      if (!$("#consent", wl).checked) { setError(wl, "f-consent", "Tick this so we can email you when we launch."); ok = false; }
      if (!ok) { const first = $("[aria-invalid]", wl); if (first) first.focus(); }
      return ok;
    };
    const SUCCESS = {
      teen: n => [`You're on the list, ${n}!`, "We've also sent a note to your parent or guardian. Once they say yes, you're all set for launch."],
      teen18: n => [`You're on the list, ${n}!`, "We'll email you as soon as MDT opens."],
      parent: n => [`Thank you, ${n}!`, "We'll email you before launch with everything you need to know, including how consent works."],
      tutor: n => [`Thanks, ${n}!`, "We'll be in touch about shaping our first courses."],
      school: n => [`Thanks, ${n}!`, "Someone from our team will reach out about working together."]
    };
    const LETTER = { teen: "Dear MDT,<br>count me in.", teen18: "Dear MDT,<br>count me in.", parent: "Dear MDT,<br>keep me posted.", tutor: "Dear MDT,<br>I'd love to teach.", school: "Dear MDT,<br>let's work together." };
    wl.addEventListener("submit", async e => {
      e.preventDefault();
      if (!validate()) return;
      const data = Object.fromEntries(new FormData(wl));
      data.interests = $$('input[name="interests"]:checked', wl).map(i => i.value);
      data.submittedAt = new Date().toISOString(); data.page = location.pathname;
      submitBtn.disabled = true; submitBtn.textContent = "Saving your spot...";
      let saved = false;
      try { await send(MDT.waitlistEndpoint, data); saved = true; }
      catch (_) { formError.textContent = "We couldn't save that. Check your connection and try again."; formError.hidden = false; }
      submitBtn.disabled = false; submitBtn.textContent = "Join the waitlist";
      if (!saved) return;
      const r = role(), key = r === "teen" && !needsGuardian() ? "teen18" : r;
      const [title, body] = SUCCESS[key](data.name.trim());
      $(".big", success).textContent = title; $("p", success).textContent = body;
      await playEnvelope(wl, success, LETTER[key]);
    });
    const reset = () => { resetEnvelope(wl, success); syncRole(); document.dispatchEvent(new Event("mdt:formreset")); };
    $("[data-again]", success).addEventListener("click", () => { reset(); $("#name", wl).focus(); });
    syncRole();
  }

  /* ---------- Generic forms: [data-form] ---------- */
  $$("form[data-form]").forEach(form => {
    const btn = $("button[type=submit]", form), label = btn ? btn.textContent : "";
    form.addEventListener("submit", async e => {
      e.preventDefault();
      clearErrors(form);
      let ok = true;
      $$("[data-required]", form).forEach(f => {
        const ctl = $("input, select, textarea", f);
        const val = ctl.type === "checkbox" ? ctl.checked : ctl.value.trim();
        const bad = !val || (ctl.type === "email" && !emailRe.test(ctl.value.trim()));
        if (bad) { setError(form, f.id, f.dataset.required); ok = false; }
      });
      if (!ok) { const first = $("[aria-invalid]", form); if (first) first.focus(); return; }
      if (form.dataset.form === "login") {
        const note = $("#login-note");
        note.hidden = false;
        if (!reduce()) note.animate([{ opacity: 0, transform: "translateY(-10px) rotate(-2deg)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: "cubic-bezier(.34,1.56,.64,1)" });
        if (MDT.launched) location.href = MDT.loginUrl;
        return;
      }
      const data = Object.fromEntries(new FormData(form));
      data.form = form.dataset.form; data.submittedAt = new Date().toISOString();
      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
      let sent = false;
      try { await send(MDT.contactEndpoint, data); sent = true; }
      catch (_) { const fe = $(".form-error", form); if (fe) { fe.textContent = "That didn't send. Check your connection and try again."; fe.hidden = false; } }
      if (btn) { btn.disabled = false; btn.textContent = label; }
      if (!sent) return;
      const name = (data.name || "").trim().split(" ")[0];
      if (form.dataset.success === "envelope") {
        const success = $("#" + form.dataset.successId);
        $(".big", success).textContent = name ? `Thanks, ${name}!` : "Thanks!";
        await playEnvelope(form, success, "Dear MDT,<br>" + esc((data.message || "hello").trim().slice(0, 40)) + (data.message && data.message.length > 40 ? "..." : ""));
        $("[data-again]", success).onclick = () => resetEnvelope(form, success);
      } else {
        await playStamp(form, form.dataset.title || (name ? `Thanks, ${name}!` : "Thanks!"), form.dataset.body || "We'll get back to you soon.");
      }
    });
  });

  /* ---------- Year in footer ---------- */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();
