import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CinematicHero }  from './components/CinematicHero';
import { AboutSection }   from './components/AboutSection';
import { Experience }     from './components/Experience';
import { Projects }       from './components/Projects';
import { TechStack }      from './components/TechStack';
import { Certificates }   from './components/Certificates';
import { ContactFooter }  from './components/ContactFooter';
import { InteractiveCore } from './components/InteractiveCore';
import { CustomCursor }   from './components/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = React.useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      gsap.ticker.remove(tickerCallback);
      clearTimeout(timer);
      lenis.destroy();
    };
  }, []);

  // When isUnlocked triggers, refresh ScrollTrigger so subsequent sections trigger accurately
  useEffect(() => {
    if (isUnlocked) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#fff', position: 'relative' }}>
      <CustomCursor />

      {/* Fixed ambient 3D BG — z-index 1, behind all page content */}
      <InteractiveCore />

      {/* All page content — z-index 2+ */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <CinematicHero isUnlocked={isUnlocked} onUnlock={() => setIsUnlocked(true)} />

        {isUnlocked && (
          <>
            <main style={{ position: 'relative' }}>
              <AboutSection />
              <Experience />
              <Projects />
              <TechStack />
              <Certificates />
            </main>

            <ContactFooter />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
