"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6">
      <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
        Something went wrong
      </h1>
      <p className="font-body text-text-secondary mb-8 text-center max-w-md">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="font-body text-sm px-6 py-3 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest"
      >
        Try Again
      </button>
    </div>
  );
}
