/* ============================================================
   INVITACIÓN BODA — EMILIO & LUISA · app.js
   ============================================================ */
(function(){
  'use strict';

  /* ---- Config editable ---- */
  const WEDDING_DATE = new Date('2026-12-05T13:00:00-05:00');
  const WHATSAPP_NUMBER = '573000000000'; // <-- reemplaza por tu número (código país, sin +)

  const $  = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];

  /* ============================================================
     1 · CONTADOR REGRESIVO
     ============================================================ */
  const cd = { d:$('#cd-d'), h:$('#cd-h'), m:$('#cd-m'), s:$('#cd-s') };
  function tick(){
    const diff = WEDDING_DATE - new Date();
    if (diff <= 0){ cd.d.textContent=cd.h.textContent=cd.m.textContent=cd.s.textContent='00'; return; }
    const dd = Math.floor(diff/86400000);
    const hh = Math.floor(diff%86400000/3600000);
    const mm = Math.floor(diff%3600000/60000);
    const ss = Math.floor(diff%60000/1000);
    cd.d.textContent = String(dd).padStart(2,'0');
    cd.h.textContent = String(hh).padStart(2,'0');
    cd.m.textContent = String(mm).padStart(2,'0');
    cd.s.textContent = String(ss).padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);

  /* ============================================================
     2 · APERTURA + MÚSICA
     ============================================================ */
  const body = document.body;
  const app = $('#app');
  const openBtn = $('#openBtn');
  const bgm = $('#bgm');
  const musicBtn = $('#musicBtn');
  const icSound = $('#icSound');
  const icMute = $('#icMute');
  let musicOn = false;

  function setMusic(on){
    musicOn = on;
    if (on){ bgm.play().catch(()=>{}); icSound.style.display=''; icMute.style.display='none'; }
    else  { bgm.pause(); icSound.style.display='none'; icMute.style.display=''; }
  }

  function openInvitation(){
    body.classList.remove('locked');
    app.classList.remove('hidden-pre');
    musicBtn.hidden = false;
    startPetals();
    setMusic(true);
    if (window.__revealInView) window.__revealInView();
    // desplazamiento cinematográfico suave hacia la presentación
    setTimeout(()=>{
      const intro = $('.intro');
      if (intro) window.scrollTo({ top: intro.offsetTop - 10, behavior:'smooth' });
      if (window.__revealInView) window.__revealInView();
    }, 650);
    // refuerzos por si el layout tarda en estabilizarse
    [300, 1000, 1600].forEach(t=> setTimeout(()=>{ if(window.__revealInView) window.__revealInView(); }, t));
  }
  openBtn.addEventListener('click', openInvitation);
  musicBtn.addEventListener('click', ()=> setMusic(!musicOn));
  const introPlay = $('#introPlay');
  if (introPlay) introPlay.addEventListener('click', ()=> setMusic(!musicOn));

  /* ============================================================
     3 · PÉTALOS + PARTÍCULAS DORADAS
     ============================================================ */
  const fx = $('#fx');
  let petalsStarted = false;
  function spawn(kind){
    const el = document.createElement('div');
    el.className = kind;
    const left = Math.random()*100;
    el.style.left = left + '%';
    const dur = kind==='petal' ? (8+Math.random()*7) : (7+Math.random()*8);
    el.style.animationDuration = dur+'s';
    el.style.animationDelay = (Math.random()*-dur)+'s';
    if (kind==='petal'){ const sc=.6+Math.random()*.8; el.style.transform=`scale(${sc})`; }
    fx.appendChild(el);
    setTimeout(()=> el.remove(), dur*1000 + 400);
  }
  function startPetals(){
    if (petalsStarted) return; petalsStarted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i=0;i<10;i++) spawn('spark');
    for (let i=0;i<6;i++) spawn('petal');
    setInterval(()=> spawn('spark'), 900);
    setInterval(()=> spawn('petal'), 1600);
  }

  /* ============================================================
     4 · SCROLL REVEAL
     ============================================================ */
  // Reveal basado en scroll (robusto frente a contenedores con overflow/max-height).
  let revealTicking = false;
  function revealInView(){
    const vh = window.innerHeight || document.documentElement.clientHeight;
    $$('.reveal').forEach(el=>{
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      // visible si entra en el viewport (con holgura inferior) y tiene tamaño
      if (r.height > 0 && r.top < vh * 0.9 && r.bottom > 0){
        el.classList.add('in');
      }
    });
  }
  function onScrollReveal(){
    if (revealTicking) return;
    revealTicking = true;
    requestAnimationFrame(()=>{ revealInView(); revealTicking = false; });
  }
  window.addEventListener('scroll', onScrollReveal, { passive:true });
  window.addEventListener('resize', onScrollReveal, { passive:true });
  // chequeo inicial (portada visible)
  revealInView();
  // exponer para llamarlo tras abrir la invitación
  window.__revealInView = revealInView;

  /* ============================================================
     5 · GALERÍA + LIGHTBOX
     ============================================================ */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  let gImgs = [], gIdx = 0;
  function collectGallery(){
    gImgs = $$('#gallery .g-item .photo').map(d=>{
      const bg = getComputedStyle(d).backgroundImage;
      const m = /url\(["']?(.*?)["']?\)/.exec(bg);
      return m ? m[1] : null;
    });
  }
  function openLB(i){
    collectGallery();
    if (!gImgs[i]){ return; } // sin foto cargada aún
    gIdx = i; lbImg.src = gImgs[i]; lb.classList.add('on');
  }
  function navLB(dir){
    let n = gIdx;
    for (let k=0;k<gImgs.length;k++){
      n = (n + dir + gImgs.length) % gImgs.length;
      if (gImgs[n]){ gIdx=n; lbImg.src=gImgs[n]; return; }
    }
  }
  $$('#gallery .g-item').forEach((it,i)=> it.addEventListener('click', ()=> openLB(i)));
  $('#lbClose').addEventListener('click', ()=> lb.classList.remove('on'));
  $('#lbPrev').addEventListener('click', ()=> navLB(-1));
  $('#lbNext').addEventListener('click', ()=> navLB(1));
  lb.addEventListener('click', e=>{ if(e.target===lb) lb.classList.remove('on'); });
  document.addEventListener('keydown', e=>{
    if (!lb.classList.contains('on')) return;
    if (e.key==='Escape') lb.classList.remove('on');
    if (e.key==='ArrowLeft') navLB(-1);
    if (e.key==='ArrowRight') navLB(1);
  });

  /* ============================================================
     6 · CÓDIGOS QR (pases digitales)
     ============================================================ */
  function makeQRs(){
    if (typeof QRCode === 'undefined') return;
    $$('.qr[data-qr]').forEach(box=>{
      box.innerHTML='';
      new QRCode(box, {
        text: box.dataset.qr,
        width: 132, height: 132,
        colorDark:'#2a241d', colorLight:'#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    });
  }
  makeQRs();

  /* ============================================================
     7 · RSVP → WhatsApp
     ============================================================ */
  const rsvpForm = $('#rsvpForm');
  const attend = $('#r-attend');
  attend.addEventListener('click', e=>{
    const lab = e.target.closest('label'); if(!lab) return;
    $$('label', attend).forEach(l=> l.classList.remove('on'));
    lab.classList.add('on');
  });
  rsvpForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name = $('#r-name').value.trim() || 'Invitado';
    const guests = $('#r-guests').value;
    const att = ($('label.on', attend)||{}).dataset?.val || 'Sí, allí estaré';
    const msg = $('#r-msg').value.trim();
    let text = `¡Hola Emilio y Luisa! 💛%0A%0A*Confirmación de asistencia*%0A`;
    text += `Nombre: ${name}%0A`;
    text += `Respuesta: ${att}%0A`;
    text += `Invitados: ${guests}%0A`;
    if (msg) text += `Mensaje: ${msg}%0A`;
    text += `%0A¡Nos vemos el 5 de diciembre! ✦`;
    // guarda localmente (demo)
    try{ localStorage.setItem('rsvp', JSON.stringify({name,guests,att,msg,ts:Date.now()})); }catch(_){}
    $('#rsvpOk').classList.add('on');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  });
  // restaurar
  try{
    const saved = JSON.parse(localStorage.getItem('rsvp')||'null');
    if (saved){ $('#r-name').value=saved.name||''; $('#r-guests').value=saved.guests||'1'; if(saved.msg)$('#r-msg').value=saved.msg; }
  }catch(_){}

  /* ============================================================
     8 · CANCIÓN IMPERDIBLE (sugerencias)
     ============================================================ */
  const sugForm = $('#sugForm'), sugInput = $('#sugInput'), sugList = $('#sugList');
  function loadSug(){
    try{
      const arr = JSON.parse(localStorage.getItem('songs')||'[]');
      arr.forEach(t=> addChip(t));
    }catch(_){}
  }
  function addChip(t){ const c=document.createElement('span'); c.className='sug-chip'; c.textContent=t; sugList.prepend(c); }
  sugForm.addEventListener('submit', e=>{
    e.preventDefault();
    const t = sugInput.value.trim(); if(!t) return;
    addChip(t); sugInput.value='';
    try{ const arr=JSON.parse(localStorage.getItem('songs')||'[]'); arr.push(t); localStorage.setItem('songs',JSON.stringify(arr)); }catch(_){}
  });
  loadSug();

  /* ============================================================
     9 · TRIVIA
     ============================================================ */
  const TRIVIA = [
    { q:'¿Dónde nos conocimos?', opts:['En la universidad','En la feria del pueblo','En un avión','En una boda'], a:1 },
    { q:'¿Quién dijo «Te amo» primero?', opts:['Emilio','Luisa','Los dos a la vez','Nadie lo recuerda'], a:0 },
    { q:'¿Cuántos años llevamos juntos?', opts:['3 años','5 años','7 años','10 años'], a:2 },
    { q:'¿Cuál es nuestro viaje soñado?', opts:['La Toscana, Italia','Japón','Patagonia','Grecia'], a:0 }
  ];
  let tIdx=0, tScore=0, tLocked=false;
  const qNum=$('#qNum'), qText=$('#qText'), qOpts=$('#qOpts'), qScore=$('#qScore'), qNext=$('#qNext');
  function renderTrivia(){
    tLocked=false;
    const item=TRIVIA[tIdx];
    qNum.textContent=`Pregunta ${tIdx+1} de ${TRIVIA.length}`;
    qText.textContent=item.q;
    qScore.style.display='none'; qNext.style.display='none';
    qOpts.innerHTML='';
    item.opts.forEach((o,i)=>{
      const b=document.createElement('button'); b.className='opt'; b.type='button'; b.textContent=o;
      b.addEventListener('click', ()=>{
        if(tLocked) return; tLocked=true;
        if(i===item.a){ b.classList.add('correct'); tScore++; }
        else { b.classList.add('wrong'); qOpts.children[item.a].classList.add('correct'); }
        qScore.textContent=`Puntaje: ${tScore} / ${TRIVIA.length}`;
        qScore.style.display='block';
        qNext.textContent = tIdx < TRIVIA.length-1 ? 'Siguiente →' : 'Reiniciar ↺';
        qNext.style.display='inline-flex';
      });
      qOpts.appendChild(b);
    });
  }
  qNext.addEventListener('click', ()=>{
    if (tIdx < TRIVIA.length-1){ tIdx++; }
    else { tIdx=0; tScore=0; }
    renderTrivia();
  });
  renderTrivia();

  /* ============================================================
     10 · MENSAJES PARA LOS NOVIOS
     ============================================================ */
  const wishForm=$('#wishForm'), wishCards=$('#wishCards');
  function addWish(name,msg,prepend=true){
    const card=document.createElement('div');
    card.className='wish';
    card.style.setProperty('--rot', (Math.random()*3-1.5).toFixed(1)+'deg');
    card.innerHTML=`<div class="msg">«${escapeHTML(msg)}»</div><div class="from">— ${escapeHTML(name)}</div>`;
    if(prepend) wishCards.prepend(card); else wishCards.appendChild(card);
  }
  function escapeHTML(s){ return s.replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  wishForm.addEventListener('submit', e=>{
    e.preventDefault();
    const n=$('#wishName').value.trim(), m=$('#wishMsg').value.trim();
    if(!n||!m) return;
    addWish(n,m);
    try{ const arr=JSON.parse(localStorage.getItem('wishes')||'[]'); arr.push({n,m}); localStorage.setItem('wishes',JSON.stringify(arr)); }catch(_){}
    $('#wishName').value=''; $('#wishMsg').value='';
  });
  try{ JSON.parse(localStorage.getItem('wishes')||'[]').forEach(w=> addWish(w.n,w.m)); }catch(_){}

  /* ============================================================
     11 · CÁPSULA DEL TIEMPO
     ============================================================ */
  const capForm=$('#capForm'), sealed=$('#sealed');
  function checkSealed(){
    try{ if(localStorage.getItem('capsule')){ capForm.style.display='none'; sealed.classList.add('on'); } }catch(_){}
  }
  capForm.addEventListener('submit', e=>{
    e.preventDefault();
    const m=$('#capMsg').value.trim(); if(!m) return;
    try{ localStorage.setItem('capsule', JSON.stringify({m, ts:Date.now()})); }catch(_){}
    capForm.style.display='none'; sealed.classList.add('on');
  });
  checkSealed();

})();
