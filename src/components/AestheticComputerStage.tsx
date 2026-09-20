import React, { useEffect, useState, useRef } from 'react';

/**
 * AestheticComputerStage
 * Matches the warm amber/golden glowing computer monitor from the video scene.
 * Renders an authentic retro-modern studio computer with live running AI code,
 * active terminal output, and warm ambient screen glow.
 */
export const AestheticComputerStage: React.FC = () => {
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CODE_SNIPPETS = [
    { text: 'import { OpenAI, LangChain, RAGCore } from "@owlsure/ai";', type: 'import' },
    { text: '// Initializing autonomous reasoning agent...', type: 'comment' },
    { text: 'const agent = new AgentWorkflow({', type: 'code' },
    { text: '  vectorStore: new ChromaVectorStore({ dim: 1536 }),', type: 'code' },
    { text: '  orchestration: "Multi-Agent-RAG-v3",', type: 'code' },
    { text: '  llm: new Gemini15Pro({ temperature: 0.15 }),', type: 'code' },
    { text: '});', type: 'code' },
    { text: 'await agent.compileAndDeploy({ target: "Owlsure-Cluster" });', type: 'exec' },
    { text: '✓ [STATUS] System Operational · Latency 18ms · 99.9% Recall', type: 'success' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCodeLine(prev => (prev + 1) % (CODE_SNIPPETS.length + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Ambient neural graph background inside screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    for (let i = 0; i < 22; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connecting neural lines
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist < 90) {
            ctx.strokeStyle = `rgba(251, 191, 36, ${0.18 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '20px',
    }}>
      {/* ── Outer Warm Ambient Backlight (matches yellow video monitor) ── */}
      <div style={{
        position: 'absolute',
        width: 'min(90vw, 840px)',
        height: 'min(70vh, 560px)',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(251, 191, 36, 0.38) 0%, rgba(217, 119, 6, 0.18) 45%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* ── THE COMPUTER MONITOR CONTAINER ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: 'min(92vw, 760px)',
        height: 'min(68vh, 490px)',
        background: 'linear-gradient(145deg, #1c1917 0%, #0c0a09 100%)',
        border: '1px solid rgba(251, 191, 36, 0.25)',
        borderRadius: 20,
        boxShadow: `
          0 25px 80px rgba(0, 0, 0, 0.95),
          0 0 50px rgba(251, 191, 36, 0.22),
          inset 0 1px 1px rgba(255, 255, 255, 0.15)
        `,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        {/* Computer Screen Top Bezel / Window Header */}
        <div style={{
          height: 38,
          background: 'rgba(28, 25, 23, 0.9)',
          borderBottom: '1px solid rgba(251, 191, 36, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          userSelect: 'none',
        }}>
          {/* Traffic Dots */}
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24', opacity: 0.8 }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', opacity: 0.8 }} />
          </div>

          {/* Terminal Title */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.04em',
            color: 'rgba(251, 191, 36, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ color: '#22c55e' }}>●</span>
            <span>imran@owlsure-engine : ~/rag-agent</span>
          </div>

          {/* Pill Badge */}
          <div style={{
            fontSize: '9.5px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            color: '#fbbf24',
            background: 'rgba(251, 191, 36, 0.12)',
            padding: '2px 8px',
            borderRadius: 6,
            border: '1px solid rgba(251, 191, 36, 0.25)',
          }}>
            AI CORE ACTIVE
          </div>
        </div>

        {/* ── THE LUMINOUS SCREEN DISPLAY ── */}
        <div style={{
          flex: 1,
          position: 'relative',
          background: 'linear-gradient(135deg, #18140c 0%, #0e0c08 50%, #060503 100%)',
          padding: '24px 28px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Golden Warm Screen Glow Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 35%, rgba(251, 191, 36, 0.14) 0%, rgba(217, 119, 6, 0.04) 60%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Background Neural Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          />

          {/* Code Stream Container */}
          <div style={{
            position: 'relative',
            zIndex: 3,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(11px, 1.35vw, 13.5px)',
            lineHeight: 1.85,
            letterSpacing: '0.02em',
          }}>
            {CODE_SNIPPETS.map((line, idx) => {
              const isVisible = idx <= activeCodeLine;
              let color = '#e2e8f0';
              if (line.type === 'comment') color = 'rgba(251, 191, 36, 0.65)';
              else if (line.type === 'import') color = '#38bdf8';
              else if (line.type === 'exec') color = '#fbbf24';
              else if (line.type === 'success') color = '#34d399';

              return (
                <div
                  key={idx}
                  style={{
                    opacity: isVisible ? 1 : 0.2,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-6px)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 12,
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.22)', fontSize: '10px', userSelect: 'none', width: 18 }}>
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <span style={{ color }}>{line.text}</span>
                </div>
              );
            })}

            {/* Glowing Cursor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.22)', fontSize: '10px', width: 18 }}>10</span>
              <span style={{
                display: 'inline-block',
                width: 8,
                height: 15,
                background: '#fbbf24',
                boxShadow: '0 0 10px #fbbf24',
                animation: 'star-twinkle 1s ease-in-out infinite',
              }} />
            </div>
          </div>

          {/* Screen Bottom Status Bar */}
          <div style={{
            position: 'relative',
            zIndex: 3,
            borderTop: '1px solid rgba(251, 191, 36, 0.12)',
            paddingTop: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            color: 'rgba(251, 191, 36, 0.7)',
          }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <span>LangChain v0.3</span>
              <span>·</span>
              <span>FastAPI</span>
              <span>·</span>
              <span>PostgreSQL + pgvector</span>
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              UTF-8 · TypeScript
            </div>
          </div>

          {/* Subtle CRT / monitor scanlines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)',
            pointerEvents: 'none',
            zIndex: 4,
          }} />
        </div>
      </div>
    </div>
  );
};

export default AestheticComputerStage;
