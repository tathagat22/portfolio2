"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS_DATA, CATEGORIES } from "@/lib/utils/constants";
import BentoCard from "@/components/ui/BentoCard";

gsap.registerPlugin(ScrollTrigger);

export default function WorkGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredProjects =
    activeCategory === "All"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeCategory);

  const categoryCounts: Record<string, number> = { All: PROJECTS_DATA.length };
  for (const cat of CATEGORIES) if (cat !== "All") categoryCounts[cat] = 0;
  for (const p of PROJECTS_DATA) {
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-heading", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".work-filters", {
        y: 40,
        opacity: 0,
        duration: 0.8,
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
      id="work"
      data-theme="work"
      className="relative py-24 md:py-40 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="work-heading mb-16">
          <p className="font-body text-sm text-text-secondary tracking-[0.3em] uppercase mb-3">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white">
            SELECTED
            <br />
            <span className="text-[var(--accent-amber)]">WORK</span>
          </h2>
        </div>

        {/* Category Filters */}
        <div className="work-filters flex flex-wrap gap-2 md:gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative font-body text-xs md:text-sm tracking-wider uppercase px-4 md:px-6 py-2.5 rounded-full transition-colors duration-300"
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-[var(--accent-amber)] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  activeCategory === cat
                    ? "text-black font-medium"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                {cat} <span className="opacity-60">({categoryCounts[cat] ?? 0})</span>
              </span>
            </button>
          ))}
        </div>

        {/* Masonry — CSS columns keep every card at its own natural aspect ratio */}
        {filteredProjects.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-5 [column-fill:_balance]">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                    delay: Math.min(index * 0.04, 0.4),
                  }}
                  className="mb-4 md:mb-5 break-inside-avoid"
                >
                  <BentoCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="border border-dashed border-white/12 rounded-2xl py-20 px-8 text-center">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[var(--accent-amber)] mb-4">
              {activeCategory}
            </p>
            <p className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
              Coming soon
            </p>
            <p className="font-body text-sm text-text-secondary max-w-md mx-auto">
              Stills for this category are being finished now. The generative films are
              already running below.
            </p>
            <a
              href="#ai-films"
              className="mt-6 inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-[var(--accent-amber)] border-b border-[var(--accent-amber)]/40 pb-1 hover:border-[var(--accent-amber)] transition-colors"
            >
              View AI Films
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
