"use client";

import { useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null;
    let tick: ((time: number) => void) | null = null;
    let refreshTimeout: ReturnType<typeof setTimeout>;

    async function init() {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      // Keep ScrollTrigger's scroll position in sync with Lenis's eased scroll,
      // and drive both off the same GSAP ticker so they never drift apart.
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Trigger positions are measured against DOM layout at creation time;
      // re-measure once images/videos have settled so later sections don't
      // end up with stale (or already-passed) trigger zones.
      refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 300);
      window.addEventListener("load", () => ScrollTrigger.refresh());
    }

    init();

    return () => {
      clearTimeout(refreshTimeout);
      if (tick) gsap.ticker.remove(tick);
      if (lenis) lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
