/* Shared lesson engine.
   A lesson page defines window.LESSON (diagram, steps, tables, glossary, quiz) and then loads this file.
   The engine builds the page, animates the diagram and highlights what changes in the packet at each step. */
(function(){
"use strict";
const LS=window.LESSON;
if(LS.quizMore)LS.quiz=LS.quiz.concat(LS.quizMore);
const glossKey=t=>typeof t==="object"&&t?t.en:t;
const $=s=>document.querySelector(s);
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let lang=store.get("cadru-lang")==="en"?"en":"ro";
const T=v=>(v&&typeof v==="object"&&!Array.isArray(v))?v[lang]:v;

const BASE={
  brand:{ro:"Rețea pas cu pas",en:"Network step by step"},
  navHome:{ro:"← Lecții",en:"← Lessons"},navSim:{ro:"Simulare",en:"Simulation"},navRef:{ro:"Referință",en:"Reference"},navGloss:{ro:"Dicționar",en:"Glossary"},navQuiz:{ro:"Test",en:"Quiz"},
  goalsT:{ro:"Ce vei învăța",en:"What you'll learn"},
  reset:{ro:"⟲ De la capăt",en:"⟲ Reset"},back:{ro:"← Înapoi",en:"← Back"},next:{ro:"Următorul →",en:"Next →"},
  play:{ro:"▶ Redă",en:"▶ Play"},pause:{ro:"❚❚ Pauză",en:"❚❚ Pause"},
  step:{ro:"Pasul",en:"Step"},of:{ro:"din",en:"of"},
  frameT:{ro:"Pachetul (live)",en:"The packet (live)"},
  noFrame:{ro:"Încă nu circulă niciun mesaj.",en:"No message is travelling yet."},
  sumFrame:{ro:"Vezi jurnalul de mai jos pentru comparația completă.",en:"See the log below for the full comparison."},
  nochange:{ro:"Nimic nu s-a schimbat la acest pas.",en:"Nothing changed in this step."},
  lgNew:{ro:"nou",en:"new"},lgChg:{ro:"schimbat",en:"changed"},lgRem:{ro:"eliminat",en:"removed"},
  tables:{ro:"Tabele folosite la acest pas",en:"Tables used in this step"},empty:{ro:"(goală)",en:"(empty)"},
  logEmpty:{ro:"Se completează pe măsură ce avansezi.",en:"Fills in as you go."},
  stackT:{ro:"Straturile pe {d}",en:"Layers on {d}"},
  down:{ro:"↓ încapsulare",en:"↓ encapsulation"},up:{ro:"↑ decapsulare",en:"↑ decapsulation"},updown:{ro:"↑↓ urcă și coboară",en:"↑↓ up and back down"},
  notUsed:{ro:"nefolosit",en:"not used"},
  quizT:{ro:"Verifică-ți cunoștințele",en:"Check your understanding"},score:{ro:"Scor",en:"Score"},retry:{ro:"Încearcă din nou",en:"Try again"},
  right:{ro:"Corect!",en:"Correct!"},wrong:{ro:"Nu chiar.",en:"Not quite."},
  more:{ro:"Află mai mult",en:"Learn more"},tryT:{ro:"Încearcă singur",en:"Try it yourself"},copy:{ro:"Copiază",en:"Copy"},copied:{ro:"Copiat ✓",en:"Copied ✓"},
  glossT:{ro:"Dicționar de termeni",en:"Glossary"},glossLead:{ro:"Ce înseamnă abrevierile și cuvintele tehnice din lecție.",en:"What the abbreviations and technical words in this lesson mean."},
  glossLink:{ro:"Nu știi un termen? Vezi dicționarul ↓",en:"Unfamiliar term? See the glossary ↓"},
  glossEyebrow:{ro:"Dicționar",en:"Glossary"},quizEyebrow:{ro:"Test final",en:"Final quiz"},refEyebrow:{ro:"Referință",en:"Reference"},
  src:{ro:"Codul sursă pe GitHub ↗",en:"Source code on GitHub ↗"},
  theme:{ro:"Comută tema luminoasă / întunecată",en:"Toggle light / dark theme"},
  lgRing:{ro:"dispozitivul activ",en:"active device"}
};
const UI=Object.assign({},BASE,LS.ui||{});
const S=LS.steps,N=S.length;

/* ---------- page skeleton ---------- */
document.getElementById("app").innerHTML=`
<header class="topbar" id="top"><div class="topbar-in">
  <a class="brand" href="../index.html"><svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><rect x="1" y="1" width="30" height="30" rx="8" fill="var(--accent)"/><path d="M7 16h18M19 11l6 5-6 5" fill="none" stroke="var(--accent-text)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="16" r="2.6" fill="var(--accent-text)"/></svg><span data-t="brand"></span></a>
  <nav class="nav" aria-label="Secțiuni / Sections"><a href="../index.html" data-t="navHome"></a><a href="#sim" data-t="navSim"></a><a href="#ref" data-t="navRef"></a><a href="#gloss" data-t="navGloss"></a><a href="#quiz" data-t="navQuiz"></a></nav>
  <div class="tools"><div class="seg" role="group" aria-label="Limba / Language"><button type="button" data-lang="ro">RO</button><button type="button" data-lang="en">EN</button></div><button type="button" class="icon-btn" id="theme">◐</button></div>
</div></header>
<section class="hero"><div class="hero-in">
  <div class="hero-text"><p class="eyebrow" id="h-eyebrow"></p><h1 id="t-title"></h1><p class="sub" id="t-sub"></p><ul class="meta" id="meta"></ul></div>
  <div class="goals"><h2 data-t="goalsT"></h2><ul id="goals"></ul></div>
</div></section>
<div class="wrap" id="sim">
  <section class="card diagram"><svg id="net" role="img" aria-labelledby="t-title"></svg><div class="dlegend" id="dlegend"></div></section>
  <section class="card controls"><div class="btns"><button type="button" class="btn" id="b-reset"></button><button type="button" class="btn" id="b-back"></button><button type="button" class="btn" id="b-play"></button><button type="button" class="btn primary" id="b-next"></button></div>
    <div class="progress"><div class="stepno" id="stepno" aria-live="polite"></div><div class="dots" id="dots"></div></div></section>
  <div class="main"><div class="col"><section class="card" id="exp" aria-live="polite"></section></div>
    <div class="col"><section class="card" id="frame"></section><section class="card" id="tables" hidden></section></div></div>
  <section class="card full" id="log"></section>
</div>
<div class="wrap ref">
  <div class="sec-head" id="ref"><p class="eyebrow" data-t="refEyebrow"></p><h2 data-t="refT"></h2><p class="lead" data-t="refLead"></p></div>
  <div id="refbody"></div>
  <div class="sec-head"><p class="eyebrow" data-t="glossEyebrow"></p></div><section class="card" id="gloss"></section>
  <div class="sec-head"><p class="eyebrow" data-t="quizEyebrow"></p></div><section class="card" id="quiz"></section>
</div>
<footer class="foot"><div class="foot-in"><p id="foot"></p><p><a href="https://github.com/tedimihailescu/Ethernet-frame-learning-app" data-t="src"></a></p></div></footer>`;

/* ---------- diagram ---------- */
const TYPE={host:[28,44],router:[28,44],switch:[33,47],server:[28,44],globe:[28,44],pod:[28,44],svc:[35,46],user:[28,44],box:[34,48],db:[28,44],queue:[34,46]};
const ty=t=>TYPE[t]||[28,44];
function icon(t,x,y,virt){
  const v=virt?" virt":"";
  switch(t){
  case "host":return `<rect class="dev" x="${x-20}" y="${y-17}" width="40" height="27" rx="3"/><rect class="dev-fill" x="${x-4}" y="${y+10}" width="8" height="5"/><rect class="dev-fill" x="${x-12}" y="${y+15}" width="24" height="3" rx="1.5"/>`;
  case "switch":return `<rect class="dev" x="${x-27}" y="${y-13}" width="54" height="26" rx="5"/><path class="dev-ink" d="M${x-15} ${y-4}h26m-5 -4l5 4l-5 4M${x+15} ${y+5}h-26m5 -4l-5 4l5 4"/>`;
  case "router":return `<circle class="dev" cx="${x}" cy="${y}" r="21"/><path class="dev-ink" d="M${x-12} ${y}h24M${x} ${y-12}v24M${x+8} ${y-4}l4 4l-4 4M${x-8} ${y-4}l-4 4l4 4M${x-4} ${y-8}l4 -4l4 4M${x-4} ${y+8}l4 4l4 -4"/>`;
  case "server":return `<rect class="dev" x="${x-17}" y="${y-21}" width="34" height="42" rx="4"/><path class="dev-ink" d="M${x-17} ${y-7}h34M${x-17} ${y+7}h34"/><circle class="dev-fill" cx="${x+9}" cy="${y-14}" r="2"/><circle class="dev-fill" cx="${x+9}" cy="${y}" r="2"/><circle class="dev-fill" cx="${x+9}" cy="${y+14}" r="2"/>`;
  case "globe":return `<circle class="dev" cx="${x}" cy="${y}" r="21"/><path class="dev-ink" d="M${x-21} ${y}h42M${x} ${y-21}c-11 11-11 31 0 42M${x} ${y-21}c11 11 11 31 0 42M${x-18} ${y-10}h36M${x-18} ${y+10}h36"/>`;
  case "pod":{const p=[];for(let k=0;k<6;k++){const a=Math.PI/180*(60*k-30);p.push((x+22*Math.cos(a)).toFixed(1)+","+(y+22*Math.sin(a)).toFixed(1))}
    return `<polygon class="dev${v}" points="${p.join(" ")}"/><path class="dev-ink" d="M${x} ${y-9}l9 5v10l-9 5l-9 -5v-10z M${x-9} ${y-4}l9 5l9 -5M${x} ${y+1}v10"/>`}
  case "svc":return `<rect class="dev virt" x="${x-31}" y="${y-15}" width="62" height="30" rx="15"/><path class="dev-ink" d="M${x-14} ${y}h28M${x+8} ${y-5}l6 5l-6 5"/><circle class="dev-fill" cx="${x-18}" cy="${y}" r="3"/>`;
  case "box":return `<rect class="dev${v}" x="${x-30}" y="${y-17}" width="60" height="34" rx="6"/><path class="dev-ink" d="M${x-20} ${y-6}h28M${x-20} ${y+1}h40M${x-20} ${y+8}h18"/>`;
  case "db":return `<path class="dev" d="M${x-17} ${y-14}v28c0 5 34 5 34 0v-28"/><ellipse class="dev" cx="${x}" cy="${y-14}" rx="17" ry="5"/><path class="dev-ink" d="M${x-17} ${y-3}c0 5 34 5 34 0M${x-17} ${y+7}c0 5 34 5 34 0"/>`;
  case "queue":return `<rect class="dev" x="${x-30}" y="${y-14}" width="60" height="28" rx="4"/><path class="dev-ink" d="M${x-18} ${y-14}v28M${x-6} ${y-14}v28M${x+6} ${y-14}v28M${x+18} ${y-14}v28"/>`;
  case "user":return `<circle class="dev" cx="${x}" cy="${y-9}" r="8"/><path class="dev" d="M${x-15} ${y+17}c0-12 6-17 15-17s15 5 15 17z"/>`;
  }
  return `<circle class="dev" cx="${x}" cy="${y}" r="20"/>`;
}
const mqNarrow=matchMedia("(max-width: 640px)"),mqReduce=matchMedia("(prefers-reduced-motion: reduce)");
const svg=$("#net"),SVGNS="http://www.w3.org/2000/svg";let L=null;
function buildDiagram(){
  L=LS.layouts[mqNarrow.matches?"narrow":"wide"];
  svg.setAttribute("viewBox",L.vb.join(" "));svg.setAttribute("class",mqNarrow.matches?"narrow":"");
  const n=L.n,narrow=mqNarrow.matches;let h="";
  (L.zones||[]).forEach(z=>{const c=z.cls?" "+z.cls:"";h+=`<rect class="zone${c}" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="12"/><text class="zone-lbl${c}" x="${z.x+10}" y="${z.top?z.y+18:z.y+z.h-9}">${T(z.l)}</text>`});
  (L.texts||[]).forEach(t=>{h+=`<text class="zone-lbl" x="${t.x}" y="${t.y}" text-anchor="${t.a||"middle"}">${T(t.t)}</text>`});
  LS.links.forEach(([a,b,c])=>{if(!n[a]||!n[b]||(L.hideLinks||[]).includes(a+"-"+b))return;h+=`<line class="link${c?" "+c:""}" data-l="${a}-${b}" x1="${n[a][0]}" y1="${n[a][1]}" x2="${n[b][0]}" y2="${n[b][1]}"/>`});
  (LS.ports||[]).forEach(([sw,o,p])=>{const [x1,y1]=n[sw],[x2,y2]=n[o];const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);const d=narrow?40:44;
    h+=`<text class="port" x="${x1+dx/len*d+(dy===0?0:9)}" y="${y1+dy/len*d+(dy===0?-7:4)}" text-anchor="middle">${p}</text>`});
  Object.entries(LS.nodes).forEach(([id,nd])=>{if(!n[id])return;const [x,y]=n[id];const [ring,lo]=ty(nd.type);
    h+=`<g class="node" id="n-${id}"><circle class="ring" cx="${x}" cy="${y}" r="${ring}"/>${icon(nd.type,x,y,nd.virt)}`;
    const lh=narrow?12:14,side=(L.side||{})[id]||nd.side;
    if(side){const tx=side==="left"?x-ring-6:x+ring+6,an=side==="left"?"end":"start";h+=`<text class="nm" x="${tx}" y="${y-4}" text-anchor="${an}">${T(nd.name)}</text>`;(nd.lines||[]).forEach((l,i)=>{h+=`<text class="lbl" x="${tx}" y="${y-4+lh*(i+1)}" text-anchor="${an}">${T(l)}</text>`})}
    else{const yy=y+lo;h+=`<text class="nm" x="${x}" y="${yy}" text-anchor="middle">${T(nd.name)}</text>`;(nd.lines||[]).forEach((l,i)=>{h+=`<text class="lbl" x="${x}" y="${yy+lh*(i+1)}" text-anchor="middle">${T(l)}</text>`})}
    h+=`</g>`});
  h+=`<g id="marks"></g><g id="tokens"></g>`;svg.innerHTML=h;
}
const tokPos=id=>{const [x,y]=L.n[id];return [x,y-ty(LS.nodes[id].type)[0]-6]};
function tokenEl(f){const [lbl,cls]=LS.pdu(f).tok;const g=document.createElementNS(SVGNS,"g");g.setAttribute("class","token "+cls);
  const w=Math.max(42,T(lbl).length*7+14);g.innerHTML=`<rect x="${-w/2}" y="-10" width="${w}" height="20" rx="5"/><text x="0" y="1">${T(lbl)}</text>`;return g}
const place=(el,[x,y])=>el.setAttribute("transform",`translate(${x.toFixed(1)},${y.toFixed(1)})`);
function restNodes(st){if(st.rest)return st.rest;if(st.move)return st.move[st.move.length-1].map(s=>s[1]);return [].concat(st.at)}
function setMarks(st){const g=svg.querySelector("#marks");g.innerHTML="";if(!st.marks)return;
  Object.entries(st.marks).forEach(([id,m])=>{const [x,y]=L.n[id];const t=document.createElementNS(SVGNS,"text");
    t.setAttribute("class","mark "+(m.k||"ok"));t.setAttribute("x",x);t.setAttribute("y",y-ty(LS.nodes[id].type)[0]-24);t.setAttribute("text-anchor","middle");t.textContent=T(m.t);g.appendChild(t)})}
let animId=0;
function updateDiagram(animate){
  const st=S[cur],id=++animId;
  svg.querySelectorAll(".node").forEach(e=>e.classList.remove("active"));
  [].concat(st.at||[]).forEach(a=>{const e=svg.querySelector("#n-"+a);if(e)e.classList.add("active")});
  const hot=new Set();(st.move||[]).forEach(ph=>ph.forEach(([a,b])=>{hot.add(a+"-"+b);hot.add(b+"-"+a)}));
  svg.querySelectorAll(".link").forEach(l=>l.classList.toggle("hot",hot.has(l.dataset.l)));
  const layer=svg.querySelector("#tokens");layer.innerHTML="";svg.querySelector("#marks").innerHTML="";
  const finish=()=>{if(id!==animId)return;layer.innerHTML="";if(st.frame)restNodes(st).forEach(n=>{const t=tokenEl(st.frame);place(t,tokPos(n));layer.appendChild(t)});setMarks(st)};
  if(!animate||!st.move||!st.frame||mqReduce.matches){finish();return 0}
  let pi=0;const D=900;
  const phase=()=>{if(id!==animId)return;if(pi>=st.move.length){finish();return}
    const segs=st.move[pi++];layer.innerHTML="";const els=segs.map(()=>{const t=tokenEl(st.frame);layer.appendChild(t);return t});const t0=performance.now();
    const tick=now=>{if(id!==animId)return;const p=Math.min(1,(now-t0)/D),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
      segs.forEach(([a,b],k)=>{const A=tokPos(a),B=tokPos(b);place(els[k],[A[0]+(B[0]-A[0])*e,A[1]+(B[1]-A[1])*e])});
      if(p<1)requestAnimationFrame(tick);else phase()};
    requestAnimationFrame(tick)};
  phase();return st.move.length*D;
}

/* ---------- state ---------- */
let cur=0,playing=false,timer=null,moreOpen=false,answers=new Array((LS.quiz||[]).length).fill(null);
function stateAt(i){
  const s=JSON.parse(JSON.stringify(LS.init||{}));const added={};
  for(let j=0;j<=i;j++)(S[j].fx||[]).forEach(([t,...row])=>{s[t]=s[t]||[];const ix=s[t].findIndex(x=>x[0]===row[0]);
    if(ix>=0)s[t][ix]=row;else{s[t].push(row);if(j===i)(added[t]=added[t]||[]).push(row[0])}});
  return {s,added};
}
function prevFrame(i){if(S[i].cmp!==undefined)return S[S[i].cmp].frame;for(let j=i-1;j>=0;j--){if(S[j].frame&&S[j].kind===S[i].kind)return S[j].frame}return null}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

/* ---------- panels ---------- */
function renderExp(){
  const st=S[cur];let h=`<p class="eyebrow">${T(UI.step)} ${cur+1} / ${N}${st.who?" · "+T(st.who):""}</p><h2>${T(st.title)}</h2>${T(st.body)}`;
  if(st.more)h+=`<details class="more"${moreOpen?" open":""}><summary>${T(UI.more)}</summary><div class="more-body">${T(st.more)}</div></details>`;
  if(st.try)h+=`<div class="try"><h4>${T(LS.tryT||UI.tryT)}</h4>${st.try.map(c=>`<div class="cmdrow"><div class="cmd"><code>${c.cmd}</code><button type="button" class="copy" data-cmd="${c.cmd.replace(/"/g,"&quot;")}">${T(UI.copy)}</button></div><p>${T(c.d)}</p></div>`).join("")}</div>`;
  if(st.stack&&LS.layers){const k=st.stack;
    h+=`<div class="stack"><h3>${T(UI.stackT).replace("{d}",T(k.dev))} · ${T(UI[k.dir])}</h3>`;
    LS.layers.forEach(([n,name,pdu])=>{const off=n>k.max,on=k.on.includes(n);h+=`<div class="layer L${n}${on?" on":""}${off?" off":""}"><span class="n">L${n}</span><span>${T(name)}</span><span class="pdu">${off?T(UI.notUsed):T(pdu)}</span></div>`});
    h+=`</div>`}
  $("#exp").innerHTML=h;
  const dm=$("#exp details.more");if(dm)dm.addEventListener("toggle",()=>{moreOpen=dm.open});
  $("#exp").querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>{stop();$("#"+b.dataset.goto).scrollIntoView({behavior:mqReduce.matches?"auto":"smooth"})});
}
function renderFrame(){
  const st=S[cur],f=st.frame,p=prevFrame(cur);let h=`<h2>${T(LS.frameT||UI.frameT)}`;
  if(!f){h+=`</h2><p class="empty">${T(st.summary?UI.sumFrame:UI.noFrame)}</p>`;$("#frame").innerHTML=h;return}
  h+=`<span class="pdu-badge">${T(LS.pdu(f).badge)}</span></h2>`;
  h+=`<div class="legend"><span><i class="sw" style="background:var(--newbg);border:1px solid var(--newfg)"></i>${T(UI.lgNew)}</span><span><i class="sw" style="background:var(--chgbg);border:1px solid var(--chgfg)"></i>${T(UI.lgChg)}</span><span><i class="sw" style="background:var(--rembg);border:1px solid var(--remfg)"></i>${T(UI.lgRem)}</span></div>`;
  let bar="",groups="",any=false;
  LS.groups.forEach(g=>{
    const ks=g.fields.filter(k=>k in f||(p&&k in p));if(!ks.length)return;
    const present=ks.some(k=>k in f);let touched=false,rows="";
    ks.forEach(k=>{let cls="",tag="",val;
      if(k in f&&!(p&&k in p)){cls="new";tag=T(UI.lgNew)}else if(!(k in f)){cls="rem";tag=T(UI.lgRem)}else if(!same(f[k],p[k])){cls="chg";tag=T(UI.lgChg)}
      if(cls){touched=true;any=true}
      val=cls==="rem"?T(p[k]):cls==="chg"?`<span class="old">${T(p[k])}</span>→ ${T(f[k])}`:T(f[k]);
      rows+=`<div class="f ${cls}"><span class="k">${T(LS.fieldLabels[k])}${tag?`<span class="tag">${tag}</span>`:""}</span><span class="v">${val}</span></div>`});
    bar+=`<div class="c-${g.color}${present?"":" gone"}${touched&&present?" touched":""}" style="flex:${g.grow||2}">${T(g.short)}</div>`;
    groups+=`<div class="group c-${g.color}"><h4>${T(g.name)}</h4>${rows}</div>`});
  h+=`<div class="bar" aria-hidden="true">${bar}</div>`;
  if(!any)h+=`<p class="note">${T(UI.nochange)}</p>`;
  $("#frame").innerHTML=h+groups+`<p><a class="glink" href="#gloss">${T(UI.glossLink)}</a></p>`;
}
function renderTables(){
  const st=S[cur],el=$("#tables");if(!st.tables){el.hidden=true;el.innerHTML="";return}
  const {s,added}=stateAt(cur);let h=`<h2>${T(UI.tables)}</h2>`;
  st.tables.forEach(id=>{const t=LS.tables[id];const rows=t.rows?t.rows(s):(s[id]||[]);const hl=st.hl&&st.hl[id];const hls=[].concat(hl===undefined?[]:hl);
    h+=`<div class="tbl"><h3>${T(t.title)}</h3><div class="scroll"><table><thead><tr>${t.cols.map(c=>`<th>${T(c)}</th>`).join("")}</tr></thead><tbody>`;
    if(!rows.length)h+=`<tr><td colspan="${t.cols.length}" class="empty">${T(UI.empty)}</td></tr>`;
    rows.forEach((r,i)=>{const hit=t.idx?hls.includes(i):hls.includes(r[0]);const add=(added[id]||[]).includes(r[0]);
      h+=`<tr class="${hit?"hit":""}${add?" added":""}">${r.map((c,ci)=>`<td class="${(t.plain||[]).includes(ci)?"":"m"}">${T(c)}</td>`).join("")}</tr>`});
    h+=`</tbody></table></div>`;
    if(st.tnote&&st.tnote[id])h+=`<div class="tnote">${T(st.tnote[id])}</div>`;
    h+=`</div>`});
  el.innerHTML=h;el.hidden=false;
}
function renderLog(){
  const lg=LS.log;let rows="";
  for(let j=0;j<=cur;j++)if(S[j].log){const f=S[j].frame;rows+=`<tr><td><b>${T(S[j].log)}</b></td>${lg.cols.map(c=>`<td class="m ${c.cls||""}">${T(c.v(f))}</td>`).join("")}</tr>`}
  let h=`<h2>${T(lg.title)}</h2><p class="lead">${T(lg.lead)}</p>`;
  h+=rows?`<div class="scroll"><table style="min-width:${lg.minWidth||560}px"><thead><tr><th>${T(lg.first)}</th>${lg.cols.map(c=>`<th>${T(c.h)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`:`<p class="empty">${T(UI.logEmpty)}</p>`;
  $("#log").innerHTML=h;
}
function renderQuiz(){
  const Q=LS.quiz;let h=`<h2>${T(UI.quizT)}</h2>`;
  Q.forEach((q,qi)=>{const a=answers[qi];h+=`<div class="q"><p class="t">${qi+1}. ${T(q.q)}</p><div class="opts">`;
    q.o.forEach((o,oi)=>{let c="";if(a!==null){if(oi===q.a)c="right";else if(oi===a)c="wrong"}h+=`<button type="button" class="opt ${c}" data-q="${qi}" data-o="${oi}" ${a!==null?"disabled":""}>${T(o)}</button>`});
    h+=`</div>`;if(a!==null)h+=`<p class="fb ${a===q.a?"ok":"no"}" role="status"><b>${T(a===q.a?UI.right:UI.wrong)}</b> ${T(q.e)}</p>`;h+=`</div>`});
  const done=answers.filter(x=>x!==null).length,ok=answers.filter((x,i)=>x===Q[i].a).length;
  h+=`<div class="score">${T(UI.score)}: ${ok} / ${Q.length}${done?` <button type="button" class="btn" id="retry">${T(UI.retry)}</button>`:""}</div>`;
  $("#quiz").innerHTML=h;const r=$("#retry");if(r)r.onclick=()=>{answers.fill(null);renderQuiz()};
}
$("#quiz").addEventListener("click",e=>{const b=e.target.closest(".opt");if(!b||b.disabled)return;answers[+b.dataset.q]=+b.dataset.o;renderQuiz();
  if(answers.every(a=>a!==null)){
    const score=answers.filter((x,i)=>x===LS.quiz[i].a).length;
    const lesson=location.pathname.split("/").filter(Boolean).slice(-2)[0]||"lesson";
    window.dispatchEvent(new CustomEvent("quiz:complete",{detail:{lesson,title:(LS.docTitle&&LS.docTitle.ro)||document.title,score,total:LS.quiz.length,answers:answers.slice()}}));
  }});
function renderGloss(){
  let h=`<h2>${T(UI.glossT)}</h2><p class="lead">${T(UI.glossLead)}</p><dl class="gl">`;
  const exLbl=lang==="ro"?"Exemplu":"Example";
  LS.gloss.forEach(([t,full,d])=>{const fl=T(full),ex=(LS.glossEx||{})[glossKey(t)];
    h+=`<div><dt>${T(t)}${fl?`<small>${fl}</small>`:""}</dt><dd>${T(d)}</dd>${ex?`<dd class="ex"><b>${exLbl}:</b> ${T(ex)}</dd>`:""}</div>`});
  $("#gloss").innerHTML=h+`</dl>`;
}
function renderControls(){
  const lab=(id,v)=>{const s=T(v),nx=id==="#b-next",i=nx?s.lastIndexOf(" "):s.indexOf(" ");const ic=nx?s.slice(i+1):s.slice(0,i),tx=nx?s.slice(0,i):s.slice(i+1);
    const b=$(id);b.innerHTML=nx?`<span class="bt">${tx} </span><span aria-hidden="true">${ic}</span>`:`<span aria-hidden="true">${ic}</span><span class="bt"> ${tx}</span>`;b.setAttribute("aria-label",tx);b.title=tx};
  lab("#b-reset",UI.reset);lab("#b-back",UI.back);lab("#b-next",UI.next);lab("#b-play",playing?UI.pause:UI.play);
  $("#b-back").disabled=cur===0;$("#b-next").disabled=cur===N-1;$("#b-reset").disabled=cur===0&&!playing;
  $("#stepno").textContent=`${T(UI.step)} ${cur+1} ${T(UI.of)} ${N}`;
  const d=$("#dots");if(d.children.length!==N)d.innerHTML=S.map((_,i)=>`<button type="button" data-i="${i}"></button>`).join("");
  [...d.children].forEach((b,i)=>{b.className=i===cur?"cur":i<cur?"done":"";b.setAttribute("aria-label",`${T(UI.step)} ${i+1}: ${T(S[i].title)}`);b.setAttribute("aria-current",i===cur?"step":"false")});
}
function renderStatic(){
  document.documentElement.lang=lang;document.title=T(LS.docTitle);
  document.querySelectorAll("[data-t]").forEach(e=>{e.textContent=T(UI[e.dataset.t])});
  $("#h-eyebrow").textContent=T(LS.eyebrow);$("#t-title").textContent=T(LS.title);$("#t-sub").textContent=T(LS.sub);$("#foot").textContent=T(LS.foot);
  $("#goals").innerHTML=LS.goals.map(g=>`<li>${T(g)}</li>`).join("");$("#meta").innerHTML=LS.meta.map(g=>`<li>${T(g)}</li>`).join("");
  $("#dlegend").innerHTML=`<span><i class="lg-ring"></i>${T(UI.lgRing)}</span>`+LS.legend.map(([c,b,t])=>`<span><b class="${c}">${T(b)}</b>${T(t)}</span>`).join("");
  $("#refbody").innerHTML=LS.reference(T,lang);
  $("#theme").setAttribute("aria-label",T(UI.theme));$("#theme").title=T(UI.theme);
  document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lang===lang?"true":"false"));
}
function render(animate){
  renderControls();renderExp();renderFrame();renderTables();renderLog();
  const dur=updateDiagram(animate);
  if(playing){clearTimeout(timer);timer=setTimeout(()=>{if(!playing)return;if(cur<N-1){cur++;render(true)}else stop()},(dur||0)+5600)}
}
function go(i,animate){cur=Math.max(0,Math.min(N-1,i));render(!!animate)}
function stop(){playing=false;clearTimeout(timer);renderControls()}

/* ---------- events ---------- */
$("#b-next").onclick=()=>{if(playing)stop();go(cur+1,true)};
$("#b-back").onclick=()=>{if(playing)stop();go(cur-1,false)};
$("#b-reset").onclick=()=>{stop();go(0,false)};
$("#b-play").onclick=()=>{if(playing){stop();return}playing=true;if(cur===N-1)cur=0;go(cur+(cur===0?0:1),cur!==0)};
$("#dots").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(playing)stop();go(+b.dataset.i,false)};
document.addEventListener("keydown",e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;const t=e.target;if(t&&(t.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(t.tagName)))return;
  if(e.key==="ArrowRight"){e.preventDefault();if(playing)stop();if(cur<N-1)go(cur+1,true)}else if(e.key==="ArrowLeft"){e.preventDefault();if(playing)stop();if(cur>0)go(cur-1,false)}});
document.addEventListener("click",e=>{const b=e.target.closest(".copy");if(!b)return;
  const done=()=>{b.textContent=T(UI.copied);setTimeout(()=>{b.textContent=T(UI.copy)},1600)};
  const fallback=()=>{const c=b.parentElement.querySelector("code");const r=document.createRange();r.selectNodeContents(c);const s=getSelection();s.removeAllRanges();s.addRange(r)};
  try{navigator.clipboard.writeText(b.dataset.cmd).then(done,fallback)}catch(err){fallback()}});
document.querySelectorAll("[data-lang]").forEach(b=>b.onclick=()=>{lang=b.dataset.lang;store.set("cadru-lang",lang);buildDiagram();renderStatic();renderGloss();renderQuiz();render(false)});
const savedTheme=store.get("cadru-theme");if(savedTheme==="light"||savedTheme==="dark")document.documentElement.dataset.theme=savedTheme;
$("#theme").onclick=()=>{const r=document.documentElement,isDark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;const nt=isDark?"light":"dark";r.dataset.theme=nt;store.set("cadru-theme",nt)};
const onLayout=()=>{buildDiagram();updateDiagram(false)};
if(mqNarrow.addEventListener)mqNarrow.addEventListener("change",onLayout);else mqNarrow.addListener(onLayout);

buildDiagram();renderStatic();renderGloss();renderQuiz();render(false);
})();
