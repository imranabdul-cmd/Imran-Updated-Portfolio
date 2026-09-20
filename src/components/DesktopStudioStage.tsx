import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Folder,
  HardDrive,
  Trash2,
  ShieldCheck,
  ArrowRight,
  Power,
  Terminal,
  Globe,
  Award,
  FileText,
  Settings,
  Search,
  HelpCircle,
  X,
  Minus,
  Maximize2,
  Sparkles,
  Cpu,
  LogOut,
  FolderOpen,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface DesktopStudioStageProps {
  onOpenApp?: () => void;
  onClose?: () => void;
}

type BootStage =
  | 'bios'
  | 'xp-boot'
  | 'login'
  | 'logging-in'
  | 'desktop'
  | 'shutting-down'
  | 'safe-to-turn-off'
  | 'crt-off';

type OpenWindow = 'none' | 'projects' | 'stack' | 'trash' | 'cmd' | 'docs';

// Synthesized retro sound effects via Web Audio API
const playBiosBeep = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio context restriction safe
  }
};

const playLoginChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [
      { f: 392.00, t: 0.0, d: 0.35 }, // G4
      { f: 523.25, t: 0.16, d: 0.45 }, // C5
      { f: 659.25, t: 0.34, d: 0.55 }, // E5
      { f: 783.99, t: 0.52, d: 0.85 }, // G5
    ];
    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + t);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + d);
    });
  } catch {
    // Safe
  }
};

const playShutdownChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [
      { f: 783.99, t: 0.0, d: 0.35 }, // G5
      { f: 659.25, t: 0.16, d: 0.45 }, // E5
      { f: 523.25, t: 0.34, d: 0.55 }, // C5
      { f: 392.00, t: 0.52, d: 0.85 }, // G4
    ];
    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + t);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + d);
    });
  } catch {
    // Safe
  }
};

const playCrtPowerDownSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch {
    // Safe
  }
};

const playClickTick = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch {
    // Safe
  }
};

