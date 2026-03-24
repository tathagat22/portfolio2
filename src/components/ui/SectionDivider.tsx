"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

interface SectionDividerProps {
  variant?: "line" | "particles" | "none";
  color?: "cyan" | "amber" | "purple";
}

export default function SectionDivider({
  variant = "line",
}: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lineData, setLineData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [particleData, setParticleData] = useState<any>(null);

  useEffect(() => {
    fetch("/animations/draw-line.json")
      .then((r) => r.json())
      .then(setLineData)
      .catch(() => {});
    fetch("/animations/particle-network.json")
      .then((r) => r.json())
      .then(setParticleData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full flex items-center justify-center overflow-hidden my-4"
      style={{ height: variant === "particles" ? "140px" : "60px" }}
    >
      {variant === "line" && lineData && isVisible && (
        <div className="w-full max-w-5xl mx-auto px-6" style={{ height: "6px" }}>
          <Lottie
            animationData={lineData}
            loop={false}
            autoplay={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      {variant === "particles" && particleData && isVisible && (
        <div className="w-full max-w-4xl mx-auto" style={{ height: "130px", opacity: 0.8 }}>
          <Lottie
            animationData={particleData}
            loop={true}
            autoplay={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      {/* Static fallback while waiting */}
      {!isVisible && (
        <div className="w-48 h-[1px] mx-auto bg-white/10" />
      )}
    </div>
  );
}
