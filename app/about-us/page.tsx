"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from "@/components/theme-provider";
import AnimatedGridBg from "@/components/AnimatedGridBg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Target, 
  Zap, 
  Globe, 
  Award, 
  Lightbulb, 
  Code, 
  Rocket,
  CheckCircle,
  ArrowRight,
  Sun,
  Moon,
  Home,
  ChevronLeft,
  ChevronRight,
  Play,
  ImageIcon,
  // Modern icons - only valid ones
  Brain,
  Sparkles,
  TrendingUp,
  Shield,
  Cpu,
  Database,
  Cloud,
  Star,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

const AboutUsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const aboutRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gallery data
  const galleryItems = [
    {
      type: 'image',
      src: '/img1.jpeg',
      alt: 'Team collaboration session',
      caption: 'Our team brainstorming innovative solutions'
    },
    {
      type: 'image',
      src: '/img2.jpeg',
      alt: 'Client presentation',
      caption: 'Presenting AI solutions to clients'
    },
    {
      type: 'image',
      src: '/img3.jpeg',
      alt: 'Development workspace',
      caption: 'Where magic happens - our development hub'
    },
    {
      type: 'image',
      src: '/img4.jpeg',
      alt: 'Project planning',
      caption: 'Strategic planning for client projects'
    },
    {
      type: 'image',
      src: '/img5.jpeg',
      alt: 'Team celebration',
      caption: 'Celebrating successful project launches'
    },
    {
      type: 'image',
      src: '/img6.jpeg',
      alt: 'Innovation workshop',
      caption: 'Exploring cutting-edge AI technologies'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  useEffect(() => {
    if (!aboutRef.current) return;
    
    const ctx = gsap.context(() => {
      // Initial entrance animations
      gsap.set(".about-element", { opacity: 0, y: 80, scale: 0.95 });
      gsap.set(".about-header", { opacity: 0, y: 100, scale: 0.9 });
      gsap.set(".about-section", { opacity: 0, y: 120, scale: 0.9 });
      gsap.set(".gallery-item", { opacity: 0, x: 100, scale: 0.8 });

      // Entrance sequence
      const tl = gsap.timeline();
      
      tl.to(".about-header", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power4.out"
      })
      .to(".about-section", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
      }, "-=1.0")
      .to(".about-element", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        stagger: 0.2,
        ease: "back.out(1.7)"
      }, "-=0.8")
      .to(".gallery-item", {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.0,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.6");

      // Enhanced scroll-triggered animations
      gsap.utils.toArray(".about-section").forEach((section, index) => {
        gsap.fromTo(
          section,
          { 
            opacity: 0, 
            y: 100, 
            scale: 0.95,
            rotationX: 15
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
              scrub: 1,
            },
          }
        );
      });

      // Parallax effect for gallery
      gsap.to(".gallery-container", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".gallery-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Text reveal animations
      gsap.utils.toArray(".reveal-text").forEach((text) => {
        gsap.fromTo(
          text,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: text,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

    }, aboutRef);
    
    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: Brain,
      title: "Innovation First",
      description: "We push boundaries and explore cutting-edge technologies to deliver solutions that set new industry standards."
    },
    {
      icon: Users,
      title: "Client Partnership",
      description: "We build long-term relationships, understanding your business deeply to create solutions that truly matter."
    },
    {
      icon: Zap,
      title: "Speed & Quality",
      description: "We deliver exceptional results quickly without compromising on the quality that your business deserves."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "Our diverse team brings international insights to solve complex challenges with innovative approaches."
    }
  ];

  const achievements = [
    {
      icon: TrendingUp,
      title: "50+ Projects Delivered",
      description: "Successfully completed projects across various industries and technologies."
    },
    {
      icon: Shield,
      title: "25+ Global Clients",
      description: "Trusted by businesses worldwide to transform their digital presence."
    },
    {
      icon: Cpu,
      title: "7+ Years Experience",
      description: "Deep expertise in AI, automation, and enterprise software development."
    },
    {
      icon: Star,
      title: "98% Client Satisfaction",
      description: "Consistently exceeding expectations and delivering measurable results."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Strategy",
      description: "We dive deep into your business needs, challenges, and goals to create a comprehensive strategy."
    },
    {
      step: "02",
      title: "Design & Architecture",
      description: "Our experts design scalable, user-centric solutions with modern architecture patterns."
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "We build with precision, using agile methodologies and comprehensive testing protocols."
    },
    {
      step: "04",
      title: "Launch & Support",
      description: "Smooth deployment followed by ongoing support and optimization to ensure long-term success."
    }
  ];

  return (
    <div 
      ref={aboutRef}
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
    >
      {/* === Animated Grid Background === */}
      <AnimatedGridBg />
      
      {/* === Foreground Page Content === */}
      <div className="relative z-10">
        <Navbar />
        <main>
      {/* Header Section */}
          <section className="about-header w-full pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative pt-20 lg:pt-24">
        <div className="w-full max-w-[1700px] mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
          <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 sm:mb-10 tracking-tight font-barlow ${isDark ? "text-white" : "text-black"} leading-tight`}>
            About Galvan AI
          </h1>
          <p className={`text-xl sm:text-2xl md:text-3xl max-w-5xl mx-auto leading-relaxed font-light ${isDark ? "text-white/90" : "text-black/90"} reveal-text`}>
            We are a team of passionate innovators, engineers, and designers dedicated to transforming businesses through intelligent AI solutions and cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Our Story & Gallery Section */}
      <section className="about-section w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 gallery-section">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Our Story - Left Side */}
            <div className="about-element space-y-8 order-2 lg:order-1">
              <div className="space-y-6">
                <h2 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-barlow leading-tight ${isDark ? "text-white" : "text-black"}`}>
                  Our Story
                </h2>
                <p className={`text-lg sm:text-xl leading-relaxed font-light ${isDark ? "text-white/80" : "text-black/80"} reveal-text`}>
                  Founded in 2017, Galvan AI began as a small team of AI researchers and software engineers with a shared vision: to make artificial intelligence accessible and practical for businesses of all sizes.
                </p>
                <p className={`text-lg sm:text-xl leading-relaxed font-light ${isDark ? "text-white/80" : "text-black/80"} reveal-text`}>
                  What started as a passion project has grown into a full-service AI consultancy, helping companies across the globe transform their operations through intelligent automation, predictive analytics, and cutting-edge machine learning solutions.
                </p>
                <p className={`text-lg sm:text-xl leading-relaxed font-light ${isDark ? "text-white/80" : "text-black/80"} reveal-text`}>
                  Today, we're proud to have delivered over 50 successful projects, serving clients from startups to Fortune 500 companies, always maintaining our commitment to innovation, quality, and genuine partnership.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${isDark ? "bg-green-400" : "bg-green-600"}`}></div>
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Started with 3 passionate engineers
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${isDark ? "bg-blue-400" : "bg-blue-600"}`}></div>
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Grew to 25+ AI specialists and developers
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${isDark ? "bg-purple-400" : "bg-purple-600"}`}></div>
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Expanded to 3 international offices
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${isDark ? "bg-orange-400" : "bg-orange-600"}`}></div>
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Became trusted AI partner for global brands
                  </span>
                </div>
              </div>
            </div>
            
            {/* Gallery - Right Side */}
            <div className="about-element order-1 lg:order-2 gallery-container">
              <div className="relative group">
                {/* Gallery Display */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/20 to-gray-800/20 backdrop-blur-sm border border-white/10">
                  <div className="aspect-[4/3] relative">
                    {galleryItems.map((item, index) => (
                      <div
                        key={index}
                        className={`gallery-item absolute inset-0 transition-all duration-700 ease-in-out ${
                          index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                      >
                        {item.type === 'image' ? (
                          <div className="relative w-full h-full">
                            <img
                              src={item.src}
                              alt={item.alt}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <p className="text-white text-sm font-medium">{item.caption}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <Play className="h-16 w-16 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Gallery Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {galleryItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? isDark ? 'bg-white' : 'bg-black'
                          : isDark ? 'bg-white/30' : 'bg-black/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-section w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Mission Card */}
            <div className="about-element group">
              <div className={`relative overflow-hidden rounded-3xl p-8 lg:p-10 border transition-all duration-500 hover:scale-[1.02] ${
                isDark 
                  ? 'bg-black/40 backdrop-blur-xl border-blue-500/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20' 
                  : 'bg-black/5 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20'
              }`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 rounded-tr-3xl border-blue-400/30"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 rounded-bl-3xl border-blue-400/30"></div>
                </div>
                
                <div className="relative space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isDark ? 'bg-blue-500/20 border border-blue-400/40' : 'bg-blue-100 border border-blue-200'
                    }`}>
                      <Target className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <h2 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-barlow leading-tight ${isDark ? "text-white" : "text-black"}`}>
                      Our Mission
                    </h2>
                  </div>
                  
                  <p className={`text-lg sm:text-xl leading-relaxed font-light ${isDark ? "text-white/80" : "text-black/80"} reveal-text`}>
                    To democratize AI technology and make it accessible to businesses of all sizes. We believe that every company deserves access to intelligent solutions that can drive growth, efficiency, and innovation.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      "Building scalable AI solutions that grow with your business",
                      "Delivering measurable ROI through intelligent automation",
                      "Creating user experiences that people love to use"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 group/item">
                        <div className={`w-2 h-2 rounded-full mt-3 transition-all duration-300 ${
                          isDark ? 'bg-blue-400' : 'bg-blue-500'
                        } group-hover/item:scale-150`}></div>
                        <span className={`text-base transition-all duration-300 ${isDark ? "text-white/90" : "text-black/90"} group-hover/item:text-blue-400 group-hover/item:translate-x-1`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vision Card */}
            <div className="about-element group">
              <div className={`relative overflow-hidden rounded-3xl p-8 lg:p-10 border transition-all duration-500 hover:scale-[1.02] ${
                isDark 
                  ? 'bg-black/40 backdrop-blur-xl border-blue-500/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20' 
                  : 'bg-black/5 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20'
              }`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 rounded-tl-3xl border-blue-400/30"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 rounded-br-3xl border-blue-400/30"></div>
                </div>
                
                <div className="relative space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isDark ? 'bg-blue-500/20 border border-blue-400/40' : 'bg-blue-100 border border-blue-200'
                    }`}>
                      <Cloud className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <h2 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-barlow leading-tight ${isDark ? "text-white" : "text-black"}`}>
                      Our Vision
                    </h2>
                  </div>
                  
                  <p className={`text-lg sm:text-xl leading-relaxed font-light ${isDark ? "text-white/80" : "text-black/80"} reveal-text`}>
                    To be the leading force in AI-driven business transformation, creating a future where technology seamlessly enhances human potential and drives sustainable business growth across all industries.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      "Pioneering next-generation AI applications",
                      "Building sustainable technology ecosystems",
                      "Empowering businesses through intelligent innovation"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 group/item">
                        <div className={`w-2 h-2 rounded-full mt-3 transition-all duration-300 ${
                          isDark ? 'bg-blue-400' : 'bg-blue-500'
                        } group-hover/item:scale-150`}></div>
                        <span className={`text-base transition-all duration-300 ${isDark ? "text-white/90" : "text-black/90"} group-hover/item:text-blue-400 group-hover/item:translate-x-1`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-section w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
              <span className={`text-sm font-medium uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                What Drives Us
              </span>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
            </div>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-barlow mb-8 leading-tight ${isDark ? "text-white" : "text-black"}`}>
              Our Core Values
            </h2>
            <p className={`text-xl sm:text-2xl max-w-4xl mx-auto ${isDark ? "text-white/80" : "text-black/80"} reveal-text`}>
              These principles guide everything we do, from how we work with clients to how we build our solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index}
                className={`about-element group relative overflow-hidden ${
                  isDark 
                    ? 'bg-black/40 backdrop-blur-xl border-blue-500/20 hover:border-blue-400/40' 
                    : 'bg-black/5 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40'
                } border rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className={`absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 rounded-tr-2xl ${
                    isDark ? 'border-blue-400/30' : 'border-blue-400/30'
                  }`}></div>
                </div>
                
                <CardContent className="text-center space-y-6 relative">
                  <div className={`w-20 h-20 mx-auto transition-all duration-500 group-hover:scale-110 ${
                    isDark 
                      ? 'bg-black/40 backdrop-blur-xl border border-blue-400/40' 
                      : 'bg-black/5 backdrop-blur-sm border border-blue-200'
                  } rounded-3xl flex items-center justify-center`}>
                    {/* Background Pattern */}
                    <div className={`absolute inset-0 opacity-20 rounded-3xl ${
                      isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                    }`}></div>
                    <value.icon className={`h-10 w-10 transition-all duration-300 relative z-10 ${
                      isDark ? 'text-white group-hover:text-blue-400' : 'text-black group-hover:text-blue-600'
                    }`} />
                  </div>
                  <h3 className={`text-2xl font-bold font-barlow transition-all duration-300 ${
                    isDark ? 'text-white group-hover:text-blue-400' : 'text-black group-hover:text-blue-600'
                  }`}>
                    {value.title}
                  </h3>
                  <p className={`text-base transition-all duration-300 ${isDark ? "text-white/70" : "text-black/70"}`}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="about-section w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
              <span className={`text-sm font-medium uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                Our Methodology
              </span>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
            </div>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-barlow mb-8 leading-tight ${isDark ? "text-white" : "text-black"}`}>
              How We Work
            </h2>
            <p className={`text-xl sm:text-2xl max-w-4xl mx-auto ${isDark ? "text-white/80" : "text-black/80"} reveal-text`}>
              Our proven process ensures successful delivery of every project, from concept to launch.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="about-element text-center group">
                <div className={`relative w-24 h-24 mx-auto mb-8 transition-all duration-500 group-hover:scale-110 ${
                  isDark 
                    ? 'bg-black/40 backdrop-blur-xl border border-blue-400/40' 
                    : 'bg-black/5 backdrop-blur-sm border border-blue-200'
                } rounded-3xl flex items-center justify-center`}>
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 opacity-20 rounded-3xl ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}></div>
                  
                  <span className={`text-3xl font-bold relative z-10 transition-all duration-300 ${
                    isDark ? 'text-white group-hover:text-blue-400' : 'text-black group-hover:text-blue-600'
                  }`}>
                    {step.step}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold font-barlow mb-6 transition-all duration-300 ${
                  isDark ? 'text-white group-hover:text-blue-400' : 'text-black group-hover:text-blue-600'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-base transition-all duration-300 ${isDark ? "text-white/70" : "text-black/70"}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="about-section w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
              <span className={`text-sm font-medium uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                By The Numbers
              </span>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
            </div>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-barlow mb-8 leading-tight ${isDark ? "text-white" : "text-black"}`}>
              Our Achievements
            </h2>
            <p className={`text-xl sm:text-2xl max-w-4xl mx-auto ${isDark ? "text-white/80" : "text-black/80"} reveal-text`}>
              Numbers that tell the story of our commitment to excellence and client success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card 
                key={index}
                className={`about-element group relative overflow-hidden ${
                  isDark 
                    ? 'bg-black/40 backdrop-blur-xl border-blue-500/20 hover:border-blue-400/40' 
                    : 'bg-black/5 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40'
                } border rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className={`absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 rounded-bl-2xl ${
                    isDark ? 'border-blue-400/30' : 'border-blue-400/30'
                  }`}></div>
                </div>
                
                <CardContent className="text-center space-y-6 relative">
                  <div className={`w-20 h-20 mx-auto transition-all duration-500 group-hover:scale-110 ${
                    isDark 
                      ? 'bg-black/40 backdrop-blur-xl border border-blue-400/40' 
                      : 'bg-black/5 backdrop-blur-sm border border-blue-200'
                  } rounded-3xl flex items-center justify-center`}>
                    {/* Background Pattern */}
                    <div className={`absolute inset-0 opacity-20 rounded-3xl ${
                      isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                    }`}></div>
                    <achievement.icon className={`h-10 w-10 transition-all duration-300 relative z-10 ${
                      isDark ? 'text-white group-hover:text-blue-400' : 'text-black group-hover:text-blue-600'
                    }`} />
                  </div>
                  <h3 className={`text-2xl font-bold font-barlow transition-all duration-300 ${
                    isDark ? 'text-white group-hover:text-blue-400' : 'text-black group-hover:text-blue-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-base transition-all duration-300 ${isDark ? "text-white/70" : "text-black/70"}`}>
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto text-center">
          <div className="about-element max-w-5xl mx-auto space-y-10">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-barlow leading-tight ${isDark ? "text-white" : "text-black"}`}>
              Ready to Build Something Amazing?
            </h2>
            <p className={`text-xl sm:text-2xl leading-relaxed ${isDark ? "text-white/80" : "text-black/80"} reveal-text`}>
              Let's discuss how we can help transform your business with intelligent AI solutions and cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/#contact">
                <Button className={`${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"} rounded-2xl px-10 py-6 text-xl font-medium transition-all duration-300 hover:scale-105 shadow-2xl`}>
                  Get Started
                  <ArrowUpRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button className={`${isDark ? "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black" : "bg-transparent border-2 border-black text-black hover:bg-black hover:text-white"} rounded-2xl px-10 py-6 text-xl font-medium transition-all duration-300 hover:scale-105 shadow-xl`}>
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default AboutUsPage;
