"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger);

const ModelViewer = dynamic(() => import("@/components/ui/ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-elevated rounded-2xl">
      <div className="w-8 h-8 border-2 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const stats = [
  { value: "4+", label: "Years Experience" },
  { value: "50+", label: "Projects Completed" },
  { value: "3", label: "Studios Worked" },
  { value: "10+", label: "Tools Mastered" },
];


export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left side slides in
      gsap.from(".about-left", {
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });

      // Right side slides in
      gsap.from(".about-right", {
        x: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });

      // Stats count up
      gsap.from(".stat-item", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 80%",
        },
      });

      // Floating tags removed - were decorative but looked distracting
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-40 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="mb-16">
          <p className="font-body text-sm text-text-secondary tracking-[0.3em] uppercase mb-3">
            About
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white">
            Crafting Digital
            <br />
            <span className="text-[var(--accent-cyan)]">Realities</span>
          </h2>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: 3D Viewer */}
          <div className="about-left aspect-square max-h-[500px] w-full">
            <ModelViewer />
          </div>

          {/* Right: Bio */}
          <div className="about-right">
            <p className="font-body text-lg md:text-xl text-text-secondary leading-relaxed mb-6">
              A passionate and detail-oriented <span className="text-white">3D Animator</span> with
              expertise in Autodesk Maya, Blender 3D, and Unreal Engine. With experience spanning{" "}
              <span className="text-white">cloth simulation, grooming, and product animations</span>,
              I bring creative visions to life through immersive visual storytelling.
            </p>
            <p className="font-body text-lg md:text-xl text-text-secondary leading-relaxed mb-8">
              From working at <span className="text-white">Technicolor Creative Studio</span> on VFX
              productions to crafting product visualizations at{" "}
              <span className="text-white">Forus Electric</span>, I bridge the gap between artistic
              vision and technical execution.
            </p>

            {/* CTA */}
            <a
              href="/Kautilya_Resume___2026.pdf"
              target="_blank"
              className="inline-flex items-center gap-3 font-body text-sm px-6 py-3 border border-[var(--accent-cyan)]/30 rounded-full text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 transition-all duration-300 tracking-wider uppercase"
            >
              Download Resume
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v9m0 0l-3-3m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-16 border-t border-white/10">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item text-center md:text-left">
              <p className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </p>
              <p className="font-body text-sm text-text-secondary tracking-wider uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
