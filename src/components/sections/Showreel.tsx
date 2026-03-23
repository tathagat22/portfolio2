"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clip-path reveal animation
      gsap.fromTo(
        videoContainerRef.current,
        {
          clipPath: "inset(25% 30% 25% 30% round 24px)",
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 10%",
            scrub: 1,
          },
        }
      );

      // Title animation
      gsap.from(".showreel-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showreel"
      className="relative py-20 md:py-32 px-4 md:px-12"
    >
      {/* Section Title */}
      <div className="showreel-title text-center mb-12">
        <p className="font-body text-sm text-text-secondary tracking-[0.3em] uppercase mb-3">
          Featured Reel
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
          Showreel 2026
        </h2>
      </div>

      {/* Video Container with clip-path reveal */}
      <div
        ref={videoContainerRef}
        className="relative w-full max-w-6xl mx-auto aspect-video bg-elevated rounded-lg overflow-hidden group"
        style={{ clipPath: "inset(25% 30% 25% 30% round 24px)" }}
      >
        {/* Placeholder poster */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#1a1a2e] to-[#0a0a0a]">
          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Placeholder text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-body text-text-tertiary text-sm tracking-widest uppercase">
              Video Showreel Placeholder
            </p>
          </div>
        </div>

        {/* Play Button Overlay */}
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 z-10 flex items-center justify-center group/play"
            aria-label="Play showreel"
          >
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-white/30 flex items-center justify-center group-hover/play:border-[var(--accent-cyan)] group-hover/play:scale-110 transition-all duration-500 backdrop-blur-sm bg-white/5">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 text-white ml-1 group-hover/play:text-[var(--accent-cyan)] transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
