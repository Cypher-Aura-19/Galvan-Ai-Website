"use client"
import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Calendar, Tag, ArrowRight } from 'lucide-react';
import { useTheme } from './theme-provider';

// Updated Project interface to match backend structure
interface Project {
  id: number;
  hero: {
    subtitle: string;
    description: string;
    banner: string;
  };
  technologies: string[];
  longDescription: string;
  bestProject?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isImageLeft: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isImageLeft }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Theme-based colors
  const textPrimary = isLight ? 'text-zinc-900' : 'text-white';
  const textSecondary = isLight ? 'text-zinc-600' : 'text-gray-300';
  const textTertiary = isLight ? 'text-zinc-500' : 'text-gray-400';
  const bgOverlay = isLight ? 'bg-zinc-900/20' : 'bg-black/20';
  const bgOverlayHover = isLight ? 'bg-zinc-900/40' : 'bg-black/40';
  const bgGlass = isLight ? 'bg-white/10' : 'bg-white/5';
  const bgGlassHover = isLight ? 'bg-white/20' : 'bg-white/10';
  const borderGlass = isLight ? 'border-white/20' : 'border-white/10';
  const borderGlassHover = isLight ? 'border-white/40' : 'border-white/25';
  const techBg = isLight ? 'bg-zinc-800/10' : 'bg-white/5';
  const techBgHover = isLight ? 'bg-zinc-800/20' : 'bg-white/10';
  const techBorder = isLight ? 'border-zinc-700/20' : 'border-white/10';
  const techBorderHover = isLight ? 'border-zinc-700/40' : 'border-white/25';
  const buttonPrimaryBg = isLight ? 'bg-zinc-800 text-white' : 'bg-white text-black';
  const buttonPrimaryHover = isLight ? 'hover:bg-zinc-700' : 'hover:bg-gray-100';
  const buttonSecondaryBg = isLight ? 'border-zinc-700/30 text-zinc-800' : 'border-white/30 text-white';
  const buttonSecondaryHover = isLight ? 'hover:bg-zinc-800/10 hover:border-zinc-700/50' : 'hover:bg-white/10 hover:border-white/50';
  const connectionLine = isLight ? 'bg-zinc-800/60' : 'bg-white/60';

  // Get year from created_at or use current year
  const getYear = () => {
    if (project.created_at) {
      return new Date(project.created_at).getFullYear().toString();
    }
    return new Date().getFullYear().toString();
  };

  // Get first 2-3 lines of description
  const getShortDescription = () => {
    const description = project.hero.description || '';
    const lines = description.split('\n');
    return lines.slice(0, 2).join('\n');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-24 items-center transform transition-all duration-1000 ease-out rounded-3xl p-6 md:p-8 lg:p-12 ${
        isLight 
          ? 'bg-white lg:bg-transparent lg:backdrop-blur-[2.1px]' 
          : 'bg-black lg:bg-transparent lg:backdrop-blur-[2.1px]'
      } ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-20 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Image Section */}
      <div className={`${isImageLeft ? 'lg:order-1' : 'lg:order-2'} group`}>
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl shadow-black/50 hover:shadow-white/20 transition-all duration-700 hover:scale-[1.02] max-w-2xl mx-auto lg:max-w-none">
          {/* Image Container */}
          <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px] overflow-hidden">
            <img 
              src={project.hero.banner || '/placeholder.svg'} 
              alt={project.hero.subtitle || 'Untitled Project'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Modern Overlay Gradients */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgOverlay} via-transparent ${bgOverlayHover}`} />
            <div className={`absolute inset-0 bg-gradient-to-t ${bgOverlayHover} via-transparent to-transparent`} />
            
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Floating Year Badge */}
          <div className={`absolute top-6 right-6 md:top-10 md:right-10 ${bgGlass} backdrop-blur-xl border ${borderGlass} rounded-xl md:rounded-2xl px-4 py-2 md:px-8 md:py-4 shadow-lg`}>
            <div className={`flex items-center space-x-2 ${textPrimary} font-barlow font-bold`}>
              <Calendar className="w-4 h-4 md:w-6 md:h-6" />
              <span className="font-extrabold text-lg md:text-xl font-barlow text-white">{getYear()}</span>
            </div>
          </div>

          {/* Modern Border Effect */}
          <div className={`absolute inset-0 rounded-2xl md:rounded-3xl border ${borderGlass} group-hover:${borderGlassHover} transition-all duration-500`} />
        </div>
      </div>

      {/* Content Section */}
      <div className={`${isImageLeft ? 'lg:order-2 lg:pl-8 xl:pl-16' : 'lg:order-1 lg:pr-8 xl:pr-16'} space-y-8 md:space-y-10 lg:space-y-12 max-w-3xl mx-auto lg:max-w-none`}>
        {/* Header */}
        <div className="space-y-6 md:space-y-8">
          <h3 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-barlow leading-tight tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>{project.hero.subtitle || 'Untitled Project'}</h3>
          
          <p className={`text-lg sm:text-xl leading-relaxed font-sans ${isLight ? 'text-zinc-700' : 'text-white'}`}>
            {getShortDescription()}
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="space-y-4 md:space-y-6">
          <div className={`flex items-center space-x-2 ${isLight ? 'text-zinc-500' : 'text-gray-400'} font-sans`}>
            <Tag className="w-4 h-4 md:w-5 md:h-5" />
            <span className={`font-bold text-xl sm:text-2xl font-barlow ${isLight ? 'text-zinc-900' : 'text-white'}`}>Technologies</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {project.technologies.map((tech: string, techIndex: number) => (
              <div 
                key={tech}
                className={`group/tech relative overflow-hidden rounded-lg md:rounded-xl ${techBg} backdrop-blur-xl border ${techBorder} p-2 md:p-3 transition-all duration-300 hover:scale-105 ${isLight ? 'hover:border-blue-500/40' : 'hover:border-blue-400/40'}`}
                style={{ animationDelay: `${techIndex * 100}ms` }}
              >
                <div className="relative z-10">
                  <span className={`font-medium text-base md:text-lg font-sans block text-center transition-colors duration-300 ${isLight ? 'text-zinc-900 group-hover/tech:text-blue-700' : 'text-white group-hover/tech:text-blue-300'}`}>{tech}</span>
                </div>
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover/tech:opacity-100 transition-opacity duration-300 ${isLight ? 'bg-blue-500/10' : 'bg-blue-400/10'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 pt-6 md:pt-8">
          <a 
            href={`/projects/${project.id}`}
            className={`group/btn inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl border ${
              isLight
                ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-white hover:text-zinc-900 hover:border-blue-600/60'
                : 'bg-black text-white border-white hover:bg-white hover:text-black hover:border-blue-400/60'
            } font-barlow font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isLight ? 'hover:shadow-blue-600/25' : 'hover:shadow-blue-400/25'
            } relative overflow-hidden`}
          >
            <span className="relative z-10 flex items-center font-barlow font-bold">
              <ExternalLink className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              View Project
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
            </span>
            
            {/* Button Shine Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700`} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;