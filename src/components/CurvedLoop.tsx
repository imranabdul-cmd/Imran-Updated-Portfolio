import { useRef, useEffect, useState, useMemo, useId, type FC, type PointerEvent } from 'react';

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = '',
  speed = 2,
  className,
  curveAmount = 400,
  direction = 'left',
  interactive = true,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
  }, [marqueeText]);

  const measureRef  = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const pathRef     = useRef<SVGPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset]   = useState(0);

  const uid    = useId();
  const pathId = `curve-${uid}`;
  const pathD  = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef  = useRef(false);
  const lastXRef = useRef(0);
  const dirRef   = useRef<'left' | 'right'>(direction);
  const velRef   = useRef(0);

  const textLength = spacing;
  const totalText  = textLength
    ? Array(Math.ceil(1800 / textLength) + 2).fill(text).join('')
    : text;
  const ready = spacing > 0;

  /* measure text width once mounted */
  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  /* animation loop */
  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute('startOffset', String(initial));
      setOffset(initial);
    }

    let current = -spacing;
    let raf: number;

    const step = () => {
      if (!dragRef.current) {
        const spd = speed * (dirRef.current === 'left' ? -1 : 1);
        velRef.current = velRef.current * 0.92 + spd * 0.08;
        current += velRef.current;
      } else {
        current += velRef.current;
        velRef.current *= 0.92;
      }

      if (current <= -spacing * 2) current += spacing;
      if (current >= 0)            current -= spacing;

      if (textPathRef.current) {
        textPathRef.current.setAttribute('startOffset', String(current));
      }
      setOffset(current);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [spacing, speed, direction]);

  /* pointer drag handlers */
  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current || !interactive) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    dirRef.current = dx < 0 ? 'left' : 'right';
  };

  const onPointerUp = () => {
    dragRef.current = false;
  };

  return (
    <svg
      viewBox="0 0 1440 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', overflow: 'visible', cursor: interactive ? 'grab' : 'default' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <defs>
        <path id={pathId} ref={pathRef} d={pathD} />
      </defs>

      {/* hidden measure element */}
      <text style={{ visibility: 'hidden', position: 'absolute' }}>
        <textPath ref={measureRef} href={`#${pathId}`}>
          <tspan className={className}>{text}</tspan>
        </textPath>
      </text>

      {/* visible looping text */}
      {ready && (
        <text>
          <textPath ref={textPathRef} href={`#${pathId}`} startOffset={String(-spacing)}>
            <tspan className={className}>{totalText}</tspan>
          </textPath>
        </text>
      )}
    </svg>
  );
};

export default CurvedLoop;
