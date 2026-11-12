// Login gate + user menu + saving quiz scores. Loaded on every page except /login/.
// Opening the files locally (file://) skips all of this, so lessons still work offline.
if (location.protocol !== "file:") {
  document.documentElement.classList.add("auth-wait");
  boot().catch(err => { console.error(err); document.documentElement.classList.remove("auth-wait"); });
}

async function boot() {
  const [{ auth, db, ROOT, lang }, authMod, fs, pts] = await Promise.all([
    import("./firebase.js?v=5"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"),
    import("./points.js?v=4")
  ]);
  // firebase.js is already forwarding .web.app visitors to firebaseapp.com; don't race it.
  if (location.hostname.endsWith(".web.app")) return;
  const { onAuthStateChanged, signOut } = authMod;
  const { doc, setDoc, getDoc, addDoc, collection, serverTimestamp } = fs;
  const L = (ro, en) => (lang() === "en" ? en : ro);

  onAuthStateChanged(auth, async user => {
    if (!user) {
      location.replace(ROOT + "login/index.html?next=" + encodeURIComponent(location.href));
      return;
    }
    document.documentElement.classList.remove("auth-wait");
    userMenu(user);
    // Links like lesson/index.html#quiz: the quiz is drawn by script, so scroll once it exists.
    if (location.hash.length > 1) {
      setTimeout(() => { try { const el = document.querySelector(location.hash); if (el) el.scrollIntoView(); } catch (e) {} }, 60);
    }
    presence(user);
    adminLink(user);
    refreshPoints(user);
  });

  // Points badge in the top bar (links to the roulette, where points are played).
  let points = null;
  function showPoints(n) {
    points = n;
    const el = document.querySelector("#user-menu .um-pts b");
    if (el) el.textContent = n;
  }
  async function refreshPoints(user) {
    try { showPoints((await pts.balance(db, user.uid, fs)).total); } catch (e) { console.warn("points", e); }
  }
  window.addEventListener("points:changed", e => showPoints(e.detail.total));

  // Presence: "online" + lastSeen, refreshed every minute while the tab is visible.
  // The admin page treats someone as online only if lastSeen is recent, so a closed laptop
  // (where the "offline" write never happens) still drops to offline after a couple of minutes.
  function presence(user) {
    const page = (document.title || location.pathname).slice(0, 80);
    const path = location.pathname.replace(/index\.html$/, "").slice(0, 80);
    const write = online => setDoc(doc(db, "users", user.uid), {
      name: user.displayName || (user.email || "").split("@")[0],
      email: user.email || "",
      lastSeen: serverTimestamp(),
      online,
      page, path,
      created: user.metadata && user.metadata.creationTime ? user.metadata.creationTime : ""
    }, { merge: true }).catch(e => console.warn("presence write failed", e));
    write(true);
    setInterval(() => { if (document.visibilityState === "visible") write(true); }, 60000);
    document.addEventListener("visibilitychange", () => write(document.visibilityState === "visible"));
    window.addEventListener("pagehide", () => write(false));
  }

  async function adminLink(user) {
    try {
      const snap = await getDoc(doc(db, "admins", user.uid));
      if (!snap.exists()) return;
      const wrap = document.getElementById("user-menu");
      if (!wrap || wrap.querySelector(".um-admin")) return;
      const a = document.createElement("a");
      a.className = "um-link um-admin";
      a.href = ROOT + "admin/index.html";
      a.title = "Admin";
      a.innerHTML = '⚙ <span class="um-name">Admin</span>';
      wrap.insertBefore(a, wrap.querySelector(".um-out"));
    } catch (e) { /* not an admin, or offline */ }
  }

  window.addEventListener("quiz:complete", async e => {
    const user = auth.currentUser;
    if (!user) return;
    const d = e.detail;
    try {
      await addDoc(collection(db, "results"), {
        uid: user.uid,
        name: user.displayName || (user.email || "").split("@")[0],
        email: user.email || "",
        lesson: String(d.lesson).slice(0, 40),
        title: String(d.title).slice(0, 120),
        score: d.score | 0,
        total: d.total | 0,
        answers: d.answers.map(a => (a === null ? -1 : a | 0)),
        ts: serverTimestamp()
      });
      if (pts.qualifies(d)) {
        await refreshPoints(user);
        toast(L(`✓ ${d.score} / ${d.total} · 🪙 +${pts.PER_TEST} puncte! Ai acum ${points ?? "?"}.`, `✓ ${d.score} / ${d.total} · 🪙 +${pts.PER_TEST} points! You now have ${points ?? "?"}.`), ROOT + "ruleta/index.html", L("Joacă la ruletă", "Play roulette"));
      } else if (pts.TESTS.includes(String(d.lesson))) {
        toast(L(`✓ Rezultat salvat: ${d.score} / ${d.total}. Peste 80% primești 🪙 ${pts.PER_TEST} puncte.`, `✓ Result saved: ${d.score} / ${d.total}. Score over 80% to earn 🪙 ${pts.PER_TEST} points.`), ROOT + "rezultate/index.html", L("Vezi rezultatele", "See results"));
      } else {
        toast(L(`✓ Rezultat salvat: ${d.score} / ${d.total}`, `✓ Result saved: ${d.score} / ${d.total}`), ROOT + "rezultate/index.html", L("Vezi rezultatele", "See results"));
      }
    } catch (err) {
      console.error(err);
      toast(L("Rezultatul nu a putut fi salvat. Verifică conexiunea.", "The result couldn't be saved. Check your connection."));
    }
  });

  function userMenu(user) {
    const tools = document.querySelector(".topbar .tools");
    if (!tools || document.getElementById("user-menu")) return;
    const name = user.displayName || (user.email || "").split("@")[0];
    const wrap = document.createElement("div");
    wrap.id = "user-menu";
    wrap.className = "user-menu";
    wrap.innerHTML = `<a class="um-link um-pts" href="${ROOT}ruleta/index.html" title="${L("Punctele tale (joacă la ruletă)", "Your points (play roulette)")}">🪙 <b>${points ?? "…"}</b></a><a class="um-link" href="${ROOT}joc/index.html" title="${L("Mini-joc", "Mini-game")}">🎮 <span class="um-name">${L("Joc", "Game")}</span></a><a class="um-link um-tests" href="${ROOT}teste/index.html">✎ <span class="um-name">${L("Teste", "Quizzes")}</span></a><a class="um-link" href="${ROOT}rezultate/index.html" title="${L("Rezultatele mele", "My results")}">★ <span class="um-name um-user"></span></a><button type="button" class="icon-btn um-out" title="${L("Ieșire", "Sign out")}" aria-label="${L("Ieșire", "Sign out")}">⎋</button>`;
    wrap.querySelector(".um-user").textContent = name;
    wrap.querySelector(".um-out").onclick = () => signOut(auth);
    tools.prepend(wrap);
  }

  function toast(msg, href, label) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = "";
    const s = document.createElement("span"); s.textContent = msg; t.appendChild(s);
    if (href) { const a = document.createElement("a"); a.href = href; a.textContent = label; t.appendChild(a); }
    t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 6000);
  }
}
