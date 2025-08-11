"use client"

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Quote, ArrowRight, Star, Sparkles } from "lucide-react"
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

      // Badge and icon animations
      gsap.fromTo(
        ".testimonials-badge",
        { opacity: 0, scale: 0.8, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".testimonials-badge",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Sparkles icon animation
      gsap.fromTo(
        ".testimonials-sparkles",
        { opacity: 0, scale: 0, rotation: -180 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".testimonials-sparkles",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, testimonialsRef);
    return () => ctx.revert();
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : isDark ? "text-gray-600" : "text-gray-400"}`} />
    ))
  }

  if (loading) {
    return (
      <section className={`w-full min-h-screen flex items-center justify-center ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className={`text-xl ${isDark ? "text-white" : "text-black"}`}>Loading testimonials...</div>
      </section>
    );
  }

  if (!testimonials.length) {
    return (
      <section className={`w-full min-h-screen flex items-center justify-center ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[400px] px-4">
          <div className={`${isDark ? "bg-black border-zinc-800" : "bg-white border-zinc-200"} border rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-16 flex flex-col items-center w-full`}>
            <h2 className={`text-2xl sm:text-4xl font-extrabold mb-3 text-center tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>No Testimonials Yet</h2>
            <p className={`text-base sm:text-xl text-center max-w-2xl mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Be the first to leave feedback! Your testimonial will appear here in this beautiful, modern showcase.</p>
          </div>
        </div>
      </section>
    );
  }

 return (
  <section ref={testimonialsRef} className={`w-full min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative overflow-hidden flex items-center font-sans ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
    <div className="w-full max-w-[1700px] mx-auto relative z-10">
      {/* Header */}
      <div className="testimonials-header text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <Sparkles className={`testimonials-sparkles h-5 w-5 sm:h-6 sm:w-6 ${isDark ? "text-white" : "text-black"} mr-2`} />
          <Badge
            variant="outline"
            className={`testimonials-badge font-sans ${isDark ? 'border-white/30 text-white bg-white/10' : 'border-black/30 text-black bg-black/10'}`}
          >
            Testimonials
          </Badge>
        </div>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-barlow mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
          Loved by developers worldwide
        </h1>
        <p className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Join thousands of developers who trust our platform to build amazing products
        </p>
      </div>

      {/* In the main grid, ensure sidebar is always first (left) and main testimonial content is second (right) */}
      <div className="w-full max-w-[1700px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {/* Sidebar with testimonial list */}
        <div className="testimonials-sidebar lg:col-span-1 space-y-3 sm:space-y-4 order-1 lg:order-1">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className={`testimonial-card testimonials-sidebar-item cursor-pointer transition-all duration-500 border hover:scale-105 hover:shadow-2xl ${
                selectedTestimonial?.id === testimonial.id
                  ? isDark 
                    ? "bg-white/10 border-white shadow-lg"
                    : "bg-black/10 border-black shadow-lg"
                  : isDark
                    ? "bg-black border-white/20 hover:bg-white/5 hover:border-white/40"
                    : "bg-white border-black/20 hover:bg-black/5 hover:border-black/40"
              }`}
              onClick={() => setSelectedTestimonial(testimonial)}
            >
              <CardContent className="p-4 sm:p-6">
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
                    <p className={`text-sm sm:text-base font-semibold font-barlow truncate ${isDark ? 'text-white' : 'text-black'}`}>
                      {testimonial.name}
                    </p>
                    <p className={`text-xs sm:text-sm truncate font-sans ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.role} at {testimonial.company}
                    </p>
                    <div className="flex items-center mt-1 sm:mt-2">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className={`testimonial-card testimonials-sidebar-item w-full p-4 sm:p-5 h-auto font-normal text-sm sm:text-base group transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                  isDark 
                    ? "text-white hover:text-white hover:bg-white/10" 
                    : "text-black hover:text-black hover:bg-black/10"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>View other testimonials</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className={`${isDark ? 'bg-black border-white text-white' : 'bg-white border-black text-black'} max-w-6xl max-h-[80vh] overflow-y-auto`}>
              <DialogHeader>
                <DialogTitle className={`text-xl sm:text-2xl font-bold font-barlow text-white`}>
                  All Testimonials
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className={`${isDark ? "bg-black border-white/20 hover:bg-white/5" : "bg-white border-black/20 hover:bg-black/5"} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                        <Avatar className={`h-8 w-8 sm:h-10 sm:w-10 ring-2 ${isDark ? "ring-white/20" : "ring-black/20"}`}>
                          <AvatarImage
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                          />
                          <AvatarFallback className={`${isDark ? "bg-white text-black" : "bg-black text-white"} font-barlow`}>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`font-semibold font-barlow text-sm sm:text-base ${isDark ? 'text-white' : 'text-black'}`}>
                            {testimonial.name}
                          </p>
                          <p className={`text-xs sm:text-sm font-sans ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mb-2 sm:mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      <h3 className={`font-extrabold mb-2 font-barlow text-sm sm:text-base ${isDark ? 'text-white' : 'text-black'}`}>
                        {testimonial.title}
                      </h3>
                      <p className={`text-xs sm:text-sm font-sans ${isDark ? 'text-white' : 'text-black'}`}>
                        {testimonial.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main testimonial content */}
        <div className="testimonials-main-content lg:col-span-2 order-2 lg:order-2">
          <Card className={`testimonial-card ${isDark ? 'bg-black border-white/20' : 'bg-white border-black/20'} shadow-xl h-full transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]`}>
            <CardContent className="p-6 sm:p-10 md:p-16 h-full flex flex-col justify-center">
              <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                <div className="flex items-center justify-between">
                  <Quote className={`h-12 w-12 sm:h-16 sm:w-16 transition-all duration-300 hover:scale-110 ${isDark ? "text-white" : "text-black"}`} />
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedTestimonial?.rating || 0)}
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-barlow leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    {selectedTestimonial?.title}
                  </h2>

                  <p className={`text-lg sm:text-xl md:text-2xl leading-relaxed font-light font-sans ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {selectedTestimonial?.content}
                  </p>

                  {selectedTestimonial?.longContent && (
                    <p className={`leading-relaxed text-base sm:text-lg md:text-xl font-sans ${isDark ? 'text-white' : 'text-black'}`}>
                      {selectedTestimonial.longContent}
                    </p>
                  )}
                </div>

                <div className={`flex items-center space-x-4 sm:space-x-6 pt-6 sm:pt-8 border-t ${isDark ? "border-white/10" : "border-black/10"}`}>
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
                    <p className={`font-semibold text-lg sm:text-xl font-barlow ${isDark ? 'text-white' : 'text-black'}`}>
                      {selectedTestimonial?.name}
                    </p>
                    <p className={`text-base sm:text-lg font-sans ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
  </section>
);

}
