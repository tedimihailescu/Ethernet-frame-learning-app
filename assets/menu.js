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

  const css = document.createElement("style");
  css.textContent = `
nav[data-menu]{overflow:visible;gap:2px}
.dd{position:relative}
.dd>button{font:500 .9rem var(--sans);color:var(--bar-text,var(--text));background:none;border:0;padding:6px 10px;border-radius:6px;cursor:pointer;white-space:nowrap}
.dd>button:hover,.dd.open>button{background:var(--bar-hover,var(--surface2))}
.dd>button::after{content:" ▾";font-size:.75em;opacity:.7}
.dd-menu{display:none;position:absolute;top:calc(100% + 6px);left:0;z-index:60;background:var(--surface);color:var(--text);border:2px solid var(--text);border-radius:12px;box-shadow:0 10px 0 rgba(0,0,0,.12);padding:12px}
.dd:hover .dd-menu,.dd:focus-within .dd-menu,.dd.open .dd-menu{display:block}
.dd-menu::before{content:"";position:absolute;left:0;right:0;top:-16px;height:16px}
.dd-mega{position:fixed;top:56px;left:50%;transform:translateX(-50%);width:min(860px,94vw);display:none;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px 18px}
.dd:hover .dd-mega,.dd:focus-within .dd-mega,.dd.open .dd-mega{display:grid}
.dd-col h4{font:700 .82rem var(--head);margin:0 0 4px;text-transform:uppercase;letter-spacing:.04em}
.dd-col h4 a{color:var(--text);text-decoration:none}
.dd-menu a.it,.dd-menu .all a,.dd-col h4 a{white-space:normal}
.dd-menu a.it{display:block;color:var(--text);text-decoration:none;font-size:.88rem;padding:5px 8px;border-radius:6px;line-height:1.3}
.dd-menu a.it:hover,.dd-menu a.it:focus-visible{background:var(--accent);color:var(--accent-text)}
.dd-menu .all{grid-column:1/-1;border-top:1px solid var(--border);padding-top:8px;margin-top:2px}
.dd-menu .all a{font-weight:700;color:var(--text)}
.dd-games{min-width:230px;left:auto;right:0}
@media (max-width:760px){.dd-menu,.dd-mega{position:fixed;left:8px;right:8px;top:58px;width:auto;transform:none;max-height:calc(100vh - 70px);overflow:auto}.dd-mega{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.dd:hover:not(.open) .dd-menu{display:none}}
@media (max-width:420px){.dd-mega{grid-template-columns:minmax(0,1fr)}}`;
  document.head.appendChild(css);

  function build() {
    const cats = C.CATS.map(c => `<div class="dd-col"><h4><a href="${ROOT}lectii/index.html#${c.id}">${c.icon} ${T(c.t)}</a></h4>${c.list.map(id => { const l = C.byId(id); return l ? `<a class="it" href="${ROOT}${l.href}">${T(l.t)}</a>` : ""; }).join("")}</div>`).join("");
    nav.innerHTML =
      `<div class="dd"><button type="button" aria-expanded="false">📚 ${L("Lecții", "Lessons")}</button><div class="dd-menu dd-mega">${cats}<div class="all"><a href="${ROOT}lectii/index.html">${L("Toate lecțiile, cu descrieri →", "All lessons, with descriptions →")}</a></div></div></div>` +
      `<div class="dd"><button type="button" aria-expanded="false">🎮 ${L("Jocuri", "Games")}</button><div class="dd-menu dd-games">${C.GAMES.map(g => `<a class="it" href="${ROOT}${g.href}">${g.icon} ${T(g.t)}</a>`).join("")}</div></div>`;
    nav.querySelectorAll(".dd>button").forEach(b => b.onclick = e => {
      e.stopPropagation();
      const d = b.parentElement, open = !d.classList.contains("open");
      nav.querySelectorAll(".dd.open").forEach(x => { x.classList.remove("open"); x.firstChild.setAttribute("aria-expanded", "false"); });
      if (open) { d.classList.add("open"); b.setAttribute("aria-expanded", "true"); } else b.blur();
    });
  }
  document.addEventListener("click", e => { if (!e.target.closest(".dd")) nav.querySelectorAll(".dd.open").forEach(x => x.classList.remove("open")); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { nav.querySelectorAll(".dd.open").forEach(x => x.classList.remove("open")); if (document.activeElement && nav.contains(document.activeElement)) document.activeElement.blur(); } });
  build();
  window.addEventListener("cadru:lang", build);
})();
