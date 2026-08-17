(() => {
  'use strict';
  const root = document.querySelector('[data-jp-reader]');
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const editor = $('[data-editor]');
  const analyzeButton = $('[data-analyze-selection]');
  const popover = $('[data-selection-popover]');
  const storageKey = 'anhmedia.jp-reader.v1';
  let selectedText = '';
  let savedRange = null;
  let currentAnalysis = null;
  let state = loadState();

  function loadState() {
    try { const value = JSON.parse(localStorage.getItem(storageKey)) || {}; return { documents: value.documents || [], memories: value.memories || [], analyses: value.analyses || [], savedWords: value.savedWords || [] }; }
    catch (_) { return { documents: [], memories: [], analyses: [], savedWords: [] }; }
  }
  function persist() { localStorage.setItem(storageKey, JSON.stringify(state)); renderDocuments(); renderMemory(); }
  function toast(message) { const el = $('[data-toast]'); el.textContent = message; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { el.hidden = true; }, 2400); }
  function escapeHtml(value) { const el = document.createElement('div'); el.textContent = value || ''; return el.innerHTML; }

  function updateSelection() {
    const selection = window.getSelection();
    const text = selection && selection.rangeCount ? selection.toString().trim() : '';
    const inside = selection && selection.rangeCount && editor.contains(selection.anchorNode) && editor.contains(selection.focusNode);
    if (!inside || text.length < 2) { selectedText = ''; savedRange = null; analyzeButton.disabled = true; popover.hidden = true; return; }
    selectedText = text.slice(0, 1200);
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
      tokens: [['ぱいろっと','pairotto'],['燃料','nenryō'],['微量','biryō'],['点火','tenka'],['約','yaku'],['倍','bai']],
      words: [{word:'燃料',reading:'ねんりょう',romaji:'nenryō',onReading:'ネン・リョウ',kunReading:'もえる・はかる',meaningEn:'fuel',meaningVi:'nhiên liệu'},{word:'微量',reading:'びりょう',romaji:'biryō',onReading:'ビ・リョウ',kunReading:'かすか・はかる',meaningEn:'minute amount',meaningVi:'một lượng rất nhỏ'},{word:'点火',reading:'てんか',romaji:'tenka',onReading:'テン・カ',kunReading:'つける・ひ',meaningEn:'ignition',meaningVi:'sự đánh lửa'}]
    } : {
      ruby: '<ruby>微<rt>bi</rt></ruby><ruby>量<rt>ryō</rt></ruby>（<ruby>熱<rt>netsu</rt></ruby><ruby>量<rt>ryō</rt></ruby><ruby>比<rt>hi</rt></ruby> 1% <ruby>以<rt>i</rt></ruby><ruby>下<rt>ka</rt></ruby>）の <ruby>液<rt>eki</rt></ruby><ruby>体<rt>tai</rt></ruby><ruby>燃<rt>nen</rt></ruby><ruby>料<rt>ryō</rt></ruby>',
      hira: 'ぱいろっと いんじぇくた から びりょう（ねつりょう ひ 1% いか）の えきたい ねんりょう を ふんしゃ し…',
      translation: 'A minute amount of liquid fuel—less than a 1% heat-value ratio—is injected to ignite the gas inside the pre-chamber.',
      tokens: [['ぱいろっと','pairotto'],['いんじぇくた','injekuta'],['微量','biryō'],['液体','ekitai'],['燃料','nenryō'],['噴射','funsha']],
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
      if (!response.ok) throw new Error('analysis endpoint unavailable');
      currentAnalysis = await response.json();
    } catch (_) {
      if (/パイロット|微量|燃料|点火/.test(selectedText)) {
        currentAnalysis = sampleAnalysis(selectedText);
        toast('Đang dùng bản phân tích mẫu; kết nối API để phân tích nội dung mới.');
      } else {
        toast('Cần kết nối API máy chủ để phân tích đoạn mới.');
      }
    } finally {
      analyzeButton.firstChild.textContent = 'Phân tích đoạn chọn ';
      analyzeButton.disabled = !selectedText;
    }
    if (currentAnalysis) { saveAnalysisResult(currentAnalysis); renderAnalysis(); }
  }

  function renderAnalysis() {
    if (!currentAnalysis) return;
    $('[data-inspector-empty]').hidden = true; $('[data-analysis]').hidden = false;
    $('[data-kanji-reading]').innerHTML = currentAnalysis.ruby || escapeHtml(currentAnalysis.annotatedText);
    $('[data-hiragana]').textContent = currentAnalysis.hira || currentAnalysis.hiragana;
    $('[data-translation]').textContent = currentAnalysis.translation;
    $('[data-tokens]').innerHTML = (currentAnalysis.tokens || []).map(item => `<span class="jp-token"><b>${escapeHtml(item[0] || item.surface)}</b><small>${escapeHtml(item[1] || item.romaji)}</small></span>`).join('');
    $('[data-vocabulary]').innerHTML = (currentAnalysis.words || currentAnalysis.vocabulary || []).map((item, index) => { const word = item.word || item[0] || ''; const meaningEn = item.meaningEn || item.meaning || item[1] || ''; const meaningVi = item.meaningVi || ''; const saved = state.savedWords.some(entry => entry.sessionId === currentAnalysis.sessionId && entry.word === word); return `<span class="jp-word"><b>${escapeHtml(word)}</b><small>ひらがな: ${escapeHtml(item.reading || '—')} · ${escapeHtml(item.romaji || '')}</small><span>On: ${escapeHtml(item.onReading || '—')} · Kun: ${escapeHtml(item.kunReading || '—')}</span><em>${escapeHtml(meaningEn)}${meaningVi ? ` · ${escapeHtml(meaningVi)}` : ''}</em><button type="button" data-save-word="${index}" ${saved ? 'disabled' : ''}>${saved ? '✓ Đã lưu' : '＋ Lưu từ'}</button></span>`; }).join('');
  }

  function saveAnalysisResult(result) { const existing = (state.analyses || []).find(item => item.source === result.source); result.sessionId = existing?.sessionId || `session-${Date.now()}`; result.savedAt = new Date().toISOString(); state.analyses = [{ ...result }, ...(state.analyses || []).filter(item => item.source !== result.source)].slice(0, 100); persist(); }

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
      editor.innerText = data.text || ''; $('[data-document-title]').value = file.name.replace(/\.pdf$/i, '');
      state.documents.unshift({ id: Date.now(), title: $('[data-document-title]').value, html: editor.innerHTML, updatedAt: new Date().toISOString() }); persist(); toast('Đã trích xuất. Hãy chọn một câu để học.');
    } catch (error) { toast(error.message); } finally { progress.hidden = true; $('#jp-file').value = ''; }
  }

  function saveDocument() { const title = $('[data-document-title]').value.trim() || 'Tài liệu chưa đặt tên'; const existing = state.documents.find(item => item.title === title); const data = { id: existing?.id || Date.now(), title, html: editor.innerHTML, updatedAt: new Date().toISOString() }; state.documents = [data, ...state.documents.filter(item => item.id !== data.id)]; persist(); toast('Đã lưu bản nháp trên thiết bị này.'); }
  function renderDocuments() { $('[data-document-list]').innerHTML = state.documents.slice(0, 8).map(item => `<button class="jp-document" data-document-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><small>${new Date(item.updatedAt).toLocaleDateString('vi-VN')}</small></button>`).join(''); }
  function remember() { if (!currentAnalysis) return; (currentAnalysis.words || []).forEach((_, index) => saveWord(index, true)); if (!state.memories.some(item => item.sessionId === currentAnalysis.sessionId)) state.memories.unshift({ id: Date.now(), ...currentAnalysis, nextReview: new Date(Date.now() + 86400000).toISOString() }); persist(); toast('Đã lưu đoạn và toàn bộ từ mới để ôn.'); }
  function renderMemory() { const sessions = state.analyses || []; $('[data-memory-count]').textContent = state.savedWords.length; $('[data-memory-list]').innerHTML = sessions.length ? sessions.map(item => { const words = state.savedWords.filter(word => word.sessionId === item.sessionId); return `<article class="jp-memory-card"><small>PHIÊN HỌC · ${new Date(item.savedAt).toLocaleString('vi-VN')}</small><h3>${escapeHtml(item.source)}</h3><p>${escapeHtml(item.translation)}</p><div class="jp-session-words">${words.length ? words.map(word => `<span><b>${escapeHtml(word.word)}</b><small>${escapeHtml(word.reading || '')} · ${escapeHtml(word.romaji || '')}</small><em>On ${escapeHtml(word.onReading || '—')} · Kun ${escapeHtml(word.kunReading || '—')}</em><i>${escapeHtml(word.meaningEn || '')}${word.meaningVi ? ` · ${escapeHtml(word.meaningVi)}` : ''}</i></span>`).join('') : '<small>Chưa lưu từ nào trong phiên này.</small>'}</div></article>`; }).join('') : '<p>Chưa có phiên phân tích nào được lưu.</p>'; }
  function setView(memory) { $('[data-reader-view]').hidden = memory; $('[data-inspector]').hidden = memory; $('[data-library]').hidden = memory; $('[data-memory-view]').hidden = !memory; $$('.jp-nav').forEach((el, index) => el.classList.toggle('is-active', Boolean(index) === memory)); }

  document.addEventListener('selectionchange', () => requestAnimationFrame(updateSelection));
  analyzeButton.addEventListener('click', analyzeSelection); $('[data-analyze-popover]').addEventListener('click', analyzeSelection);
  $('[data-close-analysis]').addEventListener('click', () => { $('[data-analysis]').hidden = true; $('[data-inspector-empty]').hidden = false; });
  $('#jp-file').addEventListener('change', event => extractFile(event.target.files[0]));
  $('[data-toggle-connection]').addEventListener('click', () => { const panel = $('[data-connection-panel]'); panel.hidden = !panel.hidden; });
  $('[data-save-document]').addEventListener('click', saveDocument); $('[data-remember]').addEventListener('click', remember);
  $('[data-vocabulary]').addEventListener('click', event => { const button = event.target.closest('[data-save-word]'); if (button) saveWord(Number(button.dataset.saveWord)); });
  $('[data-speak]').addEventListener('click', () => { if (!currentAnalysis || !('speechSynthesis' in window)) return; speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(currentAnalysis.source); utterance.lang = 'ja-JP'; speechSynthesis.speak(utterance); });
  $('[data-font]').addEventListener('change', event => { editor.classList.remove('font-sans','font-rounded'); if (event.target.value !== 'serif') editor.classList.add(`font-${event.target.value}`); });
  $$('[data-command]').forEach(button => button.addEventListener('click', () => document.execCommand(button.dataset.command)));
  $$('[data-highlight]').forEach(button => button.addEventListener('click', () => { if (savedRange) { const selection = getSelection(); selection.removeAllRanges(); selection.addRange(savedRange); } document.execCommand('hiliteColor', false, button.dataset.highlight); }));
  $('[data-document-list]').addEventListener('click', event => { const button = event.target.closest('[data-document-id]'); if (!button) return; const doc = state.documents.find(item => item.id === Number(button.dataset.documentId)); if (doc) { editor.innerHTML = doc.html; $('[data-document-title]').value = doc.title; } });
  $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view === 'memory'))); $('[data-back-reader]').addEventListener('click', () => setView(false));
  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); analyzeSelection(); } });
  renderDocuments(); renderMemory();
})();
