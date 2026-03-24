"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (tlRef.current) tlRef.current.kill();
    const el = containerRef.current;
    if (el) el.style.display = "none";
    // Mark as shown for this session
    try { sessionStorage.setItem("preloader-shown", "1"); } catch {}
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Skip preloader if already shown this session (back nav, page refresh)
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
    const line = container.querySelector(".preloader-line");
    const content = container.querySelector(".preloader-content");
    const bg = container.querySelector(".preloader-bg");

    if (!chars.length || !bg) {
      finish();
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    tlRef.current = tl;

    tl.from(chars, {
      y: 100,
      opacity: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power4.out",
    });

    if (subtitle) {
      tl.from(subtitle, { opacity: 0, y: 20, duration: 0.4 }, "-=0.1");
    }

    if (line) {
      tl.from(line, { scaleX: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.1");
    }

    tl.to({}, { duration: 0.2 });

    if (content) {
      tl.to(content, { y: -40, opacity: 0, duration: 0.3, ease: "power3.in" });
    }

    tl.to(bg, { yPercent: -100, duration: 0.8, ease: "power4.inOut" });

    const timeout = setTimeout(finish, 4000);

    return () => {
      clearTimeout(timeout);
      tl.kill();
    };
  }, [finish]);

  const nameChars = "KAUTILYA".split("");

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] cursor-pointer"
      onClick={finish}
    >
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
          <div className="preloader-line w-24 h-[1px] bg-[#00f0ff] origin-center mt-2" />
        </div>
      </div>
    </div>
  );
}
