(function () { ‘use strict’;

  var editor = document.getElementById(‘editor’); var statusEl =
      document.getElementById(‘status’); var storageKey =
‘anhmedia.jp-reader.ipad4.v2’; var documentKey = storageKey +
‘.documents’; var savedKey = storageKey + ‘.results’; var currentText =
’’; var currentResult = null; var currentPages = [’’]; var
      currentPageIndex = 0; var currentDocumentId = null;

  function byId(id) { return document.getElementById(id); } function
  on(el, name, fn) { if (el) el.addEventListener(name, fn, false); }
  function trim(value) { return String(value || ’‘).replace(/^+|+$/g,’‘);
  } function escapeHtml(value) { var div = document.createElement(’div’);
    div.appendChild(document.createTextNode(value || ’‘)); return
    div.innerHTML; } function allByClass(name) { if
  (document.getElementsByClassName) return
    document.getElementsByClassName(name); var nodes =
        document.getElementsByTagName(’*‘), out = [], i; for (i = 0; i <
    nodes.length; i += 1) { if ((’ ’ + nodes[i].className + ’ ‘).indexOf(’
    ’ + name + ’ ’) >= 0) out.push(nodes[i]); } return out; } function
  setStatus(text) { if (statusEl) statusEl.innerHTML = escapeHtml(text); }

  function request(method, url, body, callback) { var xhr = new
  XMLHttpRequest(); xhr.open(method, url, true);
    xhr.setRequestHeader(‘Accept’, ‘application/json’); if (body !== null)
      xhr.setRequestHeader(‘Content-Type’, ‘application/json’);
    xhr.onreadystatechange = function () { if (xhr.readyState !== 4) return;
      var data = null; try { data = JSON.parse(xhr.responseText || ‘{}’); }
      catch (ignore) {} callback(xhr.status, data, xhr.responseText); };
    xhr.send(body === null ? null : JSON.stringify(body)); }

  var dailyLimitEl = byId(‘dailyLimit’); var dailyRemainingEl =
      byId(‘dailyRemaining’); var dailyAnalysisLimit = dailyLimitEl ?
      (parseInt(dailyLimitEl.innerHTML, 10) || 0) : 0; var serverRemaining =
      null; if (dailyRemainingEl) { var initialRemaining =
      parseInt(dailyRemainingEl.innerHTML, 10); serverRemaining =
      isNaN(initialRemaining) ? null : initialRemaining; } function
  remainingAnalyses() { return serverRemaining === null ?
      dailyAnalysisLimit : serverRemaining; } function renderDailyUsage() { if
  (dailyRemainingEl) dailyRemainingEl.innerHTML =
        String(remainingAnalyses()); if (dailyLimitEl) dailyLimitEl.innerHTML =
      String(dailyAnalysisLimit); if (byId(‘analyze’))
    byId(‘analyze’).disabled = remainingAnalyses() === 0; } function
  recordAnalysis() { if (serverRemaining !== null) { serverRemaining =
      Math.max(0, serverRemaining - 1); renderDailyUsage(); } } function
  refreshDailyUsage() { request(‘GET’, ‘/api/japanese-learning/usage’,
    null, function (code, data) { if (code !== 200 || !data) return;
      dailyAnalysisLimit = Math.max(0, Number(data.limit) || 0);
      serverRemaining = Math.max(0, Number(data.remaining) || 0);
      renderDailyUsage(); }); }

  function selectedText() { var selection = window.getSelection ?
      window.getSelection() : null; return selection ?
      trim(selection.toString()) : ’’; }

  function speak(text) { if (!text || !window.speechSynthesis ||
      !window.SpeechSynthesisUtterance) { setStatus(‘Thiết bị này không hỗ trợ
    đọc giọng nói.’); return; } window.speechSynthesis.cancel(); var
      utterance = new SpeechSynthesisUtterance(text); utterance.lang =
‘ja-JP’; utterance.rate = 0.78; window.speechSynthesis.speak(utterance);
  }

  function loadJson(key, fallback) { try { var value =
      JSON.parse(localStorage.getItem(key) || ’‘); return value || fallback; }
  catch (ignore) { return fallback; } } function saveJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (ignore)
    { setStatus(’Không thể lưu thêm dữ liệu trên thiết bị này.’); } }

  function normalizeTextToPages(text) { var raw = trim(text); if (!raw)
    return [’’]; var hard = raw.split(//); if (hard.length > 1) { var
      cleaned = [], h; for (h = 0; h < hard.length; h += 1) if (trim(hard[h]))
    cleaned.push(trim(hard[h])); return cleaned.length ? cleaned : [’’]; }

  var pages = [], page = '', lines = raw.split(/\n+/), i, line;
  for (i = 0; i < lines.length; i += 1) {
    line = trim(lines[i]);
    if (!line) continue;
    if (page && page.length + line.length + 1 > 1800) {
      pages.push(page);
      page = '';
    }
    page += (page ? '\n' : '') + line;
  }

  if (!pages.length && page.length > 1800) {
    pages = [];
    for (i = 0; i < page.length; i += 1800) pages.push(page.substring(i, i + 1800));
    return pages;
  }
  if (page) pages.push(page);
  return pages.length ? pages : [''];

}

function storeCurrentPage() { if (!currentPages.length) currentPages =
    [’’]; currentPages[currentPageIndex] = editor.innerText !== undefined ?
    editor.innerText : editor.textContent; }

function renderPage(index, saveCurrent) { if (saveCurrent !== false)
  storeCurrentPage(); if (index < 0) index = 0; if (index >=
    currentPages.length) index = currentPages.length - 1; currentPageIndex =
    index; editor.innerHTML = escapeHtml(currentPages[index] ||
’‘).replace(//g,’’); updatePageControls(); renderBookmarks(); }

      function updatePageControls() { var labels = allByClass(‘pageLabel’);
        var inputs = allByClass(‘pageInput’); var prevs =
            allByClass(‘pagePrev’); var nexts = allByClass(‘pageNext’); var i, label
            = ‘Trang’ + (currentPageIndex + 1) + ’ / ’ + currentPages.length;

        for (i = 0; i < labels.length; i += 1) labels[i].innerHTML = label;
        for (i = 0; i < inputs.length; i += 1) {
          inputs[i].value = currentPageIndex + 1;
          inputs[i].max = currentPages.length;
        }
        for (i = 0; i < prevs.length; i += 1) prevs[i].disabled = currentPageIndex <= 0;
        for (i = 0; i < nexts.length; i += 1) nexts[i].disabled = currentPageIndex >= currentPages.length - 1;

      }

  function goToPage(value) { var page = parseInt(value, 10); if
  (isNaN(page)) return; renderPage(page - 1, true); window.scrollTo(0, 0);
  }

  function splitPages() { var text = editor.innerText !== undefined ?
      editor.innerText : editor.textContent; currentPages =
      normalizeTextToPages(text); currentPageIndex = 0; renderPage(0, false);
    setStatus(‘Đã chia nội dung thành’ + currentPages.length + ’ trang.’); }

  function getDocuments() { return loadJson(documentKey, []); } function
  setDocuments(items) { saveJson(documentKey, items); }

  function saveDocument() { storeCurrentPage(); var docs = getDocuments();
    var title = trim(byId(‘documentTitle’).value) || ‘Tài liệu chưa đặt
    tên’; var id = currentDocumentId || String(new Date().getTime()); var
        old = null, i, next = [];

    for (i = 0; i < docs.length; i += 1) {
      if (String(docs[i].id) === String(id)) old = docs[i];
      else next.push(docs[i]);
    }

    var item = {
      id: id,
      title: title,
      pages: currentPages,
      currentPage: currentPageIndex,
      bookmarks: old && old.bookmarks ? old.bookmarks : [],
      updatedAt: new Date().getTime()
    };

    next.unshift(item);
    if (next.length > 12) next.length = 12;
    setDocuments(next);
    currentDocumentId = id;
    renderDocuments();
    renderBookmarks();
    setStatus('Đã lưu tài liệu: ' + title + '.');

  }

  function newDocument() { if (!window.confirm(‘Tạo tài liệu mới? Nội dung
    chưa lưu sẽ bị thay thế.’)) return; currentDocumentId = null;
    currentPages = [’’]; currentPageIndex = 0; byId(‘documentTitle’).value =
‘Tài liệu tiếng Nhật’; editor.innerHTML = ’‘; updatePageControls();
    renderBookmarks(); setStatus(’Đã tạo tài liệu mới.’); }

  function openDocument(id) { var docs = getDocuments(), i, item = null;
    for (i = 0; i < docs.length; i += 1) if (String(docs[i].id) ===
        String(id)) item = docs[i]; if (!item) return; currentDocumentId =
        item.id; currentPages = item.pages && item.pages.length ? item.pages :
        [’’]; currentPageIndex = item.currentPage || 0;
    byId(‘documentTitle’).value = item.title || ‘Tài liệu tiếng Nhật’;
    renderPage(currentPageIndex, false); renderBookmarks(); closeLibrary();
    setStatus(‘Đã mở’ + item.title + ‘.’); }

  function deleteDocument(id) { if (!window.confirm(‘Xóa tài liệu này?’))
    return; var docs = getDocuments(), next = [], i; for (i = 0; i <
    docs.length; i += 1) if (String(docs[i].id) !== String(id))
      next.push(docs[i]); setDocuments(next); if (String(currentDocumentId)
        === String(id)) currentDocumentId = null; renderDocuments();
    renderBookmarks(); }

  function renderDocuments() { var docs = getDocuments(), box =
      byId(‘documentList’), html = ’‘, i; for (i = 0; i < docs.length; i += 1)
  { html +=’

  ’ + escapeHtml(docs[i].title || ‘Tài liệu’) + ‘’ + (docs[i].pages ?
      docs[i].pages.length : 1) + ’ trang
’ + ’×

  ‘; } box.innerHTML = html ||’Chưa có tài liệu đã lưu.’; }

  function currentDocumentObject() { var docs = getDocuments(), i; for (i
                                                                            = 0; i < docs.length; i += 1) if (String(docs[i].id) ===
      String(currentDocumentId)) return docs[i]; return null; }

  function addBookmark() { if (!currentDocumentId) { saveDocument(); } var
      docs = getDocuments(), i, doc = null; for (i = 0; i < docs.length; i
      += 1) if (String(docs[i].id) === String(currentDocumentId)) doc =
      docs[i]; if (!doc) return; if (!doc.bookmarks) doc.bookmarks = [];

    var note = trim(byId('bookmarkNote').value);
    var pageText = trim(currentPages[currentPageIndex] || '');
    doc.bookmarks.unshift({
      id: String(new Date().getTime()),
      page: currentPageIndex,
      note: note || 'Dấu trang',
      excerpt: pageText.substring(0, 90)
    });
    byId('bookmarkNote').value = '';
    setDocuments(docs);
    renderBookmarks();
    setStatus('Đã lưu dấu trang ' + (currentPageIndex + 1) + '.');

  }

  function renderBookmarks() { var doc = currentDocumentObject(), box =
      byId(‘bookmarkList’), html = ’‘, i, marks; if (!doc || !doc.bookmarks ||
      !doc.bookmarks.length) { box.innerHTML =’Chưa có dấu trang trong tài
    liệu này.‘; return; } marks = doc.bookmarks; for (i = 0; i <
  marks.length; i += 1) { html +=’’ + ‘Trang’ + (marks[i].page + 1) + ’ —
  ’ + escapeHtml(marks[i].note || ‘Dấu trang’) + ‘’ + ‘’ +
        escapeHtml(marks[i].excerpt || ’‘) +’’; } box.innerHTML = html; }

  function searchDocument() { storeCurrentPage(); var q =
      trim(byId(‘documentSearch’).value).toLowerCase(); var box =
      byId(‘searchResults’), html = ’‘, i, text, pos, count = 0; if (q.length
      < 2) { box.innerHTML =’’; return; }

    for (i = 0; i < currentPages.length && count < 30; i += 1) {
      text = String(currentPages[i] || '');
      pos = text.toLowerCase().indexOf(q);
      if (pos >= 0) {
        html += '<button type="button" data-search-page="' + i + '"><b>Trang ' + (i + 1) + '</b><small>' +
            escapeHtml(text.substring(Math.max(0, pos - 35), Math.min(text.length, pos + q.length + 70))) +
            '</small></button>';
        count += 1;
      }
    }
    box.innerHTML = html || '<small>Không tìm thấy.</small>';

  }

  function updateToggleResultButton() { var btn = byId(‘toggleResult’); if
  (!btn) return; var visible = !!currentResult &&
      byId(‘analysisResult’).style.display !== ‘none’; btn.innerHTML = visible
      ? ‘Ẩn kết quả’ : ‘Hiện kết quả’; btn.disabled = !currentResult; }
  function showResultPanel() { if (!currentResult) return;
    byId(‘emptyResult’).style.display = ‘none’;
    byId(‘analysisResult’).style.display = ‘block’;
    updateToggleResultButton(); } function hideResultPanel() {
    byId(‘analysisResult’).style.display = ‘none’;
    byId(‘emptyResult’).style.display = ‘block’; updateToggleResultButton();
  } function render(result) { currentResult = result;
    byId(‘ruby’).innerHTML = result.ruby || escapeHtml(result.source || ’‘);
    byId(’hiragana’).innerHTML = escapeHtml(result.hira || result.hiragana
        || ’‘); byId(’translationVi’).innerHTML =
        escapeHtml(result.translationVi || ’‘); byId(’translation’).innerHTML =
        escapeHtml(result.translation || ’‘); var tokens = result.tokens || [],
        html =’‘, i, t; for (i = 0; i < tokens.length; i += 1) { t = tokens[i]
        || {}; html +=’’ + ‘’ + escapeHtml(t.surface || ’‘) +’’ +
        escapeHtml(t.reading || ’‘) + (t.romaji ?’ · ’ + escapeHtml(t.romaji) :
    ’‘) +’‘; } byId(’tokens’).innerHTML = html; showResultPanel();
    setStatus(‘Đã phân tích xong đoạn được chọn.’); } function
  friendlyErrorMessage(code, data, raw) { if (data && data.error) return
    data.error; if (code === 503) return ‘OpenAI tạm thời chưa phản hồi. Vui
    lòng thử lại sau.’; if (code === 429) return ‘Bạn đã dùng hết’ +
        dailyAnalysisLimit + ’ lượt phân tích hôm nay.’; if (raw &&
        /^</.test(raw)) return ‘Máy chủ gặp lỗi nội bộ (HTTP’ + code + ‘).’;
    return ‘Không thể kết nối máy chủ phân tích.’; } function
  performAnalyzeRequest(text, attempt, maxAttempts, done) {
    request(‘POST’, ‘/api/japanese-learning/analyze’, { text: text, mode:
    ‘selection’ }, function (code, data, raw) { var retryable = code === 0
        || code >= 500; if (retryable && attempt < maxAttempts) {
      window.setTimeout(function () { performAnalyzeRequest(text, attempt + 1,
          maxAttempts, done); }, 500 * attempt); return; } done(code, data, raw);
    }); } function analyze() { var text = selectedText(); if (!text) {
    setStatus(‘Hãy bôi chọn một câu hoặc đoạn ngắn trước.’); return; } if
  (text.length > 500) { setStatus(‘Đoạn quá dài. Chỉ chọn tối đa 500 ký
    tự.’); return; } if (remainingAnalyses() === 0) { setStatus(‘Bạn đã dùng
    hết lượt phân tích hôm nay.’); return; }

    currentText = text;
    setStatus('Đang phân tích...');
    byId('analyze').disabled = true;
    performAnalyzeRequest(text, 1, 3, function (code, data, raw) {
      if (code === 200 && data) {
        recordAnalysis();
        render(data);
        byId('analyze').disabled = remainingAnalyses() === 0;
        refreshDailyUsage();
        return;
      }
      byId('analyze').disabled = false;
      if (code === 401) {
        setStatus('Bạn cần đăng nhập trước khi phân tích.');
        openLogin();
        refreshDailyUsage();
        return;
      }
      setStatus(friendlyErrorMessage(code, data, raw));
      refreshDailyUsage();
    });

  }

  function loadSaved() { return loadJson(savedKey, []); } function
  showSaved() { var saved = loadSaved(), html = ’‘, i; for (i = 0; i <
  saved.length; i += 1) { html +=’
  ’ + escapeHtml(saved[i].source || ’‘) +’
  ’ + escapeHtml(saved[i].translationVi || ’‘) +’
  ’ + ‘▶ Đọc lại’ + ’Xóa
‘; } byId(’savedList’).innerHTML = html || ’
Chưa có kết quả đã lưu.
‘; } function saveResult() { if (!currentResult) return; var saved =
      loadSaved(); saved.unshift(currentResult); if (saved.length > 30)
    saved.length = 30; saveJson(savedKey, saved); showSaved(); setStatus(’Đã
    lưu kết quả trên iPad này.’); }

  function openLibrary() { byId(‘library’).style.display = ‘block’; }
  function closeLibrary() { byId(‘library’).style.display = ‘none’; }
  function openLogin() { if (byId(‘loginModal’))
    byId(‘loginModal’).style.display = ‘block’; } function closeLogin() { if
  (byId(‘loginModal’)) byId(‘loginModal’).style.display = ‘none’; }

  function login(event) { event.preventDefault(); var form =
      byId(‘loginForm’), email = trim(form.elements.email.value), pass =
      form.elements.password.value, error = byId(‘loginError’); if (!email ||
      !pass) { error.innerHTML = ‘Vui lòng nhập tài khoản và mật khẩu.’;
    error.style.display = ‘block’; return; } byId(‘loginSubmit’).disabled =
      true; byId(‘loginSubmit’).innerHTML = ‘Đang đăng nhập…’;
    error.style.display = ‘none’;

    request('POST', '/api/login-act', {
      id: 0, firstName: '', lastName: '', user: email, pass: pass,
      address: '', district: '', city: '', province: '', email: email,
      phoneNumber: '', selectedAddress: '000', zipcode: '000', note: '000'
    }, function (code, user) {
      if (code === 200 && user && Number(user.id) > 0) {
        if (user.pass === 'mfa') window.location.href = '/dang-nhap';
        else window.location.reload();
        return;
      }
      error.innerHTML = 'Sai tài khoản hoặc mật khẩu.';
      error.style.display = 'block';
      byId('loginSubmit').disabled = false;
      byId('loginSubmit').innerHTML = 'Đăng nhập';
    });

  }

  function bindPageControls() { var prevs = allByClass(‘pagePrev’), nexts
      = allByClass(‘pageNext’), gos = allByClass(‘pageGo’), inputs =
      allByClass(‘pageInput’), i; for (i = 0; i < prevs.length; i += 1)
    on(prevs[i], ‘click’, function () { renderPage(currentPageIndex - 1,
      true); }); for (i = 0; i < nexts.length; i += 1) on(nexts[i], ‘click’,
    function () { renderPage(currentPageIndex + 1, true); }); for (i = 0; i
    < gos.length; i += 1) on(gos[i], ‘click’, function () { var parent =
        this.parentNode, input = null, j, candidates =
        parent.getElementsByTagName(‘input’); for (j = 0; j < candidates.length;
                                                   j += 1) if ((’ ’ + candidates[j].className + ’ ‘).indexOf(’ pageInput
‘) >= 0) input = candidates[j]; if (input) goToPage(input.value); });
    for (i = 0; i < inputs.length; i += 1) on(inputs[i], ’keydown’, function
    (event) { var code = event.keyCode || event.which; if (code === 13)
      goToPage(this.value); }); }

  on(byId(‘analyze’), ‘click’, analyze); on(byId(‘speakSelection’),
‘click’, function () { var text = selectedText() || currentText; if
  (!text) setStatus(‘Hãy chọn đoạn cần đọc.’); else speak(text); });
  on(byId(‘speakResult’), ‘click’, function () { speak(currentResult ?
      currentResult.source : ’‘); }); on(byId(’saveResult’), ‘click’,
  saveResult); on(byId(‘toggleResult’), ‘click’, function () { if
  (!currentResult) return; if (byId(‘analysisResult’).style.display ===
‘none’) showResultPanel(); else hideResultPanel(); });
  on(byId(‘closeResult’), ‘click’, hideResultPanel);

  on(byId(‘splitPages’), ‘click’, splitPages); on(byId(‘saveDocument’),
‘click’, saveDocument); on(byId(‘newDocument’), ‘click’, newDocument);
  on(byId(‘addBookmark’), ‘click’, addBookmark);
  on(byId(‘documentSearch’), ‘keyup’, searchDocument);

  on(byId(‘libraryToggle’), ‘click’, openLibrary);
  on(byId(‘libraryClose’), ‘click’, closeLibrary);

  on(byId(‘documentList’), ‘click’, function (event) { var target =
      event.target; while (target && target !== this &&
  !target.getAttribute(‘data-doc’) &&
    !target.getAttribute(‘data-delete-doc’)) target = target.parentNode; if
    (!target || target === this) return; if
    (target.getAttribute(‘data-doc’))
    openDocument(target.getAttribute(‘data-doc’)); if
    (target.getAttribute(‘data-delete-doc’))
    deleteDocument(target.getAttribute(‘data-delete-doc’)); });

  on(byId(‘bookmarkList’), ‘click’, function (event) { var target =
      event.target; while (target && target !== this &&
  target.getAttribute(‘data-bookmark-page’) === null) target =
      target.parentNode; if (target && target !== this) {
    renderPage(parseInt(target.getAttribute(‘data-bookmark-page’), 10),
    true); closeLibrary(); } });

  on(byId(‘searchResults’), ‘click’, function (event) { var target =
      event.target; while (target && target !== this &&
  target.getAttribute(‘data-search-page’) === null) target =
      target.parentNode; if (target && target !== this) {
    renderPage(parseInt(target.getAttribute(‘data-search-page’), 10), true);
    closeLibrary(); } });

  on(byId(‘clearText’), ‘click’, function () { if (window.confirm(‘Xóa nội
    dung đang đọc?’)) { editor.innerHTML = ’’; currentPages = [’’];
      currentPageIndex = 0; updatePageControls(); } });

  on(byId(‘textSize’), ‘click’, function () { document.body.className =
      document.body.className === ‘large’ ? ’’ : ‘large’; });

  on(byId(‘loginOpen’), ‘click’, openLogin); on(byId(‘loginClose’),
‘click’, closeLogin); on(byId(‘loginShade’), ‘click’, closeLogin);
  on(byId(‘loginForm’), ‘submit’, login);

  on(byId(‘homeLink’), ‘click’, function (event) { if
  (!window.confirm(‘Bạn có chắc muốn trở về trang chủ?’))
    event.preventDefault(); });

  on(byId(‘tokens’), ‘click’, function (event) { var target =
      event.target; while (target && target !== this &&
  !target.getAttribute(‘data-reading’)) target = target.parentNode; if
  (target && target.getAttribute(‘data-reading’))
    speak(target.getAttribute(‘data-reading’)); });

  on(byId(‘savedList’), ‘click’, function (event) { var target =
      event.target, saved = loadSaved(), index; if
  (target.getAttribute(‘data-saved’) !== null) { index =
      Number(target.getAttribute(‘data-saved’)); if (saved[index])
    speak(saved[index].source); } if (target.getAttribute(‘data-remove’) !==
    null) { index = Number(target.getAttribute(‘data-remove’));
      saved.splice(index, 1); saveJson(savedKey, saved); showSaved(); } });

  on(document, ‘keydown’, function (event) { var code = event.keyCode ||
      event.which; if (code === 27) { hideResultPanel(); closeLibrary();
    closeLogin(); } });

  currentPages = [trim(editor.innerText !== undefined ? editor.innerText :
      editor.textContent)]; bindPageControls(); renderDocuments();
  renderBookmarks(); showSaved(); renderDailyUsage(); refreshDailyUsage();
  updatePageControls(); updateToggleResultButton(); }());