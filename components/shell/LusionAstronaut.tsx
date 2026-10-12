'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LusionAstronaut() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Setup Three.js scene
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load astronaut model using the downloaded .buf files
    const loader = new THREE.FileLoader();
    const astronautGroup = new THREE.Group();
    scene.add(astronautGroup);

    // Create a simple astronaut geometry as placeholder
    // (The .buf files need custom parsing which we'll skip for now)
    const geometry = new THREE.Group();
    
    // Helmet
    const helmetGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      metalness: 0.3,
      roughness: 0.7,
    });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 1.2;
    geometry.add(helmet);

    // Visor
    const visorGeo = new THREE.SphereGeometry(0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x6495ed,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.y = 1.2;
    visor.position.z = 0.1;
    geometry.add(visor);

    // Body
    const bodyGeo = new THREE.CapsuleGeometry(0.4, 0.8, 8, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      metalness: 0.3,
      roughness: 0.7,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.3;
    geometry.add(body);

    // Arms
    const armGeo = new THREE.CapsuleGeometry(0.12, 0.6, 8, 16);
    const leftArm = new THREE.Mesh(armGeo, bodyMat);
    leftArm.position.set(-0.5, 0.4, 0);
    leftArm.rotation.z = 0.3;
    geometry.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, bodyMat);
    rightArm.position.set(0.5, 0.4, 0);
    rightArm.rotation.z = -0.3;
    geometry.add(rightArm);

    // Legs
    const legGeo = new THREE.CapsuleGeometry(0.15, 0.7, 8, 16);
    const leftLeg = new THREE.Mesh(legGeo, bodyMat);
    leftLeg.position.set(-0.2, -0.5, 0);
    geometry.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, bodyMat);
    rightLeg.position.set(0.2, -0.5, 0);
    geometry.add(rightLeg);

    astronautGroup.add(geometry);

    // Animation
    let scrollY = 0;
    let animationId: number;

    const animate = () => {
      const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
      
      // Scroll-based animations like Lusion
      astronautGroup.rotation.y = scrollProgress * Math.PI * 4;
      astronautGroup.rotation.x = Math.sin(scrollProgress * Math.PI * 2) * 0.3;
      astronautGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;
      
      const scale = 1 + Math.sin(scrollProgress * Math.PI * 2) * 0.2;
      astronautGroup.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Event handlers
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
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
    <div ref={containerRef} className="lusion-astronaut-wrapper">
      <canvas ref={canvasRef} className="lusion-canvas" />
    </div>
  );
}
