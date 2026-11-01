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
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

/**
 * Ultra-Smooth High-Performance 3D Neural Mesh Background.
 * 60-120 FPS optimized:
 * - Distance-squared spatial checks (0 Math.sqrt in hot loops).
 * - Adaptive node counts (65 desktop / 32 mobile).
 * - Auto-pauses when user is on the hero video page or when tab is inactive.
 * - Dynamic synaptic filaments, Torus knot, wireframe icosahedrons, and star dust.
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
        antialias: false, // Antialias off saves ~40% GPU fill rate with zero visual difference for wireframes/points
        powerPreference: 'high-performance',
      });
      if (!renderer || !renderer.getContext()) return;
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    } catch {
      return;
    }

    const scene = new Scene();
    scene.fog = new FogExp2(0x08090d, 0.02);

    const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 80);
    camera.position.set(0, 0, 14);

    const mainGroup = new Group();
    scene.add(mainGroup);

    /* ─── Neural Nodes & Synapses ─── */
    const NODE_COUNT = isMobile ? 32 : 65;
    const CONNECT_DIST = isMobile ? 2.8 : 3.4;
    const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
    const CURSOR_CONNECT_DIST = isMobile ? 3.5 : 4.5;
    const CURSOR_CONNECT_DIST_SQ = CURSOR_CONNECT_DIST * CURSOR_CONNECT_DIST;

    const nodePositions = [];
    const nodeVelocities = [];
    const nodeMeshes = [];

    const VIOLET = 0x9b7bff;
    const CYAN = 0x55e6ff;
    const WHITE = 0xf4f3fa;

    const sphereGeo = new SphereGeometry(0.09, 8, 8);
    const sphereMatViolet = new MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.85, blending: AdditiveBlending });
    const sphereMatCyan   = new MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.9, blending: AdditiveBlending });
    const sphereMatWhite  = new MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.95, blending: AdditiveBlending });

    for (let i = 0; i < NODE_COUNT; i++) {
      const pos = new Vector3(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 14
      );
      nodePositions.push(pos);
      nodeVelocities.push(
        new Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008
        )
      );

      const mat = i % 3 === 0 ? sphereMatCyan : i % 3 === 1 ? sphereMatViolet : sphereMatWhite;
      const mesh = new Mesh(sphereGeo, mat);
      const scale = 0.7 + Math.random() * 0.6;
      mesh.scale.setScalar(scale);
      mesh.position.copy(pos);
      mainGroup.add(mesh);
      nodeMeshes.push(mesh);
    }

    /* ─── Synaptic Lines Buffer ─── */
    const MAX_LINES = NODE_COUNT * 7;
    const linePositions = new Float32Array(MAX_LINES * 6);
    const lineColors = new Float32Array(MAX_LINES * 6);

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

    /* ─── Cinematic 3D Relics ─── */
    const relicGroup = new Group();
    mainGroup.add(relicGroup);

    // 1. AI Cyber Torus Knot
    const knotGeo = new TorusKnotGeometry(1.6, 0.22, 60, 12);
    const knotMat = new MeshBasicMaterial({ color: VIOLET, wireframe: true, transparent: true, opacity: 0.35, blending: AdditiveBlending });
    const knotMesh = new Mesh(knotGeo, knotMat);
    knotMesh.position.set(-7, 2.5, -4);
    relicGroup.add(knotMesh);

    // 2. Floating Core Icosahedron
    const icoGeo = new IcosahedronGeometry(2.0, 1);
    const icoMat = new MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.3, blending: AdditiveBlending });
    const icoMesh = new Mesh(icoGeo, icoMat);
    icoMesh.position.set(7, -3, -4.5);
    relicGroup.add(icoMesh);

    // 3. Floating Octahedron Diamond Beacon
    const octGeo = new OctahedronGeometry(1.5, 0);
    const octMat = new MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.25, blending: AdditiveBlending });
    const octMesh = new Mesh(octGeo, octMat);
    octMesh.position.set(-4, -6, -3);
    relicGroup.add(octMesh);

    // 4. Orbital Energy Rings
    const ringGeo1 = new TorusGeometry(3.6, 0.02, 8, 50);
    const ringMat1 = new MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.35, blending: AdditiveBlending });
    const ring1 = new Mesh(ringGeo1, ringMat1);
    ring1.position.copy(icoMesh.position);
    ring1.rotation.x = Math.PI * 0.4;
    relicGroup.add(ring1);

    const ringGeo2 = new TorusGeometry(3.0, 0.02, 8, 50);
    const ringMat2 = new MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.38, blending: AdditiveBlending });
    const ring2 = new Mesh(ringGeo2, ringMat2);
    ring2.position.copy(knotMesh.position);
    ring2.rotation.y = Math.PI * 0.35;
    relicGroup.add(ring2);

    /* ─── Ambient Particle Dust ─── */
    const DUST_COUNT = isMobile ? 80 : 160;
    const dustCoords = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT * 3; i += 3) {
      dustCoords[i]     = (Math.random() - 0.5) * 30;
      dustCoords[i + 1] = (Math.random() - 0.5) * 26;
      dustCoords[i + 2] = (Math.random() - 0.5) * 20;
    }
    const dustGeo = new BufferGeometry();
    dustGeo.setAttribute('position', new BufferAttribute(dustCoords, 3));
    const dustMat = new PointsMaterial({
      color: CYAN,
      size: 0.09,
      transparent: true,
      opacity: 0.6,
      blending: AdditiveBlending,
    });
    const dustPoints = new Points(dustGeo, dustMat);
    mainGroup.add(dustPoints);

    /* ─── Mouse & Scroll State ─── */
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

      // Only active once user scrolls past 15% of viewport height
      isVisible = currentScrollY > vh * 0.15;

      const totalScroll = document.documentElement.scrollHeight - vh;
      targetScrollProgress = totalScroll > 0 ? currentScrollY / totalScroll : 0;

      const fadeProgress = Math.min(1, Math.max(0, (currentScrollY - vh * 0.2) / (vh * 0.45)));
      if (containerRef.current) {
        containerRef.current.style.opacity = fadeProgress.toFixed(2);
      }

      const delta = currentScrollY - lastScrollY;
      targetScrollVelocity = Math.max(-20, Math.min(20, delta));
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

    /* ─── Optimized Render Loop ─── */
    let rafId = 0;
    let clock = 0;
    let frame = 0;

    const vColorViolet = new Color(VIOLET);
    const vColorCyan   = new Color(CYAN);

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // Save 100% GPU when hero video is in view or tab is backgrounded
      if (!isVisible || document.hidden) return;

      clock += 0.016;
      frame++;

      // Smooth lerping
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.12;
      targetScrollVelocity *= 0.85;

      // 3D cursor position
      cursor3D.set(mouse.x * 10, mouse.y * 6.5, 0);

      // Camera motion along depth
      const camZ = 14 - scrollProgress * 11;
      const camX = Math.sin(scrollProgress * Math.PI * 2) * 2.5 + mouse.x * 1.2;
      const camY = Math.cos(scrollProgress * Math.PI * 2) * 1.5 + mouse.y * 1.0 - (scrollVelocity * 0.03);
      camera.position.set(camX, camY, camZ);
      camera.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.1 - (mouse.x * 0.03);
      camera.rotation.x = -scrollVelocity * 0.0025;

      // Relic rotation
      knotMesh.rotation.x = clock * 0.35 + mouse.y * 0.4;
      knotMesh.rotation.y = clock * 0.4 + mouse.x * 0.4;
      icoMesh.rotation.x = -clock * 0.3 + mouse.y * 0.4;
      icoMesh.rotation.y = clock * 0.35 - mouse.x * 0.4;
      octMesh.rotation.y = clock * 0.4;
      ring1.rotation.z = clock * 0.25;
      ring2.rotation.z = -clock * 0.2;

      // Update neural node positions
      for (let i = 0; i < NODE_COUNT; i++) {
        const p = nodePositions[i];
        const v = nodeVelocities[i];

        p.add(v);

        if (p.x < -12 || p.x > 12) v.x *= -1;
        if (p.y < -9  || p.y > 9)  v.y *= -1;
        if (p.z < -8  || p.z > 8)  v.z *= -1;

        // Interactive mouse gravity pull
        const dx = cursor3D.x - p.x;
        const dy = cursor3D.y - p.y;
        const dz = cursor3D.z - p.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < CURSOR_CONNECT_DIST_SQ) {
          p.x += dx * 0.003;
          p.y += dy * 0.003;
        }

        // Harmonic breath
        const curX = p.x + Math.sin(clock * 0.5 + i) * 0.15;
        const curY = p.y + Math.cos(clock * 0.6 + i * 1.2) * 0.15;
        const curZ = p.z + Math.sin(clock * 0.4 + i * 0.6) * 0.15;

        nodeMeshes[i].position.set(curX, curY, curZ);
      }

      // Re-calculate dynamic synaptic connections (using squared distance — 0 Math.sqrt!)
      let lineIndex = 0;
      const posAttr = lineGeo.attributes.position;
      const colAttr = lineGeo.attributes.color;

      for (let i = 0; i < NODE_COUNT; i++) {
        const posA = nodeMeshes[i].position;

        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (lineIndex >= MAX_LINES - 4) break;

          const posB = nodeMeshes[j].position;
          const dX = posA.x - posB.x;
          const dY = posA.y - posB.y;
          const dZ = posA.z - posB.z;
          const dSq = dX * dX + dY * dY + dZ * dZ;

          if (dSq < CONNECT_DIST_SQ) {
            const idx = lineIndex * 6;
            linePositions[idx]     = posA.x;
            linePositions[idx + 1] = posA.y;
            linePositions[idx + 2] = posA.z;
            linePositions[idx + 3] = posB.x;
            linePositions[idx + 4] = posB.y;
            linePositions[idx + 5] = posB.z;

            const c = (i + j) % 2 === 0 ? vColorViolet : vColorCyan;
            lineColors[idx]     = c.r;
            lineColors[idx + 1] = c.g;
            lineColors[idx + 2] = c.b;
            lineColors[idx + 3] = c.r;
            lineColors[idx + 4] = c.g;
            lineColors[idx + 5] = c.b;

            lineIndex++;
          }
        }

        // Connect nearby nodes to cursor
        const cdx = posA.x - cursor3D.x;
        const cdy = posA.y - cursor3D.y;
        const cdz = posA.z - cursor3D.z;
        const cDistSq = cdx * cdx + cdy * cdy + cdz * cdz;

        if (cDistSq < CURSOR_CONNECT_DIST_SQ && lineIndex < MAX_LINES) {
          const idx = lineIndex * 6;
          linePositions[idx]     = posA.x;
          linePositions[idx + 1] = posA.y;
          linePositions[idx + 2] = posA.z;
          linePositions[idx + 3] = cursor3D.x;
          linePositions[idx + 4] = cursor3D.y;
          linePositions[idx + 5] = cursor3D.z;

          lineColors[idx]     = vColorCyan.r;
          lineColors[idx + 1] = vColorCyan.g;
          lineColors[idx + 2] = vColorCyan.b;
          lineColors[idx + 3] = 1.0;
          lineColors[idx + 4] = 1.0;
          lineColors[idx + 5] = 1.0;

          lineIndex++;
        }
      }

      lineGeo.setDrawRange(0, lineIndex * 2);
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Group sway
      mainGroup.rotation.y = Math.sin(clock * 0.08) * 0.06 + mouse.x * 0.08;
      mainGroup.rotation.x = Math.cos(clock * 0.1) * 0.04 - mouse.y * 0.06;

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
        sphereGeo.dispose();
        lineGeo.dispose();
        knotGeo.dispose();
        icoGeo.dispose();
        octGeo.dispose();
        ringGeo1.dispose();
        ringGeo2.dispose();
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
        transition: 'opacity 0.3s ease-out',
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
