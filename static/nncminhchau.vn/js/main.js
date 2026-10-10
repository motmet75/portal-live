/* Suzuki multi-model scroll showcase. Models load on demand. */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('gl');
  var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  // Studio-style environment so metal and gloss panels pick up reflections
  (function(){
    var env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(20,24,16), new THREE.MeshBasicMaterial({color:0x16384a, side:THREE.BackSide})));
    function panel(c,w,h,x,y,z){var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);env.add(m);}
    panel(0xffffff,14,6,0,12,4); panel(0xbfe6ff,4,14,-12,2,2); panel(0xffd9b0,4,10,12,0,-4); panel(0x3db8ff,10,3,0,-8,8);
    var pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(env,0.04).texture;
  })();
  scene.add(new THREE.HemisphereLight(0xcfeaff,0x04121b,0.5));
  var key = new THREE.DirectionalLight(0xffffff,1.4); key.position.set(3,4,5); scene.add(key);
  var rim = new THREE.DirectionalLight(0x3db8ff,1.2); rim.position.set(-4,1,-4); scene.add(rim);

  var spot = new THREE.SpotLight(0xfff1dc,3,0,0.38,0.7,0); spot.position.set(1.5,3.4,3.2); scene.add(spot); scene.add(spot.target);
  var headFill = new THREE.PointLight(0x3db8ff,0,8,0); headFill.position.set(-1.6,1.8,1.6); scene.add(headFill);
  var headBack = new THREE.PointLight(0xffffff,0,8,0); headBack.position.set(1.4,2.0,-2.2); scene.add(headBack);
  var glow=document.getElementById('glow'), hv=new THREE.Vector3();
  var pivot = new THREE.Group(); scene.add(pivot);

  // Bubbles for the underwater part of the scroll
  var N=140, bp=new Float32Array(N*3), bs=new Float32Array(N);
  for(var i=0;i<N;i++){bp[i*3]=(Math.random()-.5)*5;bp[i*3+1]=Math.random()*5-2.5;bp[i*3+2]=(Math.random()-.5)*4;bs[i]=.15+Math.random()*.5;}
  var bg=new THREE.BufferGeometry(); bg.setAttribute('position',new THREE.BufferAttribute(bp,3));
  var bm=new THREE.PointsMaterial({color:0xcfeaff,size:.035,transparent:true,opacity:0,depthWrite:false});
  var bubbles=new THREE.Points(bg,bm); scene.add(bubbles);

  // Camera path, indexed by scroll progress (0 to 1)
  var K=[
    {t:0,   ry:-0.6, x:1.15, cy:0.0,  cz:5.8, ty:0.0},
    {t:.25, ry:0.9,  x:-1.0, cy:0.85, cz:3.0, ty:0.75},
    {t:.5,  ry:2.3,  x:1.0,  cy:0.2,  cz:4.8, ty:0.1},
    {t:.75, ry:4.25, x:-0.8, cy:-0.7, cz:2.5, ty:-0.78},
    {t:1,   ry:6.0,  x:1.6,  cy:0.0,  cz:6.2, ty:0.0}
  ];
  function ease(u){return u*u*(3-2*u);}
  function sample(p){
    for(var i=0;i<K.length-1;i++){
      if(p<=K[i+1].t){var a=K[i],b=K[i+1],u=ease((p-a.t)/(b.t-a.t)),o={};
        for(var k in a){if(k!=='t')o[k]=a[k]+(b[k]-a[k])*u;} return o;}
    }
    return K[K.length-1];
  }
  var skyTop=new THREE.Color(0x27506a), deepTop=new THREE.Color(0x06202e), c=new THREE.Color();
  var sky=document.getElementById('sky');

  var light=false, lTop=new THREE.Color(0xffffff), lDeep=new THREE.Color(0xc4dae6), mode=document.getElementById('mode');
  renderer.toneMappingExposure=1.1; bm.color.set(0xcfeaff);
  var target=0, cur=0;
  function onScroll(){var h=document.documentElement.scrollHeight-innerHeight;target=h>0?Math.min(1,Math.max(0,scrollY/h)):0;}
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  function resize(){var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  addEventListener('resize',resize); resize();

  var t0=performance.now();
  // Propeller spin. SPIN_DIR -1 = clockwise seen from behind the boat, 1 = counter-clockwise. Speeds are radians per second.
  var SPIN_DIR=-1, SPIN_IDLE=1.2, SPIN_BOOST=7;
  // DF30, DF25 and DF6 GLBs use local Y for the propeller shaft.
  // DF250 and DF200 keep their existing automatically detected axes.
  var PROPELLER_AXIS_OVERRIDE={'30':'y','25':'y','6':'y'};
  var lastT=performance.now(), active=null, introRot=0;
  function frame(now){
    requestAnimationFrame(frame);
    cur += (target-cur)*0.07;
    var s=sample(cur), narrow=camera.aspect<0.9;
    var dt=Math.min(0.05,(now-lastT)/1000); lastT=now;
    if(active){
      if(active.spin&&!reduce){ // faster while the lower unit is on screen
        active.spin.angle+=SPIN_DIR*dt*(SPIN_IDLE+SPIN_BOOST*Math.exp(-Math.pow((cur-.75)/.14,2)));
        active.spin.g.rotation[active.spin.axis]=active.spin.angle;
      }
      if(active.t<1)active.t=Math.min(1,active.t+dt/0.9);
      var e=1-Math.pow(1-active.t,3); // reveal: grows and turns into place
      active.holder.scale.setScalar(active.sc*(0.92+0.08*e)); introRot=reduce?0:(1-e)*0.8;
    }
    var idle = reduce?0:Math.sin((now-t0)/2400)*0.08;
    pivot.rotation.y = s.ry + idle + introRot;
    pivot.position.x = narrow?0:s.x;
    pivot.position.y = narrow?0.55:0;  // lift the motor above the text on phones
    camera.position.set(0, s.cy, narrow?s.cz*1.25:s.cz);
    camera.lookAt(0, s.ty, 0);
    var boost=Math.exp(-Math.pow((cur-.25)/.13,2)), heroLit=Math.exp(-Math.pow(cur/.1,2));
    var lit=Math.max(boost,heroLit*.55);
    spot.intensity=2.4+boost*8; spot.position.x=pivot.position.x+1.5; spot.target.position.set(pivot.position.x,0.9+pivot.position.y,0);
    headFill.intensity=.6+boost*3.5; headBack.intensity=.5+boost*3;
    headFill.position.x=pivot.position.x-1.6; headBack.position.x=pivot.position.x+1.4;
    hv.set(pivot.position.x,0.85+pivot.position.y,0).project(camera);
    glow.style.transform='translate('+((hv.x+1)/2*innerWidth)+'px,'+((1-hv.y)/2*innerHeight)+'px) scale('+(.7+lit*.6)+')';
    glow.style.opacity=(lit*.85).toFixed(3);
    var depth=ease(Math.min(1,Math.max(0,(cur-.5)/.3)));
    if(light){c.copy(lTop).lerp(lDeep,depth);sky.style.background='linear-gradient(180deg,#'+c.getHexString()+' 0%,#eaf2f6 '+(55-depth*25)+'%,#b4ccd9 100%)';}
    else{c.copy(skyTop).lerp(deepTop,depth);sky.style.background='linear-gradient(180deg,#'+c.getHexString()+' 0%,#0c2a3a '+(55-depth*25)+'%,#04121b 100%)';}
    bm.opacity=depth*(light?0.6:0.7);
    if(!reduce){var a=bg.attributes.position;for(var i=0;i<N;i++){var y=a.array[i*3+1]+bs[i]*0.008;if(y>2.8)y=-2.8;a.array[i*3+1]=y;}a.needsUpdate=true;}
    renderer.render(scene,camera);
  }


  // ---------- Finishes (carbon black / pearl white) ----------
  function mk(o){o.side=THREE.DoubleSide;if(!o.envMapIntensity)o.envMapIntensity=1.3;return new THREE.MeshPhysicalMaterial(o);}
  var FIN={
    carbon:{body:mk({color:0x060708,metalness:0.25,roughness:0.34,clearcoat:1,clearcoatRoughness:0.05,envMapIntensity:0.75}),
      emblem:mk({color:0x59626c,metalness:1,roughness:0.22,envMapIntensity:1.6})},
    white:{body:mk({color:0xf4f6f8,metalness:0.1,roughness:0.24,clearcoat:1,clearcoatRoughness:0.05,envMapIntensity:1.2}),
      emblem:mk({color:0x14181d,metalness:0.8,roughness:0.3})}
  };
  var EDGE={carbon:new THREE.LineBasicMaterial({color:0x8aa0ae,transparent:true,opacity:0.3}),
    white:new THREE.LineBasicMaterial({color:0x0b2230,transparent:true,opacity:0.28})};
  var graphite=mk({color:0x2b333a,metalness:0.7,roughness:0.38}), chrome=mk({color:0xffffff,metalness:1,roughness:0.08}), cache={};
  var finish='white', finishAuto=true;   // auto = pick the finish that contrasts with the page theme until the visitor chooses
  var BODY=/Lower_Cowl_And_Leg|Removable_Upper_Cowling|SideMatched_(Gearcase|Skeg|Lower_Adapter|Leg_Flange)/;
  var EMBL=/Brand_SUZUKI|Horsepower_|Badge_.*Face/;
  var EDGES=/Lower_Cowl_And_Leg|Removable_Upper_Cowling|Lower_Adapter|Gearcase/;
  function applyFinish(){
    for(var id in models){var M=models[id];if(!M.holder)continue;
      M.body.forEach(function(o){o.material=FIN[finish].body;});
      M.emb.forEach(function(o){o.material=FIN[finish].emblem;});
      M.edges.forEach(function(l){l.material=EDGE[finish];});}
    [].forEach.call(document.querySelectorAll('[data-finish]'),function(b){var on=b.getAttribute('data-finish')===finish;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  }
  function setFinish(f,byUser){finish=f;if(byUser)finishAuto=false;applyFinish();}

  // ---------- Models: load the page first, DF250 next, DF200 in the background ----------
  var models={
    '250':{url:document.body.getAttribute('data-model-250')||'/nncminhchau.vn/assets/suzuki250.glb',label:'DF250'},
    '200':{url:document.body.getAttribute('data-model-200')||'/nncminhchau.vn/assets/suzuki200.glb',label:'DF200'},
    '30':{url:document.body.getAttribute('data-model-30')||'/nncminhchau.vn/assets/df30.glb',label:'DF30'},
    '25':{url:document.body.getAttribute('data-model-25')||'/nncminhchau.vn/assets/df25.glb',label:'DF25'},
    '6':{url:document.body.getAttribute('data-model-6')||'/nncminhchau.vn/assets/df6.glb',label:'DF6'}
  };
  var initialModel=(new URLSearchParams(window.location.search).get('model')||'DF250').replace(/^DF/i,'');
  if(!models[initialModel])initialModel='250';
  var wanted=initialModel, loader=new THREE.GLTFLoader(), loadEl=document.getElementById('load');
  for(var k in models){var M0=models[k];M0.body=[];M0.emb=[];M0.edges=[];M0.edgeSrc=[];M0.t=1;M0.sc=1;}
  function toast(txt){loadEl.textContent=txt||'';loadEl.classList.toggle('done',!txt);}
  function build(id,g){
    var M=models[id], m=g.scene;
    function up(src,extra){var p=new THREE.MeshPhysicalMaterial({color:src.color,metalness:src.metalness,roughness:src.roughness,side:THREE.DoubleSide,envMapIntensity:1.3});for(var q in extra)p[q]=extra[q];return p;}
    m.traverse(function(o){
      if(!o.isMesh)return; var n=o.name, src=Array.isArray(o.material)?o.material[0]:o.material; if(!src)return;
      if(src.name==='fallback Material'){o.material=/Badge.*Rim/.test(n)?chrome:graphite;}
      else{var key=src.uuid;if(!cache[key])cache[key]=up(src,/lacquer/i.test(src.name)?{clearcoat:1,clearcoatRoughness:0.08}:{});o.material=cache[key];}
      if(BODY.test(n))M.body.push(o); else if(EMBL.test(n))M.emb.push(o);
      if(EDGES.test(n))M.edgeSrc.push(o);
    });
    // Propeller: gather its parts, put a pivot on the hub centre and turn them around the shaft axis
    m.updateMatrixWorld(true);
    var parts=[],hub=null;
    m.traverse(function(o){if(o.isMesh&&/^DF\d+_(Propeller_|Watergrip_)/.test(o.name)){parts.push(o);if(/Exhaust_Hub/.test(o.name))hub=o;}});
    if(hub&&parts.length){
      var hb=new THREE.Box3().setFromObject(hub),hs=hb.getSize(new THREE.Vector3()),hc=hb.getCenter(new THREE.Vector3());
      var e=[hs.x,hs.y,hs.z],best=0,bd=1e9; // shaft axis = the one whose two other extents are most alike (round hub)
      for(var a=0;a<3;a++){var dd=Math.abs(e[(a+1)%3]-e[(a+2)%3]);if(dd<bd){bd=dd;best=a;}}
      var g2=new THREE.Group();g2.position.copy(hc);m.add(g2);m.updateMatrixWorld(true);
      parts.forEach(function(o){g2.attach(o);});
      var shaftAxis=PROPELLER_AXIS_OVERRIDE[id]||['x','y','z'][best];
      M.spin={g:g2,axis:shaftAxis,angle:0};
      console.info(M.label+' propeller rotation axis: '+shaftAxis);
    }
    var box=new THREE.Box3().setFromObject(m),size=box.getSize(new THREE.Vector3()),ctr=box.getCenter(new THREE.Vector3());
    M.sc=2/Math.max(size.y,1e-6);
    m.position.sub(ctr);var holder=new THREE.Group();holder.add(m);holder.scale.setScalar(M.sc);holder.visible=false;pivot.add(holder);M.holder=holder;
    applyFinish();
    // panel lines are added a moment later so the first picture appears sooner
    setTimeout(function(){M.edgeSrc.forEach(function(o){var l=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,28),EDGE[finish]);o.add(l);M.edges.push(l);});},120);
  }
  function activate(id){
    var M=models[id];
    for(var q in models){if(models[q].holder)models[q].holder.visible=(q===id);}
    M.t=0;active=M;toast('');document.body.classList.add('model-in');
  }
  function loadModel(id){
    var M=models[id]; if(M.state)return; M.state='loading';
    loader.load(M.url,function(g){
      build(id,g);M.state='ready';refreshUI();
      if(wanted===id)activate(id);
      // The other engines are loaded on demand to avoid unnecessary transfers.
    },function(e){
      M.pct=e.lengthComputable&&e.total?Math.round(e.loaded/e.total*100):null;
      if(wanted===id&&!M.holder)toast('Loading '+M.label+' 3D model'+(M.pct!=null?' '+M.pct+'%':'…'));
    },function(err){M.state='error';console.error(err);if(wanted===id)toast('The '+M.label+' 3D model could not be loaded.');refreshUI();});
  }
  function show(id){
    wanted=id;var M=models[id];
    [].forEach.call(document.querySelectorAll('[data-for]'),function(el){el.hidden=el.getAttribute('data-for')!==id;});
    var b=document.getElementById('brand');if(b)b.textContent=M.label;
    refreshUI();
    if(M.state==='ready'){activate(id);}
    else{loadModel(id);toast(M.pct!=null?'Loading '+M.label+' 3D model '+M.pct+'%':'Loading '+M.label+' 3D model…');}
  }
  function refreshUI(){
    [].forEach.call(document.querySelectorAll('[data-model-btn]'),function(b){
      var id=b.getAttribute('data-model-btn'),on=id===wanted,st=models[id].state;
      b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.classList.toggle('busy',st==='loading');
    });
  }
  [].forEach.call(document.querySelectorAll('[data-model-btn]'),function(b){b.addEventListener('click',function(){show(b.getAttribute('data-model-btn'));});});
  [].forEach.call(document.querySelectorAll('[data-finish]'),function(b){b.addEventListener('click',function(){setFinish(b.getAttribute('data-finish'),true);});});

  // ---------- Page theme ----------
  function setLight(v){light=v;document.body.classList.toggle('light',light);mode.textContent=light?'Dark mode':'Light mode';renderer.toneMappingExposure=light?1.0:1.1;bm.color.set(light?0x2a7fb0:0xcfeaff);if(finishAuto)setFinish(light?'carbon':'white',false);}
  mode.addEventListener('click',function(){setLight(!light);});

  document.body.classList.add('ready');   // text and buttons are usable straight away
  setLight(false);
  show(initialModel);
  requestAnimationFrame(frame);
  /*__DEBUG__*/
})();