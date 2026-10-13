:root {
  --bg: #f6f7fb;
  --surface: #ffffff;
  --surface-2: #f1f3f9;
  --ink: #141826;
  --ink-2: #4a5268;
  --muted: #7a8196;
  --line: #e3e6ef;
  --accent: #4338ca;
  --accent-2: #3730a3;
  --accent-soft: #eef0ff;
  --teal: #0f766e;
  --teal-soft: #e6f6f4;
  --good: #15803d;
  --warn: #b45309;
  --bad: #b91c1c;
  --radius: 14px;
  --shadow: 0 1px 2px rgba(20, 24, 38, .06), 0 6px 24px rgba(20, 24, 38, .06);
}
* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--ink);
  line-height: 1.55;
  font-size: 15.5px;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
h1, h2, h3, h4 { line-height: 1.2; margin: 0 0 .5em; letter-spacing: -.01em; }
h1 { font-size: clamp(28px, 4.4vw, 46px); font-weight: 800; letter-spacing: -.025em; }
h2 { font-size: 24px; font-weight: 750; }
h3 { font-size: 17px; font-weight: 700; }
p { margin: 0 0 .8em; }
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 16px; }
main { min-height: calc(100vh - 140px); padding-top: 28px; padding-bottom: 56px; outline: none; }

