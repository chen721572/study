(function(){
  const speakEls = document.querySelectorAll('.speakable');
  function pickVoice(lang) {
    const voices = speechSynthesis.getVoices();
    if(!voices.length) return null;
    let v = voices.find(x => x.lang.toLowerCase() === lang.toLowerCase());
    if(v) return v;
    v = voices.find(x => x.lang.toLowerCase().startsWith(lang.split('-')[0].toLowerCase()));
    return v || voices[0];
  }
  function speak(text, lang, el){
    if(!('speechSynthesis' in window)){ alert('您的瀏覽器不支援語音合成 (Speech Synthesis)。建議使用 Chrome/Edge/Firefox。'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const voice = pickVoice(lang);
    if(voice) u.voice = voice;
    if(el) el.classList.add('playing');
    u.onend = ()=>{ if(el) el.classList.remove('playing'); };
    u.onerror = ()=>{ if(el) el.classList.remove('playing'); };
    speechSynthesis.speak(u);
  }

  speakEls.forEach(el=>{
    const langAttr = el.getAttribute('data-lang') || 'en-US';
    const lang = langAttr.length===2 ? (langAttr==='ja'?'ja-JP':'en-US') : langAttr;
    el.addEventListener('click', ()=> speak(el.textContent.trim(), lang, el));
    el.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); el.click(); } });
  });
  if('speechSynthesis' in window){ speechSynthesis.onvoiceschanged = ()=>{}; }
})();