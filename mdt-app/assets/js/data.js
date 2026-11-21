/* Sample data + prototype state. Everything here is invented for the prototype.
   State is kept in this browser only (localStorage) so the demo remembers progress between visits. */
(() => {
  "use strict";
  const KEY = "mdt-proto-v1";

  const people = {
    learner: { id: "amara", role: "learner", name: "Amara Okafor", first: "Amara", initials: "AO", c: "var(--p-violet)", age: 15, city: "Lagos", label: "Learner, 15" },
    parent: { id: "ngozi", role: "parent", name: "Ngozi Okafor", first: "Ngozi", initials: "NO", c: "var(--book-3)", label: "Parent of Amara and Chidi" },
    tutor: { id: "kelechi", role: "tutor", name: "Kelechi Nwosu", first: "Kelechi", initials: "KN", c: "var(--book)", label: "Tutor, Design Basics" },
    school: { id: "sunrise", role: "school", name: "Tunde Bello", first: "Tunde", org: "Sunrise College, Ikeja", initials: "SC", c: "var(--book-2)", label: "Programme lead" }
  };

  const children = [
    { id: "amara", name: "Amara Okafor", first: "Amara", age: 15, initials: "AO", c: "var(--p-violet)", school: "Sunrise College" },
    { id: "chidi", name: "Chidi Okafor", first: "Chidi", age: 13, initials: "CO", c: "var(--book-2)", school: "Sunrise College" }
  ];

  // Other learners' posters for the tutor review queue (sample)
  const otherSubmissions = [
    { id: "s-zainab", who: "Zainab Yusuf", initials: "ZY", c: "var(--book-3)", age: 14, when: "2 hours ago", poster: { head: "Book Club", sub: "This term: Purple Hibiscus", body: "Bring a friend and your opinions.", details: ["Every Thursday", "3:30pm", "Library"], bg: "#F2B53D", fg: "#201D4B", accent: "#201D4B", headSize: 17, font: "display", align: "left", grouped: true, cta: "All welcome" } },
    { id: "s-emeka", who: "Emeka Obi", initials: "EO", c: "var(--book)", age: 16, when: "Yesterday", poster: { head: "Inter-house Sports", sub: "Blue house is coming for the cup", body: "Cheer loud, wear your house colour.", details: ["Sat 22 Nov", "8am", "School field"], bg: "#E7E1F8", fg: "#CFC6EE", accent: "#6A2BDB", headSize: 14, font: "display", align: "center", grouped: false, cta: "Be there" } },
    { id: "s-fola", who: "Fola Adebayo", initials: "FA", c: "var(--book-2)", age: 15, when: "2 days ago", poster: { head: "Science Fair", sub: "Year 10 projects on show", body: "Robots, rockets and one very loud volcano.", details: ["Fri 14 Nov", "10am to 2pm", "School hall"], bg: "#2E4FA3", fg: "#FCFBFE", accent: "#F2B53D", headSize: 18, font: "display", align: "left", grouped: true, cta: "Free entry" } }
  ];

  const tutorLearners = [
    ["Amara Okafor", "AO", "var(--p-violet)", null, "Today"],
    ["Zainab Yusuf", "ZY", "var(--book-3)", 100, "Today"],
    ["Fola Adebayo", "FA", "var(--book-2)", 92, "Yesterday"],
    ["Emeka Obi", "EO", "var(--book)", 85, "Yesterday"],
    ["Halima Sani", "HS", "var(--book-3)", 62, "2 days ago"],
    ["David Eze", "DE", "var(--p-violet)", 54, "3 days ago"],
    ["Ifeoma Nnaji", "IN", "var(--book-2)", 38, "5 days ago"],
    ["Seyi Ogun", "SO", "var(--book)", 23, "9 days ago"],
    ["Musa Garba", "MG", "var(--book-3)", 15, "12 days ago"],
    ["Blessing Udo", "BU", "var(--p-violet)", 8, "16 days ago"]
  ];

  const groups = [
    { id: "jss3-design", name: "JSS3 Design Club", course: "Design Basics", students: 24, confirmed: 21, progress: 58, teacher: "Mrs Adeyemi" },
    { id: "ss1-content", name: "SS1 Content Club", course: "Digital Content Creation", students: 18, confirmed: 18, progress: 31, teacher: "Mr Okon" },
    { id: "ss2-business", name: "SS2 Young Founders", course: "Teen Entrepreneurship 101", students: 15, confirmed: 12, progress: 12, teacher: "Mrs Lawal" }
  ];
  const groupStudents = [
    ["Amara Okafor", "AO", "var(--p-violet)", null, "confirmed"],
    ["Chidi Okafor", "CO", "var(--book-2)", 0, "pending"],
    ["Halima Sani", "HS", "var(--book-3)", 62, "confirmed"],
    ["David Eze", "DE", "var(--book)", 54, "confirmed"],
    ["Ifeoma Nnaji", "IN", "var(--book-2)", 38, "confirmed"],
    ["Musa Garba", "MG", "var(--book-3)", 15, "pending"],
    ["Tolu Akande", "TA", "var(--p-violet)", 71, "confirmed"],
    ["Ngozi Eze", "NE", "var(--book)", 0, "pending"]
  ];

  const posts = [
    { id: "p1", who: "Zainab Yusuf", initials: "ZY", c: "var(--book-3)", ch: "Show your work", when: "1h", text: "Finished my Book Club poster! I changed the background three times before the text was readable lol. Squint test is a cheat code.", poster: 0, likes: 24 },
    { id: "p2", who: "David Eze", initials: "DE", c: "var(--book)", ch: "Design Basics", when: "3h", text: "Question: is it ok to use two different bold fonts if one is only for the date?", likes: 6, replies: 4, tutorReply: "Good question! Two typefaces max is the rule of thumb. Try the same font in a different weight for the date instead. Kelechi" },
    { id: "p3", who: "Halima Sani", initials: "HS", c: "var(--book-3)", ch: "General", when: "Yesterday", text: "7 day streak today. Started because my mum said I was on TikTok too much. Now I'm making TikTok graphics instead.", likes: 41 },
    { id: "p4", who: "Tolu Akande", initials: "TA", c: "var(--p-violet)", ch: "Show your work", when: "2 days", text: "Tried the 60-30-10 rule on my cousin's birthday flyer. She actually used it!", likes: 33 }
  ];

  const opportunities = [
    { id: "o1", type: "Competition", title: "Young Creators Poster Challenge", text: "Design a poster that gets people talking about a cause you care about.", ages: "13 to 18", skills: "Design", stub: ["14", "days left"], match: true },
    { id: "o2", type: "Workshop", title: "Digital Skills Saturday", text: "Hands-on sessions in design, video and coding.", ages: "13 to 18", skills: "Design, video", stub: ["Sat", "10am"], match: true },
    { id: "o3", type: "Scholarship", title: "Future Leaders Scholarship", text: "Support for a teen who's started something in their community.", ages: "15 to 18", skills: "Any", stub: ["30", "days left"] },
    { id: "o4", type: "Volunteering", title: "Website for a local charity", text: "Help a small charity build a simple site, with a mentor checking in.", ages: "16 to 18", skills: "Coding", stub: ["6", "weeks"] }
  ];

  const messages = [
    "Small steps count. Show up today and future you will thank you.",
    "You don't have to be great to start. You have to start to get great.",
    "Done is better than perfect. Finish one lesson, then decide.",
    "Every designer you admire started with a messy first poster.",
    "Curious beats clever. Ask the question in the community."
  ];

  /* ---------- colour helpers ---------- */
  const hexToRgb = h => { h = h.replace("#", ""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const lum = h => hexToRgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const onColor = bg => contrast(bg, "#201D4B") >= contrast(bg, "#FCFBFE") ? "#201D4B" : "#FCFBFE";

  /* ---------- shared poster renderer ---------- */
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const FONTS = { display: "var(--display)", serif: "Georgia, 'Times New Roman', serif", hand: "var(--hand)" };
  function poster(p, extra = "") {
    const det = (p.details || []).filter(Boolean);
    const detailsHTML = p.grouped !== false
      ? `<div class="p-details" style="background:color-mix(in srgb, ${p.fg} 12%, transparent)">${det.map(d => `<span>${esc(d)}</span>`).join("")}</div>`
      : `<div class="p-details" style="margin-top:auto;background:none;padding:0;gap:9cqw;font-size:4.2cqw">${det.map((d, i) => `<span style="align-self:${i % 2 ? "flex-end" : "flex-start"}">${esc(d)}</span>`).join("")}</div>`;
    return `<div class="poster-a4 ${extra}" style="background:${p.bg};color:${p.fg};text-align:${p.align || "left"}">
      <div class="p-head" style="font-size:${p.headSize || 16}cqw;font-family:${FONTS[p.font] || FONTS.display}">${esc(p.head)}</div>
      <div class="p-sub" style="font-size:${p.subSize || 6}cqw">${esc(p.sub)}</div>
      <div class="p-body" style="font-size:${p.bodySize || 4.4}cqw">${esc(p.body)}</div>
      ${detailsHTML}
      ${p.cta ? `<div class="p-btn" style="background:${p.accent};color:${onColor(p.accent)};align-self:${p.align === "center" ? "center" : "flex-start"}">${esc(p.cta)}</div>` : ""}
    </div>`;
  }
  function posterChecks(p) {
    const det = (p.details || []).filter(s => s && s.trim());
    return [
      { k: "contrast", ok: contrast(p.bg, p.fg) >= 4.5, label: "Text is easy to read", tip: `Contrast is ${contrast(p.bg, p.fg).toFixed(1)}:1. Aim for 4.5:1 or more.` },
      { k: "hierarchy", ok: (p.headSize || 16) >= 12, label: "Headline is clearly the biggest thing", tip: "Make the headline bigger so it's read first." },
      { k: "short", ok: (p.head || "").trim().length > 0 && (p.head || "").length <= 22, label: "Headline is short and punchy", tip: "Keep the headline to 22 characters or fewer." },
      { k: "grouped", ok: p.grouped !== false, label: "Event details are grouped together", tip: "Keep date, time and place close together." },
      { k: "details", ok: det.length >= 3, label: "Date, time and place are all there", tip: "Add the date, time and place." },
      { k: "accent", ok: contrast(p.accent, p.bg) >= 3, label: "Accent colour stands out", tip: "Pick an accent that's very different from the background." }
    ];
  }

  /* ---------- state ---------- */
  const presets = {
    fresh: () => ({ done: {}, xp: 120, streak: 2 }),
    module1: () => ({ done: { l1: true, l2: true, l3: true }, xp: 340, streak: 5 }),
    finished: () => {
      const done = {}; for (let i = 1; i <= 13; i++) done["l" + i] = true;
      return { done, xp: 1180, streak: 12 };
    }
  };
  function fresh(preset = "module1") {
    const p = presets[preset]();
    const now = Date.now();
    const project = preset === "finished"
      ? { status: "reviewed", data: { tpl: "science", head: "Art Exhibition", sub: "JSS3 shows its best work", body: "Paintings, posters and one giant mural.", details: ["Fri 28 Nov", "11am to 3pm", "Main hall"], bg: "#201D4B", fg: "#FCFBFE", accent: "#F2B53D", headSize: 17, font: "display", align: "left", grouped: true, cta: "Free entry" }, submittedAt: now - 864e5 * 2, feedback: { scores: { Contrast: "Nailed it", Hierarchy: "Nailed it", Layout: "Getting there", Colour: "Nailed it" }, text: "Really strong first poster, Amara. The yellow button pulls the eye exactly where it should. Next time, give the body text a little more space from the headline.", at: now - 864e5 } }
      : { status: "none", data: null, submittedAt: null, feedback: null };
    return {
      v: 1, preset, done: p.done, xp: p.xp, streak: p.streak, quiz: {}, practice: {},
      project, consent: { chidi: "pending" }, likes: {}, saved: { o1: true }, reported: {},
      reviewed: {}, nudged: {}, posts: [], schoolOpps: [{ id: "so1", type: "Skill challenge", title: "Inter-house Poster Challenge", text: "Design the official poster for this year's inter-house sports.", ages: "JSS1 to SS3", skills: "Design", stub: ["21", "days left"], status: "Live" }],
      captions: {}, msgIdx: 0, settings: { weekly: true, badges: true, breaks: true, posting: true, digest: true },
      events: [
        { at: now - 864e5 * 3, who: "amara", icon: "play_circle", text: "Watched \"Why some posters disappear\"" },
        { at: now - 864e5 * 2, who: "amara", icon: "bolt", text: "Passed the Contrast quiz" },
        { at: now - 864e5 * 1, who: "amara", icon: "local_fire_department", text: "Hit a 5-day streak" }
      ]
    };
  }
  let state;
  try { state = JSON.parse(localStorage.getItem(KEY)); } catch (_) { state = null; }
  if (!state || state.v !== 1) state = fresh();
  const listeners = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} listeners.forEach(f => f(state)); };
  const level = xp => ({ level: Math.floor(xp / 250) + 1, into: xp % 250, per: 250 });

  window.MDT = {
    people, children, otherSubmissions, tutorLearners, groups, groupStudents, posts, opportunities, messages,
    contrast, onColor, poster, posterChecks, esc, level,
    get state() { return state; },
    save, on: f => listeners.add(f), off: f => listeners.delete(f),
    reset(preset) { state = fresh(preset); save(); },
    event(icon, text, who = "amara") { state.events.unshift({ at: Date.now(), who, icon, text }); },
    complete(id, xp, text, icon = "check_circle") {
      const first = !state.done[id];
      if (first) { state.done[id] = true; state.xp += xp; MDT.event(icon, text); }
      save(); return first;
    }
  };
})();
