(() => {
    'use strict';
    const $=id=>document.getElementById(id);
    const KEY='anhmedia.doc-sach.v1';
    const JS_VERSION='20260911-3';
    let state=loadLocal(), serverRevision=0, serverSynced=false, serverStateCache={};
    let currentId=null, pageIndex=0, pages=[], speech=null, sentenceIndex=-1, timerEnd=0, timerId=null;
    let lang='vi';
    let googleLoginPopup=null;
    let googleLoginPoll=null;
    let googleLoginTimeout=null;
    let pendingOcrAction=null;
    const OCR_USER_KEY='anhmedia.doc-sach.ocr-user';
    const OCR_TOKEN_KEY='anhmedia.doc-sach.ocr-token';

    function loadLocal(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return{documents:Array.isArray(x.documents)?x.documents:[]}}catch(_){return{documents:[]}}}
    function saveLocal(){localStorage.setItem(KEY,JSON.stringify(state));renderDocs();renderBookmarks();syncServerSoon()}
    function uid(){return `book-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}
    function current(){return state.documents.find(d=>d.id===currentId)}
    function isPdf(file){return file && ((file.type||'').toLowerCase()==='application/pdf'||/\.pdf$/i.test(file.name||''))}
    function setStatus(s){$('extractStatus').textContent=s||''}
    function toast(s){setStatus(s);clearTimeout(window._toast);window._toast=setTimeout(()=>setStatus(''),5000)}

    function renderDocs(){
        const el=$('docs'); el.innerHTML='';
        if(!state.documents.length){el.innerHTML='<small style="color:#68736f">Chưa có sách.</small>';return}
        [...state.documents].sort((a,b)=>new Date(b.updatedAt||0)-new Date(a.updatedAt||0)).forEach(d=>{
            const b=document.createElement('button');b.className='doc'+(d.id===currentId?' active':'');
            const pct=d.pages?.length?Math.round(((d.currentPage||0)/(d.pages.length-1||1))*100):0;
            b.innerHTML=`<strong>${esc(d.title||'Sách')}</strong><small>${d.pages?.length||0} trang · ${pct}%</small>`;
            b.onclick=()=>openDoc(d.id);el.appendChild(b);
        });
    }
    function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

    function openDoc(id){
        stopSpeech(false); const d=state.documents.find(x=>x.id===id);if(!d)return;
        currentId=id;pages=Array.isArray(d.pages)?d.pages.map(p=>typeof p==='string'?{pageNumber:0,text:p}:p):[];
        pageIndex=Math.max(0,Math.min(Number(d.currentPage)||0,Math.max(0,pages.length-1)));
        renderPage();renderDocs();renderBookmarks();$('left').classList.remove('open');
    }
    function renderPage(scroll=true){
        const d=current();if(!d)return;
        pageIndex=Math.max(0,Math.min(pageIndex,Math.max(0,pages.length-1)));d.currentPage=pageIndex;d.updatedAt=new Date().toISOString();
        const p=pages[pageIndex]||{text:''};$('title').textContent=d.title||'Sách';
        const label=`Trang ${pageIndex+1} / ${pages.length}`;$('pageLabel').textContent=label;$('pageLabel2').textContent=label;
        $('prev').disabled=$('prev2').disabled=pageIndex<=0;$('next').disabled=$('next2').disabled=pageIndex>=pages.length-1;
        $('pageJump').value=pageIndex+1;
        const text=String(p.text||'');$('paper').innerHTML=text?sentencesHtml(text):'<div class="empty">Trang này không có lớp văn bản nhận dạng.</div>';
        sentenceIndex=-1;updateProgress();
        if(scroll)document.querySelector('.reader').scrollTo({top:0,behavior:'smooth'});
        saveLocal();
    }
    function sentencesHtml(text){
        const parts=text.match(/[^.!?。！？…]+[.!?。！？…]+|[^.!?。！？…]+$/g)||[text];
        return parts.map((s,i)=>`<span class="sent" data-sent="${i}">${esc(s)}</span>`).join('');
    }
    function pageNext(dir){if(!pages.length)return;stopSpeech(false);pageIndex+=dir;renderPage();saveLocal()}

    function updateProgress(){
        const d=current();const pct=pages.length?((pageIndex)/(Math.max(1,pages.length-1))*100):0;
        $('progressRange').value=String(pct);$('percent').textContent=`${Math.round(pct)}%`;
        if(d){d.currentPage=pageIndex;d.readingPoint={pageIndex,sentenceIndex:Math.max(0,sentenceIndex),updatedAt:new Date().toISOString()}}
    }
    $('progressRange').oninput=()=>{if(!pages.length)return;pageIndex=Math.round((Number($('progressRange').value)/100)*Math.max(0,pages.length-1));renderPage(false)}
    $('prev').onclick=$('prev2').onclick=()=>pageNext(-1);$('next').onclick=$('next2').onclick=()=>pageNext(1);
    $('jumpBtn').onclick=()=>{const n=Math.max(1,Math.min(pages.length,Number($('pageJump').value)||1));stopSpeech(false);pageIndex=n-1;renderPage()}
    $('pageJump').onkeydown=e=>{if(e.key==='Enter')$('jumpBtn').click()};


    function saveOcrCredentials(userId,tokenId){
        try{sessionStorage.setItem(OCR_USER_KEY,userId||'');sessionStorage.setItem(OCR_TOKEN_KEY,tokenId||'')}catch(_){}
    }
    function loadOcrCredentials(){
        try{return{userId:sessionStorage.getItem(OCR_USER_KEY)||'',tokenId:sessionStorage.getItem(OCR_TOKEN_KEY)||''}}
        catch(_){return{userId:'',tokenId:''}}
    }
    function setAccountStatus(loggedIn){
        $('account').textContent=loggedIn?'Google signed in':'Local only';
        if(loggedIn)$('syncStatus').textContent='Đã kết nối tài khoản Google.';
    }
    async function googleSessionAuthenticated(){
        try{
            const r=await fetch('/api/japanese-learning/usage?_ocr_login='+Date.now(),{
                method:'GET',credentials:'same-origin',cache:'no-store',
                headers:{Accept:'application/json','Cache-Control':'no-cache,no-store'}
            });
            return r.ok;
        }catch(_){return false}
    }
    function setAuthModal(open){
        const modal=$('ocrAuthModal');if(!modal)return;
        modal.hidden=!open;
        if(open){
            const c=loadOcrCredentials();$('ocrUserId').value=c.userId;$('ocrTokenId').value=c.tokenId;
            $('ocrAuthError').hidden=true;
            googleSessionAuthenticated().then(ok=>{
                if(ok){setAccountStatus(true);$('ocrAuthStatus').textContent='✓ Đã đăng nhập Google. Có thể tiếp tục mà không cần token OCR.'}
                else $('ocrAuthStatus').textContent='Chưa đăng nhập Google. Bạn có thể dùng User ID + Token OCR.'
            });
            setTimeout(()=>$('ocrGoogleBtn')?.focus(),30);
        }else pendingOcrAction=null;
    }
    function clearGoogleWatch(){
        if(googleLoginPoll){clearInterval(googleLoginPoll);googleLoginPoll=null}
        if(googleLoginTimeout){clearTimeout(googleLoginTimeout);googleLoginTimeout=null}
    }
    function rememberLoginReturn(){
        try{
            const target=location.pathname+location.search+location.hash;
            document.cookie='PORTAL_LOGIN_RETURN='+encodeURIComponent(target)+'; Max-Age=600; Path=/; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
        }catch(_){}
    }
    async function finishGoogleLogin(){
        clearGoogleWatch();
        try{if(googleLoginPopup&&!googleLoginPopup.closed)googleLoginPopup.close()}catch(_){ }
        googleLoginPopup=null;
        setAccountStatus(true);
        const loginBtn=$('login');
        if(loginBtn)loginBtn.textContent='Google ✓';
        // The login action is complete: refresh the reader so the new server session is used.
        setTimeout(()=>location.reload(),250);
    }
    function openGoogleLoginPopup(){
        rememberLoginReturn();
        const w=520,h=700,left=Math.max(0,Math.round((window.screen.width-w)/2)),top=Math.max(0,Math.round((window.screen.height-h)/2));
        googleLoginPopup=window.open('/oauth2/authorization/google','anhmedia-google-login',
            `popup=yes,width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`);
        if(!googleLoginPopup){
            $('ocrAuthError').textContent='Trình duyệt đang chặn popup Google. Hãy cho phép popup rồi thử lại.';
            $('ocrAuthError').hidden=false;return;
        }
        try{googleLoginPopup.focus()}catch(_){}
        clearGoogleWatch();
        googleLoginPoll=setInterval(async()=>{
            if(await googleSessionAuthenticated()){await finishGoogleLogin();return}
            try{if(googleLoginPopup.closed){clearGoogleWatch();googleLoginPopup=null}}catch(_){}
        },1000);
        googleLoginTimeout=setTimeout(()=>{
            clearGoogleWatch();try{if(googleLoginPopup&&!googleLoginPopup.closed)googleLoginPopup.close()}catch(_){}
            googleLoginPopup=null;
        },180000);
    }
    async function beginOcrAction(action){
        pendingOcrAction=action;
        if(await googleSessionAuthenticated()){
            setAccountStatus(true);
            if(action==='file')$('file').click();else await extractUrl();
            pendingOcrAction=null;return;
        }
        setAuthModal(true);
    }
    async function continueOcrAuth(){
        const userId=$('ocrUserId')?.value.trim()||'', tokenId=$('ocrTokenId')?.value.trim()||'';
        if(!userId||!tokenId){
            const err=$('ocrAuthError');
            if(err){err.textContent='Vui lòng nhập User ID và Token OCR để chạy OCR.';err.hidden=false;}
            return;
        }
        saveOcrCredentials(userId,tokenId);
        const err=$('ocrAuthError');if(err)err.hidden=true;
        const action=pendingOcrAction||'file';
        setAuthModal(false);
        pendingOcrAction=null;
        if(action==='file') $('file')?.click();
        else if(action==='url') await extractUrl();
    }
    function getOcrCredentials(){
        const saved=loadOcrCredentials();
        return{userId:$('ocrUserId')?.value.trim()||saved.userId,tokenId:$('ocrTokenId')?.value.trim()||saved.tokenId};
    }

    async function extract(file){
        if(!isPdf(file)){toast('Chỉ nhận PDF.');return}
        $('progressWrap').hidden=false;$('progress').style.width='10%';setStatus('Đang đọc PDF theo từng trang...');
        const fd=new FormData();fd.append('file',file);fd.append('language','vie');
        const credentials=getOcrCredentials();
        if(credentials.userId&&credentials.tokenId){fd.append('userId',credentials.userId);fd.append('tokenId',credentials.tokenId);}
        try{
            const r=await fetch('/api/extract-text',{method:'POST',body:fd,credentials:'same-origin'});
            const data=await r.json().catch(()=>({}));
            if(r.status===401)throw new Error('Cần đăng nhập hoặc token OCR hợp lệ.');
            if(!r.ok||data.status!=='success')throw new Error(data.error||'Không thể trích xuất PDF');
            const extracted=(data.pages||[]).map((p,i)=>({pageNumber:Number(p.pageNumber)||i+1,text:String(p.text||'')}));
            if(!extracted.length)throw new Error('PDF không có trang nào.');
            const d={id:uid(),title:(file.name||'Sách').replace(/\.pdf$/i,''),pages:extracted,currentPage:0,bookmarks:[],readingPoint:{pageIndex:0,sentenceIndex:0},updatedAt:new Date().toISOString()};
            state.documents.unshift(d);currentId=d.id;pages=d.pages;pageIndex=0;
            $('progress').style.width='100%';renderPage();renderDocs();renderBookmarks();toast(`Đã tạo sách ${extracted.length} trang. Thứ tự trang được giữ nguyên.`);
        }catch(e){toast(e.message||'Lỗi trích xuất')}finally{$('progressWrap').hidden=true;$('file').value=''}
    }
    const uploadBtn=$('uploadBtn');
    if(uploadBtn) uploadBtn.onclick=()=>beginOcrAction('file');
    const fileInput=$('file');
    if(fileInput) fileInput.onchange=e=>extract(e.target.files[0]);

    async function extractUrl(){
        const resourceUrl=$('url').value.trim();if(!resourceUrl)return;
        setStatus('Đang tải PDF từ URL...');
        const credentials=getOcrCredentials();
        try{
            const r=await fetch('/api/extract-text/url',{
                method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
                body:JSON.stringify({resourceUrl,language:'vie',userId:credentials.userId,tokenId:credentials.tokenId})
            });
            const data=await r.json().catch(()=>({}));
            if(r.status===401){pendingOcrAction='url';setAuthModal(true);throw new Error('Cần đăng nhập Google hoặc nhập token OCR hợp lệ.')}
            if(!r.ok||data.status!=='success')throw new Error(data.error||'Không thể tải URL');
            const extracted=(data.pages||[]).map((p,i)=>({pageNumber:Number(p.pageNumber)||i+1,text:String(p.text||'')}));
            if(!extracted.length)throw new Error('PDF không có trang nào.');
            const d={id:uid(),title:(resourceUrl.split('/').pop()||'Sách').replace(/\.pdf.*$/i,''),pages:extracted,currentPage:0,bookmarks:[],readingPoint:{pageIndex:0,sentenceIndex:0},updatedAt:new Date().toISOString()};
            state.documents.unshift(d);currentId=d.id;pages=d.pages;pageIndex=0;renderPage();renderDocs();renderBookmarks();toast(`Đã tạo sách ${extracted.length} trang.`);
        }catch(e){toast(e.message||'Lỗi tải URL')}
    }
    const urlBtn=$('urlBtn');
    if(urlBtn) urlBtn.onclick=()=>beginOcrAction('url');

    function renderBookmarks(){
        const d=current();const el=$('bookmarks');el.innerHTML='';if(!d)return;
        (d.bookmarks||[]).forEach((m,i)=>{const b=document.createElement('button');b.className='mark';b.innerHTML=`🔖 Trang ${m.page+1}<small>${esc(m.note||m.excerpt||'')}</small>`;b.onclick=()=>{pageIndex=m.page;renderPage();};el.appendChild(b)});
    }
    $('bookmark').onclick=()=>{
        const d=current();if(!d)return;
        const excerpt=(pages[pageIndex]?.text||'').trim().slice(0,240);
        d.bookmarks=d.bookmarks||[];d.bookmarks.unshift({id:uid(),page:pageIndex,note:$('note').value.trim().slice(0,240),excerpt,createdAt:new Date().toISOString()});
        $('note').value='';saveLocal();toast(`Đã đánh dấu trang ${pageIndex+1}.`);
    };

    $('search').oninput=()=>{
        const q=$('search').value.trim().toLocaleLowerCase('vi-VN'),el=$('results');el.innerHTML='';if(!q)return;
        let count=0;pages.forEach((p,i)=>{const text=String(p.text||''),idx=text.toLocaleLowerCase('vi-VN').indexOf(q);if(idx>=0&&count<30){const b=document.createElement('button');b.className='result';b.innerHTML=`<b>Trang ${i+1}</b><span>${esc(text.slice(Math.max(0,idx-70),idx+180))}</span>`;b.onclick=()=>{pageIndex=i;renderPage();};el.appendChild(b);count++}});
        if(!count)el.innerHTML='<small style="color:#68736f">Không tìm thấy.</small>';
    };

    function isVietnameseVoice(v){
        return /^vi(?:-|_)/i.test(String(v?.lang||'')) ||
            /vietnam|tiếng việt|vietnamese/i.test(String(v?.name||''));
    }
    let availableVoices=[];

    function getVoices(){
        const select=$('voice');
        if(!select)return;
        const all=speechSynthesis.getVoices();
        const vi=all.filter(isVietnameseVoice);

        if(!all.length){
            select.innerHTML='<option value="">Đang tải giọng đọc...</option>';
            setTimeout(getVoices,250);
            return;
        }

        availableVoices=vi.length?vi:all;

        // Do not silently select the first system voice (for example de-DE).
        if(!vi.length){
            select.innerHTML='<option value="__missing__">🇻🇳 Tiếng Việt — chưa có giọng trên máy</option>';
            select.value='__missing__';
            select.title='Chrome chưa cung cấp giọng Tiếng Việt. Hãy cài giọng vi-VN trên hệ điều hành.';
            return;
        }

        select.title='Giọng đọc Tiếng Việt';
        select.innerHTML=vi.map((v,i)=>
            `<option value="${i}">🇻🇳 ${esc(v.name)} · ${esc(v.lang)} · Tiếng Việt</option>`
        ).join('');

        const preferred=vi.findIndex(v=>/^vi-VN$/i.test(String(v.lang||'')));
        select.value=String(preferred>=0?preferred:0);
    }

    function chosenVoice(){
        const all=speechSynthesis.getVoices();
        const vi=all.filter(isVietnameseVoice);
        if(!vi.length)return null;
        const selectedIndex=Number($('voice')?.value);
        return vi[selectedIndex>=0?selectedIndex:0] ||
            vi.find(v=>/^vi-VN$/i.test(String(v.lang||''))) || vi[0];
    }

    speechSynthesis.onvoiceschanged=getVoices;
    getVoices();
    setTimeout(getVoices,500);
    setTimeout(getVoices,1500);

    function pageSentences(){return [...$('paper').querySelectorAll('.sent')]}
    function speakFrom(idx=0){
        if(!pages.length||!('speechSynthesis'in window))return toast('Trình duyệt không hỗ trợ đọc thành tiếng.');
        const els=pageSentences();if(!els.length)return;
        speechSynthesis.cancel();sentenceIndex=Math.max(0,Math.min(idx,els.length-1));
        const text=els[sentenceIndex].textContent.trim();if(!text)return;
        els.forEach(x=>x.classList.remove('active'));els[sentenceIndex].classList.add('active');
        const voice=chosenVoice();
        if(!voice){
            toast('Chưa có giọng đọc Tiếng Việt (vi-VN) trên trình duyệt. Vui lòng cài giọng Tiếng Việt trên Debian/Chrome.');
            return;
        }
        const u=new SpeechSynthesisUtterance(text);
        u.lang='vi-VN';
        u.voice=voice;
        u.rate=Number($('speed').value);
        u.pitch=Number($('pitch').value);
        u.onend=()=>{if(timerExpired())return;sentenceIndex++;updateProgress();if(sentenceIndex<els.length)speakFrom(sentenceIndex);else if(pageIndex<pages.length-1){pageIndex++;renderPage();speakFrom(0)}else stopSpeech(false)};
        u.onerror=()=>{speech=null;els.forEach(x=>x.classList.remove('active'));};
        speech=u;speechSynthesis.speak(u);updateProgress();saveLocal();
    }
    function stopSpeech(save=true){speechSynthesis.cancel();speech=null;document.querySelectorAll('.sent.active').forEach(x=>x.classList.remove('active'));if(save)saveLocal()}
    $('play').onclick=()=>speakFrom(sentenceIndex>=0?sentenceIndex:0);
    $('pause').onclick=()=>speechSynthesis.paused?speechSynthesis.resume():speechSynthesis.pause();
    $('stop').onclick=()=>stopSpeech();
    $('speed').oninput=()=>{$('speedVal').textContent=Number($('speed').value).toFixed(2)+'×';if(speech){const idx=sentenceIndex;stopSpeech(false);setTimeout(()=>speakFrom(idx),50)}};
    $('pitch').oninput=()=>{$('pitchVal').textContent=Number($('pitch').value).toFixed(2);};
    function timerExpired(){return timerEnd&&Date.now()>=timerEnd}
    function startTimer(seconds){clearInterval(timerId);timerEnd=seconds?Date.now()+seconds*1000:0;timerId=timerEnd?setInterval(()=>{const left=Math.max(0,timerEnd-Date.now());$('timerDisplay').textContent=left?formatMs(left):'Đã hết giờ';if(!left){clearInterval(timerId);stopSpeech();}} ,1000):null;updateTimer()}
    function updateTimer(){if(!timerEnd){$('timerDisplay').textContent='Không hẹn giờ';return}const left=Math.max(0,timerEnd-Date.now());$('timerDisplay').textContent='Còn '+formatMs(left)}
    function formatMs(ms){const s=Math.ceil(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),x=s%60;return h?`${h}g ${m}p`:m?`${m}p ${x}s`:`${x}s`}
    $('timer').onchange=()=>{let v=$('timer').value;if(v==='custom'){const mins=Math.max(1,Number(prompt('Số phút đọc?','60'))||60);v=mins*60}startTimer(Number(v)||0)};

    async function loadServer(){
        try{
            const r=await fetch('/api/japanese-learning/state?_='+Date.now(),{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}});
            if(r.status===401){serverSynced=false;$('account').textContent='Local only';$('syncStatus').textContent='Đăng nhập Google để đồng bộ trên các thiết bị.';return}
            const data=await r.json();serverRevision=Number(data.revision)||0;serverSynced=true;$('account').textContent='Synced';$('syncStatus').textContent='Đã kết nối tài khoản Google.';
            if(data.state){const server=JSON.parse(data.state);serverStateCache=server;const remote=Array.isArray(server.docSachDocuments)?server.docSachDocuments:[];const map=new Map(state.documents.map(d=>[d.id,d]));remote.forEach(d=>{const old=map.get(d.id);if(!old||new Date(d.updatedAt||0)>new Date(old.updatedAt||0))map.set(d.id,d)});state.documents=[...map.values()];localStorage.setItem(KEY,JSON.stringify(state));renderDocs();if(!currentId&&state.documents[0])openDoc(state.documents[0].id)}
        }catch(_){$('syncStatus').textContent='Không kết nối máy chủ; vẫn đọc được bản cục bộ.'}
    }
    let syncTimer=null;
    function syncServerSoon(){if(!serverSynced)return;clearTimeout(syncTimer);syncTimer=setTimeout(syncServer,700)}
    async function syncServer(){
        const payload={...serverStateCache,docSachDocuments:state.documents};
        try{
            const r=await fetch('/api/japanese-learning/state',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({state:JSON.stringify(payload),baseRevision:serverRevision})});
            const data=await r.json().catch(()=>({}));
            if(r.status===409&&data.state){serverStateCache=JSON.parse(data.state);const remote=Array.isArray(serverStateCache.docSachDocuments)?serverStateCache.docSachDocuments:[];const rm=Array.isArray(remote.docSachDocuments)?remote.docSachDocuments:[];const map=new Map(state.documents.map(d=>[d.id,d]));rm.forEach(d=>{const old=map.get(d.id);if(!old||new Date(d.updatedAt||0)>new Date(old.updatedAt||0))map.set(d.id,d)});state.documents=[...map.values()];localStorage.setItem(KEY,JSON.stringify(state));serverRevision=Number(data.revision)||serverRevision;return syncServer()}
            if(r.ok){serverRevision=Number(data.revision)||serverRevision;serverStateCache.docSachDocuments=state.documents;}
        }catch(_){}
    }
    const syncNow=$('syncNow');
    if(syncNow) syncNow.onclick=()=>syncServer().then(()=>toast('Đã gửi trạng thái đọc lên máy chủ.'));
    const loginBtn=$('login');
    if(loginBtn){
        loginBtn.onclick=(e)=>{e.preventDefault();pendingOcrAction=null;openGoogleLoginPopup()};
    }

    const ocrGoogleBtn=$('ocrGoogleBtn');
    if(ocrGoogleBtn) ocrGoogleBtn.onclick=()=>openGoogleLoginPopup();
    const ocrAuthClose=$('ocrAuthClose');
    if(ocrAuthClose) ocrAuthClose.onclick=()=>setAuthModal(false);
    const ocrAuthCancel=$('ocrAuthCancel');
    if(ocrAuthCancel) ocrAuthCancel.onclick=()=>setAuthModal(false);
    const ocrAuthContinue=$('ocrAuthContinue');
    if(ocrAuthContinue) ocrAuthContinue.onclick=()=>continueOcrAuth();
    const ocrAuthModal=$('ocrAuthModal');
    if(ocrAuthModal) ocrAuthModal.addEventListener('click',e=>{if(e.target===ocrAuthModal)setAuthModal(false);});

    const menuBtn=$('menuBtn'); if(menuBtn) menuBtn.onclick=()=>$('left')?.classList.toggle('open');
    const viBtn=$('viBtn'); if(viBtn) viBtn.onclick=()=>setLang('vi');
    const enBtn=$('enBtn'); if(enBtn) enBtn.onclick=()=>setLang('en');
    function setLang(x){lang=x;document.documentElement.lang=x;document.querySelectorAll('[data-i18n]').forEach(e=>{const key=e.dataset.i18n;e.textContent=x==='en'?({library:'LIBRARY',upload:'Upload PDF',uploadHint:'Text or scanned PDF; source page order is preserved.',url:'PDF FROM URL',books:'YOUR BOOKS'}[key]||e.textContent):({library:'THƯ VIỆN',upload:'Tải PDF / Upload PDF',uploadHint:'PDF chữ hoặc PDF scan; hệ thống giữ nguyên thứ tự trang.',url:'PDF TỪ URL',books:'SÁCH CỦA BẠN'}[key]||e.textContent)})}
    setLang('vi');renderDocs();renderBookmarks();loadServer();
    googleSessionAuthenticated().then(ok=>{if(ok){setAccountStatus(true);const loginBtn=$('login');if(loginBtn)loginBtn.textContent='Google ✓';}});
    setInterval(updateTimer,1000);
    window.addEventListener('beforeunload',()=>{const d=current();if(d){d.currentPage=pageIndex;d.readingPoint={pageIndex,sentenceIndex};d.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(state))}});
})();
