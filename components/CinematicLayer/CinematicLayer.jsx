'use client';

import { memo, useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import styles from './CinematicLayer.module.css';

/**
 * Floating bokeh / ember layer.
 * All motion (sine drift, slow rise, twinkle) is computed in the vertex shader,
 * so the CPU only updates one time uniform and the camera per frame.
 */

const HEIGHT = 14; // vertical wrap range of the particle field

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPx;
  attribute float aSize;
  attribute float aSeed;
  attribute float aSoft;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSoft;

  void main() {
    vec3 p = position;
    float t = uTime;

    // slow sine-wave drift
    p.x += sin(t * 0.18 + aSeed * 6.2831) * 0.55 + sin(t * 0.07 + aSeed * 31.0) * 0.25;
    p.z += sin(t * 0.11 + aSeed * 19.0) * 0.40;

    // gentle upward rise, wrapped
    float rise = t * (0.035 + aSeed * 0.05);
    p.y = mod(p.y + rise + ${(HEIGHT / 2).toFixed(1)}, ${HEIGHT.toFixed(1)}) - ${(HEIGHT / 2).toFixed(1)};
    p.y += sin(t * 0.25 + aSeed * 12.0) * 0.18;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    float twinkle = 0.7 + 0.3 * sin(t * 0.5 + aSeed * 40.0);
    float edge = 1.0 - smoothstep(${(HEIGHT * 0.32).toFixed(2)}, ${(HEIGHT * 0.5).toFixed(2)}, abs(p.y));

    vAlpha = twinkle * edge;
    vColor = aColor;
    vSoft = aSoft;

    gl_PointSize = min(aSize * uPx * (6.0 / -mv.z), 220.0 * uPx);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSoft;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;

    // dreamy soft disc, with a faint lens-bokeh rim on the sharper ones
    float core = smoothstep(1.0, mix(0.55, 0.0, vSoft), d) * 0.5;
    float rim = smoothstep(0.14, 0.0, abs(d - 0.86)) * 0.3 * (1.0 - vSoft);
    float a = (core + rim) * vAlpha * uOpacity;

    gl_FragColor = vec4(vColor, a);
  }
`;

// violet, cyan, near-white
const PALETTE = [
  [0.608, 0.482, 1.0],   // #9B7BFF violet
  [0.333, 0.902, 1.0],   // #55E6FF cyan
  [0.956, 0.953, 0.980], // #F4F3FA near-white
];

function CinematicLayer({ activeRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 820;

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
    } catch {
      return undefined; // no WebGL: hero still works without the layer
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.0 : 1.25));

    const scene = new Scene();
    const camera = new PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.set(0, 0, 6);

    // ---- particle data (built once) ----
    const count = mobile ? 45 : 100;
    const position = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);
    const soft = new Float32Array(count);
    const color = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      position[i * 3] = (Math.random() - 0.5) * 18;
      position[i * 3 + 1] = (Math.random() - 0.5) * HEIGHT;
      position[i * 3 + 2] = -7 + Math.random() * 10;

      const big = Math.pow(Math.random(), 3); // many small, few big bokeh discs
      size[i] = 8 + big * 80;
      soft[i] = size[i] > 40 ? 0.9 : 0.35 + Math.random() * 0.3;
      seed[i] = Math.random();

      const r = Math.random();
      const c = r < 0.55 ? PALETTE[0] : r < 0.8 ? PALETTE[1] : PALETTE[2];
      color.set(c, i * 3);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(position, 3));
    geometry.setAttribute('aSize', new BufferAttribute(size, 1));
    geometry.setAttribute('aSeed', new BufferAttribute(seed, 1));
    geometry.setAttribute('aSoft', new BufferAttribute(soft, 1));
    geometry.setAttribute('aColor', new BufferAttribute(color, 3));

    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uPx: { value: renderer.getPixelRatio() },
        uOpacity: { value: 0.72 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    const points = new Points(geometry, material);
    points.frustumCulled = false; // positions are animated in the shader
    scene.add(points);

    // ---- sizing ----
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ---- mouse parallax ----
    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduceMotion) window.addEventListener('pointermove', onMove, { passive: true });

    // ---- loop ----
    let raf = 0;
    let last = performance.now();
    let time = 12; // start mid-drift so the field never looks "just spawned"

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (document.hidden || (activeRef && activeRef.current === false)) return;

      time += dt;
      material.uniforms.uTime.value = time;

      const k = 1 - Math.exp(-dt * 2.5); // frame-rate independent easing
      camera.position.x += (target.x * 0.8 - camera.position.x) * k;
      camera.position.y += (-target.y * 0.45 - camera.position.y) * k;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    if (reduceMotion) {
      material.uniforms.uTime.value = time;
      renderer.render(scene, camera); // single still frame
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [activeRef]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}

export default memo(CinematicLayer);
