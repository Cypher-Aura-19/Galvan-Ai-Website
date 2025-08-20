"use client";
import React, { useRef, useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { useTheme } from './theme-provider';

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

const Timeline: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollAnimation(timelineRef as React.RefObject<HTMLElement>);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [bestProjects, setBestProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Use backend data as-is
  useEffect(() => {
    async function fetchBestProjects() {
      try {
        const response = await fetch('/api/projects/best');
        if (response.ok) {
          const data = await response.json();
          console.log('Best projects API response:', data);
          const limitedProjects = data.slice(0, 4); // Use directly
          setBestProjects(limitedProjects);
        } else {
          console.error('Failed to fetch best projects');
          setBestProjects([]);
        }
      } catch (error) {
        console.error('Error fetching best projects:', error);
        setBestProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBestProjects();
  }, []);

  // Theme styling
  const timelineLineBg = isLight 
    ? 'bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-300' 
    : 'bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800';
  
  const progressBarBg = isLight 
    ? 'bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-800' 
    : 'bg-gradient-to-b from-white via-gray-200 to-gray-400';
  
  const progressBarShadow = isLight 
    ? 'shadow-lg shadow-zinc-600/30' 
    : 'shadow-lg shadow-white/30';
  
  const startDotBg = isLight ? 'bg-zinc-800' : 'bg-white';
  const startDotBorder = isLight ? 'border-zinc-200' : 'border-gray-900';
  const startDotShadow = isLight ? 'shadow-xl shadow-zinc-800/40' : 'shadow-xl shadow-white/40';
  const startDotRing = isLight ? 'ring-2 ring-zinc-800/20' : 'ring-2 ring-white/20';
  
  const nodeBg = isLight 
    ? 'bg-gradient-to-br from-zinc-800 to-zinc-700' 
    : 'bg-gradient-to-br from-white to-gray-200';
  const nodeBorder = isLight ? 'border-zinc-200' : 'border-gray-900';
  const nodeShadow = isLight ? 'shadow-xl shadow-zinc-800/50' : 'shadow-xl shadow-white/50';
  const nodeRing = isLight ? 'ring-4 ring-zinc-800/10' : 'ring-4 ring-white/10';
  
  const endDotBg = isLight 
    ? 'bg-gradient-to-br from-zinc-500 to-zinc-600' 
    : 'bg-gradient-to-br from-gray-600 to-gray-800';
  const endDotBorder = isLight ? 'border-zinc-200' : 'border-gray-900';
  const endDotShadow = isLight ? 'shadow-xl' : 'shadow-xl';
  const endDotRing = isLight ? 'ring-2 ring-zinc-600/20' : 'ring-2 ring-gray-600/20';
  
  const buttonBg = isLight ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-black text-white border-white';
  const buttonHover = isLight ? 'hover:bg-white hover:text-zinc-800 hover:border-zinc-800' : 'hover:bg-white hover:text-black hover:border-black';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (bestProjects.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold mb-4">No Best Projects Yet</h3>
        <p className="text-gray-600 mb-8">Add some projects and mark them as "Best Project" to see them here.</p>
        <a
          href="/admin/projects"
          className={`px-6 py-3 ${buttonBg} border rounded-lg font-barlow text-base font-bold transition ${buttonHover} duration-200`}
        >
          Manage Projects
        </a>
      </div>
    );
  }

  return (
    <>
      <div ref={timelineRef} className="relative w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Timeline Line */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-full ${timelineLineBg} rounded-full shadow-lg z-10 lg:z-20`}>
          <div 
            className={`w-full ${progressBarBg} ${progressBarShadow} transition-all duration-500 ease-out rounded-full`}
            style={{ height: `${progress}%` }}
          />
        </div>

        {/* Start Dot */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-2 w-6 h-6 sm:w-8 sm:h-8 ${startDotBg} rounded-full border-2 sm:border-4 ${startDotBorder} z-20 ${startDotShadow} ${startDotRing}`} />

        {/* Project Cards */}
        <div className="space-y-24 sm:space-y-32 md:space-y-40 lg:space-y-48 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
          {bestProjects.map((project, index) => (
            <div key={project.id || index} className="relative">
              <div className="z-20 lg:z-0 relative">
                <ProjectCard 
                  project={project} 
                  index={index}
                  isImageLeft={index % 2 === 0}
                />
              </div>
            </div>
          ))}
        </div>

        {/* End Dot */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 translate-y-8 sm:translate-y-10 w-6 h-6 sm:w-8 sm:h-8 ${endDotBg} rounded-full border-2 sm:border-4 ${endDotBorder} z-20 ${endDotShadow} ${endDotRing}`} />
      </div>
      
      {/* View More Button */}
      <div className="flex justify-center mt-16 sm:mt-20 md:mt-24 lg:mt-32 px-4">
        <a
          href="/projects"
          className={`px-6 sm:px-8 py-3 sm:py-4 ${buttonBg} border rounded-lg font-barlow text-base sm:text-lg font-bold transition ${buttonHover} duration-200`}
        >
          View More Projects
        </a>
      </div>
    </>
  );
};

export default Timeline;
