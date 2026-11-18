"use client";
import { useEffect, useRef, useState } from "react";
import { Dices } from "lucide-react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import ToolShell from "../../../../components/shell/ToolShell";
import { getTool } from "../../../../lib/tools";

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

function DiceRoller() {
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
  const [rolls, setRolls] = useState<number[]>([]);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth || 1, H = el.clientHeight || 1;

    // Three
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setUnsupported(true);
      return;
    }
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);

    // Frame the 8x8 tray whatever shape the stage is (wide desktop, tall phone).
    const fitCamera = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;
      const vHalf = (45 * Math.PI) / 360;
      const hHalf = Math.atan(Math.tan(vHalf) * aspect);
      const dist = Math.max(6.2 / Math.tan(vHalf), 5.6 / Math.tan(hHalf));
      camera.position.set(0, dist * 0.62, dist * 0.78);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    fitCamera(W, H);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(5, 10, 5);
    dir.castShadow = true;
    scene.add(dir);
    const point = new THREE.PointLight(0xc6ff3d, 1.2, 24);
    point.position.set(-3, 5, 3);
    scene.add(point);

    // Floor (physics + a faint tint) and tray outline
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xc6ff3d, transparent: true, opacity: 0.05 }),
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const grid = new THREE.GridHelper(8, 8, 0xc6ff3d, 0x8d8a84);
    (grid.material as THREE.Material).opacity = 0.22;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // Dice faces: ink with lime pips
    const materials = DOT_LAYOUTS.map(dots =>
      new THREE.MeshStandardMaterial({
        map: makeFaceTexture(dots, "#0c0c0d", "#c6ff3d"),
        roughness: 0.35,
        metalness: 0.1,
      })
    );
    const diceMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
    diceMesh.castShadow = true;
    scene.add(diceMesh);

    // Physics
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) });
    world.broadphase = new CANNON.NaiveBroadphase();
    (world.solver as any).iterations = 20;

    const floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(floorBody);

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

    const diceBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
      linearDamping: 0.3,
      angularDamping: 0.3,
    });
    diceBody.position.set(0, 5, 0);
    world.addBody(diceBody);

    const s = { renderer, scene, camera, world, diceMesh, diceBody, animId: 0, settled: true, settleTimer: 0 };
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
            setRolls((r) => [face, ...r].slice(0, 30));
            setRolling(false);
          }
        } else {
          s.settleTimer = 0;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // The stage can change shape without the window resizing (rail appears, rotation), so watch the element.
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      fitCamera(w, h);
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(s.animId);
      ro.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
      stateRef.current = null;
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

  const rollRef = useRef(roll);
  rollRef.current = roll;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== "Space" || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(t.tagName)) return;
      e.preventDefault();
      rollRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = [1, 2, 3, 4, 5, 6].map((n) => rolls.filter((r) => r === n).length);
  const peak = Math.max(1, ...counts);

  const aside = (
    <>
      <div className="rail-block">
        <h2 className="label">Controls</h2>
        <ul className="rail-list">
          <li>Roll <b><kbd className="k">Space</kbd></b></li>
          <li>Or tap the tray <b>anywhere</b></li>
        </ul>
      </div>
      <div className="rail-block">
        <h2 className="label">Last rolls</h2>
        {rolls.length === 0 ? (
          <p className="rail-empty">Nothing yet. Roll to start a log.</p>
        ) : (
          <>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: ".95rem", letterSpacing: ".08em", wordBreak: "break-all" }}>
              {rolls.slice(0, 14).join(" ")}
            </p>
            <div className="dist" role="img" aria-label={`Roll distribution: ${counts.map((c, i) => `${i + 1}: ${c}`).join(", ")}`}>
              {counts.map((c, i) => (
                <div key={i}>
                  <i style={{ height: `${(c / peak) * 100}%` }} />
                  <span>{i + 1}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <ToolShell tool={getTool("dice")!} aside={aside}>
      <div className="dice">
        {unsupported ? (
          <div className="wb-state" style={{ height: "100%", justifyContent: "center" }}>
            <Dices size={34} strokeWidth={1.3} aria-hidden />
            <h2>3D isn’t available here</h2>
            <p>Your browser couldn’t start WebGL, which the dice need. Try turning on hardware acceleration or use another browser.</p>
          </div>
        ) : (
          <>
            <div ref={mountRef} className="dice-canvas" onClick={roll} />
            <div className="dice-result" aria-live="polite">
              {result !== null && !rolling && (
                <>
                  <strong>{result}</strong>
                  <span>rolled</span>
                </>
              )}
              {rolling && <span>Rolling…</span>}
              {result === null && !rolling && <span>Tap to roll</span>}
            </div>
            <div className="dice-dock">
              <button className="wb-btn" onClick={roll} disabled={rolling}>
                <Dices size={18} aria-hidden /> {rolling ? "Rolling…" : "Roll the die"}
              </button>
            </div>
          </>
        )}
      </div>
    </ToolShell>
  );
}

export default function DiceClient() {
  return <DiceRoller />;
}
