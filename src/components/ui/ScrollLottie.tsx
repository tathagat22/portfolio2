"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

interface ScrollLottieProps {
  animationPath: string;
  className?: string;
  loop?: boolean;
  speed?: number;
}

export default function ScrollLottie({
  animationPath,
  className = "",
  loop = true,
}: ScrollLottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

  // Load animation data
  useEffect(() => {
    fetch(animationPath)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {});
  }, [animationPath]);

  // Intersection observer for scroll trigger
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (!loop) {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loop]);

  if (!animationData) return <div ref={containerRef} className={className} />;

  return (
    <div ref={containerRef} className={className}>
      {isVisible && (
        <Lottie
          animationData={animationData}
          loop={loop}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
        />
      )}
    </div>
  );
}
