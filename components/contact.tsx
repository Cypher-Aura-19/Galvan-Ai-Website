"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from "@/components/theme-provider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Send, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contactRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".contact-fade").forEach((el, i) => {
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
    }, contactRef);
    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.company.trim()) {
      errors.company = 'Company is required';
    }
    
    if (!formData.projectDetails.trim()) {
      errors.projectDetails = 'Project details are required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          projectDetails: ''
        });
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setShowError(true);
        setErrorMessage(result.error || "Please try again later.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowError(true);
      setErrorMessage("Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleMeeting = () => {
    // Replace this URL with your actual Calendly scheduling link
    window.open('https://calendly.com/work-talharizwan/30min', '_blank');
  };

  return (
    <section 
      ref={contactRef}
      className={`w-full min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 flex flex-col justify-center items-center ${isDark ? "text-white" : "text-black"}`}
    >
      {/* Content Container */}
      <div 
        className="w-full max-w-[1700px] mx-auto flex flex-col justify-center items-center"
      >
        {/* Header */}
        <div className="contact-fade text-center mb-12 sm:mb-16 lg:mb-24">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight font-barlow text-white`}>Let's Build Something Great</h1>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className={`w-full max-w-2xl mx-auto mb-8 ${isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-500/10 border-green-500/30"} border rounded-2xl p-6 backdrop-blur-xl`}>
            <div className="flex items-center space-x-3">
              <CheckCircle className={`h-6 w-6 ${isDark ? "text-green-400" : "text-green-600"}`} />
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                  Project inquiry submitted!
                </h3>
                <p className={`text-sm ${isDark ? "text-green-300" : "text-green-700"}`}>
                  We'll get back to you within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showError && (
          <div className={`w-full max-w-2xl mx-auto mb-8 ${isDark ? "bg-red-500/10 border-red-500/30" : "bg-red-500/10 border-red-500/30"} border rounded-2xl p-6 backdrop-blur-xl`}>
            <div className="flex items-center space-x-3">
              <AlertCircle className={`h-6 w-6 ${isDark ? "text-red-400" : "text-red-600"}`} />
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? "text-red-400" : "text-red-600"}`}>
                  Submission failed
                </h3>
                <p className={`text-sm ${isDark ? "text-red-300" : "text-red-700"}`}>
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 px-4 sm:px-8 lg:px-16">
          {/* Left Side - Project Details Form */}
          <div className={`contact-fade group relative overflow-hidden ${isDark ? 'bg-black/40 border-blue-500/20' : 'bg-black/5 border-blue-500/20'} backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-center min-h-[600px] hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className={`absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 rounded-tr-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
              <div className={`absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 rounded-bl-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
            </div>
            <div className="text-center mb-6 sm:mb-8">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isDark ? "bg-white/10 group-hover:bg-blue-500/20" : "bg-black/10 group-hover:bg-blue-100"} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300`}>
                <Mail className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${isDark ? "text-white group-hover:text-blue-400" : "text-black group-hover:text-blue-600"}`} />
              </div>
              <h2 className={`text-xl sm:text-2xl font-light font-barlow transition-all duration-300 ${isDark ? "text-white group-hover:text-blue-400" : "text-black group-hover:text-blue-600"}`}>Project Details</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${isDark ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40" : "bg-black/5 border-black/20 text-black placeholder:text-black/50 focus:border-black/40"} h-12 sm:h-14 rounded-xl ${validationErrors.name ? (isDark ? "border-red-400/50" : "border-red-500/50") : ""}`}
                    placeholder="Name *"
                  />
                  {validationErrors.name && (
                    <p className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${isDark ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40" : "bg-black/5 border-black/20 text-black placeholder:text-black/50 focus:border-black/40"} h-12 sm:h-14 rounded-xl ${validationErrors.email ? (isDark ? "border-red-400/50" : "border-red-500/50") : ""}`}
                    placeholder="Email *"
                  />
                  {validationErrors.email && (
                    <p className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`${isDark ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40" : "bg-black/5 border-black/20 text-black placeholder:text-black/50 focus:border-black/40"} h-12 sm:h-14 rounded-xl ${validationErrors.company ? (isDark ? "border-red-400/50" : "border-red-500/50") : ""}`}
                  placeholder="Company *"
                />
                {validationErrors.company && (
                  <p className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
                    {validationErrors.company}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Textarea
                  name="projectDetails"
                  value={formData.projectDetails}
                  onChange={handleInputChange}
                  className={`${isDark ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40" : "bg-black/5 border-black/20 text-black placeholder:text-black/50 focus:border-black/40"} min-h-[100px] sm:min-h-[120px] resize-none rounded-xl ${validationErrors.projectDetails ? (isDark ? "border-red-400/50" : "border-red-500/50") : ""}`}
                  placeholder="Tell us about your project... *"
                />
                {validationErrors.projectDetails && (
                  <p className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
                    {validationErrors.projectDetails}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full group/btn transition-all duration-300 h-12 sm:h-14 text-sm sm:text-base font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "bg-white text-black hover:bg-blue-500 hover:text-white" : "bg-black text-white hover:bg-blue-600 hover:text-white"}`}
              >
                <Send className="mr-2 h-4 w-4 transition-all duration-300 group-hover/btn:scale-110" />
                {isSubmitting ? "Sending..." : "Send Details"}
              </Button>
            </form>
          </div>
          {/* Right Side - Schedule Meeting */}
          <div className={`contact-fade group relative overflow-hidden ${isDark ? 'bg-black/40 border-blue-500/20' : 'bg-black/5 border-blue-500/20'} backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 flex flex-col justify-center transition-all duration-500 hover:scale-[1.02] min-h-[600px] hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className={`absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 rounded-tr-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
              <div className={`absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 rounded-bl-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
            </div>
            <div className="text-center space-y-6 sm:space-y-8 lg:space-y-10">
              <div className="text-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isDark ? "bg-white/10 group-hover:bg-blue-500/20" : "bg-black/10 group-hover:bg-blue-100"} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300`}>
                  <CalendarDays className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${isDark ? "text-white group-hover:text-blue-400" : "text-black group-hover:text-blue-600"}`} />
                </div>
                <h2 className={`text-xl sm:text-2xl font-light font-barlow transition-all duration-300 ${isDark ? "text-white group-hover:text-blue-400" : "text-black group-hover:text-blue-600"}`}>Schedule a Call</h2>
              </div>
              {/* Schedule a Call card: increase height of 30 minute consultation card */}
              <div className={`group/card ${isDark ? "bg-white/5 border-white/10 group-hover:border-blue-400/40" : "bg-black/5 border-black/10 group-hover:border-blue-400/40"} rounded-2xl p-6 sm:p-8 border flex flex-col items-center justify-center min-h-[260px] transition-all duration-300 group-hover:bg-blue-500/10`}>
                <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold transition-all duration-300 ${isDark ? "text-white/20 group-hover/card:text-blue-400/40" : "text-black/20 group-hover/card:text-blue-600/40"} mb-2`}>30</div>
                <div className={`text-xs sm:text-sm transition-all duration-300 ${isDark ? "text-white/60 group-hover/card:text-blue-400/60" : "text-black/60 group-hover/card:text-blue-600/60"}`}>minute consultation</div>
              </div>
              <Button 
                onClick={handleScheduleMeeting}
                className={`w-full group/btn transition-all duration-300 h-12 sm:h-14 text-sm sm:text-base font-medium rounded-xl ${isDark ? "bg-white text-black hover:bg-blue-500 hover:text-white" : "bg-black text-white hover:bg-blue-600 hover:text-white"}`}
              >
                <CalendarDays className="mr-2 h-4 w-4 transition-all duration-300 group-hover/btn:scale-110" />
                Book Meeting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;