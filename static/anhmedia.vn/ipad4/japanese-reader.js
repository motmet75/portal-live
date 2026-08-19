(function(){
  'use strict';
  window.onerror=function(msg,url,line){var s=document.getElementById('jsStatus');if(s){s.innerHTML='Lỗi JS dòng '+line+': '+String(msg);}return false;};

  var STORAGE_KEY='anhmedia.jp-reader.ipad4.v1';
  var appState={documents:[],analyses:[],savedWords:[]};
  var currentPages=[];
  var currentPage=0;
  var currentDocId=null;
  var currentAnalysis=null;
  var selectedText='';
  var quotaLimit=null;
  var quotaRemaining=null;
  var usageLoaded=false;
  var analyzing=false;
  var waitTimer=null;
  var loginPopup=null;
  var loginPoll=null;

  function id(x){return document.getElementById(x);}
  function qsa(sel){return document.querySelectorAll(sel);}
  function trim(s){return String(s||'').replace(/^\s+|\s+$/g,'');}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function addClass(el,c){if(el&&(' '+el.className+' ').indexOf(' '+c+' ')<0)el.className+=(el.className?' ':'')+c;}
  function removeClass(el,c){if(el)el.className=(' '+el.className+' ').replace(' '+c+' ',' ').replace(/^\s+|\s+$/g,'');}
  function show(el){removeClass(el,'hidden');}
  function hide(el){addClass(el,'hidden');}
  function toast(msg){var t=id('toast');t.innerHTML=esc(msg);t.style.display='block';clearTimeout(t._timer);t._timer=setTimeout(function(){t.style.display='none';},2600);}

  function loadState(){
    try{
      var raw=localStorage.getItem(STORAGE_KEY);
      if(raw){var v=JSON.parse(raw);if(v)appState=v;}
    }catch(e){}
    if(!appState.documents)appState.documents=[];
    if(!appState.analyses)appState.analyses=[];
    if(!appState.savedWords)appState.savedWords=[];
  }
  function saveState(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(appState));}catch(e){}
    renderLibrary();
    renderMemory();
  }
  function xhr(method,url,body,headers,done){
    var x=new XMLHttpRequest();
    x.open(method,url,true);
    x.withCredentials=true;
    if(headers){for(var k in headers){if(headers.hasOwnProperty(k))x.setRequestHeader(k,headers[k]);}}
    x.onreadystatechange=function(){
      if(x.readyState===4)done(x.status,x.responseText,x);
    };
    try{x.send(body||null);}catch(e){done(0,'',x);}
  }
  function jsonParse(s){try{return JSON.parse(s);}catch(e){return null;}}

  function renderQuota(){
    id('remaining').innerHTML=usageLoaded?String(quotaRemaining):'...';
    id('limit').innerHTML=usageLoaded?String(quotaLimit):'...';
    updateAnalyzeButtons();
    id('loginBox').style.display=usageLoaded?'none':'block';
  }
  function refreshQuota(cb){
    xhr('GET','/api/japanese-learning/usage?_='+new Date().getTime(),null,{
      'Accept':'application/json',
      'Cache-Control':'no-cache'
    },function(status,text){
      if(status===200){
        var d=jsonParse(text);
        if(d&&isFinite(Number(d.limit))&&isFinite(Number(d.remaining))){
          quotaLimit=Number(d.limit);
          quotaRemaining=Number(d.remaining);
          usageLoaded=true;
          renderQuota();
          if(cb)cb(true);
          return;
        }
      }
      if(status===401){usageLoaded=false;quotaLimit=null;quotaRemaining=null;renderQuota();}
      if(cb)cb(false);
    });
  }
  function updateAnalyzeButtons(){
    var ok=usageLoaded&&!analyzing&&selectedText.length>1&&selectedText.length<=500&&Number(quotaRemaining)>0;
    id('analyzeBtn').disabled=!ok;
    id('analyzeBtn2').disabled=!ok;
  }

  function getSelectedText(){
    var t=id('editor');
    var start=t.selectionStart;
    var end=t.selectionEnd;
    if(typeof start==='number'&&typeof end==='number'&&end>start){
      selectedText=trim(t.value.substring(start,end));
    }else{
      selectedText='';
    }
    updateAnalyzeButtons();
  }
  function splitPages(text){
    text=trim(text);
    if(!text)return [''];
    var hard=text.split(/\f+/);
    if(hard.length>1)return hard;
    var pages=[],pos=0,size=1800;
    while(pos<text.length){pages.push(text.substring(pos,pos+size));pos+=size;}
    return pages.length?pages:[''];
  }
  function storeCurrentPage(){
    if(!currentPages.length)currentPages=[''];
    currentPages[currentPage]=id('editor').value;
  }
  function renderPage(n){
    storeCurrentPage();
    if(n<0)n=0;
    if(n>=currentPages.length)n=currentPages.length-1;
    currentPage=n;
    id('editor').value=currentPages[currentPage]||'';
    var labels=qsa('.page-label'),i;
    for(i=0;i<labels.length;i++)labels[i].innerHTML='Trang '+(currentPage+1)+' / '+currentPages.length;
    var prev=qsa('.prevBtn'),next=qsa('.nextBtn');
    for(i=0;i<prev.length;i++)prev[i].disabled=currentPage===0;
    for(i=0;i<next.length;i++)next[i].disabled=currentPage>=currentPages.length-1;
    var doc=findDoc(currentDocId);
    var marks=doc&&doc.bookmarks?doc.bookmarks:[];
    var active=false;
    for(i=0;i<marks.length;i++)if(marks[i].page===currentPage)active=true;
    var b=qsa('.bookmarkBtn');
    for(i=0;i<b.length;i++){
      b[i].disabled=!doc;
      b[i].innerHTML=active?'🔖 Đã lưu dấu':'🔖 Dấu trang';
    }
    selectedText='';
    updateAnalyzeButtons();
  }
  function findDoc(docId){
    var i;
    for(i=0;i<appState.documents.length;i++)if(String(appState.documents[i].id)===String(docId))return appState.documents[i];
    return null;
  }
  function saveDocument(){
    storeCurrentPage();
    var title=trim(id('docTitle').value)||'Tài liệu chưa đặt tên';
    if(currentDocId===null)currentDocId=new Date().getTime();
    var doc=findDoc(currentDocId);
    if(!doc){
      doc={id:currentDocId,title:title,pages:currentPages,bookmarks:[],currentPage:currentPage,updatedAt:new Date().toISOString()};
      appState.documents.unshift(doc);
    }else{
      doc.title=title;doc.pages=currentPages;doc.currentPage=currentPage;doc.updatedAt=new Date().toISOString();
    }
    saveState();
    renderPage(currentPage);
    toast('Đã lưu tài liệu.');
  }
  function addBookmark(){
    var doc=findDoc(currentDocId);
    if(!doc){toast('Hãy lưu tài liệu trước.');return;}
    var note=window.prompt('Ghi chú dấu trang:','');
    if(note===null)return;
    if(!doc.bookmarks)doc.bookmarks=[];
    doc.bookmarks.push({id:'m'+new Date().getTime(),page:currentPage,note:trim(note)||'Dấu trang',savedAt:new Date().toISOString()});
    saveState();
    renderPage(currentPage);
  }
  function renderLibrary(){
    var box=id('docList'),html='',i,d;
    for(i=0;i<appState.documents.length;i++){
      d=appState.documents[i];
      html+='<div class="doc-item"><b>'+esc(d.title)+'</b><div class="small">'+((d.pages||[]).length)+' trang · '+((d.bookmarks||[]).length)+' dấu trang</div>'+
          '<button data-open-doc="'+d.id+'">Mở</button><button data-del-doc="'+d.id+'">Xóa</button></div>';
    }
    box.innerHTML=html||'<div class="small">Chưa có tài liệu đã lưu.</div>';
  }
  function openDocument(docId){
    var d=findDoc(docId);
    if(!d)return;
    currentDocId=d.id;
    currentPages=d.pages&&d.pages.length?d.pages:[''];
    currentPage=Number(d.currentPage)||0;
    id('docTitle').value=d.title||'Tài liệu';
    renderPage(currentPage);
    setView('reader');
  }
  function deleteDocument(docId){
    if(!window.confirm('Xóa tài liệu này?'))return;
    var out=[],i;
    for(i=0;i<appState.documents.length;i++)if(String(appState.documents[i].id)!==String(docId))out.push(appState.documents[i]);
    appState.documents=out;
    if(String(currentDocId)===String(docId))currentDocId=null;
    saveState();
  }
  function renderMemory(){
    var q=trim(id('memorySearch').value).toLowerCase(),html='',i,a,w,j;
    for(i=0;i<appState.analyses.length;i++){
      a=appState.analyses[i];
      if(q&&String(a.source||'').toLowerCase().indexOf(q)<0&&String(a.translationVi||'').toLowerCase().indexOf(q)<0)continue;
      html+='<div class="memory-item"><b>'+esc(a.source||'')+'</b><div class="small">'+esc(a.translationVi||'')+'</div>';
      w=a.words||a.vocabulary||[];
      for(j=0;j<w.length;j++)html+='<div class="small">'+esc(w[j].word||w[j][0]||'')+' · '+esc(w[j].reading||'')+' · '+esc(w[j].meaningVi||w[j].meaningEn||'')+'</div>';
      html+='</div>';
    }
    id('memoryList').innerHTML=html||'<div class="small">Chưa có nội dung đã lưu.</div>';
  }

  function setView(name){
    hide(id('readerView'));hide(id('memoryView'));hide(id('libraryView'));
    removeClass(id('readerTab'),'active');removeClass(id('memoryTab'),'active');removeClass(id('libraryTab'),'active');
    if(name==='memory'){show(id('memoryView'));addClass(id('memoryTab'),'active');renderMemory();}
    else if(name==='library'){show(id('libraryView'));addClass(id('libraryTab'),'active');renderLibrary();}
    else{show(id('readerView'));addClass(id('readerTab'),'active');}
  }

  function openWait(text){
    analyzing=true;updateAnalyzeButtons();
    id('waitText').innerHTML=esc(text);
    id('waitSeconds').innerHTML='0';
    id('waitOverlay').style.display='block';addClass(id('waitOverlay'),'is-open');
    document.body.style.overflow='hidden';
    var start=new Date().getTime();
    clearInterval(waitTimer);
    waitTimer=setInterval(function(){id('waitSeconds').innerHTML=String(Math.floor((new Date().getTime()-start)/1000));},1000);
  }
  function closeWait(){
    analyzing=false;
    clearInterval(waitTimer);waitTimer=null;
    id('waitOverlay').style.display='none';removeClass(id('waitOverlay'),'is-open');
    document.body.style.overflow='';
    updateAnalyzeButtons();
  }
  function renderAnalysis(a){
    currentAnalysis=a;
    id('sourceText').innerHTML=esc(a.source||selectedText);
    id('hiraganaText').innerHTML=esc(a.hira||a.hiragana||'');
    id('translationVi').innerHTML=esc(a.translationVi||'');
    id('translationEn').innerHTML=esc(a.translation||'');
    var words=a.words||a.vocabulary||[],html='',i,w;
    for(i=0;i<words.length;i++){
      w=words[i];
      html+='<span class="word"><b>'+esc(w.word||w[0]||'')+'</b><span>'+esc(w.reading||'')+'</span><em>'+esc(w.meaningVi||w.meaningEn||w.meaning||'')+'</em></span>';
    }
    id('wordList').innerHTML=html||'<span class="small">Không có từ vựng.</span>';
    show(id('analysisPanel'));
  }
  function analyze(){
    if(analyzing||selectedText.length<2)return;
    if(selectedText.length>500){toast('Chỉ chọn tối đa 500 ký tự.');return;}
    refreshQuota(function(ok){
      if(!ok){toast('Không lấy được hạn mức từ máy chủ.');return;}
      if(Number(quotaRemaining)<=0){toast('Bạn đã hết lượt phân tích hôm nay.');return;}
      openWait(selectedText);
      xhr('POST','/api/japanese-learning/analyze',JSON.stringify({text:selectedText,mode:'selection'}),{'Content-Type':'application/json','Accept':'application/json'},function(status,text){
        var d=jsonParse(text);
        if(status===200&&d){
          if(!d.source)d.source=selectedText;
          renderAnalysis(d);
        }else if(status===401){
          toast('Hãy đăng nhập Google để phân tích.');
        }else if(status===429){
          toast('Bạn đã hết hạn mức hôm nay.');
        }else{
          toast(d&&d.error?d.error:'Không thể phân tích.');
        }
        refreshQuota(function(){closeWait();});
      });
    });
  }
  function saveAnalysis(){
    if(!currentAnalysis)return;
    currentAnalysis.savedAt=new Date().toISOString();
    appState.analyses.unshift(currentAnalysis);
    if(appState.analyses.length>100)appState.analyses.length=100;
    var words=currentAnalysis.words||currentAnalysis.vocabulary||[],i;
    for(i=0;i<words.length;i++)appState.savedWords.unshift(words[i]);
    saveState();
    toast('Đã lưu để ôn.');
  }
  function speakSelection(){
    if(!selectedText){toast('Hãy chọn một đoạn tiếng Nhật.');return;}
    if(!window.speechSynthesis){toast('Safari này không hỗ trợ đọc giọng.');return;}
    try{
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(selectedText);
      u.lang='ja-JP';u.rate=.82;
      window.speechSynthesis.speak(u);
    }catch(e){toast('Không phát được giọng tiếng Nhật.');}
  }

  function rememberReturn(){
    try{
      var target=window.location.pathname+window.location.search+window.location.hash;
      document.cookie='PORTAL_LOGIN_RETURN='+encodeURIComponent(target)+'; Max-Age=600; Path=/; SameSite=Lax';
    }catch(e){}
  }
  function openGoogle(){
    rememberReturn();
    var w=520,h=700,left=Math.max(0,Math.round((screen.width-w)/2)),top=Math.max(0,Math.round((screen.height-h)/2));
    loginPopup=window.open('/oauth2/authorization/google','anhmedia-google-login','width='+w+',height='+h+',left='+left+',top='+top+',resizable=yes,scrollbars=yes');
    if(!loginPopup){window.location.href='/oauth2/authorization/google';return;}
    clearInterval(loginPoll);
    loginPoll=setInterval(function(){
      refreshQuota(function(ok){
        if(ok){
          clearInterval(loginPoll);
          try{loginPopup.close();}catch(e){}
          window.location.reload();
        }
      });
    },1500);
  }
  function logout(){
    xhr('POST','/logout',null,{'X-Requested-With':'XMLHttpRequest'},function(status){
      if(status===0||status>=400){
        xhr('GET','/logout',null,{'X-Requested-With':'XMLHttpRequest'},function(){window.location.reload();});
      }else{
        window.location.reload();
      }
    });
  }

  function openPdf(){
    id('pdfError').innerHTML='';
    try{
      id('ocrUser').value=sessionStorage.getItem('anhmedia.jp-reader.ocr-user')||'';
      id('ocrToken').value=sessionStorage.getItem('anhmedia.jp-reader.ocr-token')||'';
    }catch(e){}
    id('pdfModal').style.display='block';addClass(id('pdfModal'),'is-open');
  }
  function closePdf(){id('pdfModal').style.display='none';removeClass(id('pdfModal'),'is-open');}
  function pdfCreds(){
    var u=trim(id('ocrUser').value),t=trim(id('ocrToken').value);
    if(!u||!t){id('pdfError').innerHTML='Vui lòng nhập đầy đủ User ID và Token OCR.';return null;}
    try{sessionStorage.setItem('anhmedia.jp-reader.ocr-user',u);sessionStorage.setItem('anhmedia.jp-reader.ocr-token',t);}catch(e){}
    return {userId:u,tokenId:t};
  }
  function applyExtractedText(text,title){
    currentDocId=new Date().getTime();
    currentPages=splitPages(text);
    currentPage=0;
    id('docTitle').value=title||'Tài liệu PDF';
    var d={id:currentDocId,title:id('docTitle').value,pages:currentPages,currentPage:0,bookmarks:[],updatedAt:new Date().toISOString()};
    appState.documents.unshift(d);
    saveState();
    closePdf();
    setView('reader');
    renderPage(0);
    toast('Đã tải và chia tài liệu thành '+currentPages.length+' trang.');
  }
  function uploadPdfUrl(){
    var c=pdfCreds();if(!c)return;
    var url=trim(id('pdfUrl').value);
    if(!url){id('pdfError').innerHTML='Nhập URL PDF/ảnh công khai.';return;}
    id('pdfError').innerHTML='Đang tải tài liệu...';
    xhr('POST','/api/extract-text/url',JSON.stringify({resourceUrl:url,language:'jpn',userId:c.userId,tokenId:c.tokenId}),{'Content-Type':'application/json','Accept':'application/json'},function(status,text){
      var d=jsonParse(text);
      if(status===200&&d&&d.status==='success'){applyExtractedText(d.text||'','Tài liệu từ URL');}
      else id('pdfError').innerHTML=esc(d&&d.error?d.error:'Không thể trích xuất URL.');
    });
  }
  function uploadPdfFile(){
    var c=pdfCreds();if(!c)return;
    var file=id('pdfFile').files&&id('pdfFile').files[0];
    if(!file){id('pdfError').innerHTML='Hãy chọn PDF/ảnh trước.';return;}
    if(!window.FormData){id('pdfError').innerHTML='Safari này không hỗ trợ FormData. Hãy dùng URL công khai.';return;}
    var form=new FormData();
    form.append('file',file);
    form.append('language','jpn');
    form.append('userId',c.userId);
    form.append('tokenId',c.tokenId);
    id('pdfError').innerHTML='Đang trích xuất...';
    var x=new XMLHttpRequest();
    x.open('POST','/api/extract-text',true);
    x.withCredentials=true;
    x.onreadystatechange=function(){
      if(x.readyState===4){
        var d=jsonParse(x.responseText);
        if(x.status===200&&d&&d.status==='success')applyExtractedText(d.text||'',file.name||'Tài liệu PDF');
        else id('pdfError').innerHTML=esc(d&&d.error?d.error:'Không thể trích xuất file.');
      }
    };
    try{x.send(form);}catch(e){id('pdfError').innerHTML='Không gửi được file. Hãy dùng URL công khai.';}
  }
  function searchCurrent(){
    var q=trim(id('searchBox').value).toLowerCase();
    if(!q)return;
    var i,text;
    storeCurrentPage();
    for(i=0;i<currentPages.length;i++){
      text=String(currentPages[i]||'').toLowerCase();
      if(text.indexOf(q)>=0){renderPage(i);toast('Tìm thấy ở trang '+(i+1)+'.');return;}
    }
    toast('Không tìm thấy.');
  }
  function newDocument(){
    storeCurrentPage();
    currentDocId=null;currentPages=[''];currentPage=0;
    id('docTitle').value='Tài liệu chưa đặt tên';
    renderPage(0);setView('reader');
  }

  function bind(){
    id('editor').onmouseup=getSelectedText;
    id('editor').onkeyup=getSelectedText;
    id('editor').ontouchend=function(){setTimeout(getSelectedText,100);};

    id('analyzeBtn').onclick=analyze;
    id('analyzeBtn2').onclick=analyze;
    id('saveAnalysisBtn').onclick=saveAnalysis;
    id('speakBtn').onclick=speakSelection;
    id('saveDocBtn').onclick=saveDocument;
    id('pdfBtn').onclick=openPdf;
    id('pdfCancelBtn').onclick=closePdf;
    id('pdfUrlBtn').onclick=uploadPdfUrl;
    id('pdfFileBtn').onclick=uploadPdfFile;
    id('googleBtn').onclick=openGoogle;
    id('googleBtn2').onclick=openGoogle;
    id('logoutBtn').onclick=logout;
    id('readerTab').onclick=function(){setView('reader');};
    id('memoryTab').onclick=function(){setView('memory');};
    id('libraryTab').onclick=function(){setView('library');};
    id('newDocBtn').onclick=newDocument;
    id('homeBtn').onclick=function(){window.location.href='/';};
    id('memorySearch').onkeyup=renderMemory;
    id('searchBox').onkeydown=function(e){e=e||window.event;if((e.keyCode||e.which)===13)searchCurrent();};

    var i,els=qsa('.prevBtn');
    for(i=0;i<els.length;i++)els[i].onclick=function(){renderPage(currentPage-1);};
    els=qsa('.nextBtn');
    for(i=0;i<els.length;i++)els[i].onclick=function(){renderPage(currentPage+1);};
    els=qsa('.bookmarkBtn');
    for(i=0;i<els.length;i++)els[i].onclick=addBookmark;

    id('docList').onclick=function(e){
      e=e||window.event;
      var t=e.target||e.srcElement;
      var open=t.getAttribute('data-open-doc');
      var del=t.getAttribute('data-del-doc');
      if(open)openDocument(open);
      if(del)deleteDocument(del);
    };
  }
  function init(){
    var statusEl=id('jsStatus');if(statusEl){statusEl.innerHTML='JavaScript iPad 4: OK';}
    loadState();
    currentPages=[id('editor').value];
    renderLibrary();renderMemory();renderPage(0);
    bind();
    refreshQuota();
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,false);
  }else{
    init();
  }
})();