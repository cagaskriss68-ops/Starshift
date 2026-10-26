
'use strict';
const cv=document.getElementById('c'),cx=cv.getContext('2d'),$=id=>document.getElementById(id),RND=Math.random;
let W=0,H=0,dpr=1,state='MENU',P=[],G=null,cut=null,WALK=[],SOL=[];
let zw=1;const isDesk=()=>matchMedia('(hover:hover) and (pointer:fine)').matches&&innerWidth>=900;
addEventListener('wheel',e=>{if(typeof state!='undefined'&&(state=='PLAY'||state=='LOBBY'))zw=Math.max(.6,Math.min(1.7,zw*(e.deltaY<0?1.1:.9)))},{passive:true});
document.addEventListener('click',e=>{if(e.target.tagName=='BUTTON')e.target.blur()});
function rsz(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr}addEventListener('resize',rsz);rsz();
const COLS=['#c51111','#132ed1','#117f2d','#ed54ba','#ef7d0e','#f5f557','#3f474e','#d6e0f0','#6b2fbb','#71491e','#38fedc','#50ef39'],NM=['Red','Blue','Green','Pink','Orange','Yellow','Black','White','Purple','Brown','Cyan','Lime'],HATS=['None','Cap','Crown','Headset','Antenna','Flower'],SKINS=['Plain','Stripe','Vest'];
let me={col:1,hat:1,skin:0,role:'random',m:0,w:0};try{Object.assign(me,JSON.parse(localStorage.sfp||'{}'))}catch(e){}
const save=()=>{try{localStorage.sfp=JSON.stringify(me)}catch(e){}};
let ac=null,mute=false;function snd(f,d=.15,t='square'){if(mute)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.value=.07;g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
let tt;function toast(s){const e=$('tst');e.textContent=s;e.style.display='block';clearTimeout(tt);tt=setTimeout(()=>e.style.display='none',1800)}
// ---------- drawing ----------
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function shade(h,f){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const k=f<0?0:255,p=Math.abs(f);return`rgb(${Math.round(r+(k-r)*p)},${Math.round(g+(k-g)*p)},${Math.round(b+(k-b)*p)})`}
function hat(c,h){if(h==1){c.fillStyle='#e03b3b';c.beginPath();c.arc(0,-30,13,Math.PI,0);c.fill();c.stroke();c.fillRect(4,-32,14,4);c.strokeRect(4,-32,14,4)}
if(h==2){c.fillStyle='#f2c230';c.beginPath();c.moveTo(-10,-30);c.lineTo(-10,-42);c.lineTo(-5,-36);c.lineTo(0,-44);c.lineTo(5,-36);c.lineTo(10,-42);c.lineTo(10,-30);c.closePath();c.fill();c.stroke()}
if(h==3){c.save();c.strokeStyle='#222';c.lineWidth=4;c.beginPath();c.arc(0,-16,17,Math.PI*1.05,Math.PI*1.95);c.stroke();c.restore();c.fillStyle='#38c8b8';rr(c,-19,-22,7,12,3);c.fill();c.stroke()}
if(h==4){c.fillStyle='#333';c.fillRect(-1,-42,3,12);c.fillStyle='#e03b3b';c.beginPath();c.arc(0,-44,4,0,7);c.fill();c.stroke()}
if(h==5){c.fillStyle='#ff77b8';for(let i=0;i<5;i++){c.beginPath();c.arc(Math.cos(i*1.256)*5,-35+Math.sin(i*1.256)*5,4,0,7);c.fill()}c.fillStyle='#ffe066';c.beginPath();c.arc(0,-35,3,0,7);c.fill()}}
function crew(c,x,y,o){const col=COLS[o.col],dk=shade(col,-.35),ws=o.ws!=null?o.ws:(o.mv?1:0),ph=o.wk||0,sw=Math.sin(ph)*5*ws,bob=-Math.abs(Math.cos(ph))*2.2*ws,bp=Math.cos(ph)*1.4*ws;
c.save();c.translate(x,y+bob*(o.sc||1));c.scale((o.sc||1)*(o.f||1),o.sc||1);if(o.rot)c.rotate(o.rot);c.globalAlpha=o.a==null?1:o.a;c.lineWidth=3;c.lineJoin='round';c.strokeStyle='#0b0b12';
if(o.clip){c.beginPath();if(o.clip=='top')c.rect(-60,-90,120,86);else c.rect(-60,-4,120,90);c.clip()}
const body=()=>{c.beginPath();c.moveTo(-14,8);c.lineTo(-14,-14);c.quadraticCurveTo(-14,-32,0,-32);c.quadraticCurveTo(14,-32,14,-14);c.lineTo(14,8);if(o.ghost){c.quadraticCurveTo(10,18,6,10);c.quadraticCurveTo(0,22,-6,10);c.quadraticCurveTo(-10,18,-14,8)}c.closePath()};
if(!o.ghost){c.fillStyle=dk;rr(c,-14,4-Math.max(0,sw)*.4,12,13+sw*.5+Math.max(0,sw)*.4,4);c.fill();c.stroke();rr(c,2,4-Math.max(0,-sw)*.4,12,13-sw*.5+Math.max(0,-sw)*.4,4);c.fill();c.stroke();rr(c,-24-bp,-14-bp*.3,12,24+Math.abs(bp)*.4,5);c.fill();c.stroke()}
body();c.fillStyle=col;c.fill();c.stroke();
c.save();body();c.clip();c.fillStyle='rgba(0,0,0,.25)';c.fillRect(-14,-32,9,52);if(o.skin==1){c.fillStyle='#e9eef7';c.fillRect(-14,-6,28,6)}if(o.skin==2){c.fillStyle='#2a2f3a';c.fillRect(-14,-8,28,12)}c.restore();
// ARMS + HANDS (new): swing opposite to each other while walking
c.save();c.lineCap='round';for(const s of[]){const hx=s*20,hy=3+s*sw*.6;
c.strokeStyle='#0b0b12';c.lineWidth=10;c.beginPath();c.moveTo(s*12,-9);c.lineTo(hx,hy);c.stroke();
c.strokeStyle=col;c.lineWidth=5;c.beginPath();c.moveTo(s*12,-9);c.lineTo(hx,hy);c.stroke();
c.lineWidth=3;c.strokeStyle='#0b0b12';c.fillStyle=col;c.beginPath();c.arc(hx,hy,5.5,0,7);c.fill();c.stroke();
c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.arc(hx-s*1.5,hy-2,1.8,0,7);c.fill()}c.restore();
c.fillStyle='#9fd8ee';c.beginPath();c.ellipse(6,-20,10,7,0,0,7);c.fill();c.stroke();c.fillStyle='#fff';c.beginPath();c.ellipse(9,-23,4,2,-.2,0,7);c.fill();
hat(c,o.hat);c.restore()}
function corpse(c,x,y,col,f){crew(c,x,y+4,{col,f,clip:'bottom'});c.save();c.translate(x,y-4);c.fillStyle='#f3efe0';c.strokeStyle='#0b0b12';c.lineWidth=2;rr(c,-3,-12,6,12,3);c.fill();c.stroke();c.beginPath();c.arc(-4,-13,4,0,7);c.arc(4,-13,4,0,7);c.fill();c.stroke();c.restore()}
// ---------- geometry / navigation ----------
// A walkable/solid shape is [x,y,w,h,type,k]: type undefined=rect, 'e'=ellipse, 'o'=octagon (chamfer k), 'c'=rounded rect (radius k)
let ROOMS=[];
const ST=[],VENTS=[],VN=[],NODES=[],EDG=[],ADJ=[],GWALK=[],GSOL=[],LWALK=[],LSOL=[];
const inR=(x,y,r)=>{if(x<r[0]||x>r[0]+r[2]||y<r[1]||y>r[1]+r[3])return false;const t=r[4];if(!t)return true;const w=r[2],h=r[3];
if(t=='e'){const a=(x-r[0]-w/2)/(w/2),b=(y-r[1]-h/2)/(h/2);return a*a+b*b<=1}
const dx=Math.min(x-r[0],r[0]+w-x),dy=Math.min(y-r[1],r[1]+h-y),k=r[5]||0;
if(t=='o')return dx+dy>=k;
if(t=='c'){if(dx>=k||dy>=k)return true;const a=k-dx,b=k-dy;return a*a+b*b<=k*k}
return true};
const can=(x,y)=>{for(const[a,b]of[[-10,-6],[10,-6],[-10,12],[10,12]]){const px=x+a,py=y+b;if(!WALK.some(r=>inR(px,py,r))||SOL.some(r=>inR(px,py,r)))return 0}return 1};
function mvE(e,dx,dy){if(e.dead){e.x=Math.max(0,Math.min(1800,e.x+dx));e.y=Math.max(0,Math.min(1000,e.y+dy));return}for(const[ax,ay]of[[dx,0],[0,dy]]){if(can(e.x+ax,e.y+ay)){e.x+=ax;e.y+=ay}}}
function route(a,b){const pr={[a]:-1},q=[a];for(let i=0;i<q.length;i++){const c=q[i];if(c==b)break;for(const n of ADJ[c])if(!(n in pr)){pr[n]=c;q.push(n)}}const o=[];let c=b;while(c!==undefined&&c!=-1){o.unshift(c);c=pr[c]}return o}
function nearN(x,y){let b=0,d=1e9;NODES.forEach((n,i)=>{const e=(n[0]-x)*(n[0]-x)+(n[1]-y)*(n[1]-y);if(e<d){d=e;b=i}});return b}
// navigation graph is generated from the real collision map (grid of clear points, 8-way links), so bots can never path through walls or props
function buildNav(){NODES.length=0;EDG.length=0;ADJ.length=0;const S=40,idx={};
for(let y=40;y<1020;y+=S)for(let x=40;x<1820;x+=S)if(can(x,y)){idx[x+','+y]=NODES.length;NODES.push([x,y]);ADJ.push([])}
const clr=(a,b)=>{for(let t=.25;t<1;t+=.25)if(!can(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t))return 0;return 1};
NODES.forEach((n,i)=>{for(const[dx,dy]of[[S,0],[0,S],[S,S],[S,-S]]){const j=idx[(n[0]+dx)+','+(n[1]+dy)];if(j!==undefined&&clr(n,NODES[j])){EDG.push([i,j]);ADJ[i].push(j);ADJ[j].push(i)}}})}
function pruneNav(){const st=nearN(SP[0],SP[1]),seen=new Set([st]),q=[st];while(q.length){const c=q.pop();for(const n of ADJ[c])if(!seen.has(n)){seen.add(n);q.push(n)}}const map={},nn=[];NODES.forEach((n,i)=>{if(seen.has(i)){map[i]=nn.length;nn.push(n)}});const ne=EDG.filter(e=>seen.has(e[0])&&seen.has(e[1])).map(e=>[map[e[0]],map[e[1]]]);NODES.length=0;NODES.push(...nn);EDG.length=0;EDG.push(...ne);ADJ.length=0;NODES.forEach(()=>ADJ.push([]));EDG.forEach(([a,b])=>{ADJ[a].push(b);ADJ[b].push(a)})}
function clearLine(a,b){const d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(d/10);for(let i=1;i<n;i++){const t=i/n;if(!can(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t))return 0}return 1}
function roomOf(x,y){const r=ROOMS.find(r=>[r.s,...(r.parts||[])].some(s=>inR(x,y,s)));return r?r.n:'the hallway'}
// ---------- maps ----------
let TH={a:'#98a0aa',b:'#7b838d',w:'#2a303b'},intro=null,EB=[850,185],SP=[840,270],MAPS=[],LOBBY=null;
const rp=(a,b)=>{a.length=0;a.push(...b)};
function loadMap(i){const m=MAPS[i];TH=m.th;EB=m.eb;SP=m.sp;ROOMS=m.rooms.map(r=>({...r,s:[r.x,r.y,r.w,r.h,r.t,r.k]}));
rp(GSOL,[[EB[0]-80,EB[1]-45,160,90],...m.sol]);
rp(GWALK,[...ROOMS.flatMap(r=>[r.s,...(r.parts||[])]),...m.corr]);
rp(ST,m.st.map(s=>[s[0],s[1],0,s[2]]));rp(VENTS,m.vents);rp(VN,m.vn);
WALK=GWALK;SOL=GSOL;buildNav();pruneNav();ST.forEach(s=>{s[2]=nearN(s[0],s[1])})}
function loadLobby(){rp(LWALK,LOBBY.rooms.map(r=>[r.x,r.y,r.w,r.h,r.t,r.k]));rp(LSOL,LOBBY.sol)}
$('mapb').onclick=()=>{me.map=((me.map|0)+1)%MAPS.length;save();$('mapb').textContent='Map: '+MAPS[me.map].n};
function drawMini(){const e=P[0],w=Math.min(150,W*.34),k=w/1800,x0=W-w-10,y0=12;cx.save();cx.globalAlpha=.85;cx.fillStyle='rgba(5,8,16,.7)';cx.fillRect(x0-4,y0-4,w+8,1000*k+8);cx.fillStyle='#8a94a6';cx.beginPath();GWALK.forEach(r=>sp(cx,[x0+r[0]*k,y0+r[1]*k,r[2]*k,r[3]*k,r[4],(r[5]||0)*k],0));cx.fill();cx.fillStyle='#ffd54a';e.tasks.forEach(t=>{if(!t.done)cx.fillRect(x0+ST[t.s][0]*k-2,y0+ST[t.s][1]*k-2,4,4)});if(G.pl>0){cx.fillStyle='#fff';P.forEach(o=>{if(o!==e&&!o.dead&&!o.hid){cx.beginPath();cx.arc(x0+o.x*k,y0+o.y*k,3,0,7);cx.fill()}});cx.fillStyle='#f44';G.body.forEach(b=>cx.fillRect(x0+b.x*k-2,y0+b.y*k-2,5,5))}cx.fillStyle=COLS[e.col];cx.strokeStyle='#fff';cx.lineWidth=1.5;cx.beginPath();cx.arc(x0+e.x*k,y0+e.y*k,3.5,0,7);cx.fill();cx.stroke();cx.restore()}

function drawIntro(){const t=intro.t,im=P[0].imp,cr=im?'#ff3344':'#4cd4ff',u=Math.min(W,H)/110,a=Math.min(1,t*2);
const g=cx.createRadialGradient(W/2,H/2,10,W/2,H/2,Math.max(W,H)*.7);g.addColorStop(0,im?'#4a0a12':'#0b2a44');g.addColorStop(1,'#020305');cx.fillStyle=g;cx.fillRect(0,0,W,H);
cx.save();cx.globalAlpha=a;cx.translate(W/2,H*.22);cx.scale(.6+a*.4,.6+a*.4);cx.textAlign='center';cx.font='900 '+Math.min(60,W/7)+'px system-ui';cx.shadowColor=cr;cx.shadowBlur=30;cx.fillStyle=cr;cx.fillText(im?'IMPOSTOR':'CREWMATE',0,0);cx.restore();
cx.globalAlpha=a;cx.textAlign='center';cx.font='700 16px system-ui';cx.fillStyle='#fff';cx.fillText(im?'Eliminate the crew. Do not get caught.':'Finish tasks. Find the Impostor.',W/2,H*.3);
const tm=im?P.filter(e=>e.imp):[P[0],...P.filter(e=>e.id&&!e.imp).slice(0,4)];tm.forEach((e,i)=>{const spc=Math.min(u*30,W*.9/tm.length),ks=Math.min(1,spc/(u*40)),x=W/2+(i-(tm.length-1)/2)*spc,y=H*.6+(i?u*8*ks:0);crew(cx,x,y,{col:e.col,hat:e.hat,skin:e.skin,sc:(i?.85:1)*u*ks,mv:1,wk:t*10});cx.font='700 12px system-ui';cx.fillText(e.name,x,y+u*22*ks)});cx.globalAlpha=1}
// ---------- game flow ----------
const keys={},J={x:0,y:0,id:null};let mn={st:[],fl:[]};
for(let i=0;i<140;i++)mn.st.push({x:RND(),y:RND(),z:.2+RND()*.8,p:RND()*6});
for(let i=0;i<6;i++)mn.fl.push({x:RND(),y:RND(),vx:(RND()-.5)*.04,vy:(RND()-.5)*.03,r:RND()*6,vr:(RND()-.5)*.8,col:i*2%12,hat:i%6,s:2+RND()*1.5});
function setState(s){state=s;tkOpen=false;clearInterval(tkIv);$('tk').classList.remove('on');$('mn').classList.toggle('on',s=='MENU');$('lb').classList.toggle('on',s=='LOBBY');$('hd').classList.toggle('on',s=='LOBBY'||s=='PLAY');$('mt').classList.toggle('on',s=='MEET');$('en').classList.toggle('on',s=='END')}
const mk=(id,c,h,s)=>({id,name:id?NM[c]:'You',col:c,hat:h,skin:s,x:0,y:0,f:1,wk:0,mv:0,dead:0,imp:0,nd:0,wp:[],st:'idle',tm:0,cur:-1,cd:0,tasks:[],vent:-1,hid:0,wit:-1,tg:null,kt:0,sn:0});
const ROLES={random:'Role: Random',imp:'Role: Impostor',crew:'Role: Crewmate'};
function enterLobby(){setState('LOBBY');WALK=LWALK;SOL=LSOL;buildFloor();G=null;cut=null;const o=[...Array(12).keys()].filter(i=>i!=me.col).sort(()=>RND()-.5);P=[mk(0,me.col,me.hat,me.skin)];P[0].x=500;P[0].y=330;
for(let i=1;i<=(NET?0:8);i++){const b=mk(i,o[i],RND()<.5?(RND()*6|0):0,RND()*3|0);b.x=200+RND()*600;b.y=250+RND()*250;if(!can(b.x,b.y)){b.x=500;b.y=400}P.push(b)}
$('role').textContent=ROLES[me.role];$('mapb').textContent='Map: '+MAPS[me.map|0].n;$('gh').textContent='';if(NET)netSync()}
function startGame(){loadMap(me.map|0);WALK=GWALK;SOL=GSOL;buildFloor();const n=P.length-1;P.forEach(e=>{e.x=SP[0]+RND()*80;e.y=SP[1]+RND()*30;e.nd=0;e.wp=[];e.st='idle';e.dead=0;e.imp=0;e.tasks=[];e.hid=0;e.vent=-1;e.wit=-1;e.cur=-1});
let iis=NET?NET.ii:[me.role=='imp'?0:me.role=='crew'?1+(RND()*n|0):(RND()<1/(n+1)?0:1+(RND()*n|0))];if(!NET){const want=Math.min(me.ni||1,maxImp()),pool=[...Array(P.length).keys()].filter(i=>i!=iis[0]&&!(me.role=='crew'&&i==0)).sort(()=>RND()-.5);while(iis.length<want&&pool.length)iis.push(pool.pop())}iis.forEach(i=>{if(P[i]){P[i].imp=1;P[i].cd=12}});
G={body:[],done:0,total:0,over:0,mt:null,t:0,fx:[],sh:0,em:0,an:null,at:25+RND()*20,pl:0};P.forEach(e=>{e.tasks=[...Array(ST.length).keys()].sort(()=>RND()-.5).slice(0,4).map(s=>({s,done:0}));if(!e.imp)G.total+=4});
{const e0=P[0];e0.rl=null;e0.used=0;G.dec=null;G.pu=null;if(!NET){const o=e0.imp?IRL:CRL,q=e0.imp?me.ir:me.cr;e0.rl=q=='random'?o[RND()*o.length|0]:o.includes(q)?q:null}P.forEach(p=>{p.kn=0;p.kc=0;p.sus=0;p.kw=KW[RND()*5|0]});if(me.kw&&me.kw!='random')e0.kw=me.kw;G.vit=0;G.trk=null;G.sc=25;G.kl=[];G.mc=0;G.why='';G.sab=null;G.pus=[];if(!NET)P.forEach((p,i)=>{p.used=0;if(i){p.rl=null;if(RND()<.5)p.rl=p.imp?(RND()<.5?'viper':'phan'):(RND()<.5?'pulse':'runner')}});pbS=''}setState('INTRO');intro={t:0};snd(300,.4)}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function los(a,b){for(let i=1;i<8;i++){const t=i/8,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;if(!WALK.some(r=>inR(x,y,r)))return 0}return 1}
function burst(x,y,col){for(let i=0;i<24;i++){const a=RND()*6.28,s=60+RND()*180;G.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,l:.8+RND()*.5,c:i%3?COLS[col]:'#ff3b5c',r:2+RND()*3})}G.fx.push({x,y,ring:1,l:.5});if(dist(P[0],{x,y})<400)G.sh=.35}
function doKill(k,v){(G.kl=G.kl||[]).push({c:k.col,w:k.kw||'knife'});k.kc=(k.kc||0)+1;v.dead=1;v.st='idle';v.hid=0;v.vent=-1;G.body.push({x:v.x,y:v.y,col:v.col,f:v.f,rep:0,t:G.t,w:k.kw});burst(v.x,v.y,v.col);k.x=v.x;k.y=v.y;k.cd=15;k.nd=nearN(k.x,k.y);k.wp=[];k.st='idle';{const vi=VENTS.findIndex(w=>Math.hypot(w[0]-k.x,w[1]-k.y)<110);if(k.id&&vi>=0&&RND()<.6){const nv=VENTS[(vi+1+(RND()*(VENTS.length-1)|0))%VENTS.length];k.x=nv[0];k.y=nv[1];k.hid=1;k.vt=2.5}}for(const o of P)if(o!==k&&o!==v&&!o.dead&&!o.imp&&dist(o,v)<230&&los(o,v))o.wit=k.id;for(const o of P)if(o!==v&&!o.dead&&dist(o,v)<260)o.sus=G.t;chk()}
function startKill(k,v){if(v.dead||G.over)return;const pz=!v.imp&&[G.pu,...(G.pus||[])].find(u=>u&&dist(v,u)<130);if(pz){k.cd=12;G.fx.push({x:v.x,y:v.y,ring:1,l:.5,c2:'80,220,255'});k.wp=[];k.st='idle';if(k.id==0||v.id==0)toast('Kill blocked by Pulse Shield!');else toast('A kill was blocked!');snd(500,.3,'sine');if(pz===G.pu)G.pu=null;else G.pus.splice(G.pus.indexOf(pz),1);return}if(NET&&k.id==0)NET.R.emit('kill',{v:v.pid});if(k.id==0||v.id==0){cut={t:0,k,v,hit:0,ps:null};setState('KILL');snd(90,.7,'sawtooth')}else doKill(k,v)}
function chk(){if(G.over)return;const im=P.filter(e=>e.imp&&!e.dead).length,cr=P.filter(e=>!e.imp&&!e.dead).length;let r=null;if(!im){r='crew';G.why='voted'}else if(cr<=im){r='imp';G.why='elim'}else if(G.done>=G.total){r='crew';G.why='tasks'}if(r)finish(r)}
function finish(r){G.over=1;const win=(r=='imp')==!!P[0].imp;me.m++;if(win)me.w++;save();$('et').textContent=win?'VICTORY':'DEFEAT';$('et').style.color=win?'#4cf':'#f44';$('ed').textContent=(r=='imp'?'The Impostor wins.':'The Crew wins.')+' Impostors: '+P.filter(e=>e.imp).map(e=>e.name).join(', ');setState('END');endInit(r,win)}
function meet(rep,body){if(state!='PLAY'||G.over)return;if(NET&&rep===P[0])NET.R.emit('meet',{b:body?G.body.indexOf(body):-1});G.mc=(G.mc||0)+1;clr0();if(G.sab&&G.sab.k!='reactor')endSab();if(body)body.rep=1;P.forEach(e=>{e.hid=0;e.vent=-1;e.st='idle'});G.mt={t:0,pv:null,ph:'v',vt:0,ej:null,q:[],acc:null,vs:{}};setState('MEET');$('cl').innerHTML='';buildChat(rep,body);$('mth').textContent=body?rep.name+' reported a body!':'Emergency meeting!';$('mr').textContent='Vote for the Impostor (or skip)';renderMeet();snd(520,.5)}
function renderMeet(){const m=G.mt,box=$('mc');box.innerHTML='';const mkc=(id,label,e)=>{const b=document.createElement('button');b.className='card'+(m.pv===id?' sel':'');if(e){b.innerHTML='<canvas width="40" height="48"></canvas>'+label;crew(b.firstChild.getContext('2d'),20,36,{col:e.col,hat:e.hat,skin:e.skin,sc:.8})}else b.textContent=label;b.onclick=()=>{if(m.ph=='v'&&!P[0].dead){if(m.pv===null)m.vt=m.t;m.pv=id;snd(440,.08);if(NET){m.vs[mp()]=gp(id);NET.R.emit('vote',{t:gp(id)})}renderMeet()}};box.appendChild(b)};P.filter(e=>!e.dead).forEach(e=>mkc(e.id,e.name,e));mkc('skip','SKIP',null)}
function resolve(){const m=G.mt,al=P.filter(e=>!e.dead),cnt={};for(const e of al){let c;if(NET){const tp=m.vs[e.id==0?mp():e.pid],ix=tp==null||tp=='skip'?-1:tp==mp()?0:P.findIndex(q=>q.pid==tp);c=ix<0?'skip':ix}else if(e.id==0)c=m.pv===null?'skip':m.pv;else if(e.imp){const cr=al.filter(x=>!x.imp);c=RND()<.3||!cr.length?'skip':cr[RND()*cr.length|0].id}else c=(e.wit>=0&&!P[e.wit].dead&&RND()<.7)?e.wit:(m.acc!=null&&!P[m.acc].dead&&P[m.acc]!==e&&RND()<.35?m.acc:RND()<.3?al.filter(x=>x!==e)[RND()*(al.length-1)|0].id:'skip');cnt[c]=(cnt[c]||0)+(e.id==0&&e.rl=='infl'&&!NET?2:1)}
const en=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);let t='Votes: '+en.map(([k,v])=>(k=='skip'?'Skip':P[k].name)+' '+v).join(', ')+'. ',ej=null;
if(en[0][0]!='skip'&&!(en[1]&&en[1][1]==en[0][1])){ej=P[en[0][0]];ej.dead=1;t+=ej.name+' was '+(ej.imp?'':'not ')+'the Impostor.'}else t+='No one was ejected.';
m.ph='r';m.t=0;$('mr').textContent=t;m.ej=ej;{const n=P.filter(x=>x.imp&&!x.dead).length;m.tx=[ej?ej.name+' was '+(ej.imp?'':'not ')+'the Impostor.':'No one was ejected.',n?(n==1?'1 Impostor remains.':n+' Impostors remain.'):'']}snd(200,.5,'sawtooth')}
function endMeet(){G.body=[];P.forEach(e=>{if(!e.dead||e.id==0){e.x=SP[0]+RND()*80;e.y=SP[1]+RND()*30}e.nd=0;e.wp=[];e.st='idle';e.wit=-1;if(e.imp)e.cd=Math.max(e.cd,10)});P.forEach(p=>{if(p.dead)p.kn=1;p.used=0});G.pus=[];clr0();G.mt=null;P[0].used=0;G.dec=null;G.pu=null;setState('PLAY');chk()}
// ---------- input / actions ----------
function act(a){if(state!='PLAY'||G.over||tkOpen)return;const e=P[0];
if(a=='use'){if(e.vent>=0){const n=(e.vent+1)%VENTS.length;e.vent=n;e.x=VENTS[n][0];e.y=VENTS[n][1];snd(260,.1);toast('Vent:'+VN[n]);return}
if(e.st=='task')return;
if(!e.dead&&!G.em&&Math.hypot(e.x-EB[0],e.y-EB[1])<110){G.em=1;meet(e,null);return}
if(G.sab&&G.sab.fx&&!e.imp&&!e.dead){const j=G.sab.fx.findIndex(f=>!f.d&&Math.hypot(f.x-e.x,f.y-e.y)<80);if(j>=0){fixSab(j);return}}
const i=e.tasks.findIndex(t=>!t.done&&Math.hypot(ST[t.s][0]-e.x,ST[t.s][1]-e.y)<80);if(i>=0)openTk(i)}
if(a=='kill'&&e.imp&&!e.dead&&e.vent<0&&e.cd<=0&&!(e.pt>0)){const v=P.filter(o=>!o.dead&&!o.imp&&!o.hid&&dist(o,e)<75&&los(o,e)).sort((p,q)=>dist(p,e)-dist(q,e))[0];if(v)startKill(e,v);else if(G.dec&&dist(G.dec,e)<75){G.dec=null;e.cd=8;toast('It was a hologram!');snd(300,.3,'sawtooth')}}
if(a=='role'&&!e.dead&&e.rl)roleUse(e);
if(a=='vent'&&e.imp&&!e.dead){if(e.vent>=0){e.vent=-1;e.hid=0}else{const i=VENTS.findIndex(v=>Math.hypot(v[0]-e.x,v[1]-e.y)<70);if(i>=0){e.vent=i;e.hid=1;e.x=VENTS[i][0];e.y=VENTS[i][1];snd(200,.15)}}}
if(a=='scan'&&!e.dead&&e.sn<=0){e.sn=45;G.pl=4;toast('RADAR PULSE');snd(800,.3,'sine')}
if(a=='rep'&&!e.dead){const b=G.body.find(o=>!o.rep&&Math.hypot(o.x-e.x,o.y-e.y)<130);if(b)meet(e,b)}}
addEventListener('keydown',e=>{if(e.target.tagName=='INPUT')return;keys[e.code]=1;if(e.repeat)return;if(e.code=='KeyE'||e.code=='Space')act('use');if(e.code=='KeyQ')act('kill');if(e.code=='KeyR')act('rep');if(e.code=='KeyV')act('vent');if(e.code=='KeyF')act('scan');if(e.code=='KeyG')act('role');if(e.code=='KeyT')$('bz').click();if(e.code=='Space'||e.code.startsWith('Arrow'))e.preventDefault()});addEventListener('keyup',e=>keys[e.code]=0);
const jz=$('joy'),jr=$('jr'),jk=$('jk');let jo={x:0,y:0};
jz.addEventListener('pointerdown',e=>{J.id=e.pointerId;jo={x:e.clientX,y:e.clientY};jr.style.display='block';jr.style.left=jo.x+'px';jr.style.top=jo.y+'px';try{jz.setPointerCapture(e.pointerId)}catch(_){}});
jz.addEventListener('pointermove',e=>{if(e.pointerId!==J.id)return;let dx=e.clientX-jo.x,dy=e.clientY-jo.y;const d=Math.hypot(dx,dy),m=55;if(d>m){dx*=m/d;dy*=m/d}J.x=dx/m;J.y=dy/m;jk.style.transform=`translate(${dx}px,${dy}px)`});
const ju=e=>{if(e.pointerId!==J.id)return;J.id=null;J.x=J.y=0;jr.style.display='none';jk.style.transform=''};jz.addEventListener('pointerup',ju);jz.addEventListener('pointercancel',ju);
[['bu','use'],['bk','kill'],['bv','vent'],['br','rep'],['bs','scan']].forEach(([id,a])=>$(id).addEventListener('pointerdown',e=>{e.preventDefault();act(a)}));
document.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>enterLobby());
$('how').onclick=()=>$('hw').classList.add('on');$('hwx').onclick=()=>$('hw').classList.remove('on');
$('role').onclick=()=>{me.role=me.role=='random'?'imp':me.role=='imp'?'crew':'random';save();$('role').textContent=ROLES[me.role]};
$('start').onclick=()=>{if(!NET)return startGame();if(!netHost()){toast('Only the host starts');return}const a=ids();if(a.length<3){toast('Need 3+ players online');return}{const w=Math.min(me.ni||1,Math.max(1,Math.min(3,(a.length-1)>>1))),im=[...a].sort(()=>RND()-.5).slice(0,w);NET.R.emit('go',{ps:a,imp:im[0],imps:im,map:me.map|0})}};$('again').onclick=enterLobby;
document.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i==0){mute=!mute;toast(mute?'Sound off':'Sound on')}else if(i==2)toast('Matches '+me.m+' Wins '+me.w);else openCz()});
function openCz(){$('cz').classList.add('on');renderCz()}
$('czx').onclick=()=>{$('cz').classList.remove('on');if(state=='LOBBY'){const p=P[0];p.col=me.col;p.hat=me.hat;p.skin=me.skin}};
function renderCz(){const sw=$('sw');sw.innerHTML='';COLS.forEach((c,i)=>{const d=document.createElement('i');d.className='p'+(me.col==i?' sel':'');d.style.background=c;d.onclick=()=>{me.col=i;save();renderCz()};sw.appendChild(d)});
for(const[id,arr,key]of[['hs',HATS,'hat'],['ss',SKINS,'skin']]){const b=$(id);b.innerHTML='';arr.forEach((n,i)=>{const x=document.createElement('button');x.className='btn p'+(me[key]==i?' sel':'');x.style.cssText='font-size:12px;padding:6px 8px;border-width:2px';x.textContent=n;x.onclick=()=>{me[key]=i;save();renderCz()};b.appendChild(x)})}
const c=$('pv').getContext('2d');c.clearRect(0,0,140,140);crew(c,70,100,{col:me.col,hat:me.hat,skin:me.skin,sc:2.2})}
// ---------- playable tasks ----------
let tkOpen=false,tkCur=-1,tkIv=0;
const TKT=['swipe','hold','numbers','timing','hold','wires','numbers','hold','timing','wires'];
function closeTk(ok){if(!tkOpen)return;clearInterval(tkIv);tkOpen=false;$('tk').classList.remove('on');if(ok){const e=P[0],t=e.tasks[tkCur];if(t&&!t.done){t.done=1;if(G.t-(G.lt||-99)<25){e.bo=6;toast('POWER SURGE: speed up!')}G.lt=G.t;if(!e.imp){G.done++;if(NET)NET.R.emit('task',{});chk()}}}}
function openTk(i){const t=P[0].tasks[i],ty=TKT[t.s],b=$('tkb');tkOpen=true;tkCur=i;$('tk').classList.add('on');b.innerHTML='<h3></h3><div id="tg"></div><button class="btn p" id="tkx">X</button>';b.firstChild.textContent=ST[t.s][3];$('tkx').onclick=()=>closeTk(0);
const g=$('tg'),win=()=>{clearInterval(tkIv);snd(700,.2);g.innerHTML='<h2>Task complete!</h2>';setTimeout(()=>closeTk(1),700)};
if(ty=='swipe'){g.innerHTML='<div class="tr"><div id="cd">CARD</div></div><p>Drag the card across, not too fast or slow</p>';const cd=$('cd'),tr=cd.parentNode;let dn=0,sx=0,t0=0;
cd.onpointerdown=e=>{dn=1;sx=e.clientX-cd.offsetLeft;t0=performance.now();cd.setPointerCapture(e.pointerId)};
cd.onpointermove=e=>{if(dn)cd.style.left=Math.max(0,Math.min(tr.clientWidth-cd.offsetWidth,e.clientX-sx))+'px'};
cd.onpointerup=()=>{dn=0;const full=cd.offsetLeft>=tr.clientWidth-cd.offsetWidth-4,ms=performance.now()-t0;if(full&&ms>250&&ms<1400)win();else{cd.style.left=0;toast(full?(ms<=250?'Too fast':'Too slow'):'Swipe all the way')}}}
else if(ty=='hold'){g.innerHTML='<div class="bar"><i id="hf"></i></div><button class="btn p" id="hb">HOLD</button>';let v=0;const hb=$('hb');
hb.onpointerdown=()=>{clearInterval(tkIv);tkIv=setInterval(()=>{v+=2;$('hf').style.width=v+'%';if(v>=100)win()},40)};hb.onpointerup=hb.onpointerleave=()=>{if(v>=100)return;clearInterval(tkIv);v=0;$('hf').style.width='0'}}
else if(ty=='numbers'){const n=[...Array(9).keys()].map(i=>i+1).sort(()=>RND()-.5);let nx=1;g.innerHTML='<div class="gr">'+n.map(x=>'<button class="btn p">'+x+'</button>').join('')+'</div>';g.querySelectorAll('button').forEach(x=>x.onclick=()=>{if(+x.textContent==nx){x.style.visibility='hidden';snd(400+nx*40,.08);if(++nx>9)win()}else toast('Tap in order: '+nx)})}
else if(ty=='timing'){g.innerHTML='<div class="bar" style="position:relative"><i style="position:absolute;left:40%;width:20%;background:#4cd964"></i><i id="mk" style="position:absolute;width:6px;background:#fff"></i></div><button class="btn p" id="tp">STABILIZE 0/3</button>';let hits=0,ph=0;tkIv=setInterval(()=>{ph+=.06;$('mk').style.left=(50+Math.sin(ph)*48)+'%'},30);
$('tp').onclick=()=>{const x=50+Math.sin(ph)*48;if(x>=38&&x<=60){hits++;snd(600,.08);$('tp').textContent='STABILIZE '+hits+'/3';if(hits>=3)win()}else{hits=0;$('tp').textContent='STABILIZE 0/3';toast('Missed!')}}}
else{const cs=['#e33','#36f','#fd2','#e5e'],rs=[...cs].sort(()=>RND()-.5);let sel=null,ok=0;const col=(a,s)=>'<div>'+a.map(c=>'<b class="'+s+'" data-c="'+c+'" style="background:'+c+'"></b>').join('')+'</div>';g.innerHTML='<div class="wr">'+col(cs,'l')+col(rs,'r')+'</div><p>Tap a wire, then its match</p>';
g.querySelectorAll('b').forEach(x=>x.onclick=()=>{if(x.textContent)return;if(x.className=='l'){g.querySelectorAll('b.l').forEach(y=>y.style.outline='');sel=x;x.style.outline='3px solid #fff'}else if(sel){if(sel.dataset.c==x.dataset.c){sel.textContent=x.textContent='\u2714';sel.style.outline='';sel=null;snd(600,.1);if(++ok>=4)win()}else{toast('Wrong wire');sel.style.outline='';sel=null}}})}}
// ---------- meeting chat ----------
function say(e,s){const l=$('cl'),d=document.createElement('div'),n=document.createElement('b');n.style.color=COLS[e.col];n.textContent=e.name+': ';d.appendChild(n);d.appendChild(document.createTextNode(s));l.appendChild(d);l.scrollTop=1e9;snd(520,.05)}
function buildChat(rep,body){if(NET){say(rep,body?'I found '+NM[body.col]+'\u2019s body in '+roomOf(body.x,body.y)+'!':'Emergency meeting!');return}const m=G.mt,al=P.filter(e=>!e.dead&&e.id),pk=a=>a[RND()*a.length|0];let t=1.2;const add=(e,s)=>{m.q.push({t,e,s});t+=.8+RND()};
if(body){const bn=NM[body.col];if(rep.id)add(rep,'I found '+bn+'\u2019s body in '+roomOf(body.x,body.y)+' (dead ~'+Math.round(G.t-body.t)+'s)!');else say(P[0],'(You reported '+bn+'\u2019s body)')}
al.filter(e=>e.wit>=0&&!e.imp).forEach(e=>add(e,'I saw '+P[e.wit].name+' near the body. Sus!'));
al.filter(e=>e.imp).forEach(e=>{const c=pk(P.filter(x=>!x.dead&&!x.imp&&x.id!=e.id));if(c)add(e,RND()<.5?'It was not me, I was in '+roomOf(e.x,e.y)+'.':'I think '+c.name+' is sus.')});
al.filter(e=>!e.imp&&e.wit<0).slice(0,3).forEach(e=>add(e,RND()<.6?'I was doing tasks in '+roomOf(e.x,e.y)+'.':'Where was thebody?'))}
function sendChat(s){s=s.trim().slice(0,60);const m=G&&G.mt;if(!s||!m||m.ph!='v')return;if(P[0].dead){toast('Ghosts cannot chat');return}say(P[0],s);if(NET){NET.R.emit('chat',{s});return}
const lo=s.toLowerCase(),al=P.filter(e=>!e.dead&&e.id),p=al.find(e=>lo.includes(e.name.toLowerCase())),bots=[...al].sort(()=>RND()-.5).slice(0,2);let t=m.t+1;
bots.forEach(b=>{let r;if(p){m.acc=p.id;r=b===p?'It was not me! I was in '+roomOf(b.x,b.y)+'.':b.wit==p.id?'Yes, I saw them too!':RND()<.5?'Hmm, do you have proof?':'I can vote '+p.name+' if you are sure.'}
else if(lo.includes('skip'))r='Skip sounds safe.';else if(lo.includes('where'))r='Near '+(G.body[0]?roomOf(G.body[0].x,G.body[0].y):'the cafeteria')+'.';
else r=['Ok.','I am not sure.','Who do you think did it?'][RND()*3|0];m.q.push({t,e:b,s:r});t+=1.2});m.q.sort((a,b)=>a.t-b.t)}
$('cs').onclick=()=>{sendChat($('ci').value);$('ci').value=''};$('ci').onkeydown=e=>{if(e.key=='Enter')$('cs').onclick()};
['Where was it?','I was doing tasks.','Who is sus?','Let us skip.'].forEach(s=>{const b=document.createElement('button');b.className='btn p';b.textContent=s;b.onclick=()=>sendChat(s);$('cc').appendChild(b)});
// ---------- ejection cutscene ----------
let ejc=null;
function startEject(){const m=G.mt;ejc={t:0,e:m.ej,tx:m.tx};setState('EJECT');snd(180,.8,'sawtooth')}
function drawEject(){const c=ejc,t=c.t,e=c.e,tm=performance.now()/1000;mn.st.forEach(s=>{cx.globalAlpha=.4+.6*Math.abs(Math.sin(tm*s.z+s.p));cx.fillStyle='#fff';cx.fillRect(((s.x-t*.03*s.z)%1+1)%1*W,s.y*H,s.z*3,s.z*2)});cx.globalAlpha=1;
const p=Math.min(1,t/3.6),x=W*(-.1+.88*p),y=H*(.62-.24*p)+Math.sin(t*2.5)*H*.04;
if(e&&t<3.6)crew(cx,x,y,{col:e.col,hat:e.hat,skin:e.skin,sc:Math.min(W,H)/70*(1-p*.9),rot:t*3.4,mv:1,wk:t*22});
else if(e&&t<4.4){const q=(t-3.6)/.8;cx.strokeStyle='#fff';cx.lineWidth=3;for(let i=0;i<8;i++){const a=i*.785+.3;cx.beginPath();cx.moveTo(x+Math.cos(a)*q*40,y+Math.sin(a)*q*40);cx.lineTo(x+Math.cos(a)*(q*40+14),y+Math.sin(a)*(q*40+14));cx.stroke()}}
let n=Math.floor(t*22);cx.textAlign='center';cx.font='700 '+Math.min(26,W/16)+'px system-ui';cx.fillStyle='#fff';c.tx.forEach((s,i)=>{cx.fillText(s.slice(0,Math.max(0,n)),W/2,H*.8+i*34);n-=s.length})}
// ---------- bots ----------
function botLobby(b,dt){b.mv=0;if(!b.tg||dist(b,b.tg)<8||(b.tm-=dt)<0){b.tm=3;const x=100+RND()*800,y=100+RND()*440;b.tg=can(x,y)?{x,y}:null;return}const dx=b.tg.x-b.x,dy=b.tg.y-b.y,d=Math.hypot(dx,dy),ox=b.x,oy=b.y;mvE(b,dx/d*70*dt,dy/d*70*dt);if(Math.abs(b.x-ox)+Math.abs(b.y-oy)<.01)b.tg=null;b.f=dx<0?-1:1;b.wk+=dt*10;b.mv=1}
function pickWp(b,x,y,room,cur){const r=route(nearN(b.x,b.y),room),pts=r.map(i=>NODES[i]);if(x!=null)pts.push([x,y]);let p=[b.x,b.y],i=0;const o=[];while(i<pts.length){let j=pts.length-1;while(j>i&&!clearLine(p,pts[j]))j--;o.push({x:pts[j][0],y:pts[j][1]});p=pts[j];i=j+1}b.wp=o;b.cur=cur}
function botAI(b,dt){b.mv=0;b.sr=(b.sr==null?0:b.sr)-dt;if(b.bo>0)b.bo-=dt;if(b.pt>0&&(b.pt-=dt)<=0&&!(b.vt>0))b.hid=0;botRole(b,dt);if(b.vt>0){b.vt-=dt;if(b.vt<=0)b.hid=0;return}if(!b.dead&&!b.imp){const bd=G.body.find(o=>!o.rep&&dist(b,o)<150);if(bd){meet(b,bd);return}}
if(G.sab&&G.sab.fx&&!b.imp&&!b.dead&&b.sr<=0){const f=G.sab.fx.filter(q=>!q.d).sort((x,y)=>dist(b,x)-dist(b,y))[0];if(f){if(dist(b,f)<60){fixSab(G.sab.fx.indexOf(f));return}if(!b.wp.length||b.fxt!==f){b.fxt=f;pickWp(b,f.x,f.y,nearN(f.x,f.y),-1)}}}
if(b.imp&&!b.dead){if(!NET&&!G.sab&&G.sc<=0&&RND()<dt*.04)trigSab(RND()*3|0);b.cd-=dt;b.kt-=dt;if(b.cd<=0){if(G.dec&&dist(b,G.dec)<55){G.dec=null;b.cd=8;toast('A hologram fooled the Impostor!');return}if(G.dec&&dist(b,G.dec)<220&&b.kt<=0){b.kt=.7;pickWp(b,G.dec.x,G.dec.y,nearN(G.dec.x,G.dec.y),-1);b.st='go';return}const v=P.filter(e=>!e.dead&&!e.imp&&!e.hid).sort((a,c)=>dist(b,a)-dist(b,c))[0];if(v){const w=P.filter(o=>o!==b&&o!==v&&!o.dead&&!o.imp&&dist(o,v)<230).length;if(dist(b,v)<55&&w==0&&!(b.pt>0)){startKill(b,v);return}if(b.kt<=0){b.kt=.7;pickWp(b,v.x,v.y,nearN(v.x,v.y),-1);b.st='go'}}}}
if(b.st=='task'){b.tm-=dt;if(b.tm<=0){if(b.cur>=0){const t=b.tasks[b.cur];if(!t.done){t.done=1;if(!b.imp){G.done++;chk()}}}b.st='idle'}return}
if(!b.wp.length){const open=b.tasks.map((t,i)=>i).filter(i=>!b.tasks[i].done);if(open.length&&(!b.imp||RND()<.7)){const i=open[RND()*open.length|0],s=ST[b.tasks[i].s];pickWp(b,s[0],s[1],s[2],i)}else pickWp(b,null,null,RND()*NODES.length|0,-1);return}
const w=b.wp[0],dx=w.x-b.x,dy=w.y-b.y,d=Math.hypot(dx,dy);
if(d<8){b.wp.shift();if(!b.wp.length&&b.cur>=0){b.st='task';b.tm=2+RND()*3}return}
const ox=b.x,oy=b.y,sp=(b.dead?120:95)*(G.an&&G.an.k==1?1.5:1)*(b.bo>0?1.35:1)*dt;mvE(b,dx/d*sp,dy/d*sp);if(Math.abs(b.x-ox)+Math.abs(b.y-oy)<.01){b.wp.shift();if(!b.wp.length)b.cur=-1}
b.f=dx<0?-1:1;b.wk+=dt*10;b.mv=1}
// ---------- update ----------
function updateMe(dt){const e=P[0];if(tkOpen){e.mv=0;return}if(e.st=='task'){e.mv=0;e.tm-=dt;if(e.tm<=0){const t=e.tasks[e.cur];if(t&&!t.done){t.done=1;if(!e.imp){G.done++;snd(700,.2);chk()}}e.st='idle'}return}
if(e.vent>=0){e.mv=0;return}
let dx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+J.x,dy=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+J.y;const l=Math.hypot(dx,dy);e.mv=l>.1?1:0;if(!e.mv)return;if(l>1){dx/=l;dy/=l}
if(G&&G.an&&G.an.k==3){dx=-dx;dy=-dy}const sp=(e.dead?190:150)*(G&&G.an&&G.an.k==1?1.5:1)*(e.bo>0?1.35:1)*dt;mvE(e,dx*sp,dy*sp);if(Math.abs(dx)>.1)e.f=dx<0?-1:1;e.wk+=dt*10}
let hudS='';
function hud(){const pl=state=='PLAY',e=P[0];pbar(pl&&G&&G.vit>0);if(pl&&e){const bz=$('bz');bz.style.display=e.imp&&!e.dead?'':'none';bz.textContent=G.sc>0?Math.ceil(G.sc):G.sab?'ACTIVE':'SAB '+SKN[e.sk|0];bz.style.opacity=G.sc>0||G.sab?.5:1;const ba=$('ba');ba.style.display=e.rl&&!e.dead?'':'none';ba.textContent=e.used?'USED':e.rl=='engi'&&e.vent>=0?'EXIT':RL[e.rl]||'';ba.style.opacity=e.used?.4:1;ba.style.boxShadow=G.pu||G.dec||e.bo>0?'0 0 18px 5px #6ff':''}$('acts').style.display=pl?'grid':'none';$('tb').style.display=pl?'block':'none';if(!pl||!e)return;
$('bk').style.display=$('bv').style.display=e.imp&&!e.dead?'':'none';$('bk').style.setProperty('--cd',Math.max(0,e.cd)/15*360+'deg');$('bk').style.opacity=e.cd>0?.6:1;
$('tbf').style.width=G.done/G.total*100+'%';$('bu').style.boxShadow=!e.dead&&!G.em&&Math.hypot(e.x-EB[0],e.y-EB[1])<110||e.tasks.some(t=>!t.done&&Math.hypot(ST[t.s][0]-e.x,ST[t.s][1]-e.y)<80)?'0 0 20px 6px #ffd54a':'';$('br').style.boxShadow=G.body.some(o=>!o.rep&&Math.hypot(o.x-e.x,o.y-e.y)<130)?'0 0 20px 6px #f44':'';const s=e.tasks.map(t=>(t.done?'\u2714 ':'\u2022 ')+ST[t.s][3]).join('<br>');if(s!==hudS){hudS=s;$('tl').innerHTML=s}
$('bs').style.opacity=e.sn>0?.5:1;$('bs').textContent=e.sn>0?Math.ceil(e.sn):'SCAN';$('gh').textContent=G.sab?sabTxt():e.dead?'You are a ghost':e.vent>=0?'In vent: USE to move, VENT to exit':G.an?'\u26a0 '+ANS[G.an.k-1][0].split(':')[0]+' '+Math.ceil(G.an.l)+'s':''}
function update(dt){for(const p of P)p.ws=(p.ws||0)+((p.mv?1:0)-(p.ws||0))*Math.min(1,dt*10);if(NET)for(let i=1;i<P.length;i++){const o=P[i];if(o.tx!=null){const k=Math.min(1,dt*12);o.x+=(o.tx-o.x)*k;o.y+=(o.ty-o.y)*k}}
if(state=='END'&&E){E.t+=dt;endTick(dt);return}
if(state=='MENU'){mn.fl.forEach(f=>{f.x=((f.x+f.vx*dt)%1+1)%1;f.y=((f.y+f.vy*dt)%1+1)%1;f.r+=f.vr*dt});return}
if(state=='LOBBY'){setTxt();updateMe(dt);P[0].wk=P[0].wk;if(!NET)for(let i=1;i<P.length;i++)botLobby(P[i],dt);hud();return}
if(state=='PLAY'){G.t+=dt;G.sh=Math.max(0,G.sh-dt);anom(dt);updateMe(dt);if(P[0].imp)P[0].cd-=dt;P[0].sn-=dt;P[0].bo=Math.max(0,(P[0].bo||0)-dt);G.pl=Math.max(0,G.pl-dt);if(G.pu&&(G.pu.t-=dt)<=0)G.pu=null;G.pus=(G.pus||[]).filter(u=>(u.t-=dt)>0);sabTick(dt);{const m=P[0];if(m.rl=='engi'&&m.vent>=0&&(m.vm-=dt)<=0){m.vent=-1;m.hid=0;m.used=1}if(m.pt>0&&(m.pt-=dt)<=0)m.hid=0;if(m.shT>0&&(m.shT-=dt)<=0)clr0();if(G.vit>0)G.vit-=dt;if(G.trk&&((G.trk.t-=dt)<=0||G.trk.p.dead))G.trk=null}if(G.dec&&(G.dec.t-=dt)<=0)G.dec=null;if(!NET)for(let i=1;i<P.length&&state=='PLAY';i++)botAI(P[i],dt);
if(G){for(const f of G.fx){f.l-=dt;if(!f.ring){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=300*dt}}G.fx=G.fx.filter(f=>f.l>0)}hud();return}
if(state=='KILL'){const c=cut;c.t+=dt;
if(!c.hit&&c.t>=.8){c.hit=1;c.ps=[];for(let i=0;i<50;i++){const a=RND()*6.28,s=150+RND()*450;c.ps.push({x:W*.66,y:H*.58,vx:Math.cos(a)*s,vy:Math.sin(a)*s-150,l:1+RND()*.8,c:i%3==0?({laser:'#4cf',bomb:'#ff9a1f'}[c.k.kw]||'#ff2b4a'):i%3==1?COLS[c.v.col]:'#fff',z:3+RND()*6})}snd(70,.6,'sawtooth');snd(1200,.12)}
if(c.ps)c.ps.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=700*dt;p.l-=dt});
if(c.t>=2.2){const k=c.k,v=c.v;cut=null;setState('PLAY');doKill(k,v)}return}
if(state=='INTRO'){intro.t+=dt;if(intro.t>=3.2){setState('PLAY');toast(MAPS[me.map|0].n)}return}
if(state=='EJECT'){ejc.t+=dt;if(ejc.t>=5.4){ejc=null;endMeet()}return}
if(state=='MEET'){const m=G.mt;m.t+=dt;if(m.ph=='v'&&(m.t>=(NET?20:12)||(NET&&Object.keys(m.vs).length>=P.filter(e=>!e.dead).length)||(!NET&&P[0].dead&&m.t>=3)))resolve();else if(m.ph=='r'&&m.t>=2.5)startEject();if(m.ph=='v')while(m.q.length&&m.q[0].t<=m.t){const l=m.q.shift();if(!l.e.dead)say(l.e,l.s)}}}
// ---------- render ----------
function drawMenu(){const t=performance.now()/1000;mn.st.forEach(s=>{cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*s.z+s.p));cx.fillStyle='#fff';cx.fillRect(s.x*W,s.y*H,s.z*2,s.z*2)});cx.globalAlpha=1;
mn.fl.forEach(f=>crew(cx,f.x*W,f.y*H,{col:f.col,hat:f.hat,sc:f.s,rot:f.r}));
cx.textAlign='center';cx.font='900 '+Math.min(64,W/8)+'px system-ui';cx.lineWidth=8;cx.strokeStyle='#0b0b12';cx.fillStyle='#dfe8ff';cx.strokeText('STARSHIFT',W/2,H*.22);cx.fillText('STARSHIFT',W/2,H*.22)}
// ---------- art: shapes, seeded random, procedural floor tiles ----------
const OL='#0b0b12';
function sp(c,s,d){const x=s[0],y=s[1],w=s[2],h=s[3],t=s[4],k=s[5]||0;
if(t=='e'){c.moveTo(x+w+d,y+h/2);c.ellipse(x+w/2,y+h/2,w/2+d,h/2+d,0,0,Math.PI*2);return}
const X=x-d,Y=y-d,A=w+2*d,B=h+2*d;
if(t=='o'){const q=k+d*.586;c.moveTo(X+q,Y);c.lineTo(X+A-q,Y);c.lineTo(X+A,Y+q);c.lineTo(X+A,Y+B-q);c.lineTo(X+A-q,Y+B);c.lineTo(X+q,Y+B);c.lineTo(X,Y+B-q);c.lineTo(X,Y+q);c.closePath();return}
if(t=='c'){const r=Math.max(0,k+d);c.moveTo(X+r,Y);c.arcTo(X+A,Y,X+A,Y+B,r);c.arcTo(X+A,Y+B,X,Y+B,r);c.arcTo(X,Y+B,X,Y,r);c.arcTo(X,Y,X+A,Y,r);c.closePath();return}
c.rect(X,Y,A,B)}
const mkr=s=>()=>(s=s*16807%2147483647)/2147483647;
const PATS={};
function tilePat(c,name){if(PATS[name])return PATS[name];const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d'),r=mkr(name.split('').reduce((a,ch)=>a*31+ch.charCodeAt(0)|0,7)&0xffffff||7);
(TILES[name]||TILES.deck)(g,r);const p=c.createPattern(cv,'repeat');try{p.setTransform(new DOMMatrix().scale(.5,.5))}catch(e){}return PATS[name]=p}
const spk=(g,r,n,col,z,a)=>{g.globalAlpha=a;g.fillStyle=col;for(let i=0;i<n;i++)g.fillRect(r()*128,r()*128,z*(.5+r()),z*(.5+r()));g.globalAlpha=1};
const seam=(g,col,n,w)=>{g.strokeStyle=col;g.lineWidth=w||2;g.beginPath();for(let i=0;i<=128;i+=128/n){g.moveTo(i,0);g.lineTo(i,128);g.moveTo(0,i);g.lineTo(128,i)}g.stroke()};
const rivet=(g,x,y,col)=>{g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x+.8,y+1,2.4,0,7);g.fill();g.fillStyle=col||'#5b6472';g.beginPath();g.arc(x,y,2.2,0,7);g.fill();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(x-.7,y-.7,.9,0,7);g.fill()};
const scratch=(g,r,n,col,a)=>{g.globalAlpha=a;g.strokeStyle=col;g.lineWidth=1;for(let i=0;i<n;i++){const x=r()*128,y=r()*128;g.beginPath();g.moveTo(x,y);g.lineTo(x+r()*30-15,y+r()*30-15);g.stroke()}g.globalAlpha=1};
const plates=(g,r,n,c1,c2,seamc)=>{const s=128/n;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const q=g.createLinearGradient(i*s,j*s,i*s+s,j*s+s);q.addColorStop(0,c1);q.addColorStop(1,c2);g.fillStyle=q;g.fillRect(i*s,j*s,s,s);g.fillStyle='rgba(255,255,255,.10)';g.fillRect(i*s+2,j*s+2,s-4,2);g.fillStyle='rgba(0,0,0,.14)';g.fillRect(i*s+2,j*s+s-4,s-4,2)}seam(g,seamc,n,2.4)};
const TILES={
deck(g,r){plates(g,r,2,'#929bab','#7d8695','rgba(10,14,22,.6)');[[8,8],[56,8],[8,56],[56,56],[72,8],[120,8],[72,56],[120,56],[8,72],[56,72],[8,120],[56,120],[72,72],[120,72],[72,120],[120,120]].forEach(p=>rivet(g,p[0],p[1]));spk(g,r,30,'#fff',2,.07);scratch(g,r,6,'#fff',.1);scratch(g,r,6,'#000',.12)},
grate(g,r){g.fillStyle='#363c47';g.fillRect(0,0,128,128);g.strokeStyle='#222730';g.lineWidth=3;g.beginPath();for(let i=-128;i<256;i+=12){g.moveTo(i,0);g.lineTo(i+128,128);g.moveTo(i+128,0);g.lineTo(i,128)}g.stroke();g.strokeStyle='rgba(120,135,160,.35)';g.lineWidth=1.2;g.beginPath();for(let i=-128;i<256;i+=12){g.moveTo(i+1.5,0);g.lineTo(i+129.5,128)}g.stroke();g.strokeStyle='#20252d';g.lineWidth=5;g.strokeRect(0,0,128,128);g.strokeStyle='rgba(150,165,190,.25)';g.lineWidth=1.5;g.strokeRect(3,3,122,122);[[7,7],[121,7],[7,121],[121,121]].forEach(p=>rivet(g,p[0],p[1],'#6b7586'))},
plate(g,r){plates(g,r,2,'#5a474a','#3f3033','rgba(8,4,6,.75)');g.strokeStyle='rgba(255,140,60,.45)';g.lineWidth=1.6;for(const[x,y]of[[0,0],[64,0],[0,64],[64,64]]){g.strokeRect(x+8,y+8,48,48)}g.fillStyle='rgba(255,170,80,.25)';[[32,32],[96,32],[32,96],[96,96]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],5,0,7);g.fill()});spk(g,r,24,'#000',2,.18);scratch(g,r,8,'#ffb070',.08)},
carpet(g,r){g.fillStyle='#22385a';g.fillRect(0,0,128,128);g.strokeStyle='rgba(90,140,210,.28)';g.lineWidth=1.5;g.beginPath();for(let i=0;i<=128;i+=32){for(let j=0;j<=128;j+=32){g.moveTo(i,j-16);g.lineTo(i+16,j);g.lineTo(i,j+16);g.lineTo(i-16,j);g.closePath()}}g.stroke();spk(g,r,60,'#9cf',1.5,.06);spk(g,r,40,'#000',2,.12)},
med(g,r){for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#d3e3ea':'#e2eef2';g.fillRect(i*32,j*32,32,32)}seam(g,'#9fb4be',4,1.6);g.fillStyle='rgba(60,170,190,.18)';g.fillRect(0,60,128,8);spk(g,r,24,'#6a8',1.5,.07)},
tech(g,r){g.fillStyle='#252f42';g.fillRect(0,0,128,128);seam(g,'rgba(5,10,18,.8)',2,2.5);g.strokeStyle='rgba(80,200,230,.42)';g.lineWidth=1.6;g.beginPath();for(let i=0;i<7;i++){const x=r()*112+8,y=r()*112+8;g.moveTo(x,y);g.lineTo(x+(r()<.5?40:-40),y);g.lineTo(x+(r()<.5?40:-40),y+30)}g.stroke();g.fillStyle='rgba(120,230,255,.6)';for(let i=0;i<8;i++){g.beginPath();g.arc(r()*128,r()*128,2,0,7);g.fill()}spk(g,r,20,'#fff',1.5,.06)},
wood(g,r){const cs=['#8f6d46','#85633d','#9a7650','#7e5d3a'];for(let j=0;j<8;j++){g.fillStyle=cs[j%4];g.fillRect(0,j*16,128,16);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,j*16+14,128,2);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(0,j*16,128,2);g.strokeStyle='rgba(60,35,15,.3)';g.lineWidth=1;for(let k=0;k<3;k++){const y=j*16+3+r()*10;g.beginPath();g.moveTo(r()*60,y);g.lineTo(60+r()*68,y+r()*2);g.stroke()}const o=(j%2)*64+r()*20;g.fillStyle='rgba(0,0,0,.4)';g.fillRect(o,j*16,2,15);rivet(g,o+8,j*16+8,'#3a2a1a')}},
ice(g,r){plates(g,r,2,'#d4e6f0','#bdd5e3','rgba(70,110,140,.55)');g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1.3;for(let i=0;i<5;i++){let x=r()*128,y=r()*128;g.beginPath();g.moveTo(x,y);for(let k=0;k<4;k++)g.lineTo(x+=r()*26-13,y+=r()*26-13);g.stroke()}spk(g,r,40,'#fff',2,.55);[[8,8],[120,8],[8,120],[120,120],[64,64]].forEach(p=>rivet(g,p[0],p[1],'#8aa4b6'))},
snow(g,r){g.fillStyle='#e8f1f6';g.fillRect(0,0,128,128);for(let i=0;i<14;i++){g.globalAlpha=.5;g.fillStyle=i%2?'#fff':'#d2e1ea';g.beginPath();g.ellipse(r()*128,r()*128,10+r()*22,4+r()*8,r()*.6,0,7);g.fill()}g.globalAlpha=.4;g.strokeStyle='#c4d6e1';g.lineWidth=1.5;for(let i=0;i<9;i++){const y=r()*128,x=r()*128;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+20,y-4+r()*8,x+44,y+r()*6-3);g.stroke()}g.globalAlpha=1;spk(g,r,50,'#fff',2,.9);spk(g,r,16,'#9fb6c6',1.5,.35)},
lino(g,r){for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#d5dde0':'#e3e9eb';g.fillRect(i*32,j*32,32,32)}seam(g,'#aab6bc',4,1.5);spk(g,r,36,'#556',1.4,.08);g.fillStyle='rgba(90,160,220,.16)';g.fillRect(0,0,128,3)},
concrete(g,r){g.fillStyle='#989da0';g.fillRect(0,0,128,128);spk(g,r,120,'#000',2,.08);spk(g,r,90,'#fff',2,.08);g.strokeStyle='#6e7377';g.lineWidth=2.4;g.strokeRect(0,0,128,128);g.strokeStyle='rgba(40,45,50,.5)';g.lineWidth=1.2;for(let i=0;i<2;i++){let x=r()*128,y=r()*128;g.beginPath();g.moveTo(x,y);for(let k=0;k<5;k++)g.lineTo(x+=r()*22-8,y+=r()*22-11);g.stroke()}g.globalAlpha=.16;g.fillStyle='#1a1a22';g.beginPath();g.ellipse(30+r()*60,30+r()*60,14,9,r(),0,7);g.fill();g.globalAlpha=1;g.fillStyle='#d9b02a';g.fillRect(0,62,40,4)},
stone(g,r){g.fillStyle='#3a4531';g.fillRect(0,0,128,128);const sx=[0,38,70,128],sy=[0,44,84,128];for(let i=0;i<3;i++)for(let j=0;j<3;j++){const x=sx[i]+(j%2)*10,w=sx[i+1]-sx[i],y=sy[j],h=sy[j+1]-sy[j];g.fillStyle=['#78836b','#6f7a63','#848f75'][(i+j*2)%3];g.beginPath();g.moveTo(x+4,y+3);g.lineTo(x+w-3,y+4);g.lineTo(x+w-4,y+h-3);g.lineTo(x+3,y+h-4);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.1)';g.fillRect(x+5,y+4,w-10,2)}spk(g,r,20,'#4f8a3c',5,.55);spk(g,r,40,'#000',2,.12);spk(g,r,16,'#9fe070',2,.35)},
jmetal(g,r){plates(g,r,2,'#667061','#4f5849','rgba(10,16,8,.75)');g.globalAlpha=.4;for(let i=0;i<6;i++){g.fillStyle='#8a5a3a';g.beginPath();g.ellipse(r()*128,r()*128,6+r()*14,4+r()*8,r(),0,7);g.fill()}g.globalAlpha=.55;for(let i=0;i<8;i++){g.fillStyle='#4b8a3c';g.beginPath();g.ellipse(r()*128,r()*128,5+r()*12,3+r()*7,r(),0,7);g.fill()}g.globalAlpha=1;[[8,8],[56,8],[8,56],[56,56],[72,72],[120,72],[72,120],[120,120]].forEach(p=>rivet(g,p[0],p[1],'#5b6a52'))},
dirt(g,r){g.fillStyle='#5f4a32';g.fillRect(0,0,128,128);spk(g,r,160,'#2e2217',3,.25);spk(g,r,100,'#8b6e4a',3,.25);for(let i=0;i<14;i++){g.globalAlpha=.55;g.fillStyle=['#3f6a2c','#6e8a36','#8a6a2a','#4c7a30'][i%4];g.beginPath();g.ellipse(r()*128,r()*128,3+r()*4,1.6+r()*2,r()*3,0,7);g.fill()}g.globalAlpha=.5;g.strokeStyle='#3a2a18';g.lineWidth=2.4;for(let i=0;i<2;i++){let x=r()*128,y=r()*128;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+30,y+r()*30-15,x+60,y+r()*20-10);g.stroke()}g.globalAlpha=1},
boards(g,r){for(let j=0;j<8;j++){g.fillStyle=['#6c5636','#625030','#76603c','#5a4829'][j%4];g.fillRect(0,j*16,128,16);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(0,j*16+14,128,2);g.fillStyle='rgba(120,200,90,.18)';g.fillRect(0,j*16+10,128,4);g.strokeStyle='rgba(30,20,8,.35)';for(let k=0;k<3;k++){const y=j*16+3+r()*10;g.beginPath();g.moveTo(r()*60,y);g.lineTo(60+r()*68,y);g.stroke()}rivet(g,(j%2)*64+10,j*16+8,'#2e2a1c')}spk(g,r,30,'#6fe06a',3,.3)},
grass(g,r){g.fillStyle='#2c5a2a';g.fillRect(0,0,128,128);for(let i=0;i<10;i++){g.globalAlpha=.5;g.fillStyle=i%2?'#23491f':'#386a30';g.beginPath();g.ellipse(r()*128,r()*128,10+r()*20,6+r()*10,r()*3,0,7);g.fill()}g.globalAlpha=1;g.lineWidth=1.6;for(let i=0;i<150;i++){const x=r()*128,y=r()*128;g.strokeStyle=['#4a8a3a','#1f4a22','#5fa048','#2f6a2c'][i%4];g.beginPath();g.moveTo(x,y);g.lineTo(x+r()*6-3,y-3-r()*6);g.stroke()}spk(g,r,14,'#d8f06a',2,.5)},
labtile(g,r){for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#b3cbbd':'#c3d9cb';g.fillRect(i*32,j*32,32,32)}seam(g,'#7c9686',4,1.8);g.globalAlpha=.65;for(let i=0;i<9;i++){const x=(r()*4|0)*32,y=(r()*4|0)*32;g.fillStyle=i%3?'#4f9a46':'#79c25a';g.beginPath();g.ellipse(x+r()*6,y+r()*6,7+r()*9,4+r()*6,r()*3,0,7);g.fill()}g.globalAlpha=1;spk(g,r,24,'#243',1.6,.12)}};

// ---------- art: props & task machines (all drawn once into the cached map layer) ----------
let QQ={};
const stroke=(c,w)=>{c.lineWidth=w||2.5;c.strokeStyle=OL;c.lineJoin='round';c.stroke()};
function shad(c,x,y,rx,ry,a){c.fillStyle='rgba(0,0,0,'+(a||.3)+')';c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fill()}
function BX(c,x,y,w,h,d,top,fr,o){o=o||{};shad(c,x+w/2+3,y+h+d,w/2+4,Math.max(5,h*.22+d*.5),.26);c.lineWidth=2.5;c.strokeStyle=OL;c.lineJoin='round';
const g=c.createLinearGradient(0,y+h,0,y+h+d);g.addColorStop(0,fr);g.addColorStop(1,shade(fr,-.3));c.fillStyle=g;c.fillRect(x,y+h,w,d);c.strokeRect(x,y+h,w,d);
const t=c.createLinearGradient(x,y,x+w,y+h);t.addColorStop(0,shade(top,.22));t.addColorStop(1,shade(top,-.08));c.fillStyle=t;c.fillRect(x,y,w,h);c.strokeRect(x,y,w,h);
c.fillStyle='rgba(255,255,255,.28)';c.fillRect(x+2,y+2,w-4,2);if(o.band){c.fillStyle=o.band;for(let i=0;i<w;i+=16){c.beginPath();c.moveTo(x+i,y+h+1);c.lineTo(x+i+8,y+h+1);c.lineTo(x+i+4,y+h+d-1);c.lineTo(x+i-4,y+h+d-1);c.fill()}}}
function CYL(c,x,y,r,h,col,o){o=o||{};shad(c,x+4,y+h+2,r*1.05,r*.5,.28);c.lineWidth=2.5;c.strokeStyle=OL;const g=c.createLinearGradient(x-r,0,x+r,0);g.addColorStop(0,shade(col,-.3));g.addColorStop(.35,shade(col,.3));g.addColorStop(1,shade(col,-.4));c.fillStyle=g;c.beginPath();c.moveTo(x-r,y);c.lineTo(x-r,y+h);c.ellipse(x,y+h,r,r*.5,0,Math.PI,0,true);c.lineTo(x+r,y);c.closePath();c.fill();c.stroke();
c.fillStyle=o.top||shade(col,.25);c.beginPath();c.ellipse(x,y,r,r*.5,0,0,7);c.fill();c.stroke();
if(o.band){c.strokeStyle=o.band;c.lineWidth=3;for(const q of[.3,.7]){c.beginPath();c.ellipse(x,y+h*q,r,r*.5,0,0,Math.PI);c.stroke()}}if(o.glow){c.fillStyle=o.glow;c.beginPath();c.ellipse(x,y,r*.55,r*.28,0,0,7);c.fill()}}
function SCR(c,x,y,w,h,col,o){o=o||{};c.fillStyle='#0a0f18';rr(c,x,y,w,h,2);c.fill();stroke(c,2);const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,col);g.addColorStop(1,shade(col,-.45));c.fillStyle=g;c.fillRect(x+1.5,y+1.5,w-3,h-3);c.fillStyle='rgba(0,0,0,.25)';for(let i=3;i<h-2;i+=3)c.fillRect(x+1.5,y+i,w-3,1);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x+2,y+2,w-4,2);if(o.graph){c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1.2;c.beginPath();for(let i=0;i<=w-5;i+=3)c.lineTo(x+2.5+i,y+h/2+Math.sin(i*.6+x)*h*.22);c.stroke()}}
function BTN(c,x,y,n,gap){const cs=[QQ.warn||'#e44','#e0b72a','#4e8','#5cf'];for(let i=0;i<n;i++){c.fillStyle=cs[i%4];c.beginPath();c.arc(x+i*(gap||6),y,1.9,0,7);c.fill();c.strokeStyle=OL;c.lineWidth=1;c.stroke()}}
function GLO(c,x,y,r,col,a){c.save();c.globalCompositeOperation=QQ.lm||'lighter';const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col.replace('A',a));g.addColorStop(1,col.replace('A',0));c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore()}
const PR={
crate(c,x,y,o){const s=o.s||40;BX(c,x-s/2,y-s/2,s,s*.8,s*.28,o.c||QQ.crate,shade(o.c||QQ.crate,-.2));c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=2.2;c.beginPath();c.moveTo(x-s/2+3,y-s/2+3);c.lineTo(x+s/2-3,y+s*.3-3);c.moveTo(x+s/2-3,y-s/2+3);c.lineTo(x-s/2+3,y+s*.3-3);c.stroke();c.fillStyle='rgba(0,0,0,.35)';c.fillRect(x-s/2+4,y+s*.3+3,s*.28,3)},
barrel(c,x,y,o){CYL(c,x,y-8,10,16,o.c||'#b8503a',{band:'rgba(0,0,0,.35)'})},
tank(c,x,y,o){const r=o.r||26,h=o.h||50;CYL(c,x,y-h/2,r,h,o.c||QQ.metal,{band:'rgba(0,0,0,.3)',glow:o.g});c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x-r+5,y-h/2+3,3,h-6);c.fillStyle=OL;c.fillRect(x-4,y-h/2-12,8,9);c.fillStyle=QQ.warn||'#e44';c.fillRect(x-7,y-h/2-14,14,3)},
pipe(c,x,y,o){const x2=o.x2,y2=o.y2,w=o.w||9,col=o.c||QQ.pipe;c.lineCap='round';for(const[lw,st]of[[w+5,OL],[w,col],[w*.35,shade(col,.45)]]){c.strokeStyle=st;c.lineWidth=lw;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke()}const n=Math.hypot(x2-x,y2-y)/70|0;for(let i=0;i<=n;i++){const t=n?i/n:0,px=x+(x2-x)*t,py=y+(y2-y)*t;c.fillStyle=shade(col,-.25);c.strokeStyle=OL;c.lineWidth=2;c.beginPath();c.arc(px,py,w*.7,0,7);c.fill();c.stroke()}},
cable(c,x,y,o){c.lineCap='round';c.strokeStyle=OL;c.lineWidth=5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo((x+o.x2)/2,Math.max(y,o.y2)+(o.sag||24),o.x2,o.y2);c.stroke();c.strokeStyle=o.c||'#d8a030';c.lineWidth=2.4;c.stroke()},
table(c,x,y,o){const w=o.w||90,h=o.h||46;if(o.ch)for(let i=0;i<Math.max(2,w/38|0);i++){const px=x-w/2+(i+.5)*w/Math.max(2,w/38|0);for(const dy of[-h/2-10,h/2+14])PR.stool(c,px,y+dy,{})}BX(c,x-w/2,y-h/2,w,h,9,o.c||QQ.table,shade(o.c||QQ.table,-.28));if(o.cloth){c.fillStyle=o.cloth;c.fillRect(x-w/2+6,y-h/2+6,w-12,h-12)}},
stool(c,x,y){shad(c,x+2,y+3,8,4,.25);c.fillStyle=QQ.stool||'#c0553a';c.beginPath();c.ellipse(x,y,8,5,0,0,7);c.fill();stroke(c,2);c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(x-2,y-1.5,4,1.8,0,0,7);c.fill()},
console(c,x,y,o){const w=o.w||90,n=Math.max(1,w/42|0),sw=(w-8)/n;BX(c,x-w/2,y-12,w,22,12,QQ.console,shade(QQ.console,-.25));for(let i=0;i<n;i++){SCR(c,x-w/2+5+i*sw,y-10,sw-6,15,o.sc||QQ.glow,{graph:i%2})}BTN(c,x-w/2+8,y+16,Math.min(5,w/16|0),7);if(o.chair){PR.stool(c,x,y+34,{})}},
rack(c,x,y,o){const w=o.w||80,n=w/20|0;BX(c,x-w/2,y-16,w,26,18,QQ.rack,shade(QQ.rack,-.25));for(let i=0;i<n;i++){c.fillStyle='#0c121c';c.fillRect(x-w/2+i*20+2,y-12,16,18);for(let k=0;k<4;k++){c.fillStyle=(i+k)%3?QQ.led:'#e44';c.fillRect(x-w/2+i*20+4,y-9+k*4.5,3,2);c.fillStyle='rgba(180,200,230,.5)';c.fillRect(x-w/2+i*20+9,y-9+k*4.5,7,2)}c.strokeStyle=OL;c.lineWidth=1.5;c.strokeRect(x-w/2+i*20+2,y-12,16,18)}},
locker(c,x,y,o){const w=o.w||80,n=w/20|0;BX(c,x-w/2,y-14,w,18,22,o.c||'#5a7a96',shade(o.c||'#5a7a96',-.25));for(let i=0;i<n;i++){c.strokeStyle=OL;c.lineWidth=1.8;c.strokeRect(x-w/2+i*20+1,y+4,18,20);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x-w/2+i*20+4,y+7,12,2);c.fillStyle='#e0b72a';c.fillRect(x-w/2+i*20+13,y+14,3,5)}},
bed(c,x,y,o){BX(c,x-22,y-34,44,68,8,'#e8eef2','#9fb0bc');c.fillStyle='#fff';rr(c,x-17,y-30,34,14,5);c.fill();stroke(c,1.8);c.fillStyle=o.c||'#48a8c0';c.fillRect(x-20,y-8,40,40);c.strokeStyle=OL;c.lineWidth=2;c.strokeRect(x-20,y-8,40,40);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(x-20,y-8,40,4)},
bunk(c,x,y,o){BX(c,x-24,y-36,48,72,12,'#5b4a38','#3e3226');for(const k of[0,1]){c.fillStyle=k?(o.c2||'#c9534a'):(o.c||'#4a78b8');c.fillRect(x-20,y-32+k*34,40,30);c.strokeStyle=OL;c.lineWidth=2;c.strokeRect(x-20,y-32+k*34,40,30);c.fillStyle='#eee';rr(c,x-17,y-30+k*34,34,10,4);c.fill();stroke(c,1.5)}},
turbine(c,x,y,o){const w=o.w||150,h=o.h||70;BX(c,x-w/2,y-h/2,w,h,16,QQ.metal,shade(QQ.metal,-.3),{band:'rgba(220,170,40,.8)'});c.strokeStyle=OL;c.lineWidth=2.5;for(const dx of[-w*.25,w*.25]){c.fillStyle='#10141c';c.beginPath();c.arc(x+dx,y,h*.36,0,7);c.fill();c.stroke();c.strokeStyle='rgba(120,140,170,.7)';c.lineWidth=2;for(let k=0;k<6;k++){c.beginPath();c.moveTo(x+dx,y);c.lineTo(x+dx+Math.cos(k*1.047)*h*.34,y+Math.sin(k*1.047)*h*.34);c.stroke()}c.strokeStyle=OL;c.lineWidth=2.5}c.fillStyle=QQ.warn||'#e44';c.fillRect(x-4,y-h/2-3,8,4)},
genset(c,x,y,o){const w=o.w||110,h=o.h||60;BX(c,x-w/2,y-h/2,w,h,16,o.c||QQ.metal,shade(o.c||QQ.metal,-.3),{band:'rgba(220,170,40,.85)'});c.fillStyle='#10141c';rr(c,x-w/2+8,y-h/2+8,w*.45,h-16,5);c.fill();stroke(c,2);c.strokeStyle='rgba(120,140,170,.7)';c.lineWidth=1.8;for(let i=0;i<5;i++){c.beginPath();c.moveTo(x-w/2+12,y-h/2+14+i*(h-28)/4);c.lineTo(x-w/2+w*.45+4,y-h/2+14+i*(h-28)/4);c.stroke()}SCR(c,x+w*.08,y-h/2+9,w*.32,14,QQ.glow2||'#5f8');BTN(c,x+w*.1,y+h/2-12,4,8)},
plant(c,x,y,o){const r=o.r||22;shad(c,x+3,y+r*.5,r,r*.4,.28);for(const[a,b,s,col]of[[-.5,-.2,.9,'#1f5a2a'],[.5,-.3,.85,'#2a7a34'],[0,-.5,1,'#3a9a40'],[-.2,.2,.75,'#2a7a34'],[.35,.15,.7,'#1f5a2a']]){c.fillStyle=o.c?shade(o.c,(b)*.4):col;c.beginPath();c.ellipse(x+a*r,y+b*r,r*.62*s,r*.48*s,a,0,7);c.fill();stroke(c,2)}c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.ellipse(x-r*.15,y-r*.55,r*.3,r*.14,-.4,0,7);c.fill();if(o.f){c.fillStyle=o.f;for(let i=0;i<4;i++){c.beginPath();c.arc(x+Math.cos(i*1.7)*r*.5,y+Math.sin(i*1.7)*r*.35-4,3,0,7);c.fill()}}},
tree(c,x,y,o){const r=o.r||90;shad(c,x,y+r*.25,r*.95,r*.4,.3);c.lineCap='round';for(let i=0;i<9;i++){const a=i*.698+.3,l=r*(.7+((i*37)%5)/10);c.strokeStyle=OL;c.lineWidth=22;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.3+10,x+Math.cos(a)*l,y+Math.sin(a)*l*.55);c.stroke();c.strokeStyle='#5a4128';c.lineWidth=16;c.stroke();c.strokeStyle='#7a5a38';c.lineWidth=5;c.stroke()}
const tg=c.createRadialGradient(x-8,y-24,4,x,y-8,r*.42);tg.addColorStop(0,'#8a6a42');tg.addColorStop(1,'#4a3520');c.fillStyle=tg;c.beginPath();c.ellipse(x,y-8,r*.34,r*.26,0,0,7);c.fill();stroke(c,3);c.strokeStyle='rgba(30,20,10,.5)';c.lineWidth=2;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(x+i*10,y-24);c.quadraticCurveTo(x+i*13,y-8,x+i*9,y+8);c.stroke()}
for(let i=0;i<22;i++){const a=i*.9,l=r*(.22+(i%4)*.1);c.fillStyle=['#2f8a3a','#3faa48','#237030'][i%3];c.beginPath();c.ellipse(x+Math.cos(a)*l,y-14+Math.sin(a)*l*.6,r*.2,r*.1,a,0,7);c.fill();stroke(c,1.6)}},
roots(c,x,y,o){const L=o.l||120,a=o.a||0;c.lineCap='round';for(const[w,col]of[[18,OL],[13,'#4e3a24'],[4,'#7a5a38']]){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+Math.cos(a)*L*.3,y+Math.sin(a)*L*.3+14,x+Math.cos(a)*L*.7,y+Math.sin(a)*L*.7-10,x+Math.cos(a)*L,y+Math.sin(a)*L);c.stroke()}c.fillStyle='rgba(80,170,70,.5)';c.beginPath();c.ellipse(x+Math.cos(a)*L*.5,y+Math.sin(a)*L*.5-3,L*.18,4,a,0,7);c.fill()},
mush(c,x,y,o){const n=o.n||3;for(let i=0;i<n;i++){const px=x+i*13-n*6,py=y+(i%2)*6,s=.8+(i%3)*.25;c.fillStyle='#d8f0d0';c.fillRect(px-2,py-2,4,9*s);stroke(c,1.4);c.fillStyle=o.c||'#4af0b0';c.beginPath();c.ellipse(px,py-3,9*s,6*s,0,Math.PI,0);c.closePath();c.fill();stroke(c,1.8);c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.arc(px-2,py-6*s,1.6,0,7);c.fill()}GLO(c,x,y,46,'rgba(80,255,190,A)',.35)},
crystal(c,x,y,o){const h=o.h||44;shad(c,x+4,y+4,18,6,.25);for(const[dx,s,rot]of[[-12,.7,-.25],[0,1,0],[12,.8,.3],[5,.55,.12]]){c.save();c.translate(x+dx,y);c.rotate(rot);c.fillStyle='rgba(190,235,255,.92)';c.beginPath();c.moveTo(-6*s,0);c.lineTo(-5*s,-h*s*.75);c.lineTo(0,-h*s);c.lineTo(5*s,-h*s*.75);c.lineTo(6*s,0);c.closePath();c.fill();stroke(c,2);c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.moveTo(-4*s,-2);c.lineTo(-3*s,-h*s*.7);c.lineTo(0,-h*s*.9);c.lineTo(0,-2);c.fill();c.restore()}},
rock(c,x,y,o){const r=o.r||30;shad(c,x+5,y+r*.4,r,r*.4,.3);c.fillStyle=o.c||'#7c8791';c.beginPath();for(let i=0;i<8;i++){const a=i*.785,l=r*(.82+((i*53)%4)/14);c[i?'lineTo':'moveTo'](x+Math.cos(a)*l,y+Math.sin(a)*l*.7)}c.closePath();c.fill();stroke(c,2.5);c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(x-r*.2,y-r*.25,r*.45,r*.2,-.3,0,7);c.fill();if(o.snow){c.fillStyle='#f4f9fc';c.beginPath();c.ellipse(x,y-r*.3,r*.7,r*.28,0,Math.PI,0);c.fill()}},
drift(c,x,y,o){const w=o.w||90,h=o.h||26;c.fillStyle='rgba(120,150,175,.35)';c.beginPath();c.ellipse(x+4,y+h*.3,w/2,h/2,0,0,7);c.fill();c.fillStyle='#f7fbfd';c.beginPath();c.ellipse(x,y,w/2,h/2,0,0,7);c.fill();c.strokeStyle='#9db8ca';c.lineWidth=2;c.stroke();c.fillStyle='#fff';c.beginPath();c.ellipse(x-w*.1,y-h*.15,w*.28,h*.2,0,0,7);c.fill()},
pillar(c,x,y,o){const r=o.r||20;shad(c,x+5,y+r*.6,r*1.1,r*.5,.3);CYL(c,x,y-r*1.4,r,r*1.5,'#b4d8ea',{top:'#eaf8ff'});c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.moveTo(x-r*.6,y-r*1.2);c.lineTo(x-r*.3,y);c.lineTo(x-r*.15,y-r*1.2);c.fill()},
pod(c,x,y,o){const col=o.c||'#59f0b4';shad(c,x+4,y+22,22,8,.3);c.fillStyle='#262c35';rr(c,x-20,y+4,40,18,6);c.fill();stroke(c,2.5);const g=c.createLinearGradient(x-16,0,x+16,0);g.addColorStop(0,'rgba(190,230,230,.55)');g.addColorStop(.5,col);g.addColorStop(1,'rgba(120,180,190,.55)');c.fillStyle=g;c.beginPath();c.moveTo(x-16,y+6);c.lineTo(x-16,y-34);c.ellipse(x,y-34,16,8,0,Math.PI,0);c.lineTo(x+16,y+6);c.closePath();c.fill();stroke(c,2.5);c.fillStyle='rgba(255,255,255,.4)';c.fillRect(x-11,y-34,3,34);c.fillStyle='#262c35';c.beginPath();c.ellipse(x,y-38,16,7,0,0,7);c.fill();stroke(c,2.5);if(o.sp){c.fillStyle=o.sp;c.beginPath();c.ellipse(x,y-12,8,13,0,0,7);c.fill();stroke(c,1.8);c.fillStyle=OL;c.fillRect(x-4,y-17,2,3);c.fillRect(x+2,y-17,2,3)}c.fillStyle=QQ.warn||'#e44';c.fillRect(x-14,y+10,5,3);c.fillStyle='#5f8';c.fillRect(x-6,y+10,5,3)},
bench(c,x,y,o){const w=o.w||110;BX(c,x-w/2,y-16,w,26,14,'#cfd8dc','#7f8e96');for(let i=0;i<Math.max(2,w/38|0);i++){const px=x-w/2+16+i*34;c.fillStyle=['#e86a6a','#6ae8a8','#6ab0e8'][i%3];c.beginPath();c.moveTo(px-5,y-3);c.lineTo(px+5,y-3);c.lineTo(px+8,y+8);c.lineTo(px-8,y+8);c.closePath();c.fill();stroke(c,1.8);c.fillStyle='rgba(255,255,255,.5)';c.fillRect(px-2,y-1,2,6)}if(o.sc)SCR(c,x+w/2-34,y-12,26,13,o.sc)},
sled(c,x,y,o){shad(c,x+4,y+16,38,9,.3);c.fillStyle='#2a303a';rr(c,x-34,y+4,68,10,5);c.fill();stroke(c,2.5);c.fillStyle=o.c||'#d6402e';c.beginPath();c.moveTo(x-30,y+4);c.quadraticCurveTo(x-34,y-14,x-8,y-14);c.lineTo(x+16,y-10);c.quadraticCurveTo(x+34,y-6,x+32,y+4);c.closePath();c.fill();stroke(c,2.5);c.fillStyle='#222a36';rr(c,x-6,y-12,18,10,4);c.fill();stroke(c,2);c.fillStyle='#9fd8ee';c.beginPath();c.ellipse(x+22,y-4,5,4,0,0,7);c.fill();stroke(c,1.6);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x-24,y-10,14,3)},
jeep(c,x,y,o){shad(c,x+5,y+24,50,11,.3);c.fillStyle='#1c2018';for(const dx of[-30,30])for(const dy of[-18,16]){rr(c,x+dx-10,y+dy-5,20,11,4);c.fill();stroke(c,2)}c.fillStyle=o.c||'#5a7a3a';rr(c,x-48,y-20,96,42,10);c.fill();stroke(c,3);c.fillStyle='rgba(255,255,255,.2)';rr(c,x-44,y-17,88,10,5);c.fill();c.fillStyle='#9fd8c8';rr(c,x+8,y-16,30,32,6);c.fill();stroke(c,2);c.fillStyle='#3a4a2a';rr(c,x-40,y-14,44,28,5);c.fill();stroke(c,2);c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=2;for(let i=-34;i<4;i+=8){c.beginPath();c.moveTo(x+i,y-12);c.lineTo(x+i,y+12);c.stroke()}c.fillStyle='#f0e080';c.beginPath();c.arc(x+46,y-8,3,0,7);c.arc(x+46,y+10,3,0,7);c.fill()},
mast(c,x,y,o){shad(c,x+6,y+8,26,10,.3);c.fillStyle='#5a6472';c.beginPath();c.ellipse(x,y,22,12,0,0,7);c.fill();stroke(c,3);c.fillStyle='#3a424e';c.beginPath();c.ellipse(x,y-4,15,8,0,0,7);c.fill();stroke(c,2.5);c.strokeStyle=OL;c.lineWidth=6;c.beginPath();c.moveTo(x,y-4);c.lineTo(x,y-70);c.stroke();c.strokeStyle='#c0c8d4';c.lineWidth=3;c.stroke();c.strokeStyle='#e44';c.lineWidth=3;for(const yy of[-24,-44,-64]){c.beginPath();c.moveTo(x-1,yy+y);c.lineTo(x+1,yy+y-8);c.stroke()}c.strokeStyle='rgba(200,210,225,.7)';c.lineWidth=1.4;for(const a of[0,2.1,4.2]){c.beginPath();c.moveTo(x,y-66);c.lineTo(x+Math.cos(a)*54,y+Math.sin(a)*24);c.stroke()}c.fillStyle='#ff4040';c.beginPath();c.arc(x,y-72,3.5,0,7);c.fill()},
dish(c,x,y,o){const r=o.r||36;shad(c,x+6,y+r*.5,r,r*.5,.3);c.fillStyle='#4a5260';rr(c,x-12,y-4,24,16,4);c.fill();stroke(c,2.5);const g=c.createRadialGradient(x-r*.2,y-r*.5,2,x,y-r*.35,r);g.addColorStop(0,'#fff');g.addColorStop(1,'#a8b4c4');c.fillStyle=g;c.beginPath();c.ellipse(x,y-r*.35,r,r*.78,-.3,0,7);c.fill();stroke(c,3);c.strokeStyle='rgba(90,110,140,.55)';c.lineWidth=1.6;for(let i=1;i<4;i++){c.beginPath();c.ellipse(x,y-r*.35,r*i/4,r*.78*i/4,-.3,0,7);c.stroke()}c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(x,y-r*.35);c.lineTo(x+r*.5,y-r*.95);c.stroke();c.fillStyle='#e44';c.beginPath();c.arc(x+r*.5,y-r*.97,3,0,7);c.fill()},
drill(c,x,y,o){shad(c,x+6,y+20,46,13,.32);BX(c,x-40,y-10,80,22,14,'#d6a02a','#8a6414',{band:'rgba(20,20,20,.7)'});c.fillStyle='#2a303a';rr(c,x-10,y-70,20,64,3);c.fill();stroke(c,3);c.strokeStyle='#9aa4b2';c.lineWidth=3;for(let i=0;i<5;i++){c.beginPath();c.moveTo(x-10,y-64+i*13);c.lineTo(x+10,y-56+i*13);c.stroke()}c.strokeStyle=OL;c.lineWidth=7;c.beginPath();c.moveTo(x-30,y-6);c.lineTo(x-10,y-66);c.moveTo(x+30,y-6);c.lineTo(x+10,y-66);c.stroke();c.strokeStyle='#d6a02a';c.lineWidth=3.5;c.stroke();c.fillStyle='#e44';c.beginPath();c.arc(x,y-74,4,0,7);c.fill()},
reactor(c,x,y,o){const rx=o.rx||80,ry=o.ry||84;shad(c,x+10,y+ry*.2,rx+16,ry*.9,.3);c.fillStyle='#22262e';c.beginPath();c.ellipse(x,y,rx+14,ry+14,0,0,7);c.fill();stroke(c,3.5);const g=c.createRadialGradient(x-20,y-24,6,x,y,rx+14);g.addColorStop(0,'#8f98a8');g.addColorStop(1,'#444b58');c.fillStyle=g;c.beginPath();c.ellipse(x,y,rx+8,ry+8,0,0,7);c.fill();stroke(c,3);c.strokeStyle='rgba(0,0,0,.5)';c.lineWidth=3;c.beginPath();for(let i=0;i<12;i++){const a=i*.5236;c.moveTo(x+Math.cos(a)*(rx-6),y+Math.sin(a)*(ry-6));c.lineTo(x+Math.cos(a)*(rx+8),y+Math.sin(a)*(ry+8))}c.stroke();c.fillStyle='#161a22';c.beginPath();c.ellipse(x,y,rx-10,ry-10,0,0,7);c.fill();stroke(c,3);const rg=c.createRadialGradient(x,y,4,x,y,rx-14);rg.addColorStop(0,'#fff6c8');rg.addColorStop(.28,'#ffb840');rg.addColorStop(.7,'#d8481c');rg.addColorStop(1,'#5a1608');c.fillStyle=rg;c.beginPath();c.ellipse(x,y,rx-18,ry-18,0,0,7);c.fill();c.strokeStyle='rgba(255,230,160,.5)';c.lineWidth=2;for(let i=1;i<4;i++){c.beginPath();c.ellipse(x,y,(rx-18)*i/4,(ry-18)*i/4,0,0,7);c.stroke()}c.fillStyle='rgba(255,255,255,.22)';c.beginPath();c.ellipse(x-rx*.28,y-ry*.4,rx*.3,ry*.12,-.5,0,7);c.fill();for(let i=0;i<4;i++){const a=i*1.5708+.785;c.fillStyle='#e0b72a';c.fillRect(x+Math.cos(a)*(rx+2)-6,y+Math.sin(a)*(ry+2)-3,12,6);c.strokeStyle=OL;c.lineWidth=1.6;c.strokeRect(x+Math.cos(a)*(rx+2)-6,y+Math.sin(a)*(ry+2)-3,12,6)}},
holo(c,x,y,o){const r=o.r||52;shad(c,x+5,y+8,r,r*.4,.3);c.fillStyle='#2a3342';c.beginPath();c.ellipse(x,y,r,r*.6,0,0,7);c.fill();stroke(c,3);c.fillStyle='#10141e';c.beginPath();c.ellipse(x,y-4,r*.82,r*.48,0,0,7);c.fill();stroke(c,2.5);c.strokeStyle='rgba(90,200,255,.7)';c.lineWidth=1.8;for(let i=1;i<4;i++){c.beginPath();c.ellipse(x,y-4,r*.82*i/3,r*.48*i/3,0,0,7);c.stroke()}c.beginPath();c.moveTo(x-r*.82,y-4);c.lineTo(x+r*.82,y-4);c.moveTo(x,y-4-r*.48);c.lineTo(x,y-4+r*.48);c.stroke();c.fillStyle=QQ.glow;for(let i=0;i<6;i++){c.beginPath();c.arc(x+Math.cos(i*1.05)*r*.5,y-4+Math.sin(i*1.05)*r*.28,2.4,0,7);c.fill()}GLO(c,x,y-6,r*1.5,'rgba(90,200,255,A)',.28)},
bar(c,x,y,o){const w=o.w||180;BX(c,x-w/2,y-14,w,24,14,'#c8c0aa','#7a7260');c.fillStyle='rgba(0,0,0,.28)';c.fillRect(x-w/2+6,y+10,w-12,3);for(let i=0;i<w/36|0;i++){c.fillStyle=['#e86a6a','#e8c36a','#6ab0e8'][i%3];c.beginPath();c.arc(x-w/2+20+i*36,y-3,6,0,7);c.fill();stroke(c,1.8)}},
vending(c,x,y,o){BX(c,x-17,y-26,34,16,34,o.c||'#d44a4a',shade(o.c||'#d44a4a',-.25));SCR(c,x-12,y-8,24,18,'#7ff');c.fillStyle='#10141c';c.fillRect(x-12,y+14,24,8);c.fillStyle='#fff6';c.fillRect(x-13,y-24,26,2)},
sofa(c,x,y,o){const w=o.w||90;shad(c,x+3,y+16,w/2,8,.25);c.fillStyle=o.c||'#7a5a8a';rr(c,x-w/2,y-16,w,34,9);c.fill();stroke(c,2.5);c.fillStyle=shade(o.c||'#7a5a8a',.18);rr(c,x-w/2+5,y-10,w-10,20,6);c.fill();stroke(c,1.8);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1.6;for(let i=1;i<w/40|0;i++){c.beginPath();c.moveTo(x-w/2+i*40,y-10);c.lineTo(x-w/2+i*40,y+10);c.stroke()}},
cart(c,x,y,o){BX(c,x-24,y-12,48,24,10,'#b8c0c8','#6a727c');c.fillStyle='#222a36';for(const dx of[-18,18]){c.beginPath();c.ellipse(x+dx,y+24,6,4,0,0,7);c.fill()}c.fillStyle=o.c||'#7ac8a0';c.fillRect(x-18,y-8,16,12);c.fillStyle='#e86a6a';c.fillRect(x+2,y-8,14,12);c.strokeStyle=OL;c.lineWidth=1.6;c.strokeRect(x-18,y-8,16,12);c.strokeRect(x+2,y-8,14,12)},
fan(c,x,y,o){const r=o.r||20;c.fillStyle='#0c1018';c.beginPath();c.arc(x,y,r,0,7);c.fill();stroke(c,3);c.strokeStyle='rgba(130,150,180,.6)';c.lineWidth=2;for(let i=0;i<4;i++){c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(i*1.57+.4)*(r-3),y+Math.sin(i*1.57+.4)*(r-3));c.stroke()}c.fillStyle='#39414f';c.beginPath();c.arc(x,y,4,0,7);c.fill()},
hatch(c,x,y,o){const w=o.w||60,h=o.h||34;c.fillStyle='#14181f';rr(c,x-w/2,y-h/2,w,h,6);c.fill();stroke(c,3);c.fillStyle='#5b6472';rr(c,x-w/2+4,y-h/2+4,w-8,h-8,4);c.fill();stroke(c,1.6)},
lamp(c,x,y,o){GLO(c,x,y,o.r||110,o.c||'rgba(255,240,200,A)',o.a||.22)},
rail(c,x,y,o){c.lineCap='round';c.strokeStyle=OL;c.lineWidth=8;c.beginPath();c.moveTo(x,y);c.lineTo(o.x2,o.y2);c.stroke();c.strokeStyle=o.c||'#d9b030';c.lineWidth=4.5;c.stroke();c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=1.4;c.beginPath();c.moveTo(x,y-1);c.lineTo(o.x2,o.y2-1);c.stroke()},
hazard(c,x,y,o){const w=o.w||80,h=o.h||14;c.save();rr(c,x-w/2,y-h/2,w,h,2);c.clip();c.fillStyle='#e0b72a';c.fillRect(x-w/2,y-h/2,w,h);c.fillStyle='#16181e';for(let i=-h;i<w+h;i+=h*1.1){c.beginPath();c.moveTo(x-w/2+i,y+h/2);c.lineTo(x-w/2+i+h*.55,y+h/2);c.lineTo(x-w/2+i+h*1.1,y-h/2);c.lineTo(x-w/2+i+h*.55,y-h/2);c.fill()}c.restore();c.lineWidth=2;c.strokeStyle=OL;c.strokeRect(x-w/2,y-h/2,w,h)},
ring(c,x,y,o){c.save();c.globalAlpha=o.a||.5;c.strokeStyle=o.c||'#e0b72a';c.lineWidth=o.w||4;c.setLineDash(o.d||[16,10]);c.beginPath();c.ellipse(x,y,o.rx,o.ry,0,0,7);c.stroke();c.restore()},
decal(c,x,y,o){c.save();c.globalAlpha=o.a||.4;c.fillStyle=o.c||'#fff';c.font=(o.f||'900 26px')+' system-ui';c.textAlign='center';c.fillText(o.t,x,y);c.restore()},
bush(c,x,y,o){PR.plant(c,x,y,{r:o.r||26,c:o.c})},
pond(c,x,y,o){const rx=o.rx||80,ry=o.ry||40;c.fillStyle=OL;c.beginPath();c.ellipse(x,y,rx+7,ry+7,0,0,7);c.fill();c.fillStyle='#5e6a4a';c.beginPath();c.ellipse(x,y,rx+3,ry+3,0,0,7);c.fill();const g=c.createRadialGradient(x-rx*.2,y-ry*.2,4,x,y,rx);g.addColorStop(0,'#56d8c8');g.addColorStop(1,'#1c6a74');c.fillStyle=g;c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fill();c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=1.6;for(let i=0;i<4;i++){c.beginPath();c.ellipse(x+(i-1.5)*rx*.3,y+(i%2?1:-1)*ry*.2,rx*.16,ry*.1,0,0,Math.PI);c.stroke()}c.fillStyle='#3d9a40';for(const[a,b]of[[.6,.3],[-.5,.5],[.1,-.55]]){c.beginPath();c.ellipse(x+a*rx,y+b*ry,12,7,a,0,7);c.fill();stroke(c,1.8)}}};
// ---- task machines: one per task slot (card reader, scanner, star table, steering, server, wiring, manifold, fuel pump)
const MACH=[
(c,x,y)=>{BX(c,x-14,y-20,28,24,12,QQ.console,shade(QQ.console,-.25));SCR(c,x-10,y-17,20,11,QQ.glow2||'#5f8');c.fillStyle='#10141c';c.fillRect(x-9,y-1,18,4);c.fillStyle='#e8c53a';c.fillRect(x-7,y-1,10,2);BTN(c,x-8,y+10,3,8)},
(c,x,y)=>{shad(c,x+4,y+20,26,8,.3);c.fillStyle='#2a3342';rr(c,x-26,y-6,52,24,8);c.fill();stroke(c,2.5);const g=c.createLinearGradient(x-20,0,x+20,0);g.addColorStop(0,'#cfe4ee');g.addColorStop(.5,'#fff');g.addColorStop(1,'#9fb8c6');c.fillStyle=g;c.beginPath();c.moveTo(x-22,y-4);c.lineTo(x-20,y-24);c.ellipse(x,y-24,20,8,0,Math.PI,0);c.lineTo(x+22,y-4);c.closePath();c.fill();stroke(c,2.5);c.fillStyle='rgba(60,200,230,.5)';c.beginPath();c.ellipse(x,y-14,13,9,0,0,7);c.fill();stroke(c,1.6);BTN(c,x-10,y+10,3,9)},
(c,x,y)=>{BX(c,x-26,y-20,52,34,10,'#2a3a52','#18222f');c.fillStyle='#0a1220';rr(c,x-22,y-16,44,26,4);c.fill();c.strokeStyle='rgba(90,200,255,.75)';c.lineWidth=1.3;c.beginPath();for(let i=1;i<4;i++){c.moveTo(x-22+i*11,y-16);c.lineTo(x-22+i*11,y+10)}for(let i=1;i<3;i++){c.moveTo(x-22,y-16+i*8.6);c.lineTo(x+22,y-16+i*8.6)}c.stroke();c.fillStyle='#ffe480';for(const[a,b]of[[-12,-6],[4,2],[14,-9],[-4,-12]]){c.beginPath();c.arc(x+a,y+b,1.8,0,7);c.fill()}c.strokeStyle='#f55';c.lineWidth=1.6;c.beginPath();c.moveTo(x-12,y-6);c.lineTo(x+4,y+2);c.lineTo(x+14,y-9);c.stroke()},
(c,x,y)=>{BX(c,x-20,y-8,40,20,12,QQ.console,shade(QQ.console,-.25));c.fillStyle='#10141c';c.beginPath();c.arc(x,y-14,17,0,7);c.fill();stroke(c,2.5);c.strokeStyle='#cfd6df';c.lineWidth=3;c.beginPath();c.arc(x,y-14,12,0,7);c.stroke();for(let i=0;i<6;i++){c.beginPath();c.moveTo(x,y-14);c.lineTo(x+Math.cos(i*1.047)*17,y-14+Math.sin(i*1.047)*17);c.stroke()}c.fillStyle='#e0b72a';c.beginPath();c.arc(x,y-14,3.5,0,7);c.fill();stroke(c,1.5);BTN(c,x-10,y+4,3,9)},
(c,x,y)=>{BX(c,x-20,y-22,40,10,34,QQ.rack,shade(QQ.rack,-.25));c.fillStyle='#0c121c';c.fillRect(x-16,y-10,32,26);for(let k=0;k<4;k++){c.fillStyle=k%2?QQ.led:'#e44';c.fillRect(x-13,y-7+k*6,3,2.5);c.fillStyle='rgba(170,200,230,.55)';c.fillRect(x-7,y-7+k*6,18,2.5)}SCR(c,x-12,y+8,24,9,QQ.glow2||'#5f8')},
(c,x,y)=>{BX(c,x-22,y-20,44,34,6,'#59606c','#363c46');c.fillStyle='#10141c';rr(c,x-17,y-16,34,26,3);c.fill();stroke(c,2);for(const[col,yy]of[['#e33',-12],['#38f',-6],['#fd2',0],['#e5e',6]]){c.strokeStyle=col;c.lineWidth=2.4;c.beginPath();c.moveTo(x-17,y+yy);c.bezierCurveTo(x-6,y+yy-8,x+4,y+yy+8,x+15,y+yy+((yy*7)%5)-2);c.stroke();c.fillStyle=col;c.beginPath();c.arc(x-17,y+yy,2.4,0,7);c.arc(x+16,y+yy,2.4,0,7);c.fill()}c.strokeStyle='#fd2';c.lineWidth=2;c.beginPath();c.moveTo(x-12,y+16);c.quadraticCurveTo(x-6,y+34,x+8,y+28);c.stroke()},
(c,x,y)=>{BX(c,x-24,y-4,48,14,12,QQ.metal,shade(QQ.metal,-.3));c.lineCap='round';for(const[lw,st]of[[9,OL],[5,QQ.pipe]]){c.strokeStyle=st;c.lineWidth=lw;c.beginPath();c.moveTo(x-22,y-14);c.lineTo(x+22,y-14);c.moveTo(x-12,y-14);c.lineTo(x-12,y-2);c.moveTo(x+12,y-14);c.lineTo(x+12,y-2);c.stroke()}for(const dx of[-12,12]){c.fillStyle='#d6402e';c.beginPath();c.arc(x+dx,y-20,6,0,7);c.fill();stroke(c,2);c.strokeStyle='#fff';c.lineWidth=1.6;c.beginPath();c.moveTo(x+dx-4,y-20);c.lineTo(x+dx+4,y-20);c.stroke()}BTN(c,x-8,y+14,3,8)},
(c,x,y)=>{BX(c,x-22,y-4,44,14,12,QQ.metal,shade(QQ.metal,-.3));CYL(c,x-10,y-26,12,26,'#c64a34',{band:'rgba(0,0,0,.3)'});c.strokeStyle=OL;c.lineWidth=6;c.beginPath();c.moveTo(x+6,y-12);c.lineTo(x+22,y-12);c.lineTo(x+22,y+2);c.stroke();c.strokeStyle='#2a303a';c.lineWidth=3;c.stroke();SCR(c,x+8,y-22,12,9,'#5f8');c.fillStyle='#e0b72a';c.fillRect(x-24,y+12,18,3)}];

