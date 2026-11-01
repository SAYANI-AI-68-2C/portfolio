'use client';

import { memo, useEffect, useRef } from 'react';
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
import styles from './Interactive3DCanvas.module.css';

function Interactive3DCanvas() {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 768;

    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch { return; }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene  = new Scene();
    const camera = new PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 11;

    /* Core globe */
    const coreGeo = new IcosahedronGeometry(2.4, 1);
    const coreMat = new MeshBasicMaterial({ color: 0x9b7bff, wireframe: true, transparent: true, opacity: 0.55, blending: AdditiveBlending });
    const coreMesh = new Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    const innerGeo = new IcosahedronGeometry(1.2, 2);
    const innerMat = new MeshBasicMaterial({ color: 0x55e6ff, wireframe: true, transparent: true, opacity: 0.8, blending: AdditiveBlending });
    const innerMesh = new Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    /* Rings */
    const makeRing = (r, tube, color, opacity, rx, ry, rz) => {
      const g = new TorusGeometry(r, tube, 12, 100);
      const m = new MeshBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending });
      const mesh = new Mesh(g, m);
      mesh.rotation.set(rx, ry, rz);
      scene.add(mesh);
      return mesh;
    };

    const ring1 = makeRing(3.6, 0.022, 0x9b7bff, 0.65, Math.PI * 0.35, Math.PI * 0.15, 0);
    const ring2 = makeRing(4.3, 0.018, 0x55e6ff, 0.45, -Math.PI * 0.28, 0, Math.PI * 0.25);

    /* Particle swarm */
    const PC = mobile ? 80 : 180;
    const pCoords = new Float32Array(PC * 3);
    const pVel    = [];
    for (let i = 0; i < PC; i++) {
      const u = Math.random(), v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi   = Math.acos(2 * v - 1);
      const r     = 2.8 + Math.cbrt(Math.random()) * 3.4;
      pCoords[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pCoords[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pCoords[i * 3 + 2] = r * Math.cos(phi);
      pVel.push({ x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005, z: (Math.random() - 0.5) * 0.005 });
    }

    const pGeo = new BufferGeometry();
    pGeo.setAttribute('position', new BufferAttribute(pCoords, 3));
    const pMat = new PointsMaterial({ color: 0xffffff, size: mobile ? 0.15 : 0.17, transparent: true, opacity: 0.85, blending: AdditiveBlending, sizeAttenuation: true });
    scene.add(new Points(pGeo, pMat));

    /* Sizing */
    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    /* Mouse */
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      tmx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      tmy = (((e.clientY - rect.top)  / rect.height - 0.5)) * 2;
    };
    if (!reduceMotion) container.addEventListener('pointermove', onMove, { passive: true });

    let isIntersecting = false;
    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    }, { threshold: 0.05 });
    io.observe(container);

    /* Animation */
    let raf = 0, t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!isIntersecting || document.hidden) return;
      t += 0.016;
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      coreMesh.rotation.y = t * 0.15 + mx * 0.9;
      coreMesh.rotation.x = Math.sin(t * 0.2) * 0.15 - my * 0.8;
      innerMesh.rotation.y -= 0.009;
      innerMesh.rotation.z += 0.006;
      ring1.rotation.z += 0.008;
      ring2.rotation.y += 0.007;

      const pulse = 1 + Math.sin(t * 1.8) * 0.035;
      coreMesh.scale.setScalar(pulse);

      const pa = pGeo.attributes.position.array;
      for (let i = 0; i < PC; i++) {
        const idx = i * 3;
        pa[idx]     += pVel[i].x;
        pa[idx + 1] += pVel[i].y;
        pa[idx + 2] += pVel[i].z;
        const d = Math.sqrt(pa[idx] ** 2 + pa[idx + 1] ** 2 + pa[idx + 2] ** 2);
        if (d > 6.2 || d < 2.3) { pVel[i].x *= -1; pVel[i].y *= -1; pVel[i].z *= -1; }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    if (reduceMotion) renderer.render(scene, camera);
    else raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      container.removeEventListener('pointermove', onMove);
      [coreGeo, coreMat, innerGeo, innerMat, pGeo, pMat].forEach(o => o.dispose?.());
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.canvasContainer}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.badge}>
        <span className={styles.pulseDot} />
        <span>Interactive Neural Mesh · Move cursor</span>
      </div>
    </div>
  );
}

export default memo(Interactive3DCanvas);
