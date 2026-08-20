(function(){
  'use strict';
  var KEY='anhmedia.jp-reader.v1',LAST='anhmedia.jp-reader.ipad4.last-doc.v1';
  var state={documents:[],analyses:[],savedWords:[]},pages=[''],page=0,docId=null,current=null,selected='',busy=false,limit=null,remaining=null,logged=false;

  function id(x){return document.getElementById(x)}
  function qs(s){return document.querySelectorAll(s)}
  function trim(s){return String(s||'').replace(/^\s+|\s+$/g,'')}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function toast(s){var t=id('toast');t.innerHTML=esc(s);t.style.display='block';clearTimeout(t._t);t._t=setTimeout(function(){t.style.display='none'},2200)}
  function xhr(m,u,b,h,cb){var x=new XMLHttpRequest();x.open(m,u,true);x.withCredentials=true;if(h)for(var k in h)if(h.hasOwnProperty(k))x.setRequestHeader(k,h[k]);x.onreadystatechange=function(){if(x.readyState===4)cb(x.status,x.responseText)};try{x.send(b||null)}catch(e){cb(0,'')}}
  function parse(s){try{return JSON.parse(s)}catch(e){return null}}

  function load(){
    try{var r=localStorage.getItem(KEY);if(r){var v=JSON.parse(r);if(v)state=v}}catch(e){}
    if(!state.documents)state.documents=[];if(!state.analyses)state.analyses=[];if(!state.savedWords)state.savedWords=[];
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast('Bộ nhớ Safari đầy.')}}
  function findDoc(x){var i;for(i=0;i<state.documents.length;i++)if(String(state.documents[i].id)===String(x))return state.documents[i];return null}
  function clone(a){var o=[],i;for(i=0;i<a.length;i++)o.push(String(a[i]||''));return o.length?o:['']}
  function storePage(){pages[page]=id('editor').value}

  function renderPage(n,skipStore){
    if(!skipStore)storePage();
    if(n<0)n=0;if(n>=pages.length)n=pages.length-1;page=n;
    id('editor').value=pages[page]||'';
    var i,l=qs('.pageLabel'),j=qs('.pageJump'),p=qs('.prev'),nx=qs('.next');
    for(i=0;i<l.length;i++)l[i].innerHTML=(page+1)+'/'+pages.length;
    for(i=0;i<j.length;i++){j[i].value=page+1;j[i].max=pages.length}
    for(i=0;i<p.length;i++)p[i].disabled=page===0;
    for(i=0;i<nx.length;i++)nx[i].disabled=page===pages.length-1;
    var d=findDoc(docId);if(d){d.currentPage=page;try{localStorage.setItem(LAST,String(d.id));save()}catch(e){}}
    selected='';buttons();
    try{id('readView').scrollIntoView(true);id('editor').scrollTop=0}catch(e){}
  }
  function openDoc(x){
    var d=findDoc(x);if(!d)return;
    docId=d.id;pages=d.pages&&d.pages.length?clone(d.pages):(d.html?[String(d.html)]:['']);page=parseInt(d.currentPage,10)||0;
    if(page>=pages.length)page=0;id('docTitle').value=d.title||'Tài liệu';try{localStorage.setItem(LAST,String(d.id))}catch(e){}
    view('read');renderPage(page,true);
  }
  function saveDoc(){
    storePage();var t=trim(id('docTitle').value)||'Tài liệu';
    if(docId===null)docId=new Date().getTime();
    var d=findDoc(docId);
    if(!d){d={id:docId,title:t,pages:clone(pages),bookmarks:[],currentPage:page};state.documents.unshift(d)}
    else{d.title=t;d.pages=clone(pages);d.currentPage=page}
    save();renderLibrary();toast('Đã lưu tài liệu.')
  }
  function bookmark(){
    var d=findDoc(docId);if(!d){toast('Lưu tài liệu trước.');return}
    getSelection();var x=trim(selected||id('editor').value),preview=x.length>90?x.substring(0,45)+' ... '+x.substring(x.length-35):x;
    var note=window.prompt('Ghi chú dấu trang:\n\n“'+preview+'”\n\nNhập ghi chú:','');if(note===null)return;
    if(!d.bookmarks)d.bookmarks=[];d.bookmarks.push({page:page,note:trim(note)||'Dấu trang',excerpt:preview});save();renderLibrary();toast('Đã lưu dấu trang.')
  }
  function renderLibrary(){
    var h='',i,d,j,b;
    for(i=0;i<state.documents.length;i++){
      d=state.documents[i];h+='<div class="item"><b>'+esc(d.title||'Tài liệu')+'</b><div class="small">'+((d.pages||[]).length)+' trang · '+((d.bookmarks||[]).length)+' dấu trang</div><button data-open="'+d.id+'">Mở</button>';
      if(d.bookmarks&&d.bookmarks.length){
        h+='<button data-showmarks="'+d.id+'">Dấu trang</button><div id="marks-'+d.id+'" class="bookmarks hidden">';
        for(j=0;j<d.bookmarks.length;j++){b=d.bookmarks[j];h+='<div class="bookmark"><b>Trang '+(Number(b.page)+1)+'</b><div>'+esc(b.note||'')+'</div><div class="small">'+esc(b.excerpt||'')+'</div><button data-markdoc="'+d.id+'" data-markpage="'+b.page+'">Mở dấu</button></div>'}
        h+='</div>'
      }
      h+='</div>'
    }
    id('docList').innerHTML=h||'<div class="small">Chưa có tài liệu.</div>'
  }
  function view(v){id('readView').className='panel hidden';id('savedView').className='panel hidden';id('libView').className='panel hidden';id('tabRead').className='';id('tabSaved').className='';id('tabLib').className='';if(v==='saved'){id('savedView').className='panel';id('tabSaved').className='active';renderSaved()}else if(v==='lib'){id('libView').className='panel';id('tabLib').className='active';renderLibrary()}else{id('readView').className='panel';id('tabRead').className='active'}}

  function quota(cb){xhr('GET','/api/japanese-learning/usage?_='+new Date().getTime(),null,{'Accept':'application/json','Cache-Control':'no-cache'},function(s,t){if(s===200){var d=parse(t);if(d){limit=Number(d.limit);remaining=Number(d.remaining);logged=true}}else if(s===401){logged=false;limit=null;remaining=null}auth();buttons();if(cb)cb(s===200)})}
  function auth(){id('limit').innerHTML=limit===null?'...':limit;id('remaining').innerHTML=remaining===null?'...':remaining;id('googleBtn').style.display=logged?'none':'inline-block';id('logoutBtn').style.display=logged?'inline-block':'none'}
  function buttons(){var ok=logged&&!busy&&selected.length>1&&selected.length<=500&&Number(remaining)>0;id('analyzeTop').disabled=!ok;id('analyzeBottom').disabled=!ok}
  function getSelection(){var e=id('editor'),a=e.selectionStart,b=e.selectionEnd;selected=(typeof a==='number'&&b>a)?trim(e.value.substring(a,b)):'';buttons()}

  function openConfirm(){getSelection();if(selected.length<2){toast('Hãy chọn đoạn cần phân tích.');return}id('confirmText').value=selected;id('confirmCount').innerHTML=selected.length+'/500';id('confirmModal').style.display='block'}
  function analyze(){var t=trim(id('confirmText').value);if(t.length<2||t.length>500){toast('Nội dung phải từ 2 đến 500 ký tự.');return}selected=t;id('confirmModal').style.display='none';quota(function(ok){if(!ok||remaining<=0){toast('Không còn lượt hoặc chưa đăng nhập.');return}busy=true;buttons();id('waitText').innerHTML=esc(selected);id('waitModal').style.display='block';xhr('POST','/api/japanese-learning/analyze',JSON.stringify({text:selected,mode:'selection'}),{'Content-Type':'application/json','Accept':'application/json'},function(s,r){var d=parse(r);if(s===200&&d){if(!d.source)d.source=selected;renderResult(d)}else toast(d&&d.error?d.error:'Không thể phân tích.');quota(function(){busy=false;id('waitModal').style.display='none';buttons()})})})}
  function renderResult(a){current=a;id('src').innerHTML=esc(a.source||'');id('hira').innerHTML=esc(a.hira||a.hiragana||'');id('vi').innerHTML=esc(a.translationVi||'');id('en').innerHTML=esc(a.translation||a.translationEn||'');var w=a.words||a.vocabulary||[],h='',i,x;for(i=0;i<w.length;i++){x=w[i];h+='<span class="word" data-word="'+i+'"><b class="jp">'+esc(x.word||x.surface||x[0]||'')+'</b><div class="read">'+esc(x.reading||x.hiragana||'—')+'</div><div class="romaji">'+esc(x.romaji||x.pronunciation||'—')+'</div><div>VI: '+esc(x.meaningVi||'—')+'</div><div>EN: '+esc(x.meaningEn||x.meaning||'—')+'</div><button data-speak="'+i+'">▶ Đọc</button><button data-saveword="'+i+'">Lưu</button></span>'}id('words').innerHTML=h;id('result').className=''}
  function speak(t){if(!window.speechSynthesis){toast('Không hỗ trợ đọc giọng.');return}try{window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang='ja-JP';u.rate=.8;window.speechSynthesis.speak(u)}catch(e){}}
  function saveWord(i){if(!current)return;var w=(current.words||current.vocabulary||[])[i];if(!w)return;state.savedWords.unshift({word:w.word||w.surface||w[0]||'',reading:w.reading||'',romaji:w.romaji||w.pronunciation||'',meaningVi:w.meaningVi||'',meaningEn:w.meaningEn||w.meaning||'',source:current.source||''});save();toast('Đã lưu từ.')}
  function saveAll(){if(!current)return;current.savedAt=new Date().toISOString();state.analyses.unshift(current);if(state.analyses.length>80)state.analyses.length=80;var w=current.words||current.vocabulary||[],i;for(i=0;i<w.length;i++)saveWord(i);save();toast('Đã lưu kết quả.')}
  function renderSaved(){
    var q=trim(id('savedSearch').value).toLowerCase(),h='',i,x;

    h+='<h3>Câu / kết quả</h3>';
    for(i=0;i<state.analyses.length;i++){
      x=state.analyses[i];
      if(q&&String(x.source||'').toLowerCase().indexOf(q)<0)continue;
      h+='<div class="item saved-entry" data-saved-type="analysis" data-saved-index="'+i+'">'+
          '<input class="saved-check" type="checkbox" data-check-type="analysis" data-check-index="'+i+'">'+
          '<div class="saved-item-body"><b>'+esc(x.source||'')+'</b>'+
          '<div>'+esc(x.hira||x.hiragana||'')+'</div>'+
          '<div class="small">'+esc(x.translationVi||'')+'</div>'+
          '<button data-readanalysis="'+i+'">▶ Đọc</button>'+
          '<button data-openanalysis="'+i+'">Mở lại</button></div></div>';
    }

    h+='<h3>Từ mới</h3>';
    for(i=0;i<state.savedWords.length;i++){
      x=state.savedWords[i];
      if(q&&String(x.word||'').toLowerCase().indexOf(q)<0)continue;
      h+='<div class="item saved-entry" data-saved-type="word" data-saved-index="'+i+'">'+
          '<input class="saved-check" type="checkbox" data-check-type="word" data-check-index="'+i+'">'+
          '<div class="saved-item-body"><b>'+esc(x.word||'')+'</b>'+
          '<div>'+esc(x.reading||'')+' · '+esc(x.romaji||'')+'</div>'+
          '<div class="small">VI: '+esc(x.meaningVi||'')+' / EN: '+esc(x.meaningEn||'')+'</div>'+
          '<button data-readsavedword="'+i+'">▶ Đọc</button></div></div>';
    }

    id('savedList').innerHTML=h;
    updateSavedSelectedCount();
  }

  function savedChecks(){
    return qs('#savedList .saved-check');
  }
  function updateSavedSelectedCount(){
    var checks=savedChecks(),i,n=0;
    for(i=0;i<checks.length;i++){
      if(checks[i].checked){
        n++;
        var p=checks[i].parentNode;
        if(p&&p.className.indexOf('saved-selected')<0)p.className+=' saved-selected';
      }else{
        var p2=checks[i].parentNode;
        if(p2)p2.className=p2.className.replace(' saved-selected','');
      }
    }
    id('savedSelectedCount').innerHTML=n+' đã chọn';
  }
  function setAllSavedChecks(value){
    var checks=savedChecks(),i;
    for(i=0;i<checks.length;i++)checks[i].checked=value;
    updateSavedSelectedCount();
  }
  function deleteSelectedSaved(){
    var checks=savedChecks(),i,analysisIndexes=[],wordIndexes=[],type,index;

    for(i=0;i<checks.length;i++){
      if(!checks[i].checked)continue;
      type=checks[i].getAttribute('data-check-type');
      index=parseInt(checks[i].getAttribute('data-check-index'),10);
      if(type==='analysis')analysisIndexes.push(index);
      if(type==='word')wordIndexes.push(index);
    }

    if(!analysisIndexes.length&&!wordIndexes.length){
      toast('Chưa chọn mục để xóa.');
      return;
    }

    if(!window.confirm('Xóa '+(analysisIndexes.length+wordIndexes.length)+' mục đã chọn?'))return;

    analysisIndexes.sort(function(a,b){return b-a});
    wordIndexes.sort(function(a,b){return b-a});

    for(i=0;i<analysisIndexes.length;i++){
      if(analysisIndexes[i]>=0&&analysisIndexes[i]<state.analyses.length)state.analyses.splice(analysisIndexes[i],1);
    }
    for(i=0;i<wordIndexes.length;i++){
      if(wordIndexes[i]>=0&&wordIndexes[i]<state.savedWords.length)state.savedWords.splice(wordIndexes[i],1);
    }

    save();
    renderSaved();
    toast('Đã xóa mục đã chọn.');
  }

  function google(){var p=window.open('/oauth2/authorization/google','glogin','width=520,height=700');var n=0,t=setInterval(function(){n++;quota(function(ok){if(ok){clearInterval(t);try{p.close()}catch(e){};window.location.reload()}});if(n>40)clearInterval(t)},1500)}
  function logout(){xhr('POST','/logout',null,{'X-Requested-With':'XMLHttpRequest'},function(){logged=false;auth();window.location.reload()})}

  function pdfOpen(){id('pdfModal').style.display='block'}
  function creds(){var u=trim(id('ocrUser').value),t=trim(id('ocrToken').value);if(!u||!t){id('pdfError').innerHTML='Nhập User ID và Token.';return null}return {userId:u,tokenId:t}}
  function extracted(text,title){docId=new Date().getTime();pages=[];var p=0;while(p<text.length){pages.push(text.substring(p,p+1800));p+=1800}if(!pages.length)pages=[''];page=0;id('docTitle').value=title||'PDF';state.documents.unshift({id:docId,title:id('docTitle').value,pages:clone(pages),bookmarks:[],currentPage:0});save();id('pdfModal').style.display='none';renderPage(0,true)}
  function pdfUrl(){var c=creds(),u=trim(id('pdfUrl').value);if(!c||!u)return;xhr('POST','/api/extract-text/url',JSON.stringify({resourceUrl:u,language:'jpn',userId:c.userId,tokenId:c.tokenId}),{'Content-Type':'application/json'},function(s,r){var d=parse(r);if(s===200&&d&&d.status==='success')extracted(d.text||'','PDF URL');else id('pdfError').innerHTML='Không trích xuất được.'})}
  function pdfFile(){var c=creds(),f=id('pdfFile').files&&id('pdfFile').files[0];if(!c||!f)return;var fd=new FormData();fd.append('file',f);fd.append('language','jpn');fd.append('userId',c.userId);fd.append('tokenId',c.tokenId);var x=new XMLHttpRequest();x.open('POST','/api/extract-text',true);x.onreadystatechange=function(){if(x.readyState===4){var d=parse(x.responseText);if(x.status===200&&d&&d.status==='success')extracted(d.text||'',f.name);else id('pdfError').innerHTML='Không trích xuất được.'}};x.send(fd)}

  function bind(){
    id('editor').onmouseup=getSelection;id('editor').onkeyup=getSelection;id('editor').ontouchend=function(){setTimeout(getSelection,80)};
    id('analyzeTop').onclick=openConfirm;id('analyzeBottom').onclick=openConfirm;id('confirmCancel').onclick=function(){id('confirmModal').style.display='none'};id('confirmStart').onclick=analyze;id('confirmText').onkeyup=function(){id('confirmCount').innerHTML=this.value.length+'/500'};
    id('saveDoc').onclick=saveDoc;id('speakSel').onclick=function(){getSelection();if(selected)speak(selected)};id('saveAll').onclick=saveAll;id('readAll').onclick=function(){if(current)speak(current.source||'')};
    id('tabRead').onclick=function(){view('read')};id('tabSaved').onclick=function(){view('saved')};id('tabLib').onclick=function(){view('lib')};id('savedSearch').onkeyup=renderSaved;
    id('googleBtn').onclick=google;id('logoutBtn').onclick=logout;
    id('pdfBtn').onclick=pdfOpen;id('pdfClose').onclick=function(){id('pdfModal').style.display='none'};id('pdfUrlGo').onclick=pdfUrl;id('pdfFileGo').onclick=pdfFile;
    var i,a=qs('.prev');for(i=0;i<a.length;i++)a[i].onclick=function(){renderPage(page-1)};a=qs('.next');for(i=0;i<a.length;i++)a[i].onclick=function(){renderPage(page+1)};a=qs('.bookmarkBtn');for(i=0;i<a.length;i++)a[i].onclick=bookmark;a=qs('.pageJump');for(i=0;i<a.length;i++){a[i].onchange=function(){var n=parseInt(this.value,10);if(!isNaN(n))renderPage(n-1)};a[i].onkeydown=function(e){e=e||window.event;if((e.keyCode||e.which)===13){var n=parseInt(this.value,10);if(!isNaN(n))renderPage(n-1);return false}}}
    id('docList').onclick=function(e){e=e||window.event;var t=e.target||e.srcElement;if(!t.getAttribute)return;var x=t.getAttribute('data-open'),s=t.getAttribute('data-showmarks'),md=t.getAttribute('data-markdoc'),mp=t.getAttribute('data-markpage');if(x){openDoc(x);return}if(s){var m=id('marks-'+s);m.className=m.className.indexOf('hidden')>=0?'bookmarks':'bookmarks hidden';return}if(md!==null&&mp!==null){openDoc(md);renderPage(parseInt(mp,10),true)}};
    id('words').onclick=function(e){e=e||window.event;var t=e.target||e.srcElement;if(!t.getAttribute)return;var s=t.getAttribute('data-speak'),sv=t.getAttribute('data-saveword');if(s!==null){var w=(current.words||current.vocabulary||[])[parseInt(s,10)];if(w)speak(w.reading||w.word||'')}if(sv!==null)saveWord(parseInt(sv,10))};
    id('savedList').onclick=function(e){
      e=e||window.event;
      var t=e.target||e.srcElement;
      if(!t||!t.getAttribute)return;
      if(t.className&&String(t.className).indexOf('saved-check')>=0){
        updateSavedSelectedCount();
        return;
      }
      var r=t.getAttribute('data-readanalysis'),o=t.getAttribute('data-openanalysis'),w=t.getAttribute('data-readsavedword');
      if(r!==null){var a=state.analyses[parseInt(r,10)];if(a)speak(a.source||'')}
      if(o!==null){current=state.analyses[parseInt(o,10)];renderResult(current);view('read')}
      if(w!==null){var z=state.savedWords[parseInt(w,10)];if(z)speak(z.reading||z.word||'')}
    };
  }
  function init(){load();bind();renderLibrary();var last=null;try{last=localStorage.getItem(LAST)}catch(e){};if(last&&findDoc(last))openDoc(last);else if(state.documents.length)openDoc(state.documents[0].id);else{pages=[id('editor').value||''];renderPage(0,true)}quota()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,false);else init();
})();