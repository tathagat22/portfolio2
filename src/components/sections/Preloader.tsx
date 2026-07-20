"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const el = containerRef.current;
    if (el) el.style.display = "none";
    try { sessionStorage.setItem("preloader-shown", "1"); } catch {}
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("preloader-shown")) {
        finish();
        return;
      }
    } catch {}

    const container = containerRef.current;
    if (!container) {
      finish();
      return;
    }

    const chars = container.querySelectorAll(".preloader-char");
    const subtitle = container.querySelector(".preloader-subtitle");
    const content = container.querySelector(".preloader-content");
    const bg = container.querySelector(".preloader-bg");

    if (!chars.length || !bg) {
      finish();
      return;
    }

    const runExit = () => {
      const exitTl = gsap.timeline({ onComplete: finish });
      if (content) exitTl.to(content, { y: -40, opacity: 0, duration: 0.3, ease: "power3.in" });
      exitTl.to(bg, { yPercent: -100, duration: 0.8, ease: "power4.inOut" });
    };

    let counterDone = false;
    let pageLoaded = document.readyState === "complete";

    const tryProceed = () => {
      if (counterDone && pageLoaded) runExit();
    };

    const intro = gsap.timeline();
    intro.from(chars, {
      y: 100,
      opacity: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power4.out",
    });
    if (subtitle) intro.from(subtitle, { opacity: 0, y: 20, duration: 0.4 }, "-=0.1");

    const progress = { value: 0 };
    gsap.to(progress, {
      value: 100,
      duration: 2,
      delay: 0.3,
      ease: "power2.out",
      onUpdate: () => {
        const v = Math.round(progress.value);
        if (percentRef.current) percentRef.current.textContent = `${v}%`;
        if (barRef.current) gsap.set(barRef.current, { scaleX: progress.value / 100 });
      },
      onComplete: () => {
        counterDone = true;
        tryProceed();
      },
    });

    if (!pageLoaded) {
      const onLoad = () => {
        pageLoaded = true;
        tryProceed();
      };
      window.addEventListener("load", onLoad, { once: true });
    }

    // Hard cap so the preloader can never hang on a slow/broken load event
    const safety = setTimeout(() => runExit(), 5000);

    return () => {
      clearTimeout(safety);
      intro.kill();
    };
  }, [finish]);

  const nameChars = "KAUTILYA".split("");

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] cursor-pointer" onClick={finish}>
      <div className="preloader-bg absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
        <div className="preloader-content flex flex-col items-center gap-4">
          <div className="flex overflow-hidden">
            {nameChars.map((char, i) => (
              <span
                key={i}
                className="preloader-char font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white inline-block"
              >
                {char}
              </span>
            ))}
          </div>
          <p className="preloader-subtitle font-body text-sm md:text-base text-[#888] tracking-[0.3em] uppercase">
            3D Animator &amp; Visual Artist
          </p>
          <div className="flex items-center gap-3 mt-2 w-40">
            <div className="relative flex-1 h-[1px] bg-white/15 overflow-hidden">
              <div
                ref={barRef}
                className="absolute inset-0 origin-left bg-[#00f0ff]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <span
              ref={percentRef}
              className="font-body text-xs text-[#888] tabular-nums w-9 text-right"
            >
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
