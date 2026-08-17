(() => {
  'use strict';
  const root = document.querySelector('[data-jp-reader]');
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const editor = $('[data-editor]');
  const analyzeButton = $('[data-analyze-selection]');
  const popover = $('[data-selection-popover]');
  const libraryToggle = $('[data-library-toggle]');
  const libraryBackdrop = $('.jp-library-backdrop');
  const storageKey = 'anhmedia.jp-reader.v1';
  const displayStorageKey = 'anhmedia.jp-reader.display.v1';
  let selectedText = '';
  let savedRange = null;
  let currentAnalysis = null;
  let state = loadState();
  let currentDocumentId = null;
  let currentPageIndex = 0;
  let currentPages = [editor.innerHTML];
  let bookmarkExcerpt = '';
  let bookmarkRange = null;
  let documentSearchTerm = '';
  let memorySearchTerm = '';

  function setLibraryOpen(open) {
    root.classList.toggle('is-library-open', open);
    libraryToggle.setAttribute('aria-expanded', String(open));
    libraryBackdrop.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function loadDisplaySettings() {
    try { return JSON.parse(localStorage.getItem(displayStorageKey)) || {}; }
    catch (_) { return {}; }
  }
  function applyDisplaySettings(settings) {
    root.classList.toggle('is-reader-large', Boolean(settings.large));
    root.classList.toggle('is-reader-bold', Boolean(settings.bold));
    $('[data-reader-size]').setAttribute('aria-pressed', String(Boolean(settings.large)));
    $('[data-reader-bold]').setAttribute('aria-pressed', String(Boolean(settings.bold)));
  }
  function toggleDisplaySetting(name) {
    const settings = loadDisplaySettings();
    settings[name] = !settings[name];
    localStorage.setItem(displayStorageKey, JSON.stringify(settings));
    applyDisplaySettings(settings);
    toast(settings[name] ? (name === 'large' ? 'Đã tăng cỡ chữ toàn trang.' : 'Đã bật chữ đậm toàn trang.') : (name === 'large' ? 'Đã về cỡ chữ tiêu chuẩn.' : 'Đã tắt chữ đậm toàn trang.'));
  }

  function loadState() {
    try { const value = JSON.parse(localStorage.getItem(storageKey)) || {}; return { documents: value.documents || [], memories: value.memories || [], analyses: value.analyses || [], savedWords: value.savedWords || [] }; }
    catch (_) { return { documents: [], memories: [], analyses: [], savedWords: [] }; }
  }
  function persist() { localStorage.setItem(storageKey, JSON.stringify(state)); renderDocuments(); renderMemory(); renderMemoryNotes(); }
  function toast(message) { const el = $('[data-toast]'); el.textContent = message; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { el.hidden = true; }, 2400); }
  function escapeHtml(value) { const el = document.createElement('div'); el.textContent = value || ''; return el.innerHTML; }
  function textToHtml(text) { return String(text || '').split(/\n\s*\n/).filter(Boolean).map(part => `<p>${escapeHtml(part).replace(/\n/g, '<br>')}</p>`).join(''); }
  function splitIntoPages(text) {
    const source = String(text || '').trim();
    const hardPages = source.split(/\f+/).map(value => value.trim()).filter(Boolean);
    if (hardPages.length > 1) return hardPages.map(textToHtml);
    const blocks = source.split(/\n\s*\n/).flatMap(block => {
      const value = block.trim();
      if (value.length <= 1800) return value ? [value] : [];
      const pieces = value.match(/[\s\S]{1,1800}(?:[。！？.!?]\s*|\s+|$)/g);
      return pieces?.map(piece => piece.trim()).filter(Boolean) || [value];
    });
    const pages = [];
    let page = '';
    blocks.forEach(block => {
      if (page && page.length + block.length > 1800) { pages.push(textToHtml(page)); page = ''; }
      page += `${page ? '\n\n' : ''}${block}`;
    });
    if (page) pages.push(textToHtml(page));
    return pages.length ? pages : ['<p></p>'];
  }
  function clearTemporaryHighlights() { editor.querySelectorAll('[data-temp-search]').forEach(el => el.replaceWith(document.createTextNode(el.textContent))); editor.normalize(); }
  function storeCurrentPage() { clearTemporaryHighlights(); currentPages[currentPageIndex] = editor.innerHTML; }
  function normalizedBookmarks(doc) { doc.bookmarks = (doc.bookmarks || []).map((item, index) => typeof item === 'number' ? { id: `legacy-${item}-${index}`, page: item, note: 'Dấu trang cũ', excerpt: '' } : item); return doc.bookmarks; }
  function renderPage(index, saveCurrent = true) { if (saveCurrent) storeCurrentPage(); currentPageIndex = Math.max(0, Math.min(index, currentPages.length - 1)); bookmarkExcerpt = ''; bookmarkRange = null; editor.innerHTML = currentPages[currentPageIndex] || '<p></p>'; const doc = state.documents.find(item => item.id === currentDocumentId); const pageBookmarkCount = doc ? normalizedBookmarks(doc).filter(item => item.page === currentPageIndex).length : 0; $$('[data-page-label]').forEach(el => { el.textContent = `Trang ${currentPageIndex + 1} / ${currentPages.length}`; }); $$('[data-page-input]').forEach(el => { el.value = currentPageIndex + 1; el.max = currentPages.length; }); $$('[data-page-prev]').forEach(el => { el.disabled = currentPageIndex === 0; }); $$('[data-page-next]').forEach(el => { el.disabled = currentPageIndex >= currentPages.length - 1; }); $$('[data-page-bookmark]').forEach(el => { el.disabled = !doc; el.classList.toggle('is-active', pageBookmarkCount > 0); el.textContent = pageBookmarkCount ? `★ Lưu dấu (${pageBookmarkCount})` : '☆ Lưu dấu'; }); $('[data-document-meta]').textContent = `TRANG ${currentPageIndex + 1} / ${currentPages.length} · Chọn đoạn ngắn để học`; if (doc) { doc.currentPage = currentPageIndex; localStorage.setItem(storageKey, JSON.stringify(state)); } }
  let alertSoundUrl = '';
  function createAlertSoundUrl() {
    if (alertSoundUrl) return alertSoundUrl;
    const sampleRate = 44100;
    const duration = .9;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    const write = (offset, value) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
    write(0, 'RIFF'); view.setUint32(4, 36 + samples * 2, true); write(8, 'WAVE'); write(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
    write(36, 'data'); view.setUint32(40, samples * 2, true);
    for (let index = 0; index < samples; index += 1) {
      const time = index / sampleRate;
      const frequency = time < .42 ? 880 : 1175;
      const localTime = time < .42 ? time : time - .42;
      const attack = Math.min(1, localTime / .025);
      const decay = Math.exp(-4.8 * localTime);
      const signal = Math.sin(2 * Math.PI * frequency * time) * attack * decay * .72;
      view.setInt16(44 + index * 2, Math.max(-1, Math.min(1, signal)) * 32767, true);
    }
    alertSoundUrl = URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
    return alertSoundUrl;
  }
  async function playSpeakerAlert() {
    const audio = new Audio(createAlertSoundUrl());
    audio.preload = 'auto';
    audio.volume = .85;
    await new Promise(resolve => {
      let finished = false;
      const finish = () => { if (finished) return; finished = true; resolve(); };
      audio.addEventListener('ended', finish, { once: true });
      audio.addEventListener('error', finish, { once: true });
      const attempt = audio.play();
      if (attempt) attempt.catch(finish);
      setTimeout(finish, 1400);
    });
    await new Promise(resolve => setTimeout(resolve, 700));
  }
  async function speakJapanese(text) { if (!text || !('speechSynthesis' in window)) { toast('Thiết bị này không hỗ trợ đọc tiếng Nhật.'); return; } speechSynthesis.cancel(); await playSpeakerAlert(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'ja-JP'; utterance.rate = .82; speechSynthesis.speak(utterance); }
  function showAnalysisConnection(status, message) { const panel = $('[data-analysis-connection]'); const login = $('[data-analysis-login]'); panel.hidden = false; $('[data-inspector-empty]').hidden = true; login.hidden = status !== 401; const missingKey = /not configured|OPENAI_API_KEY/i.test(message || ''); $('[data-analysis-error]').textContent = status === 401 ? 'Phiên đăng nhập Google chưa hợp lệ. Đăng nhập rồi bấm Thử lại.' : missingKey ? 'Bạn đã đăng nhập. Máy chủ chưa có OPENAI_API_KEY nên chưa thể phân tích. Quản trị viên cần thêm key vào secrets/live-designer.env và khởi động lại portal.' : status === 503 ? `OpenAI tạm thời chưa phản hồi. ${message || 'Vui lòng thử lại sau.'}` : `Không thể kết nối API phân tích. ${message || 'Kiểm tra mạng rồi thử lại.'}`; const extraction = $('[data-connection-panel]'); extraction.hidden = false; }
  function rememberLoginReturn() { const target = `${window.location.pathname}${window.location.search}${window.location.hash}`; document.cookie = `PORTAL_LOGIN_RETURN=${encodeURIComponent(target)}; Max-Age=600; Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`; }

  function updateSelection() {
    const selection = window.getSelection();
    const text = selection && selection.rangeCount ? selection.toString().trim() : '';
    const inside = selection && selection.rangeCount && editor.contains(selection.anchorNode) && editor.contains(selection.focusNode);
    if (!inside || text.length < 2) { selectedText = ''; savedRange = null; analyzeButton.disabled = true; popover.hidden = true; return; }
    selectedText = text.slice(0, 1200);
    bookmarkExcerpt = text.slice(0, 300);
    bookmarkRange = selection.getRangeAt(0).cloneRange();
    savedRange = selection.getRangeAt(0).cloneRange();
    analyzeButton.disabled = false;
    $('[data-selection-preview]').textContent = selectedText;
    const rect = savedRange.getBoundingClientRect();
    popover.style.left = `${Math.max(10, Math.min(window.innerWidth - 330, rect.left))}px`;
    popover.style.top = `${Math.max(76, rect.bottom + 8)}px`;
    popover.hidden = false;
  }

  function sampleAnalysis(text) {
    const first = text.includes('パイロット燃料') ? {
      ruby: '<ruby>燃<rt>nen</rt></ruby><ruby>料<rt>ryō</rt></ruby> は <ruby>微<rt>bi</rt></ruby><ruby>量<rt>ryō</rt></ruby> だが <ruby>点<rt>ten</rt></ruby><ruby>火<rt>ka</rt></ruby> プラグ に <ruby>比<rt>hi</rt></ruby>し <ruby>約<rt>yaku</rt></ruby> 8000 <ruby>倍<rt>bai</rt></ruby>',
      hira: 'ぱいろっと ねんりょう は びりょう だ が てんか ぷらぐ に ひ し やく 8000 ばい…',
      translation: 'Although the pilot fuel amount is minute, its powerful ignition energy stabilizes combustion and improves efficiency.',
      tokens: [{surface:'パイロット',reading:'ぱいろっと',romaji:'pairotto'},{surface:'燃料',reading:'ねんりょう',romaji:'nenryō'},{surface:'微量',reading:'びりょう',romaji:'biryō'},{surface:'点火',reading:'てんか',romaji:'tenka'},{surface:'約',reading:'やく',romaji:'yaku'},{surface:'倍',reading:'ばい',romaji:'bai'}],
      words: [{word:'燃料',reading:'ねんりょう',romaji:'nenryō',onReading:'ネン・リョウ',kunReading:'もえる・はかる',meaningEn:'fuel',meaningVi:'nhiên liệu'},{word:'微量',reading:'びりょう',romaji:'biryō',onReading:'ビ・リョウ',kunReading:'かすか・はかる',meaningEn:'minute amount',meaningVi:'một lượng rất nhỏ'},{word:'点火',reading:'てんか',romaji:'tenka',onReading:'テン・カ',kunReading:'つける・ひ',meaningEn:'ignition',meaningVi:'sự đánh lửa'}]
    } : {
      ruby: '<ruby>微<rt>bi</rt></ruby><ruby>量<rt>ryō</rt></ruby>（<ruby>熱<rt>netsu</rt></ruby><ruby>量<rt>ryō</rt></ruby><ruby>比<rt>hi</rt></ruby> 1% <ruby>以<rt>i</rt></ruby><ruby>下<rt>ka</rt></ruby>）の <ruby>液<rt>eki</rt></ruby><ruby>体<rt>tai</rt></ruby><ruby>燃<rt>nen</rt></ruby><ruby>料<rt>ryō</rt></ruby>',
      hira: 'ぱいろっと いんじぇくた から びりょう（ねつりょう ひ 1% いか）の えきたい ねんりょう を ふんしゃ し…',
      translation: 'A minute amount of liquid fuel—less than a 1% heat-value ratio—is injected to ignite the gas inside the pre-chamber.',
      tokens: [{surface:'パイロット',reading:'ぱいろっと',romaji:'pairotto'},{surface:'インジェクタ',reading:'いんじぇくた',romaji:'injekuta'},{surface:'微量',reading:'びりょう',romaji:'biryō'},{surface:'液体',reading:'えきたい',romaji:'ekitai'},{surface:'燃料',reading:'ねんりょう',romaji:'nenryō'},{surface:'噴射',reading:'ふんしゃ',romaji:'funsha'}],
      words: [{word:'微量',reading:'びりょう',romaji:'biryō',onReading:'ビ・リョウ',kunReading:'かすか・はかる',meaningEn:'minute amount',meaningVi:'một lượng rất nhỏ'},{word:'液体',reading:'えきたい',romaji:'ekitai',onReading:'エキ・タイ',kunReading:'しる・からだ',meaningEn:'liquid',meaningVi:'chất lỏng'},{word:'噴射',reading:'ふんしゃ',romaji:'funsha',onReading:'フン・シャ',kunReading:'ふく・いる',meaningEn:'injection / jetting',meaningVi:'phun, phun nhiên liệu'}]
    };
    return { ...first, source: text };
  }

  async function analyzeSelection() {
    if (!selectedText) return;
    currentAnalysis = null;
    popover.hidden = true;
    analyzeButton.disabled = true;
    analyzeButton.firstChild.textContent = 'Đang phân tích… ';
    try {
      const response = await fetch('/api/japanese-learning/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: selectedText, mode: 'selection' }) });
      if (!response.ok) { const body = await response.text(); let message = body; try { message = JSON.parse(body).error || body; } catch (_) {} const error = new Error(message || 'analysis endpoint unavailable'); error.status = response.status; throw error; }
      currentAnalysis = await response.json();
      $('[data-analysis-connection]').hidden = true;
    } catch (error) {
      showAnalysisConnection(error.status || 0, error.message);
      if (/パイロット|微量|燃料|点火/.test(selectedText)) {
        currentAnalysis = sampleAnalysis(selectedText);
        toast('Đang dùng bản phân tích mẫu; kết nối API để phân tích nội dung mới.');
      } else {
        toast(error.status === 401 ? 'Hãy đăng nhập Google để phân tích.' : 'API máy chủ chưa sẵn sàng. Đoạn đã chọn vẫn được giữ.');
      }
    } finally {
      analyzeButton.firstChild.textContent = 'Phân tích đoạn chọn ';
      analyzeButton.disabled = !selectedText;
    }
    if (currentAnalysis) { saveAnalysisResult(currentAnalysis); renderAnalysis(); }
  }

  function renderAnalysis() {
    if (!currentAnalysis) return;
    const analysisWords = currentAnalysis.words || currentAnalysis.vocabulary || [];
    $('[data-inspector-empty]').hidden = true; $('[data-analysis]').hidden = false;
    $('[data-kanji-reading]').innerHTML = currentAnalysis.ruby || escapeHtml(currentAnalysis.annotatedText);
    $('[data-hiragana]').textContent = currentAnalysis.hira || currentAnalysis.hiragana;
    $('[data-spelling-line]').innerHTML = (currentAnalysis.tokens || []).map(item => { const surface = item.surface || item[0] || ''; const reading = item.reading || (/[ぁ-んー]+/.test(surface) ? surface : '—'); const romaji = item.romaji || item[1] || ''; return `<span class="jp-spelling"><b>${escapeHtml(surface)}</b><small>${escapeHtml(reading)}${romaji ? ` · ${escapeHtml(romaji)}` : ''}</small></span>`; }).join('');
    $('[data-translation]').textContent = currentAnalysis.translation;
    $('[data-tokens]').innerHTML = (currentAnalysis.tokens || []).map(item => { const surface = item[0] || item.surface || ''; const word = analysisWords.find(entry => (entry.word || entry[0]) === surface || (entry.reading && entry.reading === item.reading)); const romaji = item.romaji || item[1] || word?.romaji || ''; const meaningEn = item.meaningEn || word?.meaningEn || word?.meaning || ''; const meaningVi = item.meaningVi || word?.meaningVi || ''; return `<span class="jp-token"><b>${escapeHtml(surface)}</b><small>${escapeHtml(romaji)}</small><em>${escapeHtml(meaningEn)}${meaningVi ? ` · ${escapeHtml(meaningVi)}` : ''}</em></span>`; }).join('');
    $('[data-vocabulary]').innerHTML = analysisWords.map((item, index) => { const word = item.word || item[0] || ''; const meaningEn = item.meaningEn || item.meaning || item[1] || ''; const meaningVi = item.meaningVi || ''; const saved = state.savedWords.some(entry => entry.sessionId === currentAnalysis.sessionId && entry.word === word); const characters = (item.characters || []).map(char => `<i class="jp-kanji-char"><strong>${escapeHtml(char.kanji)}</strong><small>On ${escapeHtml(char.onReading || '—')} · Kun ${escapeHtml(char.kunReading || '—')}</small><em>${escapeHtml(char.meaningEn || '')}${char.memoryVi ? ` · ${escapeHtml(char.memoryVi)}` : ''}</em></i>`).join(''); return `<span class="jp-word"><b>${escapeHtml(word)}</b><small>ひらがな: ${escapeHtml(item.reading || '—')} · ${escapeHtml(item.romaji || '')}</small><span>On: ${escapeHtml(item.onReading || '—')} · Kun: ${escapeHtml(item.kunReading || '—')}</span><em>${escapeHtml(meaningEn)}${meaningVi ? ` · ${escapeHtml(meaningVi)}` : ''}</em>${characters ? `<span class="jp-kanji-breakdown">${characters}</span>` : ''}<button type="button" data-speak-word="${index}">▶ Đọc từ</button><button type="button" data-save-word="${index}" ${saved ? 'disabled' : ''}>${saved ? '✓ Đã lưu' : '＋ Lưu từ'}</button></span>`; }).join('');
    $('[data-study-note]').value = currentAnalysis.note || '';
    $('[data-note-count]').textContent = String((currentAnalysis.note || '').length);
  }

  function saveAnalysisResult(result) { const existing = (state.analyses || []).find(item => item.source === result.source && item.documentId === currentDocumentId && item.pageIndex === currentPageIndex); result.sessionId = existing?.sessionId || `session-${Date.now()}`; result.savedAt = new Date().toISOString(); result.documentId = currentDocumentId; result.pageIndex = currentPageIndex; state.analyses = [{ ...result }, ...(state.analyses || []).filter(item => item.sessionId !== result.sessionId)].slice(0, 100); persist(); }

  function saveWord(index, silent = false) { const item = (currentAnalysis?.words || currentAnalysis?.vocabulary || [])[index]; if (!item || !currentAnalysis?.sessionId) return; const word = item.word || item[0] || ''; if (!state.savedWords.some(entry => entry.sessionId === currentAnalysis.sessionId && entry.word === word)) state.savedWords.unshift({ ...item, word, sessionId: currentAnalysis.sessionId, source: currentAnalysis.source, savedAt: new Date().toISOString() }); persist(); renderAnalysis(); if (!silent) toast(`Đã lưu từ ${word}.`); }

  async function extractFile(file) {
    if (!file) return;
    const userId = $('[data-user-id]').value.trim(); const tokenId = $('[data-token-id]').value;
    const progress = $('[data-upload-progress]'); progress.hidden = false;
    const form = new FormData(); form.append('file', file); form.append('language', 'jpn');
    if (userId && tokenId) { form.append('userId', userId); form.append('tokenId', tokenId); }
    try {
      const response = await fetch('/api/extract-text', { method: 'POST', body: form }); const data = await response.json();
      if (response.status === 401) { $('[data-connection-panel]').hidden = false; throw new Error('Hãy đăng nhập Google hoặc nhập token máy chủ.'); }
      if (!response.ok || data.status !== 'success') throw new Error(data.error || 'Không thể trích xuất');
      currentDocumentId = Date.now(); currentPages = splitIntoPages(data.text || ''); currentPageIndex = 0; $('[data-document-title]').value = file.name.replace(/\.pdf$/i, ''); renderPage(0, false);
      state.documents.unshift({ id: currentDocumentId, title: $('[data-document-title]').value, pages: currentPages, currentPage: 0, bookmarks: [], updatedAt: new Date().toISOString() }); persist(); renderPage(0, false); toast(`Đã chia tài liệu thành ${currentPages.length} trang học.`);
    } catch (error) { toast(error.message); } finally { progress.hidden = true; $('#jp-file').value = ''; }
  }

  function saveDocument() { storeCurrentPage(); const title = $('[data-document-title]').value.trim() || 'Tài liệu chưa đặt tên'; const id = currentDocumentId || Date.now(); const existing = state.documents.find(item => item.id === id); currentDocumentId = id; const data = { id, title, pages: currentPages, currentPage: currentPageIndex, bookmarks: existing?.bookmarks || [], updatedAt: new Date().toISOString() }; state.documents = [data, ...state.documents.filter(item => item.id !== id)]; persist(); renderPage(currentPageIndex, false); toast(`Đã lưu trang ${currentPageIndex + 1}/${currentPages.length}.`); }
  function renderDocuments() { $('[data-document-list]').innerHTML = state.documents.slice(0, 8).map(item => { const bookmarks = normalizedBookmarks(item); const pages = [...new Set(bookmarks.map(mark => mark.page))].sort((a, b) => a - b); const tree = pages.map(page => { const marks = bookmarks.filter(mark => mark.page === page); return `<details class="jp-bookmark-page"><summary>Trang ${page + 1}<b>${marks.length}</b></summary><div>${marks.map(mark => `<article><button class="jp-bookmark-open" type="button" data-bookmark-document="${item.id}" data-bookmark-id="${escapeHtml(mark.id)}"><span>${escapeHtml(mark.note || 'Không có ghi chú')}</span>${mark.excerpt ? `<small>${escapeHtml(mark.excerpt)}</small>` : ''}</button><button class="jp-bookmark-delete" type="button" data-delete-bookmark="${escapeHtml(mark.id)}" data-bookmark-document="${item.id}" aria-label="Xóa dấu trang">×</button></article>`).join('')}</div></details>`; }).join(''); return `<article class="jp-document-row"><button class="jp-document" type="button" data-document-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><small>${(item.pages || [item.html]).length} trang · ${bookmarks.length} dấu đoạn · ${new Date(item.updatedAt).toLocaleDateString('vi-VN')}</small></button><button class="jp-document-delete" type="button" data-delete-document="${item.id}" aria-label="Xóa ${escapeHtml(item.title)}" title="Xóa tài liệu">×</button>${bookmarks.length ? `<details class="jp-bookmark-tree"><summary>Dấu trang theo trang <b>${bookmarks.length}</b></summary><div class="jp-bookmark-list">${tree}</div></details>` : ''}</article>`; }).join(''); }
  function addBookmark(note) { const doc = state.documents.find(item => item.id === currentDocumentId); if (!doc) { toast('Hãy tải lên hoặc lưu tài liệu trước khi đánh dấu đoạn.'); return; } const cleanNote = String(note || '').trim(); if (!cleanNote) { toast('Nhập ghi chú để nhớ lý do đánh dấu đoạn này.'); return; } const id = `mark-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; const anchorId = `anchor-${id}`; const excerpt = bookmarkExcerpt || editor.querySelector('p')?.innerText?.trim().slice(0, 300) || editor.innerText.trim().slice(0, 300); const anchor = document.createElement('span'); anchor.dataset.jpBookmarkAnchor = anchorId; anchor.className = 'jp-text-bookmark'; anchor.contentEditable = 'false'; anchor.title = cleanNote; anchor.textContent = '🔖'; if (bookmarkRange && editor.contains(bookmarkRange.commonAncestorContainer)) { const position = bookmarkRange.cloneRange(); position.collapse(true); position.insertNode(anchor); } else { (editor.querySelector('p') || editor).prepend(anchor); } storeCurrentPage(); normalizedBookmarks(doc).push({ id, anchorId, page: currentPageIndex, note: cleanNote.slice(0, 240), excerpt, savedAt: new Date().toISOString() }); doc.pages = currentPages; doc.currentPage = currentPageIndex; doc.updatedAt = new Date().toISOString(); $$('[data-bookmark-note]').forEach(input => { input.value = ''; }); persist(); renderPage(currentPageIndex, false); toast(`Đã lưu ghi chú tại trang ${currentPageIndex + 1}.`); }
  function deleteBookmark(documentId, bookmarkId) { const doc = state.documents.find(item => item.id === documentId); if (!doc) return; const mark = normalizedBookmarks(doc).find(item => item.id === bookmarkId); if (mark?.anchorId && doc.pages?.[mark.page]) { const holder = document.createElement('div'); holder.innerHTML = doc.pages[mark.page]; holder.querySelector(`[data-jp-bookmark-anchor="${mark.anchorId}"]`)?.remove(); doc.pages[mark.page] = holder.innerHTML; if (currentDocumentId === documentId && currentPageIndex === mark.page) currentPages[mark.page] = holder.innerHTML; } doc.bookmarks = normalizedBookmarks(doc).filter(item => item.id !== bookmarkId); persist(); if (currentDocumentId === documentId) renderPage(currentPageIndex, false); toast('Đã xóa dấu đoạn.'); }
  function openBookmark(documentId, bookmarkId) { const doc = state.documents.find(item => item.id === documentId); const mark = doc && normalizedBookmarks(doc).find(item => item.id === bookmarkId); if (!doc || !mark) return; currentDocumentId = doc.id; currentPages = doc.pages || [doc.html || '<p></p>']; $('[data-document-title]').value = doc.title; renderPage(mark.page, false); requestAnimationFrame(() => { const excerpts = [mark.excerpt, mark.excerpt?.split(/\r?\n/)[0], mark.excerpt?.slice(0, 120), mark.excerpt?.slice(0, 60)].map(value => String(value || '').trim()).filter((value, index, values) => value.length >= 6 && values.indexOf(value) === index); let highlighted = null; for (const excerpt of excerpts) { highlighted = highlightSearchText(excerpt); if (highlighted) break; } let target = highlighted || (mark.anchorId ? editor.querySelector(`[data-jp-bookmark-anchor="${mark.anchorId}"]`) : null); if (!target && mark.excerpt) target = [...editor.querySelectorAll('p,li,h1,h2,h3,div')].find(el => el.textContent.includes(mark.excerpt.slice(0, 50))); target = target || editor; target.scrollIntoView({ behavior: 'smooth', block: 'center' }); target.classList.add('jp-bookmark-focus'); setTimeout(() => target.classList.remove('jp-bookmark-focus'), 2600); }); toast(`Trang ${mark.page + 1}: ${mark.note}`); }
  function searchDocument(query) { documentSearchTerm = String(query || '').trim(); const results = $('[data-document-search-results]'); if (documentSearchTerm.length < 2) { results.hidden = true; results.innerHTML = ''; return; } const needle = documentSearchTerm.toLocaleLowerCase(); const matches = []; currentPages.forEach((html, page) => { const holder = document.createElement('div'); holder.innerHTML = html; const text = holder.textContent.replace(/\s+/g, ' ').trim(); let from = 0; while (matches.length < 80) { const index = text.toLocaleLowerCase().indexOf(needle, from); if (index < 0) break; matches.push({ page, excerpt: `${index > 45 ? '…' : ''}${text.slice(Math.max(0, index - 45), index + documentSearchTerm.length + 70)}${index + documentSearchTerm.length + 70 < text.length ? '…' : ''}` }); from = index + Math.max(1, documentSearchTerm.length); } }); results.hidden = false; results.innerHTML = matches.length ? `<small>${matches.length} kết quả trong ${new Set(matches.map(item => item.page)).size} trang</small>${matches.map(item => `<button type="button" data-search-page="${item.page}"><b>Trang ${item.page + 1}</b><span>${escapeHtml(item.excerpt)}</span></button>`).join('')}` : '<small>Không tìm thấy nội dung phù hợp.</small>'; }
  function highlightSearchText(query) { clearTemporaryHighlights(); const needle = String(query || '').toLocaleLowerCase(); if (!needle) return null; let first = null; const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT); const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode); nodes.forEach(node => { const value = node.nodeValue; const lower = value.toLocaleLowerCase(); let cursor = 0; let index = lower.indexOf(needle); if (index < 0) return; const fragment = document.createDocumentFragment(); while (index >= 0) { fragment.append(document.createTextNode(value.slice(cursor, index))); const mark = document.createElement('mark'); mark.dataset.tempSearch = 'true'; mark.textContent = value.slice(index, index + query.length); fragment.append(mark); first = first || mark; cursor = index + query.length; index = lower.indexOf(needle, cursor); } fragment.append(document.createTextNode(value.slice(cursor))); node.replaceWith(fragment); }); return first; }
  function goToPage(value) { const page = Number.parseInt(value, 10); if (!Number.isFinite(page) || page < 1 || page > currentPages.length) { toast(`Nhập số trang từ 1 đến ${currentPages.length}.`); $$('[data-page-input]').forEach(el => { el.value = currentPageIndex + 1; }); return; } renderPage(page - 1); }
  function deleteDocument(id) {
    const doc = state.documents.find(item => item.id === id);
    if (!doc || !window.confirm(`Xóa tài liệu “${doc.title}” khỏi lịch sử?`)) return;
    state.documents = state.documents.filter(item => item.id !== id);
    if (currentDocumentId === id) currentDocumentId = null;
    persist();
    toast('Đã xóa tài liệu khỏi lịch sử. Các phiên học đã lưu vẫn được giữ.');
  }
  function remember() {
    if (!currentAnalysis) return;
    currentAnalysis.note = $('[data-study-note]').value.trim();
    (currentAnalysis.words || []).forEach((_, index) => saveWord(index, true));
    const analysis = state.analyses.find(item => item.sessionId === currentAnalysis.sessionId);
    if (analysis) analysis.note = currentAnalysis.note;
    const memory = state.memories.find(item => item.sessionId === currentAnalysis.sessionId);
    const memoryData = { id: memory?.id || Date.now(), ...currentAnalysis, nextReview: memory?.nextReview || new Date(Date.now() + 86400000).toISOString() };
    if (memory) Object.assign(memory, memoryData);
    else state.memories.unshift(memoryData);
    persist();
    toast(currentAnalysis.note ? 'Đã lưu đoạn, ghi chú và toàn bộ từ mới.' : 'Đã lưu đoạn và toàn bộ từ mới để ôn.');
  }
  function renderMemoryNotes() {
    const needle = memorySearchTerm.toLocaleLowerCase();
    const sessions = (state.analyses || []).filter(item => {
      if (!needle) return true;
      const words = state.savedWords.filter(word => word.sessionId === item.sessionId);
      return [item.source, item.translation, ...words.flatMap(word => [word.word, word.reading, word.romaji, word.meaningEn, word.meaningVi, word.onReading, word.kunReading])].some(value => String(value || '').toLocaleLowerCase().includes(needle));
    });
    $$('[data-memory-list] .jp-memory-card').forEach((card, index) => {
      const note = sessions[index]?.note;
      if (!note) return;
      const paragraph = document.createElement('p');
      paragraph.className = 'jp-memory-note';
      paragraph.textContent = `Ghi chú: ${note}`;
      card.querySelector('.jp-session-actions')?.before(paragraph);
    });
  }
  function renderMemory() { const needle = memorySearchTerm.toLocaleLowerCase(); const sessions = (state.analyses || []).filter(item => { if (!needle) return true; const words = state.savedWords.filter(word => word.sessionId === item.sessionId); return [item.source, item.translation, ...words.flatMap(word => [word.word, word.reading, word.romaji, word.meaningEn, word.meaningVi, word.onReading, word.kunReading])].some(value => String(value || '').toLocaleLowerCase().includes(needle)); }); $('[data-memory-count]').textContent = state.savedWords.length; $('[data-memory-list]').innerHTML = sessions.length ? sessions.map(item => { const words = state.savedWords.filter(word => word.sessionId === item.sessionId); const pageLabel = item.documentId ? ` · TRANG ${(item.pageIndex || 0) + 1}` : ''; return `<article class="jp-memory-card"><small>PHIÊN HỌC${pageLabel} · ${new Date(item.savedAt).toLocaleString('vi-VN')}</small><h3>${escapeHtml(item.source)}</h3><p>${escapeHtml(item.translation)}</p><div class="jp-session-actions"><button type="button" data-open-session="${escapeHtml(item.sessionId)}">Mở lại đúng trang</button><button type="button" data-speak-session="${escapeHtml(item.sessionId)}">▶ Đọc câu</button><button type="button" data-edit-session="${escapeHtml(item.sessionId)}">Sửa nghĩa</button><button type="button" data-delete-session="${escapeHtml(item.sessionId)}">Xóa phiên</button></div><div class="jp-session-words">${words.length ? words.map(word => { const index = state.savedWords.indexOf(word); return `<span><b>${escapeHtml(word.word)}</b><small>${escapeHtml(word.reading || '')} · ${escapeHtml(word.romaji || '')}</small><em>On ${escapeHtml(word.onReading || '—')} · Kun ${escapeHtml(word.kunReading || '—')}</em><i>${escapeHtml(word.meaningEn || '')}${word.meaningVi ? ` · ${escapeHtml(word.meaningVi)}` : ''}</i><button type="button" data-speak-saved-index="${index}">▶ Đọc từ</button><button type="button" data-edit-saved-index="${index}">Sửa</button><button type="button" data-delete-saved-index="${index}">Xóa</button></span>`; }).join('') : '<small>Chưa lưu từ nào trong phiên này.</small>'}</div></article>`; }).join('') : `<p>${needle ? 'Không tìm thấy nội dung đã lưu phù hợp.' : 'Chưa có phiên phân tích nào được lưu.'}</p>`; }
  function editSavedWord(index) { const word = state.savedWords[index]; if (!word) return; const value = window.prompt(`Sửa nghĩa tiếng Việt cho ${word.word}:`, word.meaningVi || ''); if (value === null) return; word.meaningVi = value.trim(); persist(); }
  function deleteSavedWord(index) { const word = state.savedWords[index]; if (!word || !window.confirm(`Xóa từ “${word.word}” khỏi danh sách đã lưu?`)) return; state.savedWords.splice(index, 1); persist(); toast('Đã xóa từ đã lưu.'); }
  function editSession(sessionId) { const item = state.analyses.find(entry => entry.sessionId === sessionId); if (!item) return; const value = window.prompt('Sửa bản dịch/ghi chú của đoạn:', item.translation || ''); if (value === null) return; item.translation = value.trim(); persist(); if (currentAnalysis?.sessionId === sessionId) { currentAnalysis.translation = item.translation; renderAnalysis(); } }
  function deleteSession(sessionId) { if (!window.confirm('Xóa phiên phân tích và các từ đã lưu trong phiên này?')) return; state.analyses = state.analyses.filter(item => item.sessionId !== sessionId); state.savedWords = state.savedWords.filter(item => item.sessionId !== sessionId); state.memories = state.memories.filter(item => item.sessionId !== sessionId); persist(); toast('Đã xóa phiên học.'); }
  function reopenSession(sessionId) { const analysis = state.analyses.find(item => item.sessionId === sessionId); if (!analysis) return; const doc = state.documents.find(item => item.id === analysis.documentId); if (doc) { currentDocumentId = doc.id; currentPages = doc.pages || [doc.html || '<p></p>']; $('[data-document-title]').value = doc.title; renderPage(analysis.pageIndex || 0, false); } currentAnalysis = { ...analysis }; selectedText = analysis.source || ''; setView(false); renderAnalysis(); toast(`Đã trở lại trang ${(analysis.pageIndex || 0) + 1}.`); }
  function setView(memory) { $('[data-reader-view]').hidden = memory; $('[data-inspector]').hidden = memory; $('[data-library]').hidden = memory; $('[data-memory-view]').hidden = !memory; $$('.jp-nav').forEach((el, index) => el.classList.toggle('is-active', Boolean(index) === memory)); }

  document.addEventListener('selectionchange', () => requestAnimationFrame(updateSelection));
  libraryToggle.addEventListener('click', () => setLibraryOpen(!root.classList.contains('is-library-open')));
  $$('[data-library-close]').forEach(button => button.addEventListener('click', () => setLibraryOpen(false)));
  $('[data-reader-size]').addEventListener('click', () => toggleDisplaySetting('large'));
  $('[data-reader-bold]').addEventListener('click', () => toggleDisplaySetting('bold'));
  $$('[data-google-login], [data-analysis-login]').forEach(link => link.addEventListener('click', rememberLoginReturn));
  analyzeButton.addEventListener('click', analyzeSelection); $('[data-analyze-popover]').addEventListener('click', analyzeSelection);
  $('[data-close-analysis]').addEventListener('click', () => { $('[data-analysis]').hidden = true; $('[data-inspector-empty]').hidden = false; });
  $('#jp-file').addEventListener('change', event => extractFile(event.target.files[0]));
  $('[data-toggle-connection]').addEventListener('click', () => { const panel = $('[data-connection-panel]'); panel.hidden = !panel.hidden; });
  $('[data-retry-analysis]').addEventListener('click', analyzeSelection);
  $('[data-save-document]').addEventListener('click', saveDocument); $('[data-remember]').addEventListener('click', remember);
  $('[data-vocabulary]').addEventListener('click', event => { const saveButton = event.target.closest('[data-save-word]'); if (saveButton) saveWord(Number(saveButton.dataset.saveWord)); const speakButton = event.target.closest('[data-speak-word]'); if (speakButton) { const word = (currentAnalysis.words || [])[Number(speakButton.dataset.speakWord)]; speakJapanese(word?.reading || word?.word); } });
  $('[data-speak]').addEventListener('click', () => speakJapanese(currentAnalysis?.source));
  $('[data-memory-list]').addEventListener('click', event => { const open = event.target.closest('[data-open-session]'); if (open) reopenSession(open.dataset.openSession); const sentence = event.target.closest('[data-speak-session]'); if (sentence) speakJapanese(state.analyses.find(item => item.sessionId === sentence.dataset.speakSession)?.source); const speak = event.target.closest('[data-speak-saved-index]'); if (speak) { const word = state.savedWords[Number(speak.dataset.speakSavedIndex)]; speakJapanese(word?.reading || word?.word); } const editWord = event.target.closest('[data-edit-saved-index]'); if (editWord) editSavedWord(Number(editWord.dataset.editSavedIndex)); const deleteWord = event.target.closest('[data-delete-saved-index]'); if (deleteWord) deleteSavedWord(Number(deleteWord.dataset.deleteSavedIndex)); const edit = event.target.closest('[data-edit-session]'); if (edit) editSession(edit.dataset.editSession); const remove = event.target.closest('[data-delete-session]'); if (remove) deleteSession(remove.dataset.deleteSession); });
  $('[data-font]').addEventListener('change', event => { editor.classList.remove('font-sans','font-rounded'); if (event.target.value !== 'serif') editor.classList.add(`font-${event.target.value}`); });
  $$('[data-command]').forEach(button => button.addEventListener('click', () => document.execCommand(button.dataset.command)));
  $$('[data-highlight]').forEach(button => button.addEventListener('click', () => { if (savedRange) { const selection = getSelection(); selection.removeAllRanges(); selection.addRange(savedRange); } document.execCommand('hiliteColor', false, button.dataset.highlight); }));
  $('[data-document-list]').addEventListener('click', event => { const removeBookmark = event.target.closest('[data-delete-bookmark]'); if (removeBookmark) { deleteBookmark(Number(removeBookmark.dataset.bookmarkDocument), removeBookmark.dataset.deleteBookmark); return; } const bookmark = event.target.closest('[data-bookmark-id]'); if (bookmark) { openBookmark(Number(bookmark.dataset.bookmarkDocument), bookmark.dataset.bookmarkId); if (window.innerWidth <= 1100) setLibraryOpen(false); return; } const remove = event.target.closest('[data-delete-document]'); if (remove) { deleteDocument(Number(remove.dataset.deleteDocument)); return; } const button = event.target.closest('[data-document-id]'); if (!button) return; const doc = state.documents.find(item => item.id === Number(button.dataset.documentId)); if (doc) { currentDocumentId = doc.id; currentPages = doc.pages || [doc.html || '<p></p>']; $('[data-document-title]').value = doc.title; renderPage(doc.currentPage || 0, false); if (window.innerWidth <= 1100) setLibraryOpen(false); } });
  $('[data-document-search]').addEventListener('input', event => searchDocument(event.currentTarget.value)); $('[data-document-search]').addEventListener('keydown', event => { if (event.key === 'Enter') searchDocument(event.currentTarget.value); }); $('[data-document-search-results]').addEventListener('click', event => { const result = event.target.closest('[data-search-page]'); if (!result) return; renderPage(Number(result.dataset.searchPage)); requestAnimationFrame(() => { const target = highlightSearchText(documentSearchTerm); target?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }); });
  $('[data-memory-search]').addEventListener('input', event => { memorySearchTerm = event.currentTarget.value.trim(); renderMemory(); renderMemoryNotes(); });
  $('[data-study-note]').addEventListener('input', event => { if (currentAnalysis) currentAnalysis.note = event.currentTarget.value; $('[data-note-count]').textContent = String(event.currentTarget.value.length); });
  $$('[data-page-prev]').forEach(button => button.addEventListener('click', () => renderPage(currentPageIndex - 1))); $$('[data-page-next]').forEach(button => button.addEventListener('click', () => renderPage(currentPageIndex + 1)));
  $$('[data-page-go]').forEach(button => button.addEventListener('click', () => goToPage(button.closest('[data-page-nav]').querySelector('[data-page-input]').value))); $$('[data-page-input]').forEach(input => input.addEventListener('keydown', event => { if (event.key === 'Enter') goToPage(event.currentTarget.value); })); $$('[data-page-bookmark]').forEach(button => button.addEventListener('click', () => addBookmark(button.closest('[data-page-nav]').querySelector('[data-bookmark-note]').value)));
  $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view === 'memory'))); $('[data-back-reader]').addEventListener('click', () => setView(false));
  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); analyzeSelection(); } if (event.key === 'Escape' && root.classList.contains('is-library-open')) setLibraryOpen(false); });
  applyDisplaySettings(loadDisplaySettings()); renderDocuments(); renderMemory(); renderMemoryNotes(); renderPage(0, false);
})();
