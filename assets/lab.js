/* Mini-labs shown after each lesson, before the quiz.
   Task types:
     term  – a simulated terminal: the learner types a command; `need` lists tokens that must all appear
             (case-insensitive), `out` is the printed output.
     input – a short answer; `ans` lists accepted answers (normalised: lower case, no extra spaces).
     order – put steps in order by tapping them; `items` are given in the correct order.
   The lab data lives in assets/labs-data.js (window.LABS). */
(function () {
  "use strict";
  const DATA = window.LABS || {};
  const lessonId = new URL(document.baseURI).pathname.split("/").filter(Boolean).slice(-2)[0] || "";
  const LAB = DATA[lessonId];
  const quiz = document.getElementById("quiz");
  if (!LAB || !quiz) return;

  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  let lang = store.get("cadru-lang") === "en" ? "en" : "ro";
  const T = v => (v && typeof v === "object" && !Array.isArray(v) ? (v[lang] ?? v.ro) : v);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
  const norm = s => String(s || "").toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim().replace(/\.$/, "");
  const UI = {
    eyebrow: { ro: "Laborator", en: "Lab" }, title: { ro: "🧪 Exersează ce ai învățat", en: "🧪 Practise what you learned" },
    lead: { ro: "Trei exerciții scurte: o comandă într-un terminal simulat, un calcul și ordinea corectă a pașilor. Poți cere un indiciu sau soluția.", en: "Three short exercises: a command in a simulated terminal, a calculation, and the right order of steps. You can ask for a hint or the solution." },
    task: { ro: "Exercițiul", en: "Exercise" }, term: { ro: "Terminal", en: "Terminal" }, input: { ro: "Calcul / decizie", en: "Calculate / decide" }, order: { ro: "Ordinea pașilor", en: "Order the steps" },
    check: { ro: "Verifică", en: "Check" }, hint: { ro: "Indiciu", en: "Hint" }, sol: { ro: "Arată soluția", en: "Show solution" }, reset: { ro: "Ia-o de la capăt", en: "Start over" },
    ok: { ro: "✓ Corect!", en: "✓ Correct!" }, no: { ro: "Nu încă. Mai încearcă.", en: "Not yet. Try again." },
    notFound: { ro: "comandă nerecunoscută în acest laborator. Verifică numele și opțiunile, sau cere un indiciu.", en: "command not recognised in this lab. Check the name and options, or ask for a hint." },
    pick: { ro: "Atinge pașii în ordinea corectă:", en: "Tap the steps in the right order:" }, yours: { ro: "Ordinea ta:", en: "Your order:" },
    solved: { ro: "rezolvat", en: "solved" }, shown: { ro: "soluție afișată", en: "solution shown" },
    progress: { ro: "{n} din {t} exerciții terminate", en: "{n} of {t} exercises done" },
    done: { ro: "Laborator terminat: {s} din {t} rezolvate fără soluție. Rezultatul s-a salvat.", en: "Lab finished: {s} of {t} solved without the solution. Your result has been saved." },
    solution: { ro: "Soluția:", en: "Solution:" }, placeholder: { ro: "răspunsul tău", en: "your answer" }, typeHere: { ro: "scrie comanda și apasă Enter", en: "type the command and press Enter" }
  };
  const KEY = "lab-" + lessonId;
  let state = {};
  try { state = JSON.parse(store.get(KEY) || "{}") || {}; } catch (e) { state = {}; }
  const save = () => store.set(KEY, JSON.stringify(state));
  const st = i => (state[i] = state[i] || { status: "", picked: [], log: [] });

  /* ---------- styles ---------- */
  const css = document.createElement("style");
  css.textContent = `
.lab{display:grid;gap:12px}
.lab-task{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;min-width:0}
.lab-task.solved{border-color:var(--ok)} .lab-task.shown{border-color:var(--chgfg)}
.lab-head{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:baseline;justify-content:space-between;margin:0 0 6px}
.lab-head h3{font:700 1rem var(--head);margin:0}
.lab-tag{font:600 .72rem var(--mono);text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
.lab-st{font:600 .78rem var(--mono);padding:2px 8px;border-radius:999px;border:1px solid currentColor}
.lab-st.solved{color:var(--ok)} .lab-st.shown{color:var(--chgfg)}
.lab-q{margin:0 0 10px;overflow-wrap:anywhere}
.lab-ctx{margin:0 0 10px;overflow-x:auto}
.lab-ctx table{border-collapse:collapse;font:500 .86rem var(--mono)}
.lab-ctx th,.lab-ctx td{border-bottom:1px solid var(--border);padding:4px 10px;text-align:left;white-space:nowrap}
.lab-ctx th{font:600 .74rem var(--sans);color:var(--muted)}
.lab-term{background:#0d0c07;color:#f3ecc9;border-radius:10px;padding:12px 14px;font:13px/1.55 var(--mono);overflow-x:auto}
.lab-term pre{margin:0 0 6px;white-space:pre;font:inherit}
.lab-term .cmd{color:#ffd83d}
.lab-term .err{color:#ff9b8a}
.lab-line{display:flex;gap:8px;align-items:center}
.lab-line span{color:#8fd18f;white-space:nowrap}
.lab-line input{flex:1;min-width:0;background:transparent;border:0;border-bottom:1px dashed #6d6436;color:#fff;font:inherit;padding:4px 0;outline:none}
.lab-line input:focus{border-bottom-color:#ffd83d}
.lab-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}
.lab-row input[type=text]{flex:1 1 200px;min-width:0;max-width:340px;font:600 .95rem var(--mono);padding:9px 11px;border:2px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)}
.lab-row input[type=text]:focus{border-color:var(--text);outline:none}
.lab-btn{border:2px solid var(--text);background:var(--accent);color:var(--accent-text);border-radius:8px;padding:8px 14px;font:700 .9rem var(--sans);cursor:pointer}
.lab-btn.sec{background:var(--surface);color:var(--text);border-color:var(--border)}
.lab-btn:disabled{opacity:.5;cursor:default}
.lab-fb{margin:10px 0 0;font-size:.92rem;overflow-wrap:anywhere}
.lab-fb.good{color:var(--ok);font-weight:600} .lab-fb.bad{color:var(--bad)}
.lab-fb code{font-family:var(--mono)}
.lab-items{display:flex;flex-direction:column;gap:6px}
.lab-item{display:flex;gap:8px;align-items:flex-start;text-align:left;border:1px solid var(--border);background:var(--surface2);color:var(--text);border-radius:8px;padding:8px 10px;font:500 .92rem var(--sans);cursor:pointer;overflow-wrap:anywhere}
.lab-item:hover:not(:disabled){border-color:var(--text)}
.lab-item:disabled{opacity:.35;cursor:default}
.lab-picked{counter-reset:p;margin:6px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
.lab-picked li{counter-increment:p;display:flex;gap:8px;align-items:flex-start;border:1px solid var(--text);border-radius:8px;padding:8px 10px;background:var(--surface);font-size:.92rem;overflow-wrap:anywhere}
.lab-picked li::before{content:counter(p);flex:none;display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--text);color:var(--surface);font:700 .75rem var(--mono)}
.lab-picked li.bad{border-color:var(--bad);color:var(--bad)}
.lab-sub{font:600 .8rem var(--sans);color:var(--muted);margin:10px 0 4px}
.lab-prog{font:600 .9rem var(--sans);margin:0}
.lab-bar{height:8px;border-radius:4px;background:var(--surface2);overflow:hidden;margin:6px 0 0}
.lab-bar i{display:block;height:100%;background:var(--text);transition:width .3s}
.lab-done{font-weight:600;color:var(--ok);margin:8px 0 0}
@media (prefers-reduced-motion:reduce){.lab-bar i{transition:none}}`;
  document.head.appendChild(css);

  /* ---------- mount before the quiz ---------- */
  const head = quiz.previousElementSibling && quiz.previousElementSibling.classList.contains("sec-head") ? quiz.previousElementSibling : quiz;
  const secHead = document.createElement("div");
  secHead.className = "sec-head";
  secHead.innerHTML = `<p class="eyebrow" id="lab-eyebrow"></p><h2 id="lab-title" style="margin:4px 0 0"></h2><p class="lead" id="lab-lead"></p>`;
  const box = document.createElement("section");
  box.className = "card";
  box.id = "lab";
  box.innerHTML = `<p class="lab-prog" id="lab-prog"></p><div class="lab-bar"><i id="lab-bar"></i></div><p class="lab-done" id="lab-done" hidden></p><div class="lab" id="lab-list" style="margin-top:14px"></div>`;
  head.parentNode.insertBefore(secHead, head);
  head.parentNode.insertBefore(box, head);
  const navQuiz = document.querySelector('.nav a[href="#quiz"]');
  let navLab = null;
  if (navQuiz) { navLab = document.createElement("a"); navLab.href = "#lab"; navQuiz.parentNode.insertBefore(navLab, navQuiz); }

  function renderAll() {
    document.getElementById("lab-eyebrow").textContent = T(UI.eyebrow) + " · " + T(LAB.title);
    document.getElementById("lab-title").textContent = T(UI.title);
    document.getElementById("lab-lead").textContent = T(UI.lead);
    if (navLab) navLab.textContent = T(UI.eyebrow);
    const list = document.getElementById("lab-list");
    list.innerHTML = "";
    LAB.tasks.forEach((t, i) => list.appendChild(renderTask(t, i)));
    progress();
  }

  function progress() {
    const n = LAB.tasks.filter((t, i) => st(i).status).length, tot = LAB.tasks.length;
    document.getElementById("lab-prog").textContent = T(UI.progress).replace("{n}", n).replace("{t}", tot);
    document.getElementById("lab-bar").style.width = (100 * n / tot) + "%";
    const d = document.getElementById("lab-done");
    const s = LAB.tasks.filter((t, i) => st(i).status === "solved").length;
    if (n === tot) {
      d.hidden = false;
      d.textContent = T(UI.done).replace("{s}", s).replace("{t}", tot);
      if (!state.saved) {
        state.saved = true; save();
        window.dispatchEvent(new CustomEvent("quiz:complete", { detail: { lesson: lessonId + "-lab", title: "Laborator: " + (typeof LAB.title === "string" ? LAB.title : LAB.title.ro), score: s, total: tot, answers: LAB.tasks.map((t, i) => (st(i).status === "solved" ? 1 : 0)) } }));
      }
    } else d.hidden = true;
  }

  function finish(i, status, el) {
    const s = st(i);
    if (s.status) return;
    s.status = status; save();
    const fresh = renderTask(LAB.tasks[i], i);
    el.replaceWith(fresh);
    progress();
    return fresh;
  }

  function header(t, i) {
    const s = st(i);
    return `<div class="lab-head"><h3>${T(UI.task)} ${i + 1} · ${esc(T(t.name))}</h3><span>${s.status ? `<span class="lab-st ${s.status}">${s.status === "solved" ? "✓ " + T(UI.solved) : T(UI.shown)}</span>` : `<span class="lab-tag">${T(UI[t.type])}</span>`}</span></div>
<p class="lab-q">${T(t.q)}</p>${t.ctx ? `<div class="lab-ctx">${T(t.ctx)}</div>` : ""}`;
  }

  function renderTask(t, i) {
    const s = st(i);
    const el = document.createElement("div");
    el.className = "lab-task" + (s.status ? " " + s.status : "");
    let h = header(t, i);
    const solText = t.type === "term" ? `<code>${esc(t.sol)}</code>` : t.type === "order" ? "<ol>" + t.items.map(x => `<li>${esc(T(x))}</li>`).join("") + "</ol>" : `<code>${esc(T(t.show || t.ans[0]))}</code>`;
    const after = s.status ? `<p class="lab-fb ${s.status === "solved" ? "good" : ""}">${s.status === "solved" ? T(UI.ok) : T(UI.solution) + " " + solText} ${t.why ? T(t.why) : ""}</p>` : "";

    if (t.type === "term") {
      const log = s.log.map(l => `<pre><span class="cmd">${esc(t.prompt)} ${esc(l.c)}</span>\n${l.ok ? esc(T(t.out)) : `<span class="err">${esc(l.c.split(" ")[0])}: ${esc(T(UI.notFound))}</span>`}</pre>`).join("");
      if (log || !s.status) h += `<div class="lab-term">${log}${s.status ? "" : `<label class="lab-line"><span>${esc(t.prompt)}</span><input type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="${esc(T(UI.typeHere))}" placeholder="${esc(T(UI.typeHere))}"></label>`}</div>`;
      if (s.status === "shown" && !s.log.some(l => l.ok)) h += `<div class="lab-term" style="margin-top:8px"><pre><span class="cmd">${esc(t.prompt)} ${esc(t.sol)}</span>\n${esc(T(t.out))}</pre></div>`;
    } else if (t.type === "input") {
      h += s.status ? "" : `<div class="lab-row"><input type="text" spellcheck="false" autocomplete="off" placeholder="${esc(T(UI.placeholder))}" aria-label="${esc(T(UI.placeholder))}"><button type="button" class="lab-btn" data-a="check">${T(UI.check)}</button></div>`;
    } else if (t.type === "order") {
      if (!s.order) { s.order = shuffle(t.items.map((x, k) => k)); save(); }
      const picked = s.status ? t.items.map((x, k) => k) : s.picked;
      h += `<p class="lab-sub">${T(UI.yours)}</p><ol class="lab-picked">${picked.map(k => `<li>${esc(T(t.items[k]))}</li>`).join("") || ""}</ol>`;
      if (!s.status) h += `<p class="lab-sub">${T(UI.pick)}</p><div class="lab-items">${s.order.map(k => `<button type="button" class="lab-item" data-k="${k}" ${s.picked.includes(k) ? "disabled" : ""}>${esc(T(t.items[k]))}</button>`).join("")}</div>`;
    }
    if (!s.status) h += `<div class="lab-row">${t.type === "order" ? `<button type="button" class="lab-btn sec" data-a="reset">${T(UI.reset)}</button>` : ""}<button type="button" class="lab-btn sec" data-a="hint">${T(UI.hint)}</button><button type="button" class="lab-btn sec" data-a="sol">${T(UI.sol)}</button></div><p class="lab-fb" aria-live="polite"></p>`;
    h += after;
    el.innerHTML = h;
    wire(t, i, el);
    return el;
  }

  function wire(t, i, el) {
    const s = st(i);
    if (s.status) return;
    const fb = el.querySelector(".lab-fb:last-child") || el.querySelector(".lab-fb");
    const say = (msg, cls) => { fb.className = "lab-fb" + (cls ? " " + cls : ""); fb.innerHTML = msg; };
    el.querySelector('[data-a="hint"]').onclick = () => say("💡 " + T(t.hint));
    el.querySelector('[data-a="sol"]').onclick = () => finish(i, "shown", el);
    if (t.type === "term") {
      const inp = el.querySelector(".lab-line input");
      inp.addEventListener("keydown", e => {
        if (e.key !== "Enter") return;
        const c = inp.value.trim();
        if (!c) return;
        const low = c.toLowerCase();
        const ok = t.need.every(tok => [].concat(tok).some(alt => low.includes(alt.toLowerCase()))) && !(t.not || []).some(tok => low.includes(tok.toLowerCase()));
        s.log.push({ c, ok }); save();
        if (ok) { const f = finish(i, "solved", el); return; }
        const fresh = renderTask(t, i); el.replaceWith(fresh);
        const ni = fresh.querySelector(".lab-line input"); if (ni) ni.focus();
      });
    } else if (t.type === "input") {
      const inp = el.querySelector('input[type="text"]');
      const check = () => {
        const v = norm(inp.value);
        if (!v) return;
        if (t.ans.some(a => norm(T(a)) === v)) finish(i, "solved", el);
        else say(T(UI.no), "bad");
      };
      el.querySelector('[data-a="check"]').onclick = check;
      inp.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
    } else if (t.type === "order") {
      el.querySelectorAll(".lab-item").forEach(b => b.onclick = () => {
        s.picked.push(+b.dataset.k); save();
        if (s.picked.length === t.items.length) {
          if (s.picked.every((k, n) => k === n)) { finish(i, "solved", el); return; }
          const fresh = renderTask(t, i); el.replaceWith(fresh);
          fresh.querySelectorAll(".lab-picked li").forEach((li, n) => { if (s.picked[n] !== n) li.classList.add("bad"); });
          const f2 = fresh.querySelector(".lab-fb:last-child"); f2.className = "lab-fb bad"; f2.textContent = T(UI.no) + " " + T({ ro: "Pașii marcați cu roșu nu sunt la locul lor; apasă „Ia-o de la capăt”.", en: "The steps marked in red are out of place; press \"Start over\"." });
          fresh.querySelectorAll(".lab-item").forEach(x => x.disabled = true);
          return;
        }
        const fresh = renderTask(t, i); el.replaceWith(fresh);
      });
      el.querySelector('[data-a="reset"]').onclick = () => { s.picked = []; save(); el.replaceWith(renderTask(t, i)); };
    }
  }

  function shuffle(a) {
    for (let tries = 0; tries < 10; tries++) {
      const b = a.slice();
      for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
      if (b.some((v, i) => v !== i)) return b;
    }
    return a.slice().reverse();
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-lang]");
    if (!b) return;
    setTimeout(() => { lang = b.dataset.lang === "en" ? "en" : "ro"; renderAll(); }, 0);
  });
  renderAll();
})();
