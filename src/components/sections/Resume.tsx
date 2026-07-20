"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export default function Resume() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".resume-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });

      gsap.from(".resume-card", {
        y: 80,
        opacity: 0,
        scale: 0.96,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="resume"
      data-theme="resume"
      className="relative py-24 md:py-40 px-6 md:px-12 overflow-hidden"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[var(--section-accent)]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="resume-heading text-center mb-16">
          <p className="font-body text-sm text-text-secondary tracking-[0.3em] uppercase mb-3">
            Curriculum Vitae
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white">
            My <span className="text-[var(--section-accent)]">Resume</span>
          </h2>
        </div>

        <div className="resume-card glass-card grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-14 items-center">
          {/* Animated preview */}
          <div
            className="relative aspect-[3/4] w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-white/10 transition-transform duration-500 hover:scale-[1.03]"
            style={{ animation: "float-y 5s ease-in-out infinite" }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              style={{ filter: "grayscale(0.3) hue-rotate(267deg)" }}
            >
              <source src="/videos/resume/loop.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-[var(--section-accent)]/70">
                <path
                  d="M6 2h9l5 5v15H6V2z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Copy + actions */}
          <div className="flex flex-col gap-6">
            <p className="font-body text-text-secondary leading-relaxed">
              A complete overview of my experience, tools, and shipped work as a 3D Artist and
              Motion Designer &mdash; download the full PDF or view it inline.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                href="/Kautilya_Resume___2026.pdf"
                download
                variant="primary"
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 2v9m0 0l-3-3m3 3l3-3M3 13h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                Download
              </Button>
              <Button href="/Kautilya_Resume___2026.pdf" target="_blank" rel="noopener noreferrer" variant="outline">
                View Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
