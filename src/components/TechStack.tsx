import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { TechLogo } from './TechLogos';

gsap.registerPlugin(ScrollTrigger);

const sans = { fontFamily: "'Inter', sans-serif" } as const;
const serif = { fontFamily: "'Instrument Serif', serif" } as const;

const CAT_COLORS: Record<string, string> = {
  'AI & Machine Learning':   'var(--cyan)',
  'Frontend & 3D':           'var(--purple)',
  'Backend & Architecture':  'var(--emerald)',
  'Database & Cloud':        'var(--amber)',
};

const CATEGORIES = [
  'AI & Machine Learning',
  'Backend & Architecture',
  'Frontend & 3D',
  'Database & Cloud',
];

export const TechStack: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tech-card',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const { techMatrix } = PORTFOLIO_DATA;

  return (
    <section
      id="tech"
      ref={sectionRef}
      style={{ padding: '100px 0', maxWidth: 1100, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}
    >
      {/* Label */}
      <div className="section-label">
        <span>Engineering Stack</span>
      </div>

      <h2
        className="section-heading"
        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', marginBottom: 52 }}
      >
        Tools I work with
      </h2>

      {/* Group by category */}
      {CATEGORIES.map((cat) => {
        const items = techMatrix.filter(t => t.category === cat);
        if (!items.length) return null;
        const color = CAT_COLORS[cat] ?? 'var(--cyan)';

        return (
          <div key={cat} style={{ marginBottom: 48 }}>
            {/* Category label in iOS pill */}
            <div
              className="ios-glass-pill"
              style={{
                marginBottom: 18,
                padding: '4px 14px',
                borderColor: `${color}40`,
                color,
              }}
            >
              <span>✦</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                {cat}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {items.map((tech, i) => (
                <div
                  key={tech.name}
                  className="ios-glass-card tech-card"
                  style={{
                    padding: '22px 20px 20px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Base Top Track */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1.5,
                    background: `linear-gradient(90deg, transparent 0%, ${tech.color || color}30 50%, transparent 100%)`,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}>
                    {/* Animated Running Laser Beam */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '45%',
                        height: '100%',
                        background: `linear-gradient(90deg, transparent 0%, ${tech.color || color} 45%, #ffffff 80%, transparent 100%)`,
                        boxShadow: `0 0 10px 1.5px ${tech.color || color}, 0 0 20px 3px ${tech.color || color}99`,
                        animation: `beam-runner ${2.4 + (i % 3) * 0.5}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                        animationDelay: `${(i * 0.32) % 2.5}s`,
                      }}
                    />
                  </div>

                  {/* Soft ambient moving aura following the beam */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -30,
                      left: 0,
                      width: '45%',
                      height: 50,
                      borderRadius: '50%',
                      background: `radial-gradient(ellipse, ${tech.color || color}40 0%, transparent 70%)`,
                      filter: 'blur(14px)',
                      pointerEvents: 'none',
                      zIndex: 1,
                      animation: `beam-runner ${2.4 + (i % 3) * 0.5}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                      animationDelay: `${(i * 0.32) % 2.5}s`,
                    }}
                  />

                  <div style={{ position: 'relative', zIndex: 3 }}>
                    {/* Top Row: Official Tech Logo + Level Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 8px 20px -6px ${tech.color}33, inset 0 1px 0 rgba(255,255,255,0.15)`,
                          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        <TechLogo name={tech.name} size={26} />
                      </div>

                      <span style={{
                        ...sans,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: tech.color || color,
                        padding: '3px 9px',
                        borderRadius: 999,
                        background: `${tech.color || color}14`,
                        border: `1px solid ${tech.color || color}30`,
                      }}>
                        {tech.level}
                      </span>
                    </div>

                    {/* Tech Name */}
                    <h3 style={{
                      ...sans,
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#fff',
                      marginBottom: 6,
                      letterSpacing: '-0.01em',
                    }}>
                      {tech.name}
                    </h3>

                    {/* Description */}
                    <p style={{
                      ...sans,
                      fontSize: 12.5,
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.58)',
                      lineHeight: 1.6,
                    }}>
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default TechStack;

