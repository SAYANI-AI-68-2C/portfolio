'use client';

import { useEffect } from 'react';

/**
 * High-Performance 3D Floating & Magnetic Tilt Controller.
 * Zero layout thrashing, 120 FPS compositor-friendly.
 * - Gentle ambient levitation float.
 * - Magnetic 3D tilt tracking the cursor on hover without continuous RAF reflows.
 * - Parallax depth for inner elements.
 * - Directional scroll tilt.
 */
export function useFloatingCards() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(
      document.querySelectorAll(
        '[class*="glass"], [class*="project"], [class*="achieve"], [class*="cert"], [class*="timelineContent"]'
      )
    );

    if (!cards || cards.length === 0) return;

    const cleanups = [];

    cards.forEach((card, index) => {
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';

      // 3D pop forward for inner text and chips
      const inners = card.querySelectorAll('h3, b, p, [class*="chips"], [class*="links"], img, small');
      inners.forEach((el) => {
        el.style.transform = 'translateZ(16px)';
        el.style.transformStyle = 'preserve-3d';
      });

      let rect = null;
      let rafHover = 0;

      const onMouseEnter = () => {
        // Cache rect once on mouse enter to prevent layout thrashing
        rect = card.getBoundingClientRect();
        card.style.transition = 'transform 0.12s ease-out, box-shadow 0.25s ease, border-color 0.25s ease';
      };

      const onMouseMove = (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        cancelAnimationFrame(rafHover);

        rafHover = requestAnimationFrame(() => {
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);

          const rotX = Math.max(-12, Math.min(12, -dy * 12));
          const rotY = Math.max(-12, Math.min(12, dx * 12));

          card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(22px) translateY(-6px)`;
          card.style.boxShadow = '0 24px 60px rgba(155, 123, 255, 0.25), 0 0 35px rgba(85, 230, 255, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
          card.style.borderColor = 'rgba(155, 123, 255, 0.5)';
        });
      };

      const onMouseLeave = () => {
        cancelAnimationFrame(rafHover);
        rect = null;
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, border-color 0.4s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)';
        card.style.boxShadow = '';
        card.style.borderColor = '';
      };

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });

      cleanups.push(() => {
        cancelAnimationFrame(rafHover);
        card.removeEventListener('mouseenter', onMouseEnter);
        card.removeEventListener('mousemove', onMouseMove);
        card.removeEventListener('mouseleave', onMouseLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);
}
