"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS_DATA, REEL_ERAS } from "@/lib/utils/constants";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  title: string;
  slug: string;
  category: string;
  thumbnail: string;
  video?: string;
  width: number;
  height: number;
};
type Era = (typeof REEL_ERAS)[number];

type Cell =
  | { kind: "leader"; key: string }
  | { kind: "slate"; key: string; era: Era }
  | { kind: "frame"; key: string; era: Era; project: Project; frameNo: number }
  | { kind: "tail"; key: string };

const BAND = "film-perf h-5 md:h-[26px] shrink-0";
const FRAME_H = "h-[210px] sm:h-[250px] md:h-[290px] lg:h-[320px]";

const PROJECTS_BY_SLUG = new Map<string, Project>(PROJECTS_DATA.map((p) => [p.slug, p]));

// The reel runs motion only - every still lives in the gallery instead. An era
// whose work is all stills has nothing to project, so its slate is skipped too.
function buildCells(): Cell[] {
  const cells: Cell[] = [{ kind: "leader", key: "leader" }];
  let frameNo = 0;
  for (const era of REEL_ERAS) {
    const projects = era.projects
      .map((slug) => PROJECTS_BY_SLUG.get(slug))
      .filter((project): project is Project => Boolean(project?.video));
    if (!projects.length) continue;

    cells.push({ kind: "slate", key: `slate-${era.id}`, era });
    for (const project of projects) {
      frameNo += 1;
      cells.push({ kind: "frame", key: project.slug, era, project, frameNo });
    }
  }
  cells.push({ kind: "tail", key: "tail" });
  return cells;
}

const REEL_FRAME_COUNT = buildCells().filter((cell) => cell.kind === "frame").length;

/* The readout above the gate — reads whatever cell the playhead is sitting on. */
function GateReadout({ cell }: { cell: Cell | undefined }) {
  if (!cell) return null;

  let index = "—";
  let title = "The Reel";
  let meta: string[] = ["2019 — 2026"];

  if (cell.kind === "leader") {
    index = "000";
    title = "Head Leader";
    meta = ["Reel 01", "2019 — 2026"];
  } else if (cell.kind === "slate") {
    index = "///";
    title = cell.era.label;
    meta = [cell.era.period, cell.era.role];
  } else if (cell.kind === "frame") {
    index = String(cell.frameNo).padStart(3, "0");
    title = cell.project.title;
    meta = [cell.era.label, cell.era.period, cell.project.category];
  } else {
    index = "END";
    title = "End of Reel";
    meta = [`${REEL_FRAME_COUNT} frames`];
  }

  return (
    <div className="flex items-baseline gap-4 md:gap-6 min-w-0">
      <span className="font-body text-xs md:text-sm tabular-nums text-[var(--section-accent)] shrink-0">
        {index}
      </span>
      <span className="font-display text-sm md:text-xl font-bold tracking-wide uppercase text-white truncate">
        {title}
      </span>
      <span className="hidden sm:flex items-baseline gap-3 md:gap-5 font-body text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-text-tertiary truncate">
        {meta.map((m) => (
          <span key={m} className="truncate">
            {m}
          </span>
        ))}
      </span>
    </div>
  );
}

function FrameCell({
  cell,
  isActive,
}: {
  cell: Extract<Cell, { kind: "frame" }>;
  isActive: boolean;
}) {
  const { project, era, frameNo } = cell;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) video.play().catch(() => {});
    else video.pause();
  }, [isActive]);

  return (
    <Link
      href={`/project/${project.slug}`}
      aria-label={`${project.title} — ${era.label}, ${era.period}`}
      style={{ aspectRatio: `${project.width} / ${project.height}` }}
      className="reel-cell group relative block h-full shrink-0 overflow-hidden bg-black outline-none focus-visible:ring-2 focus-visible:ring-[var(--section-accent)]"
    >
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="metadata"
        poster={project.thumbnail}
        className={`absolute inset-0 w-full h-full object-cover transition-[filter,transform] duration-700 ease-out ${
          isActive
            ? "grayscale-0 brightness-100 scale-[1.04]"
            : "grayscale-[0.9] brightness-[0.6] scale-100"
        }`}
      >
        <source src={project.video} type="video/mp4" />
      </video>

      {/* Lamp flicker, only while the frame is in the gate */}
      <div
        className="absolute inset-0 pointer-events-none bg-white mix-blend-overlay"
        style={
          isActive
            ? { animation: "gate-flicker 2.4s steps(1, end) infinite" }
            : { opacity: 0 }
        }
      />

      <div className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black via-black/70 to-transparent pt-10 pb-3 px-3 md:px-4">
        <p
          className={`font-display text-[13px] md:text-[15px] font-bold uppercase leading-tight transition-colors duration-500 ${
            isActive ? "text-white" : "text-white/55"
          }`}
        >
          {project.title}
        </p>
        <p className="font-body text-[9px] md:text-[10px] tracking-[0.16em] uppercase text-text-tertiary mt-1 truncate">
          {era.period} &middot; {project.category}
        </p>
      </div>

      <span
        className={`absolute top-2 left-2 md:top-3 md:left-3 font-body text-[9px] md:text-[10px] tabular-nums tracking-[0.12em] transition-colors duration-500 ${
          isActive ? "text-[var(--section-accent)]" : "text-white/30"
        }`}
      >
        {String(frameNo).padStart(3, "0")}
      </span>

      <span
        className={`absolute inset-0 pointer-events-none border transition-colors duration-500 ${
          isActive ? "border-[var(--section-accent)]/70" : "border-transparent"
        }`}
      />
    </Link>
  );
}

