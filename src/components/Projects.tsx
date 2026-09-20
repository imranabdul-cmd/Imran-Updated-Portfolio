import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, GitBranch, Sparkles, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '../data/portfolioData';
import { TechLogo } from './TechLogos';

gsap.registerPlugin(ScrollTrigger);

const serif = { fontFamily: "'Instrument Serif', serif" } as const;
const sans  = { fontFamily: "'Inter', sans-serif" }       as const;

const STATUS_COLOR: Record<string, string> = {
  'Live & Operational':      'var(--emerald)',
  'Academic Major Project':  'var(--cyan)',
  'Academic Minor Project':  'var(--amber)',
};

const ACCENT: Record<string, string> = {
  cyan:    'var(--cyan)',
  purple:  'var(--purple)',
  emerald: 'var(--emerald)',
  amber:   'var(--amber)',
};

export const Projects: React.FC = () => {
  const { projects } = PORTFOLIO_DATA;
  const [active, setActive] = useState<Project>(projects[0]);
  const sectionRef   = useRef<HTMLElement>(null);
  const panelRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.proj-sidebar-item',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.08,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* animate panel on change */
  const handleSelect = (proj: Project) => {
    if (proj.id === active.id) return;
    gsap.to(panelRef.current, {
      opacity: 0, y: 12, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setActive(proj);
        gsap.to(panelRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
      },
    });
  };

  const accent = ACCENT[active.badgeColor] ?? 'var(--cyan)';

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ padding: '100px 0', maxWidth: 1100, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}
    >
      {/* Label */}
      <div className="section-label">
        <span>Featured Engineering</span>
      </div>

      <h2
        className="section-heading"
        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', marginBottom: 52 }}
      >
        Things I've built
      </h2>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>

        {/* ── Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projects.map((proj) => {
            const isActive = proj.id === active.id;
            return (
              <button
                key={proj.id}
                className="proj-sidebar-item"
                onClick={() => handleSelect(proj)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'block',
                  padding: '16px 20px',
                  borderRadius: 18,
                  background: isActive
                    ? 'rgba(255,255,255,0.06)'
                    : 'transparent',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid ${isActive ? accent : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isActive
                    ? `0 12px 28px -8px ${accent}25, inset 0 1px 0 rgba(255,255,255,0.2)`
                    : 'none',
                  transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isActive ? 'translateX(4px)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{
                    ...sans,
                    fontSize: 14.5, fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'color 0.2s',
                  }}>
                    {proj.title}
                  </p>
                  {isActive && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}` }} />
                  )}
                </div>
                <p style={{
                  ...sans,
                  fontSize: 11, fontWeight: 500,
                  color: STATUS_COLOR[proj.status] ?? 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.04em',
                }}>
                  {proj.status}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Detail Panel in iOS Glass Card ── */}
        <div
          ref={panelRef}
          className="ios-glass-card"
          style={{
            padding: '38px 36px 34px',
            gridColumn: 'span 2',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div
                  className="ios-glass-pill"
                  style={{
                    color: STATUS_COLOR[active.status],
                    borderColor: `${STATUS_COLOR[active.status]}40`,
                    padding: '3px 12px',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_COLOR[active.status] }} />
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {active.status}
                  </span>
                </div>
                <span style={{ ...sans, fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  · {active.category}
                </span>
              </div>

              <h3 style={{
                ...serif, fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)',
                fontWeight: 400, color: '#fff', lineHeight: 1.1, marginBottom: 6,
              }}>
                {active.title}
              </h3>
              <p style={{ ...sans, fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
                {active.tagline}
              </p>
            </div>

            {/* Action Links */}
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              {active.liveUrl && (
                <a
                  href={active.liveUrl}
                  target="_blank" rel="noreferrer"
                  className="ios-glass-btn"
                  style={{
                    padding: '9px 18px',
                    fontSize: 12.5,
                    color: accent,
                    borderColor: `${accent}40`,
                  }}
                >
                  Live Platform <ExternalLink size={12} />
                </a>
              )}
              {active.githubUrl && (
                <a
                  href={active.githubUrl}
                  target="_blank" rel="noreferrer"
                  className="ios-glass-btn"
                  style={{
                    padding: '9px 18px',
                    fontSize: 12.5,
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  GitHub <GitBranch size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p style={{ ...sans, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: 28 }}>
            {active.description}
          </p>

          {/* Problem & Solution in Frosted Pods */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 28 }}>
            <div
              className="ios-glass"
              style={{ padding: '16px 18px', borderRadius: 16 }}
            >
              <p style={{ ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 6 }}>
                Challenge
              </p>
              <p style={{ ...sans, fontSize: 12.5, fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                {active.problem}
              </p>
            </div>

            <div
              className="ios-glass"
              style={{ padding: '16px 18px', borderRadius: 16 }}
            >
              <p style={{ ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--emerald)', marginBottom: 6 }}>
                Architected Solution
              </p>
              <p style={{ ...sans, fontSize: 12.5, fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                {active.solution}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ ...sans, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>
              Key Highlights &amp; Capabilities
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {active.highlights.map((h, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={15} style={{ color: accent, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ ...sans, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>
                    {h}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <p style={{ ...sans, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
              Technologies Deployed
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {active.techStack.map((t) => (
                <span
                  key={t.name}
                  className="ios-glass-pill"
                  style={{
                    borderColor: `${accent}35`,
                    color: 'rgba(255,255,255,0.85)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '5px 12px',
                  }}
                >
                  <TechLogo name={t.name} size={15} />
                  <span>{t.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Projects;
