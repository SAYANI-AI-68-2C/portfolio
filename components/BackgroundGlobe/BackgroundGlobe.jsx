'use client';

import { memo, useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
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
import styles from './BackgroundGlobe.module.css';

/* ─── performance constants ─────────────────────────────── */
const PARTICLE_COUNT_DESKTOP = 220;
const PARTICLE_COUNT_MOBILE  = 80;

function BackgroundGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 768;
    const PC = mobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

    /* ── renderer ── */
    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    } catch { return; }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));

    /* ── scene / camera ── */
    const scene = new Scene();
    const camera = new PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    /* ── core globe wireframe ── */
    const coreGeo = new IcosahedronGeometry(2.8, 2);
    const coreMat = new MeshBasicMaterial({ color: 0x9b7bff, wireframe: true, transparent: true, opacity: 0.18, blending: AdditiveBlending });
    const coreMesh = new Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    const innerGeo = new IcosahedronGeometry(1.5, 1);
    const innerMat = new MeshBasicMaterial({ color: 0x55e6ff, wireframe: true, transparent: true, opacity: 0.28, blending: AdditiveBlending });
    const innerMesh = new Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    /* ── orbital rings ── */
    const makeRing = (r, tube, color, opacity, rx, ry, rz) => {
      const g = new TorusGeometry(r, tube, 12, 100);
      const m = new MeshBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending });
      const mesh = new Mesh(g, m);
      mesh.rotation.set(rx, ry, rz);
      scene.add(mesh);
      return mesh;
    };

    const ring1 = makeRing(4.2, 0.018, 0x9b7bff, 0.35, Math.PI * 0.35, Math.PI * 0.15, 0);
    const ring2 = makeRing(5.1, 0.013, 0x55e6ff, 0.25, -Math.PI * 0.28, 0, Math.PI * 0.25);
    const ring3 = makeRing(3.4, 0.01, 0xffffff, 0.12, Math.PI * 0.1, Math.PI * 0.55, 0);

    /* ── particle swarm ── */
    const pos = new Float32Array(PC * 3);
    const vel = [];
    for (let i = 0; i < PC; i++) {
      const u = Math.random(), v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi   = Math.acos(2 * v - 1);
      const r     = 3.2 + Math.cbrt(Math.random()) * 4.2;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      vel.push({ x: (Math.random() - 0.5) * 0.004, y: (Math.random() - 0.5) * 0.004, z: (Math.random() - 0.5) * 0.004 });
    }
    const pGeo = new BufferGeometry();
    pGeo.setAttribute('position', new BufferAttribute(pos, 3));
    const pMat = new PointsMaterial({ color: 0xffffff, size: mobile ? 0.1 : 0.12, transparent: true, opacity: 0.55, blending: AdditiveBlending, sizeAttenuation: true });
    const points = new Points(pGeo, pMat);
    scene.add(points);

    /* ── sizing ── */
    const resize = () => {
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || document.body);
    resize();

    /* ── mouse parallax ── */
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e) => {
      tmx = (e.clientX / window.innerWidth  - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduceMotion) window.addEventListener('pointermove', onMove, { passive: true });

    /* ── scroll depth mapping ── */
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── animation loop ── */
    let raf = 0, last = performance.now(), t = 8;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (document.hidden) return;

      t += dt;

      // mouse easing
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;

      // scroll-based tilt
      const scrollFactor = scrollY * 0.00015;

      coreMesh.rotation.y  = t * 0.09 + mx * 0.55;
      coreMesh.rotation.x  = t * 0.05 + my * 0.35 + scrollFactor;
      innerMesh.rotation.y = -t * 0.14 + mx * 0.45;
      innerMesh.rotation.z =  t * 0.08;

      ring1.rotation.z += 0.006 * dt * 60;
      ring2.rotation.y += 0.005 * dt * 60;
      ring3.rotation.x += 0.007 * dt * 60;

      // pulse
      const pulse = 1 + Math.sin(t * 1.4) * 0.025;
      coreMesh.scale.setScalar(pulse);

      // particle drift
      const pa = pGeo.attributes.position.array;
      for (let i = 0; i < PC; i++) {
        const idx = i * 3;
        pa[idx]     += vel[i].x;
        pa[idx + 1] += vel[i].y;
        pa[idx + 2] += vel[i].z;
        const d = Math.sqrt(pa[idx] ** 2 + pa[idx + 1] ** 2 + pa[idx + 2] ** 2);
        if (d > 7.5 || d < 2.8) { vel[i].x *= -1; vel[i].y *= -1; vel[i].z *= -1; }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      [coreGeo, coreMat, innerGeo, innerMat, pGeo, pMat].forEach(o => o.dispose?.());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}

export default memo(BackgroundGlobe);

