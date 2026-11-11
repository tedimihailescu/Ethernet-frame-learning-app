/* Lab exercises for every lesson (see assets/lab.js for the task types).
   Addresses and names are documentation examples; outputs are realistic but simulated. */
(function () {
const tb = (cols, rows) => `<table><thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
const B = (ro, en) => ({ ro, en });

window.LABS = {
ethernet: { title: B("Cadrul Ethernet", "The Ethernet frame"), tasks: [
 { type: "term", name: B("Tabela ARP", "The ARP table"), q: B("Ai trimis un ping spre gateway. Afișează tabela ARP a calculatorului tău Windows ca să vezi ce MAC a aflat.", "You pinged the gateway. Show your Windows computer's ARP table to see which MAC it learned."),
   prompt: "C:\\>", need: ["arp", "-a"], sol: "arp -a",
   out: "Interface: 192.168.1.10 --- 0x7\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-1a-2b-3c-4d-01     dynamic\n  192.168.1.255         ff-ff-ff-ff-ff-ff     static",
   hint: B("Comanda are același nume ca protocolul, plus opțiunea „all”.", "The command has the protocol's name, plus the \"all\" option."), why: B("Rândul „dynamic” pentru 192.168.1.1 e chiar răspunsul ARP din lecție.", "The \"dynamic\" row for 192.168.1.1 is the ARP reply from the lesson.") },
 { type: "input", name: "TTL", q: B("Un pachet pleacă de la Host A cu TTL 64 și trece prin 3 routere până la Host B. Cu ce TTL ajunge?", "A packet leaves Host A with TTL 64 and crosses 3 routers to reach Host B. What TTL does it arrive with?"),
   ans: ["61"], hint: B("Fiecare router scade TTL-ul cu 1. Switch-urile nu-l ating.", "Each router decrements TTL by 1. Switches don't touch it."), why: B("64 − 3 = 61.", "64 − 3 = 61.") },
 { type: "order", name: B("Spre altă rețea", "To another network"), q: B("Host A trimite un pachet unui calculator din altă rețea. Pune pașii în ordine.", "Host A sends a packet to a computer on another network. Put the steps in order."),
   items: [B("Host A vede că destinația e în altă rețea, deci trimite prin gateway", "Host A sees the destination is on another network, so it sends via the gateway"), B("Trimite un ARP broadcast: „cine are 192.168.1.1?”", "It sends an ARP broadcast: \"who has 192.168.1.1?\""), B("Routerul răspunde cu MAC-ul lui", "The router replies with its MAC"), B("Host A trimite cadrul: MAC destinație = router, IP destinație = Host B", "Host A sends the frame: destination MAC = router, destination IP = Host B"), B("Routerul scade TTL, recalculează FCS și pune MAC-uri noi", "The router decrements TTL, recomputes FCS and puts on new MACs")],
   hint: B("Fără MAC-ul gateway-ului, cadrul nu poate pleca.", "Without the gateway's MAC, the frame can't leave.") }
]},

vlan: { title: B("VLAN", "VLANs"), tasks: [
 { type: "term", name: B("VLAN-urile switch-ului", "The switch's VLANs"), q: B("Pe un switch Cisco, afișează pe scurt VLAN-urile și porturile din fiecare.", "On a Cisco switch, show a brief list of VLANs and the ports in each."),
   prompt: "SW1#", need: ["show", "vlan"], sol: "show vlan brief",
   out: "VLAN Name             Status    Ports\n---- ---------------- --------- ------------------------\n1    default          active    Gi0/2\n10   VANZARI          active    Fa0/1, Fa0/2\n20   CONTABILITATE    active    Fa0/3, Fa0/4\n99   MGMT             active",
   hint: B("Comenzile de afișare încep cu „show”.", "Display commands start with \"show\"."), why: B("Portul trunk (Gi0/1) nu apare în listă: el duce toate VLAN-urile.", "The trunk port (Gi0/1) isn't listed: it carries every VLAN.") },
 { type: "input", name: B("Câte VLAN-uri?", "How many VLANs?"), q: B("Câmpul VID din eticheta 802.1Q are 12 biți, iar valorile 0 și 4095 sunt rezervate. Câte VLAN-uri utilizabile rămân?", "The VID field in the 802.1Q tag has 12 bits, and values 0 and 4095 are reserved. How many usable VLANs are left?"),
   ans: ["4094"], hint: B("2 la puterea 12, minus cele două rezervate.", "2 to the power of 12, minus the two reserved."), why: B("2¹² = 4096; 4096 − 2 = 4094.", "2¹² = 4096; 4096 − 2 = 4094.") },
 { type: "order", name: B("Un port access", "An access port"), q: B("Pune comenzile în ordine ca portul Fa0/5 să devină port access în VLAN 20.", "Put the commands in order to make port Fa0/5 an access port in VLAN 20."),
   items: ["configure terminal", "interface Fa0/5", "switchport mode access", "switchport access vlan 20", "no shutdown"],
   hint: B("Întâi intri în modul de configurare, apoi alegi interfața.", "First enter configuration mode, then pick the interface.") }
]},

nat: { title: "NAT", tasks: [
 { type: "term", name: B("Traducerile active", "Active translations"), q: B("Pe un router Linux, afișează traducerile NAT active (tabela conntrack), cu adrese numerice.", "On a Linux router, list the active NAT translations (the conntrack table), with numeric addresses."),
   prompt: "root@router:~#", need: ["conntrack", ["-l", "--dump"]], sol: "conntrack -L -n",
   out: "tcp  6 431998 ESTABLISHED src=192.168.1.10 dst=203.0.113.80 sport=51000 dport=443 src=203.0.113.80 dst=198.51.100.7 sport=443 dport=40001 [ASSURED]\ntcp  6 431995 ESTABLISHED src=192.168.1.20 dst=203.0.113.80 sport=51000 dport=443 src=203.0.113.80 dst=198.51.100.7 sport=443 dport=40002 [ASSURED]",
   hint: B("Unealta se numește ca tabela; opțiunea de listare e „-L”.", "The tool is named after the table; the list option is \"-L\"."), why: B("Fiecare rând are două jumătăți: pachetul original și cum arată răspunsul după traducere.", "Each row has two halves: the original packet and what the reply looks like after translation.") },
 { type: "input", name: B("Cui îi dai răspunsul?", "Who gets the reply?"), q: B("Un răspuns vine la routerul de acasă pe 198.51.100.7:40002. La ce IP intern îl trimite routerul?", "A reply reaches the home router on 198.51.100.7:40002. Which internal IP does the router send it to?"),
   ctx: tb(["Intern / Inside", "Public"], [["192.168.1.10:51000", "198.51.100.7:40001"], ["192.168.1.20:51000", "198.51.100.7:40002"], ["192.168.1.30:443", "198.51.100.7:8443"]]),
   ans: ["192.168.1.20", "192.168.1.20:51000"], show: "192.168.1.20", hint: B("Caută portul public 40002 în tabel.", "Look up public port 40002 in the table."), why: B("Portul public deosebește conexiunile din spatele aceluiași IP.", "The public port tells apart connections behind the same IP.") },
 { type: "order", name: B("Dus-întors prin NAT", "There and back through NAT"), q: B("Ordonează drumul unei conexiuni prin NAT.", "Order a connection's path through NAT."),
   items: [B("Laptopul trimite cu sursa 192.168.1.10:51000", "The laptop sends with source 192.168.1.10:51000"), B("Routerul schimbă sursa în 198.51.100.7:40001", "The router changes the source to 198.51.100.7:40001"), B("Routerul notează traducerea în tabela NAT", "The router records the translation in the NAT table"), B("Serverul răspunde la 198.51.100.7:40001", "The server replies to 198.51.100.7:40001"), B("Routerul găsește portul în tabelă și schimbă destinația înapoi", "The router finds the port in the table and changes the destination back")],
   hint: B("Traducerea se notează înainte să vină răspunsul.", "The translation is recorded before the reply arrives.") }
]},

dns: { title: "DNS", tasks: [
 { type: "term", name: B("Serverul de e-mail", "The mail server"), q: B("Află serverul de e-mail al domeniului example.com, cu nslookup sau dig.", "Find the mail server for example.com, with nslookup or dig."),
   prompt: "$", need: [["nslookup", "dig", "host"], "mx", "example.com"], sol: "nslookup -type=MX example.com",
   out: "Server:  resolver.local\nAddress: 192.168.1.1\n\nNon-authoritative answer:\nexample.com  MX preference = 10, mail exchanger = mx1.example.com\nexample.com  MX preference = 20, mail exchanger = mx2.example.com",
   hint: B("Tipul de înregistrare pentru e-mail e MX: nslookup -type=MX … sau dig … MX.", "The record type for mail is MX: nslookup -type=MX … or dig … MX."), why: B("Preferința mai mică (10) e încercată prima.", "The lower preference (10) is tried first.") },
 { type: "input", name: B("Cât ține cache-ul", "How long the cache lasts"), q: B("O înregistrare A are TTL 300. După câte minute trebuie resolverul să întrebe din nou?", "An A record has TTL 300. After how many minutes must the resolver ask again?"),
   ans: ["5", "5 min", "5 minute", "5 minutes"], show: "5", hint: B("TTL-ul din DNS e în secunde.", "DNS TTL is in seconds."), why: B("300 s = 5 minute.", "300 s = 5 minutes.") },
 { type: "order", name: B("O rezolvare completă", "A full resolution"), q: B("Ordonează pașii rezolvării lui www.example.com cu cache-ul gol.", "Order the steps of resolving www.example.com with an empty cache."),
   items: [B("Calculatorul întreabă resolverul", "The computer asks the resolver"), B("Resolverul întreabă un server rădăcină", "The resolver asks a root server"), B("Rădăcina îl trimite la serverele .com", "The root refers it to the .com servers"), B("Serverele .com îl trimit la serverul autoritar al example.com", "The .com servers refer it to example.com's authoritative server"), B("Serverul autoritar răspunde cu adresa IP", "The authoritative server answers with the IP address"), B("Resolverul păstrează răspunsul în cache și îl trimite calculatorului", "The resolver caches the answer and returns it to the computer")],
   hint: B("De la rădăcină spre nume, de la dreapta la stânga.", "From the root towards the name, right to left.") }
]},

https: { title: "HTTPS / TLS", tasks: [
 { type: "term", name: B("Privește certificatul", "Look at the certificate"), q: B("Conectează-te cu openssl la example.com pe portul 443 și vezi certificatul și versiunea TLS.", "Connect with openssl to example.com on port 443 and see the certificate and TLS version."),
   prompt: "$", need: ["openssl", "s_client", "example.com:443"], sol: "openssl s_client -connect example.com:443 -servername example.com",
   out: "CONNECTED(00000003)\ndepth=2 C=US, O=Example Root CA\ndepth=1 C=US, O=Example Issuing CA R3\ndepth=0 CN=example.com\n---\nCertificate chain\n 0 s:CN=example.com\n   i:C=US, O=Example Issuing CA R3\n---\nNew, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384\nVerify return code: 0 (ok)",
   hint: B("Subcomanda e s_client, iar destinația se dă cu -connect gazdă:port.", "The subcommand is s_client, and the target is given with -connect host:port."), why: B("Lanțul are trei niveluri: site, emitent intermediar, rădăcină de încredere.", "The chain has three levels: the site, an intermediate issuer, a trusted root.") },
 { type: "input", name: B("Expirare", "Expiry"), q: B("Certificatul e valabil până pe 1 decembrie 2026. Azi e 12 noiembrie 2026. Câte zile mai are până expiră?", "The certificate is valid until 1 December 2026. Today is 12 November 2026. How many days until it expires?"),
   ans: ["19"], hint: B("Noiembrie are 30 de zile.", "November has 30 days."), why: B("30 − 12 = 18 zile în noiembrie + 1 decembrie = 19. Let's Encrypt reînnoiește automat cu 30 de zile înainte.", "30 − 12 = 18 days in November + 1 December = 19. Let's Encrypt renews automatically 30 days ahead.") },
 { type: "order", name: B("Handshake TLS 1.3", "The TLS 1.3 handshake"), q: B("Ordonează mesajele unui handshake TLS 1.3.", "Order the messages of a TLS 1.3 handshake."),
   items: [B("ClientHello, cu cheia publică temporară a clientului", "ClientHello, with the client's ephemeral public key"), B("ServerHello, cu cheia publică temporară a serverului", "ServerHello, with the server's ephemeral public key"), B("Serverul trimite certificatul și semnătura (CertificateVerify)", "The server sends its certificate and signature (CertificateVerify)"), B("Ambele părți trimit Finished", "Both sides send Finished"), B("Cererea HTTP pleacă criptată", "The HTTP request goes out encrypted")],
   hint: B("Cheile se schimbă în primele două mesaje; certificatul vine deja criptat.", "Keys are exchanged in the first two messages; the certificate already comes encrypted.") }
]},

ipv6: { title: "IPv6", tasks: [
 { type: "term", name: B("Vecinii IPv6", "IPv6 neighbours"), q: B("Pe Linux, afișează neighbor cache-ul IPv6 (echivalentul tabelei ARP).", "On Linux, show the IPv6 neighbour cache (the equivalent of the ARP table)."),
   prompt: "user@laptop:~$", need: ["ip", "-6", "neigh"], sol: "ip -6 neigh",
   out: "fe80::1 dev eth0 lladdr 00:1a:2b:3c:4d:01 router REACHABLE\nfe80::a8c1:4ff:fe22:9 dev eth0 lladdr aa:c1:04:22:00:09 STALE",
   hint: B("Comanda ip, familia -6, obiectul „neigh”.", "The ip command, family -6, the \"neigh\" object."), why: B("Cuvântul „router” arată că NDP a aflat și că vecinul e un router.", "The word \"router\" shows NDP also learned the neighbour is a router.") },
 { type: "input", name: B("Forma scurtă", "Short form"), q: B("Scrie forma scurtă a adresei 2001:0db8:0000:0000:0000:0000:0000:0042.", "Write the short form of 2001:0db8:0000:0000:0000:0000:0000:0042."),
   ans: ["2001:db8::42"], hint: B("Scoate zerourile de la începutul grupurilor și înlocuiește o singură dată grupurile 0000 cu ::.", "Drop leading zeros in groups and replace the 0000 groups once with ::."), why: B("0db8 → db8, 0042 → 42, iar cele cinci grupuri zero devin ::.", "0db8 → db8, 0042 → 42, and the five zero groups become ::.") },
 { type: "order", name: B("De la cablu la internet", "From cable to internet"), q: B("Ordonează ce face laptopul după ce intră într-o rețea IPv6.", "Order what the laptop does after joining an IPv6 network."),
   items: [B("Își face adresa link-local și verifică dublura (DAD)", "Builds its link-local address and checks for duplicates (DAD)"), B("Trimite Router Solicitation la ff02::2", "Sends a Router Solicitation to ff02::2"), B("Primește Router Advertisement cu prefixul", "Receives a Router Advertisement with the prefix"), B("Își construiește adresa globală (SLAAC)", "Builds its global address (SLAAC)"), B("Află MAC-ul routerului cu Neighbor Solicitation / Advertisement", "Learns the router's MAC with Neighbor Solicitation / Advertisement"), B("Trimite pachetul de date spre internet", "Sends the data packet to the internet")],
   hint: B("Fără prefix nu există adresă globală; fără MAC-ul routerului nu pleacă nimic.", "No prefix, no global address; no router MAC, nothing leaves.") }
]},

bgp: { title: "BGP", tasks: [
 { type: "term", name: B("Rutele unui prefix", "A prefix's routes"), q: B("Pe routerul ISP-ului (FRR), afișează rutele BGP pentru 203.0.113.0/24.", "On the ISP's router (FRR), show the BGP routes for 203.0.113.0/24."),
   prompt: "isp-r1#", need: ["show", "bgp", "203.0.113.0/24"], sol: "show bgp ipv4 unicast 203.0.113.0/24",
   out: "BGP routing table entry for 203.0.113.0/24\nPaths: (2 available, best #1)\n  64502 64501\n    192.0.2.9 from 192.0.2.9 (192.0.2.9)\n      Origin IGP, localpref 200, valid, external, best (Local Pref)\n  64503 64501\n    192.0.2.17 from 192.0.2.17 (192.0.2.17)\n      Origin IGP, localpref 100, valid, external",
   hint: B("show bgp …, urmat de prefix.", "show bgp …, followed by the prefix."), why: B("„best (Local Pref)” spune exact ce criteriu a decis.", "\"best (Local Pref)\" says exactly which criterion decided.") },
 { type: "input", name: B("Care rută câștigă?", "Which route wins?"), q: B("Ruta A: LOCAL_PREF 100, AS_PATH 64502 64501. Ruta B: LOCAL_PREF 150, AS_PATH 64503 64510 64520 64501. Pe care o alege routerul? (A sau B)", "Route A: LOCAL_PREF 100, AS_PATH 64502 64501. Route B: LOCAL_PREF 150, AS_PATH 64503 64510 64520 64501. Which does the router choose? (A or B)"),
   ans: ["b", "ruta b", "route b"], show: "B", hint: B("Care criteriu se verifică primul?", "Which criterion is checked first?"), why: B("LOCAL_PREF mai mare câștigă înainte să conteze lungimea AS_PATH.", "The higher LOCAL_PREF wins before AS_PATH length matters.") },
 { type: "order", name: B("De la sesiune la trafic", "From session to traffic"), q: B("Ordonează ce se întâmplă de la pornirea sesiunii până circulă traficul.", "Order what happens from session start until traffic flows."),
   items: [B("Conexiune TCP pe portul 179 și mesaj OPEN", "TCP connection on port 179 and an OPEN message"), B("Sesiunea ajunge în starea Established", "The session reaches Established"), B("AS64501 trimite UPDATE cu prefixul", "AS64501 sends an UPDATE with the prefix"), B("Tranzitul își adaugă AS-ul în AS_PATH și anunță mai departe", "The transit adds its AS to AS_PATH and passes it on"), B("ISP-ul alege cea mai bună rută", "The ISP picks the best route"), B("Pachetele urmează ruta aleasă", "Packets follow the chosen route")],
   hint: B("Planul de control vine înaintea planului de date.", "The control plane comes before the data plane.") }
]},

kubernetes: { title: "Kubernetes Services & DNS", tasks: [
 { type: "term", name: B("Service-ul backend", "The backend Service"), q: B("Afișează Service-ul „backend” din namespace-ul shop.", "Show the \"backend\" Service in the shop namespace."),
   prompt: "$", need: ["kubectl", "get", ["svc", "service"], "backend"], sol: "kubectl get svc backend -n shop",
   out: "NAME      TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE\nbackend   ClusterIP   10.96.12.34    <none>        8080/TCP   12d",
   hint: B("kubectl get, resursa „svc”, apoi numele și -n shop.", "kubectl get, the \"svc\" resource, then the name and -n shop."), why: B("CLUSTER-IP e adresa virtuală pe care o întoarce CoreDNS.", "CLUSTER-IP is the virtual address CoreDNS returns.") },
 { type: "input", name: "FQDN", q: B("Un pod din namespace-ul shop cheamă „backend”. Care e numele complet (FQDN) pe care îl rezolvă CoreDNS?", "A pod in the shop namespace calls \"backend\". What's the full name (FQDN) CoreDNS resolves?"),
   ans: ["backend.shop.svc.cluster.local"], hint: B("serviciu.namespace.svc.domeniul-clusterului", "service.namespace.svc.cluster-domain"), why: B("Lista „search” din /etc/resolv.conf completează automat restul numelui.", "The \"search\" list in /etc/resolv.conf fills in the rest of the name.") },
 { type: "order", name: B("Pod → Service → pod", "Pod → Service → pod"), q: B("Ordonează drumul unei cereri de la frontend la backend.", "Order a request's path from frontend to backend."),
   items: [B("Podul frontend întreabă CoreDNS de „backend”", "The frontend pod asks CoreDNS for \"backend\""), B("Primește ClusterIP-ul 10.96.12.34", "Gets ClusterIP 10.96.12.34"), B("Trimite pachetul spre ClusterIP", "Sends the packet to the ClusterIP"), B("Regulile kube-proxy (iptables) fac DNAT spre IP-ul unui pod backend", "kube-proxy's (iptables) rules DNAT it to a backend pod's IP"), B("Pachetul ajunge la podul backend", "The packet reaches the backend pod")],
   hint: B("Întâi numele, apoi adresa virtuală, apoi traducerea.", "Name first, then the virtual address, then the translation.") }
]},

ingress: { title: "Ingress", tasks: [
 { type: "term", name: B("Ingress-urile", "The Ingresses"), q: B("Afișează Ingress-urile din namespace-ul shop.", "List the Ingresses in the shop namespace."),
   prompt: "$", need: ["kubectl", "get", "ing"], sol: "kubectl get ingress -n shop",
   out: "NAME   CLASS   HOSTS                          ADDRESS        PORTS     AGE\nshop   nginx   shop.example.com,api.example.com   203.0.113.50   80, 443   30d",
   hint: B("kubectl get ingress (sau „ing”) -n shop.", "kubectl get ingress (or \"ing\") -n shop."), why: B("ADDRESS e IP-ul load balancer-ului controller-ului; toate host-urile îl împart.", "ADDRESS is the controller's load balancer IP; every host shares it.") },
 { type: "input", name: B("Ce cale câștigă?", "Which path wins?"), q: B("Reguli (pathType Prefix) pentru shop.example.com. La ce serviciu ajunge cererea /api/v2/orders?", "Rules (pathType Prefix) for shop.example.com. Which service does /api/v2/orders reach?"),
   ctx: tb(["Path", "Service"], [["/", "web-svc"], ["/api", "api-svc"], ["/api/v2", "api-v2-svc"]]),
   ans: ["api-v2-svc"], hint: B("Dintre prefixele care se potrivesc, câștigă cel mai lung.", "Of the prefixes that match, the longest wins."), why: B("/, /api și /api/v2 se potrivesc toate; /api/v2 e cel mai lung.", "/, /api and /api/v2 all match; /api/v2 is the longest.") },
 { type: "order", name: B("Cererea HTTPS", "The HTTPS request"), q: B("Ordonează drumul unei cereri https://shop.example.com/cart.", "Order the path of a request to https://shop.example.com/cart."),
   items: [B("DNS întoarce IP-ul load balancer-ului", "DNS returns the load balancer's IP"), B("Cererea ajunge la controller-ul Ingress (nginx)", "The request reaches the Ingress controller (nginx)"), B("Controller-ul termină TLS cu certificatul din Secret", "The controller terminates TLS with the certificate from the Secret"), B("Potrivește host-ul și calea cu regulile", "It matches the host and path against the rules"), B("Trimite cererea direct la un pod al serviciului ales", "It forwards the request straight to a pod of the chosen service")],
   hint: B("Ca să citească host-ul și calea, controller-ul trebuie întâi să decripteze.", "To read the host and path, the controller must decrypt first.") }
]},

"gke-retea": { title: B("Rețeaua în GKE", "GKE networking"), tasks: [
 { type: "term", name: B("Pod-uri și noduri", "Pods and nodes"), q: B("Afișează podurile cu IP-urile lor și nodul pe care rulează.", "List the pods with their IPs and the node each runs on."),
   prompt: "$", need: ["kubectl", "get", "pod", "wide"], sol: "kubectl get pods -o wide",
   out: "NAME                     READY   STATUS    IP           NODE\nfrontend-7d9c6b5f-x2kq   1/1     Running   10.4.1.12    gke-pool-1-a\nbackend-5f6d8c7b-9zt4    1/1     Running   10.4.2.7     gke-pool-1-b\nbackend-5f6d8c7b-m8wq    1/1     Running   10.4.1.15    gke-pool-1-a",
   hint: B("Opțiunea de ieșire „-o wide” adaugă IP-ul și nodul.", "The \"-o wide\" output option adds the IP and node."), why: B("Podurile de pe același nod au IP-uri din același /24 (10.4.1.x pe nodul a).", "Pods on the same node share a /24 (10.4.1.x on node a).") },
 { type: "input", name: B("Adrese pe nod", "Addresses per node"), q: B("Fiecare nod primește un interval /24 pentru pod-uri. Câte adrese are intervalul?", "Each node gets a /24 range for pods. How many addresses are in it?"),
   ans: ["256"], hint: B("32 − 24 = 8 biți pentru gazde.", "32 − 24 = 8 host bits."), why: B("2⁸ = 256. GKE pune implicit maxim 110 pod-uri pe nod, ca să aibă adrese libere la recreare.", "2⁸ = 256. GKE allows at most 110 pods per node by default, to keep spare addresses for re-creation.") },
 { type: "order", name: B("Între două noduri", "Between two nodes"), q: B("Ordonează drumul unui pachet de la un pod pe nodul A la un pod pe nodul B (VPC-native).", "Order a packet's path from a pod on node A to a pod on node B (VPC-native)."),
   items: [B("Podul trimite pe interfața eth0 din namespace-ul lui", "The pod sends out eth0 in its namespace"), B("Pachetul trece prin perechea veth în namespace-ul nodului", "The packet crosses the veth pair into the node's namespace"), B("Nodul A îl trimite în rețeaua VPC", "Node A sends it into the VPC network"), B("VPC-ul știe că IP-ul podului e un alias IP al nodului B", "The VPC knows the pod IP is an alias IP of node B"), B("Nodul B îl dă prin veth podului destinație", "Node B hands it via veth to the destination pod")],
   hint: B("Din pod în nod, din nod în VPC, apoi invers.", "Pod to node, node to VPC, then back the other way.") }
]},

"k8s-intrare": { title: B("Pachetul care intră în Kubernetes", "The packet entering Kubernetes"), tasks: [
 { type: "term", name: B("Lanțul PREROUTING", "The PREROUTING chain"), q: B("Pe un nod, afișează regulile din tabela nat, lanțul PREROUTING, cu adrese numerice.", "On a node, list the rules in the nat table, PREROUTING chain, with numeric addresses."),
   prompt: "root@node-1:~#", need: ["iptables", "nat", "prerouting"], sol: "iptables -t nat -L PREROUTING -n",
   out: "Chain PREROUTING (policy ACCEPT)\ntarget         prot opt source      destination\nKUBE-SERVICES  all  --  0.0.0.0/0   0.0.0.0/0   /* kubernetes service portals */",
   hint: B("iptables -t <tabela> -L <lanțul> -n", "iptables -t <table> -L <chain> -n"), why: B("Tot traficul care intră sare imediat în KUBE-SERVICES, construit de kube-proxy.", "All incoming traffic jumps straight into KUBE-SERVICES, built by kube-proxy.") },
 { type: "input", name: B("Probabilitatea", "The probability"), q: B("Un Service are 3 pod-uri. Prima regulă din lanțul KUBE-SVC alege primul pod cu ce probabilitate, ca toate să primească la fel? (zecimal)", "A Service has 3 pods. With what probability does the first rule in the KUBE-SVC chain pick the first pod, so all get the same share? (decimal)"),
   ans: ["0.333", "0.33", "0.3333", "0.33333", "1/3", "0,333", "0,33", "33%"], show: "0.33333", hint: B("Prima regulă trebuie să prindă o treime din tot traficul.", "The first rule must catch one third of all traffic."), why: B("Apoi 0.5 din rest pentru al doilea, iar al treilea primește ce rămâne.", "Then 0.5 of the rest for the second, and the third gets what's left.") },
 { type: "order", name: B("Prin kernel", "Through the kernel"), q: B("Ordonează drumul pachetului prin nod, până în pod.", "Order the packet's path through the node into the pod."),
   items: [B("Placa de rețea copiază pachetul în memorie (DMA) și anunță kernelul", "The NIC copies the packet into memory (DMA) and notifies the kernel"), B("Hook-ul PREROUTING (conntrack + nat)", "The PREROUTING hook (conntrack + nat)"), B("KUBE-SERVICES → KUBE-SVC → KUBE-SEP face DNAT spre IP-ul podului", "KUBE-SERVICES → KUBE-SVC → KUBE-SEP DNATs to the pod IP"), B("Decizia de rutare: pachetul nu e pentru nod, se trimite mai departe", "Routing decision: not for the node, so it's forwarded"), B("Lanțul FORWARD", "The FORWARD chain"), B("Prin veth, în namespace-ul podului", "Through veth into the pod's namespace")],
   hint: B("DNAT-ul se face înainte de decizia de rutare.", "DNAT happens before the routing decision.") }
]},

"service-mesh": { title: "Service mesh", tasks: [
 { type: "term", name: B("Ce vede Envoy", "What Envoy sees"), q: B("Afișează endpoint-urile pe care le vede Envoy-ul deployment-ului frontend din namespace-ul shop.", "Show the endpoints seen by the frontend deployment's Envoy in the shop namespace."),
   prompt: "$", need: ["istioctl", "proxy-config", "endpoint", "frontend"], sol: "istioctl proxy-config endpoints deploy/frontend -n shop",
   out: "ENDPOINT          STATUS     OUTLIER CHECK   CLUSTER\n10.1.0.31:8080    HEALTHY    OK              outbound|8080|v1|orders.shop.svc.cluster.local\n10.1.0.47:8080    HEALTHY    FAILED          outbound|8080|v2|orders.shop.svc.cluster.local",
   hint: B("istioctl proxy-config endpoints deploy/<nume> -n <namespace>", "istioctl proxy-config endpoints deploy/<name> -n <namespace>"), why: B("„OUTLIER CHECK FAILED”: podul v2 e scos din rotație de outlier detection.", "\"OUTLIER CHECK FAILED\": the v2 pod is ejected by outlier detection.") },
 { type: "input", name: B("Furtuna de retry-uri", "The retry storm"), q: B("O cerere trece prin 3 straturi de servicii, iar fiecare strat face până la 4 încercări (1 + 3 retry-uri). Câte cereri pot ajunge, în cel mai rău caz, la serviciul de jos?", "A request crosses 3 layers of services, and each layer makes up to 4 attempts (1 + 3 retries). In the worst case, how many requests can reach the bottom service?"),
   ans: ["64"], hint: B("Încercările se înmulțesc de la un strat la altul.", "Attempts multiply from one layer to the next."), why: B("4 × 4 × 4 = 64. De aceea se reîncearcă doar într-un singur loc, cu buget de timp.", "4 × 4 × 4 = 64. That's why retries happen in one place only, with a time budget.") },
 { type: "order", name: B("Cererea prin mesh", "The request through the mesh"), q: B("Ordonează drumul unei cereri de la aplicația frontend la aplicația orders.", "Order a request's path from the frontend app to the orders app."),
   items: [B("Aplicația frontend face GET http://orders:8080", "The frontend app does GET http://orders:8080"), B("iptables redirecționează conexiunea la Envoy-ul local (15001)", "iptables redirects the connection to the local Envoy (15001)"), B("Envoy alege versiunea și podul, apoi deschide mTLS", "Envoy picks the version and pod, then opens mTLS"), B("Envoy-ul lui orders (15006) verifică certificatul și AuthorizationPolicy", "orders' Envoy (15006) checks the certificate and AuthorizationPolicy"), B("Cererea decriptată ajunge la aplicația orders pe 127.0.0.1", "The decrypted request reaches the orders app on 127.0.0.1")],
   hint: B("Aplicația nu știe de proxy; primul care o „vede” e kernelul.", "The app doesn't know about the proxy; the kernel is the first to see it.") }
]},

observabilitate: { title: B("Observabilitate", "Observability"), tasks: [
 { type: "term", name: "PromQL", q: B("În consola Prometheus, calculează p99 al duratei cererilor pentru serviciul payments, pe ultimele 5 minute (folosește histogram_quantile).", "In the Prometheus console, compute the p99 request duration for the payments service over the last 5 minutes (use histogram_quantile)."),
   prompt: "promql>", need: ["histogram_quantile", "0.99", "payments", "_bucket"], sol: "histogram_quantile(0.99, sum by (le) (rate(http_server_request_duration_seconds_bucket{service=\"payments\"}[5m])))",
   out: "{}  1.912\n\n# 99% din cereri sub ~1,9 s / 99% of requests under ~1.9 s",
   hint: B("histogram_quantile(0.99, sum by (le) (rate(…_bucket{service=\"payments\"}[5m])))", "histogram_quantile(0.99, sum by (le) (rate(…_bucket{service=\"payments\"}[5m])))"), why: B("Funcția are nevoie de seria _bucket și de gruparea după „le”.", "The function needs the _bucket series and grouping by \"le\".") },
 { type: "input", name: B("Bugetul de erori", "The error budget"), q: B("SLO-ul de disponibilitate e 99,9% pe 30 de zile. Câte minute de indisponibilitate îți permite bugetul de erori?", "The availability SLO is 99.9% over 30 days. How many minutes of downtime does the error budget allow?"),
   ans: ["43.2", "43,2", "43", "43.2 min", "43,2 minute", "43.2 minutes"], show: "43.2", hint: B("30 zile × 24 h × 60 min × 0,1%.", "30 days × 24 h × 60 min × 0.1%."), why: B("43 200 min × 0,001 = 43,2 minute pe lună.", "43,200 min × 0.001 = 43.2 minutes a month.") },
 { type: "order", name: B("Investigația", "The investigation"), q: B("Ordonează pașii investigației unei alerte de latență.", "Order the steps of investigating a latency alert."),
   items: [B("Alerta pe SLO pornește și ajunge la echipa de gardă", "The SLO alert fires and reaches on-call"), B("Dashboard-ul cu metrici arată ce serviciu e lent și de când", "The metrics dashboard shows which service is slow and since when"), B("Un exemplar duce la un trace lent", "An exemplar leads to a slow trace"), B("Waterfall-ul arată span-ul care durează", "The waterfall shows the span that takes the time"), B("Log-urile filtrate după trace_id arată eroarea exactă", "Logs filtered by trace_id show the exact error")],
   hint: B("Metrici → trace → log-uri: ce, unde, de ce.", "Metrics → trace → logs: what, where, why.") }
]},

tomcat: { title: "Tomcat", tasks: [
 { type: "term", name: B("Răspunde Tomcat?", "Is Tomcat answering?"), q: B("De pe server, cere doar antetele răspunsului de la Tomcat, pe portul 8080, cu curl.", "From the server, request only the response headers from Tomcat on port 8080, with curl."),
   prompt: "app@srv:~$", need: ["curl", ["-i", "--head"], "8080"], sol: "curl -I http://localhost:8080/",
   out: "HTTP/1.1 200\nContent-Type: text/html;charset=UTF-8\nContent-Length: 1532\nDate: Thu, 12 Nov 2026 09:41:07 GMT\nKeep-Alive: timeout=20\nConnection: keep-alive",
   hint: B("curl -I cere doar antetele (metoda HEAD).", "curl -I asks for headers only (the HEAD method)."), why: B("Dacă pe 8080 merge și prin nginx nu, problema e la proxy, nu la Tomcat.", "If 8080 works but nginx doesn't, the problem is the proxy, not Tomcat.") },
 { type: "input", name: B("Coada", "The queue"), q: B("Connector-ul are maxThreads=200 și acceptCount=100. Toate cele 200 de fire sunt ocupate. Câte conexiuni noi mai pot aștepta în coadă înainte să fie refuzate?", "The Connector has maxThreads=200 and acceptCount=100. All 200 threads are busy. How many new connections can still wait in the queue before being refused?"),
   ans: ["100"], hint: B("Care setare e lungimea cozii?", "Which setting is the queue length?"), why: B("acceptCount e coada de conexiuni când nu mai e niciun fir liber.", "acceptCount is the connection queue when no thread is free.") },
 { type: "order", name: B("Viața cererii", "The request's life"), q: B("Ordonează drumul unei cereri prin Tomcat.", "Order a request's path through Tomcat."),
   items: [B("nginx primește cererea și o trimite la Tomcat", "nginx receives the request and forwards it to Tomcat"), B("Connector-ul acceptă conexiunea", "The Connector accepts the connection"), B("Un fir din thread pool preia cererea", "A thread from the pool takes the request"), B("Engine → Host → Context aleg aplicația", "Engine → Host → Context pick the application"), B("Filtrele rulează, apoi servlet-ul", "Filters run, then the servlet"), B("Servlet-ul ia o conexiune din pool-ul de baze de date", "The servlet borrows a connection from the database pool")],
   hint: B("Din afară spre interior: proxy, conexiune, fir, aplicație, cod, bază de date.", "From outside in: proxy, connection, thread, app, code, database.") }
]},

microservicii: { title: B("Microservicii", "Microservices"), tasks: [
 { type: "term", name: B("Ce poduri merg?", "Which pods are up?"), q: B("Afișează podurile din namespace-ul shop.", "List the pods in the shop namespace."),
   prompt: "$", need: ["kubectl", "get", "pod", "shop"], sol: "kubectl get pods -n shop",
   out: "NAME                        READY   STATUS             RESTARTS   AGE\ngateway-6b7c9d8f5-2kq7x     1/1     Running            0          3d\norders-7f8d6c5b4-x9z2m      1/1     Running            0          3d\npayments-5d4c3b2a1-p7q8r    0/1     CrashLoopBackOff   14         42m\nkafka-0                     1/1     Running            0          9d",
   hint: B("kubectl get pods -n <namespace>", "kubectl get pods -n <namespace>"), why: B("payments repornește în buclă: comenzile se adună în Kafka și sunt procesate când revine.", "payments is crash-looping: orders pile up in Kafka and get processed when it's back.") },
 { type: "input", name: B("Codul de eroare", "The error code"), q: B("Gateway-ul are timeout 2 s spre orders, dar orders răspunde în 3 s. Ce cod HTTP primește clientul de la gateway?", "The gateway has a 2 s timeout to orders, but orders answers in 3 s. Which HTTP status does the client get from the gateway?"),
   ans: ["504", "504 gateway timeout"], show: "504", hint: B("E un cod 5xx care înseamnă „gateway-ul n-a primit răspuns la timp”.", "It's a 5xx code meaning \"the gateway didn't get an answer in time\"."), why: B("504 Gateway Timeout; 502 ar fi un răspuns invalid sau o conexiune refuzată.", "504 Gateway Timeout; 502 would be an invalid response or a refused connection.") },
 { type: "order", name: B("O comandă", "An order"), q: B("Ordonează pașii unei comenzi cu evenimente (outbox + Kafka).", "Order the steps of an event-driven order (outbox + Kafka)."),
   items: [B("Gateway-ul validează JWT-ul și trimite cererea la orders", "The gateway validates the JWT and forwards to orders"), B("orders salvează comanda și evenimentul în outbox, în aceeași tranzacție", "orders saves the order and the event in the outbox, in the same transaction"), B("Evenimentul din outbox e publicat în Kafka", "The outbox event is published to Kafka"), B("payments consumă evenimentul și încasează plata", "payments consumes the event and charges the payment"), B("payments publică „plată reușită”, iar orders actualizează statusul", "payments publishes \"payment succeeded\", and orders updates the status")],
   hint: B("Outbox-ul garantează că evenimentul pleacă doar dacă s-a salvat comanda.", "The outbox guarantees the event leaves only if the order was saved.") }
]},

"monolit-cpp": { title: B("Monolitul C++", "The C++ monolith"), tasks: [
 { type: "term", name: B("Verifică nginx", "Check nginx"), q: B("Ai schimbat configurația upstream. Verifică sintaxa configurației nginx înainte de reload.", "You changed the upstream config. Test the nginx configuration syntax before reloading."),
   prompt: "root@lb-1:~#", need: ["nginx", "-t"], sol: "nginx -t",
   out: "nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful",
   hint: B("Opțiunea de test a lui nginx e o singură literă.", "nginx's test option is a single letter."), why: B("Abia apoi: nginx -s reload, fără să pice conexiunile existente.", "Only then: nginx -s reload, without dropping existing connections.") },
 { type: "input", name: B("Capacitatea pool-ului", "Pool capacity"), q: B("Pool-ul OCI are 20 de conexiuni, iar fiecare cerere ține o conexiune 50 ms. Câte cereri pe secundă poate servi baza de date, maxim?", "The OCI pool has 20 connections, and each request holds one for 50 ms. At most how many requests per second can the database serve?"),
   ans: ["400"], hint: B("O conexiune servește 1000 / 50 cereri pe secundă.", "One connection serves 1000 / 50 requests per second."), why: B("20 × 20 = 400 cereri/s; peste asta, firele așteaptă după conexiuni.", "20 × 20 = 400 req/s; beyond that, threads wait for connections.") },
 { type: "order", name: B("Cererea SOAP", "The SOAP request"), q: B("Ordonează drumul unei cereri SOAP prin sistem.", "Order a SOAP request's path through the system."),
   items: [B("Clientul trimite POST cu plicul SOAP", "The client sends a POST with the SOAP envelope"), B("nginx alege un server din upstream", "nginx picks a server from the upstream"), B("Un fir de lucru din monolit preia cererea", "A worker thread in the monolith takes the request"), B("Plicul XML e parsat și operația e trimisă modulului potrivit", "The XML envelope is parsed and the operation dispatched to the right module"), B("Modulul ia o conexiune din pool-ul OCI și interoghează Oracle", "The module takes an OCI pool connection and queries Oracle"), B("Răspunsul SOAP se întoarce prin nginx la client", "The SOAP response returns through nginx to the client")],
   hint: B("Din afară spre bază de date și înapoi.", "From outside to the database and back.") }
]}
};
})();
