"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { IconType } from "react-icons";
import { SiAutodeskmaya, SiBlender, SiUnrealengine, SiAutocad } from "react-icons/si";
import { SKILLS_DATA, SKILL_CATEGORIES } from "@/lib/utils/constants";

gsap.registerPlugin(ScrollTrigger);

// Real brand icons where one reliably exists; everything else falls back to a
// styled monogram so the grid still reads as one consistent icon language.
const SKILL_ICONS: Record<string, IconType> = {
  maya: SiAutodeskmaya,
  blender: SiBlender,
  unreal: SiUnrealengine,
  autocad: SiAutocad,
};

const SKILL_MONOGRAMS: Record<string, string> = {
  "substance-painter": "SP",
  "after-effects": "AE",
  premiere: "PR",
  photoshop: "PS",
  illustrator: "AI",
  chatgpt: "GPT",
  midjourney: "MJ",
  runway: "RW",
  kling: "KL",
  pika: "PK",
  veo: "VO",
  firefly: "FF",
};

const RING_SIZE = 64;
const RING_STROKE = 3;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function SkillRing({ proficiency }: { proficiency: number }) {
  const offset = RING_CIRCUMFERENCE * (1 - proficiency / 5);
  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      className="absolute inset-0 -rotate-90"
    >
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={RING_STROKE}
      />
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke="var(--section-accent)"
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skills-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });

      gsap.from(".skill-card", {
        y: 40,
        opacity: 0,
        stagger: 0.04,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" data-theme="skills" className="relative py-24 md:py-40 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="skills-heading mb-20">
          <p className="font-body text-sm text-text-secondary tracking-[0.3em] uppercase mb-3">Toolkit</p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Skills &amp;
            <br />
            <span className="text-[var(--section-accent)]">Tools</span>
          </h2>
        </div>

        <div className="flex flex-col gap-16">
          {SKILL_CATEGORIES.map((category) => {
            const skillsInCategory = SKILLS_DATA.filter((s) => s.category === category);
            return (
              <div key={category}>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="font-body text-[11px] text-text-tertiary tracking-[0.3em] uppercase whitespace-nowrap">
                    {category}
                  </h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {skillsInCategory.map((skill, i) => {
                    const Icon = SKILL_ICONS[skill.icon];
                    const monogram = SKILL_MONOGRAMS[skill.icon] ?? skill.name.charAt(0);

                    return (
                      <div
                        key={skill.name}
                        className="skill-card group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[var(--section-accent)]/30 hover:bg-[var(--section-accent)]/[0.06] hover:shadow-[0_20px_40px_rgba(255,255,255,0.06)]"
                      >
                        <div
                          className="relative mb-4"
                          style={{ width: RING_SIZE, height: RING_SIZE, animation: `float-y 4s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
                        >
                          <SkillRing proficiency={skill.proficiency} />
                          <div className="absolute inset-[10px] rounded-full bg-white/5 flex items-center justify-center transition-colors duration-400 group-hover:bg-[var(--section-accent)]/15">
                            {Icon ? (
                              <Icon className="w-5 h-5 text-white/50 transition-colors duration-400 group-hover:text-[var(--section-accent)]" />
                            ) : (
                              <span className="font-display text-[11px] font-bold text-white/50 transition-colors duration-400 group-hover:text-[var(--section-accent)]">
                                {monogram}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="font-body text-sm text-white font-medium mb-3 leading-snug">
                          {skill.name}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="font-body text-[10px] text-text-tertiary uppercase tracking-[0.1em]">
                            Proficiency
                          </span>
                          <span className="font-body text-[10px] font-medium text-text-secondary transition-colors duration-400 group-hover:text-[var(--section-accent)]">
                            {skill.proficiency}/5
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
