/* SIMUX — AI Case Championship Simulator (MVP v1.0)
   Vanilla JS single-page app. Data is stored in the browser (localStorage). */
(() => {
  "use strict";

  // ---------- config ----------
  const CONFIG = {
    // Paste your Google Form link here to show a "Give feedback" button everywhere:
    feedbackUrl: "",
    storageKey: "simux.v1",
  };

  const INDUSTRIES = ["Retail / FMCG", "FinTech / Banking", "Oil, Gas & Energy", "Telecom", "Logistics & Transport", "AgriTech & Food", "EdTech", "Healthcare", "Tourism & Hospitality", "E-commerce", "Mining & Metals", "Real Estate"];
  const CASE_TYPES = ["Market entry", "Profitability", "Growth strategy", "Pricing", "New product launch", "Digital transformation", "Investment / M&A"];
  const DIFFICULTY = ["Beginner", "Intermediate", "Advanced"];
  const MINUTES = [15, 30, 45, 60];
  const CRITERIA = [
    { key: "structure", name: "Problem structuring" },
    { key: "insight", name: "Data & insight" },
    { key: "logic", name: "Logic & decision" },
    { key: "feasibility", name: "Feasibility" },
    { key: "communication", name: "Communication" },
  ];
  const STEPS = [
    { key: "problem", title: "Define the problem", tip: "In 1–3 sentences: what decision must the client make, and what does success look like?", ph: "The client needs to decide… Success means…" },
    { key: "structure", title: "Structure & hypotheses", tip: "Build a MECE issue tree or framework for THIS case and state your initial hypothesis.", ph: "Hypothesis: …\n1. Market attractiveness\n   – size, growth, competition\n2. Economics\n   – …" },
    { key: "analysis", title: "Analysis & key numbers", tip: "Use the exhibits. Show the 3–5 calculations that drive the decision. State assumptions for missing data.", ph: "Revenue per store = cups × ticket × days = …\nAssumption: …" },
    { key: "recommendation", title: "Recommendation", tip: "Answer first: one clear recommendation and 3 reasons backed by numbers.", ph: "We recommend… because (1)… (2)… (3)…" },
    { key: "risks", title: "Risks, KPIs & next steps", tip: "Top risks with mitigations, KPIs to track and a short implementation timeline.", ph: "Risk 1: … → Mitigation: …\nKPIs: …\nMonth 1–3: …" },
  ];

  // ---------- helpers ----------
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nl2br = (s) => esc(s).replace(/\n/g, "<br>");
  const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []);
  const words = (s) => (String(s || "").trim().match(/\S+/g) || []).length;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmtDate = (t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const app = $("#app");

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // ---------- storage ----------
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(CONFIG.storageKey) || "null");
      if (s && typeof s === "object") return { active: s.active || null, history: arr(s.history), prefs: s.prefs || {} };
    } catch (e) { /* ignore */ }
    return { active: null, history: [], prefs: {} };
  }
  let S = load();
  function save() {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(S)); } catch (e) { toast("Could not save progress in this browser."); }
  }

  // ---------- AI ----------
  async function ai(action, payload) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 90000);
    let r;
    try {
      r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, payload }), signal: ctrl.signal });
    } catch (e) {
      throw new Error(e.name === "AbortError" ? "The AI took too long to answer. Please try again." : "Network error — check your internet connection.");
    } finally { clearTimeout(to); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.error) throw new Error(j.error || `Server error (${r.status}).`);
    return j.data;
  }

  function loadingView(messages) {
    app.innerHTML = `<div class="loading"><div class="spinner"></div><h3 id="lm">${esc(messages[0])}</h3><p class="muted">Usually takes 5–20 seconds.</p></div>`;
    let i = 0;
    const iv = setInterval(() => {
      const el = $("#lm");
      if (!el) return clearInterval(iv);
      i = (i + 1) % messages.length;
      el.textContent = messages[i];
    }, 2800);
    return () => clearInterval(iv);
  }

  function errorView(msg, retryFn, backHref = "#/new") {
    app.innerHTML = `<div class="card" style="max-width:640px;margin:30px auto">
      <h2>Something went wrong</h2>
      <div class="error">${esc(msg)}</div>
      <div class="row"><button class="btn" id="retry">Try again</button><a class="btn secondary" href="${backHref}">Back</a></div></div>`;
    $("#retry").onclick = retryFn;
  }

  // ---------- normalisers ----------
  function normCase(c, meta) {
    c = c || {};
    return {
      id: c.id || uid(),
      title: String(c.title || "Untitled case"),
      company: String(c.company || ""),
      industry: String(c.industry || meta.industry || ""),
      caseType: String(c.caseType || meta.caseType || ""),
      difficulty: meta.difficulty || c.difficulty || "Intermediate",
      minutes: Number(meta.minutes || c.minutes) || 30,
      hook: String(c.hook || ""),
      background: arr(c.background).map(String),
      situation: arr(c.situation).map(String),
      task: String(c.task || ""),
      deliverables: arr(c.deliverables).map(String),
      exhibits: arr(c.exhibits).map((e) => ({ title: String(e.title || "Exhibit"), columns: arr(e.columns).map(String), rows: arr(e.rows).map((r) => arr(r).map(String)), note: String(e.note || "") })),
      answerKey: c.answerKey || {},
    };
  }
  function normResult(r) {
    r = r || {};
    const crit = CRITERIA.map((c) => {
      const f = arr(r.criteria).find((x) => x && x.key === c.key) || {};
      return { key: c.key, name: c.name, score: clamp(Math.round(Number(f.score) || 0), 0, 10), comment: String(f.comment || "") };
    });
    let overall = Number(r.overall);
    if (!isFinite(overall)) overall = (crit.reduce((s, c) => s + c.score, 0) / crit.length) * 10;
    return {
      overall: clamp(Math.round(overall), 0, 100),
      verdict: String(r.verdict || ""),
      criteria: crit,
      strengths: arr(r.strengths).map(String),
      improvements: arr(r.improvements).map((x) => (typeof x === "string" ? { issue: x, how: "" } : { issue: String(x.issue || ""), how: String(x.how || "") })),
      missedInsights: arr(r.missedInsights).map(String),
      modelSolution: { summary: String(r.modelSolution?.summary || ""), structure: arr(r.modelSolution?.structure).map(String), recommendation: String(r.modelSolution?.recommendation || "") },
      juryQuestions: arr(r.juryQuestions).map(String).slice(0, 3),
      nextPractice: { focus: String(r.nextPractice?.focus || ""), why: String(r.nextPractice?.why || ""), suggestedCaseType: String(r.nextPractice?.suggestedCaseType || "") },
    };
  }

  // ---------- timer ----------
  let timerIv = null;
  function renderTimer() {
    const slot = $("#timer-slot");
    const onCase = location.hash.startsWith("#/case");
    if (!S.active || !onCase) { slot.innerHTML = ""; return; }
    const elapsed = (Date.now() - S.active.startedAt) / 1000;
    const left = S.active.minutes * 60 - elapsed;
    const abs = Math.abs(left);
    const mm = String(Math.floor(abs / 60)).padStart(2, "0");
    const ss = String(Math.floor(abs % 60)).padStart(2, "0");
    const cls = left < 0 ? "over" : left < 300 ? "warn" : "";
    slot.innerHTML = `<span class="timer ${cls}" title="${left < 0 ? "Overtime" : "Time left"}">⏱ ${left < 0 ? "+" : ""}${mm}:${ss}</span>`;
  }
  function startTimer() { clearInterval(timerIv); timerIv = setInterval(renderTimer, 1000); renderTimer(); }

  // ---------- views ----------
  function viewHome() {
    const last = S.history[S.history.length - 1];
    app.innerHTML = `
    <section class="hero">
      <div>
        <div class="eyebrow">AI case championship simulator</div>
        <h1>Train like it's the final round.<br>Get feedback like a real jury.</h1>
        <p class="lead">SIMUX generates realistic Kazakhstan business cases, lets you solve them under time pressure with a structured workspace, and gives you instant, specific feedback from an AI jury — so you know exactly what to fix before the championship.</p>
        <div class="row" style="margin-top:22px">
          <a class="btn lg" href="#/new">Start a practice case →</a>
          ${S.active ? `<a class="btn secondary lg" href="#/case">Continue current case</a>` : last ? `<a class="btn secondary lg" href="#/dashboard">View my progress</a>` : ""}
        </div>
        <p class="muted" style="margin-top:14px;font-size:14px">Free · No sign-up · Works on phone and laptop</p>
      </div>
      <div class="hero-card" aria-label="Example AI jury score">
        <div style="opacity:.8;font-size:13px;font-weight:600">AI JURY · EXAMPLE RESULT</div>
        <div class="row" style="justify-content:space-between;margin:8px 0 4px"><div class="score-big">74<span style="font-size:22px;opacity:.7">/100</span></div><span class="pill" style="background:rgba(255,255,255,.15);color:#fff;border-color:transparent">Solid</span></div>
        <div style="font-size:14px;opacity:.9">“Good structure, but your payback math ignored rent — the jury would challenge that.”</div>
        ${[["Problem structuring", 8], ["Data & insight", 6], ["Logic & decision", 8], ["Feasibility", 7], ["Communication", 8]].map(([n, v]) => `<div class="crit"><span>${n}</span><b style="text-align:right">${v}/10</b><div class="bar" style="grid-column:1/-1"><i style="width:${v * 10}%"></i></div></div>`).join("")}
      </div>
    </section>

    <section class="section">
      <div class="eyebrow">Why SIMUX</div>
      <h2>Built on research with 65 MNU students</h2>
      <p class="sub" style="max-width:720px">We surveyed students who prepare for case championships. The same three problems came up again and again:</p>
      <div class="grid g3" style="margin-top:16px">
        <div class="card pain"><span class="pill accent">Time pressure</span><h3>Little time, no realistic practice</h3><p class="sub">Students prepare between midterms and work, and rarely practise under real time limits.</p><div class="quote">“We ended up starting really late and doing almost everything at the last minute.”</div></div>
        <div class="card pain"><span class="pill accent">Information overload</span><h3>Hard to see what matters</h3><p class="sub">Cases come with lots of data; the hardest part is filtering what actually drives the decision.</p><div class="quote">“It is easy to spend too much time analysing things that do not really affect the decision.”</div></div>
        <div class="card pain"><span class="pill accent">No feedback</span><h3>No one tells you what was wrong</h3><p class="sub">After a case most students don't know how well they did — or how a winning team would have solved it.</p><div class="quote">“Lack of confidence that I analysed a case efficiently and concluded in a right way.”</div></div>
      </div>
    </section>

    <section class="section">
      <div class="eyebrow">How it works</div>
      <h2>One loop, practised every week</h2>
      <div class="grid g4" style="margin-top:16px">
        ${[["1", "Get a case", "AI writes a fresh case for your industry, case type and level — with exhibits, noise and missing data, like the real thing."], ["2", "Solve against the clock", "A guided 5-step workspace: problem → structure → analysis → recommendation → risks. Ask the AI coach for a hint if stuck."], ["3", "Face the AI jury", "Get a 0–100 score on 5 jury criteria, specific fixes, missed insights and a model solution."], ["4", "Defend & improve", "Answer tough jury questions, then track your skills over time and get your next practice focus."]].map(([n, t, d]) => `<div class="card"><div class="step-num">${n}</div><h3 style="margin-top:12px">${t}</h3><p class="sub" style="margin:0">${d}</p></div>`).join("")}
      </div>
    </section>

    <section class="section card" style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
      <div><h2 style="margin:0">Ready for your first case?</h2><p class="sub" style="margin:4px 0 0">Takes 15–60 minutes. Your progress is saved in this browser.</p></div>
      <a class="btn lg" href="#/new">Start practising →</a>
    </section>`;
  }

  function viewNew() {
    const p = Object.assign({ industry: INDUSTRIES[0], caseType: CASE_TYPES[0], difficulty: "Intermediate", minutes: 30 }, S.prefs);
    const chipGroup = (name, opts, cur, fmt = (x) => x) => `<div class="chips" data-group="${name}">${opts.map((o) => `<button type="button" class="chip" data-v="${esc(o)}" aria-pressed="${String(o) === String(cur)}">${esc(fmt(o))}</button>`).join("")}</div>`;
    app.innerHTML = `
      ${S.active ? `<div class="card" style="margin-bottom:16px;display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><b>You have an unfinished case:</b> ${esc(S.active.case.title)}</div><div class="row"><a class="btn small" href="#/case">Continue</a><button class="btn small secondary" id="discard">Discard</button></div></div>` : ""}
      <div class="grid newgrid">
        <div class="card">
          <div class="eyebrow">New AI case</div>
          <h2>Generate a case for you</h2>
          <p class="sub">Pick the conditions of your next championship round.</p>
          <label class="f" style="margin-top:16px">Industry</label>
          <select id="industry">${INDUSTRIES.map((i) => `<option ${i === p.industry ? "selected" : ""}>${esc(i)}</option>`).join("")}</select>
          <label class="f" style="margin-top:16px">Case type</label>
          ${chipGroup("caseType", CASE_TYPES, p.caseType)}
          <label class="f" style="margin-top:16px">Difficulty</label>
          ${chipGroup("difficulty", DIFFICULTY, p.difficulty)}
          <label class="f" style="margin-top:16px">Time limit</label>
          ${chipGroup("minutes", MINUTES, p.minutes, (m) => m + " min")}
          <div class="row" style="margin-top:22px"><button class="btn lg" id="gen">✨ Generate case & start timer</button></div>
        </div>
        <div>
          <div class="card">
            <div class="eyebrow">Quick start</div>
            <h3>Ready-made practice cases</h3>
            <p class="sub" style="font-size:14px">Hand-written cases with an answer key — great for your first try.</p>
            ${window.SIMUX_SAMPLES.map((s) => `<div style="border-top:1px solid var(--line);padding:12px 0">
              <div style="font-weight:700">${esc(s.title)}</div>
              <div class="row" style="gap:6px;margin:6px 0"><span class="pill">${esc(s.industry)}</span><span class="pill">${esc(s.caseType)}</span><span class="pill">${esc(s.difficulty)} · ${s.minutes} min</span></div>
              <p class="sub" style="font-size:14px;margin:0 0 8px">${esc(s.hook)}</p>
              <button class="btn small secondary" data-sample="${s.id}">Start this case</button></div>`).join("")}
          </div>
        </div>
      </div>`;
    $$(".chips").forEach((g) => g.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", g).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    }));
    const val = (g) => $(`.chips[data-group=${g}] .chip[aria-pressed=true]`)?.dataset.v;
    const dis = $("#discard");
    if (dis) dis.onclick = () => { S.active = null; save(); toast("Case discarded"); viewNew(); };
    $$("[data-sample]").forEach((b) => (b.onclick = () => {
      const s = window.SIMUX_SAMPLES.find((x) => x.id === b.dataset.sample);
      startCase(normCase(JSON.parse(JSON.stringify(s)), s), "sample");
    }));
    $("#gen").onclick = async () => {
      const meta = { industry: $("#industry").value, caseType: val("caseType"), difficulty: val("difficulty"), minutes: Number(val("minutes")) };
      S.prefs = meta; save();
      const run = async () => {
        const stop = loadingView(["Researching the market…", "Building the exhibits…", "Hiding a few traps in the data…", "Writing the CEO's question…"]);
        try {
          const c = await ai("generate_case", meta);
          stop();
          startCase(normCase(c, meta), "ai");
        } catch (e) { stop(); errorView(e.message, run); }
      };
      run();
    };
  }

  function startCase(c, source) {
    S.active = { case: c, answers: {}, startedAt: Date.now(), minutes: c.minutes, hints: [], source };
    save();
    location.hash = "#/case";
  }

  function caseDocHTML(c) {
    return `
      <div class="row" style="gap:6px;margin-bottom:10px"><span class="pill accent">${esc(c.industry)}</span><span class="pill">${esc(c.caseType)}</span><span class="pill">${esc(c.difficulty)}</span></div>
      <h2>${esc(c.title)}</h2>
      ${c.hook ? `<p class="sub"><i>${esc(c.hook)}</i></p>` : ""}
      <h3 style="margin-top:16px">Background</h3>${c.background.map((p) => `<p>${esc(p)}</p>`).join("")}
      <h3 style="margin-top:12px">Situation</h3>${c.situation.map((p) => `<p>${esc(p)}</p>`).join("")}
      <div class="task">🎯 ${esc(c.task)}</div>
      ${c.deliverables.length ? `<h3>The jury expects</h3><ul>${c.deliverables.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
      ${c.exhibits.map((e) => `<div class="exhibit"><h4>${esc(e.title)}</h4><div class="table-scroll"><table class="ex"><thead><tr>${e.columns.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${e.rows.map((r) => `<tr>${r.map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${e.note ? `<div class="note">${esc(e.note)}</div>` : ""}</div>`).join("")}`;
  }

  function viewCase() {
    if (!S.active) { location.hash = "#/new"; return; }
    const A = S.active;
    const c = A.case;
    app.innerHTML = `
      <div class="mobile-tabs"><button class="btn small" data-tab="case">📄 Case</button><button class="btn small secondary" data-tab="ws">✍️ My solution</button></div>
      <div class="case-layout" data-tab="case">
        <article class="card case-doc">${caseDocHTML(c)}</article>
        <section class="ws">
          <div class="card" style="padding:18px">
            <div class="row" style="justify-content:space-between">
              <div><div class="eyebrow" style="margin:0">Your solution</div><div class="muted" style="font-size:13px">Autosaved · <span id="hints-left"></span></div></div>
              <button class="btn ghost small" id="abandon">Exit case</button>
            </div>
          </div>
          <div style="margin-top:12px">
          ${STEPS.map((s, i) => `
            <div class="step" data-step="${s.key}">
              <div class="step-head"><span class="n">${i + 1}</span><h3>${s.title}</h3><span class="done" data-done="${s.key}"></span></div>
              <div class="tip">${s.tip}</div>
              <textarea data-k="${s.key}" placeholder="${esc(s.ph)}" rows="${s.key === "analysis" ? 7 : 4}">${esc(A.answers[s.key] || "")}</textarea>
              <div class="row" style="justify-content:space-between;margin-top:6px"><button class="btn ghost small" data-hint="${s.key}">💡 Ask AI coach</button><span class="wordcount" data-wc="${s.key}"></span></div>
              <div data-hints="${s.key}">${A.hints.filter((h) => h.step === s.key).map(hintHTML).join("")}</div>
            </div>`).join("")}
          </div>
          <div class="card" style="padding:18px">
            <div id="submit-msg"></div>
            <button class="btn lg teal" id="submit" style="width:100%">Submit to the AI jury →</button>
            <p class="muted" style="font-size:13px;margin:8px 0 0;text-align:center">You'll get a score, specific feedback and a model solution.</p>
          </div>
        </section>
      </div>`;
    startTimer();
    const MAX_HINTS = 3;
    const updMeta = () => {
      $("#hints-left").textContent = `${Math.max(0, MAX_HINTS - A.hints.length)} coach hints left`;
      STEPS.forEach((s) => {
        const w = words(A.answers[s.key]);
        $(`[data-wc=${s.key}]`).textContent = w ? `${w} words` : "";
        $(`[data-done=${s.key}]`).textContent = w >= 8 ? "✓ drafted" : "";
      });
    };
    updMeta();
    let saveT;
    $$("textarea[data-k]").forEach((t) => t.addEventListener("input", () => {
      A.answers[t.dataset.k] = t.value;
      clearTimeout(saveT);
      saveT = setTimeout(save, 400);
      updMeta();
    }));
    $$(".mobile-tabs [data-tab]").forEach((b) => (b.onclick = () => {
      $(".case-layout").dataset.tab = b.dataset.tab;
      $$(".mobile-tabs [data-tab]").forEach((x) => x.classList.toggle("secondary", x !== b));
      window.scrollTo(0, 0);
    }));
    $("#abandon").onclick = () => { location.hash = "#/new"; };
    $$("[data-hint]").forEach((b) => (b.onclick = async () => {
      const step = b.dataset.hint;
      if (A.hints.length >= MAX_HINTS) return toast("You've used all 3 coach hints — trust your instincts!");
      b.disabled = true; const old = b.textContent; b.textContent = "Coach is thinking…";
      try {
        const st = STEPS.find((s) => s.key === step);
        const h = await ai("coach", { case: c, step: st.title, current: A.answers[step] || "" });
        const item = { step, hint: String(h.hint || ""), question: String(h.question || "") };
        A.hints.push(item); save();
        $(`[data-hints=${step}]`).insertAdjacentHTML("beforeend", hintHTML(item));
        updMeta();
      } catch (e) { toast(e.message); }
      b.disabled = false; b.textContent = old;
    }));
    $("#submit").onclick = submitCase;
  }
  function hintHTML(h) {
    return `<div class="hint-box"><b>Coach:</b> ${esc(h.hint)}${h.question ? `<div style="margin-top:4px"><b>Ask yourself:</b> ${esc(h.question)}</div>` : ""}</div>`;
  }

  async function submitCase() {
    const A = S.active;
    if (!A) return;
    const total = STEPS.reduce((s, x) => s + words(A.answers[x.key]), 0);
    if (words(A.answers.recommendation) < 5 || total < 25) {
      $("#submit-msg").innerHTML = `<div class="error" style="margin-top:0">Write at least a short recommendation (step 4) before submitting — the jury needs something to grade.</div>`;
      return;
    }
    const minutesUsed = Math.max(1, Math.round((Date.now() - A.startedAt) / 60000));
    const run = async () => {
      const stop = loadingView(["The jury is reading your solution…", "Checking your numbers…", "Comparing with winning solutions…", "Preparing tough questions…"]);
      try {
        const r = normResult(await ai("evaluate", { case: A.case, answers: A.answers, minutesUsed, minutesLimit: A.minutes, hintsUsed: A.hints.length }));
        stop();
        const item = { id: uid(), date: Date.now(), case: A.case, answers: A.answers, minutesUsed, minutesLimit: A.minutes, hintsUsed: A.hints.length, source: A.source, result: r, jury: null };
        S.history.push(item);
        S.active = null;
        save();
        location.hash = "#/result/" + item.id;
      } catch (e) { stop(); errorView(e.message, run, "#/case"); }
    };
    run();
  }

  const band = (v) => (v >= 80 ? ["Strong", "var(--good)"] : v >= 65 ? ["Solid", "var(--accent)"] : v >= 45 ? ["Developing", "var(--warn)"] : ["Needs work", "var(--bad)"]);

  function ringSVG(v) {
    const r = 62, C = 2 * Math.PI * r, [lab, col] = band(v);
    return `<svg class="score-ring" viewBox="0 0 150 150" role="img" aria-label="Overall score ${v} out of 100">
      <circle cx="75" cy="75" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="12"/>
      <circle cx="75" cy="75" r="${r}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(C * v) / 100} ${C}" transform="rotate(-90 75 75)"/>
      <text x="75" y="76" text-anchor="middle" font-size="40" font-weight="800" fill="var(--ink)">${v}</text>
      <text x="75" y="100" text-anchor="middle" font-size="13" fill="var(--muted)">/ 100 · ${lab}</text></svg>`;
  }

  function viewResult(id) {
    const it = S.history.find((x) => x.id === id);
    if (!it) { app.innerHTML = `<div class="card empty"><h2>Result not found</h2><a class="btn" href="#/dashboard">Go to progress</a></div>`; return; }
    const r = it.result, c = it.case;
    const prev = S.history.filter((x) => x.date < it.date).slice(-1)[0];
    const delta = prev ? r.overall - prev.result.overall : null;
    app.innerHTML = `
      <div class="card">
        <div class="result-head">
          ${ringSVG(r.overall)}
          <div style="flex:1;min-width:0">
            <div class="eyebrow">AI jury verdict</div>
            <h2 style="margin-bottom:6px">${esc(c.title)}</h2>
            <p style="font-size:17px;margin-bottom:10px">“${esc(r.verdict)}”</p>
            <div class="row" style="gap:6px"><span class="pill">${esc(c.caseType)}</span><span class="pill">${esc(c.difficulty)}</span><span class="pill">⏱ ${it.minutesUsed} / ${it.minutesLimit} min</span><span class="pill">💡 ${it.hintsUsed} hints</span>${delta !== null ? `<span class="pill ${delta >= 0 ? "teal" : ""}">${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)} vs last case</span>` : ""}</div>
          </div>
        </div>
      </div>

      <div class="grid g2" style="margin-top:16px;align-items:start">
        <div class="card">
          <h3>Scores by jury criteria</h3>
          ${r.criteria.map((k) => `<div class="crit-row"><span class="name">${esc(k.name)}</span><div class="meter"><i style="width:${k.score * 10}%"></i></div><span class="val">${k.score}/10</span>${k.comment ? `<div class="comment">${esc(k.comment)}</div>` : ""}</div>`).join("")}
        </div>
        <div>
          <div class="card"><h3>What you did well</h3><ul class="clean plus">${r.strengths.map((s) => `<li>${esc(s)}</li>`).join("") || "<li>—</li>"}</ul></div>
          <div class="card"><h3>How to improve</h3><ul class="clean arrow">${r.improvements.map((s) => `<li><b>${esc(s.issue)}</b>${s.how ? `<br><span class="sub">${esc(s.how)}</span>` : ""}</li>`).join("")}</ul></div>
          ${r.missedInsights.length ? `<div class="card"><h3>Insights you missed</h3><ul class="clean miss">${r.missedInsights.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>` : ""}
        </div>
      </div>

      <div class="card" style="margin-top:16px">
        <div class="eyebrow">Model solution</div>
        <h3>How a winning team would answer</h3>
        <p>${esc(r.modelSolution.summary)}</p>
        ${r.modelSolution.structure.length ? `<ol>${r.modelSolution.structure.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}
        ${r.modelSolution.recommendation ? `<div class="task" style="background:var(--teal-soft);border-color:#c8ebe6;font-weight:500">${esc(r.modelSolution.recommendation)}</div>` : ""}
        <details style="margin-top:8px"><summary class="muted" style="cursor:pointer">Show my submitted solution</summary>
          ${STEPS.map((s) => `<h4 style="margin-top:12px">${s.title}</h4><p class="sub">${nl2br(it.answers[s.key] || "—")}</p>`).join("")}
        </details>
      </div>

      <div class="card" style="margin-top:16px" id="jury">
        <div class="eyebrow">Jury Q&amp;A simulation</div>
        <h3>Defend your recommendation</h3>
        <p class="sub">In the final round the jury will push back. Answer like you're on stage — short and confident.</p>
        <div id="jury-body"></div>
      </div>

      <div class="card" style="margin-top:16px;display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap">
        <div><div class="eyebrow">Your next practice</div><h3 style="margin:0">${esc(r.nextPractice.focus || "Keep practising")}</h3><p class="sub" style="margin:4px 0 0">${esc(r.nextPractice.why)}</p></div>
        <div class="row"><button class="btn" id="next">Practice this →</button><button class="btn secondary" id="copy">Copy summary</button>${CONFIG.feedbackUrl ? `<a class="btn secondary" target="_blank" rel="noopener" href="${esc(CONFIG.feedbackUrl)}">Rate SIMUX</a>` : ""}</div>
      </div>`;
    renderJury(it);
    $("#next").onclick = () => {
      const t = CASE_TYPES.find((x) => x.toLowerCase() === r.nextPractice.suggestedCaseType.toLowerCase());
      if (t) { S.prefs = Object.assign({}, S.prefs, { caseType: t }); save(); }
      location.hash = "#/new";
    };
    $("#copy").onclick = () => {
      const txt = `SIMUX result — ${c.title}\nScore: ${r.overall}/100 (${band(r.overall)[0]})\n${r.criteria.map((k) => `• ${k.name}: ${k.score}/10`).join("\n")}\nVerdict: ${r.verdict}\nNext focus: ${r.nextPractice.focus}`;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast("Summary copied"), () => toast("Copy not available in this browser"));
    };
  }

  function renderJury(it) {
    const body = $("#jury-body");
    const qs = it.result.juryQuestions;
    if (!qs.length) { body.innerHTML = `<p class="muted">No jury questions for this case.</p>`; return; }
    if (it.jury) {
      body.innerHTML = qs.map((q, i) => {
        const rt = it.jury.ratings[i] || {};
        return `<div class="qa"><div class="q">Q${i + 1}. ${esc(q)}</div><div class="sub">${nl2br(it.jury.answers[i] || "—")}</div>
          <div class="rating"><b>${clamp(Number(rt.score) || 0, 0, 10)}/10</b> — ${esc(rt.feedback || "")}${rt.betterAnswer ? `<div style="margin-top:6px"><b>Stronger answer:</b> ${esc(rt.betterAnswer)}</div>` : ""}</div></div>`;
      }).join("") + (it.jury.overallComment ? `<p><b>Jury:</b> ${esc(it.jury.overallComment)}</p>` : "");
      return;
    }
    body.innerHTML = qs.map((q, i) => `<div class="qa"><div class="q">Q${i + 1}. ${esc(q)}</div><textarea rows="3" data-qa="${i}" placeholder="Your answer…"></textarea></div>`).join("") +
      `<button class="btn" id="jury-go">Get jury feedback on my answers</button>`;
    $("#jury-go").onclick = async () => {
      const answers = qs.map((_, i) => $(`[data-qa="${i}"]`).value.trim());
      if (answers.every((a) => !a)) return toast("Answer at least one question first");
      const b = $("#jury-go"); b.disabled = true; b.textContent = "The jury is deliberating…";
      try {
        const j = await ai("jury", { case: it.case, recommendation: it.answers.recommendation, qa: qs.map((q, i) => ({ q, a: answers[i] })) });
        it.jury = { answers, ratings: arr(j.ratings), overallComment: String(j.overallComment || "") };
        save(); renderJury(it);
      } catch (e) { toast(e.message); b.disabled = false; b.textContent = "Get jury feedback on my answers"; }
    };
  }

  // ---------- dashboard ----------
  function lineChart(items) {
    const W = 640, H = 230, P = { l: 36, r: 16, t: 14, b: 30 };
    const n = items.length;
    const x = (i) => P.l + (n === 1 ? (W - P.l - P.r) / 2 : (i * (W - P.l - P.r)) / (n - 1));
    const y = (v) => P.t + (1 - v / 100) * (H - P.t - P.b);
    const pts = items.map((it, i) => [x(i), y(it.result.overall)]);
    const grid = [0, 25, 50, 75, 100].map((v) => `<line x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${P.l - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${v}</text>`).join("");
    const xl = items.map((it, i) => (n <= 12 || i % Math.ceil(n / 12) === 0 ? `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--muted)">#${i + 1}</text>` : "")).join("");
    const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const area = n > 1 ? `<path d="${path} L${pts[n - 1][0]} ${y(0)} L${pts[0][0]} ${y(0)} Z" fill="var(--accent)" opacity=".07"/>` : "";
    return `<div class="chart-wrap" id="lc"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Overall score per case">
      ${grid}${xl}${area}<path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>
      <line id="lc-x" y1="${P.t}" y2="${H - P.b}" stroke="var(--muted)" stroke-dasharray="3 3" opacity="0"/>
      ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="var(--surface)" stroke="var(--accent)" stroke-width="2" data-i="${i}"/>`).join("")}
      <rect x="${P.l}" y="0" width="${W - P.l - P.r}" height="${H}" fill="transparent" id="lc-hit"/>
    </svg><div class="chart-tip" id="lc-tip"></div></div>`;
  }
  function bindLineChart(items) {
    const wrap = $("#lc"); if (!wrap) return;
    const svg = $("svg", wrap), tip = $("#lc-tip"), xl = $("#lc-x"), hit = $("#lc-hit");
    const circles = $$("circle", svg);
    const show = (ev) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * 640;
      let best = 0, bd = Infinity;
      circles.forEach((c, i) => { const d = Math.abs(+c.getAttribute("cx") - sx); if (d < bd) { bd = d; best = i; } });
      const c = circles[best], it = items[best];
      xl.setAttribute("x1", c.getAttribute("cx")); xl.setAttribute("x2", c.getAttribute("cx")); xl.setAttribute("opacity", "1");
      circles.forEach((cc, i) => cc.setAttribute("r", i === best ? 6.5 : 4.5));
      tip.innerHTML = `<b>${it.result.overall}/100</b> · ${esc(it.case.title.slice(0, 34))}<br><span style="opacity:.75">${fmtDate(it.date)} · ${esc(it.case.caseType)}</span>`;
      tip.style.left = (+c.getAttribute("cx") / 640) * rect.width + "px";
      tip.style.top = (+c.getAttribute("cy") / 230) * rect.height + "px";
      tip.classList.add("show");
    };
    const hide = () => { tip.classList.remove("show"); xl.setAttribute("opacity", "0"); circles.forEach((cc) => cc.setAttribute("r", 4.5)); };
    hit.addEventListener("mousemove", show); hit.addEventListener("mouseleave", hide);
    hit.addEventListener("click", (ev) => { show(ev); });
  }

  function viewDashboard() {
    const H = S.history.slice().sort((a, b) => a.date - b.date);
    if (!H.length) {
      app.innerHTML = `<div class="card empty"><div style="font-size:42px">📈</div><h2>No cases solved yet</h2><p class="sub">Solve your first case and your skills dashboard will appear here.</p><a class="btn lg" href="#/new">Start a case →</a></div>`;
      return;
    }
    const avg = Math.round(H.reduce((s, x) => s + x.result.overall, 0) / H.length);
    const best = Math.max(...H.map((x) => x.result.overall));
    const mins = H.reduce((s, x) => s + (x.minutesUsed || 0), 0);
    const first = H[0].result.overall, lastV = H[H.length - 1].result.overall;
    const skills = CRITERIA.map((c) => {
      const vals = H.map((x) => x.result.criteria.find((k) => k.key === c.key)?.score || 0);
      return { ...c, avg: vals.reduce((a, b) => a + b, 0) / vals.length };
    });
    const weakest = skills.slice().sort((a, b) => a.avg - b.avg)[0];
    app.innerHTML = `
      <div class="row" style="justify-content:space-between;margin-bottom:14px"><div><div class="eyebrow">My progress</div><h2 style="margin:0">Skills dashboard</h2></div><a class="btn" href="#/new">New case →</a></div>
      <div class="grid g4">
        <div class="card stat"><div class="k">Cases solved</div><div class="v">${H.length}</div><div class="d">${H.filter((x) => x.jury).length} with jury Q&amp;A</div></div>
        <div class="card stat"><div class="k">Average score</div><div class="v">${avg}</div><div class="d">${band(avg)[0]}</div></div>
        <div class="card stat"><div class="k">Best score</div><div class="v">${best}</div><div class="d">${H.length > 1 ? `${lastV - first >= 0 ? "▲" : "▼"} ${Math.abs(lastV - first)} since first case` : "Solve more to see trend"}</div></div>
        <div class="card stat"><div class="k">Practice time</div><div class="v">${mins >= 60 ? (mins / 60).toFixed(1) + "h" : mins + "m"}</div><div class="d">under time pressure</div></div>
      </div>
      <div class="grid g2" style="margin-top:16px;align-items:start">
        <div class="card"><h3>Overall score per case</h3>${lineChart(H)}</div>
        <div class="card"><h3>Average by jury criterion</h3>
          ${skills.map((s) => `<div class="crit-row"><span class="name">${esc(s.name)}${s.key === weakest.key ? ` <span class="pill" style="margin-left:4px">focus</span>` : ""}</span><div class="meter" title="${esc(s.name)}: ${s.avg.toFixed(1)}/10"><i style="width:${s.avg * 10}%"></i></div><span class="val">${s.avg.toFixed(1)}</span></div>`).join("")}
          <p class="sub" style="margin:12px 0 0;font-size:14px">Your weakest skill is <b>${esc(weakest.name)}</b> — pick a case that trains it next.</p>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="row" style="justify-content:space-between"><h3 style="margin:0">History</h3><button class="btn small secondary" id="export">Download my data</button></div>
        <div class="table-scroll"><table class="hist" style="margin-top:10px"><thead><tr><th>Date</th><th>Case</th><th>Type</th><th>Level</th><th>Time</th><th style="text-align:right">Score</th></tr></thead><tbody>
          ${H.slice().reverse().map((x) => `<tr class="click" data-id="${x.id}"><td>${fmtDate(x.date)}</td><td><b>${esc(x.case.title)}</b></td><td>${esc(x.case.caseType)}</td><td>${esc(x.case.difficulty)}</td><td>${x.minutesUsed}m</td><td style="text-align:right;font-weight:750">${x.result.overall}</td></tr>`).join("")}
        </tbody></table></div>
      </div>`;
    bindLineChart(H);
    $$("tr[data-id]").forEach((tr) => (tr.onclick = () => (location.hash = "#/result/" + tr.dataset.id)));
    $("#export").onclick = () => {
      const blob = new Blob([JSON.stringify(S.history, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "simux-history.json"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
  }

  function viewAbout() {
    app.innerHTML = `<div style="max-width:780px;margin:0 auto">
      <div class="card">
        <div class="eyebrow">About SIMUX</div>
        <h2>An AI sparring partner for case championships</h2>
        <p>SIMUX is an MVP built by MNU students in the Technopreneurship course. Our survey of 65 students showed that case preparation suffers from three problems: lack of realistic practice under time pressure, difficulty filtering what matters in large amounts of information, and almost no quality feedback after solving a case.</p>
        <p>SIMUX closes this loop: <b>generate a case → solve it against the clock → get AI jury feedback → defend it in Q&amp;A → track progress</b>.</p>
      </div>
      <div class="card">
        <h3>How AI is used</h3>
        <ul>
          <li><b>Case generator</b> — writes a new realistic case with exhibits, noise and missing data for the chosen industry, type and level.</li>
          <li><b>AI coach</b> — gives up to 3 Socratic hints per case; it never writes the answer for you.</li>
          <li><b>AI jury</b> — scores your solution on 5 criteria used by real championship juries and explains why, with a model solution.</li>
          <li><b>Jury Q&amp;A</b> — asks tough follow-up questions and rates your answers.</li>
        </ul>
        <p class="sub">AI powered by Google Gemini. AI can make mistakes — treat scores as practice guidance, not an official grade, and double-check numbers yourself. All companies in generated cases are fictional.</p>
      </div>
      <div class="card">
        <h3>Your data</h3>
        <p>No account, no personal data. Your cases and scores are stored only in this browser. Text you submit is sent to the AI provider only to generate feedback. Don't paste confidential company materials.</p>
        <div class="row"><button class="btn secondary small" id="reset">Delete all my SIMUX data</button>${CONFIG.feedbackUrl ? `<a class="btn small" target="_blank" rel="noopener" href="${esc(CONFIG.feedbackUrl)}">Give feedback</a>` : ""}</div>
      </div></div>`;
    let armed = false;
    $("#reset").onclick = (e) => {
      if (!armed) { armed = true; e.target.textContent = "Click again to confirm"; return; }
      S = { active: null, history: [], prefs: {} }; save(); toast("All data deleted"); viewAbout();
    };
  }

  // ---------- router ----------
  function route() {
    const [r, id] = location.hash.replace(/^#\/?/, "").split("/");
    $$("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === (r || "") || (a.dataset.route === "new" && r === "case")));
    if (r !== "case") clearInterval(timerIv);
    renderTimer();
    window.scrollTo(0, 0);
    switch (r) {
      case "new": return viewNew();
      case "case": return viewCase();
      case "result": return viewResult(id);
      case "dashboard": return viewDashboard();
      case "about": return viewAbout();
      default: return viewHome();
    }
  }
  if (CONFIG.feedbackUrl) $("#feedback-link").innerHTML = `<a target="_blank" rel="noopener" href="${esc(CONFIG.feedbackUrl)}">Give feedback</a>`;
  window.addEventListener("hashchange", route);
  route();
})();
