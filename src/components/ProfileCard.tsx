import React, {
  useEffect, useRef, useCallback, useMemo, useState,
} from 'react';

/* ── inject holo keyframes once ── */
const KF_ID = 'pc-kf';
if (typeof document !== 'undefined' && !document.getElementById(KF_ID)) {
  const s = document.createElement('style');
  s.id = KF_ID;
  s.textContent = `
    @keyframes pc-holo {
      0%   { background-position: 50% 0%, 0 0, center; }
      100% { background-position: 50% 100%, 90% 90%, center; }
    }
    @keyframes pc-shine {
      0%   { opacity: 0; }
      50%  { opacity: 0.18; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(s);
}

/* ── math helpers ── */
const clamp  = (v: number, mn = 0, mx = 100) => Math.min(Math.max(v, mn), mx);
const round  = (v: number, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v: number, f0: number, f1: number, t0: number, t1: number) =>
  round(t0 + ((t1 - t0) * (v - f0)) / (f1 - f0));

/* ── props ── */
export interface ProfileCardProps {
  avatarUrl?:            string;
  name?:                 string;
  title?:                string;
  handle?:               string;
  status?:               string;
  contactText?:          string;
  showUserInfo?:         boolean;
  enableTilt?:           boolean;
  enableMobileTilt?:     boolean;
  behindGlowEnabled?:    boolean;
  behindGlowColor?:      string;
  innerGradient?:        string;
  iconUrl?:              string;
  onContactClick?:       () => void;
  className?:            string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl         = '/assets/photos/Profile.jpeg',
  name              = 'Imran A',
  title             = 'Software & AI Engineer',
  handle            = 'imranabdul-cmd',
  status            = 'Online',
  contactText       = 'Contact Me',
  showUserInfo      = true,
  enableTilt        = true,
  enableMobileTilt  = false,
  behindGlowEnabled = true,
  behindGlowColor   = 'rgba(125, 190, 255, 0.67)',
  iconUrl,
  innerGradient     = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)',
  onContactClick,
  className         = '',
}) => {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  /* ── tilt engine ── */
  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;
    let raf: number | null = null;
    let running = false;
    let lastTs = 0;
    let cx = 0, cy = 0, tx = 0, ty = 0;

    const setVars = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrap  = wrapRef.current;
      if (!shell || !wrap) return;
      const w  = shell.clientWidth  || 1;
      const h  = shell.clientHeight || 1;
      const px = clamp((100 / w) * x);
      const py = clamp((100 / h) * y);
      const ox = px - 50, oy = py - 50;
      const props: Record<string, string> = {
        '--pointer-x':           `${px}%`,
        '--pointer-y':           `${py}%`,
        '--background-x':        `${adjust(px, 0, 100, 35, 65)}%`,
        '--background-y':        `${adjust(py, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(oy, ox) / 50, 0, 1)}`,
        '--pointer-from-top':    `${py / 100}`,
        '--pointer-from-left':   `${px / 100}`,
        '--rotate-x':            `${round(-(ox / 5.5))}deg`,
        '--rotate-y':            `${round(oy  / 4.5)}deg`,
      };
      for (const [k, v] of Object.entries(props)) wrap.style.setProperty(k, v);
    };

    const step = (ts: number) => {
      if (!running) return;
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      const k = 1 - Math.exp(-dt / 0.12);
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      setVars(cx, cy);
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(step);
      } else {
        running = false; lastTs = 0;
      }
    };

    const start = () => { if (running) return; running = true; lastTs = 0; raf = requestAnimationFrame(step); };

    return {
      setTarget(x: number, y: number) { tx = x; ty = y; start(); },
      toCenter() { const s = shellRef.current; if (s) { tx = s.clientWidth / 2; ty = s.clientHeight / 2; start(); } },
      cancel() { if (raf) cancelAnimationFrame(raf); raf = null; running = false; lastTs = 0; },
    };
  }, [enableTilt]);

  /* ── pointer events ── */
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!tiltEngine || !shellRef.current) return;
    const r = shellRef.current.getBoundingClientRect();
    tiltEngine.setTarget(e.clientX - r.left, e.clientY - r.top);
  }, [tiltEngine]);

  const onMouseLeave = useCallback(() => {
    tiltEngine?.toCenter();
  }, [tiltEngine]);

  useEffect(() => {
    tiltEngine?.toCenter();
    return () => tiltEngine?.cancel();
  }, [tiltEngine]);

  /* ── mobile gyroscope tilt ── */
  useEffect(() => {
    if (!enableMobileTilt || !tiltEngine) return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const shell = shellRef.current;
      if (!shell) return;
      const gamma = clamp(e.gamma || 0, -45, 45); // Left to Right
      const beta = clamp((e.beta || 0) - 45, -45, 45); // Front to Back
      const x = ((gamma + 45) / 90) * shell.clientWidth;
      const y = ((beta + 45) / 90) * shell.clientHeight;
      tiltEngine.setTarget(x, y);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [enableMobileTilt, tiltEngine]);

  return (
    <div
      ref={wrapRef}
      className={`profile-card-wrapper ${className}`}
      style={{
        width: '100%',
        maxWidth: 320,
        margin: '0 auto',
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
        position: 'relative',
        '--rotate-x': '0deg',
        '--rotate-y': '0deg',
        '--pointer-from-center': '0',
        '--pointer-from-top': '0.5',
        '--pointer-from-left': '0.5',
      } as React.CSSProperties}
    >
      {/* Behind glow */}
      {behindGlowEnabled && (
        <div style={{
          position: 'absolute',
          inset: '-15%',
          borderRadius: 36,
          background: behindGlowColor,
          filter: 'blur(52px)',
          opacity: 0.65,
          zIndex: 0,
          pointerEvents: 'none',
          transform: 'scale(0.9)',
          transition: 'opacity 0.4s ease',
        }} />
      )}

      {/* Card shell */}
      <div
        ref={shellRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: 24,
          overflow: 'hidden',
          transform: 'rotateX(var(--rotate-y)) rotateY(var(--rotate-x))',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.12s ease-out',
          willChange: 'transform',
          cursor: 'default',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 100%), rgba(8,14,28,0.45)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}
      >
        {/* Inner gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: innerGradient,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 0.5,
        }} />

        {/* Optional icon pattern overlay */}
        {iconUrl && (
          <div style={{
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 6,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}>
            <img src={iconUrl} alt="Badge" style={{ width: 22, height: 22, objectFit: 'contain' }} />
          </div>
        )}

        {/* Holo shimmer on hover */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          background: `
            radial-gradient(
              ellipse at calc(var(--pointer-x, 50%)) calc(var(--pointer-y, 50%)),
              rgba(255,255,255,0.2) 0%,
              transparent 65%
            )
          `,
          opacity: 0.7,
          transition: 'opacity 0.3s ease',
        }} />

        {/* ── Avatar Image Container ── */}
        <div style={{
          position: 'relative', zIndex: 3,
          width: '100%',
          aspectRatio: showUserInfo ? '1/1' : '3/4',
          overflow: 'hidden',
          background: 'transparent',
        }}>
          <img
            src={avatarUrl}
            alt={name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 20%',
              display: 'block',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          {/* Bottom gradient fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: showUserInfo ? '50%' : '35%',
            background: 'linear-gradient(to top, rgba(8,14,28,0.75) 0%, rgba(8,14,28,0.2) 60%, transparent 100%)',
            zIndex: 4,
          }} />

          {/* If showUserInfo is false, show a sleek bottom badge overlay */}
          {!showUserInfo && (
            <div style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                alignSelf: 'flex-start',
                padding: '3px 9px',
                borderRadius: 99,
                border: '1px solid rgba(52,211,153,0.3)',
                background: 'rgba(52,211,153,0.12)',
                backdropFilter: 'blur(8px)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#34d399',
                  animation: 'pulse-green 2s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: '#34d399',
                }}>
                  {status}
                </span>
              </div>
              <h3 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: '1.45rem',
                fontWeight: 400,
                color: '#fff',
                margin: 0,
                lineHeight: 1.1,
              }}>
                {name}
              </h3>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                color: 'rgba(255,255,255,0.6)',
                margin: 0,
              }}>
                {title}
              </p>
            </div>
          )}
        </div>

        {/* ── Full Info Block (when showUserInfo === true) ── */}
        {showUserInfo && (
          <div style={{ position: 'relative', zIndex: 5, padding: '20px 22px 22px' }}>
            {/* Status pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginBottom: 12,
              padding: '4px 10px',
              borderRadius: 99,
              border: '1px solid rgba(52,211,153,0.25)',
              background: 'rgba(52,211,153,0.08)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#34d399',
                animation: 'pulse-green 2s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10, fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#34d399',
              }}>
                {status}
              </span>
            </div>

            {/* Name */}
            <h3 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: '1.6rem', fontWeight: 400,
              lineHeight: 1.1, letterSpacing: '-0.01em',
              color: '#fff', marginBottom: 4,
            }}>
              {name}
            </h3>

            {/* Title */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13, fontWeight: 300,
              color: 'rgba(255,255,255,0.45)', marginBottom: 4, lineHeight: 1.5,
            }}>
              {title}
            </p>

            {/* Handle */}
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 400,
              color: 'rgba(6,182,212,0.75)', marginBottom: 18,
            }}>
              @{handle}
            </p>

            {/* Contact button */}
            <button
              onClick={onContactClick}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', padding: '11px 0',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 500,
                letterSpacing: '0.04em',
                color: '#fff',
                transition: 'all 0.22s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(6,182,212,0.18)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(6,182,212,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
              }}
            >
              {contactText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
