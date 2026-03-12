import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

import logoImg from '../assets/THE BEAUTY HUB.png';

const Loader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const barRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          const exit = gsap.timeline({
            onComplete: () => onComplete?.(),
          });
          exit
            .to(logoRef.current, { scale: 1.05, opacity: 0, duration: 0.5, ease: 'power2.in' })
            .to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.3');
        },
      });

      tl.set(logoRef.current, { scale: 0.7, opacity: 0 })
        .set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })
        .set(textRef.current, { opacity: 0 });

      tl.to(logoRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'back.out(1.2)',
      })
        .to(textRef.current, { opacity: 1, duration: 0.4 }, '-=0.5')
        .to(barRef.current, {
          scaleX: 1,
          duration: 1.4,
          ease: 'power2.inOut',
        }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-8 px-4">
        <img
          ref={logoRef}
          src={logoImg}
          alt="The Beauty Hub"
          className="h-44 w-56 md:h-28 object-cover object-center"
        />
        <p
          ref={textRef}
          className="loader-font text-sm md:text-base tracking-[0.35em] uppercase text-[#EB83B2]/90"
        >
          Loading
        </p>
        <div className="w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full rounded-full bg-[#EB83B2]"
            style={{ transformOrigin: 'left center' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
