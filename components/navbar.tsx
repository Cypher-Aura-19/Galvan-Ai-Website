"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <section
      className={`fixed top-0 left-0 z-50 w-screen overflow-hidden isolate border-b border-[rgba(255,255,255,0.15)] shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-[24px] saturate-[180%] ${isDark ? 'text-white' : 'text-black'}`}
      style={{ background: 'rgba(255,255,255,0.05)' }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-[-100px] -z-10 pointer-events-none opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23f)' opacity='0.9'/></svg>\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0 1px, rgba(0,0,0,0) 1px 2px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, rgba(0,0,0,0) 1px 3px)'
        }}
      />
      <header className={`w-full ${isDark ? 'text-white' : 'text-black'} relative py-3 animate-fade-in-down`}> 
        <div className="flex h-14 items-center justify-between w-full px-6">
          <Link href="#" className="flex items-center space-x-2" prefetch={false}>
            <img src="/Galvan AI logo transparent.png" alt="Galvan AI Logo" className="h-10 w-auto" />
            <span className={`text-2xl font-extrabold tracking-tight font-barlow ${isDark ? 'text-white' : 'text-black'}`}>Galvan AI</span>
          </Link>
          <nav className="hidden lg:flex items-center space-x-10">
            {['Projects','Services','Blogs','Team','Testimonials','Contact','Newsletter','Careers'].map((item, idx) => (
              <a key={idx} href={`#${item.toLowerCase()}`} className={`text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors whitespace-nowrap`}>{item}</a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center space-x-4">
            <a href="#contact">
              <Button className="bg-[#156af2] text-white hover:bg-[#0f4dbd] rounded-xl px-8 py-3 text-lg font-medium font-barlow">Get a Quote</Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`rounded-full w-14 h-14 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-gray-700' : 'text-gray-600 hover:text-black hover:bg-gray-200/50 border border-gray-300'} transition-all duration-300 hover:scale-110 shadow-lg`}
            >
              {isDark ? <Sun className="h-10 w-10" /> : <Moon className="h-10 w-10" />}
            </Button>
          </div>
          <div className="lg:hidden">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full w-11 h-11 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' : 'text-gray-600 hover:text-black hover:bg-gray-200/50'}`}
                >
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className={`${isDark ? 'bg-black bg-opacity-90 text-white border-r border-gray-800' : 'bg-white bg-opacity-95 text-black border-r border-gray-200'} backdrop-blur-lg shadow-2xl`}>
                <nav className="flex flex-col space-y-2 p-6">
                  {['Projects','Services','Blogs','Team','Testimonials','Contact','Newsletter','Careers'].map((item, idx) => (
                    <a key={idx} href={`#${item.toLowerCase()}`} className={`py-2 text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} onClick={() => setMobileNavOpen(false)}>{item}</a>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 p-6">
                  <a href="#contact">
                    <Button className="bg-[#156af2] text-white hover:bg-[#0f4dbd] rounded-xl px-8 py-3 text-lg font-medium font-barlow w-full">Get a Quote</Button>
                  </a>
                  <Button variant="ghost" onClick={toggleTheme} className={`rounded-full ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-gray-700' : 'text-gray-600 hover:text-black hover:bg-gray-200/50 border border-gray-300'} w-full justify-center items-center transition-all duration-300 hover:scale-105 py-3`}>
                    {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                    <span className="ml-3">Theme</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </section>
  )
}
