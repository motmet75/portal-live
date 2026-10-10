/* DF250 3D scroll showcase. Model path: assets/suzuki250.glb */
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

  var light=true, lTop=new THREE.Color(0xffffff), lDeep=new THREE.Color(0xc4dae6), mode=document.getElementById('mode');
  mode.addEventListener('click',function(){light=!light;document.body.classList.toggle('light',light);mode.textContent=light?'Dark mode':'Light mode';renderer.toneMappingExposure=light?1.0:1.1;bm.color.set(light?0x2a7fb0:0xcfeaff);});
  bm.color.set(0x2a7fb0); renderer.toneMappingExposure=1.0;
  var ready=false, target=0, cur=0;
  function onScroll(){var h=document.documentElement.scrollHeight-innerHeight;target=h>0?Math.min(1,Math.max(0,scrollY/h)):0;}
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  function resize(){var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  addEventListener('resize',resize); resize();

  var t0=performance.now();
  // Propeller spin. SPIN_DIR -1 = clockwise seen from behind the boat, 1 = counter-clockwise. Speeds are radians per second.
  var SPIN_DIR=-1, SPIN_IDLE=1.2, SPIN_BOOST=7;
  var spinGroup=null, spinAxis='x', spinAngle=0, lastT=performance.now();
  function frame(now){
    requestAnimationFrame(frame);
    cur += (target-cur)*0.07;
    var s=sample(cur), narrow=camera.aspect<0.9;
    var dt=Math.min(0.05,(now-lastT)/1000); lastT=now;
    if(spinGroup&&!reduce){ // faster while the lower unit is on screen
      spinAngle+=SPIN_DIR*dt*(SPIN_IDLE+SPIN_BOOST*Math.exp(-Math.pow((cur-.75)/.14,2)));
      spinGroup.rotation[spinAxis]=spinAngle;
    }
    var idle = reduce?0:Math.sin((now-t0)/2400)*0.08;
    pivot.rotation.y = s.ry + idle;
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

  // Decode the embedded model and fit it to a 2-unit-tall frame
  function onModel(g){
    var m=g.scene;
        // Keep the materials from the file, upgraded with reflections; only the unnamed black fallbacks get a finish by part name
    function up(src,extra){var p=new THREE.MeshPhysicalMaterial({color:src.color,metalness:src.metalness,roughness:src.roughness,side:THREE.DoubleSide,envMapIntensity:1.3});for(var k in extra)p[k]=extra[k];return p;}
    function mk(o){o.side=THREE.DoubleSide;o.envMapIntensity=1.3;return new THREE.MeshPhysicalMaterial(o);}
    var pearl=mk({color:0xf1f4f6,metalness:0.2,roughness:0.3,clearcoat:1,clearcoatRoughness:0.08}),
        graphite=mk({color:0x2b333a,metalness:0.7,roughness:0.38}),
        chrome=mk({color:0xffffff,metalness:1,roughness:0.08}), cache={};
    var edgeMat=new THREE.LineBasicMaterial({color:0x9fb6c4,transparent:true,opacity:0.35});
    m.traverse(function(o){
      if(!o.isMesh)return; var n=o.name, src=o.material;
      if(src.name==='fallback Material'){
        o.material=/Badge.*Rim/.test(n)?chrome:(/Gearcase|Skeg|Lower_Adapter/.test(n)?pearl:graphite);
      }else{
        var key=src.uuid; if(!cache[key]) cache[key]=up(src,/lacquer/i.test(src.name)?{clearcoat:1,clearcoatRoughness:0.08}:{});
        o.material=cache[key];
      }
      // crisp panel lines make the cowl surface detail easy to read
      if(/Lower_Cowl_And_Leg|Removable_Upper_Cowling|Lower_Adapter|Gearcase/.test(n)){
        o.add(new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,28),edgeMat));
      }
    });
    // Propeller: gather its parts, put a pivot on the hub centre and turn them around the shaft axis
    (function(){
      var re=/^DF250_(Propeller_|Watergrip_)/, parts=[], hub=null;
      m.updateMatrixWorld(true);
      m.traverse(function(o){if(o.isMesh&&re.test(o.name)){parts.push(o);if(/Exhaust_Hub/.test(o.name))hub=o;}});
      if(!hub||!parts.length)return;
      var hb=new THREE.Box3().setFromObject(hub), hs=hb.getSize(new THREE.Vector3()), hc=hb.getCenter(new THREE.Vector3());
      // the shaft axis is the one whose two other extents are most alike (the hub is round)
      var e=[hs.x,hs.y,hs.z], best=0, bd=1e9;
      for(var a=0;a<3;a++){var dd=Math.abs(e[(a+1)%3]-e[(a+2)%3]);if(dd<bd){bd=dd;best=a;}}
      spinAxis=['x','y','z'][best];
      var g2=new THREE.Group(); g2.position.copy(hc); m.add(g2); m.updateMatrixWorld(true);
      parts.forEach(function(o){g2.attach(o);});
      spinGroup=g2;
    })();
    var box=new THREE.Box3().setFromObject(m), size=box.getSize(new THREE.Vector3()), ctr=box.getCenter(new THREE.Vector3());
    var sc=2/Math.max(size.y,1e-6);
    m.position.sub(ctr); var holder=new THREE.Group(); holder.add(m); holder.scale.setScalar(sc); pivot.add(holder);

    ready=true; document.getElementById('load').classList.add('done'); document.body.classList.add('ready');
  }
  function onFail(e){document.getElementById('load').textContent='The 3D model could not be loaded.';console.error(e);}
  var loader=new THREE.GLTFLoader();
  loader.load(document.body.getAttribute('data-model')||'/nncminhchau.vn/assets/suzuki250.glb',onModel,undefined,onFail);
  requestAnimationFrame(frame);
})();