// ---------- art: map baker (walls, floors, ambient occlusion, faces, doors, props, lights) ----------
let fc=null,fk='';const WT=14,FH=26;
const curDef=()=>WALK==GWALK?MAPS[me.map|0]:LOBBY;
function shapesOf(def){const L=[];(def.rooms).forEach(r=>{const fl=r.fl||def.fl,st=r.o?'out':'in';L.push({s:[r.x,r.y,r.w,r.h,r.t,r.k],fl,st,r,main:1});(r.parts||[]).forEach(p=>L.push({s:p,fl,st,r}))});(def.corr||[]).forEach(a=>L.push({s:a,fl:a[7]||def.cfl,st:a[6]||'in',c:1}));return L}
function pathOf(c,L,d){c.beginPath();L.forEach(o=>sp(c,o.s,d))}
function topEdge(s){const t=s[4],k=s[5]||0;if(t=='e')return null;if(t=='o'||t=='c')return[s[0]+k,s[0]+s[2]-k,s[1]];return[s[0],s[0]+s[2],s[1]]}
function faceDraw(c,def,xa,xb,y){const W=xb-xa,Wc=def.Wc.in,y0=y-FH,st=def.style;
c.fillStyle=Wc[2];c.fillRect(xa-4,y0-12,W+8,12);c.strokeStyle=OL;c.lineWidth=3;c.strokeRect(xa-4,y0-12,W+8,12);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(xa-2,y0-10,W+4,2);
const g=c.createLinearGradient(0,y0,0,y);g.addColorStop(0,def.fc[0]);g.addColorStop(1,def.fc[1]);c.fillStyle=g;c.fillRect(xa,y0,W,FH);c.strokeRect(xa,y0,W,FH);
c.fillStyle='rgba(255,255,255,.14)';c.fillRect(xa+1.5,y0+1.5,W-3,2);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(xa+1.5,y-4,W-3,3);
c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=1.5;c.beginPath();for(let x=xa+56;x<xb-10;x+=56){c.moveTo(x,y0+1);c.lineTo(x,y-1)}c.stroke();
const n=Math.max(1,Math.round(W/70)),sw=W/n;
for(let i=0;i<n;i++){const cxm=xa+(i+.5)*sw,k=(i+(xa|0)/7|0)%3;
if(st=='ship'){if(k==0){SCR(c,cxm-20,y0+5,40,14,i%2?def.Q.glow:def.Q.glow2,{graph:1})}else if(k==1){c.fillStyle='#10141c';c.fillRect(cxm-16,y0+5,32,14);c.strokeStyle='#6c7586';c.lineWidth=2;for(let v=-12;v<=12;v+=6){c.beginPath();c.moveTo(cxm+v,y0+6);c.lineTo(cxm+v,y0+18);c.stroke()}c.strokeStyle=OL;c.lineWidth=2;c.strokeRect(cxm-16,y0+5,32,14)}else{c.fillStyle='#0b1220';c.beginPath();c.arc(cxm,y0+13,8.5,0,7);c.fill();c.strokeStyle='#8a93a3';c.lineWidth=3;c.stroke();c.strokeStyle=OL;c.lineWidth=1.5;c.beginPath();c.arc(cxm,y0+13,10.2,0,7);c.stroke();c.fillStyle='rgba(255,255,255,.7)';c.fillRect(cxm-3,y0+9,1.6,1.6);c.fillRect(cxm+2,y0+14,1.2,1.2)}}
else if(st=='ice'){const q=c.createLinearGradient(0,y0+4,0,y0+22);q.addColorStop(0,'#eaf8ff');q.addColorStop(1,'#9fc4da');c.fillStyle=q;c.fillRect(cxm-22,y0+4,44,18);c.strokeStyle='#4a6a82';c.lineWidth=2.4;c.strokeRect(cxm-22,y0+4,44,18);c.beginPath();c.moveTo(cxm,y0+4);c.lineTo(cxm,y0+22);c.stroke();c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1.2;c.beginPath();c.moveTo(cxm-16,y0+8);c.lineTo(cxm-8,y0+15);c.moveTo(cxm+6,y0+8);c.lineTo(cxm+16,y0+13);c.stroke();if(k==2){c.fillStyle='#5a6672';c.fillRect(cxm-30,y0+24,60,2)}}
else{c.fillStyle='#2a3624';c.fillRect(cxm-18,y0+5,36,15);if(k==0){c.fillStyle='#46c878';c.fillRect(cxm-16,y0+7,32,11);c.strokeStyle='#0a1a0a';c.lineWidth=1.4;c.beginPath();c.moveTo(cxm-6,y0+7);c.lineTo(cxm+2,y0+13);c.lineTo(cxm-2,y0+18);c.stroke()}c.strokeStyle=OL;c.lineWidth=2;c.strokeRect(cxm-18,y0+5,36,15);c.strokeStyle='#3f8a34';c.lineWidth=3;c.lineCap='round';for(let v=0;v<2;v++){const vx=cxm-24+v*38+(k*5),vl=10+((i*13+v*7)%12);c.beginPath();c.moveTo(vx,y0+1);c.quadraticCurveTo(vx+6,y0+vl*.5,vx-2,y0+vl+8);c.stroke();c.strokeStyle='#6ac858';c.lineWidth=1.3;c.stroke();c.strokeStyle='#3f8a34';c.lineWidth=3}}}
if(st=='ice'){c.fillStyle='#e8f6ff';c.strokeStyle='#6a8aa2';c.lineWidth=1.3;for(let x=xa+8;x<xb-6;x+=16+((x*7)%9)){const h=5+((x*13)%9);c.beginPath();c.moveTo(x,y0-1);c.lineTo(x+4,y0-1);c.lineTo(x+2,y0+h);c.closePath();c.fill();c.stroke()}}
if(st=='ruin'){c.fillStyle='rgba(80,170,70,.7)';for(let x=xa+14;x<xb-10;x+=40){c.beginPath();c.ellipse(x,y0-9,13,5,((x*3)%5)/5,0,7);c.fill()}}
const sh=c.createLinearGradient(0,y,0,y+20);sh.addColorStop(0,'rgba(0,0,0,.42)');sh.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sh;c.fillRect(xa,y,W,20)}
function doorDraw(c,def,x,y,dir,len){c.save();c.translate(x,y);if(dir=='h')c.rotate(-Math.PI/2);const Wc=def.Wc.in;c.fillStyle='rgba(0,0,0,.28)';c.fillRect(-5,-len/2,10,len);c.fillStyle='#14181f';c.fillRect(-3,-len/2,6,len);
for(const sgn of[-1,1]){const py=sgn*len/2;c.fillStyle=Wc[2];c.fillRect(-9,py-(sgn>0?0:11),18,11);c.strokeStyle=OL;c.lineWidth=2.5;c.strokeRect(-9,py-(sgn>0?0:11),18,11);c.fillStyle=def.Q.led;c.fillRect(-3,py-(sgn>0?7:4),6,3)}
c.fillStyle='#e0b72a';for(let i=-len/2+14;i<len/2-14;i+=10){c.fillRect(-9,i,3,5);c.fillRect(6,i,3,5)}c.restore()}
function ebDraw(c,def,x,y){const Q=def.Q;shad(c,x+8,y+14,96,40,.32);c.fillStyle='#2a303b';c.beginPath();c.ellipse(x,y+6,88,50,0,0,7);c.fill();stroke(c,4);const g=c.createLinearGradient(x-80,y-50,x+80,y+40);g.addColorStop(0,'#f0f4f8');g.addColorStop(1,'#a5b0be');c.fillStyle=g;c.beginPath();c.ellipse(x,y-2,84,44,0,0,7);c.fill();stroke(c,3.5);c.strokeStyle='rgba(60,80,110,.45)';c.lineWidth=2;c.beginPath();c.ellipse(x,y-2,68,34,0,0,7);c.stroke();c.fillStyle='#222a38';rr(c,x-26,y-18,52,28,6);c.fill();stroke(c,2.5);c.fillStyle=Q.glow;rr(c,x-21,y-14,42,12,3);c.fill();c.fillStyle='#c01818';c.beginPath();c.arc(x,y+2,8,0,7);c.fill();stroke(c,2);c.fillStyle='#ff6a6a';c.beginPath();c.arc(x-2,y,3.2,0,7);c.fill();c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(x-34,y-20,26,5,-.4,0,7);c.fill()}
function ventDraw(c,def,x,y){const Wc=def.Wc.in;c.fillStyle='rgba(0,0,0,.4)';rr(c,x-30,y-14,64,38,8);c.fill();c.fillStyle='#0b0e14';rr(c,x-30,y-18,60,34,7);c.fill();stroke(c,3);const g=c.createLinearGradient(0,y-14,0,y+12);g.addColorStop(0,'#99a2b2');g.addColorStop(1,'#4f5664');c.fillStyle=g;rr(c,x-26,y-14,52,26,5);c.fill();stroke(c,2);c.fillStyle='#0d1118';rr(c,x-21,y-10,42,18,3);c.fill();c.strokeStyle='#6c7586';c.lineWidth=3;c.beginPath();for(let i=-15;i<=15;i+=6){c.moveTo(x+i,y-9);c.lineTo(x+i-2,y+7)}c.stroke();c.fillStyle='rgba(255,255,255,.4)';c.fillRect(x-24,y-13,48,2);for(const dx of[-23,23]){c.fillStyle='#39414f';c.beginPath();c.arc(x+dx,y-11,2,0,7);c.fill()}}
function bake(c,def){QQ=def.Q;const L=shapesOf(def),Lr=L.filter(o=>o.main&&!o.r.nf),Wc=def.Wc,T=WT;
if(def.ground){c.fillStyle=tilePat(c,def.ground);c.fillRect(-10,-10,1850,1050);if(def.deco)def.deco(c);c.save();c.globalCompositeOperation='destination-out';for(const[a,b,w,h,ho]of[[-10,-10,1850,70,0],[-10,980,1850,70,1],[-10,-10,70,1050,2],[1770,-10,70,1050,3]]){const gr=ho<2?c.createLinearGradient(0,ho?b+h:b,0,ho?b:b+h):c.createLinearGradient(ho==2?a:a+w,0,ho==2?a+w:a,0);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gr;c.fillRect(a,b,w,h)}c.restore()}
// walls (outdoor rims first, then indoor bulkheads)
for(const st of['out','in']){const S=L.filter(o=>o.st==st);if(!S.length)continue;const w=Wc[st];pathOf(c,S,T+3);c.fillStyle=OL;c.fill();pathOf(c,S,T);c.fillStyle=w[0];c.fill();pathOf(c,S,T-3);c.fillStyle=w[2];c.fill();c.save();c.translate(0,-1.2);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1.5;c.stroke();c.restore();pathOf(c,S,3);c.fillStyle=w[1];c.fill();pathOf(c,S,.5);c.strokeStyle=OL;c.lineWidth=2;c.stroke();
if(st=='in'&&def.rim){pathOf(c,S,T-6);c.strokeStyle=def.rim;c.lineWidth=1.6;c.globalAlpha=.65;c.stroke();c.globalAlpha=1}}
// floors
for(const o of[...L.filter(o=>o.c),...L.filter(o=>!o.c)]){c.fillStyle=tilePat(c,o.fl||'deck');c.beginPath();sp(c,o.s,0);c.fill()}
for(const o of L)if(o.main&&o.r.col){c.globalAlpha=o.r.ta||.2;c.fillStyle=o.r.col;c.beginPath();sp(c,o.s,0);c.fill();c.globalAlpha=1;(o.r.parts||[]).forEach(p=>{c.globalAlpha=o.r.ta||.2;c.beginPath();sp(c,p,0);c.fill();c.globalAlpha=1})}
// ambient occlusion from walls
const M=document.createElement('canvas');M.width=fc.width;M.height=fc.height;const m=M.getContext('2d');m.fillStyle='#000';m.fillRect(0,0,M.width,M.height);m.globalCompositeOperation='destination-out';m.setTransform(2,0,0,2,20,20);pathOf(m,L,0);m.fill();
for(const[bl,al]of[[34,.6],[9,.4]]){c.save();pathOf(c,L,0);c.clip();c.setTransform(1,0,0,1,0,0);c.shadowColor='rgba(0,0,0,'+al+')';c.shadowBlur=bl;c.shadowOffsetX=30000;c.drawImage(M,-30000,0);c.restore()}
// room trims + rim light
c.lineJoin='round';for(const o of L){if(!o.main)continue;const col=o.r.col||'#fff';c.strokeStyle=col;c.globalAlpha=.55;c.lineWidth=3;c.beginPath();sp(c,o.s,-8);c.stroke();c.globalAlpha=.22;c.lineWidth=1.5;c.beginPath();sp(c,o.s,-13);c.stroke();c.globalAlpha=1}
pathOf(c,L,-.5);c.strokeStyle='rgba(255,255,255,.16)';c.lineWidth=1.5;c.stroke();
// decals under props
(def.decals||[]).forEach(d=>PR[d[0]](c,d[1],d[2],d[3]||{}));
// door frames
(def.doors||[]).forEach(d=>doorDraw(c,def,d[0],d[1],d[2],d[3]));
// north wall faces
const open=(x,y)=>WALK.some(r=>inR(x,y,r));
for(const o of Lr){const e=topEdge(o.s);if(!e)continue;let run=null;const y=e[2];for(let x=e[0];x<=e[1]+1;x+=6){const ok=x<=e[1]&&!open(x,y-8)&&!open(x,y-FH-4);if(ok&&run===null)run=x;if((!ok||x+6>e[1]+1)&&run!==null){const xb=ok?x:x-6;if(xb-run>=44)faceDraw(c,def,run,xb,y);run=null}}}
// props, vents, machines, emergency table
const pr=[...(def.props||[])].sort((a,b)=>a[2]-b[2]);pr.forEach(p=>{if(p[0]!='lamp')PR[p[0]](c,p[1],p[2],p[3]||{})});
(def.vents).forEach(v=>ventDraw(c,def,v[0],v[1]));
if(def.st)def.st.forEach((s,i)=>{shad(c,s[0],s[1]+14,26,9,.3);MACH[i](c,s[0],s[1])});
if(def.eb)ebDraw(c,def,def.eb[0],def.eb[1]);
// room names (faint, on the floor)
c.textAlign='center';c.font='800 17px system-ui';for(const o of L){if(!o.main||o.r.nl)continue;const lb=o.r.lb||[o.s[0]+o.s[2]/2,o.s[1]+o.s[3]-16];c.globalAlpha=.3;c.fillStyle=o.r.lc||def.lbl||'#000';c.fillText(o.r.n.toUpperCase().split('').join(String.fromCharCode(8202)),lb[0],lb[1]);c.globalAlpha=1}
// lighting
for(const o of L){if(!o.main)continue;const s=o.s,cxm=s[0]+s[2]/2,cym=s[1]+s[3]/2,col=o.r.col||'#fff',rg=Math.max(s[2],s[3])*.62;c.save();c.globalCompositeOperation=def.lm||'lighter';const g=c.createRadialGradient(cxm,cym,8,cxm,cym,rg);g.addColorStop(0,def.lt);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();sp(c,s,0);c.clip();c.fillRect(cxm-rg,cym-rg,rg*2,rg*2);c.restore()}
(def.props||[]).forEach(p=>{if(p[0]=='lamp')PR.lamp(c,p[1],p[2],p[3]||{})});
(def.lights||[]).forEach(l=>GLO(c,l[0],l[1],l[2],l[3],l[4]));
// extra wall-lights along the face of rooms
if(def.post)def.post(c)}
function buildFloor(){const def=curDef(),key=WALK==GWALK?'g'+(me.map|0):'l';if(fk==key&&fc)return;fk=key;fc=fc||document.createElement('canvas');fc.width=3700;fc.height=2100;const c=fc.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,3700,2100);c.setTransform(2,0,0,2,20,20);bake(c,def)}
function drawFloor(){buildFloor();cx.drawImage(fc,-10,-10,1850,1050)}
// ---------- animated layer (screens, reactor pulse, fans, glow plants) drawn live every frame in world space ----------
function leds(){const def=curDef(),t=performance.now()/1000;
if(G&&WALK==GWALK&&def.st){def.st.forEach((s,i)=>{const on=((t*1.6+i*.7)|0)%2;cx.fillStyle=on?def.Q.led:'#12202c';cx.fillRect(s[0]-12,s[1]+(i==5?18:12),4,3);cx.fillRect(s[0]+8,s[1]+(i==5?18:12),4,3)})}
(def.anim||[]).forEach(a=>{const k=a[0],x=a[1],y=a[2];
if(k=='pulse'){const r=a[3]*(1+.07*Math.sin(t*a[6]+x)),al=a[5]*(.65+.35*Math.sin(t*a[6]*1.3+y));cx.save();cx.globalCompositeOperation=def.lm||'lighter';const g=cx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,a[4].replace('A',al));g.addColorStop(1,a[4].replace('A',0));cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2);cx.restore()}
else if(k=='fan'){const r=a[3];cx.save();cx.translate(x,y);cx.rotate(t*a[4]);cx.strokeStyle='rgba(170,190,220,.75)';cx.lineWidth=2.4;cx.beginPath();for(let i=0;i<4;i++){cx.moveTo(0,0);cx.lineTo(Math.cos(i*1.571)*(r-3),Math.sin(i*1.571)*(r-3))}cx.stroke();cx.restore()}
else if(k=='blink'){if(((t*a[4]+x)|0)%2){cx.fillStyle=a[3];cx.beginPath();cx.arc(x,y,2.6,0,7);cx.fill();cx.globalAlpha=.3;cx.beginPath();cx.arc(x,y,6,0,7);cx.fill();cx.globalAlpha=1}}
else if(k=='scan'){const yy=y+((t*a[4])%1)*a[3];cx.fillStyle='rgba(120,230,255,.35)';cx.fillRect(x-a[5]/2,yy,a[5],2)}})}
const PX=Array.from({length:60},()=>({x:RND(),y:RND(),z:.4+RND()*.6,p:RND()*6}));
function fx2(){if(!G||WALK!=GWALK)return;const m=me.map|0,t=performance.now()/1000;cx.save();PX.forEach(q=>{
if(m==1){cx.globalAlpha=.8;cx.fillStyle='#fff';cx.beginPath();cx.arc(((q.x+Math.sin(t*.6+q.p)*.02)%1+1)%1*W,(q.y+t*.06*q.z)%1*H,1+q.z*2,0,7);cx.fill()}
else if(m==2){const x=((q.x+Math.sin(t*.3+q.p)*.05)%1+1)%1*W,y=((q.y+Math.cos(t*.25+q.p)*.05)%1+1)%1*H,a=.3+.7*Math.abs(Math.sin(t*1.5+q.p));cx.globalAlpha=a*.25;cx.fillStyle='#9f5';cx.beginPath();cx.arc(x,y,7,0,7);cx.fill();cx.globalAlpha=a;cx.fillStyle='#e8ff8a';cx.beginPath();cx.arc(x,y,2+q.z,0,7);cx.fill()}
else{cx.globalAlpha=.2;cx.fillStyle='#9cf';cx.fillRect((q.x+t*.01*q.z)%1*W,(q.y+t*.004)%1*H,2,2)}});cx.restore()}

