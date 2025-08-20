"use client"
import React, { useEffect, useRef } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from "@/components/theme-provider";
import Link from "next/link";

const milestones = [
  { label: "PROJECTS DELIVERED", value: 50, suffix: "+" },
  { label: "GLOBAL CLIENTS", value: 25, suffix: "+" },
  { label: "YEARS OF COMBINED EXPERIENCE", value: 7, suffix: "+" },
  { label: "CLIENT'S SATISFACTION RATE", value: 98, suffix: "%" },
];

export default function MilestonesSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLElement | null>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Create scroll trigger for the milestones section
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        // Animate each milestone number
        milestoneRefs.current.forEach((ref, index) => {
          if (ref) {
            const milestone = milestones[index];
            const targetValue = milestone.value;
            
            gsap.fromTo(ref, 
              { textContent: 0 },
              {
                textContent: targetValue,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                onUpdate: function() {
                  ref.textContent = Math.floor(this.targets()[0].textContent) + milestone.suffix;
                }
              }
            );
          }
        });
      },
      onEnterBack: () => {
        // Reset animation when scrolling back up
        milestoneRefs.current.forEach((ref, index) => {
          if (ref) {
            const milestone = milestones[index];
            gsap.set(ref, { textContent: milestone.value + milestone.suffix });
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`milestones-section w-full py-10 sm:py-16 lg:py-20 font-sans transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}
    >
      <div className="milestones-row max-w-[1700px] mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-0 items-start justify-between">
        <div className="milestones-heading flex-1">
          <h2 className={`font-barlow font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight ${isDark ? "text-white" : "text-black"}`}>
            WE POWER YOUR <br /> GROWTH WITH <br /> CUSTOM AI SOLUTIONS
          </h2>
        </div>
        <div className="milestones-copy max-w-md flex flex-col items-end mt-6 md:mt-0">
          <p className={`mb-6 text-base sm:text-lg text-right ${isDark ? "text-white/80" : "text-black/80"}`}>
            Whether it’s a smart AI agent, a powerful automation tool, or a full-scale SaaS platform, we build with precision. Our solutions help businesses move faster, work smarter, and scale with confidence.
          </p>
          <Link href="/about-us">
            <button
              className={`uppercase font-semibold rounded-lg px-8 py-3 text-base tracking-wide transition-colors duration-200 ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`}
            >
              KNOW MORE ABOUT US
            </button>
          </Link>
        </div>
      </div>
      <div className="milestones-grid max-w-[1700px] mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 px-4">
        {milestones.map(({ label, value, suffix }, index) => (
          <div key={label} className="group relative">
            <div
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border text-center transition-all duration-500 hover:scale-[1.03] ${
                isDark
                  ? 'bg-black/40 backdrop-blur-xl border-blue-500/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20'
                  : 'bg-black/5 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20'
              }`}
            >
              {/* Decorative blue corners like About page */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className={`absolute top-4 right-4 w-10 h-10 border-r-2 border-t-2 rounded-tr-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
                <div className={`absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 rounded-bl-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
              </div>

              <div className={`uppercase tracking-wider mb-3 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                isDark ? 'text-white/70 group-hover:text-blue-400' : 'text-black/70 group-hover:text-blue-600'
              }`}>{label}</div>
              <div
                ref={el => { milestoneRefs.current[index] = el; }}
                className={`font-extrabold text-2xl sm:text-3xl md:text-4xl transition-colors duration-300 ${
                  isDark ? 'text-white group-hover:text-blue-400' : 'text-black group-hover:text-blue-600'
                }`}
              >
                0{suffix}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 