(function(){
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// reveal (safe to run alongside page's own observer)
var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting)x.target.classList.add('visible')})},{threshold:.1});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
// scroll progress
var bar=document.createElement('div');bar.className='scroll-progress';document.body.appendChild(bar);
addEventListener('scroll',function(){var h=document.documentElement;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+'%'},{passive:true});
// cursor glow on cards
document.addEventListener('mousemove',function(e){var c=e.target.closest&&e.target.closest('.about-card,.skill-card,.research-card,.kr-card');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')});
// ---- contact: obfuscated email + form ----
var W3F_KEY='adb364a9-cbce-4c1a-b083-c75c7e1f8c62'; // paste your free key from web3forms.com here
(function(){
 var slot=document.getElementById('email-slot'),addr='';
 if(slot){try{addr=atob(slot.getAttribute('data-e'))}catch(e){}
  if(addr){var a=document.createElement('a');a.href='mailto:'+addr;a.className='email-link';a.textContent=addr;slot.appendChild(a);
   var b=document.createElement('button');b.type='button';b.className='copy-btn';b.textContent='copy';
   b.onclick=function(){(navigator.clipboard?navigator.clipboard.writeText(addr):Promise.reject()).then(function(){b.textContent='copied'},function(){b.textContent='select & copy'});setTimeout(function(){b.textContent='copy'},2000)};slot.appendChild(b)}}
 var f=document.getElementById('contact-form');if(!f)return;
 var st=document.getElementById('form-status');
 function say(m,c){st.textContent=m;st.className='form-status '+(c||'')}
 f.addEventListener('submit',function(ev){ev.preventDefault();
  var d=new FormData(f);if(d.get('botcheck'))return;
  var n=(d.get('name')||'').trim(),e=(d.get('email')||'').trim(),m=(d.get('message')||'').trim();
  if(!n||!/^\S+@\S+\.\S+$/.test(e)||!m){say('Please fill in your name, a valid email and a message.','err');return}
  if(W3F_KEY.indexOf('YOUR_')===0){ // fallback until a key is set: open the visitor's mail app
   location.href='mailto:'+addr+'?subject='+encodeURIComponent('Message from '+n+' (website)')+'&body='+encodeURIComponent(m+'\n\n— '+n+' <'+e+'>');
   say('Opening your email app…');return}
  say('Sending…');
  fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify({access_key:W3F_KEY,subject:'Website message from '+n,name:n,email:e,message:m,botcheck:''})})
  .then(function(r){return r.json()}).then(function(j){if(j.success){say('Thanks, your message was sent.','ok');f.reset()}else{say('Could not send. Please email me directly.','err')}})
  .catch(function(){say('Could not send. Please email me directly.','err')})})
})();
// ---- publications: tabs rendered from publications.js ----
(function(){
 var list=document.getElementById('pubList'),tabsEl=document.getElementById('pubTabs'),btn=document.getElementById('showMoreBtn');
 if(!list||!tabsEl)return;
 var SHOW=8,cur=0,expanded=false;
 var data=(window.PUBLICATIONS||[]).slice().sort(function(a,b){return (b.year||9999)-(a.year||9999)});
 function esc(t){return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
 function fmtAuthors(t){return esc(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}
 function pos(p){
  if(typeof p.position==='number')return p.position;
  var a=String(p.authors||''),k=a.indexOf('**');if(k<0)return 0;
  var pre=a.slice(0,k);if(/et al|including|Collaboration|Consortium/i.test(pre))return 0;
  return pre.split(/\s*,\s*|\s+and\s+/).filter(function(x){return x.trim()}).length+1}
 var N=data.length;
 data.forEach(function(p,i){p._n=N-i;p._pos=pos(p);p._st=p.status||'published'});
 var TABS=[
  {label:'All',f:function(){return true}},
  {label:'First author',f:function(p){return p._pos===1}},
  {label:'Second author',f:function(p){return p._pos===2}},
  {label:'Third author',f:function(p){return p._pos===3}},
  {label:'Under review / In press',f:function(p){return p._st!=='published'}}];
 TABS.forEach(function(t,i){
  t.count=data.filter(t.f).length;
  var b=document.createElement('button');b.type='button';b.className='pub-tab'+(i===0?' active':'');
  b.setAttribute('role','tab');b.innerHTML=t.label+' <span class="pub-count">'+t.count+'</span>';
  b.addEventListener('click',function(){cur=i;expanded=false;
   Array.prototype.forEach.call(tabsEl.children,function(x,j){x.classList.toggle('active',j===i)});render()});
  tabsEl.appendChild(b)});
 function render(){
  var arr=data.filter(TABS[cur].f),cap=(cur===0&&!expanded)?SHOW:arr.length;
  list.innerHTML='';
  if(!arr.length){list.innerHTML='<p class="pub-empty">Nothing here yet.</p>'}
  arr.slice(0,cap).forEach(function(p,k){
   var el=document.createElement(p.link?'a':'div');
   if(p.link){el.href=p.link;el.target='_blank';el.rel='noopener'}
   el.className='pub-item pub-in';el.style.animationDelay=(Math.min(k,12)*40)+'ms';
   var badge=p._st==='in-press'?'In press':(p._st==='under-review'?'Under review':'');
   var num=cur===0?p._n:arr.length-k;
   el.innerHTML='<span class="pub-num">'+(num<10?'0':'')+num+'</span><div><div class="pub-title">'+esc(p.title)+'</div><div class="pub-authors">'+fmtAuthors(p.authors)+'</div><div class="pub-journal">'+esc(p.journal)+(p.year?' · '+p.year:'')+(p.note?' · '+esc(p.note):'')+(badge?'<span class="pub-badge">'+badge+'</span>':'')+'</div></div><span class="pub-arrow">→</span>';
   list.appendChild(el)});
  if(btn){var more=cur===0&&arr.length>SHOW;btn.style.display=more?'':'none';
   btn.textContent=expanded?'Show Fewer':'Show All Publications ('+arr.length+')'}}
 if(btn)btn.addEventListener('click',function(){expanded=!expanded;render()});
 render();
})();
if(RM)return;
// shooting stars
var sky=document.createElement('canvas');sky.className='fx-sky';document.body.prepend(sky);
var sx=sky.getContext('2d'),SW,SH,streaks=[];
function rs(){SW=sky.width=innerWidth;SH=sky.height=innerHeight}rs();addEventListener('resize',rs);
setInterval(function(){if(document.hidden)return;streaks.push({x:Math.random()*SW*.8+SW*.2,y:Math.random()*SH*.4,vx:-7-Math.random()*5,vy:3+Math.random()*3,l:1})},4500);
(function loop(){sx.clearRect(0,0,SW,SH);streaks=streaks.filter(function(s){return s.l>0});streaks.forEach(function(s){var g=sx.createLinearGradient(s.x,s.y,s.x-s.vx*9,s.y-s.vy*9);g.addColorStop(0,'rgba(255,255,255,'+s.l+')');g.addColorStop(1,'rgba(255,255,255,0)');sx.strokeStyle=g;sx.lineWidth=1.4;sx.beginPath();sx.moveTo(s.x,s.y);sx.lineTo(s.x-s.vx*9,s.y-s.vy*9);sx.stroke();s.x+=s.vx;s.y+=s.vy;s.l-=.012});requestAnimationFrame(loop)})();
})();