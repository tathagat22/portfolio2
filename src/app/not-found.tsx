import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6">
      <h1 className="font-display text-6xl md:text-8xl font-bold mb-4">404</h1>
      <p className="font-body text-text-secondary mb-8 text-center">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="font-body text-sm px-6 py-3 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest"
      >
        Back to Home
      </Link>
    </div>
  );
}
