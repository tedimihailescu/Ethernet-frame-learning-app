// Shared page helpers for the points games: language, theme, the dealer's speech bubble,
// the chip picker and the points wallet. Each game passes its own texts.
import { openWallet } from "./wallet.js?v=2";

export function kit({ UI, LINES, faces = {}, chips = [1, 2, 5, 10, 25], title }) {
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const k = {};
  k.lang = store.get("cadru-lang") === "en" ? "en" : "ro";
  k.L = (ro, en) => (k.lang === "en" ? en : ro);
  k.T = v => (Array.isArray(v) ? v[k.lang === "en" ? 1 : 0] : v);
  k.$ = s => document.querySelector(s);
  k.rand = n => { const r = new Uint32Array(1); crypto.getRandomValues(r); return r[0] % n; };
  k.rand01 = () => { const r = new Uint32Array(1); crypto.getRandomValues(r); return r[0] / 4294967296; };
  k.reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const langHooks = [];
  k.onLang = f => langHooks.push(f);

  // ---- dealer ----
  let cur = null; const lastI = {};
  k.say = key => {
    const a = LINES[key]; if (!a) return;
    let i = k.rand(a.length); if (a.length > 1 && i === lastI[key]) i = (i + 1) % a.length;
    lastI[key] = i; cur = [key, i];
    k.$("#line").textContent = k.T(a[i]);
    k.$("#face").textContent = faces[key] || faces.idle || "🎩";
  };

  // ---- chips ----
  k.bet = chips[0];
  k.locked = false;
  const box = k.$("#chips");
  box.innerHTML = chips.map(v => `<button type="button" class="chip c${v}" data-c="${v}">${v}</button>`).join("");
  box.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b && !b.disabled) { k.bet = +b.dataset.c; k.paint(); } });
  const paintHooks = [];
  k.onPaint = f => paintHooks.push(f);
  k.paint = () => {
    // k.hold: what to show while a result is still being revealed (it is already saved).
    const bal = k.hold != null ? k.hold : k.wallet ? k.wallet.bal : null;
    k.$("#bal").textContent = bal === null ? "…" : bal;
    // Pick the largest chip you can still afford when the current one is too big.
    if (bal !== null && k.bet > bal) { const ok = chips.filter(v => v <= bal); if (ok.length) k.bet = ok[ok.length - 1]; }
    box.querySelectorAll(".chip").forEach(c => {
      c.setAttribute("aria-pressed", +c.dataset.c === k.bet ? "true" : "false");
      c.disabled = k.locked || bal === null || +c.dataset.c > bal;
    });
    const np = k.$("#noPts"); if (np) np.hidden = !(bal !== null && bal <= 0 && !k.locked);
    paintHooks.forEach(f => f(bal));
  };
  k.canBet = () => k.wallet && k.wallet.bal !== null && k.bet <= k.wallet.bal && k.wallet.bal > 0;

  // ---- language + theme ----
  k.render = () => {
    document.documentElement.lang = k.lang;
    if (title) document.title = k.T(title);
    document.querySelectorAll("[data-t]").forEach(e => { if (UI[e.dataset.t]) e.textContent = k.T(UI[e.dataset.t]); });
    document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === k.lang ? "true" : "false"));
    if (cur) k.$("#line").textContent = k.T(LINES[cur[0]][cur[1]]);
    langHooks.forEach(f => f());
  };
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { k.lang = b.dataset.lang; store.set("cadru-lang", k.lang); k.render(); });
  const saved = store.get("cadru-theme"); if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
  k.$("#theme").onclick = () => { const r = document.documentElement, d = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; const nt = d ? "light" : "dark"; r.dataset.theme = nt; store.set("cadru-theme", nt); };

  // ---- wallet ----
  k.ready = openWallet({ onChange: () => k.paint(), onError: () => k.say("syncErr") }).then(w => { k.wallet = w; k.paint(); if (w.bal <= 0) k.say("broke"); return w; });
  // The daily bonus (top bar) adds points while the page is open.
  window.addEventListener("points:bonus", () => { if (k.wallet && !k.locked && !k.wallet.pending()) k.wallet.reload().catch(() => {}); });
  k.take = n => k.wallet.commit(-n);
  k.pay = n => k.wallet.commit(n);
  return k;
}

// Common speech lines every game can use.
export const COMMON = {
  broke: [["Ai rămas fără puncte. Termină un test cu peste 80% (🪙 +5) sau ia bonusul zilnic 🎁.", "You're out of points. Finish a quiz with over 80% (🪙 +5) or grab the daily bonus 🎁."]],
  syncErr: [["Serverul n-a acceptat o mișcare; am reîncărcat punctele tale reale.", "The server didn't accept a move; I reloaded your real points."]],
  tooMuch: [["N-ai destule puncte pentru miza asta. Alege un jeton mai mic.", "Not enough points for that bet. Pick a smaller chip."]]
};
