'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToId } from '../../lib/scrollToId';
import styles from './VideoIntro.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// Three.js is client-only and loaded after first paint, so the video shows instantly.
const CinematicLayer = dynamic(() => import('../CinematicLayer/CinematicLayer'), { ssr: false });

const Icon = {
  play: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" /></svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor" /></svg>
  ),
  muted: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" /><path d="m16 9.5 5 5M21 9.5l-5 5" /></svg>
  ),
  sound: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>
  ),
};

export default function VideoIntro({
  src,
  poster,
  nextId = 'about',
  tagline,
  firstName,
  lastName,
  role,
  description,
}) {
  const rootRef = useRef(null);
  const mediaRef = useRef(null);
  const ambientRef = useRef(null);
  const parallaxRef = useRef(null);
  const fgRef = useRef(null);
  const curtainRef = useRef(null);
  const darkRef = useRef(null);
  const contentRef = useRef(null);
  const hintRef = useRef(null);
  const hintTlRef = useRef(null);

  // Refs (not state) for things that must not trigger re-renders
  const activeRef = useRef(true); // false once the next section fully covers the hero
  const userPausedRef = useRef(false);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  /* ---------- playback helpers ---------- */
  const playAll = useCallback(() => {
    const fg = fgRef.current;
    const bg = ambientRef.current;
    // the blurred layer is display:none on portrait/mobile, so don't decode it there
    if (bg && bg.offsetParent !== null) {
      if (fg) bg.currentTime = fg.currentTime;
      bg.play().catch(() => {});
    }
    return Promise.resolve(fg ? fg.play() : undefined);
  }, []);

  const pauseAll = useCallback(() => {
    fgRef.current?.pause();
    ambientRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    if (fg.paused) {
      userPausedRef.current = false;
      playAll().then(() => setPlaying(true)).catch(() => {});
    } else {
      userPausedRef.current = true;
      pauseAll();
      setPlaying(false);
    }
  }, [playAll, pauseAll]);

  const toggleMute = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const proxy = { v: fg.volume };

    if (fg.muted) {
      fg.muted = false;
      fg.volume = 0;
      proxy.v = 0;
      gsap.to(proxy, { v: 1, duration: 1.1, ease: 'power2.out', onUpdate: () => { fg.volume = proxy.v; } });
      setMuted(false);
      // the hint has done its job
      hintTlRef.current?.kill();
      gsap.to(hintRef.current, { autoAlpha: 0, y: -6, duration: 0.4, overwrite: true });
    } else {
      gsap.to(proxy, {
        v: 0,
        duration: 0.5,
        onUpdate: () => { fg.volume = proxy.v; },
        onComplete: () => { fg.muted = true; },
      });
      setMuted(true);
    }
  }, []);

  /* ---------- animation + lifecycle ---------- */
  useEffect(() => {
    const root = rootRef.current;
    const fg = fgRef.current;
    if (!root || !fg) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const q = (sel) => root.querySelector(`[data-anim="${sel}"]`);

    fg.muted = true;
    if (reduce) {
      // respect reduced motion: poster only, the visitor can press play
      userPausedRef.current = true;
      pauseAll();
      setPlaying(false);
    } else {
      playAll().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }

    let startTimer;
    const cleanups = [];

    const ctx = gsap.context(() => {
      /* entrance */
      const hintTl = gsap
        .timeline({ paused: true })
        .fromTo(hintRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
        .to(hintRef.current, { autoAlpha: 0, y: -6, duration: 0.8, ease: 'power2.in' }, '+=6');
      hintTlRef.current = hintTl;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(fg, { scale: 1.12 }, { scale: 1, duration: 2.5, ease: 'power2.out' }, 0)
        .fromTo(q('tagline'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.2)
        .fromTo(root.querySelectorAll('[data-anim="line"]'), { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 1.2, stagger: 0.14, ease: 'power3.out' }, 0.35)
        .fromTo(q('role'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.6)
        .fromTo(q('desc'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.8)
        .fromTo(q('controls'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1 }, 1.0)
        .fromTo(q('scroll'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.2)
        .add(() => hintTl.play(), 1.5);

      if (reduce) {
        tl.progress(1);
      }

      if (reduce) return;

      /* scroll: the next section slides over the sticky hero */
      const next = document.getElementById(nextId);
      if (next) {
        let wasActive = true;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.6,
              onUpdate: (self) => {
                const active = self.progress < 0.985;
                activeRef.current = active;
                if (active === wasActive) return;
                wasActive = active;
                if (!active) pauseAll(); // nothing is visible, stop decoding
                else if (!userPausedRef.current) playAll().catch(() => {});
              },
            },
          })
          .to(mediaRef.current, { scale: 1.08, ease: 'none' }, 0)
          .to(contentRef.current, { yPercent: -10, autoAlpha: 0, ease: 'none' }, 0)
          .to(darkRef.current, { opacity: 0.8, ease: 'none' }, 0);
      }

      /* mouse parallax on the video (desktop pointers only) */
      if (finePointer) {
        const xTo = gsap.quickTo(parallaxRef.current, 'x', { duration: 1.4, ease: 'power3' });
        const yTo = gsap.quickTo(parallaxRef.current, 'y', { duration: 1.4, ease: 'power3' });
        const onMove = (e) => {
          xTo((e.clientX / window.innerWidth - 0.5) * -22);
          yTo((e.clientY / window.innerHeight - 0.5) * -12);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        cleanups.push(() => window.removeEventListener('pointermove', onMove));
      }
    }, root);

    return () => {
      clearTimeout(startTimer);
      cleanups.forEach((fn) => fn());
      ctx.revert();
      pauseAll();
    };
  }, [nextId, playAll, pauseAll]);

  return (
    <section ref={rootRef} id="home" className={styles.hero} aria-label="Introduction">
      <div ref={mediaRef} className={styles.media}>
        {/* blurred duplicate = ambient light spill */}
        <video
          ref={ambientRef}
          className={styles.ambient}
          src={src}
          poster={poster}
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
        />
        <div className={styles.fgWrap}>
          <div ref={parallaxRef} className={styles.fgInner}>
            <video
              ref={fgRef}
              className={styles.fg}
              src={src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-label="Sayani, speaking to camera at her desk"
            />
          </div>
        </div>
      </div>

      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.particles} aria-hidden="true">
        <CinematicLayer activeRef={activeRef} />
      </div>
      <div ref={darkRef} className={styles.dark} aria-hidden="true" />

      <div ref={contentRef} className={styles.content}>
        <p data-anim="tagline" className={styles.tagline}>
          <span className={styles.tagRule} aria-hidden="true" />
          {tagline}
        </p>
        <h1 className={styles.name}>
          <span data-anim="line" className={styles.nameFirst}>{firstName}</span>
          <span data-anim="line" className={`${styles.nameLast} ${styles.warm}`}>{lastName}</span>
        </h1>
        <p data-anim="role" className={styles.role}>{role}</p>
        <p data-anim="desc" className={styles.desc}>{description}</p>
      </div>

      <div data-anim="controls" className={styles.controls}>
        <div ref={hintRef} className={styles.hint}>
          <button type="button" className={styles.hintBtn} onClick={toggleMute} tabIndex={muted ? 0 : -1}>
            <span className={styles.eq} aria-hidden="true"><i /><i /><i /></span>
            Tap for sound
          </button>
        </div>
        <button type="button" className={styles.glass} onClick={togglePlay} aria-label={playing ? 'Pause video' : 'Play video'} aria-pressed={!playing}>
          {playing ? Icon.pause : Icon.play}
        </button>
        <button type="button" className={styles.glass} onClick={toggleMute} aria-label={muted ? 'Unmute video' : 'Mute video'} aria-pressed={!muted}>
          {muted ? Icon.muted : Icon.sound}
        </button>
      </div>

      <button data-anim="scroll" type="button" className={styles.scroll} onClick={() => scrollToId(nextId)} aria-label="Scroll to the next section">
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </button>

      <div ref={curtainRef} className={styles.curtain} aria-hidden="true" />
    </section>
  );
}
