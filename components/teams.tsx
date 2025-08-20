"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/dist/SplitText";
import { FaEnvelope, FaLinkedin, FaGithub, FaDribbble, FaTwitter } from "react-icons/fa";
import { useTheme } from "@/components/theme-provider";

type Socials = {
  linkedin?: string;
  twitter?: string;
  github?: string;
  dribbble?: string;
};

type TeamMember = {
  name: string;
  img: string;
  avatar: string;
  role: string;
  about: string;
  background: string;
  interests: string;
  skills: string[];
  quote: string;
  socials: Socials;
  awards: string[];
  certifications: string[];
  location: string;
  languages: string[];
  funFact: string;
};

export default function TeamSection() {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const profileImagesContainerRef = useRef(null);
  const profileImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const nameElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nameHeadingsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cardPanelRef = useRef<HTMLDivElement | null>(null);
  const imagePanelRef = useRef<HTMLDivElement | null>(null);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Map Flask backend data to TeamMember type expected by frontend
  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const res = await fetch('/api/teams');
        if (!res.ok) throw new Error('Failed to fetch team members');
        const data = await res.json();
        // Map backend fields to frontend TeamMember type
        const mapped = data.map((t: any) => ({
          name: t.name,
          img: t.avatar || t.img || '',
          avatar: t.avatar || '',
          role: t.role,
          about: t.bio || '',
          background: Array.isArray(t.background) ? t.background.join(', ') : (t.background || ''),
          interests: Array.isArray(t.interests) ? t.interests.join(', ') : (t.interests || ''),
          skills: t.skills || [],
          quote: t.quote || '',
          socials: {
            linkedin: t.linkedin || '',
            twitter: t.twitter || '',
            github: t.github || '',
            dribbble: t.dribbble || '',
          },
          awards: t.awards || [],
          certifications: t.certifications || [],
          location: t.location || '',
          languages: t.languages || [],
          funFact: t.funFact || '',
        }));
        setTeamMembers(mapped);
      } catch (err) {
        setTeamMembers([]);
      }
    }
    fetchTeamMembers();
  }, []);

  useGSAP(
    () => {
      if (!teamMembers.length) return;
      if (typeof window !== "undefined") {
        gsap.registerPlugin(SplitText);
      }

      const profileImagesContainer = profileImagesContainerRef.current;
      const profileImages = profileImagesRef.current;
      const nameElements = nameElementsRef.current;
      const nameHeadings = nameHeadingsRef.current.filter(Boolean);

      nameHeadings.forEach((heading) => {
        if (heading && !heading.dataset.split) {
          const split = new SplitText(heading, { type: "chars" });
          split.chars.forEach((char) => {
            char.classList.add("letter");
          });
          heading.dataset.split = "true";
        }
      });

      if (nameElements[0]) {
        const defaultLetters = nameElements[0].querySelectorAll(".letter");
        gsap.set(defaultLetters, { y: "100%" });

        if (window.innerWidth >= 900) {
          profileImages.forEach((img, index) => {
            if (!img) return;

            const correspondingName = nameElements[index + 1];
            if (!correspondingName) return;

            const letters = correspondingName.querySelectorAll(".letter");

            img.addEventListener("mouseenter", () => {
              gsap.to(img, {
                width: 140,
                height: 140,
                duration: 0.5,
                ease: "power4.out",
              });

              gsap.to(letters, {
                y: "-100%",
                ease: "power4.out",
                duration: 0.75,
                stagger: {
                  each: 0.025,
                  from: "center",
                },
              });
            });

            img.addEventListener("mouseleave", () => {
              gsap.to(img, {
                width: 70,
                height: 70,
                duration: 0.5,
                ease: "power4.out",
              });

              gsap.to(letters, {
                y: "0%",
                ease: "power4.out",
                duration: 0.75,
                stagger: {
                  each: 0.025,
                  from: "center",
                },
              });
            });
          });

          const profileImagesContainer = profileImagesContainerRef.current as HTMLDivElement | null;
          if (profileImagesContainer) {
            profileImagesContainer.addEventListener("mouseenter", () => {
              if (nameElements[0]) {
                const defaultLetters = nameElements[0].querySelectorAll<HTMLElement>(".letter");
                gsap.to(defaultLetters, {
                  y: "0%",
                  ease: "power4.out",
                  duration: 0.75,
                  stagger: {
                    each: 0.025,
                    from: "center",
                  },
                });
              }
            });

            profileImagesContainer.addEventListener("mouseleave", () => {
              if (nameElements[0]) {
                const defaultLetters = nameElements[0].querySelectorAll<HTMLElement>(".letter");
                gsap.to(defaultLetters, {
                  y: "100%",
                  ease: "power4.out",
                  duration: 0.75,
                  stagger: {
                    each: 0.025,
                    from: "center",
                  },
                });
              }
            });
          }
        }
      }

      return () => {
        if (window.innerWidth >= 900) {
          profileImages.forEach((img, index) => {
            if (!img) return;

            img.removeEventListener("mouseenter", () => {});
            img.removeEventListener("mouseleave", () => {});
          });

          const profileImagesContainer = profileImagesContainerRef.current as HTMLDivElement | null;
          if (profileImagesContainer) {
            profileImagesContainer.removeEventListener("mouseenter", () => {});
            profileImagesContainer.removeEventListener("mouseleave", () => {});
          }
        }
      };
    },
    { scope: containerRef, dependencies: [teamMembers] }
  );

  const handleClose = () => {
    if (selectedMember === null) return;
    if (overlayRef.current && cardPanelRef.current && imagePanelRef.current) {
      gsap.to(cardPanelRef.current, {
        x: '-100vw',
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      });
      gsap.to(imagePanelRef.current, {
        scale: 0.92,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: 0.1,
        onComplete: () => {
          setSelectedMember(null);
        },
      });
    } else {
      setSelectedMember(null);
    }
  };

  const renderInfoCard = () => {
    if (selectedMember === null) return null;
    const member = teamMembers[selectedMember];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    return (
      <div
        className={`relative w-full h-full flex ${isMobile ? 'flex-col' : 'flex-col'} rounded-2xl shadow-2xl overflow-hidden border ${theme === 'dark' ? 'bg-black text-white border-white/10' : 'bg-white text-black border-zinc-300'}`}
        style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.06)', backdropFilter: 'blur(10px)', backgroundColor: theme === 'dark' ? '#000' : '#fff' }}
      >
        {/* Modern Close Button */}
        <button
          className={`absolute top-2 right-2 md:top-5 md:right-5 z-30 p-2 rounded-full border transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 ${
            theme === 'dark' 
              ? 'bg-white/10 hover:bg-blue-500/20 border-white/20 hover:border-blue-400/40 focus:ring-white/40' 
              : 'bg-black/10 hover:bg-blue-500/20 border-black/20 hover:border-blue-400/40 focus:ring-black/40'
          }`}
          onClick={handleClose}
          aria-label="Close"
        >
          <svg className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${
            theme === 'dark' ? 'text-white/80 group-hover:text-blue-400' : 'text-black/80 group-hover:text-blue-400'
          }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        
        {/* Mobile Layout: Black Card Wrapper */}
        {isMobile ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'}`} style={{ height: '90vh', maxHeight: '600px' }}>
              {/* Card Content */}
              <div className={`h-full overflow-y-auto ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                <div className="p-6">
                  <div className="space-y-4">
                {/* Mobile Header with Small Profile Image */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg flex-shrink-0">
                    <Image
                      src={member.img || member.avatar || "/default-avatar.png"}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {member.name}
                    </h2>
                    <h4 className="text-lg font-semibold text-blue-400">
                      {member.role}
                    </h4>
                  </div>
                </div>
                
                {/* About Section */}
                <section className="space-y-1 md:space-y-2">
                  <h5 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2 mb-1">About Me</h5>
                  <p className={`text-xs md:text-sm lg:text-base leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {member.about}
                  </p>
                </section>
                
                {/* Background & Interests */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className={`space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400">Background</h6>
                    <p className={`text-xs md:text-sm lg:text-base leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{member.background}</p>
                  </div>
                  <div className={`space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400">Interests</h6>
                    <p className={`text-xs md:text-sm lg:text-base leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{member.interests}</p>
                  </div>
                </section>
                
                {/* Skills Section */}
                <section className="space-y-1 md:space-y-2">
                  <h5 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2 mb-1">Skillset</h5>
                  {member.skills && member.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {member.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="bg-blue-500/10 text-blue-400 border border-blue-400/30 rounded-full px-2 md:px-3 lg:px-4 py-1 text-xs md:text-sm lg:text-base font-semibold tracking-wide"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs md:text-sm lg:text-base text-zinc-400 italic">No skills listed yet</p>
                  )}
                </section>
                
                {/* Awards & Certifications Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className={`space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400">Awards</h6>
                    {member.awards && member.awards.length > 0 ? (
                      <ul className={`list-disc list-inside text-xs md:text-sm lg:text-base ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {member.awards.map((award: string) => (
                          <li key={award} className="mb-1">{award}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs md:text-sm lg:text-base text-zinc-400 italic">No awards yet</p>
                    )}
                  </div>
                  <div className={`space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400">Certifications</h6>
                    {member.certifications && member.certifications.length > 0 ? (
                      <ul className={`list-disc list-inside text-xs md:text-sm lg:text-base ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {member.certifications.map((cert: string) => (
                          <li key={cert} className="mb-1">{cert}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs md:text-sm lg:text-base text-zinc-400 italic">No certifications yet</p>
                    )}
                  </div>
                </section>
                
                {/* Location, Languages, Fun Fact */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                  <div className={`space-y-1 p-2 md:p-3 rounded-lg border flex flex-col items-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 mb-1 text-center">Location</h6>
                    <span className={`text-xs md:text-sm lg:text-base font-medium text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {member.location && member.location.trim() ? member.location : 'Location not specified'}
                    </span>
                  </div>
                  <div className={`space-y-1 p-2 md:p-3 rounded-lg border flex flex-col items-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 mb-1 text-center">Languages</h6>
                    <span className={`text-xs md:text-sm lg:text-base font-medium text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {member.languages && member.languages.length > 0 ? member.languages.join(', ') : 'No languages listed'}
                    </span>
                  </div>
                  <div className={`space-y-1 p-2 md:p-3 rounded-lg border flex flex-col items-center sm:col-span-2 lg:col-span-1 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 mb-1 text-center">Fun Fact</h6>
                    <span className={`text-xs md:text-sm lg:text-base font-medium text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {member.funFact && member.funFact.trim() ? member.funFact : 'No fun fact shared yet'}
                    </span>
                  </div>
                </section>
                
                {/* Quote Section */}
                <section className="space-y-1 md:space-y-2">
                  <h5 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2 mb-1">Quote</h5>
                  {member.quote && member.quote.trim() ? (
                    <div className={`relative p-2 md:p-3 rounded-lg bg-blue-500/10 border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                      <div className="absolute top-1 md:top-2 left-2 md:left-3 text-blue-400 text-lg md:text-xl lg:text-2xl font-serif select-none">"</div>
                      <blockquote className={`italic text-xs md:text-sm lg:text-base leading-relaxed pt-1 md:pt-2 pl-6 md:pl-8 pr-2 pb-1 md:pb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {member.quote}
                      </blockquote>
                      <div className="absolute bottom-1 md:bottom-2 right-2 md:right-3 text-blue-400 text-lg md:text-xl lg:text-2xl font-serif rotate-180 select-none">"</div>
                    </div>
                  ) : (
                    <p className="text-xs md:text-sm lg:text-base text-zinc-400 italic">No quote shared yet</p>
                  )}
                </section>
                
                {/* Connect Section */}
                <section className="space-y-1 md:space-y-2 pb-2">
                  <h5 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2 mb-1">Connect</h5>
                  <div className="flex gap-2 md:gap-3 justify-center">
                    {member.socials && member.socials.linkedin && (
                      <a 
                        href={member.socials.linkedin} 
                        target="_blank" 
                        rel="noopener" 
                        aria-label="LinkedIn" 
                        className={`group p-2 rounded-full border transition-all duration-200 ${theme === 'dark' ? 'bg-white/10 hover:bg-blue-500/20 border-white/20 hover:border-blue-400/40' : 'bg-black/10 hover:bg-blue-500/20 border-black/20 hover:border-blue-400/40'}`}
                      >
                        <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect x="2" y="9" width="4" height="12"/>
                          <circle cx="4" cy="4" r="2"/>
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
                        </svg>
                      </a>
                    )}
                    {member.socials && member.socials.twitter && (
                      <a 
                        href={member.socials.twitter} 
                        target="_blank" 
                        rel="noopener" 
                        aria-label="Twitter" 
                        className={`group p-2 rounded-full border transition-all duration-200 ${theme === 'dark' ? 'bg-white/10 hover:bg-blue-500/20 border-white/20 hover:border-blue-400/40' : 'bg-black/10 hover:bg-blue-500/20 border-black/20 hover:border-blue-400/40'}`}
                      >
                        <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1.64a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.7 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 0 1 .96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.82-.08.55 1.7 2.16 2.94 4.07 2.97A9.06 9.06 0 0 1 0 19.54a12.8 12.8 0 0 0 6.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71z"/>
                        </svg>
                      </a>
                    )}
                    {member.socials && member.socials.github && (
                      <a 
                        href={member.socials.github} 
                        target="_blank" 
                        rel="noopener" 
                        aria-label="GitHub" 
                        className={`group p-2 rounded-full border transition-all duration-200 ${theme === 'dark' ? 'bg-white/10 hover:bg-blue-500/20 border-white/20 hover:border-blue-400/40' : 'bg-black/10 hover:bg-blue-500/20 border-black/20 hover:border-blue-400/40'}`}
                      >
                        <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.12 2.51.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>
                        </svg>
                      </a>
                    )}
                    {member.socials && member.socials.dribbble && (
                      <a 
                        href={member.socials.dribbble} 
                        target="_blank" 
                        rel="noopener" 
                        aria-label="Dribbble" 
                        className={`group p-2 rounded-full border transition-all duration-200 ${theme === 'dark' ? 'bg-white/10 hover:bg-blue-500/20 border-white/20 hover:border-blue-400/40' : 'bg-black/10 hover:bg-blue-500/20 border-black/20 hover:border-blue-400/40'}`}
                      >
                        <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M2.05 13a10 10 0 0 0 15.9 5.55M22 12c0-5.52-4.48-10-10-10m0 0c-2.21 0-4.21.9-5.66 2.34M12 2c2.21 0 4.21.9 5.66 2.34M2.05 13c.81-2.13 2.5-3.81 4.63-4.62m0 0c2.13-.81 4.5-.81 6.63 0m0 0c2.13.81 3.82 2.49 4.63 4.62"/>
                        </svg>
                      </a>
                    )}
                                     </div>
                 </section>
               </div>
             </div>
           </div>
         </div>
       </div>
     ) : (
          /* Desktop Layout: Full Content */
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 md:p-6 lg:p-8 pt-12 md:pt-16">
              <div className="w-full max-w-2xl mx-auto space-y-3 md:space-y-4 lg:space-y-6">
            {/* Header Section */}
                <header className={`flex flex-col items-center gap-1 md:gap-2 border-b pb-2 md:pb-4 ${
                  theme === 'dark' ? 'border-white/10' : 'border-black/10'
                }`}>
                  <h2 className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-center ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                  {member.name}
                </h2>
                  <h4 className="text-sm md:text-lg lg:text-xl font-semibold text-blue-400 text-center">
                  {member.role}
                </h4>
              </header>
                
              {/* About Section */}
                <section className="space-y-1 md:space-y-2">
                  <h5 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2 mb-1">About Me</h5>
                  <p className={`text-xs md:text-sm lg:text-base leading-relaxed ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                  {member.about}
                </p>
              </section>
                
            {/* Background & Interests */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className={`space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg border ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400">Background</h6>
                    <p className={`text-xs md:text-sm lg:text-base leading-relaxed ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>{member.background}</p>
                </div>
                  <div className={`space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg border ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400">Interests</h6>
                    <p className={`text-xs md:text-sm lg:text-base leading-relaxed ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>{member.interests}</p>
                </div>
              </section>
                
            {/* Skills Section */}
                <section className="space-y-1 md:space-y-2">
                  <h5 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2 mb-1">Skillset</h5>
                  {member.skills && member.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {member.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="bg-blue-500/10 text-blue-400 border border-blue-400/30 rounded-full px-2 md:px-3 lg:px-4 py-1 text-xs md:text-sm lg:text-base font-semibold tracking-wide"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-xs md:text-sm lg:text-base text-zinc-400 italic ${
                      theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>No skills listed yet</p>
                  )}
                </section>
                
            {/* Awards & Certifications Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className={`space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg border ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400">Awards</h6>
                    {member.awards && member.awards.length > 0 ? (
                      <ul className={`list-disc list-inside text-xs md:text-sm lg:text-base ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {member.awards.map((award: string) => (
                          <li key={award} className="mb-1">{award}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-xs md:text-sm lg:text-base italic ${
                        theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>No awards yet</p>
                    )}
                  </div>
                  <div className={`space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg border ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400">Certifications</h6>
                    {member.certifications && member.certifications.length > 0 ? (
                      <ul className={`list-disc list-inside text-xs md:text-sm lg:text-base ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {member.certifications.map((cert: string) => (
                          <li key={cert} className="mb-1">{cert}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-xs md:text-sm lg:text-base italic ${
                        theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>No certifications yet</p>
                    )}
                  </div>
                </section>
                
            {/* Location, Languages, Fun Fact */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                  <div className={`space-y-1 p-2 md:p-3 rounded-lg border flex flex-col items-center ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 mb-1 text-center">Location</h6>
                    <span className={`text-xs md:text-sm lg:text-base font-medium text-center ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {member.location && member.location.trim() ? member.location : 'Location not specified'}
                    </span>
                  </div>
                  <div className={`space-y-1 p-2 md:p-3 rounded-lg border flex flex-col items-center ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 mb-1 text-center">Languages</h6>
                    <span className={`text-xs md:text-sm lg:text-base font-medium text-center ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {member.languages && member.languages.length > 0 ? member.languages.join(', ') : 'No languages listed'}
                    </span>
                  </div>
                  <div className={`space-y-1 p-2 md:p-3 rounded-lg border flex flex-col items-center sm:col-span-2 lg:col-span-1 ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <h6 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 mb-1 text-center">Fun Fact</h6>
                    <span className={`text-xs md:text-sm lg:text-base font-medium text-center ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {member.funFact && member.funFact.trim() ? member.funFact : 'No fun fact shared yet'}
                    </span>
                  </div>
                </section>
                
            {/* Quote Section */}
                <section className="space-y-1 md:space-y-2">
                  <h5 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2 mb-1">Quote</h5>
                  {member.quote && member.quote.trim() ? (
                    <div className={`relative p-2 md:p-3 rounded-lg bg-blue-500/10 border ${
                      theme === 'dark' ? 'border-white/10' : 'border-black/10'
                    }`}>
                      <div className="absolute top-1 md:top-2 left-2 md:left-3 text-blue-400 text-lg md:text-xl lg:text-2xl font-serif select-none">"</div>
                      <blockquote className={`italic text-xs md:text-sm lg:text-base leading-relaxed pt-1 md:pt-2 pl-6 md:pl-8 pr-2 pb-1 md:pb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {member.quote}
                      </blockquote>
                      <div className="absolute bottom-1 md:bottom-2 right-2 md:right-3 text-blue-400 text-lg md:text-xl lg:text-2xl font-serif rotate-180 select-none">"</div>
                    </div>
                  ) : (
                    <p className={`text-xs md:text-sm lg:text-base italic ${
                      theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>No quote shared yet</p>
                  )}
                </section>
                
            {/* Connect Section */}
                <section className="space-y-1 md:space-y-2 pb-2">
                  <h5 className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2 mb-1">Connect</h5>
                  <div className="flex gap-2 md:gap-3 justify-center">
                  {member.socials && member.socials.linkedin && (
                    <a 
                      href={member.socials.linkedin} 
                      target="_blank" 
                      rel="noopener" 
                      aria-label="LinkedIn" 
                        className={`group p-2 rounded-full border transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-white/10 hover:bg-blue-500/20 border-white/20 hover:border-blue-400/40' 
                            : 'bg-black/10 hover:bg-blue-500/20 border-black/20 hover:border-blue-400/40'
                        }`}
                    >
                    <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
                      </svg>
                    </a>
                  )}
                  {member.socials && member.socials.twitter && (
                    <a 
                      href={member.socials.twitter} 
                      target="_blank" 
                      rel="noopener" 
                      aria-label="Twitter" 
                        className={`group p-2 rounded-full border transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-white/10 hover:bg-blue-500/20 border-white/20 hover:border-blue-400/40' 
                            : 'bg-black/10 hover:bg-blue-500/20 border-black/20 hover:border-blue-400/40'
                        }`}
                    >
                    <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1.64a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.7 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 0 1 .96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.82-.08.55 1.7 2.16 2.94 4.07 2.97A9.06 9.06 0 0 1 0 19.54a12.8 12.8 0 0 0 6.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71z"/>
                      </svg>
                    </a>
                  )}
                  {member.socials && member.socials.github && (
                    <a 
                      href={member.socials.github} 
                      target="_blank" 
                      rel="noopener" 
                      aria-label="GitHub" 
                        className={`group p-2 rounded-full border transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-white/10 hover:bg-blue-500/20 border-white/20 hover:border-blue-400/40' 
                            : 'bg-black/10 hover:bg-blue-500/20 border-black/20 hover:border-blue-400/40'
                        }`}
                    >
                    <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.12 2.51.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>
                      </svg>
                    </a>
                  )}
                  {member.socials && member.socials.dribbble && (
                    <a 
                      href={member.socials.dribbble} 
                      target="_blank" 
                      rel="noopener" 
                      aria-label="Dribbble" 
                        className={`group p-2 rounded-full border transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-white/10 hover:bg-blue-500/20 border-white/20 hover:border-blue-400/40' 
                            : 'bg-black/10 hover:bg-blue-500/20 border-black/20 hover:border-blue-400/40'
                        }`}
                    >
                    <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2.05 13a10 10 0 0 0 15.9 5.55M22 12c0-5.52-4.48-10-10-10m0 0c-2.21 0-4.21.9-5.66 2.34M12 2c2.21 0 4.21.9 5.66 2.34M2.05 13c.81-2.13 2.5-3.81 4.63-4.62m0 0c2.13-.81 4.5-.81 6.63 0m0 0c2.13.81 3.82 2.49 4.63 4.62"/>
                      </svg>
                    </a>
                  )}
                </div>
              </section>
          </div>
        </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (selectedMember !== null && cardPanelRef.current && imagePanelRef.current) {
      gsap.set(cardPanelRef.current, { x: '-100vw', opacity: 0 });
      gsap.set(imagePanelRef.current, { scale: 0.92, opacity: 0 });
      gsap.to(cardPanelRef.current, {
        x: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power2.inOut',
      });
      gsap.to(imagePanelRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.1,
        ease: 'power2.inOut',
        delay: 0.15,
      });
    }
  }, [selectedMember]);

  useEffect(() => {
    nameElementsRef.current = [];
    nameHeadingsRef.current = [];
  }, [teamMembers]);

  return (
    <section className="team" ref={containerRef} style={{ position: "relative", overflow: "hidden", color: theme === 'dark' ? '#e3e3db' : '#222' }}>
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }} />
      
      {/* Blurred overlay and modal */}
      {selectedMember !== null && (
        <div className="info-card-overlay" ref={overlayRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 200, display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', alignItems: window.innerWidth < 768 ? 'center' : 'stretch', justifyContent: 'center', background: theme === 'dark' ? 'rgba(10, 10, 20, 0.7)' : 'rgba(255,255,255,0.7)' }}>
          {/* Desktop: Left Profile Image Panel */}
          {window.innerWidth >= 768 && (
          <div ref={imagePanelRef} style={{ position: 'relative', width: '50vw', height: '100vh', zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? '#181c20' : '#f3f3f3' }}>
            <div className="img img-expanded" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src={teamMembers[selectedMember].img || teamMembers[selectedMember].avatar || "/default-avatar.png"}
                alt={teamMembers[selectedMember].name}
                width={600}
                height={600}
                style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '0' }}
              />
            </div>
          </div>
          )}
          {/* Info Card Content */}
          <div ref={cardPanelRef} style={{ position: 'relative', width: window.innerWidth < 768 ? '90vw' : '50vw', height: window.innerWidth < 768 ? 'auto' : '100vh', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? '#000' : '#fff' }}>
            {renderInfoCard()}
          </div>
        </div>
      )}
      
      {/* Team images */}
      <div className="profile-images" ref={profileImagesContainerRef}>
        {teamMembers.map((member, index) => (
          <div
            key={member.name}
            className={`img${selectedMember === index ? " selected" : ""} w-[100px] h-[100px] md:w-[100px] md:h-[100px] rounded-xl`}
            ref={el => { if (el) profileImagesRef.current[index] = el; }}
            onClick={() => setSelectedMember(index)}
            style={{ cursor: selectedMember === null ? "pointer" : "default" }}
          >
            <Image
              src={member.img || member.avatar || "/default-avatar.png"}
              alt={`Team member ${member.name}`}
              width={100}
              height={100}
              priority={index < 4}
              className={`rounded-xl object-cover w-full h-full border-2 transition-all duration-200 ${
                theme === 'dark' ? 'hover:border-white/30' : 'hover:border-black/30'
              }`}
              style={{ 
                border: selectedMember === index 
                  ? `2px solid ${theme === 'dark' ? '#fff' : '#000'}` 
                  : "2px solid transparent", 
                borderRadius: '1rem' 
              }}
            />
          </div>
        ))}
      </div>

      <div className="profile-names">
        <div
          className="name default"
          ref={(el) => { if (el) nameElementsRef.current[0] = el; }}
        >
          <div className="name-mask">
          <h1 ref={(el) => { if (el) nameHeadingsRef.current[0] = el; }}
            className={`font-barlow font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            style={{ fontFamily: 'Barlow Condensed', fontWeight: 800 }}
          >The Squad</h1>
          </div>
        </div>
        {teamMembers.map((member, index) => (
          <div
            key={member.name}
            className="name"
            ref={(el) => { if (el) nameElementsRef.current[index + 1] = el; }}
          >
            <h1 ref={(el) => { if (el) nameHeadingsRef.current[index + 1] = el; }}
              className={`font-barlow font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}
              style={{ fontFamily: 'Barlow Condensed', fontWeight: 800 }}
            >
              {member.name}
            </h1>
          </div>
        ))}
      </div>

      <style jsx>{`
          .team {
            position: relative;
            width: 100vw;
            height: 100svh;
            color: #e3e3db;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2.5em;
            overflow: hidden;
          }
          .profile-images {
            width: max-content;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2.5em;
          }
          .img {
            position: relative;
            width: 70px;
            height: 70px;
            padding: 5px;
            border-radius: 1rem;
            background: #181c20;
            transition: box-shadow 0.2s;
            box-shadow: 0 2px 8px rgba(33,150,243,0.08);
          }
          .img.selected {
            z-index: 100;
          }
          .img img {
            border-radius: 1rem;
            transition: border 0.2s;
          }
          .info-card-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: row;
            align-items: stretch;
            justify-content: flex-start;
            z-index: 200;
            overflow: hidden;
          }
          .info-image-panel {
            width: 50vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 201;
          }
          .img-expanded {
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: none !important;
            padding: 0 !important;
          }
          .info-card-panel {
            width: 50vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 202;
          }
          .info-card-outer {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .info-card {
            color: #e3e3db;
            width: 90%;
            max-width: 520px;
            min-width: 320px;
            height: 90%;
            max-height: 800px;
            min-height: 480px;
            margin: auto;
            padding: 3.5rem 2.5rem 2.5rem 2.5rem;
            box-shadow: 0 0 32px 0 rgba(33,150,243,0.10), 0 2px 32px 0 rgba(0,0,0,0.25);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            border-radius: 2rem;
            position: relative;
            z-index: 201;
            font-family: 'Inter', 'Barlow Condensed', Arial, sans-serif;
            gap: 1.2rem;
            overflow-y: auto;
            border: 1.5px solid #181c20;
         }
         .info-card h2 {
           color: #fff;
           font-size: 2.6rem;
           font-weight: 800;
           margin-bottom: 0.2rem;
           letter-spacing: -0.02em;
           line-height: 1.1;
         }
         .info-card h4 {
           color: #2196f3;
           font-size: 1.25rem;
           font-weight: 600;
           margin-bottom: 1.2rem;
           letter-spacing: 0.01em;
         }
         .info-avatar-row {
           display: flex;
           align-items: center;
           gap: 1.5rem;
           margin-bottom: 2rem;
         }
         .info-avatar {
           border-radius: 50%;
           border: 3px solid #2196f3;
           background: #181c20;
           width: 96px;
           height: 96px;
           object-fit: cover;
         }
         .info-section {
           margin-bottom: 1.2rem;
           width: 100%;
         }
         .info-section h5 {
           color: #2196f3;
           font-size: 1.08rem;
           font-weight: 700;
           margin-bottom: 0.3rem;
           letter-spacing: 0.04em;
           text-transform: uppercase;
         }
         .info-about {
           color: #b0bec5;
           font-size: 1.08rem;
           line-height: 1.6;
           margin-bottom: 0.2rem;
         }
         .info-quote {
           color: #90caf9;
           font-size: 1.15rem;
           font-style: italic;
           border-left: 3px solid #2196f3;
           padding-left: 1rem;
           margin: 0.5rem 0 0 0;
         }
         .info-socials {
           display: flex;
           gap: 1.2rem;
           margin-top: 0.5rem;
         }
         .info-skill {
           color: #2196f3;
           border: 1px solid #2196f3;
           border-radius: 1.2rem;
           padding: 0.4rem 1.1rem;
           font-size: 1rem;
           font-weight: 500;
           letter-spacing: 0.03em;
         }
         .info-social-btn {
           display: flex;
           align-items: center;
           justify-content: center;
           width: 44px;
           height: 44px;
           border-radius: 50%;
           border: 1.5px solid #2196f3;
           transition: background 0.2s, border 0.2s;
         }
         .info-social-btn:hover {
           background: #2196f3;
           border-color: #1565c0;
         }
         .info-social-btn svg {
           display: block;
         }
          .close-btn {
            position: absolute;
            top: 1.2rem;
            right: 1.5rem;
            background: none;
            border: none;
            color: #2196f3;
            font-size: 2.2rem;
            cursor: pointer;
            z-index: 10;
            transition: color 0.2s;
          }
          .close-btn:hover {
            color: #1565c0;
          }
          .profile-names {
            width: 100%;
            height: 15rem;
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
            overflow: hidden;
            z-index: 10;
            position: relative;
          }
          .name {
            z-index: 10;
            position: relative;
          }
          .name h1 {
            position: absolute;
            width: 100%;
            text-align: center;
            text-transform: uppercase;
            font-family: "Barlow Condensed";
            font-size: 14rem;
            font-weight: 900;
            letter-spacing: -0.2rem;
            line-height: 1;
            color: #2196f3;
            user-select: none;
            transform: translateY(100%);
          }
          .name.default h1 {
          color: ${theme === 'dark' ? '#e3e3db' : '#000'};
            transform: translateY(-120%);
          }
          .name h1 .letter {
            position: relative;
            transform: translateY(0%);
            will-change: transform;
          }
          @media screen and (max-width: 900px) {
            .profile-images {
              flex-wrap: wrap;
              max-width: 90%;
              gap: 1.2em;
            }
            .img {
              width: 80px;
              height: 80px;
              padding: 2.5px;
              border-radius: 0.75rem;
            }
            .info-card-overlay {
              flex-direction: column;
            }
            .info-image-panel {
              width: 100vw;
              height: 40vh;
            }
            .info-card-panel {
              width: 100vw;
              height: 60vh;
              background: #000;
            }
            .info-card-outer {
              width: 100vw;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .info-card {
              width: 94vw;
              min-width: 0;
              max-width: 100vw;
              height: 95%;
              min-height: 0;
              max-height: 100%;
              border-radius: 0 0 2rem 2rem;
              padding: 2rem 1.2rem 1.2rem 1.2rem;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
            }
            .info-avatar-row {
              margin-bottom: 1.2rem;
            }
            .profile-names {
              height: 4rem;
            }
            .name h1 {
              font-size: 3rem;
              letter-spacing: 0;
              margin-top: 0.6em;
              transform: translateY(120%);
            }
          }
        `}</style>
    </section>
  );
}
