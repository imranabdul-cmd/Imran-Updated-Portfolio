import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Cpu, Terminal, ExternalLink } from 'lucide-react';
import { sounds } from '../utils/audio';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const handleAudioToggle = () => {
    const state = sounds.toggle();
    setAudioEnabled(state);
  };

  const navLinks = [
    { name: '// 01. ABOUT', href: '#about' },
    { name: '// 02. EXPERIENCE', href: '#experience' },
    { name: '// 03. PROJECTS', href: '#projects' },
    { name: '// 04. TECH STACK', href: '#tech' },
    { name: '// 05. CERTIFICATES', href: '#certificates' },
    { name: '// 06. CONTACT', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/85 backdrop-blur-xl border-b border-cyan-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand & Telemetry */}
        <a
          href="#"
          onMouseEnter={() => sounds.playHover()}
          onClick={() => sounds.playClick()}
          className="flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
            <Cpu className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-syne font-black text-lg tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                IMRAN<span className="text-cyan-400">.A</span>
              </span>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                AI / DEV
              </span>
            </div>
            <div className="text-[10px] font-mono-code text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>SYS_ACTIVE</span>
              <span className="text-cyan-500/60">•</span>
              <span className="text-cyan-300">{time} UTC</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => sounds.playHover()}
              onClick={() => sounds.playClick()}
              className="text-xs font-mono-code text-slate-300 hover:text-cyan-400 tracking-wider transition-colors relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Audio FX Toggle */}
          <button
            onClick={handleAudioToggle}
            onMouseEnter={() => sounds.playHover()}
            title={audioEnabled ? 'Mute Interface Sound' : 'Enable Interface Sound'}
            className={`p-2 rounded-lg border transition-all ${
              audioEnabled
                ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Quick Terminal CTA */}
          <a
            href="#contact"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono-code font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:scale-105"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>INITIATE_CONTACT</span>
          </a>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#030712]/95 border-b border-cyan-500/30 px-6 py-6 space-y-4 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(false);
              }}
              className="block font-mono-code text-sm text-slate-300 hover:text-cyan-400 tracking-wider py-2 border-b border-slate-800"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono-code text-slate-400">PORTAL STATUS: ONLINE</span>
            <a
              href="https://github.com/imranabdul-cmd"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono-code text-cyan-400 flex items-center gap-1"
            >
              <span>GITHUB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
