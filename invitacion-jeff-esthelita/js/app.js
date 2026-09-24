/* ============================================================
   INVITACIÓN BODA — JEFF & ESTHELITA · app.js
   ============================================================ */
(function(){
  'use strict';

  /* ---- Config editable ---- */
  const WEDDING_DATE = new Date('2026-10-17T15:00:00-05:00');
  const WHATSAPP_NUMBER = '593000000000'; // <-- PENDIENTE: reemplaza por el número real (código país 593, sin +)

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
     9 · CÁPSULA DEL TIEMPO
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
