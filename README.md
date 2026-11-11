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
| 4 | [Tomcat: viața unei cereri](https://tedimihailescu.github.io/Ethernet-frame-learning-app/tomcat/) | nginx ca reverse proxy, Connector, thread pool, Engine/Host/Context, filtre, DispatcherServlet, HikariCP, blocarea sub încărcare |
| 5 | [Microservicii pe Tomcat în producție](https://tedimihailescu.github.io/Ethernet-frame-learning-app/microservicii/) | Spring Boot cu Tomcat încorporat, API gateway, REST, Kafka și outbox, timeout, circuit breaker, bulkhead, tracing, health checks |
| 6 | [Rețeaua pod-urilor în Google Cloud (GKE)](https://tedimihailescu.github.io/Ethernet-frame-learning-app/gke-retea/) | IPAM, veth, bridge, kubenet, VPC-native cu alias IP, Calico și network policy, intranode visibility, overlay VXLAN/IPIP, NAT (după un [video Project Calico](https://www.youtube.com/watch?v=sDsWmdMniNs)) |
| 7 | [Viața unui pachet care intră în Kubernetes](https://tedimihailescu.github.io/Ethernet-frame-learning-app/k8s-intrare/) | Load balancer, placa de rețea (DMA, ring buffer, NAPI), PREROUTING, conntrack, lanțurile KUBE-*, DNAT, FORWARD, MASQUERADE, veth, socket |
| 8 | [Monolit C++ cu SOAP, nginx și Oracle](https://tedimihailescu.github.io/Ethernet-frame-learning-app/monolit-cpp/) | Plic SOAP și WSDL, nginx upstream, fire de execuție, module în proces, pool OCI și bind variables, SOAP Fault, failover (nume fictive) |
| 9 | [VLAN și 802.1Q](https://tedimihailescu.github.io/Ethernet-frame-learning-app/vlan/) | Porturi access și trunk, eticheta 802.1Q, tabele MAC pe VLAN, router on a stick, VLAN hopping |
| 10 | [NAT pas cu pas](https://tedimihailescu.github.io/Ethernet-frame-learning-app/nat/) | Adrese private, SNAT/PAT, tabela NAT, port forwarding, CGNAT, IPv6 |
| 11 | [HTTPS și TLS](https://tedimihailescu.github.io/Ethernet-frame-learning-app/https/) | TLS 1.3, ECDHE, certificate și lanț de încredere, man-in-the-middle, Let's Encrypt (ACME) |
| 12 | [Ingress în Kubernetes](https://tedimihailescu.github.io/Ethernet-frame-learning-app/ingress/) | Controller, TLS din Secret-uri, host + cale, default backend, adnotări, Gateway API |
| 13 | [IPv6 pas cu pas](https://tedimihailescu.github.io/Ethernet-frame-learning-app/ipv6/) | Scrierea adreselor, link-local și DAD, Router Advertisement, SLAAC, NDP în loc de ARP, Packet Too Big, dual-stack |
| 14 | [BGP pas cu pas](https://tedimihailescu.github.io/Ethernet-frame-learning-app/bgp/) | AS-uri, sesiuni TCP 179, UPDATE și AS_PATH, alegerea drumului, bucle, route leak, convergență, RPKI |
| 15 | [Service mesh](https://tedimihailescu.github.io/Ethernet-frame-learning-app/service-mesh/) | Istio și Envoy: sidecar, xDS, mTLS cu SPIFFE, autorizare, canary, retry, outlier detection, ambient mode |
| 16 | [Observabilitate](https://tedimihailescu.github.io/Ethernet-frame-learning-app/observabilitate/) | Trace-uri și traceparent, histograme și p99, log-uri structurate, OpenTelemetry Collector, SLO și burn rate |

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
| 4 | [Tomcat: the life of a request](https://tedimihailescu.github.io/Ethernet-frame-learning-app/tomcat/) | nginx reverse proxy, Connector, thread pool, Engine/Host/Context, filters, DispatcherServlet, HikariCP, lock-ups under load |
| 5 | [Microservices on Tomcat in production](https://tedimihailescu.github.io/Ethernet-frame-learning-app/microservicii/) | Spring Boot with embedded Tomcat, API gateway, REST, Kafka and outbox, timeouts, circuit breakers, bulkheads, tracing, health checks |

Every lesson has an animated diagram, a live packet view with changed fields highlighted, tables, "Learn more" sections, commands to try, a reference section, a glossary and a quiz. Romanian and English, light/dark theme, works on phones.

A new lesson is one HTML file that defines `window.LESSON` and loads `assets/engine.js`.

No build step and no dependencies (fonts load from Google Fonts, with system-font fallbacks). Addresses and names in the lessons are examples.