// ---------- map data helpers: place a prop and (optionally) its collision footprint in one call ----------
const FP={crate:o=>[-(o.s||40)/2,-(o.s||40)/2,o.s||40,(o.s||40)*1.08],console:o=>[-(o.w||90)/2,-12,o.w||90,34],turbine:o=>[-(o.w||150)/2,-(o.h||70)/2,o.w||150,(o.h||70)+16],genset:o=>[-(o.w||110)/2,-(o.h||60)/2,o.w||110,(o.h||60)+16],table:o=>[-(o.w||90)/2,-(o.h||46)/2,o.w||90,(o.h||46)+9],rack:o=>[-(o.w||80)/2,-16,o.w||80,44],locker:o=>[-(o.w||80)/2,-14,o.w||80,40],bed:()=>[-22,-34,44,76],bunk:()=>[-24,-36,48,84],bench:o=>[-(o.w||110)/2,-16,o.w||110,40],tank:o=>[-(o.r||26),(o.h||50)/2-(o.r||26)*.5-2,(o.r||26)*2,(o.r||26)+4],pod:()=>[-20,-2,40,26],plant:o=>[-(o.r||22)*.7,-(o.r||22)*.2,(o.r||22)*1.4,(o.r||22)*.8],bush:o=>[-(o.r||26)*.7,-(o.r||26)*.2,(o.r||26)*1.4,(o.r||26)*.8],sofa:o=>[-(o.w||90)/2,-16,o.w||90,34],mast:()=>[-20,-12,40,24],jeep:()=>[-48,-20,96,42],sled:()=>[-34,-14,68,30],drill:()=>[-40,-10,80,36],tree:()=>[-30,-18,60,36],rock:o=>[-(o.r||30)*.8,-(o.r||30)*.35,(o.r||30)*1.6,(o.r||30)*.7],pillar:o=>[-(o.r||20),-(o.r||20)*.6,(o.r||20)*2,(o.r||20)*1.2],holo:o=>[-(o.r||52)*.9,-(o.r||52)*.3,(o.r||52)*1.8,(o.r||52)*.8],bar:o=>[-(o.w||180)/2,-14,o.w||180,38],vending:()=>[-17,-24,34,48],dish:o=>[-(o.r||36)*.6,-(o.r||36)*.2,(o.r||36)*1.2,(o.r||36)*.7],cart:()=>[-24,-12,48,34],crystal:()=>[-18,-6,36,14],pond:o=>[-(o.rx||80),-(o.ry||40),(o.rx||80)*2,(o.ry||40)*2,'e'],reactor:o=>[-(o.rx||80),-(o.ry||84),(o.rx||80)*2,(o.ry||84)*2,'e']};
function Pp(D,type,x,y,o,solid){o=o||{};D.props.push([type,x,y,o]);if(solid===undefined)solid=!!FP[type]&&!o.ns;if(solid&&FP[type]){const f=FP[type](o);D.sol.push([x+f[0],y+f[1],f[2],f[3],f[4]])}}
const newDef=d=>Object.assign({props:[],sol:[],decals:[],doors:[],lights:[],anim:[],corr:[],rooms:[],vents:[],vn:[],st:[]},d);
// doors on both ends of every corridor, skipped where the end sits inside an outdoor room
function autoDoors(D){const out=D.rooms.filter(r=>r.o).map(r=>[r.x,r.y,r.w,r.h,r.t,r.k]);D.corr.forEach(c=>{const h=c[2]>c[3],e=h?[[c[0]+5,c[1]+c[3]/2,'v',c[3]],[c[0]+c[2]-5,c[1]+c[3]/2,'v',c[3]]]:[[c[0]+c[2]/2,c[1]+5,'h',c[2]],[c[0]+c[2]/2,c[1]+c[3]-5,'h',c[2]]];e.forEach(d=>{if(!out.some(r=>inR(d[0],d[1],r)))D.doors.push(d)})})}

