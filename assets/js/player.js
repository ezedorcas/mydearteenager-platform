/* Motion lesson player.
   A lesson is a list of scenes: { dur (seconds), cap: [[atSeconds, "caption"], ...], build(S) }.
   build() lays out the scene and registers animations with S.a(); the player drives every animation's
   currentTime from one clock, so the whole lesson can be paused, scrubbed and replayed exactly. */
(() => {
  "use strict";
  const E = "cubic-bezier(.16,1,.3,1)", SPRING = "cubic-bezier(.34,1.56,.64,1)", IN = "cubic-bezier(.5,0,.75,0)";
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");

  function makeS(root, anims) {
    const S = {
      E, SPRING, IN, root,
      el(tag, cls = "", style = "", html = "", parent = root) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (style) n.setAttribute("style", style);
        if (html) n.innerHTML = html;
        parent.appendChild(n); return n;
      },
      svg(viewBox, d, style = "", parent = root, pathAttrs = "") {
        const w = document.createElement("div");
        w.className = "sc"; w.setAttribute("style", style);
        w.innerHTML = `<svg class="sc-svg" viewBox="${viewBox}" width="100%" height="100%" preserveAspectRatio="none"><path pathLength="1" d="${d}" ${pathAttrs}/></svg>`;
        parent.appendChild(w); return w;
      },
      // fill "both" for an element's first animation on a property; later ones on the same property use "forwards"
      a(el, kf, at = 0, dur = .8, ease = E, fill = "both") {
        const an = el.animate(kf, { duration: dur * 1000, delay: at * 1000, easing: ease, fill });
        an.pause(); anims.push(an); return an;
      },
      // presets
      pop(el, at, dur = .7) { return S.a(el, [{ opacity: 0, transform: "scale(.4) rotate(-12deg)" }, { opacity: 1, transform: "none" }], at, dur, SPRING); },
      drop(el, at, dur = .9, r = 0) { return S.a(el, [{ opacity: 0, transform: `translateY(-30%) rotate(${r + 8}deg)` }, { opacity: 1, transform: `rotate(${r}deg)` }], at, dur, SPRING); },
      rise(el, at, dur = .8) { return S.a(el, [{ opacity: 0, transform: "translateY(40%)" }, { opacity: 1, transform: "none" }], at, dur); },
      fade(el, at, dur = .6, to = 1) { return S.a(el, [{ opacity: 0 }, { opacity: to }], at, dur); },
      out(el, at, dur = .5) { return S.a(el, [{ opacity: 1 }, { opacity: 0 }], at, dur, IN, "forwards"); },
      write(el, at, dur = 1) { return S.a(el, [{ clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% 0 -20% 0)" }], at, dur, "steps(16, end)"); },
      wipe(el, at, dur = .9) { return S.a(el, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], at, dur); },
      draw(wrap, at, dur = 1) { const p = wrap.querySelector("path"); p.style.strokeDasharray = "1"; return S.a(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], at, dur); },
      move(el, from, to, at, dur = .9, ease = E, fill = "forwards") { return S.a(el, [{ transform: from }, { transform: to }], at, dur, ease, fill); },
      to(el, kf, at, dur = .8, ease = E) { return S.a(el, [kf], at, dur, ease, "forwards"); }
    };
    return S;
  }

  window.MotionPlayer = function (mount, lesson, opts = {}) {
    const scenes = lesson.scenes;
    const starts = []; let total = 0;
    scenes.forEach(s => { starts.push(total); total += s.dur; });

    mount.innerHTML = `
      <div class="player">
        <div class="stage" tabindex="0" role="img" aria-label="${(lesson.title || "Lesson").replace(/"/g, "&quot;")} animation. Press space to play or pause.">
          <div class="sc-bg"></div><div class="scene-root" style="position:absolute;inset:0"></div>
          <button class="big-play" type="button" aria-label="Play lesson"><span><span class="ms fill" aria-hidden="true">play_arrow</span></span></button>
        </div>
        <div class="captions" aria-live="polite"></div>
        <div class="controls">
          <button class="ctrl main" type="button" data-act="play" aria-label="Play"><span class="ms fill" aria-hidden="true">play_arrow</span></button>
          <button class="ctrl" type="button" data-act="restart" aria-label="Replay from the start"><span class="ms" aria-hidden="true">replay</span></button>
          <div class="segs" role="slider" tabindex="0" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="${Math.round(total)}" aria-valuenow="0">${scenes.map(s => `<i style="--d:${s.dur}"></i>`).join("")}</div>
          <span class="timecode">0:00 / ${fmt(total)}</span>
          <button class="ctrl toggle" type="button" data-act="cc" aria-pressed="true" aria-label="Captions"><span class="ms" aria-hidden="true">closed_caption</span></button>
          ${"speechSynthesis" in window ? `<button class="ctrl toggle" type="button" data-act="voice" aria-pressed="false" aria-label="Read captions aloud"><span class="ms" aria-hidden="true">record_voice_over</span></button>` : ""}
        </div>
      </div>`;
    const stage = mount.querySelector(".stage"), sceneRoot = mount.querySelector(".scene-root");
    const capEl = mount.querySelector(".captions"), playBtn = mount.querySelector("[data-act=play]");
    const segs = [...mount.querySelectorAll(".segs i")], segBar = mount.querySelector(".segs"), tc = mount.querySelector(".timecode");
    const bigPlay = mount.querySelector(".big-play");
    let t = 0, playing = false, idx = -1, anims = [], cap = "", last = 0, raf = 0, ended = false, maxT = 0, voice = false;

    function fmt(s) { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
    function build(i) {
      anims.forEach(a => a.cancel()); anims = [];
      sceneRoot.innerHTML = "";
      const S = makeS(sceneRoot, anims);
      scenes[i].build(S);
      idx = i;
    }
    function captionsFor(i) { return (opts.captions && opts.captions[i]) ? [[0, opts.captions[i]]] : scenes[i].cap; }
    function render() {
      let i = scenes.length - 1;
      for (let k = 0; k < scenes.length; k++) if (t < starts[k] + scenes[k].dur) { i = k; break; }
      if (i !== idx) build(i);
      const local = t - starts[i];
      const ms = reduceMQ.matches ? 1e7 : local * 1000;
      anims.forEach(a => { try { a.currentTime = ms; } catch (_) {} });
      const cues = captionsFor(i);
      let txt = cues[0][1];
      cues.forEach(c => { if (local >= c[0]) txt = c[1]; });
      if (txt !== cap) {
        cap = txt; capEl.textContent = txt;
        if (voice && playing) speak(txt);
      }
      segs.forEach((s, k) => s.style.setProperty("--f", k < i ? 1 : k > i ? 0 : Math.min(1, local / scenes[k].dur)));
      tc.textContent = `${fmt(t)} / ${fmt(total)}`;
      segBar.setAttribute("aria-valuenow", Math.round(t));
      if (t > maxT) { maxT = t; if (opts.onProgress) opts.onProgress(maxT / total); }
    }
    function speak(txt) {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(txt);
        const v = speechSynthesis.getVoices().find(v => /en-(NG|GB)/.test(v.lang)) || speechSynthesis.getVoices().find(v => /^en/.test(v.lang));
        if (v) u.voice = v;
        u.rate = .98; speechSynthesis.speak(u);
      } catch (_) {}
    }
    function tick(now) {
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      if (playing) {
        t += dt;
        if (t >= total) { t = total - .001; setPlaying(false); if (!ended) { ended = true; if (opts.onEnd) opts.onEnd(); } }
        render();
      }
      raf = requestAnimationFrame(tick);
    }
    function setPlaying(p) {
      playing = p;
      if (p && t >= total - .01) { t = 0; idx = -1; }
      playBtn.innerHTML = `<span class="ms fill" aria-hidden="true">${p ? "pause" : "play_arrow"}</span>`;
      playBtn.setAttribute("aria-label", p ? "Pause" : "Play");
      bigPlay.hidden = p || t > 0;
      if (!p && voice) { try { speechSynthesis.cancel(); } catch (_) {} }
      if (p && voice) speak(cap);
    }
    function seek(nt) { t = Math.max(0, Math.min(total - .001, nt)); render(); bigPlay.hidden = true; }

    playBtn.addEventListener("click", () => setPlaying(!playing));
    bigPlay.addEventListener("click", e => { e.stopPropagation(); setPlaying(true); });
    stage.addEventListener("click", () => setPlaying(!playing));
    mount.querySelector("[data-act=restart]").addEventListener("click", () => { seek(0); setPlaying(true); });
    mount.querySelector("[data-act=cc]").addEventListener("click", e => {
      const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
      e.currentTarget.setAttribute("aria-pressed", String(on)); capEl.hidden = !on;
    });
    const vb = mount.querySelector("[data-act=voice]");
    if (vb) vb.addEventListener("click", () => {
      voice = !voice; vb.setAttribute("aria-pressed", String(voice));
      if (voice && playing) speak(cap); else { try { speechSynthesis.cancel(); } catch (_) {} }
    });
    segBar.addEventListener("click", e => {
      const r = segBar.getBoundingClientRect();
      seek((e.clientX - r.left) / r.width * total);
    });
    const keys = e => {
      if (e.key === " " || e.key === "k") { e.preventDefault(); setPlaying(!playing); }
      if (e.key === "ArrowRight") { e.preventDefault(); seek(t + 5); }
      if (e.key === "ArrowLeft") { e.preventDefault(); seek(t - 5); }
    };
    stage.addEventListener("keydown", keys); segBar.addEventListener("keydown", keys);

    build(0); render(); bigPlay.hidden = false;
    last = performance.now(); raf = requestAnimationFrame(tick);
    if (opts.autoplay) setPlaying(true);

    const api = {
      destroy() { cancelAnimationFrame(raf); try { speechSynthesis.cancel(); } catch (_) {} anims.forEach(a => a.cancel()); },
      seek, play: () => setPlaying(true), pause: () => setPlaying(false), get duration() { return total; }, get time() { return t; },
      stage
    };
    window.__player = api; // used for exporting lessons to video
    return api;
  };
})();
