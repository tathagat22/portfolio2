"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa6";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/lib/utils/constants";
import Button from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

// Web3Forms access keys are public by design - they only authorise posting to
// the inbox they were issued for, so there is nothing to keep server-side.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

const SOCIAL_ICONS: Record<string, IconType> = {
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  youtube: FaYoutube,
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal with split chars
      gsap.from(".contact-char", {
        y: 120,
        opacity: 0,
        rotateX: -80,
        stagger: 0.03,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });

      gsap.from(".contact-form-wrap", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-form-wrap",
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!ACCESS_KEY) {
      setError("The contact form isn't configured yet. Please email me directly.");
      return;
    }

    // Bots fill every field they find; a real person never sees this one.
    const honeypot = (e.currentTarget.elements.namedItem("botcheck") as HTMLInputElement)?.checked;
    if (honeypot) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `Portfolio enquiry from ${formState.name}`,
          from_name: "kautilyayashovardhan.com",
          replyto: formState.email,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? "Request failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong sending that. Please try again, or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const line1 = "LET'S CREATE";
  const line2 = "SOMETHING";
  const line3 = "EXTRAORDINARY";

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-theme="contact"
      className="relative py-24 md:py-40 px-6 md:px-12 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--accent-purple)]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Big CTA Heading */}
        <div className="mb-16 md:mb-24">
          {[line1, line2, line3].map((line, lineIndex) => (
            <div key={lineIndex} className="overflow-hidden">
              <h2 className="font-display text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] tracking-tighter">
                {line.split("").map((char, i) => (
                  <span
                    key={`${lineIndex}-${i}`}
                    className={`contact-char inline-block ${
                      lineIndex === 2
                        ? "text-[var(--accent-purple)]"
                        : "text-white"
                    }`}
                    style={{ perspective: "500px" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h2>
            </div>
          ))}
        </div>

        {/* Form + Contact Info */}
        <div className="contact-form-wrap grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--accent-purple)]/20 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[var(--accent-purple)]">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">Message Sent!</h3>
                <p className="font-body text-text-secondary">
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div>
                  <label className="font-body text-xs text-text-tertiary tracking-wider uppercase block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-3 font-body text-white text-lg focus:border-[var(--accent-purple)] focus:outline-none transition-colors placeholder:text-text-tertiary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-text-tertiary tracking-wider uppercase block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-3 font-body text-white text-lg focus:border-[var(--accent-purple)] focus:outline-none transition-colors placeholder:text-text-tertiary"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-text-tertiary tracking-wider uppercase block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-3 font-body text-white text-lg focus:border-[var(--accent-purple)] focus:outline-none transition-colors resize-none placeholder:text-text-tertiary"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 font-body text-sm px-8 py-4 bg-[var(--accent-purple)] rounded-full text-white hover:bg-[var(--accent-purple)]/80 transition-all duration-300 tracking-wider uppercase disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8h14m0 0L9 2m6 6L9 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {error && (
                  <p role="alert" className="font-body text-sm text-[#ff6b6b]">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                Get in Touch
              </h3>
              <p className="font-body text-text-secondary mb-8 max-w-sm">
                Have a project in mind or just want to say hello? I&apos;m always open
                to discussing new opportunities and creative collaborations.
              </p>

              <div className="flex items-center gap-2 mb-2">
                <a
                  href={SOCIAL_LINKS.email}
                  className="font-body text-lg text-white hover:text-[var(--accent-purple)] transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
                <button
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="text-text-tertiary hover:text-[var(--accent-purple)] transition-colors"
                >
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M11 5V2.5A1.5 1.5 0 009.5 1H2.5A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11H5" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  )}
                </button>
                {copied && (
                  <span className="font-body text-xs text-[var(--accent-purple)]">Copied!</span>
                )}
              </div>
              <p className="font-body text-lg text-text-secondary mb-8">{CONTACT_INFO.phone}</p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}
                  variant="outline"
                  icon={
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 2h2.5l1 3.5-1.5 1a8 8 0 004.5 4.5l1-1.5 3.5 1V14a1 1 0 01-1 1A11 11 0 012 3a1 1 0 011-1z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                >
                  Call
                </Button>
                <Button href={SOCIAL_LINKS.email} variant="primary">
                  Email Me
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {Object.entries(SOCIAL_LINKS).map(([name, url]) => {
                if (name === "email") return null;
                const Icon = SOCIAL_ICONS[name];
                return (
                  <motion.a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-text-secondary hover:text-[var(--accent-purple)] hover:border-[var(--accent-purple)]/50 transition-colors duration-300"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
