"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_IMAGES, GALLERY_CATEGORIES, type GalleryImage } from "@/lib/utils/constants";

gsap.registerPlugin(ScrollTrigger);

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function CategoryDropdown({
  active,
  counts,
  onSelect,
}: {
  active: string;
  counts: Record<string, number>;
  onSelect: (category: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative w-full sm:w-[22rem]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="group relative w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-white/12 bg-white/[0.03] backdrop-blur-xl text-left transition-colors duration-300 hover:border-[var(--accent-amber)]/40"
      >
        <span className="flex flex-col gap-1 min-w-0">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-text-tertiary">
            Filter
          </span>
          <span className="font-display text-lg font-bold text-white truncate">
            {active}
          </span>
        </span>

        <span className="flex items-center gap-3 shrink-0">
          <span className="font-body text-xs tabular-nums text-[var(--accent-amber)]">
            {String(counts[active] ?? 0).padStart(2, "0")}
          </span>
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="text-white/60 group-hover:text-white"
          >
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </span>

        <span className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-amber)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/12 bg-[#0d0d0d]/95 backdrop-blur-2xl shadow-2xl shadow-black/60"
          >
            {GALLERY_CATEGORIES.map((cat, i) => {
              const isActive = cat === active;
              return (
                <motion.li
                  key={cat}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.25, ease: EASE_OUT }}
                  role="option"
                  aria-selected={isActive}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(cat);
                      setOpen(false);
                    }}
                    className="group/item relative w-full flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-white/[0.05]"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-[var(--accent-amber)] scale-100"
                            : "bg-white/25 scale-75 group-hover/item:bg-white/60"
                        }`}
                      />
                      <span
                        className={`font-body text-sm truncate transition-colors duration-200 ${
                          isActive ? "text-white" : "text-text-secondary group-hover/item:text-white"
                        }`}
                      >
                        {cat}
                      </span>
                    </span>
                    <span className="font-body text-[11px] tabular-nums text-text-tertiary shrink-0">
                      {counts[cat] ?? 0}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onStep,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const image = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    document.addEventListener("keydown", onKey);
    // The lightbox scrolls nothing; letting the page move behind it is jarring.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, onStep]);

  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-xl px-4 py-16 sm:p-16"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {[-1, 1].map((delta) => (
        <button
          key={delta}
          type="button"
          aria-label={delta === -1 ? "Previous image" : "Next image"}
          onClick={(e) => {
            e.stopPropagation();
            onStep(delta);
          }}
          className={`absolute top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[var(--accent-amber)]/60 hover:text-white ${
            delta === -1 ? "left-3 sm:left-6" : "right-3 sm:right-6"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: delta === -1 ? "rotate(180deg)" : undefined }}>
            <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}

      <motion.figure
        key={image.src}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full flex-col items-center gap-4"
      >
        <Image
          src={image.src}
          alt={`${image.title} — frame ${image.frame}`}
          width={image.width}
          height={image.height}
          className="max-h-[72vh] w-auto rounded-lg object-contain shadow-2xl shadow-black/80"
          sizes="90vw"
          priority
        />
        <figcaption className="flex flex-col items-center gap-2 text-center">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--accent-amber)]">
            {image.category}
          </p>
          <h3 className="font-display text-xl font-bold text-white">{image.title}</h3>
          <p className="font-body text-xs text-text-tertiary tabular-nums">
            Frame {image.frame} of {image.frames} &middot; {index + 1}/{images.length} in view
          </p>
          <Link
            href={`/project/${image.slug}`}
            className="mt-1 inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-white/80 border-b border-white/25 pb-1 transition-colors hover:text-[var(--accent-amber)] hover:border-[var(--accent-amber)]"
          >
            View project
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: GALLERY_IMAGES.length };
    for (const image of GALLERY_IMAGES) {
      result[image.category] = (result[image.category] ?? 0) + 1;
    }
    return result;
  }, []);

  const images = useMemo(
    () =>
      activeCategory === "All"
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter((image) => image.category === activeCategory),
    [activeCategory]
  );

  const step = useCallback(
    (delta: number) =>
      setLightboxIndex((current) =>
        current === null ? current : (current + delta + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-heading", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      gsap.from(".gallery-controls", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      data-theme="work"
      className="relative py-24 md:py-40 px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient wash so the wall sits on light rather than flat black */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-[var(--accent-amber)]/[0.06] blur-[160px]" />

      <div className="relative z-10 max-w-[110rem] mx-auto">
        <div className="gallery-heading mb-10 md:mb-14">
          <p className="font-body text-sm text-text-secondary tracking-[0.3em] uppercase mb-3">
            Stills
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white">
            THE
            <br />
            <span className="text-[var(--accent-amber)]">GALLERY</span>
          </h2>
        </div>

        {/* GSAP's from() leaves an inline transform here, which makes this a
            stacking context - without an explicit z-index above the wall, the
            open dropdown is painted behind the tiles. */}
        <div className="gallery-controls relative z-30 mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <CategoryDropdown active={activeCategory} counts={counts} onSelect={setActiveCategory} />

          <div className="flex items-baseline gap-3">
            <motion.span
              key={images.length}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="font-display text-5xl md:text-6xl font-bold leading-none text-white tabular-nums"
            >
              {String(images.length).padStart(2, "0")}
            </motion.span>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-text-tertiary">
              Frames
            </span>
          </div>
        </div>

        <div className="relative z-0 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-5 [column-fill:_balance]">
          <AnimatePresence mode="popLayout">
            {images.map((image, index) => (
              <motion.button
                type="button"
                key={image.src}
                layout
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.5,
                  ease: EASE_OUT,
                  delay: Math.min(index * 0.03, 0.4),
                }}
                onClick={() => setLightboxIndex(index)}
                style={{ aspectRatio: `${image.width} / ${image.height}` }}
                className="group relative mb-4 md:mb-5 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white/[0.03] shadow-lg shadow-black/30 transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/60"
              >
                <Image
                  src={image.src}
                  alt={`${image.title} — frame ${image.frame}`}
                  fill
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-body text-[9px] tracking-[0.25em] uppercase text-[var(--accent-amber)] mb-1">
                    {image.category}
                  </p>
                  <h3 className="font-display text-base font-bold text-white leading-tight text-left">
                    {image.title}
                  </h3>
                  {image.frames > 1 && (
                    <p className="font-body text-[10px] text-white/50 tabular-nums mt-0.5 text-left">
                      {image.frame} / {image.frames}
                    </p>
                  )}
                </div>

                {/* Corner rules that draw themselves in on hover */}
                <span className="pointer-events-none absolute top-0 right-0 h-[2px] w-14 origin-right scale-x-0 bg-[var(--accent-amber)] transition-transform duration-500 group-hover:scale-x-100" />
                <span className="pointer-events-none absolute top-0 right-0 h-14 w-[2px] origin-top scale-y-0 bg-[var(--accent-amber)] transition-transform delay-100 duration-500 group-hover:scale-y-100" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
