"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Star, Layers, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  console.log('useParams:', params);
  const id = params?.id ? String(params.id) : undefined;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

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
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading project...</h1>
          {id === undefined && <div className="text-red-500 mt-2">No project ID in URL</div>}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Project not found for id: {id}</h1>
          <Link href="/projects" className="text-blue-400 underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  // Render project details from backend
  return (
    <div className="min-h-screen w-full bg-black text-white transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button
        className="fixed top-4 right-4 z-50 bg-zinc-800 rounded-full p-2 shadow-lg border border-zinc-700 transition"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>
      {/* Back Button */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <Link href="/projects" className="inline-flex items-center gap-2 text-white hover:text-zinc-300 mb-8 transition-all duration-300 group bg-zinc-900 hover:bg-zinc-800 px-6 py-3 rounded-full border-2 border-zinc-800 hover:border-zinc-700 text-base font-medium font-barlow">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Projects</span>
        </Link>
      </div>
      {/* Hero Section */}
      <section className="w-full bg-black py-10 md:py-16 border-b border-zinc-800/50 transition-colors duration-300">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold font-barlow tracking-tight mb-6 text-white">
              {project.title}
            </h1>
            <div className="text-lg md:text-xl text-zinc-300 font-light mb-8 max-w-2xl font-sans">
              {project.hero?.description || project.description}
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 mb-8">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 md:px-5 py-2">
                <Calendar className="h-4 w-4 text-white" />
                <span className="text-white font-medium font-sans">{project.year}</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 md:px-5 py-2">
                <Users className="h-4 w-4 text-white" />
                <span className="text-white font-medium font-sans">{Array.isArray(project.team) ? project.team.map((m: any) => m.name).join(', ') : project.team}</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 md:px-5 py-2">
                <Star className="h-4 w-4 text-emerald-400" />
                <span className="text-white font-medium font-sans">{project.status}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src={project.hero?.banner || project.image} alt={project.title} className="rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-xl object-cover border-4 border-zinc-800" />
          </div>
        </div>
      </section>
      {/* Gallery Section */}
      {project.gallery && (
        <section className="w-full py-8 md:py-12 bg-black border-b border-zinc-800/50 transition-colors duration-300">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 relative">
            <Carousel>
              <CarouselContent>
                {project.gallery.map((img: string, idx: number) => (
                  <CarouselItem key={idx}>
                    <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-zinc-800 flex items-center justify-center h-64 md:h-96 bg-zinc-900">
                      <img src={img} alt={project.title + ' gallery'} className="w-full h-full object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-10" />
              <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>
          </div>
        </section>
      )}
      {/* Features Section */}
      {project.features && (
        <section className="w-full py-10 md:py-16 bg-black border-b border-zinc-800/50 transition-colors duration-300">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-8 font-barlow">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {project.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6 shadow-lg">
                  <Layers className="w-7 h-7 text-blue-400 mt-1" />
                  <span className="text-base md:text-lg font-semibold text-white font-barlow">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Technologies Section */}
      {project.technologies && (
        <section className="w-full py-10 md:py-16 bg-black border-b border-zinc-800/50 transition-colors duration-300">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-8 font-barlow">Technologies Used</h2>
            <div className="flex flex-wrap gap-4 md:gap-6">
              {project.technologies.map((tech: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 md:px-8 py-2 md:py-4 shadow-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-base md:text-lg font-semibold text-white font-barlow">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Team Section */}
      {project.team && Array.isArray(project.team) && (
        <section className="w-full py-10 md:py-16 bg-black border-b border-zinc-800/50 transition-colors duration-300">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-8 font-barlow">Project Team</h2>
            <div className="flex flex-wrap gap-6 md:gap-8">
              {project.team.map((member: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 md:px-8 py-2 md:py-4 shadow-lg">
                  <img src={member.avatar} alt={member.name} className="w-12 md:w-16 h-12 md:h-16 rounded-full border-2 border-zinc-700" />
                  <div>
                    <div className="font-extrabold text-base md:text-lg text-white font-barlow">{member.name}</div>
                    <div className="text-zinc-400 text-sm md:text-base font-sans">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Timeline Section */}
      {project.timeline && (
        <section className="w-full py-10 md:py-16 bg-black border-b border-zinc-800/50 transition-colors duration-300">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-8 font-barlow">Project Timeline</h2>
            <div className="flex flex-wrap gap-6 md:gap-8">
              {project.timeline.map((step: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 md:px-8 py-4 md:py-6 shadow-lg">
                  <div className="text-lg md:text-2xl font-extrabold text-blue-400 mb-2 font-barlow">{step.phase}</div>
                  <div className="text-zinc-400 text-base md:text-lg font-sans">{step.date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Long Description Section */}
      {project.longDescription && (
        <section className="w-full py-10 md:py-16 bg-black border-b border-zinc-800/50 transition-colors duration-300">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-8 font-barlow">Project Overview</h2>
            <div className="prose max-w-none text-base md:text-lg text-zinc-200 font-sans mb-8">
              <p>{project.longDescription}</p>
            </div>
          </div>
        </section>
      )}
      {/* Testimonials Section */}
      {project.testimonials && project.testimonials.length > 0 && (
        <section className="w-full py-10 md:py-16 bg-black border-b border-zinc-800/50 transition-colors duration-300">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-8 font-barlow">What Our Clients Say</h2>
            <div className="flex flex-wrap gap-6 md:gap-8">
              {project.testimonials.map((t: any, idx: number) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 md:px-8 py-6 md:py-8 shadow-lg max-w-xl">
                  <div className="text-base md:text-xl text-zinc-200 italic mb-4 font-sans">“{t.quote}”</div>
                  <div className="text-zinc-400 text-base md:text-lg font-extrabold font-barlow">{t.author}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 