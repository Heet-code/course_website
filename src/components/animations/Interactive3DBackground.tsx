import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  // Rotated coordinates
  rx: number;
  ry: number;
  rz: number;
}

export const Interactive3DBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  // Sync theme updates
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themechange', handleThemeChange);
    // Also poll occasionally or use a MutationObserver just in case theme changes without event
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('themechange', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle settings
    const particleCount = Math.min(65, Math.floor((width * height) / 22000));
    const particles: Particle[] = [];
    const connectionDistance = 140;
    const focalLength = 320;

    // Mouse interactive coordinates
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    // Initialize particles in a 3D box
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 0.8,
        y: (Math.random() - 0.5) * height * 0.8,
        z: (Math.random() - 0.5) * 400,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        rx: 0,
        ry: 0,
        rz: 0,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      // Normalized coordinates relative to center
      mouseX = (e.clientX - width / 2) / (width / 2);
      mouseY = (e.clientY - height / 2) / (height / 2);
      
      targetRotY = mouseX * 0.35; // Yaw rotation limit
      targetRotX = -mouseY * 0.35; // Pitch rotation limit
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = () => {
      // Clear with very subtle backdrop overlay to let some trailing happen (or clean clear)
      ctx.clearRect(0, 0, width, height);

      // Interpolate rotation angles towards target
      if (!prefersReducedMotion) {
        rotX += (targetRotX - rotX) * 0.05;
        rotY += (targetRotY - rotY) * 0.05;
      } else {
        rotX = 0;
        rotY = 0;
      }

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Color scheme based on dark/light mode
      const primaryColor = isDark ? '250, 212, 192' : '250, 212, 192'; // Peach accent
      const secondaryColor = isDark ? '128, 161, 193' : '79, 110, 138'; // Blue accent
      const nodeColor = isDark ? '255, 255, 255' : '15, 23, 42'; // White nodes / Slate nodes

      // 1. Update and rotate positions
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          // Slow drift movement
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Soft boundaries bounce
          const boundaryX = width * 0.5;
          const boundaryY = height * 0.5;
          if (Math.abs(p.x) > boundaryX) p.vx *= -1;
          if (Math.abs(p.y) > boundaryY) p.vy *= -1;
          if (Math.abs(p.z) > 200) p.vz *= -1;
        }

        // Apply pitch (rotation about X axis)
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.z * cosX + p.y * sinX;

        // Apply yaw (rotation about Y axis)
        const x2 = p.x * cosY - z1 * sinY;
        const z2 = z1 * cosY + p.x * sinY;

        p.rx = x2;
        p.ry = y1;
        p.rz = z2;
      });

      // 2. Draw connections (lines)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          // 3D Distance check
          const dx = p1.rx - p2.rx;
          const dy = p1.ry - p2.ry;
          const dz = p1.rz - p2.rz;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < connectionDistance) {
            // Perspective projection for both nodes
            const scale1 = focalLength / (focalLength + p1.rz);
            const scale2 = focalLength / (focalLength + p2.rz);

            const x1_proj = width / 2 + p1.rx * scale1;
            const y1_proj = height / 2 + p1.ry * scale1;
            const x2_proj = width / 2 + p2.rx * scale2;
            const y2_proj = height / 2 + p2.ry * scale2;

            // Line opacity based on proximity in 3D
            const alpha = (1 - dist3D / connectionDistance) * 0.14;
            
            // Alternating line colors for variety
            const color = (i + j) % 2 === 0 ? secondaryColor : primaryColor;

            ctx.beginPath();
            ctx.moveTo(x1_proj, y1_proj);
            ctx.lineTo(x2_proj, y2_proj);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 0.8 * Math.min(scale1, scale2);
            ctx.stroke();
          }
        }
      }

      // 3. Draw nodes (points)
      particles.forEach((p) => {
        const scale = focalLength / (focalLength + p.rz);
        
        // Depth cull if too close or behind camera
        if (scale <= 0) return;

        const x_proj = width / 2 + p.rx * scale;
        const y_proj = height / 2 + p.ry * scale;

        // Node size adapts to depth
        const radius = Math.max(0.5, 1.8 * scale);
        // Soft opacity based on depth
        const alpha = Math.min(1, Math.max(0.1, (focalLength - p.rz) / (focalLength * 1.5)));

        ctx.beginPath();
        ctx.arc(x_proj, y_proj, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeColor}, ${alpha * 0.4})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion, isDark]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 block h-full w-full opacity-60 dark:opacity-40 pointer-events-none select-none -z-10" 
    />
  );
};

export default Interactive3DBackground;
