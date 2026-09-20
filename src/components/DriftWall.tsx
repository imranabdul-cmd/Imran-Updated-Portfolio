import {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface DriftWallItem {
  image: string;
  title?: string;
  href?: string;
}

export interface DriftWallProps {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: CSSProperties;
}

interface ColumnMeta {
  copyHeight: number;
  copies: number;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const DriftWall = ({
  items = [],
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = '#060010',
  className = '',
  style,
}: DriftWallProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef     = useRef<HTMLDivElement>(null);
  const trackRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef       = useRef<number | null>(null);

  const offsetsRef       = useRef<number[]>([]);
  const velocitiesRef    = useRef<number[]>([]);
  const hoveredColRef    = useRef<number>(-1);
  const wallHoveredRef   = useRef<boolean>(false);
  const pointerRef       = useRef({ x: 0.5, y: 0.5 });
  const pointerDampedRef = useRef({ x: 0.5, y: 0.5 });
  const lastTsRef        = useRef<number | null>(null);

  const [containerSize, setContainerSize] = useState({ w: 1200, h: 600 });
  const [activeId, setActiveId]           = useState<string | null>(null);
  const activeIdRef                       = useRef<string | null>(null);
  const [reduced, setReduced]             = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* distribute items across columns */
  const columnItems = useMemo<DriftWallItem[][]>(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map(col => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo<ColumnMeta[]>(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies     = Math.max(2, Math.ceil((containerSize.h * 1.6) / copyHeight) + 2);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerSize.h]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize({
        w: entry.contentRect.width  || 1200,
        h: entry.contentRect.height || 600,
      });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* base speed per column */
  const baseVelocities = useMemo<number[]>(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  /* initialise offsets */
  useEffect(() => {
    offsetsRef.current    = columnMeta.map(m => -(m.copyHeight * 0.5));
    velocitiesRef.current = baseVelocities.slice();
  }, [columnMeta, baseVelocities]);

  /* pointer tracking */
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    };
  }, []);

  const onPointerEnter = useCallback(() => { wallHoveredRef.current = true; }, []);
  const onPointerLeave = useCallback(() => {
    wallHoveredRef.current  = false;
    hoveredColRef.current   = -1;
    pointerRef.current      = { x: 0.5, y: 0.5 };
    activeIdRef.current     = null;
    setActiveId(null);
  }, []);

  /* animation loop */
  useEffect(() => {
    if (reduced) return;
    let last = 0;

    const tick = (ts: number) => {
      const dt   = Math.min((ts - last) / 1000, 0.05);
      last = ts;

      /* damp pointer */
      const pdx = pointerDampedRef.current;
      const px  = pointerRef.current;
      pdx.x = lerp(pdx.x, px.x, 0.06);
      pdx.y = lerp(pdx.y, px.y, 0.06);

      const { x: mx, y: my } = pdx;

      /* plane 3D tilt */
      if (planeRef.current) {
        const rx = (my - 0.5) * tilt;
        const ry = (mx - 0.5) * turn;
        const rz = roll;
        planeRef.current.style.transform =
          `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
      }

      /* scroll each column */
      columnMeta.forEach((meta, c) => {
        const track = trackRefs.current[c];
        if (!track) return;

        const paused = pauseOnHover && wallHoveredRef.current;
        const vel    = paused ? velocitiesRef.current[c] * 0.05 : baseVelocities[c];
        velocitiesRef.current[c] = lerp(velocitiesRef.current[c], vel, 0.08);

        offsetsRef.current[c] += velocitiesRef.current[c] * dt;

        /* seamless wrap */
        const h = meta.copyHeight;
        if (velocitiesRef.current[c] > 0 && offsetsRef.current[c] >  h) offsetsRef.current[c] -= h;
        if (velocitiesRef.current[c] < 0 && offsetsRef.current[c] < -h) offsetsRef.current[c] += h;

        /* parallax offset from pointer */
        const pxOff = (mx - 0.5) * depth * parallax;
        const pyOff = (my - 0.5) * depth * parallax;

        track.style.transform = `translateX(${pxOff}px) translateY(${offsetsRef.current[c] + pyOff}px)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [reduced, columnMeta, baseVelocities, tilt, turn, roll, perspective, depth, parallax, pauseOnHover]);

  /* total width of the drift plane */
  const totalWidth = columns * tileWidth + (columns - 1) * gap;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* 3D tilt plane */}
      <div
        ref={planeRef}
        style={{
          position: 'absolute',
          top:  '50%',
          left: '50%',
          width:  totalWidth,
          transform: `perspective(${perspective}px) translateX(-50%) translateY(-50%)`,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          display: 'flex',
          gap,
        }}
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];

          return (
            <div
              key={c}
              style={{
                position: 'relative',
                width: tileWidth,
                flexShrink: 0,
              }}
              onPointerEnter={() => { hoveredColRef.current = c; }}
              onPointerLeave={() => { hoveredColRef.current = -1; }}
            >
              {/* scrolling track */}
              <div
                ref={el => { trackRefs.current[c] = el; }}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%',
                  willChange: 'transform',
                }}
              >
                {/* render N copies for seamless loop */}
                {Array.from({ length: meta.copies }).map((_, copy) =>
                  col.map((item, idx) => {
                    const key = `${c}-${copy}-${idx}`;
                    const isActive = activeId === key;
                    const top = (copy * meta.copyHeight) + idx * (tileHeight + gap) - (meta.copies * meta.copyHeight * 0.5);

                    const Tag = item.href ? 'a' : 'div';
                    const tagProps = item.href
                      ? { href: item.href, target: '_blank', rel: 'noreferrer' }
                      : {};

                    return (
                      <Tag
                        key={key}
                        {...tagProps}
                        onPointerEnter={() => { activeIdRef.current = key; setActiveId(key); }}
                        onPointerLeave={() => { activeIdRef.current = null; setActiveId(null); }}
                        style={{
                          position: 'absolute',
                          top,
                          left: 0,
                          width: tileWidth,
                          height: tileHeight,
                          borderRadius: radius,
                          overflow: 'hidden',
                          display: 'block',
                          textDecoration: 'none',
                          cursor: item.href ? 'pointer' : 'default',
                          transform: isActive ? `translateY(-${lift}px) scale(1.04)` : 'translateY(0) scale(1)',
                          transition: 'transform 0.4s cubic-bezier(.16,1,.3,1), filter 0.3s ease, opacity 0.3s ease',
                          filter: [
                            isActive ? '' : (activeId ? `brightness(${1 - dim})` : ''),
                            grayscale && !isActive ? 'grayscale(100%)' : '',
                          ].filter(Boolean).join(' ') || 'none',
                          opacity: !activeId || isActive ? 1 : fade,
                          zIndex: isActive ? 10 : 1,
                          boxShadow: isActive
                            ? '0 24px 60px rgba(0,0,0,0.7)'
                            : '0 4px 16px rgba(0,0,0,0.4)',
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title ?? ''}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            pointerEvents: 'none',
                            userSelect: 'none',
                          }}
                        />
                        {/* title overlay */}
                        {item.title && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                            padding: '12px 12px 10px',
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'translateY(0)' : 'translateY(6px)',
                            transition: 'opacity 0.3s ease, transform 0.3s ease',
                          }}>
                            <p style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 11, fontWeight: 500,
                              color: '#fff',
                              letterSpacing: '0.05em',
                              margin: 0,
                            }}>
                              {item.title}
                            </p>
                          </div>
                        )}
                      </Tag>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* edge fades */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: `linear-gradient(to bottom, ${overlayColor} 0%, transparent 18%, transparent 82%, ${overlayColor} 100%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: `linear-gradient(to right, ${overlayColor} 0%, transparent 15%, transparent 85%, ${overlayColor} 100%)`,
      }} />
    </div>
  );
};

export default DriftWall;
