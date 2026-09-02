"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AI_FILMS, AI_TOOLS_TICKER } from "@/lib/utils/constants";

type Film = (typeof AI_FILMS)[number];

/* The wall is one screen, tiled edge to edge. Placement is explicit so the
   mosaic never leaves a hole: 4x6 on phones, 8x4 from md up. Class strings are
   written out in full because Tailwind only sees literals. */
type Tile = { film: Film["id"]; cls: string };

const TILES: Tile[] = [
  {
    film: "krishna",
    cls: "col-start-1 col-span-2 row-start-1 row-span-3 md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-4",
  },
  {
    film: "devi",
    cls: "col-start-3 col-span-2 row-start-1 row-span-2 md:col-start-3 md:col-span-4 md:row-start-1 md:row-span-2",
  },
  {
    film: "madman",
    cls: "col-start-3 col-span-2 row-start-3 row-span-2 md:col-start-7 md:col-span-1 md:row-start-1 md:row-span-2",
  },
  {
    film: "aispot",
    cls: "hidden md:block md:col-start-8 md:col-span-1 md:row-start-1 md:row-span-2",
  },
  {
    film: "robot",
    cls: "col-start-1 col-span-2 row-start-4 row-span-3 md:col-start-3 md:col-span-3 md:row-start-3 md:row-span-2",
  },
  {
    film: "aispot",
    cls: "col-start-3 col-span-2 row-start-5 row-span-2 md:col-start-6 md:col-span-1 md:row-start-3 md:row-span-2",
  },
  {
    film: "devi",
    cls: "hidden md:block md:col-start-7 md:col-span-2 md:row-start-3 md:row-span-2",
  },
];

function WallTile({
  film,
  cls,
  delay,
  onOpen,
  registerVideo,
}: {
  film: Film;
  cls: string;
  delay: string;
  onOpen: (film: Film) => void;
  registerVideo: (el: HTMLVideoElement | null) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(film)}
      aria-label={`Play ${film.title} — ${film.kind}`}
      className={`group/tile relative overflow-hidden bg-black outline-none transition-opacity duration-500 group-hover/wall:opacity-45 hover:!opacity-100 focus-visible:!opacity-100 ${cls}`}
    >
      <video
        ref={registerVideo}
        muted
        loop
        playsInline
        preload="none"
        poster={film.poster}
        style={{ animationDelay: delay }}
        className="tile-breathe absolute inset-0 h-full w-full object-cover brightness-[0.82] transition-[filter] duration-700 ease-out group-hover/tile:brightness-110 group-hover/tile:saturate-125"
      >
        <source src={film.src} type="video/mp4" />
      </video>

      {/* caption, revealed on the tile you are pointing at */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-4 pb-4 pt-14 text-left opacity-0 transition-all duration-500 group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
        <span className="block font-body text-[9px] uppercase tracking-[0.24em] text-[var(--section-accent)]">
          {film.kind}
        </span>
        <span className="mt-1 block font-display text-base font-bold leading-tight text-white md:text-xl">
          {film.title}
        </span>
      </span>

      <span className="pointer-events-none absolute inset-0 border border-[var(--section-accent)]/0 transition-colors duration-500 group-hover/tile:border-[var(--section-accent)]/70" />

      <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover/tile:opacity-100">
        <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" className="ml-0.5 text-white">
          <path d="M0 0v12l10-6z" />
        </svg>
      </span>
    </button>
  );
}

