"use client"

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  avatar: string
  title: string
  content: string
  longContent?: string
  rating: number
  featured?: boolean
}

export default function Component() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Show all testimonials in the sidebar
  const visibleTestimonials = testimonials;

  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true);
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        setTestimonials(data);
        setSelectedTestimonial(data[0] || null);
      } catch {
        setTestimonials([]);
        setSelectedTestimonial(null);
      }
      setLoading(false);
    }
    fetchTestimonials();
  }, []);



  useEffect(() => {
    if (!testimonialsRef.current || testimonials.length === 0) return;
    
    const ctx = gsap.context(() => {
      // Initial entrance animations that play immediately
      gsap.set(".testimonial-card", { opacity: 0, y: 50, scale: 0.9 });
      gsap.set(".testimonials-header", { opacity: 0, y: 30 });
      gsap.set(".testimonials-sidebar", { opacity: 0, x: -50 });
      gsap.set(".testimonials-main-content", { opacity: 0, y: 50 });

      // Entrance sequence
      const tl = gsap.timeline();
      
      tl.to(".testimonials-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      })
      .to(".testimonials-sidebar", {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")
      .to(".testimonials-main-content", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")
      .to(".testimonial-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.2");

      // Scroll-triggered animations
      gsap.fromTo(
        ".testimonials-header",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonials-header",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Sidebar animations with staggered effect
      gsap.fromTo(
        ".testimonials-sidebar-item",
        { opacity: 0, x: -40, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".testimonials-sidebar",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Main content animation
      gsap.fromTo(
        ".testimonials-main-content",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonials-main-content",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, testimonialsRef);
    return () => ctx.revert();
  }, [testimonials.length]);

  if (loading) {
    return (
      <section className={`w-full min-h-screen flex items-center justify-center ${isDark ? "text-white" : "text-black"}`}>
        <div className={`text-xl ${isDark ? "text-white" : "text-black"}`}>Loading testimonials...</div>
      </section>
    );
  }

  if (!testimonials.length) {
    return (
      <section className={`w-full min-h-screen flex items-center justify-center ${isDark ? "text-white" : "text-black"}`}>
        <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[400px] px-4">
          <div className={`${isDark ? "border-zinc-800" : "border-zinc-200"} bg-transparent backdrop-blur-[3.1px] border rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-16 flex flex-col items-center w-full`}>
            <h2 className={`text-2xl sm:text-4xl font-extrabold mb-3 text-center tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>No Testimonials Yet</h2>
            <p className={`text-base sm:text-xl text-center max-w-2xl mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Be the first to leave feedback! Your testimonial will appear here in this beautiful, modern showcase.</p>
          </div>
        </div>
      </section>
    );
  }

 return (
  <section ref={testimonialsRef} className={`w-full min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative overflow-hidden flex items-center font-sans ${isDark ? "text-white" : "text-black"}`}>
    <div className="w-full max-w-[1700px] mx-auto relative z-10">
      {/* Header */}
      <div className="testimonials-header text-center mb-8 sm:mb-12">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-barlow mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
          Loved by developers worldwide
        </h1>
        <p className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Join thousands of developers who trust our platform to build amazing products
        </p>
      </div>

      {/* Main grid: Member list on left, testimonial card on right */}
      <div className="w-full max-w-[1700px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {/* Sidebar with testimonial list (left on large screens) */}
        <div className="testimonials-sidebar lg:col-span-1 space-y-3 sm:space-y-4 order-2 lg:order-1">
          {/* Glassy background container for sidebar */}
                     <div className={`px-3 py-4 rounded-2xl ${isDark ? 'bg-black/40' : 'bg-black/5'} border-blue-500/20 backdrop-blur-xl h-[650px] sm:h-[750px] transition-all duration-500 hover:border-blue-400/40 hover:shadow-blue-500/20 ${isDark ? 'shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'shadow-[0_4px_30px_rgba(0,0,0,0.05)]'}`}>
                         <div className="space-y-2 sm:space-y-3 h-[calc(100%-2rem)] overflow-y-auto pr-2 custom-scrollbar">
              {visibleTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
                  className={`testimonial-card testimonials-sidebar-item group relative overflow-hidden cursor-pointer transition-all duration-500 border rounded-3xl hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-black/40' : 'bg-black/5'} backdrop-blur-xl ${
                    selectedTestimonial?.id === testimonial.id
                      ? isDark
                        ? 'border-blue-400/60 shadow-blue-500/30'
                        : 'border-blue-400/60 shadow-blue-500/30'
                      : isDark
                        ? 'border-blue-500/20 hover:border-blue-400/40'
                        : 'border-blue-500/20 hover:border-blue-400/40'
              }`}
              onClick={() => setSelectedTestimonial(testimonial)}
            >
              {/* Decorative blue corners */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className={`absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 rounded-tr-xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
                <div className={`absolute bottom-3 left-3 w-7 h-7 border-l-2 border-b-2 rounded-bl-xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
              </div>
              <CardContent className="p-4 sm:p-6 relative">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className={`h-10 w-10 sm:h-14 sm:w-14 ring-2 transition-all duration-300 hover:scale-110 ${isDark ? "ring-white/20" : "ring-black/20"}`}>
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className={`${isDark ? "bg-white text-black" : "bg-black text-white"} font-semibold`}>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                        <p className={`text-sm sm:text-base font-semibold font-barlow truncate transition-colors duration-300 ${
                          selectedTestimonial?.id === testimonial.id
                            ? isDark ? 'text-blue-400' : 'text-blue-600'
                            : isDark ? 'text-white' : 'text-black'
                        }`}>
                      {testimonial.name}
                    </p>
                        <p className={`text-xs sm:text-sm truncate font-sans transition-colors duration-300 ${
                          selectedTestimonial?.id === testimonial.id
                            ? isDark ? 'text-blue-300/70' : 'text-blue-600/70'
                            : isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}


            </div>
          </div>
        </div>

        {/* Main testimonial content (right on large screens) */}
        <div className="testimonials-main-content lg:col-span-2 order-1 lg:order-2">
          {/* Glassy background container for main content */}
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-black/40' : 'bg-black/5'} border-blue-500/20 backdrop-blur-xl transition-all duration-500 hover:border-blue-400/40 hover:shadow-blue-500/20 ${isDark ? 'shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'shadow-[0_4px_30px_rgba(0,0,0,0.05)]'}`}>
                          <Card className={`testimonial-card group relative overflow-hidden ${isDark ? 'bg-black/40' : 'bg-black/5'} backdrop-blur-xl border-blue-500/20 shadow-xl h-full transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-blue-400/40 rounded-3xl`}>
              {/* Decorative corners */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className={`absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 rounded-tr-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
                <div className={`absolute bottom-6 left-6 w-10 h-10 border-l-2 border-b-2 rounded-bl-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
              </div>
              <CardContent className="p-6 sm:p-10 md:p-16 h-full flex flex-col justify-center relative">
                <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                  <div className="flex items-center justify-start">
                    <Quote className={`h-12 w-12 sm:h-16 sm:w-16 transition-all duration-300 hover:scale-110 ${isDark ? 'text-white' : 'text-black'}`} />
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-barlow leading-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
                      {selectedTestimonial?.title}
                    </h2>

                    <p className={`text-lg sm:text-xl md:text-2xl leading-relaxed font-light font-sans ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {selectedTestimonial?.content}
                    </p>

                    {selectedTestimonial?.longContent && (
                      <p className={`leading-relaxed text-base sm:text-lg md:text-xl font-sans transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
                        {selectedTestimonial.longContent}
                      </p>
                    )}
                  </div>

                  <div className={`flex items-center space-x-4 sm:space-x-6 pt-6 sm:pt-8 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                    <Avatar className={`h-12 w-12 sm:h-16 sm:w-16 ring-2 transition-all duration-300 hover:scale-110 ${isDark ? "ring-white/20" : "ring-black/20"}`}>
                      <AvatarImage
                        src={selectedTestimonial?.avatar || "/placeholder.svg"}
                        alt={selectedTestimonial?.name}
                      />
                      <AvatarFallback className={`${isDark ? "bg-white text-black" : "bg-black text-white"} font-semibold text-lg sm:text-xl font-barlow`}>
                        {selectedTestimonial?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={`font-semibold text-lg sm:text-xl font-barlow transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
                        {selectedTestimonial?.name}
                      </p>
                      <p className={`text-base sm:text-lg font-sans transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedTestimonial?.role} at {selectedTestimonial?.company}
                      </p>
                    </div>
                    {selectedTestimonial?.featured && (
                      <Badge className={`font-sans transition-all duration-300 hover:scale-110 ${isDark ? 'border-white/30 text-white bg-white/10' : 'border-black/30 text-black bg-black/10'}`}>
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
