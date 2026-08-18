(function () {
  'use strict';
  var editor = document.getElementById('editor');
  var status = document.getElementById('status');
  var currentText = '';
  var currentResult = null;
  var storageKey = 'anhmedia.jp-reader.ipad4.v1';

  function byId(id) { return document.getElementById(id); }
  function on(el, name, fn) { if (el) el.addEventListener(name, fn, false); }
  function escapeHtml(value) { var div = document.createElement('div'); div.appendChild(document.createTextNode(value || '')); return div.innerHTML; }

  function request(method, url, body, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true); xhr.setRequestHeader('Accept', 'application/json');
    if (body !== null) xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      var data = null; try { data = JSON.parse(xhr.responseText || '{}'); } catch (ignore) {}
      callback(xhr.status, data, xhr.responseText);
    };
    xhr.send(body === null ? null : JSON.stringify(body));
  }

  function normalizeResourceUrl(url) {
    var value = String(url || '').replace(/^\s+|\s+$/g, '');
    var match;

    if (!value) return '';

    /*
     * Convert common Google Drive share links to a direct-download URL.
     * Example:
     * https://drive.google.com/file/d/FILE_ID/view?usp=sharing
     */
    match = value.match(/^https?:\/\/drive\.google\.com\/file\/d\/([^\/?#]+)/i);
    if (match && match[1]) {
      return 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(match[1]);
    }

    match = value.match(/^https?:\/\/drive\.google\.com\/open\?[^#]*[?&]id=([^&#]+)/i);
    if (match && match[1]) {
      return 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(match[1]);
    }

    return value;
  }

  function requestExtractFromUrl(resourceUrl, callback) {
    var userId = byId('extractUserId') ? String(byId('extractUserId').value || '').replace(/^\s+|\s+$/g, '') : '';
    var token = byId('extractToken') ? String(byId('extractToken').value || '').replace(/^\s+|\s+$/g, '') : '';
    var payload = {
      resourceUrl: resourceUrl,
      url: resourceUrl,
      language: 'jpn'
    };

    if (userId) payload.userId = userId;
    if (token) payload.tokenId = token;

    /*
     * Server endpoint required:
     * POST /api/extract-text/url
     * JSON: { resourceUrl, language, userId?, tokenId? }
     *
     * The server downloads the public URL. This avoids old iPad Safari CORS,
     * TLS and large-file limitations.
     */
    request('POST', '/api/extract-text/url?_=' + new Date().getTime(), payload, callback);
  }

  function extractTextFromResponse(data, raw) {
    if (data) {
      if (typeof data.text === 'string') return data.text;
      if (typeof data.content === 'string') return data.content;
      if (typeof data.result === 'string') return data.result;
      if (data.data && typeof data.data.text === 'string') return data.data.text;
    }
    if (raw && !/^\s*</.test(raw)) return raw;
    return '';
  }

  function handlePdfUpload() {
    var input = byId('resourceUrl');
    var progress = byId('uploadProgress');
    var resourceUrl = normalizeResourceUrl(input ? input.value : '');

    if (!resourceUrl || !/^https?:\/\//i.test(resourceUrl)) {
      status.innerHTML = 'Hãy dán URL công khai bắt đầu bằng http:// hoặc https://.';
      return;
    }

    progress.style.display = 'block';
    progress.innerHTML = 'Đang tải tài nguyên từ URL và trích xuất văn bản...';
    byId('uploadPdf').disabled = true;

    requestExtractFromUrl(resourceUrl, function (code, data, raw) {
      var text;

      byId('uploadPdf').disabled = false;

      if (code !== 200 || (data && data.status && data.status !== 'success')) {
        progress.style.display = 'none';
        if (code === 401 || code === 403) {
          status.innerHTML = 'Không có quyền đọc URL hoặc token trích xuất chưa đúng.';
        } else {
          status.innerHTML = 'Không thể đọc tài nguyên từ URL. HTTP ' + code + '.';
        }
        return;
      }

      text = extractTextFromResponse(data, raw);
      text = String(text || '').replace(/^\s+|\s+$/g, '');

      if (!text) {
        progress.style.display = 'none';
        status.innerHTML = 'Máy chủ đã tải URL nhưng không tìm thấy văn bản.';
        return;
      }

      editor.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
      progress.innerHTML = 'Đã tải và trích xuất văn bản.';
      window.setTimeout(function () { progress.style.display = 'none'; }, 1600);
      status.innerHTML = 'Đã đọc tài nguyên. Bôi chọn một câu rồi nhấn Phân tích.';
    });
  }

  function render(result) {
    currentResult = result;
    byId('ruby').innerHTML = result.ruby || escapeHtml(result.source || ''); byId('hiragana').innerHTML = escapeHtml(result.hira || '');
    byId('translationVi').innerHTML = escapeHtml(result.translationVi || ''); byId('translation').innerHTML = escapeHtml(result.translation || '');
    var tokens = result.tokens || []; var html = ''; var i;
    for (i = 0; i < tokens.length; i += 1) html += '<button class="token" type="button" data-reading="' + escapeHtml(tokens[i].reading || tokens[i].surface) + '"><b>' + escapeHtml(tokens[i].surface) + '</b><small>' + escapeHtml(tokens[i].reading || '') + ' · ' + escapeHtml(tokens[i].romaji || '') + '</small></button>';
    byId('tokens').innerHTML = html;

    var words = result.words || result.vocabulary || [];
    var wordHtml = '', w, word, reading, romaji, meaningEn, meaningVi, onReading, kunReading;
    for (w = 0; w < words.length; w += 1) {
      word = words[w] || {};
      reading = word.reading || '';
      romaji = word.romaji || '';
      meaningEn = word.meaningEn || word.meaning || '';
      meaningVi = word.meaningVi || '';
      onReading = word.onReading || '';
      kunReading = word.kunReading || '';

      wordHtml += '<div class="word-card">' +
          '<b>' + escapeHtml(word.word || '') + '</b>' +
          '<small>' + escapeHtml(reading) + (romaji ? ' · ' + escapeHtml(romaji) : '') + '</small>' +
          (onReading || kunReading ? '<em>On ' + escapeHtml(onReading || '—') + ' · Kun ' + escapeHtml(kunReading || '—') + '</em>' : '') +
          (meaningEn ? '<em>EN: ' + escapeHtml(meaningEn) + '</em>' : '') +
          (meaningVi ? '<em>VI: ' + escapeHtml(meaningVi) + '</em>' : '') +
          '<button type="button" data-word-reading="' + escapeHtml(reading || word.word || '') + '">&#9654; Nghe</button>' +
          '</div>';
    }
    if (byId('words')) byId('words').innerHTML = wordHtml || '<small>Chưa có danh sách từ nên nhớ.</small>';

    showResultPanel();
    status.innerHTML = 'Đã phân tích xong đoạn được chọn.';
  }

  // ---- friendly error messages (never dump a raw Tomcat/server HTML error page to the user) ----
  function friendlyErrorMessage(code, data, raw) {
    if (data && data.error) return escapeHtml(data.error);
    if (code === 503) return 'OpenAI tạm thời chưa phản hồi. Vui lòng thử lại sau.';
    if (code === 429) return 'Bạn đã dùng hết ' + dailyAnalysisLimit + ' lượt phân tích hôm nay. Vui lòng liên hệ AnhMedia để mở rộng hạn mức.';
    if (raw && /^\s*</.test(raw)) return 'Máy chủ gặp lỗi nội bộ (HTTP ' + code + '). Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
    return 'Không thể kết nối máy chủ phân tích.';
  }

  // ---- silently retry up to 2 times (3 attempts total) before surfacing an error; only for network/5xx failures ----
  function performAnalyzeRequest(text, attempt, maxAttempts, onDone) {
    request('POST', '/api/japanese-learning/analyze', { text: text, mode: 'selection' }, function (code, data, raw) {
      var retryable = code === 0 || code >= 500;
      if (retryable && attempt < maxAttempts) {
        window.setTimeout(function () { performAnalyzeRequest(text, attempt + 1, maxAttempts, onDone); }, 500 * attempt);
        return;
      }
      onDone(code, data, raw);
    });
  }

  function analyze() {
    var text = selectedText(); if (!text) { status.innerHTML = 'Hãy bôi chọn một câu hoặc đoạn ngắn trước.'; return; }
    if (text.length > 500) { status.innerHTML = 'Đoạn quá dài. Chỉ chọn tối đa 500 ký tự.'; return; }
    if (!usageLoaded) { status.innerHTML = 'Đang tải hạn mức từ máy chủ. Vui lòng thử lại sau một chút.'; refreshDailyUsage(); return; }
    if (remainingAnalyses() === 0) { status.innerHTML = 'Bạn đã dùng hết ' + dailyAnalysisLimit + ' lượt phân tích hôm nay. Vui lòng liên hệ AnhMedia để mở rộng hạn mức.'; return; }
    currentText = text; status.innerHTML = 'Đang phân tích…'; byId('analyze').disabled = true;
    performAnalyzeRequest(text, 1, 3, function (code, data, raw) {
      if (code === 200 && data) { recordAnalysis(); render(data); byId('analyze').disabled = !usageLoaded || remainingAnalyses() === 0; refreshDailyUsage(); return; }
      byId('analyze').disabled = false;
      if (code === 401) { status.innerHTML = 'Bạn cần đăng nhập trước khi phân tích.'; openLogin(); refreshDailyUsage(); return; }
      status.innerHTML = friendlyErrorMessage(code, data, raw);
      refreshDailyUsage();
    });
  }

  function loadSaved() { try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch (ignore) { return []; } }
  function showSaved() {
    var saved = loadSaved(); var html = ''; var i;
    for (i = 0; i < saved.length; i += 1) html += '<article><b>' + escapeHtml(saved[i].source) + '</b><p>' + escapeHtml(saved[i].translationVi || '') + '</p><button type="button" data-saved="' + i + '">&#9654; Đọc lại</button><button type="button" data-remove="' + i + '">Xóa</button></article>';
    byId('savedList').innerHTML = html || '<p>Chưa có kết quả đã lưu.</p>';
  }
  function saveResult() { if (!currentResult) return; var saved = loadSaved(); saved.unshift(currentResult); if (saved.length > 30) saved.length = 30; localStorage.setItem(storageKey, JSON.stringify(saved)); showSaved(); status.innerHTML = 'Đã lưu kết quả trên iPad này.'; }
  function openLogin() { if (byId('loginModal')) byId('loginModal').style.display = 'block'; }
  function closeLogin() { if (byId('loginModal')) byId('loginModal').style.display = 'none'; }
  function login(event) {
    event.preventDefault(); var form = byId('loginForm'); var email = form.elements.email.value.replace(/^\s+|\s+$/g, ''); var pass = form.elements.password.value; var error = byId('loginError');
    if (!email || !pass) { error.innerHTML = 'Vui lòng nhập tài khoản và mật khẩu.'; error.style.display = 'block'; return; }
    byId('loginSubmit').disabled = true; byId('loginSubmit').innerHTML = 'Đang đăng nhập…'; error.style.display = 'none';
    request('POST', '/api/login-act', { id: 0, firstName: '', lastName: '', user: email, pass: pass, address: '', district: '', city: '', province: '', email: email, phoneNumber: '', selectedAddress: '000', zipcode: '000', note: '000' }, function (code, user) {
      if (code === 200 && user && Number(user.id) > 0) { if (user.pass === 'mfa') window.location.href = '/dang-nhap'; else window.location.reload(); return; }
      error.innerHTML = 'Sai tài khoản hoặc mật khẩu.'; error.style.display = 'block'; byId('loginSubmit').disabled = false; byId('loginSubmit').innerHTML = 'Đăng nhập';
    });
  }

  on(byId('uploadPdf'), 'click', handlePdfUpload);
  on(byId('analyze'), 'click', analyze); on(byId('speakSelection'), 'click', function () { var text = selectedText() || currentText; if (!text) status.innerHTML = 'Hãy chọn đoạn cần đọc.'; else speak(text); });
  on(byId('speakResult'), 'click', function () { speak(currentResult ? currentResult.source : ''); }); on(byId('saveResult'), 'click', saveResult);
  on(byId('clearText'), 'click', function () { if (window.confirm('Xóa nội dung đang đọc?')) editor.innerHTML = ''; });
  on(byId('textSize'), 'click', function () { document.body.className = document.body.className === 'large' ? '' : 'large'; });
  on(byId('loginOpen'), 'click', openLogin); on(byId('loginClose'), 'click', closeLogin); on(byId('loginShade'), 'click', closeLogin); on(byId('loginForm'), 'submit', login);
  on(byId('homeLink'), 'click', function (event) { if (!window.confirm('Bạn có chắc muốn trở về trang chủ?')) event.preventDefault(); });
  on(byId('tokens'), 'click', function (event) { var target = event.target; while (target && target !== this && !target.getAttribute('data-reading')) target = target.parentNode; if (target && target.getAttribute('data-reading')) speak(target.getAttribute('data-reading')); });
  on(byId('words'), 'click', function (event) { var target = event.target; while (target && target !== this && !target.getAttribute('data-word-reading')) target = target.parentNode; if (target && target.getAttribute('data-word-reading')) speak(target.getAttribute('data-word-reading')); });
  on(byId('savedList'), 'click', function (event) { var target = event.target; var saved = loadSaved(); if (target.getAttribute('data-saved') !== null) speak(saved[Number(target.getAttribute('data-saved'))].source); if (target.getAttribute('data-remove') !== null) { saved.splice(Number(target.getAttribute('data-remove')), 1); localStorage.setItem(storageKey, JSON.stringify(saved)); showSaved(); } });
  on(byId('toggleResult'), 'click', function () { if (!currentResult) return; if (byId('analysisResult').style.display === 'none') showResultPanel(); else hideResultPanel(); });
  on(byId('closeResult'), 'click', hideResultPanel);
  on(document, 'keydown', function (event) { var code = event.keyCode || event.which; if (code === 27 && byId('analysisResult').style.display !== 'none') hideResultPanel(); });

  showSaved();
  loadLastServerQuota();
  renderDailyUsage();
  refreshDailyUsage();

  /* Old iPad Safari may restore pages from its back-forward cache. Re-check quota. */
  on(window, 'pageshow', function () { refreshDailyUsage(); });
  on(window, 'focus', function () { refreshDailyUsage(); });
  on(document, 'visibilitychange', function () { if (!document.hidden) refreshDailyUsage(); });

  updateToggleResultButton();
}());