'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Smooth, rock-solid scroll animations across the entire website.
 * Elements animate in smoothly when reached and NEVER disappear or get stuck hidden.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Scroll progress bar indicator at the top
    const progressBar = document.getElementById('sg-progress');
    const updateProgress = () => {
      if (!progressBar) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray(
        'h2, [class*="glass"], [class*="timelineItem"], [class*="cert"], [class*="achieve"], form, [class*="close"]'
      );

      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInInitialView = rect.top < window.innerHeight + 100 && rect.bottom > -50;

        if (isInInitialView) {
          gsap.set(el, { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updateProgress);
      ctx.revert();
    };
  }, []);
}
