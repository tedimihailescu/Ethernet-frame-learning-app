# Rețea pas cu pas · Network step by step

**🇷🇴 Română** · [🇬🇧 English](#english)

Lecții web interactive despre rețele. Fiecare lecție e o simulare animată: urmărești pachetul pas cu pas și vezi ce câmpuri se schimbă la fiecare dispozitiv.

**▶ Deschide site-ul:** https://tedimihailescu.github.io/Ethernet-frame-learning-app/

## Lecții

| # | Lecție | Ce înveți |
|---|--------|-----------|
| 1 | [Drumul unui cadru Ethernet](https://tedimihailescu.github.io/Ethernet-frame-learning-app/ethernet/) | Încapsulare, ARP, switch-uri și tabela MAC, routere, TTL, FCS, de ce MAC-urile se schimbă și IP-urile nu |
| 2 | [Cum funcționează DNS](https://tedimihailescu.github.io/Ethernet-frame-learning-app/dns/) | Cache local și fișierul hosts, resolver recursiv, server rădăcină → .com → server autoritar, tipuri de înregistrări, TTL și cache |
| 3 | [Kubernetes: Service-uri și DNS în cluster](https://tedimihailescu.github.io/Ethernet-frame-learning-app/kubernetes/) | Pod-uri, etichete, Service și EndpointSlice, CoreDNS și `backend.shop.svc.cluster.local`, kube-proxy și DNAT, conntrack, CNI, NodePort și LoadBalancer |

Fiecare lecție are: diagramă animată, pachetul „live” cu câmpurile schimbate colorate, tabele (MAC, rutare, ARP, DNS, conntrack…), secțiuni „Află mai mult”, comenzi de încercat, referință, dicționar și test. Totul în română și engleză, temă luminoasă/întunecată, funcționează pe telefon.

## Structura

```
index.html          pagina principală cu lista de lecții
ethernet/index.html lecția Ethernet (de sine stătătoare)
dns/index.html      lecția DNS (date + assets/engine.js)
kubernetes/index.html lecția Kubernetes (date + assets/engine.js)
assets/site.css     stilurile comune
assets/lesson.css   stiluri în plus pentru lecțiile cu motor comun
assets/engine.js    motorul comun: diagramă, pași, pachet live, tabele, test
```

O lecție nouă = un fișier HTML care definește `window.LESSON` (noduri, legături, pași, tabele, dicționar, test) și încarcă `assets/engine.js`.

---

## English

Interactive networking lessons. Each one is an animated simulation: follow the packet step by step and see which fields change at every device.

**▶ Open the site:** https://tedimihailescu.github.io/Ethernet-frame-learning-app/

| # | Lesson | What you learn |
|---|--------|----------------|
| 1 | [The journey of an Ethernet frame](https://tedimihailescu.github.io/Ethernet-frame-learning-app/ethernet/) | Encapsulation, ARP, switches and MAC tables, routers, TTL, FCS, why MACs change and IPs don't |
| 2 | [How DNS works](https://tedimihailescu.github.io/Ethernet-frame-learning-app/dns/) | Local cache and hosts file, recursive resolver, root → .com → authoritative server, record types, TTL and caching |
| 3 | [Kubernetes: Services and cluster DNS](https://tedimihailescu.github.io/Ethernet-frame-learning-app/kubernetes/) | Pods, labels, Services and EndpointSlices, CoreDNS and `backend.shop.svc.cluster.local`, kube-proxy and DNAT, conntrack, CNI, NodePort and LoadBalancer |

Every lesson has an animated diagram, a live packet view with changed fields highlighted, tables, "Learn more" sections, commands to try, a reference section, a glossary and a quiz. Romanian and English, light/dark theme, works on phones.

A new lesson is one HTML file that defines `window.LESSON` and loads `assets/engine.js`.

No build step and no dependencies (fonts load from Google Fonts, with system-font fallbacks). Addresses and names in the lessons are examples.
