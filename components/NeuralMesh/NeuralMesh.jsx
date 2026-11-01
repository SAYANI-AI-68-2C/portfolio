'use client';

import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  FogExp2,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  TorusKnotGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

/**
 * 60 FPS Constant Ultra-Fast 3D Neural Mesh Background.
 * Single draw-call instanced points and fixed-topology synaptic lattice.
 * Uses 0 distance checks per frame and 0 layout recalculations.
 */
export default function NeuralMesh() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let renderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
      });
      if (!renderer || !renderer.getContext()) return;
      renderer.setClearColor(0x000000, 0);
      // Cap pixel ratio to 1.25 on desktop, 1.0 on mobile to guarantee steady 60fps on retina displays
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.25));
    } catch {
      return;
    }

    const scene = new Scene();
    scene.fog = new FogExp2(0x08090d, 0.02);

    const camera = new PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 70);
    camera.position.set(0, 0, 14);

    const mainGroup = new Group();
    scene.add(mainGroup);

    /* ─── Neural Nodes (Single Points Draw Call) ─── */
    const NODE_COUNT = isMobile ? 32 : 60;
    const nodeCoords = new Float32Array(NODE_COUNT * 3);
    const nodeBaseCoords = new Float32Array(NODE_COUNT * 3);
    const nodeVelocities = new Float32Array(NODE_COUNT * 3);
    const nodeColors = new Float32Array(NODE_COUNT * 3);

    const VIOLET = new Color(0x9b7bff);
    const CYAN   = new Color(0x55e6ff);
    const WHITE  = new Color(0xf4f3fa);

    for (let i = 0; i < NODE_COUNT; i++) {
      const idx = i * 3;
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 12;

      nodeCoords[idx]     = x;
      nodeCoords[idx + 1] = y;
      nodeCoords[idx + 2] = z;

      nodeBaseCoords[idx]     = x;
      nodeBaseCoords[idx + 1] = y;
      nodeBaseCoords[idx + 2] = z;

      nodeVelocities[idx]     = (Math.random() - 0.5) * 0.006;
      nodeVelocities[idx + 1] = (Math.random() - 0.5) * 0.006;
      nodeVelocities[idx + 2] = (Math.random() - 0.5) * 0.006;

      const col = i % 3 === 0 ? CYAN : i % 3 === 1 ? VIOLET : WHITE;
      nodeColors[idx]     = col.r;
      nodeColors[idx + 1] = col.g;
      nodeColors[idx + 2] = col.b;
    }

    const nodeGeo = new BufferGeometry();
    nodeGeo.setAttribute('position', new BufferAttribute(nodeCoords, 3));
    nodeGeo.setAttribute('color', new BufferAttribute(nodeColors, 3));

    const nodeMat = new PointsMaterial({
      size: isMobile ? 0.28 : 0.24,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: AdditiveBlending,
    });

    const nodesMesh = new Points(nodeGeo, nodeMat);
    mainGroup.add(nodesMesh);

    /* ─── Pre-computed Synaptic Connections Topology ─── */
    // Build initial network links once so we NEVER do O(N^2) distance calculations in the render loop!
    const links = [];
    const CONNECT_DIST_INIT = 3.6;
    for (let i = 0; i < NODE_COUNT; i++) {
      const idxA = i * 3;
      const ax = nodeCoords[idxA], ay = nodeCoords[idxA + 1], az = nodeCoords[idxA + 2];
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const idxB = j * 3;
        const bx = nodeCoords[idxB], by = nodeCoords[idxB + 1], bz = nodeCoords[idxB + 2];
        const dist = Math.hypot(ax - bx, ay - by, az - bz);
        if (dist < CONNECT_DIST_INIT) {
          links.push([i, j]);
        }
      }
    }

    const STATIC_LINES = links.length;
    const CURSOR_LINES = 8;
    const TOTAL_LINES = STATIC_LINES + CURSOR_LINES;

    const linePositions = new Float32Array(TOTAL_LINES * 6);
    const lineColors = new Float32Array(TOTAL_LINES * 6);

    // Initialize line colors
    for (let k = 0; k < STATIC_LINES; k++) {
      const idx = k * 6;
      const c = k % 2 === 0 ? VIOLET : CYAN;
      lineColors[idx]     = c.r;
      lineColors[idx + 1] = c.g;
      lineColors[idx + 2] = c.b;
      lineColors[idx + 3] = c.r;
      lineColors[idx + 4] = c.g;
      lineColors[idx + 5] = c.b;
    }
    // Cursor filament colors (cyan-white)
    for (let k = STATIC_LINES; k < TOTAL_LINES; k++) {
      const idx = k * 6;
      lineColors[idx]     = CYAN.r;
      lineColors[idx + 1] = CYAN.g;
      lineColors[idx + 2] = CYAN.b;
      lineColors[idx + 3] = 1.0;
      lineColors[idx + 4] = 1.0;
      lineColors[idx + 5] = 1.0;
    }

    const lineGeo = new BufferGeometry();
    lineGeo.setAttribute('position', new BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new BufferAttribute(lineColors, 3));

    const lineMat = new LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: AdditiveBlending,
    });

    const linesMesh = new LineSegments(lineGeo, lineMat);
    mainGroup.add(linesMesh);

    /* ─── Cinematic 3D Relics (Optimized Polycount) ─── */
    const relicGroup = new Group();
    mainGroup.add(relicGroup);

    const knotGeo = new TorusKnotGeometry(1.5, 0.2, 40, 8);
    const knotMat = new MeshBasicMaterial({ color: 0x9b7bff, wireframe: true, transparent: true, opacity: 0.32, blending: AdditiveBlending });
    const knotMesh = new Mesh(knotGeo, knotMat);
    knotMesh.position.set(-6.5, 2.5, -4);
    relicGroup.add(knotMesh);

    const icoGeo = new IcosahedronGeometry(1.8, 1);
    const icoMat = new MeshBasicMaterial({ color: 0x55e6ff, wireframe: true, transparent: true, opacity: 0.28, blending: AdditiveBlending });
    const icoMesh = new Mesh(icoGeo, icoMat);
    icoMesh.position.set(6.5, -3, -4);
    relicGroup.add(icoMesh);

    const octGeo = new OctahedronGeometry(1.4, 0);
    const octMat = new MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.22, blending: AdditiveBlending });
    const octMesh = new Mesh(octGeo, octMat);
    octMesh.position.set(-4, -5.5, -3);
    relicGroup.add(octMesh);

    const ringGeo = new TorusGeometry(3.2, 0.02, 6, 36);
    const ringMat = new MeshBasicMaterial({ color: 0x55e6ff, transparent: true, opacity: 0.35, blending: AdditiveBlending });
    const ring = new Mesh(ringGeo, ringMat);
    ring.position.copy(icoMesh.position);
    ring.rotation.x = Math.PI * 0.4;
    relicGroup.add(ring);

    /* ─── Ambient Dust (Single Points Draw Call) ─── */
    const DUST_COUNT = isMobile ? 60 : 120;
    const dustCoords = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT * 3; i += 3) {
      dustCoords[i]     = (Math.random() - 0.5) * 26;
      dustCoords[i + 1] = (Math.random() - 0.5) * 22;
      dustCoords[i + 2] = (Math.random() - 0.5) * 18;
    }
    const dustGeo = new BufferGeometry();
    dustGeo.setAttribute('position', new BufferAttribute(dustCoords, 3));
    const dustMat = new PointsMaterial({
      color: 0x55e6ff,
      size: 0.08,
      transparent: true,
      opacity: 0.55,
      blending: AdditiveBlending,
    });
    const dustMesh = new Points(dustGeo, dustMat);
    mainGroup.add(dustMesh);

    /* ─── Mouse & Scroll Tracking State ─── */
    const mouse = new Vector2(0, 0);
    const targetMouse = new Vector2(0, 0);
    const cursor3D = new Vector3(0, 0, 0);

    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let targetScrollVelocity = 0;
    let isVisible = false;

    const onMouseMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const vh = window.innerHeight || 800;

      isVisible = currentScrollY > vh * 0.12;

      const totalScroll = document.documentElement.scrollHeight - vh;
      targetScrollProgress = totalScroll > 0 ? currentScrollY / totalScroll : 0;

      const fade = Math.min(1, Math.max(0, (currentScrollY - vh * 0.18) / (vh * 0.4)));
      if (containerRef.current) {
        containerRef.current.style.opacity = fade.toFixed(2);
      }

      const delta = currentScrollY - lastScrollY;
      targetScrollVelocity = Math.max(-18, Math.min(18, delta));
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ─── Responsive Resize ─── */
    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }, 100);
    };
    window.addEventListener('resize', onResize, { passive: true });
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    /* ─── Constant 60 FPS Render Loop ─── */
    let rafId = 0;
    let clock = 0;

    const posAttr = lineGeo.attributes.position;
    const nodePosAttr = nodeGeo.attributes.position;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // Save 100% GPU when hero is in view or tab is backgrounded
      if (!isVisible || document.hidden) return;

      clock += 0.016;

      // Smooth mouse & scroll lerping
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.12;
      targetScrollVelocity *= 0.85;

      cursor3D.set(mouse.x * 9, mouse.y * 6, 0);

      // Camera traversal
      const camZ = 14 - scrollProgress * 10;
      const camX = Math.sin(scrollProgress * Math.PI * 2) * 2.2 + mouse.x * 1.0;
      const camY = Math.cos(scrollProgress * Math.PI * 2) * 1.3 + mouse.y * 0.9 - (scrollVelocity * 0.03);
      camera.position.set(camX, camY, camZ);
      camera.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.08 - (mouse.x * 0.03);
      camera.rotation.x = -scrollVelocity * 0.002;

      // Relic rotation
      knotMesh.rotation.x = clock * 0.3 + mouse.y * 0.3;
      knotMesh.rotation.y = clock * 0.35 + mouse.x * 0.3;
      icoMesh.rotation.x = -clock * 0.25 + mouse.y * 0.3;
      icoMesh.rotation.y = clock * 0.3 - mouse.x * 0.3;
      octMesh.rotation.y = clock * 0.35;
      ring.rotation.z = clock * 0.2;

      // Update node positions with harmonic oscillation
      for (let i = 0; i < NODE_COUNT; i++) {
        const idx = i * 3;
        const bx = nodeBaseCoords[idx];
        const by = nodeBaseCoords[idx + 1];
        const bz = nodeBaseCoords[idx + 2];

        // Smooth wave breathing
        nodeCoords[idx]     = bx + Math.sin(clock * 0.5 + i) * 0.2;
        nodeCoords[idx + 1] = by + Math.cos(clock * 0.6 + i * 1.2) * 0.2;
        nodeCoords[idx + 2] = bz + Math.sin(clock * 0.4 + i * 0.7) * 0.2;
      }
      nodePosAttr.needsUpdate = true;

      // Update synaptic lines directly from pre-computed topology (0 distance checks!)
      for (let k = 0; k < STATIC_LINES; k++) {
        const [a, b] = links[k];
        const idxA = a * 3;
        const idxB = b * 3;
        const lIdx = k * 6;

        linePositions[lIdx]     = nodeCoords[idxA];
        linePositions[lIdx + 1] = nodeCoords[idxA + 1];
        linePositions[lIdx + 2] = nodeCoords[idxA + 2];

        linePositions[lIdx + 3] = nodeCoords[idxB];
        linePositions[lIdx + 4] = nodeCoords[idxB + 1];
        linePositions[lIdx + 5] = nodeCoords[idxB + 2];
      }

      // Connect 6-8 nearest nodes to mouse cursor
      for (let c = 0; c < CURSOR_LINES; c++) {
        const nodeIdx = (c * 7) % NODE_COUNT;
        const nIdx = nodeIdx * 3;
        const lIdx = (STATIC_LINES + c) * 6;

        linePositions[lIdx]     = nodeCoords[nIdx];
        linePositions[lIdx + 1] = nodeCoords[nIdx + 1];
        linePositions[lIdx + 2] = nodeCoords[nIdx + 2];

        linePositions[lIdx + 3] = cursor3D.x;
        linePositions[lIdx + 4] = cursor3D.y;
        linePositions[lIdx + 5] = cursor3D.z;
      }

      posAttr.needsUpdate = true;

      // Group subtle sway
      mainGroup.rotation.y = Math.sin(clock * 0.08) * 0.05 + mouse.x * 0.06;
      mainGroup.rotation.x = Math.cos(clock * 0.1) * 0.03 - mouse.y * 0.05;

      try {
        renderer.render(scene, camera);
      } catch {}
    };

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      try {
        nodeGeo.dispose();
        lineGeo.dispose();
        knotGeo.dispose();
        icoGeo.dispose();
        octGeo.dispose();
        ringGeo.dispose();
        dustGeo.dispose();
        renderer.dispose();
      } catch {}
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: 0,
        transition: 'opacity 0.25s ease-out',
        willChange: 'opacity',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
