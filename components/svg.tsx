"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useTheme } from "./theme-provider"
import Link from "next/link"
// Left-side brand icons
import { SiOpenai, SiDocker, SiStripe, SiFirebase, SiShopify } from "react-icons/si";
import { FaAws } from "react-icons/fa";

// Right-side services & AI
import { SiZapier, SiSlack } from "react-icons/si";
import { FaRobot, FaBrain, FaNetworkWired } from "react-icons/fa"; // General AI/automation vibes

import { FaCloud } from "react-icons/fa"; // Cloud-based service (SaaS)

import { RiSettings4Line } from "react-icons/ri"; // Tech gear with circuit styling

import { GiArtificialIntelligence } from "react-icons/gi"; // AI-specific chip design

// Desktop tracks configuration
const desktopTracks = [
  {
    pathId: "path1",
    color: "#156af2",
    dashLen: 20,
    gap: 20,
    speed: 280,
    freq: 0.5,
    start: 1,
    end: 20,
  },
  {
    pathId: "path2",
    color: "#156af2",
    dashLen: 20,
    gap: 15,
    speed: 240,
    freq: 0.5,
    start: 1,
    end: 20,
  },
  {
    pathId: "path3",
    color: "#156af2",
    dashLen: 20,
    gap: 10,
    speed: 230,
    freq: 0.5,
    start: 1,
    end: 20,
  },
  {
    pathId: "path4",
    color: "#156af2",
    dashLen: 20,
    gap: 20,
    speed: 210,
    freq: 0.5,
    start: 1,
    end: 20,
  },
  {
    pathId: "path5",
    color: "#156af2",
    dashLen: 20,
    gap: 10,
    speed: 160,
    freq: 0.5,
    start: 1,
    end: 20,
  },
  {
    pathId: "path6",
    color: "#156af2",
    dashLen: 20,
    gap: 15,
    speed: 190,
    freq: 0.5,
    start: 1,
    end: 20,
  },
]

// Mobile/Tablet tracks configuration (exact from provided code)
const mobileTracks = [
  {
    pathId: 'topLeftPath',
    color: '#156af2',
    dashLen: 10,
    gap: 10,
    speed: 300,
    freq: 0.5,
    start: 1,
    end: 20
  },
  {
    pathId: 'topCenterPath',
    color: '#156af2',
    dashLen: 10,
    gap: 10,
    speed: 160,
    freq: 0.5,
    start: 1,
    end: 20
  },
  {
    pathId: 'topRightPath',
    color: '#156af2',
    dashLen: 60,
    gap: 60,
    speed: 160,
    freq: 1.8,
    start: 1,
    end: 20
  },
  {
    pathId: 'bottomLeftPath',
    color: '#156af2',
    dashLen: 60,
    gap: 60,
    speed: 160,
    freq: 1.8,
    start: 1,
    end: 20
  },
  {
    pathId: 'bottomCenterPath',
    color: '#156af2',
    dashLen: 60,
    gap: 60,
    speed: 160,
    freq: 1.8,
    start: 1,
    end: 20
  },
  {
    pathId: 'bottomRightPath',
    color: '#156af2',
    dashLen: 60,
    gap: 60,
    speed: 160,
    freq: 1.8,
    start: 1,
    end: 20
  },
];

// Desktop layout (original)
const leftIconsDesktop = [
  { Icon: SiOpenai, top: "0%", left: "0%" },         // ChatGPT (OpenAI)
  { Icon: SiDocker, top: "8%", left: "4%" },        // Docker
  { Icon: SiStripe, top: "16%", left: "1%" },        // Stripe
  { Icon: SiFirebase, top: "84%", left: "1%" },      // Firebase
  { Icon: SiShopify, top: "92%", left: "4%" },      // Shopify
  { Icon: FaAws, top: "100%", left: "0%" },    // AWS
];

