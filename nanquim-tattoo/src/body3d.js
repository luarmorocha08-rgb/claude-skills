/* =========================================================
   BODY 3D — corpo humano realista (malha MakeHuman, CC0)
   three.js + DecalGeometry. Coordenadas em metros, y para cima,
   pessoa olhando para +z, lado esquerdo da pessoa = +x.
   ========================================================= */
import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

export function createBody3D({ canvas, hotBox, onPick, onToast, onView }) {
  const D = window.BODYDATA;
  const IDX = new Uint16Array(b64(D.idx).buffer);
  const LAB = b64(D.lab);
  const NV = D.nv, NT_BODY = D.ntri.body;

  /* ---------- renderer / cena ---------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.88;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.35;

  const camera = new THREE.PerspectiveCamera(24, 1, 0.05, 40);

  // luzes de estúdio: key quente, rim fria, fill suave
  const key = new THREE.DirectionalLight(0xffe2c4, 2.3);
  key.position.set(-2.2, 3.4, 3.0);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -1.2; key.shadow.camera.right = 1.2; key.shadow.camera.top = 2.2; key.shadow.camera.bottom = -0.3;
  key.shadow.radius = 6; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  const rim1 = new THREE.DirectionalLight(0xc9dcff, 1.9); rim1.position.set(2.6, 2.4, -2.6);
  const rim2 = new THREE.DirectionalLight(0xffd2a0, 1.2); rim2.position.set(-2.8, 1.6, -2.2);
  const fill = new THREE.HemisphereLight(0xfff3e6, 0x2a2016, 0.4);
  scene.add(key, rim1, rim2, fill);
  // luzes acompanham a câmera (sempre bonito de qualquer ângulo)
  const rig = new THREE.Group(); scene.add(rig);
  rig.add(key, key.target, rim1, rim2);

  // chão: sombra + disco
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.6, 64), new THREE.ShadowMaterial({ opacity: 0.38 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const ringTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(230,200,143,.20)'); g.addColorStop(.55, 'rgba(230,200,143,.06)'); g.addColorStop(1, 'rgba(230,200,143,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    x.strokeStyle = 'rgba(230,200,143,.35)'; x.lineWidth = 1.2; x.beginPath(); x.arc(128, 128, 92, 0, Math.PI * 2); x.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.9, 64), new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, depthWrite: false }));
  disc.rotation.x = -Math.PI / 2; disc.position.y = 0.001; scene.add(disc);

  /* ---------- geometria ---------- */
  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(new Float32Array(NV * 3), 3);
  geo.setAttribute('position', posAttr);
  const clothable = new Float32Array(NV), labF = new Float32Array(NV);
  for (let i = 0; i < NV; i++) {
    const l = LAB[i]; labF[i] = l;
    clothable[i] = (l === 1 || l === 20 || l === 21) ? 1 : 0;
  }
  geo.setAttribute('aCloth', new THREE.BufferAttribute(clothable, 1));
  geo.setIndex(new THREE.BufferAttribute(IDX, 1));
  geo.addGroup(0, NT_BODY * 3, 0);
  geo.addGroup(NT_BODY * 3, IDX.length - NT_BODY * 3, 1);

  /* ---------- materiais ---------- */
  const U = {
    uSkin: { value: new THREE.Color('#c98e64') },
    uFem: { value: 0 },
    uEyeL: { value: new THREE.Vector3() }, uEyeR: { value: new THREE.Vector3() },
    uPelvis: { value: new THREE.Vector3() }, uHipL: { value: new THREE.Vector3() }, uHipR: { value: new THREE.Vector3() },
    uChest: { value: new THREE.Vector4() },
  };
  const NOISE = `
    float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
    float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
      return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
                 mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
    float fbm(vec3 p){return .5*vn(p)+.25*vn(p*2.03)+.125*vn(p*4.01)+.0625*vn(p*8.07);}
  `;
  const skinMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.56, metalness: 0,
    sheen: 0.35, sheenRoughness: 0.6, sheenColor: new THREE.Color('#ffd9c2'),
    clearcoat: 0.08, clearcoatRoughness: 0.45, specularIntensity: 0.55,
  });
  skinMat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aCloth; varying vec3 vObj; varying float vCloth;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObj=position; vCloth=aCloth;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uSkin,uEyeL,uEyeR,uPelvis,uHipL,uHipR; uniform vec4 uChest; uniform int uFem;
        varying vec3 vObj; varying float vCloth; float gCloth; float gHair;
        ${NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        {
          vec3 p=vObj; vec3 E=(uEyeL+uEyeR)*.5;
          // pele: variação de tom (manchas suaves, rubor em mãos, joelhos, rosto)
          float n=fbm(p*38.);
          vec3 sk=uSkin*vec3(1.02,.97,.93)*(0.94+0.1*n);
          float flush=smoothstep(.06,.0,abs(p.y-E.y+.035))*smoothstep(.06,.02,abs(abs(p.x)-.035))*step(E.z-.03,p.z);
          sk=mix(sk,sk*vec3(1.06,.86,.82),flush*.45);
          // lábios
          vec2 m=vec2(p.x/.026,(p.y-(E.y-.072))/.012);
          float lip=smoothstep(1.,.55,length(m))*step(E.z-.01,p.z);
          sk=mix(sk,sk*vec3(.86,.6,.6),lip*.75);
          // sobrancelhas
          for(int s=0;s<2;s++){ vec3 e=s==0?uEyeL:uEyeR; float dx=(p.x-e.x)*(s==0?1.:-1.);
            float arch=e.y+.021+.006*(1.-pow((dx+.004)/.026,2.));
            float br=smoothstep(.0038,.001,abs(p.y-arch))*smoothstep(.03,.022,abs(dx+.002))*step(e.z-.02,p.z);
            br*=.55+.45*vn(vec3(p.x*900.,p.y*300.,1.));
            sk=mix(sk,vec3(.05,.035,.025),br*(uFem==1?.6:.7)); }
          // cabelo pintado (buzz cut masculino / penteado preso feminino)
          float back=clamp((E.z+.01-p.z)/.11,0.,1.);
          float line=E.y+(uFem==1?.062:.068)-back*(uFem==1?.115:.1)-smoothstep(.04,.075,abs(p.x))*(uFem==1?.018:.026)*(1.-back);
          float ear=smoothstep(.06,.072,abs(p.x))*smoothstep(.02,-.02,p.y-E.y)*(1.-back*.6);
          gHair=smoothstep(-.002,.004,p.y-line)*(1.-ear)*step(E.y-.11,p.y)*step(abs(p.x),.11);
          vec3 hairC=uFem==1? vec3(.03,.02,.016)*(0.7+0.6*vn(vec3(p.x*60.,p.y*900.,p.z*60.))) : mix(sk*.55,vec3(.03,.025,.02),.72)*(0.85+0.3*vn(p*900.));
          sk=mix(sk,hairC,gHair*(uFem==1?1.:.9));
          // roupa íntima
          gCloth=0.;
          if(vCloth>.5){
            float wy=uPelvis.y+(uFem==1?.035:.06);
            float waist=smoothstep(.003,-.003,p.y-wy-.012*sin(p.x*20.)*.0);
            float leg;
            if(uFem==1){ float ax=abs(p.x); float cy=uHipL.y-.075; leg=smoothstep(-.003,.003,p.y-(cy+.85*max(0.,ax-.012)-.04*max(0.,-p.z)*0.)); }
            else { leg=smoothstep(-.003,.003,p.y-(uHipL.y-.13)); }
            gCloth=waist*leg;
            if(uFem==1){
              float ax=abs(p.x);
              float front=smoothstep(uChest.x-.03,uChest.x+.02,p.z);
              float yTop=mix(uChest.z+.045, uChest.y-.03-.035*smoothstep(.0,.06,.06-ax), front);
              float yBot=uChest.z;
              float top=smoothstep(.003,-.003,p.y-yTop)*smoothstep(-.003,.003,p.y-yBot)*smoothstep(uChest.w+.004,uChest.w-.004,ax);
              gCloth=max(gCloth,top);
            }
          }
          float rib=smoothstep(.6,1.,sin(p.y*1500.))*.15;
          vec3 cloth=vec3(.016,.016,.015)*(1.+rib)+vec3(.05,.045,.035)*smoothstep(.006,.0,abs(p.y-(uPelvis.y+(uFem==1?.035:.06))+.004))*step(.5,vCloth);
          diffuseColor.rgb=mix(sk,cloth,gCloth);
        }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor=mix(roughnessFactor*(0.92+0.16*vn(vObj*260.)),0.9,gCloth);
        roughnessFactor=mix(roughnessFactor,0.42,gHair*float(uFem));`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        { // micro-relevo de poros (só perto) — bump procedural
          float s=900.; vec3 q=vObj*s;
          float b0=vn(q), bx=vn(q+vec3(.6,0,0)), by=vn(q+vec3(0,.6,0)), bz=vn(q+vec3(0,0,.6));
          vec3 g=vec3(bx-b0,by-b0,bz-b0);
          vec3 gv=(viewMatrix*vec4(g,0.)).xyz;
          normal=normalize(normal-(gv-dot(gv,normal)*normal)*(0.18*(1.-gCloth)));
        }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        { // pseudo subsurface: luz vermelha que vaza nas bordas
          float fr=pow(1.-clamp(dot(normalize(vViewPosition),-normal)*-1.,0.,1.),3.);
          totalEmissiveRadiance+=uSkin*vec3(.55,.16,.08)*fr*.10*(1.-gCloth);
        }`);
  };
  skinMat.customProgramCacheKey = () => 'skin-v3';

  const eyeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03 });
  eyeMat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObj;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObj=position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uEyeL,uEyeR; varying vec3 vObj;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        { vec3 c=vObj.x>0.?uEyeL:uEyeR; vec3 d=normalize(vObj-c); float a=acos(clamp(d.z,-1.,1.));
          vec3 col=vec3(.86,.83,.8);
          float iris=smoothstep(.5,.46,a); float pup=smoothstep(.2,.17,a);
          float ang=atan(d.y,d.x); vec3 ic=mix(vec3(.16,.09,.04),vec3(.32,.2,.09),.5+.5*sin(ang*40.)*smoothstep(.2,.45,a));
          col=mix(col,ic,iris); col=mix(col,vec3(.01),pup);
          col*=mix(1.,.55,smoothstep(.9,1.6,a));
          diffuseColor.rgb=col; }`);
  };

  const body = new THREE.Mesh(geo, [skinMat, eyeMat]);
  body.castShadow = true; body.receiveShadow = true;
  scene.add(body);

  /* ---------- tattoo (decalque) ---------- */
  const inkTex = new THREE.Texture();
  inkTex.colorSpace = THREE.SRGBColorSpace; inkTex.anisotropy = 4;
  const inkMat = new THREE.MeshPhysicalMaterial({
    map: inkTex, color: new THREE.Color('#0d1013'), transparent: true, opacity: 0.9,
    roughness: 0.5, clearcoat: 0.08, depthTest: true, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
  });
  inkMat.onBeforeCompile = sh => {
    // usa o alfa do desenho; cor = tinta preta levemente azulada
    sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>',
      `vec4 tc=texture2D(map,vMapUv); diffuseColor.a*=tc.a; diffuseColor.rgb=mix(diffuseColor.rgb, tc.rgb*.15+diffuseColor.rgb*.85, .3);`);
  };
  let decalMesh = null;

  // sub-malhas por região (para o decalque não "vazar" para o braço etc.)
  const subCache = {};
  function subMesh(labels) {
    const key = labels.join(',');
    if (subCache[key]) return subCache[key];
    const set = new Set(labels), out = [];
    for (let t = 0; t < NT_BODY; t++) {
      const a = IDX[t * 3], b = IDX[t * 3 + 1], c = IDX[t * 3 + 2];
      if (set.has(LAB[a]) && set.has(LAB[b]) && set.has(LAB[c])) out.push(a, b, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', posAttr); g.setIndex(out);
    const m = new THREE.Mesh(g); m.updateMatrixWorld(true);
    return subCache[key] = m;
  }
  function invalidateSubs() { for (const k in subCache) { subCache[k].geometry.computeVertexNormals(); } }

  /* ---------- estado do corpo ---------- */
  let J = null, gender = 'm';
  const v3 = a => new THREE.Vector3(a[0], a[1], a[2]);
  function setGender(g) {
    gender = g;
    const B = g === 'f' ? D.female : D.male;
    const q = new Uint16Array(b64(B.pos).buffer), arr = posAttr.array;
    for (let i = 0; i < NV; i++) for (let k = 0; k < 3; k++) arr[i * 3 + k] = B.mn[k] + q[i * 3 + k] * B.sc[k];
    posAttr.needsUpdate = true;
    geo.computeVertexNormals(); geo.computeBoundingSphere(); geo.computeBoundingBox();
    invalidateSubs();
    J = {}; for (const k in B.J) J[k] = v3(B.J[k]);
    U.uFem.value = g === 'f' ? 1 : 0;
    U.uEyeL.value.copy(v3(B.eyeC.l)); U.uEyeR.value.copy(v3(B.eyeC.r));
    U.uPelvis.value.copy(J.pelvis); U.uHipL.value.copy(J['l-upper-leg']); U.uHipR.value.copy(J['r-upper-leg']);
    // faixa do top (feminino): entre spine-1 e um pouco abaixo da clavícula
    const cy = J['spine-1'].y;
    U.uChest.value.set(J['spine-1'].z, cy + 0.07, cy - 0.135, J['l-shoulder'].x - 0.014);
    computeHot();
    dirty = true;
  }
  function setSkin(hex) { U.uSkin.value.set(hex); dirty = true; }

  /* ---------- geometria das regiões ---------- */
  const SIDE = s => (s === 'L' ? 'l' : 'r');
  const LIMB = { braco: ['shoulder', 'elbow', 10, .42, .5], antebraco: ['elbow', 'hand', 12, .38, .5], coxa: ['upper-leg', 'knee', 20, .48, .45], panturrilha: ['knee', 'ankle', 22, .44, .34] };
  const torsoLen = () => J['l-shoulder'].y - J['l-upper-leg'].y;
  const shX = () => J['l-shoulder'].x;
  function limbDirs(part, side) {
    const s = SIDE(side), [ja, jb] = LIMB[part];
    const A = J[s + '-' + ja], B = J[s + '-' + jb];
    const ax = B.clone().sub(A).normalize();
    const Z = new THREE.Vector3(0, 0, 1);
    const fwd = Z.clone().sub(ax.clone().multiplyScalar(Z.dot(ax))).normalize();
    const sd = new THREE.Vector3().crossVectors(ax, fwd);
    return { A, B, ax, fwd, sd };
  }
  const ray = new THREE.Raycaster();
  function castOn(mesh, origin, dir) {
    ray.set(origin, dir.clone().normalize()); ray.far = 3;
    const h = ray.intersectObject(mesh, false)[0];
    return h ? { p: h.point.clone(), n: h.face.normal.clone() } : null;
  }
  function partLabels(part, side) {
    const o = side === 'R' ? 1 : 0;
    if (LIMB[part]) return [LIMB[part][2] + o];
    if (part === 'nuca') return [1, 2];
    return [1];
  }
  // ponto padrão de cada região
  function defaultSpot(part, side) {
    if (!J) return null;
    const sub = subMesh(partLabels(part, side));
    if (LIMB[part]) {
      const { A, B, fwd, sd } = limbDirs(part, side);
      const t = LIMB[part][4];
      const P0 = A.clone().lerp(B, t);
      let ang = 0;
      if (part === 'panturrilha') ang = Math.PI;
      if (part === 'braco') ang = (side === 'L' ? 1 : -1) * -1.25; // face externa do braço
      if (part === 'antebraco') ang = (side === 'L' ? 1 : -1) * -0.35;
      const dir = fwd.clone().multiplyScalar(Math.cos(ang)).add(sd.clone().multiplyScalar(Math.sin(ang)));
      return castOn(sub, P0.clone().add(dir.clone().multiplyScalar(.4)), dir.clone().negate());
    }
    const shY = J['l-shoulder'].y, tl = torsoLen();
    const T = { peito: [0, gender === 'f' ? .03 : .24], costas: [0, gender === 'f' ? .2 : .3], lombar: [0, .76], costelas: [.33, .52], nuca: [0, -.16] }[part];
    const y = shY - T[1] * tl;
    if (part === 'peito') return castOn(sub, new THREE.Vector3(0, y, .8), new THREE.Vector3(0, 0, -1));
    if (part === 'costelas') { const sx = side === 'L' ? 1 : -1; return castOn(sub, new THREE.Vector3(sx * .8, y, J.pelvis.z + .01), new THREE.Vector3(-sx, 0, 0)); }
    return castOn(sub, new THREE.Vector3(0, y, -.8), new THREE.Vector3(0, 0, 1));
  }
  // tamanho padrão (m) e eixo "para cima" da tattoo
  function frameFor(part, side, P, N) {
    let up, size;
    if (LIMB[part]) {
      const { A, B } = limbDirs(part, side);
      up = A.clone().sub(B).normalize();
      size = A.distanceTo(B) * LIMB[part][3];
    } else {
      up = new THREE.Vector3(0, 1, 0);
      size = torsoLen() * ({ peito: gender === 'f' ? .27 : .42, costas: gender === 'f' ? .4 : .55, lombar: .36, costelas: .4, nuca: .2 })[part];
    }
    const Uv = up.clone().sub(N.clone().multiplyScalar(up.dot(N))).normalize();
    const Rv = new THREE.Vector3().crossVectors(Uv, N).normalize();
    return { Uv, Rv, size };
  }
  // converte ponto 3D → coordenadas 2D usadas pela câmera (rastreamento)
  function locFromPoint(part, side, P) {
    if (LIMB[part]) {
      const { A, B } = limbDirs(part, side);
      const d = B.clone().sub(A);
      return { a: Math.min(.88, Math.max(.12, P.clone().sub(A).dot(d) / d.lengthSq())), b: 0 };
    }
    return { a: Math.max(-.55, Math.min(.55, -P.x / (2 * shX()))), b: Math.max(-.25, Math.min(.95, (J['l-shoulder'].y - P.y) / torsoLen())) };
  }

  let tat = null; // {part, side, P, N, scale, rot}
  function setTattoo(t, img) {
    if (img) { inkTex.image = img; inkTex.needsUpdate = true; }
    tat = t;
    if (decalMesh) { scene.remove(decalMesh); decalMesh.geometry.dispose(); decalMesh = null; }
    if (t && J && inkTex.image) {
      const { Uv, Rv, size } = frameFor(t.part, t.side, t.P, t.N);
      const th = (t.rot || 0) * Math.PI / 180;
      const U2 = Uv.clone().multiplyScalar(Math.cos(th)).add(Rv.clone().multiplyScalar(Math.sin(th)));
      const R2 = Rv.clone().multiplyScalar(Math.cos(th)).sub(Uv.clone().multiplyScalar(Math.sin(th)));
      const m = new THREE.Matrix4().makeBasis(R2, U2, t.N.clone().normalize());
      const e = new THREE.Euler().setFromRotationMatrix(m);
      const s = size * (t.scale || 1);
      const sub = subMesh(partLabels(t.part, t.side));
      sub.geometry.computeVertexNormals();
      const dg = new DecalGeometry(sub, t.P, e, new THREE.Vector3(s, s, s * .9));
      decalMesh = new THREE.Mesh(dg, inkMat);
      decalMesh.renderOrder = 2; decalMesh.receiveShadow = true;
      scene.add(decalMesh);
    }
    dirty = true;
  }

  /* ---------- câmera orbital ---------- */
  const cam = { yaw: 0, pitch: .05, dist: 6.4, ty: .9, tx: 0, tz: 0 };
  let anim = null, dirty = true, visible = true, dragging = false, idle = 0;
  function fitDist() { const a = canvas.clientWidth / Math.max(1, canvas.clientHeight); return a < .62 ? 6.4 * (.62 / a) * .82 + 1.2 : 6.0; }
  function applyCam() {
    const cp = Math.cos(cam.pitch);
    camera.position.set(cam.tx + Math.sin(cam.yaw) * cp * cam.dist, cam.ty + Math.sin(cam.pitch) * cam.dist, cam.tz + Math.cos(cam.yaw) * cp * cam.dist);
    camera.lookAt(cam.tx, cam.ty, cam.tz);
    rig.rotation.y = cam.yaw;
  }
  function goTo(to, dur = 800) {
    const from = {}, tgt = {};
    for (const k in to) { from[k] = cam[k]; tgt[k] = to[k]; }
    if ('yaw' in tgt) { let d = tgt.yaw - cam.yaw; d = ((d + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; tgt.yaw = cam.yaw + d; }
    anim = { from, to: tgt, t0: performance.now(), dur };
  }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const pr = renderer.getPixelRatio();
    if (canvas.width !== Math.round(w * pr) || canvas.height !== Math.round(h * pr)) { renderer.setSize(w, h, false); }
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  function loop(now) {
    requestAnimationFrame(loop);
    if (anim) {
      const t = Math.min(1, (now - anim.t0) / anim.dur), e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      for (const k in anim.from) cam[k] = anim.from[k] + (anim.to[k] - anim.from[k]) * e;
      dirty = true; if (t >= 1) anim = null;
    }
    // giro lento enquanto ninguém mexe (só antes de escolher local)
    if (!tat && !dragging && !anim && visible && now - idle > 2500) { cam.yaw += 0.0025; dirty = true; }
    if (dirty && visible) { dirty = false; resize(); applyCam(); renderer.render(scene, camera); placeHot(); }
  }

  /* ---------- hotspots ---------- */
  const PARTS = ['peito', 'costelas', 'costas', 'lombar', 'nuca', 'braco', 'antebraco', 'coxa', 'panturrilha'];
  const PAIRED = { costelas: 1, braco: 1, antebraco: 1, coxa: 1, panturrilha: 1 };
  let hot = [];
  function computeHot() {
    hot = [];
    for (const p of PARTS) for (const s of (PAIRED[p] ? ['L', 'R'] : ['L'])) {
      const h = defaultSpot(p, s); if (h) hot.push({ p, s, P: h.p, N: h.n });
    }
  }
  const tmp = new THREE.Vector3();
  function placeHot() {
    if (!hotBox) return;
    const W = canvas.clientWidth, H = canvas.clientHeight; let h = '';
    for (const q of hot) {
      if (tat && tat.part === q.p && (!PAIRED[q.p] || tat.side === q.s)) continue;
      const toCam = camera.position.clone().sub(q.P).normalize();
      if (q.N.dot(toCam) < .3) continue;
      tmp.copy(q.P).project(camera);
      const x = (tmp.x * .5 + .5) * W, y = (-tmp.y * .5 + .5) * H;
      if (x < 12 || x > W - 12 || y < 56 || y > H - 12) continue;
      h += `<button class="hot" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px" data-p="${q.p}" data-s="${q.s}" aria-label="${q.p}"><i></i></button>`;
    }
    hotBox.innerHTML = h;
  }
  hotBox && hotBox.addEventListener('click', e => { const b = e.target.closest('.hot'); if (b) onPick && onPick(b.dataset.p, b.dataset.s, null); });

  /* ---------- toque / arraste ---------- */
  (() => {
    let down = null;
    canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, yaw: cam.yaw, pitch: cam.pitch, moved: false }; idle = performance.now(); });
    canvas.addEventListener('pointermove', e => {
      if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (!down.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { down.moved = true; dragging = true; canvas.setPointerCapture(e.pointerId); anim = null; }
      if (down.moved) { cam.yaw = down.yaw - dx * .0105; dirty = true; e.preventDefault(); }
    });
    const end = e => {
      if (!down) return; const d = down; down = null; dragging = false; idle = performance.now();
      if (d.moved) { onView && onView(viewName()); return; }
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10) return;
      pick(e.clientX, e.clientY);
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', () => { down = null; dragging = false; });
  })();
  function viewName() {
    const y = ((cam.yaw % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return Math.abs(y) < Math.PI / 4 ? 'front' : Math.abs(y) > 3 * Math.PI / 4 ? 'back' : (y > 0 ? 'left' : 'right');
  }
  function pick(cx, cy) {
    const r = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2((cx - r.left) / r.width * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera); ray.far = 40;
    const h = ray.intersectObject(body, false)[0];
    if (!h) return;
    const f = h.face, P = h.point.clone(), N = f.normal.clone();
    const ls = [LAB[f.a], LAB[f.b], LAB[f.c]].sort((a, b) => a - b), g = ls[1];
    const side = g % 2 === 0 ? 'L' : 'R';
    let part = null, sd = side;
    if (g === 30 || g === 3) return onToast && onToast('Escolha uma região do corpo');
    if (g >= 24) return onToast && onToast('Pés: escolha a panturrilha');
    if (g === 14 || g === 15) part = 'antebraco';
    else if (g === 10 || g === 11) part = 'braco';
    else if (g === 12 || g === 13) part = 'antebraco';
    else if (g === 20 || g === 21) part = 'coxa';
    else if (g === 22 || g === 23) part = 'panturrilha';
    else if (g === 2) part = 'nuca';
    else if (g === 1) {
      const shY = J['l-shoulder'].y;
      if (P.y < J.pelvis.y + .06) return onToast && onToast('Região coberta — tente lombar ou coxa');
      if (Math.abs(N.x) > .6 && P.y < shY - .08) { part = 'costelas'; sd = N.x > 0 ? 'L' : 'R'; }
      else if (N.z >= 0) { part = P.y > shY - .2 * torsoLen() - (gender === 'f' ? .1 : 0) || P.y > J['spine-1'].y - .02 ? 'peito' : 'costelas'; if (part === 'costelas') sd = P.x >= 0 ? 'L' : 'R'; }
      else part = P.y > shY + .04 ? 'nuca' : (P.y > J['spine-3'].y ? 'costas' : 'lombar');
    }
    if (!part) return;
    // em mãos: projeta no antebraço
    let spot = { p: P, n: N };
    if (g === 14 || g === 15) spot = defaultSpot('antebraco', side) || spot;
    onPick && onPick(part, sd, spot);
  }

  /* ---------- API ---------- */
  function setView(v) {
    const yaw = { front: 0, back: Math.PI, left: Math.PI / 2, right: -Math.PI / 2 }[v];
    goTo({ yaw, pitch: .05, dist: fitDist(), ty: .9, tx: 0, tz: 0 }); idle = performance.now();
  }
  function focus() {
    if (!tat) return;
    const yaw = Math.atan2(tat.N.x, tat.N.z);
    const far = ['costas', 'peito', 'coxa', 'costelas', 'lombar'].includes(tat.part) ? 2.5 : 2.0;
    goTo({ yaw, pitch: .08, dist: far * Math.max(1, fitDist() / 6.0) * .9, ty: tat.P.y, tx: tat.P.x, tz: tat.P.z }, 900);
  }
  function zoomOut() { goTo({ pitch: .05, dist: fitDist(), ty: .9, tx: 0, tz: 0 }); }
  new ResizeObserver(() => { dirty = true; }).observe(canvas);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) dirty = true; }).observe(canvas);
  cam.dist = fitDist();
  requestAnimationFrame(loop);

  return {
    setGender, setSkin, setTattoo, setView, focus, zoomOut, defaultSpot, locFromPoint,
    redraw: () => { dirty = true; }, get tattoo() { return tat; },
    snapshot: () => { renderer.render(scene, camera); return canvas.toDataURL('image/png'); },
    _cam: cam,
  };
}
