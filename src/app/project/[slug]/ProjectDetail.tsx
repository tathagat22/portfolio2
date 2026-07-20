"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PROJECTS_DATA } from "@/lib/utils/constants";

gsap.registerPlugin(ScrollTrigger);

type Project = (typeof PROJECTS_DATA)[number];

export default function ProjectDetail({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryImages = project.gallery.slice(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax hero
      gsap.to(".project-hero-img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-body text-sm text-text-secondary hover:text-white transition-colors bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3m0 0l4-4M3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>
      </div>

      {/* Hero Image */}
      <div ref={heroRef} className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <div className="project-hero-img absolute inset-0 scale-110">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 -mt-32 px-6 md:px-12 max-w-4xl mx-auto pb-24">
        {/* Category */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block font-body text-xs tracking-[0.3em] uppercase text-[var(--accent-amber)] mb-4"
        >
          {project.category}
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
        >
          {project.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-body text-lg md:text-xl text-text-secondary leading-relaxed mb-12"
        >
          {project.description}
        </motion.p>

        {/* Tools Used */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="font-body text-xs text-text-tertiary tracking-[0.3em] uppercase mb-4">
            Tools Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="font-body text-sm px-4 py-2 bg-white/5 border border-white/10 rounded-full text-text-secondary"
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Project Video */}
        {"video" in project && project.video && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative w-full aspect-video bg-elevated rounded-xl overflow-hidden mb-12 border border-white/5"
          >
            <video
              controls
              loop
              muted
              playsInline
              poster={project.thumbnail}
              className="w-full h-full object-cover"
            >
              <source src={project.video} type="video/mp4" />
            </video>
          </motion.div>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <h3 className="font-body text-xs text-text-tertiary tracking-[0.3em] uppercase mb-4">
              Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {galleryImages.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5 group"
                >
                  <Image
                    src={src}
                    alt={`${project.title} — angle ${i + 2}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
