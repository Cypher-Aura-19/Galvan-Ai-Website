"use client"

import React, { useEffect, useRef } from 'react';
import { useTheme } from "@/components/theme-provider";
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
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const AboutUsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aboutRef.current) return;
    
    const ctx = gsap.context(() => {
      // Initial entrance animations
      gsap.set(".about-element", { opacity: 0, y: 60, scale: 0.9 });
      gsap.set(".about-header", { opacity: 0, y: 80, scale: 0.8 });
      gsap.set(".about-section", { opacity: 0, y: 100, scale: 0.9 });

      // Entrance sequence
      const tl = gsap.timeline();
      
      tl.to(".about-header", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
      })
      .to(".about-section", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: "power3.out"
      }, "-=0.6")
      .to(".about-element", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }, "-=0.4");

      // Scroll-triggered animations
      gsap.fromTo(
        ".about-section",
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, aboutRef);
    
    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: Target,
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
      icon: Award,
      title: "50+ Projects Delivered",
      description: "Successfully completed projects across various industries and technologies."
    },
    {
      icon: Lightbulb,
      title: "25+ Global Clients",
      description: "Trusted by businesses worldwide to transform their digital presence."
    },
    {
      icon: Code,
      title: "7+ Years Experience",
      description: "Deep expertise in AI, automation, and enterprise software development."
    },
    {
      icon: Rocket,
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
      className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
    >
      {/* Header Section */}
      <section className="about-header w-full pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 sm:mb-8 tracking-tight font-barlow ${isDark ? "text-white" : "text-black"}`}>
            About Galvan AI
          </h1>
          <p className={`text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${isDark ? "text-white/80" : "text-black/80"}`}>
            We are a team of passionate innovators, engineers, and designers dedicated to transforming businesses through intelligent AI solutions and cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-section w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="about-element space-y-6">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-barlow ${isDark ? "text-white" : "text-black"}`}>
                Our Mission
              </h2>
              <p className={`text-lg sm:text-xl leading-relaxed font-light ${isDark ? "text-white/80" : "text-black/80"}`}>
                To democratize AI technology and make it accessible to businesses of all sizes. We believe that every company deserves access to intelligent solutions that can drive growth, efficiency, and innovation.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-6 w-6 mt-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Building scalable AI solutions that grow with your business
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-6 w-6 mt-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Delivering measurable ROI through intelligent automation
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-6 w-6 mt-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Creating user experiences that people love to use
                  </span>
                </div>
              </div>
            </div>
            
            <div className="about-element space-y-6">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-barlow ${isDark ? "text-white" : "text-black"}`}>
                Our Vision
              </h2>
              <p className={`text-lg sm:text-xl leading-relaxed font-light ${isDark ? "text-white/80" : "text-black/80"}`}>
                To be the leading force in AI-driven business transformation, creating a future where technology seamlessly enhances human potential and drives sustainable business growth across all industries.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-6 w-6 mt-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Pioneering next-generation AI applications
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-6 w-6 mt-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Building sustainable technology ecosystems
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-6 w-6 mt-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <span className={`text-base ${isDark ? "text-white/90" : "text-black/90"}`}>
                    Empowering businesses through intelligent innovation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-section w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-barlow mb-6 ${isDark ? "text-white" : "text-black"}`}>
              Our Core Values
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${isDark ? "text-white/80" : "text-black/80"}`}>
              These principles guide everything we do, from how we work with clients to how we build our solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index}
                className={`about-element ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/5 border-black/10 hover:bg-black/10"} border rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <CardContent className="text-center space-y-4">
                  <div className={`w-16 h-16 ${isDark ? "bg-white/10" : "bg-black/10"} rounded-2xl flex items-center justify-center mx-auto`}>
                    <value.icon className={`h-8 w-8 ${isDark ? "text-white" : "text-black"}`} />
                  </div>
                  <h3 className={`text-xl font-bold font-barlow ${isDark ? "text-white" : "text-black"}`}>
                    {value.title}
                  </h3>
                  <p className={`text-sm sm:text-base ${isDark ? "text-white/70" : "text-black/70"}`}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="about-section w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-barlow mb-6 ${isDark ? "text-white" : "text-black"}`}>
              How We Work
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${isDark ? "text-white/80" : "text-black/80"}`}>
              Our proven process ensures successful delivery of every project, from concept to launch.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="about-element text-center">
                <div className={`w-20 h-20 ${isDark ? "bg-white/10 border-white/20" : "bg-black/10 border-black/20"} border rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                    {step.step}
                  </span>
                </div>
                <h3 className={`text-xl font-bold font-barlow mb-4 ${isDark ? "text-white" : "text-black"}`}>
                  {step.title}
                </h3>
                <p className={`text-sm sm:text-base ${isDark ? "text-white/70" : "text-black/70"}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="about-section w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-barlow mb-6 ${isDark ? "text-white" : "text-black"}`}>
              Our Achievements
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${isDark ? "text-white/80" : "text-black/80"}`}>
              Numbers that tell the story of our commitment to excellence and client success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card 
                key={index}
                className={`about-element ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/5 border-black/10 hover:bg-black/10"} border rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <CardContent className="text-center space-y-4">
                  <div className={`w-16 h-16 ${isDark ? "bg-white/10" : "bg-black/10"} rounded-2xl flex items-center justify-center mx-auto`}>
                    <achievement.icon className={`h-8 w-8 ${isDark ? "text-white" : "text-black"}`} />
                  </div>
                  <h3 className={`text-xl font-bold font-barlow ${isDark ? "text-white" : "text-black"}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm sm:text-base ${isDark ? "text-white/70" : "text-black/70"}`}>
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1700px] mx-auto text-center">
          <div className="about-element max-w-4xl mx-auto space-y-8">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-barlow ${isDark ? "text-white" : "text-black"}`}>
              Ready to Build Something Amazing?
            </h2>
            <p className={`text-lg sm:text-xl leading-relaxed ${isDark ? "text-white/80" : "text-black/80"}`}>
              Let's discuss how we can help transform your business with intelligent AI solutions and cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                             <Link href="/#contact">
                 <Button className={`${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"} rounded-xl px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105`}>
                   Get Started
                   <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
               </Link>
              <Link href="/projects">
                <Button variant="outline" className={`${isDark ? "border-white text-white hover:bg-white hover:text-black" : "border-black text-black hover:bg-black hover:text-white"} rounded-xl px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105`}>
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
