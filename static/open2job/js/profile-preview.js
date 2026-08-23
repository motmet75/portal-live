(() => {
  const SLIDE_MS = 9000;
  const INTERACTIVE_TYPES = new Set(['video', 'document', 'audio']);
  const player = document.querySelector('#player');
  const stage = document.querySelector('#stage');
  const backdrop = document.querySelector('#backdrop');
  const timeline = document.querySelector('#timeline');
  const rail = document.querySelector('#slideRail');
  const status = document.querySelector('#statusScreen');
  const playButton = document.querySelector('#playButton');
  const previousButton = document.querySelector('#previousButton');
  const nextButton = document.querySelector('#nextButton');
  const fullscreenButton = document.querySelector('#fullscreenButton');
  const counter = document.querySelector('#counter');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RAIL_STATE_KEY = 'open2job-preview-rail-open-v1';
  const DEFAULT_RAIL_OPEN = {timeline: true, achievements: true, people: true};
  let slides = [];
  let current = 0;
  let timer = 0;
  let playing = !reducedMotion;
  let touchX = 0;
  let touchInsideScroller = false;
  let railOpenState = readRailOpenState();

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
  const safeUrl = value => {
    try {
      const raw = String(value || '').trim();
      if (!raw) return '';
      const url = new URL(raw, location.origin);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (_) {
      return '';
    }
  };
  const attr = value => escapeHtml(value).replace(/`/g, '&#96;');
  const cssUrl = value => String(value || '').replace(/["\\\n\r]/g, '\\$&');
  const compact = values => values.filter(Boolean).join(' · ');
  const pad = value => String(value + 1).padStart(2, '0');
  const sentence = value => escapeHtml(value || '').replace(/\n{3,}/g, '\n\n').replace(/\n/g, '<br>');
  const emphasis = value => {
    const text = escapeHtml(value || '');
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length < 4) return text;
    return `${words.slice(0, -2).join(' ')} <em>${words.slice(-2).join(' ')}</em>`;
  };

  function readRailOpenState() {
    try {
      const stored = JSON.parse(localStorage.getItem(RAIL_STATE_KEY) || '{}');
      return Object.keys(DEFAULT_RAIL_OPEN).reduce((state, key) => {
        state[key] = typeof stored[key] === 'boolean' ? stored[key] : DEFAULT_RAIL_OPEN[key];
        return state;
      }, {});
    } catch (_) {
      return {...DEFAULT_RAIL_OPEN};
    }
  }

  function saveRailOpenState() {
    try {
      localStorage.setItem(RAIL_STATE_KEY, JSON.stringify(railOpenState));
    } catch (_) {
      // Private browsing can reject localStorage writes; the rail still works without persistence.
    }
  }

  function youtubeId(value) {
    const url = safeUrl(value);
    if (!url) return '';
    try {
      const parsed = new URL(url);
      if (parsed.hostname === 'youtu.be') return parsed.pathname.split('/').filter(Boolean)[0] || '';
      if (parsed.searchParams.get('v')) return parsed.searchParams.get('v');
      const parts = parsed.pathname.split('/').filter(Boolean);
      const marker = parts.findIndex(part => ['embed', 'shorts', 'live'].includes(part));
      return marker >= 0 ? parts[marker + 1] || '' : '';
    } catch (_) {
      return '';
    }
  }

  function youtubeEmbed(value) {
    const id = youtubeId(value);
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1&playsinline=1` : '';
  }

  function youtubePoster(value) {
    const id = youtubeId(value);
    return id ? `https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : '';
  }

  function socialEmbed(value) {
    const url = safeUrl(value);
    if (!url) return '';
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      const path = parsed.pathname;
      if (host.endsWith('vimeo.com')) {
        if (host === 'player.vimeo.com') return url;
        const id = path.split('/').filter(Boolean).find(part => /^\d+$/.test(part));
        return id ? `https://player.vimeo.com/video/${encodeURIComponent(id)}` : url;
      }
      if (host.endsWith('tiktok.com')) {
        const match = path.match(/\/video\/(\d+)/);
        return match ? `https://www.tiktok.com/embed/v2/${encodeURIComponent(match[1])}` : url;
      }
      if (host.endsWith('facebook.com') || host === 'fb.watch') {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=1280`;
      }
      if (host.endsWith('instagram.com')) {
        if (/\/embed\/?$/.test(path)) return url;
        return `${url.replace(/\/?(\?.*)?$/, '/')}embed`;
      }
      if (host.endsWith('twitter.com') || host.endsWith('x.com')) {
        const match = path.match(/\/status(?:es)?\/(\d+)/);
        return match ? `https://platform.twitter.com/embed/Tweet.html?id=${encodeURIComponent(match[1])}` : url;
      }
      return url;
    } catch (_) {
      return '';
    }
  }

  function isSocialEmbedUrl(value) {
    const url = safeUrl(value);
    if (!url) return false;
    try {
      const host = new URL(url).hostname.toLowerCase();
      return host.endsWith('vimeo.com') || host.endsWith('tiktok.com')
        || host.endsWith('facebook.com') || host === 'fb.watch'
        || host.endsWith('instagram.com') || host.endsWith('twitter.com')
        || host.endsWith('x.com') || host.endsWith('linkedin.com');
    } catch (_) {
      return false;
    }
  }

  function driveFileId(value) {
    const url = safeUrl(value);
    if (!url) return '';
    try {
      const parsed = new URL(url);
      const id = parsed.searchParams.get('id');
      if (id) return id;
      const match = parsed.pathname.match(/\/(?:file\/d|document\/d|presentation\/d|spreadsheets\/d)\/([^/]+)/);
      return match ? match[1] : '';
    } catch (_) {
      return '';
    }
  }

  function documentEmbed(value) {
    const url = safeUrl(value);
    if (!url) return '';
    const id = driveFileId(url);
    if (id && new URL(url).hostname.includes('drive.google.com')) {
      return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
    }
    return url;
  }

  function mediaKind(media) {
    const requested = String(media?.type || media?.kind || media?.mediaType || '').toLowerCase();
    const src = safeUrl(media?.src || media?.url || media?.href || media?.sourceUrl || '');
    if (requested === 'pdf') return 'document';
    if (['image', 'video', 'audio', 'document'].includes(requested)) return requested;
    if (youtubeId(src) || isSocialEmbedUrl(src)) return 'video';
    if (/\.(png|jpe?g|gif|webp|avif|svg)(\?|#|$)/i.test(src)) return 'image';
    if (/\.(mp3|wav|m4a|ogg)(\?|#|$)/i.test(src)) return 'audio';
    if (/\.pdf(\?|#|$)/i.test(src) || src.includes('drive.google.com') || src.includes('docs.google.com')) return 'document';
    return src ? 'document' : '';
  }

  function normalizeMedia(media, fallbackCaption = '') {
    const src = safeUrl(media?.src || media?.url || media?.href || media?.sourceUrl || '');
    if (!src) return null;
    const kind = mediaKind(media);
    const thumbnail = safeUrl(media?.thumbnail || media?.thumbnailUrl || '') || (kind === 'video' ? youtubePoster(src) : '');
    return {
      kind,
      src,
      thumbnail,
      caption: String(media?.caption || media?.title || fallbackCaption || '').trim()
    };
  }

  function mediaList(node) {
    const raw = [];
    if (node?.media) raw.push(node.media);
    if (Array.isArray(node?.mediaGallery)) raw.push(...node.mediaGallery);
    const seen = new Set();
    return raw.map(item => normalizeMedia(item, node?.title)).filter(item => {
      const key = `${item.kind}:${item.src}`;
      if (!item.kind || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function profileMedia(profile) {
    const reel = normalizeMedia({type: 'video', src: profile.reelUrl, caption: `${profile.name || 'Profile'} reel`});
    return reel ? [reel] : [];
  }

  function buildSlides(profile) {
    const portrait = safeUrl(profile.portraitUrl);
    const entries = Array.isArray(profile.nodes) ? profile.nodes : [];
    const result = [{
      kind: 'cover',
      kicker: compact([profile.role, profile.location]) || 'Career profile',
      title: profile.headline || `Meet ${profile.name || 'this candidate'}`,
      body: profile.intro || '',
      profile,
      background: portrait
    }];

    profileMedia(profile).forEach((media, index) => {
      result.push({
        kind: media.kind,
        kicker: index ? 'Profile media' : 'Profile reel',
        title: profile.name || 'Profile reel',
        body: profile.availability || compact([profile.role, profile.location]),
        media,
        background: media.thumbnail || portrait
      });
    });

    entries.forEach((node, nodeIndex) => {
      const gallery = mediaList(node);
      result.push({
        kind: 'text',
        kicker: compact([node.year, node.type]) || `Chapter ${nodeIndex + 1}`,
        title: node.title || `Chapter ${nodeIndex + 1}`,
        body: node.summary || '',
        node,
        galleryCount: gallery.length,
        background: gallery[0]?.thumbnail || (gallery[0]?.kind === 'image' ? gallery[0].src : portrait)
      });
      gallery.forEach((media, mediaIndex) => {
        result.push({
          kind: media.kind,
          kicker: compact([node.year, node.type, `Media ${mediaIndex + 1}`]),
          title: media.caption || node.title || `Media ${mediaIndex + 1}`,
          body: node.summary || '',
          node,
          media,
          background: media.thumbnail || (media.kind === 'image' ? media.src : portrait)
        });
      });
    });

    result.push({
      kind: 'closing',
      kicker: 'The next chapter',
      title: 'Ready for the next conversation',
      body: profile.availability || `${profile.name || 'This candidate'} is open to meaningful work and collaboration.`,
      profile,
      background: portrait
    });
    return result;
  }

  function tags(values) {
    const list = Array.isArray(values) ? values.filter(Boolean).slice(0, 8) : [];
    return list.length ? `<div class="tags">${list.map(value => `<span>${escapeHtml(value)}</span>`).join('')}</div>` : '';
  }

  function metaGrid(node, galleryCount) {
    const items = [
      ['Role', node?.org],
      ['Result', node?.metric],
      ['Impact', Number.isFinite(Number(node?.impact)) ? `${Number(node.impact)} / 100` : ''],
      ['Media', galleryCount ? `${galleryCount} item${galleryCount === 1 ? '' : 's'}` : '']
    ].filter(([, value]) => value);
    return items.length ? `<dl class="meta-grid">${items.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>` : '';
  }

  function eventMediaEntries(node) {
    if (!node) return [];
    return slides.map((item, index) => ({item, index})).filter(entry => entry.item.node === node && entry.item.media);
  }

  function eventMediaStrip(item) {
    const entries = eventMediaEntries(item.node);
    if (!entries.length) return '';
    return `<div class="event-strip" aria-label="Event media">
      ${entries.map(entry => {
        const media = entry.item.media || {};
        const kind = entry.item.kind;
        const src = safeUrl(media.src);
        const thumbnail = safeUrl(media.thumbnail) || (kind === 'video' ? youtubePoster(src) : '') || (kind === 'image' ? src : '');
        const caption = media.caption || entry.item.title || kindLabel(kind);
        return `<button type="button" class="event-card" data-event-jump="${entry.index}">
          <span class="event-thumb event-thumb-${attr(kind)}">${thumbnail ? `<img src="${attr(thumbnail)}" alt="">` : `<b>${escapeHtml(kindLabel(kind))}</b>`}</span>
          <strong>${escapeHtml(caption)}</strong>
          <small>${escapeHtml(kindLabel(kind))}</small>
        </button>`;
      }).join('')}
    </div>`;
  }

  function identity(profile) {
    const portrait = safeUrl(profile?.portraitUrl);
    return `<div class="identity">${portrait ? `<img src="${attr(portrait)}" alt="">` : '<span>o2</span>'}<div><strong>${escapeHtml(profile?.name || 'Open2Job profile')}</strong><small>${escapeHtml(profile?.availability || compact([profile?.role, profile?.location]) || 'Career presentation')}</small></div></div>`;
  }

  function renderText(item) {
    if (item.kind === 'cover' || item.kind === 'closing') {
      const profile = item.profile || {};
      return `
        <article class="copy-panel hero-copy">
          <p class="kicker">${escapeHtml(item.kicker)}</p>
          <h1>${emphasis(item.title)}</h1>
          ${item.body ? `<p>${sentence(item.body)}</p>` : ''}
          ${identity(profile)}
        </article>
        ${safeUrl(profile.portraitUrl) ? `<figure class="portrait-card"><img src="${attr(safeUrl(profile.portraitUrl))}" alt=""></figure>` : '<div class="portrait-card empty"><span>open2job</span></div>'}`;
    }
    const node = item.node || {};
    return `
      <article class="copy-panel story-copy">
        <p class="kicker">${escapeHtml(item.kicker)}</p>
        ${node.metric ? `<span class="metric">${escapeHtml(node.metric)}</span>` : ''}
        <h1>${escapeHtml(item.title)}</h1>
        ${item.body ? `<p>${sentence(item.body)}</p>` : ''}
        ${metaGrid(node, item.galleryCount)}
        ${tags(node.skills)}
        ${eventMediaStrip(item)}
      </article>`;
  }

  function mediaNotes(item, openLabel = 'Open media') {
    const node = item.node || {};
    const media = item.media || {};
    const source = safeUrl(media.src);
    return `
      <aside class="media-notes">
        <p class="kicker">${escapeHtml(item.kicker)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        ${item.body ? `<p>${sentence(item.body)}</p>` : ''}
        ${metaGrid(node, 0)}
        ${tags(node.skills)}
        ${source ? `<a class="open-link" href="${attr(source)}" target="_blank" rel="noopener">${escapeHtml(openLabel)}</a>` : ''}
      </aside>`;
  }

  function renderImage(item) {
    const src = safeUrl(item.media?.src);
    return `
      <figure class="media-frame image-frame">
        <img src="${attr(src)}" alt="${attr(item.media?.caption || item.title)}">
      </figure>
      ${mediaNotes(item, 'Open image')}`;
  }

  function renderVideo(item) {
    const src = safeUrl(item.media?.src);
    const embed = youtubeEmbed(src) || socialEmbed(src) || src;
    return `
      <div class="media-frame video-frame">
        <iframe src="${attr(embed)}" title="${attr(item.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      ${mediaNotes(item, 'Open video')}`;
  }

  function renderDocument(item) {
    const src = safeUrl(item.media?.src);
    const embed = documentEmbed(src);
    const isPdf = /\.pdf(\?|#|$)/i.test(src) || item.media?.kind === 'document';
    return `
      <div class="media-frame document-frame">
        <iframe src="${attr(embed)}" title="${attr(item.title)}"></iframe>
        <div class="document-fallback">
          <strong>${escapeHtml(item.title)}</strong>
          ${src ? `<a href="${attr(src)}" target="_blank" rel="noopener">${isPdf ? 'Open PDF' : 'Open document'}</a>` : ''}
        </div>
      </div>
      ${mediaNotes(item, isPdf ? 'Open PDF' : 'Open document')}`;
  }

  function renderAudio(item) {
    const src = safeUrl(item.media?.src);
    return `
      <div class="media-frame audio-frame">
        <div>
          <p class="kicker">Audio</p>
          <h2>${escapeHtml(item.title)}</h2>
          <audio src="${attr(src)}" controls></audio>
        </div>
      </div>
      ${mediaNotes(item, 'Open audio')}`;
  }

  function setBackdrop(item) {
    const image = safeUrl(item.background) || safeUrl(item.media?.thumbnail) || (item.media?.kind === 'image' ? safeUrl(item.media.src) : '');
    backdrop.style.backgroundImage = image
      ? `linear-gradient(rgba(9,11,17,.35),rgba(9,11,17,.72)),url("${cssUrl(image)}")`
      : 'linear-gradient(140deg,#11141b,#20252b 52%,#10161d)';
  }

  function renderTimeline() {
    timeline.innerHTML = slides.map((item, index) => `<button data-index="${index}" class="${index < current ? 'done' : index === current ? 'active' : ''}" aria-label="Go to slide ${index + 1}"><i></i></button>`).join('');
    timeline.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => show(Number(button.dataset.index)));
    });
  }

  function kindLabel(kind) {
    return {
      cover: 'Profile',
      closing: 'Closing',
      text: 'Event',
      image: 'Image',
      video: 'Video / social',
      document: 'PDF / document',
      audio: 'Audio'
    }[kind] || 'Slide';
  }

  function unique(values) {
    return Array.from(new Set(values.map(value => String(value || '').trim()).filter(Boolean)));
  }

  function peopleForNode(node) {
    const people = Array.isArray(node?.people) ? unique(node.people) : [];
    return people.length ? people : unique([node?.org]);
  }

  function navState(index, node) {
    const active = index === current;
    const related = !active && node && slides[current]?.node === node;
    return `${active ? ' active' : ''}${related ? ' related' : ''}`;
  }

  function railButton(entry, className, label) {
    return `<button type="button" data-index="${entry.index}" class="tree-node ${className}${navState(entry.index, entry.node)}" aria-current="${entry.index === current ? 'true' : 'false'}">
      <i></i><span>${escapeHtml(entry.item.title)}</span><small>${escapeHtml(label || kindLabel(entry.item.kind))}</small>
    </button>`;
  }

  function railGroup(key, number, title, subtitle, body) {
    const open = railOpenState[key] !== false;
    return `<section class="tree-group ${open ? 'open' : 'collapsed'}">
      <button type="button" class="tree-heading" data-tree-toggle="${attr(key)}" aria-expanded="${open ? 'true' : 'false'}">
        <b>${escapeHtml(number)}</b><span>${escapeHtml(title)}</span><small>${escapeHtml(subtitle)}</small><em aria-hidden="true"></em>
      </button>
      <div class="tree-body" ${open ? '' : 'hidden'}>${body}</div>
    </section>`;
  }

  function renderTimelineTree(textEntries, deckEntries, allEntries) {
    const deckRows = deckEntries.map(entry => railButton(entry, 'deck', kindLabel(entry.item.kind))).join('');
    const eventRows = textEntries.map(entry => {
      const mediaRows = allEntries.filter(candidate => candidate.node === entry.node && candidate.item.media)
        .map(candidate => railButton(candidate, 'level-2 media', kindLabel(candidate.item.kind))).join('');
      const peopleRows = peopleForNode(entry.node).map(person => `<button type="button" data-index="${entry.index}" class="tree-node level-2 person${navState(entry.index, entry.node)}">
        <i></i><span>${escapeHtml(person)}</span><small>Cooperated people</small>
      </button>`).join('');
      return `<div class="tree-branch${slides[current]?.node === entry.node ? ' current' : ''}">
        ${railButton(entry, 'event', compact([entry.node?.year, 'Event']) || 'Event')}
        <div class="tree-children">${mediaRows}${peopleRows}</div>
      </div>`;
    }).join('');
    return deckRows + eventRows;
  }

  function renderAchievementTree(textEntries) {
    const ranked = textEntries.slice().sort((a, b) => {
      const byImpact = (Number(b.node?.impact) || 0) - (Number(a.node?.impact) || 0);
      if (byImpact) return byImpact;
      return String(a.item.title).localeCompare(String(b.item.title));
    });
    return ranked.map(entry => {
      const score = Number(entry.node?.impact) || 0;
      const label = compact([entry.node?.metric, score ? `${score}/100` : 'Achievement']);
      return railButton(entry, 'achievement', label || 'Achievement');
    }).join('');
  }

  function renderPeopleTree(textEntries) {
    const grouped = new Map();
    textEntries.forEach(entry => {
      peopleForNode(entry.node).forEach(person => {
        if (!grouped.has(person)) grouped.set(person, []);
        grouped.get(person).push(entry);
      });
    });
    if (!grouped.size) return '<p class="tree-empty">No cooperated people listed</p>';
    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([person, entries]) => {
      const first = entries[0];
      const currentNode = entries.some(entry => slides[current]?.node === entry.node);
      const eventRows = entries.map(entry => railButton(entry, 'level-2 event', compact([entry.node?.year, entry.node?.type]) || 'Event')).join('');
      return `<div class="tree-branch person-branch${currentNode ? ' current' : ''}">
        <button type="button" data-index="${first.index}" class="tree-node person${navState(first.index, first.node)}">
          <i></i><span>${escapeHtml(person)}</span><small>${entries.length} event${entries.length === 1 ? '' : 's'}</small>
        </button>
        <div class="tree-children">${eventRows}</div>
      </div>`;
    }).join('');
  }

  function toggleRailGroup(key) {
    if (!(key in DEFAULT_RAIL_OPEN)) return;
    railOpenState = {...railOpenState, [key]: railOpenState[key] === false};
    saveRailOpenState();
    renderRail({preserveScroll: true});
  }

  function renderRail(options = {}) {
    const preserveScroll = options.preserveScroll !== false;
    const scrollTop = preserveScroll ? rail.scrollTop : 0;
    const scrollLeft = preserveScroll ? rail.scrollLeft : 0;
    const allEntries = slides.map((item, index) => ({item, index, node: item.node || null}));
    const textEntries = allEntries.filter(entry => entry.item.kind === 'text' && entry.node);
    const deckEntries = allEntries.filter(entry => !entry.node && entry.item.kind !== 'closing');
    const closingEntries = allEntries.filter(entry => entry.item.kind === 'closing');
    rail.innerHTML = `<div class="rail-tree" role="tree">
      ${railGroup('timeline', '01', 'Timeline', 'event - media - people', `${renderTimelineTree(textEntries, deckEntries, allEntries)}${closingEntries.map(entry => railButton(entry, 'deck', 'Closing')).join('')}`)}
      ${railGroup('achievements', '02', 'Achievement', 'highest impact first', renderAchievementTree(textEntries))}
      ${railGroup('people', '03', 'Cooperated People', 'people to events', renderPeopleTree(textEntries))}
    </div>`;
    rail.querySelectorAll('[data-index]').forEach(button => {
      button.addEventListener('click', () => show(Number(button.dataset.index), {preserveRailScroll: true}));
    });
    rail.querySelectorAll('[data-tree-toggle]').forEach(button => {
      button.addEventListener('click', () => toggleRailGroup(button.dataset.treeToggle));
    });
    if (preserveScroll) {
      rail.scrollTop = scrollTop;
      rail.scrollLeft = scrollLeft;
      requestAnimationFrame(() => {
        rail.scrollTop = scrollTop;
        rail.scrollLeft = scrollLeft;
      });
    }
  }

  function bindStageActions() {
    stage.querySelectorAll('[data-event-jump]').forEach(button => {
      button.addEventListener('click', () => show(Number(button.dataset.eventJump), {preserveRailScroll: true}));
    });
  }

  function restartTimer() {
    clearTimeout(timer);
    const item = slides[current];
    if (playing && slides.length > 1 && item && !INTERACTIVE_TYPES.has(item.kind)) {
      timer = setTimeout(() => show(current + 1), SLIDE_MS);
    }
  }

  function show(index, options = {}) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    const item = slides[current];
    player.dataset.slideKind = item.kind;
    stage.className = `stage stage-${item.kind}`;
    player.classList.remove('animating');
    void player.offsetWidth;
    player.classList.add('animating');
    setBackdrop(item);
    if (item.kind === 'image') stage.innerHTML = renderImage(item);
    else if (item.kind === 'video') stage.innerHTML = renderVideo(item);
    else if (item.kind === 'document') stage.innerHTML = renderDocument(item);
    else if (item.kind === 'audio') stage.innerHTML = renderAudio(item);
    else stage.innerHTML = renderText(item);
    bindStageActions();
    counter.textContent = `${pad(current)} / ${pad(slides.length - 1)}`;
    renderTimeline();
    renderRail({preserveScroll: options.preserveRailScroll !== false});
    restartTimer();
  }

  function togglePlay() {
    playing = !playing;
    player.classList.toggle('paused', !playing);
    playButton.textContent = playing ? 'Ⅱ' : '▶';
    playButton.setAttribute('aria-label', playing ? 'Pause autoplay' : 'Resume autoplay');
    if (playing) restartTimer();
    else clearTimeout(timer);
  }

  function updateFullscreenLabel() {
    const active = Boolean(document.fullscreenElement);
    fullscreenButton.textContent = active ? '×' : '⛶';
    fullscreenButton.setAttribute('aria-label', active ? 'Exit full screen' : 'Enter full screen');
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else player.requestFullscreen?.();
  }

  function endpoint() {
    const parts = location.pathname.split('/').filter(Boolean);
    const previewAt = parts.indexOf('profile-preview');
    if (previewAt >= 0 && parts[previewAt + 1]) return `/api/open2job/private-preview/${encodeURIComponent(parts[previewAt + 1])}`;
    const profileAt = parts.indexOf('profile');
    if (profileAt >= 0 && parts[profileAt + 1]) return `/api/open2job/profiles/${encodeURIComponent(parts[profileAt + 1])}`;
    const params = new URLSearchParams(location.search);
    if (params.has('preview')) return `/api/open2job/private-preview/${encodeURIComponent(params.get('preview'))}`;
    return `/api/open2job/profiles/${encodeURIComponent(params.get('profile') || '')}`;
  }

  function requestedSlideIndex() {
    const params = new URLSearchParams(location.search);
    const raw = params.get('slide') || (location.hash.match(/slide-(\d+)/)?.[1] ?? '');
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 1) return 0;
    return Math.min(slides.length - 1, value - 1);
  }

  async function load() {
    status.hidden = false;
    player.hidden = true;
    try {
      const response = await fetch(endpoint(), {headers: {Accept: 'application/json'}, credentials: 'same-origin', cache: 'no-store'});
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'This profile is unavailable or the preview link has expired.' : 'The profile could not be opened.');
      }
      const payload = await response.json();
      const profile = payload.profile || payload.snapshot || payload;
      slides = buildSlides(profile);
      document.title = `${profile.name || 'Profile'} - open2job`;
      document.querySelector('#shareLabel').textContent = profile.name || 'Profile story';
      status.hidden = true;
      player.hidden = false;
      player.style.setProperty('--duration', `${SLIDE_MS}ms`);
      player.classList.toggle('paused', !playing);
      playButton.textContent = playing ? 'Ⅱ' : '▶';
      show(requestedSlideIndex());
    } catch (error) {
      document.querySelector('#statusTitle').textContent = 'Story unavailable';
      document.querySelector('#statusMessage').textContent = error.message;
    }
  }

  previousButton.addEventListener('click', () => show(current - 1));
  nextButton.addEventListener('click', () => show(current + 1));
  playButton.addEventListener('click', togglePlay);
  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenLabel);
  addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      show(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      show(slides.length - 1);
    } else if (event.key === ' ') {
      event.preventDefault();
      togglePlay();
    } else if (event.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });
  player.addEventListener('touchstart', event => {
    touchX = event.changedTouches[0].clientX;
    touchInsideScroller = Boolean(event.target.closest?.('.event-strip,.media-frame,.media-notes,.slide-rail,.timeline,.controls'));
  }, {passive: true});
  player.addEventListener('touchend', event => {
    if (touchInsideScroller) {
      touchInsideScroller = false;
      return;
    }
    const delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 45) show(current + (delta < 0 ? 1 : -1));
  }, {passive: true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timer);
    else restartTimer();
  });
  updateFullscreenLabel();
  load();
})();
