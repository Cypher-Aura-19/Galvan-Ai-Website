"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type TeamMember = {
  _id?: string;
  id?: number;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  email: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  department: string;
  position: string;
  skills?: string[];
  background?: string[];
  interests?: string[];
  awards?: string[];
  certifications?: string[];
  location?: string;
  languages?: string[];
  fun_fact?: string;
  quote?: string;
};

const emptyMember: TeamMember = {
  name: "",
  role: "",
  avatar: "",
  bio: "",
  email: "",
  linkedin: "",
  github: "",
  twitter: "",
  website: "",
  department: "",
  position: "",
  skills: [],
  background: [],
  interests: [],
  awards: [],
  certifications: [],
  location: "",
  languages: [],
  fun_fact: "",
  quote: "",
};

type View = "menu" | "add" | "get" | "edit";

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [form, setForm] = useState<TeamMember>(emptyMember);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<View>("menu");
  // Add chip input state for skills
  const [skillInput, setSkillInput] = useState("");
  // Add chip input state for new array fields
  const [backgroundInput, setBackgroundInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [awardInput, setAwardInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (view === "get") fetchMembers();
  }, [view]);

  async function fetchMembers() {
    setLoading(true);
    const res = await fetch("/api/teams");
    const data = await res.json();
    setMembers(data);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(f => ({ ...f, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function startEdit(member: TeamMember) {
    setEditingId(member._id!);
    setForm({ 
      ...member, 
      skills: member.skills || [],
      background: member.background || [],
      interests: member.interests || [],
      awards: member.awards || [],
      certifications: member.certifications || [],
      languages: member.languages || []
    });
    setView("edit");
  }

  function resetForm() {
    setForm(emptyMember);
    setEditingId(null);
    setError("");
    setView("menu");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Frontend validation
    if (!form.name.trim()) {
      setError("Name is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.role.trim()) {
      setError("Role is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, _id: editingId } : form;
    try {
      const res = await fetch("/api/teams", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      console.log("API response:", data);
      if (res.ok) {
        toast.success(editingId ? "Team member updated successfully!" : "Team member added successfully!");
        setTimeout(() => {
          setView("menu");
          setEditingId(null);
          setForm(emptyMember);
          fetchMembers();
        }, 2000);
      } else {
        toast.error(data.error || "Failed to save team member");
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
    try {
      const res = await fetch("/api/teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      if (res.ok) {
        toast.success("Team member deleted successfully!");
        fetchMembers();
      } else {
        toast.error("Failed to delete team member");
      }
    } catch (err) {
      toast.error("Network or server error");
      console.error(err);
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
              <svg className="w-8 h-8 text-green-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              <div>
                <div className="text-lg font-bold text-white">Welcome to Team Management</div>
                <div className="text-zinc-400 text-sm">Add, edit, and manage your team members with advanced controls and beautiful UI.</div>
              </div>
            </div>
          </div>
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-900/90 to-green-700/60 rounded-2xl p-5 shadow-2xl border border-green-900">
                <svg className="w-14 h-14 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-1 bg-gradient-to-r from-green-400 via-white to-green-600 bg-clip-text text-transparent drop-shadow-xl">Team Management</h1>
                <p className="text-zinc-400 text-lg font-medium">Manage your team members, roles, and skills.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setView("add")} className="px-8 py-3 bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 rounded-2xl text-white font-bold shadow-2xl border border-green-900 transition-all text-lg flex items-center gap-2 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Member
              </button>
              <button onClick={() => setView("get")} className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold shadow-2xl border border-zinc-800 transition-all text-lg flex items-center gap-2 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                View Members
              </button>
            </div>
          </div>
          {/* Info Cards Section */}
          <div className="flex flex-wrap gap-8 mb-12">
            <div className="flex items-center gap-4 bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-8 min-w-[240px] shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <svg className="w-12 h-12 text-green-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              <div>
                <div className="text-3xl font-extrabold text-green-200 drop-shadow">{members.length}</div>
                <div className="text-zinc-400 text-base font-semibold">Total Members</div>
              </div>
            </div>
            {/* Add more info cards here if desired */}
          </div>
          <div className="mb-12 border-t border-zinc-800/80" />
          {(view === "add" || view === "edit") && (
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 rounded-3xl shadow-2xl border border-zinc-800 max-w-4xl mx-auto mb-16">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 rounded-t-3xl p-8 border-b border-zinc-700/50">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 rounded-2xl p-3 border border-green-600/30">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{view === "edit" ? "Edit" : "Add"} Team Member</h2>
                    <p className="text-zinc-400 text-sm">Fill in the details below to {view === "edit" ? "update" : "add"} a team member</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <button onClick={() => setView("menu")} className="mb-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-semibold transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Back to Menu
                </button>

                {error && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg text-red-300 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Full Name *</label>
                        <input 
                          name="name" 
                          value={form.name} 
                          onChange={handleChange} 
                          placeholder="Enter full name" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Email Address *</label>
                        <input 
                          name="email" 
                          value={form.email} 
                          onChange={handleChange} 
                          placeholder="Enter email address" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Role *</label>
                        <input 
                          name="role" 
                          value={form.role} 
                          onChange={handleChange} 
                          placeholder="e.g., Senior Developer, UX Designer" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Department *</label>
                        <input 
                          name="department" 
                          value={form.department} 
                          onChange={handleChange} 
                          placeholder="e.g., Engineering, Design, Marketing" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Position *</label>
                        <input 
                          name="position" 
                          value={form.position} 
                          onChange={handleChange} 
                          placeholder="e.g., Lead, Senior, Junior" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profile Picture Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Profile Picture</h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <label className="block text-zinc-300 mb-2 font-semibold">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all"
                        />
                        <p className="text-zinc-400 text-sm mt-2">Recommended: Square image, max 5MB</p>
                      </div>
                      {form.avatar && (
                        <div className="flex-shrink-0">
                          <label className="block text-zinc-300 mb-2 font-semibold">Preview</label>
                          <img src={form.avatar} alt="Profile Preview" className="h-20 w-20 rounded-xl border-2 border-zinc-700 object-cover shadow-lg" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Bio & Description</h3>
                    </div>
                    <div>
                      <label className="block text-zinc-300 mb-2 font-semibold">Professional Bio</label>
                      <textarea 
                        name="bio" 
                        value={form.bio} 
                        onChange={handleChange} 
                        placeholder="Tell us about this team member's background, expertise, and contributions..." 
                        className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-vertical" 
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Social Media Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Social Media Links</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">LinkedIn URL</label>
                        <input 
                          name="linkedin" 
                          value={form.linkedin || ""} 
                          onChange={handleChange} 
                          placeholder="https://linkedin.com/in/username" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">GitHub URL</label>
                        <input 
                          name="github" 
                          value={form.github || ""} 
                          onChange={handleChange} 
                          placeholder="https://github.com/username" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Twitter URL</label>
                        <input 
                          name="twitter" 
                          value={form.twitter || ""} 
                          onChange={handleChange} 
                          placeholder="https://twitter.com/username" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Personal Website</label>
                        <input 
                          name="website" 
                          value={form.website || ""} 
                          onChange={handleChange} 
                          placeholder="https://example.com" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all" 
                        />
                      </div>
                    </div>
                </div>

                  {/* Skills Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
                </div>
                    <div>
                      <label className="block text-zinc-300 mb-2 font-semibold">Technical Skills</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {(form.skills || []).map((skill, i) => (
                          <span key={i} className="flex items-center bg-pink-600/20 text-pink-200 px-4 py-2 rounded-lg text-sm font-semibold border border-pink-600/30 shadow-lg">
                        {skill}
                            <button 
                              type="button" 
                              className="ml-2 text-pink-300 hover:text-red-400 transition-colors" 
                              onClick={() => setForm(f => ({ ...f, skills: (f.skills || []).filter((_, idx) => idx !== i) }))}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                      </span>
                    ))}
                  </div>
                      <div className="flex gap-3">
                    <input
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => {
                        if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
                          e.preventDefault();
                              setForm(f => ({ ...f, skills: [...(f.skills || []), skillInput.trim()] }));
                          setSkillInput("");
                        }
                      }}
                          placeholder="Add a skill (e.g., React, Python, UX Design) and press Enter"
                          className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => { 
                            if (skillInput.trim()) { 
                              setForm(f => ({ ...f, skills: [...(f.skills || []), skillInput.trim()] })); 
                              setSkillInput(""); 
                            } 
                          }} 
                          className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                          </svg>
                          Add
                        </button>
                  </div>
                </div>
                  </div>

                  {/* Background Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Background</h3>
                    </div>
                    <div>
                      <label className="block text-zinc-300 mb-2 font-semibold">Professional Background</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {(form.background || []).map((bg, i) => (
                          <span key={i} className="flex items-center bg-blue-600/20 text-blue-200 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-600/30 shadow-lg">
                            {bg}
                            <button 
                              type="button" 
                              className="ml-2 text-blue-300 hover:text-red-400 transition-colors" 
                              onClick={() => setForm(f => ({ ...f, background: (f.background || []).filter((_, idx) => idx !== i) }))}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input
                          value={backgroundInput}
                          onChange={e => setBackgroundInput(e.target.value)}
                          onKeyDown={e => {
                            if ((e.key === "Enter" || e.key === ",") && backgroundInput.trim()) {
                              e.preventDefault();
                              setForm(f => ({ ...f, background: [...(f.background || []), backgroundInput.trim()] }));
                              setBackgroundInput("");
                            }
                          }}
                          placeholder="Add background (e.g., Computer Science Degree, 5 years experience) and press Enter"
                          className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => { 
                            if (backgroundInput.trim()) { 
                              setForm(f => ({ ...f, background: [...(f.background || []), backgroundInput.trim()] })); 
                              setBackgroundInput(""); 
                            } 
                          }} 
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                          </svg>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interests Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Interests</h3>
                    </div>
                    <div>
                      <label className="block text-zinc-300 mb-2 font-semibold">Personal Interests</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {(form.interests || []).map((interest, i) => (
                          <span key={i} className="flex items-center bg-indigo-600/20 text-indigo-200 px-4 py-2 rounded-lg text-sm font-semibold border border-indigo-600/30 shadow-lg">
                            {interest}
                            <button 
                              type="button" 
                              className="ml-2 text-indigo-300 hover:text-red-400 transition-colors" 
                              onClick={() => setForm(f => ({ ...f, interests: (f.interests || []).filter((_, idx) => idx !== i) }))}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input
                          value={interestInput}
                          onChange={e => setInterestInput(e.target.value)}
                          onKeyDown={e => {
                            if ((e.key === "Enter" || e.key === ",") && interestInput.trim()) {
                              e.preventDefault();
                              setForm(f => ({ ...f, interests: [...(f.interests || []), interestInput.trim()] }));
                              setInterestInput("");
                            }
                          }}
                          placeholder="Add an interest (e.g., AI Research, Photography, Travel) and press Enter"
                          className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => { 
                            if (interestInput.trim()) { 
                              setForm(f => ({ ...f, interests: [...(f.interests || []), interestInput.trim()] })); 
                              setInterestInput(""); 
                            } 
                          }} 
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                          </svg>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Awards Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Awards & Recognition</h3>
                    </div>
                    <div>
                      <label className="block text-zinc-300 mb-2 font-semibold">Awards & Achievements</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {(form.awards || []).map((award, i) => (
                          <span key={i} className="flex items-center bg-yellow-600/20 text-yellow-200 px-4 py-2 rounded-lg text-sm font-semibold border border-yellow-600/30 shadow-lg">
                            {award}
                            <button 
                              type="button" 
                              className="ml-2 text-yellow-300 hover:text-red-400 transition-colors" 
                              onClick={() => setForm(f => ({ ...f, awards: (f.awards || []).filter((_, idx) => idx !== i) }))}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input
                          value={awardInput}
                          onChange={e => setAwardInput(e.target.value)}
                          onKeyDown={e => {
                            if ((e.key === "Enter" || e.key === ",") && awardInput.trim()) {
                              e.preventDefault();
                              setForm(f => ({ ...f, awards: [...(f.awards || []), awardInput.trim()] }));
                              setAwardInput("");
                            }
                          }}
                          placeholder="Add an award (e.g., Best Developer 2023, Innovation Award) and press Enter"
                          className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => { 
                            if (awardInput.trim()) { 
                              setForm(f => ({ ...f, awards: [...(f.awards || []), awardInput.trim()] })); 
                              setAwardInput(""); 
                            } 
                          }} 
                          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                          </svg>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Certifications Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Certifications</h3>
                    </div>
                    <div>
                      <label className="block text-zinc-300 mb-2 font-semibold">Professional Certifications</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {(form.certifications || []).map((cert, i) => (
                          <span key={i} className="flex items-center bg-green-600/20 text-green-200 px-4 py-2 rounded-lg text-sm font-semibold border border-green-600/30 shadow-lg">
                            {cert}
                            <button 
                              type="button" 
                              className="ml-2 text-green-300 hover:text-red-400 transition-colors" 
                              onClick={() => setForm(f => ({ ...f, certifications: (f.certifications || []).filter((_, idx) => idx !== i) }))}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input
                          value={certificationInput}
                          onChange={e => setCertificationInput(e.target.value)}
                          onKeyDown={e => {
                            if ((e.key === "Enter" || e.key === ",") && certificationInput.trim()) {
                              e.preventDefault();
                              setForm(f => ({ ...f, certifications: [...(f.certifications || []), certificationInput.trim()] }));
                              setCertificationInput("");
                            }
                          }}
                          placeholder="Add a certification (e.g., AWS Certified, Google Cloud) and press Enter"
                          className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => { 
                            if (certificationInput.trim()) { 
                              setForm(f => ({ ...f, certifications: [...(f.certifications || []), certificationInput.trim()] })); 
                              setCertificationInput(""); 
                            } 
                          }} 
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                          </svg>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Location & Languages Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Location & Languages</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Location</label>
                        <input 
                          name="location" 
                          value={form.location || ""} 
                          onChange={handleChange} 
                          placeholder="e.g., San Francisco, CA" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Languages</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {(form.languages || []).map((language, i) => (
                            <span key={i} className="flex items-center bg-blue-600/20 text-blue-200 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-600/30 shadow-lg">
                              {language}
                              <button 
                                type="button" 
                                className="ml-2 text-blue-300 hover:text-red-400 transition-colors" 
                                onClick={() => setForm(f => ({ ...f, languages: (f.languages || []).filter((_, idx) => idx !== i) }))}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <input
                            value={languageInput}
                            onChange={e => setLanguageInput(e.target.value)}
                            onKeyDown={e => {
                              if ((e.key === "Enter" || e.key === ",") && languageInput.trim()) {
                                e.preventDefault();
                                setForm(f => ({ ...f, languages: [...(f.languages || []), languageInput.trim()] }));
                                setLanguageInput("");
                              }
                            }}
                            placeholder="Add a language (e.g., English, Spanish) and press Enter"
                            className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <button 
                            type="button" 
                            onClick={() => { 
                              if (languageInput.trim()) { 
                                setForm(f => ({ ...f, languages: [...(f.languages || []), languageInput.trim()] })); 
                                setLanguageInput(""); 
                              } 
                            }} 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fun Fact & Quote Section */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-white">Fun Fact & Quote</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Fun Fact</label>
                        <textarea 
                          name="fun_fact" 
                          value={form.fun_fact || ""} 
                          onChange={handleChange} 
                          placeholder="Share an interesting fact about this team member..." 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-vertical" 
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Favorite Quote</label>
                        <textarea 
                          name="quote" 
                          value={form.quote || ""} 
                          onChange={handleChange} 
                          placeholder="Share their favorite quote or motto..." 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-vertical" 
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-zinc-700/50">
                    <button 
                      type="submit" 
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-xl text-white font-bold shadow-lg transition-all flex items-center gap-2" 
                      disabled={loading}
                    >
                      {loading && (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      )}
                      {view === "edit" ? "Update Team Member" : "Add Team Member"}
                    </button>
                    <button 
                      type="button" 
                      onClick={resetForm} 
                      className="px-8 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-white font-bold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                </div>
            </div>
          )}
          {view === "get" && members.length === 0 && (
            <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[400px]">
              <div className="bg-black border border-zinc-800 rounded-3xl shadow-2xl p-16 flex flex-col items-center w-full">
                <img src="/galvan-logo.svg" alt="Galvan AI Logo" className="h-24 mb-8 drop-shadow-xl" />
                <h2 className="text-4xl font-extrabold mb-3 text-center text-white tracking-tight">No Team Members Yet</h2>
                <p className="text-zinc-400 text-xl text-center max-w-2xl mb-2">Start by adding your first team member to showcase your team here. Your team members will appear in this beautiful, modern dashboard.</p>
              </div>
            </div>
          )}
          {view === "get" && members.length > 0 && (
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 rounded-3xl shadow-2xl border border-zinc-800 max-w-full overflow-x-auto mb-12">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 rounded-t-3xl p-6 border-b border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 rounded-2xl p-3 border border-green-600/30">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Team Members</h3>
                      <p className="text-zinc-400 text-sm">Manage your team members and their information</p>
                    </div>
                  </div>
                  <div className="text-zinc-400 text-sm font-semibold">
                    {members.length} member{members.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-zinc-900/80 sticky top-0 z-10">
                    <tr className="text-zinc-400 border-b border-zinc-700/50">
                      <th className="py-6 px-6 text-left font-bold text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          Avatar
                        </div>
                      </th>
                      <th className="py-6 px-6 text-left font-bold text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          Name & Role
                        </div>
                      </th>
                      <th className="py-6 px-6 text-left font-bold text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                          </svg>
                          Department & Position
                        </div>
                      </th>
                      <th className="py-6 px-6 text-left font-bold text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          Contact
                        </div>
                      </th>
                      <th className="py-6 px-6 text-left font-bold text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                          </svg>
                          Skills
                        </div>
                      </th>
                      <th className="py-6 px-6 text-left font-bold text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                          </svg>
                          Actions
                        </div>
                      </th>
                  </tr>
                </thead>
                  <tbody className="divide-y divide-zinc-700/50">
                  {members.map((member, idx) => (
                      <tr key={member._id} className="hover:bg-zinc-800/50 transition-colors">
                        {/* Avatar */}
                        <td className="py-6 px-6">
                          <div className="relative group">
                            <img 
                              src={member.avatar || "/placeholder-user.jpg"} 
                              alt={member.name} 
                              className="h-12 w-12 rounded-lg object-cover border-2 border-zinc-700 shadow-lg group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </td>
                        
                        {/* Name & Role */}
                        <td className="py-6 px-6">
                          <div className="min-w-0">
                            <div className="text-zinc-200 text-base font-bold truncate">{member.name}</div>
                            <div className="text-zinc-400 text-sm truncate">{member.role}</div>
                          </div>
                        </td>
                        
                        {/* Department & Position */}
                        <td className="py-6 px-6">
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 text-purple-200 text-sm rounded-lg border border-purple-600/30">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                              </svg>
                              {member.department}
                            </div>
                            <div className="text-zinc-300 text-sm">{member.position}</div>
                          </div>
                        </td>
                        
                        {/* Contact */}
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <span className="text-zinc-300 text-sm truncate max-w-xs">{member.email}</span>
                          </div>
                        </td>
                        
                        {/* Skills */}
                        <td className="py-6 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(member.skills || []).slice(0, 3).map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-pink-600/20 text-pink-200 text-xs rounded-md border border-pink-600/30">
                                {skill}
                              </span>
                            ))}
                            {(member.skills || []).length > 3 && (
                              <span className="px-2 py-1 bg-zinc-600/20 text-zinc-300 text-xs rounded-md">
                                +{(member.skills || []).length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        
                        {/* Actions */}
                        <td className="py-6 px-6">
                        <div className="flex gap-2">
                            <button 
                              onClick={() => startEdit(member)} 
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(member._id)} 
                              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
              <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 rounded-b-3xl p-6 border-t border-zinc-700/50">
                <div className="flex items-center justify-between text-zinc-400 text-sm">
                  <div>Showing {members.length} team member{members.length !== 1 ? 's' : ''}</div>
                  <div>Last updated: {new Date().toLocaleDateString()}</div>
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