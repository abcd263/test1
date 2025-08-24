
// Theme toggle
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved === 'light') root.classList.add('light');
  document.getElementById('themeToggle')?.addEventListener('click', function(){
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
})();

// Mobile menu
(function(){
  const btn = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');
  if(!btn || !menu) return;
  btn.addEventListener('click', ()=>{
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
    btn.setAttribute('aria-expanded', String(!open));
  });
  document.querySelectorAll('[data-link]').forEach(a=>a.addEventListener('click', ()=>{
    if(window.innerWidth<760) menu.style.display='none';
  }));
})();

// Hash Router (SPA-like)
(function(){
  const routes = Array.from(document.querySelectorAll('.route'));
  function show(path){
    routes.forEach(sec=>sec.hidden = (sec.dataset.route !== path));
    // move focus to main for a11y
    document.getElementById('app')?.focus({preventScroll:true});
    // trigger motion for newly visible section
    requestAnimationFrame(()=>{
      document.querySelectorAll('.route:not([hidden]) .motion-fade-up, .route:not([hidden]) .motion-zoom-in')
        .forEach(el=>el.classList.add('in-view'));
    });
  }
  function navigate(){
    const hash = location.hash || '#/home';
    const path = hash.replace('#','');
    const exist = routes.some(r=>r.dataset.route===path);
    show(exist ? path : '/home');
  }
  window.addEventListener('hashchange', navigate);
  navigate();
})();

// Intersection-based Scroll Reveal
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.motion-fade-up,.motion-zoom-in').forEach(el=>el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, {threshold:.12});
  document.querySelectorAll('.motion-fade-up,.motion-zoom-in').forEach(el=>io.observe(el));
})();

// Tabs
document.querySelectorAll('[data-tabs]').forEach((tabs)=>{
  const triggers = tabs.querySelectorAll('[data-tab]');
  const panes = tabs.querySelectorAll('[data-pane]');
  function activate(name){
    triggers.forEach(t=>t.classList.toggle('active', t.dataset.tab===name));
    panes.forEach(p=>p.hidden = p.dataset.pane !== name);
  }
  triggers.forEach(t=>t.addEventListener('click', ()=>activate(t.dataset.tab)));
  const def = triggers[0]?.dataset.tab; if(def) activate(def);
});

// Lightbox
(function(){
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);display:none;align-items:center;justify-content:center;padding:24px;z-index:1000;';
  const img = document.createElement('img');
  img.style.cssText = 'max-width:min(100%,1100px);max-height:90vh;border-radius:16px';
  overlay.appendChild(img);
  overlay.addEventListener('click', ()=> overlay.style.display='none');
  document.body.appendChild(overlay);
  document.querySelectorAll('.gallery-item').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      img.src = a.getAttribute('href');
      overlay.style.display='flex';
    });
  });
})();

// Next Event countdown
(function(){
  const elLabel = document.getElementById('next-event-label');
  const elCount = document.getElementById('next-event-countdown');
  if(!elLabel || !elCount) return;
  const events = [
    { name: 'মহালয়া',   start: new Date('2025-09-21T06:00:00+06:00') },
    { name: 'ষষ্ঠী',     start: new Date('2025-09-28T18:00:00+06:00') },
    { name: 'সপ্তমী',    start: new Date('2025-09-29T07:30:00+06:00') },
    { name: 'অষ্টমী',    start: new Date('2025-09-30T10:00:00+06:00') },
    { name: 'নবমী',     start: new Date('2025-10-01T10:00:00+06:00') },
    { name: 'বিজয়া দশমী', start: new Date('2025-10-02T15:30:00+06:00') },
  ];
  function update(){
    const now = new Date();
    const upcoming = events.find(e => e.start.getTime() > now.getTime());
    if(!upcoming){ elLabel.textContent = 'এই মুহূর্তে কোনও আসন্ন ইভেন্ট নেই'; elCount.textContent=''; return; }
    elLabel.textContent = `${upcoming.name} — ${upcoming.start.toLocaleString('bn-BD')}`;
    const diff = upcoming.start.getTime() - now.getTime();
    const d = Math.max(0, Math.floor(diff / (1000*60*60*24)));
    const h = Math.max(0, Math.floor((diff % (1000*60*60*24)) / (1000*60*60)));
    const m = Math.max(0, Math.floor((diff % (1000*60*60)) / (1000*60)));
    elCount.textContent = `আরও ${d} দিন ${h} ঘন্টা ${m} মিনিট`;
  }
  update();
  setInterval(update, 60000);
})();
