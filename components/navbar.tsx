"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <section className={`fixed top-0 z-50 w-full ${isDark ? 'text-white' : 'text-black'} bg-transparent backdrop-blur-[2.1px] rounded-[16px] ${isDark ? 'shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'shadow-[0_4px_30px_rgba(0,0,0,0.05)]'}`}>
      <header className={`w-full ${isDark ? 'text-white' : 'text-black'} relative overflow-hidden py-3 animate-fade-in-down`}>
        <div className="flex h-14 items-center justify-between w-full px-0 mx-0 max-w-none">
          {/* Logo - Left Corner (Adjusted font weight) */}
          <Link href="#" className="flex items-center space-x-2 pl-6" prefetch={false}>
            <div className="flex items-center space-x-2">
              <img src="/Galvan AI logo transparent.png" alt="Galvan AI Logo" className="h-10 w-auto" />
              <span className={`text-2xl font-extrabold tracking-tight font-barlow ${isDark ? 'text-white' : 'text-black'}`}>Galvan AI</span>
            </div>
          </Link>
          {/* Navigation Items - Center (Made bolder) */}
          <nav className="hidden lg:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
            <a href="/projects" className={`text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors whitespace-nowrap`}>Projects</a>
            <a href="#services" className={`text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors whitespace-nowrap`}>Services</a>
            <a href="#blogs" className={`text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors whitespace-nowrap`}>Blogs</a>
            <a href="#team" className={`text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors whitespace-nowrap`}>Team</a>
            <a href="#testimonials" className={`text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors whitespace-nowrap`}>Testimonials</a>
            <a href="#contact" className={`text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors whitespace-nowrap`}>Contact</a>
            <a href="#newsletter" className={`text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors whitespace-nowrap`}>Newsletter</a>
            <a href="/careers" className={`text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors whitespace-nowrap`}>Careers</a>
          </nav>
          {/* Buttons - Right Corner (Removed multilingual) */}
          <div className="hidden lg:flex items-center space-x-4 pr-6">
            {/* Get a Quote Button - Pill Shaped */}
            <Button className="bg-[#156af2] text-white hover:bg-[#0f4dbd] rounded-xl px-8 py-3 text-lg font-medium font-barlow">
              {" "}
              Get a Quote
            </Button>
            {/* Theme Toggle Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`rounded-full w-14 h-14 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-gray-700' : 'text-gray-600 hover:text-black hover:bg-gray-200/50 border border-gray-300'} transition-all duration-300 hover:scale-110 shadow-lg`}
            >
              {isDark ? <Sun className="h-10 w-10" /> : <Moon className="h-10 w-10" />}
            </Button>
          </div>
          {/* Mobile Menu Button - Hamburger */}
          <div className="lg:hidden pr-6">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full w-11 h-11 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' : 'text-gray-600 hover:text-black hover:bg-gray-200/50'}`}
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className={`p-0 w-64 ${isDark ? 'bg-black bg-opacity-90 text-white border-r border-gray-800' : 'bg-white bg-opacity-95 text-black border-r border-gray-200'} backdrop-blur-lg shadow-2xl`}>
                <div className="flex flex-col h-full">
                  <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <img src="/Galvan AI logo transparent.png" alt="Galvan AI Logo" className="h-10 w-auto" />
                  </div>
                                    <nav className="flex flex-col space-y-2 px-6 py-4">
                   <a href="/projects" className={`py-2 text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} onClick={() => setMobileNavOpen(false)}>Projects</a>
                      <a href="#services" className={`py-2 text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} onClick={() => setMobileNavOpen(false)}>Services</a>
                      <a href="#blogs" className={`py-2 text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} onClick={() => setMobileNavOpen(false)}>Blogs</a>
                      <a href="#team" className={`py-2 text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} onClick={() => setMobileNavOpen(false)}>Team</a>
                      <a href="#testimonials" className={`py-2 text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} onClick={() => setMobileNavOpen(false)}>Testimonials</a>
                      <a href="#contact" className={`py-2 text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} onClick={() => setMobileNavOpen(false)}>Contact</a>
                      <a href="#newsletter" className={`py-2 text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} onClick={() => setMobileNavOpen(false)}>Newsletter</a>
                      <a href="/careers" className={`py-2 text-lg font-light font-barlow ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} onClick={() => setMobileNavOpen(false)}>Careers</a>
                  </nav>
                  <div className="flex flex-col gap-3 px-6 pb-6">
                    <Button className="bg-[#156af2] text-white hover:bg-[#0f4dbd] rounded-xl px-8 py-3 text-lg font-medium font-barlow w-full">Get a Quote</Button>
                    <Button variant="ghost" onClick={toggleTheme} className={`rounded-full ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-gray-700' : 'text-gray-600 hover:text-black hover:bg-gray-200/50 border border-gray-300'} w-full justify-center items-center transition-all duration-300 hover:scale-105 py-3`}>
                      {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                      <span className="ml-3">Theme</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </section>
  )
}
