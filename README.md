# Drumul unui cadru Ethernet · Ethernet Frame Journey

**🇷🇴 Română** · [🇬🇧 English](#english)

O aplicație web interactivă care arată, pas cu pas, cum ajunge un mesaj de la **Host A** la **Host B** printr-o rețea reală: switch → router → router → switch.

**▶ Deschide aplicația:** https://tedimihailescu.github.io/Ethernet-frame-learning-app/

## Ce conține

- **Diagramă animată** a rețelei (2 rețele locale, 2 routere, 3 calculatoare), cu butoane Înapoi / Următorul / Redă / De la capăt și tastele ← →.
- **18 pași explicați**: încapsularea pe straturi, ARP, cum învață și trimite un switch, cum alege drumul un router (TTL, tabela de rutare, cadru nou), inundarea pe un switch și decapsularea pe B.
- **Cadrul „live”**: fiecare câmp (MAC, EtherType, IP, TTL, porturi, date, FCS) e marcat când apare, se schimbă sau dispare.
- **Jurnalul legăturilor**: aceleași IP-uri, MAC-uri diferite pe fiecare hop.
- **„Află mai mult”** la fiecare pas și **comenzi de încercat** pe Windows (`ipconfig`, `arp -a`, `tracert`…).
- **Anatomia cadrului** octet cu octet, **switch vs. router**, **dicționar** cu 22 de termeni și un **test** cu 7 întrebări.
- Română și engleză, temă luminoasă și întunecată, funcționează pe telefon.

## Cum o rulezi local

Nu are nevoie de instalări: descarcă `index.html` și deschide-l în browser.

---

## English

An interactive web app that shows, step by step, how a message travels from **Host A** to **Host B** across a real network: switch → router → router → switch.

**▶ Open the app:** https://tedimihailescu.github.io/Ethernet-frame-learning-app/

### What's inside

- **Animated network diagram** (2 LANs, 2 routers, 3 hosts) with Back / Next / Play / Reset and the ← → keys.
- **18 explained steps**: layer-by-layer encapsulation, ARP, switch learning and forwarding, router routing (TTL, routing table, new frame), switch flooding and decapsulation on B.
- **Live frame view**: every field (MAC, EtherType, IP, TTL, ports, payload, FCS) is marked when it's added, changed or removed.
- **Per-link log**: same IPs, different MACs on every hop.
- **"Learn more"** on each step and **commands to try** on Windows (`ipconfig`, `arp -a`, `tracert`…).
- **Frame anatomy** byte by byte, **switch vs. router**, a **glossary** of 22 terms and a 7-question **quiz**.
- Romanian and English, light and dark theme, works on phones.

### Run it locally

No install needed: download `index.html` and open it in a browser.

---

Single self-contained HTML file: no build step, no dependencies (fonts load from Google Fonts, with system-font fallbacks).
MAC and IP addresses are made up for teaching purposes.
