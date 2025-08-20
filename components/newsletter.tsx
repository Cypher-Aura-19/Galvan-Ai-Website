"use client"
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NewsletterProps {
  formAction?: string;
  isPending?: boolean;
  state?: { success: boolean; message: string } | null;
}

const features = [
  "AI insights & trends",
  "Product updates",
  "Webinars & events",
  "No spam, ever"
];

function SubmitButton() {
  const { pending } = useFormStatus();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className={`w-full font-semibold py-3 rounded-lg border font-barlow ${
        isDark 
          ? "bg-white text-black hover:bg-white/90 border-white" 
          : "bg-black text-white hover:bg-black/90 border-black"
      }`}
    >
      {pending ? "Subscribing..." : "Subscribe"}
    </Button>
  );
}

const Newsletter: React.FC<NewsletterProps> = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [state, formAction] = useActionState(subscribeToNewsletter, null);
  const newsletterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!newsletterRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".newsletter-fade").forEach((el, i) => {
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
    }, newsletterRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={newsletterRef} className={`w-full min-h-[60vh] flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 ${isDark ? "text-white" : "text-black"}`}>
      <div className="w-full max-w-[1700px] flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 px-4 sm:px-8 lg:px-12">
        {/* Left Content */}
        <div className={`flex-1 flex flex-col items-start justify-center text-left space-y-6 sm:space-y-8 lg:pr-16 w-full ${isDark ? "" : ""}`}>
          <h1 className={`newsletter-fade text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-barlow ${isDark ? "text-white" : "text-black"}`}>
            <span className="font-extrabold bg-gradient-to-r from-blue-800 via-blue-600 via-blue-500 via-blue-400 via-blue-300 via-blue-200 to-yellow-500 bg-clip-text text-transparent font-barlow">Unlock the powered future with ai solutions</span>
          </h1>
          <p className={`newsletter-fade text-lg sm:text-xl max-w-2xl font-sans ${isDark ? "text-white" : "text-black/80"}`}>
            Join our newsletter for exclusive updates, expert insights, and the latest in AI innovation—delivered straight to your inbox.
          </p>
          <ul className={`newsletter-fade space-y-2 text-base sm:text-lg pl-4 list-disc border-l font-sans ${isDark ? "text-white border-white/20" : "text-black border-black/20"}`}>
            {features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
        {/* Right Content: Newsletter Form */}
        <div className={`newsletter-fade group flex-1 flex flex-col items-center justify-center w-full max-w-md rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 lg:ml-8 border transition-all duration-500 hover:scale-[1.02] ${isDark ? 'bg-black/40 backdrop-blur-xl border-blue-500/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20' : 'bg-black/5 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20'}`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 rounded-tr-3xl border-blue-400/30"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 rounded-bl-3xl border-blue-400/30"></div>
          </div>
          
          <div className="relative">
            <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center w-full font-barlow transition-all duration-300 ${isDark ? "text-white group-hover:text-blue-400" : "text-black group-hover:text-blue-600"}`}>Subscribe to our Newsletter</h2>
            <p className={`mb-4 sm:mb-6 text-center w-full font-light font-sans transition-all duration-300 ${isDark ? "text-white group-hover:text-blue-400/80" : "text-black/80 group-hover:text-blue-600/80"}`}>
              Get the latest updates and resources—no spam, ever.
            </p>
          <form action={formAction} className="flex flex-col gap-3 sm:gap-4 w-full font-sans">
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Your email address"
              required
              className={`w-full rounded-lg font-sans ${isDark ? 'bg-white/10 text-white border-blue-500/20 placeholder:text-white focus:border-blue-400/40' : 'bg-black/5 text-black border-blue-500/20 placeholder:text-black focus:border-blue-400/40'}`}
            />
            <input type="hidden" name="source" value="website" />
            <SubmitButton />
          </form>
          {state && (
            <p className={`text-sm mt-3 sm:mt-4 w-full text-center font-sans ${state.success ? "text-green-400" : "text-red-400"}`}>
              {state.message}
            </p>
          )}
          <div className={`w-full border-t my-4 sm:my-6 ${isDark ? "border-white" : "border-black"}`} />
          <p className={`text-xs w-full text-center font-sans ${isDark ? "text-white" : "text-black/60"}`}>
            By subscribing, you agree to our
            <Link href="#" className={`underline underline-offset-2 ml-1 font-sans ${isDark ? "text-white" : "text-black"}`} prefetch={false}>
              Privacy Policy
            </Link>
            .
          </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 