// ================= SKELD STATION: curved metal starship, engines at the stern (left), bridge at the nose (right) =================
PR.turret=(c,x,y,o)=>{shad(c,x+4,y+16,32,10,.3);c.fillStyle='#39414f';c.beginPath();c.ellipse(x,y+4,28,15,0,0,7);c.fill();stroke(c,3);const g=c.createRadialGradient(x-8,y-6,2,x,y,24);g.addColorStop(0,'#c4cddb');g.addColorStop(1,'#68738a');c.fillStyle=g;c.beginPath();c.ellipse(x,y-2,22,12,0,0,7);c.fill();stroke(c,2.5);c.fillStyle='#252b36';rr(c,x-5,y-34,10,34,3);c.fill();stroke(c,2.5);c.fillStyle='#e0b72a';c.fillRect(x-7,y-18,14,4);c.fillStyle=QQ.warn;c.beginPath();c.arc(x,y-34,3,0,7);c.fill()};
FP.turret=()=>[-26,-12,52,34];
(()=>{const D=newDef({n:'Skeld Station',th:{g:null,a:'#9fb3b8'},Q:{metal:'#8d97a8',pipe:'#6f86a8',crate:'#a9894f',table:'#c9b78c',console:'#3f495a',rack:'#364560',glow:'#5cf',glow2:'#5f8',led:'#5f5',warn:'#e44',stool:'#c0553a',lm:'lighter'},
Wc:{in:['#1c2330','#3f4d66','#8394b0']},fc:['#7886a0','#4e5b73'],style:'ship',rim:'rgba(90,200,255,.55)',lm:'lighter',lt:'rgba(110,170,255,.16)',lbl:'#0a0f1a',fl:'deck',cfl:'grate',
eb:[1040,215],sp:[1000,285]});
const R=(n,x,y,w,h,t,k,col,fl,ex)=>D.rooms.push(Object.assign({n,x,y,w,h,t,k,col,fl},ex||{}));
const W_={lc:'#fff'};
R('Cafeteria',850,70,380,290,'c',70,'#e8b86a','deck');
R('Upper Engine',170,80,300,210,'o',45,'#d8604a','plate',{lc:'#fff',lb:[320,268]});
R('Reactor',60,335,400,390,'e',0,'#ff8a3d','plate',W_);
R('Lower Engine',170,770,300,210,'o',45,'#d8604a','plate',{lc:'#fff',lb:[345,866]});
R('Security',520,345,160,230,'c',30,'#3fcf7a','tech',{lc:'#fff',lb:[600,455]});
R('MedBay',540,95,230,200,'o',35,'#58c8e0','med',{lb:[655,212]});
R('Central',900,400,290,260,'c',60,'#7aa8ff','deck',{lb:[1045,630]});
R('O2',1250,350,180,160,'c',35,'#6ae0a8','tech',W_);
R('Weapons',1320,80,260,210,'o',40,'#ffa84a','plate',{lc:'#fff',lb:[1450,226]});
R('Navigation',1480,330,330,380,'o',110,'#5a8aff','carpet',Object.assign({lb:[1590,692]},W_));
R('Admin',1250,570,180,160,'c',30,'#e0586a','wood');
R('Storage',850,700,300,260,'o',50,'#9ab070','deck',{lb:[1000,862]});
R('Electrical',560,700,230,190,'o',35,'#e8c040','grate',{lc:'#fff',lb:[640,727]});
R('Comms',1210,810,230,170,'c',30,'#4ac8e8','carpet',{lc:'#fff',lb:[1325,836]});
R('Shields',1500,770,260,200,'o',40,'#7ab0ff','tech',{lc:'#fff',lb:[1630,888]});
D.corr=[[465,150,80,70],[765,160,90,70],[585,290,64,60],[290,285,64,75],[290,700,64,75],[440,490,90,80],[675,480,235,70],[640,545,70,160],[465,810,100,60],[785,770,70,60],[1005,355,70,50],[1225,150,100,70],[1575,150,100,64],[1620,210,70,125],[1185,440,70,70],[1185,560,70,70],[1425,420,60,70],[1305,725,70,90],[1435,860,70,60],[1145,860,70,60],[1620,705,70,70],[1005,655,70,50]];
D.doors=[[470,185,'v',70],[540,185,'v',70],[770,195,'v',70],[850,195,'v',70],[617,295,'h',64],[617,345,'h',64],[322,290,'h',64],[322,770,'h',64],[520,530,'v',80],[680,515,'v',70],[900,515,'v',70],[672,700,'h',70],[470,840,'v',60],[560,840,'v',60],[790,800,'v',60],[850,800,'v',60],[1040,360,'h',70],[1040,400,'h',70],[1230,185,'v',70],[1320,185,'v',70],[1580,182,'v',64],[1655,330,'h',70],[1190,475,'v',70],[1250,475,'v',70],[1190,595,'v',70],[1250,600,'v',60],[1430,455,'v',70],[1480,465,'v',60],[1340,730,'h',70],[1340,810,'h',70],[1440,890,'v',60],[1500,890,'v',60],[1150,890,'v',60],[1210,890,'v',60],[1655,710,'h',70],[1655,770,'h',70],[1040,660,'h',70],[1040,700,'h',70]];
D.st=[[1405,692,'Swipe Card'],[715,248,'Submit Scan'],[1750,468,'Chart Course'],[1752,598,'Stabilize Steering'],[1385,868,'Upload Data'],[618,772,'Fix Wiring'],[118,520,'Unlock Manifolds'],[205,935,'Fuel Engines']];
D.vents=[[228,250],[140,600],[580,262],[640,855],[1540,250],[1715,935]];D.vn=['Upper Engine','Reactor','MedBay','Electrical','Weapons','Shields'];
const P=(t,x,y,o,s)=>Pp(D,t,x,y,o,s);
// Cafeteria
P('table',925,128,{w:112,h:44,ch:1});P('table',1155,128,{w:112,h:44,ch:1});P('table',925,312,{w:112,h:44,ch:1});P('table',1155,312,{w:112,h:44,ch:1});
P('vending',975,100,{c:'#d44a4a'});P('vending',1010,100,{c:'#4a7ad4'});P('plant',888,338,{r:20});P('plant',1196,338,{r:20});P('lamp',1040,215,{r:200,c:'rgba(255,220,150,A)',a:.2});
D.decals.push(['ring',1040,215,{rx:150,ry:104,c:'#e8b86a',a:.55,w:5}],['ring',1040,215,{rx:125,ry:82,c:'#fff',a:.2,w:2,d:[3,7]}]);
// Upper Engine
P('turbine',345,140,{w:130,h:60});D.anim.push(['fan',312,140,20,5],['fan',378,140,20,-5],['pulse',345,150,170,'rgba(255,110,60,A)',.22,2]);P('console',415,232,{w:80,sc:'#fa5'});P('crate',205,148,{s:38});P('crate',205,190,{s:30});
D.decals.push(['pipe',180,115,{x2:180,y2:268,w:8,c:'#8a6a5a',ns:1}],['pipe',460,115,{x2:460,y2:268,w:8,c:'#8a6a5a'}]);
// Lower Engine
P('turbine',345,918,{w:130,h:60});D.anim.push(['fan',312,918,20,5],['fan',378,918,20,-5],['pulse',345,925,170,'rgba(255,110,60,A)',.22,2.3]);P('console',232,806,{w:90,sc:'#fa5'});P('barrel',192,962,{});P('barrel',214,970,{});
D.decals.push(['pipe',180,800,{x2:180,y2:950,w:8,c:'#8a6a5a'}],['pipe',460,880,{x2:460,y2:955,w:8,c:'#8a6a5a'}]);
// Reactor (landmark): glowing core, hazard rings, coolant consoles
P('reactor',260,530,{rx:80,ry:84});D.anim.push(['pulse',260,530,300,'rgba(255,130,50,A)',.38,2.2],['blink',178,452,'#f44',1.5],['blink',342,608,'#f44',1.5]);
D.decals.push(['ring',260,530,{rx:112,ry:116,c:'#e0b72a',a:.6,w:7,d:[18,12]}],['ring',260,530,{rx:168,ry:172,c:'#ff9a50',a:.28,w:3,d:[4,9]}],['hazard',290,346,{w:64,h:12}],['hazard',322,712,{w:64,h:12}]);
P('console',408,432,{w:60,sc:'#fa5'});P('console',408,640,{w:60,sc:'#fa5'});
// Security
P('console',600,392,{w:110,sc:'#5f8',chair:1});P('console',600,548,{w:110,sc:'#5f8'});P('stool',560,470,{});D.anim.push(['scan',560,360,200,.4,110]);
// MedBay
P('bed',600,150,{});P('bed',660,150,{});P('bed',720,150,{});P('cart',650,262,{});D.decals.push(['decal',655,235,{t:'✚',c:'#e44',a:.28,f:'900 64px'}]);
// Admin
P('table',1335,652,{w:90,h:44,ch:1,cloth:'#3a4a6a'});P('plant',1410,600,{r:16});P('plant',1272,716,{r:14});
// Storage
P('crate',905,745,{s:44});P('crate',952,748,{s:36});P('barrel',1105,748,{});P('barrel',1127,764,{});P('crate',965,905,{s:40});P('crate',1010,908,{s:40});P('tank',1100,938,{r:20,h:44,c:'#c0a040'});P('crate',890,915,{s:36});
// Electrical
P('rack',735,742,{w:80});P('genset',715,838,{w:110,h:56});P('cable',640,790,{x2:690,y2:830,c:'#d8a030'});D.anim.push(['blink',700,732,'#f44',2],['blink',720,732,'#5f5',2.6]);
// Central hub
P('holo',1045,530,{r:46});D.anim.push(['pulse',1045,520,130,'rgba(90,200,255,A)',.28,3]);P('plant',935,432,{r:18});P('plant',1160,432,{r:18});D.decals.push(['ring',1045,530,{rx:100,ry:76,c:'#7aa8ff',a:.5,w:4}]);
// O2
P('tank',1292,392,{r:20,h:48,c:'#7ac0b0',g:'#9ff'});P('tank',1340,392,{r:20,h:48,c:'#7ac0b0',g:'#9ff'});P('plant',1388,392,{r:18,f:'#fe8'});P('plant',1296,486,{r:16});
// Weapons
P('turret',1400,138,{});P('turret',1500,138,{});P('console',1450,252,{w:100,sc:'#fa5',chair:1});
// Navigation (bridge)
P('holo',1585,520,{r:46});D.anim.push(['pulse',1585,510,150,'rgba(90,160,255,A)',.3,2.6]);P('console',1708,392,{w:120,sc:'#5cf'});P('console',1748,676,{w:90,sc:'#5cf'});P('stool',1580,440,{});P('stool',1580,602,{});
D.decals.push(['ring',1585,520,{rx:90,ry:70,c:'#5a8aff',a:.5,w:4}]);
// Shields
P('tank',1545,850,{r:24,h:50,c:'#5a8ae0',g:'#8cf'});P('tank',1715,850,{r:24,h:50,c:'#5a8ae0',g:'#8cf'});P('console',1610,942,{w:100,sc:'#8cf'});D.anim.push(['pulse',1545,845,90,'rgba(120,180,255,A)',.3,2],['pulse',1715,845,90,'rgba(120,180,255,A)',.3,2.4]);
// Comms
P('console',1300,948,{w:100,sc:'#5cf'});P('dish',1398,938,{r:26});
// thrusters on the stern
D.post=c=>{for(const y of[165,885]){c.fillStyle='#10141c';c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(165,y-38);c.lineTo(120,y-52);c.lineTo(120,y+52);c.lineTo(165,y+38);c.closePath();c.fill();c.stroke();const g=c.createLinearGradient(165,0,70,0);g.addColorStop(0,'rgba(255,200,120,.9)');g.addColorStop(.3,'rgba(255,120,50,.55)');g.addColorStop(1,'rgba(255,60,20,0)');c.fillStyle=g;c.beginPath();c.moveTo(120,y-40);c.lineTo(10,y-14);c.lineTo(10,y+14);c.lineTo(120,y+40);c.closePath();c.fill()}};
D.anim.push(['pulse',60,165,110,'rgba(255,120,50,A)',.5,7],['pulse',60,885,110,'rgba(255,120,50,A)',.5,6.4]);
MAPS.push(D)})();

