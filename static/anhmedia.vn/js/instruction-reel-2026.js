(function(){
  'use strict';
  var viewer=document.getElementById('am-gallery-viewer');
  var cards=Array.prototype.slice.call(document.querySelectorAll('.am-tiktok-card'));
  if(!viewer||!cards.length)return;
  var mediaPanel=viewer.querySelector('.am-viewer-media-panel');
  var prev=viewer.querySelector('.am-viewer-item-prev');
  var next=viewer.querySelector('.am-viewer-item-next');
  var video=document.getElementById('am-viewer-video');
  var embed=document.getElementById('am-viewer-embed');
  var sideToggle=document.getElementById('am-side-toggle');
  var sideClose=document.getElementById('am-side-collapse');
  var share=document.getElementById('am-share-link');
  var wheelLock=false,touchX=0,touchY=0,touchMoved=false,videoBadge,gestureLayer;

  function clean(value){return(value||'').toString().trim()}
  function cardText(card){return[card.dataset.caption,card.dataset.description,card.dataset.skills,card.dataset.place,card.dataset.collaborators].map(clean).join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
  function normalize(value){return clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
  function visibleCardButton(card){return card&&card.querySelector('.am-card-button')}
  function move(direction){var button=direction>0?next:prev;if(button)button.click()}
  function pauseMedia(){if(video&&!video.paused)video.pause()}
  function playMedia(){if(video&&video.classList.contains('active')){video.muted=true;video.playsInline=true;video.play().catch(function(){})}}

  videoBadge=document.createElement('div');videoBadge.className='am-viewer-video-state';videoBadge.innerHTML='<i class="fa fa-play"></i>';viewer.appendChild(videoBadge);
  gestureLayer=document.createElement('div');gestureLayer.className='am-reel-gesture-layer';gestureLayer.setAttribute('aria-label','Vuốt lên hoặc xuống để đổi gallery; vuốt ngang để đổi ảnh');mediaPanel.appendChild(gestureLayer);
  function flashVideoState(icon){videoBadge.innerHTML='<i class="fa fa-'+icon+'"></i>';videoBadge.classList.add('show');window.clearTimeout(flashVideoState.timer);flashVideoState.timer=window.setTimeout(function(){videoBadge.classList.remove('show')},500)}
  if(video){video.addEventListener('loadeddata',playMedia);video.addEventListener('click',function(event){event.preventDefault();if(video.paused){video.play().catch(function(){});flashVideoState('play')}else{video.pause();flashVideoState('pause')}})}

  var observer=new MutationObserver(function(){pauseMedia();window.setTimeout(playMedia,80)});
  observer.observe(viewer,{subtree:true,attributes:true,attributeFilter:['src','class']});
  document.addEventListener('visibilitychange',function(){if(document.hidden)pauseMedia();else if(viewer.classList.contains('active'))playMedia()});

  viewer.addEventListener('wheel',function(event){
    if(!viewer.classList.contains('active')||wheelLock||Math.abs(event.deltaY)<32||event.target.closest('.am-viewer-side,.am-reel-search'))return;
    event.preventDefault();wheelLock=true;pauseMedia();move(event.deltaY>0?1:-1);window.setTimeout(function(){wheelLock=false},520)
  },{passive:false});
  gestureLayer.addEventListener('touchstart',function(event){if(event.touches.length!==1)return;touchX=event.touches[0].clientX;touchY=event.touches[0].clientY;touchMoved=false},{passive:true});
  gestureLayer.addEventListener('touchmove',function(event){if(event.touches.length!==1)return;var dx=event.touches[0].clientX-touchX,dy=event.touches[0].clientY-touchY;if(Math.abs(dx)>12||Math.abs(dy)>12)touchMoved=true},{passive:true});
  gestureLayer.addEventListener('touchend',function(event){var t=event.changedTouches[0],dx=t.clientX-touchX,dy=t.clientY-touchY;if(Math.abs(dy)>62&&Math.abs(dy)>Math.abs(dx)*1.15){pauseMedia();move(dy<0?1:-1)}},{passive:true});
  gestureLayer.addEventListener('click',function(){
    if(touchMoved){touchMoved=false;return}
    if(video&&video.classList.contains('active')){video.click();return}
    if(embed&&embed.classList.contains('active')){
      var current=embed.getAttribute('src')||'';
      if(current){embed.dataset.resumeSrc=current;embed.removeAttribute('src');flashVideoState('pause')}
      else if(embed.dataset.resumeSrc){embed.src=embed.dataset.resumeSrc;flashVideoState('play')}
    }
  });
  document.addEventListener('keydown',function(event){if(!viewer.classList.contains('active')||event.target.matches('input,textarea'))return;if(event.key==='ArrowDown'||event.key==='PageDown'){event.preventDefault();move(1)}if(event.key==='ArrowUp'||event.key==='PageUp'){event.preventDefault();move(-1)}if(event.key===' '&&video&&video.classList.contains('active')){event.preventDefault();video.click()}});

  if(sideToggle)sideToggle.addEventListener('click',function(){viewer.classList.toggle('comments-open')});
  if(sideClose)sideClose.addEventListener('click',function(){viewer.classList.remove('comments-open')});
  if(share)share.addEventListener('click',function(event){if(!navigator.share)return;event.preventDefault();navigator.share({title:clean(document.getElementById('am-viewer-caption').textContent)||'AnhMedia Gallery',url:share.href}).catch(function(){})});

  var searchToggle=document.createElement('button');searchToggle.type='button';searchToggle.className='am-reel-search-toggle';searchToggle.innerHTML='<i class="fa fa-search"></i>&nbsp;&nbsp; Tìm trong gallery';viewer.appendChild(searchToggle);
  var searchLayer=document.createElement('section');searchLayer.className='am-reel-search';searchLayer.setAttribute('aria-label','Tìm gallery');searchLayer.innerHTML='<div class="am-reel-search-bar"><input type="search" autocomplete="off" placeholder="Tìm tiêu đề, nội dung, kỹ năng..."><button type="button" aria-label="Đóng"><i class="fa fa-times"></i></button></div><div class="am-reel-results"></div>';viewer.appendChild(searchLayer);
  var input=searchLayer.querySelector('input'),results=searchLayer.querySelector('.am-reel-results'),close=searchLayer.querySelector('button');
  function renderResults(){var query=normalize(input.value),matched=cards.filter(function(card){return!query||cardText(card).indexOf(query)>=0});results.innerHTML='';if(!matched.length){results.innerHTML='<div class="am-reel-empty">Không tìm thấy gallery phù hợp.</div>';return}matched.slice(0,30).forEach(function(card){var result=document.createElement('button');result.type='button';result.className='am-reel-result';var poster=card.querySelector('.am-card-poster');result.innerHTML='<img alt=""><span><strong></strong><span></span></span>';result.querySelector('img').src=poster?poster.src:'';result.querySelector('strong').textContent=clean(card.dataset.caption)||'Gallery';result.querySelector('span span').textContent=clean(card.dataset.description).slice(0,100);result.addEventListener('click',function(){searchLayer.classList.remove('open');visibleCardButton(card).click()});results.appendChild(result)})}
  searchToggle.addEventListener('click',function(){searchLayer.classList.add('open');renderResults();input.focus()});close.addEventListener('click',function(){searchLayer.classList.remove('open')});input.addEventListener('input',renderResults);searchLayer.addEventListener('click',function(event){if(event.target===searchLayer)searchLayer.classList.remove('open')});

  window.setTimeout(function(){if(!viewer.classList.contains('active')){var first=visibleCardButton(cards.find(function(card){return!card.hidden}));if(first)first.click()}playMedia()},120);
})();
