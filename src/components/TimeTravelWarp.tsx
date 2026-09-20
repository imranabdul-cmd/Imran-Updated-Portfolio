import React, { useEffect, useRef, useState } from 'react';

interface TimeTravelWarpProps {
  isActive: boolean;
  onUnlock?: () => void;
  onComplete: () => void;
}

/**
 * TimeTravelWarp
 * Hyper-Realistic 4-Phase Cinematic Sequence:
 * 1. Hyperspace Time-Warp Canvas & Photonic Flare (1.5s)
 * 2. Cosmic Deep Blackout & Consciousness Sync (2.2s)
 * 3. Realistic 2-Step Drowsy Double-Blink Eye Awakening + Optical Focus Accommodation (2.5s)
 * 4. Smooth Land into Main Portfolio (#about)
 */
export const TimeTravelWarp: React.FC<TimeTravelWarpProps> = ({ isActive, onUnlock, onComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'warp' | 'blackout' | 'eyelids' | 'done'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    // Phase 1: Hyperspace Time Warp (1.5s)
    setPhase('warp');

    const warpTimer = setTimeout(() => {
      // Phase 2: 2.2s Cinematic Cosmic Blackout
      setPhase('blackout');

      // Unlock portfolio DOM silently in the background
      onUnlock?.();

      const blackoutTimer = setTimeout(() => {
        // Position at CurvedLoop & Stat Cards section while dark
        const target = document.getElementById('portfolio-landing') || document.getElementById('portfolio-core');
        if (target) {
          target.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
        }

        // Phase 3: Hyper-Realistic Double-Blink Eye Awakening (2.5s)
        setPhase('eyelids');

        const eyeTimer = setTimeout(() => {
          setPhase('done');
          onComplete();
        }, 2500);

        return () => clearTimeout(eyeTimer);
      }, 2200); // 2.2s Deep Black Screen

      return () => clearTimeout(blackoutTimer);
    }, 1500); // 1.5s Hyperspace Warp Speed

    return () => clearTimeout(warpTimer);
  }, [isActive]);

  // Hyperspace Star-Warp Canvas Animation (Ultra-Crisp 4K Retina Sharpness)
  useEffect(() => {
    if (phase !== 'warp') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    // Expand dimensions by 130% to accommodate screen shake / vortex transformations without edge gaps
    const width = Math.ceil(window.innerWidth * 1.3);
    const height = Math.ceil(window.innerHeight * 1.3);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const stars: Array<{ x: number; y: number; z: number; pz: number; color: string; coreColor: string }> = [];
    const numStars = 650;

    const palette = [
      { aura: 'rgba(6, 182, 212,', core: '#e0f2fe' },   // Electric Cyan
      { aura: 'rgba(251, 191, 36,', core: '#fef08a' },  // Solar Amber
      { aura: 'rgba(168, 85, 247,', core: '#f3e8ff' },  // Cosmic Purple
      { aura: 'rgba(52, 211, 153,', core: '#d1fae5' },  // Emerald
      { aura: 'rgba(255, 255, 255,', core: '#ffffff' }, // Pure Starlight
    ];

    for (let i = 0; i < numStars; i++) {
      const p = palette[Math.floor(Math.random() * palette.length)];
      stars.push({
        x: (Math.random() - 0.5) * width * 2.2,
        y: (Math.random() - 0.5) * height * 2.2,
        z: Math.random() * width,
        pz: width,
        color: p.aura,
        coreColor: p.core,
      });
    }

    const cx = width / 2;
    const cy = height / 2;
    let speed = 14;

    const render = () => {
      speed += 1.25;

      // Crystal deep space backdrop (Clean refresh, zero muddy pixelation)
      ctx.fillStyle = '#02040a';
      ctx.fillRect(0, 0, width, height);

      ctx.lineCap = 'round';

      for (let i = 0; i < numStars; i++) {
        const s = stars[i];
        s.pz = s.z;
        s.z -= speed;

        if (s.z <= 0) {
          s.z = width;
          s.pz = width;
          s.x = (Math.random() - 0.5) * width * 2.2;
          s.y = (Math.random() - 0.5) * height * 2.2;
        }

        const k = 280 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        const pk = 280 / (s.pz + speed * 1.8);
        const prevX = s.x * pk + cx;
        const prevY = s.y * pk + cy;

        // Skip if outside extended canvas bounds
        if (px < -100 || px > width + 100 || py < -100 || py > height + 100) continue;

        const depthPct = 1 - s.z / width;
        const size = Math.max(1, depthPct * 4.5);
        const alpha = Math.min(1, Math.max(0.1, depthPct * 1.6));

        // ── PASS 1: Radiant Luminous Color Aura ──
        const grad = ctx.createLinearGradient(prevX, prevY, px, py);
        grad.addColorStop(0, `${s.color} 0)`);
        grad.addColorStop(0.6, `${s.color} ${alpha * 0.8})`);
        grad.addColorStop(1, `${s.color} ${alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = size * 2.2;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.stroke();

        // ── PASS 2: Laser-Sharp Solid White Core Beam ──
        const coreGrad = ctx.createLinearGradient(prevX, prevY, px, py);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        coreGrad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.7})`);
        coreGrad.addColorStop(1, `#ffffff`);

        ctx.strokeStyle = coreGrad;
        ctx.lineWidth = Math.max(0.75, size * 0.75);
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [phase]);

  if (phase === 'idle' || phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      pointerEvents: 'auto',
      overflow: 'hidden',
    }}>
      {/* ── PHASE 1: HYPERSPACE TIME WARP (With Intense Screen Rumble & Tremor) ── */}
      {phase === 'warp' && (
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '-15%',
          width: '130%',
          height: '130%',
          animation: 'warp-screen-shake 1.5s cubic-bezier(0.3, 0, 0.2, 1) forwards',
          transformOrigin: 'center center',
          overflow: 'hidden',
        }}>
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              display: 'block',
              animation: 'warp-vortex 1.5s cubic-bezier(0.7, 0, 1, 1) forwards',
            }}
          />

          {/* Central Warp Pulse Rings */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 200,
            height: 200,
            marginLeft: -100,
            marginTop: -100,
            borderRadius: '50%',
            border: '2px solid rgba(6, 182, 212, 0.7)',
            animation: 'pulse-ring 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite',
            pointerEvents: 'none',
          }} />

          {/* Climax Photonic Flash */}
          <div style={{
            position: 'absolute',
            inset: '-10%',
            background: '#ffffff',
            animation: 'photonic-flash 1.5s ease-out forwards',
            pointerEvents: 'none',
          }} />
        </div>
      )}

      {/* ── PHASE 2: 2.2-SECOND CINEMATIC COSMIC BLACKOUT ── */}
      {phase === 'blackout' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}>
          {/* Subtle heartbeat pulsing consciousness subtitle */}
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 3.2vw, 28px)',
            color: 'rgba(251, 191, 36, 0.85)',
            letterSpacing: '0.14em',
            animation: 'heartbeat 2.2s ease-in-out infinite',
            textAlign: 'center',
            padding: '0 20px',
          }}>
            Entering Imran's Dimension...
          </div>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10.5px',
            color: 'rgba(6, 182, 212, 0.65)',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            animation: 'heartbeat 2.2s ease-in-out infinite',
            animationDelay: '0.3s',
          }}>
            ✦ Consciousness Synchronizing ✦
          </div>
        </div>
      )}

      {/* ── PHASE 3: REALISTIC 2-STEP DROWSY DOUBLE-BLINK EYE OPENING ── */}
      {phase === 'eyelids' && (
        <>
          {/* Eyeball Peripheral Lens Focus & Pupil Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.85) 100%)',
            animation: 'eye-vignette 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            pointerEvents: 'none',
            zIndex: 10,
          }} />

          {/* Optical Blur-to-Sharp Focus & Glare Adaptation Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            animation: 'lens-focus-realistic 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            pointerEvents: 'none',
            zIndex: 15,
          }} />

          {/* ── TOP EYELID (Natural Anatomical Curve + Eyelashes Shadow) ── */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '52vh',
            background: 'linear-gradient(to bottom, #000000 80%, rgba(5,5,5,0.98) 92%, #000000 100%)',
            boxShadow: '0 35px 80px 20px rgba(0, 0, 0, 0.98)',
            animation: 'eyelid-top-realistic 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            borderBottom: '4px solid rgba(251, 191, 36, 0.25)',
            borderRadius: '0 0 50% 50% / 0 0 45px 45px',
            zIndex: 20,
          }}>
            {/* Eyelash fringe shadow effect */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 18,
              background: 'radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.9) 0%, transparent 75%)',
              filter: 'blur(3px)',
            }} />
          </div>

          {/* ── BOTTOM EYELID (Natural Anatomical Upward Curve) ── */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '52vh',
            background: 'linear-gradient(to top, #000000 80%, rgba(5,5,5,0.98) 92%, #000000 100%)',
            boxShadow: '0 -35px 80px 20px rgba(0, 0, 0, 0.98)',
            animation: 'eyelid-bottom-realistic 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            borderTop: '4px solid rgba(251, 191, 36, 0.25)',
            borderRadius: '50% 50% 0 0 / 45px 45px 0 0',
            zIndex: 20,
          }} />
        </>
      )}
    </div>
  );
};

export default TimeTravelWarp;
