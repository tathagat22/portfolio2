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
  for (const p of PROJECTS_DATA) {
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading reveal
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

      // Filter tabs reveal
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

        {/* Uniform Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  opacity: { duration: 0.3 },
                  layout: { duration: 0.4, type: "spring", stiffness: 300, damping: 30 },
                  delay: index * 0.04,
                }}
                className="aspect-[4/5]"
              >
                <BentoCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
