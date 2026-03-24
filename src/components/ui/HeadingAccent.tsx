"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

interface HeadingAccentProps {
  variant?: "cube" | "sphere";
  size?: number;
  className?: string;
}

export default function HeadingAccent({
  variant = "cube",
  size = 60,
  className = "",
}: HeadingAccentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  const path = variant === "cube"
    ? "/animations/wireframe-cube.json"
    : "/animations/wireframe-sphere.json";

  useEffect(() => {
    fetch(path)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [path]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {isVisible && data && (
        <Lottie
          animationData={data}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
