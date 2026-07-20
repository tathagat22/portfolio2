"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import Button from "@/components/ui/Button";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    try {
      if (sessionStorage.getItem("preloader-shown")) setIsFirstVisit(false);
    } catch {}
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: isFirstVisit ? 2.8 : 0, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-5 flex items-center justify-between transition-all duration-500",
          isScrolled && "bg-[#0a0a0a]/80 backdrop-blur-md"
        )}
      >
        {/* Logo */}
        <a href="#" className="font-display text-xl md:text-2xl font-bold tracking-tight text-white">
          KAUTILYA<span className="text-[var(--accent-cyan)]">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "relative font-body text-sm transition-colors duration-300 uppercase tracking-widest pb-1",
                  isActive ? "text-white" : "text-text-secondary hover:text-white"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute -bottom-0 left-0 right-0 h-[1px] bg-[var(--accent-cyan)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
          <Button href="#contact" variant="outline" className="!px-5 !py-2.5">
            Let&apos;s Talk
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isMobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-white block"
          />
          <motion.span
            animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-[2px] bg-white block"
          />
          <motion.span
            animate={isMobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-white block"
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <MobileMenu onClose={() => setIsMobileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
