"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCE_DATA } from "@/lib/utils/constants";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading
      gsap.from(".exp-heading", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Horizontal scroll only on desktop
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        if (!track) return;

        const scrollWidth = track.scrollWidth - window.innerWidth + 200;

        gsap.to(track, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            end: () => `+=${scrollWidth}`,
            invalidateOnRefresh: true,
          },
        });

        // Timeline line draws
        gsap.from(".timeline-line", {
          scaleX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: 1,
            start: "top top",
            end: () => `+=${scrollWidth}`,
          },
        });
      });

      // Mobile: stagger in vertically
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".exp-card", {
          y: 60,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".exp-cards-mobile",
            start: "top 75%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      data-theme="work"
      className="relative py-24 md:py-40 overflow-hidden"
    >
      {/* Section Header */}
      <div className="exp-heading px-6 md:px-12 mb-16 lg:mb-24">
        <p className="font-body text-sm text-text-secondary tracking-[0.3em] uppercase mb-3">
          Journey
        </p>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white">
          EXPERIENCE
        </h2>
      </div>

      {/* Desktop: Horizontal Scroll Track */}
      <div className="hidden lg:block">
        <div ref={trackRef} className="flex items-start gap-0 pl-12 relative">
          {/* Timeline Line */}
          <div className="timeline-line absolute top-[52px] left-0 right-0 h-[1px] bg-white/20 origin-left" />

          {EXPERIENCE_DATA.map((exp, i) => (
            <div
              key={exp.company}
              className="flex-shrink-0 w-[500px] relative pt-20 px-8"
            >
              {/* Timeline Dot */}
              <div className="absolute top-[44px] left-8 w-4 h-4 rounded-full border-2 border-[var(--section-accent)] bg-[#0a0a0a] z-10" />

              {/* Period */}
              <p className="font-body text-sm text-[var(--section-accent)] tracking-wider mb-2">
                {exp.period}
              </p>

              {/* Company */}
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                {exp.company}
              </h3>

              {/* Role */}
              <p className="font-body text-base text-text-secondary mb-4 italic">
                {exp.role}
              </p>

              {/* Description */}
              <p className="font-body text-sm text-text-secondary leading-relaxed max-w-sm">
                {exp.description}
              </p>

              {/* Number */}
              <span className="absolute top-16 right-8 font-display text-8xl font-bold text-white/[0.03]">
                0{i + 1}
              </span>
            </div>
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-[200px]" />
        </div>
      </div>

      {/* Mobile: Vertical Stack */}
      <div className="lg:hidden px-6 exp-cards-mobile">
        <div className="relative pl-8 border-l border-white/20">
          {EXPERIENCE_DATA.map((exp) => (
            <div key={exp.company} className="exp-card relative pb-12 last:pb-0">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-[var(--section-accent)] bg-[#0a0a0a]" />

              <p className="font-body text-sm text-[var(--section-accent)] tracking-wider mb-1">
                {exp.period}
              </p>
              <h3 className="font-display text-xl font-bold text-white mb-1">
                {exp.company}
              </h3>
              <p className="font-body text-sm text-text-secondary mb-3 italic">
                {exp.role}
              </p>
              <p className="font-body text-sm text-text-secondary leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
