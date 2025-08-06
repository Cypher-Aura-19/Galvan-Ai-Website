"use client"

import { useState, useEffect } from "react"
import gsap from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { FaGoogle, FaSlack, FaRegSmile, FaRobot, FaRegCircle, FaBeer } from "react-icons/fa"
import { SiPostman, SiZapier } from "react-icons/si"
import Milestones from "./milestones"

gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin)

export default function HeroIntegrationsSection() {
  useEffect(() => {
    const ballIds = ["#ball1", "#ball2", "#ball3", "#ball4", "#ball5", "#ball6", "#ball7", "#ball8"]
    const pathIds = [
      "#tracePath1", "#tracePath2", "#tracePath3", "#tracePath4",
      "#tracePath5", "#tracePath6", "#tracePath7", "#tracePath8"
    ]
    const lineIds = [
      "#traceLine1", "#traceLine2", "#traceLine3", "#traceLine4",
      "#traceLine5", "#traceLine6", "#traceLine7", "#traceLine8"
    ]
  
    const duration = 6
    const ease = "power1.inOut"
    const mainTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
  
    const setupLine = (lineSelector: string) => {
      const pathEl = document.querySelector(lineSelector.replace("Line", "Path")) as SVGPathElement
      const lineEl = document.querySelector(lineSelector) as SVGPathElement
      if (!pathEl || !lineEl) return 0
      const length = pathEl.getTotalLength()
      gsap.set(lineSelector, {
        strokeDasharray: length,
        strokeDashoffset: length,
        strokeOpacity: 1,
      })
      return length
    }
  
    const createGroupTimeline = (indices: number[]) => {
      const groupTL = gsap.timeline()
    
      indices.forEach((i, index) => {
        const lineSelector = lineIds[i]
        const pathSelector = pathIds[i]
        const ballSelector = ballIds[i]
    
        const pathEl = document.querySelector(pathSelector) as SVGPathElement
        const lineEl = document.querySelector(lineSelector) as SVGPathElement
    
        if (!pathEl || !lineEl) {
          console.warn(`Missing SVG elements: ${pathSelector} or ${lineSelector}`)
          return
        }
    
        const pathLength = pathEl.getTotalLength()
        const pathArray = MotionPathPlugin.getRawPath(pathSelector)[0]
    
        if (!pathArray || pathArray.length < 2) {
          console.warn(`Invalid path array for: ${pathSelector}`, pathArray)
          return
        }
    
        const [startX, startY] = [pathArray[0], pathArray[1]]
        const targetColor = lineEl.getAttribute("stroke") || "#fff"
    
        console.log(`Animating line ${lineSelector}:`)
        console.log(`- Path length: ${pathLength}`)
        console.log(`- Start coords: (${startX}, ${startY})`)
        console.log(`- Target color: ${targetColor}`)
    
        const tl = gsap.timeline()
    
        // Setup line stroke for animation
        gsap.set(lineSelector, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          stroke: "white",
          strokeOpacity: 1,
        })
    
        // Set ball starting position at center (start of path)
        gsap.set(ballSelector, {
          x: startX,
          y: startY,
        })
    
        // Animate stroke draw and fade out
        tl.to(lineSelector, {
          strokeDashoffset: 0,
          strokeOpacity: 0,
          duration,
          ease,
        }, 0)
    
        // Animate color change (white → colored)
        tl.to(lineSelector, {
          stroke: targetColor,
          duration: duration * 0.5,
          ease: "power1.inOut",
        }, 0)
    
        // Animate the ball along the path from center to edge
        tl.to(ballSelector, {
          duration,
          ease,
          motionPath: {
            path: pathSelector,
            align: pathSelector,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0,
            end: 1,
          },
        }, 0)
    
        groupTL.add(tl, index * 0.3)
      })
    
      return groupTL
    }
    
    
  
    const leftIndices = [0, 1, 2, 3]
    const rightIndices = [4, 5, 6, 7]
  
    mainTimeline
      .add(createGroupTimeline(leftIndices))
      .add(createGroupTimeline(rightIndices))
  }, [])
  
  
  
  
  
  
  
  
  

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[100vh] py-24 w-full overflow-visible text-white">
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <svg viewBox="0 0 1000 600" className="w-full h-full">
          {/* Glow filters */}
          <defs>
            <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-gray" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

