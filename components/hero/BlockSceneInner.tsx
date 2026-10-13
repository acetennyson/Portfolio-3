"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { subscribe } from "../../lib/ticker";
import { whenReady } from "../../lib/motion";

/** Vignette + cheap edge-softening (poor-man's depth of field) + chromatic aberration + grain. */
const FinishShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uChroma: { value: 0.0012 },
    uVignette: { value: 0.75 },
    uBlur: { value: 0.0035 },
    uGrain: { value: 0.045 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime,uChroma,uVignette,uBlur,uGrain; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    void main(){
      vec2 d=vUv-0.5; float r2=dot(d,d);
      float edge=smoothstep(0.05,0.35,r2);
      vec2 o=normalize(d+1e-5)*uBlur*edge;
      vec3 c=texture2D(tDiffuse,vUv).rgb*0.4;
      c+=texture2D(tDiffuse,vUv+o).rgb*0.15; c+=texture2D(tDiffuse,vUv-o).rgb*0.15;
      c+=texture2D(tDiffuse,vUv+vec2(-o.y,o.x)).rgb*0.15; c+=texture2D(tDiffuse,vUv+vec2(o.y,-o.x)).rgb*0.15;
      vec2 ca=d*(uChroma+edge*uChroma*2.0);
      c.r=mix(c.r,texture2D(tDiffuse,vUv+ca).r,0.7); c.b=mix(c.b,texture2D(tDiffuse,vUv-ca).b,0.7);
      c*=1.0-r2*uVignette*1.6;
      c+=(h(vUv*vec2(1920.0,1080.0)+uTime)-0.5)*uGrain;
      gl_FragColor=vec4(c,1.0);
    }`,
};

const BLOCK_COLORS = [0x2b2b30, 0x232327, 0x303036, 0x26262a, 0xe9e5dc];
const ACCENT = 0xc6ff3d;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

export type FailReason = "lost" | "unsupported";

export default function BlockSceneInner({ onFail }: { onFail?: (reason: FailReason) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth < 768 || coarse;
    const nav = navigator as any;
    const lowEnd = (nav.hardwareConcurrency || 4) <= 4 || (nav.deviceMemory || 4) <= 2;
    const light = isMobile || lowEnd;

    // ── Renderer (with software-GL bail out) ──
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !light, alpha: false, powerPreference: "high-performance" });
    } catch {
      onFail?.("unsupported");
      return;
    }
    try {
      const gl = renderer.getContext();
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
      if (/swiftshader|llvmpipe|software/i.test(name)) { renderer.dispose(); renderer.forceContextLoss(); onFail?.("unsupported"); return; }
    } catch { /* ignore */ }

    const maxPR = isMobile ? 1.5 : 2;
    let pr = Math.min(window.devicePixelRatio || 1, maxPR);
    renderer.setPixelRatio(pr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const canvas = renderer.domElement;
    // GPU reset / too many contexts: drop to the static composition instead of leaving a frozen black canvas.
    const onLost = (e: Event) => { e.preventDefault(); console.warn("[hero] WebGL context lost"); onFail?.("lost"); };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 1.2s cubic-bezier(.22,1,.36,1)";
    container.appendChild(canvas);

    // ── Scene / camera ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0d);
    scene.fog = new THREE.Fog(0x0c0c0d, 14, 34);
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);

    // Real studio reflections (replaces the old 1×1 placeholder cube map)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.55;

    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(4, 9, 6);
    key.castShadow = !isMobile;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { near: 1, far: 30, left: -9, right: 9, top: 9, bottom: -9 });
    key.shadow.bias = -0.0004;
    key.shadow.radius = 4;
    scene.add(key);
    const rim = new THREE.DirectionalLight(ACCENT, 1.1);
    rim.position.set(-6, 4, -5);
    scene.add(rim);

    // Soft contact-shadow floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.55 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── Post: bloom (desktop only) → finish (vignette/DOF/CA/grain) → output ──
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.6, 0.85);
    bloom.enabled = !light;
    composer.addPass(bloom);
    const finish = new ShaderPass(FinishShader);
    composer.addPass(finish);
    composer.addPass(new OutputPass());

    // ── Physics ──
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -18, 0) });
    world.broadphase = new CANNON.NaiveBroadphase();
    (world.solver as unknown as { iterations: number }).iterations = 10;
    world.allowSleep = true;
    const mat = new CANNON.Material("block");
    world.defaultContactMaterial = new CANNON.ContactMaterial(mat, mat, { friction: 0.5, restitution: 0.25 });
    world.defaultMaterial = mat;
    const addPlane = (x: number, y: number, z: number, ex: number, ey: number, ez: number) => {
      const b = new CANNON.Body({ type: CANNON.Body.STATIC, shape: new CANNON.Plane(), material: mat });
      b.position.set(x, y, z);
      b.quaternion.setFromEuler(ex, ey, ez);
      world.addBody(b);
    };
    addPlane(0, 0, 0, -Math.PI / 2, 0, 0);        // ground
    addPlane(6.5, 0, 0, 0, -Math.PI / 2, 0);      // right wall
    addPlane(-6.5, 0, 0, 0, Math.PI / 2, 0);      // left wall
    addPlane(0, 0, -2.6, 0, 0, 0);                // back
    addPlane(0, 0, 2.6, 0, Math.PI, 0);           // front

    // ── Blocks: mix of cubes and slabs, rounded, one accent ──
    type Block = { mesh: THREE.Mesh; body: CANNON.Body; spawnAt: number; spawned: boolean; base: number };
    const blocks: Block[] = [];
    const count = isMobile ? 9 : 16;
    const accentIdx = Math.floor(count * 0.55);
    for (let i = 0; i < count; i++) {
      const isAccent = i === accentIdx;
      const base = (isMobile ? 0.7 : 0.85) + Math.random() * 0.55;
      const shape = i % 4; // cube, slab, tall, cube
      const w = base * (shape === 1 ? 1.5 : 1), h = base * (shape === 2 ? 1.6 : shape === 1 ? 0.55 : 1), d = base * (shape === 1 ? 1.1 : 1);
      const geo = new RoundedBoxGeometry(w, h, d, 4, Math.min(w, h, d) * 0.14);
      const col = isAccent ? ACCENT : BLOCK_COLORS[(i * 7) % BLOCK_COLORS.length];
      const m = new THREE.MeshStandardMaterial({
        color: col,
        roughness: isAccent ? 0.28 : col === 0xe9e5dc ? 0.5 : 0.42,
        metalness: isAccent ? 0.35 : 0.25,
        emissive: isAccent ? ACCENT : 0x000000,
        emissiveIntensity: isAccent ? 0.22 : 0,
      });
      const mesh = new THREE.Mesh(geo, m);
      mesh.castShadow = !isMobile;
      mesh.receiveShadow = !isMobile;
      mesh.visible = false;
      scene.add(mesh);
      const body = new CANNON.Body({
        mass: w * h * d,
        shape: new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2)),
        material: mat,
        position: new CANNON.Vec3((Math.random() - 0.5) * 5, 9 + Math.random() * 3, (Math.random() - 0.5) * 2.4),
        angularVelocity: new CANNON.Vec3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4),
        sleepSpeedLimit: 0.2,
        sleepTimeLimit: 0.6,
        angularDamping: 0.15,
        linearDamping: 0.05,
      });
      body.quaternion.setFromEuler(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      blocks.push({ mesh, body, spawnAt: 0.15 + i * 0.13, spawned: false, base });
    }

    // ── Impact sparks (pooled) ──
    const SP = isMobile ? 120 : 260;
    const spPos = new Float32Array(SP * 3).fill(-999);
    const spVel = new Float32Array(SP * 3);
    const spLife = new Float32Array(SP);
    let spI = 0;
    const spGeo = new THREE.BufferGeometry();
    spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
    const spMat = new THREE.PointsMaterial({ color: ACCENT, size: isMobile ? 0.05 : 0.07, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    scene.add(new THREE.Points(spGeo, spMat));
    const burst = (p: CANNON.Vec3, n: number) => {
      for (let k = 0; k < n; k++) {
        const j = spI++ % SP;
        spPos.set([p.x, p.y, p.z], j * 3);
        spVel.set([(Math.random() - 0.5) * 3, Math.random() * 3, (Math.random() - 0.5) * 3], j * 3);
        spLife[j] = 1;
      }
    };
    blocks.forEach(({ body }) => {
      body.addEventListener("collide", (e: any) => {
        const v = Math.abs(e.contact?.getImpactVelocityAlongNormal?.() ?? 0);
        if (v > 3) burst(body.position, Math.min(Math.floor(v), 10));
      });
    });

    // ── Pointer: force field + click burst ──
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2(0, 0);
    const pointerW = new THREE.Vector3(0, 3, 0);
    const lastW = new THREE.Vector3(0, 3, 0);
    let inside = false, pSpeed = 0;
    const toWorld = (clientX: number, clientY: number, out: THREE.Vector3) => {
      const r = container.getBoundingClientRect();
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const t = -ray.ray.origin.z / ray.ray.direction.z;
      out.copy(ray.ray.origin).addScaledVector(ray.ray.direction, t);
      return r.top <= clientY && clientY <= r.bottom && r.left <= clientX && clientX <= r.right;
    };
    const onMove = (e: PointerEvent) => {
      lastW.copy(pointerW);
      inside = toWorld(e.clientX, e.clientY, pointerW);
      pSpeed = clamp(pointerW.distanceTo(lastW) * 1.5, 0, 3);
    };
    const onDown = (e: PointerEvent) => {
      if (!toWorld(e.clientX, e.clientY, pointerW)) return;
      blocks.forEach(({ body }) => {
        const dx = body.position.x - pointerW.x, dy = body.position.y - pointerW.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 4.5) {
          body.wakeUp();
          const f = (1 - dist / 4.5) * body.mass * 9;
          body.applyImpulse(new CANNON.Vec3((dx / (dist + 0.1)) * f, f * 1.2, (Math.random() - 0.5) * f * 0.4));
        }
      });
      burst(new CANNON.Vec3(pointerW.x, pointerW.y, 0), 14);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    // ── Sizing + composition (scene sits right of the headline on wide screens) ──
    let offsetX = 0;
    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h);
      composer.setPixelRatio(pr);
      composer.setSize(w, h);
      bloom.setSize(w / 2, h / 2);
      offsetX = camera.aspect > 1.25 ? -2.8 : 0;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── Pause when off-screen / tab hidden ──
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(container);

    // ── Main loop on the shared ticker ──
    let started = false;
    let t0 = 0;
    let destroyed = false;
    whenReady().then(() => { if (!destroyed) { started = true; t0 = performance.now(); canvas.style.opacity = "1"; } });

    const camLook = new THREE.Vector3(0, 2, 0);
    const lookGoal = new THREE.Vector3();
    let perfEma = 16, perfT = -2500, tAbs = 0;
    const emBase = new Map<THREE.Mesh, number>();
    blocks.forEach(({ mesh }) => emBase.set(mesh, (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity));

    const unsub = subscribe((_t, deltaMs) => {
      if (!visible || document.hidden || !started) return;
      const dt = Math.min(deltaMs / 1000, 0.05);
      tAbs += dt;
      const sinceStart = (performance.now() - t0) / 1000;

      // staged drop-in
      blocks.forEach((b) => {
        if (!b.spawned && sinceStart >= b.spawnAt) {
          b.spawned = true; b.mesh.visible = true; world.addBody(b.body);
        }
      });

      // pointer force field
      if (inside) {
        blocks.forEach(({ body, mesh }) => {
          if (!body.world) return;
          const dx = body.position.x - pointerW.x, dy = body.position.y - pointerW.y;
          const dist = Math.hypot(dx, dy);
          const R = 2.4;
          if (dist < R) {
            const k = (1 - dist / R) * body.mass * (28 + pSpeed * 45);
            body.wakeUp();
            body.applyForce(new CANNON.Vec3((dx / (dist + 0.1)) * k, 6 * body.mass * (1 - dist / R), 0), body.position);
            const m = mesh.material as THREE.MeshStandardMaterial;
            m.emissiveIntensity = Math.min(m.emissiveIntensity + 0.06, 0.45);
            if (m.emissive.getHex() === 0) m.emissive.setHex(0xffffff);
          }
        });
        pSpeed *= 0.9;
      }
      world.step(1 / 60, dt, 3);

      blocks.forEach(({ mesh, body }) => {
        if (!body.world) return;
        mesh.position.set(body.position.x, body.position.y, body.position.z);
        mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
        const m = mesh.material as THREE.MeshStandardMaterial;
        const base = emBase.get(mesh) || 0;
        m.emissiveIntensity += (base - m.emissiveIntensity) * 0.08;
        if (base === 0 && m.emissiveIntensity < 0.01) m.emissive.setHex(0x000000);
      });

      for (let i = 0; i < SP; i++) {
        if (spLife[i] > 0) {
          spPos[i * 3] += spVel[i * 3] * dt;
          spPos[i * 3 + 1] += spVel[i * 3 + 1] * dt;
          spPos[i * 3 + 2] += spVel[i * 3 + 2] * dt;
          spVel[i * 3 + 1] -= 7 * dt;
          spLife[i] -= dt * 1.8;
          if (spLife[i] <= 0) spPos[i * 3 + 1] = -999;
        }
      }
      spGeo.attributes.position.needsUpdate = true;

      // camera: gentle sway + pointer parallax, composition offset
      camera.position.set(offsetX + Math.sin(tAbs * 0.2) * 0.5 + ndc.x * 0.4, 4.2 + Math.cos(tAbs * 0.3) * 0.25 + ndc.y * 0.3, 13);
      lookGoal.set(offsetX + ndc.x * 0.6, 2.2 + ndc.y * 0.5, 0);
      camLook.lerp(lookGoal, 0.05);
      camera.lookAt(camLook);

      finish.uniforms.uTime.value = tAbs;
      composer.render();

      // adaptive resolution
      if (deltaMs < 120) {
        perfEma += (deltaMs - perfEma) * 0.06;
        perfT += deltaMs;
        if (perfT > 1800) {
          perfT = 0;
          if (perfEma > 27 && pr > 0.75) { pr = Math.max(0.75, pr - 0.25); resize(); }
          else if (perfEma > 34 && bloom.enabled) bloom.enabled = false;
          else if (perfEma < 15 && pr < maxPR) { pr = Math.min(maxPR, pr + 0.25); resize(); }
        }
      }
    });

    return () => {
      destroyed = true;
      unsub();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      blocks.forEach(({ mesh }) => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); });
      spGeo.dispose(); spMat.dispose();
      floor.geometry.dispose(); (floor.material as THREE.Material).dispose();
      roomEnv.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); (m.material as THREE.Material | undefined)?.dispose?.(); });
      envRT.dispose(); pmrem.dispose();
      canvas.removeEventListener("webglcontextlost", onLost);
      composer.dispose(); renderer.dispose();
      renderer.forceContextLoss(); // release the GPU context now rather than waiting for GC (browsers cap live contexts)
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [onFail]);

  return <div ref={containerRef} className="hero-stage" aria-hidden />;
}