// ================= POLAR BASE: bright arctic research station, snow outside, modules linked by insulated tubes =================
PR.scope=(c,x,y,o)=>{shad(c,x+5,y+14,28,9,.3);c.fillStyle='#4a5566';c.beginPath();c.ellipse(x,y+4,24,12,0,0,7);c.fill();stroke(c,3);c.fillStyle='#cfd8e4';c.beginPath();c.ellipse(x,y,17,8,0,0,7);c.fill();stroke(c,2);c.save();c.translate(x,y-2);c.rotate(-.7);const g=c.createLinearGradient(0,-13,0,13);g.addColorStop(0,'#f4f8fc');g.addColorStop(1,'#8a98aa');c.fillStyle=g;rr(c,-8,-48,16,52,5);c.fill();stroke(c,3);c.fillStyle='#10161f';c.beginPath();c.ellipse(0,-48,8,3.5,0,0,7);c.fill();stroke(c,2);c.fillStyle='#d6402e';c.fillRect(-8,-20,16,4);c.restore()};
FP.scope=()=>[-24,-8,48,24];
(()=>{const D=newDef({n:'Polar Base',th:{g:'#dbe8ef',a:'#dfe6ea'},
Q:{metal:'#8fa0b4',pipe:'#c0503a',crate:'#b08040',table:'#c9b090',console:'#46586e',rack:'#3a4c66',glow:'#7ef',glow2:'#8fe',led:'#6f6',warn:'#e44',stool:'#c0553a',lm:'source-over'},
Wc:{in:['#2e4156','#6a87a0','#d3e4ef'],out:['#6f95ad','#b4d2e4','#ffffff']},fc:['#a9c4d6','#6e8ca4'],style:'ice',rim:'rgba(120,200,255,.5)',lm:'source-over',lt:'rgba(255,238,205,.13)',lbl:'#1a2a3a',fl:'lino',cfl:'concrete',ground:'snow',
eb:[910,510],sp:[870,415]});
const R=(n,x,y,w,h,t,k,col,fl,ex)=>D.rooms.push(Object.assign({n,x,y,w,h,t,k,col,fl},ex||{}));
const OUT={o:1,nf:1};
R('Office',70,110,190,190,'c',35,'#e0a050','lino',{lb:[165,238]});
R('Lab',330,90,320,230,'c',40,'#4ac8e0','lino',{lb:[480,300]});
R('Greenhouse',760,60,300,220,'e',0,'#5ac860','labtile',{lb:[910,262]});
R('Observatory',1250,80,300,230,'o',50,'#6a8aff','carpet',{lc:'#fff',lb:[1325,262]});
R('Garage',70,400,300,250,'c',50,'#e8b830','concrete',{lb:[195,488]});
R('Storage',470,430,200,190,'c',30,'#c8a060','concrete',{lb:[570,520]});
R('Mess Hall',760,380,300,260,'o',60,'#e87a50','wood',{lb:[910,428]});
R('Infirmary',1180,400,260,210,'c',35,'#58e0c8','med',{lb:[1310,592]});
R('Comms Mast',1560,360,230,260,'o',50,'#9ab4cc','snow',Object.assign({lb:[1675,602]},OUT));
R('Barracks',200,740,320,230,'c',40,'#d8706a','wood',{lb:[360,858]});
R('Generator',640,760,420,210,'o',45,'#ffa040','plate',{lc:'#fff',lb:[850,880]});
R('Drill Site',1180,720,340,260,'e',0,'#8ad0f0','ice',Object.assign({lb:[1350,962]},OUT));
D.corr=[[255,170,80,70],[645,150,120,70],[1055,150,200,70],[135,295,70,110],[365,500,110,80],[665,490,100,80],[875,275,70,110],[1055,480,130,70],[1290,305,70,100],[1435,480,130,70],[1280,605,70,120],[875,635,70,130],[1055,830,160,70],[515,830,130,70],[260,645,70,100],[530,315,70,120]];
// bi-directional doors on every tube end that is not outdoors
autoDoors(D);
D.st=[[232,138,'Swipe Card'],[622,268,'Submit Scan'],[1500,258,'Chart Course'],[1735,520,'Stabilize Dish'],[548,586,'Upload Data'],[690,922,'Fix Wiring'],[100,458,'Unlock Doors'],[1262,925,'Fuel Engines']];
D.vents=[[372,178],[1000,238],[1500,285],[245,930],[1000,930],[322,425]];D.vn=['Lab','Greenhouse','Observatory','Barracks','Generator','Garage'];
const P=(t,x,y,o,s)=>Pp(D,t,x,y,o,s);
// Office
P('table',150,168,{w:100,h:46,ch:1});P('locker',104,262,{w:60,c:'#8a6a58'});P('plant',236,268,{r:16});P('console',212,258,{w:50,sc:'#8fe'},false);
// Lab
P('rack',400,128,{w:80});P('rack',565,128,{w:80});P('bench',470,214,{w:130,sc:'#5fe'});P('pod',372,262,{c:'#6af0ff',sp:'#9fd'});P('pod',420,262,{c:'#8fe6ff'});D.anim.push(['scan',405,100,200,.45,150],['pulse',396,255,90,'rgba(120,230,255,A)',.3,2]);D.decals.push(['ring',470,214,{rx:100,ry:60,c:'#4ac8e0',a:.35,w:3}]);
// Greenhouse
for(const[x,y,r,c]of[[830,100,22],[885,90,20],[940,90,22],[995,100,20],[815,232,18],[870,240,16]])P('plant',x,y,{r,f:'#ffe27a'});P('bush',1040,128,{r:18});P('bush',782,128,{r:18});D.lights.push([910,150,250,'rgba(150,255,170,A)',.08]);
D.decals.push(['ring',910,170,{rx:120,ry:76,c:'#5ac860',a:.35,w:3,d:[4,8]}]);
// Observatory
P('holo',1420,172,{r:46});D.anim.push(['pulse',1420,166,120,'rgba(110,170,255,A)',.28,2.5]);P('console',1345,120,{w:80,sc:'#5cf'});P('console',1495,120,{w:80,sc:'#5cf'});P('scope',1385,262,{});P('stool',1380,200,{});D.decals.push(['ring',1420,172,{rx:92,ry:62,c:'#6a8aff',a:.5,w:4}]);
// Garage
P('sled',300,458,{c:'#d6402e'});P('jeep',205,598,{c:'#5a7a8a'});P('barrel',352,598,{});P('barrel',334,610,{});D.decals.push(['hazard',230,525,{w:240,h:14}],['decal',222,574,{t:'BAY 2',c:'#e8b830',a:.25,f:'900 22px'}]);
// Storage
P('crate',500,468,{s:40});P('crate',545,462,{s:32});P('crate',642,468,{s:36});P('barrel',640,598,{});P('barrel',618,606,{});P('crate',500,598,{s:34});
// Mess Hall
P('table',820,436,{w:72,h:38,ch:1});P('table',1000,436,{w:72,h:38,ch:1});P('table',820,590,{w:72,h:38,ch:1});P('table',1000,590,{w:72,h:38,ch:1});D.decals.push(['ring',910,510,{rx:130,ry:92,c:'#e87a50',a:.4,w:5}]);D.lights.push([910,510,220,'rgba(255,200,120,A)',.12]);
// Infirmary
P('bed',1218,446,{c:'#6ad0c8'});P('bed',1262,446,{c:'#6ad0c8'});P('cart',1395,448,{});P('plant',1415,585,{r:16});D.decals.push(['decal',1310,545,{t:'✚',c:'#e44',a:.28,f:'900 60px'}]);
// Comms Mast (outdoors)
P('mast',1690,440,{});P('dish',1640,570,{r:30});P('crate',1760,430,{s:34});P('drift',1600,430,{w:70,h:22,ns:1});P('drift',1760,590,{w:60,h:20,ns:1});P('rock',1620,500,{r:20,snow:1});P('sled',1740,590,{c:'#2a6ab0'});P('barrel',1600,440,{});P('barrel',1620,452,{});P('crate',1690,500,{s:30});D.anim.push(['blink',1690,368,'#f44',1.8]);
// Barracks
for(const x of[232,370,420,470])P('bunk',x,785,{c:x%100?'#4a78b8':'#c9534a'});P('table',385,908,{w:100,h:44,ch:0});P('locker',335,940,{w:60,c:'#5a7a96'});P('plant',490,945,{r:16});P('sofa',470,880,{w:40,c:'#7a5a8a',ns:1},false);
// Generator
P('genset',735,796,{w:100,h:40});P('genset',995,796,{w:90,h:40});P('tank',770,930,{r:22,h:40});P('tank',820,930,{r:22,h:40});P('tank',940,930,{r:22,h:40});D.anim.push(['pulse',735,800,120,'rgba(255,170,60,A)',.2,3],['pulse',995,800,120,'rgba(255,170,60,A)',.2,3.4]);D.decals.push(['hazard',880,830,{w:20,h:60}],['pipe',672,780,{x2:672,y2:945,w:8,c:'#c0503a',ns:1}]);
// Drill Site (outdoors)
P('drill',1350,850,{});P('rock',1460,780,{r:26,snow:1});P('rock',1240,775,{r:22,snow:1});P('crystal',1460,925,{});P('crystal',1440,945,{h:30});P('barrel',1260,800,{});P('barrel',1282,810,{});D.decals.push(['ring',1350,850,{rx:110,ry:76,c:'#e0b72a',a:.5,w:5}],['hazard',1350,915,{w:120,h:14}]);
// outside scenery
for(const[t,x,y,o]of[['rock',48,350,{r:30,snow:1}],['pillar',235,350,{r:16}],['crystal',700,300,{h:50}],['crystal',725,318,{h:34}],['drift',700,690,{w:130,h:34}],['rock',110,860,{r:40,snow:1}],['drift',130,960,{w:120,h:30}],['pillar',600,690,{r:18}],['rock',1130,330,{r:34,snow:1}],['drift',1130,690,{w:110,h:30}],['rock',1610,215,{r:36,snow:1}],['pillar',1670,255,{r:20}],['drift',1650,730,{w:110,h:30}],['rock',1700,860,{r:34,snow:1}],['pillar',1620,930,{r:18}],['drift',1010,340,{w:90,h:26}],['rock',60,640,{r:24,snow:1}],['pillar',700,45,{r:16}],['crystal',1160,300,{h:40}],['drift',410,350,{w:100,h:28}],['rock',1190,1000,{r:30,snow:1}],['drift',470,1005,{w:130,h:26}]])P(t,x,y,Object.assign({ns:1},o),false);
// sled tracks and wind-swept snow on the ground
D.deco=c=>{c.save();for(let i=0;i<26;i++){const x=(i*173)%1800+20,y=(i*311)%1000+20;c.globalAlpha=.4;c.fillStyle=i%2?'#c9dbe6':'#f7fbfd';c.beginPath();c.ellipse(x,y,80+i%5*14,16+i%3*6,(i%7)*.2-.3,0,7);c.fill()}c.globalAlpha=.55;c.strokeStyle='#a8c0d0';c.lineWidth=3;for(const dy of[-5,5]){c.beginPath();c.moveTo(365,540+dy);c.bezierCurveTo(430,640+dy,520,700+dy,640,860+dy);c.stroke();c.beginPath();c.moveTo(1520,860+dy);c.bezierCurveTo(1560,740+dy,1600,720+dy,1660,640+dy);c.stroke()}c.restore()};
D.lights.push([1700,500,200,'rgba(255,255,255,A)',.1],[1350,850,260,'rgba(180,230,255,A)',.14]);
MAPS.push(D)})();

