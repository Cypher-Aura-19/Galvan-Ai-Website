"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="relative z-10 w-full max-w-lg bg-black border border-zinc-800 rounded-3xl shadow-2xl p-12 flex flex-col items-center backdrop-blur-xl">
        <div className="mb-6">
          {/* Galvan AI logo, no animation */}
          <img src="/Galvan AI logo transparent.png" alt="Galvan AI Logo" className="w-24 h-24 object-contain" />
        </div>
        <h1 className="text-6xl font-extrabold mb-4 text-white text-center">404</h1>
        <h2 className="text-2xl font-bold mb-2 text-center text-white">Page Not Found</h2>
        <p className="text-zinc-300 text-lg mb-8 text-center max-w-md">Sorry, the page you are looking for does not exist or has been moved. Please check the URL or return to the home page.</p>
        <Link href="/" className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold shadow-xl border border-zinc-700 transition-all text-lg">
          Go to Home
        </Link>
      </div>
    </div>
  );
} 