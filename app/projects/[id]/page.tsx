"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Star, Layers, CheckCircle, ExternalLink, Globe, Code, Palette, Database, Smartphone, Award, TrendingUp, Eye, Heart, Download, Play } from 'lucide-react';
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import AnimatedGridBg from "@/components/AnimatedGridBg";
import { Sun, Moon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  console.log('useParams:', params);
  const id = params?.id ? String(params.id) : undefined;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!id) {
      setError('No project ID in URL');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        console.log('Fetched projects:', data);
        console.log('Looking for id:', id);
        // Try to match both string and number ids, and _id if present
        let found = data.find((p: any) => String(p.id) === id || String(p._id) === id);
        if (!found && data.length > 0) {
          // Log the first project for debugging
          console.log('First project in data:', data[0]);
        }
        setProject(found);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load project");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <AnimatedGridBg />
        <div className="relative z-10">
          <Navbar />
          <main>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-zinc-600 dark:border-zinc-400 mx-auto mb-4"></div>
                <h1 className="text-2xl font-bold mb-2">Loading project...</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Please wait while we fetch the project details</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <AnimatedGridBg />
        <div className="relative z-10">
          <Navbar />
          <main>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center max-w-md mx-auto px-4">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-zinc-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-zinc-600 dark:text-zinc-400">Project Not Found</h1>
                <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                  We couldn't find the project you're looking for. It may have been moved or deleted.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/projects" className="bg-zinc-600 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                    Browse All Projects
                  </Link>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500 text-white';
      case 'in progress':
        return 'bg-blue-500 text-white';
      case 'planning':
        return 'bg-amber-500 text-white';
      case 'on hold':
        return 'bg-zinc-500 text-white';
      default:
        return 'bg-zinc-500 text-white';
    }
  };

  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'web development':
        return <Globe className="w-5 h-5" />;
      case 'mobile app':
        return <Smartphone className="w-5 h-5" />;
      case 'ui/ux design':
        return <Palette className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'ai/ml':
        return <Code className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  // Render project details from backend
  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* === Animated Grid Background === */}
      <AnimatedGridBg />
      
      {/* === Foreground Page Content === */}
      <div className="relative z-10">
        <Navbar />
        <main>
          {/* Back Button */}
          <div className="w-full px-4 sm:px-6 lg:px-8 pt-8 relative z-10 pt-20 lg:pt-24">
        <div className="max-w-[1700px] mx-auto">
          <Link href="/projects" className="inline-flex items-center gap-3 text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 mb-8 transition-all duration-300 group bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-base font-medium font-barlow shadow-lg hover:shadow-xl">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>
      
      {/* Hero Section - Enhanced */}
      <section className="w-full bg-transparent py-16 md:py-24 border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1700px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Category Badge */}
                {project.category && (
                  <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 font-medium">
                    {getCategoryIcon(project.category)}
                    <span>{project.category}</span>
                  </div>
                )}
                
                {/* Project Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-barlow tracking-tight leading-tight text-black dark:text-white">
                  {project.hero.subtitle}
                </h1>
                
                {/* Project Name before Description */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-barlow text-zinc-700 dark:text-zinc-300">
                    {project.title}
                  </h2>
                  {/* Description */}
                  <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 font-light leading-relaxed max-w-2xl">
                    {project.hero?.description || project.description}
                  </p>
                </div>
                
                {/* Project Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {project.year && (
                    <div className="text-center p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                      <Calendar className="w-6 h-6 text-zinc-600 dark:text-zinc-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-black dark:text-white">{project.year}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">Year</div>
                    </div>
                  )}
                  
                  {project.team && (
                    <div className="text-center p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                      <Users className="w-6 h-6 text-zinc-600 dark:text-zinc-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-black dark:text-white">
                        {Array.isArray(project.team) ? project.team.length : 1}
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">Team</div>
                    </div>
                  )}
                  
                  {project.status && (
                    <div className="text-center p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                      <TrendingUp className="w-6 h-6 text-zinc-600 dark:text-zinc-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-black dark:text-white capitalize">{project.status}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">Status</div>
                    </div>
                  )}
                  
                  {project.bestProject && (
                    <div className="text-center p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                      <Award className="w-6 h-6 text-zinc-600 dark:text-zinc-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-black dark:text-white">★</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">Featured</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Image */}
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
                  <img 
                    src={project.hero?.banner || project.image} 
                    alt={project.title} 
                    className="w-full h-auto object-cover"
                  />
                  {/* Status Badge Overlay */}
                  {project.status && (
                    <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Section - Enhanced */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-transparent border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1700px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-barlow mb-4 text-black dark:text-white tracking-tight">
                  Project Gallery
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
                  Explore the visual journey of this project through our curated collection of screenshots and mockups.
                </p>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {project.gallery.map((img: string, idx: number) => (
                    <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                      <div className="group relative overflow-hidden rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                        <img 
                          src={img} 
                          alt={`${project.title} - Gallery ${idx + 1}`} 
                          className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="right-4 top-1/2 -translate-y-1/2" />
              </Carousel>
            </div>
          </div>
        </section>
      )}
      
      {/* Features Section - Enhanced */}
      {project.features && project.features.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-transparent border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1700px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-barlow mb-4 text-black dark:text-white tracking-tight">
                  Key Features
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto font-light leading-relaxed">
                  Discover the innovative features that make this project stand out and deliver exceptional user experience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {project.features.map((feature: string, idx: number) => (
                  <div key={idx} className="group bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-2xl hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                      <Layers className="w-8 h-8 text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-3 font-barlow group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      Feature {idx + 1}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Technologies Section - Enhanced */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-transparent border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1700px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-barlow mb-4 text-black dark:text-white tracking-tight">
                  Technologies Used
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto font-light leading-relaxed">
                  Built with cutting-edge technologies and frameworks to ensure scalability, performance, and maintainability.
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {project.technologies.map((tech: string, idx: number) => (
                  <div key={idx} className="group bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:shadow-xl hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                      <CheckCircle className="w-6 h-6 text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-black dark:text-white font-barlow group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Team Section - Enhanced */}
      {project.team && Array.isArray(project.team) && project.team.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-transparent border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1700px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-barlow mb-4 text-black dark:text-white tracking-tight">
                  Project Team
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto font-light leading-relaxed">
                  Meet the talented professionals who brought this project to life with their expertise and dedication.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {project.team.map((member: any, idx: number) => (
                  <div key={idx} className="group bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-center hover:shadow-xl hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                    <div className="relative mb-6">
                      <img 
                        src={member.avatar || '/placeholder-user.jpg'} 
                        alt={member.name} 
                        className="w-20 h-20 rounded-full mx-auto border-4 border-white dark:border-zinc-800 shadow-lg object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2 font-barlow group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{member.name}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Timeline Section - Enhanced */}
      {project.timeline && project.timeline.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-transparent border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1700px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-barlow mb-4 text-black dark:text-white tracking-tight">
                  Project Timeline
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto font-light leading-relaxed">
                  Follow the journey of this project from conception to completion, highlighting key milestones and achievements.
                </p>
              </div>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                
                <div className="space-y-12">
                  {project.timeline.map((step: any, idx: number) => (
                    <div key={idx} className={`relative flex items-center ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      {/* Timeline Dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-zinc-600 dark:bg-zinc-400 rounded-full border-4 border-white dark:border-zinc-800 shadow-lg z-10"></div>
                      
                      {/* Content */}
                      <div className={`w-5/12 ${idx % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                          <div className="text-2xl font-bold text-zinc-600 dark:text-zinc-400 mb-2 font-barlow group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {step.phase}
                          </div>
                          <div className="text-zinc-600 dark:text-zinc-400 font-medium">
                            {step.date}
                          </div>
                          {step.description && (
                            <p className="text-zinc-600 dark:text-zinc-300 mt-3 text-sm leading-relaxed font-light">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Long Description Section - Enhanced */}
      {project.longDescription && (
        <section className="w-full py-16 md:py-24 bg-transparent border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1700px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-barlow mb-4 text-black dark:text-white tracking-tight">
                  Project Overview
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto font-light leading-relaxed">
                  A comprehensive look at the project's objectives, challenges, and the innovative solutions we implemented.
                </p>
              </div>
              
              <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="prose prose-lg max-w-none text-zinc-700 dark:text-zinc-200">
                  <p className="text-lg leading-relaxed font-light">{project.longDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Testimonials Section - Enhanced */}
      {project.testimonials && project.testimonials.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-transparent border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1700px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-barlow mb-4 text-black dark:text-white tracking-tight">
                  Client Feedback
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto font-light leading-relaxed">
                  Hear what our clients have to say about their experience working with us on this project.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {project.testimonials.map((t: any, idx: number) => (
                  <div key={idx} className="group bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-xl hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                        <Heart className="w-6 h-6 text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                      </div>
                      <div>
                        <div className="font-bold text-black dark:text-white font-barlow group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{t.author}</div>
                        {t.company && (
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.company}</div>
                        )}
                      </div>
                    </div>
                    <blockquote className="text-zinc-700 dark:text-zinc-200 italic leading-relaxed text-lg font-light">
                      "{t.quote}"
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Call to Action Section */}
          <Footer />
        </main>
      </div>
    </div>
  );
} 