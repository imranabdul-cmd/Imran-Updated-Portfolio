import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollExpandProps {
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  scrollHint?: string;
  useWindowScroll?: boolean;
  startWidth?: number;     // e.g. 48 (%)
  startHeight?: number;    // e.g. 60 (vh)
  startRadius?: number;    // e.g. 24 (px)
  endRadius?: number;      // e.g. 0 (px)
  mediaZoom?: number;      // e.g. 1.35
  scrollDistance?: number; // e.g. 1.2
  holdDistance?: number;   // e.g. 0.35
  smoothing?: number;
  overlayScrim?: number;   // e.g. 0.45
  enabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  src = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
  alt = 'Hero media',
  title,
  subtitle,
  scrollHint = 'Scroll to expand frame',
  startWidth = 46,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  overlayScrim = 0.4,
  enabled = true,
  children,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef     = useRef<HTMLDivElement>(null);
  const mediaRef     = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const hintRef      = useRef<HTMLDivElement>(null);
  const scrimRef     = useRef<HTMLDivElement>(null);

  const isVideo = src.endsWith('.mp4') || src.includes('cloudfront.net') || src.includes('video');

  useEffect(() => {
    if (!enabled) return;

    const ctx = gsap.context(() => {
      const totalScroll = scrollDistance + holdDistance;

      // Master Timeline for ScrollExpand
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalScroll * 100}%`,
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Expand width & height, remove border-radius & border
      tl.fromTo(
        frameRef.current,
        {
          width: `${startWidth}vw`,
          height: `${startHeight}vh`,
          borderRadius: `${startRadius}px`,
          borderColor: 'rgba(255, 255, 255, 0.22)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.85), 0 0 50px rgba(6,182,212,0.25)',
        },
        {
          width: '100vw',
          height: '100vh',
          borderRadius: `${endRadius}px`,
          borderColor: 'rgba(255, 255, 255, 0)',
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          ease: 'power2.inOut',
          duration: scrollDistance,
        }
      );

      // 2. Zoom inner media
      if (mediaRef.current) {
        tl.fromTo(
          mediaRef.current,
          { scale: 1 },
          {
            scale: mediaZoom,
            ease: 'none',
            duration: scrollDistance,
          },
          0
        );
      }

      // 3. Fade out scroll hint early
      if (hintRef.current) {
        tl.to(
          hintRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.3 * scrollDistance,
            ease: 'power1.out',
          },
          0
        );
      }

      // 4. Hold full stage for holdDistance
      tl.to({}, { duration: holdDistance });
    }, containerRef);

    return () => ctx.revert();
  }, [enabled, startWidth, startHeight, startRadius, endRadius, mediaZoom, scrollDistance, holdDistance]);

  return (
    <div
      ref={containerRef}
      className={`scroll-expand-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#030712',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Expanding Frame */}
      <div
        ref={frameRef}
        style={{
          position: 'relative',
          width: `${startWidth}vw`,
          height: `${startHeight}vh`,
          borderRadius: `${startRadius}px`,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.85), 0 0 50px rgba(6,182,212,0.25)',
          background: '#040814',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'width, height, border-radius, box-shadow',
        }}
      >
        {/* Media Background */}
        {isVideo ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 0,
            }}
          />
        ) : (
          <img
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={src}
            alt={alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        )}

        {/* Overlay Scrim */}
        <div
          ref={scrimRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, rgba(3,7,18,0.3) 0%, rgba(3,7,18,${overlayScrim}) 100%)`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Optional Glass Frame Corner Glints */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.6)',
            boxShadow: '0 0 10px #fff',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.8)',
            boxShadow: '0 0 10px #06b6d4',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        {/* Frame Content Overlay / Children */}
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            textAlign: 'center',
          }}
        >
          {children ? (
            children
          ) : (
            <>
              {subtitle && (
                <div
                  className="ios-glass-pill"
                  style={{
                    marginBottom: 16,
                    padding: '4px 14px',
                    borderColor: 'rgba(6,182,212,0.4)',
                    color: 'var(--cyan)',
                  }}
                >
                  <Sparkles size={11} />
                  <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {subtitle}
                  </span>
                </div>
              )}

              {title && (
                <h2
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                    fontWeight: 400,
                    color: '#fff',
                    lineHeight: 1.1,
                    marginBottom: 12,
                    textShadow: '0 10px 30px rgba(0,0,0,0.8)',
                  }}
                >
                  {title}
                </h2>
              )}
            </>
          )}

          {/* Bottom Scroll Hint Pill */}
          {scrollHint && (
            <div
              ref={hintRef}
              style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 6,
                pointerEvents: 'none',
              }}
            >
              <div
                className="ios-glass-pill"
                style={{
                  padding: '6px 16px',
                  gap: 8,
                  background: 'rgba(3,7,18,0.65)',
                  backdropFilter: 'blur(16px)',
                  borderColor: 'rgba(255,255,255,0.18)',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.5)',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)' }}>
                  {scrollHint}
                </span>
                <ChevronDown size={13} style={{ color: 'var(--cyan)', animation: 'fade-up 1.5s ease-in-out infinite' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
