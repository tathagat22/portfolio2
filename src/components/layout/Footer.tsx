"use client";

import { SOCIAL_LINKS } from "@/lib/utils/constants";

const SOCIALS = [
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { label: "Instagram", href: SOCIAL_LINKS.instagram },
  { label: "YouTube", href: SOCIAL_LINKS.youtube },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 px-6 md:px-12 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-text-secondary text-sm font-body">
          &copy; {new Date().getFullYear()} Kautilya Yashovardhan. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-white transition-colors text-sm font-body"
            >
              {social.label}
            </a>
          ))}
        </div>

        <button
          onClick={scrollToTop}
          className="text-text-secondary hover:text-white transition-colors text-sm font-body flex items-center gap-2"
        >
          Back to top
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="rotate-180">
            <path d="M6 2L6 10M6 2L2 6M6 2L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
