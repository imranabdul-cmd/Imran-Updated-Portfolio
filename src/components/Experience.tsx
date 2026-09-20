import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Trophy, Sparkles, Award, Users, Rocket, Eye, X } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

const serif = { fontFamily: "'Instrument Serif', serif" } as const;
const sans  = { fontFamily: "'Inter', sans-serif" }       as const;

export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [photoExpanded, setPhotoExpanded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.exp-animate',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const { experience } = PORTFOLIO_DATA;

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{ padding: '100px 0', maxWidth: 1040, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}
    >
      {/* Label */}
      <div className="section-label">
        <span>Work &amp; Achievements</span>
      </div>

      {/* Company Card with Transparent Glassmorphism */}
      <div
        className="exp-animate ios-glass-card"
        style={{
          padding: '36px 36px 32px',
          marginBottom: 44,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <div
              className="ios-glass-pill"
              style={{
                marginBottom: 12,
                color: 'var(--cyan)',
                borderColor: 'rgba(6,182,212,0.3)',
              }}
            >
              <Sparkles size={11} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Current Role
              </span>
            </div>

            <h2
              className="section-heading"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', marginBottom: 6 }}
            >
              Software &amp; AI Engineer
            </h2>
            <p style={{ ...sans, fontSize: '1.05rem', fontWeight: 500, color: 'var(--cyan)' }}>
              @ Owlsure Global
            </p>
          </div>

          <a
            href={experience.website}
            target="_blank" rel="noreferrer"
            className="ios-glass-btn"
            style={{
              padding: '10px 20px',
              fontSize: 13,
            }}
          >
            Visit Owlsure <ExternalLink size={13} style={{ color: 'var(--cyan)' }} />
          </a>
        </div>

        <p style={{ ...sans, fontSize: '0.98rem', fontWeight: 300, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, maxWidth: 680 }}>
          {experience.description}
        </p>
      </div>

      {/* Hackathon Winner Showcase with Winner Photo */}
      <div
        className="exp-animate ios-glass-card"
        style={{
          padding: '38px 36px 36px',
          borderColor: 'rgba(251,191,36,0.25)',
          boxShadow: '0 24px 60px -15px rgba(251,191,36,0.12), inset 0 1px 1.5px rgba(255,255,255,0.25)',
        }}
      >
        {/* Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div
            className="ios-glass-pill"
            style={{
              color: 'var(--amber)',
              borderColor: 'rgba(251,191,36,0.4)',
              background: 'rgba(251,191,36,0.06)',
            }}
          >
            <Trophy size={13} />
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Hackathon Champion
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <span className="ios-glass-pill" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <Users size={12} style={{ color: 'var(--cyan)' }} /> 54 Developers · 6 Teams
            </span>
            <span className="ios-glass-pill" style={{ color: 'var(--emerald)', borderColor: 'rgba(52,211,153,0.3)' }}>
              🏆 Rank #1
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{ ...serif, fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', fontWeight: 400, color: '#fff', marginBottom: 12, lineHeight: 1.15 }}
        >
          Mission Possible — <span style={{ color: 'var(--amber)' }}>#1 of 6 Teams</span>
        </h3>

        <p style={{ ...sans, fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.7)', marginBottom: 28, lineHeight: 1.75, maxWidth: 720 }}>
          Owlsure's flagship coding tournament with 54 engineers competing across real-world enterprise problems.
          Our team shipped <strong style={{ color: '#fff', fontWeight: 600 }}>two production-ready platforms</strong> (<span style={{ color: 'var(--cyan)' }}>ClanSure</span> &amp; <span style={{ color: 'var(--purple)' }}>GT Companion</span>) — the only team with dual winning ideations.
        </p>

        {/* ── Winner Photo Display Frame ── */}
        <div style={{
          position: 'relative',
          marginBottom: 32,
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'rgba(255,255,255,0.02)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxHeight: 460,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onClick={() => setPhotoExpanded(true)}
          >
            <img
              src="/assets/photos/winner.jpeg"
              alt="Mission Possible Hackathon Champions - Owlsure"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: 460,
                objectFit: 'cover',
                objectPosition: 'center 35%',
                display: 'block',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />

            {/* Bottom Glass Caption Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px 24px 18px',
              background: 'linear-gradient(to top, rgba(3,7,18,0.92) 0%, rgba(3,7,18,0.5) 65%, transparent 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <div>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--amber)',
                  marginBottom: 3,
                }}>
                  🏆 Victory Ceremony · Owlsure
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 400,
                  color: '#fff',
                }}>
                  Team Champions receiving 1st Place Trophy for ClanSure &amp; GT Companion
                </p>
              </div>

              <div
                className="ios-glass-pill"
                style={{
                  padding: '6px 14px',
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.9)',
                  background: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.25)',
                }}
              >
                <Eye size={12} /> Click to expand
              </div>
            </div>
          </div>
        </div>

        {/* Dual Winning Ideation cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {experience.hackathon.ideations.map((idea, i) => (
            <div
              key={i}
              className="ios-glass"
              style={{
                padding: '24px 24px 22px',
                borderRadius: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ ...sans, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
                  Winning Ideation {i + 1}
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: i === 0 ? 'var(--cyan)' : 'var(--purple)',
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: i === 0 ? 'rgba(6,182,212,0.1)' : 'rgba(168,85,247,0.1)',
                  border: `1px solid ${i === 0 ? 'rgba(6,182,212,0.3)' : 'rgba(168,85,247,0.3)'}`,
                }}>
                  {i === 0 ? 'Family Insurance' : 'Enterprise Learning'}
                </span>
              </div>
              <h4 style={{ ...serif, fontSize: '1.45rem', fontWeight: 400, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
                {idea.name}
              </h4>
              <p style={{ ...sans, fontSize: 12.5, fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                {idea.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox Modal for Winner Photo ── */}
      {photoExpanded && (
        <div
          onClick={() => setPhotoExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(3, 7, 18, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            animation: 'fade-up 0.22s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="ios-glass-card"
            style={{
              position: 'relative',
              maxWidth: 960,
              width: '100%',
              padding: 0,
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setPhotoExpanded(false)}
              className="ios-glass-btn"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
                width: 38,
                height: 38,
                padding: 0,
                borderRadius: '50%',
              }}
            >
              <X size={16} />
            </button>

            <img
              src="/assets/photos/winner.jpeg"
              alt="Mission Possible Champions"
              style={{
                width: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                display: 'block',
                background: '#040711',
              }}
            />

            <div style={{ padding: '22px 28px', background: 'rgba(8,14,28,0.95)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="ios-glass-pill" style={{ color: 'var(--amber)', borderColor: 'rgba(251,191,36,0.35)' }}>
                  🏆 1st Place Winners
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  Owlsure Mission Possible Tournament
                </span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Celebrating the championship victory with our 2 winning ideations — ClanSure &amp; GT Companion.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Experience;
