"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function AnimatedGridBg() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cellsGroupRef = useRef<SVGGElement | null>(null)
  const vLinesRef = useRef<SVGGElement | null>(null)
  const hLinesRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    // Config
    const CELL = 100, COLS = 20, ROWS = 14
    const cellsG = cellsGroupRef.current
    const vg = vLinesRef.current
    const hg = hLinesRef.current
    if (!cellsG || !vg || !hg) return

    // Clear in case of re-mount
    vg.innerHTML = ""
    hg.innerHTML = ""
    cellsG.innerHTML = ""

    // Draw grid lines
    for (let c = 0; c <= COLS; c++) {
      const x = c * CELL
      const ln = document.createElementNS('http://www.w3.org/2000/svg','line')
      ln.setAttribute('x1', String(x))
      ln.setAttribute('y1', '0')
      ln.setAttribute('x2', String(x))
      ln.setAttribute('y2', String(ROWS * CELL))
      vg.appendChild(ln)
    }
    for (let r = 0; r <= ROWS; r++) {
      const y = r * CELL
      const ln = document.createElementNS('http://www.w3.org/2000/svg','line')
      ln.setAttribute('x1', '0')
      ln.setAttribute('y1', String(y))
      ln.setAttribute('x2', String(COLS * CELL))
      ln.setAttribute('y2', String(y))
      hg.appendChild(ln)
    }

    // Create rect cells (animate fill-opacity)
    const rects: SVGRectElement[] = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg','rect')
        rect.setAttribute('x', String(c * CELL))
        rect.setAttribute('y', String(r * CELL))
        rect.setAttribute('width', String(CELL))
        rect.setAttribute('height', String(CELL))
        rect.setAttribute('fill', 'rgb(37,99,235)')
        rect.setAttribute('fill-opacity', '0')
        ;(rect.style as any).mixBlendMode = 'screen'
        cellsG.appendChild(rect)
        rects.push(rect)
      }
    }

    // Animation tuning
    const MIN_ON = 1.2,
          MAX_ON = 3.5,
          MIN_OFF = 0.25,
          MAX_OFF = 0.7,
          MAX_ALPHA = 0.95

    const delayedCalls: gsap.core.Tween[] = []

    function spark(rect: SVGRectElement) {
      const alpha = gsap.utils.random(0.15, MAX_ALPHA)
      const dur = gsap.utils.random(MIN_ON, MAX_ON)
      return gsap.timeline()
        .to(rect, { attr: { 'fill-opacity': alpha }, duration: dur * 0.5, ease: 'sine.out' })
        .to(rect, { attr: { 'fill-opacity': 0 }, duration: dur * 0.5, ease: 'sine.in' }, '>')
    }

    function loop() {
      const batchSize = gsap.utils.random(8, 10, 1)
      const chosen = gsap.utils.shuffle(rects.slice()).slice(0, batchSize)
      chosen.forEach(rect => {
        const dc = gsap.delayedCall(gsap.utils.random(0, 0.15), () => spark(rect))
        delayedCalls.push(dc as unknown as gsap.core.Tween)
      })
      const dc = gsap.delayedCall(gsap.utils.random(MIN_OFF, MAX_OFF), loop)
      delayedCalls.push(dc as unknown as gsap.core.Tween)
    }
    loop()

    // Subtle global micro-pulse
    const pulse = gsap.to(cellsG, {
      duration: 6,
      repeat: -1,
      yoyo: true,
      transformOrigin: '50% 50%',
      scale: 1.005,
      ease: 'sine.inOut'
    })

    return () => {
      // Cleanup animations and delayed calls
      pulse.kill()
      gsap.killTweensOf(rects)
      delayedCalls.forEach(dc => dc.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="w-full h-full">
        <svg viewBox="0 0 2000 1400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
          <defs>
            <style>{`.gline { stroke:#4c4e72; stroke-width:2; vector-effect:non-scaling-stroke }`}</style>
            <radialGradient id="fade" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
              <stop offset="75%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="vignette">
              <rect x="0" y="0" width="2000" height="1400" fill="url(#fade)" />
            </mask>
          </defs>

          <g ref={cellsGroupRef} id="cells" mask="url(#vignette)" />
          <g className="gline" mask="url(#vignette)">
            <g ref={vLinesRef} id="v" />
            <g ref={hLinesRef} id="h" />
          </g>
        </svg>
      </div>
    </div>
  )
}


