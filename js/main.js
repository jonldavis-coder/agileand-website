// Agile& — minimal site JS
(function(){
  document.documentElement.classList.remove('no-js');
  var toggle=document.querySelector('.nav-toggle'), links=document.getElementById('nav-links');
  var more=document.querySelector('.more-toggle'), menu=document.getElementById('more-menu');
  function closeMore(){ if(more&&menu){menu.classList.remove('open');more.setAttribute('aria-expanded','false');} }
  if(more&&menu){
    more.addEventListener('click',function(e){ e.stopPropagation(); var o=menu.classList.toggle('open'); more.setAttribute('aria-expanded',o?'true':'false'); });
    document.addEventListener('click',function(e){ if(!menu.contains(e.target)&&e.target!==more) closeMore(); });
    menu.addEventListener('focusout',function(e){ if(window.innerWidth>920&&!menu.contains(e.relatedTarget)&&e.relatedTarget!==more) closeMore(); });
  }
  if(toggle&&links){
    toggle.addEventListener('click',function(){
      var open=links.classList.toggle('open');
      toggle.setAttribute('aria-expanded',open?'true':'false');
      toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    });
  }
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    if(menu&&menu.classList.contains('open')){closeMore();more.focus();return;}
    if(links&&links.classList.contains('open')){links.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');toggle.focus();}
  });
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.12});
    els.forEach(function(el){io.observe(el);});
  } else { els.forEach(function(el){el.classList.add('in');}); }
  // Email addresses are assembled at runtime so they never appear in the HTML source
  function addr(el){return (el.getAttribute('data-user')||'')+'\u0040'+(el.getAttribute('data-domain')||'');}
  var EMAIL=['info','agileand.com'].join('\u0040');
  document.querySelectorAll('.js-email').forEach(function(el){
    var a=addr(el); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a)) return;
    var l=document.createElement('a'); l.href='mai'+'lto:'+a; l.textContent=a; l.className='email-link'; el.textContent=''; el.appendChild(l);
  });
  // Contact form: honeypot + arithmetic check + minimum time, then hand off to the email app (no server)
  var form=document.getElementById('contact-form');
  if(form){
    var t0=Date.now(), q=document.getElementById('hc-question'), hc=document.getElementById('human-check'), err=document.getElementById('hc-error');
    var hp=document.getElementById('website'), st=document.getElementById('form-status');
    var a=1+Math.floor(Math.random()*9), b=1+Math.floor(Math.random()*9), ans=a+b;
    if(q) q.textContent='What is '+a+' + '+b+'?';
    function setErr(m){ if(!hc||!err) return; err.textContent=m; if(m) hc.setAttribute('aria-invalid','true'); else hc.removeAttribute('aria-invalid'); }
    if(hc) hc.addEventListener('input',function(){ if(err&&err.textContent) setErr(''); });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(hp&&hp.value.trim()!=='') return;
      if(Date.now()-t0<3000) return;
      if(!form.checkValidity()){form.reportValidity();return;}
      if(hc&&parseInt(hc.value.trim(),10)!==ans){ setErr('That answer doesn\u2019t look right. Please try the math question again.'); hc.focus(); return; }
      setErr('');
      var f=new FormData(form);
      var subject='Website inquiry from '+f.get('name')+(f.get('company')?' ('+f.get('company')+')':'');
      var body='Name: '+f.get('name')+'\nEmail: '+f.get('email')+'\nOrganization: '+(f.get('company')||'')+'\nInterest: '+(f.get('interest')||'')+'\n\n'+f.get('message');
      window.location.href='mai'+'lto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      if(st) st.textContent='Opening your email app\u2026 If nothing happens, email us directly at '+EMAIL+'.';
    });
  }
})();