function SlateCell({ era, isActive }: { era: Era; isActive: boolean }) {
  return (
    <div
      className="reel-cell relative h-full shrink-0 w-[190px] md:w-[250px] bg-[#08080a] flex flex-col justify-between p-4 md:p-5 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-500 ${
          isActive ? "bg-[var(--section-accent)]" : "bg-white/12"
        }`}
      />
      {/* clapper stripes */}
      <div
        className="absolute inset-x-0 top-0 h-4 opacity-70"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #f2efe8 0 14px, #101014 14px 28px)",
        }}
      />
      <div className="pt-6">
        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-[var(--section-accent)] mb-2">
          {era.period}
        </p>
        <p className="font-display text-base md:text-lg font-bold uppercase leading-tight text-white">
          {era.label}
        </p>
        <p className="font-body text-[10px] tracking-[0.16em] uppercase text-text-tertiary mt-1.5">
          {era.role}
        </p>
      </div>
      <p className="font-body text-[10px] md:text-[11px] leading-relaxed text-text-secondary">
        {era.note}
      </p>
    </div>
  );
}

export default function ReelTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const cells = useMemo(buildCells, []);

  /* Whichever cell centre is nearest the playhead is the one in the gate.
     Reading rects keeps this identical for the pinned scrub and the mobile
     native scroller, so there is only one source of truth for "active". */
  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const playheadX = window.innerWidth / 2;
    const nodes = track.querySelectorAll<HTMLElement>("[data-cell-index]");
    let best = 0;
    let bestDist = Infinity;
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - playheadX);
      if (dist < bestDist) {
        bestDist = dist;
        best = Number(node.dataset.cellIndex);
      }
    });
    if (best !== activeRef.current) {
      activeRef.current = best;
      setActive(best);
    }
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        onUpdate: syncActive,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          // The strip is far wider than any comfortable scroll distance, so the
          // pin is capped and the film simply runs faster than the wheel.
          end: () => `+=${Math.min(distance(), window.innerHeight * 7)}`,
          pin,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
          onRefresh: syncActive,
        },
      });

      syncActive();

      // Gate weave — a real projector never holds the frame perfectly still.
      let weave: gsap.core.Tween | undefined;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        weave = gsap.to(track, {
          y: 1.5,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      return () => {
        weave?.kill();
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, [syncActive]);

  // Mobile / tablet: native horizontal scroller drives the same readout.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        syncActive();
        const max = scroller.scrollWidth - scroller.clientWidth;
        setProgress(max > 0 ? scroller.scrollLeft / max : 0);
      });
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    syncActive();
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [syncActive]);

  const activeCell = cells[active];
  const activeEra =
    activeCell && activeCell.kind !== "leader" && activeCell.kind !== "tail"
      ? activeCell.era
      : null;
  const activeEraId = activeEra?.id ?? null;

  return (
    <section ref={sectionRef} id="reel" data-theme="reel" className="relative">
      <div
        ref={pinRef}
        className="relative flex flex-col justify-center overflow-hidden py-20 lg:py-0 lg:h-[100svh] lg:min-h-[620px]"
      >
        {/* Heading */}
        <div className="px-6 md:px-12 lg:pt-20 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs md:text-sm text-text-secondary tracking-[0.3em] uppercase mb-2">
                Timeline
              </p>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-none">
                THE <span className="text-[var(--section-accent)]">REEL</span>
              </h2>
            </div>
            <p className="font-body text-[10px] md:text-xs tracking-[0.22em] uppercase text-text-tertiary">
              <span className="lg:hidden">Swipe the strip</span>
              <span className="hidden lg:inline">Scroll to run the strip</span>
            </p>
          </div>
        </div>

        {/* Gate readout */}
        <div className="mt-8 md:mt-10 px-6 md:px-12 shrink-0">
          <div className="max-w-7xl mx-auto border-t border-b border-white/10 py-3">
            <GateReadout cell={activeCell} />
          </div>
        </div>

        {/* Film strip */}
        <div className="relative mt-6 md:mt-10">
          {/* Playhead */}
          <div
            className="pointer-events-none absolute left-1/2 -top-8 bottom-[-1rem] z-30 w-[1.5px] -translate-x-1/2 bg-[var(--section-accent)]"
            style={{ boxShadow: "0 0 12px 1px var(--section-accent)" }}
          >
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[var(--section-accent)]" />
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[var(--section-accent)]" />
          </div>

          {/* Edge vignettes so the strip runs out of darkness */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 md:w-40 bg-gradient-to-r from-[var(--bg-primary)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 md:w-40 bg-gradient-to-l from-[var(--bg-primary)] to-transparent" />

          <div
            ref={scrollerRef}
            className="reel-scroller overflow-x-auto overflow-y-hidden lg:overflow-visible"
          >
            <div
              ref={trackRef}
              className="film-base flex w-max items-stretch will-change-transform"
            >
              {/* run-in so the first frame meets the playhead */}
              <div className="shrink-0 flex flex-col w-[22vw]" aria-hidden="true">
                <div className={BAND} />
                <div className={FRAME_H} />
                <div className={BAND} />
              </div>

              {cells.map((cell, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={cell.key}
                    data-cell-index={i}
                    className="relative shrink-0 flex flex-col border-r border-black/60"
                  >
                    {/* top perforation band */}
                    <div className={BAND} />

                    <div className={`relative flex ${FRAME_H}`}>
                      {cell.kind === "frame" ? (
                        <FrameCell cell={cell} isActive={isActive} />
                      ) : cell.kind === "slate" ? (
                        <SlateCell era={cell.era} isActive={isActive} />
                      ) : cell.kind === "leader" ? (
                        <LeaderCell isActive={isActive} />
                      ) : (
                        <TailCell isActive={isActive} />
                      )}
                    </div>

                    {/* bottom perforation band + edge code */}
                    <div className={BAND} />
                  </div>
                );
              })}

              <div className="shrink-0 flex flex-col w-[28vw]" aria-hidden="true">
                <div className={BAND} />
                <div className={FRAME_H} />
                <div className={BAND} />
              </div>
            </div>
          </div>
        </div>

        {/* Year axis */}
        <div className="mt-8 md:mt-10 px-6 md:px-12 shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-stretch gap-px">
              {REEL_ERAS.map((era) => {
                const isCurrent = era.id === activeEraId;
                return (
                  <div key={era.id} className="flex-1 min-w-0">
                    <div
                      className={`h-[2px] transition-colors duration-500 ${
                        isCurrent ? "bg-[var(--section-accent)]" : "bg-white/12"
                      }`}
                    />
                    <div className="hidden md:block">
                      <p
                        className={`mt-2 font-body text-[10px] tabular-nums tracking-[0.16em] transition-colors duration-500 ${
                          isCurrent ? "text-[var(--section-accent)]" : "text-text-tertiary"
                        }`}
                      >
                        {era.period}
                      </p>
                      <p
                        className={`font-body text-[10px] tracking-[0.16em] uppercase truncate transition-colors duration-500 ${
                          isCurrent ? "text-white" : "text-text-tertiary/60"
                        }`}
                      >
                        {era.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeEra && (
              <p className="md:hidden mt-3 font-body text-[10px] tracking-[0.16em] uppercase text-text-secondary">
                <span className="text-[var(--section-accent)] tabular-nums">{activeEra.period}</span>
                <span className="mx-2 text-text-tertiary">&middot;</span>
                {activeEra.label}
              </p>
            )}

            {/* overall run progress */}
            <div className="mt-4 h-px w-full bg-white/10">
              <div
                className="h-full bg-[var(--section-accent)] origin-left"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaderCell({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="reel-cell relative h-full shrink-0 w-[200px] md:w-[280px] bg-[#08080a] flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* academy leader crosshair */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/25" />
        <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-white/25" />
      </div>
      <div
        className={`relative flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full border transition-colors duration-500 ${
          isActive ? "border-[var(--section-accent)]" : "border-white/25"
        }`}
      >
        <span className="font-display text-3xl md:text-4xl font-bold text-white">01</span>
      </div>
      <p className="absolute bottom-4 left-0 right-0 text-center font-body text-[9px] tracking-[0.3em] uppercase text-text-tertiary">
        Kautilya &middot; Reel 01
      </p>
    </div>
  );
}

function TailCell({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="reel-cell relative h-full shrink-0 w-[240px] md:w-[380px] bg-[#08080a] flex flex-col items-center justify-center gap-3 px-6 text-center"
    >
      <p
        className={`font-display text-lg md:text-xl font-bold uppercase tracking-wide transition-colors duration-500 ${
          isActive ? "text-white" : "text-white/50"
        }`}
      >
        End of Reel
      </p>
      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-text-tertiary">
        {REEL_FRAME_COUNT} frames &middot; 2019 — 2026
      </p>
      <a
        href="#contact"
        className="mt-2 font-body text-[10px] tracking-[0.2em] uppercase text-[var(--section-accent)] border-b border-[var(--section-accent)]/40 pb-1 hover:border-[var(--section-accent)] transition-colors"
      >
        Start the next one
      </a>
    </div>
  );
}
