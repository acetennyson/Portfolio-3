'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ScrollAstronaut() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    astronaut: THREE.Group;
    animationId?: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create astronaut
    const astronaut = createAstronaut();
    scene.add(astronaut);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    sceneRef.current = { scene, camera, renderer, astronaut };

    // Animation loop
    let scrollY = 0;
    const animate = () => {
      if (!sceneRef.current) return;

      const { astronaut, renderer, scene, camera } = sceneRef.current;

      // Scroll-based animation
      const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
      
      // Rotate astronaut based on scroll
      astronaut.rotation.y = scrollProgress * Math.PI * 4;
      astronaut.rotation.x = Math.sin(scrollProgress * Math.PI * 2) * 0.3;
      
      // Float up and down
      astronaut.position.y = Math.sin(Date.now() * 0.001) * 0.2;
      
      // Scale in/out based on scroll
      const scale = 1 + Math.sin(scrollProgress * Math.PI * 2) * 0.2;
      astronaut.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle scroll
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    // Handle resize
    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      
      const { camera, renderer } = sceneRef.current;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="scroll-astronaut-container">
      <canvas ref={canvasRef} className="scroll-astronaut-canvas" />
    </div>
  );
}

function createAstronaut(): THREE.Group {
  const astronaut = new THREE.Group();

  // Materials
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    metalness: 0.3,
    roughness: 0.7,
  });
  
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x6495ed,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.7,
  });
  
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.5,
    roughness: 0.5,
  });

  // Helmet
  const helmetGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const helmet = new THREE.Mesh(helmetGeo, whiteMat);
  helmet.position.y = 1.2;
  astronaut.add(helmet);

  // Visor
  const visorGeo = new THREE.SphereGeometry(0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.y = 1.2;
  visor.position.z = 0.1;
  astronaut.add(visor);

  // Body
  const bodyGeo = new THREE.CapsuleGeometry(0.4, 0.8, 8, 16);
  const body = new THREE.Mesh(bodyGeo, whiteMat);
  body.position.y = 0.3;
  astronaut.add(body);

  // Chest pack
  const chestGeo = new THREE.BoxGeometry(0.5, 0.4, 0.2);
  const chest = new THREE.Mesh(chestGeo, darkMat);
  chest.position.set(0, 0.4, 0.4);
  astronaut.add(chest);

  // Arms
  const armGeo = new THREE.CapsuleGeometry(0.12, 0.6, 8, 16);
  const leftArm = new THREE.Mesh(armGeo, whiteMat);
  leftArm.position.set(-0.5, 0.4, 0);
  leftArm.rotation.z = 0.3;
  astronaut.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, whiteMat);
  rightArm.position.set(0.5, 0.4, 0);
  rightArm.rotation.z = -0.3;
  astronaut.add(rightArm);

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.15, 0.7, 8, 16);
  const leftLeg = new THREE.Mesh(legGeo, whiteMat);
  leftLeg.position.set(-0.2, -0.5, 0);
  astronaut.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, whiteMat);
  rightLeg.position.set(0.2, -0.5, 0);
  astronaut.add(rightLeg);

  // Boots
  const bootGeo = new THREE.BoxGeometry(0.22, 0.15, 0.3);
  const leftBoot = new THREE.Mesh(bootGeo, darkMat);
  leftBoot.position.set(-0.2, -0.9, 0.05);
  astronaut.add(leftBoot);

  const rightBoot = new THREE.Mesh(bootGeo, darkMat);
  rightBoot.position.set(0.2, -0.9, 0.05);
  astronaut.add(rightBoot);

  // Backpack
  const backpackGeo = new THREE.BoxGeometry(0.5, 0.6, 0.3);
  const backpack = new THREE.Mesh(backpackGeo, whiteMat);
  backpack.position.set(0, 0.4, -0.35);
  astronaut.add(backpack);

  return astronaut;
}
