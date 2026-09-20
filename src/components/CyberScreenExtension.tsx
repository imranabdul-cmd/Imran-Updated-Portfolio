import React, { useEffect, useRef } from 'react';

/**
 * CyberScreenExtension
 * Matches the glowing laptop screen in the video (warm amber & electric cyan terminal).
 * Renders high-fidelity animated code streams, vector embeddings, and neural graphs
 * that emerge directly from the laptop screen.
 */
export const CyberScreenExtension: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Code lines mimicking active AI development
    const CODE_LINES = [
      'import { OpenAI, LangChain, RAGPipeline } from "@owlsure/core";',
      'const agent = new AgentExecutor({ tools: [vectorSearch, codeInterpreter] });',
      'const embedding = await model.embedQuery("autonomous agent orchestration");',
      'vectorStore.similaritySearchWithScore(query, 5);',
      'const tensor = tf.tensor2d([[0.94, 0.12], [0.05, 0.88]]);',
      'fastapi.post("/v1/chat/completions", async (req) => { ... });',
      'pipeline.compile({ optimizer: "adam", loss: "categorical_crossentropy" });',
      'export interface AIArchitecture { memory: ChromaDB; llm: Gemini15Pro; }',
      'system.log("[SUCCESS] RAG pipeline deployment optimal at edge");',
    ];

    const streams: Array<{
      x: number;
      y: number;
      speed: number;
      text: string;
      alpha: number;
      color: string;
      size: number;
    }> = [];

    for (let i = 0; i < 22; i++) {
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 1.5 + 0.8,
        text: CODE_LINES[Math.floor(Math.random() * CODE_LINES.length)],
        alpha: Math.random() * 0.6 + 0.35,
        color: Math.random() > 0.4 ? '#06b6d4' : Math.random() > 0.6 ? '#fbbf24' : '#38bdf8',
        size: Math.floor(Math.random() * 3 + 12),
      });
    }

    // Perspective grid nodes
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];
    for (let i = 0; i < 30; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;

      // Dark background with warm amber + deep cyan laptop screen glow
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#0c1b26');
      bgGrad.addColorStop(0.35, '#05111a');
      bgGrad.addColorStop(0.75, '#02070d');
      bgGrad.addColorStop(1, '#010306');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Laptop Warm Screen Glow (matches yellow/amber laptop backlight from video)
      const screenBacklight = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        width * 0.45
      );
      screenBacklight.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
      screenBacklight.addColorStop(0.5, 'rgba(6, 182, 212, 0.14)');
      screenBacklight.addColorStop(1, 'transparent');
      ctx.fillStyle = screenBacklight;
      ctx.fillRect(0, 0, width, height);

      // Perspective Grid Lines
      const horizonY = height * 0.45;
      const gridSpacing = 44;
      const offset = (time * 28) % gridSpacing;

      ctx.lineWidth = 1;
      for (let y = horizonY; y < height; y += gridSpacing) {
        const py = y + offset;
        if (py < height) {
          const depthAlpha = ((py - horizonY) / (height - horizonY)) * 0.22;
          ctx.strokeStyle = `rgba(6, 182, 212, ${depthAlpha})`;
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(width, py);
          ctx.stroke();
        }
      }

      // Connecting Node Graph
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.fillStyle = i % 3 === 0 ? '#fbbf24' : '#06b6d4';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - dist / 120)})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Streaming Code Lines
      ctx.font = '500 13px "JetBrains Mono", monospace';
      for (let i = 0; i < streams.length; i++) {
        const s = streams[i];
        s.y -= s.speed;
        if (s.y < -30) {
          s.y = height + 30;
          s.x = Math.random() * width;
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha * 0.85;
        ctx.fillText(s.text, s.x, s.y);
      }
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      {/* Screen frame bezel shadow & scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(251,191,36,0.15)',
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default CyberScreenExtension;
