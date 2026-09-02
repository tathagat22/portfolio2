"use client";

import { useEffect, useRef, useState, MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

const SHOWREEL_POSTER = "/images/showreel/showreel-2026.webp";
const SHOWREEL_VIDEO = "/videos/showreel/showreel-2026.mp4";

gsap.registerPlugin(ScrollTrigger);

export default function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoContainerRef.current,
        { clipPath: "inset(25% 30% 25% 30% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 10%",
            scrub: 1,
          },
        }
      );

      gsap.from(".showreel-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Open lightbox and start playback
  useEffect(() => {
    if (!isLightboxOpen) return;
    const video = videoRef.current;
    if (!video) return;
    setIsVideoPlaying(true);
    video.play().catch(() => setIsVideoPlaying(false));

    const onTimeUpdate = () => {
      if (video.duration) setProgress(video.currentTime / video.duration);
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [isLightboxOpen]);

  const closeLightbox = () => {
    videoRef.current?.pause();
    setIsLightboxOpen(false);
    setProgress(0);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsVideoPlaying(true);
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const seek = (e: ReactMouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const bar = progressBarRef.current;
    if (!video || !bar || !video.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    video.currentTime = ratio * video.duration;
  };

  const onPosterMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = posterRef.current?.getBoundingClientRect();
    const glow = glowRef.current;
    if (!rect || !glow) return;
    gsap.to(glow, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  return (
    <section ref={sectionRef} id="showreel" className="relative py-20 md:py-32 px-4 md:px-12">
      <div className="showreel-title text-center mb-12">
        <p className="font-body text-sm text-text-secondary tracking-[0.3em] uppercase mb-3">
          Featured Reel
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white">Showreel 2026</h2>
      </div>

      <div
        ref={videoContainerRef}
        className="relative w-full max-w-6xl mx-auto aspect-video bg-elevated rounded-lg overflow-hidden group"
        style={{ clipPath: "inset(25% 30% 25% 30% round 24px)" }}
      >
        <div
          ref={posterRef}
          onMouseMove={onPosterMouseMove}
          className="absolute inset-0 overflow-hidden"
        >
          {/* Poster still */}
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <Image
              src={SHOWREEL_POSTER}
              alt="Showreel preview"
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Mouse-follow glow */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        {/* Play Button Overlay */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute inset-0 z-10 flex items-center justify-center group/play"
          aria-label="Play showreel"
        >
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-white/30 flex items-center justify-center group-hover/play:border-[var(--accent-cyan)] group-hover/play:scale-110 transition-all duration-500 backdrop-blur-sm bg-white/5">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-white ml-1 group-hover/play:text-[var(--accent-cyan)] transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md px-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-[#0a0a0a]"
            >
              <video
                ref={videoRef}
                loop
                playsInline
                poster={SHOWREEL_POSTER}
                className="w-full h-full object-cover"
              >
                <source src={SHOWREEL_VIDEO} type="video/mp4" />
              </video>

              {/* Close button */}
              <button
                onClick={closeLightbox}
                aria-label="Close showreel"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {/* Custom controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div
                  ref={progressBarRef}
                  onClick={seek}
                  className="relative w-full h-1.5 rounded-full bg-white/20 cursor-pointer mb-4"
                >
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-[var(--accent-cyan)]"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    aria-label={isVideoPlaying ? "Pause" : "Play"}
                    className="text-white hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    {isVideoPlaying ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="text-white hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    {isMuted ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12a4.5 4.5 0 00-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L18.73 21 20 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