{/* LEFT-SIDE PATHS (shifted right +40px, up 10px) */}
{[1, 2, 3, 4].map((i) => (
  <g key={i}>
    <path
      id={`tracePath${i}`}
      d={
        i === 1
          ? "M40,30 C140,150 240,230 290,250"
          : i === 2
            ? "M40,150 C140,190 240,230 290,250"
            : i === 3
              ? "M40,350 C140,310 240,270 290,250"
              : "M40,470 C140,350 240,270 290,250"
      }
      stroke="white"
      fill="none"
      strokeWidth="1.5"
    />
    <path
      id={`traceLine${i}`}
      d={
        i === 1
          ? "M40,30 C140,150 240,230 290,250"
          : i === 2
            ? "M40,150 C140,190 240,230 290,250"
            : i === 3
              ? "M40,350 C140,310 240,270 290,250"
              : "M40,470 C140,350 240,270 290,250"
      }
      stroke={
        i === 1 ? "#16a34a" :
        i === 2 ? "#a855f7" :
        i === 3 ? "#f97316" :
                  "#f87171"
      }
      fill="none"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </g>
))}


{/* SHARED LEFT MERGE (adjusted to match left side shift) */}
<g>
  <path
    id="tracePathLeftMerge"
    d="M290,250 C360,250 470,250 540,250"
    stroke="white"
    fill="none"
    strokeWidth="1.5"
  />
</g>


{/* RIGHT-SIDE PATHS (shifted left −40px, up 10px) */}
{[5, 6, 7, 8].map((i) => (
  <g key={i}>
    <path
      id={`tracePath${i}`}
      d={
        i === 5
          ? "M710,250 C760,230 860,150 960,30"
          : i === 6
            ? "M710,250 C760,230 860,190 960,150"
            : i === 7
              ? "M710,250 C760,270 860,310 960,350"
              : "M710,250 C760,270 860,350 960,470"
      }
      stroke="white"
      fill="none"
      strokeWidth="1.5"
    />
    <path
      id={`traceLine${i}`}
      d={
        i === 5
          ? "M710,250 C760,230 860,150 960,30"
          : i === 6
            ? "M710,250 C760,230 860,190 960,150"
            : i === 7
              ? "M710,250 C760,270 860,310 960,350"
              : "M710,250 C760,270 860,350 960,470"
      }
      stroke={
        i === 5 ? "#f87171" :
        i === 6 ? "#22d3ee" :
        i === 7 ? "#9ca3af" :
                  "#facc15"
      }
      fill="none"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </g>
))}


{/* SHARED RIGHT MERGE (adjusted to match right side shift) */}
<g>
  <path
    id="tracePathRightMerge"
    d="M710,250 C640,250 530,250 540,250"
    stroke="white"
    fill="none"
    strokeWidth="1.5"
  />