const rightIconsDesktop = [
  { Icon: SiZapier, color: "#FF4F00", top: "0%", right: "0%" },
  { Icon: SiSlack, color: "#4A154B", top: "8%", right: "4%" },
  { Icon: FaNetworkWired, color: "#6B7280", top: "16%", right: "2%" },
  { Icon: FaCloud, color: "#0EA5E9", top: "84%", right: "2%" },                   // SaaS-like
  { Icon: GiArtificialIntelligence, color: "#7C3AED", top: "92%", right: "4%" }, // AI
  { Icon: RiSettings4Line, color: "#6B7280", top: "100%", right: "0%" },          // Automation
];

// Tablet layout (simplified, fewer icons)
const leftIconsTablet = [
  { Icon: SiOpenai, top: "5%", left: "2%" },
  { Icon: SiDocker, top: "25%", left: "1%" },
  { Icon: SiStripe, top: "45%", left: "3%" },
  { Icon: SiFirebase, top: "65%", left: "1%" },
  { Icon: SiShopify, top: "85%", left: "2%" },
];

const rightIconsTablet = [
  { Icon: SiZapier, color: "#FF4F00", top: "5%", right: "2%" },
  { Icon: SiSlack, color: "#4A154B", top: "25%", right: "1%" },
  { Icon: FaNetworkWired, color: "#6B7280", top: "45%", right: "3%" },
  { Icon: FaCloud, color: "#0EA5E9", top: "65%", right: "1%" },
  { Icon: GiArtificialIntelligence, color: "#7C3AED", top: "85%", right: "2%" },
];

// Mobile layout (minimal, key icons only)
const leftIconsMobile = [
  { Icon: SiOpenai, top: "10%", left: "5%" },
  { Icon: SiDocker, top: "40%", left: "2%" },
  { Icon: SiStripe, top: "70%", left: "5%" },
];

const rightIconsMobile = [
  { Icon: SiZapier, color: "#FF4F00", top: "10%", right: "5%" },
  { Icon: FaNetworkWired, color: "#6B7280", top: "40%", right: "2%" },
  { Icon: GiArtificialIntelligence, color: "#7C3AED", top: "70%", right: "5%" },
];

