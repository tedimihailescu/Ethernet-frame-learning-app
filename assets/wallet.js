// Shared points wallet for the points games (slots, Higher/Lower, the rising packet).
// Same idea as the roulette: every change (a bet taken, a win paid) is first queued in this
// browser and then sent to users/{uid}.roulette with an id, one at a time, until Firestore
// confirms it, also on the next visit. The rules allow one change every 4 s and cap each
// change at -100 … +3500, so the games keep bets ≤ 100 and payouts ≤ 3500.
// Opened as a local file (or with window.WAGER_DEMO) it runs on demo points kept in localStorage.
const QKEY = "wager-queue", LKEY = "wager-last", DEMO = "ruleta-demo";
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const qGet = () => { try { return JSON.parse(store.get(QKEY) || "[]") || []; } catch (e) { return []; } };
const qSet = q => store.set(QKEY, JSON.stringify(q));

export async function openWallet({ onChange = () => {}, onError = () => {} } = {}) {
  const w = { bal: null, demo: false, pending: () => qGet().length };
  const changed = () => onChange(w.bal);

  if (location.protocol === "file:" || window.WAGER_DEMO) {
    w.demo = true;
    w.bal = +(store.get(DEMO) || 15);
    w.commit = delta => { w.bal = Math.max(0, w.bal + delta); store.set(DEMO, String(w.bal)); changed(); };
    w.reload = async () => w.bal;
    changed();
    return w;
  }

  const [{ auth, db }, { onAuthStateChanged }, fs, pts] = await Promise.all([
    import("./firebase.js?v=5"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"),
    import("./points.js?v=13")
  ]);
  const user = await new Promise(res => { const off = onAuthStateChanged(auth, u => { if (u) { off(); res(u); } }); });
  const ref = fs.doc(db, "users", user.uid);

  let flushing = null;
  function flush() {
    if (!flushing) flushing = (async () => {
      for (let attempt = 0; ;) {
        const q = qGet();
        if (!q.length) return true;
        const p = q[0];
        if (p.uid !== user.uid) { qSet(q.slice(1)); continue; }
        try {
          const snap = await fs.getDoc(ref);
          if (!(snap.exists() && snap.data().spinId === p.id)) {
            const wait = (+store.get(LKEY) || 0) + 4500 - Date.now();
            if (wait > 0) await sleep(wait);
            await fs.setDoc(ref, { roulette: fs.increment(p.delta), lastSpin: fs.serverTimestamp(), spinId: p.id }, { merge: true });
            store.set(LKEY, String(Date.now()));
          }
          qSet(qGet().filter(x => x.id !== p.id));
          attempt = 0;
          if (!qGet().length) window.dispatchEvent(new CustomEvent("points:changed", { detail: { total: w.bal } }));
        } catch (e) {
          attempt++;
          console.warn("points save, attempt " + attempt, e);
          if (e && e.code === "permission-denied" && attempt >= 3) {
            // The server refuses this change for good: drop it and show the real balance.
            qSet(qGet().filter(x => x.id !== p.id));
            attempt = 0;
            onError();
            try { await w.reload(); } catch (e2) {}
            continue;
          }
          await sleep(Math.min(30000, 5000 * attempt));
        }
      }
    })().finally(() => { flushing = null; });
    return flushing;
  }

  w.reload = async () => { w.bal = (await pts.balance(db, user.uid, fs)).total; changed(); return w.bal; };
  // Apply a change now (the screen) and queue it for the server.
  w.commit = delta => {
    delta = Math.round(delta);
    if (!delta) return;
    w.bal = Math.max(0, w.bal + delta);
    const r = new Uint32Array(1); crypto.getRandomValues(r);
    qSet(qGet().concat({ id: Date.now().toString(36) + "-" + r[0].toString(36), uid: user.uid, delta }));
    changed();
    flush();
  };

  // Send anything left over from a previous visit first, then read the balance.
  try { await flush(); } catch (e) {}
  try { await w.reload(); } catch (e) { console.error(e); w.bal = 0; changed(); }
  return w;
}
