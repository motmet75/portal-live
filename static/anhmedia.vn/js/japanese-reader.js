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
  let currentDocumentId = null;
  let currentPageIndex = 0;
  let currentPages = [editor.innerHTML];

  function loadState() {
    try { const value = JSON.parse(localStorage.getItem(storageKey)) || {}; return { documents: value.documents || [], memories: value.memories || [], analyses: value.analyses || [], savedWords: value.savedWords || [] }; }
    catch (_) { return { documents: [], memories: [], analyses: [], savedWords: [] }; }
  }
  function persist() { localStorage.setItem(storageKey, JSON.stringify(state)); renderDocuments(); renderMemory(); }
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
  function storeCurrentPage() { currentPages[currentPageIndex] = editor.innerHTML; }
  function renderPage(index, saveCurrent = true) { if (saveCurrent) storeCurrentPage(); currentPageIndex = Math.max(0, Math.min(index, currentPages.length - 1)); editor.innerHTML = currentPages[currentPageIndex] || '<p></p>'; $('[data-page-label]').textContent = `Trang ${currentPageIndex + 1} / ${currentPages.length}`; $('[data-page-prev]').disabled = currentPageIndex === 0; $('[data-page-next]').disabled = currentPageIndex >= currentPages.length - 1; $('[data-document-meta]').textContent = `TRANG ${currentPageIndex + 1} / ${currentPages.length} · Chọn đoạn ngắn để học`; }
  function speakJapanese(text) { if (!text || !('speechSynthesis' in window)) { toast('Thiết bị này không hỗ trợ đọc tiếng Nhật.'); return; } speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'ja-JP'; utterance.rate = .82; speechSynthesis.speak(utterance); }

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
    $('[data-spelling-line]').innerHTML = (currentAnalysis.tokens || []).map(item => { const surface = item.surface || item[0] || ''; const reading = item.reading || (/[ぁ-んー]+/.test(surface) ? surface : '—'); const romaji = item.romaji || item[1] || ''; return `<span class="jp-spelling"><b>${escapeHtml(surface)}</b><small>${escapeHtml(reading)}${romaji ? ` · ${escapeHtml(romaji)}` : ''}</small></span>`; }).join('');
    $('[data-translation]').textContent = currentAnalysis.translation;
    $('[data-tokens]').innerHTML = (currentAnalysis.tokens || []).map(item => `<span class="jp-token"><b>${escapeHtml(item[0] || item.surface)}</b><small>${escapeHtml(item[1] || item.romaji)}</small></span>`).join('');
    $('[data-vocabulary]').innerHTML = (currentAnalysis.words || currentAnalysis.vocabulary || []).map((item, index) => { const word = item.word || item[0] || ''; const meaningEn = item.meaningEn || item.meaning || item[1] || ''; const meaningVi = item.meaningVi || ''; const saved = state.savedWords.some(entry => entry.sessionId === currentAnalysis.sessionId && entry.word === word); const characters = (item.characters || []).map(char => `<i class="jp-kanji-char"><strong>${escapeHtml(char.kanji)}</strong><small>On ${escapeHtml(char.onReading || '—')} · Kun ${escapeHtml(char.kunReading || '—')}</small><em>${escapeHtml(char.meaningEn || '')}${char.memoryVi ? ` · ${escapeHtml(char.memoryVi)}` : ''}</em></i>`).join(''); return `<span class="jp-word"><b>${escapeHtml(word)}</b><small>ひらがな: ${escapeHtml(item.reading || '—')} · ${escapeHtml(item.romaji || '')}</small><span>On: ${escapeHtml(item.onReading || '—')} · Kun: ${escapeHtml(item.kunReading || '—')}</span><em>${escapeHtml(meaningEn)}${meaningVi ? ` · ${escapeHtml(meaningVi)}` : ''}</em>${characters ? `<span class="jp-kanji-breakdown">${characters}</span>` : ''}<button type="button" data-speak-word="${index}">▶ Đọc từ</button><button type="button" data-save-word="${index}" ${saved ? 'disabled' : ''}>${saved ? '✓ Đã lưu' : '＋ Lưu từ'}</button></span>`; }).join('');
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
      state.documents.unshift({ id: currentDocumentId, title: $('[data-document-title]').value, pages: currentPages, currentPage: 0, updatedAt: new Date().toISOString() }); persist(); toast(`Đã chia tài liệu thành ${currentPages.length} trang học.`);
    } catch (error) { toast(error.message); } finally { progress.hidden = true; $('#jp-file').value = ''; }
  }

  function saveDocument() { storeCurrentPage(); const title = $('[data-document-title]').value.trim() || 'Tài liệu chưa đặt tên'; const id = currentDocumentId || Date.now(); currentDocumentId = id; const data = { id, title, pages: currentPages, currentPage: currentPageIndex, updatedAt: new Date().toISOString() }; state.documents = [data, ...state.documents.filter(item => item.id !== id)]; persist(); toast(`Đã lưu trang ${currentPageIndex + 1}/${currentPages.length}.`); }
  function renderDocuments() { $('[data-document-list]').innerHTML = state.documents.slice(0, 8).map(item => `<article class="jp-document-row"><button class="jp-document" type="button" data-document-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><small>${(item.pages || [item.html]).length} trang · ${new Date(item.updatedAt).toLocaleDateString('vi-VN')}</small></button><button class="jp-document-delete" type="button" data-delete-document="${item.id}" aria-label="Xóa ${escapeHtml(item.title)}" title="Xóa tài liệu">×</button></article>`).join(''); }
  function deleteDocument(id) {
    const doc = state.documents.find(item => item.id === id);
    if (!doc || !window.confirm(`Xóa tài liệu “${doc.title}” khỏi lịch sử?`)) return;
    state.documents = state.documents.filter(item => item.id !== id);
    if (currentDocumentId === id) currentDocumentId = null;
    persist();
    toast('Đã xóa tài liệu khỏi lịch sử. Các phiên học đã lưu vẫn được giữ.');
  }
  function remember() { if (!currentAnalysis) return; (currentAnalysis.words || []).forEach((_, index) => saveWord(index, true)); if (!state.memories.some(item => item.sessionId === currentAnalysis.sessionId)) state.memories.unshift({ id: Date.now(), ...currentAnalysis, nextReview: new Date(Date.now() + 86400000).toISOString() }); persist(); toast('Đã lưu đoạn và toàn bộ từ mới để ôn.'); }
  function renderMemory() { const sessions = state.analyses || []; $('[data-memory-count]').textContent = state.savedWords.length; $('[data-memory-list]').innerHTML = sessions.length ? sessions.map(item => { const words = state.savedWords.filter(word => word.sessionId === item.sessionId); const pageLabel = item.documentId ? ` · TRANG ${(item.pageIndex || 0) + 1}` : ''; return `<article class="jp-memory-card"><small>PHIÊN HỌC${pageLabel} · ${new Date(item.savedAt).toLocaleString('vi-VN')}</small><h3>${escapeHtml(item.source)}</h3><p>${escapeHtml(item.translation)}</p><div class="jp-session-actions"><button type="button" data-open-session="${escapeHtml(item.sessionId)}">Mở lại đúng trang</button><button type="button" data-speak-session="${escapeHtml(item.sessionId)}">▶ Đọc câu</button></div><div class="jp-session-words">${words.length ? words.map((word, index) => `<span><b>${escapeHtml(word.word)}</b><small>${escapeHtml(word.reading || '')} · ${escapeHtml(word.romaji || '')}</small><em>On ${escapeHtml(word.onReading || '—')} · Kun ${escapeHtml(word.kunReading || '—')}</em><i>${escapeHtml(word.meaningEn || '')}${word.meaningVi ? ` · ${escapeHtml(word.meaningVi)}` : ''}</i><button type="button" data-speak-saved-word="${escapeHtml(item.sessionId)}:${index}">▶ Đọc từ</button></span>`).join('') : '<small>Chưa lưu từ nào trong phiên này.</small>'}</div></article>`; }).join('') : '<p>Chưa có phiên phân tích nào được lưu.</p>'; }
  function reopenSession(sessionId) { const analysis = state.analyses.find(item => item.sessionId === sessionId); if (!analysis) return; const doc = state.documents.find(item => item.id === analysis.documentId); if (doc) { currentDocumentId = doc.id; currentPages = doc.pages || [doc.html || '<p></p>']; $('[data-document-title]').value = doc.title; renderPage(analysis.pageIndex || 0, false); } currentAnalysis = { ...analysis }; selectedText = analysis.source || ''; setView(false); renderAnalysis(); toast(`Đã trở lại trang ${(analysis.pageIndex || 0) + 1}.`); }
  function setView(memory) { $('[data-reader-view]').hidden = memory; $('[data-inspector]').hidden = memory; $('[data-library]').hidden = memory; $('[data-memory-view]').hidden = !memory; $$('.jp-nav').forEach((el, index) => el.classList.toggle('is-active', Boolean(index) === memory)); }

  document.addEventListener('selectionchange', () => requestAnimationFrame(updateSelection));
  analyzeButton.addEventListener('click', analyzeSelection); $('[data-analyze-popover]').addEventListener('click', analyzeSelection);
  $('[data-close-analysis]').addEventListener('click', () => { $('[data-analysis]').hidden = true; $('[data-inspector-empty]').hidden = false; });
  $('#jp-file').addEventListener('change', event => extractFile(event.target.files[0]));
  $('[data-toggle-connection]').addEventListener('click', () => { const panel = $('[data-connection-panel]'); panel.hidden = !panel.hidden; });
  $('[data-save-document]').addEventListener('click', saveDocument); $('[data-remember]').addEventListener('click', remember);
  $('[data-vocabulary]').addEventListener('click', event => { const saveButton = event.target.closest('[data-save-word]'); if (saveButton) saveWord(Number(saveButton.dataset.saveWord)); const speakButton = event.target.closest('[data-speak-word]'); if (speakButton) { const word = (currentAnalysis.words || [])[Number(speakButton.dataset.speakWord)]; speakJapanese(word?.reading || word?.word); } });
  $('[data-speak]').addEventListener('click', () => speakJapanese(currentAnalysis?.source));
  $('[data-memory-list]').addEventListener('click', event => { const open = event.target.closest('[data-open-session]'); if (open) reopenSession(open.dataset.openSession); const sentence = event.target.closest('[data-speak-session]'); if (sentence) speakJapanese(state.analyses.find(item => item.sessionId === sentence.dataset.speakSession)?.source); const wordButton = event.target.closest('[data-speak-saved-word]'); if (wordButton) { const [sessionId, index] = wordButton.dataset.speakSavedWord.split(':'); const words = state.savedWords.filter(word => word.sessionId === sessionId); speakJapanese(words[Number(index)]?.reading || words[Number(index)]?.word); } });
  $('[data-font]').addEventListener('change', event => { editor.classList.remove('font-sans','font-rounded'); if (event.target.value !== 'serif') editor.classList.add(`font-${event.target.value}`); });
  $$('[data-command]').forEach(button => button.addEventListener('click', () => document.execCommand(button.dataset.command)));
  $$('[data-highlight]').forEach(button => button.addEventListener('click', () => { if (savedRange) { const selection = getSelection(); selection.removeAllRanges(); selection.addRange(savedRange); } document.execCommand('hiliteColor', false, button.dataset.highlight); }));
  $('[data-document-list]').addEventListener('click', event => { const remove = event.target.closest('[data-delete-document]'); if (remove) { deleteDocument(Number(remove.dataset.deleteDocument)); return; } const button = event.target.closest('[data-document-id]'); if (!button) return; const doc = state.documents.find(item => item.id === Number(button.dataset.documentId)); if (doc) { currentDocumentId = doc.id; currentPages = doc.pages || [doc.html || '<p></p>']; $('[data-document-title]').value = doc.title; renderPage(doc.currentPage || 0, false); } });
  $('[data-page-prev]').addEventListener('click', () => renderPage(currentPageIndex - 1)); $('[data-page-next]').addEventListener('click', () => renderPage(currentPageIndex + 1));
  $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view === 'memory'))); $('[data-back-reader]').addEventListener('click', () => setView(false));
  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); analyzeSelection(); } });
  renderDocuments(); renderMemory(); renderPage(0, false);
})();
