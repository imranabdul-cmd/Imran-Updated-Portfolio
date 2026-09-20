import React, { useEffect, useRef } from 'react';

interface HeroPortalNexusProps {
  progress?: number; // 0 to 1
  className?: string;
  style?: React.CSSProperties;
}

export const HeroPortalNexus: React.FC<HeroPortalNexusProps> = ({
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Particle nodes for neural web
    const nodeCount = 65;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.2,
      y: (Math.random() - 0.5) * height * 1.2,
      z: Math.random() * 800 + 100,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.4 ? '#06b6d4' : (Math.random() > 0.5 ? '#a855f7' : '#fbbf24'),
      size: Math.random() * 2.5 + 1.2,
    }));

    // Floating code text streams
    const codeStreams = [
      'LangChain.RAG.Pipeline',
      'vector_db.similarity_search()',
      'FastAPI::TensorFlow_CNN',
      'Owlsure // ClanSure [ACTIVE]',
      'GT_Companion.AI.CoPilot',
      'accuracy: 0.984 // loss: 0.012',
      'GEMINI_PRO_MULTIMODAL',
      'ASP.NET_CORE // EF_CORE',
      'React19 + Three.js + GSAP',
    ];

    let t = 0;
    const render = () => {
      t += 0.012;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Central Radial Horizon Glow
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.65);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      grad.addColorStop(0.25, 'rgba(168, 85, 247, 0.18)');
      grad.addColorStop(0.6, 'rgba(3, 7, 18, 0.8)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Concentric Hologram Rings in 3D Perspective
      ctx.save();
      ctx.translate(cx, cy);
      for (let r = 1; r <= 5; r++) {
        const rad = (r * 110 + (t * 28) % 110);
        ctx.beginPath();
        ctx.ellipse(0, 0, rad, rad * 0.48, t * 0.15 * (r % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
        ctx.strokeStyle = r % 2 === 0 ? 'rgba(6, 182, 212, 0.35)' : 'rgba(168, 85, 247, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // 3. Neural Web Nodes & Interconnect Lines
      nodes.forEach((n, i) => {
        n.x += n.vx;
        n.y += n.vy;

        const screenX = cx + n.x;
        const screenY = cy + n.y;

        // Draw node
        ctx.beginPath();
        ctx.arc(screenX, screenY, n.size, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(cx + n2.x, cy + n2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.28 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      // 4. Floating High-Tech Hologram Code Labels
      ctx.font = "10.5px 'JetBrains Mono', monospace";
      codeStreams.forEach((txt, idx) => {
        const angle = (idx / codeStreams.length) * Math.PI * 2 + t * 0.2;
        const dist = 220 + Math.sin(t * 1.5 + idx) * 45;
        const x = cx + Math.cos(angle) * dist * 1.2;
        const y = cy + Math.sin(angle) * dist * 0.55;

        ctx.fillStyle = idx % 2 === 0 ? 'rgba(6, 182, 212, 0.75)' : 'rgba(251, 191, 36, 0.75)';
        ctx.fillText(`// ${txt}`, x, y);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className={`hero-portal-nexus ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};

export default HeroPortalNexus;
