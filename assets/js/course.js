/* Design Basics: the pilot course. Four motion lessons, four practice tools, four quizzes and a final project.
   Scene coordinates: left/top in % of the 16:9 stage, sizes in cqw (1cqw = 1% of stage width). */
(() => {
  "use strict";
  const NAVY = "#201D4B", VIOLET = "#6A2BDB", PAPER = "#FCFBFE", LILAC = "#E7E1F8", LOWFG = "#CFC6EE", SUN = "#F2B53D",
    CORAL = "#E8662B", ROYAL = "#2E4FA3", FOREST = "#1D7A4C", MINT = "#5FD39A", INK2 = "#55527A", RED = "#B4234A";
  const at = (l, t, extra = "") => `left:${l}%;top:${t}%;${extra}`;
  const ic = (n, s = "") => `<span class="ms fill" aria-hidden="true" style="width:auto;${s}">${n}</span>`;

  /* small scene helpers */
  const title = (S, txt, l = 6, t = 9, w = 88, t0 = 0) => { const e = S.el("div", "sc sc-mid", at(l, t, `width:${w}%`), txt); S.write(e, t0, .9); return e; };
  const card = (S, l, t, w, h, bg, extra = "") => S.el("div", "sc sc-paper", at(l, t, `width:${w}%;height:${h}%;background:${bg};${extra}`));
  const stamp = (S, ok, l, t, t0) => { const e = S.el("div", `sc sc-stamp ${ok ? "yes" : "no"}`, at(l, t), ic(ok ? "check" : "close", "font-size:5cqw")); S.pop(e, t0); return e; };
  const chip = (S, txt, l, t, t0, extra = "") => { const e = S.el("div", "sc sc-chip", at(l, t, extra), txt); S.pop(e, t0); return e; };
  const hand = (S, txt, l, t, t0, extra = "") => { const e = S.el("div", "sc sc-hand", at(l, t, extra), txt); S.write(e, t0, 1); return e; };
  function recap(S, items, next) {
    const p = card(S, 20, 10, 60, 74, PAPER, ""); p.classList.add("sc-tape"); S.drop(p, .1, .9, -1);
    S.el("div", "sc sc-hand", "left:7%;top:8%;font-size:4cqw", "Remember", p);
    items.forEach((it, i) => {
      const r = S.el("div", "sc", `left:7%;top:${30 + i * (items.length > 3 ? 15 : 18)}%;width:86%;display:flex;gap:1.4cqw;align-items:center;font:700 2.5cqw/1.2 var(--display);color:${NAVY}`, `${ic("check_circle", `color:${FOREST};font-size:3.4cqw`)}<span>${it}</span>`, p);
      S.rise(r, 1 + i * .9);
    });
    chip(S, `Next: ${next} ${ic("arrow_forward", "font-size:2.2cqw")}`, 35, 88, 1.4 + items.length * .9, `background:${VIOLET};color:${PAPER};border-color:${NAVY}`);
  }
  function posterEl(S, l, t, w, h, bg, fg, lines, extra = "") {
    const e = S.el("div", "sc sc-paper sc-poster", at(l, t, `width:${w}%;height:${h}%;background:${bg};color:${fg};${extra}`), lines);
    return e;
  }

  /* =====================================================================
     LESSON 1: Why some posters disappear (contrast)
     ===================================================================== */
  const contrastScenes = [
    { dur: 6.5, cap: [[0, "You walk past a poster. You can tell it says something..."], [2.4, "...but you can't actually read it."], [3.8, "That's a contrast problem."]],
      build(S) {
        const p = posterEl(S, 38, 14, 26, 70, LILAC, LOWFG, "<b>School fair</b><small>Sat 10am</small><small>Main hall</small>");
        p.classList.add("sc-tape"); S.drop(p, .2, 1, -2);
        hand(S, "wait... what<br>does it say?", 68, 24, 1.8, "rotate:6deg");
        const t = S.el("div", "sc sc-mid", at(5, 38, "width:30%"), "That's a<br><span style='color:" + VIOLET + "'>contrast</span><br>problem.");
        S.rise(t, 3.7);
      } },
    { dur: 8, cap: [[0, "Contrast is how different two things are."], [2.6, "Make them more different..."], [4.2, "...and that difference is what makes things stand out."]],
      build(S) {
        const t = S.el("div", "sc sc-title", at(6, 9), "Contrast"); S.write(t, .1, .9);
        const sub = S.el("div", "sc sc-body", at(6, 26), "how different two things are"); S.fade(sub, 1);
        const a = S.el("div", "sc", at(43, 40, `width:14cqw;height:14cqw;border-radius:1cqw;background:${LILAC};border:.3cqw solid ${NAVY}`));
        const b = S.el("div", "sc", at(43, 40, `width:14cqw;height:14cqw;border-radius:1cqw;background:${LILAC};border:.3cqw solid ${NAVY}`));
        S.pop(a, .6); S.fade(b, .6, .1);
        S.move(a, "translateX(0)", "translateX(-11cqw)", 1.6, 1, S.SPRING);
        S.a(b, [{ transform: "translateX(0)" }, { transform: "translateX(11cqw)" }], 1.6, 1, S.SPRING);
        S.a(b, [{ backgroundColor: NAVY }], 2.6, .9, S.E, "forwards");
        const arrow = S.svg("0 0 100 20", "M4 10 H96 M4 10 L12 3 M4 10 L12 17 M96 10 L88 3 M96 10 L88 17", at(34, 70, "width:32cqw;height:4cqw"));
        S.draw(arrow, 3.6, .9);
        hand(S, "the difference", 41, 78, 4.2);
      } },
    { dur: 8, cap: [[0, "Light text on a light background just disappears."], [2.2, "Dark text on a light background is easy to read."], [4.8, "Designers measure this. For text, aim for a contrast ratio of at least 4.5 to 1."]],
      build(S) {
        const l = card(S, 8, 14, 38, 58, LILAC, "display:grid;place-items:center");
        l.innerHTML = `<div class="sc-mid" style="color:${LOWFG};font-size:4cqw">Light on light</div>`;
        const r = card(S, 54, 14, 38, 58, PAPER, "display:grid;place-items:center");
        r.innerHTML = `<div class="sc-mid" style="color:${NAVY};font-size:4cqw">Dark on light</div>`;
        S.drop(l, .2, .9, -1.5); stamp(S, false, 39, 6, 1.3);
        S.drop(r, 2.1, .9, 1.5); stamp(S, true, 85, 6, 3.2);
        const n = S.el("div", "sc", at(8, 80, `width:84%;display:flex;align-items:center;gap:2cqw;font:800 3cqw/1 var(--display);color:${NAVY}`), `<span style="padding:.8cqw 1.8cqw;border-radius:999px;background:${VIOLET};color:${PAPER}">4.5 : 1</span><span class="sc-body" style="font-size:2.1cqw">the minimum contrast for text</span>`);
        S.rise(n, 4.7);
      } },
    { dur: 8.5, cap: [[0, "Contrast isn't only about colour."], [2.2, "Size creates contrast. So does weight..."], [4.4, "...and shape. The odd one out always gets noticed."]],
      build(S) {
        title(S, "Contrast isn't only colour");
        const col = (l, label, html, t0) => {
          const c = card(S, l, 26, 27, 60, PAPER, "display:grid;place-items:center;align-content:center;gap:2cqw");
          c.innerHTML = html;
          S.drop(c, t0, .9, (l % 2 ? 1 : -1) * 1.2);
          chip(S, label, l + 8, 82, t0 + .5);
        };
        col(5, "Size", `<div style="display:flex;align-items:baseline;gap:2cqw;color:${NAVY}"><span style="font:600 1.7cqw/1 var(--body)">sale</span><span style="font:800 7cqw/1 var(--display)">SALE</span></div>`, .3);
        col(36.5, "Weight", `<div style="display:flex;align-items:baseline;gap:2cqw;color:${NAVY};font-family:var(--display)"><span style="font-size:4.2cqw;font-weight:400">quiet</span><span style="font-size:4.2cqw;font-weight:800">LOUD</span></div>`, 2.2);
        col(68, "Shape", `<div style="display:grid;grid-template-columns:repeat(3,4cqw);gap:1.2cqw">${[0, 1, 2, 3, 4, 5].map(i => `<i style="display:block;width:4cqw;height:4cqw;background:${i === 4 ? CORAL : NAVY};border-radius:${i === 4 ? "50%" : ".4cqw"}"></i>`).join("")}</div>`, 4.3);
      } },
    { dur: 8.5, cap: [[0, "Here's a trick designers use: the squint test."], [2.8, "Blur your eyes, or step back from the screen."], [4.8, "Whatever you can still read is what stands out. If everything disappears, add contrast."]],
      build(S) {
        title(S, "The squint test");
        const bad = posterEl(S, 18, 22, 24, 60, LILAC, LOWFG, "<b>School fair</b><small>Sat 10am</small>");
        const good = posterEl(S, 58, 22, 24, 60, NAVY, PAPER, `<b>School fair</b><small style="color:${SUN}">Sat 10am</small>`);
        S.drop(bad, .3, .9, -2); S.drop(good, .6, .9, 2);
        S.a(bad, [{ filter: "blur(0px)" }, { filter: "blur(.7cqw)" }], 3, 1.2);
        S.a(good, [{ filter: "blur(0px)" }, { filter: "blur(.7cqw)" }], 3, 1.2);
        stamp(S, false, 37, 16, 4.8); stamp(S, true, 77, 16, 5.2);
        hand(S, "still readable!", 59, 85, 6);
      } },
    { dur: 7, cap: [[0, "Quick recap."], [1.1, "Light on light disappears. Use size, weight and shape too. And do the squint test."], [4.6, "Next, you'll fix a poster yourself."]],
      build(S) { recap(S, ["Light on light disappears", "Use size, weight and shape too", "Do the squint test"], "fix a poster"); } }
  ];

  /* =====================================================================
     LESSON 4: Words have a voice (type)
     ===================================================================== */
  const typeScenes = [
    { dur: 7, cap: [[0, "Same word. Three different typefaces."], [2.3, "Each one gives it a completely different voice."], [4.4, "Before anyone reads a word, the typeface has already said something."]],
      build(S) {
        const faces = [["var(--display)", 800, "normal", "loud"], ["Georgia, serif", 400, "italic", "classy"], ["var(--hand)", 700, "normal", "friendly"]];
        faces.forEach((f, i) => {
          const w = S.el("div", "sc", `left:0;right:0;top:26%;text-align:center;font-family:${f[0]};font-weight:${f[1]};font-style:${f[2]};font-size:13cqw;line-height:1;color:${[NAVY, NAVY, VIOLET][i]}`, "Party");
          const c = S.el("div", "sc", "left:0;right:0;top:64%;text-align:center", `<span class="sc-chip">${f[3]}</span>`);
          const t0 = .3 + i * 2.1;
          S.a(w, [{ opacity: 0, transform: "translateY(20%) scale(.9)" }, { opacity: 1, transform: "none" }], t0, .7, S.SPRING);
          S.pop(c, t0 + .3);
          if (i < 2) { S.out(w, t0 + 1.8, .3); S.out(c, t0 + 1.8, .3); }
        });
      } },
    { dur: 7.5, cap: [[0, "Choose a typeface that matches your message."], [2.6, "A serious notice in a party font feels wrong..."], [4.6, "...the same words in a clean typeface feel right."]],
      build(S) {
        title(S, "Match the type to the message");
        const l = card(S, 8, 26, 38, 56, "#FFE7D6", "display:grid;place-items:center;text-align:center;padding:2cqw");
        l.innerHTML = `<div style="font:700 5.2cqw/1 var(--hand);color:${CORAL}">Exam<br>timetable!!</div>`;
        const r = card(S, 54, 26, 38, 56, PAPER, "display:grid;place-items:center;text-align:center;padding:2cqw");
        r.innerHTML = `<div style="font:800 4.6cqw/1.05 var(--display);color:${NAVY}">Exam<br>timetable</div><div class="sc-body" style="font-size:1.8cqw;margin-top:1cqw">Mon 3 Nov to Fri 14 Nov</div>`;
        S.drop(l, 1, .9, -2); stamp(S, false, 39, 20, 2.6);
        S.drop(r, 3.4, .9, 1.5); stamp(S, true, 85, 20, 4.6);
      } },
    { dur: 9, cap: [[0, "When everything is the same size, nothing stands out."], [2.2, "Hierarchy fixes that. Make the most important thing the biggest..."], [4.6, "...so people know what to read first, second and third."]],
      build(S) {
        const lines = [["Science Fair", 6.4, 800, 22], ["Year 10 projects on show", 3.2, 700, 46], ["Come and see robots, rockets and one very loud volcano.", 2, 500, 58]];
        const p = card(S, 12, 10, 60, 80, PAPER); S.fade(p, 0, .4);
        lines.forEach((ln, i) => {
          const e = S.el("div", "sc", `left:18%;width:52%;top:${30 + i * 14}%;font-family:var(--display);font-weight:600;font-size:2.6cqw;line-height:1.1;color:${NAVY}`, ln[0]);
          S.fade(e, .2 + i * .15, .4);
          S.a(e, [{ fontSize: ln[1] + "cqw", fontWeight: ln[2], top: ln[3] + "%" }], 2.2 + i * .15, 1.1, S.SPRING, "forwards");
          const n = S.el("div", "sc", `left:13.5%;top:${ln[3] + (i === 0 ? 2 : 0)}%;width:3.4cqw;height:3.4cqw;border-radius:50%;background:${VIOLET};color:${PAPER};display:grid;place-items:center;font:800 1.8cqw/1 var(--display)`, String(i + 1));
          S.pop(n, 4.6 + i * .4);
        });
        hand(S, "read first", 76, 22, 5.8, "rotate:-4deg");
      } },
    { dur: 8, cap: [[0, "Lots of different typefaces make a design look messy."], [3.2, "Stick to one or two. Use size and weight for variety instead."]],
      build(S) {
        const fonts = ["var(--display)", "Georgia, serif", "var(--hand)", "ui-monospace, monospace", "'Arial Black', Impact, sans-serif"];
        const txt = ["BOOK CLUB", "This term", "Purple Hibiscus", "Thursdays 3:30pm", "Library"];
        const messy = card(S, 30, 10, 40, 80, PAPER, "display:grid;align-content:center;gap:1.4cqw;padding:3cqw");
        messy.innerHTML = txt.map((t, i) => `<div style="font-family:${fonts[i]};font-size:${[4.4, 2.4, 3.2, 2, 2.6][i]}cqw;color:${NAVY};line-height:1.1">${t}</div>`).join("");
        const clean = card(S, 30, 10, 40, 80, PAPER, "display:grid;align-content:center;gap:1.2cqw;padding:3cqw");
        clean.innerHTML = txt.map((t, i) => `<div style="font-family:${i === 2 ? "Georgia, serif" : "var(--display)"};font-style:${i === 2 ? "italic" : "normal"};font-weight:${[800, 600, 400, 700, 600][i]};font-size:${[5.2, 2, 3.2, 2, 2][i]}cqw;color:${NAVY};line-height:1.1">${t}</div>`).join("");
        S.drop(messy, .2, .9, -2);
        S.out(messy, 3, .4);
        S.a(clean, [{ opacity: 0, transform: "rotate(2deg) scale(.96)" }, { opacity: 1, transform: "rotate(1deg)" }], 3.2, .7, S.SPRING);
        chip(S, "5 typefaces", 8, 44, .8);
        chip(S, "2 typefaces", 76, 44, 3.6, `background:${FOREST};color:${PAPER}`);
      } },
    { dur: 8, cap: [[0, "Long, cramped lines are tiring to read."], [3, "Shorter lines, around 45 to 75 characters, with a little space between them are much easier."]],
      build(S) {
        const para = "Our science fair is back. Every Year 10 student will show a project they built this term, from water filters to solar ovens. Parents, friends and younger students are all welcome to come and ask questions.";
        const wide = S.el("div", "sc sc-body", `left:6%;top:24%;width:88%;font-size:2.15cqw;line-height:1.05;color:${NAVY}`, para);
        S.fade(wide, .2, .5); S.out(wide, 2.7, .4);
        const narrow = S.el("div", "sc sc-body", `left:27%;top:16%;width:46%;font-size:2.15cqw;line-height:1.65;color:${NAVY}`, para);
        S.a(narrow, [{ opacity: 0, transform: "translateY(4%)" }, { opacity: 1, transform: "none" }], 3, .8);
        const arrow = S.svg("0 0 100 20", "M4 10 H96 M4 10 L12 3 M4 10 L12 17 M96 10 L88 3 M96 10 L88 17", at(27, 9, "width:46cqw;height:3cqw"));
        S.draw(arrow, 3.6, .8);
        hand(S, "45 to 75 characters", 76, 30, 4.4, "rotate:-4deg;font-size:2.8cqw");
      } },
    { dur: 7, cap: [[0, "Quick recap."], [1.1, "Match the type to the message, make the hierarchy obvious, and stick to one or two typefaces."], [4.6, "Next, you'll build a hierarchy yourself."]],
      build(S) { recap(S, ["Match the type to the message", "Make the hierarchy obvious", "One or two typefaces"], "build a hierarchy"); } }
  ];

  /* =====================================================================
     LESSON 7: Give things room (layout)
     ===================================================================== */
  const blocks = (S, parent, spec) => spec.map(b => S.el("div", "sc", `left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%;background:${b[4]};border-radius:.6cqw;${b[5] || ""}`, "", parent));
  const layoutScenes = [
    { dur: 7, cap: [[0, "Good layouts aren't luck."], [3.4, "They follow a few simple rules, and there's usually an invisible grid underneath."]],
      build(S) {
        const t = S.el("div", "sc sc-mid", at(4, 30, "width:26%"), "Good layouts aren't luck."); S.rise(t, .2);
        const p = card(S, 36, 6, 34, 88, PAPER); S.fade(p, 0, .4);
        const g = S.el("div", "sc", "left:8%;right:8%;top:0;bottom:0;display:grid;grid-template-columns:repeat(6,1fr);gap:4%", [0, 1, 2, 3, 4, 5].map(() => `<i style="background:rgba(106,43,219,.09);border-left:1px dashed rgba(106,43,219,.45)"></i>`).join(""), p);
        S.fade(g, 3.4, .8);
        const bs = blocks(S, p, [[14, 8, 60, 12, NAVY, "rotate:-6deg"], [30, 26, 58, 30, LILAC, "rotate:5deg"], [8, 60, 40, 5, INK2, "rotate:-3deg"], [46, 70, 44, 5, INK2, "rotate:8deg"], [20, 82, 30, 8, SUN, "rotate:-10deg"]]);
        bs.forEach((b, i) => S.pop(b, .4 + i * .25));
      } },
    { dur: 8, cap: [[0, "Rule one: alignment."], [1.6, "Line things up along a shared edge..."], [3.6, "...and it instantly looks intentional."]],
      build(S) {
        title(S, "Alignment", 6, 9, 40);
        const p = card(S, 33, 8, 34, 84, PAPER); S.fade(p, 0, .3);
        const spec = [[10, 8, 70, 12, NAVY, "", 14], [10, 26, 80, 30, LILAC, "", -8], [10, 62, 60, 5, INK2, "", 18], [10, 70, 70, 5, INK2, "", -12], [10, 82, 34, 8, SUN, "", 22]];
        const bs = blocks(S, p, spec);
        bs.forEach((b, i) => { S.a(b, [{ opacity: 0 }, { opacity: 1 }], .1 + i * .1, .3); S.move(b, `translateX(${spec[i][6]}cqw)`, "translateX(0)", 2.2 + i * .12, .9, S.SPRING, "both"); });
        const line = S.el("div", "sc", `left:9.4%;top:4%;bottom:4%;width:.3cqw;background:${FOREST};transform-origin:top`, "", p);
        S.a(line, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], 1.6, .8);
        hand(S, "shared edge", 70, 46, 3.8);
      } },
    { dur: 8, cap: [[0, "Rule two: proximity."], [2.4, "Keep related things close together..."], [4.2, "...and unrelated things apart. Now the details read as one group."]],
      build(S) {
        title(S, "Proximity", 6, 9, 40);
        const p = card(S, 33, 8, 34, 84, PAPER); S.fade(p, 0, .3);
        blocks(S, p, [[10, 8, 70, 12, NAVY], [10, 25, 60, 5, INK2]]).forEach((b, i) => S.fade(b, .1 + i * .1, .3));
        const det = [["Fri 14 Nov", 58, 40, 30], ["10am", 10, 66, -28], ["School hall", 52, 80, 22]];
        det.forEach((d, i) => {
          const e = S.el("div", "sc", `left:12%;top:${52 + i * 9}%;font:800 1.9cqw/1 var(--display);color:${NAVY}`, d[0], p);
          S.fade(e, .3 + i * .1, .3);
          S.move(e, `translate(${d[3]}cqw, ${(d[2] - (52 + i * 9)) * .5}cqw)`, "translate(0,0)", 2.4 + i * .15, 1, S.SPRING, "both");
        });
        const box = S.el("div", "sc", `left:7%;top:49%;width:60%;height:28%;border:.3cqw dashed ${VIOLET};border-radius:1cqw`, "", p);
        S.pop(box, 3.8);
        hand(S, "these belong<br>together", 70, 50, 4.4);
      } },
    { dur: 8, cap: [[0, "Rule three: white space."], [2.4, "White space isn't wasted space."], [4.2, "It gives your design room to breathe, and makes it feel calm and confident."]],
      build(S) {
        title(S, "White space", 6, 9, 40);
        const p = card(S, 33, 8, 34, 84, PAPER); S.fade(p, 0, .3);
        const inner = S.el("div", "sc", "left:0;top:0;right:0;bottom:0", "", p);
        blocks(S, inner, [[0, 0, 100, 18, NAVY], [0, 19, 100, 38, LILAC], [0, 58, 100, 8, INK2], [0, 67, 100, 8, INK2], [0, 76, 100, 24, SUN]]).forEach((b, i) => S.fade(b, .1 + i * .08, .3));
        S.a(inner, [{ transform: "scale(1)" }, { transform: "scale(.78)" }], 2.4, 1.1, S.SPRING);
        const m = S.el("div", "sc", `left:7%;top:7%;right:7%;bottom:7%;border:.25cqw dashed ${VIOLET};border-radius:.6cqw`, "", p);
        S.fade(m, 3.4, .5);
        hand(S, "room to<br>breathe", 70, 44, 4.2);
      } },
    { dur: 8, cap: [[0, "Rule four: use a grid."], [2, "A grid is a set of invisible columns."], [3.8, "Snap things to it and everything lines up, even on a busy page."]],
      build(S) {
        title(S, "Grids", 6, 9, 40);
        const p = card(S, 28, 8, 44, 84, PAPER); S.fade(p, 0, .3);
        const g = S.el("div", "sc", "left:6%;right:6%;top:0;bottom:0;display:grid;grid-template-columns:repeat(3,1fr);gap:4%", [0, 1, 2].map(() => `<i style="background:rgba(106,43,219,.09);border-left:1px dashed rgba(106,43,219,.45);border-right:1px dashed rgba(106,43,219,.45)"></i>`).join(""), p);
        S.fade(g, .6, .6);
        const spec = [[6, 8, 88, 14, NAVY, "", -20, -10], [6, 28, 27.3, 30, LILAC, "", -16, 12], [36.3, 28, 27.3, 30, SUN, "", 10, 18], [66.6, 28, 27.3, 30, MINT, "", 22, -14], [6, 64, 57.7, 6, INK2, "", -12, 10], [6, 74, 57.7, 6, INK2, "", 14, 16], [66.6, 64, 27.3, 16, CORAL, "", 18, -10]];
        blocks(S, p, spec).forEach((b, i) => {
          S.a(b, [{ opacity: 0, transform: `translate(${spec[i][6]}cqw, ${spec[i][7]}cqw) rotate(${spec[i][6] / 2}deg)` }, { opacity: 1, transform: "none" }], 2 + i * .2, .9, S.SPRING);
        });
      } },
    { dur: 7.5, cap: [[0, "Quick recap."], [1.1, "Line things up, group what belongs together, leave white space, and use a grid."], [5, "Next, you'll line up a poster yourself."]],
      build(S) { recap(S, ["Line things up", "Group what belongs together", "Leave white space", "Use a grid"], "line it up"); } }
  ];

  /* =====================================================================
     LESSON 10: Colour with a purpose
     ===================================================================== */
  const colourScenes = [
    { dur: 7, cap: [[0, "Too many colours on one design..."], [2.6, "...and they all fight for attention."], [4.2, "So where are you supposed to look?"]],
      build(S) {
        const p = card(S, 34, 8, 32, 84, "#FF4FA3"); S.drop(p, .1, .8, -2);
        const cols = ["#00C2FF", "#FFE600", "#7CFF4F", "#FF7A00", "#9B4DFF", "#00E5A0", "#FF2E2E"];
        blocks(S, p, [[8, 6, 84, 14, cols[0]], [8, 24, 40, 30, cols[1]], [52, 24, 40, 30, cols[2]], [8, 58, 84, 6, cols[3]], [8, 68, 84, 6, cols[4]], [8, 80, 40, 12, cols[5]], [52, 80, 40, 12, cols[6]]]).forEach((b, i) => S.pop(b, .5 + i * .18));
        hand(S, "where do<br>I look?!", 70, 36, 3.6, "rotate:5deg");
      } },
    { dur: 9, cap: [[0, "Try the 60-30-10 rule."], [1.4, "60% one main colour..."], [2.8, "...30% a supporting colour..."], [4.2, "...and 10% an accent. Pick three colours and stick to them."]],
      build(S) {
        title(S, "60 / 30 / 10");
        const bar = S.el("div", "sc", "left:8%;top:34%;width:84%;height:16%;display:flex;gap:.5cqw");
        const segs = [[60, NAVY, PAPER, "main"], [30, LILAC, NAVY, "support"], [10, SUN, NAVY, "accent"]];
        segs.forEach((s, i) => {
          const e = S.el("div", "", `flex:${s[0]};background:${s[1]};color:${s[2]};border-radius:.8cqw;display:grid;place-items:center;font:800 2.8cqw/1 var(--display);transform-origin:left`, s[0] + "%", bar);
          S.a(e, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], 1.4 + i * 1.4, .9, S.SPRING);
          const lab = S.el("div", "sc sc-hand", `left:${8 + [0, 50.4, 75.6][i]}%;top:52%;font-size:3cqw`, s[3]);
          S.write(lab, 1.9 + i * 1.4, .7);
        });
        const mini = card(S, 38, 64, 24, 30, NAVY, "display:grid;grid-template-columns:1fr;padding:1.4cqw;gap:1cqw");
        mini.innerHTML = `<div style="background:${LILAC};border-radius:.5cqw;height:3.2cqw"></div><div style="background:${LILAC};border-radius:.5cqw;height:1.6cqw;width:70%"></div><div style="background:${SUN};border-radius:999px;height:2cqw;width:40%"></div>`;
        S.rise(mini, 5.4);
      } },
    { dur: 8, cap: [[0, "Use your accent colour on purpose."], [2.2, "Put it on the one thing you most want people to notice..."], [4.4, "...like the button, the date, or the price."]],
      build(S) {
        const p = card(S, 30, 8, 40, 84, "#EDEDF2"); S.drop(p, .1, .8, 1);
        blocks(S, p, [[10, 8, 80, 14, "#9A98AE"], [10, 28, 80, 28, "#D2D1DC"], [10, 62, 60, 4, "#B3B2C2"], [10, 69, 70, 4, "#B3B2C2"]]).forEach((b, i) => S.fade(b, .3 + i * .1, .3));
        const btn = S.el("div", "sc", `left:10%;top:80%;width:36%;height:10%;border-radius:999px;background:${VIOLET};color:${PAPER};display:grid;place-items:center;font:800 1.8cqw/1 var(--display)`, "Sign up", p);
        S.pop(btn, 2.2);
        const ring = S.el("div", "sc", `left:8%;top:77%;width:40%;height:16%;border-radius:999px;border:.35cqw solid ${VIOLET}`, "", p);
        S.a(ring, [{ opacity: .9, transform: "scale(.9)" }, { opacity: 0, transform: "scale(1.35)" }], 2.8, 1.2, S.E);
        S.a(ring, [{ opacity: .9, transform: "scale(.9)" }, { opacity: 0, transform: "scale(1.35)" }], 4.2, 1.2, S.E, "forwards");
        const arrow = S.svg("0 0 100 60", "M96 6 C 70 6, 40 20, 14 50 M14 50 L16 36 M14 50 L28 48", at(66, 52, "width:20cqw;height:12cqw"));
        S.draw(arrow, 3.4, .9);
        hand(S, "look here", 78, 44, 4);
      } },
    { dur: 8, cap: [[0, "Colours carry feelings."], [2.2, "But what a colour means can change from place to place and person to person."], [5, "So think about who your design is for."]],
      build(S) {
        title(S, "Colours carry feelings");
        const sw = [[CORAL, "energy, warmth, warning"], [FOREST, "growth, nature, money"], [ROYAL, "calm, trust, focus"]];
        sw.forEach((s, i) => {
          const c = card(S, 8 + i * 29, 30, 26, 46, PAPER, "display:grid;grid-template-rows:1fr auto;overflow:hidden");
          c.innerHTML = `<div style="background:${s[0]}"></div><div style="padding:1.4cqw;font:700 1.8cqw/1.25 var(--body);color:${NAVY}">${s[1]}</div>`;
          S.drop(c, .5 + i * .5, .9, (i - 1) * 2);
        });
        hand(S, "who is it for?", 36, 82, 5);
      } },
    { dur: 8, cap: [[0, "Some people can't tell certain colours apart."], [2.4, "To them, these two might look exactly the same."], [4.4, "So never rely on colour alone. Add a word or an icon too."]],
      build(S) {
        title(S, "Never use colour alone");
        const wrap = S.el("div", "sc", "left:0;right:0;top:32%;height:50%;display:flex;justify-content:center;gap:8cqw");
        const mk = (bg, word, icon) => `<div style="display:grid;justify-items:center;gap:1.4cqw"><div style="width:16cqw;height:16cqw;border-radius:50%;background:${bg};display:grid;place-items:center;color:${PAPER}"><span class="ms fill w-ic" style="width:auto;font-size:8cqw;opacity:0">${icon}</span></div><div class="w-word" style="font:800 2.6cqw/1 var(--display);color:${NAVY};opacity:0">${word}</div></div>`;
        wrap.innerHTML = mk("#C0392B", "Closed", "close") + mk("#2E8B57", "Open", "check");
        S.pop(wrap, .3);
        S.a(wrap, [{ filter: "grayscale(0)" }, { filter: "grayscale(1)" }], 2.4, .9);
        S.a(wrap, [{ filter: "grayscale(0)" }], 5.6, .8, S.E, "forwards");
        wrap.querySelectorAll(".w-ic, .w-word").forEach((e, i) => S.a(e, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "none" }], 4.4 + (i % 2) * .2, .6, S.SPRING));
      } },
    { dur: 7, cap: [[0, "Quick recap."], [1.1, "Pick three colours with 60-30-10, save your accent for what matters, and never rely on colour alone."], [4.6, "Next, you'll build a palette yourself."]],
      build(S) { recap(S, ["Three colours: 60, 30, 10", "Accent for what matters most", "Never rely on colour alone"], "build a palette"); } }
  ];

  /* =====================================================================
     PRACTICE TOOLS. Each takes (mount, pass) and calls pass() when the learner gets it right.
     ===================================================================== */
  const SW = {
    Paper: PAPER, Lilac: LILAC, Sun: SUN, Sky: "#CFE3FA", Mint: MINT, Coral: CORAL, Violet: VIOLET, Royal: ROYAL, Forest: FOREST, Ink: NAVY, Mist: LOWFG, Grey: "#A9A8B8"
  };
  const swBtns = (names, cur, data) => names.map(n => `<button type="button" class="sw" data-${data}="${SW[n]}" aria-label="${n}" aria-pressed="${SW[n] === cur}" style="background:${SW[n]}"></button>`).join("");
  const C = () => window.MDT;
  const setPressed = (wrap, sel, btn) => wrap.querySelectorAll(sel).forEach(b => b.setAttribute("aria-pressed", String(b === btn)));

  function toolContrast(mount, pass) {
    const st = { bg: LILAC, fg: LOWFG, squint: false };
    mount.innerHTML = `
      <div class="tool">
        <div class="canvas-wrap graph"><div id="tc-poster"></div></div>
        <div>
          <div class="panel">
            <p class="hand-note" style="font-size:1.4rem">This poster disappears. Fix it.</p>
            <div class="ctl-group" style="margin-top:14px"><span class="label">Background</span><div class="swatch-row" data-g="bg">${swBtns(["Paper", "Lilac", "Sun", "Sky", "Violet", "Ink"], st.bg, "bg")}</div></div>
            <div class="ctl-group"><span class="label">Text colour</span><div class="swatch-row" data-g="fg">${swBtns(["Ink", "Royal", "Violet", "Mist", "Grey", "Paper"], st.fg, "fg")}</div></div>
            <div class="meter-card" style="margin-top:20px">
              <span class="label" style="margin:0">Contrast ratio</span>
              <div class="ratio" id="tc-ratio">1.0 : 1</div>
              <div class="scale"><i id="tc-fill"></i><span class="tick" style="left:${4.5 / 12 * 100}%"><span>4.5 : 1</span></span><span class="tick" style="left:${7 / 12 * 100}%"><span>7 : 1</span></span></div>
              <div class="verdict" id="tc-verdict"></div>
            </div>
            <div class="cta-row" style="margin-top:18px">
              <button class="btn ghost small" type="button" id="tc-squint" aria-pressed="false">Squint test</button>
              <button class="btn small" type="button" id="tc-check">Check my poster</button>
            </div>
            <div id="tc-hint"></div>
          </div>
        </div>
      </div>`;
    const draw = () => {
      mount.querySelector("#tc-poster").innerHTML = C().poster({ head: "School fair", sub: "Stalls, music and food", body: "Bring your friends and your appetite.", details: ["Sat 8 Nov", "10am", "Main field"], bg: st.bg, fg: st.fg, accent: st.fg, headSize: 17, grouped: true }, st.squint ? "squint" : "");
      const r = C().contrast(st.bg, st.fg);
      mount.querySelector("#tc-ratio").textContent = r.toFixed(1) + " : 1";
      mount.querySelector("#tc-fill").style.setProperty("--w", Math.min(100, r / 12 * 100) + "%");
      const v = mount.querySelector("#tc-verdict");
      v.className = "verdict " + (r >= 4.5 ? "ok" : "no");
      v.innerHTML = r >= 4.5 ? `${ic("check_circle")}Easy to read` : `${ic("visibility_off")}Too hard to read`;
    };
    mount.querySelectorAll("[data-bg]").forEach(b => b.addEventListener("click", () => { st.bg = b.dataset.bg; setPressed(mount, "[data-bg]", b); draw(); }));
    mount.querySelectorAll("[data-fg]").forEach(b => b.addEventListener("click", () => { st.fg = b.dataset.fg; setPressed(mount, "[data-fg]", b); draw(); }));
    mount.querySelector("#tc-squint").addEventListener("click", e => { st.squint = !st.squint; e.currentTarget.setAttribute("aria-pressed", String(st.squint)); draw(); });
    mount.querySelector("#tc-check").addEventListener("click", () => {
      const r = C().contrast(st.bg, st.fg), h = mount.querySelector("#tc-hint");
      if (r >= 4.5) { h.innerHTML = ""; pass(`Contrast ${r.toFixed(1)} : 1. That poster reads from across the room.`); }
      else h.innerHTML = `<p class="hint"><b>Not yet.</b> ${r < 2 ? "The text and background are almost the same. Try a dark text on a light background, or the other way round." : "Getting closer. Push the colours further apart until the meter passes 4.5 : 1."}</p>`;
    });
    draw();
  }

  function toolHierarchy(mount, pass) {
    const sizes = { S: 4.4, M: 6, L: 10, XL: 16 };
    const st = { head: "M", sub: "M", body: "M", headBold: false };
    const row = (k, label) => `<div class="ctl-group"><span class="label">${label}</span><div class="seg" data-k="${k}">${Object.keys(sizes).map(s => `<button type="button" data-s="${s}" aria-pressed="${st[k] === s}">${s}</button>`).join("")}</div></div>`;
    mount.innerHTML = `
      <div class="tool">
        <div class="canvas-wrap graph"><div id="th-poster"></div></div>
        <div><div class="panel">
          <p class="hand-note" style="font-size:1.4rem">Everything's the same size. Give it a hierarchy.</p>
          <div style="margin-top:14px">${row("head", "Event name")}${row("sub", "Short line")}${row("body", "Description")}</div>
          <div class="ctl-group"><label class="check" for="th-bold"><input type="checkbox" id="th-bold"><span>Make the event name bold</span></label></div>
          <div class="cta-row" style="margin-top:18px"><button class="btn small" type="button" id="th-check">Check my hierarchy</button></div>
          <div id="th-hint"></div>
        </div></div>
      </div>`;
    const draw = () => {
      mount.querySelector("#th-poster").innerHTML = C().poster({ head: "Science Fair", sub: "Year 10 projects on show", body: "Robots, rockets and one very loud volcano.", details: ["Fri 14 Nov", "10am", "School hall"], bg: PAPER, fg: NAVY, accent: VIOLET, headSize: sizes[st.head], subSize: sizes[st.sub], bodySize: sizes[st.body], grouped: true });
      const h = mount.querySelector(".p-head"); h.style.fontWeight = st.headBold ? 800 : 500; h.style.textTransform = "none";
      mount.querySelector(".p-sub").style.fontWeight = 600;
    };
    mount.querySelectorAll(".seg").forEach(g => g.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { st[g.dataset.k] = b.dataset.s; setPressed(g, "button", b); draw(); })));
    mount.querySelector("#th-bold").addEventListener("change", e => { st.headBold = e.target.checked; draw(); });
    mount.querySelector("#th-check").addEventListener("click", () => {
      const v = k => sizes[st[k]], hint = mount.querySelector("#th-hint");
      let msg = "";
      if (!(v("head") > v("sub"))) msg = "The event name should be bigger than the short line. It's the first thing people should read.";
      else if (!(v("sub") > v("body") || (v("sub") === v("body") && false))) msg = "Make the short line bigger than the description so there are three clear levels.";
      else if (!st.headBold) msg = "Almost. Make the event name bold so it pops even more.";
      if (msg) hint.innerHTML = `<p class="hint"><b>Not yet.</b> ${msg}</p>`;
      else { hint.innerHTML = ""; pass("Three clear levels. People will read it in exactly the order you planned."); }
    });
    draw();
  }

  function toolLayout(mount, pass) {
    mount.innerHTML = `
      <div class="tool">
        <div class="canvas-wrap graph">
          <div class="layout-board" id="tl-board">
            <div class="gridlines">${"<i></i>".repeat(6)}</div>
            <div class="edge" id="tl-edge"></div>
          </div>
        </div>
        <div><div class="panel">
          <p class="hand-note" style="font-size:1.4rem">Drag the blocks so they share one left edge.</p>
          <div class="switch" style="margin-top:10px"><span><b>Snap to grid</b><small>Blocks jump to the nearest column</small></span><label class="tg"><input type="checkbox" id="tl-snap" aria-label="Snap to grid"><span></span></label></div>
          <div class="cta-row" style="margin-top:14px"><button class="btn small" type="button" id="tl-check">Check my layout</button><button class="btn ghost small" type="button" id="tl-shuffle">Mess it up again</button></div>
          <div id="tl-hint"></div>
        </div></div>
      </div>`;
    const board = mount.querySelector("#tl-board"), edge = mount.querySelector("#tl-edge");
    const spec = [["Event name", NAVY, 70, 14], ["Photo", ROYAL, 60, 26], ["Date and place", INK2, 50, 9], ["Sign up", VIOLET, 34, 8]];
    const tops = [6, 25, 58, 76];
    const els = spec.map((s, i) => {
      const b = document.createElement("div");
      b.className = "blk"; b.textContent = s[0];
      Object.assign(b.style, { background: s[1], width: s[2] + "%", height: s[3] + "%", top: tops[i] + "%" });
      b.tabIndex = 0; b.setAttribute("role", "button"); b.setAttribute("aria-label", `${s[0]} block. Use arrow keys to move.`);
      board.appendChild(b); return b;
    });
    const shuffle = () => els.forEach((b, i) => { b.style.left = [14, 30, 6, 44][i] + Math.round(Math.random() * 6) + "%"; });
    shuffle();
    const colX = () => { const r = board.getBoundingClientRect(); const inner = r.width * .88, gap = inner * .03, col = (inner - gap * 5) / 6; return [0, 1, 2, 3, 4, 5].map(k => r.width * .06 + k * (col + gap)); };
    const lefts = () => els.map(b => b.offsetLeft);
    const showEdge = () => {
      const L = lefts(), ok = Math.max(...L) - Math.min(...L) <= 4;
      edge.style.left = Math.min(...L) + "px"; edge.classList.toggle("on", ok);
      return ok;
    };
    els.forEach(b => {
      let sx = 0, sl = 0, dragging = false;
      b.addEventListener("pointerdown", e => { dragging = true; b.setPointerCapture(e.pointerId); b.classList.add("drag"); sx = e.clientX; sl = b.offsetLeft; });
      b.addEventListener("pointermove", e => {
        if (!dragging) return;
        let x = sl + (e.clientX - sx);
        x = Math.max(0, Math.min(board.clientWidth - b.offsetWidth, x));
        if (mount.querySelector("#tl-snap").checked) { const cols = colX(); x = cols.reduce((a, c) => Math.abs(c - x) < Math.abs(a - x) ? c : a, cols[0]); }
        b.style.left = x + "px"; showEdge();
      });
      const end = () => { dragging = false; b.classList.remove("drag"); showEdge(); };
      b.addEventListener("pointerup", end); b.addEventListener("pointercancel", end);
      b.addEventListener("keydown", e => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const cols = colX();
        let x = b.offsetLeft;
        if (mount.querySelector("#tl-snap").checked) {
          const i = cols.reduce((bi, c, k) => Math.abs(c - x) < Math.abs(cols[bi] - x) ? k : bi, 0);
          x = cols[Math.max(0, Math.min(5, i + (e.key === "ArrowRight" ? 1 : -1)))];
        } else x += e.key === "ArrowRight" ? 4 : -4;
        b.style.left = Math.max(0, Math.min(board.clientWidth - b.offsetWidth, x)) + "px"; showEdge();
      });
    });
    mount.querySelector("#tl-snap").addEventListener("change", e => board.classList.toggle("show-grid", e.target.checked));
    mount.querySelector("#tl-shuffle").addEventListener("click", () => { shuffle(); showEdge(); mount.querySelector("#tl-hint").innerHTML = ""; });
    mount.querySelector("#tl-check").addEventListener("click", () => {
      const h = mount.querySelector("#tl-hint");
      if (showEdge()) { h.innerHTML = ""; pass("Everything shares one edge. See how much calmer it looks?"); }
      else h.innerHTML = `<p class="hint"><b>Not yet.</b> Some blocks are still out of line. Turn on <b>Snap to grid</b> to make it easier.</p>`;
    });
    showEdge();
  }

  function toolPalette(mount, pass) {
    const names = ["Ink", "Royal", "Forest", "Violet", "Paper", "Lilac", "Sky", "Sun", "Coral", "Mint"];
    const st = { main: null, support: null, accent: null, slot: "main" };
    mount.innerHTML = `
      <div class="tool">
        <div class="canvas-wrap graph"><div id="tp-poster"></div></div>
        <div><div class="panel">
          <p class="hand-note" style="font-size:1.4rem">Build a three-colour palette: 60, 30, 10.</p>
          <div class="seg" id="tp-slots" style="margin-top:14px">
            <button type="button" data-slot="main" aria-pressed="true">Main 60%</button>
            <button type="button" data-slot="support" aria-pressed="false">Support 30%</button>
            <button type="button" data-slot="accent" aria-pressed="false">Accent 10%</button>
          </div>
          <div class="swatch-row" style="margin-top:16px">${names.map(n => `<button type="button" class="sw" data-c="${SW[n]}" aria-label="${n}" style="background:${SW[n]}"></button>`).join("")}</div>
          <div style="display:flex;height:22px;gap:3px;margin-top:20px;border-radius:999px;overflow:hidden" id="tp-bar"></div>
          <div class="cta-row" style="margin-top:18px"><button class="btn small" type="button" id="tp-check">Check my palette</button></div>
          <div id="tp-hint"></div>
        </div></div>
      </div>`;
    const draw = () => {
      const m = st.main || "#EDEDF2", s = st.support || "#D2D1DC", a = st.accent || "#9A98AE";
      mount.querySelector("#tp-poster").innerHTML = C().poster({ head: "Open Mic", sub: "Poetry, songs and stand-up", body: "Sign up to perform or just come and cheer.", details: ["Fri 21 Nov", "4pm", "Assembly hall"], bg: m, fg: C().onColor(m), accent: a, headSize: 18, grouped: true, cta: "Sign up" });
      const det = mount.querySelector(".p-details"); det.style.background = s; det.style.color = C().onColor(s);
      mount.querySelector("#tp-bar").innerHTML = [[60, m], [30, s], [10, a]].map(x => `<i style="flex:${x[0]};background:${x[1]}"></i>`).join("");
      mount.querySelectorAll(".sw").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.c === st[st.slot])));
    };
    mount.querySelectorAll("[data-slot]").forEach(b => b.addEventListener("click", () => { st.slot = b.dataset.slot; setPressed(mount, "[data-slot]", b); draw(); }));
    mount.querySelectorAll(".sw").forEach(b => b.addEventListener("click", () => {
      st[st.slot] = b.dataset.c;
      const order = ["main", "support", "accent"], next = order.find(k => !st[k]);
      if (next) { st.slot = next; setPressed(mount, "[data-slot]", mount.querySelector(`[data-slot=${next}]`)); }
      draw();
    }));
    mount.querySelector("#tp-check").addEventListener("click", () => {
      const h = mount.querySelector("#tp-hint");
      let msg = "";
      if (!st.main || !st.support || !st.accent) msg = "Pick all three colours first.";
      else if (new Set([st.main, st.support, st.accent]).size < 3) msg = "Use three different colours.";
      else if (C().contrast(st.accent, st.main) < 3) msg = "Your accent blends into the main colour. Pick one that's much lighter or darker so the button pops.";
      else if (C().contrast(st.support, st.main) < 1.3) msg = "Main and support are very close. Make them a bit more different.";
      if (msg) h.innerHTML = `<p class="hint"><b>Not yet.</b> ${msg}</p>`;
      else { h.innerHTML = ""; pass("Clear main colour, calm support, and an accent that pulls the eye to the button."); }
    });
    draw();
  }

  /* =====================================================================
     QUIZZES
     ===================================================================== */
  const quizzes = {
    l3: [
      { q: "Which of these is easiest to read?", o: ["Light grey text on white", "Dark navy text on white", "Light purple text on lilac"], a: 1, why: "Dark on light has the biggest difference, so it has the most contrast." },
      { q: "Contrast can come from...", o: ["Only colour", "Colour, size, weight and shape", "Only size"], a: 1, why: "Anything that makes one thing different from another creates contrast." },
      { q: "What does the squint test show you?", o: ["What stands out most", "Whether the spelling is right", "How big the file is"], a: 0, why: "Blurring your eyes removes detail, so only the strongest contrast survives." }
    ],
    l6: [
      { q: "Hierarchy helps people...", o: ["Know what to read first", "Print a poster faster", "Use more colours"], a: 0, why: "Size, weight and position tell people what matters most." },
      { q: "How many typefaces should most posters use?", o: ["One or two", "Four or five", "As many as possible"], a: 0, why: "One or two keeps it tidy. Use size and weight for variety." },
      { q: "An exam timetable in a bubbly party font...", o: ["Feels exciting", "Doesn't match the message", "Is easier to read"], a: 1, why: "Typefaces have a voice. Match it to what you're saying." }
    ],
    l9: [
      { q: "Proximity means...", o: ["Keep related things close together", "Make everything the same size", "Put text in the corners"], a: 0, why: "Grouping related things helps people read them as one idea." },
      { q: "White space is...", o: ["Wasted space you should fill", "Room that helps a design breathe", "A printing mistake"], a: 1, why: "Space around things makes a design feel calm and easier to read." },
      { q: "A grid helps you...", o: ["Line things up consistently", "Choose colours", "Write better headlines"], a: 0, why: "Columns give everything an edge to line up against." }
    ],
    l12: [
      { q: "In the 60-30-10 rule, the 10% is...", o: ["The background", "The accent, for what matters most", "The text"], a: 1, why: "A small amount of accent draws the eye to the most important thing." },
      { q: "Why pair colour with icons or words?", o: ["It looks busier", "So people who can't tell some colours apart still understand", "It's the law"], a: 1, why: "Never rely on colour alone to carry meaning." },
      { q: "Too many colours on a poster...", o: ["Fight for attention", "Always look fun", "Make text easier to read"], a: 0, why: "When everything shouts, nothing stands out." }
    ]
  };
  function renderQuiz(mount, qs, done) {
    let i = 0, score = 0;
    const show = () => {
      const q = qs[i];
      mount.innerHTML = `<div class="quiz"><div class="panel lift q-card view-in">
        <span class="q-count">Question ${i + 1} of ${qs.length}</span>
        <h2>${q.q}</h2>
        <div class="opts">${q.o.map((o, k) => `<button type="button" class="opt" data-k="${k}"><span class="k">${"ABC"[k]}</span><span>${o}</span></button>`).join("")}</div>
        <div id="q-after"></div>
      </div></div>`;
      let tries = 0;
      mount.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
        const k = +b.dataset.k;
        if (k === q.a) {
          if (tries === 0) score++;
          b.classList.add("right");
          mount.querySelectorAll(".opt").forEach(x => x.disabled = true);
          const last = i === qs.length - 1;
          mount.querySelector("#q-after").innerHTML = `<p class="q-why">${ic("check_circle", "color:var(--good);vertical-align:-4px;margin-right:6px")}${q.why}</p><div class="cta-row" style="margin-top:16px"><button class="btn small" type="button" id="q-next">${last ? "See my result" : "Next question"}</button></div>`;
          mount.querySelector("#q-next").addEventListener("click", () => { if (last) done(score, qs.length); else { i++; show(); } });
          mount.querySelector("#q-next").focus();
        } else {
          tries++;
          b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong"); b.disabled = true;
        }
      }));
    };
    show();
  }

  /* =====================================================================
     FINAL PROJECT: poster maker
     ===================================================================== */
  const templates = {
    science: { head: "Science Fair", sub: "Year 10 projects on show", body: "Robots, rockets and one very loud volcano.", details: ["Fri 14 Nov", "10am to 2pm", "School hall"], cta: "Free entry" },
    sports: { head: "Inter-house Sports", sub: "Who's taking the cup this year?", body: "Wear your house colour and bring your loudest voice.", details: ["Sat 22 Nov", "8am", "School field"], cta: "Be there" },
    books: { head: "Book Club", sub: "This term: one book, many opinions", body: "Read it, bring snacks, argue nicely.", details: ["Every Thursday", "3:30pm", "Library"], cta: "All welcome" },
    custom: { head: "", sub: "", body: "", details: ["", "", ""], cta: "" }
  };
  function renderProject(mount, saved, submit) {
    const st = Object.assign({ tpl: "science", bg: PAPER, fg: LOWFG, accent: LILAC, headSize: 9, font: "display", align: "left", grouped: false }, JSON.parse(JSON.stringify(templates.science)), saved ? JSON.parse(JSON.stringify(saved)) : {});
    st.details = (st.details || ["", "", ""]).slice(0, 3);
    while (st.details.length < 3) st.details.push("");
    mount.innerHTML = `
      <div class="maker">
        <div class="canvas-wrap graph"><div id="pm-poster" style="width:100%;display:grid;place-items:center"></div></div>
        <div class="stack">
          <div class="panel">
            <div class="panel-h"><h3>1. Pick an event</h3></div>
            <div class="tpl-row seg">${[["science", "Science fair"], ["sports", "Sports day"], ["books", "Book club"], ["custom", "My own event"]].map(t => `<button type="button" data-tpl="${t[0]}" aria-pressed="${st.tpl === t[0]}">${t[1]}</button>`).join("")}</div>
          </div>
          <div class="panel">
            <div class="panel-h"><h3>2. Write it</h3></div>
            <div class="fields tight">
              <div class="field"><label for="pm-head">Headline</label><input type="text" id="pm-head" maxlength="30"></div>
              <div class="field"><label for="pm-sub">Short line</label><input type="text" id="pm-sub" maxlength="40"></div>
              <div class="field"><label for="pm-body">Description</label><input type="text" id="pm-body" maxlength="70"></div>
              <div class="field-row" style="grid-template-columns:repeat(3,minmax(0,1fr))">
                <div class="field"><label for="pm-d0">Date</label><input type="text" id="pm-d0" maxlength="18"></div>
                <div class="field"><label for="pm-d1">Time</label><input type="text" id="pm-d1" maxlength="18"></div>
                <div class="field"><label for="pm-d2">Place</label><input type="text" id="pm-d2" maxlength="18"></div>
              </div>
              <div class="field"><label for="pm-cta">Button text</label><input type="text" id="pm-cta" maxlength="16"></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-h"><h3>3. Design it</h3></div>
            <div class="ctl-group"><span class="label">Background</span><div class="swatch-row">${swBtns(["Paper", "Lilac", "Sun", "Sky", "Mint", "Violet", "Royal", "Forest", "Ink"], st.bg, "bg")}</div></div>
            <div class="ctl-group"><span class="label">Text</span><div class="swatch-row">${swBtns(["Ink", "Paper", "Mist", "Violet", "Royal", "Grey"], st.fg, "fg")}</div></div>
            <div class="ctl-group"><span class="label">Accent (button)</span><div class="swatch-row">${swBtns(["Sun", "Coral", "Violet", "Mint", "Paper", "Ink", "Lilac"], st.accent, "ac")}</div></div>
            <div class="ctl-group"><label class="label" for="pm-size">Headline size</label><input class="range" type="range" id="pm-size" min="6" max="22" step="1"></div>
            <div class="ctl-group"><span class="label">Headline style</span><div class="seg" id="pm-font">${[["display", "Bold"], ["serif", "Classic"], ["hand", "Handwritten"]].map(f => `<button type="button" data-f="${f[0]}" aria-pressed="${st.font === f[0]}">${f[1]}</button>`).join("")}</div></div>
            <div class="ctl-group"><span class="label">Layout</span><div class="seg" id="pm-layout">
              <button type="button" data-al="left" aria-pressed="${st.align === "left"}">Left aligned</button><button type="button" data-al="center" aria-pressed="${st.align === "center"}">Centred</button>
              <button type="button" data-gr="1" aria-pressed="${st.grouped}">Details grouped</button><button type="button" data-gr="0" aria-pressed="${!st.grouped}">Details spread out</button>
            </div></div>
          </div>
          <div class="panel lift">
            <div class="panel-h"><h3>Checklist</h3><span class="pill info num" id="pm-score"></span></div>
            <ul class="checks" id="pm-checks"></ul>
            <div class="cta-row" style="margin-top:18px"><button class="btn magnetic" type="button" id="pm-submit">Submit project ${ic("send", "font-size:1.1em")}</button></div>
            <p class="help" style="margin-top:10px">Your tutor will review it and leave feedback. It'll also go into your portfolio.</p>
          </div>
        </div>
      </div>`;
    const q = s => mount.querySelector(s);
    const fill = () => {
      q("#pm-head").value = st.head; q("#pm-sub").value = st.sub; q("#pm-body").value = st.body; q("#pm-cta").value = st.cta || "";
      st.details.forEach((d, i) => q("#pm-d" + i).value = d);
      q("#pm-size").value = st.headSize;
    };
    const draw = () => {
      q("#pm-poster").innerHTML = C().poster(st);
      q("#pm-size").style.setProperty("--fill", ((st.headSize - 6) / 16 * 100) + "%");
      const checks = C().posterChecks(st), n = checks.filter(c => c.ok).length;
      q("#pm-checks").innerHTML = checks.map(c => `<li class="${c.ok ? "ok" : ""}">${ic(c.ok ? "check_circle" : "radio_button_unchecked")}<span>${c.label}${c.ok ? "" : `<br><small class="muted">${c.tip}</small>`}</span></li>`).join("");
      q("#pm-score").textContent = `${n} of ${checks.length}`;
      q("#pm-submit").disabled = n < checks.length;
      q("#pm-submit").title = n < checks.length ? "Tick off every item on the checklist first" : "";
    };
    mount.querySelectorAll("[data-tpl]").forEach(b => b.addEventListener("click", () => {
      st.tpl = b.dataset.tpl; Object.assign(st, JSON.parse(JSON.stringify(templates[st.tpl])));
      setPressed(mount, "[data-tpl]", b); fill(); draw();
    }));
    ["head", "sub", "body", "cta"].forEach(k => q("#pm-" + k).addEventListener("input", e => { st[k] = e.target.value; draw(); }));
    [0, 1, 2].forEach(i => q("#pm-d" + i).addEventListener("input", e => { st.details[i] = e.target.value; draw(); }));
    q("#pm-size").addEventListener("input", e => { st.headSize = +e.target.value; draw(); });
    mount.querySelectorAll("[data-bg]").forEach(b => b.addEventListener("click", () => { st.bg = b.dataset.bg; setPressed(mount, "[data-bg]", b); draw(); }));
    mount.querySelectorAll("[data-fg]").forEach(b => b.addEventListener("click", () => { st.fg = b.dataset.fg; setPressed(mount, "[data-fg]", b); draw(); }));
    mount.querySelectorAll("[data-ac]").forEach(b => b.addEventListener("click", () => { st.accent = b.dataset.ac; setPressed(mount, "[data-ac]", b); draw(); }));
    mount.querySelectorAll("[data-f]").forEach(b => b.addEventListener("click", () => { st.font = b.dataset.f; setPressed(mount, "[data-f]", b); draw(); }));
    mount.querySelectorAll("[data-al]").forEach(b => b.addEventListener("click", () => { st.align = b.dataset.al; setPressed(mount, "[data-al]", b); draw(); }));
    mount.querySelectorAll("[data-gr]").forEach(b => b.addEventListener("click", () => { st.grouped = b.dataset.gr === "1"; setPressed(mount, "[data-gr]", b); draw(); }));
    q("#pm-submit").addEventListener("click", () => submit(JSON.parse(JSON.stringify(st)), q("#pm-poster")));
    fill(); draw();
  }

  /* =====================================================================
     COURSE DEFINITION
     ===================================================================== */
  window.DESIGN_BASICS = {
    id: "design-basics",
    title: "Design Basics",
    tagline: "See it. Fix it. Make it.",
    about: "Learn the four ideas behind every good poster, flyer and screen: contrast, type, layout and colour. Then design a real poster for your school.",
    tutor: "Kelechi Nwosu",
    modules: [
      { n: 1, title: "Contrast", hand: "make it readable", lessons: ["l1", "l2", "l3"] },
      { n: 2, title: "Type", hand: "words have a voice", lessons: ["l4", "l5", "l6"] },
      { n: 3, title: "Layout", hand: "give things room", lessons: ["l7", "l8", "l9"] },
      { n: 4, title: "Colour", hand: "colour with a purpose", lessons: ["l10", "l11", "l12"] },
      { n: 5, title: "Final project", hand: "make it real", lessons: ["l13"] }
    ],
    lessons: {
      l1: { type: "watch", title: "Why some posters disappear", mins: 1, xp: 15, scenes: contrastScenes },
      l2: { type: "practice", title: "Fix the poster", mins: 3, xp: 25, tool: toolContrast, intro: "Change the background and text colours until the poster passes the contrast check." },
      l3: { type: "quiz", title: "Contrast check", mins: 2, xp: 20 },
      l4: { type: "watch", title: "Words have a voice", mins: 1, xp: 15, scenes: typeScenes },
      l5: { type: "practice", title: "Build the hierarchy", mins: 3, xp: 25, tool: toolHierarchy, intro: "Set a size for each line so people read them in the right order." },
      l6: { type: "quiz", title: "Type check", mins: 2, xp: 20 },
      l7: { type: "watch", title: "Give things room", mins: 1, xp: 15, scenes: layoutScenes },
      l8: { type: "practice", title: "Line it up", mins: 3, xp: 25, tool: toolLayout, intro: "Drag the blocks until they all share one left edge. Use the grid if it helps." },
      l9: { type: "quiz", title: "Layout check", mins: 2, xp: 20 },
      l10: { type: "watch", title: "Colour with a purpose", mins: 1, xp: 15, scenes: colourScenes },
      l11: { type: "practice", title: "Build a palette", mins: 3, xp: 25, tool: toolPalette, intro: "Choose a main, a support and an accent colour, then check the button really pops." },
      l12: { type: "quiz", title: "Colour check", mins: 2, xp: 20 },
      l13: { type: "project", title: "Design a poster for your school", mins: 20, xp: 100, intro: "Use everything you've learned. Tick off the checklist, then send it to your tutor." }
    },
    order: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "l11", "l12", "l13"],
    quizzes, renderQuiz, renderProject
  };
})();
