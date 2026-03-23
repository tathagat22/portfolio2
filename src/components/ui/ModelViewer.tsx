"use client";

import { useEffect, useRef } from "react";

export default function ModelViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    let cleanup: (() => void) | null = null;

    async function init() {
      const THREE = await import("three");
      const canvas = canvasRef.current;
      if (!canvas) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Torus knot
      const geometry = new THREE.TorusKnotGeometry(1, 0.35, 128, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        roughness: 0.15,
        metalness: 0.9,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambient);
      const directional = new THREE.DirectionalLight(0xffffff, 1);
      directional.position.set(5, 5, 5);
      scene.add(directional);
      const point = new THREE.PointLight(0x00f0ff, 0.5);
      point.position.set(-5, -5, -5);
      scene.add(point);

      let animId: number;
      function animate() {
        animId = requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();

      const onResize = () => {
        if (!canvas.parentElement) return;
        const w = canvas.parentElement.clientWidth;
        const h = canvas.parentElement.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    }

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-elevated relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-[var(--accent-cyan)]/10 blur-[80px]" />
      </div>
      <canvas ref={canvasRef} className="w-full h-full rounded-2xl" />
      <div className="absolute bottom-4 left-4 font-body text-xs text-text-tertiary tracking-wider uppercase">
        Interactive 3D Preview
      </div>
    </div>
  );
}
