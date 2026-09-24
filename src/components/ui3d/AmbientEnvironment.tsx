import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

export const AmbientEnvironment: React.FC = () => {
  const { currentTheme } = useTheme();
  const { settings } = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Track cursor for subtle ambient spotlight
  useEffect(() => {
    if (!settings.cursorGlow || isMobile || settings.animationIntensity === 'off') return;

    const handlePointerMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, [settings.cursorGlow, isMobile, settings.animationIntensity]);

  // Particle simulation loop with full High-DPI support & visibility pausing
  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (
      settings.reducedMotion ||
      prefersReducedMotion ||
      settings.animationIntensity === 'off' ||
      settings.backgroundAtmosphere === 'none'
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isTabVisible = !document.hidden;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };
    window.addEventListener('resize', handleResize);

    const particleType = currentTheme.atmosphere?.ambientParticles || 'none';
    if (particleType === 'none') {
      ctx.clearRect(0, 0, width, height);
      return () => window.removeEventListener('resize', handleResize);
    }

    // Determine count based on device and intensity
    const baseCount = isMobile ? 12 : 36;
    const countMultiplier = settings.animationIntensity === 'high' ? 1.5 : settings.animationIntensity === 'low' ? 0.4 : 1.0;
    const count = Math.round(baseCount * countMultiplier);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      alphaChange: number;
      char?: string;
    }

    const matrixChars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (particleType === 'sparks' ? 1.2 : 0.4),
        vy: particleType === 'bubbles' ? -Math.random() * 0.8 - 0.2 : particleType === 'matrix' ? Math.random() * 2 + 1 : (Math.random() - 0.5) * 0.4,
        size: Math.random() * (particleType === 'bubbles' ? 6 : particleType === 'sakura' ? 5 : 2.5) + 1,
        opacity: Math.random() * 0.5 + 0.1,
        alphaChange: (Math.random() - 0.5) * 0.01,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)]
      });
    }

    const primaryColor = currentTheme.colors.colorPrimary || '#38bdf8';

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.alphaChange;

        if (p.opacity <= 0.05 || p.opacity >= 0.6) {
          p.alphaChange *= -1;
        }

        // Screen wraps
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

        if (particleType === 'matrix') {
          ctx.fillStyle = currentTheme.colors.colorCorrect || '#00ff41';
          ctx.font = '12px monospace';
          ctx.fillText(p.char || '1', p.x, p.y);
        } else if (particleType === 'sakura') {
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (particleType === 'sparks') {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Stars, bubbles, neon dust
          ctx.fillStyle = primaryColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationId);
    };
  }, [currentTheme, settings.reducedMotion, settings.animationIntensity, settings.backgroundAtmosphere, isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Theme-Specific Ambient Gradient Glow */}
      <div
        className="absolute inset-0 transition-opacity duration-700 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 50% -20%, var(--theme-glow, rgba(56, 189, 248, 0.25)), transparent 70%)`
        }}
      />

      {/* 2. Interactive Cursor Spotlight (Torch effect) */}
      {settings.cursorGlow && !isMobile && settings.animationIntensity !== 'off' && (
        <div
          className="absolute -inset-96 transition-transform duration-75 ease-out opacity-25"
          style={{
            transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
            background: `radial-gradient(circle 350px at 0 0, var(--theme-glow, rgba(56, 189, 248, 0.35)), transparent 80%)`
          }}
        />
      )}

      {/* 3. Subtle Cyber Grid Overlay (Optional Theme Property) */}
      {currentTheme.atmosphere?.gridPattern && (
        <div className="absolute inset-0 cyber-grid-overlay opacity-40" />
      )}

      {/* 4. Canvas-based Particles / Atmosphere (High-DPI sharp rendering) */}
      {settings.backgroundAtmosphere !== 'none' && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}
    </div>
  );
};
