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
  const draftStorageKey = 'anhmedia.jp-reader.draft.v1';
  const displayStorageKey = 'anhmedia.jp-reader.display.v1';
  const deviceIdStorageKey = 'anhmedia.jp-reader.device-id.v1';
  const maxSelectionCharacters = 500;
  let dailyAnalysisLimit = null;
  let serverRemaining = null;
  let usageLoaded = false;
  let usageRequestSerial = 0;
  let quotaPollTimer = null;
  let serverRevision = 0;
  let syncInProgress = false;
  let syncQueued = false;
  let draftDirty = false;
  let selectedText = '';
  let savedRange = null;
  let currentAnalysis = null;
  let hasUnsavedAnalysis = false;
  let state = loadState();
  let currentDocumentId = null;
  let currentPageIndex = 0;
  let currentPages = [editor.innerHTML];
  let bookmarkExcerpt = '';
  let bookmarkRange = null;
  let documentSearchTerm = '';
  let memorySearchTerm = '';
  let renderedMemorySessions = [];
  let activeSpeech = null;
  let analysisInProgress = false;
  let analysisWaitTimer = null;
  let analysisWaitStartedAt = 0;
  let readerScrollTop = 0;
  let memoryScrollTop = 0;
  let pendingPdfAuth = false;
  let pdfAuthPickerOpening = false;

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
    const scale = Math.max(0, Math.min(3, Number.isFinite(Number(settings.scale)) ? Number(settings.scale) : (settings.large ? 1 : 0)));
    root.classList.remove('is-reader-large', 'is-reader-larger', 'is-reader-largest');
    if (scale === 1) root.classList.add('is-reader-large');
    if (scale === 2) root.classList.add('is-reader-larger');
    if (scale === 3) root.classList.add('is-reader-largest');
    root.classList.toggle('is-reader-bold', Boolean(settings.bold));
    $('[data-reader-scale]').textContent = `${100 + scale * 15}%`;
    $('[data-reader-smaller]').disabled = scale === 0;
    $('[data-reader-larger]').disabled = scale === 3;
    $('[data-reader-bold]').setAttribute('aria-pressed', String(Boolean(settings.bold)));
  }
  function changeReaderScale(change) {
    const settings = loadDisplaySettings();
    const current = Number.isFinite(Number(settings.scale)) ? Number(settings.scale) : (settings.large ? 1 : 0);
    settings.scale = Math.max(0, Math.min(3, current + change));
    delete settings.large;
    localStorage.setItem(displayStorageKey, JSON.stringify(settings));
    applyDisplaySettings(settings);
    toast(`Cỡ chữ đọc: ${100 + settings.scale * 15}%.`);
  }
  function toggleDisplaySetting(name) {
    const settings = loadDisplaySettings();
    settings[name] = !settings[name];
    localStorage.setItem(displayStorageKey, JSON.stringify(settings));
    applyDisplaySettings(settings);
    toast(settings[name] ? (name === 'large' ? 'Đã tăng cỡ chữ toàn trang.' : 'Đã bật chữ đậm toàn trang.') : (name === 'large' ? 'Đã về cỡ chữ tiêu chuẩn.' : 'Đã tắt chữ đậm toàn trang.'));
  }

  function loadState() {
    try { const value = JSON.parse(localStorage.getItem(storageKey)) || {}; return { documents: value.documents || [], memories: value.memories || [], analyses: value.analyses || [], savedWords: value.savedWords || [], savedPhrases: value.savedPhrases || [] }; }
    catch (_) { return { documents: [], memories: [], analyses: [], savedWords: [], savedPhrases: [] }; }
  }
  function deviceId() {
    let value = localStorage.getItem(deviceIdStorageKey);
    if (!value) { value = `web-${Date.now()}-${Math.floor(Math.random() * 1000000)}`; localStorage.setItem(deviceIdStorageKey, value); }
    return value;
  }
  function newDocumentId() { return `${deviceId()}-${Date.now()}`; }
  function captureOpenDocumentForSync() {
    if (!editor || !currentPages?.length) return;
    storeCurrentPage();
    if (!currentDocumentId) currentDocumentId = newDocumentId();
    const existing = state.documents.find(item => item.id === currentDocumentId);
    const documentState = {
      id: currentDocumentId,
      title: $('[data-document-title]').value.trim() || 'Tài liệu chưa đặt tên',
      pages: [...currentPages],
      currentPage: currentPageIndex,
      bookmarks: existing?.bookmarks || [],
      updatedAt: new Date().toISOString()
    };
    state.documents = [documentState, ...state.documents.filter(item => item.id !== currentDocumentId)];
  }
  function persist(skipDocumentCapture = false) {
    if (!skipDocumentCapture) captureOpenDocumentForSync();
    localStorage.setItem(storageKey, JSON.stringify(state));
    renderDocuments();
    renderMemory();
    renderMemoryNotes();
    syncToServer();
  }

  function mergeStates(local, server) {
    if (!server) return local;
    const mergeArray = (localArr, serverArr, keyFn, dateFn) => {
      const map = new Map();
      const addToMap = (item) => {
        const key = keyFn(item);
        const existing = map.get(key);
        if (!existing) {
          map.set(key, item);
        } else {
          const dateE = new Date(dateFn(existing) || 0);
          const dateI = new Date(dateFn(item) || 0);
          if (dateI > dateE) {
            map.set(key, item);
          }
        }
      };
      (localArr || []).forEach(addToMap);
      (serverArr || []).forEach(addToMap);
      return Array.from(map.values());
    };

    return {
      documents: mergeArray(local.documents, server.documents, doc => doc.id, doc => doc.updatedAt),
      memories: mergeArray(local.memories, server.memories, mem => mem.sessionId || mem.id, mem => mem.savedAt || mem.nextReview),
      analyses: mergeArray(local.analyses, server.analyses, an => an.sessionId, an => an.savedAt),
      savedWords: mergeArray(local.savedWords, server.savedWords, w => `${w.word}|${w.reading || ''}`, w => w.savedAt),
      savedPhrases: mergeArray(local.savedPhrases, server.savedPhrases, phrase => phrase.id || phrase.source, phrase => phrase.savedAt)
    };
  }

  async function syncToServer(retry = true) {
    if (!stateSynced) return;
    if (syncInProgress) { syncQueued = true; return; }
    syncInProgress = true;
    let retryConflict = false;
    try {
      const response = await fetch('/api/japanese-learning/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ state: JSON.stringify(state), baseRevision: serverRevision })
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 409 && data.state && retry) {
        try {
          state = mergeStates(state, JSON.parse(data.state));
          localStorage.setItem(storageKey, JSON.stringify(state));
          serverRevision = Number(data.revision) || 0;
          renderDocuments(); renderMemory(); renderMemoryNotes();
          retryConflict = true;
        } catch (_) {}
      }
      if (response.ok) serverRevision = Number(data.revision) || serverRevision;
      if (response.status === 401) stateSynced = false;
    } catch (err) {
      console.error('Failed to sync state to server', err);
    } finally {
      syncInProgress = false;
    }
    if (retryConflict) return syncToServer(false);
    if (syncQueued) { syncQueued = false; return syncToServer(true); }
  }

  let stateSynced = false;
  async function triggerInitialStateSync() {
    if (stateSynced) return;
    try {
      const response = await fetch(`/api/japanese-learning/state?_=${Date.now()}`, {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        const data = await response.json();
        serverRevision = Number(data.revision) || 0;
        if (data.state) {
          const serverState = JSON.parse(data.state);
          state = mergeStates(state, serverState);
          localStorage.setItem(storageKey, JSON.stringify(state));
          if (!draftDirty) {
            const syncedDocument = state.documents.find(item => item.id === currentDocumentId) || state.documents[0];
            if (syncedDocument) {
              currentDocumentId = syncedDocument.id;
              currentPages = syncedDocument.pages?.length ? syncedDocument.pages : [syncedDocument.html || '<p></p>'];
              currentPageIndex = Math.max(0, Math.min(Number(syncedDocument.currentPage) || 0, currentPages.length - 1));
              $('[data-document-title]').value = syncedDocument.title || 'Tài liệu';
            }
          }
          renderDocuments();
          renderMemory();
          renderMemoryNotes();
          renderPage(currentPageIndex, false);
        }
        stateSynced = true;
        await syncToServer();
      }
    } catch (err) {
      console.error('Failed initial state sync', err);
    }
  }
  function toast(message) { const el = $('[data-toast]'); el.textContent = message; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { el.hidden = true; }, 2400); }
  function remainingAnalyses() {
    return usageLoaded && serverRemaining !== null ? serverRemaining : null;
  }

  function renderDailyUsage() {
    const remainingEl = $('[data-daily-remaining]');
    const limitEl = $('[data-daily-limit]');

    if (!usageLoaded) {
      if (remainingEl) remainingEl.textContent = '...';
      if (limitEl) limitEl.textContent = '...';
      analyzeButton.disabled = true;
      return;
    }

    if (remainingEl) remainingEl.textContent = serverRemaining === Number.POSITIVE_INFINITY ? '∞' : String(serverRemaining);
    if (limitEl) limitEl.textContent = dailyAnalysisLimit === Number.POSITIVE_INFINITY ? '∞' : String(dailyAnalysisLimit);

    analyzeButton.disabled =
        analysisInProgress ||
        !selectedText ||
        selectedText.length > maxSelectionCharacters ||
        Number(serverRemaining) <= 0;

    scheduleQuotaPollIfNeeded();
  }

  /*
   * Do not decrement quota locally.
   * After a successful analysis, ask the server for the new authoritative value.
   */
  function recordAnalysis() {
    refreshDailyUsage();
  }

  function acceptServerQuota(limit, remaining) {
    if (!Number.isFinite(limit) || !Number.isFinite(remaining)) return false;
    if (limit < 0 || remaining < 0 || remaining > limit) return false;

    dailyAnalysisLimit = limit;
    serverRemaining = remaining;
    usageLoaded = true;

    renderDailyUsage();
    return true;
  }

  async function refreshDailyUsage() {
    const requestId = ++usageRequestSerial;

    try {
      const response = await fetch(
          `/api/japanese-learning/usage?_=${Date.now()}-${requestId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache'
            },
            cache: 'no-store',
            credentials: 'same-origin'
          }
      );

      if (requestId !== usageRequestSerial) return false;

      if (response.status === 401) {
        dailyAnalysisLimit = null;
        serverRemaining = null;
        usageLoaded = false;
        renderDailyUsage();
        return false;
      }

      if (!response.ok) {
        /*
         * Network/server error: keep the last valid server quota.
         * Never replace 49/60 with 0/10 or 10/10.
         */
        if (!usageLoaded) renderDailyUsage();
        return false;
      }

      const usage = await response.json();
      if (requestId !== usageRequestSerial) return false;

      if (usage.unlimited === true) {
        dailyAnalysisLimit = Number.POSITIVE_INFINITY;
        serverRemaining = Number.POSITIVE_INFINITY;
        usageLoaded = true;
        renderDailyUsage();
        triggerInitialStateSync();
        return true;
      }

      const accepted = acceptServerQuota(
          Number(usage.limit),
          Number(usage.remaining)
      );
      if (accepted) {
        triggerInitialStateSync();
      }
      return accepted;
    } catch (_) {
      if (!usageLoaded) renderDailyUsage();
      return false;
    }
  }

  function scheduleQuotaPollIfNeeded() {
    if (quotaPollTimer) {
      clearTimeout(quotaPollTimer);
      quotaPollTimer = null;
    }

    if (!usageLoaded || serverRemaining === null || serverRemaining > 0) return;

    quotaPollTimer = setTimeout(async () => {
      quotaPollTimer = null;
      await refreshDailyUsage();
      scheduleQuotaPollIfNeeded();
    }, 5000);
  }

  async function logoutReaderStayHere(event) {
    if (event) event.preventDefault();

    /*
     * Keep reader documents/memory in localStorage.
     * Only terminate the authenticated server session.
     */
    let loggedOut = false;

    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        redirect: 'manual',
        cache: 'no-store'
      });
      loggedOut = response.ok || response.type === 'opaqueredirect' || response.status === 0;
    } catch (_) {}

    if (!loggedOut) {
      try {
        const response = await fetch('/logout', {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          redirect: 'manual',
          cache: 'no-store'
        });
        loggedOut = response.ok || response.type === 'opaqueredirect' || response.status === 0;
      } catch (_) {}
    }

    dailyAnalysisLimit = null;
    serverRemaining = null;
    usageLoaded = false;

    /*
     * reload() keeps the user on this exact Japanese reader URL.
     * No window.location assignment to /home or backend redirect target.
     */
    window.location.reload();
  }

  function refreshQuotaOnReturn() {
    refreshDailyUsage();
  }

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
  function cacheDraft() {
    if (!draftDirty) return;
    storeCurrentPage();
    localStorage.setItem(draftStorageKey, JSON.stringify({
      documentId: currentDocumentId,
      title: $('[data-document-title]').value,
      pages: currentPages,
      currentPage: currentPageIndex,
      savedAt: new Date().toISOString()
    }));
  }
  function restoreDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(draftStorageKey));
      if (!draft || !Array.isArray(draft.pages) || !draft.pages.length) return false;
      const savedDocument = state.documents.find(item => item.id === draft.documentId);
      if (savedDocument && new Date(savedDocument.updatedAt || 0) >= new Date(draft.savedAt || 0)) return false;
      currentDocumentId = draft.documentId || null;
      currentPages = draft.pages;
      currentPageIndex = Math.max(0, Math.min(Number(draft.currentPage) || 0, currentPages.length - 1));
      $('[data-document-title]').value = draft.title || 'Tài liệu chưa đặt tên';
      draftDirty = true;
      toast('Đã khôi phục bản nháp chưa lưu trên thiết bị này.');
      return true;
    } catch (_) { return false; }
  }
  function normalizedBookmarks(doc) { doc.bookmarks = (doc.bookmarks || []).map((item, index) => typeof item === 'number' ? { id: `legacy-${item}-${index}`, page: item, note: 'Dấu trang cũ', excerpt: '' } : item); return doc.bookmarks; }
  function renderPage(index, saveCurrent = true) { if (saveCurrent) storeCurrentPage(); currentPageIndex = Math.max(0, Math.min(index, currentPages.length - 1)); bookmarkExcerpt = ''; bookmarkRange = null; editor.innerHTML = currentPages[currentPageIndex] || '<p></p>'; const doc = state.documents.find(item => item.id === currentDocumentId); const pageBookmarkCount = doc ? normalizedBookmarks(doc).filter(item => item.page === currentPageIndex).length : 0; $$('[data-page-label]').forEach(el => { el.textContent = `Trang ${currentPageIndex + 1} / ${currentPages.length}`; }); $$('[data-page-prev]').forEach(el => { el.disabled = currentPageIndex === 0; }); $$('[data-page-next]').forEach(el => { el.disabled = currentPageIndex >= currentPages.length - 1; }); $$('[data-page-bookmark]').forEach(el => { el.disabled = !doc; el.classList.toggle('is-active', pageBookmarkCount > 0); const label = pageBookmarkCount ? `Đã lưu dấu (${pageBookmarkCount}) · Thêm dấu mới` : 'Lưu dấu trang'; el.title = label; el.setAttribute('aria-label', label); }); $('[data-document-meta]').textContent = `TRANG ${currentPageIndex + 1} / ${currentPages.length} · Chọn đoạn ngắn để học`; if (doc) { doc.currentPage = currentPageIndex; localStorage.setItem(storageKey, JSON.stringify(state)); } }
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
  function isAppleTouchDevice() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function startJapaneseSpeech(text) {
    speechSynthesis.cancel();
    speechSynthesis.resume();
    const utterance = new SpeechSynthesisUtterance(text);
    activeSpeech = utterance;
    utterance.lang = 'ja-JP';
    utterance.rate = .82;
    utterance.volume = 1;
    const voice = speechSynthesis.getVoices().find(item => /^ja(?:-|_)/i.test(item.lang));
    if (voice) utterance.voice = voice;
    utterance.onend = () => { if (activeSpeech === utterance) activeSpeech = null; };
    utterance.onerror = event => { if (activeSpeech === utterance) activeSpeech = null; if (event.error !== 'canceled' && event.error !== 'interrupted') toast('Safari chưa phát được giọng tiếng Nhật. Hãy kiểm tra chế độ im lặng và âm lượng.'); };
    speechSynthesis.speak(utterance);
  }
  function speakJapanese(text) {
    if (!text || !('speechSynthesis' in window)) { toast('Thiết bị này không hỗ trợ đọc tiếng Nhật.'); return; }
    if (isAppleTouchDevice()) { startJapaneseSpeech(text); return; }
    playSpeakerAlert().then(() => startJapaneseSpeech(`。　。　${text}`));
  }
  function showAnalysisConnection(status, message) { const panel = $('[data-analysis-connection]'); const login = $('[data-analysis-login]'); const contact = $('[data-analysis-contact]'); panel.hidden = false; $('[data-inspector-empty]').hidden = true; login.hidden = status !== 401; contact.hidden = true; const missingKey = /not configured|OPENAI_API_KEY/i.test(message || ''); $('[data-analysis-error]').textContent = status === 401 ? 'Hãy đăng nhập với Google để sử dụng miễn phí.' : status === 429 ? 'Dịch vụ AI đang nhận quá nhiều yêu cầu. Vui lòng đợi một chút rồi thử lại.' : missingKey ? 'Bạn đã đăng nhập. Máy chủ chưa có OPENAI_API_KEY nên chưa thể phân tích. Quản trị viên cần thêm key vào secrets/live-designer.env và khởi động lại portal.' : status === 503 ? `OpenAI tạm thời chưa phản hồi. ${message || 'Vui lòng thử lại sau.'}` : `Không thể kết nối API phân tích. ${message || 'Kiểm tra mạng rồi thử lại.'}`; const extraction = $('[data-connection-panel]'); extraction.hidden = false; }
  function rememberLoginReturn() { const target = `${window.location.pathname}${window.location.search}${window.location.hash}`; document.cookie = `PORTAL_LOGIN_RETURN=${encodeURIComponent(target)}; Max-Age=600; Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`; }
  function setLoginOpen(open) { const modal = $('[data-login-modal]'); if (!modal) return; modal.hidden = !open; document.body.style.overflow = open ? 'hidden' : ''; if (open) setTimeout(() => modal.querySelector('input')?.focus(), 30); }
  let googleLoginPopup = null;
  let googleLoginPollTimer = null;
  let googleLoginTimeoutTimer = null;

  function currentReaderUrl() {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }

  function clearGoogleLoginWatch() {
    if (googleLoginPollTimer) {
      clearInterval(googleLoginPollTimer);
      googleLoginPollTimer = null;
    }
    if (googleLoginTimeoutTimer) {
      clearTimeout(googleLoginTimeoutTimer);
      googleLoginTimeoutTimer = null;
    }
  }

  async function readerSessionIsAuthenticated() {
    try {
      const response = await fetch(`/api/japanese-learning/usage?_login=${Date.now()}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache'
        },
        cache: 'no-store',
        credentials: 'same-origin'
      });
      return response.ok;
    } catch (_) {
      return false;
    }
  }

  function finishGooglePopupLogin() {
    clearGoogleLoginWatch();
    try {
      if (googleLoginPopup && !googleLoginPopup.closed) googleLoginPopup.close();
    } catch (_) {}
    googleLoginPopup = null;
    setLoginOpen(false);

    /* Reload exactly the current Japanese-reading URL, never /home. */
    window.location.replace(currentReaderUrl());
  }

  function watchGooglePopupLogin() {
    clearGoogleLoginWatch();

    googleLoginPollTimer = setInterval(async () => {
      if (await readerSessionIsAuthenticated()) {
        finishGooglePopupLogin();
        return;
      }

      /* User may close/cancel the Google popup. Keep reader page untouched. */
      try {
        if (!googleLoginPopup || googleLoginPopup.closed) {
          clearGoogleLoginWatch();
          googleLoginPopup = null;
        }
      } catch (_) {}
    }, 1000);

    googleLoginTimeoutTimer = setTimeout(() => {
      clearGoogleLoginWatch();
      try {
        if (googleLoginPopup && !googleLoginPopup.closed) googleLoginPopup.close();
      } catch (_) {}
      googleLoginPopup = null;
    }, 180000);
  }

  function openGoogleLoginPopup(event) {
    if (event) event.preventDefault();

    rememberLoginReturn();

    const width = 520;
    const height = 700;
    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));
    const features = `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    googleLoginPopup = window.open(
        '/oauth2/authorization/google',
        'anhmedia-google-login',
        features
    );

    if (!googleLoginPopup) {
      toast('Trình duyệt đang chặn cửa sổ đăng nhập Google. Hãy cho phép popup rồi thử lại.');
      return;
    }

    try { googleLoginPopup.focus(); } catch (_) {}
    watchGooglePopupLogin();
  }
  async function submitReaderLogin(event) {
    event.preventDefault();
    const form = event.currentTarget; const error = $('[data-login-error]'); const submit = form.querySelector('[type="submit"]'); const data = new FormData(form);
    const email = String(data.get('email') || '').trim(); const pass = String(data.get('password') || '');
    if (!email || !pass) { error.textContent = 'Vui lòng nhập tài khoản và mật khẩu.'; error.hidden = false; return; }
    rememberLoginReturn(); submit.disabled = true; submit.textContent = 'Đang đăng nhập…'; error.hidden = true;
    try {
      const response = await fetch('/api/login-act', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ id: 0, firstName: '', lastName: '', user: email, pass, address: '', district: '', city: '', province: '', email, phoneNumber: '', selectedAddress: '000', zipcode: '000', note: '000' }) });
      if (!response.ok) throw new Error('Máy chủ không chấp nhận yêu cầu đăng nhập.');
      const user = await response.json();
      if (!user || Number(user.id) <= 0) throw new Error('Sai tài khoản hoặc mật khẩu.');
      if (user.pass === 'mfa') { window.location.assign('/dang-nhap'); return; }
      window.location.assign(`${window.location.pathname}${window.location.search}${window.location.hash}`);
    } catch (loginError) { error.textContent = loginError.message || 'Không thể đăng nhập. Vui lòng thử lại.'; error.hidden = false; submit.disabled = false; submit.textContent = 'Đăng nhập'; }
  }

  function openAnalysisWait(text) {
    const modal = $('[data-analysis-wait]');
    const source = $('[data-analysis-wait-source]');
    const seconds = $('[data-analysis-wait-seconds]');

    analysisInProgress = true;
    analysisWaitStartedAt = Date.now();

    if (source) source.textContent = text || '';
    if (seconds) seconds.textContent = '0';
    if (modal) modal.hidden = false;

    document.body.classList.add('jp-analysis-locked');

    analyzeButton.disabled = true;
    $$('[data-analyze-popover]').forEach(button => { button.disabled = true; });

    if (analysisWaitTimer) clearInterval(analysisWaitTimer);
    analysisWaitTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - analysisWaitStartedAt) / 1000);
      if (seconds) seconds.textContent = String(elapsed);
    }, 1000);
  }

  function closeAnalysisWait() {
    const modal = $('[data-analysis-wait]');

    analysisInProgress = false;

    if (analysisWaitTimer) {
      clearInterval(analysisWaitTimer);
      analysisWaitTimer = null;
    }

    if (modal) modal.hidden = true;

    document.body.classList.remove('jp-analysis-locked');

    $$('[data-analyze-popover]').forEach(button => { button.disabled = false; });

    const remaining = remainingAnalyses();
    analyzeButton.disabled =
        !usageLoaded ||
        !selectedText ||
        selectedText.length > maxSelectionCharacters ||
        remaining === 0;
  }

  function updateSelection() {
    const selection = window.getSelection();
    const text = selection && selection.rangeCount ? selection.toString().trim() : '';
    const inside = selection && selection.rangeCount && editor.contains(selection.anchorNode) && editor.contains(selection.focusNode);
    if (!inside || text.length < 2) { selectedText = ''; savedRange = null; analyzeButton.disabled = true; popover.hidden = true; return; }
    selectedText = text;
    bookmarkExcerpt = text.slice(0, 300);
    bookmarkRange = selection.getRangeAt(0).cloneRange();
    savedRange = selection.getRangeAt(0).cloneRange();
    const overLimit = text.length > maxSelectionCharacters;
    analyzeButton.disabled = analysisInProgress || overLimit || !usageLoaded || remainingAnalyses() === 0;
    popover.classList.toggle('is-over-limit', overLimit);
    $('[data-selection-preview]').textContent = overLimit ? `Đoạn chọn có ${text.length} ký tự. Vui lòng chọn tối đa ${maxSelectionCharacters} ký tự.` : selectedText;
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
      translationVi: 'Mặc dù lượng nhiên liệu mồi rất nhỏ, năng lượng đánh lửa mạnh của nó giúp quá trình cháy ổn định và nâng cao hiệu suất.',
      tokens: [{surface:'パイロット',reading:'ぱいろっと',romaji:'pairotto'},{surface:'燃料',reading:'ねんりょう',romaji:'nenryō'},{surface:'微量',reading:'びりょう',romaji:'biryō'},{surface:'点火',reading:'てんか',romaji:'tenka'},{surface:'約',reading:'やく',romaji:'yaku'},{surface:'倍',reading:'ばい',romaji:'bai'}],
      words: [{word:'燃料',reading:'ねんりょう',romaji:'nenryō',onReading:'ネン・リョウ',kunReading:'もえる・はかる',meaningEn:'fuel',meaningVi:'nhiên liệu'},{word:'微量',reading:'びりょう',romaji:'biryō',onReading:'ビ・リョウ',kunReading:'かすか・はかる',meaningEn:'minute amount',meaningVi:'một lượng rất nhỏ'},{word:'点火',reading:'てんか',romaji:'tenka',onReading:'テン・カ',kunReading:'つける・ひ',meaningEn:'ignition',meaningVi:'sự đánh lửa'}]
    } : {
      ruby: '<ruby>微<rt>bi</rt></ruby><ruby>量<rt>ryō</rt></ruby>（<ruby>熱<rt>netsu</rt></ruby><ruby>量<rt>ryō</rt></ruby><ruby>比<rt>hi</rt></ruby> 1% <ruby>以<rt>i</rt></ruby><ruby>下<rt>ka</rt></ruby>）の <ruby>液<rt>eki</rt></ruby><ruby>体<rt>tai</rt></ruby><ruby>燃<rt>nen</rt></ruby><ruby>料<rt>ryō</rt></ruby>',
      hira: 'ぱいろっと いんじぇくた から びりょう（ねつりょう ひ 1% いか）の えきたい ねんりょう を ふんしゃ し…',
      translation: 'A minute amount of liquid fuel—less than a 1% heat-value ratio—is injected to ignite the gas inside the pre-chamber.',
      translationVi: 'Một lượng nhỏ nhiên liệu lỏng—có tỷ lệ nhiệt trị dưới 1%—được phun vào để đốt cháy khí bên trong buồng phụ.',
      tokens: [{surface:'パイロット',reading:'ぱいろっと',romaji:'pairotto'},{surface:'インジェクタ',reading:'いんじぇくた',romaji:'injekuta'},{surface:'微量',reading:'びりょう',romaji:'biryō'},{surface:'液体',reading:'えきたい',romaji:'ekitai'},{surface:'燃料',reading:'ねんりょう',romaji:'nenryō'},{surface:'噴射',reading:'ふんしゃ',romaji:'funsha'}],
      words: [{word:'微量',reading:'びりょう',romaji:'biryō',onReading:'ビ・リョウ',kunReading:'かすか・はかる',meaningEn:'minute amount',meaningVi:'một lượng rất nhỏ'},{word:'液体',reading:'えきたい',romaji:'ekitai',onReading:'エキ・タイ',kunReading:'しる・からだ',meaningEn:'liquid',meaningVi:'chất lỏng'},{word:'噴射',reading:'ふんしゃ',romaji:'funsha',onReading:'フン・シャ',kunReading:'ふく・いる',meaningEn:'injection / jetting',meaningVi:'phun, phun nhiên liệu'}]
    };
    return { ...first, source: text };
  }

  async function fetchAnalysisWithRetry(payload, attempt = 1, maxAttempts = 3) {
    try {
      const response = await fetch('/api/japanese-learning/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) { const body = await response.text(); let message = body; try { message = JSON.parse(body).error || body; } catch (_) { if (/^\s*<(!doctype|html)/i.test(body)) message = `Máy chủ gặp lỗi nội bộ (HTTP ${response.status}). Vui lòng thử lại sau hoặc liên hệ quản trị viên.`; } const error = new Error(message || 'analysis endpoint unavailable'); error.status = response.status; throw error; }
      return await response.json();
    } catch (error) {
      const retryable = !error.status || error.status >= 500;
      if (retryable && attempt < maxAttempts) { await new Promise(resolve => setTimeout(resolve, 500 * attempt)); return fetchAnalysisWithRetry(payload, attempt + 1, maxAttempts); }
      throw error;
    }
  }

  async function analyzeSelection() {
    if (analysisInProgress) { toast('Đang phân tích đoạn hiện tại. Vui lòng chờ kết quả.'); return; }
    if (!selectedText) return;
    if (selectedText.length > maxSelectionCharacters) { toast(`Đoạn quá dài. Chỉ chọn tối đa ${maxSelectionCharacters} ký tự, khoảng 1/4 trang A4.`); return; }

    /*
     * SERVER FIRST:
     * Always fetch /usage immediately before every analysis.
     * Do not trust local/offline quota as the decision source.
     */
    const quotaReady = await refreshDailyUsage();

    if (!quotaReady) {
      toast('Không lấy được hạn mức mới từ máy chủ. Vui lòng kiểm tra đăng nhập hoặc kết nối.');
      if (!usageLoaded) requireGoogleLoginForAnalysis();
      return;
    }

    if (currentAnalysis && hasUnsavedAnalysis && currentAnalysis.source !== selectedText) {
      const savePrevious = window.confirm('Bạn chưa lưu kết quả phân tích trước. Nhấn OK để lưu trước khi phân tích đoạn mới, hoặc Hủy để bỏ kết quả cũ.');
      if (savePrevious) remember();
      else discardCurrentAnalysis();
    }
    currentAnalysis = null;
    hasUnsavedAnalysis = false;
    $('[data-show-analysis]').disabled = true;
    popover.hidden = true;
    analyzeButton.disabled = true;
    openAnalysisWait(selectedText);
    analyzeButton.classList.add('is-loading');
    analyzeButton.title = 'Đang phân tích…';
    analyzeButton.setAttribute('aria-label', 'Đang phân tích…');
    const analyzeSpinner = analyzeButton.querySelector('[data-analyze-spinner]');
    if (analyzeSpinner) analyzeSpinner.hidden = false;
    try {
      currentAnalysis = await fetchAnalysisWithRetry({ text: selectedText, mode: 'selection' });
      $('[data-analysis-connection]').hidden = true;
    } catch (error) {
      if (error.status === 429) {
        await refreshDailyUsage();
      }
      showAnalysisConnection(error.status || 0, error.message);
      if (/パイロット|微量|燃料|点火/.test(selectedText)) {
        currentAnalysis = sampleAnalysis(selectedText);
        toast('Đang dùng bản phân tích mẫu; kết nối API để phân tích nội dung mới.');
      } else {
        toast(error.status === 401 ? 'Hãy đăng nhập Google để phân tích.' : 'API máy chủ chưa sẵn sàng. Đoạn đã chọn vẫn được giữ.');
      }
    } finally {
      closeAnalysisWait();
      analyzeButton.classList.remove('is-loading');
      analyzeButton.title = 'Phân tích đoạn chọn (⌘/Ctrl+Enter)';
      analyzeButton.setAttribute('aria-label', 'Phân tích đoạn chọn (⌘/Ctrl+Enter)');
      if (analyzeSpinner) analyzeSpinner.hidden = true;
      await refreshDailyUsage();
      analyzeButton.disabled = !usageLoaded || !selectedText || selectedText.length > maxSelectionCharacters || remainingAnalyses() === 0;
    }
    if (currentAnalysis) { prepareAnalysisResult(currentAnalysis); hasUnsavedAnalysis = true; renderAnalysis(); }
  }

  function updateShowAnalysisToggle() {
    const button = $('[data-show-analysis]');
    if (!button) return;
    const visible = !$('[data-analysis]').hidden;
    const icon = button.querySelector('span');
    if (icon) icon.textContent = visible ? '🙈' : '📖';
    button.title = visible ? 'Ẩn kết quả' : 'Hiện kết quả';
    button.setAttribute('aria-label', visible ? 'Ẩn kết quả' : 'Hiện kết quả');
  }

  function renderAnalysis() {
    if (!currentAnalysis) return;
    const analysisWords = currentAnalysis.words || currentAnalysis.vocabulary || [];
    $('[data-inspector-empty]').hidden = true; $('[data-analysis]').hidden = false;
    $('[data-kanji-reading]').innerHTML = currentAnalysis.ruby || escapeHtml(currentAnalysis.annotatedText);
    $('[data-hiragana]').textContent = currentAnalysis.hira || currentAnalysis.hiragana;
    $('[data-spelling-line]').innerHTML = (currentAnalysis.tokens || []).map((item, index) => { const surface = item.surface || item[0] || ''; const reading = item.reading || (/[ぁ-んァ-ヶー]+/.test(surface) ? surface : '—'); const romaji = item.romaji || item[1] || ''; return `<button class="jp-spelling" type="button" data-speak-token="${index}" aria-label="Nghe cách đọc ${escapeHtml(surface)}"><small class="jp-token-hira">${escapeHtml(reading)}</small><b>${escapeHtml(surface)}</b><small class="jp-token-romaji">${escapeHtml(romaji || '—')}</small></button>`; }).join('') || `<span>${escapeHtml(currentAnalysis.source || '')}</span>`;
    $('[data-translation]').textContent = currentAnalysis.translation;
    $('[data-translation-vi]').textContent = currentAnalysis.translationVi || 'Chưa có bản dịch tiếng Việt cho kết quả cũ.';
    $('[data-tokens]').innerHTML = (currentAnalysis.tokens || []).map(item => { const surface = item[0] || item.surface || ''; const word = analysisWords.find(entry => (entry.word || entry[0]) === surface || (entry.reading && entry.reading === item.reading)); const romaji = item.romaji || item[1] || word?.romaji || ''; const meaningEn = item.meaningEn || word?.meaningEn || word?.meaning || ''; const meaningVi = item.meaningVi || word?.meaningVi || ''; return `<span class="jp-token"><b>${escapeHtml(surface)}</b><small>${escapeHtml(romaji)}</small><em>${escapeHtml(meaningEn)}${meaningVi ? ` · ${escapeHtml(meaningVi)}` : ''}</em></span>`; }).join('');
    $('[data-vocabulary]').innerHTML = analysisWords.map((item, index) => { const word = item.word || item[0] || ''; const meaningEn = item.meaningEn || item.meaning || item[1] || ''; const meaningVi = item.meaningVi || ''; const saved = state.savedWords.some(entry => entry.word === word && (entry.reading || '') === (item.reading || '')); const characters = (item.characters || []).map(char => `<i class="jp-kanji-char"><strong>${escapeHtml(char.kanji)}</strong><small>On ${escapeHtml(char.onReading || '—')} · Kun ${escapeHtml(char.kunReading || '—')}</small><em>${escapeHtml(char.meaningEn || '')}${char.memoryVi ? ` · ${escapeHtml(char.memoryVi)}` : ''}</em></i>`).join(''); return `<span class="jp-word"><b>${escapeHtml(word)}</b><small>ひらがな: ${escapeHtml(item.reading || '—')} · ${escapeHtml(item.romaji || '')}</small><span>On: ${escapeHtml(item.onReading || '—')} · Kun: ${escapeHtml(item.kunReading || '—')}</span><em>${escapeHtml(meaningEn)}${meaningVi ? ` · ${escapeHtml(meaningVi)}` : ''}</em>${characters ? `<span class="jp-kanji-breakdown">${characters}</span>` : ''}<button type="button" data-speak-word="${index}">▶ Đọc từ</button><button type="button" data-save-word="${index}" ${saved ? 'disabled' : ''}>${saved ? '✓ Đã lưu' : '＋ Lưu từ'}</button></span>`; }).join('');
    $('[data-study-note]').value = currentAnalysis.note || '';
    $('[data-note-count]').textContent = String((currentAnalysis.note || '').length);
    $('[data-show-analysis]').disabled = false;
    updateShowAnalysisToggle();
  }

  function prepareAnalysisResult(result) { captureOpenDocumentForSync(); const existing = (state.analyses || []).find(item => item.source === result.source && item.documentId === currentDocumentId && item.pageIndex === currentPageIndex); result.sessionId = existing?.sessionId || `session-${Date.now()}`; result.savedAt = new Date().toISOString(); result.documentId = currentDocumentId; result.pageIndex = currentPageIndex; }
  function saveAnalysisResult(result) { prepareAnalysisResult(result); state.analyses = [{ ...result }, ...(state.analyses || []).filter(item => item.sessionId !== result.sessionId)].slice(0, 100); persist(); }

  function discardCurrentAnalysis() { if (!currentAnalysis?.sessionId) return; const sessionId = currentAnalysis.sessionId; state.analyses = state.analyses.filter(item => item.sessionId !== sessionId); state.memories = state.memories.filter(item => item.sessionId !== sessionId); state.savedWords = state.savedWords.filter(item => item.sessionId !== sessionId); persist(); hasUnsavedAnalysis = false; }

  function saveWord(index, silent = false) { const item = (currentAnalysis?.words || currentAnalysis?.vocabulary || [])[index]; if (!item || !currentAnalysis?.sessionId) return; const word = item.word || item[0] || ''; const reading = item.reading || ''; if (!state.savedWords.some(entry => entry.word === word && (entry.reading || '') === reading)) state.savedWords.unshift({ ...item, word, sessionId: currentAnalysis.sessionId, source: currentAnalysis.source, savedAt: new Date().toISOString() }); persist(); renderAnalysis(); if (!silent) toast(`Đã lưu từ ${word}.`); }

  function setPdfAuthOpen(open) {
    const modal = $('[data-pdf-auth-modal]');
    if (!modal) return;
    modal.hidden = !open;
    if (open) {
      const user = $('[data-user-id]')?.value || '';
      const token = $('[data-token-id]')?.value || '';
      $('[data-pdf-auth-user]').value = user;
      $('[data-pdf-auth-token]').value = token;
      $('[data-pdf-auth-error]').hidden = true;
      setTimeout(() => $('[data-pdf-auth-user]')?.focus(), 30);
    }
  }

  function confirmPdfAuth(event) {
    if (pdfAuthPickerOpening) return;
    pdfAuthPickerOpening = true;
    window.setTimeout(() => { pdfAuthPickerOpening = false; }, 700);

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const userField = document.querySelector('[data-pdf-auth-user]');
    const tokenField = document.querySelector('[data-pdf-auth-token]');
    const error = document.querySelector('[data-pdf-auth-error]');
    const fileInput = document.getElementById('jp-file');

    const user = String(userField ? userField.value : '').trim();
    const token = String(tokenField ? tokenField.value : '').trim();

    if (!user || !token) {
      if (error) {
        error.textContent = 'Vui lòng nhập đầy đủ User ID và Token OCR.';
        error.hidden = false;
      }
      pdfAuthPickerOpening = false;
      return;
    }

    const hiddenUser = document.querySelector('[data-user-id]');
    const hiddenToken = document.querySelector('[data-token-id]');
    if (hiddenUser) hiddenUser.value = user;
    if (hiddenToken) hiddenToken.value = token;

    try {
      sessionStorage.setItem('anhmedia.jp-reader.ocr-user', user);
      sessionStorage.setItem('anhmedia.jp-reader.ocr-token', token);
    } catch (_) {}

    if (error) error.hidden = true;

    /*
     * Keep this in the SAME synchronous user click.
     * Safari may reject fileInput.click() if the input is display:none.
     * The HTML now keeps it visually hidden instead.
     */
    pendingPdfAuth = true;

    if (!fileInput) {
      if (error) {
        error.textContent = 'Không tìm thấy bộ chọn PDF.';
        error.hidden = false;
      }
      pdfAuthPickerOpening = false;
      return;
    }

    try {
      if (typeof fileInput.showPicker === 'function') {
        fileInput.showPicker();
      } else {
        fileInput.click();
      }

      setPdfAuthOpen(false);
    } catch (pickerError) {
      if (error) {
        error.textContent = 'Safari chưa mở được bộ chọn PDF. Hãy chạm lại nút Tiếp tục chọn PDF.';
        error.hidden = false;
      }
      pdfAuthPickerOpening = false;
    }
  }

  async function extractFile(file) {
    if (!file) return;
    const userId = $('[data-user-id]').value.trim(); const tokenId = $('[data-token-id]').value;
    const progress = $('[data-upload-progress]'); progress.hidden = false;
    const form = new FormData(); form.append('file', file); form.append('language', 'jpn');
    if (userId && tokenId) { form.append('userId', userId); form.append('tokenId', tokenId); }
    try {
      const response = await fetch('/api/extract-text', { method: 'POST', body: form });
      if (response.status === 401) { $('[data-connection-panel]').hidden = false; throw new Error('Hãy đăng nhập Google hoặc nhập token máy chủ.'); }
      const rawBody = await response.text(); let data = {}; try { data = JSON.parse(rawBody); } catch (_) { data = { error: /^\s*<(!doctype|html)/i.test(rawBody) ? `Máy chủ gặp lỗi nội bộ (HTTP ${response.status}). Vui lòng thử lại sau hoặc liên hệ quản trị viên.` : rawBody }; }
      if (!response.ok || data.status !== 'success') throw new Error(data.error || 'Không thể trích xuất');
      currentDocumentId = newDocumentId(); currentPages = splitIntoPages(data.text || ''); currentPageIndex = 0; $('[data-document-title]').value = file.name.replace(/\.pdf$/i, ''); renderPage(0, false);
      state.documents.unshift({ id: currentDocumentId, title: $('[data-document-title]').value, pages: currentPages, currentPage: 0, bookmarks: [], updatedAt: new Date().toISOString() }); persist(); renderPage(0, false); toast(`Đã chia tài liệu thành ${currentPages.length} trang học.`);
    } catch (error) { toast(error.message); } finally { progress.hidden = true; $('#jp-file').value = ''; }
  }

  function saveDocument() { storeCurrentPage(); const title = $('[data-document-title]').value.trim() || 'Tài liệu chưa đặt tên'; const id = currentDocumentId || newDocumentId(); const existing = state.documents.find(item => item.id === id); currentDocumentId = id; const data = { id, title, pages: currentPages, currentPage: currentPageIndex, bookmarks: existing?.bookmarks || [], updatedAt: new Date().toISOString() }; state.documents = [data, ...state.documents.filter(item => item.id !== id)]; draftDirty = false; localStorage.removeItem(draftStorageKey); persist(); renderPage(currentPageIndex, false); toast(`Đã lưu trang ${currentPageIndex + 1}/${currentPages.length} vào tài khoản.`); }
  function renderDocuments() { $('[data-document-list]').innerHTML = state.documents.slice(0, 8).map(item => { const bookmarks = normalizedBookmarks(item); const pages = [...new Set(bookmarks.map(mark => mark.page))].sort((a, b) => a - b); const tree = pages.map(page => { const marks = bookmarks.filter(mark => mark.page === page); return `<details class="jp-bookmark-page"><summary>Trang ${page + 1}<b>${marks.length}</b></summary><div>${marks.map(mark => `<article><button class="jp-bookmark-open" type="button" data-bookmark-document="${item.id}" data-bookmark-id="${escapeHtml(mark.id)}"><span>${escapeHtml(mark.note || 'Không có ghi chú')}</span>${mark.excerpt ? `<small>${escapeHtml(mark.excerpt)}</small>` : ''}</button><button class="jp-bookmark-delete" type="button" data-delete-bookmark="${escapeHtml(mark.id)}" data-bookmark-document="${item.id}" aria-label="Xóa dấu trang">×</button></article>`).join('')}</div></details>`; }).join(''); return `<article class="jp-document-row"><button class="jp-document" type="button" data-document-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><small>${(item.pages || [item.html]).length} trang · ${bookmarks.length} dấu đoạn · ${new Date(item.updatedAt).toLocaleDateString('vi-VN')}</small></button><button class="jp-document-delete" type="button" data-delete-document="${item.id}" aria-label="Xóa ${escapeHtml(item.title)}" title="Xóa tài liệu">×</button>${bookmarks.length ? `<details class="jp-bookmark-tree"><summary>Dấu trang theo trang <b>${bookmarks.length}</b></summary><div class="jp-bookmark-list">${tree}</div></details>` : ''}</article>`; }).join(''); }
  function addBookmark(note) { const doc = state.documents.find(item => item.id === currentDocumentId); if (!doc) { toast('Hãy tải lên hoặc lưu tài liệu trước khi đánh dấu đoạn.'); return; } const cleanNote = String(note || '').trim(); if (!cleanNote) { toast('Nhập ghi chú để nhớ lý do đánh dấu đoạn này.'); return; } const id = `mark-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; const anchorId = `anchor-${id}`; const excerpt = bookmarkExcerpt || editor.querySelector('p')?.innerText?.trim().slice(0, 300) || editor.innerText.trim().slice(0, 300); const anchor = document.createElement('span'); anchor.dataset.jpBookmarkAnchor = anchorId; anchor.className = 'jp-text-bookmark'; anchor.contentEditable = 'false'; anchor.title = cleanNote; anchor.textContent = '🔖'; if (bookmarkRange && editor.contains(bookmarkRange.commonAncestorContainer)) { const position = bookmarkRange.cloneRange(); position.collapse(true); position.insertNode(anchor); } else { (editor.querySelector('p') || editor).prepend(anchor); } storeCurrentPage(); normalizedBookmarks(doc).push({ id, anchorId, page: currentPageIndex, note: cleanNote.slice(0, 240), excerpt, savedAt: new Date().toISOString() }); doc.pages = currentPages; doc.currentPage = currentPageIndex; doc.updatedAt = new Date().toISOString(); persist(); renderPage(currentPageIndex, false); toast(`Đã lưu ghi chú tại trang ${currentPageIndex + 1}.`); }
  function deleteBookmark(documentId, bookmarkId) { const doc = state.documents.find(item => item.id === documentId); if (!doc) return; const mark = normalizedBookmarks(doc).find(item => item.id === bookmarkId); if (mark?.anchorId && doc.pages?.[mark.page]) { const holder = document.createElement('div'); holder.innerHTML = doc.pages[mark.page]; holder.querySelector(`[data-jp-bookmark-anchor="${mark.anchorId}"]`)?.remove(); doc.pages[mark.page] = holder.innerHTML; if (currentDocumentId === documentId && currentPageIndex === mark.page) currentPages[mark.page] = holder.innerHTML; } doc.bookmarks = normalizedBookmarks(doc).filter(item => item.id !== bookmarkId); persist(); if (currentDocumentId === documentId) renderPage(currentPageIndex, false); toast('Đã xóa dấu đoạn.'); }
  function openBookmark(documentId, bookmarkId) { const doc = state.documents.find(item => item.id === documentId); const mark = doc && normalizedBookmarks(doc).find(item => item.id === bookmarkId); if (!doc || !mark) return; currentDocumentId = doc.id; currentPages = doc.pages || [doc.html || '<p></p>']; $('[data-document-title]').value = doc.title; renderPage(mark.page, false); requestAnimationFrame(() => { const excerpts = [mark.excerpt, mark.excerpt?.split(/\r?\n/)[0], mark.excerpt?.slice(0, 120), mark.excerpt?.slice(0, 60)].map(value => String(value || '').trim()).filter((value, index, values) => value.length >= 6 && values.indexOf(value) === index); let highlighted = null; for (const excerpt of excerpts) { highlighted = highlightSearchText(excerpt); if (highlighted) break; } let target = highlighted || (mark.anchorId ? editor.querySelector(`[data-jp-bookmark-anchor="${mark.anchorId}"]`) : null); if (!target && mark.excerpt) target = [...editor.querySelectorAll('p,li,h1,h2,h3,div')].find(el => el.textContent.includes(mark.excerpt.slice(0, 50))); target = target || editor; target.scrollIntoView({ behavior: 'smooth', block: 'center' }); target.classList.add('jp-bookmark-focus'); setTimeout(() => target.classList.remove('jp-bookmark-focus'), 2600); }); toast(`Trang ${mark.page + 1}: ${mark.note}`); }
  function searchDocument(query) { documentSearchTerm = String(query || '').trim(); const results = $('[data-document-search-results]'); if (documentSearchTerm.length < 2) { results.hidden = true; results.innerHTML = ''; return; } const needle = documentSearchTerm.toLocaleLowerCase(); const matches = []; currentPages.forEach((html, page) => { const holder = document.createElement('div'); holder.innerHTML = html; const text = holder.textContent.replace(/\s+/g, ' ').trim(); let from = 0; while (matches.length < 80) { const index = text.toLocaleLowerCase().indexOf(needle, from); if (index < 0) break; matches.push({ page, excerpt: `${index > 45 ? '…' : ''}${text.slice(Math.max(0, index - 45), index + documentSearchTerm.length + 70)}${index + documentSearchTerm.length + 70 < text.length ? '…' : ''}` }); from = index + Math.max(1, documentSearchTerm.length); } }); results.hidden = false; results.innerHTML = matches.length ? `<small>${matches.length} kết quả trong ${new Set(matches.map(item => item.page)).size} trang</small>${matches.map(item => `<button type="button" data-search-page="${item.page}"><b>Trang ${item.page + 1}</b><span>${escapeHtml(item.excerpt)}</span></button>`).join('')}` : '<small>Không tìm thấy nội dung phù hợp.</small>'; }
  function highlightSearchText(query) { clearTemporaryHighlights(); const needle = String(query || '').toLocaleLowerCase(); if (!needle) return null; let first = null; const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT); const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode); nodes.forEach(node => { const value = node.nodeValue; const lower = value.toLocaleLowerCase(); let cursor = 0; let index = lower.indexOf(needle); if (index < 0) return; const fragment = document.createDocumentFragment(); while (index >= 0) { fragment.append(document.createTextNode(value.slice(cursor, index))); const mark = document.createElement('mark'); mark.dataset.tempSearch = 'true'; mark.textContent = value.slice(index, index + query.length); fragment.append(mark); first = first || mark; cursor = index + query.length; index = lower.indexOf(needle, cursor); } fragment.append(document.createTextNode(value.slice(cursor))); node.replaceWith(fragment); }); return first; }
  function goToPage(value) { const page = Number.parseInt(value, 10); if (!Number.isFinite(page) || page < 1 || page > currentPages.length) { toast(`Nhập số trang từ 1 đến ${currentPages.length}.`); return; } renderPage(page - 1); }
  function deleteDocument(id) {
    const doc = state.documents.find(item => item.id === id);
    if (!doc || !window.confirm(`Xóa tài liệu “${doc.title}” khỏi lịch sử?`)) return;
    state.documents = state.documents.filter(item => item.id !== id);
    if (currentDocumentId === id) currentDocumentId = null;
    persist(true);
    toast('Đã xóa tài liệu khỏi lịch sử. Các phiên học đã lưu vẫn được giữ.');
  }
  function remember() {
    if (!currentAnalysis) return;
    currentAnalysis.note = $('[data-study-note]').value.trim();
    saveAnalysisResult(currentAnalysis);
    (currentAnalysis.words || []).forEach((_, index) => saveWord(index, true));
    const analysis = state.analyses.find(item => item.sessionId === currentAnalysis.sessionId);
    if (analysis) analysis.note = currentAnalysis.note;
    const memory = state.memories.find(item => item.sessionId === currentAnalysis.sessionId);
    const memoryData = { id: memory?.id || Date.now(), ...currentAnalysis, nextReview: memory?.nextReview || new Date(Date.now() + 86400000).toISOString() };
    if (memory) Object.assign(memory, memoryData);
    else state.memories.unshift(memoryData);
    persist();
    hasUnsavedAnalysis = false;
    toast(currentAnalysis.note ? 'Đã lưu đoạn, ghi chú và toàn bộ từ mới.' : 'Đã lưu đoạn và toàn bộ từ mới để ôn.');
  }
  function renderMemoryNotes() {
    const needle = memorySearchTerm.toLocaleLowerCase();
    const sessions = (state.analyses || []).filter(item => {
      if (!needle) return true;
      const words = state.savedWords.filter(word => word.sessionId === item.sessionId);
      return [item.source, item.translation, item.translationVi, ...words.flatMap(word => [word.word, word.reading, word.romaji, word.meaningEn, word.meaningVi, word.onReading, word.kunReading])].some(value => String(value || '').toLocaleLowerCase().includes(needle));
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
  function renderMemory() { const needle = memorySearchTerm.toLocaleLowerCase(); const sessions = (state.analyses || []).filter(item => { if (!needle) return true; const words = state.savedWords.filter(word => word.sessionId === item.sessionId); return [item.source, item.translation, item.translationVi, ...words.flatMap(word => [word.word, word.reading, word.romaji, word.meaningEn, word.meaningVi, word.onReading, word.kunReading])].some(value => String(value || '').toLocaleLowerCase().includes(needle)); }); renderedMemorySessions = sessions; $('[data-memory-count]').textContent = state.savedWords.length; $('[data-memory-list]').innerHTML = sessions.length ? sessions.map((item, sessionPosition) => { const words = state.savedWords.filter(word => word.sessionId === item.sessionId); const pageLabel = item.documentId ? ` · TRANG ${(item.pageIndex || 0) + 1}` : ''; return `<article class="jp-memory-card" data-session-position="${sessionPosition}"><small>PHIÊN HỌC${pageLabel} · ${new Date(item.savedAt).toLocaleString('vi-VN')}</small><h3>${escapeHtml(item.source)}</h3><p><b>English:</b> ${escapeHtml(item.translation)}</p><p><b>Tiếng Việt:</b> ${escapeHtml(item.translationVi || 'Chưa có bản dịch tiếng Việt cho kết quả cũ.')}</p><div class="jp-session-actions"><button type="button" data-open-session> Mở lại đúng trang</button><button type="button" data-speak-session>▶ Đọc câu</button><button type="button" data-edit-session="${escapeHtml(item.sessionId)}">Sửa nghĩa</button><button type="button" data-delete-session="${escapeHtml(item.sessionId)}">Xóa phiên</button></div><div class="jp-session-words">${words.length ? words.map(word => { const index = state.savedWords.indexOf(word); return `<span><b>${escapeHtml(word.word)}</b><small>${escapeHtml(word.reading || '')} · ${escapeHtml(word.romaji || '')}</small><em>On ${escapeHtml(word.onReading || '—')} · Kun ${escapeHtml(word.kunReading || '—')}</em><i>${escapeHtml(word.meaningEn || '')}${word.meaningVi ? ` · ${escapeHtml(word.meaningVi)}` : ''}</i><button type="button" data-speak-saved-index="${index}">▶ Đọc từ</button><button type="button" data-edit-saved-index="${index}">Sửa</button><button type="button" data-delete-saved-index="${index}">Xóa</button></span>`; }).join('') : '<small>Chưa lưu từ nào trong phiên này.</small>'}</div></article>`; }).join('') : `<p>${needle ? 'Không tìm thấy nội dung đã lưu phù hợp.' : 'Chưa có phiên phân tích nào được lưu.'}</p>`; }
  function editSavedWord(index) { const word = state.savedWords[index]; if (!word) return; const value = window.prompt(`Sửa nghĩa tiếng Việt cho ${word.word}:`, word.meaningVi || ''); if (value === null) return; word.meaningVi = value.trim(); persist(); }
  function deleteSavedWord(index) { const word = state.savedWords[index]; if (!word || !window.confirm(`Xóa từ “${word.word}” khỏi danh sách đã lưu?`)) return; state.savedWords.splice(index, 1); persist(); toast('Đã xóa từ đã lưu.'); }
  function editSession(sessionId) { const item = state.analyses.find(entry => entry.sessionId === sessionId); if (!item) return; const value = window.prompt('Sửa bản dịch/ghi chú của đoạn:', item.translation || ''); if (value === null) return; item.translation = value.trim(); persist(); if (currentAnalysis?.sessionId === sessionId) { currentAnalysis.translation = item.translation; renderAnalysis(); } }
  function deleteSession(sessionId) { if (!window.confirm('Xóa phiên phân tích và các từ đã lưu trong phiên này?')) return; state.analyses = state.analyses.filter(item => item.sessionId !== sessionId); state.savedWords = state.savedWords.filter(item => item.sessionId !== sessionId); state.memories = state.memories.filter(item => item.sessionId !== sessionId); persist(); toast('Đã xóa phiên học.'); }
  function reopenSession(analysis) { if (!analysis) { toast('Không tìm thấy phiên học đã lưu.'); return; } const doc = state.documents.find(item => String(item.id) === String(analysis.documentId)); if (doc) { currentDocumentId = doc.id; currentPages = doc.pages || [doc.html || '<p></p>']; $('[data-document-title]').value = doc.title; renderPage(analysis.pageIndex || 0, false); } currentAnalysis = { ...analysis }; hasUnsavedAnalysis = false; selectedText = analysis.source || ''; setView(false); renderAnalysis(); toast(doc ? `Đã trở lại trang ${(analysis.pageIndex || 0) + 1}.` : 'Đã mở phiên học; chưa tìm thấy tài liệu gốc.'); }
  function setView(memory) {
    const readerView = $('[data-reader-view]');
    const memoryView = $('[data-memory-view]');
    const floatingToolbar = $('[data-floating-toolbar]');
    if (floatingToolbar) floatingToolbar.hidden = memory;

    if (memory) {
      readerScrollTop = readerView ? readerView.scrollTop : 0;
      if (readerView) readerView.hidden = true;
      $('[data-inspector]').hidden = true;
      $('[data-library]').hidden = true;
      if (memoryView) {
        memoryView.hidden = false;
        requestAnimationFrame(() => { memoryView.scrollTop = memoryScrollTop; });
      }
    } else {
      memoryScrollTop = memoryView ? memoryView.scrollTop : 0;
      if (memoryView) memoryView.hidden = true;
      if (readerView) {
        readerView.hidden = false;
        requestAnimationFrame(() => { readerView.scrollTop = readerScrollTop; });
      }
      $('[data-inspector]').hidden = false;
      $('[data-library]').hidden = false;
    }

    $$('[data-view]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.view === (memory ? 'memory' : 'reader'));
    });
  }
  $('[data-pdf-upload-open]')?.addEventListener('click', event => {
    event.preventDefault();
    setPdfAuthOpen(true);
  });
  $$('[data-pdf-auth-close], [data-pdf-auth-cancel]').forEach(button => {
    button.addEventListener('click', () => setPdfAuthOpen(false));
  });
  const pdfAuthConfirmButton = document.querySelector('[data-pdf-auth-confirm]');
  if (pdfAuthConfirmButton) {
    pdfAuthConfirmButton.addEventListener('click', confirmPdfAuth, false);
    pdfAuthConfirmButton.addEventListener('touchend', event => {
      event.preventDefault();
      confirmPdfAuth(event);
    }, false);
  }

  $('#jp-file').addEventListener('change', event => extractFile(event.target.files[0]));
  analyzeButton.addEventListener('click', analyzeSelection);
  document.addEventListener('selectionchange', updateSelection);
  editor.addEventListener('touchend', () => setTimeout(updateSelection, 0));
  $('[data-analyze-popover]').addEventListener('click', () => analyzeSelection());
  libraryToggle.addEventListener('click', () => setLibraryOpen(!root.classList.contains('is-library-open')));
  $$('[data-library-close]').forEach(button => button.addEventListener('click', () => setLibraryOpen(false)));
  $('[data-new-document]').addEventListener('click', () => {
    storeCurrentPage();
    currentDocumentId = null;
    currentPages = ['<p></p>'];
    currentPageIndex = 0;
    $('[data-document-title]').value = 'Tài liệu chưa đặt tên';
    renderPage(0, false);
    if (window.innerWidth <= 1100) setLibraryOpen(false);
    toast('Đã tạo tài liệu mới. Dán nội dung rồi lưu để thêm vào thư viện.');
  });
  $('[data-login-open]')?.addEventListener('click', () => { rememberLoginReturn(); setLoginOpen(true); });
  $$('[data-login-close]').forEach(button => button.addEventListener('click', () => setLoginOpen(false)));
  $('[data-google-login]')?.addEventListener('click', openGoogleLoginPopup);
  $('[data-analysis-login]')?.addEventListener('click', openGoogleLoginPopup);
  $('[data-reader-login]')?.addEventListener('submit', submitReaderLogin);
  $('[data-close-analysis]').addEventListener('click', () => { $('[data-analysis]').hidden = true; $('[data-inspector-empty]').hidden = false; updateShowAnalysisToggle(); });
  $('[data-show-analysis]').addEventListener('click', () => {
    if (!currentAnalysis) return;
    const analysisPanel = $('[data-analysis]');
    if (analysisPanel.hidden) { $('[data-inspector]').scrollTop = 0; renderAnalysis(); }
    else { analysisPanel.hidden = true; $('[data-inspector-empty]').hidden = false; updateShowAnalysisToggle(); }
  });
  $('[data-toggle-connection]').addEventListener('click', () => { const panel = $('[data-connection-panel]'); panel.hidden = !panel.hidden; });
  $('[data-close-analysis-connection]')?.addEventListener('click', () => { $('[data-analysis-connection]').hidden = true; if (!currentAnalysis) $('[data-inspector-empty]').hidden = false; });
  $('[data-retry-analysis]').addEventListener('click', analyzeSelection);
  $('[data-save-document]').addEventListener('click', saveDocument); $$('[data-remember]').forEach(button => button.addEventListener('click', remember));
  editor.addEventListener('input', () => { draftDirty = true; clearTimeout(cacheDraft.timer); cacheDraft.timer = setTimeout(cacheDraft, 350); });
  $('[data-document-title]').addEventListener('input', () => { draftDirty = true; clearTimeout(cacheDraft.timer); cacheDraft.timer = setTimeout(cacheDraft, 350); });
  $('[data-vocabulary]').addEventListener('click', event => { const saveButton = event.target.closest('[data-save-word]'); if (saveButton) saveWord(Number(saveButton.dataset.saveWord)); const speakButton = event.target.closest('[data-speak-word]'); if (speakButton) { const word = (currentAnalysis.words || [])[Number(speakButton.dataset.speakWord)]; speakJapanese(word?.reading || word?.word); } });
  $('[data-spelling-line]').addEventListener('click', event => { if (window.getSelection && String(window.getSelection()).length) return; const button = event.target.closest('[data-speak-token]'); if (!button) return; const token = (currentAnalysis?.tokens || [])[Number(button.dataset.speakToken)]; if (!token) return; const surface = token.surface || token[0] || ''; const word = (currentAnalysis?.words || []).find(item => (item.word || item[0]) === surface); speakJapanese(surface || token.reading); toast(`${surface} · EN: ${token.meaningEn || word?.meaningEn || word?.meaning || '—'} · VI: ${token.meaningVi || word?.meaningVi || '—'}`); });
  $('[data-speak]').addEventListener('click', () => speakJapanese(currentAnalysis?.source));
  $('[data-memory-list]').addEventListener('click', event => { const action = event.target.closest('button'); if (!action) return; event.preventDefault(); event.stopPropagation(); const card = action.closest('[data-session-position]'); const session = card ? renderedMemorySessions[Number(card.dataset.sessionPosition)] : null; if (action.hasAttribute('data-open-session')) { reopenSession(session); return; } if (action.hasAttribute('data-speak-session')) { if (session) speakJapanese(session.source); else toast('Không tìm thấy câu đã lưu.'); return; } if (action.hasAttribute('data-speak-saved-index')) { const word = state.savedWords[Number(action.dataset.speakSavedIndex)]; speakJapanese(word?.reading || word?.word); return; } if (action.hasAttribute('data-edit-saved-index')) { editSavedWord(Number(action.dataset.editSavedIndex)); return; } if (action.hasAttribute('data-delete-saved-index')) { deleteSavedWord(Number(action.dataset.deleteSavedIndex)); return; } if (action.hasAttribute('data-edit-session')) { editSession(action.dataset.editSession); return; } if (action.hasAttribute('data-delete-session')) deleteSession(action.dataset.deleteSession); });
  $('[data-font]').addEventListener('change', event => { editor.classList.remove('font-sans','font-rounded'); if (event.target.value !== 'serif') editor.classList.add(`font-${event.target.value}`); });
  $$('[data-command]').forEach(button => button.addEventListener('click', () => document.execCommand(button.dataset.command)));
  $$('[data-highlight]').forEach(button => button.addEventListener('click', () => { if (savedRange) { const selection = getSelection(); selection.removeAllRanges(); selection.addRange(savedRange); } document.execCommand('hiliteColor', false, button.dataset.highlight); }));
  $('[data-document-list]').addEventListener('click', event => { const removeBookmark = event.target.closest('[data-delete-bookmark]'); if (removeBookmark) { const doc = state.documents.find(item => String(item.id) === String(removeBookmark.dataset.bookmarkDocument)); if (doc) deleteBookmark(doc.id, removeBookmark.dataset.deleteBookmark); return; } const bookmark = event.target.closest('[data-bookmark-id]'); if (bookmark) { const doc = state.documents.find(item => String(item.id) === String(bookmark.dataset.bookmarkDocument)); if (doc) openBookmark(doc.id, bookmark.dataset.bookmarkId); if (window.innerWidth <= 1100) setLibraryOpen(false); return; } const remove = event.target.closest('[data-delete-document]'); if (remove) { const doc = state.documents.find(item => String(item.id) === String(remove.dataset.deleteDocument)); if (doc) deleteDocument(doc.id); return; } const button = event.target.closest('[data-document-id]'); if (!button) return; const doc = state.documents.find(item => String(item.id) === String(button.dataset.documentId)); if (doc) { currentDocumentId = doc.id; currentPages = doc.pages || [doc.html || '<p></p>']; $('[data-document-title]').value = doc.title; renderPage(doc.currentPage || 0, false); if (window.innerWidth <= 1100) setLibraryOpen(false); } });
  $('[data-document-search]').addEventListener('input', event => searchDocument(event.currentTarget.value)); $('[data-document-search]').addEventListener('keydown', event => { if (event.key === 'Enter') searchDocument(event.currentTarget.value); }); $('[data-document-search-results]').addEventListener('click', event => { const result = event.target.closest('[data-search-page]'); if (!result) return; renderPage(Number(result.dataset.searchPage)); requestAnimationFrame(() => { const target = highlightSearchText(documentSearchTerm); target?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }); });
  $('[data-memory-search]').addEventListener('input', event => { memorySearchTerm = event.currentTarget.value.trim(); renderMemory(); renderMemoryNotes(); });
  $('[data-study-note]').addEventListener('input', event => { if (currentAnalysis) currentAnalysis.note = event.currentTarget.value; $('[data-note-count]').textContent = String(event.currentTarget.value.length); });
  $$('[data-page-prev]').forEach(button => button.addEventListener('click', () => renderPage(currentPageIndex - 1))); $$('[data-page-next]').forEach(button => button.addEventListener('click', () => renderPage(currentPageIndex + 1)));
  $$('[data-page-label]').forEach(button => button.addEventListener('click', () => { const value = window.prompt(`Đến trang số (1–${currentPages.length}):`, String(currentPageIndex + 1)); if (value !== null) goToPage(value); }));
  $$('[data-page-bookmark]').forEach(button => button.addEventListener('click', () => { const note = window.prompt('Ghi chú để nhớ đoạn này:', ''); if (note !== null) addBookmark(note); }));
  $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view === 'memory'))); $('[data-back-reader]').addEventListener('click', () => setView(false));
  document.addEventListener('touchmove', event => {
    if (analysisInProgress) event.preventDefault();
  }, { passive: false });

  document.addEventListener('click', event => {
    if (!analysisInProgress) return;
    const modal = $('[data-analysis-wait]');
    if (modal && !modal.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); analyzeSelection(); } if (event.key === 'Escape' && root.classList.contains('is-library-open')) setLibraryOpen(false); if (event.key === 'Escape') setLoginOpen(false); if (event.key === 'Escape' && !$('[data-analysis]').hidden) { $('[data-analysis]').hidden = true; $('[data-inspector-empty]').hidden = false; updateShowAnalysisToggle(); } });
  $('[data-reader-logout]')?.addEventListener('click', event => { event.preventDefault(); logoutReaderStayHere(event); });
  document.addEventListener('click', event => {
    const googleButton = event.target.closest('[data-google-login-inline]');
    if (!googleButton) return;
    event.preventDefault();
    openGoogleLoginPopup();
  });

  window.addEventListener('pageshow', refreshQuotaOnReturn);
  window.addEventListener('focus', refreshQuotaOnReturn);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cacheDraft();
    else { refreshQuotaOnReturn(); triggerInitialStateSync(); }
  });
  window.addEventListener('beforeunload', cacheDraft);

  analyzeButton.classList.remove('is-loading');
  const initialAnalyzeSpinner = analyzeButton.querySelector('[data-analyze-spinner]');
  if (initialAnalyzeSpinner) initialAnalyzeSpinner.hidden = true;

  applyDisplaySettings(loadDisplaySettings());
  renderDailyUsage();
  refreshDailyUsage();
  try {
    const rememberedOcrUser = sessionStorage.getItem('anhmedia.jp-reader.ocr-user') || '';
    const rememberedOcrToken = sessionStorage.getItem('anhmedia.jp-reader.ocr-token') || '';
    if ($('[data-user-id]')) $('[data-user-id]').value = rememberedOcrUser;
    if ($('[data-token-id]')) $('[data-token-id]').value = rememberedOcrToken;
  } catch (_) {}

  renderDocuments();
  renderMemory();
  renderMemoryNotes();
  if (restoreDraft()) renderPage(currentPageIndex, false);
  else renderPage(0, false);
  triggerInitialStateSync();
  updateShowAnalysisToggle();
})();