export default function SVGPulseAnimation() {
  const sceneRef = useRef<SVGSVGElement>(null)
  const mobileSceneRef = useRef<SVGSVGElement>(null)
  const activeTimersRef = useRef<Set<NodeJS.Timeout>>(new Set())
  const autoRestartTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const { theme } = useTheme()

  // Determine device type based on screen size
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType('mobile')
      } else if (width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    checkDeviceType()
    window.addEventListener('resize', checkDeviceType)
    return () => window.removeEventListener('resize', checkDeviceType)
  }, [])

  // Get appropriate icon sets based on device type
  const getLeftIcons = () => {
    switch (deviceType) {
      case 'mobile': return leftIconsMobile
      case 'tablet': return leftIconsTablet
      case 'desktop': return leftIconsDesktop
      default: return leftIconsDesktop
    }
  }

  const getRightIcons = () => {
    switch (deviceType) {
      case 'mobile': return rightIconsMobile
      case 'tablet': return rightIconsTablet
      case 'desktop': return rightIconsDesktop
      default: return rightIconsDesktop
    }
  }

  // Get appropriate tracks based on device type
  const getTracks = () => {
    return deviceType === 'desktop' ? desktopTracks : mobileTracks
  }

  const startAnimation = () => {
    const tracks = getTracks()
    tracks.forEach(initTrack)
    const maxEnd = Math.max(...tracks.map((t) => t.end))
    autoRestartTimerRef.current = setTimeout(restartAnimation, (maxEnd + 1) * 1000)
  }

  const restartAnimation = () => {
    if (autoRestartTimerRef.current) {
      clearTimeout(autoRestartTimerRef.current)
      autoRestartTimerRef.current = null
    }

    activeTimersRef.current.forEach((id) => clearTimeout(id))
    activeTimersRef.current.clear()

    // Clean only animated dash paths, not icon elements
    if (sceneRef.current) {
      const animatedPaths = sceneRef.current.querySelectorAll("path.animated-dash")
      animatedPaths.forEach((p) => p.remove())
    }
    
    if (mobileSceneRef.current) {
      const animatedPaths = mobileSceneRef.current.querySelectorAll("path.animated-dash")
      animatedPaths.forEach((p) => p.remove())
    }

    startAnimation()
  }

  const initTrack = (track: any) => {
    const currentScene = deviceType === 'desktop' ? sceneRef.current : mobileSceneRef.current
    if (!currentScene) return

    const guide = currentScene.querySelector(`#${track.pathId}`) as SVGPathElement
    if (!guide) {
      console.warn(`Guide path #${track.pathId} not found`)
      return
    }

    const pathLength = guide.getTotalLength()
    const totalTravelDistance = pathLength + track.dashLen
    const animationDuration = totalTravelDistance / track.speed

    if (track.end <= track.start) {
      console.warn(`Track ${track.pathId} has end <= start; skipping.`)
      return
    }

    const firstLaunchTime = track.start * 1000
    const launchInterval = track.freq * 1000
    const lastLaunchTime = Math.max(0, (track.end - animationDuration)) * 1000

    for (let currentTime = firstLaunchTime; currentTime <= lastLaunchTime + 1; currentTime += launchInterval) {
      const timerId = setTimeout(() => {
        createPulseDash(track, guide, pathLength, animationDuration)
        activeTimersRef.current.delete(timerId)
      }, currentTime)
      activeTimersRef.current.add(timerId)
    }
  }

  const createPulseDash = (track: any, guidePath: SVGPathElement, pathLength: number, animationDuration: number) => {
    const currentScene = deviceType === 'desktop' ? sceneRef.current : mobileSceneRef.current
    if (!currentScene) return

    const pulseDash = guidePath.cloneNode(false) as SVGPathElement
    pulseDash.removeAttribute('id')
    pulseDash.classList.remove('guide')
    pulseDash.classList.add('animated-dash')
    pulseDash.setAttribute('stroke', track.color)
    pulseDash.setAttribute('fill', 'none')

    // one visible segment followed by long gap
    pulseDash.setAttribute('stroke-dasharray', `${track.dashLen} ${pathLength}`)
    pulseDash.setAttribute('stroke-dashoffset', String(pathLength + track.dashLen))
    pulseDash.style.opacity = '0'
    guidePath.parentNode?.appendChild(pulseDash)

    const fadeTransitionTime = Math.min(track.dashLen / track.speed, animationDuration * 0.4)

    gsap.timeline({
    defaults: { immediateRender: false },
      onComplete: () => pulseDash.remove()
    })
    // Slide along full travel
    .to(pulseDash, {
      attr: { 'stroke-dashoffset': 0 },
      duration: animationDuration,
      ease: 'none'
    }, 0)
    // Fade in
    .to(pulseDash, {
      opacity: 1,
      duration: fadeTransitionTime,
      ease: 'power1.in'
    }, 0)
    // Fade out
    .to(pulseDash, {
      opacity: 0,
      duration: fadeTransitionTime,
      ease: 'power1.out'
    }, animationDuration - fadeTransitionTime)
  }

  useEffect(() => {
      startAnimation()

    return () => {
      if (autoRestartTimerRef.current) {
        clearTimeout(autoRestartTimerRef.current)
      }
      activeTimersRef.current.forEach((id) => clearTimeout(id))
      activeTimersRef.current.clear()
    }
  }, [deviceType]) // Restart animation when device type changes

  // Responsive content based on device type
  const getResponsiveContent = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          title: "DESIGN. LAUNCH. SCALE.",
          subtitle: "",
          description: "AI that fits your vision, not the other way around.\nFrom design to scale, we build what your users will love.",
          buttonText: "Book a free consultation",
          titleSize: "text-3xl",
          subtitleSize: "text-sm",
          descriptionSize: "text-base",
          containerPadding: "p-6",
          contentGap: "gap-4",
          buttonSize: "px-6 py-3 text-base"
        }
      case 'tablet':
        return {
          title: "DESIGN. LAUNCH. SCALE.",
          subtitle: "",
          description: "AI that fits your vision, not the other way around.\nFrom design to scale, we build what your users will love.",
          buttonText: "Book a consultation",
          titleSize: "text-4xl",
          subtitleSize: "text-base",
          descriptionSize: "text-lg",
          containerPadding: "p-8",
          contentGap: "gap-5",
          buttonSize: "px-8 py-4 text-lg"
        }
      case 'desktop':
        return {
          title: "DESIGN. LAUNCH. SCALE.",
          subtitle: "",
          description: "AI that fits your vision, not the other way around.\nFrom design to scale, we build what your users will love.",
          buttonText: "Book a free consultation",
          titleSize: "text-4xl",
          subtitleSize: "text-lg",
          descriptionSize: "text-lg",
          containerPadding: "p-8",
          contentGap: "gap-6",
          buttonSize: "px-8 py-4 text-lg"
        }
      default:
        return {
          title: "DESIGN. LAUNCH. SCALE.",
          subtitle: "",
          description: "AI that fits your vision, not the other way around.\nFrom design to scale, we build what your users will love.",
          buttonText: "Book a free consultation",
          titleSize: "text-4xl",
          subtitleSize: "text-lg",
          descriptionSize: "text-lg",
          containerPadding: "p-8",
          contentGap: "gap-6",
          buttonSize: "px-8 py-4 text-lg"
        }
    }
  }

  const content = getResponsiveContent()
  const leftIcons = getLeftIcons()
  const rightIcons = getRightIcons()

  return (
    <div className={`${theme === 'dark' ? 'magicpattern' : 'magicpattern-2'} flex flex-col items-center justify-center gap-4 w-full ${
      deviceType === 'mobile' ? 'min-h-screen py-4' :
      deviceType === 'tablet' ? 'min-h-screen py-8' : 'min-h-screen py-20'
    }`}>
      <div className={`relative w-full ${
        deviceType === 'mobile' ? 'h-[90vh] max-h-[700px] px-4' :
        deviceType === 'tablet' ? 'h-[85vh] max-h-[800px] px-6' :
        'h-[70vh] max-h-[800px] px-12 mt-16'
      }`}>
        {/* Text content positioned in center */}
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className={`relative z-30 text-center flex flex-col items-center justify-center ${content.contentGap} ${content.containerPadding} ${
            deviceType === 'mobile' ? 'min-w-[280px] max-w-[85vw] py-4' :
            deviceType === 'tablet' ? 'min-w-[400px] max-w-[75vw] py-6' :
            'min-w-[450px] max-w-[70vw] mt-24 py-8'
          }`}>
            <h1 className={`font-barlow ${content.titleSize} font-extrabold tracking-tight ${theme === 'dark' ? 'text-black' : 'text-white'} relative z-10 text-center ${
              deviceType === 'mobile' ? 'px-4 py-3' :
              deviceType === 'tablet' ? 'px-6 py-4' : 'px-8 py-6 mt-8 -mr-36 -ml-44'
           }`}>
             <span className="relative inline-block px-3 py-2 md:px-4 md:py-4">
               <span className={`absolute inset-0 ${theme === 'dark' ? 'bg-white' : 'bg-black'} rounded-xl opacity-100 -z-10`} />
               {content.title}
             </span>
           </h1>

       <p className={`${content.subtitleSize} ${theme === 'dark' ? 'text-white' : 'text-black'} leading-relaxed text-center font-light ${
             deviceType === 'mobile' ? 'max-w-[85vw]' :
             deviceType === 'tablet' ? 'max-w-[70vw]' :
             'max-w-[60ch]'
           }`}>
             <span className="block">{content.subtitle}</span>
           </p>

       <p className={`${content.descriptionSize} ${theme === 'dark' ? 'text-white' : 'text-black'} leading-relaxed text-center font-light ${
             deviceType === 'mobile' ? 'max-w-[85vw]' :
             deviceType === 'tablet' ? 'max-w-[70vw]' :
             'max-w-[60ch]'
           }`}>
             <span className="block">AI that fits your vision, not the other way around.</span>
             <span className="block">From design to scale, we build what your users will love.</span>
           </p>

        <a href="#contact">
          <button className={`${theme === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'} rounded-xl mt-4 md:mt-8 ${content.buttonSize} font-medium transition-all duration-300 flex items-center gap-2 ${
                deviceType === 'mobile' ? 'hover:scale-105' :
                deviceType === 'tablet' ? 'hover:scale-110' : 'hover:scale-110'
              }`}>
            {content.buttonText}
          </button>
        </a>
          </div>
        </div>

        {deviceType === 'desktop' ? (
        <svg
          ref={sceneRef}
          id="scene"
          xmlns="http://www.w3.org/2000/svg"
      viewBox="-300 -50 2600 950"
          fill="none"
          className="w-full h-full"
          style={{ 
            maxWidth: '100%', 
              maxHeight: '60vh',
              minHeight: 350
            }}
          >
            {/* Desktop SVG content */}
      {/* Paths */}
              <path
                id="path1"
                className="guide"
                d="M-299.5 3.5H152.574C160.53 3.5 168.161 6.6607 173.787 12.2868L258 96.5L531.713 370.213C537.339 375.839 544.97 379 552.926 379H1388.07C1396.03 379 1403.66 375.839 1409.29 370.213L1683 96.5L1770.21 9.2868C1775.84 3.66071 1783.47 0.5 1791.43 0.5H2243.5"
              stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              style={{ display: 'block' }}
              />
              <path
                id="path2"
                className="guide"
                d="M-196.5 70.5H154.574C162.53 70.5 170.161 73.6607 175.787 79.2868L258 161.5L483.213 386.713C488.839 392.339 496.47 395.5 504.426 395.5H1434.07C1442.03 395.5 1449.66 392.339 1455.29 386.713L1683 159L1762.71 79.2868C1768.34 73.6607 1775.97 70.5 1783.93 70.5H2135"
              stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              style={{ display: 'block' }}
              />
              <path
                id="path3"
                className="guide"
                d="M-261 135H132.574C140.53 135 148.161 138.161 153.787 143.787L420.713 410.713C426.339 416.339 433.97 419.5 441.926 419.5H1492.57C1500.53 419.5 1508.16 416.339 1513.79 410.713L1780.71 143.787C1786.34 138.161 1793.97 135 1801.93 135H2191"
              stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              style={{ display: 'block' }}
              />
              <path
                id="path4"
                className="guide"
                d="M-299.5 836H152.574C160.53 836 168.161 832.839 173.787 827.213L258 743L531.713 469.287C537.339 463.661 544.97 460.5 552.926 460.5H1388.07C1396.03 460.5 1403.66 463.661 1409.29 469.287L1683 743L1770.21 830.213C1775.84 835.839 1783.47 839 1791.43 839H2243.5"
              stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              style={{ display: 'block' }}
              />
              <path
                id="path5"
                className="guide"
                d="M-196.5 769H154.574C162.53 769 170.161 765.839 175.787 760.213L258 678L483.213 452.787C488.839 447.161 496.47 444 504.426 444H1434.07C1442.03 444 1449.66 447.161 1455.29 452.787L1683 680.5L1762.71 760.213C1768.34 765.839 1775.97 769 1783.93 769H2135"
              stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              style={{ display: 'block' }}
              />
              <path
                id="path6"
                className="guide"
                d="M-261 704.5H132.574C140.53 704.5 148.161 701.339 153.787 695.713L420.713 428.787C426.339 423.161 433.97 420 441.926 420H1492.57C1500.53 420 1508.16 423.161 1513.79 428.787L1780.71 695.713C1786.34 701.339 1793.97 704.5 1801.93 704.5H2191"
              stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              style={{ display: 'block' }}
              />

      {/* Left‐end icons (circle then icon) */}
            <g transform="translate(-299.5, 3.5)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiOpenai style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(-196.5, 70.5)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiDocker style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(-261, 135)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiStripe style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(-299.5, 836)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiFirebase style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(-196.5, 769)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiShopify style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(-261, 704.5)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaAws style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>

      {/* Right‐end icons */}
            <g transform="translate(2243.5, 0.5)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiZapier style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(2135, 70.5)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiSlack style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(2191, 135)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaNetworkWired style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(2243.5, 839)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaCloud style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(2135, 769)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-17.5} y={-17.5} width={35} height={35} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GiArtificialIntelligence style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            <g transform="translate(2191, 704.5)" style={{ zIndex: 2000 }}>
              <circle cx="0" cy="0" r={30} fill={theme === 'dark' ? 'white' : 'black'} />
              <foreignObject x={-15} y={-15} width={30} height={30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RiSettings4Line style={{ width: '30px', height: '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
        </svg>
        ) : (
          <svg
            ref={mobileSceneRef}
            viewBox="-300 -50 1300 950"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            style={{
              overflow: 'hidden',
              width: '85%',
              height: 'auto',
              maxHeight: '600px',
              position: 'relative',
              top: '40px',
              zIndex: 1,
              textAlign: 'center',
              display: 'block',
              margin: '0 auto'
            }}
          >
            <g transform="rotate(90 350 425)">
              {/* Top Left Path */}
              <path
                id="topLeftPath"
                className="guide"
                d="
                  M-299.5 3.5
                  H52.574
                  C160.53 3.5 168.161 6.6607 173.787 12.2868
                  L241.157 79.657
                  L531.713 370.213
                  C537.339 375.839 544.97 379 552.926 379
                  H752.926
                "
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />

              {/* Top Center Path */}
              <path
                id="topCenterPath"
                className="guide"
                d="
                  M-196.5 70.5
                  H54.574
                  C162.53 70.5 170.161 73.6607 175.787 79.2868
                  L241.557 145.057
                  L483.213 386.713
                  C488.839 392.339 496.47 395.5 504.426 395.5
                  H704.426
                "
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />

              {/* Top Right Path */}
              <path
                id="topRightPath"
                className="guide"
                d="
                  M-261 135
                  H32.574
                  C140.53 135 148.161 138.161 153.787 143.787
                  L367.328 357.328
                  C426.339 416.339 433.97 419.5 441.926 419.5
                  H641.926
                "
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />

              {/* Bottom Left Path */}
              <path
                id="bottomLeftPath"
                className="guide"
                d="
                  M-299.5 836
                  H52.574
                  C160.53 836 168.161 832.839 173.787 827.213
                  L241.157 759.843
                  L531.713 469.287
                  C537.339 463.661 544.97 460.5 552.926 460.5
                  H752.926
                "
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />

              {/* Bottom Center Path */}
              <path
                id="bottomCenterPath"
                className="guide"
                d="
                  M-196.5 769
                  H54.574
                  C162.53 769 170.161 765.839 175.787 760.213
                  L241.557 694.443
                  L483.213 452.787
                  C488.839 447.161 496.47 444 504.426 444
                  H704.426
                "
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />

              {/* Bottom Right Path */}
              <path
                id="bottomRightPath"
                className="guide"
                d="
                  M-261 704.5
                  H32.574
                  C140.53 704.5 148.161 701.339 153.787 695.713
                  L367.328 482.172
                  C426.339 423.161 433.97 420 441.926 420
                  H641.926
                "
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />

              {/* Left-end circles with icons */}
              <g transform="translate(-299.5, 3.5)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiOpenai style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-196.5, 70.5)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiDocker style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-261, 135)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiStripe style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-299.5, 836)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiFirebase style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-196.5, 769)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiShopify style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-261, 704.5)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaAws style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>

              {/* Corner circles with icons */}
              <g transform="translate(52.574, 3.5)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 20 : 25} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -10 : -12.5} y={deviceType === 'mobile' ? -10 : -12.5} width={deviceType === 'mobile' ? 20 : 25} height={deviceType === 'mobile' ? 20 : 25} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaRobot style={{ width: deviceType === 'mobile' ? '20px' : '25px', height: deviceType === 'mobile' ? '20px' : '25px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(54.574, 70.5)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 20 : 25} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -10 : -12.5} y={deviceType === 'mobile' ? -10 : -12.5} width={deviceType === 'mobile' ? 20 : 25} height={deviceType === 'mobile' ? 20 : 25} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaBrain style={{ width: deviceType === 'mobile' ? '20px' : '25px', height: deviceType === 'mobile' ? '20px' : '25px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(32.574, 135)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 20 : 25} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -10 : -12.5} y={deviceType === 'mobile' ? -10 : -12.5} width={deviceType === 'mobile' ? 20 : 25} height={deviceType === 'mobile' ? 20 : 25} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaNetworkWired style={{ width: deviceType === 'mobile' ? '20px' : '25px', height: deviceType === 'mobile' ? '20px' : '25px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(52.574, 836)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 20 : 25} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -10 : -12.5} y={deviceType === 'mobile' ? -10 : -12.5} width={deviceType === 'mobile' ? 20 : 25} height={deviceType === 'mobile' ? 20 : 25} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCloud style={{ width: deviceType === 'mobile' ? '20px' : '25px', height: deviceType === 'mobile' ? '20px' : '25px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(54.574, 769)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 20 : 25} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -10 : -12.5} y={deviceType === 'mobile' ? -10 : -12.5} width={deviceType === 'mobile' ? 20 : 25} height={deviceType === 'mobile' ? 20 : 25} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GiArtificialIntelligence style={{ width: deviceType === 'mobile' ? '20px' : '25px', height: deviceType === 'mobile' ? '20px' : '25px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(32.574, 704.5)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 20 : 25} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -10 : -12.5} y={deviceType === 'mobile' ? -10 : -12.5} width={deviceType === 'mobile' ? 20 : 25} height={deviceType === 'mobile' ? 20 : 25} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RiSettings4Line style={{ width: deviceType === 'mobile' ? '20px' : '25px', height: deviceType === 'mobile' ? '20px' : '25px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>

              {/* Right-end circles with icons */}
              <g transform="translate(752.926, 379)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiZapier style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(704.426, 395.5)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiSlack style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(641.926, 419.5)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaNetworkWired style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(752.926, 460.5)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCloud style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(704.426, 444)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 25 : 30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -12.5 : -15} y={deviceType === 'mobile' ? -12.5 : -15} width={deviceType === 'mobile' ? 25 : 30} height={deviceType === 'mobile' ? 25 : 30} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GiArtificialIntelligence style={{ width: deviceType === 'mobile' ? '25px' : '30px', height: deviceType === 'mobile' ? '25px' : '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(641.926, 420)" style={{ zIndex: 2000 }}>
                <circle cx="0" cy="0" r={deviceType === 'mobile' ? 22 : 27} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={deviceType === 'mobile' ? -11 : -13.5} y={deviceType === 'mobile' ? -11 : -13.5} width={deviceType === 'mobile' ? 22 : 27} height={deviceType === 'mobile' ? 22 : 27} style={{ zIndex: 3000 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RiSettings4Line style={{ width: deviceType === 'mobile' ? '22px' : '27px', height: deviceType === 'mobile' ? '22px' : '27px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            </g>
          </svg>
        )}
      </div>
    </div>
  )
}