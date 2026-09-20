import React from 'react';
import { Terminal, Sparkles, Trophy, ArrowRight, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { sounds } from '../utils/audio';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Cyber HUD Grid & Reticles */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Top Status Pill */}
        <div 
          onMouseEnter={() => sounds.playHover()}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono-code text-xs mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-default"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="tracking-widest font-semibold">OWLSURE SOFTWARE // AI ENGINEER</span>
          <span className="text-cyan-500/60">|</span>
          <span className="text-slate-300">GEN AI & RAG ARCHITECT</span>
        </div>

        {/* Main Kinetic Headline */}
        <h1 className="font-syne font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-[1.05]">
          ENGINEERING <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
            INTELLIGENT
          </span>{' '}
          REALITIES.
        </h1>

        {/* Dynamic Bio Paragraph */}
        <p className="max-w-2xl text-slate-300 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-10">
          Hi, I am <span className="font-semibold text-white">Imran A</span> — Software Engineer & AI Engineer at{' '}
          <a
            href={PORTFOLIO_DATA.personal.companyUrl}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => sounds.playHover()}
            className="text-cyan-400 hover:underline font-medium"
          >
            Owlsure
          </a>
          . Specializing in enterprise Generative AI, LangChain RAG pipelines, Deep Learning Computer Vision, and high-octane modern web architectures.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#projects"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 text-black font-mono-code font-bold text-sm tracking-wider flex items-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:scale-105 transition-all group"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>EXPLORE FLAGSHIP AI</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#experience"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="px-6 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-white font-mono-code text-sm tracking-wider flex items-center gap-2 backdrop-blur-md transition-all hover:bg-slate-800/80"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>HACKATHON WINNER // PROOF</span>
          </a>

          <a
            href="#certificates"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="px-6 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-purple-500/60 text-slate-200 hover:text-white font-mono-code text-sm tracking-wider flex items-center gap-2 backdrop-blur-md transition-all hover:bg-slate-800/80"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>CERTIFICATIONS (9+)</span>
          </a>
        </div>

        {/* Telemetry Stats Matrix */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          {PORTFOLIO_DATA.personal.stats.map((stat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => sounds.playHover()}
              className="glass-panel glass-panel-hover p-4 rounded-xl text-left relative overflow-hidden group hud-corner"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/15 transition-all" />
              <div className="text-2xl sm:text-3xl font-syne font-black text-white group-hover:text-cyan-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-xs font-mono-code text-cyan-300 font-medium mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-400 font-light mt-0.5 truncate">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono-code text-slate-400 tracking-widest">SCROLL TO INITIALIZE</span>
        <div className="w-5 h-8 rounded-full border border-cyan-500/40 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
