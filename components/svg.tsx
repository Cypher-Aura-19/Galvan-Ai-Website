"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useTheme } from "./theme-provider"
// Left-side brand icons
import { SiOpenai, SiDocker, SiStripe, SiFirebase, SiShopify, SiFigma, SiPostman } from "react-icons/si";
import { FaAws } from "react-icons/fa";

// Right-side services & AI
import { SiZapier, SiSlack } from "react-icons/si";
import { FaRobot, FaBrain, FaNetworkWired } from "react-icons/fa"; // General AI/automation vibes

import { FaCloud } from "react-icons/fa"; // Cloud-based service (SaaS)

import { RiSettings4Line } from "react-icons/ri"; // Tech gear with circuit styling

import { GiArtificialIntelligence } from "react-icons/gi"; // AI-specific chip design

// Desktop tracks configuration
const tracks = [
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

// Mobile/Tablet tracks configuration
const tracksMobileTablet = [
  {
    pathId: "mobile-path1",
    color: "#156af2",
    dashLen: 15,
    gap: 15,
    speed: 200,
    freq: 0.6,
    start: 1,
    end: 15,
  },
  {
    pathId: "mobile-path2",
    color: "#156af2",
    dashLen: 15,
    gap: 12,
    speed: 180,
    freq: 0.6,
    start: 1,
    end: 15,
  },
  {
    pathId: "mobile-path3",
    color: "#156af2",
    dashLen: 15,
    gap: 8,
    speed: 170,
    freq: 0.6,
    start: 1,
    end: 15,
  },
  {
    pathId: "mobile-path4",
    color: "#156af2",
    dashLen: 15,
    gap: 15,
    speed: 160,
    freq: 0.6,
    start: 1,
    end: 15,
  },
  {
    pathId: "mobile-path5",
    color: "#156af2",
    dashLen: 15,
    gap: 8,
    speed: 140,
    freq: 0.6,
    start: 1,
    end: 15,
  },
  {
    pathId: "mobile-path6",
    color: "#156af2",
    dashLen: 15,
    gap: 12,
    speed: 150,
    freq: 0.6,
    start: 1,
    end: 15,
  },
]

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

  const startAnimation = () => {
    // Only run desktop animations on desktop
    if (deviceType !== 'desktop') return
    
    tracks.forEach(initTrack)
    const maxEnd = Math.max(...tracks.map((t) => t.end))
    autoRestartTimerRef.current = setTimeout(restartAnimation, (maxEnd + 1) * 1000)
  }

  const startMobileTabletAnimation = () => {
    // Only run mobile/tablet animations on mobile/tablet
    if (deviceType === 'desktop') return
    
    tracksMobileTablet.forEach(initMobileTabletTrack)
    const maxEnd = Math.max(...tracksMobileTablet.map((t) => t.end))
    autoRestartTimerRef.current = setTimeout(restartMobileTabletAnimation, (maxEnd + 1) * 1000)
  }

  const restartAnimation = () => {
    if (autoRestartTimerRef.current) {
      clearTimeout(autoRestartTimerRef.current)
      autoRestartTimerRef.current = null
    }

    activeTimersRef.current.forEach((id) => clearTimeout(id))
    activeTimersRef.current.clear()

    if (sceneRef.current) {
      // Only remove the animated dash paths, not the guide paths or icons
      const animatedPaths = sceneRef.current.querySelectorAll("path.animated-dash")
      animatedPaths.forEach((p) => p.remove())
    }

    startAnimation()
  }

  const restartMobileTabletAnimation = () => {
    if (autoRestartTimerRef.current) {
      clearTimeout(autoRestartTimerRef.current)
      autoRestartTimerRef.current = null
    }

    activeTimersRef.current.forEach((id) => clearTimeout(id))
    activeTimersRef.current.clear()

    if (sceneRef.current) {
      // Only remove the animated dash paths, not the guide paths or icons
      const animatedPaths = sceneRef.current.querySelectorAll("path.animated-dash")
      animatedPaths.forEach((p) => p.remove())
    }

    startMobileTabletAnimation()
  }

  const initTrack = (track: (typeof tracks)[0]) => {
    if (!sceneRef.current) return

    const guide = sceneRef.current.querySelector(`#${track.pathId}`) as SVGPathElement
    if (!guide) {
      console.warn(`Guide path #${track.pathId} not found`)
      return
    }

    const pathLength = guide.getTotalLength()
    const travel = pathLength + track.dashLen
    const dashDuration = travel / track.speed

    if (track.end <= track.start) {
      console.warn(`Track ${track.pathId} has end <= start; skipping.`)
      return
    }

    const firstLaunch = track.start * 1000
    const interval = track.freq * 1000
    const lastLaunch = Math.max(0, track.end - dashDuration) * 1000

    for (let t = firstLaunch; t <= lastLaunch + 1; t += interval) {
      const id = setTimeout(() => {
        launchDash(track, guide, pathLength, dashDuration)
        activeTimersRef.current.delete(id)
      }, t)
      activeTimersRef.current.add(id)
    }
  }

  const initMobileTabletTrack = (track: (typeof tracksMobileTablet)[0]) => {
    if (!sceneRef.current) return

    const guide = sceneRef.current.querySelector(`#${track.pathId}`) as SVGPathElement
    if (!guide) {
      console.warn(`Guide path #${track.pathId} not found`)
      return
    }

    const pathLength = guide.getTotalLength()
    const travel = pathLength + track.dashLen
    const dashDuration = travel / track.speed

    if (track.end <= track.start) {
      console.warn(`Track ${track.pathId} has end <= start; skipping.`)
      return
    }

    const firstLaunch = track.start * 1000
    const interval = track.freq * 1000
    const lastLaunch = Math.max(0, track.end - dashDuration) * 1000

    for (let t = firstLaunch; t <= lastLaunch + 1; t += interval) {
      const id = setTimeout(() => {
        launchMobileTabletDash(track, guide, pathLength, dashDuration)
        activeTimersRef.current.delete(id)
      }, t)
      activeTimersRef.current.add(id)
    }
  }

  const launchDash = (track: (typeof tracks)[0], guide: SVGPathElement, pathLength: number, dashDuration: number) => {
    if (!sceneRef.current) return

    const dash = document.createElementNS("http://www.w3.org/2000/svg", "path")
    dash.setAttribute("class", "animated-dash")
    dash.setAttribute("stroke", track.color)
    dash.setAttribute("stroke-width", "4")
    dash.setAttribute("fill", "none")
    dash.setAttribute("stroke-linecap", "round")
    dash.setAttribute("stroke-dasharray", `${track.dashLen} ${track.gap}`)

    sceneRef.current.appendChild(dash)

    gsap.fromTo(
      dash,
      {
        strokeDashoffset: -track.dashLen,
      },
      {
        strokeDashoffset: -(pathLength + track.dashLen),
        duration: dashDuration,
        ease: "none",
        onComplete: () => {
          if (dash.parentNode) {
            dash.parentNode.removeChild(dash)
          }
        },
      }
    )
  }

  const launchMobileTabletDash = (track: (typeof tracksMobileTablet)[0], guide: SVGPathElement, pathLength: number, dashDuration: number) => {
    if (!sceneRef.current) return

    const dash = document.createElementNS("http://www.w3.org/2000/svg", "path")
    dash.setAttribute("class", "animated-dash")
    dash.setAttribute("stroke", track.color)
    dash.setAttribute("stroke-width", "3")
    dash.setAttribute("fill", "none")
    dash.setAttribute("stroke-linecap", "round")
    dash.setAttribute("stroke-dasharray", `${track.dashLen} ${track.gap}`)

    sceneRef.current.appendChild(dash)

    gsap.fromTo(
      dash,
      {
        strokeDashoffset: -track.dashLen,
      },
      {
        strokeDashoffset: -(pathLength + track.dashLen),
        duration: dashDuration,
        ease: "none",
        onComplete: () => {
          if (dash.parentNode) {
            dash.parentNode.removeChild(dash)
          }
        },
      }
    )
  }

  useEffect(() => {
    if (deviceType === 'desktop') {
      startAnimation()
    } else {
      startMobileTabletAnimation()
    }

    return () => {
      if (autoRestartTimerRef.current) {
        clearTimeout(autoRestartTimerRef.current)
        autoRestartTimerRef.current = null
      }
      activeTimersRef.current.forEach((id) => clearTimeout(id))
      activeTimersRef.current.clear()
    }
  }, [deviceType, theme])

  // Responsive content based on device type
  const getResponsiveContent = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          title: "DESIGN. LAUNCH. SCALE.",
          subtitle: "",
          description: "AI that fits your vision, not the other way around.\nFrom design to scale, we build what your users will love.",
          buttonText: "Get Started",
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
            deviceType === 'mobile' ? 'min-w-[280px] max-w-[85vw] py-4 translate-y-16' :
            deviceType === 'tablet' ? 'min-w-[400px] max-w-[75vw] py-6 translate-y-20' :
            'min-w-[450px] max-w-[70vw] py-8 translate-y-16 -translate-x-4'
          }`}>
           <h1 className={`font-barlow ${content.titleSize} font-extrabold ${theme === 'dark' ? 'text-black' : 'text-white'} relative z-10 text-center ${
             deviceType === 'mobile' ? 'px-4 py-3' :
             deviceType === 'tablet' ? 'px-6 py-4' : 'px-8 py-6'
           }`}>
             <span className="relative inline-block px-3 py-2 md:px-4 md:py-4">
               <span className={`absolute inset-0 ${theme === 'dark' ? 'bg-white' : 'bg-black'} rounded-xl opacity-100 -z-10`} />
               {content.title}
             </span>
           </h1>

           <p className={`${content.subtitleSize} ${theme === 'dark' ? 'text-white' : 'text-black'} leading-relaxed text-center ${
             deviceType === 'mobile' ? 'max-w-[85vw]' :
             deviceType === 'tablet' ? 'max-w-[70vw]' :
             'max-w-[60ch]'
           }`}>
             <span className="block">{content.subtitle}</span>
           </p>

           <p className={`${content.descriptionSize} ${theme === 'dark' ? 'text-gray-300' : 'text-black'} leading-relaxed text-center ${
             deviceType === 'mobile' ? 'max-w-[85vw]' :
             deviceType === 'tablet' ? 'max-w-[70vw]' :
             'max-w-[60ch]'
           }`}>
             <span className="block">AI that fits your vision, not the other way around.</span>
             <span className="block">From design to scale, we build what your users will love.</span>
           </p>

            <button className={`${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} rounded-full mt-4 md:mt-8 ${content.buttonSize} font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 ${
              deviceType === 'mobile' ? 'hover:scale-105' :
              deviceType === 'tablet' ? 'hover:scale-110' : 'hover:scale-110'
            }`}>
              {content.buttonText}
            </button>
          </div>
        </div>

        {/* SVG with paths and icons - Only show background lines on desktop */}
        <svg
          ref={sceneRef}
          id="scene"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={deviceType === 'desktop' ? "-300 -50 2600 950" : "-300 -50 1300 950"}
          fill="none"
          className="w-full h-full"
          style={{ 
            maxWidth: '100%', 
            maxHeight: deviceType === 'mobile' ? '40vh' : 
                       deviceType === 'tablet' ? '50vh' : '60vh',
            minHeight: deviceType === 'mobile' ? 200 : 
                       deviceType === 'tablet' ? 250 : 350
          }}
        >
          {/* Paths - Only render on desktop */}
          {deviceType === 'desktop' && (
            <>
              <path
                id="path1"
                className="guide"
                d="M-299.5 3.5H152.574C160.53 3.5 168.161 6.6607 173.787 12.2868L258 96.5L531.713 370.213C537.339 375.839 544.97 379 552.926 379H1388.07C1396.03 379 1403.66 375.839 1409.29 370.213L1683 96.5L1770.21 9.2868C1775.84 3.66071 1783.47 0.5 1791.43 0.5H2243.5"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />
              <path
                id="path2"
                className="guide"
                d="M-196.5 70.5H154.574C162.53 70.5 170.161 73.6607 175.787 79.2868L258 161.5L483.213 386.713C488.839 392.339 496.47 395.5 504.426 395.5H1434.07C1442.03 395.5 1449.66 392.339 1455.29 386.713L1683 159L1762.71 79.2868C1768.34 73.6607 1775.97 70.5 1783.93 70.5H2135"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />
              <path
                id="path3"
                className="guide"
                d="M-261 135H132.574C140.53 135 148.161 138.161 153.787 143.787L420.713 410.713C426.339 416.339 433.97 419.5 441.926 419.5H1492.57C1500.53 419.5 1508.16 416.339 1513.79 410.713L1780.71 143.787C1786.34 138.161 1793.97 135 1801.93 135H2191"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />
              <path
                id="path4"
                className="guide"
                d="M-299.5 836H152.574C160.53 836 168.161 832.839 173.787 827.213L258 743L531.713 469.287C537.339 463.661 544.97 460.5 552.926 460.5H1388.07C1396.03 460.5 1403.66 463.661 1409.29 469.287L1683 743L1770.21 830.213C1775.84 835.839 1783.47 839 1791.43 839H2243.5"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />
              <path
                id="path5"
                className="guide"
                d="M-196.5 769H154.574C162.53 769 170.161 765.839 175.787 760.213L258 678L483.213 452.787C488.839 447.161 496.47 444 504.426 444H1434.07C1442.03 444 1449.66 447.161 1455.29 452.787L1683 680.5L1762.71 760.213C1768.34 765.839 1775.97 769 1783.93 769H2135"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />
              <path
                id="path6"
                className="guide"
                d="M-261 704.5H132.574C140.53 704.5 148.161 701.339 153.787 695.713L420.713 428.787C426.339 423.161 433.97 420 441.926 420H1492.57C1500.53 420 1508.16 423.161 1513.79 428.787L1780.71 695.713C1786.34 701.339 1793.97 704.5 1801.93 704.5H2191"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="6"
                fill="none"
              />

              {/* Left‐end icons (circle then icon) - Only render on desktop */}
              <g transform="translate(-299.5, 3.5)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiOpenai style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-196.5, 70.5)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiDocker style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-261, 135)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiStripe style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-299.5, 836)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiFirebase style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-196.5, 769)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiShopify style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(-261, 704.5)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaAws style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>

              {/* Right‐end icons - Only render on desktop */}
              <g transform="translate(2243.5, 0.5)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiZapier style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(2135, 70.5)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SiSlack style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(2191, 135)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaNetworkWired style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(2243.5, 839)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCloud style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(2135, 769)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={35} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-17.5} y={-17.5} width={35} height={35}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GiArtificialIntelligence style={{ width: '35px', height: '35px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
              <g transform="translate(2191, 704.5)" style={{ zIndex: 1000 }}>
                <circle cx="0" cy="0" r={30} fill={theme === 'dark' ? 'white' : 'black'} />
                <foreignObject x={-15} y={-15} width={30} height={30}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RiSettings4Line style={{ width: '30px', height: '30px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                  </div>
                </foreignObject>
              </g>
            </>
          )}

          {/* Mobile/Tablet Paths with animated tracks */}
          {(deviceType === 'mobile' || deviceType === 'tablet') && (
            <g transform="rotate(90 170 525)">
              {/* Starting circles */}
              <circle cx="-199.5" cy="3.5" r="32" fill={theme === 'dark' ? 'white' : 'black'} />
              <circle cx="-96.5" cy="70.5" r="32" fill={theme === 'dark' ? 'white' : 'black'} />
              <circle cx="-161" cy="135" r="32" fill={theme === 'dark' ? 'white' : 'black'} />
              <circle cx="-199.5" cy="636" r="32" fill={theme === 'dark' ? 'white' : 'black'} />
              <circle cx="-96.5" cy="569" r="32" fill={theme === 'dark' ? 'white' : 'black'} />
              <circle cx="-161" cy="504.5" r="32" fill={theme === 'dark' ? 'white' : 'black'} />
              
              {/* Icons on top of circles */}
              <foreignObject x="-215.5" y="-12.5" width="32" height="32">
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiShopify style={{ width: '28px', height: '28px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                </div>
              </foreignObject>
              
              <foreignObject x="-112.5" y="54.5" width="32" height="32">
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiFigma style={{ width: '28px', height: '28px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                </div>
              </foreignObject>
              
              <foreignObject x="-177" y="119" width="32" height="32">
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiPostman style={{ width: '28px', height: '28px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                </div>
              </foreignObject>
              
              <foreignObject x="-215.5" y="620" width="32" height="32">
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiOpenai style={{ width: '28px', height: '28px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                </div>
              </foreignObject>
              
              <foreignObject x="-112.5" y="553" width="32" height="32">
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiDocker style={{ width: '28px', height: '28px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                </div>
              </foreignObject>
              
              <foreignObject x="-177" y="488.5" width="32" height="32">
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SiStripe style={{ width: '28px', height: '28px', color: theme === 'dark' ? '#000000' : '#ffffff' }} />
                </div>
              </foreignObject>
              
              {/* Background paths */}
              <path
                id="mobile-path1"
                className="guide"
                d="M-199.5 3.5 H52.574 C160.53 3.5 168.161 6.6607 173.787 12.2868 L241.157 79.657 L431.713 270.213 C437.339 275.839 444.97 279 452.926 279 H652.926"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="4"
                fill="none"
              />
              <path
                id="mobile-path2"
                className="guide"
                d="M-96.5 70.5 H54.574 C162.53 70.5 170.161 73.6607 175.787 79.2868 L241.557 145.057 L383.213 286.713 C388.839 292.339 396.47 295.5 404.426 295.5 H604.426"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="4"
                fill="none"
              />
              <path
                id="mobile-path3"
                className="guide"
                d="M-161 135 H32.574 C140.53 135 148.161 138.161 153.787 143.787 L267.328 257.328 C326.339 316.339 333.97 319.5 341.926 319.5 H541.926"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="4"
                fill="none"
              />
              <path
                id="mobile-path4"
                className="guide"
                d="M-199.5 636 H52.574 C160.53 636 168.161 632.839 173.787 627.213 L241.157 559.843 L431.713 369.287 C437.339 363.661 444.97 360.5 452.926 360.5 H652.926"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="4"
                fill="none"
              />
              <path
                id="mobile-path5"
                className="guide"
                d="M-96.5 569 H54.574 C162.53 569 170.161 565.839 175.787 560.213 L241.557 494.443 L383.213 352.787 C388.839 347.161 396.47 344 404.426 344 H604.426"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="4"
                fill="none"
              />
              <path
                id="mobile-path6"
                className="guide"
                d="M-161 504.5 H32.574 C140.53 504.5 148.161 501.339 153.787 495.713 L267.328 382.172 C326.339 323.161 333.97 320 341.926 320 H541.926"
                stroke={theme === 'dark' ? 'white' : 'black'}
                strokeWidth="4"
                fill="none"
              />
              

            </g>
          )}
        </svg>
      </div>
    </div>
  )
}