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
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer ref={footerRef} className={`${isDark ? "bg-black text-white" : "bg-white text-black"} w-full flex flex-col`}>
      {/* Main Footer Content */}
      <div className="flex-1 flex items-center w-full py-10 sm:py-14 lg:py-20">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-[1700px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 w-full">
            
            {/* Company Info & Newsletter */}
            <div className="lg:col-span-2 space-y-8">
              <div className="footer-fade">
                <div>
                  <div className="flex items-center mb-6">
                    <img src="/Galvan AI logo transparent.png" alt="Galvan AI Logo" className="h-12 w-auto" />
                  </div>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed mb-8 text-lg sm:text-xl font-sans`}>
                    Innovating the future through cutting-edge technology solutions. 
                    We help businesses transform and thrive in the digital landscape.
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <div className={`flex items-center space-x-4 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors duration-300`}>
                      <div className={`w-10 h-10 ${isDark ? "bg-white/10" : "bg-black/10"} rounded-lg flex items-center justify-center`}>
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="text-lg sm:text-xl font-sans">+1 (555) 123-4567</span>
                    </div>
                    <div className={`flex items-center space-x-4 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors duration-300`}>
                      <div className={`w-10 h-10 ${isDark ? "bg-white/10" : "bg-black/10"} rounded-lg flex items-center justify-center`}>
                        <Mail className="h-5 w-5" />
                      </div>
                      <span className="text-lg">hello@techcorp.com</span>
                    </div>
                    <div className={`flex items-center space-x-4 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors duration-300`}>
                      <div className={`w-10 h-10 ${isDark ? "bg-white/10" : "bg-black/10"} rounded-lg flex items-center justify-center`}>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-lg">123 Innovation Street, Tech City, TC 12345</span>
                    </div>
                  </div>
                </div>

                {/* Newsletter Subscription */}
                <div className={`${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"} rounded-2xl p-4 sm:p-6 border`}>
                  <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} mb-6`}>
                    Subscribe to our newsletter for the latest updates and insights.
                  </p>
                  
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className={`w-full px-4 sm:px-6 py-3 bg-white/10 border ${isDark ? "border-white/20 text-white placeholder-gray-400 focus:border-white focus:ring-white/20" : "border-black/20 text-black placeholder-gray-600 focus:border-black focus:ring-black/20"} rounded-xl focus:outline-none focus:ring-2 transition-all duration-300`}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className={`px-4 sm:px-6 py-3 ${isDark ? "bg-white text-black hover:bg-gray-100 focus:ring-white focus:ring-offset-black" : "bg-black text-white hover:bg-gray-900 focus:ring-black focus:ring-offset-white"} font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center space-x-3 group`}
                      >
                        <span>Subscribe</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                    {isSubscribed && (
                      <div className={`flex items-center space-x-3 ${isDark ? "text-white bg-white/10 border-white/20" : "text-black bg-black/10 border-black/20"} rounded-lg p-4 border`}>
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Thank you for subscribing!</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="footer-fade">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 font-barlow">Company</h3>
              <div className="grid grid-cols-2 gap-4">
                <ul className="space-y-2 sm:space-y-3">
                  {companyNavItems.slice(0, Math.ceil(companyNavItems.length / 2)).map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} transition-all duration-300 hover:translate-x-2 transform inline-block`}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2 sm:space-y-3">
                  {companyNavItems.slice(Math.ceil(companyNavItems.length / 2)).map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} transition-all duration-300 hover:translate-x-2 transform inline-block`}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resources Links */}
            <div className="footer-fade">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 font-barlow">Resources</h3>
              <ul className="space-y-2 sm:space-y-3 font-sans text-base sm:text-lg">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} transition-all duration-300 hover:translate-x-2 transform inline-block`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media Links */}
          <div className={`mt-10 sm:mt-12 pt-8 border-t ${isDark ? "border-white/10" : "border-black/10"}`}>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
              <div className="flex space-x-4 sm:space-x-6">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${isDark ? "bg-white/10 border-white/20 hover:bg-white hover:text-black hover:border-white" : "bg-black/10 border-black/20 hover:bg-black hover:text-white hover:border-black"} rounded-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border`}
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                    </a>
                  );
                })}
              </div>
              
              <div className={`text-center sm:text-right ${isDark ? "text-gray-300" : "text-gray-600"}`}>
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
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 w-full">
              <div className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                © 2025 TechCorp. All rights reserved.
              </div>
              <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 sm:space-x-8">
                <a href="#" className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors duration-300`}>
                  Privacy Policy
                </a>
                <a href="#" className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors duration-300`}>
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;