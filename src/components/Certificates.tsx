import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, Award, Eye } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import DriftWall from './DriftWall';
import type { DriftWallItem } from './DriftWall';

gsap.registerPlugin(ScrollTrigger);

const sans  = { fontFamily: "'Inter', sans-serif" }       as const;
const serif = { fontFamily: "'Instrument Serif', serif" } as const;

const CAT_COLOR: Record<string, string> = {
  'AI & Data Science': 'var(--cyan)',
  'Software & .NET':   'var(--purple)',
  'Cloud & Security':  'var(--emerald)',
};

export const Certificates: React.FC = () => {
  const { certificates } = PORTFOLIO_DATA;
  const [lightbox, setLightbox] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const wallRef    = useRef<HTMLDivElement>(null);

  /* build DriftWall items from certificate data */
  const driftItems: DriftWallItem[] = certificates.map(cert => ({
    image: cert.image,
    title: cert.title,
    href: undefined,
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headRef.current) {
        gsap.fromTo(
          headRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }
      if (wallRef.current) {
        gsap.fromTo(
          wallRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            delay: 0.1,
            scrollTrigger: { trigger: wallRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* close lightbox on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const activeCert = certificates.find(c => c.id === lightbox);

  return (
    <section
      id="certificates"
      ref={sectionRef}
      style={{ padding: '100px 0', position: 'relative' }}
    >
      {/* Heading block */}
      <div ref={headRef} style={{ maxWidth: 960, margin: '0 auto', paddingLeft: 24, paddingRight: 24, marginBottom: 52 }}>
        <div className="section-label">
          <span>Verified Certifications</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div
              className="ios-glass-pill"
              style={{
                marginBottom: 12,
                color: 'var(--amber)',
                borderColor: 'rgba(251,191,36,0.3)',
              }}
            >
              <Award size={12} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                9+ Industry Certifications
              </span>
            </div>
            <h2
              className="section-heading"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)' }}
            >
              Drifting 3D Credential Wall
            </h2>
          </div>
          <p style={{ ...sans, fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.45)', maxWidth: 300, lineHeight: 1.65 }}>
            Hover tiles to lift. Click any pill below or hover to inspect full credentials.
          </p>
        </div>
      </div>

      {/* ── DriftWall ── */}
      <div ref={wallRef} style={{ width: '100%', height: 600, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }} />

        <DriftWall
          items={driftItems}
          columns={5}
          tileWidth={220}
          tileHeight={152}
          gap={16}
          tilt={14}
          turn={-12}
          perspective={1200}
          depth={110}
          speed={36}
          direction="up"
          variance={0.42}
          parallax={0.6}
          lift={60}
          fade={0.55}
          dim={0.45}
          overlayColor="#030712"
          radius={14}
          roll={0}
          pauseOnHover={true}
          grayscale={false}
        />

        <ClickOverlay certs={certificates} onSelect={setLightbox} />
      </div>

      {/* ── Lightbox (iOS Frosted Glass Modal) ── */}
      {lightbox && activeCert && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(3, 7, 18, 0.82)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
            animation: 'fade-up 0.25s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="ios-glass-card"
            style={{
              position: 'relative', maxWidth: 840, width: '100%',
              padding: 0,
              overflow: 'hidden',
              boxShadow: '0 32px 80px -15px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.4)',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="ios-glass-btn"
              style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                width: 36, height: 36, padding: 0,
                borderRadius: '50%',
              }}
            >
              <X size={15} />
            </button>

            <img
              src={activeCert.image}
              alt={activeCert.title}
              style={{ width: '100%', display: 'block', objectFit: 'contain', maxHeight: '68vh', background: '#080e1c' }}
            />

            <div style={{ padding: '24px 28px 26px', background: 'rgba(8,14,28,0.95)' }}>
              <div
                className="ios-glass-pill"
                style={{
                  color: CAT_COLOR[activeCert.category] ?? 'var(--cyan)',
                  borderColor: `${CAT_COLOR[activeCert.category] ?? 'var(--cyan)'}40`,
                  marginBottom: 10,
                }}
              >
                <span>✦</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {activeCert.category}
                </span>
              </div>

              <h3 style={{ ...serif, fontSize: '1.6rem', fontWeight: 400, color: '#fff', marginBottom: 14 }}>
                {activeCert.title}
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {activeCert.skills.map(s => (
                  <span key={s} className="ios-glass-pill" style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.85)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* ── Interactive iOS Pill Buttons matching DriftWall tiles ── */
interface ClickOverlayProps {
  certs: typeof PORTFOLIO_DATA.certificates;
  onSelect: (id: string) => void;
}

const ClickOverlay: React.FC<ClickOverlayProps> = ({ certs, onSelect }) => {
  const CAT_COLOR_LOCAL: Record<string, string> = {
    'AI & Data Science': '#06b6d4',
    'Software & .NET':   '#a855f7',
    'Cloud & Security':  '#34d399',
  };

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15,
      background: 'linear-gradient(to top, rgba(3,7,18,0.98) 0%, rgba(3,7,18,0.75) 75%, transparent 100%)',
      padding: '36px 24px 24px',
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
    }}>
      {certs.map(cert => {
        const clr = CAT_COLOR_LOCAL[cert.category] ?? '#06b6d4';
        return (
          <button
            key={cert.id}
            onClick={() => onSelect(cert.id)}
            className="ios-glass-pill"
            style={{
              cursor: 'pointer',
              padding: '8px 16px',
              fontSize: '11.5px',
              borderColor: `${clr}40`,
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: clr, flexShrink: 0, boxShadow: `0 0 8px ${clr}` }} />
            <span>{cert.title.length > 28 ? cert.title.slice(0, 28) + '…' : cert.title}</span>
            <Eye size={11} style={{ opacity: 0.5, marginLeft: 2 }} />
          </button>
        );
      })}
    </div>
  );
};

export default Certificates;
