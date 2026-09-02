"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RESUME_PDF } from "@/lib/utils/constants";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
            3D Artist &amp;
            <br />
            <span className="text-[var(--accent-cyan)]">AI Creative Director</span>
          </h2>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: looping visual */}
          <div className="about-left lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-elevated border border-white/10">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/about/loop1.webp"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/videos/about/loop1.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-5 font-body text-[10px] tracking-[0.25em] uppercase text-white/70">
                Loop 01 &middot; Motion Study
              </p>
            </div>
          </div>

          {/* Right: Bio */}
          <div className="about-right">
            <p className="font-body text-lg md:text-xl text-white leading-relaxed mb-6">
              I build visual experiences at the intersection of 3D, motion, design, and Generative
              AI.
            </p>
            <p className="font-body text-base md:text-lg text-text-secondary leading-relaxed mb-5">
              My work ranges from cinematic 3D animation and product visualization to experimental
              AI films, motion graphics, environments, and visual concepts. I&apos;m interested in
              the entire creative process — from developing an idea and defining its visual
              language to building, animating, directing, and finishing the final piece.
            </p>
            <p className="font-body text-base md:text-lg text-text-secondary leading-relaxed mb-5">
              With a background in professional GenAI and 3D production, I bring a
              production-driven approach to creative experimentation. Today, I combine traditional
              3D workflows with emerging AI tools to explore faster, stranger, and more expressive
              ways of storytelling.
            </p>
            <p className="font-body text-base md:text-lg text-text-secondary leading-relaxed mb-5">
              For me, AI isn&apos;t a replacement for craft. It&apos;s another creative instrument.
            </p>
            <p className="font-body text-base md:text-lg text-text-secondary leading-relaxed mb-8">
              I&apos;m constantly experimenting with new tools, techniques, and visual languages —
              pushing ideas beyond what a single medium can do.
            </p>

            <p className="font-display text-xl md:text-2xl font-bold italic text-white mb-10">
              Create. Direct. Experiment. Evolve.
            </p>

            {/* CTA */}
            <a
              href={RESUME_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-body text-sm px-6 py-3 border border-[var(--accent-cyan)]/30 rounded-full text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 transition-all duration-300 tracking-wider uppercase"
            >
              View Resume
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
