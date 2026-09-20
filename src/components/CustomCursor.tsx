import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isRetroZone, setIsRetroZone] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const retroZone = target.closest('[data-retro-zone="true"]');
      setIsRetroZone(!!retroZone);

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    let animationFrameId: number;
    const updateTrail = () => {
      setTrailPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animationFrameId = requestAnimationFrame(updateTrail);
    };
    animationFrameId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pos.x, pos.y, isVisible]);

  if (!isVisible) return null;

  // ── 80s / 90s RETRO PIXEL CURSOR MODE ──
  if (isRetroZone) {
    return (
      <div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        {isHovered ? (
          /* Classic 80s/90s Pixel Hand Cursor */
          <svg width="22" height="26" viewBox="0 0 22 26" style={{ filter: 'drop-shadow(1.5px 2px 0px rgba(0,0,0,0.5))' }}>
            <path
              d="M7,1 L10,1 L10,10 L12,10 L12,7 L14,7 L14,10 L16,10 L16,8 L18,8 L18,15 C18,20 15,24 10,24 C5,24 2,20 2,15 L2,9 C2,9 3,1 7,1 Z"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="1.8"
              strokeLinejoin="miter"
            />
          </svg>
        ) : (
          /* Classic 80s/90s Pixel Pointer Arrow */
          <svg width="20" height="24" viewBox="0 0 20 24" style={{ filter: 'drop-shadow(1.5px 2px 0px rgba(0,0,0,0.5))' }}>
            <path
              d="M1,1 L1,20 L6,15 L10.5,22 L13,20.5 L8.5,13.5 L15,13.5 Z"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="1.8"
              strokeLinejoin="miter"
            />
          </svg>
        )}
      </div>
    );
  }

  // ── MODERN CYBER GLASS CURSOR MODE ──
  return (
    <>
      {/* Precision Center Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`,
        }}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-cyan-300 scale-150 shadow-[0_0_8px_#22d3ee]' : 'bg-cyan-400'}`} />
      </div>

      {/* Cyber Reticle Trail Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-all duration-100 ease-out"
        style={{
          transform: `translate3d(${trailPos.x - (isHovered ? 24 : 16)}px, ${trailPos.y - (isHovered ? 24 : 16)}px, 0)`,
        }}
      >
        <div
          className={`rounded-full border transition-all duration-300 flex items-center justify-center ${
            isHovered
              ? 'w-12 h-12 border-cyan-400/80 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110'
              : isClicked
              ? 'w-8 h-8 border-purple-400 bg-purple-500/20 scale-90'
              : 'w-8 h-8 border-cyan-500/40 bg-transparent'
          }`}
        >
          {isHovered && (
            <div className="w-2 h-2 rounded-full border border-cyan-300 animate-ping opacity-75" />
          )}
        </div>
      </div>
    </>
  );
};
