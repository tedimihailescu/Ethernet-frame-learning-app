// Login gate + user menu + saving quiz scores. Loaded on every page except /login/.
// Opening the files locally (file://) skips all of this, so lessons still work offline.
if (location.protocol !== "file:") {
  document.documentElement.classList.add("auth-wait");
  boot().catch(err => { console.error(err); document.documentElement.classList.remove("auth-wait"); });
}

async function boot() {
  const [{ auth, db, ROOT, lang }, authMod, fs] = await Promise.all([
    import("./firebase.js?v=3"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")
  ]);
  // firebase.js is already forwarding .web.app visitors to firebaseapp.com; don't race it.
  if (location.hostname.endsWith(".web.app")) return;
  const { onAuthStateChanged, signOut } = authMod;
  const { doc, setDoc, addDoc, collection, serverTimestamp } = fs;
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
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || (user.email || "").split("@")[0],
        email: user.email || "",
        lastSeen: serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn("users write failed", e); }
  });

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
      toast(L(`✓ Rezultat salvat: ${d.score} / ${d.total}`, `✓ Result saved: ${d.score} / ${d.total}`), ROOT + "rezultate/index.html", L("Vezi rezultatele", "See results"));
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
    wrap.innerHTML = `<a class="um-link um-tests" href="${ROOT}teste/index.html">✎ <span class="um-name">${L("Teste", "Quizzes")}</span></a><a class="um-link" href="${ROOT}rezultate/index.html" title="${L("Rezultatele mele", "My results")}">★ <span class="um-name"></span></a><button type="button" class="icon-btn um-out" title="${L("Ieșire", "Sign out")}" aria-label="${L("Ieșire", "Sign out")}">⎋</button>`;
    wrap.querySelector(".um-name").textContent = name;
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