/* top bar */
.topbar { position: sticky; top: 0; z-index: 20; background: rgba(255,255,255,.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.topbar-in { display: flex; align-items: center; gap: 20px; height: 60px; }
.brand { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 18px; color: var(--ink); letter-spacing: .02em; }
.brand:hover { text-decoration: none; }
.logo { width: 30px; height: 30px; border-radius: 8px; background: var(--accent); color: #fff; display: grid; place-items: center; font-weight: 800; position: relative; }
.logo::after { content: ""; position: absolute; width: 7px; height: 7px; border-radius: 50%; background: #2dd4bf; top: 4px; right: 4px; }
.nav { display: flex; gap: 4px; margin-left: 8px; }
.nav a { color: var(--ink-2); font-weight: 550; padding: 7px 12px; border-radius: 8px; font-size: 14.5px; }
.nav a:hover { background: var(--surface-2); text-decoration: none; }
.nav a.active { color: var(--accent); background: var(--accent-soft); }
#timer-slot { margin-left: auto; }

/* buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid transparent; background: var(--accent); color: #fff; font: inherit; font-weight: 650; padding: 11px 18px; border-radius: 10px; cursor: pointer; transition: background .15s, transform .05s, box-shadow .15s; text-decoration: none; font-size: 15px; }
.btn:hover { background: var(--accent-2); text-decoration: none; }
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: .55; cursor: not-allowed; }
.btn.secondary { background: var(--surface); color: var(--ink); border-color: var(--line); }
.btn.secondary:hover { background: var(--surface-2); }
.btn.ghost { background: transparent; color: var(--accent); padding: 8px 10px; }
.btn.ghost:hover { background: var(--accent-soft); }
.btn.teal { background: var(--teal); }
.btn.teal:hover { background: #0b5f59; }
.btn.small { padding: 7px 12px; font-size: 13.5px; border-radius: 8px; }
.btn.lg { padding: 14px 24px; font-size: 16px; }
.row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

/* cards */
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 22px; box-shadow: var(--shadow); }
.card + .card { margin-top: 16px; }
.grid > .card + .card { margin-top: 0; }
.grid { display: grid; gap: 16px; }
.g2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.g3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.g4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.eyebrow { text-transform: uppercase; font-size: 12px; letter-spacing: .09em; font-weight: 700; color: var(--accent); margin-bottom: 8px; }
.muted { color: var(--muted); }
.sub { color: var(--ink-2); }
.pill { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 999px; font-size: 12.5px; font-weight: 600; background: var(--surface-2); color: var(--ink-2); border: 1px solid var(--line); }
.pill.accent { background: var(--accent-soft); color: var(--accent); border-color: #dcdffd; }
.pill.teal { background: var(--teal-soft); color: var(--teal); border-color: #c8ebe6; }

/* hero */
.hero { display: grid; grid-template-columns: 1.15fr .85fr; gap: 36px; align-items: center; padding: 26px 0 30px; }
.hero p.lead { font-size: 18px; color: var(--ink-2); max-width: 560px; }
.hero-card { background: linear-gradient(160deg, #312e81, #4338ca 55%, #0f766e); color: #fff; border-radius: 20px; padding: 26px; box-shadow: 0 20px 50px rgba(67,56,202,.25); }
.hero-card .score-big { font-size: 56px; font-weight: 800; letter-spacing: -.03em; line-height: 1; }
.hero-card .bar { height: 7px; border-radius: 6px; background: rgba(255,255,255,.18); overflow: hidden; margin-top: 5px; }
.hero-card .bar i { display: block; height: 100%; background: #5eead4; border-radius: 6px; }
.hero-card .crit { display: grid; grid-template-columns: 1fr 34px; gap: 2px 10px; font-size: 13.5px; margin-top: 12px; align-items: center; }
.section { margin-top: 44px; }
.pain h3 { margin-top: 6px; }
.pain .quote { font-style: italic; color: var(--ink-2); border-left: 3px solid var(--accent); padding-left: 12px; margin-top: 10px; font-size: 14.5px; }
.step-num { width: 34px; height: 34px; border-radius: 10px; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; font-weight: 800; }

/* forms */
label.f { display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; }
select, input[type=text], textarea {
  width: 100%; font: inherit; color: var(--ink); background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; transition: border .15s, box-shadow .15s;
}
select:focus, input:focus, textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(67,56,202,.15); }
textarea { resize: vertical; min-height: 110px; line-height: 1.5; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { border: 1px solid var(--line); background: var(--surface); padding: 8px 13px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 14px; font-weight: 550; color: var(--ink-2); }
.chip:hover { border-color: #c7cbe0; }
.chip[aria-pressed=true] { background: var(--accent); color: #fff; border-color: var(--accent); }

.newgrid { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 18px; align-items: start; }
@media (max-width: 900px) { .newgrid { grid-template-columns: 1fr; } }

/* case workspace */
.case-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; align-items: start; }
.case-doc { position: sticky; top: 76px; max-height: calc(100vh - 92px); overflow: auto; }
.case-doc h2 { font-size: 22px; }
.case-doc .task { background: var(--accent-soft); border: 1px solid #dcdffd; border-radius: 12px; padding: 14px 16px; font-weight: 600; margin: 14px 0; }
.case-doc ul { padding-left: 20px; margin: 6px 0 12px; }
table.ex { width: 100%; border-collapse: collapse; font-size: 13.5px; margin: 6px 0 4px; }
table.ex th, table.ex td { padding: 7px 9px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
table.ex th { background: var(--surface-2); font-weight: 650; color: var(--ink-2); }
table.ex td:not(:first-child), table.ex th:not(:first-child) { text-align: right; font-variant-numeric: tabular-nums; }
.exhibit { margin: 16px 0; }
.exhibit h4 { font-size: 14.5px; margin-bottom: 4px; }
.exhibit .note { font-size: 12.5px; color: var(--muted); }
.table-scroll { overflow-x: auto; }
.step { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; background: var(--surface); margin-bottom: 12px; }
.step-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.step-head h3 { margin: 0; font-size: 15.5px; }
.step-head .n { width: 24px; height: 24px; border-radius: 7px; background: var(--accent-soft); color: var(--accent); font-weight: 800; font-size: 13px; display: grid; place-items: center; flex: none; }
.step-head .done { margin-left: auto; font-size: 12px; color: var(--good); font-weight: 650; }
.step .tip { font-size: 13px; color: var(--muted); margin-bottom: 8px; }
.hint-box { margin-top: 8px; background: var(--teal-soft); border: 1px solid #c8ebe6; border-radius: 10px; padding: 10px 12px; font-size: 14px; }
.hint-box b { color: var(--teal); }
.timer { font-variant-numeric: tabular-nums; font-weight: 750; padding: 6px 12px; border-radius: 9px; background: var(--surface-2); border: 1px solid var(--line); font-size: 15px; display: inline-flex; gap: 8px; align-items: center; }
.timer.warn { color: var(--warn); border-color: #f6d9b0; background: #fff7ec; }
.timer.over { color: var(--bad); border-color: #f5c2c2; background: #fff1f1; }
.mobile-tabs { display: none; }
.wordcount { font-size: 12px; color: var(--muted); text-align: right; margin-top: 4px; }

/* results */
.score-ring { width: 150px; height: 150px; flex: none; }
.result-head { display: flex; gap: 26px; align-items: center; }
.crit-row { display: grid; grid-template-columns: 190px 1fr 44px; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line); }
.crit-row:last-child { border-bottom: 0; }
.crit-row .name { font-weight: 650; font-size: 14.5px; }
.crit-row .comment { grid-column: 1 / -1; font-size: 14px; color: var(--ink-2); margin-top: -4px; }
.meter { height: 9px; border-radius: 6px; background: var(--surface-2); overflow: hidden; }
.meter i { display: block; height: 100%; border-radius: 6px; background: var(--accent); }
.crit-row .val { font-weight: 750; text-align: right; font-variant-numeric: tabular-nums; }
ul.clean { list-style: none; padding: 0; margin: 0; }
ul.clean li { padding: 8px 0 8px 26px; position: relative; border-bottom: 1px dashed var(--line); }
ul.clean li:last-child { border-bottom: 0; }
ul.clean li::before { position: absolute; left: 2px; top: 8px; font-weight: 800; }
ul.plus li::before { content: "+"; color: var(--good); }
ul.arrow li::before { content: "→"; color: var(--accent); }
ul.miss li::before { content: "!"; color: var(--warn); left: 6px; }
.qa { border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin-bottom: 12px; }
.qa .q { font-weight: 650; margin-bottom: 8px; }
.qa .rating { margin-top: 10px; background: var(--surface-2); border-radius: 10px; padding: 10px 12px; font-size: 14px; }

/* dashboard */
.stat { padding: 18px 20px; }
.stat .k { font-size: 13px; color: var(--muted); font-weight: 600; }
.stat .v { font-size: 30px; font-weight: 800; letter-spacing: -.02em; margin-top: 2px; font-variant-numeric: tabular-nums; }
.stat .d { font-size: 12.5px; color: var(--ink-2); }
.chart-wrap { position: relative; }
.chart-wrap svg { display: block; width: 100%; height: auto; overflow: visible; }
.chart-tip { position: absolute; pointer-events: none; background: var(--ink); color: #fff; font-size: 12.5px; padding: 7px 10px; border-radius: 8px; white-space: nowrap; transform: translate(-50%, -115%); opacity: 0; transition: opacity .1s; }
.chart-tip.show { opacity: 1; }
table.hist { width: 100%; border-collapse: collapse; font-size: 14px; }
table.hist th, table.hist td { padding: 10px 8px; border-bottom: 1px solid var(--line); text-align: left; }
table.hist th { color: var(--muted); font-weight: 600; font-size: 12.5px; text-transform: uppercase; letter-spacing: .05em; }
table.hist tr.click { cursor: pointer; }
table.hist tr.click:hover td { background: var(--surface-2); }
.empty { text-align: center; padding: 50px 20px; }

/* loading */
.loading { text-align: center; padding: 70px 20px; }
.spinner { width: 44px; height: 44px; border-radius: 50%; border: 4px solid var(--accent-soft); border-top-color: var(--accent); animation: spin .9s linear infinite; margin: 0 auto 18px; }
@keyframes spin { to { transform: rotate(360deg); } }
.error { background: #fff1f1; border: 1px solid #f5c2c2; color: #7f1d1d; padding: 14px 16px; border-radius: 12px; margin: 14px 0; }

.toast { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--ink); color: #fff; padding: 11px 18px; border-radius: 10px; font-size: 14px; opacity: 0; pointer-events: none; transition: all .2s; z-index: 50; max-width: calc(100% - 32px); }
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.footer { border-top: 1px solid var(--line); background: var(--surface); font-size: 13px; color: var(--muted); }
.footer-in { display: flex; justify-content: space-between; gap: 12px; padding: 16px; flex-wrap: wrap; }
.footer a { margin-left: 12px; }

@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; }
  .g3, .g4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .case-layout { grid-template-columns: 1fr; }
  .case-doc { position: static; max-height: none; }
  .mobile-tabs { display: flex; gap: 6px; margin-bottom: 12px; }
  .case-layout[data-tab=case] .ws, .case-layout[data-tab=ws] .case-doc { display: none; }
}
@media (max-width: 620px) {
  .g2, .g3, .g4 { grid-template-columns: 1fr; }
  .nav a { padding: 6px 8px; font-size: 13.5px; }
  .brand span:last-child { display: none; }
  .result-head { flex-direction: column; align-items: flex-start; }
  .crit-row { grid-template-columns: 1fr 44px; }
  .crit-row .meter { grid-column: 1 / -1; grid-row: 2; }
  .card { padding: 18px; }
}
.timer { white-space: nowrap; }
@media (max-width: 620px) { .topbar-in { gap: 10px; } .nav { margin-left: 0; gap: 0; } .timer { padding: 5px 8px; font-size: 14px; } }
