"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  slug: string;
  category: string;
  description: string;
  thumbnail: string;
  featured: boolean;
}

export default function ProjectDetail({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement>(null);

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
            {["Autodesk Maya", "Substance Painter", "Adobe Photoshop"].map((tool) => (
              <span
                key={tool}
                className="font-body text-sm px-4 py-2 bg-white/5 border border-white/10 rounded-full text-text-secondary"
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative w-full aspect-video bg-elevated rounded-xl overflow-hidden mb-12 border border-white/5"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white/50 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="font-body text-sm text-text-tertiary tracking-wider">
              Project Video Placeholder
            </p>
          </div>
        </motion.div>

        {/* 3D Viewer Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative w-full aspect-square max-h-[500px] bg-elevated rounded-xl overflow-hidden border border-white/5"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <p className="font-body text-sm text-text-tertiary tracking-wider">
              Interactive 3D Model Placeholder
            </p>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
