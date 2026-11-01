'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import styles from './Loader.module.css';

const STEPS = [
  [0,  'Setting up the network'],
  [35, 'Loading 3D scenes'],
  [70, 'Polishing the details'],
  [95, 'Ready'],
];

export default function Loader({ onDone }) {
  const canvasRef   = useRef(null);
  const ringRef     = useRef(null);
  const barFillRef  = useRef(null);
  const pctRef      = useRef(null);
  const msgRef      = useRef(null);
  const nameRef     = useRef(null);
  const loaderRef   = useRef(null);

  const [leaving, setLeaving] = useState(false);

  /* ── animate name letters ── */
  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    el.innerHTML = '';
    const name = 'Sayani Ghosal';
    name.split('').forEach((c, i) => {
      const s = document.createElement('span');
      s.textContent = c === ' ' ? '\u00a0' : c;
      s.style.animationDelay = (0.15 + i * 0.05) + 's';
      el.appendChild(s);
    });
  }, []);

  /* ── 3D canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
      if (!renderer || !renderer.getContext()) return;
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    } catch {
      return;
    }

    const scene  = new Scene();
    const aspect = canvas.clientHeight > 0 ? canvas.clientWidth / canvas.clientHeight : (window.innerWidth / window.innerHeight);
    const camera = new PerspectiveCamera(50, aspect, 0.1, 50);
    camera.position.z = 7;

    // Glass icosahedron
    const coreGeo = new IcosahedronGeometry(2, 2);
    const coreMat = new MeshBasicMaterial({ color: 0x9b7bff, wireframe: true, transparent: true, opacity: 0.7, blending: AdditiveBlending });
    const coreMesh = new Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    const innerGeo = new IcosahedronGeometry(1.1, 1);
    const innerMat = new MeshBasicMaterial({ color: 0x55e6ff, wireframe: true, transparent: true, opacity: 0.9, blending: AdditiveBlending });
    const innerMesh = new Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Torus rings
    const r1Geo = new TorusGeometry(2.2, 0.02, 16, 100);
    const r1Mat = new MeshBasicMaterial({ color: 0x9b7bff, transparent: true, opacity: 0.6, blending: AdditiveBlending });
    const ring1 = new Mesh(r1Geo, r1Mat);
    ring1.rotation.x = 1.0;
    scene.add(ring1);

    const r2Geo = new TorusGeometry(2.7, 0.015, 16, 100);
    const r2Mat = new MeshBasicMaterial({ color: 0x55e6ff, transparent: true, opacity: 0.45, blending: AdditiveBlending });
    const ring2 = new Mesh(r2Geo, r2Mat);
    ring2.rotation.y = 0.5;
    ring2.rotation.x = 1.2;
    scene.add(ring2);

    // Particles
    const PC = 120;
    const pos = new Float32Array(PC * 3);
    for (let i = 0; i < PC; i++) {
      const u = Math.random(), v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi   = Math.acos(2 * v - 1);
      const r     = 2.6 + Math.random() * 2;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new BufferGeometry();
    pGeo.setAttribute('position', new BufferAttribute(pos, 3));
    const pMat = new PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.8, blending: AdditiveBlending });
    scene.add(new Points(pGeo, pMat));

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      try {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      } catch {}
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let raf = 0, t = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      t += 0.016;
      coreMesh.rotation.y  =  t * 0.4;
      coreMesh.rotation.x  =  t * 0.3;
      innerMesh.rotation.y = -t * 0.7;
      innerMesh.rotation.z =  t * 0.5;
      ring1.rotation.z += 0.012;
      ring2.rotation.y += 0.008;
      const pulse = 1 + Math.sin(t * 2.2) * 0.04;
      coreMesh.scale.setScalar(pulse);
      try {
        renderer.render(scene, camera);
      } catch {}
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      [coreGeo, coreMat, innerGeo, innerMat, r1Geo, r1Mat, r2Geo, r2Mat, pGeo, pMat].forEach(o => o.dispose?.());
      try { renderer.dispose(); } catch {}
    };
  }, []);

  /* ── progress simulation ── */
  useEffect(() => {
    const ring = ringRef.current;
    const barFill = barFillRef.current;
    const pctEl = pctRef.current;
    const msgEl = msgRef.current;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MIN = rm ? 200 : 1200;

    let p = 0;
    const t0 = performance.now();
    let fin = false;
    let rafId = 0;

    function open() {
      if (fin) return;
      fin = true;
      cancelAnimationFrame(rafId);
      setLeaving(true);
      setTimeout(() => onDone?.(), 800);
    }

    // Safety fallback
    const safetyTimer = setTimeout(open, 2500);

    function tick(t) {
      const e = Math.min((t - t0) / MIN, 1);
      const goal = e;
      p += (goal - p) * 0.2;
      const v = (e >= 1 && p > 0.95) ? 1 : p;
      const k = Math.min(Math.round(v * 100), 100);

      if (barFill) barFill.style.transform = `scaleX(${v})`;
      if (ring)    ring.style.strokeDashoffset = String(339.3 * (1 - v));
      if (pctEl)   pctEl.textContent = k + '%';
      if (msgEl) {
        for (const [threshold, label] of STEPS) {
          if (k >= threshold) msgEl.textContent = label;
        }
      }

      if (v >= 1) {
        setTimeout(open, 150);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(safetyTimer);
    };
  }, [onDone]);

  return (
    <div ref={loaderRef} className={`${styles.loader} ${leaving ? styles.leaving : ''}`}>
      {/* Split-panel curtains */}
      <div className={styles.panelTop} />
      <div className={styles.panelBot} />

      {/* 3-D canvas background */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Glow overlay */}
      <div className={styles.glow} />

      {/* Scan lines */}
      <div className={styles.scan} aria-hidden="true" />

      {/* Centre content */}
      <div className={styles.lw}>
        {/* Ring + logo */}
        <div className={styles.lc}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className={styles.r0} cx="60" cy="60" r="54" />
            <circle className={styles.r1} ref={ringRef} cx="60" cy="60" r="54" />
          </svg>
          <span className={styles.logo}>SG.</span>
        </div>

        {/* Animated name */}
        <div className={styles.lname} ref={nameRef} aria-hidden="true" />

        {/* Progress bar */}
        <div className={styles.lbar}>
          <span ref={barFillRef} className={styles.lbarFill} />
        </div>

        {/* Meta row */}
        <div className={styles.lmeta}>
          <span ref={msgRef}>Setting up the network</span>
          <span ref={pctRef} className={styles.pct}>0%</span>
        </div>
      </div>
    </div>
  );
}