// ================= JUNGLE LAB: overgrown research complex, mossy ruins, glowing flora, containment chamber at the heart =================
PR.vine=(c,x,y,o)=>{const L=o.l||80,a=o.a||0;c.lineCap='round';for(const[w,col]of[[7,OL],[4,'#2f7a34'],[1.4,'#7ad06a']]){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+Math.cos(a)*L*.3-12,y+Math.sin(a)*L*.3+14,x+Math.cos(a)*L*.7+12,y+Math.sin(a)*L*.7-12,x+Math.cos(a)*L,y+Math.sin(a)*L);c.stroke()}c.fillStyle='#4aa848';for(let i=1;i<5;i++){const t=i/5;c.beginPath();c.ellipse(x+Math.cos(a)*L*t+(i%2?7:-7),y+Math.sin(a)*L*t,6,3,i,0,7);c.fill();stroke(c,1.2)}};
PR.fern=(c,x,y,o)=>{const r=o.r||26;shad(c,x+2,y+4,r*.8,r*.3,.25);for(let i=0;i<9;i++){const a=i*.7+.2;c.fillStyle=['#2a7a34','#3a9a42','#1f6a2c'][i%3];c.beginPath();c.ellipse(x+Math.cos(a)*r*.45,y-4+Math.sin(a)*r*.3,r*.55,r*.13,a,0,7);c.fill();stroke(c,1.4)}};
PR.orchid=(c,x,y,o)=>{PR.plant(c,x,y,{r:o.r||20,c:'#2a7a3c'});const col=o.c||'#ff7ad8';for(let i=0;i<5;i++){const a=i*1.26;c.fillStyle=col;c.beginPath();c.ellipse(x+Math.cos(a)*7,y-8+Math.sin(a)*5,5,3,a,0,7);c.fill();stroke(c,1.2)}c.fillStyle='#ffe27a';c.beginPath();c.arc(x,y-8,2.4,0,7);c.fill();GLO(c,x,y-6,44,'rgba(255,120,220,A)',.25)};
PR.canopy=(c,x,y,o)=>{const r=o.r||80;shad(c,x+10,y+r*.45,r*1.05,r*.55,.3);const cols=['#1a5028','#256a30','#2f8a3a','#45a84a'],n=[9,8,6,3];for(let L=0;L<4;L++){for(let i=0;i<n[L];i++){const a=i*(6.283/n[L])+L*.5,d=r*(.62-L*.15),rr_=r*(.42-L*.06);c.fillStyle=cols[L];c.beginPath();c.ellipse(x+Math.cos(a)*d,y+Math.sin(a)*d*.8-L*5,rr_,rr_*.8,0,0,7);c.fill();stroke(c,L?1.6:2.6)}}c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.ellipse(x-r*.2,y-r*.35,r*.35,r*.14,-.4,0,7);c.fill();for(let i=0;i<4;i++){c.fillStyle=['#ff7ad8','#ffd04a'][i%2];c.beginPath();c.arc(x+Math.cos(i*1.9)*r*.35,y+Math.sin(i*1.9)*r*.25-8,3,0,7);c.fill()}};
FP.orchid=o=>[-14,-6,28,18];FP.fern=()=>[-10,-4,20,10];
(()=>{const D=newDef({n:'Jungle Lab',th:{g:'#17301a',a:'#bfb08f'},
Q:{metal:'#6f7a66',pipe:'#6a8a5a',crate:'#8a7040',table:'#8a6a44',console:'#2f4538',rack:'#2a3a34',glow:'#6fffb0',glow2:'#8fff7a',led:'#7fff6a',warn:'#ff6a40',stool:'#8a5a3a',lm:'lighter'},
Wc:{in:['#222e1e','#586e4a','#97ab82']},fc:['#74866a','#485a40'],style:'ruin',rim:'rgba(120,255,160,.45)',lm:'lighter',lt:'rgba(150,255,170,.10)',lbl:'#04140a',fl:'jmetal',cfl:'stone',ground:'grass',
eb:[995,165],sp:[920,225]});
const R=(n,x,y,w,h,t,k,col,fl,ex)=>D.rooms.push(Object.assign({n,x,y,w,h,t,k,col,fl},ex||{}));
const W={lc:'#fff'};
R('Orchid House',70,110,360,260,'e',0,'#ff7ad8','dirt',{lc:'#fff',lb:[190,352]});
R('Records',520,90,210,180,'c',30,'#e0c070','boards',{lb:[625,200]});
R('Command Hall',830,60,330,210,'o',50,'#5affb0','jmetal',{lc:'#fff',lb:[995,248]});
R('Biolab',1260,100,300,240,'o',45,'#5af0e0','labtile',{lb:[1410,320]});
R('Dormitory',90,470,300,240,'c',40,'#e08a5a','boards',{lb:[240,600]});
R('Containment',560,400,380,320,'e',0,'#5aff8a','tech',{lc:'#fff',lb:[750,700]});
R('Supply',1030,430,230,200,'c',30,'#c8a050','jmetal',{lb:[1145,540]});
R('Clinic',1400,430,250,210,'c',35,'#7ae0c8','med',{lb:[1525,540]});
R('Hangar',90,790,380,200,'o',45,'#e8b830','plate',{lc:'#fff',lb:[270,880]});
R('Canteen',560,800,280,180,'c',35,'#e87a50','wood',{lb:[700,897]});
R('Radio Hut',960,780,230,190,'c',30,'#6ab0ff','tech',{lc:'#fff',lb:[1075,880]});
R('Power Core',1280,740,300,230,'o',45,'#a0ff50','plate',{lc:'#fff',lb:[1430,955]});
D.corr=[[425,170,100,70],[725,150,110,70],[1155,150,110,70],[180,365,70,110],[585,265,70,190],[385,540,205,80],[660,695,80,125],[915,500,125,80],[1035,265,70,170],[1255,500,150,70],[1420,335,70,100],[220,705,70,90],[465,860,100,70],[835,860,130,70],[1185,830,100,70],[1470,635,70,110],[1075,625,70,160]];
autoDoors(D);
D.st=[[690,246,'Swipe Card'],[1620,605,'Submit Scan'],[1100,228,'Chart Course'],[1000,942,'Stabilize Dish'],[1512,292,'Upload Data'],[1330,790,'Fix Wiring'],[125,252,'Unlock Doors'],[430,945,'Fuel Engines']];
D.vents=[[345,160],[555,138],[902,240],[1345,312],[120,660],[900,915]];D.vn=['Orchid House','Records','Command Hall','Biolab','Dormitory','Canteen'];
const P=(t,x,y,o,s)=>Pp(D,t,x,y,o,s);
// ---- Orchid House: greenhouse swallowed by jungle
P('pond',235,192,{rx:64,ry:30});P('tree',345,300,{r:80});for(const[x,y,c]of[[120,170,'#ff7ad8'],[130,335,'#ffd04a'],[385,150,'#7ad0ff'],[290,128,'#ff7ad8'],[215,300,'#ffd04a'],[100,300,'#ff7ad8']])P('orchid',x,y,{c});P('fern',170,142,{r:26});P('fern',330,230,{r:26});P('mush',300,340,{ns:1,n:3},false);P('mush',150,215,{n:2,ns:1},false);
D.decals.push(['vine',130,125,{l:70,a:.6}],['vine',390,330,{l:70,a:3.6}]);D.lights.push([250,240,230,'rgba(255,120,220,A)',.07]);
// ---- Records: archive room, shelves broken by roots
P('locker',612,130,{w:60,c:'#5a6a4a'});P('locker',680,130,{w:60,c:'#5a6a4a'});P('crate',700,200,{s:30});P('plant',548,244,{r:16});P('table',560,215,{w:50,h:30,c:'#6a5a3a'});D.decals.push(['roots',520,240,{l:60,a:-.4}],['vine',730,95,{l:60,a:2}]);
// ---- Command Hall
P('console',868,100,{w:70,sc:'#6fffb0'});P('console',1100,100,{w:80,sc:'#6fffb0'});P('plant',850,245,{r:18});P('table',1130,200,{w:40,h:26,ns:1},false);P('stool',868,132,{});D.decals.push(['ring',995,165,{rx:140,ry:88,c:'#5affb0',a:.4,w:4}],['roots',830,230,{l:110,a:-.5}],['roots',1160,100,{l:100,a:2.4}]);D.anim.push(['pulse',995,165,200,'rgba(90,255,170,A)',.2,2]);
// ---- Biolab
for(const x of[1370,1430,1490])P('pod',x,152,{c:['#59f0b4','#9af05a','#59d8f0'][(x/60|0)%3],sp:x==1430?'#bfffd8':null});P('bench',1355,256,{w:90,sc:'#8fff7a'});P('rack',1500,222,{w:60});P('plant',1290,305,{r:16});D.anim.push(['pulse',1430,150,160,'rgba(120,255,190,A)',.25,2.2],['blink',1500,200,'#f44',2]);
// ---- Dormitory
P('bunk',125,520,{c:'#4a8a6a'});P('bunk',310,515,{c:'#8a6a4a'});P('bunk',358,515,{c:'#8a6a4a',c2:'#4a6a9a'});P('table',205,645,{w:80,h:36,ch:0});P('crate',340,668,{s:32});P('plant',350,610,{r:16});D.decals.push(['roots',90,690,{l:90,a:-.7}]);
// ---- Containment (landmark): specimen tree at the core, pods around it
P('tree',750,560,{r:70});for(const[x,y,c,s]of[[750,447,'#59f0b4','#bfffd8'],[850,478,'#9af05a',null],[855,642,'#59d8f0','#d8f8ff'],[648,645,'#e07af0',null],[675,470,'#59f0b4',null]])P('pod',x,y,{c,sp:s});
D.decals.push(['ring',750,560,{rx:160,ry:120,c:'#5aff8a',a:.45,w:4,d:[6,10]}],['roots',750,560,{l:130,a:.3}],['roots',750,560,{l:130,a:2.3}],['roots',750,560,{l:130,a:3.8}],['roots',750,560,{l:140,a:5.4}],['roots',750,560,{l:110,a:1.2}]);D.anim.push(['pulse',750,545,300,'rgba(90,255,150,A)',.28,1.8],['scan',650,470,200,.5,200]);
// ---- Supply
P('crate',1215,470,{s:40});P('crate',1170,462,{s:30});P('crate',1215,595,{s:40});P('crate',1052,598,{s:34});P('cart',1160,472,{ns:1},false);P('barrel',1236,545,{ns:1},false);P('fern',1225,520,{r:20});
// ---- Clinic
P('bed',1575,490,{c:'#48c0a0'});P('bed',1622,490,{c:'#48c0a0'});P('plant',1430,620,{r:16});D.decals.push(['decal',1500,570,{t:'✚',c:'#e44',a:.25,f:'900 56px'}],['vine',1640,435,{l:60,a:2.2}]);
// ---- Hangar
P('jeep',172,928,{c:'#5a7a3a'});P('jeep',340,945,{c:'#8a6a3a'});P('crate',405,822,{s:38});P('tank',130,838,{r:18,h:36,c:'#a09040'});P('tank',165,838,{r:18,h:36,c:'#a09040'});D.decals.push(['hazard',280,870,{w:200,h:14}],['roots',90,985,{l:80,a:-.3}]);
// ---- Canteen
P('table',612,838,{w:70,h:38,ch:1});P('table',790,838,{w:70,h:38,ch:1});P('bar',700,950,{w:190});P('plant',592,945,{r:16});P('plant',815,945,{r:16});
// ---- Radio Hut
P('dish',1040,820,{r:28});P('mast',1160,940,{});P('console',1085,946,{w:80,sc:'#5cf'});P('crate',1010,880,{s:30});D.anim.push(['blink',1160,872,'#f44',1.6]);
// ---- Power Core
P('reactor',1440,868,{rx:50,ry:52});D.anim.push(['pulse',1440,868,260,'rgba(120,255,90,A)',.3,2],['blink',1380,800,'#f44',2]);P('console',1545,905,{w:70,sc:'#8fff7a'});P('genset',1350,935,{w:80,h:34});D.decals.push(['ring',1440,868,{rx:90,ry:92,c:'#a0ff50',a:.5,w:5,d:[16,10]}],['cable',1330,880,{x2:1395,y2:868,ns:1,c:'#d8a030'}]);
// outside scenery: giant roots and foliage engulfing the walls
for(const[t,x,y,o]of[['canopy',565,335,{r:70}],['canopy',40,540,{r:60}],['canopy',1200,370,{r:70}],['canopy',1720,300,{r:90}],['canopy',1730,800,{r:80}],['canopy',640,1000,{r:60}],['canopy',985,725,{r:60}],['canopy',40,985,{r:70}],['canopy',1660,985,{r:60}],['fern',460,290,{r:30}],['fern',1170,700,{r:30}],['fern',1650,670,{r:30}],['orchid',770,760,{c:'#ff7ad8'}],['orchid',1230,690,{c:'#7ad0ff'}],['mush',500,740,{n:4}],['mush',1180,350,{n:3}],['mush',1660,730,{n:3}],['bush',480,60,{r:34}],['bush',1640,90,{r:34}],['bush',1250,1005,{r:34}],['rock',820,330,{r:30,c:'#6a7a62'}],['rock',1610,380,{r:24,c:'#6a7a62'}],['roots',430,330,{l:100,a:.4}],['roots',1600,400,{l:100,a:2.6}],['roots',540,730,{l:90,a:-.7}],['roots',1190,985,{l:90,a:3.4}],['vine',1160,290,{l:80,a:1.7}],['vine',650,290,{l:60,a:1.2},]])P(t,x,y,Object.assign({ns:1},o),false);
D.deco=c=>{c.save();for(let i=0;i<40;i++){const x=(i*257)%1800+20,y=(i*173)%1000+20;c.globalAlpha=.35;c.fillStyle=i%2?'#1c4a24':'#3f7a34';c.beginPath();c.ellipse(x,y,70+i%5*16,30+i%4*8,(i%6)*.4,0,7);c.fill()}
// winding stream through the gaps between buildings
c.globalAlpha=1;const g=c.createLinearGradient(0,0,0,1050);g.addColorStop(0,'#3aa8b8');g.addColorStop(1,'#1c6a7a');for(const[w,col]of[[44,'#2e4a2a'],[34,'#3a6a52'],[26,g]]){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(-20,610);c.bezierCurveTo(200,740,420,740,520,770);c.bezierCurveTo(700,760,780,760,880,750);c.bezierCurveTo(1000,740,1100,700,1180,720);c.bezierCurveTo(1300,700,1700,690,1860,650);c.stroke()}
c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=2;c.setLineDash([14,26]);c.beginPath();c.moveTo(-20,610);c.bezierCurveTo(200,740,420,740,520,770);c.bezierCurveTo(700,760,780,760,880,750);c.stroke();c.restore()};
D.lights.push([250,240,200,'rgba(255,120,220,A)',.1],[750,560,250,'rgba(90,255,150,A)',.16],[1430,150,200,'rgba(90,255,200,A)',.12]);
MAPS.push(D)})();

