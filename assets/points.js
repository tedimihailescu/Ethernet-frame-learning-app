// Points: everyone starts with 15; every lesson quiz finished with more than 80% is worth 5 points.
// Points are worked out from the saved results (which can't be edited), plus whatever
// was won or lost in the points games (users/{uid}.roulette, a running total) and the daily
// bonus (users/{uid}.bonus, +5 at most once every 20 h).
export const TESTS = ["ethernet", "vlan", "nat", "dns", "https", "ipv6", "bgp", "tomcat", "monolit-cpp",
  "microservicii", "kubernetes", "k8s-intrare", "ingress", "gke-retea", "service-mesh", "istio", "observabilitate",
  "certificate", "load-balancing", "ldap", "kafka", "mq", "xfb", "xfb-gateway", "gitops", "artifactory", "cassandra",
  "terraform", "terraform-deploy",
  "linux-retea", "linux-servicii", "linux-disc", "linux-performanta",
  "kali-lab", "kali-descoperire", "kali-nmap"];
export const PER_TEST = 5;
export const START = 15;   // free starting points, so everyone can try the roulette
export const MIN_SHARE = 0.8;
export const DAILY = 5;    // daily bonus
export const DAILY_MS = 20 * 3600 * 1000;

export const qualifies = r => !!r && TESTS.includes(String(r.lesson)) && r.total > 0 && r.score / r.total > MIN_SHARE;

export async function balance(db, uid, fs) {
  const { collection, query, where, getDocs, getDoc, doc } = fs;
  const [rs, u] = await Promise.all([
    getDocs(query(collection(db, "results"), where("uid", "==", uid))),
    getDoc(doc(db, "users", uid))
  ]);
  const earned = rs.docs.filter(d => qualifies(d.data())).length * PER_TEST;
  const ud = u.exists() ? u.data() : {};
  const net = typeof ud.roulette === "number" ? ud.roulette : 0;
  const bonus = typeof ud.bonus === "number" ? ud.bonus : 0;
  const last = ud.lastBonus && ud.lastBonus.toMillis ? ud.lastBonus.toMillis() : 0;
  return { start: START, earned, net, bonus, nextBonus: last ? last + DAILY_MS : 0, total: Math.max(0, START + earned + net + bonus), results: rs.docs.map(d => d.data()) };
}