export const DesktopStudioStage: React.FC<DesktopStudioStageProps> = ({ onOpenApp, onClose }) => {
  const [stage, setStage] = useState<BootStage>('bios');
  const [biosStep, setBiosStep] = useState<number>(0);
  const [memoryCount, setMemoryCount] = useState<number>(0);
  const [loginSubtext, setLoginSubtext] = useState<string>('Loading your personal settings...');
  const [shutdownSubtext, setShutdownSubtext] = useState<string>('Saving your settings...');
  const [password, setPassword] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');
  const [colonVisible, setColonVisible] = useState<boolean>(true);
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [showBalloon, setShowBalloon] = useState<boolean>(true);
  
  // Interactive Desktop Features
  const [isStartOpen, setIsStartOpen] = useState<boolean>(false);
  const [activeWindow, setActiveWindow] = useState<OpenWindow>('none');
  const [cmdInput, setCmdInput] = useState<string>('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([
    'Microsoft(R) Windows DOS',
    '(C)Copyright Microsoft Corp 1981-2001.',
    '',
    'C:\\USERS\\IMRAN> type "help" or "warp" to enter portfolio',
  ]);
  const [isRecycleEmpty, setIsRecycleEmpty] = useState<boolean>(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const cmdInputRef = useRef<HTMLInputElement>(null);

  // 1. BIOS Sequence with Authentic 80s Staggered Lines & Stepped Memory Counting
  useEffect(() => {
    playBiosBeep();

    const t1 = setTimeout(() => setBiosStep(1), 500);

    const t2 = setTimeout(() => {
      setBiosStep(2);
      const memInterval = setInterval(() => {
        setMemoryCount((prev) => {
          if (prev >= 262144) {
            clearInterval(memInterval);
            return 262144;
          }
          return prev + 32768;
        });
      }, 260);
    }, 900);

    const t3 = setTimeout(() => setBiosStep(3), 2900);
    const t4 = setTimeout(() => setBiosStep(4), 3500);
    const t5 = setTimeout(() => setBiosStep(5), 4100);
    const t6 = setTimeout(() => setBiosStep(6), 4700);

    const biosTimeout = setTimeout(() => {
      setStage('xp-boot');
    }, 5400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(biosTimeout);
    };
  }, []);

  // 2. XP Boot Screen transition to Login (Extended 4.6s for authentic feel)
  useEffect(() => {
    if (stage === 'xp-boot') {
      const xpBootTimeout = setTimeout(() => {
        setStage('login');
      }, 4600);
      return () => clearTimeout(xpBootTimeout);
    }
  }, [stage]);

  // 3. Focus password input on login screen
  useEffect(() => {
    if (stage === 'login') {
      const t = setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(t);
    }
  }, [stage]);

  // 4. Focus CMD input when opened
  useEffect(() => {
    if (activeWindow === 'cmd') {
      const t = setTimeout(() => {
        cmdInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [activeWindow]);

  // 5. Desktop Real-Time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setColonVisible((prev) => !prev);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Login Submit
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStage('logging-in');
    setLoginSubtext('Loading your personal settings...');
    playLoginChime();

    const tSub = setTimeout(() => {
      setLoginSubtext('Preparing your desktop...');
    }, 950);

    const tDesk = setTimeout(() => {
      setStage('desktop');
    }, 1900);

    return () => {
      clearTimeout(tSub);
      clearTimeout(tDesk);
    };
  };

  // Handle Dramatic 80s/Windows Shutdown Flow
  const triggerShutdown = () => {
    setIsStartOpen(false);
    setActiveWindow('none');
    setStage('shutting-down');
    setShutdownSubtext('Saving your settings...');
    playShutdownChime();

    // 1. Switch to "Windows is shutting down..." at 1.1s
    const t1 = setTimeout(() => {
      setShutdownSubtext('Windows is shutting down...');
    }, 1100);

    // 2. Switch to classic amber "It is now safe to turn off your computer." at 2.4s
    const t2 = setTimeout(() => {
      setStage('safe-to-turn-off');
    }, 2400);

    // 3. Trigger 80s CRT collapse & phosphor power-off at 4.4s
    const t3 = setTimeout(() => {
      setStage('crt-off');
      playCrtPowerDownSound();
    }, 4400);

    // 4. Close modal and land back on the hero screen at 5.3s
    const t4 = setTimeout(() => {
      onClose?.();
    }, 5300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  };

  // Handle CMD command
  const handleCmdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cmdInput.trim().toLowerCase();
    const newHist = [...cmdHistory, `C:\\USERS\\IMRAN> ${cmdInput}`];

    if (cmd === 'warp' || cmd === 'enter' || cmd === 'start') {
      newHist.push('Initiating Hyperspace Warp Sequence...');
      setCmdHistory(newHist);
      setTimeout(() => {
        onOpenApp?.();
      }, 400);
      return;
    } else if (cmd === 'shutdown' || cmd === 'exit' || cmd === 'off') {
      triggerShutdown();
      return;
    } else if (cmd === 'help') {
      newHist.push(
        'Available commands:',
        '  warp      - Launch portfolio warp sequence',
        '  whoami    - Display developer identity',
        '  skills    - List AI & Engineering stack',
        '  shutdown  - Shut down system',
        '  clear     - Clear terminal screen'
      );
    } else if (cmd === 'whoami') {
      newHist.push('Imran A. — AI Engineer & Full Stack Architect | Owlsure');
    } else if (cmd === 'skills') {
      newHist.push('Python, PyTorch, LangChain, RAG, React, TypeScript, ASP.NET Core, Docker');
    } else if (cmd === 'clear' || cmd === 'cls') {
      setCmdHistory([
        'Microsoft(R) Windows DOS',
        '(C)Copyright Microsoft Corp 1981-2001.',
      ]);
      setCmdInput('');
      return;
    } else if (cmd) {
      newHist.push(`'${cmd}' is not recognized as an internal or external command. Type "help"`);
    }

    setCmdHistory(newHist);
    setCmdInput('');
  };

  // Keyboard shortcut: ESC to exit or skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (stage === 'bios' || stage === 'xp-boot') {
          setStage('login');
        } else if (activeWindow !== 'none') {
          setActiveWindow('none');
        } else if (isStartOpen) {
          setIsStartOpen(false);
        } else if (stage === 'login' || stage === 'desktop') {
          triggerShutdown();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, activeWindow, isStartOpen]);

  return (
    <div
      data-retro-zone="true"
      className="retro-monitor-zone"
      onClick={() => {
        if (isStartOpen) setIsStartOpen(false);
        setSelectedIcon('');
      }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        userSelect: 'none',
        backgroundColor: '#000000',
        zIndex: 99990,
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          STAGE 1: 80s/90s BIOS POST & MEMORY TEST SCREEN (Authentic Staggered Stepping)
      ───────────────────────────────────────────────────────────── */}
      {stage === 'bios' && (
        <div
          onClick={() => setStage('login')}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000000',
            color: '#d1d5db',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            padding: '32px 48px',
            fontSize: '14px',
            lineHeight: 1.6,
            zIndex: 100,
            animation: 'crt-power-on 0.35s ease-out, retro-crt-flicker 0.12s infinite',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px', textShadow: '0 0 6px rgba(255,255,255,0.4)' }}>
                  Award Medallion BIOS v6.00PG, An Energy Star Ally
                </div>
                <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                  Copyright (C) 1984-2001, Award Software, Inc.
                </div>
              </div>
              <div style={{
                border: '1.5px solid #38bdf8',
                padding: '4px 12px',
                color: '#38bdf8',
                fontSize: '11px',
                fontWeight: 700,
                textAlign: 'center',
                letterSpacing: '0.12em',
                boxShadow: '0 0 8px rgba(56,189,248,0.3), inset 0 0 8px rgba(56,189,248,0.2)',
              }}>
                [ EPA ENERGY STAR ]
              </div>
            </div>

            {biosStep >= 1 && (
              <div style={{ color: '#93c5fd', marginTop: 12, textShadow: '0 0 4px rgba(147,197,253,0.4)' }}>
                Main Processor : PENTIUM III-MMX CPU at 800MHz
              </div>
            )}

            {biosStep >= 2 && (
              <div style={{ color: '#fef08a', marginTop: 6, textShadow: '0 0 4px rgba(254,240,138,0.4)' }}>
                Memory Test : <span style={{ color: memoryCount >= 262144 ? '#22c55e' : '#f59e0b', fontWeight: 700 }}>{memoryCount}K {memoryCount >= 262144 ? 'OK' : '...'}</span>
              </div>
            )}

            {biosStep >= 3 && (
              <div style={{ marginTop: 20, color: '#9ca3af' }}>
                <div>Award Plug and Play BIOS Extension v1.0A</div>
                <div>Initialize Plug and Play Cards...</div>
                <div style={{ color: '#86efac' }}>PNP Init Completed</div>
              </div>
            )}

            {biosStep >= 4 && (
              <div style={{ marginTop: 18 }}>
                <div>Detecting Primary Master ... <span style={{ color: '#38bdf8', fontWeight: 600 }}>WDC WD400BB-00AUA1 (40.0 GB) [OK]</span></div>
                <div>Detecting Primary Slave ... <span style={{ color: '#6b7280' }}>None</span></div>
                {biosStep >= 5 && (
                  <>
                    <div>Detecting Secondary Master ... <span style={{ color: '#38bdf8', fontWeight: 600 }}>ATAPI CD-ROM 52X Max [OK]</span></div>
                    <div>Detecting Secondary Slave ... <span style={{ color: '#6b7280' }}>None</span></div>
                  </>
                )}
              </div>
            )}

            {biosStep >= 6 && (
              <div style={{ marginTop: 24, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Booting Microsoft Windows XP Professional...</span>
                <span style={{ display: 'inline-block', width: 8, height: 16, background: '#22c55e', animation: 'retro-cursor-blink 0.8s infinite' }} />
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #374151',
            paddingTop: 12,
            color: '#9ca3af',
            fontSize: '12px',
          }}>
            <div>Press <span style={{ color: '#fbbf24' }}>DEL</span> to enter SETUP , <span style={{ color: '#fbbf24' }}>ESC</span> to Skip</div>
            <div style={{ color: '#6b7280' }}>09/20/2001-i815-W83627HF-6A69RA1BC-00</div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STAGE 2: WINDOWS XP PROFESSIONAL BOOT SCREEN (Stepped 15fps Loader)
      ───────────────────────────────────────────────────────────── */}
      {stage === 'xp-boot' && (
        <div
          onClick={() => setStage('login')}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 44 }}>
            <div style={{
              fontFamily: "'Segoe UI', 'Trebuchet MS', sans-serif",
              fontSize: '14px',
              fontStyle: 'italic',
              color: '#ffffff',
              letterSpacing: '0.05em',
              marginBottom: -4,
            }}>
              Microsoft
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 14px)',
                gap: 3,
                transform: 'rotate(-4deg) skewX(-4deg)',
              }}>
                <div style={{ width: 14, height: 14, background: '#ef4444', borderRadius: '3px 0 0 0' }} />
                <div style={{ width: 14, height: 14, background: '#3b82f6', borderRadius: '0 3px 0 0' }} />
                <div style={{ width: 14, height: 14, background: '#22c55e', borderRadius: '0 0 0 3px' }} />
                <div style={{ width: 14, height: 14, background: '#eab308', borderRadius: '0 0 3px 0' }} />
              </div>

              <div style={{
                fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', sans-serif",
                fontSize: '44px',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                Windows<span style={{ fontSize: '32px', verticalAlign: 'super', marginLeft: 4, color: '#ef4444' }}>XP</span>
              </div>
            </div>

            <div style={{
              alignSelf: 'flex-end',
              fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', sans-serif",
              fontSize: '13px',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#f59e0b',
              letterSpacing: '0.12em',
              marginTop: 2,
              marginRight: 6,
            }}>
              Professional
            </div>
          </div>

          <div style={{
            width: 154,
            height: 14,
            background: '#0a0a0a',
            border: '1.5px solid #475569',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
          }}>
            <div style={{
              position: 'absolute',
              top: 1,
              bottom: 1,
              width: 38,
              display: 'flex',
              gap: 2,
              animation: 'xp-loader-slide 2.2s infinite steps(20)',
            }}>
              <div style={{ flex: 1, background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)', borderRadius: 1.5 }} />
              <div style={{ flex: 1, background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)', borderRadius: 1.5 }} />
              <div style={{ flex: 1, background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)', borderRadius: 1.5 }} />
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: 24,
            color: '#6b7280',
            fontSize: '11px',
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            Copyright © Microsoft Corporation
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STAGE 3 & 4: WINDOWS XP LOGON / WELCOME SCREEN
      ───────────────────────────────────────────────────────────── */}
      {(stage === 'login' || stage === 'logging-in') && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, #0a3d8f 0%, #001f5c 70%, #001238 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 100,
          fontFamily: "'Tahoma', 'Trebuchet MS', sans-serif",
          color: '#ffffff',
        }}>
          {/* Top Header Bar */}
          <div style={{
            height: 64,
            background: 'linear-gradient(180deg, #001238 0%, #002875 100%)',
            borderBottom: '2px solid #e67e22',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 8px)',
                gap: 2,
                transform: 'rotate(-5deg)',
              }}>
                <div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: 1 }} />
                <div style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: 1 }} />
                <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: 1 }} />
                <div style={{ width: 8, height: 8, background: '#eab308', borderRadius: 1 }} />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.02em', textShadow: '1px 1px 2px #000' }}>
                Microsoft Windows<span style={{ fontSize: '11px', verticalAlign: 'super', color: '#ef4444' }}>XP</span>
              </span>
            </div>

            <div style={{ fontSize: '11px', color: '#93c5fd', fontStyle: 'italic' }}>
              Vintage Workstation Edition
            </div>
          </div>

          {/* Central Welcome Split View */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 8vw',
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              paddingRight: 48,
              textAlign: 'right',
            }}>
              <div style={{
                fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', sans-serif",
                fontSize: '36px',
                fontWeight: 900,
                color: '#ffffff',
                textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                lineHeight: 1.1,
              }}>
                Welcome
              </div>
              <div style={{
                fontSize: '13px',
                color: '#bfdbfe',
                marginTop: 8,
                maxWidth: 240,
                lineHeight: 1.4,
                textShadow: '1px 1px 3px #000',
              }}>
                To begin, enter your password and click the green arrow or press Enter.
              </div>
            </div>

            <div style={{
              width: 1,
              height: 240,
              background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)',
              boxShadow: '0 0 8px rgba(255,255,255,0.4)',
            }} />

            <div style={{
              flex: 1,
              paddingLeft: 48,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}>
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
                  border: '2px solid #f59e0b',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}>
                  <User size={34} />
                </div>

                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#ffffff',
                    textShadow: '1px 1px 3px #000',
                  }}>
                    Imran A.
                  </div>

                  {stage === 'logging-in' ? (
                    <div style={{
                      fontSize: '12px',
                      color: '#93c5fd',
                      fontStyle: 'italic',
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      <span>{loginSubtext}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleLogin} style={{ marginTop: 6 }}>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: 3 }}>
                        Type your password
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          ref={passwordInputRef}
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          style={{
                            width: 150,
                            height: 24,
                            padding: '2px 8px',
                            fontSize: '13px',
                            fontFamily: 'sans-serif',
                            borderRadius: 2,
                            border: '1px solid #1e3a8a',
                            outline: 'none',
                            background: '#ffffff',
                            color: '#000000',
                            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4)',
                          }}
                        />

                        <button
                          type="submit"
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 4,
                            background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 60%, #15803d 100%)',
                            border: '1px solid #166534',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                          title="Log On"
                        >
                          <ArrowRight size={14} strokeWidth={3} />
                        </button>
                      </div>

                      <div style={{
                        fontSize: '10px',
                        color: '#93c5fd',
                        marginTop: 4,
                        opacity: 0.85,
                      }}>
                        Hint: Press <span style={{ color: '#fef08a' }}>Enter ↵</span> or click green arrow
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div style={{
            height: 64,
            background: 'linear-gradient(180deg, #002875 0%, #001238 100%)',
            borderTop: '2px solid #e67e22',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
          }}>
            <button
              onClick={() => triggerShutdown()}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 4,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }}>
                <Power size={13} color="#fff" />
              </div>
              <span>Shut Down</span>
            </button>

            <div style={{ fontSize: '11px', color: '#93c5fd' }}>
              Press ESC to Shut Down
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STAGE 5: FULL-SCREEN WINDOWS XP BLISS DESKTOP
      ───────────────────────────────────────────────────────────── */}
      {stage === 'desktop' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {/* Ultra Crisp Authentic High Resolution Windows XP Bliss Wallpaper */}
          <img
            src="/bliss_wallpaper_hq.jpg"
            alt="Windows XP Bliss Wallpaper HQ"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center bottom',
              pointerEvents: 'none',
              zIndex: 1,
              filter: 'contrast(1.04) saturate(1.08)',
            }}
          />

          {/* Sweeping CRT Electron Scan Beam */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
            animation: 'crt-scanbeam 8s linear infinite',
            pointerEvents: 'none',
            zIndex: 5,
          }} />

          {/* Delicate CRT Scanlines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.04) 0px, rgba(0, 0, 0, 0.04) 1px, transparent 1px, transparent 2.5px)',
            pointerEvents: 'none',
            zIndex: 4,
          }} />

          {/* Top Right Shut Down Badge */}
          <div style={{
            position: 'absolute',
            top: 16,
            right: 20,
            zIndex: 40,
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerShutdown();
              }}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#ffffff',
                borderRadius: 999,
                padding: '6px 16px',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.85)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              <span>ESC</span> · <span>SHUT DOWN ✕</span>
            </button>
          </div>

          {/* ── WINDOWS XP DESKTOP ICONS (Left Column) ── */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 30,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            zIndex: 10,
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>

              {/* 🌟 1. "ALL ABOUT ME" (Windows XP My Computer Style) 🌟 */}
              <div
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIcon('about');
                  playClickTick();
                  onOpenApp?.();
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  width: 76,
                  padding: '6px 4px',
                  borderRadius: 3,
                  background: selectedIcon === 'about' ? 'rgba(49, 106, 197, 0.65)' : 'transparent',
                  border: selectedIcon === 'about' ? '1px dotted rgba(255,255,255,0.8)' : '1px solid transparent',
                  transition: 'all 0.12s ease',
                  pointerEvents: 'auto',
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  border: '1.5px solid #0369a1',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.4), inset 1px 1px 0 rgba(255,255,255,0.7)',
                }}>
                  <User size={26} />
                </div>

                <span style={{
                  fontFamily: "'Tahoma', 'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#ffffff',
                  textAlign: 'center',
                  textShadow: '1px 1px 2px #000000, 0 0 4px rgba(0,0,0,0.8)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}>
                  All About Me
                </span>
              </div>

              {/* 2. "My Projects" (Windows XP Folder) */}
              <div
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIcon('projects');
                  playClickTick();
                  setActiveWindow('projects');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  width: 76,
                  padding: '6px 4px',
                  borderRadius: 3,
                  background: selectedIcon === 'projects' ? 'rgba(49, 106, 197, 0.65)' : 'transparent',
                  border: selectedIcon === 'projects' ? '1px dotted rgba(255,255,255,0.8)' : '1px solid transparent',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 100%)',
                  border: '1.5px solid #b45309',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#78350f',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                }}>
                  <Folder size={24} />
                </div>
                <span style={{
                  fontFamily: "'Tahoma', 'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#ffffff',
                  textAlign: 'center',
                  textShadow: '1px 1px 2px #000000',
                  letterSpacing: '-0.01em',
                }}>
                  My Projects
                </span>
              </div>

              {/* 3. "AI Stack" (Windows XP Drive) */}
              <div
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIcon('hd');
                  playClickTick();
                  setActiveWindow('stack');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  width: 76,
                  padding: '6px 4px',
                  borderRadius: 3,
                  background: selectedIcon === 'hd' ? 'rgba(49, 106, 197, 0.65)' : 'transparent',
                  border: selectedIcon === 'hd' ? '1px dotted rgba(255,255,255,0.8)' : '1px solid transparent',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                  border: '1.5px solid #475569',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1e293b',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                }}>
                  <HardDrive size={24} />
                </div>
                <span style={{
                  fontFamily: "'Tahoma', 'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#ffffff',
                  textAlign: 'center',
                  textShadow: '1px 1px 2px #000000',
                  letterSpacing: '-0.01em',
                }}>
                  AI_Stack (C:)
                </span>
              </div>

              {/* 4. "Recycle Bin" (Windows XP Desktop Icon) */}
              <div
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIcon('trash');
                  playClickTick();
                  setActiveWindow('trash');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  width: 76,
                  padding: '6px 4px',
                  borderRadius: 3,
                  background: selectedIcon === 'trash' ? 'rgba(49, 106, 197, 0.65)' : 'transparent',
                  border: selectedIcon === 'trash' ? '1px dotted rgba(255,255,255,0.8)' : '1px solid transparent',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #cbd5e1 0%, #64748b 100%)',
                  border: '1.5px solid #334155',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                }}>
                  <Trash2 size={24} />
                </div>
                <span style={{
                  fontFamily: "'Tahoma', 'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#ffffff',
                  textAlign: 'center',
                  textShadow: '1px 1px 2px #000000',
                  letterSpacing: '-0.01em',
                }}>
                  Recycle Bin
                </span>
              </div>

              {/* 5. "Command Prompt" (CMD Terminal Icon) */}
              <div
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIcon('cmd');
                  playClickTick();
                  setActiveWindow('cmd');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  width: 76,
                  padding: '6px 4px',
                  borderRadius: 3,
                  background: selectedIcon === 'cmd' ? 'rgba(49, 106, 197, 0.65)' : 'transparent',
                  border: selectedIcon === 'cmd' ? '1px dotted rgba(255,255,255,0.8)' : '1px solid transparent',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  background: '#09090b',
                  border: '1.5px solid #22c55e',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22c55e',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                }}>
                  <Terminal size={22} />
                </div>
                <span style={{
                  fontFamily: "'Tahoma', 'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#ffffff',
                  textAlign: 'center',
                  textShadow: '1px 1px 2px #000000',
                  letterSpacing: '-0.01em',
                }}>
                  CMD Prompt
                </span>
              </div>
            </div>

            {/* ── Windows XP Balloon Tooltip on Bottom Right ── */}
            {showBalloon && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  playClickTick();
                  onOpenApp?.();
                }}
                style={{
                  position: 'absolute',
                  right: 18,
                  bottom: 12,
                  background: '#ffffe1',
                  border: '1px solid #000000',
                  borderRadius: 6,
                  padding: '8px 12px',
                  boxShadow: '2px 2px 12px rgba(0,0,0,0.45)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  maxWidth: 200,
                  cursor: 'pointer',
                  zIndex: 25,
                }}
              >
                <ShieldCheck size={18} style={{ color: '#16a34a', marginTop: 1, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Tahoma', 'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#000',
                    lineHeight: 1.2,
                  }}>
                    Your System is Protected
                  </div>
                  <div style={{
                    fontFamily: "'Tahoma', 'Inter', sans-serif",
                    fontSize: '9.5px',
                    color: '#444',
                    lineHeight: 1.2,
                    marginTop: 2,
                  }}>
                    Click "All About Me" to warp
                  </div>
                </div>
                <div
                  style={{ color: '#666', cursor: 'pointer', flexShrink: 0, fontSize: '12px', lineHeight: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBalloon(false);
                  }}
                >
                  ✕
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              INTERACTIVE XP WINDOWS / DIALOGS
          ───────────────────────────────────────────────────────────── */}
          {activeWindow !== 'none' && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: activeWindow === 'cmd' ? 620 : 660,
                maxWidth: '90vw',
                background: '#ece9d8',
                border: '3px solid #0055ea',
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                zIndex: 50,
                fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
                color: '#000000',
                overflow: 'hidden',
              }}
            >
              {/* Window Title Bar */}
              <div style={{
                height: 30,
                background: 'linear-gradient(180deg, #0a64e8 0%, #0055ea 10%, #0848c4 50%, #0036a4 100%)',
                padding: '0 8px 0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '12px',
                textShadow: '1px 1px 1px #000',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {activeWindow === 'projects' && <Folder size={16} color="#fde047" />}
                  {activeWindow === 'stack' && <HardDrive size={16} color="#93c5fd" />}
                  {activeWindow === 'trash' && <Trash2 size={16} color="#cbd5e1" />}
                  {activeWindow === 'cmd' && <Terminal size={16} color="#4ade80" />}
                  {activeWindow === 'docs' && <FileText size={16} color="#fde047" />}
                  <span>
                    {activeWindow === 'projects' && 'My Projects - C:\\Projects\\'}
                    {activeWindow === 'stack' && 'AI Stack & Skills - C:\\AI_Stack\\'}
                    {activeWindow === 'trash' && 'Recycle Bin'}
                    {activeWindow === 'cmd' && 'Command Prompt - cmd.exe'}
                    {activeWindow === 'docs' && 'My Documents - Developer Profile'}
                  </span>
                </div>

                {/* Window Control Buttons */}
                <div style={{ display: 'flex', gap: 3 }}>
                  <button
                    onClick={() => setActiveWindow('none')}
                    style={{
                      width: 20,
                      height: 20,
                      background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                      border: '1px solid #fff',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    style={{
                      width: 20,
                      height: 20,
                      background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                      border: '1px solid #fff',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <Maximize2 size={10} />
                  </button>
                  <button
                    onClick={() => setActiveWindow('none')}
                    style={{
                      width: 20,
                      height: 20,
                      background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                      border: '1px solid #fff',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 900,
                    }}
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Window Menu Bar */}
              {activeWindow !== 'cmd' && (
                <div style={{
                  background: '#ece9d8',
                  borderBottom: '1px solid #d4d0c8',
                  padding: '2px 8px',
                  display: 'flex',
                  gap: 14,
                  fontSize: '11px',
                  color: '#222',
                }}>
                  <span>File</span>
                  <span>Edit</span>
                  <span>View</span>
                  <span>Favorites</span>
                  <span>Tools</span>
                  <span>Help</span>
                </div>
              )}

              {/* 1. Projects Explorer Window */}
              {activeWindow === 'projects' && (
                <div style={{ padding: 16, background: '#ffffff', minHeight: 280, maxHeight: 380, overflowY: 'auto' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a8a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FolderOpen size={18} /> Featured AI & Full-Stack Projects
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                    {[
                      { title: 'Owlsure AI Underwriting', desc: 'GenAI engine reducing policy decisions from 4 days to 45 seconds with 94% accuracy.', tag: 'RAG / LangChain / ASP.NET' },
                      { title: 'Autonomous Multi-Agent Swarm', desc: 'Self-healing orchestrator with LangGraph and localized memory stores.', tag: 'Python / LangGraph / FastAPI' },
                      { title: 'Vision Quality Inspection', desc: 'Real-time defect segmentation model running on edge devices.', tag: 'PyTorch / OpenCV / Docker' },
                      { title: 'Quantum Voice Interface', desc: 'Zero-latency WebSocket voice-driven natural language terminal.', tag: 'WebRTC / React / OpenAI' },
                    ].map((p) => (
                      <div
                        key={p.title}
                        onClick={() => onOpenApp?.()}
                        style={{
                          border: '1px solid #93c5fd',
                          borderRadius: 6,
                          padding: 10,
                          background: '#f8fafc',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      >
                        <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Code2 size={15} /> {p.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#475569', marginTop: 4, lineHeight: 1.3 }}>
                          {p.desc}
                        </div>
                        <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 600, marginTop: 6 }}>
                          {p.tag}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, textAlign: 'right' }}>
                    <button
                      onClick={() => onOpenApp?.()}
                      style={{
                        background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                        color: '#fff',
                        border: '1px solid #0369a1',
                        borderRadius: 4,
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      View All in 3D Portfolio ➔
                    </button>
                  </div>
                </div>
              )}

              {/* 2. AI Stack Explorer Window */}
              {activeWindow === 'stack' && (
                <div style={{ padding: 16, background: '#ffffff', minHeight: 280 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a8a', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Cpu size={18} /> Hard Disk Drive (C:) AI Capabilities
                  </div>

                  <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, padding: 8, marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#334155' }}>
                      <span>Used Space: 32.4 GB (AI Models & Weights)</span>
                      <span>Free Space: 7.6 GB</span>
                    </div>
                    <div style={{ height: 12, background: '#e2e8f0', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                      <div style={{ width: '81%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #2563eb)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {['LangChain & LlamaIndex', 'PyTorch & TensorFlow', 'FastAPI & ASP.NET', 'React & TypeScript', 'PostgreSQL & pgvector', 'Docker & Kubernetes'].map((s) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11.5px', color: '#1e293b', padding: '6px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4 }}>
                        <CheckCircle2 size={14} color="#16a34a" /> {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Recycle Bin Window */}
              {activeWindow === 'trash' && (
                <div style={{ padding: 16, background: '#ffffff', minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a8a', marginBottom: 10 }}>
                      Recycle Bin Content
                    </div>
                    {!isRecycleEmpty ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {['legacy_bugs_fixed.log (0 KB)', 'outdated_frameworks.bak (12 MB)', 'manual_data_entry.exe (0 KB - Replaced with AI)'].map((item) => (
                          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11.5px', color: '#64748b' }}>
                            <FileText size={14} /> {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic', marginTop: 20 }}>
                        Recycle Bin is clean and empty! ✨
                      </div>
                    )}
                  </div>
                  {!isRecycleEmpty && (
                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                      <button
                        onClick={() => setIsRecycleEmpty(true)}
                        style={{
                          background: '#e2e8f0',
                          border: '1px solid #94a3b8',
                          padding: '5px 12px',
                          borderRadius: 3,
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Empty Recycle Bin
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Command Prompt Window */}
              {activeWindow === 'cmd' && (
                <div style={{
                  background: '#000000',
                  color: '#22c55e',
                  fontFamily: "'Courier New', monospace",
                  padding: 12,
                  minHeight: 280,
                  fontSize: '13px',
                }}>
                  <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                    {cmdHistory.map((h, i) => (
                      <div key={i} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{h}</div>
                    ))}
                  </div>

                  <form onSubmit={handleCmdSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ color: '#22c55e', marginRight: 6 }}>C:\USERS\IMRAN&gt;</span>
                    <input
                      ref={cmdInputRef}
                      type="text"
                      value={cmdInput}
                      onChange={(e) => setCmdInput(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#22c55e',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '13px',
                        flex: 1,
                      }}
                    />
                  </form>
                </div>
              )}

              {/* 5. Documents / Bio Window */}
              {activeWindow === 'docs' && (
                <div style={{ padding: 16, background: '#ffffff', minHeight: 260 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e3a8a', marginBottom: 8 }}>
                    Imran A. — Full Stack & Generative AI Architect
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                    Specialized in enterprise AI applications, agentic workflows, autonomous LLM orchestrators, and production full-stack engineering at Owlsure. Hackathon champion and passionate creator of cinematic digital interfaces.
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <button
                      onClick={() => onOpenApp?.()}
                      style={{
                        background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                        color: '#fff',
                        border: '1px solid #0369a1',
                        borderRadius: 4,
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Enter Full Portfolio ➔
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              AUTHENTIC WINDOWS XP START MENU (Pop-up above Start button)
          ───────────────────────────────────────────────────────────── */}
          {isStartOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: 30,
                left: 0,
                width: 380,
                background: '#ffffff',
                border: '2px solid #0055ea',
                borderRadius: '8px 8px 0 0',
                boxShadow: '4px -4px 24px rgba(0,0,0,0.6)',
                zIndex: 60,
                fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
                overflow: 'hidden',
              }}
            >
              {/* Start Menu Header Bar */}
              <div style={{
                height: 56,
                background: 'linear-gradient(180deg, #0a64e8 0%, #1e40af 100%)',
                borderBottom: '2px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0 14px',
                color: '#ffffff',
              }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }}>
                  <User size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, textShadow: '1px 1px 2px #000' }}>
                    Imran A.
                  </div>
                  <div style={{ fontSize: '10px', color: '#bfdbfe' }}>
                    Portfolio Administrator
                  </div>
                </div>
              </div>

              {/* Start Menu Split Body */}
              <div style={{ display: 'flex', minHeight: 280 }}>
                {/* Left Column (White) - Pinned Applications */}
                <div style={{
                  flex: 1.1,
                  background: '#ffffff',
                  padding: '8px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  borderRight: '1px solid #dbeafe',
                }}>
                  <div
                    onClick={() => {
                      setIsStartOpen(false);
                      playClickTick();
                      onOpenApp?.();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 4, background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Globe size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Internet (All About Me)</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>Warp to 3D Portfolio</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setIsStartOpen(false);
                      playClickTick();
                      setActiveWindow('projects');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 4, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Folder size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>My Projects</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>AI & Full-Stack Works</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setIsStartOpen(false);
                      playClickTick();
                      setActiveWindow('stack');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 4, background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <HardDrive size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>AI Stack (C:)</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>Skills & Neural Models</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setIsStartOpen(false);
                      playClickTick();
                      setActiveWindow('cmd');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 4, background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                      <Terminal size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Command Prompt</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>DOS Terminal</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

                  <div
                    onClick={() => {
                      setIsStartOpen(false);
                      onOpenApp?.();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '6px 8px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#1e40af',
                      cursor: 'pointer',
                    }}
                  >
                    <span>All Programs</span>
                    <span style={{ color: '#22c55e' }}>▶</span>
                  </div>
                </div>

                {/* Right Column (Light Blue) - System Items */}
                <div style={{
                  flex: 0.9,
                  background: '#d3e5fa',
                  padding: '8px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}>
                  {[
                    { label: 'My Documents', icon: FileText, act: () => setActiveWindow('docs') },
                    { label: 'My Pictures', icon: Sparkles, act: () => onOpenApp?.() },
                    { label: 'My Computer', icon: Cpu, act: () => setActiveWindow('stack') },
                    { label: 'Control Panel', icon: Settings, act: () => setActiveWindow('stack') },
                    { label: 'Search', icon: Search, act: () => setActiveWindow('cmd') },
                    { label: 'Help and Support', icon: HelpCircle, act: () => setActiveWindow('docs') },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        onClick={() => {
                          setIsStartOpen(false);
                          playClickTick();
                          item.act();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '5px 6px',
                          borderRadius: 3,
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#1e3a8a',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#bfdbfe')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Icon size={14} color="#0369a1" />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Start Menu Footer Bar */}
              <div style={{
                height: 40,
                background: 'linear-gradient(180deg, #1e40af 0%, #0a64e8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 12,
                padding: '0 14px',
              }}>
                <button
                  onClick={() => {
                    setIsStartOpen(false);
                    setStage('login');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={13} color="#fde047" />
                  <span>Log Off</span>
                </button>

                <button
                  onClick={() => triggerShutdown()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Power size={13} color="#ef4444" />
                  <span>Shut Down</span>
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              ICONIC WINDOWS XP LUNA BLUE TASKBAR (Footer)
          ───────────────────────────────────────────────────────────── */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 30,
            background: 'linear-gradient(180deg, #3168d5 0%, #2456c2 12%, #1e4cb8 50%, #2251c5 88%, #193c9d 100%)',
            borderTop: '2px solid #578eed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 30,
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
          }}>
            {/* 1. Curved Green Windows XP Start Button */}
            <div
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                playClickTick();
                setIsStartOpen((prev) => !prev);
              }}
              style={{
                height: '100%',
                background: isStartOpen
                  ? 'linear-gradient(180deg, #15803d 0%, #16a34a 60%, #22c55e 100%)'
                  : 'linear-gradient(180deg, #4ade80 0%, #22c55e 15%, #16a34a 60%, #15803d 100%)',
                borderRadius: '0 12px 12px 0',
                padding: '0 18px 0 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: '2px 0 6px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.8)',
                cursor: 'pointer',
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 5px)',
                gap: 1.5,
                transform: 'rotate(-5deg)',
              }}>
                <div style={{ width: 5, height: 5, background: '#ef4444', borderRadius: 0.5 }} />
                <div style={{ width: 5, height: 5, background: '#3b82f6', borderRadius: 0.5 }} />
                <div style={{ width: 5, height: 5, background: '#22c55e', borderRadius: 0.5 }} />
                <div style={{ width: 5, height: 5, background: '#eab308', borderRadius: 0.5 }} />
              </div>
              <span style={{
                fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', 'Tahoma', sans-serif",
                fontStyle: 'italic',
                fontSize: '13px',
                fontWeight: 900,
                color: '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                letterSpacing: '0.02em',
              }}>
                start
              </span>
            </div>

            {/* Taskbar Active Window Pill */}
            {activeWindow !== 'none' && (
              <div style={{
                background: '#193c9d',
                border: '1px solid #578eed',
                borderRadius: 3,
                padding: '2px 10px',
                color: '#ffffff',
                fontSize: '11px',
                fontFamily: "'Tahoma', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
              }}>
                <Folder size={12} color="#fde047" />
                <span>
                  {activeWindow === 'projects' && 'My Projects'}
                  {activeWindow === 'stack' && 'AI Stack (C:)'}
                  {activeWindow === 'trash' && 'Recycle Bin'}
                  {activeWindow === 'cmd' && 'cmd.exe'}
                  {activeWindow === 'docs' && 'My Documents'}
                </span>
              </div>
            )}

            {/* 2. Windows XP Blue System Tray (Clock Area) */}
            <div style={{
              height: '100%',
              background: 'linear-gradient(180deg, #1282db 0%, #0c6ab6 50%, #09599c 100%)',
              borderLeft: '1px solid #09477e',
              boxShadow: 'inset 1px 0 1px rgba(255,255,255,0.3)',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
              <span style={{
                fontFamily: "'Tahoma', 'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: 600,
                color: '#ffffff',
                textShadow: '0 1px 1px rgba(0,0,0,0.5)',
              }}>
                {timeStr ? timeStr.replace(':', colonVisible ? ':' : ' ') : '4:20 PM'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STAGE 6: WINDOWS XP SAVING SETTINGS / SHUTTING DOWN
      ───────────────────────────────────────────────────────────── */}
      {stage === 'shutting-down' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, #0a3d8f 0%, #001f5c 70%, #001238 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          fontFamily: "'Tahoma', 'Trebuchet MS', sans-serif",
          color: '#ffffff',
        }}>
          {/* Windows XP Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 10px)',
              gap: 2.5,
              transform: 'rotate(-5deg)',
            }}>
              <div style={{ width: 10, height: 10, background: '#ef4444', borderRadius: 1 }} />
              <div style={{ width: 10, height: 10, background: '#3b82f6', borderRadius: 1 }} />
              <div style={{ width: 10, height: 10, background: '#22c55e', borderRadius: 1 }} />
              <div style={{ width: 10, height: 10, background: '#eab308', borderRadius: 1 }} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 700, textShadow: '2px 2px 4px #000' }}>
              Windows<span style={{ fontSize: '16px', verticalAlign: 'super', color: '#ef4444' }}>XP</span>
            </span>
          </div>

          <div style={{ fontSize: '15px', color: '#bfdbfe', textShadow: '1px 1px 2px #000', fontWeight: 600 }}>
            {shutdownSubtext}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STAGE 7: VINTAGE "IT IS NOW SAFE TO TURN OFF YOUR COMPUTER"
      ───────────────────────────────────────────────────────────── */}
      {(stage === 'safe-to-turn-off' || stage === 'crt-off') && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 130,
          animation: stage === 'crt-off' ? 'crt-power-off 0.9s cubic-bezier(0.2, 0, 0.2, 1) forwards' : 'retro-crt-flicker 0.15s infinite',
        }}>
          {/* Top EPA Energy Star Logo Box */}
          <div style={{
            border: '1.5px solid #f97316',
            padding: '4px 14px',
            color: '#f97316',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            letterSpacing: '0.14em',
            marginBottom: 32,
            boxShadow: '0 0 10px rgba(249,115,22,0.4)',
          }}>
            [ EPA ENERGY STAR SHUTDOWN ]
          </div>

          {/* Iconic Amber / Orange Retro Halt Text */}
          <div style={{
            fontFamily: "'Instrument Serif', 'Georgia', serif",
            fontSize: '34px',
            fontWeight: 700,
            color: '#f97316',
            letterSpacing: '0.04em',
            textShadow: '0 0 16px rgba(249,115,22,0.9), 0 0 32px rgba(234,88,12,0.6)',
            textAlign: 'center',
            padding: '0 24px',
          }}>
            It is now safe to turn off your computer.
          </div>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: '#fdba74',
            marginTop: 18,
            letterSpacing: '0.08em',
            opacity: 0.85,
          }}>
            System halted. Powering down CRT...
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopStudioStage;
