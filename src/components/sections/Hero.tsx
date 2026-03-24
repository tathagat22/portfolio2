"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollLottie from "@/components/ui/ScrollLottie";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const titleEl = titleRef.current;
    if (!section) return;

    let isFirstVisit = true;
    try { if (sessionStorage.getItem("preloader-shown")) isFirstVisit = false; } catch {}

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: isFirstVisit ? 2.8 : 0.2 });

      // Video fades in
      tl.from(".hero-video-wrap", {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: "power2.out",
      });

      // Line 1 characters
      tl.from(
        section.querySelectorAll(".hero-line-1 .split-char"),
        {
          y: 120,
          opacity: 0,
          rotateX: -80,
          stagger: 0.04,
          duration: 1,
          ease: "power4.out",
        },
        "-=1"
      );

      // Line 2 characters
      tl.from(
        section.querySelectorAll(".hero-line-2 .split-char"),
        {
          y: 120,
          opacity: 0,
          rotateX: -80,
          stagger: 0.03,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.7"
      );

      // Subtitle
      tl.from(
        section.querySelector(".hero-subtitle"),
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Bottom bar
      tl.from(
        section.querySelector(".hero-bottom"),
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.2"
      );

      // Parallax on scroll
      if (titleEl) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(titleEl, {
              y: self.progress * -150,
              opacity: 1 - self.progress * 1.5,
            });
          },
        });
      }

      // Video parallax (zoom in slightly on scroll)
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const video = section.querySelector(".hero-video-wrap");
          if (video) {
            gsap.set(video, {
              scale: 1 + self.progress * 0.15,
            });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const line1Chars = "KAUTILYA".split("");
  const line2Chars = "YASHOVARDHAN".split("");

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-theme="hero"
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Full-screen Video Background */}
      <div className="hero-video-wrap absolute inset-0 z-0">
        {/* Placeholder: replace src with actual showreel video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster=""
        >
          {/* Add your video source here later */}
          {/* <source src="/videos/showreel.mp4" type="video/mp4" /> */}
        </video>

        {/* Fallback gradient when no video */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a1628] to-[#0a0a0a]" />

        {/* Animated ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00f0ff]/[0.04] blur-[150px]"
          style={{ animation: "pulseGlow 4s ease-in-out infinite" }} />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#8b5cf6]/[0.04] blur-[120px]"
          style={{ animation: "pulseGlow 4s ease-in-out infinite 1.5s" }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-[#f0a500]/[0.03] blur-[100px]"
          style={{ animation: "pulseGlow 4s ease-in-out infinite 3s" }} />
      </div>

      {/* Dark overlays for text readability */}
      <div className="absolute inset-0 z-[1] bg-black/40" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />

      {/* Floating wireframe accents */}
      <ScrollLottie
        animationPath="/animations/wireframe-cube.json"
        className="absolute top-[12%] right-[8%] w-[180px] h-[180px] z-[2] opacity-50 pointer-events-none hidden md:block"
      />
      <ScrollLottie
        animationPath="/animations/wireframe-sphere.json"
        className="absolute bottom-[18%] left-[6%] w-[150px] h-[150px] z-[2] opacity-40 pointer-events-none hidden md:block"
      />
      <ScrollLottie
        animationPath="/animations/particle-network.json"
        className="absolute top-[55%] right-[3%] w-[350px] h-[180px] z-[2] opacity-50 pointer-events-none hidden lg:block"
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div ref={titleRef} className="relative z-[2] text-center px-4 max-w-[95vw]">
        {/* Line 1 */}
        <div className="hero-line-1 overflow-hidden">
          <h1 className="font-display font-bold text-[clamp(3rem,12vw,14rem)] leading-[0.85] tracking-tighter text-white">
            {line1Chars.map((char, i) => (
              <span key={i} className="split-char inline-block" style={{ perspective: "500px" }}>
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Line 2 */}
        <div className="hero-line-2 overflow-hidden mt-1 md:mt-2">
          <h1 className="font-display font-bold text-[clamp(1.5rem,5.5vw,7rem)] leading-[0.95] tracking-tight text-white/70">
            {line2Chars.map((char, i) => (
              <span key={i} className="split-char inline-block" style={{ perspective: "500px" }}>
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Subtitle */}
        <div className="hero-subtitle mt-6 md:mt-10 flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 md:w-16 bg-[#00f0ff]/50" />
          <p className="font-body text-sm md:text-lg text-[#00f0ff] tracking-[0.3em] uppercase">
            3D Animator / Visual Artist
          </p>
          <div className="h-[1px] w-8 md:w-16 bg-[#00f0ff]/50" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="hero-bottom absolute bottom-0 left-0 right-0 z-[2] px-6 md:px-12 py-8 flex items-end justify-between">
        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-body text-[10px] text-[#888] tracking-[0.3em] uppercase">
            Scroll
          </span>
          <div className="w-[1px] h-16 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#00f0ff] to-transparent"
              style={{
                height: "50%",
                animation: "scrollBounce 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <p className="font-body text-[10px] text-[#555] tracking-wider uppercase">
            Available for freelance
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <p className="font-body text-[10px] text-[#888] tracking-wider">
              Based in India
            </p>
          </div>
        </div>

        {/* Social hint */}
        <div className="hidden md:block">
          <p className="font-body text-[10px] text-[#555] tracking-wider uppercase [writing-mode:vertical-rl]">
            Follow the journey
          </p>
        </div>
      </div>
    </section>
  );
}
