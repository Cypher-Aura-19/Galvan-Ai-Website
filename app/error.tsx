"use client";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Subtle SVG background (white, low opacity) */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="400" cy="300" rx="350" ry="180" fill="#fff" />
        </svg>
      </div>
      <div className="relative z-10 w-full max-w-lg bg-black border border-zinc-800 rounded-3xl shadow-2xl p-12 flex flex-col items-center backdrop-blur-xl">
        <div className="mb-6 animate-bounce">
          {/* Modern white warning icon */}
          <svg className="w-24 h-24 text-white drop-shadow-xl" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="3" fill="none" />
            <path d="M24 16v10m0 4h.01" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold mb-4 text-white text-center">Something went wrong</h1>
        <h2 className="text-xl font-bold mb-2 text-center text-white">An unexpected error occurred</h2>
        {error?.message && <p className="text-white text-base mb-4 text-center max-w-md">{error.message}</p>}
        <p className="text-zinc-300 text-lg mb-8 text-center max-w-md">Please try again, or return to the dashboard.</p>
        <div className="flex gap-4">
          <button onClick={() => reset()} className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold shadow-xl border border-zinc-700 transition-all text-lg">
            Try Again
          </button>
          <Link href="/admin/dashboard" className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold shadow-xl border border-zinc-700 transition-all text-lg">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 