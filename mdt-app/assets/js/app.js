/* MDT app prototype: router, shell and the four role dashboards. */
(() => {
  "use strict";
  const M = window.MDT, COURSE = window.DESIGN_BASICS, CATALOG = window.MDT_COURSES || [];
  const app = document.getElementById("app");
  const esc = M.esc;
  const ic = (n, cls = "") => `<span class="ms ${cls}" aria-hidden="true">${n}</span>`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = () => M.state;
  let cleanup = [];

  /* ---------- small UI helpers ---------- */
  const av = (initials, c, cls = "") => `<span class="av ${cls}" style="--c:${c}" aria-hidden="true">${esc(initials)}</span>`;
  const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const ago = t => { const d = (Date.now() - t) / 1000; if (d < 60) return "just now"; if (d < 3600) return `${Math.round(d / 60)} min ago`; if (d < 86400) return `${Math.round(d / 3600)} h ago`; const n = Math.round(d / 86400); return n === 1 ? "yesterday" : `${n} days ago`; };
  const pct = n => Math.round(n * 100);
  const ring = (p, label, big = false) => `<div class="ring ${big ? "big" : ""}" style="--p:${p}"><svg viewBox="0 0 36 36"><circle class="trk" cx="18" cy="18" r="15.9" pathLength="100"/><circle class="val" cx="18" cy="18" r="15.9" pathLength="100"/></svg><b>${label}</b></div>`;
  const bar = p => `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}"><i style="--w:${p}%"></i></div>`;

  function toast(msg, icon = "check_circle") {
    let box = $(".toasts");
    if (!box) { box = document.createElement("div"); box.className = "toasts"; box.setAttribute("role", "status"); document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "toast"; t.innerHTML = `${ic(icon, "fill")}<span>${esc(msg)}</span>`;
    box.appendChild(t);
    if (!reduce()) t.animate([{ opacity: 0, transform: "translateY(20px) scale(.9)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: "cubic-bezier(.34,1.56,.64,1)" });
    setTimeout(() => { const a = reduce() ? null : t.animate([{ opacity: 1 }, { opacity: 0, transform: "translateY(10px)" }], { duration: 300, fill: "forwards" }); if (a) a.finished.then(() => t.remove()); else t.remove(); }, 2800);
  }
  function dialog(html, bind) {
    const back = document.createElement("div");
    back.className = "dlg-back";
    back.innerHTML = `<div class="dlg" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(back);
    const dlg = $(".dlg", back), prev = document.activeElement;
    const close = () => { back.remove(); document.removeEventListener("keydown", onKey); if (prev && prev.focus) prev.focus(); };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    back.addEventListener("click", e => { if (e.target === back) close(); });
    $$("[data-close]", dlg).forEach(b => b.addEventListener("click", close));
    if (!reduce()) dlg.animate([{ opacity: 0, transform: "translateY(24px) rotate(-1deg) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.34,1.56,.64,1)" });
    const f = $("button:not([data-close]), input, textarea, select", dlg) || $("button", dlg); if (f) f.focus();
    if (bind) bind(dlg, close);
    return close;
  }
  function confetti(x, y, count = 90, spread = 1) {
    if (reduce()) return;
    const c = document.createElement("canvas");
    Object.assign(c.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: 90 });
    document.body.appendChild(c);
    const dpr = Math.min(devicePixelRatio || 1, 2); c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    const ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
    const cs = getComputedStyle(document.documentElement), col = n => cs.getPropertyValue(n).trim();
    const colors = [col("--accent"), col("--ink"), col("--c-amber"), col("--c-mint"), col("--c-orange")];
    const parts = Array.from({ length: count }, () => { const a = Math.random() * Math.PI * 2, s = (4 + Math.random() * 9) * spread; return { x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6 * spread, w: 6 + Math.random() * 7, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: colors[(Math.random() * colors.length) | 0], f: Math.random() * 6, life: 0 }; });
    let last = performance.now();
    (function tick(now) {
      const dt = Math.min(2, (now - last) / 16.7); last = now; ctx.clearRect(0, 0, innerWidth, innerHeight); let alive = 0;
      for (const p of parts) {
        p.life += dt; p.vy += .32 * dt; p.vx *= .985; p.vy *= .985; p.x += (p.vx + Math.sin(p.f + p.life * .15) * .8) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        if (p.y < innerHeight + 30 && p.life < 220) alive++;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.cos(p.life * .2 + p.f)); ctx.globalAlpha = Math.max(0, Math.min(1, 1 - (p.life - 150) / 70)); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      }
      if (alive) requestAnimationFrame(tick); else c.remove();
    })(last);
  }
  const burst = (el, n = 80, s = 1) => { if (!el) return; const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, n, s); };

  /* ---------- course progress ---------- */
  const isDone = id => !!S().done[id];
  const doneCount = () => COURSE.order.filter(isDone).length;
  const nextLesson = () => COURSE.order.find(id => !isDone(id));
  const unlocked = id => { const i = COURSE.order.indexOf(id); return i === 0 || COURSE.order.slice(0, i).every(isDone) || isDone(id); };
  const moduleOf = id => COURSE.modules.find(m => m.lessons.includes(id));
  const TYPE = { watch: ["play_circle", "Motion lesson"], practice: ["touch_app", "Practice"], quiz: ["quiz", "Quiz"], project: ["palette", "Project"] };
  function badges() {
    const st = S();
    return [
      { n: "First lesson", i: "school", c: "var(--p-violet)", on: isDone("l1") },
      { n: "Contrast pro", i: "contrast", c: "var(--book)", on: isDone("l3") },
      { n: "Type nerd", i: "text_fields", c: "var(--book-2)", on: isDone("l6") },
      { n: "First project", i: "palette", c: "var(--book-3)", on: st.project.status !== "none" },
      { n: "7-day streak", i: "local_fire_department", c: "var(--c-orange)", on: st.streak >= 7 },
      { n: "Course complete", i: "workspace_premium", c: "var(--p-navy)", on: doneCount() === COURSE.order.length }
    ];
  }
  const pendingReviews = () => {
    const st = S();
    const list = M.otherSubmissions.filter(s => !st.reviewed[s.id]).map(s => ({ id: s.id, who: s.who, initials: s.initials, c: s.c, when: s.when, poster: s.poster }));
    if (st.project.status === "submitted") list.unshift({ id: "amara", who: "Amara Okafor", initials: "AO", c: "var(--p-violet)", when: ago(st.project.submittedAt), poster: st.project.data });
    return list;
  };

  /* ---------- charts ---------- */
  function columnChart(values, labels, opts = {}) {
    const W = 560, H = 220, pad = { l: 34, r: 8, t: 22, b: 28 };
    const max = Math.max(...values, 1), top = Math.ceil(max / 10) * 10 || 10;
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b, band = iw / values.length, bw = Math.min(24, band * .55);
    const y = v => pad.t + ih - v / top * ih;
    const ticks = [0, top / 2, top];
    const mi = values.indexOf(Math.max(...values)), last = values.length - 1;
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || "Chart")}">`;
    ticks.forEach(t => { svg += `<line class="gl" x1="${pad.l}" x2="${W - pad.r}" y1="${y(t)}" y2="${y(t)}"/><text class="ax" x="${pad.l - 8}" y="${y(t) + 4}" text-anchor="end">${t}</text>`; });
    values.forEach((v, i) => {
      const cx = pad.l + band * i + band / 2, x = cx - bw / 2, yy = y(v), h = pad.t + ih - yy, r = Math.min(4, h);
      const d = h > 0 ? `M${x},${pad.t + ih} V${yy + r} Q${x},${yy} ${x + r},${yy} H${x + bw - r} Q${x + bw},${yy} ${x + bw},${yy + r} V${pad.t + ih} Z` : "";
      svg += `<rect class="hit" x="${pad.l + band * i}" y="${pad.t}" width="${band}" height="${ih}" data-i="${i}"/>`;
      if (d) svg += `<path class="mk" d="${d}" data-i="${i}" style="transform-origin:${cx}px ${pad.t + ih}px"/>`;
      if (i === mi || i === last) svg += `<text class="val" x="${cx}" y="${yy - 6}" text-anchor="middle">${v}</text>`;
      svg += `<text class="ax" x="${cx}" y="${H - 8}" text-anchor="middle">${labels[i]}</text>`;
    });
    svg += `</svg>`;
    return `<div class="chart">${svg}<div class="tip" aria-hidden="true"></div></div>
      <details style="margin-top:10px"><summary class="small muted" style="cursor:pointer;font-weight:700">Show as a table</summary>
      <div class="table-wrap"><table class="t" style="min-width:0;margin-top:8px"><thead><tr><th>Day</th><th>${esc(opts.unit || "Value")}</th></tr></thead><tbody>${values.map((v, i) => `<tr><td>${labels[i]}</td><td class="num">${v}</td></tr>`).join("")}</tbody></table></div></details>`;
  }
  function bindChart(scope, values, labels, unit) {
    $$(".chart", scope).forEach(ch => {
      const tip = $(".tip", ch), svg = $("svg", ch);
      $$(".hit", ch).forEach(h => {
        const i = +h.dataset.i, mk = $(`.mk[data-i="${i}"]`, ch);
        h.addEventListener("pointerenter", () => {
          const r = svg.getBoundingClientRect(), cr = ch.getBoundingClientRect(), vb = svg.viewBox.baseVal;
          const mb = mk ? mk.getBBox() : h.getBBox();
          tip.textContent = `${labels[i]}: ${values[i]} ${unit}`;
          tip.style.left = ((mb.x + mb.width / 2) / vb.width * r.width + (r.left - cr.left)) + "px";
          tip.style.top = (mb.y / vb.height * r.height + (r.top - cr.top)) + "px";
          tip.classList.add("on"); if (mk) mk.classList.add("hover");
        });
        h.addEventListener("pointerleave", () => { tip.classList.remove("on"); if (mk) mk.classList.remove("hover"); });
      });
      if (!reduce()) $$(".mk", ch).forEach((m, i) => m.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 700, delay: i * 60, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }));
    });
  }
  const hbars = (rows, max = 100, unit = "%") => `<div class="hbars">${rows.map(r => `<div class="hbar"><span title="${esc(r[0])}">${esc(r[0])}</span><div class="tr"><i style="--w:${Math.max(1.5, r[1] / max * 100)}%"></i></div><b>${r[1]}${unit}</b></div>`).join("")}</div>`;

  /* ======================================================================
     ROLE CONFIG
     ====================================================================== */
  const NAV = {
    learner: [["home", "Home", "home"], ["academy", "Skill Academy", "school"], ["course", "My course", "menu_book"], ["projects", "Projects", "palette"], ["portfolio", "Portfolio", "photo_library"], ["community", "Community", "forum"], ["opportunities", "Opportunities", "emoji_events"], ["profile", "Settings", "settings"]],
    parent: [["home", "Home", "home"], ["child", "Amara's progress", "insights"], ["consent", "Consent and privacy", "shield"], ["settings", "Settings", "settings"]],
    tutor: [["home", "Home", "home"], ["reviews", "Reviews", "rate_review"], ["builder", "Course builder", "edit_note"], ["learners", "Learners", "groups"], ["community", "Questions", "forum"]],
    school: [["home", "Home", "home"], ["groups", "Groups", "groups"], ["opportunities", "Opportunities", "emoji_events"], ["settings", "Settings", "settings"]]
  };
  const TABS = {
    learner: [["home", "Home", "home"], ["course", "Learn", "menu_book"], ["projects", "Projects", "palette"], ["community", "Community", "forum"], ["portfolio", "Me", "person"]],
    parent: [["home", "Home", "home"], ["child", "Progress", "insights"], ["consent", "Consent", "shield"], ["settings", "Settings", "settings"]],
    tutor: [["home", "Home", "home"], ["reviews", "Reviews", "rate_review"], ["builder", "Builder", "edit_note"], ["learners", "Learners", "groups"]],
    school: [["home", "Home", "home"], ["groups", "Groups", "groups"], ["opportunities", "Listings", "emoji_events"], ["settings", "Settings", "settings"]]
  };
  const ROLE_NOTE = { learner: "learning", parent: "parent view", tutor: "tutor tools", school: "school portal" };

  /* ======================================================================
     SHELL
     ====================================================================== */
  function protoBar(role) {
    const p = M.people[role];
    return `<div class="proto"><span>Prototype with sample data.</span><button type="button" id="role-btn" aria-haspopup="menu">${p ? `Viewing as ${esc(p.first)}` : "Choose a view"} ${ic("expand_more")}</button></div>`;
  }
  function bindProto() {
    const b = $("#role-btn");
    if (!b) return;
    b.addEventListener("click", e => {
      e.stopPropagation();
      if ($(".role-menu")) { $(".role-menu").remove(); return; }
      const m = document.createElement("div");
      m.className = "role-menu"; m.setAttribute("role", "menu");
      m.innerHTML = Object.values(M.people).map(p => `<button type="button" class="row" role="menuitem" data-go="#/${p.role}/home">${av(p.initials, p.c, "sm")}<span class="grow"><b>${esc(p.name)}</b><small>${esc(p.role === "school" ? p.org : p.label)}</small></span></button>`).join("")
        + `<div class="sep"></div><p class="tiny muted" style="padding:4px 10px;font-weight:700">Demo shortcuts</p>`
        + `<button type="button" class="row" data-preset="fresh">${ic("restart_alt")}<span class="grow"><b>Fresh start</b><small>Amara hasn't started the course</small></span></button>`
        + `<button type="button" class="row" data-preset="module1">${ic("timelapse")}<span class="grow"><b>Module 1 done</b><small>The default demo</small></span></button>`
        + `<button type="button" class="row" data-preset="finished">${ic("workspace_premium")}<span class="grow"><b>Course finished</b><small>Project reviewed, certificate earned</small></span></button>`
        + `<div class="sep"></div><button type="button" class="row" data-go="#/">${ic("logout")}<span class="grow"><b>Back to the start</b></span></button>`;
      document.body.appendChild(m);
      if (!reduce()) m.animate([{ opacity: 0, transform: "translateY(-10px) scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: "cubic-bezier(.16,1,.3,1)" });
      $$("[data-go]", m).forEach(x => x.addEventListener("click", () => { m.remove(); location.hash = x.dataset.go; }));
      $$("[data-preset]", m).forEach(x => x.addEventListener("click", () => { M.reset(x.dataset.preset); m.remove(); toast("Demo reset"); render(); }));
      const off = ev => { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener("click", off); } };
      setTimeout(() => document.addEventListener("click", off));
      $("button", m).focus();
    });
  }
  function shell(role, page, body) {
    const p = M.people[role];
    const count = { reviews: role === "tutor" ? pendingReviews().length : 0, home: role === "parent" && S().consent.chidi === "pending" ? 1 : 0 };
    const nav = NAV[role].map(n => `<a href="#/${role}/${n[0]}" ${n[0] === page ? 'aria-current="page"' : ""}>${ic(n[2])}<span>${n[1]}</span>${count[n[0]] ? `<span class="count">${count[n[0]]}</span>` : ""}</a>`).join("");
    const tabs = TABS[role].map(n => `<a href="#/${role}/${n[0]}" ${n[0] === page ? 'aria-current="page"' : ""}>${ic(n[2])}<span>${n[1]}</span></a>`).join("");
    const logo = `<a class="logo" href="#/${role}/home" aria-label="MyDearTeenager home"><img class="l-light" src="assets/img/logo.png" alt="MyDearTeenager" width="420" height="208"><img class="l-dark" src="assets/img/logo-dark.png" alt="MyDearTeenager" width="420" height="208"></a>`;
    return `${protoBar(role)}
      <div class="shell">
        <aside class="side" aria-label="Main">
          ${logo}
          <span class="role-tag">${ROLE_NOTE[role]}</span>
          <nav class="side-nav">${nav}</nav>
          <div class="side-foot"><div class="me">${av(p.initials, p.c)}<span><b>${esc(role === "school" ? p.org : p.name)}</b><small>${esc(role === "school" ? p.name + ", " + p.label : p.label)}</small></span></div></div>
        </aside>
        <div class="main">
          <header class="topbar">
            ${logo}
            <label class="top-search"><span class="sr-only">Search</span>${ic("search")}<input type="search" placeholder="${role === "learner" ? "What do you want to learn?" : "Search"}" id="top-search"></label>
            <div class="top-actions">
              <button class="icon-btn" type="button" id="bell" aria-label="Notifications">${ic("notifications")}<span class="dot"></span></button>
              <a class="icon-btn" href="#/${role}/${role === "learner" ? "portfolio" : role === "parent" ? "settings" : role === "tutor" ? "home" : "settings"}" aria-label="Your profile" style="border:0;padding:0">${av(p.initials, p.c)}</a>
            </div>
          </header>
          <main class="content view-in" id="main">${body}</main>
        </div>
      </div>
      <nav class="tabbar" aria-label="Main">${tabs}</nav>`;
  }
  function bindShell(role) {
    bindProto();
    const bell = $("#bell");
    if (bell) bell.addEventListener("click", () => {
      const evs = notifications(role);
      dialog(`<h2>Notifications</h2><ul class="timeline-mini" style="margin-top:14px">${evs.map(e => `<li><span class="ico-dot">${ic(e.icon)}</span><span><b>${esc(e.text)}</b><small>${esc(e.when)}</small></span></li>`).join("")}</ul><div class="acts"><button class="btn small" type="button" data-close>Close</button></div>`);
    });
    const s = $("#top-search");
    if (s) s.addEventListener("keydown", e => { if (e.key === "Enter") { toast("Search isn't part of this prototype yet", "search"); } });
  }
  function notifications(role) {
    const st = S(), evs = st.events.slice(0, 6).map(e => ({ icon: e.icon, text: role === "learner" ? e.text : `Amara: ${e.text}`, when: ago(e.at) }));
    if (role === "tutor") return pendingReviews().map(r => ({ icon: "rate_review", text: `${r.who} submitted a project`, when: r.when })).concat([{ icon: "forum", text: "David Eze asked a question in Design Basics", when: "3 h ago" }]);
    if (role === "school") return [{ icon: "shield", text: "3 parents haven't confirmed consent yet", when: "Today" }, { icon: "emoji_events", text: "Inter-house Poster Challenge is live", when: "Yesterday" }];
    if (role === "parent" && st.consent.chidi === "pending") evs.unshift({ icon: "family_restroom", text: "Chidi is waiting for your OK to join", when: "Today" });
    return evs.length ? evs : [{ icon: "notifications", text: "Nothing new yet", when: "" }];
  }

  /* ======================================================================
     START: pick a seat
     ====================================================================== */
  function startView() {
    const seats = [["learner", "Amara", "Learner, 15", "start learning"], ["parent", "Ngozi", "Amara's mum", "see progress"], ["tutor", "Kelechi", "Design tutor", "review work"], ["school", "Sunrise College", "Programme lead", "run a programme"]];
    app.innerHTML = `${protoBar(null)}
      <div class="start"><div class="start-in">
        <span class="logo"><img class="l-light" src="assets/img/logo.png" alt="MyDearTeenager" width="420" height="208"><img class="l-dark" src="assets/img/logo-dark.png" alt="MyDearTeenager" width="420" height="208"></span>
        <h1>Who's signing in?</h1>
        <span class="hand-note">pick a seat, you can switch any time</span>
        <div class="seats">${seats.map(s => { const p = M.people[s[0]]; return `<a class="seat" href="#/${s[0]}/home">${av(p.initials, p.c, "xl")}<b>${s[1]}</b><small>${s[2]}</small><span class="hand">${s[3]}</span></a>`; }).join("")}</div>
        <p class="small muted" style="margin-top:36px">Everything here is sample data. Nothing you do leaves this browser.</p>
      </div></div>`;
    bindProto();
    if (!reduce()) $$(".seat").forEach((s, i) => s.animate([{ opacity: 0, transform: "translateY(-40px) rotate(8deg)" }, { opacity: 1, transform: "none" }], { duration: 800, delay: 120 + i * 110, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }));
  }

  /* ======================================================================
     LEARNER
     ====================================================================== */
  const L = {};
  L.home = () => {
    const st = S(), nx = nextLesson(), lv = M.level(st.xp), b = badges();
    const days = ["M", "T", "W", "T", "F", "S", "S"], today = (new Date().getDay() + 6) % 7;
    const week = days.map((d, i) => { const on = i <= today && i > today - Math.min(st.streak, 7); return `<span class="${on ? "on" : ""} ${i === today ? "today" : ""}">${ic("local_fire_department")}${d}</span>`; }).join("");
    const lesson = nx ? COURSE.lessons[nx] : null, mod = nx ? moduleOf(nx) : null;
    const prog = pct(doneCount() / COURSE.order.length);
    const opps = M.opportunities.filter(o => o.match);
    return `
      <div class="panel hello-card graph">
        <div><h1>${greet()}, ${esc(M.people.learner.first)}</h1>
        <button type="button" class="note-btn" id="note">${esc(M.messages[st.msgIdx % M.messages.length])} ${ic("refresh")}</button></div>
        <div><p class="small muted" style="font-weight:700;margin-bottom:8px">${st.streak}-day streak</p><div class="streak-week" aria-label="${st.streak} day learning streak">${week}</div></div>
      </div>
      <div class="g g-main" style="margin-top:20px">
        <div class="stack">
          <div class="panel lift">
            ${nx ? `<div class="continue">
              <div class="thumb">${ic(TYPE[lesson.type][0])}</div>
              <div><span class="small muted" style="font-weight:700">Design Basics. Module ${mod.n}: ${esc(mod.title)}</span><h3>${esc(lesson.title)}</h3><span class="small muted">${TYPE[lesson.type][1]}, about ${lesson.mins} min, +${lesson.xp} XP</span>${bar(prog)}</div>
              <a class="btn magnetic" href="#/learner/lesson/${nx}">${doneCount() ? "Continue" : "Start"} ${ic("arrow_forward")}</a>
            </div>` : `<div class="continue"><div class="thumb" style="background:var(--good)">${ic("workspace_premium")}</div><div><span class="small muted" style="font-weight:700">Design Basics</span><h3>Course complete. You did it!</h3><span class="small muted">Your certificate is in your portfolio.</span></div><a class="btn" href="#/learner/portfolio">See certificate</a></div>`}
          </div>
          <div class="panel">
            <div class="panel-h"><h2>Your learning paths</h2><a href="#/learner/academy">Browse all</a></div>
            <div class="rows">
              <a class="row" href="#/learner/course">${ring(prog, prog + "%")}<span class="grow"><b>Design Basics</b><small>${doneCount()} of ${COURSE.order.length} lessons. Tutor: ${esc(COURSE.tutor)}</small></span><span class="trail"><span class="pill solid">Pilot</span></span></a>
              <div class="row"><span class="ico-dot">${ic("code")}</span><span class="grow"><b>Coding Basics</b><small>Saved. We'll tell you when it opens.</small></span><span class="trail"><span class="pill mute">Coming soon</span></span></div>
              <div class="row"><span class="ico-dot">${ic("savings")}</span><span class="grow"><b>Money Smarts</b><small>Saved. We'll tell you when it opens.</small></span><span class="trail"><span class="pill mute">Coming soon</span></span></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-h"><h2>Opportunities for you</h2><a href="#/learner/opportunities">See all</a></div>
            <div class="tickets" style="margin-top:0;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${opps.map(ticket).join("")}</div>
          </div>
        </div>
        <div class="stack">
          <div class="panel lift">
            <div class="panel-h"><h2>Level ${lv.level}</h2><span class="pill info num">${st.xp} XP</span></div>
            <div style="display:flex;gap:16px;align-items:center">${ring(pct(lv.into / lv.per), "Lv " + lv.level, true)}<p class="small muted">${lv.per - lv.into} XP to level ${lv.level + 1}. Lessons, quizzes and projects all count.</p></div>
          </div>
          <div class="panel">
            <div class="panel-h"><h2>Badges</h2><span class="small muted">${b.filter(x => x.on).length} of ${b.length}</span></div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">${b.map(x => `<div style="display:grid;justify-items:center;gap:6px;text-align:center;opacity:${x.on ? 1 : .35}" title="${x.on ? "Earned" : "Not earned yet"}"><span class="av" style="--c:${x.on ? x.c : "var(--ink-2)"};--s:52px">${ic(x.i, "fill")}</span><small style="font-weight:700;line-height:1.2">${x.n}</small></div>`).join("")}</div>
          </div>
          <div class="panel">
            <div class="panel-h"><h2>Recent activity</h2></div>
            <ul class="timeline-mini">${st.events.filter(e => e.who === "amara").slice(0, 5).map(e => `<li><span class="ico-dot">${ic(e.icon)}</span><span><b>${esc(e.text)}</b><small>${ago(e.at)}</small></span></li>`).join("")}</ul>
          </div>
        </div>
      </div>`;
  };
  L.home.after = () => {
    const n = $("#note");
    if (n) n.addEventListener("click", () => {
      const st = S(); st.msgIdx++; M.save();
      const span = M.messages[st.msgIdx % M.messages.length];
      if (!reduce()) n.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px) rotate(-1deg)" }], { duration: 200 }).finished.then(() => { n.innerHTML = `${esc(span)} ${ic("refresh")}`; n.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 350, easing: "cubic-bezier(.34,1.56,.64,1)" }); });
      else n.innerHTML = `${esc(span)} ${ic("refresh")}`;
    });
    bindTickets();
  };
  function ticket(o) {
    const saved = !!S().saved[o.id];
    return `<article class="ticket" data-id="${o.id}"><div class="ticket-main"><span class="ticket-type">${esc(o.type)}</span><h3>${esc(o.title)}</h3><p>${esc(o.text)}</p><dl><dt>Ages</dt><dd>${esc(o.ages)}</dd><dt>Skills</dt><dd>${esc(o.skills)}</dd></dl>
      <div class="post-actions" style="margin-top:10px"><button type="button" class="act" data-save="${o.id}" aria-pressed="${saved}">${ic("bookmark")}${saved ? "Saved" : "Save"}</button>${o.status ? `<span class="pill ${o.status === "Live" ? "good" : "warn"}">${esc(o.status)}</span>` : ""}</div></div>
      <div class="ticket-stub"><b>${esc(o.stub[0])}</b><small>${esc(o.stub[1])}</small></div></article>`;
  }
  function bindTickets(scope = document) {
    $$("[data-save]", scope).forEach(b => b.addEventListener("click", () => {
      const st = S(), id = b.dataset.save; st.saved[id] = !st.saved[id]; M.save();
      b.setAttribute("aria-pressed", String(!!st.saved[id])); b.innerHTML = `${ic("bookmark")}${st.saved[id] ? "Saved" : "Save"}`;
      if (st.saved[id] && !reduce()) b.animate([{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 350 });
    }));
  }

  L.academy = () => {
    const CAT = { design: "Design", tech: "Technology", media: "Media", business: "Business", money: "Money", growth: "Personal growth", comms: "Communication" };
    const pilot = `<a class="book" href="#/learner/course" style="--cover:var(--p-violet);text-decoration:none;color:inherit">
        <span class="book-cover"><span class="book-brand">MDT exercise book</span>${ic("design_services", "book-icon")}<span class="book-stamp" style="border-color:var(--c-mint);color:var(--c-mint)">Open now</span>
        <span class="book-label"><span class="row">Subject <span>Design Basics</span></span><span class="row">Class <span>Beginner</span></span><span class="row">Length <span>13 lessons</span></span></span></span>
        <span class="book-meta"><b>Design Basics</b><small>Design. Contrast, type, layout and colour, then a real poster.</small></span></a>`;
    const others = CATALOG.map(c => `<button type="button" class="book" data-soon="${esc(c.title)}" style="--cover:var(${c.cover})">
        <span class="book-cover"><span class="book-brand">MDT exercise book</span>${ic(c.icon, "book-icon")}<span class="book-stamp">Coming soon</span>
        <span class="book-label"><span class="row">Subject <span>${esc(c.title)}</span></span><span class="row">Class <span>${esc(c.level)}</span></span><span class="row">Length <span>${esc(c.length)}</span></span></span></span>
        <span class="book-meta"><b>${esc(c.title)}</b><small>${esc(CAT[c.cat])}. ${esc(c.blurb)}</small></span></button>`).join("");
    return `<div class="ph-head"><div><span class="kicker">the skill academy</span><h1>Pick a skill to learn</h1><p>Design Basics is open for the pilot. The rest are being written now.</p></div></div>
      <div class="books" style="margin-top:0">${pilot}${others}</div>`;
  };
  L.academy.after = () => $$("[data-soon]").forEach(b => b.addEventListener("click", () => {
    dialog(`<h2>${esc(b.dataset.soon)}</h2><p class="muted" style="margin-top:10px">This learning path is still being written. We'll let you know the moment it opens.</p><div class="acts"><button class="btn ghost small" type="button" data-close>Close</button><button class="btn small" type="button" data-notify>Notify me</button></div>`, (d, close) => $("[data-notify]", d).addEventListener("click", () => { close(); toast(`We'll tell you when ${b.dataset.soon} opens`, "notifications_active"); }));
  }));

  L.course = () => {
    const prog = pct(doneCount() / COURSE.order.length), nx = nextLesson();
    const mods = COURSE.modules.map(m => `<div class="module">
        <div class="module-h"><h2>${m.n < 5 ? "Module " + m.n + ": " : ""}${esc(m.title)}</h2><span class="hand">${esc(m.hand)}</span></div>
        <div class="lessons">${m.lessons.map(id => {
          const l = COURSE.lessons[id], d = isDone(id), u = unlocked(id), cur = id === nx;
          const cls = d ? "done" : cur ? "current" : !u ? "locked" : "";
          const right = d ? `<span class="pill good">${ic("check")}Done</span>` : !u ? `<span class="pill mute">${ic("lock")}Locked</span>` : `<span class="pill info">+${l.xp} XP</span>`;
          const inner = `<span class="lt">${ic(d ? "check" : TYPE[l.type][0], "fill")}</span><span><b>${esc(l.title)}</b><small>${TYPE[l.type][1]}, about ${l.mins} min</small></span>${right}`;
          return u ? `<a class="lesson ${cls}" href="#/learner/lesson/${id}">${inner}</a>` : `<div class="lesson ${cls}" aria-disabled="true" title="Finish the lessons before this one first">${inner}</div>`;
        }).join("")}</div></div>`).join("");
    const finished = doneCount() === COURSE.order.length;
    return `<a class="crumb" href="#/learner/academy">${ic("arrow_back")}Skill Academy</a>
      <div class="panel lift course-hero graph">
        <div class="book" style="--cover:var(--p-violet)"><span class="book-cover"><span class="book-brand">MDT exercise book</span>${ic("design_services", "book-icon")}<span class="book-label"><span class="row">Subject <span>Design Basics</span></span><span class="row">Class <span>Beginner</span></span></span></span></div>
        <div><span class="hand-note">${esc(COURSE.tagline)}</span><h1>Design Basics</h1><p class="muted" style="margin-top:8px;max-width:56ch">${esc(COURSE.about)}</p>
          <div class="row" style="border:0;padding:12px 0 0">${av("KN", "var(--book)", "sm")}<span><b>${esc(COURSE.tutor)}</b><small>Product designer. Your tutor</small></span></div></div>
        <div style="display:grid;justify-items:center;gap:10px">${ring(prog, prog + "%", true)}${nx ? `<a class="btn magnetic" href="#/learner/lesson/${nx}">${doneCount() ? "Continue" : "Start"} ${ic("arrow_forward")}</a>` : ""}</div>
      </div>
      ${finished ? `<div class="panel cert" style="margin-top:20px"><span class="hand">Congratulations, Amara!</span><h3>You finished Design Basics</h3><p class="muted" style="margin-top:6px">Your certificate is in your portfolio.</p><div class="cta-row" style="justify-content:center"><a class="btn" href="#/learner/portfolio">View certificate</a></div></div>` : ""}
      <div style="margin-top:32px">${mods}</div>`;
  };

  /* ---------- lesson (focus mode) ---------- */
  function lessonView(id) {
    const l = COURSE.lessons[id];
    if (!l) { location.hash = "#/learner/course"; return; }
    if (!unlocked(id)) { toast("Finish the lessons before this one first", "lock"); location.hash = "#/learner/course"; return; }
    const i = COURSE.order.indexOf(id), mod = moduleOf(id);
    app.innerHTML = `${protoBar("learner")}
      <div class="focus">
        <div class="focus-top">
          <a class="icon-btn" href="#/learner/course" aria-label="Back to the course">${ic("close")}</a>
          <div class="grow"><b>${esc(l.title)}</b><small>Design Basics. Lesson ${i + 1} of ${COURSE.order.length}</small></div>
          <div style="width:min(260px,30vw)" class="hide-sm">${bar(pct(doneCount() / COURSE.order.length))}</div>
          <span class="pill info num" id="xp-pill">${S().xp} XP</span>
        </div>
        <main class="focus-body view-in" id="main">
          <div class="lesson-intro"><div><span class="hand">${mod.n < 5 ? "Module " + mod.n + ": " + esc(mod.title) : "Final project"}</span><h1>${esc(l.title)}</h1></div>
            <div class="chips"><span class="chip">${ic(TYPE[l.type][0])}${TYPE[l.type][1]}</span><span class="chip">${ic("schedule")}${l.mins} min</span><span class="chip">${ic("bolt")}+${l.xp} XP</span></div></div>
          ${l.intro ? `<p class="lede" style="margin:-6px 0 20px">${esc(l.intro)}</p>` : ""}
          <div id="lesson-mount"></div>
          <div id="lesson-done"></div>
        </main>
      </div>`;
    bindProto();
    const mount = $("#lesson-mount"), doneBox = $("#lesson-done");
    const nextId = COURSE.order[i + 1];
    const finish = (msg, icon) => {
      const before = M.level(S().xp).level;
      const first = M.complete(id, l.xp, (l.type === "watch" ? "Watched" : l.type === "quiz" ? "Finished" : l.type === "practice" ? "Practised" : "Submitted") + ` "${l.title}"`, icon || (l.type === "watch" ? "play_circle" : l.type === "quiz" ? "bolt" : l.type === "practice" ? "touch_app" : "palette"));
      if (first) { S().todayMin = (S().todayMin || 8) + l.mins; M.save(); }
      doneBox.innerHTML = `<div class="done-bar">
          <div><span class="hand">${first ? "Nice work!" : "Done again!"}</span><p style="font-weight:600">${esc(msg)}</p></div>
          <div class="cta-row" style="margin:0">${first ? `<span class="pill solid num" id="xp-gain">+${l.xp} XP</span>` : ""}${nextId ? `<a class="btn magnetic" href="#/learner/lesson/${nextId}">Next: ${esc(COURSE.lessons[nextId].title)} ${ic("arrow_forward")}</a>` : `<a class="btn" href="#/learner/course">Back to the course</a>`}</div>
        </div>`;
      if (!reduce()) doneBox.firstElementChild.animate([{ opacity: 0, transform: "translateY(20px) scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: "cubic-bezier(.34,1.56,.64,1)" });
      $("#xp-pill").textContent = `${S().xp} XP`;
      if (first) {
        burst($("#xp-gain"), 60, .7);
        if (!reduce()) $("#xp-pill").animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: 500, easing: "cubic-bezier(.34,1.56,.64,1)" });
        const after = M.level(S().xp).level;
        if (after > before) setTimeout(() => { toast(`Level up! You're now level ${after}`, "military_tech"); burst($("#xp-pill"), 110, 1.1); }, 600);
      }
      doneBox.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "nearest" });
    };

    if (l.type === "watch") {
      const p = window.MotionPlayer(mount, l, {
        captions: S().captions[id],
        onProgress: f => { if (f > .92 && !doneBox.dataset.ready) { doneBox.dataset.ready = "1"; finish("You watched the whole lesson. Now try it yourself."); } }
      });
      cleanup.push(() => p.destroy());
      if (isDone(id)) doneBox.innerHTML = `<p class="small muted" style="margin-top:14px">You've already watched this one. Watch it again any time.</p>`;
    } else if (l.type === "practice") {
      l.tool(mount, msg => finish(msg));
    } else if (l.type === "quiz") {
      COURSE.renderQuiz(mount, COURSE.quizzes[id], (score, total) => {
        S().quiz[id] = score; M.save();
        mount.innerHTML = `<div class="quiz"><div class="panel lift q-card" style="text-align:center">${ring(pct(score / total), `${score}/${total}`, true)}<h2 style="margin-top:14px">${score === total ? "Perfect score!" : score >= 2 ? "Nicely done" : "You got there"}</h2><p class="muted" style="margin-top:6px">${score} of ${total} right first time.</p></div></div>`;
        const r = $(".ring", mount); burst(r, score === total ? 100 : 50, score === total ? 1 : .7);
        finish(score === total ? "Every answer right first time." : "Quiz finished. Every attempt counts.");
      });
    } else if (l.type === "project") {
      projectView(mount, finish);
    }
  }

  function projectView(mount, finish) {
    const st = S();
    if (st.project.status !== "none") {
      const fb = st.project.feedback;
      mount.innerHTML = `<div class="g g-2" style="align-items:start">
          <div class="canvas-wrap graph">${M.poster(st.project.data)}</div>
          <div class="stack">
            <div class="panel lift"><div class="panel-h"><h3>Your poster</h3><span class="pill ${fb ? "good" : "warn"}">${fb ? "Feedback ready" : "Waiting for feedback"}</span></div>
              <p class="muted">${fb ? `${esc(COURSE.tutor)} reviewed your poster ${ago(fb.at)}.` : `Sent to ${esc(COURSE.tutor)} ${ago(st.project.submittedAt)}. You'll get a notification when the feedback is in.`}</p>
              <div class="cta-row" style="margin-top:14px"><a class="btn ghost small" href="#/learner/portfolio">See it in your portfolio</a></div></div>
            ${fb ? feedbackCard(fb) : ""}
          </div></div>`;
      return;
    }
    COURSE.renderProject(mount, st.project.draft, (data, posterEl) => {
      const s = S();
      s.project = { status: "submitted", data, submittedAt: Date.now(), feedback: null };
      M.event("palette", `Submitted a poster: "${data.head}"`);
      M.save();
      burst(posterEl, 140, 1.2);
      finish("Your poster is on its way to your tutor, and it's already in your portfolio.", "palette");
      toast("Badge unlocked: First project", "workspace_premium");
      setTimeout(() => { mount.innerHTML = ""; projectView(mount, () => {}); }, reduce() ? 0 : 1600);
    });
  }
  function feedbackCard(fb) {
    return `<div class="feedback-card"><span class="hand">Feedback from ${esc(COURSE.tutor)}</span>
      <div class="chips" style="margin-top:10px">${Object.entries(fb.scores).map(([k, v]) => `<span class="chip">${ic(v === "Nailed it" ? "check_circle" : v === "Getting there" ? "trending_up" : "replay")}${esc(k)}: ${esc(v)}</span>`).join("")}</div>
      <p style="margin-top:12px">${esc(fb.text)}</p></div>`;
  }

  L.projects = () => {
    const st = S(), p = st.project;
    const pills = { none: ["mute", "Not started"], submitted: ["warn", "Waiting for feedback"], reviewed: ["good", "Feedback ready"] };
    const practice = [["l2", "Fix the poster", "contrast"], ["l5", "Build the hierarchy", "text_fields"], ["l8", "Line it up", "grid_view"], ["l11", "Build a palette", "palette"]];
    return `<div class="ph-head"><div><span class="kicker">your workspace</span><h1>Projects</h1><p>Every learning path ends with a real project. Practice pieces build up to it.</p></div></div>
      <div class="g g-main">
        <div class="panel lift">
          <div class="panel-h"><h2>Design a poster for your school</h2><span class="pill ${pills[p.status][0]}">${pills[p.status][1]}</span></div>
          <div class="g g-2" style="align-items:center">
            <div class="canvas-wrap graph" style="padding:16px">${p.data ? M.poster(p.data) : `<div class="empty"><span class="hand">blank page, big ideas</span>Your poster will appear here.</div>`}</div>
            <div><p class="muted">The final project for Design Basics. Pick an event, write it, design it, then send it to your tutor.</p>
              <div class="cta-row">${unlocked("l13") ? `<a class="btn" href="#/learner/lesson/l13">${p.status === "none" ? "Start the project" : "Open project"}</a>` : `<span class="pill mute">${ic("lock")}Unlocks after Module 4</span>`}</div></div>
          </div>
          ${p.feedback ? `<div style="margin-top:18px">${feedbackCard(p.feedback)}</div>` : ""}
        </div>
        <div class="panel"><div class="panel-h"><h2>Practice pieces</h2></div>
          <div class="rows">${practice.map(x => `<a class="row" href="#/learner/lesson/${x[0]}" ${unlocked(x[0]) ? "" : 'aria-disabled="true" onclick="return false" style="opacity:.5"'}><span class="ico-dot">${ic(x[2])}</span><span class="grow"><b>${x[1]}</b><small>${isDone(x[0]) ? "Done" : unlocked(x[0]) ? "Ready to try" : "Locked"}</small></span><span class="trail">${isDone(x[0]) ? `<span class="pill good">${ic("check")}Done</span>` : ""}</span></a>`).join("")}</div>
        </div>
      </div>`;
  };

  L.portfolio = () => {
    const st = S(), p = M.people.learner, lv = M.level(st.xp), b = badges().filter(x => x.on), finished = doneCount() === COURSE.order.length;
    return `<div class="panel lift graph" style="display:flex;flex-wrap:wrap;gap:20px;align-items:center">
        ${av(p.initials, p.c, "xl")}
        <div style="flex:1;min-width:200px"><span class="hand-note">portfolio of</span><h1 style="font-size:clamp(1.8rem,3.4vw,2.5rem);font-weight:800">${esc(p.name)}</h1><p class="muted">${p.age}, ${esc(p.city)}. Learning design.</p></div>
        <div class="stats" style="min-width:min(100%,380px)"><div class="stat"><span class="label">${ic("bolt")}XP</span><b>${st.xp}</b></div><div class="stat"><span class="label">${ic("military_tech")}Level</span><b>${lv.level}</b></div><div class="stat"><span class="label">${ic("workspace_premium")}Badges</span><b>${b.length}</b></div></div>
      </div>
      <h2 class="h3" style="margin-top:32px">Projects</h2>
      <div class="polaroids" style="margin-top:18px">
        ${st.project.data ? `<a class="polaroid" href="#/learner/lesson/l13" style="text-decoration:none;color:inherit">${M.poster(st.project.data)}<p class="cap">${esc(st.project.data.head)}<small>Design Basics final project${st.project.feedback ? ". Reviewed by your tutor" : ""}</small></p></a>` : `<div class="polaroid"><div class="pic" style="--c:var(--rule)">${ic("add_photo_alternate")}</div><p class="cap">Your first project goes here<small>Finish Design Basics to add it</small></p></div>`}
      </div>
      <h2 class="h3" style="margin-top:36px">Badges</h2>
      <div class="chips" style="margin-top:14px">${b.length ? b.map(x => `<span class="chip">${ic(x.i, "fill")}${x.n}</span>`).join("") : `<span class="muted">No badges yet. Your first one is one lesson away.</span>`}</div>
      <h2 class="h3" style="margin-top:36px">Certificates</h2>
      ${finished ? `<div class="panel cert" style="margin-top:14px;max-width:640px"><span class="hand">This certifies that</span><h3>${esc(p.name)}</h3><p class="muted" style="margin-top:8px">completed <b>Design Basics</b>: contrast, type, layout and colour, and designed an original poster.</p><p class="small" style="margin-top:14px">${esc(COURSE.tutor)}, tutor. MyDearTeenager</p></div>`
        : `<div class="panel" style="margin-top:14px;max-width:640px;border-style:dashed"><div class="empty"><span class="hand">almost...</span>Finish all ${COURSE.order.length} lessons of Design Basics to earn your certificate. ${doneCount()} done so far.</div></div>`}
      <p class="small muted" style="margin-top:24px">${ic("family_restroom")} Your parent or guardian can see your portfolio.</p>`;
  };

  function communityView(asTutor) {
    const st = S();
    const all = st.posts.concat(M.posts);
    const chans = ["All", "Design Basics", "Show your work", "General"];
    return `<div class="ph-head"><div><span class="kicker">${asTutor ? "learner questions" : "the community"}</span><h1>${asTutor ? "Questions" : "Community"}</h1><p>${asTutor ? "Answer questions from learners on your courses." : "Ask questions, share your work, cheer people on. Moderated, and kind by design."}</p></div></div>
      <div class="g g-main">
        <div class="stack">
          ${asTutor ? "" : `<div class="panel composer"><label class="label" for="post-text">Share something</label><textarea id="post-text" maxlength="400" placeholder="Ask a question or share what you made"></textarea>
            <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-top:10px"><select id="post-ch" class="chip" style="padding:8px 12px" aria-label="Channel">${chans.slice(1).map(c => `<option>${c}</option>`).join("")}</select><button class="btn small" type="button" id="post-go">Post</button></div>
            <p class="tiny muted" style="margin-top:8px">${ic("shield")} Keep personal details private. Be kind. <a href="#" id="rules-link">Community guidelines</a></p></div>`}
          <div class="tabs" role="group" aria-label="Channels">${chans.map((c, i) => `<button type="button" class="tab" data-ch="${c}" aria-pressed="${i === 0}">${c}</button>`).join("")}</div>
          <div class="feed" id="feed">${all.map(post).join("")}</div>
        </div>
        <div class="stack">
          <div class="panel"><div class="panel-h"><h3>Community guidelines</h3></div>
            <ol class="small" style="padding-left:1.2em;display:grid;gap:6px;margin:0"><li>Be kind</li><li>Keep personal details private</li><li>No bullying, hate or harassment</li><li>Credit other people's work</li><li>Keep it age-appropriate</li><li>Speak up: report what feels wrong</li></ol></div>
          <div class="panel"><div class="panel-h"><h3>Moderated</h3></div><p class="small muted">Real people review every report. You won't get in trouble for reporting.</p></div>
        </div>
      </div>`;
  }
  function post(p) {
    const st = S(), liked = !!st.likes[p.id], rep = !!st.reported[p.id];
    if (rep) return `<article class="panel post" data-ch="${esc(p.ch)}"><p class="muted small">${ic("flag")} You reported this post. A moderator will look at it.</p></article>`;
    const sub = p.poster != null ? `<div class="att">${M.poster(M.otherSubmissions[p.poster].poster)}</div>` : "";
    return `<article class="panel post" data-ch="${esc(p.ch)}" data-id="${p.id}">
      <div class="post-h">${av(p.initials, p.c, "sm")}<span><b>${esc(p.who)}</b><small>${esc(p.ch)}. ${esc(p.when)}</small></span>${p.mine ? `<span class="pill info" style="margin-left:auto">You</span>` : ""}</div>
      <p>${esc(p.text)}</p>${sub}
      ${p.tutorReply ? `<div class="panel" style="margin-top:12px;background:var(--wash);border:0;padding:12px 14px"><div class="post-h">${av("KN", "var(--book)", "sm")}<span><b>Kelechi Nwosu</b><small>Tutor</small></span></div><p style="margin-top:8px">${esc(p.tutorReply)}</p></div>` : ""}
      <div class="post-actions"><button type="button" class="act" data-like="${p.id}" aria-pressed="${liked}">${ic("favorite")}<span class="num">${(p.likes || 0) + (liked ? 1 : 0)}</span></button>${p.replies ? `<span class="act" style="cursor:default">${ic("chat_bubble")}${p.replies}</span>` : ""}${p.mine ? "" : `<button type="button" class="act report" data-report="${p.id}">${ic("flag")}Report</button>`}</div>
    </article>`;
  }
  function bindCommunity(asTutor) {
    const feed = $("#feed");
    const bindFeed = () => {
      $$("[data-like]", feed).forEach(b => b.addEventListener("click", () => {
        const st = S(), id = b.dataset.like; st.likes[id] = !st.likes[id]; M.save();
        const all = st.posts.concat(M.posts), p = all.find(x => x.id === id);
        b.setAttribute("aria-pressed", String(!!st.likes[id])); $(".num", b).textContent = (p.likes || 0) + (st.likes[id] ? 1 : 0);
        if (st.likes[id]) { burst(b, 16, .35); if (!reduce()) b.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 350, easing: "cubic-bezier(.34,1.56,.64,1)" }); }
      }));
      $$("[data-report]", feed).forEach(b => b.addEventListener("click", () => {
        const reasons = ["It's unkind or bullying", "It shares someone's personal details", "It's not appropriate for teens", "It's spam or a scam", "Something else"];
        dialog(`<h2>Report this post</h2><p class="muted" style="margin-top:6px">A moderator will review it. The person won't know who reported it.</p>
          <fieldset style="margin-top:16px"><legend class="label">What's wrong?</legend><div style="display:grid;gap:8px">${reasons.map((r, i) => `<label class="check"><input type="radio" name="why" value="${i}" ${i === 0 ? "checked" : ""}><span>${r}</span></label>`).join("")}</div></fieldset>
          <div class="acts"><button class="btn ghost small" type="button" data-close>Cancel</button><button class="btn small" type="button" data-send>Send report</button></div>`, (d, close) => {
          $("[data-send]", d).addEventListener("click", () => { S().reported[b.dataset.report] = true; M.save(); close(); toast("Thanks. A moderator will look at this.", "flag"); render(); });
        });
      }));
    };
    bindFeed();
    $$("[data-ch]", document).filter(x => x.classList.contains("tab")).forEach(t => t.addEventListener("click", () => {
      $$(".tab[data-ch]").forEach(x => x.setAttribute("aria-pressed", String(x === t)));
      $$(".post", feed).forEach(p => { p.hidden = !(t.dataset.ch === "All" || p.dataset.ch === t.dataset.ch); });
    }));
    const go = $("#post-go");
    if (go) go.addEventListener("click", () => {
      const ta = $("#post-text"), txt = ta.value.trim();
      if (!txt) { ta.focus(); toast("Write something first", "edit"); return; }
      if (/\b(\+?234|0)[789]\d{8,9}\b|@[a-z0-9_.]+\.(com|ng)/i.test(txt)) { toast("Keep personal details private. Remove phone numbers and emails.", "shield"); return; }
      const p = { id: "u" + Date.now(), who: "Amara Okafor", initials: "AO", c: "var(--p-violet)", ch: $("#post-ch").value, when: "Just now", text: txt, likes: 0, mine: true };
      S().posts.unshift(p); M.save(); ta.value = "";
      feed.insertAdjacentHTML("afterbegin", post(p));
      const el = feed.firstElementChild;
      if (!reduce()) el.animate([{ opacity: 0, transform: "translateY(-20px) rotate(-1deg)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: "cubic-bezier(.34,1.56,.64,1)" });
      bindFeed();
    });
    const rl = $("#rules-link"); if (rl) rl.addEventListener("click", e => { e.preventDefault(); dialog(`<h2>Community guidelines</h2><ol style="padding-left:1.2em;display:grid;gap:8px;margin-top:12px"><li><b>Be kind.</b> Disagree with ideas, not people.</li><li><b>Keep personal details private.</b> No addresses, phone numbers or school names.</li><li><b>No bullying, hate or harassment.</b></li><li><b>Credit other people's work.</b></li><li><b>Keep it age-appropriate.</b></li><li><b>Speak up.</b> Report anything that feels wrong.</li></ol><div class="acts"><button class="btn small" type="button" data-close>Got it</button></div>`); });
    if (asTutor) {
      $$(".post", feed).forEach(p => {
        if (p.dataset.id === "p2") return;
        const a = $(".post-actions", p);
        if (a) a.insertAdjacentHTML("afterbegin", `<button type="button" class="act" data-answer>${ic("reply")}Reply as tutor</button>`);
      });
      $$("[data-answer]").forEach(b => b.addEventListener("click", () => dialog(`<h2>Reply as tutor</h2><div class="field" style="margin-top:12px"><label for="ans">Your reply</label><textarea id="ans" rows="4"></textarea></div><div class="acts"><button class="btn ghost small" type="button" data-close>Cancel</button><button class="btn small" type="button" data-send>Post reply</button></div>`, (d, close) => $("[data-send]", d).addEventListener("click", () => { close(); toast("Reply posted"); }))));
    }
  }
  L.community = () => communityView(false);
  L.community.after = () => bindCommunity(false);

  L.opportunities = () => `<div class="ph-head"><div><span class="kicker">go further</span><h1>Opportunities</h1><p>Picked to match what you're learning. Save the ones you like.</p></div></div>
      <div class="tabs" role="group" aria-label="Filter" style="margin-bottom:6px"><button type="button" class="tab" data-of="all" aria-pressed="true">All</button><button type="button" class="tab" data-of="match" aria-pressed="false">Matched to you</button><button type="button" class="tab" data-of="saved" aria-pressed="false">Saved</button></div>
      <div class="tickets" id="opps">${M.opportunities.concat(S().schoolOpps.filter(o => o.status === "Live")).map(ticket).join("")}</div>`;
  L.opportunities.after = () => {
    bindTickets();
    $$("[data-of]").forEach(b => b.addEventListener("click", () => {
      $$("[data-of]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const f = b.dataset.of, all = M.opportunities.concat(S().schoolOpps);
      $$("#opps .ticket").forEach(t => { const o = all.find(x => x.id === t.dataset.id); t.hidden = !(f === "all" || (f === "match" && o && o.match) || (f === "saved" && S().saved[t.dataset.id])); });
    }));
  };

  L.profile = () => {
    const st = S(), p = M.people.learner;
    const interests = ["Design", "Content creation", "Entrepreneurship", "Coding", "Money", "AI tools", "Communication", "Personal growth"];
    const on = ["Design", "Content creation", "Entrepreneurship"];
    return `<div class="ph-head"><div><span class="kicker">you</span><h1>Settings</h1></div></div>
      <div class="g g-2" style="align-items:start">
        <div class="stack">
          <div class="panel"><div class="panel-h"><h2>Profile</h2></div>
            <div class="row" style="border:0">${av(p.initials, p.c, "lg")}<span class="grow"><b>${esc(p.name)}</b><small>${p.age}, ${esc(p.city)}</small></span></div>
            <p class="label" style="margin-top:12px">Interests</p><div class="chips">${interests.map(i => `<button type="button" class="act" data-int aria-pressed="${on.includes(i)}">${esc(i)}</button>`).join("")}</div></div>
          <div class="panel"><div class="panel-h"><h2>Parent or guardian</h2></div><div class="row" style="border:0">${av("NO", "var(--book-3)")}<span class="grow"><b>Ngozi Okafor</b><small>Confirmed your account</small></span><span class="pill good">${ic("check")}Linked</span></div></div>
        </div>
        <div class="panel"><div class="panel-h"><h2>Notifications and wellbeing</h2></div>
          ${toggle("badges", "Badge and level-up alerts", "A quick note when you earn something")}
          ${toggle("breaks", "Take-a-break reminder", "A nudge after 45 minutes of learning")}
          ${toggle("digest", "Weekly round-up", "One email a week with your progress")}
          <div class="cta-row" style="margin-top:20px"><button class="btn ghost small" type="button" data-data>Download my data</button><button class="btn ghost small" type="button" data-del>Delete my account</button></div>
        </div>
      </div>`;
  };
  function toggle(k, title, sub) { return `<div class="switch"><span><b>${title}</b><small>${sub}</small></span><label class="tg"><input type="checkbox" data-set="${k}" ${S().settings[k] ? "checked" : ""} aria-label="${title}"><span></span></label></div>`; }
  function bindToggles() {
    $$("[data-set]").forEach(i => i.addEventListener("change", () => { S().settings[i.dataset.set] = i.checked; M.save(); toast(i.checked ? "Turned on" : "Turned off", i.checked ? "toggle_on" : "toggle_off"); }));
    $$("[data-int]").forEach(b => b.addEventListener("click", () => b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"))));
    $$("[data-data]").forEach(b => b.addEventListener("click", () => toast("In the real app, this emails you a copy of your data", "download")));
    $$("[data-del]").forEach(b => b.addEventListener("click", () => dialog(`<h2>Delete this account?</h2><p class="muted" style="margin-top:8px">In the real app this permanently deletes the account and its projects. In this prototype nothing is deleted.</p><div class="acts"><button class="btn small" type="button" data-close>Keep my account</button></div>`)));
  }
  L.profile.after = bindToggles;

  /* ======================================================================
     PARENT
     ====================================================================== */
  const P = {};
  const weekMinutes = () => { const st = S(); return [14, 22, 0, 18, 26, 20, st.todayMin || 8]; };
  const weekLabels = () => { const d = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], t = (new Date().getDay() + 6) % 7; return d.slice(t + 1).concat(d.slice(0, t + 1)).map((x, i, a) => i === a.length - 1 ? "Today" : x); };
  P.home = () => {
    const st = S(), mins = weekMinutes().reduce((a, b) => a + b, 0), lv = M.level(st.xp), pend = st.consent.chidi === "pending";
    return `<div class="panel hello-card graph"><div><h1>${greet()}, ${esc(M.people.parent.first)}</h1><p class="note-btn" style="cursor:default">Here's how your children are getting on this week.</p></div></div>
      ${pend ? `<div class="panel lift" id="consent-card" style="margin-top:20px;border:2px solid var(--ink)">
        <div class="panel-h"><h2>Chidi wants to join MyDearTeenager</h2><span class="pill warn">${ic("schedule")}Needs your OK</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:20px;align-items:center">${av("CO", "var(--book-2)", "lg")}
          <div style="flex:1;min-width:220px"><p>Chidi (13) signed up on Monday through Sunrise College. Until you say yes, we only keep his first name, age and your email.</p>
          <details style="margin-top:8px"><summary class="small" style="cursor:pointer;font-weight:700">What we'll store if you say yes</summary><ul class="small muted" style="margin:8px 0 0;padding-left:1.2em"><li>His name, age and school</li><li>His learning progress, projects and badges</li><li>Posts he makes in the moderated community</li></ul></details></div>
          <div class="cta-row" style="margin:0"><button class="btn ghost small" type="button" id="c-no">Not now</button><button class="btn small" type="button" id="c-yes">Say yes</button></div></div>
      </div>` : ""}
      <div class="g g-2" style="margin-top:20px">
        <div class="panel lift">
          <div class="post-h">${av("AO", "var(--p-violet)", "lg")}<span><b style="font-size:1.2rem">Amara</b><small>15. Design Basics</small></span><span class="pill good" style="margin-left:auto">${ic("check")}Active</span></div>
          <div class="stats" style="margin-top:18px;grid-template-columns:repeat(3,1fr)"><div class="stat"><span class="label">This week</span><b>${mins}</b><small>minutes</small></div><div class="stat"><span class="label">Lessons</span><b>${doneCount()}</b><small>of ${COURSE.order.length}</small></div><div class="stat"><span class="label">Streak</span><b>${st.streak}</b><small>days</small></div></div>
          <div class="cta-row" style="margin-top:16px"><a class="btn small" href="#/parent/child">See Amara's progress</a></div>
        </div>
        <div class="panel lift">
          <div class="post-h">${av("CO", "var(--book-2)", "lg")}<span><b style="font-size:1.2rem">Chidi</b><small>13. Sunrise College</small></span>${pend ? `<span class="pill warn" style="margin-left:auto">Waiting for you</span>` : st.consent.chidi === "declined" ? `<span class="pill mute" style="margin-left:auto">Not joined</span>` : `<span class="pill good" style="margin-left:auto">${ic("check")}Approved</span>`}</div>
          <div class="empty"><span class="hand">${pend ? "not started yet" : st.consent.chidi === "declined" ? "maybe later" : "all set!"}</span>${pend ? "Chidi can start once you say yes." : st.consent.chidi === "declined" ? "You said not now. You can change this any time in Consent and privacy." : "Chidi can start learning now. You'll see his progress here."}</div>
        </div>
      </div>
      <div class="g g-main" style="margin-top:20px">
        <div class="panel"><div class="panel-h"><h2>Latest from Amara</h2><a href="#/parent/child">More</a></div>
          <ul class="timeline-mini">${st.events.filter(e => e.who === "amara").slice(0, 5).map(e => `<li><span class="ico-dot">${ic(e.icon)}</span><span><b>${esc(e.text)}</b><small>${ago(e.at)}</small></span></li>`).join("")}</ul></div>
        <div class="panel"><div class="panel-h"><h2>Amara's latest work</h2></div>
          ${st.project.data ? `<div class="canvas-wrap graph" style="padding:16px">${M.poster(st.project.data)}</div>${st.project.feedback ? `<p class="small" style="margin-top:12px">${ic("rate_review")} Reviewed by her tutor.</p>` : `<p class="small muted" style="margin-top:12px">Waiting for tutor feedback.</p>`}` : `<div class="empty"><span class="hand">coming soon</span>Amara's first project will show up here when she finishes it.</div>`}</div>
      </div>
      <div class="panel" style="margin-top:20px"><div class="panel-h"><h2>Level and XP</h2></div><div style="display:flex;gap:16px;align-items:center">${ring(pct(lv.into / lv.per), "Lv " + lv.level, true)}<p class="muted">Amara has ${st.xp} XP. XP only comes from finishing lessons, quizzes and projects, never from time spent scrolling.</p></div></div>`;
  };
  P.home.after = () => {
    const yes = $("#c-yes"), no = $("#c-no");
    if (yes) yes.addEventListener("click", () => {
      const card = $("#consent-card");
      S().consent.chidi = "confirmed"; M.event("family_restroom", "Mum approved Chidi's account", "parent"); M.save();
      card.insertAdjacentHTML("beforeend", `<span class="stamp" style="position:absolute;right:30px;top:30px;background:var(--sheet)">Approved</span>`);
      const stamp = $(".stamp", card);
      if (!reduce()) stamp.animate([{ transform: "scale(2.6) rotate(-40deg)", opacity: 0 }, { transform: "scale(.92) rotate(-12deg)", opacity: 1, offset: .7 }, { transform: "rotate(-12deg)", opacity: 1 }], { duration: 520, easing: "cubic-bezier(.3,1.4,.6,1)" });
      burst(stamp, 80, .9);
      toast("Chidi's account is approved");
      const here = location.hash;
      setTimeout(() => { if (location.hash === here) render(); }, reduce() ? 0 : 1600);
    });
    if (no) no.addEventListener("click", () => dialog(`<h2>Not now?</h2><p class="muted" style="margin-top:8px">We'll delete what Chidi entered. He can ask again later, and you can change your mind in Consent and privacy.</p><div class="acts"><button class="btn ghost small" type="button" data-close>Go back</button><button class="btn small" type="button" data-ok>Decline for now</button></div>`, (d, close) => $("[data-ok]", d).addEventListener("click", () => { S().consent.chidi = "declined"; M.save(); close(); toast("Okay. Nothing was kept.", "delete"); render(); })));
  };
  P.child = () => {
    const st = S(), lv = M.level(st.xp), vals = weekMinutes(), labs = weekLabels();
    const modRows = COURSE.modules.map(m => [m.n < 5 ? `${m.n}. ${m.title}` : m.title, pct(m.lessons.filter(isDone).length / m.lessons.length)]);
    return `<div class="ph-head"><div style="display:flex;gap:16px;align-items:center">${av("AO", "var(--p-violet)", "lg")}<div><span class="kicker">progress</span><h1>Amara</h1></div></div><a class="btn ghost small" href="#/parent/home">${ic("arrow_back")}Back</a></div>
      <div class="stats"><div class="stat"><span class="label">${ic("military_tech")}Level</span><b>${lv.level}</b><small>${st.xp} XP</small></div><div class="stat"><span class="label">${ic("menu_book")}Lessons</span><b>${doneCount()}/${COURSE.order.length}</b><small>Design Basics</small></div><div class="stat"><span class="label">${ic("local_fire_department")}Streak</span><b>${st.streak}</b><small>days</small></div><div class="stat"><span class="label">${ic("schedule")}This week</span><b>${vals.reduce((a, b) => a + b, 0)}</b><small>minutes</small></div></div>
      <div class="g g-2" style="margin-top:20px;align-items:start">
        <div class="panel"><div class="panel-h"><h2>Minutes learning this week</h2></div>${columnChart(vals, labs, { label: "Minutes learning per day this week", unit: "Minutes" })}<p class="small muted" style="margin-top:8px">Short and regular is the sweet spot.</p></div>
        <div class="panel"><div class="panel-h"><h2>Design Basics by module</h2></div>${hbars(modRows)}</div>
      </div>
      <div class="g g-main" style="margin-top:20px">
        <div class="panel"><div class="panel-h"><h2>Activity</h2></div><ul class="timeline-mini">${st.events.filter(e => e.who === "amara").slice(0, 8).map(e => `<li><span class="ico-dot">${ic(e.icon)}</span><span><b>${esc(e.text)}</b><small>${ago(e.at)}</small></span></li>`).join("")}</ul></div>
        <div class="panel"><div class="panel-h"><h2>Settings for Amara</h2></div>${toggle("posting", "Community posting", "Amara can post in the moderated community")}${toggle("breaks", "Take-a-break reminders", "A nudge after 45 minutes")}${toggle("weekly", "Weekly summary email", "Sent to you every Sunday")}</div>
      </div>
      ${st.project.data ? `<div class="panel" style="margin-top:20px"><div class="panel-h"><h2>Projects</h2></div><div class="g g-2" style="align-items:start"><div class="canvas-wrap graph" style="padding:16px">${M.poster(st.project.data)}</div><div>${st.project.feedback ? feedbackCard(st.project.feedback) : `<p class="muted">Waiting for feedback from Amara's tutor.</p>`}</div></div></div>` : ""}`;
  };
  P.child.after = () => { bindChart($("#main"), weekMinutes(), weekLabels(), "min"); bindToggles(); };
  P.consent = () => {
    const st = S();
    const row = (n, ini, c, status, date) => `<div class="row">${av(ini, c)}<span class="grow"><b>${n}</b><small>${date}</small></span><span class="trail">${status === "confirmed" ? `<span class="pill good">${ic("check")}Consent given</span>` : status === "pending" ? `<span class="pill warn">Waiting for you</span>` : `<span class="pill mute">Declined</span>`}</span></div>`;
    return `<div class="ph-head"><div><span class="kicker">your family's data</span><h1>Consent and privacy</h1><p>Nigerian data protection law means nothing about your child is kept without your OK. Here's what you've agreed to.</p></div></div>
      <div class="g g-2" style="align-items:start">
        <div class="stack">
          <div class="panel"><div class="panel-h"><h2>Your children</h2></div><div class="rows">${row("Amara Okafor", "AO", "var(--p-violet)", "confirmed", "Consent given in September")}${row("Chidi Okafor", "CO", "var(--book-2)", st.consent.chidi, st.consent.chidi === "pending" ? "Asked to join this week" : st.consent.chidi === "confirmed" ? "Consent given today" : "You declined")}</div>
            ${st.consent.chidi !== "confirmed" ? `<div class="cta-row"><a class="btn small" href="#/parent/home">Review Chidi's request</a></div>` : ""}</div>
          <div class="panel"><div class="panel-h"><h2>What we keep</h2></div><ul class="ticks" style="margin-top:0"><li>${ic("check_circle")}Name, age and school</li><li>${ic("check_circle")}Learning progress, projects and badges</li><li>${ic("check_circle")}Posts in the moderated community</li><li>${ic("block")}Never sold. No ads aimed at your child.</li></ul><p class="ph-block small" style="margin-top:14px">Placeholder: confirm the no-ads promise and retention periods before launch.</p></div>
        </div>
        <div class="panel"><div class="panel-h"><h2>Your rights</h2></div>
          <div class="rows">
            <button type="button" class="row" data-act="download"><span class="ico-dot">${ic("download")}</span><span class="grow"><b>Download Amara's data</b><small>A copy of everything we hold</small></span>${ic("chevron_right")}</button>
            <button type="button" class="row" data-act="correct"><span class="ico-dot">${ic("edit")}</span><span class="grow"><b>Correct something</b><small>Name, age or school is wrong</small></span>${ic("chevron_right")}</button>
            <button type="button" class="row" data-act="withdraw"><span class="ico-dot">${ic("block")}</span><span class="grow"><b>Withdraw consent</b><small>Close the account and delete the data</small></span>${ic("chevron_right")}</button>
          </div></div>
      </div>`;
  };
  P.consent.after = () => $$("[data-act]").forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.act;
    if (a === "withdraw") dialog(`<h2>Withdraw consent for Amara?</h2><p class="muted" style="margin-top:8px">This closes her account and deletes her projects, badges and progress. It can't be undone. In this prototype nothing is deleted.</p><div class="acts"><button class="btn small" type="button" data-close>Keep her account</button></div>`);
    else toast(a === "download" ? "In the real app, we'd email you a copy" : "In the real app, this opens a correction form", a === "download" ? "download" : "edit");
  }));
  P.settings = () => `<div class="ph-head"><div><span class="kicker">you</span><h1>Settings</h1></div></div>
      <div class="g g-2" style="align-items:start">
        <div class="panel"><div class="panel-h"><h2>Emails and alerts</h2></div>${toggle("weekly", "Weekly summary", "Every Sunday: minutes, lessons and projects")}${toggle("badges", "Big moments", "When your child finishes a course or project")}${toggle("digest", "Safety notices", "If a moderator needs to tell you something")}</div>
        <div class="panel"><div class="panel-h"><h2>Your account</h2></div><div class="row" style="border:0">${av("NO", "var(--book-3)", "lg")}<span class="grow"><b>Ngozi Okafor</b><small>Parent of Amara and Chidi</small></span></div><p class="small muted" style="margin-top:12px">A parent view is planned for a later release in your product roadmap. This prototype shows what it could look like.</p></div>
      </div>`;
  P.settings.after = bindToggles;

  /* ======================================================================
     TUTOR
     ====================================================================== */
  const T = {};
  const funnel = [["1. Why some posters disappear", 128], ["2. Fix the poster", 119], ["3. Contrast check", 112], ["4. Words have a voice", 104], ["5. Build the hierarchy", 96], ["6. Type check", 92], ["7. Give things room", 85], ["8. Line it up", 80], ["9. Layout check", 77], ["10. Colour with a purpose", 70], ["11. Build a palette", 66], ["12. Colour check", 61], ["13. Final project", 38]];
  T.home = () => {
    const pr = pendingReviews();
    return `<div class="panel hello-card graph"><div><h1>${greet()}, ${esc(M.people.tutor.first)}</h1><p class="note-btn" style="cursor:default">${pr.length ? `${pr.length} project${pr.length > 1 ? "s are" : " is"} waiting for your feedback.` : "You're all caught up. Nice."}</p></div><a class="btn" href="#/tutor/reviews">Review projects</a></div>
      <div class="stats" style="margin-top:20px"><div class="stat"><span class="label">${ic("groups")}Learners</span><b>128</b><small>on Design Basics</small></div><div class="stat"><span class="label">${ic("bolt")}Active this week</span><b>74</b><small>58% of learners</small></div><div class="stat"><span class="label">${ic("quiz")}Quiz average</span><b>86%</b><small>first-time right</small></div><div class="stat"><span class="label">${ic("rate_review")}To review</span><b>${pr.length}</b><small>projects</small></div></div>
      <div class="g g-main" style="margin-top:20px">
        <div class="panel"><div class="panel-h"><h2>Learners who reached each lesson</h2></div>${hbars(funnel, 128, "")}<p class="hint small" style="margin-top:16px"><b>Biggest drop:</b> between the colour quiz and the final project (61 to 38). A short project walkthrough video could help.</p></div>
        <div class="stack">
          <div class="panel"><div class="panel-h"><h2>Review queue</h2><a href="#/tutor/reviews">See all</a></div><div class="rows">${pr.slice(0, 4).map(r => `<a class="row" href="#/tutor/review/${r.id}">${av(r.initials, r.c, "sm")}<span class="grow"><b>${esc(r.who)}</b><small>${esc(r.poster.head)}. ${esc(r.when)}</small></span>${ic("chevron_right")}</a>`).join("") || `<div class="empty"><span class="hand">all clear</span>No projects waiting.</div>`}</div></div>
          <div class="panel"><div class="panel-h"><h2>Latest question</h2><a href="#/tutor/community">All questions</a></div><div class="post-h">${av("DE", "var(--book)", "sm")}<span><b>David Eze</b><small>Design Basics. 3 h ago</small></span></div><p class="small" style="margin-top:10px">${esc(M.posts[1].text)}</p></div>
        </div>
      </div>`;
  };
  T.reviews = () => {
    const pr = pendingReviews(), done = Object.entries(S().reviewed);
    return `<div class="ph-head"><div><span class="kicker">feedback</span><h1>Reviews</h1><p>Projects from Design Basics learners. Start with what works, then one thing to try next.</p></div></div>
      <div class="panel"><div class="panel-h"><h2>Waiting for you</h2><span class="pill warn">${pr.length}</span></div>
        <div class="rows">${pr.map(r => `<a class="row" href="#/tutor/review/${r.id}"><div style="width:64px;flex-shrink:0">${M.poster(r.poster)}</div><span class="grow"><b>${esc(r.who)}</b><small>"${esc(r.poster.head)}". Submitted ${esc(r.when)}</small></span><span class="trail"><span class="pill info">${M.posterChecks(r.poster).filter(c => c.ok).length}/6 checks</span>${ic("chevron_right")}</span></a>`).join("") || `<div class="empty"><span class="hand">all clear</span>Nothing waiting. Go and get a cup of tea.</div>`}</div></div>
      ${done.length ? `<div class="panel" style="margin-top:20px"><div class="panel-h"><h2>Reviewed</h2></div><div class="rows">${done.map(([id, v]) => `<div class="row"><span class="ico-dot">${ic("check")}</span><span class="grow"><b>${esc(v.who)}</b><small>Feedback sent ${ago(v.at)}</small></span></div>`).join("")}</div></div>` : ""}`;
  };
  T.review = id => {
    const r = pendingReviews().find(x => x.id === id);
    if (!r) return `<div class="empty"><span class="hand">already done</span>This project has been reviewed. <a href="#/tutor/reviews">Back to reviews</a></div>`;
    const checks = M.posterChecks(r.poster);
    const crit = ["Contrast", "Hierarchy", "Layout", "Colour"], lv = ["Nailed it", "Getting there", "Try again"];
    const guess = { Contrast: checks[0].ok ? 0 : 2, Hierarchy: checks[1].ok && checks[2].ok ? 0 : 1, Layout: checks[3].ok ? 0 : 1, Colour: checks[5].ok ? 0 : 1 };
    return `<a class="crumb" href="#/tutor/reviews">${ic("arrow_back")}Reviews</a>
      <div class="ph-head"><div style="display:flex;gap:14px;align-items:center">${av(r.initials, r.c, "lg")}<div><span class="kicker">reviewing</span><h1>${esc(r.who)}</h1></div></div><span class="pill info">Submitted ${esc(r.when)}</span></div>
      <div class="g g-2" style="align-items:start">
        <div class="stack"><div class="canvas-wrap graph">${M.poster(r.poster)}</div>
          <div class="panel"><div class="panel-h"><h3>Automatic checks</h3><span class="pill info">${checks.filter(c => c.ok).length} of 6</span></div><ul class="checks">${checks.map(c => `<li class="${c.ok ? "ok" : ""}">${ic(c.ok ? "check_circle" : "radio_button_unchecked")}<span>${c.label}${c.ok ? "" : `<br><small class="muted">${c.tip}</small>`}</span></li>`).join("")}</ul></div></div>
        <div class="panel lift" id="review-panel">
          <div class="panel-h"><h3>Your feedback</h3></div>
          <div class="rubric">${crit.map(c => `<div class="rub"><b>${c}</b><div class="seg" data-crit="${c}">${lv.map((l, i) => `<button type="button" aria-pressed="${guess[c] === i}">${l}</button>`).join("")}</div></div>`).join("")}</div>
          <p class="label" style="margin-top:20px">Starters</p>
          <div class="chips">${["Start with what works: ", "One thing to try next: ", "I love how you ", "Try the squint test on "].map(s => `<button type="button" class="act" data-starter="${esc(s)}">${esc(s.trim())}</button>`).join("")}</div>
          <div class="field" style="margin-top:14px"><label for="fb">Comment for ${esc(r.who.split(" ")[0])}</label><textarea id="fb" rows="5" placeholder="Be specific, kind and useful."></textarea></div>
          <div class="cta-row" style="margin-top:16px"><button class="btn magnetic" type="button" id="send-fb">Send feedback ${ic("send")}</button></div>
        </div>
      </div>`;
  };
  T.review.after = id => {
    const r = pendingReviews().find(x => x.id === id); if (!r) return;
    $$("[data-crit]").forEach(g => $$("button", g).forEach(b => b.addEventListener("click", () => $$("button", g).forEach(x => x.setAttribute("aria-pressed", String(x === b))))));
    $$("[data-starter]").forEach(b => b.addEventListener("click", () => { const t = $("#fb"); t.value = (t.value ? t.value.trimEnd() + " " : "") + b.dataset.starter; t.focus(); }));
    $("#send-fb").addEventListener("click", () => {
      const txt = $("#fb").value.trim();
      if (txt.length < 10) { toast("Write a short comment first", "edit"); $("#fb").focus(); return; }
      const scores = {}; $$("[data-crit]").forEach(g => { const p = $("button[aria-pressed=true]", g); scores[g.dataset.crit] = p ? p.textContent : "Getting there"; });
      const st = S();
      st.reviewed[id] = { who: r.who, at: Date.now() };
      if (id === "amara") { st.project.status = "reviewed"; st.project.feedback = { scores, text: txt, at: Date.now() }; M.event("rate_review", "Got feedback from Kelechi on her poster"); }
      M.save();
      const panel = $("#review-panel");
      panel.insertAdjacentHTML("beforeend", `<span class="stamp" style="position:absolute;right:24px;top:20px;background:var(--sheet)">Sent</span>`);
      const s = $(".stamp", panel);
      if (!reduce()) s.animate([{ transform: "scale(2.6) rotate(-40deg)", opacity: 0 }, { transform: "scale(.92) rotate(-12deg)", opacity: 1, offset: .7 }, { transform: "rotate(-12deg)", opacity: 1 }], { duration: 520, easing: "cubic-bezier(.3,1.4,.6,1)" });
      burst(s, 70, .8); toast(`Feedback sent to ${r.who.split(" ")[0]}`, "send");
      const here = location.hash;
      setTimeout(() => { if (location.hash === here) location.hash = "#/tutor/reviews"; }, reduce() ? 0 : 1500);
    });
  };
  let selLesson = "l1";
  T.builder = () => {
    const mods = COURSE.modules.map(m => `<div class="builder-mod" data-mod="${m.n}"><div class="panel-h" style="margin-bottom:4px"><h3>${m.n < 5 ? "Module " + m.n + ": " : ""}${esc(m.title)}</h3><button class="link" type="button" data-add="${m.n}">${ic("add")} Add</button></div>
      <div class="b-list">${m.lessons.map(id => { const l = COURSE.lessons[id]; return `<div class="b-lesson" draggable="true" data-id="${id}" ${id === selLesson ? 'style="border-color:var(--ink);box-shadow:2px 2px 0 var(--ink)"' : ""}><span class="grip">${ic("drag_indicator")}</span><span class="ico-dot" style="width:32px;height:32px">${ic(TYPE[l.type][0])}</span><span class="grow"><b>${esc(l.title)}</b><small class="muted">${TYPE[l.type][1]}</small></span><button type="button" class="act" data-edit="${id}">${ic("edit")}Edit</button></div>`; }).join("")}</div></div>`).join("");
    return `<div class="ph-head"><div><span class="kicker">course builder</span><h1>Design Basics</h1><p>Drag lessons to reorder. Edit a motion lesson's captions and preview it straight away.</p></div><span class="pill good">${ic("public")}Published</span></div>
      <div class="g g-2" style="align-items:start"><div id="b-mods">${mods}</div><div class="panel lift" id="b-editor" style="position:sticky;top:110px"></div></div>`;
  };
  T.builder.after = () => {
    const editor = $("#b-editor");
    let preview = null;
    const openEditor = id => {
      selLesson = id;
      $$(".b-lesson").forEach(b => { const on = b.dataset.id === id; b.style.borderColor = on ? "var(--ink)" : ""; b.style.boxShadow = on ? "2px 2px 0 var(--ink)" : ""; });
      if (preview) { preview.destroy(); preview = null; }
      const l = COURSE.lessons[id];
      if (!l) { editor.innerHTML = `<div class="empty"><span class="hand">new lesson</span>Start writing your new lesson here.</div>`; return; }
      if (l.type !== "watch") { editor.innerHTML = `<div class="panel-h"><h3>${esc(l.title)}</h3><span class="pill info">${TYPE[l.type][1]}</span></div><p class="muted">${l.type === "quiz" ? `${COURSE.quizzes[id].length} questions. ` : ""}Interactive ${TYPE[l.type][1].toLowerCase()} lessons are set up with the MDT team. Motion lessons can be edited here.</p>${l.type === "quiz" ? `<ol class="small" style="padding-left:1.2em;margin-top:12px;display:grid;gap:6px">${COURSE.quizzes[id].map(q => `<li>${esc(q.q)}</li>`).join("")}</ol>` : ""}`; return; }
      const caps = S().captions[id] || {};
      editor.innerHTML = `<div class="panel-h"><h3>${esc(l.title)}</h3><span class="pill info">Motion lesson</span></div>
        <div id="b-preview"></div>
        <p class="label" style="margin-top:18px">Scene captions</p>
        ${l.scenes.map((s, i) => `<div class="scene-edit"><span class="n">${i + 1}</span><textarea rows="4" data-scene="${i}" aria-label="Caption for scene ${i + 1}">${esc(caps[i] != null ? caps[i] : s.cap.map(c => c[1]).join(" "))}</textarea></div>`).join("")}
        <div class="cta-row" style="margin-top:12px"><button class="btn small" type="button" id="b-save">Save and preview</button><button class="btn ghost small" type="button" id="b-reset">Reset captions</button></div>`;
      const mk = () => { if (preview) preview.destroy(); preview = window.MotionPlayer($("#b-preview"), l, { captions: S().captions[id] }); cleanup.push(() => preview && preview.destroy()); };
      mk();
      $("#b-save").addEventListener("click", () => { const c = {}; $$("[data-scene]", editor).forEach(t => { const orig = l.scenes[+t.dataset.scene].cap.map(x => x[1]).join(" "); if (t.value.trim() && t.value.trim() !== orig) c[t.dataset.scene] = t.value.trim(); }); S().captions[id] = c; M.save(); mk(); preview.play(); toast("Saved. Learners see the new captions now.", "save"); });
      $("#b-reset").addEventListener("click", () => { delete S().captions[id]; M.save(); openEditor(id); toast("Captions reset", "restart_alt"); });
    };
    $$("[data-edit]").forEach(b => b.addEventListener("click", () => openEditor(b.dataset.edit)));
    openEditor(selLesson);
    // drag to reorder within a module (prototype only, not saved)
    let dragEl = null;
    $$(".b-lesson").forEach(el => {
      el.addEventListener("dragstart", e => { dragEl = el; el.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", el.dataset.id); } catch (_) {} });
      el.addEventListener("dragend", () => { el.classList.remove("dragging"); dragEl = null; });
    });
    $$(".b-list").forEach(list => list.addEventListener("dragover", e => {
      if (!dragEl || dragEl.parentElement !== list) return;
      e.preventDefault();
      const after = $$(".b-lesson:not(.dragging)", list).find(c => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
      const first = new Map($$(".b-lesson", list).map(c => [c, c.getBoundingClientRect().top]));
      if (after) list.insertBefore(dragEl, after); else list.appendChild(dragEl);
      if (!reduce()) $$(".b-lesson", list).forEach(c => { const d = first.get(c) - c.getBoundingClientRect().top; if (d && c !== dragEl) c.animate([{ transform: `translateY(${d}px)` }, { transform: "none" }], { duration: 250, easing: "cubic-bezier(.16,1,.3,1)" }); });
    }));
    $$("[data-add]").forEach(b => b.addEventListener("click", () => {
      const types = [["watch", "Motion lesson", "An animated explainer with captions"], ["video", "Video", "Upload a recorded lesson"], ["reading", "Reading", "Text, images and downloads"], ["quiz", "Quiz", "Quick multiple-choice check"], ["project", "Project", "A brief learners submit for feedback"]];
      dialog(`<h2>Add a lesson</h2><div class="rows" style="margin-top:12px">${types.map(t => `<button type="button" class="row" data-type="${t[0]}"><span class="ico-dot">${ic(TYPE[t[0]] ? TYPE[t[0]][0] : t[0] === "video" ? "videocam" : "article")}</span><span class="grow"><b>${t[1]}</b><small>${t[2]}</small></span></button>`).join("")}</div><div class="acts"><button class="btn ghost small" type="button" data-close>Cancel</button></div>`, (d, close) => $$("[data-type]", d).forEach(x => x.addEventListener("click", () => {
        close();
        const list = $(`[data-mod="${b.dataset.add}"] .b-list`);
        list.insertAdjacentHTML("beforeend", `<div class="b-lesson" data-id="new"><span class="grip">${ic("drag_indicator")}</span><span class="ico-dot" style="width:32px;height:32px">${ic("add")}</span><span class="grow"><b>Untitled ${$("b", x).textContent.toLowerCase()}</b><small class="muted">Draft</small></span><span class="pill warn">Draft</span></div>`);
        const n = list.lastElementChild; if (!reduce()) n.animate([{ opacity: 0, transform: "translateY(-10px) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: "cubic-bezier(.34,1.56,.64,1)" });
        toast("Draft lesson added");
      })));
    }));
  };
  T.learners = () => {
    const st = S();
    const rows = M.tutorLearners.map(l => { const p = l[3] == null ? pct(doneCount() / COURSE.order.length) : l[3]; const stale = /(\d+) days/.test(l[4]) && +l[4].match(/(\d+)/)[1] >= 7; return { n: l[0], i: l[1], c: l[2], p, last: l[3] == null ? "Today" : l[4], stale }; });
    return `<div class="ph-head"><div><span class="kicker">your learners</span><h1>Learners</h1><p>Spot who's flying and who might need a nudge.</p></div></div>
      <div class="panel"><div class="table-wrap"><table class="t"><thead><tr><th>Learner</th><th>Progress</th><th>Last active</th><th>Status</th><th></th></tr></thead><tbody>
        ${rows.map(r => `<tr><td><span class="who">${av(r.i, r.c, "sm")}<b>${esc(r.n)}</b></span></td><td><div style="display:flex;gap:10px;align-items:center">${bar(r.p)}<span class="num small">${r.p}%</span></div></td><td class="small">${esc(r.last)}</td><td>${r.p === 100 ? `<span class="pill good">Finished</span>` : r.stale ? `<span class="pill warn">Needs a nudge</span>` : `<span class="pill info">On track</span>`}</td><td>${r.stale ? `<button class="act" type="button" data-nudge="${esc(r.n)}" ${st.nudged[r.n] ? "disabled" : ""}>${ic("waving_hand")}${st.nudged[r.n] ? "Nudged" : "Send a nudge"}</button>` : ""}</td></tr>`).join("")}
      </tbody></table></div></div>`;
  };
  T.learners.after = () => $$("[data-nudge]").forEach(b => b.addEventListener("click", () => { S().nudged[b.dataset.nudge] = true; M.save(); b.disabled = true; b.innerHTML = `${ic("waving_hand")}Nudged`; toast(`Friendly nudge sent to ${b.dataset.nudge.split(" ")[0]}`, "waving_hand"); burst(b, 20, .4); }));
  T.community = () => communityView(true);
  T.community.after = () => bindCommunity(true);

  /* ======================================================================
     SCHOOL / ORGANISATION
     ====================================================================== */
  const SC = {};
  const allGroups = () => M.groups.concat(S().extraGroups || []);
  SC.home = () => {
    const g = allGroups(), students = g.reduce((a, x) => a + x.students, 0), pending = g.reduce((a, x) => a + (x.students - x.confirmed), 0);
    return `<div class="panel hello-card graph"><div><h1>${greet()}, ${esc(M.people.school.first)}</h1><p class="note-btn" style="cursor:default">${esc(M.people.school.org)}. Pilot programme, first term.</p></div><a class="btn" href="#/school/groups">Manage groups</a></div>
      <div class="stats" style="margin-top:20px"><div class="stat"><span class="label">${ic("groups")}Students</span><b>${students}</b><small>in ${g.length} groups</small></div><div class="stat"><span class="label">${ic("bolt")}Active this week</span><b>41</b><small>of ${students}</small></div><div class="stat"><span class="label">${ic("shield")}Consent pending</span><b>${pending}</b><small>parents to confirm</small></div><div class="stat"><span class="label">${ic("palette")}Projects</span><b>23</b><small>submitted this term</small></div></div>
      <div class="g g-main" style="margin-top:20px">
        <div class="panel"><div class="panel-h"><h2>Average progress by group</h2></div>${hbars(g.map(x => [x.name, x.progress]))}</div>
        <div class="stack">
          <div class="panel"><div class="panel-h"><h2>Waiting on parents</h2></div><p class="small muted">Students can't start until a parent or guardian confirms.</p><div class="rows" style="margin-top:8px">${M.groupStudents.filter(s => s[4] === "pending").map(s => `<div class="row">${av(s[1], s[2], "sm")}<span class="grow"><b>${esc(s[0])}</b><small>JSS3 Design Club</small></span></div>`).join("")}</div><div class="cta-row"><button class="btn small" type="button" data-remind-all>Remind all parents</button></div></div>
          <div class="panel"><div class="panel-h"><h2>Your listings</h2><a href="#/school/opportunities">Manage</a></div>${S().schoolOpps.map(o => `<div class="row" style="border:0"><span class="ico-dot">${ic("emoji_events")}</span><span class="grow"><b>${esc(o.title)}</b><small>${esc(o.type)}</small></span><span class="pill ${o.status === "Live" ? "good" : "warn"}">${esc(o.status)}</span></div>`).join("")}</div>
        </div>
      </div>`;
  };
  SC.home.after = () => { const b = $("[data-remind-all]"); if (b) b.addEventListener("click", () => { toast("Reminder sent to 3 parents", "mail"); b.disabled = true; b.textContent = "Reminders sent"; }); };
  SC.groups = () => `<div class="ph-head"><div><span class="kicker">your programme</span><h1>Groups</h1><p>Each group follows one learning path with a teacher in charge.</p></div><button class="btn" type="button" id="new-group">${ic("add")}New group</button></div>
      <div class="g g-3">${allGroups().map(g => `<a class="panel lift" href="#/school/group/${g.id}" style="text-decoration:none;color:inherit;display:grid;gap:12px">
        <div class="panel-h" style="margin:0"><h2>${esc(g.name)}</h2>${ic("chevron_right")}</div>
        <span class="small muted">${esc(g.course)}. ${esc(g.teacher)}</span>
        <div style="display:flex;gap:10px;align-items:center">${bar(g.progress)}<b class="num small">${g.progress}%</b></div>
        <div class="chips"><span class="chip">${ic("groups")}${g.students} students</span>${g.students - g.confirmed ? `<span class="chip">${ic("shield")}${g.students - g.confirmed} pending</span>` : ""}</div></a>`).join("")}</div>`;
  SC.groups.after = () => $("#new-group").addEventListener("click", () => dialog(`<h2>New group</h2><div class="fields tight" style="margin-top:14px"><div class="field"><label for="g-name">Group name</label><input type="text" id="g-name" placeholder="For example: JSS2 Coding Club"></div><div class="field"><label for="g-course">Learning path</label><select id="g-course"><option>Design Basics</option>${CATALOG.map(c => `<option>${esc(c.title)}</option>`).join("")}</select></div><div class="field"><label for="g-teacher">Teacher in charge</label><input type="text" id="g-teacher"></div></div><div class="acts"><button class="btn ghost small" type="button" data-close>Cancel</button><button class="btn small" type="button" data-make>Create group</button></div>`, (d, close) => $("[data-make]", d).addEventListener("click", () => {
    const name = $("#g-name", d).value.trim(); if (!name) { $("#g-name", d).focus(); return; }
    const st = S(); st.extraGroups = st.extraGroups || [];
    st.extraGroups.push({ id: "g" + Date.now(), name, course: $("#g-course", d).value, students: 0, confirmed: 0, progress: 0, teacher: $("#g-teacher", d).value.trim() || "Not set" });
    M.save(); close(); toast("Group created. Share the invite code with students."); render();
  })));
  SC.group = id => {
    const g = allGroups().find(x => x.id === id) || M.groups[0];
    const code = "SUN-" + g.name.replace(/[^A-Z0-9]/gi, "").slice(0, 4).toUpperCase() + "-" + (4821 + g.students);
    const isMain = g.id === "jss3-design";
    const studs = isMain ? M.groupStudents.map(s => s[3] == null ? [s[0], s[1], s[2], pct(doneCount() / COURSE.order.length), s[4]] : s).map(s => s[0] === "Chidi Okafor" && S().consent.chidi === "confirmed" ? [s[0], s[1], s[2], s[3], "confirmed"] : s) : [];
    return `<a class="crumb" href="#/school/groups">${ic("arrow_back")}Groups</a>
      <div class="ph-head"><div><span class="kicker">${esc(g.course)}</span><h1>${esc(g.name)}</h1><p>Teacher in charge: ${esc(g.teacher)}</p></div></div>
      <div class="g g-main">
        <div class="panel">${studs.length ? `<div class="table-wrap"><table class="t"><thead><tr><th>Student</th><th>Progress</th><th>Parent consent</th><th></th></tr></thead><tbody>${studs.map(s => `<tr><td><span class="who">${av(s[1], s[2], "sm")}<b>${esc(s[0])}</b></span></td><td><div style="display:flex;gap:10px;align-items:center">${bar(s[3])}<span class="num small">${s[3]}%</span></div></td><td>${s[4] === "confirmed" ? `<span class="pill good">${ic("check")}Confirmed</span>` : `<span class="pill warn">Pending</span>`}</td><td>${s[4] === "pending" ? `<button class="act" type="button" data-remind="${esc(s[0])}">${ic("mail")}Remind parent</button>` : ""}</td></tr>`).join("")}</tbody></table></div><p class="tiny muted" style="margin-top:10px">Showing 8 of ${g.students} students.</p>` : `<div class="empty"><span class="hand">no one yet</span>Share the invite code so students can join.</div>`}</div>
        <div class="stack">
          <div class="panel lift"><div class="panel-h"><h3>Invite students</h3></div><p class="small muted">Students enter this code when they sign up. Their parents still need to confirm.</p><div class="code" style="margin-top:12px" id="code">${code}</div><div class="cta-row" style="margin-top:12px"><button class="btn small" type="button" id="copy">${ic("content_copy")}Copy code</button></div></div>
          <div class="panel"><div class="panel-h"><h3>Group progress</h3></div><div style="display:flex;gap:16px;align-items:center">${ring(g.progress, g.progress + "%", true)}<p class="small muted">Average across the group. ${g.students - g.confirmed} students are waiting for parent consent.</p></div></div>
        </div>
      </div>`;
  };
  SC.group.after = () => {
    $$("[data-remind]").forEach(b => b.addEventListener("click", () => { b.disabled = true; b.innerHTML = `${ic("check")}Reminded`; toast(`Reminder sent to ${b.dataset.remind.split(" ")[0]}'s parent`, "mail"); }));
    const c = $("#copy"); if (c) c.addEventListener("click", async () => {
      const code = $("#code").textContent;
      try { await navigator.clipboard.writeText(code); toast("Code copied", "content_copy"); }
      catch (_) { const r = document.createRange(); r.selectNodeContents($("#code")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Code selected. Copy it with your keyboard.", "content_copy"); }
    });
  };
  SC.opportunities = () => `<div class="ph-head"><div><span class="kicker">for organisations</span><h1>Opportunities</h1><p>List competitions, challenges, scholarships and events for teens. Every listing is checked before it goes live.</p></div></div>
      <div class="g g-2" style="align-items:start">
        <div class="panel lift"><div class="panel-h"><h2>New listing</h2></div>
          <div class="fields tight">
            <div class="field"><label for="o-type">Type</label><select id="o-type"><option>Skill challenge</option><option>Competition</option><option>Scholarship</option><option>Workshop</option><option>Volunteering</option><option>Internship</option></select></div>
            <div class="field"><label for="o-title">Title</label><input type="text" id="o-title" maxlength="50" value="Science Week Video Challenge"></div>
            <div class="field"><label for="o-text">What's it about?</label><input type="text" id="o-text" maxlength="110" value="Make a 60-second video explaining one science idea to a younger student."></div>
            <div class="field-row"><div class="field"><label for="o-ages">Who can apply</label><input type="text" id="o-ages" value="JSS1 to SS3"></div><div class="field"><label for="o-days">Days to apply</label><input type="text" id="o-days" inputmode="numeric" value="14"></div></div>
          </div>
          <div class="cta-row" style="margin-top:16px"><button class="btn magnetic" type="button" id="o-send">Submit for review</button></div>
        </div>
        <div class="stack"><p class="label">Preview</p><div id="o-prev"></div>
          <div class="panel"><div class="panel-h"><h2>Your listings</h2></div><div class="tickets" style="margin-top:0;grid-template-columns:1fr" id="o-list">${S().schoolOpps.map(ticket).join("")}</div></div></div>
      </div>`;
  SC.opportunities.after = () => {
    const read = () => ({ id: "new", type: $("#o-type").value, title: $("#o-title").value || "Untitled", text: $("#o-text").value, ages: $("#o-ages").value, skills: "Any", stub: [String(parseInt($("#o-days").value, 10) || 0), "days left"] });
    const draw = () => { $("#o-prev").innerHTML = ticket(read()); };
    ["#o-type", "#o-title", "#o-text", "#o-ages", "#o-days"].forEach(s => $(s).addEventListener("input", draw));
    draw();
    bindTickets($("#o-list"));
    $("#o-send").addEventListener("click", () => {
      const o = read(); o.id = "so" + Date.now(); o.status = "In review";
      S().schoolOpps.unshift(o); M.save();
      const list = $("#o-list"); list.insertAdjacentHTML("afterbegin", ticket(o));
      const el = list.firstElementChild; burst($("#o-send"), 60, .8);
      if (!reduce()) el.animate([{ opacity: 0, transform: "translateY(-30px) rotate(-3deg)" }, { opacity: 1, transform: "none" }], { duration: 600, easing: "cubic-bezier(.34,1.56,.64,1)" });
      toast("Submitted. Our team checks every listing before it goes live.", "fact_check");
    });
  };
  SC.settings = () => `<div class="ph-head"><div><span class="kicker">${esc(M.people.school.org)}</span><h1>Settings</h1></div></div>
      <div class="g g-2" style="align-items:start">
        <div class="panel"><div class="panel-h"><h2>Organisation</h2></div><div class="row" style="border:0">${av("SC", "var(--book-2)", "lg")}<span class="grow"><b>${esc(M.people.school.org)}</b><small>Partner school. Pilot programme</small></span></div><div class="rows" style="margin-top:10px"><div class="row"><span class="grow"><b>Programme lead</b><small>Tunde Bello</small></span></div><div class="row"><span class="grow"><b>Teachers</b><small>Mrs Adeyemi, Mr Okon, Mrs Lawal</small></span></div></div></div>
        <div class="panel"><div class="panel-h"><h2>Notifications</h2></div>${toggle("weekly", "Weekly programme report", "Progress and consent status, every Monday")}${toggle("digest", "Safety notices", "If a moderator needs to reach you")}</div>
      </div>`;
  SC.settings.after = bindToggles;

  /* ======================================================================
     ROUTER
     ====================================================================== */
  const VIEWS = { learner: L, parent: P, tutor: T, school: SC };
  function render() {
    cleanup.forEach(f => { try { f(); } catch (_) {} }); cleanup = [];
    $$(".role-menu, .dlg-back").forEach(n => n.remove());
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    const role = parts[0], page = parts[1] || "home", id = parts[2];
    if (!VIEWS[role]) { startView(); window.scrollTo(0, 0); return; }
    if (role === "learner" && page === "lesson") { lessonView(id); window.scrollTo(0, 0); return; }
    const V = VIEWS[role], view = V[page] || V.home;
    const navPage = page === "review" ? "reviews" : page === "group" ? "groups" : page;
    app.innerHTML = shell(role, navPage, view(id));
    bindShell(role);
    if (view.after) view.after(id);
    window.scrollTo(0, 0);
    const main = $("#main"); if (main) main.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", render);
  render();
})();
