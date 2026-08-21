(() => {
  const SLIDE_MS = 7000;
  const player = document.querySelector('#player');
  const slide = document.querySelector('#slide');
  const backdrop = document.querySelector('#backdrop');
  const timeline = document.querySelector('#timeline');
  const status = document.querySelector('#statusScreen');
  const playButton = document.querySelector('#playButton');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let slides = [], current = 0, timer = 0, playing = !reducedMotion, touchX = 0;

  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const safeUrl = value => { try { const url = new URL(value, location.origin); return ['http:','https:'].includes(url.protocol) ? url.href : ''; } catch (_) { return ''; } };
  const emphasis = value => { const text = escapeHtml(value); const words = text.trim().split(/\s+/); if (words.length < 3) return text; return `${words.slice(0,-2).join(' ')} <em>${words.slice(-2).join(' ')}</em>`; };

  function mediaFor(node, fallback) {
    const media = node && (node.media || (node.mediaGallery || [])[0]);
    return safeUrl((media && (media.thumbnail || media.src)) || fallback);
  }
  function buildSlides(profile) {
    const portrait = safeUrl(profile.portraitUrl);
    const entries = Array.isArray(profile.nodes) ? profile.nodes : [];
    const result = [{
      image: portrait, html: `<p class="kicker">${escapeHtml([profile.role,profile.location].filter(Boolean).join(' · ') || 'Career profile')}</p><h1>${emphasis(profile.headline || `Meet ${profile.name}`)}</h1><p>${escapeHtml(profile.intro)}</p><div class="identity">${portrait ? `<img src="${portrait}" alt="">` : ''}<div><strong>${escapeHtml(profile.name)}</strong><small>${escapeHtml(profile.availability || 'Open to meaningful work')}</small></div></div>`
    }];
    entries.forEach((node, index) => {
      const metric = String(node.metric || '').trim();
      result.push({ image: mediaFor(node, portrait), html: `<p class="kicker">${escapeHtml([node.year,node.type].filter(Boolean).join(' · ') || `Chapter ${index + 1}`)}</p>${metric ? `<span class="metric">${escapeHtml(metric)}</span>` : ''}<h2>${escapeHtml(node.title)}</h2><p>${escapeHtml(node.summary)}</p>${node.org ? `<p class="people">${escapeHtml(node.org)}</p>` : ''}<div class="tags">${(node.skills || []).slice(0,5).map(x=>`<span>${escapeHtml(x)}</span>`).join('')}</div>` });
    });
    result.push({ image: portrait, html: `<p class="kicker">The next chapter</p><h1>Let’s create something <em>worth remembering.</em></h1><p>${escapeHtml(profile.availability || `${profile.name} is open to new conversations and opportunities.`)}</p><div class="identity"><div><strong>${escapeHtml(profile.name)}</strong><small>${escapeHtml([profile.role,profile.location].filter(Boolean).join(' · '))}</small></div></div>` });
    return result;
  }
  function restartTimer() {
    clearTimeout(timer);
    if (playing && slides.length > 1) timer = setTimeout(() => show((current + 1) % slides.length), SLIDE_MS);
  }
  function renderTimeline() {
    timeline.innerHTML = slides.map((_, i) => `<button data-index="${i}" class="${i < current ? 'done' : i === current ? 'active' : ''}" aria-label="Go to slide ${i+1}"><i></i></button>`).join('');
    timeline.querySelectorAll('button').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.index))));
  }
  function show(index) {
    current = (index + slides.length) % slides.length;
    const item = slides[current];
    player.classList.remove('animating'); void player.offsetWidth; player.classList.add('animating');
    slide.innerHTML = `<div class="slide-content">${item.html}</div>`;
    backdrop.style.backgroundImage = item.image ? `url("${item.image.replace(/["\\]/g, '\\$&')}")` : 'radial-gradient(circle at 75% 30%, #554887, #11141c 48%, #080a0f 75%)';
    document.querySelector('#counter').textContent = `${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    renderTimeline(); restartTimer();
  }
  function togglePlay() {
    playing = !playing; player.classList.toggle('paused', !playing);
    playButton.textContent = playing ? 'Ⅱ' : '▶'; playButton.setAttribute('aria-label', playing ? 'Pause autoplay' : 'Resume autoplay');
    if (playing) show(current); else clearTimeout(timer);
  }
  function endpoint() {
    const parts = location.pathname.split('/').filter(Boolean);
    const previewAt = parts.indexOf('profile-preview');
    if (previewAt >= 0 && parts[previewAt+1]) return `/api/open2job/private-preview/${encodeURIComponent(parts[previewAt+1])}`;
    const profileAt = parts.indexOf('profile');
    if (profileAt >= 0 && parts[profileAt+1]) return `/api/open2job/profiles/${encodeURIComponent(parts[profileAt+1])}`;
    const params = new URLSearchParams(location.search);
    return params.has('preview') ? `/api/open2job/private-preview/${encodeURIComponent(params.get('preview'))}` : `/api/open2job/profiles/${encodeURIComponent(params.get('profile') || '')}`;
  }
  async function load() {
    status.hidden = false; player.hidden = true;
    try {
      const response = await fetch(endpoint(), {headers:{Accept:'application/json'}});
      if (!response.ok) throw new Error(response.status === 404 ? 'This profile is unavailable or the preview link has expired.' : 'The profile could not be opened.');
      const payload = await response.json(); const profile = payload.profile || payload.snapshot || payload;
      slides = buildSlides(profile); document.title = `${profile.name || 'Profile'} — open2job`; document.querySelector('#shareLabel').textContent = profile.name || 'Profile story';
      status.hidden = true; player.hidden = false; player.style.setProperty('--duration', `${SLIDE_MS}ms`); player.classList.toggle('paused', !playing); playButton.textContent = playing ? 'Ⅱ' : '▶'; show(0);
    } catch (error) { document.querySelector('#statusTitle').textContent = 'Story unavailable'; document.querySelector('#statusMessage').textContent = error.message; }
  }
  document.querySelector('#previousButton').addEventListener('click',()=>show(current-1));
  document.querySelector('#nextButton').addEventListener('click',()=>show(current+1)); playButton.addEventListener('click',togglePlay);
  document.querySelector('#fullscreenButton').addEventListener('click',()=>document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.());
  addEventListener('keydown',event=>{if(event.key==='ArrowLeft')show(current-1);if(event.key==='ArrowRight')show(current+1);if(event.key===' '){event.preventDefault();togglePlay();}});
  player.addEventListener('touchstart',event=>touchX=event.changedTouches[0].clientX,{passive:true}); player.addEventListener('touchend',event=>{const delta=event.changedTouches[0].clientX-touchX;if(Math.abs(delta)>45)show(current+(delta<0?1:-1));},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else restartTimer();}); load();
})();
