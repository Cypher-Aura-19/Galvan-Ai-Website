"use client";

import React from "react";
import { useTheme } from "@/components/theme-provider";

export default function MilestonesSection() {
  const { theme } = useTheme();
  const milestones = [
    { label: "PROJECTS DELIVERED", value: 50, suffix: "+" },
    { label: "GLOBAL CLIENTS", value: 25, suffix: "+" },
    { label: "YEARS OF COMBINED EXPERIENCE", value: 7, suffix: "+" },
    { label: "CLIENT'S SATISFACTION RATE", value: 98, suffix: "%" },
  ];

  const isLight = theme === "light";
  const sectionBg = isLight ? "bg-white" : "bg-black";
  const textMain = "text-white";
  const textSub = "text-white/70";
  const btnBg = isLight ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-gray-300";
  const borderColor = isLight ? "border-zinc-200" : "border-zinc-800";

  return (
    <section className={`w-full ${sectionBg} ${textMain} py-10 sm:py-14 md:py-16 transition-colors duration-300`}>
      {/* ─────── Heading Row ─────── */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-0">
        {/* LEFT: Heading flush to left */}
        <div className="flex-1">
          <h2 className="font-extrabold uppercase leading-[1.1] font-barlow text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
            WE TURN IDEAS <br /> INTO VISUAL <br /> MASTERPIECES
          </h2>
        </div>
        {/* RIGHT: Copy + Button flush to right */}
        <div className="max-w-md flex flex-col items-start md:items-end mt-6 md:mt-0">
          <p className="font-sans font-normal leading-relaxed text-left md:text-right mb-6 text-lg sm:text-xl text-white/70">
            Whether it's an engaging explainer video, a vibrant social media campaign, or captivating motion graphics, we bring creativity and expertise to every project.
          </p>
          <button className={`self-start md:self-end font-bold uppercase text-base sm:text-lg tracking-wide px-5 py-2.5 rounded font-barlow ${btnBg}`}>
            KNOW MORE ABOUT US
          </button>
        </div>
      </div>

      {/* ─────── Milestones Grid ─────── */}
      <div className={`max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 pt-10 sm:pt-12 border-t ${borderColor} grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 sm:gap-y-10 sm:gap-x-8`}> 
        {milestones.map(({ label, value, suffix }, idx) => {
          const alignmentClasses = [
            'text-center md:text-left justify-self-center md:justify-self-start',
            'text-center justify-self-center',
            'text-center justify-self-center',
            'text-center md:text-right justify-self-center md:justify-self-end'
          ];
          const alignClass = alignmentClasses[idx] || 'text-center justify-self-center';
          return (
            <div key={label} className={alignClass}>
              <div className="uppercase font-sans font-bold tracking-widest mb-2 text-base sm:text-lg text-white/70">{label}</div>
              <div className="font-extrabold font-barlow leading-none text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
                {value}{suffix}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
