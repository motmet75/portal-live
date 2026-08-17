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
  function selectedText() {
    var selection = window.getSelection ? window.getSelection() : null;
    var text = selection ? String(selection.toString()).replace(/^\s+|\s+$/g, '') : '';
    return text;
  }
  function speak(text) {
    if (!text || !window.speechSynthesis || !window.SpeechSynthesisUtterance) { status.innerHTML = 'Thiết bị không hỗ trợ đọc giọng nói.'; return; }
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'ja-JP'; utterance.rate = 0.78; window.speechSynthesis.speak(utterance);
  }
  function render(result) {
    currentResult = result; byId('emptyResult').style.display = 'none'; byId('analysisResult').style.display = 'block';
    byId('ruby').innerHTML = result.ruby || escapeHtml(result.source || ''); byId('hiragana').innerHTML = escapeHtml(result.hira || '');
    byId('translationVi').innerHTML = escapeHtml(result.translationVi || ''); byId('translation').innerHTML = escapeHtml(result.translation || '');
    var tokens = result.tokens || []; var html = ''; var i;
    for (i = 0; i < tokens.length; i += 1) html += '<button class="token" type="button" data-reading="' + escapeHtml(tokens[i].reading || tokens[i].surface) + '"><b>' + escapeHtml(tokens[i].surface) + '</b><small>' + escapeHtml(tokens[i].reading || '') + ' · ' + escapeHtml(tokens[i].romaji || '') + '</small></button>';
    byId('tokens').innerHTML = html; status.innerHTML = 'Đã phân tích xong đoạn được chọn.';
  }
  function analyze() {
    var text = selectedText(); if (!text) { status.innerHTML = 'Hãy bôi chọn một câu hoặc đoạn ngắn trước.'; return; }
    if (text.length > 500) { status.innerHTML = 'Đoạn quá dài. Chỉ chọn tối đa 500 ký tự.'; return; }
    currentText = text; status.innerHTML = 'Đang phân tích…'; byId('analyze').disabled = true;
    request('POST', '/api/japanese-learning/analyze', { text: text, mode: 'selection' }, function (code, data) {
      byId('analyze').disabled = false;
      if (code === 200 && data) { render(data); return; }
      if (code === 401) { status.innerHTML = 'Bạn cần đăng nhập trước khi phân tích.'; openLogin(); return; }
      status.innerHTML = data && data.error ? escapeHtml(data.error) : 'Không thể kết nối máy chủ phân tích.';
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

  on(byId('analyze'), 'click', analyze); on(byId('speakSelection'), 'click', function () { var text = selectedText() || currentText; if (!text) status.innerHTML = 'Hãy chọn đoạn cần đọc.'; else speak(text); });
  on(byId('speakResult'), 'click', function () { speak(currentResult ? currentResult.source : ''); }); on(byId('saveResult'), 'click', saveResult);
  on(byId('clearText'), 'click', function () { if (window.confirm('Xóa nội dung đang đọc?')) editor.innerHTML = ''; });
  on(byId('textSize'), 'click', function () { document.body.className = document.body.className === 'large' ? '' : 'large'; });
  on(byId('loginOpen'), 'click', openLogin); on(byId('loginClose'), 'click', closeLogin); on(byId('loginShade'), 'click', closeLogin); on(byId('loginForm'), 'submit', login);
  on(byId('homeLink'), 'click', function (event) { if (!window.confirm('Bạn có chắc muốn trở về trang chủ?')) event.preventDefault(); });
  on(byId('tokens'), 'click', function (event) { var target = event.target; while (target && target !== this && !target.getAttribute('data-reading')) target = target.parentNode; if (target && target.getAttribute('data-reading')) speak(target.getAttribute('data-reading')); });
  on(byId('savedList'), 'click', function (event) { var target = event.target; var saved = loadSaved(); if (target.getAttribute('data-saved') !== null) speak(saved[Number(target.getAttribute('data-saved'))].source); if (target.getAttribute('data-remove') !== null) { saved.splice(Number(target.getAttribute('data-remove')), 1); localStorage.setItem(storageKey, JSON.stringify(saved)); showSaved(); } });
  showSaved();
}());
