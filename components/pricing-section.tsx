"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pricingPlans = [
  {
    title: "Strategy",
    price: "$36,500",
    duration: "for a 2-month minimum engagement",
    button: "Learn more",
    features: [
      {
        title: "Balancing Cost",
        desc: "LLM performance issues (cost, quality, speed)",
      },
      {
        title: "Optimizing AI",
        desc: "Evals, RAG, Fine-Tuning, and Prompt Engineering",
      },
    ],
    highlight: false,
  },
  {
    title: "Comprehensive",
    price: "$725,900",
    duration: "for a 3-month minimum engagement",
    button: "Learn more",
    features: [
      {
        title: "Implementation",
        desc: "We will write production-ready code to accelerate your AI product development.",
      },
      {
        title: "Model Optimization",
        desc: "We will implement domain-specific eval systems, fine-tune, prompt engineer and debug models to improve performance.",
      },
      {
        title: "Tools and Infrastructure",
        desc: "We will build tools that enable you to execute consistently and quickly.",
      },
    ],
    highlight: true,
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 = stacked, 1 = spread

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // Start animating when section top hits bottom of viewport, finish when top hits top
      const start = windowHeight;
      const end = 0;
      let progress = 1 - (rect.top - end) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animation for h2 text (word-by-word)
  useEffect(() => {
    if (!h2Ref.current || !sectionRef.current) return;
    const words = h2Ref.current.querySelectorAll(".word-item");
    gsap.fromTo(
      words,
      { opacity: 0.2, color: "#9ca3af" },
      {
        opacity: 1,
        color: "#fff",
        stagger: 0.05,
        ease: "power1.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top top",
          scrub: 1,
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const h2Text = [
    "Unlock the full potential of AI for your business.",
    "Choose a plan that fits your ambition and scale."
  ];

  const cardContent = (plan: typeof pricingPlans[0]) => (
    <div
      className={`relative flex flex-col bg-white rounded-2xl shadow-2xl border border-white/10 px-2 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 w-full max-w-[98vw] sm:max-w-xs md:max-w-sm ${plan.highlight ? 'ring-2 ring-purple-400 scale-105 z-10' : 'opacity-90'}`}
      style={{ minHeight: 200, maxWidth: '100%' }}
    >
      <h3 className="mb-2 text-gray-900 text-base sm:text-lg md:text-xl">{plan.title}</h3>
      <div className="mb-2 text-gray-900 text-lg sm:text-xl md:text-2xl">{plan.price}</div>
      <div className="mb-6 text-gray-500 text-xs sm:text-sm md:text-base">{plan.duration}</div>
      <button className={`mb-8 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition ${plan.highlight ? 'bg-[color:var(--primary)] text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>{plan.button}</button>
      <ul className="space-y-3 sm:space-y-4 md:space-y-5 mt-auto text-xs sm:text-sm md:text-base">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`mt-1 w-5 h-5 flex items-center justify-center rounded-full ${plan.highlight ? 'bg-blue-100 text-[color:var(--primary)]' : 'bg-gray-200 text-gray-700'}`}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414L8 11.086l6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </span>
            <div>
              <span className={`${plan.highlight ? 'text-purple-700' : 'text-gray-900'}`}>{f.title}</span>
              <div className="text-gray-500 leading-snug">{f.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // When spread, shift the card group more left so both cards are centered
  const groupShift = lerp(0, -320, scrollProgress); // -320px shift when fully spread

  // Card stacking/unstacking animation logic
  const cardPositions = [
    {
      // Card 1 (Strategy)
      x: lerp(60, 0, scrollProgress),
      y: lerp(70, 0, scrollProgress),
      z: lerp(-90, 0, scrollProgress),
      rotate: lerp(-6, 0, scrollProgress),
      scale: lerp(0.96, 1, scrollProgress),
      opacity: 1,
    },
    {
      // Card 2 (Comprehensive)
      x: lerp(0, 340, scrollProgress),
      y: lerp(0, 0, scrollProgress),
      z: lerp(0, 0, scrollProgress),
      rotate: lerp(0, 0, scrollProgress),
      scale: lerp(1, 1, scrollProgress),
      opacity: 1,
    },
  ];

  return (
    <section ref={sectionRef} className="relative flex flex-col md:flex-row items-center justify-between min-h-[800px] px-4 md:px-16 py-20 overflow-hidden rounded-3xl shadow-2xl">
      {/* Left Side: Always show 3-4 lines of text */}
      <div className="z-10 flex-1 max-w-2xl pr-0 md:pr-16">
        <p className="mb-4 text-[color:var(--primary)] uppercase">OUR PRICING</p>
        <h2 ref={h2Ref} className="mb-8" >
          {h2Text.map((line, idx) => (
            <span key={idx} className="block">
              {line.split(" ").map((word, widx) => (
                <span key={widx}>
                  <span className="word-item inline-block">{word}</span>{" "}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p className="text-gray-400 max-w-2xl mb-4">
          Transparent, flexible, and designed for every stage of your AI journey.
        </p>
        <p className="text-gray-400 max-w-2xl mb-4">
          Partner with Galvan ai to accelerate your innovation.
        </p>
        <p className="text-gray-400 max-w-2xl">
          Need a custom solution? <span className="text-purple-400 font-bold">Contact our team</span> for a tailored proposal.
        </p>
      </div>
      {/* Right Side: Cards with scroll-based stacking/unstacking animation on md+, flex-col on mobile */}
      <div className="w-full flex flex-col gap-8 max-w-xl justify-center items-stretch mt-12 md:mt-0 md:flex-row md:gap-0 md:relative md:min-h-[600px]"
        style={typeof window !== 'undefined' && window.innerWidth >= 768 ? { perspective: 1200, transform: `translateX(${groupShift}px)`, transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)' } : {}}>
        {/* Mobile: flex-col, md+: stacking/unstacking */}
        {typeof window !== 'undefined' && window.innerWidth < 768
          ? pricingPlans.map((plan) => (
              <div key={plan.title} className="w-full flex-shrink-0">
                {cardContent(plan)}
              </div>
            ))
          : pricingPlans.map((plan, idx) => {
              const pos = cardPositions[idx];
              return (
                <div
                  key={plan.title}
                  style={{
                    transform: `translateX(${pos.x}px) translateY(${pos.y}px) translateZ(${pos.z}px) rotateZ(${pos.rotate}deg) scale(${pos.scale})`,
                    opacity: pos.opacity,
                    zIndex: 10 - idx,
                    position: 'absolute',
                    right: idx === 0 ? 180 : 0,
                    top: 0,
                    transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                    willChange: 'transform, opacity',
                    width: '100%',
                    maxWidth: 400,
                    minWidth: 320,
                    pointerEvents: scrollProgress === 1 ? 'auto' : 'none',
                  }}
                >
                  {cardContent(plan)}
                </div>
              );
            })}
      </div>
    </section>
  );
} 