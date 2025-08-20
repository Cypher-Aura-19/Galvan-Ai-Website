"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from "@/components/theme-provider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".footer-fade").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  // Company nav items for Footer
  const companyNavItems = [
    { name: 'Projects', href: '/projects' },
    { name: 'Services', href: '#services' },
    { name: 'Blogs', href: '#blogs' },
    { name: 'Team', href: '#team' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
    { name: 'Newsletter', href: '#newsletter' },
    { name: 'Careers', href: '/careers' },
  ];

  const resourceLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/people/Galvan-AI/61558092385889/', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/galvanai/', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/@galvanai', label: 'YouTube' },
  ];

  return (
    <footer ref={footerRef} className={`${isDark ? "text-white" : "text-black"} w-full flex flex-col ${isDark ? 'bg-black/40 border-blue-500/20' : 'bg-black/5 border-blue-500/20'} backdrop-blur-xl border-t transition-all duration-500 hover:border-blue-400/40 hover:shadow-blue-500/20 ${isDark ? 'shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'shadow-[0_4px_30px_rgba(0,0,0,0.05)]'}`}>
      {/* Main Footer Content */}
      <div className="flex-1 flex items-center w-full py-10 sm:py-14 lg:py-20">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-[1700px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 w-full">
            
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="footer-fade">
                <div>
                  <div className="flex items-center mb-4">
                    <img src="/Galvan AI logo transparent.png" alt="Galvan AI Logo" className="h-10 w-auto" />
                  </div>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed mb-6 text-base sm:text-lg font-sans`}>
                    Innovating the future through cutting-edge technology solutions. 
                    We help businesses transform and thrive in the digital landscape.
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-3 group ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"} transition-all duration-300 hover:translate-x-2 transform`}>
                      <div className={`w-8 h-8 ${isDark ? "bg-white/10 group-hover:bg-blue-500/20 border border-transparent group-hover:border-blue-400/40" : "bg-black/10 group-hover:bg-blue-100 border border-transparent group-hover:border-blue-200"} rounded-lg flex items-center justify-center transition-all duration-300`}>
                        <Phone className={`h-4 w-4 transition-all duration-300 ${isDark ? "group-hover:text-blue-400" : "group-hover:text-blue-600"}`} />
                      </div>
                      <span className="text-base sm:text-lg font-sans">+92 3336550750</span>
                    </div>
                    <div className={`flex items-center space-x-3 group ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"} transition-all duration-300 hover:translate-x-2 transform`}>
                      <div className={`w-8 h-8 ${isDark ? "bg-white/10 group-hover:bg-blue-500/20 border border-transparent group-hover:border-blue-400/40" : "bg-black/10 group-hover:bg-blue-100 border border-transparent group-hover:border-blue-200"} rounded-lg flex items-center justify-center transition-all duration-300`}>
                        <Mail className={`h-4 w-4 transition-all duration-300 ${isDark ? "group-hover:text-blue-400" : "group-hover:text-blue-600"}`} />
                      </div>
                      <span className="text-base">team@galvanai.com</span>
                    </div>
                    <div className={`flex items-center space-x-3 group ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"} transition-all duration-300 hover:translate-x-2 transform`}>
                      <div className={`w-8 h-8 ${isDark ? "bg-white/10 group-hover:bg-blue-500/20 border border-transparent group-hover:border-blue-400/40" : "bg-black/10 group-hover:bg-blue-100 border border-transparent group-hover:border-blue-200"} rounded-lg flex items-center justify-center transition-all duration-300`}>
                        <MapPin className={`h-4 w-4 transition-all duration-300 ${isDark ? "group-hover:text-blue-400" : "group-hover:text-blue-600"}`} />
                      </div>
                      <span className="text-base">Office 1, Innovista Rawal, Phase 1, DHA Rawalpindi, Pakistan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="footer-fade">
              <h3 className="text-lg sm:text-xl font-bold mb-4 font-barlow">Company</h3>
              <div className="grid grid-cols-2 gap-3">
                <ul className="space-y-2">
                  {companyNavItems.slice(0, Math.ceil(companyNavItems.length / 2)).map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className={`group/item ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"} transition-all duration-300 hover:translate-x-2 transform inline-block text-sm`}
                      >
                        <span className="relative">
                          {link.name}
                          <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? "bg-blue-400" : "bg-blue-600"} transition-all duration-300 group-hover/item:w-full`}></span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {companyNavItems.slice(Math.ceil(companyNavItems.length / 2)).map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className={`group/item ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"} transition-all duration-300 hover:translate-x-2 transform inline-block text-sm`}
                      >
                        <span className="relative">
                          {link.name}
                          <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? "bg-blue-400" : "bg-blue-600"} transition-all duration-300 group-hover/item:w-full`}></span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resources Links */}
            <div className="footer-fade">
              <h3 className="text-lg sm:text-xl font-bold mb-4 font-barlow">Resources</h3>
              <ul className="space-y-2 font-sans text-sm">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`group/item ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"} transition-all duration-300 hover:translate-x-2 transform inline-block`}
                    >
                      <span className="relative">
                        {link.name}
                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? "bg-blue-400" : "bg-blue-600"} transition-all duration-300 group-hover/item:w-full`}></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Subscription - Moved to right */}
            <div className="footer-fade">
              <h3 className="text-lg sm:text-xl font-bold mb-4 font-barlow">Newsletter</h3>
              <div className={`group relative overflow-hidden bg-transparent backdrop-blur-[2.1px] border-blue-500/20 rounded-xl p-4 border transition-all duration-500 hover:scale-[1.02] hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-500/20`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 rounded-tr-2xl border-blue-400/30"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 rounded-bl-2xl border-blue-400/30"></div>
                </div>
                
                <div className="relative">
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} mb-4 transition-all duration-300 group-hover:text-blue-400/80 text-sm`}>
                    Subscribe for latest updates and insights.
                  </p>
                
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-sm ${isDark ? 'bg-white/10 border-blue-500/20 text-white placeholder:text-white/60 focus:border-blue-400/40 focus:ring-blue-400/20' : 'bg-black/5 border-blue-500/20 text-black placeholder:text-black/60 focus:border-blue-400/40 focus:ring-blue-400/20'}`}
                      required
                    />
                    <button
                      type="submit"
                      className={`w-full py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center space-x-2 group border text-sm ${isDark ? 'bg-white/10 text-white hover:bg-white/15 border-blue-500/20 hover:border-blue-400/40 focus:ring-blue-400/20 focus:ring-offset-black' : 'bg-black/5 text-black hover:bg-black/10 border-blue-500/20 hover:border-blue-400/40 focus:ring-blue-400/20 focus:ring-offset-white'}`}
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                  {isSubscribed && (
                    <div className={`flex items-center space-x-2 ${isDark ? "text-white bg-white/10 border-white/20" : "text-black bg-black/10 border-black/20"} rounded-lg p-2 border text-xs`}>
                      <CheckCircle className="h-4 w-4" />
                      <span>Thank you for subscribing!</span>
                    </div>
                  )}
                </form>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className={`mt-8 pt-6 border-t ${isDark ? "border-white/10" : "border-black/10"}`}>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className={`group w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center border ${
                        isDark
                          ? 'bg-white/10 border-blue-500/20 hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-500/20 text-white hover:bg-blue-500/20'
                          : 'bg-black/10 border-blue-500/20 hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-500/20 text-black hover:bg-blue-100'
                      }`}
                    >
                      <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${isDark ? "group-hover:text-blue-400" : "group-hover:text-blue-600"}`} />
                    </a>
                  );
                })}
              </div>
              
              <div className={`text-center sm:text-right ${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
                <p>
                  Follow us for the latest updates and insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-fade">
        <div className="px-4 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 w-full">
              <div className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
                © 2025 Galvan Ai. All rights reserved.
              </div>
              <div className="flex flex-wrap justify-center md:justify-end items-center space-x-4 sm:space-x-6">
                <a href="/privacy-policy" className={`group/item ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"} transition-all duration-300 hover:translate-x-1 transform inline-block text-sm`}>
                  <span className="relative">
                    Privacy Policy
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? "bg-blue-400" : "bg-blue-600"} transition-all duration-300 group-hover/item:w-full`}></span>
                  </span>
                </a>
                <a href="/terms-of-service" className={`group/item ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"} transition-all duration-300 hover:translate-x-1 transform inline-block text-sm`}>
                  <span className="relative">
                    Terms of Service
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? "bg-blue-400" : "bg-blue-600"} transition-all duration-300 group-hover/item:w-full`}></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;