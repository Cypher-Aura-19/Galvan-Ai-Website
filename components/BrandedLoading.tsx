"use client";
import React, { useEffect, useRef, useState } from "react";

interface BrandedLoadingProps {
  minDuration?: number; // in ms
}

export default function BrandedLoading({ minDuration = 7000 }: BrandedLoadingProps) {
  // Always use dark theme for loading screen as per user request
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);
  const start = useRef(Date.now());

  useEffect(() => {
    let frame: number;
    let cancelled = false;
    const update = () => {
      const elapsed = Date.now() - start.current;
      let p = Math.min(100, Math.round((elapsed / minDuration) * 100));
      setPercent(p);
      if (p < 100 && !cancelled) {
        frame = requestAnimationFrame(update);
      } else {
        setTimeout(() => setDone(true), 300); // small fade-out delay
      }
    };
    update();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [minDuration]);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen w-full bg-black transition-colors duration-300">
      {/* Centered Logo */}
      <div className="flex flex-col items-center justify-center w-full">
        <img
          src="/Galvan AI logo transparent.png"
          alt="Galvan AI"
          className="w-20 h-20 md:w-28 md:h-28 object-contain mb-8"
          style={{ filter: "brightness(1.2)" }}
        />
        <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 font-barlow text-center">
          Galvan AI
        </div>
        {/* Large Loading Percentage */}
        <div className="mt-8 text-5xl md:text-7xl font-extrabold text-white font-mono tracking-tight select-none" style={{letterSpacing: '0.05em'}}>
          {percent}%
        </div>
        <div className="text-base md:text-lg text-white/70 font-sans text-center mt-4">
          Loading, please wait...
        </div>
      </div>
    </div>
  );
}