export default function AIFilmWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const videosRef = useRef<HTMLVideoElement[]>([]);
  const [active, setActive] = useState<Film | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const byId = useMemo(() => new Map(AI_FILMS.map((f) => [f.id, f])), []);

  const registerVideo = useCallback((el: HTMLVideoElement | null) => {
    if (el && !videosRef.current.includes(el)) videosRef.current.push(el);
  }, []);

  /* Seven simultaneous decodes is only reasonable while the wall is on screen —
     nothing downloads or plays until it is close. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        videosRef.current.forEach((video) => {
          // two panels are md-only; skip their decode entirely on phones
          const hidden = video.offsetParent === null;
          if (entry.isIntersecting && !hidden) {
            if (video.preload === "none") video.preload = "auto";
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // The lightbox is the only place these films are heard.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section
      ref={sectionRef}
      id="ai-films"
      data-theme="ai"
      className="relative z-[60] h-[100svh] min-h-[620px] w-full overflow-hidden bg-black"
    >
      {/* The wall */}
      <div className="group/wall absolute inset-0 grid grid-cols-4 grid-rows-6 gap-[3px] md:grid-cols-8 md:grid-rows-4">
        {TILES.map((tile, i) => {
          const film = byId.get(tile.film);
          if (!film) return null;
          return (
            <WallTile
              key={`${tile.film}-${i}`}
              film={film}
              cls={tile.cls}
              delay={`${i * -3.4}s`}
              onOpen={setActive}
              registerVideo={registerVideo}
            />
          );
        })}
      </div>

      {/* Edge vignette so the wall sinks into the page above and below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.25) 16%, transparent 34%, transparent 52%, rgba(10,10,10,0.55) 82%, rgba(10,10,10,0.96) 100%)",
        }}
      />

      {/* Title, floating over the wall */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between px-6 pb-16 pt-24 md:px-12 md:pb-20 md:pt-28">
        <p className="font-body text-[10px] uppercase tracking-[0.34em] text-white/70 md:text-xs">
          Generative &middot; Always running
        </p>

        <div className="relative max-w-4xl">
          <span
            aria-hidden="true"
            className="absolute -bottom-14 -left-[100vw] -top-10 right-[-6rem] -z-10 blur-xl"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 82%, rgba(0,0,0,0.65) 92%, transparent 100%)",
            }}
          />
          <h2 className="font-display text-5xl font-bold leading-[0.9] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] md:text-7xl lg:text-8xl">
            AI <span className="text-[var(--section-accent)]">FILMS</span>
          </h2>
          <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-white/75 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-base">
            Films built end to end with generative tools — direction, look, edit and
            finish. Tap any panel for sound.
          </p>
        </div>
      </div>

      {/* Tool ticker along the foot of the wall */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden pb-4 pt-3">
        <div
          className="wall-track-reverse flex w-max items-center gap-8 md:gap-12"
          style={{ ["--wall-duration" as string]: "42s" }}
        >
          {[...AI_TOOLS_TICKER, ...AI_TOOLS_TICKER, ...AI_TOOLS_TICKER, ...AI_TOOLS_TICKER].map(
            (tool, i) => (
              <span
                key={`${tool}-${i}`}
                className="flex shrink-0 items-center gap-8 font-body text-[10px] uppercase tracking-[0.28em] text-white/45 md:gap-12 md:text-xs"
              >
                {tool}
                <span className="h-1 w-1 rounded-full bg-[var(--section-accent)]/70" />
              </span>
            )
          )}
        </div>
      </div>

      {/* Lightbox — portalled so it escapes this section's stacking context */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActive(null)}
            data-theme="ai"
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-4 backdrop-blur-md md:p-12"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ aspectRatio: `${active.width} / ${active.height}` }}
              className="relative max-h-full w-auto max-w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/15"
            >
              <video
                key={active.id}
                autoPlay
                controls
                loop
                playsInline
                poster={active.poster}
                className="h-full w-full object-contain"
              >
                <source src={active.src} type="video/mp4" />
              </video>
            </motion.div>

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 md:p-8">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.28em] text-[var(--section-accent)]">
                  {active.kind}
                </p>
                <p className="mt-1 font-display text-xl font-bold text-white md:text-2xl">
                  {active.title}
                </p>
                <p className="mt-1 font-body text-xs text-text-secondary">{active.note}</p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white/40"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
