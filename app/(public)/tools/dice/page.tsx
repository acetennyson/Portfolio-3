"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";

// Dot positions for each face (1-6), normalized -0.5..0.5 on face plane
const DOT_LAYOUTS: [number, number][][] = [
  [[0, 0]],                                                          // 1
  [[-0.25, -0.25], [0.25, 0.25]],                                    // 2
  [[-0.25, -0.25], [0, 0], [0.25, 0.25]],                           // 3
  [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]],    // 4
  [[-0.25, -0.25], [0.25, -0.25], [0, 0], [-0.25, 0.25], [0.25, 0.25]], // 5
  [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0], [0.25, 0], [-0.25, 0.25], [0.25, 0.25]], // 6
];

function makeFaceTexture(dots: [number, number][], bg: string, dot: string): THREE.Texture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  // background
  ctx.fillStyle = bg;
  roundRect(ctx, 0, 0, size, size, 32);
  ctx.fill();
  // dots
  ctx.fillStyle = dot;
  const r = 18;
  for (const [dx, dy] of dots) {
    ctx.beginPath();
    ctx.arc(size / 2 + dx * size, size / 2 + dy * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Three.js BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
// DOT_LAYOUTS index 0..5 = faces 1..6
// So local normal → face value:
//   +X (1,0,0)  → 1
//   -X (-1,0,0) → 2
//   +Y (0,1,0)  → 3
//   -Y (0,-1,0) → 4
//   +Z (0,0,1)  → 5
//   -Z (0,0,-1) → 6
function getFaceUp(q: CANNON.Quaternion): number {
  const faces: [CANNON.Vec3, number][] = [
    [new CANNON.Vec3(1, 0, 0),  1],
    [new CANNON.Vec3(-1, 0, 0), 2],
    [new CANNON.Vec3(0, 1, 0),  3],
    [new CANNON.Vec3(0, -1, 0), 4],
    [new CANNON.Vec3(0, 0, 1),  5],
    [new CANNON.Vec3(0, 0, -1), 6],
  ];
  const worldUp = new CANNON.Vec3(0, 1, 0);
  let best = -Infinity, bestVal = 1;
  for (const [localNormal, val] of faces) {
    const worldNormal = q.vmult(localNormal);
    const dot = worldNormal.dot(worldUp);
    if (dot > best) { best = dot; bestVal = val; }
  }
  return bestVal;
}

export default function DiceRoller() {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    world: CANNON.World;
    diceMesh: THREE.Mesh;
    diceBody: CANNON.Body;
    animId: number;
    settled: boolean;
    settleTimer: number;
  } | null>(null);

  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth, H = el.clientHeight;

    // Three
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 6, 8);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(5, 10, 5);
    dir.castShadow = true;
    scene.add(dir);
    const point = new THREE.PointLight(0x8b5cf6, 1.5, 20);
    point.position.set(-3, 5, 3);
    scene.add(point);

    // Floor (invisible, physics only + subtle visual)
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.05 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Grid lines
    const grid = new THREE.GridHelper(10, 10, 0x8b5cf6, 0x3b82f6);
    (grid.material as THREE.Material).opacity = 0.08;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // Dice textures — dark bg, white dots
    const materials = DOT_LAYOUTS.map(dots =>
      new THREE.MeshStandardMaterial({
        map: makeFaceTexture(dots, "#0f0f17", "#ffffff"),
        roughness: 0.3,
        metalness: 0.1,
      })
    );

    const diceGeo = new THREE.BoxGeometry(1, 1, 1);
    const diceMesh = new THREE.Mesh(diceGeo, materials);
    diceMesh.castShadow = true;
    scene.add(diceMesh);

    // Physics
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) });
    world.broadphase = new CANNON.NaiveBroadphase();
    (world.solver as any).iterations = 20;

    const floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(floorBody);

    // Walls (invisible)
    const wallShape = new CANNON.Plane();
    const walls = [
      { pos: new CANNON.Vec3(-4, 0, 0), euler: [0, Math.PI / 2, 0] },
      { pos: new CANNON.Vec3(4, 0, 0), euler: [0, -Math.PI / 2, 0] },
      { pos: new CANNON.Vec3(0, 0, -4), euler: [0, 0, 0] },
      { pos: new CANNON.Vec3(0, 0, 4), euler: [0, Math.PI, 0] },
    ];
    walls.forEach(({ pos, euler }) => {
      const b = new CANNON.Body({ mass: 0, shape: wallShape });
      b.position.copy(pos);
      b.quaternion.setFromEuler(euler[0], euler[1], euler[2]);
      world.addBody(b);
    });

    // Fixed mass dice body
    const diceBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
      linearDamping: 0.3,
      angularDamping: 0.3,
    });
    diceBody.position.set(0, 5, 0);
    world.addBody(diceBody);

    let animId = 0;
    const s = { renderer, scene, camera, world, diceMesh, diceBody, animId, settled: true, settleTimer: 0 };
    stateRef.current = s;

    const animate = () => {
      s.animId = requestAnimationFrame(animate);
      world.fixedStep();
      diceMesh.position.copy(diceBody.position as any);
      diceMesh.quaternion.copy(diceBody.quaternion as any);

      if (!s.settled) {
        const speed = diceBody.velocity.length() + diceBody.angularVelocity.length();
        if (speed < 0.5) {
          s.settleTimer += 1;
          if (s.settleTimer > 30) {
            s.settled = true;
            const face = getFaceUp(diceBody.quaternion);
            setResult(face);
            setRolling(false);
          }
        } else {
          s.settleTimer = 0;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const W = el.clientWidth, H = el.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(s.animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  function roll() {
    const s = stateRef.current;
    if (!s || rolling) return;
    setRolling(true);
    setResult(null);
    s.settled = false;
    s.settleTimer = 0;

    // Reset position
    s.diceBody.position.set((Math.random() - 0.5) * 2, 4, (Math.random() - 0.5) * 2);
    s.diceBody.velocity.set(0, 0, 0);
    s.diceBody.angularVelocity.set(0, 0, 0);
    s.diceBody.quaternion.setFromEuler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

    // Randomised throw force, fixed mass
    const force = 8 + Math.random() * 10;
    const angle = Math.random() * Math.PI * 2;
    s.diceBody.applyImpulse(
      new CANNON.Vec3(Math.cos(angle) * force * 0.4, -force * 0.3, Math.sin(angle) * force * 0.4),
      new CANNON.Vec3(0.5 - Math.random(), 0.5 - Math.random(), 0.5 - Math.random())
    );
    s.diceBody.angularVelocity.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: "var(--accent)" }}>Tool</p>
        <h1 className="text-4xl font-black tracking-tight grad-text text-center">Dice Roller</h1>
      </div>

      {/* canvas */}
      <div ref={mountRef} className="rounded-2xl overflow-hidden w-full"
        style={{ maxWidth: 480, height: 360, background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 16px 60px rgba(139,92,246,0.2)" }} />

      {/* result */}
      <div className="text-center h-12">
        {result !== null && !rolling && (
          <div className="flex items-center gap-3">
            <span className="text-lg" style={{ color: "var(--fg-muted)" }}>You rolled</span>
            <span className="text-5xl font-black grad-text">{result}</span>
          </div>
        )}
        {rolling && (
          <span className="text-sm animate-pulse" style={{ color: "var(--fg-muted)" }}>Rolling…</span>
        )}
      </div>

      <button
        onClick={roll}
        disabled={rolling}
        className="btn-grad rounded-full px-10 py-3.5 text-base font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
        style={{ boxShadow: "0 8px 32px rgba(139,92,246,0.35)" }}>
        {rolling ? "Rolling…" : "🎲 Roll Dice"}
      </button>
    </div>
  );
}
