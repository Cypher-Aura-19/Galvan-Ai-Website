"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Project = {
  _id?: string;
  hero: {
    subtitle: string;
    description: string;
    banner: string;
  };
  gallery: string[];
  features: string[];
  team: { name: string; role: string; avatar: string }[];
  timeline: { phase: string; date: string }[];
  testimonials: { quote: string; author: string }[];
  technologies: string[];
  longDescription: string;
  bestProject?: boolean;
};

const emptyProject: Project = {
  hero: { subtitle: "", description: "", banner: "" },
  gallery: [],
  features: [],
  team: [],
  timeline: [],
  testimonials: [],
  technologies: [],
  longDescription: "",
  bestProject: false,
};

type View = "menu" | "add" | "get" | "edit";

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState<View>("menu");

  // Add chip input state for features, technologies, gallery
  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (view === "get") fetchProjects();
  }, [view]);

  async function fetchProjects() {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (name.startsWith("hero.")) {
      const key = name.split(".")[1];
      setForm(f => ({ ...f, hero: { ...f.hero, [key]: value } }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleArrayChange(name: keyof Project, value: string) {
    setForm(f => ({ ...f, [name]: value.split(",").map(s => s.trim()).filter(Boolean) }));
  }

  function handleTeamChange(index: number, key: string, value: string) {
    setForm(f => ({ ...f, team: f.team.map((m, i) => i === index ? { ...m, [key]: value } : m) }));
  }

  function handleTimelineChange(index: number, key: string, value: string) {
    setForm(f => ({ ...f, timeline: f.timeline.map((m, i) => i === index ? { ...m, [key]: value } : m) }));
  }

  function handleTestimonialChange(index: number, key: string, value: string) {
    setForm(f => ({ ...f, testimonials: f.testimonials.map((m, i) => i === index ? { ...m, [key]: value } : m) }));
  }

  function addTeamMember() {
    setForm(f => ({ ...f, team: [...f.team, { name: "", role: "", avatar: "" }] }));
  }
  function removeTeamMember(index: number) {
    setForm(f => ({ ...f, team: f.team.filter((_, i) => i !== index) }));
  }
  function addTimeline() {
    setForm(f => ({ ...f, timeline: [...f.timeline, { phase: "", date: "" }] }));
  }
  function removeTimeline(index: number) {
    setForm(f => ({ ...f, timeline: f.timeline.filter((_, i) => i !== index) }));
  }
  function addTestimonial() {
    setForm(f => ({ ...f, testimonials: [...f.testimonials, { quote: "", author: "" }] }));
  }
  function removeTestimonial(index: number) {
    setForm(f => ({ ...f, testimonials: f.testimonials.filter((_, i) => i !== index) }));
  }

  function startEdit(project: Project) {
    setEditingId(project._id!);
    setForm({ ...project });
    setView("edit");
  }

  function resetForm() {
    setForm(emptyProject);
    setEditingId(null);
    setError("");
    setSuccess("");
    setView("menu");
  }

  // Handle file upload for hero banner
  function handleHeroBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file for the hero banner');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, hero: { ...f.hero, banner: reader.result as string } }));
    reader.readAsDataURL(file);
  }

  // Handle gallery file uploads
  function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (form.gallery.length + files.length > 10) {
      toast.error('Maximum 10 files allowed in gallery');
      return;
    }
    
    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a valid image or video file`);
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setForm(f => ({ ...f, gallery: [...f.gallery, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Frontend validation
    if (!form.hero.subtitle.trim()) {
      setError("Hero subtitle is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.hero.description.trim()) {
      setError("Hero description is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.hero.banner.trim()) {
      setError("Hero banner is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!Array.isArray(form.gallery)) {
      setError("Gallery must be an array");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!Array.isArray(form.features)) {
      setError("Features must be an array");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!Array.isArray(form.team)) {
      setError("Team must be an array");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!Array.isArray(form.timeline)) {
      setError("Timeline must be an array");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!Array.isArray(form.testimonials)) {
      setError("Testimonials must be an array");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!Array.isArray(form.technologies)) {
      setError("Technologies must be an array");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.longDescription.trim()) {
      setError("Long description is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, _id: editingId } : form;
    try {
      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(editingId ? "Project updated successfully!" : "Project added successfully!");
        setTimeout(() => {
          setView("menu");
          setEditingId(null);
          setForm(emptyProject);
          fetchProjects();
        }, 2000);
      } else {
        toast.error(data.error || "Failed to save project");
      }
    } catch (err) {
      toast.error("Network or server error");
      console.error(err);
    }
    setLoading(false);
  }

  async function handleDelete(_id: string | undefined) {
    if (!_id) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    if (res.ok) {
      toast.success("Project deleted successfully!");
      fetchProjects();
    } else {
      toast.error("Failed to delete project");
    }
    setLoading(false);
  }

  return (
    <AdminLayout>
      <div className="py-14 px-4 relative min-h-screen bg-black">
        <button onClick={() => router.push("/admin/dashboard")} className="absolute top-8 left-8 px-7 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold z-20 shadow-2xl border border-zinc-800 backdrop-blur-lg transition-all duration-200">
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </span>
        </button>
        <div className="max-w-7xl mx-auto">
          {/* Info Banner */}
          <div className="mb-10">
            <div className="flex items-center gap-4 bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-lg animate-fade-in">
              <svg className="w-8 h-8 text-blue-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
              <div>
                <div className="text-lg font-bold text-white">Welcome to Projects Management</div>
                <div className="text-zinc-400 text-sm">Create, edit, and manage your projects with advanced controls and beautiful UI.</div>
              </div>
            </div>
          </div>
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-900/90 to-blue-700/60 rounded-2xl p-5 shadow-2xl border border-blue-900">
                <svg className="w-14 h-14 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-1 bg-gradient-to-r from-blue-400 via-white to-blue-600 bg-clip-text text-transparent drop-shadow-xl">Projects Management</h1>
                <p className="text-zinc-400 text-lg font-medium">Manage all your projects, features, and teams in one place.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setView("add")}
                className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 rounded-2xl text-white font-bold shadow-2xl border border-blue-900 transition-all text-lg flex items-center gap-2 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Project
              </button>
              <button
                onClick={() => setView("get")}
                className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold shadow-2xl border border-zinc-800 transition-all text-lg flex items-center gap-2 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                View Projects
              </button>
            </div>
          </div>
          {/* Info Cards Section */}
          <div className="flex flex-wrap gap-8 mb-12">
            <div className="flex items-center gap-4 bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-8 min-w-[240px] shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <svg className="w-12 h-12 text-blue-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
              <div>
                <div className="text-3xl font-extrabold text-blue-200 drop-shadow">{projects.length}</div>
                <div className="text-zinc-400 text-base font-semibold">Total Projects</div>
              </div>
            </div>
            {/* Add more info cards here if desired */}
          </div>
          <div className="mb-12 border-t border-zinc-800/80" />
          {(view === "add" || view === "edit") && (
            <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 rounded-3xl shadow-2xl border border-zinc-800 max-w-4xl mx-auto mb-16">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-zinc-950/90 to-zinc-900/80 border-b border-zinc-800 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <button onClick={() => setView("menu")} className="px-6 py-2 bg-zinc-700 hover:bg-zinc-800 rounded-lg text-white font-bold transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <h2 className="text-3xl font-bold text-white">{view === "edit" ? "Edit" : "Add"} Project</h2>
                  <div className="w-20"></div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {error && <div className="text-red-500 mb-4 text-center bg-red-900/20 border border-red-600/30 rounded-lg p-3">{error}</div>}
                
              <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Hero Subtitle</label>
                        <input 
                          name="hero.subtitle" 
                          value={form.hero.subtitle} 
                          onChange={handleChange} 
                          placeholder="Enter hero subtitle..." 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Hero Description</label>
                        <input 
                          name="hero.description" 
                          value={form.hero.description} 
                          onChange={handleChange} 
                          placeholder="Enter hero description..." 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Banner Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      Hero Banner
                    </h3>
                    <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                        onChange={handleHeroBannerUpload}
                        className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 transition-all"
                    />
                    {form.hero.banner && (
                        <div className="relative group">
                          <img 
                            src={form.hero.banner} 
                            alt="Banner Preview" 
                            className="h-20 w-32 rounded-xl border-2 border-zinc-700 object-cover shadow-lg group-hover:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-zinc-400 text-sm mt-2">Upload an image file (max 5MB)</p>
                  </div>

                  {/* Gallery Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      Gallery Files
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 transition-all"
                      />
                      <p className="text-zinc-400 text-sm">Upload images or videos (max 10 files, 10MB each)</p>
                      
                      {/* Gallery Preview */}
                      {form.gallery.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {form.gallery.map((file, index) => (
                            <div key={index} className="relative group">
                              {file.startsWith('data:image/') ? (
                                <img src={file} alt={`Gallery ${index + 1}`} className="h-20 w-full rounded-lg object-cover border border-zinc-600 shadow-md" />
                              ) : file.startsWith('data:video/') ? (
                                <video src={file} className="h-20 w-full rounded-lg object-cover border border-zinc-600 shadow-md" />
                              ) : (
                                <div className="h-20 w-full rounded-lg bg-zinc-700 border border-zinc-600 flex items-center justify-center">
                                  <span className="text-zinc-400 text-xs">File</span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }))}
                                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Features
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {form.features.map((feature, i) => (
                        <span key={i} className="flex items-center bg-green-600/20 text-green-200 px-4 py-2 rounded-full text-sm font-semibold border border-green-600/30 shadow-lg">
                          {feature}
                          <button 
                            type="button" 
                            className="ml-2 text-green-300 hover:text-red-400 transition-colors" 
                            onClick={() => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={featureInput}
                        onChange={e => setFeatureInput(e.target.value)}
                        onKeyDown={e => {
                          if ((e.key === "Enter" || e.key === ",") && featureInput.trim()) {
                            e.preventDefault();
                            setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
                            setFeatureInput("");
                          }
                        }}
                        placeholder="Add feature and press Enter or comma"
                        className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => { if (featureInput.trim()) { setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] })); setFeatureInput(""); } }} 
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold shadow-lg transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Technologies Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                      </svg>
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {form.technologies.map((tech, i) => (
                        <span key={i} className="flex items-center bg-purple-600/20 text-purple-200 px-4 py-2 rounded-full text-sm font-semibold border border-purple-600/30 shadow-lg">
                          {tech}
                          <button 
                            type="button" 
                            className="ml-2 text-purple-300 hover:text-red-400 transition-colors" 
                            onClick={() => setForm(f => ({ ...f, technologies: f.technologies.filter((_, idx) => idx !== i) }))}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        onKeyDown={e => {
                          if ((e.key === "Enter" || e.key === ",") && techInput.trim()) {
                            e.preventDefault();
                            setForm(f => ({ ...f, technologies: [...f.technologies, techInput.trim()] }));
                            setTechInput("");
                          }
                        }}
                        placeholder="Add technology and press Enter or comma"
                        className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => { if (techInput.trim()) { setForm(f => ({ ...f, technologies: [...f.technologies, techInput.trim()] })); setTechInput(""); } }} 
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Long Description Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      Long Description
                    </h3>
                    <textarea 
                      name="longDescription" 
                      value={form.longDescription} 
                      onChange={handleChange} 
                      placeholder="Enter detailed project description..." 
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-vertical" 
                      required 
                    />
                </div>

                  {/* Best Project Toggle */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name="bestProject"
                        checked={form.bestProject || false}
                        onChange={handleChange}
                        className="w-5 h-5 accent-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-lg">Best Project</span>
                      <span className="text-zinc-500 text-sm">(Maximum 4 best projects allowed)</span>
                    </label>
                  </div>

                  {/* Team Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        Team Members
                      </h3>
                      <button type="button" onClick={addTeamMember} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Member
                      </button>
                    </div>
                    <div className="space-y-4">
                      {form.team.map((member, i) => (
                        <div key={i} className="p-4 bg-zinc-700/50 rounded-xl border border-zinc-600">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                            <div className="md:col-span-3">
                              <input
                                value={member.name}
                                onChange={e => handleTeamChange(i, "name", e.target.value)}
                                placeholder="Name"
                                className="w-full px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <input
                                value={member.role}
                                onChange={e => handleTeamChange(i, "role", e.target.value)}
                                placeholder="Role"
                                className="w-full px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm"
                              />
                            </div>
                            <div className="md:col-span-4">
                              <div className="flex items-center gap-3 flex-wrap">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = () => setForm(f => ({ ...f, team: f.team.map((m, idx) => idx === i ? { ...m, avatar: reader.result as string } : m) }));
                                    reader.readAsDataURL(file);
                                  }}
                                  className="w-full md:w-auto px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                                {member.avatar && (
                                  <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-zinc-600" />
                                )}
                              </div>
                            </div>
                            <div className="md:col-span-2 flex md:justify-end">
                              <button
                                type="button"
                                onClick={() => removeTeamMember(i)}
                                className="w-full md:w-auto px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold text-sm transition-all"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>

                  {/* Timeline Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Timeline
                      </h3>
                      <button type="button" onClick={addTimeline} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold text-sm transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Phase
                      </button>
                  </div>
                    <div className="space-y-3">
                    {form.timeline.map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-3 items-center p-4 bg-zinc-700/50 rounded-xl border border-zinc-600">
                          <input value={item.phase} onChange={e => handleTimelineChange(i, "phase", e.target.value)} placeholder="Phase" className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm" />
                          <input type="date" value={item.date} onChange={e => handleTimelineChange(i, "date", e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm" />
                          <button type="button" onClick={() => removeTimeline(i)} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold text-sm transition-all">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Testimonials Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        Testimonials
                      </h3>
                      <button type="button" onClick={addTestimonial} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-white font-semibold text-sm transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Testimonial
                      </button>
                  </div>
                    <div className="space-y-3">
                    {form.testimonials.map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-3 items-center p-4 bg-zinc-700/50 rounded-xl border border-zinc-600">
                          <input value={item.quote} onChange={e => handleTestimonialChange(i, "quote", e.target.value)} placeholder="Quote" className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm" />
                          <input value={item.author} onChange={e => handleTestimonialChange(i, "author", e.target.value)} placeholder="Author" className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm" />
                          <button type="button" onClick={() => removeTestimonial(i)} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold text-sm transition-all">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-6 justify-center pt-6">
                    <button 
                      type="submit" 
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl text-white font-bold flex items-center justify-center text-lg shadow-lg transition-all disabled:opacity-50" 
                      disabled={loading}
                    >
                    {loading && <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
                      {view === "edit" ? "Update Project" : "Create Project"}
                    </button>
                    <button 
                      type="button" 
                      onClick={resetForm} 
                      className="px-8 py-4 bg-zinc-700 hover:bg-zinc-800 rounded-xl text-white font-bold text-lg transition-all"
                    >
                      Cancel
                  </button>
                </div>
              </form>
              </div>
            </div>
          )}
          {view === "get" && projects.length === 0 && (
            <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[400px]">
              <div className="bg-black border border-zinc-800 rounded-3xl shadow-2xl p-16 flex flex-col items-center w-full">
                <img src="/galvan-logo.svg" alt="Galvan AI Logo" className="h-24 mb-8 drop-shadow-xl" />
                <h2 className="text-4xl font-extrabold mb-3 text-center text-white tracking-tight">No Projects Yet</h2>
                <p className="text-zinc-400 text-xl text-center max-w-2xl mb-2">Start by adding your first project to showcase your work here. Your projects will appear in this beautiful, modern dashboard.</p>
              </div>
            </div>
          )}
          {view === "get" && projects.length > 0 && (
            <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 rounded-3xl shadow-2xl border border-zinc-800 max-w-full overflow-x-auto mb-12">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-zinc-950/90 to-zinc-900/80 border-b border-zinc-800 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="7" width="18" height="13" rx="2"/>
                      <path d="M16 3v4M8 3v4M3 11h18"/>
                    </svg>
                    Projects ({projects.length})
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 text-sm">
                      {projects.filter(p => p.bestProject).length} Best Projects
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-zinc-800/50 border-b border-zinc-700">
                    <tr>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                          </svg>
                          Banner
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Project Info
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                          </svg>
                          Status
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Features
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                          </svg>
                          Technologies
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                          </svg>
                          Team
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Timeline
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                          </svg>
                          Actions
                        </div>
                      </th>
                  </tr>
                </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {projects.map((project, idx) => (
                      <tr key={project._id} className="hover:bg-zinc-800/50 transition-colors">
                        {/* Banner */}
                        <td className="py-6 px-6">
                          <div className="relative group">
                            <img 
                              src={project.hero.banner || "/placeholder-project.jpg"} 
                              alt={project.hero.subtitle} 
                              className="h-20 w-32 rounded-xl object-cover border-2 border-zinc-700 shadow-lg group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </td>
                        
                        {/* Project Info */}
                        <td className="py-6 px-6">
                          <div className="space-y-2 max-w-md">
                            <div className="font-bold text-white text-lg line-clamp-1">{project.hero.subtitle}</div>
                            <div className="text-zinc-300 text-sm line-clamp-2">
                              {project.hero.description.length > 100 
                                ? `${project.hero.description.substring(0, 100)}...` 
                                : project.hero.description
                              }
                            </div>
                            {project.gallery && project.gallery.length > 0 && (
                              <div className="flex items-center gap-1 text-zinc-400 text-xs">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                {project.gallery.length} gallery items
                              </div>
                            )}
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-2">
                            {project.bestProject ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-300 text-sm rounded-lg border border-yellow-600/30">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                Best Project
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-600/20 text-zinc-400 text-sm rounded-lg border border-zinc-600/30">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                                </svg>
                                Regular
                              </span>
                            )}
                          </div>
                        </td>
                        
                        {/* Features */}
                        <td className="py-6 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {project.features.slice(0, 3).map((feature, i) => (
                              <span key={i} className="px-2 py-1 bg-green-600/20 text-green-200 text-xs rounded-md border border-green-600/30">
                                {feature}
                              </span>
                            ))}
                            {project.features.length > 3 && (
                              <span className="px-2 py-1 bg-zinc-600/20 text-zinc-300 text-xs rounded-md">
                                +{project.features.length - 3} more
                              </span>
                            )}
                        </div>
                      </td>
                        
                        {/* Technologies */}
                        <td className="py-6 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {project.technologies.slice(0, 3).map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-purple-600/20 text-purple-200 text-xs rounded-md border border-purple-600/30">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-zinc-600/20 text-zinc-300 text-xs rounded-md">
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                        </div>
                      </td>
                        
                        {/* Team */}
                        <td className="py-6 px-6">
                          <div className="space-y-2">
                            {project.team.slice(0, 2).map((member, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="relative group">
                                  <img 
                                    src={member.avatar || "/placeholder-user.jpg"} 
                                    alt={member.name} 
                                    className="h-8 w-8 rounded-lg object-cover border-2 border-zinc-700 shadow-lg group-hover:scale-105 transition-transform" 
                                  />
                                  <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-zinc-200 text-xs font-medium truncate">{member.name}</div>
                                  <div className="text-zinc-400 text-xs truncate">{member.role}</div>
                                </div>
                              </div>
                            ))}
                            {project.team.length > 2 && (
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-zinc-700 border-2 border-zinc-600 flex items-center justify-center">
                                  <span className="text-zinc-400 text-xs font-bold">+{project.team.length - 2}</span>
                                </div>
                                <span className="text-zinc-400 text-xs">more members</span>
                              </div>
                            )}
                        </div>
                      </td>
                        
                        {/* Timeline */}
                        <td className="py-6 px-6">
                          <div className="space-y-1">
                            {project.timeline.slice(0, 2).map((item, i) => (
                              <div key={i} className="px-2 py-1 bg-yellow-600/20 text-yellow-200 text-xs rounded-md border border-yellow-600/30">
                                <div className="font-semibold truncate">{item.phase}</div>
                                <div className="text-yellow-300/70 text-xs">{item.date}</div>
                              </div>
                            ))}
                            {project.timeline.length > 2 && (
                              <span className="px-2 py-1 bg-zinc-600/20 text-zinc-300 text-xs rounded-md whitespace-nowrap">
                                +{project.timeline.length - 2} more
                              </span>
                            )}
                        </div>
                      </td>
                        
                        {/* Actions */}
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => startEdit(project)} 
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white font-semibold text-sm shadow-lg transition-all flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(project._id)} 
                              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg text-white font-semibold text-sm shadow-lg transition-all flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                              Delete
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              {/* Table Footer */}
              <div className="bg-gradient-to-r from-zinc-950/90 to-zinc-900/80 border-t border-zinc-800 p-4 rounded-b-3xl">
                <div className="flex items-center justify-between text-zinc-400 text-sm">
                  <span>Total Projects: {projects.length}</span>
                  <span>Best Projects: {projects.filter(p => p.bestProject).length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </AdminLayout>
  );
} 