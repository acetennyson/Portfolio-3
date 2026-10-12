"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { subscribe } from "../../lib/ticker";
import { prefersReducedMotion } from "../../lib/motion";

const ACCENT = 0xc6ff3d;

/**
 * A floating astronaut that drifts toward the viewer as this section scrolls
 * into view, then offers a hand. Hover/tap the glowing ring to "shake" it.
 *
 * Model: Astronaut.glb — © Google, licensed Apache-2.0, from the model-viewer
 * project's shared-assets (public/models/astronaut.glb). Original geometry,
 * not a copy of any other studio's proprietary asset.
 */
export default function GreetingAstronaut({ onGreet }: { onGreet?: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLButtonElement>(null);
  const burstFnRef = useRef<(() => void) | null>(null);

  const [ready, setReady] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [greeted, setGreeted] = useState(false);

  // Mirrors of state for the rAF loop, so the effect never has to re-run.
  const hoveringRef = useRef(false);
  const greetedRef = useRef(false);
  useEffect(() => void (hoveringRef.current = hovering), [hovering]);
  useEffect(() => void (greetedRef.current = greeted), [greeted]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    if (prefersReducedMotion()) return;

    let destroyed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 1.3, 5.2);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(ACCENT, 1.1);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x7a8cff, 0.35);
    fill.position.set(-2, 1, 3);
    scene.add(fill);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 260;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 18;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.6 })
    );
    scene.add(stars);

    // Group that holds the model; we animate this group, not the camera.
    const group = new THREE.Group();
    group.position.y = -0.9;
    group.position.z = -2.4;
    group.rotation.y = Math.PI + 0.9;
    scene.add(group);

    // Local-space anchor (inside `group`'s frame) used for the handshake ring.
    const handAnchor = new THREE.Vector3(0.3, 1.95, -0.42);

    let model: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    loader.load(
      "/models/astronaut.glb",
      (gltf) => {
        if (destroyed) return;
        model = gltf.scene;
        group.add(model);
        setReady(true);
      },
      undefined,
      (err) => console.error("astronaut load failed", err)
    );

    // Particle burst used on "greet"
    const burstCount = 120;
    const burstGeo = new THREE.BufferGeometry();
    const burstPos = new Float32Array(burstCount * 3);
    const burstVel = new Float32Array(burstCount * 3);
    const burstLife = new Float32Array(burstCount);
    burstGeo.setAttribute("position", new THREE.BufferAttribute(burstPos, 3));
    const burstMat = new THREE.PointsMaterial({
      color: ACCENT,
      size: 0.045,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const burst = new THREE.Points(burstGeo, burstMat);
    scene.add(burst);

    let greetPulse = 0; // 0..1, decays
    const fireBurst = () => {
      const origin = handAnchor.clone();
      group.localToWorld(origin);
      for (let i = 0; i < burstCount; i++) {
        burstPos[i * 3] = origin.x;
        burstPos[i * 3 + 1] = origin.y;
        burstPos[i * 3 + 2] = origin.z;
        const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).normalize();
        const speed = 1.2 + Math.random() * 1.6;
        burstVel[i * 3] = dir.x * speed;
        burstVel[i * 3 + 1] = dir.y * speed + 0.6;
        burstVel[i * 3 + 2] = dir.z * speed;
        burstLife[i] = 1;
      }
      greetPulse = 1;
    };
    burstFnRef.current = fireBurst;

    const resize = () => {
      const w = section.clientWidth;
      const h = section.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    // Scroll progress across the section (0 = just entering, 1 = centered/past)
    let progress = 0;
    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const seen = vh - rect.top;
      progress = Math.min(1, Math.max(0, seen / total));
    };
    computeProgress();
    window.addEventListener("scroll", computeProgress, { passive: true });
    window.addEventListener("resize", computeProgress);

    const unsub = subscribe((_t, delta) => {
      const dt = Math.min(delta, 50) / 1000;
      const now = performance.now() * 0.001;

      stars.rotation.y += 0.00015 * delta;

      if (model) {
        const p = progress;
        const hv = hoveringRef.current || greetedRef.current;

        const facing = Math.PI + (1 - p) * 0.9;
        group.rotation.y += (facing - group.rotation.y) * 0.06;

        const targetLean = -0.08 - p * 0.14 - (hv ? 0.08 : 0);
        group.rotation.x += (targetLean - group.rotation.x) * 0.06;

        const targetZ = -2.4 + p * 2.1 + (hv ? 0.35 : 0);
        group.position.z += (targetZ - group.position.z) * 0.06;

        group.position.y = -0.9 + Math.sin(now * 0.9) * 0.05;

        // Project hand anchor to screen space for the HTML hotspot ring.
        const world = handAnchor.clone();
        group.localToWorld(world);
        const ndc = world.clone().project(camera);
        const x = (ndc.x * 0.5 + 0.5) * section.clientWidth;
        const y = (-ndc.y * 0.5 + 0.5) * section.clientHeight;
        const visible = ndc.z < 1 && p > 0.15;

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          ringRef.current.style.opacity = visible ? "1" : "0";
          ringRef.current.style.pointerEvents = visible ? "auto" : "none";
        }
      }

      if (greetPulse > 0) {
        for (let i = 0; i < burstCount; i++) {
          if (burstLife[i] <= 0) continue;
          burstPos[i * 3] += burstVel[i * 3] * dt;
          burstPos[i * 3 + 1] += burstVel[i * 3 + 1] * dt;
          burstPos[i * 3 + 2] += burstVel[i * 3 + 2] * dt;
          burstVel[i * 3 + 1] -= 1.6 * dt;
          burstLife[i] -= dt * 1.1;
        }
        burstGeo.attributes.position.needsUpdate = true;
        burstMat.opacity = Math.max(0, greetPulse);
        greetPulse = Math.max(0, greetPulse - dt * 0.8);
      }

      renderer.render(scene, camera);
    });

    return () => {
      destroyed = true;
      unsub();
      ro.disconnect();
      window.removeEventListener("scroll", computeProgress);
      window.removeEventListener("resize", computeProgress);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if ((mesh as any).geometry) mesh.geometry.dispose();
        const mat = (mesh as any).material;
        if (mat) {
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  const handleGreet = () => {
    if (greeted) return;
    setGreeted(true);
    onGreet?.();
    burstFnRef.current?.();
  };

  return (
    <div ref={sectionRef} className="greeting-stage">
      <canvas ref={canvasRef} className="greeting-canvas" aria-hidden />
      {!ready && !prefersReducedMotion() && <div className="greeting-loading label">Loading astronaut…</div>}
      <button
        ref={ringRef}
        type="button"
        className={`greeting-ring ${hovering ? "is-hover" : ""} ${greeted ? "is-greeted" : ""}`}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onClick={handleGreet}
        aria-label="Reach out and greet the astronaut"
      >
        <span className="greeting-ring-core" />
      </button>
    </div>
  );
}
