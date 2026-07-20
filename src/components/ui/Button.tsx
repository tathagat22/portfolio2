"use client";

import { useRef, useState, MouseEvent, AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

type SharedProps = {
  variant?: "primary" | "outline";
  magnetic?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsAnchor = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const MAGNETIC_RANGE = 60;

export default function Button({ variant = "outline", magnetic = true, icon, className, children, ...props }: ButtonProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!magnetic || !elRef.current) return;
    if (!xTo.current) xTo.current = gsap.quickTo(elRef.current, "x", { duration: 0.5, ease: "power3" });
    if (!yTo.current) yTo.current = gsap.quickTo(elRef.current, "y", { duration: 0.5, ease: "power3" });

    const rect = elRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(relX * relX + relY * relY);
    const pull = Math.max(0, 1 - dist / (rect.width + MAGNETIC_RANGE));
    xTo.current(relX * pull * 0.4);
    yTo.current(relY * pull * 0.4);
  };

  const onMouseLeave = () => {
    xTo.current?.(0);
    yTo.current?.(0);
  };

  const onClick = (e: MouseEvent<HTMLElement>) => {
    const rect = elRef.current?.getBoundingClientRect();
    if (rect) {
      const size = Math.max(rect.width, rect.height) * 2;
      const id = rippleId.current++;
      setRipples((prev) => [...prev, { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
    }
    (props as { onClick?: (e: MouseEvent<HTMLElement>) => void }).onClick?.(e);
  };

  const sharedClassName = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 font-body text-sm uppercase tracking-widest transition-colors duration-300 will-change-transform",
    variant === "primary"
      ? "bg-[var(--section-accent)] text-black hover:bg-white"
      : "border border-white/20 text-white hover:border-[var(--section-accent)]",
    className
  );

  const content = (
    <>
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: "var(--section-accent)" }}
      />
      <span className="relative z-10">{children}</span>
      {icon && <span className="relative z-10">{icon}</span>}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size, animation: "button-ripple 0.65s ease-out forwards" }}
        />
      ))}
    </>
  );

  if (props.href) {
    const { href, ...anchorRest } = props;
    return (
      <a
        {...anchorRest}
        href={href}
        ref={(node) => { elRef.current = node; }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        className={sharedClassName}
      >
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = props as ButtonAsButton;
  return (
    <button
      {...buttonRest}
      type={type}
      ref={(node) => { elRef.current = node; }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={sharedClassName}
    >
      {content}
    </button>
  );
}