// ================= LOBBY: the dropship hangar =================
(()=>{const D=newDef({n:'Dropship',Q:{metal:'#8d97a8',pipe:'#6f86a8',crate:'#a9894f',table:'#c9b78c',console:'#3f495a',rack:'#364560',glow:'#5cf',glow2:'#5f8',led:'#5f5',warn:'#e44',stool:'#c0553a',lm:'lighter'},
Wc:{in:['#1c2330','#3f4d66','#8394b0']},fc:['#7886a0','#4e5b73'],style:'ship',rim:'rgba(90,200,255,.55)',lm:'lighter',lt:'rgba(110,170,255,.16)',fl:'deck',cfl:'grate'});
D.rooms.push({n:'Dropship',x:60,y:60,w:880,h:500,t:'c',k:80,col:'#7aa8ff',fl:'deck',nl:1,ta:.12});
D.sol=[[90,90,70,70],[170,90,50,50],[460,70,120,60],[800,90,100,60],[840,440,90,90]];
D.decals.push(['ring',500,330,{rx:150,ry:104,c:'#7aa8ff',a:.5,w:5}],['ring',500,330,{rx:112,ry:78,c:'#fff',a:.2,w:2,d:[3,7]}],['hazard',500,540,{w:300,h:14}],['hazard',80,330,{w:14,h:160}],['decal',500,335,{t:'STARSHIFT',c:'#7aa8ff',a:.25,f:'900 28px'}]);
D.props.push(['crate',125,125,{s:70}],['crate',195,115,{s:50}],['console',520,100,{w:120,sc:'#5cf',chair:0}],['locker',850,112,{w:100,c:'#5a7a96'}],['crate',885,485,{s:90,c:'#8a7a58'}],['plant',150,500,{r:22}],['plant',900,300,{r:20}],['lamp',500,330,{r:240,c:'rgba(150,200,255,A)',a:.2}]);
D.anim.push(['pulse',500,330,200,'rgba(90,160,255,A)',.18,2]);
LOBBY=D;loadLobby()})();

