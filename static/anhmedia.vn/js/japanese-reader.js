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
    try { return JSON.parse(localStorage.getItem(storageKey)) || { documents: [], memories: [] }; }
    catch (_) { return { documents: [], memories: [] }; }
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
      words: [['燃料','fuel'],['微量','minute amount'],['点火','ignition'],['燃焼','combustion'],['効率','efficiency']]
    } : {
      ruby: '<ruby>微<rt>bi</rt></ruby><ruby>量<rt>ryō</rt></ruby>（<ruby>熱<rt>netsu</rt></ruby><ruby>量<rt>ryō</rt></ruby><ruby>比<rt>hi</rt></ruby> 1% <ruby>以<rt>i</rt></ruby><ruby>下<rt>ka</rt></ruby>）の <ruby>液<rt>eki</rt></ruby><ruby>体<rt>tai</rt></ruby><ruby>燃<rt>nen</rt></ruby><ruby>料<rt>ryō</rt></ruby>',
      hira: 'ぱいろっと いんじぇくた から びりょう（ねつりょう ひ 1% いか）の えきたい ねんりょう を ふんしゃ し…',
      translation: 'A minute amount of liquid fuel—less than a 1% heat-value ratio—is injected to ignite the gas inside the pre-chamber.',
      tokens: [['ぱいろっと','pairotto'],['いんじぇくた','injekuta'],['微量','biryō'],['液体','ekitai'],['燃料','nenryō'],['噴射','funsha']],
      words: [['微量','minute amount'],['熱量比','heat-value ratio'],['液体燃料','liquid fuel'],['噴射','injection'],['副室','pre-chamber']]
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
    if (currentAnalysis) renderAnalysis();
  }

  function renderAnalysis() {
    if (!currentAnalysis) return;
    $('[data-inspector-empty]').hidden = true; $('[data-analysis]').hidden = false;
    $('[data-kanji-reading]').innerHTML = currentAnalysis.ruby || escapeHtml(currentAnalysis.annotatedText);
    $('[data-hiragana]').textContent = currentAnalysis.hira || currentAnalysis.hiragana;
    $('[data-translation]').textContent = currentAnalysis.translation;
    $('[data-tokens]').innerHTML = (currentAnalysis.tokens || []).map(item => `<span class="jp-token"><b>${escapeHtml(item[0] || item.surface)}</b><small>${escapeHtml(item[1] || item.romaji)}</small></span>`).join('');
    $('[data-vocabulary]').innerHTML = (currentAnalysis.words || currentAnalysis.vocabulary || []).map(item => `<span class="jp-word"><b>${escapeHtml(item[0] || item.word)}</b><small>${escapeHtml(item[1] || item.meaning)}</small></span>`).join('');
  }

  async function extractFile(file) {
    if (!file) return;
    const userId = $('[data-user-id]').value.trim(); const tokenId = $('[data-token-id]').value;
    if (!userId || !tokenId) { $('[data-connection-panel]').hidden = false; toast('Nhập User ID và token trích xuất trước.'); return; }
    const progress = $('[data-upload-progress]'); progress.hidden = false;
    const form = new FormData(); form.append('file', file); form.append('userId', userId); form.append('tokenId', tokenId); form.append('language', 'jpn');
    try {
      const response = await fetch('/api/extract-text', { method: 'POST', body: form }); const data = await response.json();
      if (!response.ok || data.status !== 'success') throw new Error(data.error || 'Không thể trích xuất');
      editor.innerText = data.text || ''; $('[data-document-title]').value = file.name.replace(/\.pdf$/i, '');
      state.documents.unshift({ id: Date.now(), title: $('[data-document-title]').value, html: editor.innerHTML, updatedAt: new Date().toISOString() }); persist(); toast('Đã trích xuất. Hãy chọn một câu để học.');
    } catch (error) { toast(error.message); } finally { progress.hidden = true; $('#jp-file').value = ''; }
  }

  function saveDocument() { const title = $('[data-document-title]').value.trim() || 'Tài liệu chưa đặt tên'; const existing = state.documents.find(item => item.title === title); const data = { id: existing?.id || Date.now(), title, html: editor.innerHTML, updatedAt: new Date().toISOString() }; state.documents = [data, ...state.documents.filter(item => item.id !== data.id)]; persist(); toast('Đã lưu bản nháp trên thiết bị này.'); }
  function renderDocuments() { $('[data-document-list]').innerHTML = state.documents.slice(0, 8).map(item => `<button class="jp-document" data-document-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><small>${new Date(item.updatedAt).toLocaleDateString('vi-VN')}</small></button>`).join(''); }
  function remember() { if (!currentAnalysis) return; state.memories.unshift({ id: Date.now(), ...currentAnalysis, nextReview: new Date(Date.now() + 86400000).toISOString() }); persist(); toast('Đã lưu vào bộ nhớ ôn tập.'); }
  function renderMemory() { $('[data-memory-count]').textContent = state.memories.length; $('[data-memory-list]').innerHTML = state.memories.length ? state.memories.map(item => `<article class="jp-memory-card"><h3>${escapeHtml(item.source)}</h3><p>${escapeHtml(item.translation)}</p><small>Ôn tiếp: ${new Date(item.nextReview).toLocaleDateString('vi-VN')}</small></article>`).join('') : '<p>Chưa có từ hoặc đoạn nào được lưu.</p>'; }
  function setView(memory) { $('[data-reader-view]').hidden = memory; $('[data-inspector]').hidden = memory; $('[data-library]').hidden = memory; $('[data-memory-view]').hidden = !memory; $$('.jp-nav').forEach((el, index) => el.classList.toggle('is-active', Boolean(index) === memory)); }

  document.addEventListener('selectionchange', () => requestAnimationFrame(updateSelection));
  analyzeButton.addEventListener('click', analyzeSelection); $('[data-analyze-popover]').addEventListener('click', analyzeSelection);
  $('[data-close-analysis]').addEventListener('click', () => { $('[data-analysis]').hidden = true; $('[data-inspector-empty]').hidden = false; });
  $('#jp-file').addEventListener('change', event => extractFile(event.target.files[0]));
  $('[data-toggle-connection]').addEventListener('click', () => { const panel = $('[data-connection-panel]'); panel.hidden = !panel.hidden; });
  $('[data-save-document]').addEventListener('click', saveDocument); $('[data-remember]').addEventListener('click', remember);
  $('[data-speak]').addEventListener('click', () => { if (!currentAnalysis || !('speechSynthesis' in window)) return; speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(currentAnalysis.source); utterance.lang = 'ja-JP'; speechSynthesis.speak(utterance); });
  $('[data-font]').addEventListener('change', event => { editor.classList.remove('font-sans','font-rounded'); if (event.target.value !== 'serif') editor.classList.add(`font-${event.target.value}`); });
  $$('[data-command]').forEach(button => button.addEventListener('click', () => document.execCommand(button.dataset.command)));
  $$('[data-highlight]').forEach(button => button.addEventListener('click', () => { if (savedRange) { const selection = getSelection(); selection.removeAllRanges(); selection.addRange(savedRange); } document.execCommand('hiliteColor', false, button.dataset.highlight); }));
  $('[data-document-list]').addEventListener('click', event => { const button = event.target.closest('[data-document-id]'); if (!button) return; const doc = state.documents.find(item => item.id === Number(button.dataset.documentId)); if (doc) { editor.innerHTML = doc.html; $('[data-document-title]').value = doc.title; } });
  $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view === 'memory'))); $('[data-back-reader]').addEventListener('click', () => setView(false));
  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); analyzeSelection(); } });
  renderDocuments(); renderMemory();
})();
