"use client";

import { useEffect, useRef } from "react";

export default function ScrollVine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | null = null;

    async function init() {
      const THREE = await import("three");
      if (!canvas) return;

      // Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.z = 6;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      // Materials
      const cyanMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const purpleMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const amberMat = new THREE.MeshStandardMaterial({
        color: 0xf0a500,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const solidCyan = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.15,
        roughness: 0.2,
        metalness: 0.8,
      });

      // Geometries
      const torusGeo = new THREE.TorusGeometry(0.8, 0.3, 16, 40);
      const icoGeo = new THREE.IcosahedronGeometry(0.6, 0);
      const octGeo = new THREE.OctahedronGeometry(0.5, 0);
      const sphereGeo = new THREE.SphereGeometry(0.4, 12, 12);
      const torusKnotGeo = new THREE.TorusKnotGeometry(0.5, 0.15, 64, 16);

      // Meshes
      const torus = new THREE.Mesh(torusGeo, cyanMat);
      torus.position.set(0, 3, 0);

      const ico = new THREE.Mesh(icoGeo, purpleMat);
      ico.position.set(0.5, 1, -1);

      const oct = new THREE.Mesh(octGeo, amberMat);
      oct.position.set(-0.3, -1, 0);

      const sphere = new THREE.Mesh(sphereGeo, solidCyan);
      sphere.position.set(0.2, -3, -0.5);

      const knot = new THREE.Mesh(torusKnotGeo, purpleMat);
      knot.position.set(-0.2, -5, 0);

      scene.add(torus, ico, oct, sphere, knot);

      // Particles
      const particleCount = 80;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.03,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambient);
      const pointLight = new THREE.PointLight(0x00f0ff, 1, 20);
      pointLight.position.set(2, 2, 4);
      scene.add(pointLight);
      const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.5, 20);
      pointLight2.position.set(-2, -2, 3);
      scene.add(pointLight2);

      // Scroll state
      let scrollProgress = 0;
      const onScroll = () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = Math.min(window.scrollY / docHeight, 1);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      // Mouse interaction
      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      // Resize
      const onResize = () => {
        if (!canvas.parentElement) return;
        const w = canvas.parentElement.clientWidth;
        const h = canvas.parentElement.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      // Animate
      const clock = new THREE.Clock();
      let animId: number;

      function animate() {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Scroll drives the camera Y position (travels down through the scene)
        camera.position.y = 4 - scrollProgress * 10;
        camera.position.x = Math.sin(scrollProgress * Math.PI * 2) * 0.3 + mouseX * 0.3;
        camera.lookAt(0, camera.position.y - 1, 0);

        // Rotate shapes
        torus.rotation.x = t * 0.3 + scrollProgress * Math.PI;
        torus.rotation.y = t * 0.5;
        torus.scale.setScalar(1 + Math.sin(scrollProgress * Math.PI) * 0.3);

        ico.rotation.x = t * 0.4;
        ico.rotation.z = t * 0.2 + scrollProgress * 2;
        ico.position.x = 0.5 + Math.sin(t * 0.5) * 0.3;

        oct.rotation.y = t * 0.6;
        oct.rotation.x = scrollProgress * Math.PI * 2;
        oct.position.x = -0.3 + Math.cos(t * 0.3) * 0.2;

        sphere.rotation.y = t * 0.3;
        sphere.scale.setScalar(0.8 + scrollProgress * 0.5);

        knot.rotation.x = t * 0.2;
        knot.rotation.y = t * 0.3 + scrollProgress * 3;

        // Particles float
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const posAttr = particleGeo.getAttribute("position") as any;
        for (let i = 0; i < particleCount; i++) {
          const baseY = positions[i * 3 + 1];
          posAttr.setY(i, baseY + Math.sin(t * 0.5 + i) * 0.2);
          posAttr.setX(i, positions[i * 3] + Math.sin(t * 0.3 + i * 0.5) * 0.1);
        }
        posAttr.needsUpdate = true;

        // Lights follow scroll
        pointLight.position.y = camera.position.y + 2;
        pointLight2.position.y = camera.position.y - 2;

        // Subtle mouse parallax on camera
        camera.position.z = 6 + mouseY * 0.2;

        renderer.render(scene, camera);
      }
      animate();

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        [torusGeo, icoGeo, octGeo, sphereGeo, torusKnotGeo, particleGeo].forEach((g) => g.dispose());
        [cyanMat, purpleMat, amberMat, solidCyan, particleMat].forEach((m) => m.dispose());
      };
    }

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 h-screen z-[50] pointer-events-none hidden lg:block" style={{ width: "200px" }}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ opacity: 0.7 }} />
    </div>
  );
}
