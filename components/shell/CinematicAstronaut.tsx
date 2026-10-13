"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { subscribe } from "../../lib/ticker";
import { prefersReducedMotion } from "../../lib/motion";
import { siteConfig } from "../../lib/data";
import Magnetic from "../motion/Magnetic";

/**
 * Full-bleed, scroll-pinned cinematic astronaut sequence.
 * Beats (scroll progress p, 0..1):
 *  A 0.00-0.17  sticker/gem drift, wide
 *  B 0.17-0.36  blue tunnel flythrough
 *  --  0.36     glass shatter + glitch
 *  C 0.36-0.55  dark lattice flythrough
 *  D 0.55-0.68  title card (rainbow halo, big type)
 *  E 0.68-0.85  helmet close-up, env-reflective visor
 *  F 0.85-1.00  pull back to Earth horizon + CTA
 *
 * Model: public/models/astronaut.glb (Google, Apache-2.0).
 */

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const BOUNDS = [0.17, 0.36, 0.55, 0.68, 0.85];
const GLITCH_W = [0.35, 1, 0.8, 0.35, 0];
const BLEND_H = 0.05; // half-width of each scene crossfade window
const CAPTIONS = [
  { a: 0, b: 0.17, t: "01 / Drift" },
  { a: 0.17, b: 0.36, t: "02 / Tunnel" },
  { a: 0.36, b: 0.55, t: "03 / Signal" },
  { a: 0.55, b: 0.68, t: "04 / Departure" },
  { a: 0.68, b: 0.85, t: "05 / Contact" },
  { a: 0.85, b: 1.01, t: "06 / Orbit" },
];

