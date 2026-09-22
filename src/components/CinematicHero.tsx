import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight, ExternalLink, ChevronDown } from 'lucide-react';
import CurvedLoop from './CurvedLoop';
import DepthText from './DepthText';
import DesktopStudioStage from './DesktopStudioStage';
import TimeTravelWarp from './TimeTravelWarp';

gsap.registerPlugin(ScrollTrigger);

/* ── Stars ── */
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  w: Math.random() * 2 + 0.5,
  top: Math.random() * 100,
  left: Math.random() * 100,
  dur: +(Math.random() * 4 + 2).toFixed(1),
  del: +(Math.random() * 5).toFixed(1),
  op: +(Math.random() * 0.5 + 0.1).toFixed(2),
}));

/* ── Marquee tags ── */
const TAGS = [
  'AI Engineer', '·', 'LangChain', '·', 'RAG Pipelines', '·',
  'Generative AI', '·', 'React + TypeScript', '·', 'ASP.NET Core', '·',
  'TensorFlow', '·', 'Owlsure', '·', 'Hackathon Champion', '·',
];

interface CinematicHeroProps {
  isUnlocked?: boolean;
  onUnlock?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ isUnlocked = false, onUnlock }) => {
  const wrapRef         = useRef<HTMLDivElement>(null);
  const videoRef        = useRef<HTMLVideoElement>(null);
  const overlayRef      = useRef<HTMLDivElement>(null);

  const stageOneRef     = useRef<HTMLDivElement>(null);
  const frameRef        = useRef<HTMLDivElement>(null);
  const hintRef         = useRef<HTMLDivElement>(null);
  const triggerRef      = useRef<HTMLDivElement>(null);

  const [scrollPct, setScrollPct]           = useState(0);
  const [navBg, setNavBg]                   = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [isWarping, setIsWarping]           = useState(false);
  const [isMonitorModalOpen, setIsMonitorModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMonitorModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      setScrollPct(Math.min((window.scrollY / total) * 100, 100));
      setNavBg(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const ctx = gsap.context(() => {

      /* ── 1. SCROLL EXPAND FRAME (Opens from centered frame to fullscreen) ── */
      gsap.fromTo(
        frameRef.current,
        {
          width: 'min(50vw, 760px)',
          height: 'min(64vh, 540px)',
          borderRadius: 26,
          borderColor: 'rgba(255, 255, 255, 0.22)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.9), 0 0 60px rgba(6,182,212,0.28)',
        },
        {
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          borderColor: 'rgba(255, 255, 255, 0)',
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top top',
            end: '22% top',
            scrub: 1.1,
          },
        }
      );

      /* ── Scroll expand hint pill fade out ── */
      gsap.to(hintRef.current, {
        opacity: 0,
        y: 20,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: '12% top',
          scrub: 0.8,
        },
      });

      /* ── 2. STAGE 1: exit — float up & fade on scroll ── */
      gsap.to(stageOneRef.current, {
        autoAlpha: 0,
        y: -60,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: '20% top',
          scrub: 1,
        },
      });

      /* ── 3. INTERACTIVE TRIGGER REVEAL (Fades in ONLY after scrolling into fullscreen) ── */
      gsap.fromTo(
        triggerRef.current,
        {
          opacity: 0,
          scale: 0.85,
          y: 24,
          pointerEvents: 'none',
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          pointerEvents: 'auto',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: '16% top',
            end: '32% top',
            scrub: 0.9,
          },
        }
      );

    }, wrapRef);

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goDown = () =>
    document.getElementById('portfolio-core')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {/* ── CINEMATIC TIME TRAVEL & EYE-OPENING AWAKENING SEQUENCE ── */}
      <TimeTravelWarp
        isActive={isWarping}
        onUnlock={onUnlock}
        onComplete={() => {
          setIsWarping(false);
          const target = document.getElementById('portfolio-landing') || document.getElementById('portfolio-core');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* ── FULL SCREEN VINTAGE WINDOWS XP OS ── */}
      {isMonitorModalOpen && (
        <DesktopStudioStage
          onOpenApp={() => {
            setIsMonitorModalOpen(false);
            setIsWarping(true);
          }}
          onClose={() => setIsMonitorModalOpen(false)}
        />
      )}

      {/* ── Scroll progress ── */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, height: 2, zIndex: 9999,
          background: 'linear-gradient(90deg,#06b6d4,#a855f7,#fbbf24)',
          width: `${scrollPct}%`,
          transition: 'width 0.12s linear',
          pointerEvents: 'none',
        }}
      />

      {/* ════════════ HERO WRAPPER ════════════ */}
      <div ref={wrapRef} style={{ height: isUnlocked ? '220vh' : '150vh', position: 'relative' }}>

        {/* Sticky viewport */}
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#030712',
        }}>

          {/* Background Stars outside frame */}
          {STARS.map(s => (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                width: s.w, height: s.w,
                borderRadius: '50%',
                background: '#fff',
                top: `${s.top}%`,
                left: `${s.left}%`,
                opacity: s.op,
                animation: `star-twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
                pointerEvents: 'none',
              }}
            />
          ))}



          {/* ══════════════ SCROLL EXPAND FRAME ══════════════ */}
          <div
            ref={frameRef}
            style={{
              position: 'relative',
              width: 'min(50vw, 760px)',
              height: 'min(64vh, 540px)',
              borderRadius: 26,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 30px 90px rgba(0,0,0,0.9), 0 0 60px rgba(6,182,212,0.28)',
              background: '#040814',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'width, height, border-radius, box-shadow',
            }}
          >
            {/* ── VIDEO ── */}
            <video
              ref={videoRef}
              autoPlay loop muted playsInline
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', zIndex: 0,
              }}
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            />

            {/* ── 80s RETRO TERMINAL TRIGGER ON THE BOY'S LAPTOP SCREEN (Fades in on scroll) ── */}
            <div
              ref={triggerRef}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsMonitorModalOpen(true);
              }}
              style={{
                position: 'absolute',
                bottom: '9%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 35,
                opacity: 0,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {/* Subtle Storytelling Header */}
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: 'italic',
                fontSize: '15px',
                color: '#fef08a',
                letterSpacing: '0.06em',
                textShadow: '0 0 12px rgba(245, 158, 11, 0.7), 0 2px 4px #000',
                whiteSpace: 'nowrap',
              }}>
                ✦ Imran's Vintage Workstation ✦
              </div>

              {/* Glowing 80s Terminal Trigger Badge */}
              <div
                style={{
                  background: 'rgba(7, 19, 41, 0.92)',
                  border: '1.5px solid #f59e0b',
                  borderRadius: 999,
                  padding: '8px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  animation: 'retro-hotspot-pulse 2.2s infinite',
                  backdropFilter: 'blur(14px)',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.85), 0 0 22px rgba(245,158,11,0.6)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 12px 34px rgba(0,0,0,0.95), 0 0 32px rgba(245,158,11,0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.85), 0 0 22px rgba(245,158,11,0.6)';
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 10px #22c55e, 0 0 4px #fff',
                }} />
                <span style={{
                  fontFamily: "'Silkscreen', 'JetBrains Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fef08a',
                  letterSpacing: '0.14em',
                  textShadow: '0 0 10px rgba(254,240,138,0.9)',
                }}>
                  {'>'} TURN ON PC
                </span>
                <span style={{
                  display: 'inline-block',
                  width: 7,
                  height: 14,
                  background: '#f59e0b',
                  animation: 'retro-cursor-blink 1s infinite',
                  marginLeft: -2,
                }} />
              </div>
            </div>

            {/* ── VIGNETTE overlays ── */}
            {/* Bottom gradient */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, zIndex: 4,
              background: 'linear-gradient(to top, rgba(3,7,18,0.92), transparent)',
              pointerEvents: 'none',
            }} />
            {/* Top gradient */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 160, zIndex: 4,
              background: 'linear-gradient(to bottom, rgba(3,7,18,0.55), transparent)',
              pointerEvents: 'none',
            }} />
            {/* Radial vignette */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 4,
              background: 'radial-gradient(ellipse at 50% 55%, transparent 38%, rgba(3,7,18,0.65) 100%)',
              pointerEvents: 'none',
            }} />

          {/* ══════════════════════════════════
              STAGE 1: Name + Role
              Visible on load — exits by 42%
          ══════════════════════════════════ */}
          <div
            ref={stageOneRef}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '0 24px',
              paddingTop: 80,
              pointerEvents: 'none',
            }}
          >
            {/* Eyebrow Pill */}
            <div
              className="liquid-glass animate-fade-rise"
              style={{
                marginBottom: 24,
                padding: '6px 20px',
                borderRadius: 999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ color: '#06b6d4', fontWeight: 600 }}>✦</span>
              <span style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>
                Software Engineer · AI Engineer · Owlsure
              </span>
            </div>

            {/* 3D Depth Name — Luminous Crystal White with Electric Cyan Bevel */}
            <DepthText
              text="Imran A."
              layers={24}
              depth={1.4}
              faceColor="#ffffff"
              depthColor="#0891b2"
              glowColor="rgba(6, 182, 212, 0.45)"
              tilt={5.5}
              pointerTracking={true}
              smoothing={0.12}
              perspective={1000}
              autoOrbit={true}
              orbitSpeed={0.25}
              fontSize="clamp(4.2rem, 11vw, 8.8rem)"
              fontWeight={400}
              fontFamily="'Instrument Serif', serif"
              shadow={true}
              style={{ marginBottom: 20 }}
            />

            {/* Clean One-liner Subtext */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 440,
              marginBottom: 0,
            }}>
              Building intelligent systems that think,<br />
              learn, and solve at scale.
            </p>
          </div>

          {/* ── Scroll Expand Cue Pill (bottom of frame) ── */}
          <div
            ref={hintRef}
            style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 25,
              pointerEvents: 'none',
            }}
          >
            <div
              className="ios-glass-pill"
              style={{
                padding: '6px 16px',
                gap: 8,
                background: 'rgba(3,7,18,0.75)',
                backdropFilter: 'blur(16px)',
                borderColor: 'rgba(6,182,212,0.4)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.6)',
              }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
                Scroll to expand
              </span>
              <ChevronDown size={13} style={{ color: 'var(--cyan)' }} />
            </div>
          </div>

        </div>
        {/* end frameRef */}

      </div>
      {/* end sticky */}
    </div>
    {/* end wrapper */}

      {/* ══════════════ UNLOCKED PORTFOLIO CORE (Curved loop + Marquee + Stats) ══════════════ */}
      {isUnlocked && (
        <>
          <div id="portfolio-landing" style={{ position: 'relative', zIndex: 5, marginTop: -4, overflow: 'hidden' }}>
            <CurvedLoop
              marqueeText="AI Engineer ✦ LangChain RAG ✦ Generative AI ✦ React TypeScript ✦ ASP.NET Core ✦ Owlsure ✦ Hackathon Champion ✦ Deep Learning ✦"
              speed={1.4}
              curveAmount={220}
              direction="left"
              interactive
              className="curved-loop-text"
            />
          </div>

          <div style={{
            position: 'relative', zIndex: 5,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(3,7,18,0.4)',
            backdropFilter: 'blur(16px)',
            padding: '12px 0',
            overflow: 'hidden',
          }}>
            <div
              style={{
                display: 'flex', whiteSpace: 'nowrap',
                width: 'max-content', gap: 32,
                animation: 'marquee 32s linear infinite',
              }}
            >
              {[...TAGS, ...TAGS, ...TAGS].map((t, i) => (
                <span key={i} style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '10px', fontWeight: t === '·' ? 700 : 500,
                  letterSpacing: t === '·' ? '0' : '0.18em',
                  textTransform: 'uppercase',
                  color: t === '·' ? 'rgba(6,182,212,0.6)' : 'rgba(255,255,255,0.4)',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <StatGrid />
        </>
      )}
    </>
  );
};

/* ─── Stat grid ─── */
const STATS = [
  { val: '#1',  label: 'Hackathon Win',   note: 'Mission Possible · 54 engineers',          accent: '#fbbf24', glow: 'rgba(251,191,36,0.15)' },
  { val: '4+',  label: 'AI Projects',     note: 'RAG · Deep Learning · Web',                 accent: '#06b6d4', glow: 'rgba(6,182,212,0.15)' },
  { val: '9+',  label: 'Certifications',   note: 'Cloud · Security · .NET · AI',              accent: '#a855f7', glow: 'rgba(168,85,247,0.15)' },
  { val: '7.5', label: 'CGPA Score',       note: 'PSG College of Arts & Science',             accent: '#34d399', glow: 'rgba(52,211,153,0.15)' },
];

const StatGrid: React.FC = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      refs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div id="portfolio-core" style={{
      position: 'relative', zIndex: 5,
      maxWidth: 960, margin: '0 auto',
      padding: '72px 24px 60px',
    }}>
      <div className="section-label">
        <span>At A Glance</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {STATS.map((s, i) => (
          <div
            key={i}
            ref={el => { refs.current[i] = el; }}
            className="ios-glass-card"
            style={{
              padding: '26px 24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Base Track */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1.5,
              background: `linear-gradient(90deg, transparent 0%, ${s.accent}30 50%, transparent 100%)`,
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 2,
            }}>
              {/* Running Laser Beam */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '45%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent 0%, ${s.accent} 45%, #ffffff 80%, transparent 100%)`,
                  boxShadow: `0 0 10px 1.5px ${s.accent}, 0 0 20px 3px ${s.accent}99`,
                  animation: `beam-runner ${2.4 + (i % 2) * 0.6}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            </div>

            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '2.8rem', fontWeight: 900,
              lineHeight: 1, color: s.accent, marginBottom: 8,
              textShadow: `0 0 20px ${s.accent}55`,
            }}>
              {s.val}
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13.5px', fontWeight: 600,
              color: 'rgba(255,255,255,0.9)', marginBottom: 4,
            }}>
              {s.label}
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11.5px', fontWeight: 300,
              color: 'rgba(255,255,255,0.45)', lineHeight: 1.6,
            }}>
              {s.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
