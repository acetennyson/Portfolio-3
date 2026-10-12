'use client';

import { useEffect, useRef } from 'react';

export default function FooterAstronaut() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    window.addEventListener('resize', resize);
    
    // Astronaut animation variables
    let time = 0;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
    }> = [];
    
    // Create star particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    // Draw astronaut (simplified SVG-style)
    const drawAstronaut = (x: number, y: number, rotation: number, scale: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      
      // Helmet/head
      ctx.beginPath();
      ctx.arc(0, -20, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#e8e8e8';
      ctx.fill();
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Visor
      ctx.beginPath();
      ctx.arc(0, -20, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 150, 255, 0.6)';
      ctx.fill();
      
      // Reflection on visor
      ctx.beginPath();
      ctx.arc(-6, -25, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
      
      // Body
      ctx.beginPath();
      ctx.rect(-20, 8, 40, 45);
      ctx.fillStyle = '#f0f0f0';
      ctx.fill();
      ctx.strokeStyle = '#999';
      ctx.stroke();
      
      // Chest pack
      ctx.beginPath();
      ctx.rect(-12, 15, 24, 25);
      ctx.fillStyle = '#ddd';
      ctx.fill();
      ctx.stroke();
      
      // Arms
      ctx.beginPath();
      ctx.rect(-30, 10, 10, 35);
      ctx.rect(20, 10, 10, 35);
      ctx.fillStyle = '#f0f0f0';
      ctx.fill();
      ctx.strokeStyle = '#999';
      ctx.stroke();
      
      // Legs
      ctx.beginPath();
      ctx.rect(-15, 53, 12, 30);
      ctx.rect(3, 53, 12, 30);
      ctx.fillStyle = '#f0f0f0';
      ctx.fill();
      ctx.strokeStyle = '#999';
      ctx.stroke();
      
      // Boots
      ctx.beginPath();
      ctx.rect(-18, 83, 15, 10);
      ctx.rect(3, 83, 15, 10);
      ctx.fillStyle = '#999';
      ctx.fill();
      
      ctx.restore();
    };
    
    const animate = () => {
      if (!canvas || !ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Draw stars
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
        
        // Move particle
        particle.y += particle.speed;
        if (particle.y > rect.height) {
          particle.y = 0;
          particle.x = Math.random() * rect.width;
        }
      });
      
      // Animated astronaut
      time += 0.01;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const float = Math.sin(time * 2) * 10;
      const rotation = Math.sin(time) * 0.1;
      const scale = 0.8 + Math.sin(time * 3) * 0.05;
      
      drawAstronaut(centerX, centerY + float, rotation, scale);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="footer-astronaut-canvas"
      aria-label="Floating astronaut animation"
    />
  );
}
