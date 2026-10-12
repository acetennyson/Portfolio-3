"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { prefersReducedMotion } from "../../lib/motion";

// Chromatic Aberration Shader
const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.0015 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    void main() {
      vec2 offset = amount * vec2(1.0, 0.0);
      vec4 cr = texture2D(tDiffuse, vUv + offset);
      vec4 cg = texture2D(tDiffuse, vUv);
      vec4 cb = texture2D(tDiffuse, vUv - offset);
      gl_FragColor = vec4(cr.r, cg.g, cb.b, cg.a);
    }
  `,
};

export default function BlockSceneInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    world: CANNON.World;
    blocks: Array<{ mesh: THREE.Mesh; body: CANNON.Body }>;
    particles: THREE.Points;
    pointer: { x: number; y: number };
    raycaster: THREE.Raycaster;
    clock: THREE.Clock;
    isRunning: boolean;
    cameraTarget: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion()) return;

    const isMobile = window.innerWidth < 768;
    const container = containerRef.current;

    // Check WebGL support
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.warn("WebGL not supported");
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0d);
    scene.fog = new THREE.Fog(0x0c0c0d, 10, 30);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 4, 12);
    camera.lookAt(0, 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Post-processing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom pass for glowing effects
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.4, // strength
      0.6, // radius
      0.3 // threshold
    );
    composer.addPass(bloomPass);

    // Chromatic aberration for a subtle RGB split
    const chromaticPass = new ShaderPass(ChromaticAberrationShader);
    composer.addPass(chromaticPass);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xc6ff3d, 0.6);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-3, 2, 5);
    scene.add(fillLight);

    // Physics world
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -15, 0),
    });
    world.broadphase = new CANNON.NaiveBroadphase();
    (world.solver as unknown as { iterations: number }).iterations = 10;
    world.defaultContactMaterial.friction = 0.4;
    world.defaultContactMaterial.restitution = 0.3;

    // Ground plane (invisible)
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Create blocks with enhanced materials
    const blocks: Array<{ mesh: THREE.Mesh; body: CANNON.Body }> = [];
    const blockCount = isMobile ? 8 : 15;
    const accentIndex = Math.floor(blockCount / 2); // One accent block in the middle

    // Add environment map for reflections
    const envMap = new THREE.CubeTextureLoader().load([
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    ]);

    for (let i = 0; i < blockCount; i++) {
      const size = isMobile ? 0.6 + Math.random() * 0.4 : 0.8 + Math.random() * 0.6;
      const isAccent = i === accentIndex;

      // Enhanced mesh with rounded edges
      const geometry = new THREE.BoxGeometry(size, size, size, 2, 2, 2);
      
      // Smooth edges
      const positionAttribute = geometry.getAttribute('position');
      const vertex = new THREE.Vector3();
      for (let j = 0; j < positionAttribute.count; j++) {
        vertex.fromBufferAttribute(positionAttribute, j);
        vertex.normalize().multiplyScalar(size * 0.48);
        positionAttribute.setXYZ(j, vertex.x, vertex.y, vertex.z);
      }
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: isAccent ? 0xc6ff3d : 0x1a1a1c,
        roughness: isAccent ? 0.3 : 0.6,
        metalness: isAccent ? 0.6 : 0.3,
        emissive: isAccent ? 0xc6ff3d : 0x000000,
        emissiveIntensity: isAccent ? 0.25 : 0,
        envMap: envMap,
        envMapIntensity: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      // Physics body
      const shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2));
      const body = new CANNON.Body({
        mass: size * 2,
        shape: shape,
        position: new CANNON.Vec3(
          (Math.random() - 0.5) * 4,
          8 + i * 1.2,
          (Math.random() - 0.5) * 2
        ),
        angularVelocity: new CANNON.Vec3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ),
      });
      world.addBody(body);

      blocks.push({ mesh, body });
    }

    // Add particle system for visual effects
    const particleCount = isMobile ? 500 : 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleLifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = -100; // Start below view
      particlePositions[i * 3 + 2] = 0;
      particleVelocities[i * 3] = 0;
      particleVelocities[i * 3 + 1] = 0;
      particleVelocities[i * 3 + 2] = 0;
      particleLifetimes[i] = 0;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc6ff3d,
      size: isMobile ? 0.03 : 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Raycaster for pointer interaction
    const raycaster = new THREE.Raycaster();
    const pointer = { x: 0, y: 0 };
    const clock = new THREE.Clock();
    const cameraTarget = new THREE.Vector3(0, 2, 0);

    // Pointer move handler
    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove);

    // Collision tracking for particles
    let particleIndex = 0;
    world.addEventListener('postStep', () => {
      // Check for collisions between blocks
      world.contacts.forEach((contact) => {
        const impactVelocity = contact.bi.velocity.vsub(contact.bj.velocity).length();
        
        if (impactVelocity > 2) { // Significant collision
          const point = contact.ri.vadd(contact.bi.position);
          
          // Spawn particles at collision point
          const particlesToSpawn = Math.min(Math.floor(impactVelocity * 2), 20);
          
          for (let i = 0; i < particlesToSpawn; i++) {
            const idx = particleIndex % particleCount;
            particlePositions[idx * 3] = point.x;
            particlePositions[idx * 3 + 1] = point.y;
            particlePositions[idx * 3 + 2] = point.z;
            
            particleVelocities[idx * 3] = (Math.random() - 0.5) * 2;
            particleVelocities[idx * 3 + 1] = Math.random() * 2;
            particleVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 2;
            
            particleLifetimes[idx] = 1.0;
            particleIndex++;
          }
        }
      });
    });

    // Animation loop
    let isRunning = true;
    let lastTime = 0;

    const animate = (time: number) => {
      if (!isRunning) return;

      const delta = Math.min(clock.getDelta(), 0.1); // Cap delta time
      
      // Update physics
      world.step(1 / 60, delta, 3);

      // Sync meshes with physics
      blocks.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position as any);
        mesh.quaternion.copy(body.quaternion as any);
      });

      // Update particles
      for (let i = 0; i < particleCount; i++) {
        if (particleLifetimes[i] > 0) {
          particlePositions[i * 3] += particleVelocities[i * 3] * delta;
          particlePositions[i * 3 + 1] += particleVelocities[i * 3 + 1] * delta;
          particlePositions[i * 3 + 2] += particleVelocities[i * 3 + 2] * delta;
          
          particleVelocities[i * 3 + 1] -= 5 * delta; // Gravity
          particleLifetimes[i] -= delta * 2;
        } else {
          particlePositions[i * 3 + 1] = -100; // Hide particle
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Dynamic camera movement
      const targetX = pointer.x * 2;
      const targetY = pointer.y * 1.5 + 2;
      cameraTarget.x += (targetX - cameraTarget.x) * 0.05;
      cameraTarget.y += (targetY - cameraTarget.y) * 0.05;
      camera.lookAt(cameraTarget);

      // Subtle camera sway
      const elapsed = clock.getElapsedTime();
      camera.position.x = Math.sin(elapsed * 0.2) * 0.5;
      camera.position.y = 4 + Math.cos(elapsed * 0.3) * 0.3;

      // Cursor interaction - push blocks away with force field
      raycaster.setFromCamera(pointer as unknown as THREE.Vector2, camera);
      const intersects = raycaster.intersectObjects(blocks.map((b) => b.mesh));
      
      if (intersects.length > 0) {
        const intersected = intersects[0];
        const block = blocks.find((b) => b.mesh === intersected.object);
        
        if (block) {
          const force = new CANNON.Vec3(
            (intersected.point.x - block.body.position.x) * 12,
            3,
            (intersected.point.z - block.body.position.z) * 12
          );
          block.body.applyForce(force, block.body.position);
          
          // Add subtle glow effect to hovered block
          const mat = block.mesh.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = Math.min(mat.emissiveIntensity + 0.1, 0.5);
        }
      }

      // Fade out emissive intensity when not hovered
      blocks.forEach(({ mesh }) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const baseIntensity = mat.color.getHex() === 0xc6ff3d ? 0.25 : 0;
        mat.emissiveIntensity += (baseIntensity - mat.emissiveIntensity) * 0.1;
      });

      // Render with post-processing
      composer.render();
      requestAnimationFrame(animate);
    };

    animate(0);

    // Store scene ref
    sceneRef.current = {
      scene,
      camera,
      renderer,
      composer,
      world,
      blocks,
      particles,
      pointer,
      raycaster,
      clock,
      isRunning,
      cameraTarget,
    };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const { camera, renderer, composer } = sceneRef.current;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      isRunning = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      
      if (sceneRef.current) {
        const { renderer, composer, scene, blocks, particles } = sceneRef.current;
        
        // Dispose blocks
        blocks.forEach(({ mesh }) => {
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        });
        
        // Dispose particles
        particles.geometry.dispose();
        (particles.material as THREE.Material).dispose();
        
        // Dispose composer and renderer
        composer.dispose();
        renderer.dispose();
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="hero-stage" />;
}
