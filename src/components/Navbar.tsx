import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  isUnlocked?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isUnlocked = true }) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isClickScrollingRef = useRef(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track active section on scroll using viewport bounding rects
  useEffect(() => {
    if (!isUnlocked) return;

    const sections = ['about', 'projects', 'tech', 'certificates', 'contact'];

    const handleScroll = () => {
      // Don't override highlight while smooth scrolling after a user click
      if (isClickScrollingRef.current) return;

      const viewportTargetY = window.innerHeight * 0.35;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportTargetY && rect.bottom >= viewportTargetY) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      if (window.scrollY < 300) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, [isUnlocked]);

  if (!isUnlocked) return null;

  const scrollToSection = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    sounds.playClick();
    setMobileMenuOpen(false);

    if (targetId === 'home') {
      setActiveSection('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Instantly highlight clicked section
    setActiveSection(targetId);

    // Lock scroll listener updates during smooth scroll animation (~900ms)
    isClickScrollingRef.current = true;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 950);

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Work', id: 'projects' },
    { label: 'Stack', id: 'tech' },
    { label: 'Certs', id: 'certificates' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 16,
        left: 0,
        right: 0,
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
        pointerEvents: 'none',
      }}
    >
      <div
        className="liquid-glass"
        style={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: 880,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 18px',
          borderRadius: 999,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.25)',
          background: 'rgba(3, 7, 18, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, 'home')}
          onMouseEnter={() => sounds.playHover()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              boxShadow: '0 0 14px rgba(6,182,212,0.5)',
            }}
          >
            I
          </div>
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: '1.55rem',
              color: '#fff',
              letterSpacing: '-0.01em',
            }}
          >
            Imran<span style={{ color: '#06b6d4' }}>.A</span>
          </span>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex" style={{ gap: 6, alignItems: 'center' }}>
          {navLinks.map(({ label, id }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: isActive ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  border: isActive ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 0 12px rgba(6,182,212,0.25)' : 'none',
                }}
                onMouseEnter={e => {
                  sounds.playHover();
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {label}
              </a>
            );
          })}
        </nav>

        {/* CTA & Mobile Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="https://www.linkedin.com/in/imran-aupe"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="hidden sm:inline-flex"
            style={{
              padding: '7px 18px',
              borderRadius: 999,
              fontSize: '12px',
              fontWeight: 600,
              color: '#fff',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            Let's Connect <ArrowUpRight size={13} style={{ color: '#06b6d4' }} />
          </a>

          <button
            onClick={() => {
              sounds.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 16,
            right: 16,
            pointerEvents: 'auto',
            background: 'rgba(3, 7, 18, 0.95)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            borderRadius: 20,
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: '20px 24px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            animation: 'fade-up 0.25s ease',
          }}
        >
          {navLinks.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => scrollToSection(e, id)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: activeSection === id ? '#06b6d4' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                padding: '10px 14px',
                borderRadius: 10,
                background: activeSection === id ? 'rgba(6,182,212,0.15)' : 'transparent',
              }}
            >
              {label}
            </a>
          ))}

          <a
            href="https://www.linkedin.com/in/imran-aupe"
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop: 6,
              padding: '12px 18px',
              borderRadius: 12,
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
              textAlign: 'center',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Let's Connect <ArrowUpRight size={15} />
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
