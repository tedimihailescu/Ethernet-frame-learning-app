// Points: everyone starts with 15; every lesson quiz finished with more than 80% is worth 5 points.
// Points are worked out from the saved results (which can't be edited), plus whatever
// was won or lost at the roulette (users/{uid}.roulette, a running total).
export const TESTS = ["ethernet", "vlan", "nat", "dns", "https", "ipv6", "bgp", "tomcat", "monolit-cpp",
  "microservicii", "kubernetes", "k8s-intrare", "ingress", "gke-retea", "service-mesh", "observabilitate",
  "certificate", "load-balancing", "ldap", "kafka", "mq", "xfb", "xfb-gateway"];
export const PER_TEST = 5;
export const START = 15;   // free starting points, so everyone can try the roulette
export const MIN_SHARE = 0.8;

export const qualifies = r => !!r && TESTS.includes(String(r.lesson)) && r.total > 0 && r.score / r.total > MIN_SHARE;

export async function balance(db, uid, fs) {
  const { collection, query, where, getDocs, getDoc, doc } = fs;
  const [rs, u] = await Promise.all([
    getDocs(query(collection(db, "results"), where("uid", "==", uid))),
    getDoc(doc(db, "users", uid))
  ]);
  const earned = rs.docs.filter(d => qualifies(d.data())).length * PER_TEST;
  const net = u.exists() && typeof u.data().roulette === "number" ? u.data().roulette : 0;
  return { start: START, earned, net, total: Math.max(0, START + earned + net) };
}
