/* Hover / tap drop-down menus in the top bar: "Lessons ▾" (every category and lesson) and "Games ▾".
   Needs assets/catalog.js. Usage: <nav class="nav" data-menu data-root="../"></nav> */
(function () {
  "use strict";
  const C = window.CATALOG, nav = document.querySelector("nav[data-menu]");
  if (!C || !nav) return;
  const ROOT = nav.dataset.root || "";
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } } };
  const lang = () => (store.get("cadru-lang") === "en" ? "en" : "ro");
  const T = v => (v && typeof v === "object" && !Array.isArray(v) ? v[lang()] : v);
  const L = (ro, en) => (lang() === "en" ? en : ro);
  const IC = {
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    game: '<rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/>',
    path: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
    fire: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'
  };
  const ic = k => `<svg class="dd-ic" viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;

  const css = document.createElement("style");
  css.textContent = `
nav[data-menu]{overflow:visible;gap:2px;align-items:center}
.dd{position:relative}
.dd>button,.nav .dd-link{display:inline-flex;align-items:center;gap:7px;height:34px;font:500 .88rem var(--sans);color:var(--bar-muted,var(--muted));background:none;border:0;padding:0 11px;border-radius:8px;cursor:pointer;white-space:nowrap;text-decoration:none;transition:background .15s,color .15s}
.dd>button:hover,.dd.open>button,.nav .dd-link:hover{background:var(--bar-hover,var(--surface2));color:#fff}
.dd.open>button{color:var(--brand,#ffd83d)}
.dd-ic{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.dd>button::after{content:"";width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:translateY(-2px) rotate(45deg);opacity:.6;margin-left:1px;transition:transform .15s}
.dd.open>button::after{transform:translateY(1px) rotate(-135deg)}
.dd-menu{display:none;position:absolute;top:calc(100% + 10px);left:0;z-index:60;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow-lg,0 16px 40px -12px rgba(0,0,0,.25));padding:10px}
.dd:hover .dd-menu,.dd:focus-within .dd-menu,.dd.open .dd-menu{display:block}
.dd-menu::before{content:"";position:absolute;left:0;right:0;top:-18px;height:18px}
.dd-mega{position:fixed;top:var(--bar-h,64px);left:50%;transform:translateX(-50%);width:min(860px,94vw);display:none;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 18px;padding:18px}
.dd:hover .dd-mega,.dd:focus-within .dd-mega,.dd.open .dd-mega{display:grid}
.dd-mega{max-height:calc(100vh - 80px);overflow:auto}
@media (min-width:1000px){.dd-mega{width:min(1100px,94vw);grid-template-columns:repeat(4,minmax(0,1fr))}}
.dd-col h4{font:600 .72rem var(--sans);margin:0 0 4px;padding:0 8px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)}
.dd-col h4 a{color:inherit;text-decoration:none}
.dd-col h4 a:hover{color:var(--text)}
.dd-col .dd-d{margin:0 0 4px;padding:0 8px;font-size:.74rem;line-height:1.35;color:var(--muted);opacity:.85}
.dd-menu a.it,.dd-menu .all a,.dd-col h4 a{white-space:normal}
.dd-menu a.it{display:block;color:var(--text);text-decoration:none;font-size:.87rem;padding:6px 8px;border-radius:7px;line-height:1.3}
.dd-menu a.it:hover,.dd-menu a.it:focus-visible{background:var(--surface2);color:var(--text);outline:none}
.dd-menu a.it .ok{color:var(--ok);font-weight:700}
.dd-menu .all{grid-column:1/-1;border-top:1px solid var(--border);padding:12px 8px 0;margin-top:2px}
.dd-menu .all a{font-weight:600;font-size:.88rem;color:var(--text);text-decoration:none}
.dd-menu .all a:hover{text-decoration:underline;text-decoration-color:var(--brand,#ffd83d);text-decoration-thickness:2px;text-underline-offset:3px}
.dd-games{min-width:240px;left:auto;right:0}
@media (max-width:640px){.dd-t{display:none}.dd>button,.nav .dd-link{padding:0 9px}.dd>button::after{display:none}}
@media (max-width:760px){.dd-menu,.dd-mega{position:fixed;left:8px;right:8px;top:var(--bar-h,64px);width:auto;transform:none;max-height:calc(100vh - 80px);overflow:auto}.dd-mega{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.dd:hover:not(.open) .dd-menu{display:none}}
@media (max-width:420px){.dd-mega{grid-template-columns:minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){.dd>button,.dd-link,.dd>button::after{transition:none}}`;
  document.head.appendChild(css);

  function build() {
    const cats = C.CATS.map(c => `<div class="dd-col"><h4><a href="${ROOT}lectii/index.html#${c.id}">${c.icon} ${T(c.t)}</a></h4>${c.d ? `<p class="dd-d">${T(c.d)}</p>` : ""}${c.list.map(id => { const l = C.byId(id); if (!l) return ""; const p = C.progress ? C.progress(id) : null; return `<a class="it" href="${ROOT}${l.href}">${p && p.complete ? '<span class="ok">✓</span> ' : ""}${T(l.t)}</a>`; }).join("")}</div>`).join("");
    nav.innerHTML =
      `<div class="dd"><button type="button" aria-expanded="false" title="${L("Lecții", "Lessons")}">${ic("book")}<span class="dd-t">${L("Lecții", "Lessons")}</span></button><div class="dd-menu dd-mega">${cats}<div class="all"><a href="${ROOT}lectii/index.html">${L("Toate lecțiile, cu descrieri →", "All lessons, with descriptions →")}</a></div></div></div>` +
      `<div class="dd"><button type="button" aria-expanded="false" title="${L("Jocuri", "Games")}">${ic("game")}<span class="dd-t">${L("Jocuri", "Games")}</span></button><div class="dd-menu dd-games">${C.GAMES.map(g => `<a class="it" href="${ROOT}${g.href}">${g.icon} ${T(g.t)}</a>`).join("")}</div></div>` +
      `<a class="dd-link" href="${ROOT}trasee/index.html" title="${L("Trasee de învățare", "Learning paths")}">${ic("path")}<span class="dd-t">${L("Trasee", "Paths")}</span></a>` +
      `<a class="dd-link" href="${ROOT}provocare/index.html" title="${L("Provocarea zilei", "Daily challenge")}">${ic("fire")}<span class="dd-t">${L("Zilnic", "Daily")}</span></a>`;
    nav.querySelectorAll(".dd>button").forEach(b => b.onclick = e => {
      e.stopPropagation();
      const d = b.parentElement, open = !d.classList.contains("open");
      nav.querySelectorAll(".dd.open").forEach(x => { x.classList.remove("open"); x.firstChild.setAttribute("aria-expanded", "false"); });
      barH();
      if (open) { d.classList.add("open"); b.setAttribute("aria-expanded", "true"); } else b.blur();
    });
  }
  document.addEventListener("click", e => { if (!e.target.closest(".dd")) nav.querySelectorAll(".dd.open").forEach(x => x.classList.remove("open")); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { nav.querySelectorAll(".dd.open").forEach(x => x.classList.remove("open")); if (document.activeElement && nav.contains(document.activeElement)) document.activeElement.blur(); } });
  const barH = () => { const b = nav.closest(".topbar"); if (b) document.documentElement.style.setProperty("--bar-h", Math.max(8, Math.round(b.getBoundingClientRect().bottom + 6)) + "px"); };
  build(); barH();
  window.addEventListener("resize", barH);
  if (window.ResizeObserver) { const b = nav.closest(".topbar"); if (b) new ResizeObserver(barH).observe(b); }
  window.addEventListener("cadru:lang", build);
  window.addEventListener("progress:changed", build);
})();
