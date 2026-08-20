(function(){
  'use strict';
  window.onerror=function(msg,url,line){var s=document.getElementById('jsStatus');if(s){s.innerHTML='Lỗi JS dòng '+line+': '+String(msg);}return false;};

  var STORAGE_KEY='anhmedia.jp-reader.v1';
  var LEGACY_IPAD_STORAGE_KEY='anhmedia.jp-reader.ipad4.v1';
  var OFFLINE_META_KEY='anhmedia.jp-reader.offline-meta.v1';
  var appState={documents:[],analyses:[],savedWords:[],savedPhrases:[]};
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
  var DRAFT_KEY='anhmedia.jp-reader.ipad4.drafts.v1';
  var undoStacks={};
  var redoStacks={};
  var lastEditorValue='';
  var suppressEditorHistory=false;
  var navigationBusy=false;
  var LAST_DOC_KEY='anhmedia.jp-reader.ipad4.last-doc.v1';

  function id(x){return document.getElementById(x);}
  function qsa(sel){return document.querySelectorAll(sel);}
  function trim(s){return String(s||'').replace(/^\s+|\s+$/g,'');}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function addClass(el,c){if(el&&(' '+el.className+' ').indexOf(' '+c+' ')<0)el.className+=(el.className?' ':'')+c;}
  function removeClass(el,c){if(el)el.className=(' '+el.className+' ').replace(' '+c+' ',' ').replace(/^\s+|\s+$/g,'');}
  function show(el){removeClass(el,'hidden');}
  function hide(el){addClass(el,'hidden');}
  function toast(msg){var t=id('toast');t.innerHTML=esc(msg);t.style.display='block';clearTimeout(t._timer);t._timer=setTimeout(function(){t.style.display='none';},2600);}

  function normalizeState(v){
    if(!v)v={};
    return {
      documents:v.documents||[],
      memories:v.memories||[],
      analyses:v.analyses||[],
      savedWords:v.savedWords||[],
      savedPhrases:v.savedPhrases||[]
    };
  }
  function mergeDocuments(a,b){
    var out=[],seen={},i,d,key;
    a=a||[];b=b||[];
    for(i=0;i<a.length;i++){
      d=a[i];key=String(d.id||d.title||('a'+i));
      if(!seen[key]){seen[key]=1;out.push(d);}
    }
    for(i=0;i<b.length;i++){
      d=b[i];key=String(d.id||d.title||('b'+i));
      if(!seen[key]){seen[key]=1;out.push(d);}
    }
    return out;
  }
  function mergeSimple(a,b,keyName){
    var out=[],seen={},i,d,key;
    a=a||[];b=b||[];
    for(i=0;i<a.length;i++){
      d=a[i];key=String(d[keyName]||d.id||d.word||i);
      if(!seen[key]){seen[key]=1;out.push(d);}
    }
    for(i=0;i<b.length;i++){
      d=b[i];key=String(d[keyName]||d.id||d.word||('b'+i));
      if(!seen[key]){seen[key]=1;out.push(d);}
    }
    return out;
  }
  function loadState(){
    var normal=null,legacy=null,raw,oldRaw;
    try{
      raw=localStorage.getItem(STORAGE_KEY);
      if(raw)normal=JSON.parse(raw);
    }catch(e){}
    try{
      oldRaw=localStorage.getItem(LEGACY_IPAD_STORAGE_KEY);
      if(oldRaw)legacy=JSON.parse(oldRaw);
    }catch(e){}

    normal=normalizeState(normal);
    legacy=normalizeState(legacy);

    appState={
      documents:mergeDocuments(normal.documents,legacy.documents),
      memories:mergeSimple(normal.memories,legacy.memories,'sessionId'),
      analyses:mergeSimple(normal.analyses,legacy.analyses,'sessionId'),
      savedWords:mergeSimple(normal.savedWords,legacy.savedWords,'word'),
      savedPhrases:mergeSimple(normal.savedPhrases,legacy.savedPhrases,'source')
    };

    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(appState));}catch(e){}
  }
  function saveState(){
    /*
     * OFFLINE FIRST:
     * Save immediately in localStorage. Server availability never blocks this.
     */
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(appState));
      localStorage.setItem(LEGACY_IPAD_STORAGE_KEY,JSON.stringify(appState));
      localStorage.setItem(OFFLINE_META_KEY,JSON.stringify({
        savedAt:new Date().toISOString(),
        documents:appState.documents.length,
        analyses:appState.analyses.length,
        savedWords:appState.savedWords.length
      }));
    }catch(e){
      toast('Không lưu được vào bộ nhớ Safari. Có thể bộ nhớ đã đầy.');
    }
    renderLibrary();
    renderMemory();
    updateOfflineStatus();
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

  function updateOfflineStatus(){
    var el=id('offlineStatus');
    if(!el)return;
    var online=true;
    if(typeof navigator.onLine!=='undefined')online=navigator.onLine;
    var meta=null;
    try{
      var raw=localStorage.getItem(OFFLINE_META_KEY);
      if(raw)meta=JSON.parse(raw);
    }catch(e){}
    var count=appState.documents?appState.documents.length:0;
    if(online){
      el.innerHTML='Offline library: '+count+' tài liệu đã lưu trên máy';
      el.className='offline-status online';
    }else{
      el.innerHTML='ĐANG OFFLINE · '+count+' tài liệu vẫn dùng được';
      el.className='offline-status offline';
    }
  }
  function exportOfflineBackup(){
    var data='';
    try{data=JSON.stringify(appState,null,2);}catch(e){toast('Không tạo được bản sao lưu.');return;}
    var textarea=document.createElement('textarea');
    textarea.value=data;
    textarea.setAttribute('readonly','readonly');
    textarea.style.position='fixed';
    textarea.style.left='-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try{
      document.execCommand('copy');
      toast('Đã sao chép bản sao lưu thư viện vào clipboard.');
    }catch(e){
      window.prompt('Sao chép nội dung backup này:',data);
    }
    document.body.removeChild(textarea);
  }

  function updateAuthButtons(isLoggedIn){
    var google=id('googleBtn');
    var logout=id('logoutBtn');

    if(google)google.style.display=isLoggedIn?'none':'inline-block';
    if(logout)logout.style.display=isLoggedIn?'inline-block':'none';
  }

  function renderQuota(){
    id('remaining').innerHTML=usageLoaded?String(quotaRemaining):'...';
    id('limit').innerHTML=usageLoaded?String(quotaLimit):'...';
    updateAnalyzeButtons();

    if(usageLoaded){
      id('loginBox').style.display='none';
      updateAuthButtons(true);
    }else{
      id('loginBox').style.display='block';
      updateAuthButtons(false);
    }
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
  function clonePages(pages){
    var out=[],i;
    pages=pages||[];
    for(i=0;i<pages.length;i++)out.push(String(pages[i]||''));
    return out.length?out:[''];
  }
  function loadDrafts(){
    try{
      var raw=localStorage.getItem(DRAFT_KEY);
      return raw?JSON.parse(raw):{};
    }catch(e){return {};}
  }
  function saveDraftForCurrentDoc(){
    if(currentDocId===null)return;
    storeCurrentPage();
    var drafts=loadDrafts();
    drafts[String(currentDocId)]={
      title:id('docTitle').value||'',
      pages:clonePages(currentPages),
      currentPage:currentPage,
      updatedAt:new Date().toISOString()
    };
    try{localStorage.setItem(DRAFT_KEY,JSON.stringify(drafts));}catch(e){}
    updateDraftStatus(true);
  }
  function loadDraftForDoc(docId){
    var drafts=loadDrafts();
    return drafts[String(docId)]||null;
  }
  function clearDraftForDoc(docId){
    var drafts=loadDrafts();
    if(drafts.hasOwnProperty(String(docId))){
      delete drafts[String(docId)];
      try{localStorage.setItem(DRAFT_KEY,JSON.stringify(drafts));}catch(e){}
    }
    updateDraftStatus(false);
  }
  function updateDraftStatus(hasDraft){
    var el=id('draftStatus');
    if(!el)return;
    if(hasDraft){
      el.innerHTML='BẢN NHÁP · thay đổi chưa được lưu vào tài liệu';
      el.className='draft-status dirty';
    }else{
      el.innerHTML='Đã lưu';
      el.className='draft-status saved';
    }
  }
  function resetHistoryForPage(){
    lastEditorValue=id('editor').value||'';
    if(!undoStacks[currentPage])undoStacks[currentPage]=[];
    if(!redoStacks[currentPage])redoStacks[currentPage]=[];
    updateUndoRedoButtons();
  }
  function rememberEditorChange(){
    if(suppressEditorHistory)return;
    var now=id('editor').value||'';
    if(now===lastEditorValue)return;
    if(!undoStacks[currentPage])undoStacks[currentPage]=[];
    undoStacks[currentPage].push(lastEditorValue);
    if(undoStacks[currentPage].length>50)undoStacks[currentPage].shift();
    redoStacks[currentPage]=[];
    lastEditorValue=now;
    currentPages[currentPage]=now;
    saveDraftForCurrentDoc();
    updateUndoRedoButtons();
  }
  function undoEdit(){
    var stack=undoStacks[currentPage]||[];
    if(!stack.length)return;
    var now=id('editor').value||'';
    var prev=stack.pop();
    if(!redoStacks[currentPage])redoStacks[currentPage]=[];
    redoStacks[currentPage].push(now);
    suppressEditorHistory=true;
    id('editor').value=prev;
    suppressEditorHistory=false;
    lastEditorValue=prev;
    currentPages[currentPage]=prev;
    saveDraftForCurrentDoc();
    updateUndoRedoButtons();
  }
  function redoEdit(){
    var stack=redoStacks[currentPage]||[];
    if(!stack.length)return;
    var now=id('editor').value||'';
    var next=stack.pop();
    if(!undoStacks[currentPage])undoStacks[currentPage]=[];
    undoStacks[currentPage].push(now);
    suppressEditorHistory=true;
    id('editor').value=next;
    suppressEditorHistory=false;
    lastEditorValue=next;
    currentPages[currentPage]=next;
    saveDraftForCurrentDoc();
    updateUndoRedoButtons();
  }
  function updateUndoRedoButtons(){
    var u=id('undoEditBtn'),r=id('redoEditBtn');
    if(u)u.disabled=!(undoStacks[currentPage]&&undoStacks[currentPage].length);
    if(r)r.disabled=!(redoStacks[currentPage]&&redoStacks[currentPage].length);
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

    suppressEditorHistory=true;
    id('editor').value=currentPages[currentPage]||'';
    suppressEditorHistory=false;
    resetHistoryForPage();

    var labels=qsa('.page-label'),i;
    for(i=0;i<labels.length;i++)labels[i].innerHTML='Trang '+(currentPage+1)+' / '+currentPages.length;

    var jumps=qsa('.pageJump');
    for(i=0;i<jumps.length;i++){
      jumps[i].value=String(currentPage+1);
      jumps[i].max=String(currentPages.length);
    }

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

    /* Persist last page only. Never persist edited draft text here. */
    if(doc){
      doc.currentPage=currentPage;
      try{
        localStorage.setItem(STORAGE_KEY,JSON.stringify(appState));
        localStorage.setItem(LEGACY_IPAD_STORAGE_KEY,JSON.stringify(appState));
      }catch(e){}
    }

    selectedText='';
    updateAnalyzeButtons();

    setTimeout(function(){
      try{
        var reader=id('readerView');
        var editor=id('editor');
        if(reader&&reader.scrollIntoView)reader.scrollIntoView(true);
        else if(editor&&editor.scrollIntoView)editor.scrollIntoView(true);
        else window.scrollTo(0,0);
        if(editor)editor.scrollTop=0;
      }catch(e){try{window.scrollTo(0,0);}catch(ignore){}}
    },20);
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
      doc={
        id:currentDocId,
        title:title,
        pages:clonePages(currentPages),
        bookmarks:[],
        currentPage:currentPage,
        updatedAt:new Date().toISOString(),
        offline:true
      };
      appState.documents.unshift(doc);
    }else{
      doc.title=title;
      doc.pages=clonePages(currentPages);
      doc.currentPage=currentPage;
      doc.updatedAt=new Date().toISOString();
      doc.offline=true;
    }
    saveState();
    clearDraftForDoc(currentDocId);
    undoStacks={};redoStacks={};
    resetHistoryForPage();
    toast('Đã lưu tài liệu.');
  }
  function bookmarkPreviewText(){
    var text=trim(selectedText||'');
    if(!text){
      try{
        getSelectedText();
        text=trim(selectedText||'');
      }catch(e){}
    }
    if(!text){
      text=trim(id('editor').value||'');
    }
    if(!text)return '';

    if(text.length<=90)return text;

    var front=text.substring(0,45);
    var tail=text.substring(text.length-35);
    return front+' ... '+tail;
  }

  function addBookmark(){
    var doc=findDoc(currentDocId);
    if(!doc){toast('Hãy lưu tài liệu trước.');return;}

    var preview=bookmarkPreviewText();
    var promptText='Ghi chú dấu trang';
    if(preview){
      promptText+=':\n\n“'+preview+'”\n\nNhập ghi chú:';
    }else{
      promptText+=':\n\nNhập ghi chú:';
    }

    var note=window.prompt(promptText,'');
    if(note===null)return;

    if(!doc.bookmarks)doc.bookmarks=[];
    doc.bookmarks.push({
      id:'m'+new Date().getTime(),
      page:currentPage,
      note:trim(note)||'Dấu trang',
      excerpt:preview,
      savedAt:new Date().toISOString()
    });

    saveState();
    renderPage(currentPage);
    toast('Đã lưu dấu trang.');
  }
  function beginNavigationWait(button,text){
    if(navigationBusy)return false;
    navigationBusy=true;
    if(button){
      button.disabled=true;
      button.setAttribute('data-old-html',button.innerHTML);
      button.innerHTML='<span class="mini-spinner"></span> '+(text||'Đang mở...');
      addClass(button,'is-busy');
    }
    var status=id('navWaitStatus');
    if(status){
      status.innerHTML=text||'Đang mở...';
      status.style.display='block';
    }
    return true;
  }
  function endNavigationWait(button){
    navigationBusy=false;
    if(button){
      button.disabled=false;
      var old=button.getAttribute('data-old-html');
      if(old!==null)button.innerHTML=old;
      button.removeAttribute('data-old-html');
      removeClass(button,'is-busy');
    }
    var status=id('navWaitStatus');
    if(status)status.style.display='none';
  }

  function groupedBookmarks(doc){
    var groups={},marks=doc&&doc.bookmarks?doc.bookmarks:[],i,m,key;
    for(i=0;i<marks.length;i++){
      m=marks[i];
      key=String((Number(m.page)||0)+1);
      if(!groups[key])groups[key]=[];
      groups[key].push(m);
    }
    return groups;
  }

  function bookmarkTreeHtml(doc){
    var groups=groupedBookmarks(doc),pages=[],p,i,j,marks,m,html='';
    for(p in groups){
      if(groups.hasOwnProperty(p))pages.push(parseInt(p,10));
    }
    pages.sort(function(a,b){return a-b;});
    if(!pages.length)return '<div class="bookmark-empty">Chưa có dấu trang.</div>';

    for(i=0;i<pages.length;i++){
      p=pages[i];
      marks=groups[String(p)]||[];
      html+='<details class="bookmark-page-group">'+
          '<summary>Trang '+p+' <b>'+marks.length+'</b></summary>'+
          '<div class="bookmark-page-items">';
      for(j=0;j<marks.length;j++){
        m=marks[j];
        html+='<article class="bookmark-tree-item">'+
            '<button type="button" class="bookmark-open-btn" data-bookmark-doc="'+esc(String(doc.id))+'" data-bookmark-page="'+esc(String(m.page||0))+'">'+
            '<span class="bookmark-note">'+esc(m.note||'Dấu trang')+'</span>'+
            '<small class="bookmark-excerpt">'+esc(m.excerpt||'Không có đoạn trích đã lưu.')+'</small>'+
            '</button>'+
            '</article>';
      }
      html+='</div></details>';
    }
    return html;
  }

  function openBookmarkFromLibrary(docId,pageIndex,button){
    if(!beginNavigationWait(button,'Đang mở dấu trang...'))return;

    setTimeout(function(){
      var d=findDoc(docId);
      if(!d){endNavigationWait(button);return;}

      currentDocId=d.id;
      try{localStorage.setItem(LAST_DOC_KEY,String(d.id));}catch(e){}
      try{localStorage.setItem(LAST_DOC_KEY,String(d.id));}catch(e){}
      if(d.pages&&d.pages.length)currentPages=clonePages(d.pages);
      else if(d.html)currentPages=[String(d.html)];
      else currentPages=[''];

      var draft=loadDraftForDoc(d.id);
      if(draft&&draft.pages&&draft.pages.length)currentPages=clonePages(draft.pages);

      currentPage=parseInt(pageIndex,10);
      if(isNaN(currentPage)||currentPage<0||currentPage>=currentPages.length)currentPage=0;

      id('docTitle').value=(draft&&draft.title)?draft.title:(d.title||'Tài liệu');
      updateDraftStatus(!!draft);
      setView('reader');
      renderPage(currentPage);

      setTimeout(function(){
        try{id('editor').scrollIntoView(true);}catch(e){}
        endNavigationWait(button);
      },140);
    },30);
  }

  function renderLibrary(){
    var box=id('docList'),html='',i,d,pages,bookmarks;
    for(i=0;i<appState.documents.length;i++){
      d=appState.documents[i];
      pages=d.pages&&d.pages.length?d.pages:(d.html?[d.html]:['']);
      bookmarks=d.bookmarks||[];

      html+='<div class="doc-item library-doc">'+
          '<div class="library-doc-head">'+
          '<b>'+esc(d.title||'Tài liệu')+'</b>'+
          '<div class="small">'+pages.length+' trang · '+bookmarks.length+' dấu trang · OFFLINE</div>'+
          '<button data-open-doc="'+esc(String(d.id))+'">Mở tài liệu</button>'+
          '<button data-del-doc="'+esc(String(d.id))+'">Xóa</button>'+
          '</div>'+
          '<details class="bookmark-tree">'+
          '<summary>🔖 Dấu trang <b>'+bookmarks.length+'</b></summary>'+
          '<div class="bookmark-tree-body">'+bookmarkTreeHtml(d)+'</div>'+
          '</details>'+
          '</div>';
    }
    box.innerHTML=html||'<div class="small">Chưa có tài liệu offline.</div>';
  }
  function openDocument(docId,button){
    if(!beginNavigationWait(button,'Đang mở tài liệu...'))return;

    setTimeout(function(){
      var d=findDoc(docId);
      if(!d){endNavigationWait(button);return;}

      currentDocId=d.id;
      var savedPages;
      if(d.pages&&d.pages.length)savedPages=clonePages(d.pages);
      else if(d.html)savedPages=[String(d.html)];
      else savedPages=[''];

      var draft=loadDraftForDoc(d.id);
      if(draft&&draft.pages&&draft.pages.length){
        currentPages=clonePages(draft.pages);
        currentPage=parseInt(draft.currentPage,10);
        id('docTitle').value=draft.title||d.title||'Tài liệu';
        updateDraftStatus(true);
      }else{
        currentPages=savedPages;
        currentPage=parseInt(d.currentPage,10);
        id('docTitle').value=d.title||'Tài liệu';
        updateDraftStatus(false);
      }

      if(isNaN(currentPage))currentPage=0;
      if(currentPage<0||currentPage>=currentPages.length)currentPage=0;

      undoStacks={};redoStacks={};
      setView('reader');
      renderPage(currentPage);

      setTimeout(function(){endNavigationWait(button);},120);
    },30);
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
    var q=trim(id('memorySearch').value).toLowerCase(),html='',i,a,w,p,word,reading,romaji,vi,en,h;
    html+='<h3 class="memory-section-title">Câu / cụm từ đã lưu</h3>';
    for(i=0;i<appState.savedPhrases.length;i++){
      p=appState.savedPhrases[i];
      h=(String(p.source||'')+' '+String(p.hiragana||'')+' '+String(p.romaji||'')+' '+String(p.translationVi||'')+' '+String(p.translationEn||'')).toLowerCase();
      if(q&&h.indexOf(q)<0)continue;
      html+='<div class="memory-item saved-phrase"><b class="memory-jp">'+esc(p.source||'')+'</b>'+
          '<div class="small"><b>ひらがな:</b> '+esc(p.hiragana||'—')+'</div>'+
          '<div class="small"><b>Phát âm:</b> '+esc(p.romaji||'—')+'</div>'+
          '<div class="small"><b>VI:</b> '+esc(p.translationVi||'—')+'</div>'+
          '<div class="small"><b>EN:</b> '+esc(p.translationEn||'—')+'</div>'+
          '<div class="memory-actions"><button data-read-phrase="'+i+'">▶ Đọc</button><button data-open-phrase="'+i+'">Mở phân tích</button></div></div>';
    }
    html+='<h3 class="memory-section-title">Từ mới đã lưu</h3>';
    for(i=0;i<appState.savedWords.length;i++){
      w=appState.savedWords[i];word=w.word||w[0]||'';reading=w.reading||'';romaji=w.romaji||w.pronunciation||'';
      vi=w.meaningVi||'';en=w.meaningEn||w.meaning||w[1]||'';
      h=(word+' '+reading+' '+romaji+' '+vi+' '+en).toLowerCase();
      if(q&&h.indexOf(q)<0)continue;
      html+='<div class="memory-item saved-word"><b class="memory-jp">'+esc(word)+'</b>'+
          '<div class="small"><b>ひらがな:</b> '+esc(reading||'—')+'</div>'+
          '<div class="small"><b>Phát âm:</b> '+esc(romaji||'—')+'</div>'+
          '<div class="small"><b>VI:</b> '+esc(vi||'—')+'</div>'+
          '<div class="small"><b>EN:</b> '+esc(en||'—')+'</div>'+
          '<div class="memory-actions"><button data-read-word="'+i+'">▶ Đọc</button></div></div>';
    }
    html+='<h3 class="memory-section-title">Kết quả phân tích đã lưu</h3>';
    for(i=0;i<appState.analyses.length;i++){
      a=appState.analyses[i];
      h=(String(a.source||'')+' '+String(analysisReading(a))+' '+String(analysisRomaji(a))+' '+String(a.translationVi||'')+' '+String(a.translation||'')).toLowerCase();
      if(q&&h.indexOf(q)<0)continue;
      html+='<div class="memory-item saved-analysis"><b class="memory-jp">'+esc(a.source||'')+'</b>'+
          '<div class="small"><b>ひらがな:</b> '+esc(analysisReading(a)||'—')+'</div>'+
          '<div class="small"><b>Phát âm:</b> '+esc(analysisRomaji(a)||'—')+'</div>'+
          '<div class="small"><b>VI:</b> '+esc(a.translationVi||'—')+'</div>'+
          '<div class="small"><b>EN:</b> '+esc(a.translation||a.translationEn||'—')+'</div>'+
          '<div class="memory-actions"><button data-read-analysis="'+i+'">▶ Đọc</button><button data-open-analysis="'+i+'">Mở lại phân tích</button></div></div>';
    }
    id('memoryList').innerHTML=html;
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
    var words=a.words||a.vocabulary||[],html='',i,w,word,reading,romaji,vi,en,saved;
    for(i=0;i<words.length;i++){
      w=words[i];
      word=w.word||w.surface||w[0]||'';
      reading=w.reading||w.hiragana||'';
      romaji=w.romaji||w.pronunciation||'';
      vi=w.meaningVi||w.translationVi||'';
      en=w.meaningEn||w.meaning||w.translation||w[1]||'';
      saved=wordAlreadySaved(word,reading);

      html+='<span class="word'+(saved?' saved':'')+'" data-speak-card-index="'+i+'" title="Chạm để đọc">'+
          '<span class="word-cell">'+
          '<b class="surface">'+esc(word)+'</b>'+
          '<span class="reading"><b>ひらがな:</b> '+esc(reading||'—')+'</span>'+
          '<span class="pronunciation"><b>Phát âm:</b> '+esc(romaji||'—')+'</span>'+
          '</span>'+
          '<span class="meaning-vi"><b>VI:</b> '+esc(vi||'—')+'</span>'+
          '<span class="meaning-en"><b>EN:</b> '+esc(en||'—')+'</span>'+
          '<span class="word-actions">'+
          '<button type="button" class="speak-word-btn" data-word-index="'+i+'">▶ Đọc</button>'+
          '<button type="button" class="save-word-btn" data-save-word-index="'+i+'">'+(saved?'✓ Đã lưu':'＋ Lưu từ')+'</button>'+
          '</span>'+
          '</span>';
    }
    id('wordList').innerHTML=html||'<span class="small">Không có từ vựng.</span>';
    show(id('analysisPanel'));
  }
  function updateAnalysisConfirmCount(){
    var box=id('analysisConfirmText');
    var count=id('analysisConfirmCount');
    if(!box||!count)return;
    var len=String(box.value||'').length;
    count.innerHTML=len+' / 500 ký tự';
    count.style.color=len>500?'#8b3f36':'#315f55';
  }
  function openAnalysisConfirm(){
    if(analyzing)return;
    getSelectedText();
    if(selectedText.length<2){
      toast('Hãy chọn đoạn tiếng Nhật cần phân tích.');
      return;
    }
    var box=id('analysisConfirmText');
    var modal=id('analysisConfirmModal');
    var err=id('analysisConfirmError');
    if(box)box.value=selectedText;
    if(err)err.innerHTML='';
    updateAnalysisConfirmCount();
    if(modal){modal.style.display='block';addClass(modal,'is-open');}
    document.body.style.overflow='hidden';
    setTimeout(function(){try{box.focus();box.setSelectionRange(box.value.length,box.value.length);}catch(e){}},50);
  }
  function closeAnalysisConfirm(){
    var modal=id('analysisConfirmModal');
    if(modal){modal.style.display='none';removeClass(modal,'is-open');}
    document.body.style.overflow='';
  }
  function startConfirmedAnalysis(){
    var box=id('analysisConfirmText');
    var err=id('analysisConfirmError');
    var text=trim(box?box.value:'');
    if(text.length<2){
      if(err)err.innerHTML='Nội dung quá ngắn.';
      return;
    }
    if(text.length>500){
      if(err)err.innerHTML='Chỉ phân tích tối đa 500 ký tự.';
      return;
    }
    selectedText=text;
    closeAnalysisConfirm();
    analyzeConfirmed();
  }

  function analyze(){
    openAnalysisConfirm();
  }

  function analyzeConfirmed(){
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

  function speakJapaneseText(text){
    text=trim(text);
    if(!text)return;
    if(!window.speechSynthesis){toast('Safari này không hỗ trợ đọc giọng.');return;}
    try{
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(text);
      u.lang='ja-JP';u.rate=.80;
      window.speechSynthesis.speak(u);
    }catch(e){toast('Không phát được tiếng Nhật.');}
  }
  function analysisReading(a){return a?(a.hira||a.hiragana||a.reading||''):'';}
  function analysisRomaji(a){return a?(a.romaji||a.pronunciation||''):'';}
  function phraseAlreadySaved(source){
    var i;
    for(i=0;i<appState.savedPhrases.length;i++){
      if(String(appState.savedPhrases[i].source||'')===String(source||''))return true;
    }
    return false;
  }
  function saveCurrentPhrase(){
    if(!currentAnalysis)return;
    var source=currentAnalysis.source||selectedText||'';
    if(!source)return;
    if(phraseAlreadySaved(source)){toast('Câu/cụm từ này đã được lưu.');return;}
    appState.savedPhrases.unshift({
      id:'p'+new Date().getTime(),
      source:source,
      hiragana:analysisReading(currentAnalysis),
      romaji:analysisRomaji(currentAnalysis),
      translationVi:currentAnalysis.translationVi||'',
      translationEn:currentAnalysis.translation||currentAnalysis.translationEn||'',
      analysis:currentAnalysis,
      savedAt:new Date().toISOString()
    });
    saveState();
    toast('Đã lưu câu/cụm từ.');
  }
  function openSavedAnalysis(index){
    var a=appState.analyses[index];
    if(!a)return;
    currentAnalysis=a;selectedText=a.source||'';
    renderAnalysis(a);setView('reader');
    setTimeout(function(){try{id('analysisPanel').scrollIntoView(true);}catch(e){}},50);
  }
  function openSavedPhrase(index){
    var p=appState.savedPhrases[index];
    if(!p||!p.analysis)return;
    currentAnalysis=p.analysis;selectedText=p.source||'';
    renderAnalysis(p.analysis);setView('reader');
    setTimeout(function(){try{id('analysisPanel').scrollIntoView(true);}catch(e){}},50);
  }

  function speakWordByIndex(index){
    if(!currentAnalysis)return;
    var words=currentAnalysis.words||currentAnalysis.vocabulary||[];
    var w=words[index];
    if(!w)return;
    speakJapaneseText(w.reading||w.word||w[0]||'');
  }
  function wordAlreadySaved(word,reading){
    var i,w;
    for(i=0;i<appState.savedWords.length;i++){
      w=appState.savedWords[i];
      if(String(w.word||w[0]||'')===String(word||'') &&
          String(w.reading||'')===String(reading||''))return true;
    }
    return false;
  }
  function saveWordByIndex(index){
    if(!currentAnalysis)return;
    var words=currentAnalysis.words||currentAnalysis.vocabulary||[];
    var w=words[index];
    if(!w)return;
    var word=w.word||w[0]||'';
    var reading=w.reading||'';
    if(wordAlreadySaved(word,reading)){
      toast('Từ này đã được lưu.');
      return;
    }
    appState.savedWords.unshift({
      word:word,
      reading:reading,
      romaji:w.romaji||w.pronunciation||'',
      meaningVi:w.meaningVi||'',
      meaningEn:w.meaningEn||w.meaning||w[1]||'',
      source:currentAnalysis.source||'',
      savedAt:new Date().toISOString()
    });
    saveState();
    renderAnalysis(currentAnalysis);
    toast('Đã lưu từ '+word+'.');
  }

  function saveAnalysis(){
    if(!currentAnalysis)return;
    var source=currentAnalysis.source||selectedText||'',i,w,word,reading,exists=false;
    for(i=0;i<appState.analyses.length;i++){
      if(String(appState.analyses[i].source||'')===String(source)){exists=true;break;}
    }
    if(!exists){
      currentAnalysis.savedAt=new Date().toISOString();
      currentAnalysis.hiragana=analysisReading(currentAnalysis);
      currentAnalysis.romaji=analysisRomaji(currentAnalysis);
      appState.analyses.unshift(currentAnalysis);
      if(appState.analyses.length>100)appState.analyses.length=100;
    }
    var words=currentAnalysis.words||currentAnalysis.vocabulary||[];
    for(i=0;i<words.length;i++){
      w=words[i];word=w.word||w.surface||w[0]||'';reading=w.reading||w.hiragana||'';
      if(!wordAlreadySaved(word,reading)){
        appState.savedWords.unshift({
          word:word,reading:reading,romaji:w.romaji||w.pronunciation||'',
          meaningVi:w.meaningVi||w.translationVi||'',
          meaningEn:w.meaningEn||w.meaning||w.translation||w[1]||'',
          source:source,savedAt:new Date().toISOString()
        });
      }
    }
    if(!phraseAlreadySaved(source)){
      appState.savedPhrases.unshift({
        id:'p'+new Date().getTime(),source:source,
        hiragana:analysisReading(currentAnalysis),romaji:analysisRomaji(currentAnalysis),
        translationVi:currentAnalysis.translationVi||'',
        translationEn:currentAnalysis.translation||currentAnalysis.translationEn||'',
        analysis:currentAnalysis,savedAt:new Date().toISOString()
      });
    }
    saveState();
    toast('Đã lưu kết quả, câu/cụm từ và từ mới.');
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
    var b=id('logoutBtn');
    if(b){
      b.disabled=true;
      b.innerHTML='Đang thoát...';
    }

    function done(success){
      if(success){
        if(b){
          b.innerHTML='Đã thoát';
          b.style.background='#eef7f3';
          b.style.color='#315f55';
          b.style.borderColor='#9fc6b7';
        }
        usageLoaded=false;
        quotaLimit=null;
        quotaRemaining=null;
        renderQuota();
        updateAuthButtons(false);
        setTimeout(function(){window.location.reload();},350);
      }else{
        if(b){
          b.disabled=false;
          b.innerHTML='⎋ Thoát';
        }
        toast('Không thể đăng xuất. Vui lòng thử lại.');
      }
    }

    xhr('POST','/logout',null,{'X-Requested-With':'XMLHttpRequest'},function(status){
      if(status>=200&&status<400){
        done(true);
        return;
      }

      xhr('GET','/logout',null,{'X-Requested-With':'XMLHttpRequest'},function(status2){
        if(status2>=200&&status2<400||status2===0){
          /*
           * Some Spring Security logout responses are redirects that old Safari
           * exposes strangely. Re-check /usage before declaring success.
           */
          xhr('GET','/api/japanese-learning/usage?_logout='+new Date().getTime(),null,{
            'Accept':'application/json',
            'Cache-Control':'no-cache'
          },function(checkStatus){
            if(checkStatus===401)done(true);
            else done(status2===0);
          });
        }else{
          done(false);
        }
      });
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
  function jumpToPage(input){
    if(!input)return;
    var n=parseInt(input.value,10);
    if(isNaN(n)){input.value=String(currentPage+1);return;}
    if(n<1)n=1;
    if(n>currentPages.length)n=currentPages.length;
    renderPage(n-1);
  }

  function newDocument(){
    storeCurrentPage();
    currentDocId=null;
    currentPages=[''];
    currentPage=0;
    undoStacks={};redoStacks={};
    id('docTitle').value='Tài liệu chưa đặt tên';
    updateDraftStatus(true);
    renderPage(0);
    setView('reader');
  }

  function bind(){
    id('editor').onmouseup=getSelectedText;
    id('editor').onkeyup=getSelectedText;
    id('editor').ontouchend=function(){setTimeout(getSelectedText,100);};
    id('editor').oninput=function(){rememberEditorChange();getSelectedText();};
    id('undoEditBtn').onclick=function(){undoEdit();return false;};
    id('redoEditBtn').onclick=function(){redoEdit();return false;};
    id('docTitle').oninput=function(){saveDraftForCurrentDoc();};

    id('analyzeBtn').onclick=analyze;
    id('analyzeBtn2').onclick=function(e){
      if(e&&e.preventDefault)e.preventDefault();
      if(id('analyzeBtn')&&typeof id('analyzeBtn').onclick==='function'){
        return id('analyzeBtn').onclick();
      }
      return false;
    };
    id('analyzeBtn2').ontouchend=function(e){
      if(e&&e.preventDefault)e.preventDefault();
      if(id('analyzeBtn')&&typeof id('analyzeBtn').onclick==='function'){
        id('analyzeBtn').onclick();
      }
      return false;
    };
    id('analysisConfirmCancel').onclick=function(){closeAnalysisConfirm();return false;};
    id('analysisConfirmStart').onclick=function(){startConfirmedAnalysis();return false;};
    id('analysisConfirmText').onkeyup=updateAnalysisConfirmCount;
    id('analysisConfirmText').onchange=updateAnalysisConfirmCount;
    id('saveAnalysisBtn').onclick=saveAnalysis;
    id('savePhraseBtn').onclick=saveCurrentPhrase;
    id('readAnalysisBtn').onclick=function(){if(currentAnalysis)speakJapaneseText(currentAnalysis.source||analysisReading(currentAnalysis)||'');};
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
    id('offlineBackupBtn').onclick=exportOfflineBackup;
    id('homeBtn').onclick=function(){window.location.href='/';};
    id('memorySearch').onkeyup=renderMemory;
    id('memoryList').onclick=function(e){
      e=e||window.event;
      var t=e.target||e.srcElement,n;
      if(!t||!t.getAttribute)return;
      n=t.getAttribute('data-read-word');
      if(n!==null&&n!==''){var w=appState.savedWords[parseInt(n,10)];if(w)speakJapaneseText(w.reading||w.word||'');return;}
      n=t.getAttribute('data-read-phrase');
      if(n!==null&&n!==''){var p=appState.savedPhrases[parseInt(n,10)];if(p)speakJapaneseText(p.source||p.hiragana||'');return;}
      n=t.getAttribute('data-open-phrase');
      if(n!==null&&n!==''){openSavedPhrase(parseInt(n,10));return;}
      n=t.getAttribute('data-read-analysis');
      if(n!==null&&n!==''){var a=appState.analyses[parseInt(n,10)];if(a)speakJapaneseText(a.source||analysisReading(a)||'');return;}
      n=t.getAttribute('data-open-analysis');
      if(n!==null&&n!==''){openSavedAnalysis(parseInt(n,10));return;}
    };
    id('searchBox').onkeydown=function(e){e=e||window.event;if((e.keyCode||e.which)===13)searchCurrent();};

    var jumps=qsa('.pageJump'),j;
    for(j=0;j<jumps.length;j++){
      jumps[j].onchange=function(){jumpToPage(this);};
      jumps[j].onkeydown=function(e){
        e=e||window.event;
        if((e.keyCode||e.which)===13){jumpToPage(this);return false;}
      };
    }

    var i,els=qsa('.prevBtn');
    for(i=0;i<els.length;i++)els[i].onclick=function(){renderPage(currentPage-1);};
    els=qsa('.nextBtn');
    for(i=0;i<els.length;i++)els[i].onclick=function(){renderPage(currentPage+1);};
    /* Bottom bookmark is the canonical working handler. */
    id('bookmarkBottomBtn').onclick=addBookmark;
    id('bookmarkTopBtn').onclick=function(e){
      if(e&&e.preventDefault)e.preventDefault();
      return id('bookmarkBottomBtn').onclick();
    };
    id('bookmarkTopBtn').ontouchend=function(e){
      if(e&&e.preventDefault)e.preventDefault();
      id('bookmarkBottomBtn').onclick();
      return false;
    };

    id('wordList').onclick=function(e){
      e=e||window.event;
      var t=e.target||e.srcElement;
      var speakIndex=t.getAttribute('data-word-index');
      var saveIndex=t.getAttribute('data-save-word-index');
      if(speakIndex!==null&&speakIndex!=='')speakWordByIndex(parseInt(speakIndex,10));
      if(saveIndex!==null&&saveIndex!=='')saveWordByIndex(parseInt(saveIndex,10));
    };

    id('docList').onclick=function(e){
      e=e||window.event;
      var t=e.target||e.srcElement;
      while(t&&t!==id('docList')&&!t.getAttribute)t=t.parentNode;
      if(!t||!t.getAttribute)return;

      var open=t.getAttribute('data-open-doc');
      var del=t.getAttribute('data-del-doc');
      var bdoc=t.getAttribute('data-bookmark-doc');
      var bpage=t.getAttribute('data-bookmark-page');

      if(open){openDocument(open,t);return;}
      if(del){
        if(navigationBusy)return;
        deleteDocument(del);
        return;
      }
      if(bdoc!==null&&bdoc!==''&&bpage!==null&&bpage!==''){
        openBookmarkFromLibrary(bdoc,parseInt(bpage,10),t);
        return;
      }
    };
  }
  function init(){
    updateAuthButtons(false);
    var statusEl=id('jsStatus');
    if(statusEl)statusEl.innerHTML='JavaScript iPad 4: OK · Thư viện dùng chung';

    loadState();
    bind();
    renderLibrary();
    renderMemory();
    updateOfflineStatus();

    var lastDocId=null;
    try{lastDocId=localStorage.getItem(LAST_DOC_KEY);}catch(e){}

    if(lastDocId&&findDoc(lastDocId)){
      openDocument(lastDocId,null);
    }else if(appState.documents&&appState.documents.length){
      openDocument(appState.documents[0].id,null);
    }else{
      /*
       * Only use the HTML sample when there is absolutely no saved document.
       */
      currentDocId=null;
      currentPages=[id('editor').value||''];
      currentPage=0;
      updateDraftStatus(false);
      renderPage(0);
    }

    refreshQuota();
  }
  if(window.addEventListener){
    window.addEventListener('online',updateOfflineStatus,false);
    window.addEventListener('offline',updateOfflineStatus,false);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,false);
  }else{
    init();
  }
})();