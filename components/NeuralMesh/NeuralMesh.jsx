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
 * Interactive 3D Neural Mesh Background.
 * Renders an interactive synaptic neural network lattice across the entire site
 * from the second page (About section) onwards.
 * Reacts dynamically to mouse coordinates, scroll depth, and bidirectional scroll velocity.
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
        antialias: !isMobile,
        powerPreference: 'high-performance',
      });
      if (!renderer || !renderer.getContext()) return;
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    } catch {
      return;
    }

    const scene = new Scene();
    scene.fog = new FogExp2(0x08090d, 0.02);

    const camera = new PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 0, 14);

    const mainGroup = new Group();
    scene.add(mainGroup);

    /* ─── Neural Nodes & Synapses ─── */
    const NODE_COUNT = isMobile ? 60 : 120;
    const CONNECT_DIST = isMobile ? 2.5 : 3.0;
    const CURSOR_CONNECT_DIST = isMobile ? 3.4 : 4.4;

    const nodePositions = [];
    const nodeVelocities = [];
    const nodeMeshes = [];

    const VIOLET = 0x9b7bff;
    const CYAN = 0x55e6ff;
    const WHITE = 0xf4f3fa;

    const sphereGeo = new SphereGeometry(0.08, 10, 10);
    const sphereMatViolet = new MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.85, blending: AdditiveBlending });
    const sphereMatCyan   = new MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.9, blending: AdditiveBlending });
    const sphereMatWhite  = new MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.95, blending: AdditiveBlending });

    for (let i = 0; i < NODE_COUNT; i++) {
      const pos = new Vector3(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 16
      );
      nodePositions.push(pos);
      nodeVelocities.push(
        new Vector3(
          (Math.random() - 0.5) * 0.007,
          (Math.random() - 0.5) * 0.007,
          (Math.random() - 0.5) * 0.007
        )
      );

      const mat = i % 3 === 0 ? sphereMatCyan : i % 3 === 1 ? sphereMatViolet : sphereMatWhite;
      const mesh = new Mesh(sphereGeo, mat);
      const scale = 0.7 + Math.random() * 0.8;
      mesh.scale.setScalar(scale);
      mesh.position.copy(pos);
      mainGroup.add(mesh);
      nodeMeshes.push(mesh);
    }

    /* ─── Synaptic Lines Buffer ─── */
    const MAX_LINES = NODE_COUNT * 9;
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
      linewidth: 1,
    });

    const linesMesh = new LineSegments(lineGeo, lineMat);
    mainGroup.add(linesMesh);

    /* ─── Cinematic 3D Relics (Torus Knots, Wireframes & Beacons) ─── */
    const relicGroup = new Group();
    mainGroup.add(relicGroup);

    // 1. AI Cyber Torus Knot (Left flank)
    const knotGeo = new TorusKnotGeometry(1.7, 0.24, 120, 16);
    const knotMat = new MeshBasicMaterial({ color: VIOLET, wireframe: true, transparent: true, opacity: 0.38, blending: AdditiveBlending });
    const knotMesh = new Mesh(knotGeo, knotMat);
    knotMesh.position.set(-7.2, 3.0, -4.5);
    relicGroup.add(knotMesh);

    // 2. Floating Core Icosahedron (Right flank)
    const icoGeo = new IcosahedronGeometry(2.2, 1);
    const icoMat = new MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.32, blending: AdditiveBlending });
    const icoMesh = new Mesh(icoGeo, icoMat);
    icoMesh.position.set(7.5, -3.5, -5);
    relicGroup.add(icoMesh);

    // 3. Floating Octahedron Diamond Beacon (Lower center-right)
    const octGeo = new OctahedronGeometry(1.6, 0);
    const octMat = new MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.28, blending: AdditiveBlending });
    const octMesh = new Mesh(octGeo, octMat);
    octMesh.position.set(-4.5, -6.5, -3);
    relicGroup.add(octMesh);

    // 4. Orbital Energy Rings
    const ringGeo1 = new TorusGeometry(3.8, 0.02, 12, 90);
    const ringMat1 = new MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.38, blending: AdditiveBlending });
    const ring1 = new Mesh(ringGeo1, ringMat1);
    ring1.position.copy(icoMesh.position);
    ring1.rotation.x = Math.PI * 0.4;
    relicGroup.add(ring1);

    const ringGeo2 = new TorusGeometry(3.2, 0.022, 12, 90);
    const ringMat2 = new MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.42, blending: AdditiveBlending });
    const ring2 = new Mesh(ringGeo2, ringMat2);
    ring2.position.copy(knotMesh.position);
    ring2.rotation.y = Math.PI * 0.35;
    relicGroup.add(ring2);

    /* ─── Ambient Particle Dust ─── */
    const DUST_COUNT = isMobile ? 140 : 280;
    const dustCoords = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT * 3; i += 3) {
      dustCoords[i]     = (Math.random() - 0.5) * 32;
      dustCoords[i + 1] = (Math.random() - 0.5) * 28;
      dustCoords[i + 2] = (Math.random() - 0.5) * 24;
    }
    const dustGeo = new BufferGeometry();
    dustGeo.setAttribute('position', new BufferAttribute(dustCoords, 3));
    const dustMat = new PointsMaterial({
      color: CYAN,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: AdditiveBlending,
    });
    const dustPoints = new Points(dustGeo, dustMat);
    mainGroup.add(dustPoints);

    /* ─── Mouse & Scroll Tracking State ─── */
    const mouse = new Vector2(0, 0);
    const targetMouse = new Vector2(0, 0);
    const cursor3D = new Vector3(0, 0, 0);

    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let targetScrollVelocity = 0;

    const onMouseMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress = totalScroll > 0 ? currentScrollY / totalScroll : 0;

      // Smooth opacity fade: 0 at top (hero), 1 by the time user enters page 2 (about 0.6 * window.innerHeight)
      const vh = window.innerHeight || 800;
      const fadeProgress = Math.min(1, Math.max(0, (currentScrollY - vh * 0.25) / (vh * 0.5)));
      if (containerRef.current) {
        containerRef.current.style.opacity = fadeProgress.toFixed(3);
      }

      // Calculate directional scroll velocity (negative = scrolling up, positive = scrolling down)
      const delta = currentScrollY - lastScrollY;
      targetScrollVelocity = Math.max(-25, Math.min(25, delta));
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ─── Responsive Resize ─── */
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize, { passive: true });
    onResize();

    /* ─── Animation Loop ─── */
    let rafId = 0;
    let clock = 0;

    const vColorViolet = new Color(VIOLET);
    const vColorCyan   = new Color(CYAN);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      clock += 0.015;

      // Smooth mouse lerping
      mouse.x += (targetMouse.x - mouse.x) * 0.06;
      mouse.y += (targetMouse.y - mouse.y) * 0.06;

      // Smooth scroll lerping (bidirectional)
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.1;
      targetScrollVelocity *= 0.88; // decay velocity

      // Compute 3D cursor position in world space
      cursor3D.set(mouse.x * 10, mouse.y * 6.5, 0);

      // Camera motion: traverses 3D neural space as user scrolls up/down
      const camZ = 14 - scrollProgress * 12;
      const camX = Math.sin(scrollProgress * Math.PI * 2) * 2.8 + mouse.x * 1.5;
      const camY = Math.cos(scrollProgress * Math.PI * 2) * 1.8 + mouse.y * 1.2 - (scrollVelocity * 0.04);
      camera.position.set(camX, camY, camZ);
      camera.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.12 - (mouse.x * 0.04);
      camera.rotation.x = -scrollVelocity * 0.003;

      // Relic rotation
      knotMesh.rotation.x = clock * 0.4 + mouse.y * 0.6;
      knotMesh.rotation.y = clock * 0.5 + mouse.x * 0.6;
      icoMesh.rotation.x = -clock * 0.35 + mouse.y * 0.5;
      icoMesh.rotation.y = clock * 0.4 - mouse.x * 0.5;
      octMesh.rotation.y = clock * 0.45;
      octMesh.rotation.z = clock * 0.3;
      ring1.rotation.z = clock * 0.3;
      ring2.rotation.z = -clock * 0.25;

      // Update neural node positions and mouse spring physics
      for (let i = 0; i < NODE_COUNT; i++) {
        const p = nodePositions[i];
        const v = nodeVelocities[i];

        // Ambient gentle drift
        p.add(v);

        // Boundary bounce
        if (p.x < -13 || p.x > 13) v.x *= -1;
        if (p.y < -10 || p.y > 10) v.y *= -1;
        if (p.z < -9  || p.z > 9)  v.z *= -1;

        // Interactive mouse gravity pull
        const distToCursor = p.distanceTo(cursor3D);
        if (distToCursor < CURSOR_CONNECT_DIST) {
          const pullForce = (CURSOR_CONNECT_DIST - distToCursor) * 0.0025;
          p.x += (cursor3D.x - p.x) * pullForce;
          p.y += (cursor3D.y - p.y) * pullForce;
        }

        // Harmonic breath
        const curX = p.x + Math.sin(clock * 0.6 + i) * 0.18;
        const curY = p.y + Math.cos(clock * 0.7 + i * 1.3) * 0.18;
        const curZ = p.z + Math.sin(clock * 0.5 + i * 0.7) * 0.18;

        nodeMeshes[i].position.set(curX, curY, curZ);
      }

      // Re-calculate dynamic synaptic connections
      let lineIndex = 0;
      const posAttr = lineGeo.attributes.position;
      const colAttr = lineGeo.attributes.color;

      // 1. Connect nearby nodes to each other
      for (let i = 0; i < NODE_COUNT; i++) {
        const posA = nodeMeshes[i].position;

        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (lineIndex >= MAX_LINES - 4) break;

          const posB = nodeMeshes[j].position;
          const dist = posA.distanceTo(posB);

          if (dist < CONNECT_DIST) {
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

        // 2. Connect nearby nodes to the 3D mouse cursor
        const distCursor = posA.distanceTo(cursor3D);
        if (distCursor < CURSOR_CONNECT_DIST && lineIndex < MAX_LINES) {
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
      mainGroup.rotation.y = Math.sin(clock * 0.1) * 0.08 + mouse.x * 0.12;
      mainGroup.rotation.x = Math.cos(clock * 0.12) * 0.05 - mouse.y * 0.08;

      try {
        renderer.render(scene, camera);
      } catch {}
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
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
        transition: 'opacity 0.35s ease-out',
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
