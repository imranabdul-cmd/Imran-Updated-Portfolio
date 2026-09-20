import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { ProfileCard } from './ProfileCard';

gsap.registerPlugin(ScrollTrigger);

const serif = { fontFamily: "'Instrument Serif', serif" } as const;
const sans  = { fontFamily: "'Inter', sans-serif" }       as const;

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const cardColRef = useRef<HTMLDivElement>(null);
  const eduRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }
      if (cardColRef.current) {
        gsap.fromTo(
          cardColRef.current,
          { opacity: 0, scale: 0.94, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }
      if (eduRef.current?.children) {
        gsap.fromTo(
          eduRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: eduRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const { education } = PORTFOLIO_DATA;

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ padding: '110px 0 80px', maxWidth: 1100, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}
    >
      {/* Label */}
      <div className="section-label">
        <span>About &amp; Profile</span>
      </div>

      {/* Main Grid: Bio on Left, 3D ProfileCard on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '48px 40px',
        alignItems: 'center',
        marginBottom: 64,
      }}>
        {/* Left Column: Heading + Bio */}
        <div ref={textRef}>
          <div
            className="ios-glass-pill"
            style={{
              marginBottom: 20,
              padding: '4px 14px',
              color: 'var(--cyan)',
              borderColor: 'rgba(6,182,212,0.3)',
            }}
          >
            <span>✦</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Engineer &amp; Builder
            </span>
          </div>

          <h2
            className="section-heading"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', marginBottom: 24, lineHeight: 1.12 }}
          >
            I build systems<br />
            <span className="shimmer-text">that learn and adapt.</span>
          </h2>

          <p className="body-text" style={{ fontSize: '1.05rem', lineHeight: 1.75, marginBottom: 20, color: 'rgba(255,255,255,0.8)' }}>
            Software Engineer &amp; AI Engineer at{' '}
            <a
              href="https://www.owlsure.com/home-global/?geo=global&geosub=in"
              target="_blank" rel="noreferrer"
              style={{ color: 'var(--cyan)', fontWeight: 500, textDecoration: 'none', borderBottom: '1px dotted var(--cyan)' }}
            >
              Owlsure
            </a>
            . I specialise in Generative AI architectures — LangChain RAG pipelines,
            vector embeddings, multimodal reasoning, and full-stack enterprise platforms built with ASP.NET Core, FastAPI, and React.
          </p>

          <p className="body-text" style={{ fontSize: '0.98rem', lineHeight: 1.7, marginBottom: 28, color: 'rgba(255,255,255,0.6)' }}>
            Winner of Owlsure's <strong style={{ color: 'var(--amber)', fontWeight: 500 }}>Mission Possible Hackathon</strong> (54 developers, 6 teams) with two flagship enterprise ideations (<span style={{ color: '#fff' }}>ClanSure</span> &amp; <span style={{ color: '#fff' }}>GT Companion</span>) shipped in a single competition.
          </p>

          {/* Quick Stat Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <div
              className="ios-glass-pill"
              style={{
                borderColor: 'rgba(6,182,212,0.35)',
                color: 'var(--cyan)',
              }}
            >
              ⚡ GenAI &amp; RAG
            </div>
            <div
              className="ios-glass-pill"
              style={{
                borderColor: 'rgba(168,85,247,0.35)',
                color: 'var(--purple)',
              }}
            >
              🏆 #1 Hackathon Winner
            </div>
            <div
              className="ios-glass-pill"
              style={{
                borderColor: 'rgba(52,211,153,0.35)',
                color: 'var(--emerald)',
              }}
            >
              🎓 7.5 CGPA (B.Sc CS)
            </div>
          </div>
        </div>

        {/* Right Column: 3D Holographic ProfileCard */}
        <div ref={cardColRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ProfileCard
            name="Imran A"
            title="Software &amp; AI Engineer"
            handle="imranabdul-cmd"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/assets/photos/Profile.jpeg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={scrollToContact}
            behindGlowColor="rgba(125, 190, 255, 0.67)"
            behindGlowEnabled={true}
            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
          />
        </div>
      </div>

      {/* Education & Background section */}
      <div>
        <h3
          style={{
            ...serif,
            fontSize: '1.85rem',
            fontWeight: 400,
            color: '#fff',
            marginBottom: 20,
          }}
        >
          Academic Foundation
        </h3>

        <div
          ref={eduRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}
        >
          {education.map((edu) => (
            <div
              key={edu.institution}
              className="ios-glass-card"
              style={{
                padding: '28px 28px 26px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Status pill */}
              <div
                className="ios-glass-pill"
                style={{
                  marginBottom: 16,
                  borderColor: edu.status === 'In Progress' ? 'rgba(6,182,212,0.35)' : 'rgba(52,211,153,0.35)',
                  color: edu.status === 'In Progress' ? 'var(--cyan)' : 'var(--emerald)',
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: edu.status === 'In Progress' ? 'var(--cyan)' : 'var(--emerald)',
                  animation: edu.status === 'In Progress' ? 'pulse-green 2s infinite' : 'none',
                }} />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {edu.status}
                </span>
              </div>

              <p style={{ ...sans, fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                {edu.location}
              </p>

              <h4
                style={{
                  ...serif,
                  fontSize: '1.45rem',
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: '#fff',
                  marginBottom: 6,
                }}
              >
                {edu.institution}
              </h4>

              <p style={{ ...sans, fontSize: 13.5, fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}>
                {edu.degree}
                {edu.grade && <span style={{ color: 'var(--amber)', marginLeft: 8 }}>({edu.grade})</span>}
              </p>

              <p style={{ ...sans, fontSize: 12.5, fontWeight: 300, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65 }}>
                {edu.focus}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
