"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Project {
  title: string;
  slug: string;
  category: string;
  description: string;
  thumbnail: string;
  featured: boolean;
}

interface BentoCardProps {
  project: Project;
}

export default function BentoCard({ project }: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Link href={`/project/${project.slug}`}>
      <motion.div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-full rounded-xl overflow-hidden group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image */}
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />

        {/* Hover Glow */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 80%, var(--accent-amber) 0%, transparent 70%)",
            opacity: isHovered ? 0.1 : 0,
          }}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-10">
          {/* Category Tag */}
          <motion.span
            initial={false}
            animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.7 }}
            className="font-body text-[10px] md:text-xs tracking-[0.2em] uppercase text-[var(--accent-amber)] mb-2 block w-fit"
          >
            {project.category}
          </motion.span>

          {/* Title */}
          <motion.h3
            initial={false}
            animate={{ y: isHovered ? 0 : 5 }}
            transition={{ duration: 0.3 }}
            className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2"
          >
            {project.title}
          </motion.h3>

          {/* Description - shows on hover */}
          <motion.p
            initial={false}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="font-body text-sm text-text-secondary line-clamp-2 mb-3 max-w-md"
          >
            {project.description}
          </motion.p>

          {/* View Project CTA */}
          <motion.div
            initial={false}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <span className="font-body text-xs tracking-wider uppercase text-white">
              View Project
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
              <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* Corner accent line */}
        <motion.div
          className="absolute top-0 right-0 w-16 h-[2px] bg-[var(--accent-amber)]"
          initial={false}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          style={{ transformOrigin: "right" }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute top-0 right-0 w-[2px] h-16 bg-[var(--accent-amber)]"
          initial={false}
          animate={{ scaleY: isHovered ? 1 : 0 }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
      </motion.div>
    </Link>
  );
}
