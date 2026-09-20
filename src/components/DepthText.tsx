import React, { useEffect, useRef, useMemo } from 'react';

export interface DepthTextProps {
  text: string;
  layers?: number;
  depth?: number;
  faceColor?: string;
  depthColor?: string;
  glowColor?: string;
  tilt?: number;
  pointerTracking?: boolean;
  smoothing?: number;
  perspective?: number;
  autoOrbit?: boolean;
  orbitSpeed?: number;
  fontSize?: string;
  fontWeight?: string | number;
  fontFamily?: string;
  shadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/* Precise RGB interpolation */
function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return `rgb(${r}, ${g}, ${b})`;
}

function parseColor(c: string): { r: number; g: number; b: number } {
  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  if (c.startsWith('rgb')) {
    const match = c.match(/\d+/g);
    if (match && match.length >= 3) {
      return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
    }
  }
  return { r: 6, g: 182, b: 212 }; // default cyan
}

export const DepthText: React.FC<DepthTextProps> = ({
  text,
  layers = 22,
  depth = 1.4,
  faceColor = '#ffffff',
  depthColor = '#0891b2',
  glowColor = 'rgba(6, 182, 212, 0.45)',
  tilt = 5.5,
  pointerTracking = true,
  smoothing = 0.12,
  perspective = 1000,
  autoOrbit = true,
  orbitSpeed = 0.25,
  fontSize = 'clamp(4rem, 11.5vw, 9.5rem)',
  fontWeight = 400,
  fontFamily = "'Instrument Serif', serif",
  shadow = true,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);

  // Pre-calculate layer colors with smooth power curve for bright bevel
  const layerData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < layers; i++) {
      const progress = i / (layers - 1 || 1);
      // Smooth non-linear curve for glowing gradient transition
      const color = interpolateColor(depthColor, faceColor, Math.pow(progress, 1.2));
      const zOffset = (i - (layers - 1)) * depth;
      arr.push({
        index: i,
        color,
        zOffset,
        isTop: i === layers - 1,
      });
    }
    return arr;
  }, [layers, depth, faceColor, depthColor]);

  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      if (!pointerTracking) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      targetRotation.current.y = Math.min(Math.max(normX * tilt * 1.4, -tilt * 1.5), tilt * 1.5);
      targetRotation.current.x = Math.min(Math.max(-normY * tilt * 1.4, -tilt * 1.5), tilt * 1.5);
    };

    const onMouseEnter = () => { isHovered.current = true; };
    const onMouseLeave = () => {
      isHovered.current = false;
      if (!autoOrbit) {
        targetRotation.current = { x: 0, y: 0 };
      }
    };

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      let tx = targetRotation.current.x;
      let ty = targetRotation.current.y;

      if (autoOrbit && !isHovered.current) {
        const orbitX = Math.sin(elapsed * orbitSpeed * Math.PI * 2) * (tilt * 0.7);
        const orbitY = Math.cos(elapsed * orbitSpeed * Math.PI * 2 * 0.8) * (tilt * 0.9);
        tx += orbitX;
        ty += orbitY;
      }

      currentRotation.current.x += (tx - currentRotation.current.x) * smoothing;
      currentRotation.current.y += (ty - currentRotation.current.y) * smoothing;

      if (containerRef.current) {
        containerRef.current.style.transform = `rotateX(${currentRotation.current.x.toFixed(2)}deg) rotateY(${currentRotation.current.y.toFixed(2)}deg)`;
      }

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove);
    const node = containerRef.current;
    if (node) {
      node.addEventListener('mouseenter', onMouseEnter);
      node.addEventListener('mouseleave', onMouseLeave);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      if (node) {
        node.removeEventListener('mouseenter', onMouseEnter);
        node.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [tilt, pointerTracking, smoothing, autoOrbit, orbitSpeed]);

  return (
    <div
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
        display: 'inline-block',
        position: 'relative',
        userSelect: 'none',
        ...style,
      }}
      className={className}
    >
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Render stacked layers from back to front */}
        {layerData.map((layer) => (
          <span
            key={layer.index}
            style={{
              position: layer.isTop ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              right: layer.isTop ? undefined : 0,
              display: 'inline-block',
              fontFamily,
              fontSize,
              fontWeight,
              lineHeight: 0.94,
              letterSpacing: '-0.025em',
              color: layer.color,
              transform: `translateZ(${layer.zOffset}px)`,
              transformStyle: 'preserve-3d',
              whiteSpace: 'nowrap',
              pointerEvents: layer.isTop ? 'auto' : 'none',
              textShadow: layer.isTop && shadow
                ? `0 12px 35px rgba(0,0,0,0.8), 0 0 30px ${glowColor}`
                : undefined,
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DepthText;