const ANS=[['LOW GRAVITY: faster, everyone',1],['BLACKOUT: vision shrinks',2],['SOLAR FLARE: controls inverted',3]];
function anom(dt){if(NET){if(G.an){G.an.l-=dt;if(G.an.l<=0)G.an=null}if(netHost()){G.at-=dt;if(G.at<=0&&!G.an){G.at=35+RND()*25;NET.R.emit('anom',{k:1+RND()*3|0})}}return}G.at-=dt;if(G.an){G.an.l-=dt;if(G.an.l<=0){G.an=null;toast('Station stabilised');G.at=35+RND()*25}}else if(G.at<=0){const a=ANS[RND()*3|0];G.an={k:a[1],l:12};toast('STARSHIFT: '+a[0]);G.sh=.4;snd(120,.5,'sawtooth')}}
function drawWorld(){if(!P.length)return;const e=P[0],s=Math.min(W,H)/430*(isDesk()?.62:1)*zw,sh=G&&G.sh>0?G.sh*30:0;mn.st.forEach(q=>{cx.globalAlpha=.5;cx.fillStyle='#fff';cx.fillRect(q.x*W,q.y*H,q.z*2,q.z*2)});cx.globalAlpha=1;
cx.save();cx.translate(W/2+(RND()-.5)*sh,H/2+(RND()-.5)*sh);cx.scale(s,s);cx.translate(-e.x,-e.y);if(TH.g&&WALK==GWALK){cx.fillStyle=TH.g;cx.fillRect(-4000,-4000,9000,9000)}drawFloor();leds();
if(G&&WALK==GWALK){const bob=Math.sin(performance.now()/250)*3;e.tasks.forEach(t=>{if(t.done)return;const q=ST[t.s];cx.fillStyle='#ffd54a';cx.beginPath();cx.arc(q[0],q[1]-26+bob,9,0,7);cx.fill();cx.strokeStyle='#0b0b12';cx.lineWidth=3;cx.stroke();cx.fillStyle='#000';cx.font='bold 13px system-ui';cx.textAlign='center';cx.fillText('!',q[0],q[1]-21+bob)})}
const L=[];if(G)G.body.forEach(b=>L.push({y:b.y,d:()=>{bodyFx(b);corpse(cx,b.x,b.y,b.col,b.f)}}));
if(G&&G.sab)L.push({y:-9e4,d:()=>{const q=G.sab,k=performance.now()/250;if(q.fx)q.fx.forEach(f=>{if(f.d)return;cx.strokeStyle='rgba(255,70,70,'+(.5+.4*Math.sin(k))+')';cx.lineWidth=4;cx.beginPath();cx.arc(f.x,f.y,30+4*Math.sin(k),0,7);cx.stroke();cx.fillStyle='#ff4444';cx.font='bold 14px system-ui';cx.textAlign='center';cx.fillText('FIX',f.x,f.y-38)});q.lk.forEach(r=>{cx.fillStyle='rgba(220,40,40,.85)';cx.fillRect(r[0],r[1],r[2],r[3])})}});
if(G&&G.trk&&!e.dead)L.push({y:1e5,d:()=>{const q=G.trk.p,a=Math.atan2(q.y-e.y,q.x-e.x);cx.save();cx.translate(e.x+Math.cos(a)*62,e.y+Math.sin(a)*62);cx.rotate(a);cx.fillStyle='#ffd54a';cx.strokeStyle='#0b0b12';cx.lineWidth=2;cx.beginPath();cx.moveTo(10,0);cx.lineTo(-6,-7);cx.lineTo(-2,0);cx.lineTo(-6,7);cx.closePath();cx.fill();cx.stroke();cx.restore()}});
if(G&&(G.pu||(G.pus||[]).length))L.push({y:-1e5,d:()=>{for(const u of [G.pu,...(G.pus||[])]){if(!u)continue;const k=performance.now()/200;cx.fillStyle='rgba(80,220,255,.14)';cx.strokeStyle='rgba(120,240,255,'+(.6+.3*Math.sin(k))+')';cx.lineWidth=3;cx.beginPath();cx.arc(u.x,u.y,130,0,7);cx.fill();cx.stroke()}}});
if(G&&G.dec)L.push({y:G.dec.y,d:()=>{const d=G.dec,k=performance.now();cx.strokeStyle='rgba(120,240,255,.7)';cx.lineWidth=2;cx.beginPath();cx.ellipse(d.x,d.y+16,20,7,0,0,7);cx.stroke();crew(cx,d.x,d.y,{col:d.col,hat:d.hat,skin:d.skin,f:d.f,ws:0,a:.6+.2*Math.sin(k/80)})}});
P.forEach(p=>{if(p.dead&&!e.dead)return;if(p.hid&&p!==e)return;L.push({y:p.y,d:()=>{crew(cx,p.x,p.y,{col:p.col,hat:p.hat,skin:p.skin,f:p.f,wk:p.wk,mv:p.mv,ws:p.ws,ghost:p.dead,a:p.dead?.55:p.hid?.4:1});cx.font='bold 11px system-ui';cx.textAlign='center';cx.fillStyle=p.imp&&e.imp?'#f44':'#fff';cx.fillText(p.name,p.x,p.y-52)}})});
L.sort((a,b)=>a.y-b.y).forEach(o=>o.d());
if(G)for(const f of G.fx){if(f.ring){const r=(.5-f.l)*320;cx.strokeStyle='rgba('+(f.c2||'255,255,255')+','+f.l*2+')';cx.lineWidth=5;cx.beginPath();cx.arc(f.x,f.y,r,0,7);cx.stroke()}else{cx.globalAlpha=Math.min(1,f.l*2);cx.fillStyle=f.c;cx.fillRect(f.x,f.y,f.r*2,f.r*2);cx.globalAlpha=1}}
cx.restore();fx2();{const g=cx.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.55)');cx.fillStyle=g;cx.fillRect(0,0,W,H)}if(G&&((G.an&&G.an.k==2)||(G.sab&&G.sab.k=='lights'&&!e.imp))&&!e.dead){const g=cx.createRadialGradient(W/2,H/2,Math.min(W,H)*.08,W/2,H/2,Math.min(W,H)*.3);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.96)');cx.fillStyle=g;cx.fillRect(0,0,W,H)}if(G&&WALK==GWALK&&G.pl>0)drawMini()}
// NEW kill cutscene: blade slash splits the victim in two, shards burst out
function drawKill(){const c=cut,t=c.t,u=Math.min(W,H)/170,k=c.k,v=c.v,h=t-.8;
const g=cx.createRadialGradient(W/2,H/2,20,W/2,H/2,Math.max(W,H)*.7);g.addColorStop(0,'#5a0d18');g.addColorStop(1,'#060106');cx.fillStyle=g;cx.fillRect(0,0,W,H);
cx.save();cx.translate(W/2,H/2);cx.strokeStyle='rgba(255,255,255,.08)';cx.lineWidth=2;for(let i=0;i<28;i++){const a=i*.2244+t*.3;cx.beginPath();cx.moveTo(Math.cos(a)*H*.25,Math.sin(a)*H*.25);cx.lineTo(Math.cos(a)*W,Math.sin(a)*W);cx.stroke()}cx.restore();
const sh=t>.8?Math.max(0,1-h*2.2):0;cx.save();cx.translate((RND()-.5)*sh*26,(RND()-.5)*sh*26);
const cy=H*.58,vx=W*.66,kx=t<.6?W*.2+t*W*.2:t<.8?W*.32+(t-.6)/.2*W*.22:W*.54;
const wz=k.kw||'knife',vo={col:v.col,hat:v.hat,skin:v.skin,sc:u,f:-1};
if(t<.8)crew(cx,vx,cy+Math.sin(t*8)*2,vo);
else if(h<1.1&&wz!='knife'){const a=Math.max(0,1-h/1.1);crew(cx,vx+h*18*u,cy+(wz=='bomb'?-h*90:h*22)*u,{...vo,rot:h*(wz=='bomb'?4:1.6),a})}else if(h<1.1){const a=Math.max(0,1-h/1.1);crew(cx,vx+h*60*u,cy-h*70*u,{...vo,clip:'top',rot:-h*1.5,a});crew(cx,vx-h*30*u,cy+h*(30+h*110)*u,{...vo,clip:'bottom',rot:h*.8,a})}
crew(cx,kx,cy,{col:k.col,hat:k.hat,skin:k.skin,sc:u,f:1,mv:t<.8?1:0,wk:t*14});
// weapon by kill method
if(wz=='knife'){
const ang=t<.6?-.5:t<.8?-.5+(t-.6)/.2*1.9:1.4;cx.save();cx.translate(kx+20*u,cy+3*u);cx.rotate(ang);const bg=cx.createLinearGradient(-3*u,0,3*u,0);bg.addColorStop(0,'#aab4c4');bg.addColorStop(.5,'#fff');bg.addColorStop(1,'#7d8794');cx.fillStyle=bg;cx.strokeStyle='#0b0b12';cx.lineWidth=2;cx.beginPath();cx.moveTo(-3*u,0);cx.lineTo(-3*u,-42*u);cx.lineTo(0,-52*u);cx.lineTo(3*u,-42*u);cx.lineTo(3*u,0);cx.closePath();cx.fill();cx.stroke();cx.fillStyle='#e8c53a';cx.fillRect(-7*u,-2*u,14*u,4*u);cx.restore();
// slash line
if(t>.72&&t<1.3){const p=Math.min(1,(t-.72)/.1),al=1-Math.max(0,(t-.85)/.45),x0=vx-65*u,y0=cy-70*u,x1=vx+65*u,y1=cy+50*u;cx.lineCap='round';cx.strokeStyle='rgba(255,255,255,'+al+')';cx.lineWidth=8*u*al;cx.beginPath();cx.moveTo(x0,y0);cx.lineTo(x0+(x1-x0)*p,y0+(y1-y0)*p);cx.stroke();cx.strokeStyle='rgba(255,43,74,'+al+')';cx.lineWidth=3*u*al;cx.stroke()}
}
else {const hx=kx+22*u,hy=cy+2*u,f=Math.max(0,Math.min(1,(t-.55)/.25));cx.lineCap='round';cx.lineWidth=2;cx.strokeStyle='#0b0b12';
if(wz=='pistol'){cx.fillStyle='#4a5260';cx.fillRect(hx-2*u,hy-5*u,16*u,7*u);cx.strokeRect(hx-2*u,hy-5*u,16*u,7*u);cx.fillRect(hx,hy,5*u,10*u);if(t>.7&&t<.95){cx.fillStyle='#ffd54a';cx.beginPath();cx.arc(hx+18*u,hy-2*u,(.95-t)*40*u,0,7);cx.fill();cx.strokeStyle='rgba(255,230,120,.9)';cx.lineWidth=3*u;cx.beginPath();cx.moveTo(hx+18*u,hy-2*u);cx.lineTo(vx,cy-10*u);cx.stroke()}}
else if(wz=='laser'){cx.fillStyle='#38a8ff';cx.fillRect(hx-2*u,hy-6*u,18*u,9*u);cx.strokeRect(hx-2*u,hy-6*u,18*u,9*u);if(t>.5&&t<1.15){const w2=Math.min(1,(t-.5)/.3);cx.save();cx.shadowColor='#4cf';cx.shadowBlur=20*u;cx.strokeStyle='rgba(120,220,255,'+(1-Math.max(0,t-.95)/.2)+')';cx.lineWidth=(t<.8?2:7)*u;cx.beginPath();cx.moveTo(hx+16*u,hy-2*u);cx.lineTo(hx+16*u+(vx-hx-16*u)*w2,cy-8*u);cx.stroke();cx.restore()}}
else if(wz=='bomb'){const bx=t<.5?hx+8*u:vx-34*u;if(t<1.5){cx.fillStyle='#22262e';cx.beginPath();cx.arc(bx,cy+10*u,8*u,0,7);cx.fill();cx.stroke();cx.fillStyle=t%.2<.1?'#f44':'#fa0';cx.beginPath();cx.arc(bx+4*u,cy+2*u,2.5*u,0,7);cx.fill()}if(t>.78&&t<1.5){const r=(t-.78)*150*u;cx.fillStyle='rgba(255,160,30,'+(1.5-t)+')';cx.beginPath();cx.arc(vx,cy,r,0,7);cx.fill();cx.fillStyle='rgba(255,240,150,'+(1.3-t)+')';cx.beginPath();cx.arc(vx,cy,r*.55,0,7);cx.fill()}}
else if(wz=='arrow'){cx.strokeStyle='#7a5a32';cx.lineWidth=3*u;cx.beginPath();cx.arc(hx+6*u,hy-4*u,14*u,-1.2,1.2);cx.stroke();const ax2=hx+8*u+(vx-hx)*f;if(t<1.4){cx.strokeStyle='#cfe8c0';cx.lineWidth=2*u;cx.beginPath();cx.moveTo(ax2-18*u,cy-4*u);cx.lineTo(ax2,cy-4*u);cx.stroke();cx.fillStyle='#ddd';cx.beginPath();cx.moveTo(ax2,cy-8*u);cx.lineTo(ax2+7*u,cy-4*u);cx.lineTo(ax2,cy);cx.fill()}}}
if(c.ps)for(const p of c.ps){if(p.l<=0)continue;cx.save();cx.translate(p.x,p.y);cx.rotate(p.l*8);cx.fillStyle=p.c;cx.globalAlpha=Math.min(1,p.l);cx.fillRect(-p.z/2,-p.z/2,p.z,p.z);cx.restore()}
cx.restore();
if(t>.78&&t<1){cx.fillStyle='rgba(255,255,255,'+(1-(t-.78)/.22)*.85+')';cx.fillRect(0,0,W,H)}
if(t>1.1){cx.globalAlpha=Math.min(1,(t-1.1)*3);cx.textAlign='center';cx.font='900 '+Math.min(40,W/10)+'px system-ui';cx.lineWidth=6;cx.strokeStyle='#000';cx.fillStyle='#ff4466';const s=(v.id==0?'You were':v.name+' was')+' eliminated';cx.strokeText(s,W/2,H*.25);cx.fillText(s,W/2,H*.25);cx.globalAlpha=1}
cx.fillStyle='#000';cx.fillRect(0,0,W,H*.12);cx.fillRect(0,H*.88,W,H*.12)}
function draw(){cx.setTransform(dpr,0,0,dpr,0,0);cx.fillStyle='#05070d';cx.fillRect(0,0,W,H);
if(state=='MENU')drawMenu();else if(state=='KILL'&&cut)drawKill();else if(state=='EJECT'&&ejc)drawEject();else if(state=='INTRO')drawIntro();else if(state=='END'&&E)drawEnd();else drawWorld()}
let last=0;function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;update(dt);draw();requestAnimationFrame(loop)}
let NET=null;
const mp=()=>(NET.R.peers().find(p=>p.isMe)||{}).peer,ids=()=>{const q=new Set(NET.R.peers().filter(p=>p.presence&&p.presence.c!=null).map(p=>p.peer));q.add(mp());return[...q].sort()},netHost=()=>ids()[0]==mp(),gp=i=>i=='skip'?'skip':(P[i].pid||mp());
function netSync(){if(!NET||state!='LOBBY')return;P.length=1;NET.R.peers().forEach(p=>{if(p.isMe||!p.presence||p.presence.c==null)return;const s=p.presence,o=mk(P.length,s.c|0,s.h|0,s.s|0);o.pid=p.peer;o.x=s.x||500;o.y=s.y||330;P.push(o)});$('code').textContent='Room: '+NET.c+'  '+P.length+' online'}
$('onl').onclick=async()=>{const c=($('rc').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(!c){toast('Type a room code first');return}
let R=null;try{const rm=await window.claude.use('room');R=rm&&await rm.join(c)}catch(e){}
if(!R){toast('Online needs a signed-in claude.ai view of this page');return}
if(NET){clearInterval(NET.iv)}NET={R,c};enterLobby();R.presence({c:me.col,h:me.hat,s:me.skin});
NET.iv=setInterval(()=>{const p=P[0];if(p)R.presence({c:me.col,h:me.hat,s:me.skin,x:Math.round(p.x),y:Math.round(p.y),f:p.f,m:p.mv,hd:p.hid})},80);
R.onPeers(ch=>{if(state=='LOBBY'&&(ch.joined.length||ch.left.length||ch.updated.some(p=>!p.isMe&&p.presence&&p.presence.c!=null&&!P.find(q=>q.pid==p.peer))))netSync();
for(const p of ch.updated){const o=P.find(q=>q.pid==p.peer),s=p.presence;if(o&&s&&s.x!=null){o.tx=s.x;o.ty=s.y;o.f=s.f||1;o.mv=s.m?1:0;o.wk+=.6;if(state!='LOBBY')o.hid=s.hd?1:0}}
if(state!='LOBBY')for(const p of ch.left){const o=P.find(q=>q.pid==p.peer);if(o&&!o.dead){o.dead=1;o.x=o.tx=-999;if(G)chk()}}});
R.on('go',m=>{const d=m.data;if(state!='LOBBY'||!d||!Array.isArray(d.ps)||m.peer!=ids()[0])return;const np=[P[0]];d.ps.forEach(id=>{if(id==mp())return;const o=P.find(q=>q.pid==id);if(o){o.id=np.length;np.push(o)}});P=np;NET.ii=(Array.isArray(d.imps)?d.imps.slice(0,3):[d.imp]).map(id=>id==mp()?0:Math.max(0,P.findIndex(q=>q.pid==id)));me.map=d.map|0;startGame()});
R.on('kill',m=>{if(m.isMe||state!='PLAY')return;const d=m.data||{},k=P.find(q=>q.pid==m.peer),v=d.v==mp()?P[0]:P.find(q=>q.pid==d.v);if(k&&v&&k.imp&&!k.dead&&!v.dead&&!v.imp&&dist(k,v)<120&&G.t>=9&&(k.lk==null||G.t-k.lk>=12)){k.lk=G.t;startKill(k,v)}});
R.on('meet',m=>{if(m.isMe||state!='PLAY')return;const rp=P.find(q=>q.pid==m.peer),b=m.data&&m.data.b>=0?G.body[m.data.b]:null;if(rp&&!rp.dead&&(b||Math.hypot(rp.x-EB[0],rp.y-EB[1])<260))meet(rp,b)});
R.on('vote',m=>{const t=G&&G.mt;if(t&&t.ph=='v'&&!m.isMe&&m.data&&typeof m.data.t=='string')t.vs[m.peer]=m.data.t});
R.on('task',m=>{const o=P.find(q=>q.pid==m.peer);if(m.isMe||!G||G.over||!o||o.imp)return;o.tc=(o.tc||0)+1;if(o.tc>4)return;G.done++;chk()});
R.on('chat',m=>{if(m.isMe||!G||!G.mt)return;const o=P.find(q=>q.pid==m.peer);if(o&&m.data&&typeof m.data.s=='string')say(o,m.data.s.slice(0,60))});
R.on('sab',m=>{const d=m.data,k=P.find(q=>q.pid==m.peer);if(m.isMe||!G||state!='PLAY'||G.sab||!d||!k||!k.imp||k.dead||!(d.k>=0&&d.k<3))return;startSab(d.k|0,d.a|0,d.b|0,Array.isArray(d.ds)?d.ds.filter(Number.isInteger):[])});R.on('fix',m=>{if(!m.isMe&&G&&G.sab&&G.sab.fx&&m.data&&G.sab.fx[m.data.j|0])fixSab(m.data.j|0,1)});
R.on('anom',m=>{const a=G&&state!='LOBBY'&&ANS[(m.data&&m.data.k)-1];if(a){G.an={k:m.data.k,l:12};toast('STARSHIFT: '+a[0]);G.sh=.4;snd(120,.5,'sawtooth')}});
netSync()};
const RL={pulse:'\u{1F6E1} PULSE',runner:'\u26A1 DASH',decoy:'\u25C8 DECOY',sci:'\u2665 VITALS',engi:'\u2699 VENT',trk:'\u25CE TRACK',det:'\u2315 PROBE',infl:'\u2605 x2 VOTE',shift:'\u21C4 SHIFT',phan:'\u25CC PHASE',viper:'\u2623 DISSOLVE'},CRN={none:'Crew role: None',random:'Crew role: Random',pulse:'Crew: Pulsekeeper',runner:'Crew: Signal Runner',decoy:'Crew: Decoy',sci:'Crew: Scientist',engi:'Crew: Engineer',trk:'Crew: Tracker',det:'Crew: Detective',infl:'Crew: Influencer'},CRK=Object.keys(CRN),CRL=CRK.slice(2),IRN={none:'Imp role: None',random:'Imp role: Random',shift:'Imp: Shapeshifter',phan:'Imp: Phantom',viper:'Imp: Viper'},IRK=Object.keys(IRN),IRL=IRK.slice(2),KWN={random:'Weapon: Random',knife:'Weapon: Knife',pistol:'Weapon: Pistol',laser:'Weapon: Laser',bomb:'Weapon: Bomb',arrow:'Weapon: Arrow'},KW0=Object.keys(KWN),KW=KW0.slice(1);let pbS='',stx='';
function maxImp(){return Math.max(1,Math.min(3,(P.length-1)>>1))}
function setTxt(){const t=Math.min(me.ni||1,maxImp())+'|'+(me.cr||'none')+(me.ir||'none')+(me.kw||'random')+NET;if(t==stx)return;stx=t;$('nimp').textContent='Impostors: '+Math.min(me.ni||1,maxImp());$('crb').textContent=NET?'Roles: offline only':CRN[me.cr||'none'];$('irb').textContent=NET?'':IRN[me.ir||'none'];$('irb').style.display=NET?'none':'';$('kwb').textContent=KWN[me.kw||'random']}
$('nimp').onclick=()=>{if(NET&&!netHost()){toast('Only the host sets impostors');return}const mx=maxImp();me.ni=(Math.min(me.ni||1,mx)%mx)+1;if(mx==1)toast('Need more players for 2+ impostors');save();setTxt()};
const cyc=(k,L,d)=>{if(NET)return;me[k]=L[(L.indexOf(me[k]||d)+1)%L.length];save();setTxt()};$('crb').onclick=()=>cyc('cr',CRK,'none');$('irb').onclick=()=>cyc('ir',IRK,'none');$('kwb').onclick=()=>{me.kw=KW0[(KW0.indexOf(me.kw||'random')+1)%KW0.length];save();setTxt()};
const dd=p=>p.dead&&(p.kn||p===P[0]||P[0].dead||(G&&G.vit>0));
function clr0(){const e=P[0];if(!e)return;if(e.sh0){e.col=e.sh0.col;e.hat=e.sh0.hat;e.skin=e.sh0.skin;e.sh0=null}e.shT=0;if(e.pt>0){e.pt=0;e.hid=0}}
function roleUse(e){const r=e.rl;if(r=='engi'){if(e.vent>=0){e.vent=-1;e.hid=0;e.used=1;return}if(e.used)return;const i=VENTS.findIndex(v=>Math.hypot(v[0]-e.x,v[1]-e.y)<70);if(i<0){toast('Get next to a vent');return}e.vent=i;e.hid=1;e.vm=10;e.x=VENTS[i][0];e.y=VENTS[i][1];snd(200,.15);return}
if(e.used)return;const nb=P.filter(o=>o!==e&&!o.dead).sort((a,b)=>dist(a,e)-dist(b,e))[0];
if(r=='pulse'){G.pu={x:e.x,y:e.y,t:5};toast('PULSE SHIELD ACTIVE');snd(900,.3,'sine')}
else if(r=='runner'){e.bo=Math.max(e.bo||0,4);toast('SIGNAL DASH');snd(1000,.2)}
else if(r=='decoy'){G.dec={x:e.x,y:e.y,f:e.f,col:e.col,hat:e.hat,skin:e.skin,t:12};toast('HOLOGRAM DEPLOYED');snd(600,.2,'triangle')}
else if(r=='sci'){G.vit=10;toast('VITALS ONLINE: crew status shown for 10s');snd(700,.2,'sine')}
else if(r=='trk'){if(!nb)return;G.trk={p:nb,t:20};toast('Tracking '+nb.name);snd(800,.15)}
else if(r=='det'){if(!nb||dist(nb,e)>130){toast('Stand next to someone to probe');return}toast(nb.name+(nb.sus&&G.t-nb.sus<60?': was near a recent kill':': nothing unusual'));snd(600,.2)}
else if(r=='infl'){toast('Your vote counts double');return}
else if(r=='shift'){if(!nb)return;e.sh0={col:e.col,hat:e.hat,skin:e.skin};e.col=nb.col;e.hat=nb.hat;e.skin=nb.skin;e.shT=15;G.fx.push({x:e.x,y:e.y,ring:1,l:.5,c2:'255,80,80'});toast('Shifted into '+nb.name);snd(450,.3,'sawtooth')}
else if(r=='phan'){e.pt=6;e.hid=1;toast('PHASED OUT: cannot kill');snd(350,.3,'sine')}
else if(r=='viper'){const b=G.body.find(o=>!o.rep&&Math.hypot(o.x-e.x,o.y-e.y)<110);if(!b){toast('No body nearby');return}G.body.splice(G.body.indexOf(b),1);G.fx.push({x:b.x,y:b.y,ring:1,l:.5,c2:'120,255,80'});toast('Body dissolved');snd(250,.4,'sawtooth')}
else return;e.used=1}
function bodyFx(b){const w=b.w||'knife';cx.save();if(w=='laser'){cx.fillStyle='rgba(80,200,255,.25)';cx.beginPath();cx.ellipse(b.x,b.y+10,28,12,0,0,7);cx.fill();cx.fillStyle='#8df';for(let i=0;i<5;i++)cx.fillRect(b.x-20+i*9,b.y-4+Math.sin(performance.now()/200+i)*6,3,3)}else if(w=='bomb'){cx.fillStyle='rgba(20,20,24,.55)';cx.beginPath();cx.ellipse(b.x,b.y+10,32,13,0,0,7);cx.fill();cx.fillStyle='#fa3';for(let i=0;i<5;i++)cx.fillRect(b.x-24+i*12,b.y+6+(i%2)*6,3,3)}else{cx.fillStyle='rgba(150,10,25,.75)';cx.beginPath();cx.ellipse(b.x,b.y+10,w=='knife'?30:24,12,0,0,7);cx.fill();if(w=='arrow'){cx.strokeStyle='#cfe8c0';cx.lineWidth=2;cx.beginPath();cx.moveTo(b.x-6,b.y-14);cx.lineTo(b.x+8,b.y-4);cx.stroke()}}cx.restore()}
$('ba').onclick=()=>act('role');
function pbar(pl){const b=$('pb');b.style.display=pl?'flex':'none';if(!pl||!P.length)return;const sg=P.map(p=>p.col+(dd(p)?'d':'')+(p.imp&&P[0].imp?'i':'')).join();if(sg==pbS)return;pbS=sg;b.innerHTML='';P.forEach(p=>{const d=document.createElement('div');d.className='pc'+(dd(p)?' dx':'')+(p.imp&&P[0].imp?' im':'')+(p===P[0]?' me':'');const c=document.createElement('canvas');c.width=48;c.height=56;crew(c.getContext('2d'),24,42,{col:p.col,hat:p.hat,skin:p.skin,sc:.95,ghost:dd(p),ws:0});d.appendChild(c);b.appendChild(d)})}
const SK=['lights','lock','reactor'],SKN=['LIGHTS','DOORS','REACTOR'];
function botRole(b,dt){if(b.dead||!b.rl||b.used)return;const r=b.rl;
if(r=='pulse'||r=='runner'){if(P.some(o=>o.imp&&!o.dead&&!o.hid&&dist(o,b)<140)){b.used=1;if(r=='pulse')G.pus.push({x:b.x,y:b.y,t:5});else b.bo=4}}
else if(r=='viper'){const bd=G.body.find(o=>!o.rep&&dist(o,b)<110);if(bd&&RND()<dt*1.5){G.body.splice(G.body.indexOf(bd),1);G.fx.push({x:bd.x,y:bd.y,ring:1,l:.5,c2:'120,255,80'});b.used=1}}
else if(r=='phan'){if(b.cd<=0&&P.some(o=>!o.imp&&!o.dead&&dist(o,b)<220)){b.used=1;b.hid=1;b.pt=5}}}
function trigSab(k){if(!G||G.sab||G.sc>0||G.over||state!='PLAY')return;const n=ST.length||1,a=RND()*n|0;let b=RND()*n|0;if(b==a)b=(a+3)%n;const D=curDef().doors||[],ds=[];if(k==1)D.forEach((d,i)=>{if(!P.some(p=>!p.dead&&Math.hypot(p.x-d[0],p.y-d[1])<(d[3]||60)/2+45))ds.push(i)});if(NET)NET.R.emit('sab',{k,a,b,ds});startSab(k,a,b,ds)}
function startSab(k,a,b,ds){const D=curDef().doors||[],n=ST.length||1;G.sab={k:SK[k],t:k==2?40:k==1?15:0,fx:k==1?null:(k==2?[a,b]:[a]).map(i=>({x:ST[i%n][0],y:ST[i%n][1],d:0,t:0})),lk:[]};
if(k==1)ds.slice(0,8).forEach(i=>{const d=D[i];if(!d)return;const r=d[2]=='v'?[d[0]-5,d[1]-d[3]/2,10,d[3]]:[d[0]-d[3]/2,d[1]-5,d[3],10];GSOL.push(r);G.sab.lk.push(r)});
G.sc=35;P.forEach(p=>p.sr=2+RND()*6);toast(['LIGHTS OUT! Find the fuse box','DOORS LOCKED','REACTOR MELTDOWN! Fix both panels'][k]);G.sh=.4;snd(150,.5,'sawtooth')}
function fixSab(j,rm){const s=G.sab;if(!s||!s.fx||s.fx[j].d)return;if(NET&&!rm)NET.R.emit('fix',{j});if(s.k=='lights'){endSab();toast('Lights restored');return}s.fx[j].d=1;s.fx[j].t=12;snd(700,.15);if(s.fx.every(f=>f.d)){endSab();toast('Reactor stabilised')}else toast('Half fixed: use the other panel within 12s')}
function endSab(){const s=G.sab;if(s)s.lk.forEach(r=>{const i=GSOL.indexOf(r);if(i>=0)GSOL.splice(i,1)});G.sab=null}
function sabTick(dt){G.sc=Math.max(0,(G.sc||0)-dt);const s=G.sab;if(!s)return;if(s.k=='reactor'){s.t-=dt;s.fx.forEach(f=>{if(f.d&&(f.t-=dt)<=0)f.d=0});if(s.t<=0){endSab();G.why='reactor';finish('imp')}}else if(s.k=='lock'&&(s.t-=dt)<=0){endSab();toast('Doors unlocked')}}
function sabTxt(){const s=G.sab;return s.k=='reactor'?'REACTOR MELTDOWN '+Math.ceil(s.t)+'s':s.k=='lights'?'LIGHTS OUT: fix the fuse box':'DOORS LOCKED '+Math.ceil(s.t)+'s'}
$('bz').onclick=()=>{const e=P[0];if(state=='PLAY'&&e.imp&&!e.dead&&!tkOpen){trigSab(e.sk|0);if(G.sab)e.sk=((e.sk|0)+1)%3}};
let E=null;const CFW=['#ffd54a','#4cc3ff','#ffffff','#8be9ff','#f5b83a'],CFD=['#5a0d18','#8a1224','#2a2f3a','#ff3b4a','#401018'],WPN={knife:'KNIFE',pistol:'PISTOL',laser:'LASER',bomb:'BOMB',arrow:'ARROW'};
const eCl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),eEz=p=>1-Math.pow(1-eCl(p),3);
function endInit(r,win){const imps=P.filter(e=>e.imp),nI=imps.length,tc=p=>NET&&p.id?(p.tc||0):p.tasks.filter(t=>t.done).length,cp=(p,i)=>({col:p.col,hat:p.hat,skin:p.skin,dead:p.dead,imp:p.imp,name:p.name,wk:RND()*6,ws:0,side:i%2?1:-1});
const wn=P.filter(e=>(r=='imp')==!!e.imp).map(cp),ls=P.filter(e=>(r=='imp')!=!!e.imp).map(cp);
const kp=[...P].sort((a,b)=>(b.kc||0)-(a.kc||0))[0],tp=P.filter(e=>!e.imp).sort((a,b)=>tc(b)-tc(a))[0];
const mk=(x,y,a,n,l)=>{const q=[[x,y]];for(let i=0;i<n;i++){a+=(RND()-.5)*1.1;x+=Math.cos(a)*l;y+=Math.sin(a)*l;q.push([x,y])}return q},cr=[];
for(let i=0;i<7;i++){const c=i<4?[i&1,i>>1&1]:[RND(),RND()<.5?0:1],a=Math.atan2(.5-c[1],.5-c[0]),m=mk(c[0],c[1],a,7,.07);cr.push(m);cr.push(mk(m[3][0],m[3][1],a+(RND()<.5?-1:1)*.9,4,.05))}
E={t:0,r,win,nI,why:G.why||(r=='imp'?'elim':'voted'),W:wn,L:ls,imps:imps.map(cp),cf:[],cr,
st:{tasks:Math.min(G.done,G.total),total:G.total,kills:(G.kl||[]).length,meet:G.mc||0,rounds:(G.mc||0)+1,kl:(G.kl||[]).slice(),mk:kp&&kp.kc>0?kp.name+' x'+kp.kc:'',mt:tp&&tc(tp)>0?tp.name+' '+tc(tp):''}};
$('en').classList.remove('rdy');$('emenu').style.display=NET?'none':'';
(win?[[523,0],[659,.13],[784,.26],[1047,.4],[1319,.6]]:[[196,0],[147,.3],[98,.6],[65,.95]]).forEach(([f,d])=>setTimeout(()=>snd(f,win?.3:.5,win?'triangle':'sawtooth'),d*1000))}
$('emenu').onclick=()=>{if(!NET)setState('MENU')};
$('en').addEventListener('pointerdown',ev=>{if(E&&state=='END'&&ev.target===$('en')&&E.t<2.5)E.t=2.5});
function eSlot(i,n,u){const two=n>6,cols=two?Math.ceil(n/2):n,row=two?i%2:0,c=two?i>>1:i,span=W*.84,st=span/cols;return{x:W*.08+st*(c+.5)+(two?(row?st*.25:-st*.25):0),y:H*(two?.465+row*.07:.5),sc:Math.min(1.15*u,st/30,H*.0021),row}}
function endTick(dt){const e=E;if(e.t>1.5)$('en').classList.add('rdy');
const mx=e.win?80:36;if(e.t>.3&&e.cf.length<mx&&RND()<.5)e.cf.push({x:RND()*W,y:-10,vx:(RND()-.5)*60,vy:(e.win?70:25)+RND()*80,r:3+RND()*3,a:RND()*6,va:(RND()-.5)*10,c:(e.win?CFW:CFD)[RND()*5|0]});
for(const q of e.cf){q.x+=q.vx*dt;q.y+=q.vy*dt;q.a+=q.va*dt;q.vx+=Math.sin(e.t*2+q.a)*10*dt}e.cf=e.cf.filter(q=>q.y<H+20);
e.W.forEach((p,i)=>{const pr=eCl((e.t-.9-i*.07)/.9),mv=pr>0&&pr<1;if(mv)p.wk+=dt*14;p.ws+=((mv?1:0)-p.ws)*Math.min(1,dt*10)})}
function drawEnd(){const e=E,t=e.t,win=e.win,u=Math.max(.75,Math.min(1.3,Math.min(W/380,H/640))),S=e.st,
pal=win?{a:'#ffd54a',b:'#7fd4ff',g0:'#10305a',g1:'#030814'}:{a:'#ff4455',b:'#ff9aa5',g0:'#4a0a12',g1:'#050205'};
cx.save();const sk=Math.max(0,1-t/.7)*14*u+(t>.55&&t<.8?(.8-t)*40*u:0);cx.translate((RND()-.5)*sk,(RND()-.5)*sk);
const g=cx.createRadialGradient(W/2,H*.45,10,W/2,H*.45,Math.max(W,H)*.75);g.addColorStop(0,pal.g0);g.addColorStop(1,pal.g1);cx.fillStyle=g;cx.fillRect(-20,-20,W+40,H+40);
cx.globalAlpha=.35;cx.fillStyle='#fff';mn.st.forEach(q=>cx.fillRect(q.x*W,q.y*H,q.z*1.6,q.z*1.6));cx.globalAlpha=1;
if(win){cx.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const bx=W*(i+.5)/7+Math.sin(t*.5+i)*20,bw=W/8,bg=cx.createLinearGradient(0,H,0,0);const c=i%2?'76,195,255':'255,213,74';bg.addColorStop(0,'rgba('+c+','+(.26*eEz(t/.8)*(.6+.4*Math.sin(t*1.5+i)))+')');bg.addColorStop(1,'rgba('+c+',0)');cx.fillStyle=bg;cx.fillRect(bx-bw/2,0,bw,H)}cx.globalCompositeOperation='source-over'}
const ga=eEz((t-1.1)/1)*.28;if(ga>0)e.L.forEach((p,j)=>{crew(cx,W*(.12+.76*((j*.618)%1)),H*.37+H*.03*Math.sin(j*2.1)+Math.sin(t*1.2+j)*5,{col:p.col,hat:p.hat,skin:p.skin,ghost:true,sc:.7*u,a:ga,ws:0})});
for(const q of e.cf){cx.save();cx.translate(q.x,q.y);cx.rotate(q.a);cx.scale(Math.cos(q.a*2),1);cx.fillStyle=q.c;cx.fillRect(-q.r,-q.r*.6,q.r*2,q.r*1.2);cx.restore()}
{const n=e.W.length,sl=e.W.map((p,i)=>({p,i,s:eSlot(i,n,u)})).sort((a,b)=>a.s.y-b.s.y);for(const{p,i,s}of sl){const pr=eCl((t-.9-i*.07)/.9),x0=p.side<0?-50:W+50,x=x0+(s.x-x0)*eEz(pr),arr=t-(.9+i*.07+.9),hop=!p.dead&&win&&arr>0&&arr<1.2?Math.max(0,Math.sin(arr*5))*8*u:0,y=s.y+(p.dead?Math.sin(t*2+i)*4:Math.sin(t*3+i)*1.2),sc=s.sc;
const ac=p.imp?'255,59,74':'56,224,255',pu=.75+.25*Math.sin(t*3+i),cy=y-10*sc,ra=cx.createRadialGradient(x,cy,2,x,cy,40*sc);ra.addColorStop(0,'rgba('+ac+','+.5*pu*eCl(pr*3)+')');ra.addColorStop(1,'rgba('+ac+',0)');cx.fillStyle=ra;cx.fillRect(x-44*sc,cy-44*sc,88*sc,88*sc);
cx.fillStyle='rgba(0,0,0,.35)';cx.beginPath();cx.ellipse(x,y+18*sc,16*sc,5*sc,0,0,7);cx.fill();
crew(cx,x,y-hop*1,{col:p.col,hat:p.hat,skin:p.skin,sc,f:pr<1?-p.side:(x<W/2?1:-1),wk:p.wk,ws:p.ws,ghost:p.dead,a:p.dead?.55:1})}}
if(!win){const vg=cx.createRadialGradient(W/2,H/2,Math.min(W,H)*.25,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(120,0,15,.6)');cx.fillStyle=vg;cx.fillRect(-20,-20,W+40,H+40);
const cp=eCl((t-.35)/.5);if(cp>0){cx.lineCap='round';for(const q of e.cr){const m=Math.floor((q.length-1)*cp);if(m<1)continue;for(const[c,w]of[['rgba(0,0,0,.7)',3.5*u],['rgba(255,255,255,.6)',1.4*u]]){cx.strokeStyle=c;cx.lineWidth=w;cx.beginPath();cx.moveTo(q[0][0]*W,q[0][1]*H);for(let i=1;i<=m;i++)cx.lineTo(q[i][0]*W,q[i][1]*H);cx.stroke()}}}
cx.fillStyle='rgba(0,0,0,.12)';for(let y=0;y<H;y+=4)cx.fillRect(0,y,W,1)}
// title
const ts=Math.min(W*.16,H*.095),pT=eCl((t-.3)/.45),c1=1.70158,c3=c1+1,eb=1+c3*Math.pow(pT-1,3)+c1*Math.pow(pT-1,2),tsc=3-2*eb,txt=win?'VICTORY':'DEFEAT';
if(pT>0){cx.save();cx.translate(W/2,H*.17);cx.scale(tsc,tsc);cx.globalAlpha=Math.min(1,pT*3);cx.textAlign='center';cx.textBaseline='middle';cx.font='900 '+ts+'px system-ui';cx.lineJoin='round';
if(!win&&t>.95&&Math.sin(t*23)>.82){cx.fillStyle='rgba(0,255,255,.6)';cx.fillText(txt,-6*u,0);cx.fillStyle='rgba(255,0,60,.7)';cx.fillText(txt,6*u,2)}
cx.shadowColor=pal.a;cx.shadowBlur=ts*.5;cx.lineWidth=ts*.1;cx.strokeStyle='#05070d';cx.strokeText(txt,0,0);cx.shadowBlur=0;
const tw=cx.measureText(txt).width,c=-.3+(t%2.4)/2.4*1.6,gr=cx.createLinearGradient(-tw/2,0,tw/2,0);gr.addColorStop(0,pal.a);gr.addColorStop(eCl(c-.12),pal.a);gr.addColorStop(eCl(c),'#fff');gr.addColorStop(eCl(c+.12),pal.a);gr.addColorStop(1,pal.a);cx.fillStyle=gr;cx.fillText(txt,0,0);cx.restore()}
const ta=eEz((t-.9)/.4);if(ta>0){cx.globalAlpha=ta;cx.textAlign='center';cx.textBaseline='middle';try{cx.letterSpacing=(2*u)+'px'}catch(_){}
cx.font='800 '+15*u+'px system-ui';cx.fillStyle=pal.b;cx.fillText(e.r=='imp'?(e.nI>1?'IMPOSTORS WIN':'IMPOSTOR WINS'):'CREW WINS',W/2,H*.245);
try{cx.letterSpacing='0px'}catch(_){}cx.font='600 '+12.5*u+'px system-ui';cx.fillStyle='#c9d6ea';cx.fillText({elim:'The crew was eliminated',tasks:'All tasks completed',voted:e.nI>1?'All Impostors were voted out':'The Impostor was voted out',reactor:'Reactor meltdown'}[e.why]||'',W/2,H*.275);
// impostor list
cx.font='700 '+11.5*u+'px system-ui';const ws=e.imps.map(p=>22*u+cx.measureText(p.name).width+12*u),tot=ws.reduce((a,b)=>a+b,0);let ix=W/2-tot/2;
e.imps.forEach((p,i)=>{crew(cx,ix+10*u,H*.318+8*u,{col:p.col,hat:p.hat,skin:p.skin,sc:.36*u,ws:0});cx.textAlign='left';cx.fillStyle='#ff6b78';cx.fillText(p.name,ix+22*u,H*.318);ix+=ws[i]});cx.globalAlpha=1}
// summary card
const ca=eEz((t-1.6)/.4);if(ca>0){const cw=Math.min(W*.92,460),x0=(W-cw)/2,y0=H*.6+(1-ca)*14,ch=H*.2,k=eEz((t-1.8)/.8);cx.globalAlpha=ca;rr(cx,x0,y0,cw,ch,14*u);cx.fillStyle='rgba(6,10,20,.8)';cx.fill();cx.strokeStyle=pal.a;cx.lineWidth=2;cx.stroke();cx.textAlign='center';cx.textBaseline='middle';
[[Math.round(S.tasks*k)+'/'+S.total,'TASKS'],[Math.round(S.kills*k),'KILLS'],[Math.round(S.meet*k),'MEETINGS'],[Math.round(S.rounds*k),'ROUNDS']].forEach(([v,l],i)=>{const x=x0+cw*(i+.5)/4;cx.fillStyle='#fff';cx.font='900 '+20*u+'px system-ui';cx.fillText(v,x,y0+ch*.2);cx.fillStyle=pal.a;cx.font='700 '+8.5*u+'px system-ui';cx.fillText(l,x,y0+ch*.37)});
const row=(items,y,draw)=>{cx.font='700 '+9.5*u+'px system-ui';const w=items.map(s=>cx.measureText(s.t).width+(s.d?10*u:0)+14*u),tt=w.reduce((a,b)=>a+b,0)+6*u*(items.length-1);let x=W/2-tt/2;items.forEach((s,i)=>{rr(cx,x,y-9*u,w[i],18*u,9*u);cx.fillStyle=s.f||'rgba(255,213,74,.16)';cx.fill();cx.strokeStyle=pal.a;cx.lineWidth=1;cx.stroke();if(s.d){cx.fillStyle=s.d;cx.beginPath();cx.arc(x+10*u,y,3.5*u,0,7);cx.fill()}cx.textAlign='left';cx.fillStyle='#fff';cx.fillText(s.t,x+7*u+(s.d?10*u:0),y+.5);x+=w[i]+6*u})};
const mv=[];if(S.mk)mv.push({t:'\u2605 KILLS '+S.mk});if(S.mt)mv.push({t:'\u2605 TASKS '+S.mt});if(!mv.length)mv.push({t:'\u2605 NO MVP'});row(mv,y0+ch*.58);
const kl=S.kl.slice(0,6).map(q=>({t:WPN[q.w]||'KNIFE',d:COLS[q.c],f:'rgba(255,68,85,.14)'}));if(S.kl.length>6)kl.push({t:'+'+(S.kl.length-6)});if(!kl.length)kl.push({t:'NO KILLS'});row(kl,y0+ch*.83);cx.globalAlpha=1}
cx.restore();
const bh=H*.07*eEz(t/.6);cx.fillStyle='#000';cx.fillRect(0,0,W,bh);cx.fillRect(0,H-bh,W,bh);
const fl=Math.max(0,1-t/.18)*.9+(t>.3&&t<.48?(.48-t)*1.4:0);if(fl>0){cx.fillStyle='rgba(255,255,255,'+Math.min(1,fl)+')';cx.fillRect(0,0,W,H)}}
[['bu','E'],['bk','Q'],['bv','V'],['br','R'],['bs','F'],['bz','T'],['ba','G']].forEach(([i,k])=>$(i).dataset.k=k);
addEventListener('keydown',e=>{if(e.code=='Escape'&&tkOpen)closeTk(0)});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
addEventListener('contextmenu',e=>{if(e.target.tagName!='INPUT')e.preventDefault()});
setState('MENU');requestAnimationFrame(loop);