</g>






          {/* Glowing SVG lines replacing ping balls */}
          <line
            id="ball1"
            x1="-10"
            y1="0"
            x2="10"
            y2="0"
            stroke="#4ade80"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-green)"
            opacity="0.9"
          />
          <line
            id="ball2"
            x1="-10"
            y1="0"
            x2="10"
            y2="0"
            stroke="#a855f7"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-purple)"
            opacity="0.9"
          />
          <line
            id="ball3"
            x1="-10"
            y1="0"
            x2="10"
            y2="0"
            stroke="#fb923c"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-orange)"
            opacity="0.9"
          />
          <line
            id="ball4"
            x1="-10"
            y1="0"
            x2="10"
            y2="0"
            stroke="#f472b6"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-pink)"
            opacity="0.9"
          />
          <line
            id="ball5"
            x1="-10"
            y1="0"
            x2="10"
            y2="0"
            stroke="#f87171"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-red)"
            opacity="0.9"
          />
          <line
            id="ball6"
            x1="-10"
            y1="0"
            x2="10"
            y2="0"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-cyan)"
            opacity="0.9"
          />
          <line
            id="ball7"
            x1="-10"
            y1="0"
            x2="10"
            y2="0"
            stroke="#9ca3af"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-gray)"
            opacity="0.9"
          />
          <line
            id="ball8"
            x1="-10"
            y1="0"
            x2="10"
            y2="0"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-yellow)"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Left-side icons */}
      <div className="absolute left-[10.5%] top-[3.5%]">
        <SiPostman className="text-green-600 text-4xl" />
      </div>
      <div className="absolute left-[10.5%] top-[22.5%]">
        <FaSlack className="text-purple-500 text-4xl" />
      </div>
      <div className="absolute left-[10.5%] top-[55.5%]">
        <SiZapier className="text-orange-500 text-4xl" />
      </div>
      <div className="absolute left-[10.5%] top-[75.5%]">
        <FaBeer className="text-red-400 text-4xl" />
      </div>

      {/* Right-side icons */}
      <div className="absolute right-[10.5%] top-[3.5%]">
        <FaRobot className="text-red-400 text-4xl" />
      </div>
      <div className="absolute right-[10.5%] top-[22.5%]">
        <FaRegSmile className="text-cyan-400 text-4xl" />
      </div>
      <div className="absolute right-[10.5%] top-[55.5%]">
        <FaRegCircle className="text-gray-400 text-4xl" />
      </div>
      <div className="absolute right-[10.5%] top-[75.5%]">
        <FaGoogle className="text-yellow-500 text-4xl" />
      </div>

      <div className="relative z-30 rounded-[20px] text-center flex flex-col items-center justify-center gap-5 p-6 md:p-8 min-w-[300px] md:min-w-[480px] max-w-[90%] shadow-md mt-40">
  <span className="text-xs text-white bg-gray-800 border border-gray-700 rounded-full px-3 py-1 font-mono tracking-widest">
    {`{integrations}`}
  </span>

  <h1 className="text-3xl md:text-4xl font-extrabold text-black relative z-10">
    <span className="relative inline-block px-4 py-2">
      <span className="absolute inset-0 bg-white rounded-full opacity-100 -z-10"></span>
      One-click integrations
    </span>
  </h1>

  <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-[60ch]">
    Simplify and streamline your digital world with our extensive range of one-click integrations, designed to
    provide seamless data protection and peace of mind.
  </p>

  <button className="bg-white text-black rounded-full px-5 py-2 text-sm font-semibold shadow hover:bg-gray-200 transition flex items-center gap-2">
    Book a demo <span className="mx-1">·</span> 15 minutes <span className="text-base">→</span>
  </button>
</div>

<section className="w-full flex justify-center mt-4 z-20">
  <div className="rounded-2xl shadow-xl px-6 py-8 flex flex-col md:flex-row gap-8 md:gap-0 items-center justify-between max-w-4xl w-full border border-white/20">
    {milestoneData.map((m, i) => (
      <div key={i} className="flex flex-col items-center flex-1 px-4">
        <div className="mb-2 text-white">{m.icon}</div>
        <AnimatedNumber value={m.value} suffix={m.suffix} />
        <div className="text-sm text-gray-400 mt-1 font-semibold tracking-wide text-center">{m.label}</div>
      </div>
    ))}
  </div>
</section>



    </section>
  )
}

const milestoneData = [
  { icon: <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#2563eb"/><path d="M10 17l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: 120, suffix: "+", label: "Integrations" },
  { icon: <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#f59e42"/><path d="M16 10v8l5 3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: 300, suffix: "+", label: "Clients" },
  { icon: <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#10b981"/><path d="M12 16l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: 99.99, suffix: "%", label: "Uptime" },
  { icon: <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#a855f7"/><path d="M16 8v8h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: 12, suffix: "+", label: "Years Experience" },
]

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    let startTime = performance.now()
    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const value = Math.floor(progress * (target - start) + start)
      setCount(value)
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return count
}

function AnimatedNumber({ value, suffix }: { value: number, suffix: string }) {
  const count = useCountUp(value, 1200)
  return (
    <div className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
      {count}
      {suffix}
    </div>
  )
}
