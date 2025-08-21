"use client"
import React, { useState, useEffect } from 'react';
import { ExternalLink, Code, Palette, Database, Smartphone, Globe, Calendar, Users, ArrowRight, Filter, Layers, Star, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import AnimatedGridBg from "@/components/AnimatedGridBg";
import { Sun, Moon } from "lucide-react";
import BrandedLoading from '@/components/BrandedLoading';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  icon?: React.ReactNode;
  category: string;
  image?: string;
  hero?: { banner?: string };
  year: string;
  team: string | { name: string }[];
  status: 'Completed' | 'In Progress' | 'Planning';
  technologies: string[];
  bestProject?: boolean;
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    'Completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Planning': 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  // Helper to truncate text to 2 lines (fallback for no line-clamp)
  function truncateText(text: string, maxChars = 80) {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars).replace(/\s+\S*$/, '') + '...';
  }
  const cardImage = project.hero?.banner || project.image || '';
  // Guard: Only render the View Details button if project.id is defined
  return (
    <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden flex flex-col h-full min-h-[420px] max-h-[420px] transition-all duration-300 z-10 bg-black/5 dark:bg-black/40 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20">
      {/* Image Section */}
      <div className="relative h-40 md:h-48 xl:h-56 overflow-hidden">
        <img 
          src={cardImage} 
          alt={project.title}
          className="w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-35"
        />
      </div>
      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 md:p-6">
        {/* Project Meta */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span>{project.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              <span>{Array.isArray(project.team) ? project.team.map((member: any) => member.name).join(', ') : project.team}</span>
            </div>
          </div>
          {project.bestProject && (
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-bold relative z-30">
              <Star className="w-3 h-3" />
              Best
            </div>
          )}
        </div>
        {/* Title and Description */}
        <h3 className="text-lg md:text-xl font-extrabold text-black dark:text-white mb-2 md:mb-3 group-hover:text-zinc-700 dark:group-hover:text-zinc-100 transition-colors duration-300 font-barlow truncate">
          {truncateText(project.title, 40)}
        </h3>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-3 md:mb-4 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors duration-300 font-sans line-clamp-2 min-h-[48px] max-h-[48px] overflow-hidden">
          {truncateText(project.longDescription, 80)}
        </p>
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs md:text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-200 dark:border-zinc-700 font-barlow"
            >
              {tech}
            </span>
          ))}
        </div>
        {/* Action Button */}
        {project.id !== undefined && project.id !== null ? (
          <Link href={`/projects/${String(project.id)}`} prefetch className="mt-auto group/btn inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-300 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:shadow-lg group-hover:transform group-hover:translate-y-[-2px] font-barlow text-sm md:text-base">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        ) : (
          <div className="mt-auto">
            <div className="inline-flex items-center justify-center gap-2 bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl font-barlow text-sm md:text-base cursor-not-allowed">
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Removed TechnologyFilter per request

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load projects");
        setLoading(false);
      });
  }, []);

  const allTechnologies: string[] = Array.from(new Set(projects.flatMap(p => p.technologies)));
  const filteredProjects = projects;

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
              <BrandedLoading />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  if (error) {
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
                <h1 className="text-3xl font-bold mb-4">Error loading projects</h1>
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

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
          {/* Hero Section - Full Width */}
          <section className="w-full bg-transparent py-20 px-0 border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10 pt-20 lg:pt-24">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
          <div className="flex-1 flex flex-col items-start justify-center text-left space-y-8 lg:pr-16 w-full">
            <div className="inline-flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/60 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800/50 mb-6 font-sans">
              <Star className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 font-barlow">Modern Portfolio</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight font-barlow text-black dark:text-white">
              Projects
            </h1>
            <div className="w-32 h-px bg-zinc-300 dark:bg-zinc-700 mb-8"></div>
            <p className="text-lg sm:text-xl text-zinc-700 dark:text-white max-w-2xl font-sans font-light">
              Explore our diverse portfolio of innovative solutions, crafted with precision and powered by the latest technologies. From AI-driven platforms to creative design systems, we deliver excellence across every domain.
            </p>
            <div className="flex flex-wrap gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-black dark:text-white mb-1 font-barlow">50+</div>
                <div className="text-base text-zinc-500 dark:text-zinc-400 font-medium font-barlow">Projects</div>
              </div>
              <div className="w-px h-12 bg-zinc-300 dark:bg-zinc-800"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-black dark:text-white mb-1 font-barlow">6</div>
                <div className="text-base text-zinc-500 dark:text-zinc-400 font-medium font-barlow">Categories</div>
              </div>
              <div className="w-px h-12 bg-zinc-300 dark:bg-zinc-800"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-black dark:text-white mb-1 font-barlow">98%</div>
                <div className="text-base text-zinc-500 dark:text-zinc-400 font-medium font-barlow">Success Rate</div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80" alt="Projects Hero" className="rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-xl object-cover border-4 border-zinc-200 dark:border-zinc-800" />
          </div>
        </div>
      </section>
      
      {/* Filter by Technology removed */}
      
      {/* Best Projects Section */}
      {!loading && !error && projects.filter(p => p.bestProject).length > 0 && (
        <section className="w-full bg-transparent py-14 md:py-20 border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
          <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-flex items-center gap-3 bg-yellow-100 dark:bg-yellow-900/30 px-6 py-3 rounded-full border border-yellow-200 dark:border-yellow-800/50 mb-5 font-sans">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300 font-barlow">Featured Projects</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-barlow tracking-tight mb-4 text-black dark:text-white">
                Our Best Projects
              </h2>
              <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-light font-sans">
                Showcasing our most innovative and successful projects that demonstrate our expertise and commitment to excellence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
              {projects.filter(p => p.bestProject).map((project) => (
                <div key={project.id} className="relative">
                  <div className="absolute -top-3 -right-3 z-30">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Best
                    </div>
                  </div>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* All Projects Section */}
      <section className="w-full bg-transparent py-14 md:py-20 border-b border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-barlow tracking-tight mb-4 text-black dark:text-white">
              All Projects
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-light font-sans">
              Discover our complete collection of projects, each representing our commitment to innovation and quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Technologies Section */}
      <section className="w-full py-14 bg-transparent border-t border-zinc-200 dark:border-zinc-800/50 relative z-10">
        <div className="max-w-[1700px] mx-auto px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black dark:text-white mb-8 font-barlow text-center">Technologies We Use</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {allTechnologies.map((tech: string) => (
              <div key={tech} className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl px-8 py-4 shadow-lg">
                <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-base sm:text-lg font-semibold text-black dark:text-white font-barlow">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="w-full py-14 md:py-20 bg-transparent border-t border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black dark:text-white mb-6 font-barlow">
            Ready to Start Your Project?
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 text-base sm:text-lg md:text-xl mb-10 leading-relaxed font-sans font-light">
            Let's collaborate and bring your vision to life with cutting-edge technology and innovative design solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <button className="bg-black dark:bg-white text-white dark:text-black font-semibold py-4 px-8 md:px-10 rounded-2xl transition-all duration-300 hover:bg-zinc-800 dark:hover:bg-zinc-100 hover:transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 font-barlow text-base md:text-lg">
                <span>Start a Project</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
          <Footer />
        </main>
      </div>
    </div>
  );
}