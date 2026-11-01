'use client';

import { useEffect } from 'react';

/**
 * 3D Floating & Magnetic Tilt Controller for all box elements.
 * Features:
 * - Continuous zero-gravity levitation float with individual phase offsets.
 * - Proximity & hover magnetic 3D tilt tracking the cursor in real time.
 * - Parallax depth: internal card elements pop forward in 3D (translateZ).
 * - Bidirectional scroll velocity tilt: tilts smoothly when scrolling up or down.
 */
export function useFloatingCards() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Give DOM a tick to hydrate and layout
    const initTimer = setTimeout(() => {
      const cards = Array.from(
        document.querySelectorAll(
          '[class*="glass"], [class*="project"], [class*="achieve"], [class*="cert"], [class*="timelineContent"]'
        )
      );

      if (!cards || cards.length === 0) return;

      // Mouse tracking
      let mouseX = -9999;
      let mouseY = -9999;
      let hasMouse = false;

      const onMouseMoveGlobal = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        hasMouse = true;
      };
      window.addEventListener('mousemove', onMouseMoveGlobal, { passive: true });

      // Bidirectional scroll velocity tracking
      let lastScrollY = window.scrollY;
      let scrollVelocity = 0;
      let targetScrollVelocity = 0;

      const onScroll = () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;
        targetScrollVelocity = Math.max(-20, Math.min(20, delta));
        lastScrollY = currentScrollY;
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      // Card states for smooth lerping
      const cardStates = cards.map((card, i) => {
        card.style.transformStyle = 'preserve-3d';
        card.style.willChange = 'transform, box-shadow';

        // 3D pop forward for inner elements
        const inners = card.querySelectorAll('h3, b, p, [class*="chips"], [class*="links"], img, small');
        inners.forEach((el) => {
          el.style.transform = 'translateZ(18px)';
          el.style.transformStyle = 'preserve-3d';
        });

        return {
          el: card,
          phase: i * 0.85,
          currentRotX: 0,
          currentRotY: 0,
          currentTransZ: 0,
          currentTransY: 0,
          targetRotX: 0,
          targetRotY: 0,
          targetTransZ: 0,
          targetTransY: 0,
          isHovered: false,
        };
      });

      // Mouse hover event listeners per card
      const cleanups = [];
      cardStates.forEach((state) => {
        const card = state.el;

        const onEnter = () => {
          state.isHovered = true;
        };
        const onMove = (e) => {
          const rect = card.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);

          state.targetRotX = -dy * 13;
          state.targetRotY = dx * 13;
          state.targetTransZ = 30;
          state.targetTransY = -8;
        };
        const onLeave = () => {
          state.isHovered = false;
          state.targetRotX = 0;
          state.targetRotY = 0;
          state.targetTransZ = 0;
          state.targetTransY = 0;
        };

        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);

        cleanups.push(() => {
          card.removeEventListener('mouseenter', onEnter);
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      });

      // Physics animation loop
      let rafId = 0;
      let tick = 0;

      const loop = () => {
        rafId = requestAnimationFrame(loop);
        tick += 0.025;

        // Smooth scroll velocity decay
        scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.12;
        targetScrollVelocity *= 0.88;

        // Tilt angle from bidirectional scrolling (up tilts up, down tilts down)
        const scrollTilt = Math.max(-8, Math.min(8, scrollVelocity * 0.45));

        const viewportHeight = window.innerHeight;

        cardStates.forEach((state) => {
          const card = state.el;
          const rect = card.getBoundingClientRect();

          // Only compute for cards currently in or near viewport
          if (rect.bottom < -100 || rect.top > viewportHeight + 100) return;

          // Zero-gravity harmonic float
          const levitation = Math.sin(tick + state.phase) * 4.5;

          if (!state.isHovered) {
            // Proximity tilt when mouse moves around the card
            if (hasMouse) {
              const cardCenterX = rect.left + rect.width / 2;
              const cardCenterY = rect.top + rect.height / 2;
              const distX = mouseX - cardCenterX;
              const distY = mouseY - cardCenterY;
              const distance = Math.hypot(distX, distY);
              const maxProximity = 400;

              if (distance < maxProximity) {
                const strength = (1 - distance / maxProximity) ** 1.6;
                state.targetRotX = -(distY / maxProximity) * 7 * strength + scrollTilt;
                state.targetRotY = (distX / maxProximity) * 7 * strength;
                state.targetTransZ = 12 * strength;
                state.targetTransY = levitation - 4 * strength;
              } else {
                state.targetRotX = scrollTilt;
                state.targetRotY = 0;
                state.targetTransZ = 0;
                state.targetTransY = levitation;
              }
            } else {
              state.targetRotX = scrollTilt;
              state.targetRotY = 0;
              state.targetTransZ = 0;
              state.targetTransY = levitation;
            }
          }

          // Smooth lerp physics
          const lerpFactor = state.isHovered ? 0.2 : 0.1;
          state.currentRotX += (state.targetRotX - state.currentRotX) * lerpFactor;
          state.currentRotY += (state.targetRotY - state.currentRotY) * lerpFactor;
          state.currentTransZ += (state.targetTransZ - state.currentTransZ) * lerpFactor;
          state.currentTransY += (state.targetTransY - state.currentTransY) * lerpFactor;

          // Apply 3D perspective transform
          card.style.transform = `perspective(1000px) rotateX(${state.currentRotX.toFixed(2)}deg) rotateY(${state.currentRotY.toFixed(2)}deg) translateZ(${state.currentTransZ.toFixed(1)}px) translateY(${state.currentTransY.toFixed(1)}px)`;

          // Dynamic hover glow
          if (state.isHovered) {
            card.style.boxShadow = `0 30px 70px rgba(155, 123, 255, 0.28), 0 0 40px rgba(85, 230, 255, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.28)`;
            card.style.borderColor = 'rgba(155, 123, 255, 0.55)';
          } else {
            card.style.boxShadow = '';
            card.style.borderColor = '';
          }
        });
      };

      rafId = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('mousemove', onMouseMoveGlobal);
        window.removeEventListener('scroll', onScroll);
        cleanups.forEach((fn) => fn());
      };
    }, 150);

    return () => {
      clearTimeout(initTimer);
    };
  }, []);
}