const FX = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uGlitch: { value: 0 },
    uChroma: { value: 0.0015 },
    uGrain: { value: 0.07 },
    uZoom: { value: 0 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime,uGlitch,uChroma,uGrain,uZoom; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    void main(){
      vec2 uv=vUv;
      float row=floor(uv.y*26.0); float tm=floor(uTime*16.0);
      float g=step(0.5,h(vec2(row,tm)))*uGlitch;
      uv.x+=(h(vec2(row,tm+3.0))-0.5)*0.3*g;
      vec2 q=vec2(64.0,36.0);
      float blk=step(0.72,h(floor(uv*q)+tm))*uGlitch;
      uv=mix(uv,floor(uv*q)/q,blk*0.6);
      vec2 d=uv-0.5; float c=uChroma+uGlitch*0.014;
      vec3 acc=vec3(0.0);
      for(int i=0;i<7;i++){
        float s=1.0-uZoom*(float(i)/6.0);
        vec2 u2=0.5+(uv-0.5)*s;
        vec2 d2=u2-0.5;
        acc+=vec3(texture2D(tDiffuse,u2+d2*c).r,texture2D(tDiffuse,u2).g,texture2D(tDiffuse,u2-d2*c).b);
      }
      vec4 col=vec4(acc/7.0,1.0);
      col.rgb+=(h(uv*vec2(1920.0,1080.0)+uTime)-0.5)*uGrain;
      col.rgb*=1.0-dot(d,d)*0.55;
      gl_FragColor=col;
    }`,
};


/* ───────── Device + network profile ─────────
 * tier 0 = low  (direct render, no post, small counts)
 * tier 1 = mid  (post FX, no MSAA, half-res bloom)
 * tier 2 = high (post FX + 4x MSAA, full counts, iridescent gems)
 * fallback = skip WebGL entirely (reduced motion / data-saver / 2G / software GL)
 */
type Profile = {
  tier: 0 | 1 | 2; fallback: boolean; post: boolean; msaa: number; pr: number;
  bloomScale: number; aniso: number; texSize: number; tunnelTex: number;
  nStickers: number; nGems: number; nBars: number; nSparks: number; nShards: number; nStars: number; dust: number;
  wrapVh: number;
};
function getProfile(): Profile {
  const nav = navigator as any;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const eff: string = conn?.effectiveType || "4g";
  const saveData = !!conn?.saveData;
  const slowNet = saveData || eff === "slow-2g" || eff === "2g";
  const midNet = eff === "3g" || (typeof conn?.downlink === "number" && conn.downlink < 1.5);
  const cores = nav.hardwareConcurrency || 4;
  const mem = nav.deviceMemory || 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  let score = (cores >= 8 ? 2 : cores >= 4 ? 1 : 0) + (mem >= 8 ? 2 : mem >= 4 ? 1 : 0);
  if (coarse) score -= 1;
  if (small) score -= 1;
  if (midNet) score -= 1;
  const tier: 0 | 1 | 2 = score >= 3 ? 2 : score >= 1 ? 1 : 0;
  const dpr = window.devicePixelRatio || 1;
  const T = {
    0: { post: false, msaa: 0, pr: Math.min(dpr, 1), bloomScale: 0.5, aniso: 2, texSize: 256, tunnelTex: 512, nStickers: 14, nGems: 16, nBars: 600, nSparks: 70, nShards: 90, nStars: 400, dust: 0, wrapVh: 600 },
    1: { post: true, msaa: 0, pr: Math.min(dpr, 1.5), bloomScale: 0.5, aniso: 4, texSize: 384, tunnelTex: 1024, nStickers: 22, nGems: 28, nBars: 1400, nSparks: 140, nShards: 160, nStars: 800, dust: 220, wrapVh: 800 },
    2: { post: true, msaa: 4, pr: Math.min(dpr, 2), bloomScale: 1, aniso: 8, texSize: 512, tunnelTex: 1024, nStickers: 30, nGems: 44, nBars: 2400, nSparks: 240, nShards: 240, nStars: 1400, dust: 420, wrapVh: 900 },
  }[tier];
  return { tier, fallback: slowNet, ...T };
}

function makeStickerTexture(kind: number, size = 256, aniso = 4) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.translate(size / 2, size / 2);
  g.scale(size / 256, size / 256);
  g.lineJoin = "round";
  g.lineCap = "round";
  const outline = () => { g.lineWidth = 24; g.strokeStyle = "#fff"; g.stroke(); };
  const ink = () => { g.strokeStyle = "#0a0a0a"; g.lineWidth = 9; };
  const k = kind % 8;
  const face = (col: string) => {
    g.beginPath(); g.arc(0, 0, 78, 0, Math.PI * 2); outline(); g.fillStyle = col; g.fill();
    ink(); g.beginPath(); g.arc(0, 10, 38, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
    g.beginPath(); g.moveTo(-28, -22); g.lineTo(-24, -8); g.moveTo(28, -22); g.lineTo(24, -8); g.stroke();
  };
  if (k === 0) face("#ffe100");
  else if (k === 1) face("#d46bff");
  else if (k === 2) face("#b6ff1a");
  else if (k === 3) {
    g.beginPath(); g.moveTo(30, -100); g.lineTo(-50, 10); g.lineTo(-5, 10); g.lineTo(-30, 100); g.lineTo(55, -15); g.lineTo(8, -15); g.closePath();
    outline(); g.fillStyle = "#ffe100"; g.fill(); ink(); g.lineWidth = 6; g.stroke();
  } else if (k === 4) {
    g.beginPath();
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 42 : 98, a = (i / 10) * Math.PI * 2 - Math.PI / 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    g.closePath(); outline(); g.fillStyle = "#ff2e93"; g.fill(); ink(); g.lineWidth = 6; g.stroke();
  } else if (k === 5) { // lips
    g.beginPath(); g.moveTo(-90, 5); g.quadraticCurveTo(-45, -70, 0, -25); g.quadraticCurveTo(45, -70, 90, 5); g.quadraticCurveTo(45, 85, 0, 70); g.quadraticCurveTo(-45, 85, -90, 5); g.closePath();
    outline(); g.fillStyle = "#ff1fe0"; g.fill(); ink(); g.lineWidth = 6; g.stroke();
    g.fillStyle = "#fff"; g.beginPath(); g.moveTo(-40, 8); g.quadraticCurveTo(0, 32, 40, 8); g.quadraticCurveTo(0, 50, -40, 8); g.fill();
  } else if (k === 6) { // eyes
    for (const y of [-42, 42]) {
      g.beginPath(); g.ellipse(0, y, 50, 42, 0, 0, Math.PI * 2); outline(); g.fillStyle = "#fff"; g.fill();
      g.fillStyle = "#1aa7ff"; g.beginPath(); g.arc(8, y + 4, 22, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#000"; g.beginPath(); g.arc(10, y + 5, 10, 0, Math.PI * 2); g.fill();
    }
  } else { // planet lollipop
    g.strokeStyle = "#fff"; g.lineWidth = 34; g.beginPath(); g.moveTo(-18, 18); g.lineTo(-92, 92); g.stroke();
    g.strokeStyle = "#bfe6ff"; g.lineWidth = 14; g.beginPath(); g.moveTo(-18, 18); g.lineTo(-92, 92); g.stroke();
    g.beginPath(); g.arc(20, -20, 66, 0, Math.PI * 2); outline(); g.fillStyle = "#9dff1a"; g.fill();
    g.strokeStyle = "#b07bff"; g.lineWidth = 16; g.beginPath(); g.ellipse(20, -20, 100, 26, -0.5, 0, Math.PI * 2); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
}

function makeTunnelTexture(size = 1024, aniso = 4) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.scale(size / 512, size / 512);
  g.fillStyle = "#1226d6";
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "#b9b9c9";
  g.fillStyle = "#b9b9c9";
  for (let i = 0; i < 7; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 30 + Math.random() * 90;
    g.lineWidth = 14 + Math.random() * 26;
    g.beginPath();
    g.ellipse(x, y, r, r * (0.6 + Math.random() * 0.5), Math.random() * 3, 0, Math.PI * 2);
    if (Math.random() > 0.45) g.fill(); else g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = aniso;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeEnvTexture() {
  const W = 1024, H = 512;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#02030a"; g.fillRect(0, 0, W, H);
  const earth = g.createLinearGradient(0, H * 0.5, 0, H);
  earth.addColorStop(0, "#bfefff"); earth.addColorStop(0.06, "#2f8cff"); earth.addColorStop(0.4, "#0b3a99"); earth.addColorStop(1, "#031035");
  g.fillStyle = earth; g.fillRect(0, H * 0.5, W, H * 0.5);
  g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 6; g.lineCap = "round";
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * W, y = H * 0.55 + Math.random() * H * 0.4;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + 30 + Math.random() * 80, y + (Math.random() - 0.5) * 8); g.stroke();
  }
  const sun = g.createRadialGradient(700, 215, 0, 700, 215, 90);
  sun.addColorStop(0, "#fff"); sun.addColorStop(0.15, "#fff"); sun.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = sun; g.beginPath(); g.arc(700, 215, 90, 0, Math.PI * 2); g.fill();
  const key = g.createRadialGradient(180, 120, 0, 180, 120, 60);
  key.addColorStop(0, "rgba(255,255,255,0.9)"); key.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = key; g.beginPath(); g.arc(180, 120, 60, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Dispose a material AND every texture it holds (Material.dispose() alone leaks the GPU textures). */
function disposeMaterial(m: THREE.Material) {
  for (const v of Object.values(m)) {
    if (v && (v as THREE.Texture).isTexture) (v as THREE.Texture).dispose();
  }
  m.dispose();
}

export default function CinematicAstronaut() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const t1 = useRef<HTMLDivElement>(null);
  const t2 = useRef<HTMLDivElement>(null);
  const t3 = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const topFade = useRef<HTMLDivElement>(null);
  const botFade = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current, stage = stageRef.current, canvas = canvasRef.current;
    if (!wrap || !stage || !canvas) return;
    const P = getProfile();
    if (prefersReducedMotion() || P.fallback) { setFallback(true); return; }
    wrap.style.height = `${P.wrapVh}vh`;

    // Lazy boot: don't create a GL context / fetch the 2.8MB model until the user is close.
    let stop: (() => void) | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !stop) {
          io.disconnect();
          stop = start(wrap, stage, canvas, P);
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(wrap);
    return () => { io.disconnect(); stop?.(); };
  }, []);

  function start(wrap: HTMLDivElement, stage: HTMLDivElement, canvas: HTMLCanvasElement, P: Profile): () => void {
    const noop = () => {};
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !P.post, powerPreference: "high-performance" });
    } catch {
      setFallback(true);
      return noop;
    }
    const onLost = (e: Event) => { e.preventDefault(); setFallback(true); };
    canvas.addEventListener("webglcontextlost", onLost);
    // Software GL (SwiftShader / llvmpipe) would crawl -> bail to the static fallback.
    try {
      const gl = renderer.getContext();
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
      if (/swiftshader|llvmpipe|software/i.test(name)) { canvas.removeEventListener("webglcontextlost", onLost); renderer.dispose(); renderer.forceContextLoss(); setFallback(true); return noop; }
    } catch { /* ignore */ }
    let pr = P.pr;
    renderer.setPixelRatio(pr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 600);

    // Environment (reflections for visor + gems)
    const envTex = makeEnvTexture();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromEquirectangular(envTex);
    scene.environment = envRT.texture;

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6fa8ff, 1.4);
    rim.position.set(-4, 2, -4);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    // Post
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.7, 0.88);
    const fx = new ShaderPass(FX);
    let composer: EffectComposer | null = null;
    if (P.post) {
      const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: P.msaa });
      composer = new EffectComposer(renderer, rt);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(bloom);
      composer.addPass(fx);
      composer.addPass(new OutputPass());
    }

    // ── Astronaut ──
    const pivot = new THREE.Group();
    scene.add(pivot);
    let loaded = false;
    let destroyed = false;
    new GLTFLoader().load(
      "/models/astronaut.glb",
      (gltf) => {
        if (destroyed) return;
        const m = gltf.scene;
        const box = new THREE.Box3().setFromObject(m);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const s = 2 / size.y;
        m.scale.setScalar(s);
        m.position.set(-center.x * s, -center.y * s, -center.z * s);
        m.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh) return;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 1.6;
          if (mat.map) mat.map.anisotropy = P.aniso;
          // Dark texels (visor) become mirror-like -> reflects the env (Earth / sun)
          mat.onBeforeCompile = (sh) => {
            sh.fragmentShader = sh.fragmentShader
              .replace("#include <map_fragment>", `#include <map_fragment>
                float vLum = dot(diffuseColor.rgb, vec3(0.299,0.587,0.114));
                float visorMask = 1.0 - smoothstep(0.004, 0.035, vLum);`)
              .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
                roughnessFactor = mix(roughnessFactor, 0.03, visorMask);`)
              .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>
                metalnessFactor = mix(metalnessFactor, 1.0, visorMask);`);
          };
          mat.needsUpdate = true;
        });
        pivot.add(m);
        loaded = true;
        setReady(true);
      },
      undefined,
      (e) => console.error("astronaut load failed", e)
    );

    // ── Beat A: stickers + gems ──
    const stickers = new THREE.Group();
    scene.add(stickers);
    const stickerData: { s: THREE.Sprite; base: THREE.Vector3; ph: number }[] = [];
    const texes = Array.from({ length: 8 }, (_, i) => makeStickerTexture(i, P.texSize, P.aniso));
    for (let i = 0; i < P.nStickers; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: texes[i % 8], transparent: true, toneMapped: false }));
      const a = Math.random() * Math.PI * 2, r = 2.2 + Math.random() * 4.5;
      const base = new THREE.Vector3(Math.cos(a) * r * 1.5, Math.sin(a) * r * 0.9, (Math.random() - 0.5) * 4);
      sp.position.copy(base);
      sp.scale.setScalar(0.5 + Math.random() * 0.7);
      (sp.material as THREE.SpriteMaterial).rotation = (Math.random() - 0.5) * 1.2;
      stickers.add(sp);
      stickerData.push({ s: sp, base, ph: Math.random() * 6 });
    }
    const gemMat = new THREE.MeshPhysicalMaterial({ color: 0xcfe0ff, metalness: 1, roughness: 0.08, envMapIntensity: 2.2, flatShading: true, ...(P.tier === 2 ? { iridescence: 1, iridescenceIOR: 1.7, clearcoat: 1 } : {}) });
    const gems: THREE.Mesh[] = [];
    for (let i = 0; i < P.nGems; i++) {
      const gm = new THREE.Mesh(i % 2 ? new THREE.OctahedronGeometry(0.18) : new THREE.TetrahedronGeometry(0.2), gemMat);
      const a = Math.random() * Math.PI * 2, r = 1.8 + Math.random() * 6;
      gm.position.set(Math.cos(a) * r * 1.5, Math.sin(a) * r * 0.9, (Math.random() - 0.5) * 5);
      gm.scale.setScalar(0.6 + Math.random() * 1.4);
      gm.rotation.set(Math.random() * 6, Math.random() * 6, 0);
      stickers.add(gm);
      gems.push(gm);
    }

    // ── Beat B: blue tunnel ──
    const tunnel = new THREE.Group();
    scene.add(tunnel);
    const tTex = makeTunnelTexture(P.tunnelTex, P.aniso);
    tTex.repeat.set(3, 10);
    const tunnelMat = new THREE.MeshBasicMaterial({ map: tTex, side: THREE.BackSide, transparent: true, opacity: 0 });
    const tunnelMesh = new THREE.Mesh(
      new THREE.BoxGeometry(9, 6, 150),
      tunnelMat
    );
    tunnelMesh.position.z = -60;
    tunnel.add(tunnelMesh);
    const winMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 5, 6), toneMapped: false, transparent: true, opacity: 0 });
    for (let i = 0; i < 18; i++) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.2), winMat);
      const left = i % 2 === 0;
      w.position.set(left ? -4.45 : 4.45, -0.4, -i * 7 - 4);
      w.rotation.y = left ? Math.PI / 2 : -Math.PI / 2;
      tunnel.add(w);
    }
    const pillarMat = new THREE.MeshBasicMaterial({ color: 0x2a3cff, transparent: true, opacity: 0 });
    for (let i = 0; i < 18; i++) {
      for (const sx of [-1, 1]) {
        const pl = new THREE.Mesh(new THREE.BoxGeometry(0.7, 6, 0.9), pillarMat);
        pl.position.set(sx * 4.15, 0, -i * 7 + 0.2);
        tunnel.add(pl);
      }
    }
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(Math.max(1, P.dust) * 3);
    for (let i = 0; i < P.dust; i++) dustPos.set([(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 12], i * 3);
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xcfe4ff, size: 0.035, transparent: true, opacity: 0, toneMapped: false, fog: false, depthWrite: false });
    const dust = new THREE.Points(dustGeo, dustMat);
    dust.visible = P.dust > 0;
    scene.add(dust);
    const fog = new THREE.Fog(0x000000, 40, 300);
    scene.fog = fog;

    // ── Beat C: dark lattice ──
    const lattice = new THREE.Group();
    scene.add(lattice);
    const N = P.nBars;
    const barsMat = new THREE.MeshStandardMaterial({ color: 0x2a3138, metalness: 0.7, roughness: 0.4, transparent: true, opacity: 0 });
    const sparksMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 3, 3), toneMapped: false, transparent: true, opacity: 0 });
    const bars = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), barsMat, N);
    const sparks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), sparksMat, P.nSparks);
    const dm = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      const ang = Math.floor(Math.random() * 4) * (Math.PI / 2) + Math.PI / 4;
      const rad = 3 + Math.random() * 7;
      const along = Math.random() < 0.7;
      dm.position.set(Math.cos(ang) * rad + (Math.random() - 0.5) * 5, Math.sin(ang) * rad + (Math.random() - 0.5) * 5, -170 - Math.random() * 180);
      dm.scale.set(along ? 0.1 : 0.1 + Math.random() * 3, along ? 0.1 + Math.random() * 3 : 0.1, along ? 2 + Math.random() * 14 : 0.1);
      dm.rotation.set(0, 0, 0);
      dm.updateMatrix();
      bars.setMatrixAt(i, dm.matrix);
    }
    for (let i = 0; i < P.nSparks; i++) {
      const ang = Math.random() * Math.PI * 2, rad = 2 + Math.random() * 6;
      dm.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad, -170 - Math.random() * 180);
      dm.scale.set(0.12 + Math.random() * 0.25, 0.08, 0.12 + Math.random() * 0.3);
      dm.updateMatrix();
      sparks.setMatrixAt(i, dm.matrix);
    }
    lattice.add(bars, sparks);

    // ── Shatter shards ──
    const shardN = P.nShards;
    const shardGroup = new THREE.Group();
    const shardMat = new THREE.MeshBasicMaterial({ color: 0x5b7bff, transparent: true, opacity: 0.85, side: THREE.DoubleSide, toneMapped: false });
    const shardGeo = new THREE.BufferGeometry();
    shardGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0.3, 0, -0.2, -0.2, 0, 0.25, -0.15, 0]), 3));
    const shards: { m: THREE.Mesh; dir: THREE.Vector3; spin: THREE.Vector3; sp: number }[] = [];
    for (let i = 0; i < shardN; i++) {
      const m = new THREE.Mesh(shardGeo, shardMat);
      const dir = new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.4, Math.random() * 0.6 - 0.2).normalize();
      m.scale.setScalar(0.5 + Math.random() * 2.5);
      shards.push({ m, dir, spin: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6), sp: 4 + Math.random() * 14 });
      shardGroup.add(m);
    }
    scene.add(shardGroup);

    // ── Beat D: halo ──
    const haloMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uA: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader: `varying vec2 vUv; uniform float uA;
          vec3 hsv(float h){ return clamp(abs(mod(h*6.0+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.); }
          void main(){ vec2 d=vUv-0.5; float r=length(d)*2.0; float a=atan(d.y,d.x)/6.2831+0.5;
            float ring=exp(-pow((r-0.62)/0.1,2.0)); vec3 c=mix(vec3(0.3),hsv(a),0.55);
            gl_FragColor=vec4(c*ring*0.35*uA,ring*uA);} `,
      });
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), haloMat);
    halo.position.set(0, 0, -4);
    scene.add(halo);

    // ── Beat E/F: stars + Earth ──
    const starPos = new Float32Array(P.nStars * 3);
    for (let i = 0; i < P.nStars; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(80 + Math.random() * 40);
      starPos.set([v.x, v.y, v.z], i * 3);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, sizeAttenuation: true, toneMapped: false, transparent: true, fog: false });
    const stars = new THREE.Points(sg, starMat);
    scene.add(stars);

    const earthGroup = new THREE.Group();
    const earthTex = (() => {
      const c = document.createElement("canvas"); c.width = 512; c.height = 256;
      const g = c.getContext("2d")!;
      g.fillStyle = "#0a3fa8"; g.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 90; i++) {
        g.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.35)" : "rgba(20,120,60,0.45)";
        g.beginPath(); g.ellipse(Math.random() * 512, Math.random() * 256, 10 + Math.random() * 60, 4 + Math.random() * 22, Math.random() * 3, 0, 7); g.fill();
      }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    const earthMat = new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.9, metalness: 0, transparent: true, opacity: 0 });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(60, 64, 48), earthMat);
    const atmoMat = new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
        vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
        uniforms: { uA: { value: 0 } },
        fragmentShader: `varying vec3 vN; varying vec3 vV; uniform float uA; void main(){ float f=pow(clamp(dot(-vN,vV),0.0,1.0),2.2); gl_FragColor=vec4(0.25,0.7,1.0,1.0)*f*2.2*uA; }`,
      });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(62.5, 64, 48), atmoMat);
    earthGroup.add(earth, atmo);
    earthGroup.position.set(0, -64.5, -25);
    scene.add(earthGroup);

    // ── sizing ──
    const resize = () => {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (composer) {
        composer.setPixelRatio(renderer.getPixelRatio());
        composer.setSize(w, h);
        bloom.setSize(w * P.bloomScale, h * P.bloomScale);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const pointer = new THREE.Vector2();
    const onPtr = (e: PointerEvent) => {
      pointer.set((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onPtr, { passive: true });

    // ── Pose system: each beat defines a pose; adjacent beats are blended over BLEND_H ──
    type Pose = { cp: THREE.Vector3; cq: THREE.Quaternion; pp: THREE.Vector3; pq: THREE.Quaternion; ps: number; key: number; glow: number };
    const mk = (): Pose => ({ cp: new THREE.Vector3(), cq: new THREE.Quaternion(), pp: new THREE.Vector3(), pq: new THREE.Quaternion(), ps: 1, key: 2.2, glow: 0.55 });
    const poseA = mk(), poseB = mk(), poseOut = mk();
    const _m = new THREE.Matrix4(), _e = new THREE.Euler(), _qz = new THREE.Quaternion(), _up = new THREE.Vector3(0, 1, 0), _zax = new THREE.Vector3(0, 0, 1);
    const RANGES: [number, number][] = [[0, 0.17], [0.17, 0.36], [0.36, 0.55], [0.55, 0.68], [0.68, 0.85], [0.85, 1]];
    const setCam = (o: Pose, cp: THREE.Vector3, look: THREE.Vector3, roll = 0) => {
      o.cp.copy(cp);
      _m.lookAt(cp, look, _up);
      o.cq.setFromRotationMatrix(_m);
      if (roll) o.cq.multiply(_qz.setFromAxisAngle(_zax, roll));
    };
    const setAstro = (o: Pose, x: number, y: number, z: number, rx: number, ry: number, rz: number, sc: number) => {
      o.pp.set(x, y, z);
      o.pq.setFromEuler(_e.set(rx, ry, rz));
      o.ps = sc;
    };
    const _cp = new THREE.Vector3(), _lk = new THREE.Vector3();
    const poseOf = (i: number, p: number, time: number, ptr: THREE.Vector2, o: Pose) => {
      const [a, b] = RANGES[i];
      const tl = seg(p, a, b);
      const te = ease(tl);
      o.key = 2.2; o.glow = 0.55;
      if (i === 0) {
        setCam(o, _cp.set(ptr.x * 0.4, 0.1 - ptr.y * 0.25, lerp(7.5, 5.2, te)), _lk.set(0, 0, 0));
        setAstro(o, 0, Math.sin(time * 0.9) * 0.06, 0, -0.05, Math.PI + Math.sin(time * 0.5) * 0.35, 0, 1);
      } else if (i === 1) {
        const z = 3 - tl * 95;
        setCam(o, _cp.set(ptr.x * 0.3, 0.3, z), _lk.set(0, 0.1, z - 10), Math.sin(tl * 6) * 0.06);
        setAstro(o, Math.sin(time * 1.3) * 0.5, Math.cos(time * 1.1) * 0.35, z - 6.5,
          -0.7 + Math.sin(time * 0.8) * 0.25, Math.PI + Math.sin(time) * 0.4, Math.sin(time * 0.7) * 0.4, 1);
        o.glow = 0.8;
      } else if (i === 2) {
        const z = -180 - tl * 150;
        setCam(o, _cp.set(Math.sin(tl * 5) * 0.8, Math.cos(tl * 4) * 0.6, z), _lk.set(0, 0, z - 10));
        setAstro(o, 0, 0, z - 9, time * 0.9, Math.PI + time * 0.5, time * 0.3, 0.9);
        o.key = 1.1; o.glow = 0.9;
      } else if (i === 3) {
        setCam(o, _cp.set(ptr.x * 0.2, 0, 7.5), _lk.set(0, 0, 0));
        setAstro(o, lerp(-0.3, 0.2, te), Math.sin(time) * 0.08, 0, Math.PI / 2 - 0.25 + Math.sin(time * 0.6) * 0.1, Math.PI + 0.3, Math.sin(time * 0.4) * 0.3 - 0.2, 0.85);
      } else if (i === 4) {
        setCam(o, _cp.set(ptr.x * 0.12, lerp(1.1, 1.0, te), lerp(3.8, 2.0, te)), _lk.set(0, 0.82, 0));
        setAstro(o, 0, Math.sin(time * 0.8) * 0.03, 0, 0, Math.PI + Math.sin(time * 0.5) * 0.22 + ptr.x * 0.15, 0, 1);
        o.glow = 0.4;
      } else {
        setCam(o, _cp.set(ptr.x * 0.3, lerp(1.0, 0.6, te), lerp(2.0, 8.0, te)), _lk.set(0, lerp(0.8, 0.1, te), 0));
        setAstro(o, 0, Math.sin(time * 0.8) * 0.05, 0, 0, Math.PI + Math.sin(time * 0.5) * 0.25, 0, 1);
        o.glow = 0.4;
      }
    };
    const getPose = (p: number, time: number, ptr: THREE.Vector2): Pose => {
      let i = RANGES.findIndex(([a, b]) => p >= a && p < b);
      if (i < 0) i = RANGES.length - 1;
      // inside a crossfade window around a boundary?
      for (let j = 0; j < BOUNDS.length; j++) {
        const bd = BOUNDS[j];
        if (Math.abs(p - bd) < BLEND_H) {
          const k = ease((p - (bd - BLEND_H)) / (2 * BLEND_H));
          poseOf(j, p, time, ptr, poseA);
          poseOf(j + 1, p, time, ptr, poseB);
          poseOut.cp.lerpVectors(poseA.cp, poseB.cp, k);
          poseOut.cq.slerpQuaternions(poseA.cq, poseB.cq, k);
          poseOut.pp.lerpVectors(poseA.pp, poseB.pp, k);
          poseOut.pq.slerpQuaternions(poseA.pq, poseB.pq, k);
          poseOut.ps = lerp(poseA.ps, poseB.ps, k);
          poseOut.key = lerp(poseA.key, poseB.key, k);
          poseOut.glow = lerp(poseA.glow, poseB.glow, k);
          return poseOut;
        }
      }
      poseOf(i, p, time, ptr, poseOut);
      return poseOut;
    };

    let sp = 0; // smoothed progress
    let perfEma = 16, perfT = -2000;
    
    const bgCol = new THREE.Color();
    const cBlack = new THREE.Color(0x000000), cBlue = new THREE.Color(0x0a14c8);

    const unsub = subscribe((_t, delta) => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -50 || rect.top > vh + 50) return; // offscreen: skip render
      const raw = clamp(-rect.top / Math.max(1, rect.height - vh));
      if (document.hidden) return;
      sp += (raw - sp) * (1 - Math.exp(-delta * 0.007));
      // adaptive quality: step resolution/bloom down if frames run long, back up if there is headroom
      if (loaded && delta < 120) {
        perfEma += (delta - perfEma) * 0.06;
        perfT += delta;
        if (perfT > 1800) {
          perfT = 0;
          if (perfEma > 27 && pr > 0.75) { pr = Math.max(0.75, pr - 0.25); renderer.setPixelRatio(pr); resize(); }
          else if (perfEma > 34 && bloom.enabled) bloom.enabled = false;
          else if (perfEma < 15 && pr < P.pr) { pr = Math.min(P.pr, pr + 0.25); renderer.setPixelRatio(pr); resize(); }
          else if (perfEma < 15 && !bloom.enabled) bloom.enabled = true;
        }
      }
      const p = sp;
      const time = performance.now() * 0.001;

      // ── continuous world state (everything cross-fades, nothing pops) ──
      const bW = ease(seg(p, 0.12, 0.2)) * (1 - ease(seg(p, 0.34, 0.42)));        // blue world
      const lW = ease(seg(p, 0.33, 0.41)) * (1 - ease(seg(p, 0.53, 0.6)));        // lattice world
      const hW = ease(seg(p, 0.53, 0.6)) * (1 - ease(seg(p, 0.66, 0.72)));        // halo
      const eW = ease(seg(p, 0.62, 0.72));                                        // earth
      const sW = 1 - ease(seg(p, 0.1, 0.17));                                     // stickers
      const starW = Math.max(1 - ease(seg(p, 0.1, 0.17)), ease(seg(p, 0.52, 0.6)));

      tunnelMat.opacity = bW; winMat.opacity = bW; pillarMat.opacity = bW;
      if (P.dust) { dustMat.opacity = eW * 0.7; dust.visible = eW > 0.01; dust.rotation.y = time * 0.03; dust.position.y = Math.sin(time * 0.2) * 0.2; } tunnel.visible = bW > 0.001;
      barsMat.opacity = lW; sparksMat.opacity = lW; lattice.visible = lW > 0.001;
      haloMat.uniforms.uA.value = hW; halo.visible = hW > 0.001;
      earthMat.opacity = eW; atmoMat.uniforms.uA.value = eW; earthGroup.visible = eW > 0.001;
      starMat.opacity = starW; stars.visible = starW > 0.001;
      gemMat.transparent = true; gemMat.opacity = sW;
      stickers.visible = sW > 0.001;
      shardGroup.visible = p > 0.34 && p < 0.47;

      bgCol.copy(cBlack).lerp(cBlue, bW);
      (scene.background as THREE.Color).copy(bgCol);
      fog.color.copy(bgCol);
      let fn = 40, ff = 300;
      fn = lerp(fn, 8, bW); ff = lerp(ff, 70, bW);
      fn = lerp(fn, 15, lW); ff = lerp(ff, 120, lW);
      fog.near = fn; fog.far = ff;

      const pose = getPose(p, time, pointer);
      camera.position.copy(pose.cp);
      camera.quaternion.copy(pose.cq);
      pivot.position.copy(pose.pp);
      pivot.quaternion.copy(pose.pq);
      pivot.scale.setScalar(pose.ps);
      key.intensity = pose.key;
      bloom.strength = pose.glow;

      // animate pieces
      if (stickers.visible) {
        stickerData.forEach((d) => {
          d.s.position.set(d.base.x + Math.sin(time * 0.5 + d.ph) * 0.25, d.base.y + Math.cos(time * 0.6 + d.ph) * 0.3, d.base.z);
          const sm = d.s.material as THREE.SpriteMaterial;
          sm.rotation += 0.002; sm.opacity = sW;
        });
        gems.forEach((g, i) => { g.rotation.x += 0.01 + i * 0.0001; g.rotation.y += 0.012; });
      }
      if (shardGroup.visible) {
        const s = (p - 0.355) * 22;
        shardGroup.position.copy(camera.position);
        shardGroup.quaternion.copy(camera.quaternion);
        shardMat.opacity = clamp(1 - s / 1.8) * 0.9;
        shards.forEach((sh) => {
          sh.m.position.copy(sh.dir).multiplyScalar(2 + s * sh.sp * 0.5);
          sh.m.position.z -= 4 + s * 3;
          sh.m.rotation.set(sh.spin.x * s, sh.spin.y * s, sh.spin.z * s);
        });
      }
      halo.lookAt(camera.position);

      // post uniforms: wide gaussian bumps centred on each scene change
      let gl = 0;
      BOUNDS.forEach((bd, i) => {
        const d = (p - bd) / 0.028;
        gl = Math.max(gl, GLITCH_W[i] * Math.exp(-d * d));
      });
      const warp = Math.max(0, ...BOUNDS.map((bd) => Math.exp(-(((p - bd) / 0.035) ** 2))));
      if (p > 0.36 && p < 0.55) gl = Math.max(gl, 0.1 * (0.5 + 0.5 * Math.sin(time * 3)));
      fx.uniforms.uGlitch.value = gl * 0.55;
      fx.uniforms.uZoom.value = warp * 0.09;
      fx.uniforms.uTime.value = time;
      fx.uniforms.uChroma.value = 0.0015 + warp * 0.006;

      // overlay
      const cap = CAPTIONS.find((c) => p >= c.a && p < c.b);
      if (capRef.current && cap && capRef.current.textContent !== cap.t) capRef.current.textContent = cap.t;
      if (barRef.current) barRef.current.style.transform = `translateY(${p * 100}%)`;
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - p * 14));
      if (titleRef.current) {
        const a = seg(p, 0.55, 0.585) * (1 - seg(p, 0.655, 0.68));
        titleRef.current.style.opacity = String(a);
        const k = seg(p, 0.55, 0.68);
        if (t1.current) t1.current.style.transform = `translate3d(${lerp(12, -18, k)}vw,0,0)`;
        if (t2.current) t2.current.style.transform = `translate3d(${lerp(-6, 6, k)}vw,0,0)`;
        if (t3.current) t3.current.style.transform = `translate3d(${lerp(-22, 10, k)}vw,0,0)`;
      }
      if (ctaRef.current) {
        const a = seg(p, 0.92, 0.98);
        ctaRef.current.style.opacity = String(a);
        ctaRef.current.style.pointerEvents = a > 0.5 ? "auto" : "none";
        ctaRef.current.style.visibility = a > 0.05 ? "visible" : "hidden"; // keeps the link out of the tab order until it is shown
        ctaRef.current.style.transform = `translate3d(0,${(1 - a) * 24}px,0)`;
      }

      // soft blends into the sections above/below
      if (topFade.current) topFade.current.style.opacity = String(1 - seg(p, 0.0, 0.07));
      if (botFade.current) botFade.current.style.opacity = String(seg(p, 0.93, 1));
      canvas.style.opacity = String(seg(p, 0, 0.05));
      if (loaded) { if (composer) composer.render(); else renderer.render(scene, camera); }
    });

    return () => {
      destroyed = true;
      unsub();
      ro.disconnect();
      window.removeEventListener("pointermove", onPtr);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach(disposeMaterial);
        else if (mat) disposeMaterial(mat);
      });
      // Sprites share their sticker textures and the env equirect lives outside the scene graph
      texes.forEach((t) => t.dispose());
      envTex.dispose();
      canvas.removeEventListener("webglcontextlost", onLost);
      envRT.dispose(); pmrem.dispose(); composer?.dispose(); renderer.dispose();
      renderer.forceContextLoss();
    };
  }

  if (fallback) {
    return (
      <section className="cine-fallback">
        <h2>Into a new world.</h2>
        <a href={`mailto:${siteConfig.email}`} className="btn-cta">{siteConfig.email}</a>
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="cine-wrap" role="region" aria-label="Closing sequence">
      <div ref={stageRef} className="cine-stage">
        <canvas ref={canvasRef} className="cine-canvas" aria-hidden />
        {!ready && <div className="cine-loading">Loading…</div>}
        <div ref={topFade} className="cine-fade cine-fade-top" aria-hidden />
        <div ref={botFade} className="cine-fade cine-fade-bot" aria-hidden style={{ opacity: 0 }} />

        <div className="cine-hud-cap"><span ref={capRef}>01 / Drift</span></div>
        <div className="cine-track" aria-hidden><span ref={barRef} className="cine-thumb" /></div>
        <div ref={hintRef} className="cine-hint">↓ Continue to scroll ↓</div>

        <div ref={titleRef} className="cine-title" aria-hidden style={{ opacity: 0 }}>
          <div ref={t1}>INTO A NEW WORLD</div>
          <div ref={t2}>LET&apos;S</div>
          <div ref={t3}>BUILD SOMETHING</div>
        </div>

        <div ref={ctaRef} className="cine-cta" style={{ opacity: 0, visibility: "hidden" }}>
          <h2 className="cine-cta-title">Let&apos;s build<br /><em className="font-serif italic font-normal">something unreal.</em></h2>
          <Magnetic strength={0.4}>
            <a href={`mailto:${siteConfig.email}`} className="cine-cta-btn">{siteConfig.email}</a>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
