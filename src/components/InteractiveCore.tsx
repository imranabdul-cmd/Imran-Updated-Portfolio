import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* Subtle ambient particle system — stays fixed in bg, does not block content */
export const InteractiveCore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 28;

    /* Particle cloud — subtle dots only */
    const count  = 800;
    const geo    = new THREE.BufferGeometry();
    const pos    = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 14 + Math.random() * 18;
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.acos(2 * Math.random() - 1);
      pos[i*3]   = r * Math.sin(φ) * Math.cos(θ);
      pos[i*3+1] = r * Math.sin(φ) * Math.sin(θ);
      pos[i*3+2] = r * Math.cos(φ);

      /* Alternate cyan / purple tones */
      const t = Math.random();
      colors[i*3]   = t < 0.5 ? 0.02 : 0.42;
      colors[i*3+1] = t < 0.5 ? 0.45 : 0.21;
      colors[i*3+2] = t < 0.5 ? 0.52 : 0.62;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* Subtle rotation */
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      points.rotation.y += 0.0008;
      points.rotation.x += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    /* Resize */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,          /* behind all content, in front of body bg */
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  );
};
