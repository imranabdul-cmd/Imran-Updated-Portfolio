import React from 'react';
import { Mail, GitBranch, Link2, ArrowUpRight, MessageSquare } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

const serif = { fontFamily: "'Instrument Serif', serif" } as const;
const sans  = { fontFamily: "'Inter', sans-serif" }       as const;

export const ContactFooter: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;

  return (
    <footer
      id="contact"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '110px 24px 60px',
        maxWidth: 960, margin: '0 auto',
      }}
    >
      {/* Label */}
      <div className="section-label">
        <span>Connect &amp; Collaborate</span>
      </div>

      <div
        className="ios-glass-card"
        style={{
          padding: '48px 40px 44px',
          marginBottom: 64,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle top ambient glow */}
        <div style={{
          position: 'absolute',
          top: -60,
          left: '20%',
          width: 280,
          height: 140,
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div
          className="ios-glass-pill"
          style={{
            marginBottom: 20,
            color: 'var(--cyan)',
            borderColor: 'rgba(6,182,212,0.35)',
          }}
        >
          <MessageSquare size={12} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Open To Opportunities
          </span>
        </div>

        {/* Heading */}
        <h2
          className="section-heading"
          style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)', marginBottom: 20, lineHeight: 1.1 }}
        >
          Let's build something<br />
          <span className="shimmer-text">extraordinary together.</span>
        </h2>

        <p style={{ ...sans, fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 520, marginBottom: 40 }}>
          Open to full-time roles, freelance Generative AI initiatives, and research collaborations.
          My inbox is always open.
        </p>

        {/* Contact links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {[
            { icon: Mail,      label: 'Email',    href: `mailto:${personal.email}`,    text: personal.email, color: '#06b6d4' },
            { icon: GitBranch, label: 'GitHub',   href: personal.github,               text: 'imranabdul-cmd', color: '#a855f7' },
            { icon: Link2,     label: 'LinkedIn', href: personal.linkedin,             text: 'imran-aupe', color: '#38bdf8' },
          ].map(({ icon: Icon, label, href, text, color }) => (
            <a
              key={label}
              href={href}
              target={label !== 'Email' ? '_blank' : undefined}
              rel="noreferrer"
              className="ios-glass"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                textDecoration: 'none',
                padding: '18px 20px',
                borderRadius: 18,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `${color}18`,
                border: `1px solid ${color}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
                  {label}
                </p>
                <p style={{ ...sans, fontSize: 13, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {text}
                </p>
              </div>
              <ArrowUpRight size={14} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        paddingTop: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'pulse-green 2s infinite' }} />
          <p style={{ ...sans, fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>
            © 2026 Imran A. All rights reserved.
          </p>
        </div>
        <p style={{ ...sans, fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>
          Crafted with React · Three.js · GSAP
        </p>
      </div>
    </footer>
  );
};

export default ContactFooter;
