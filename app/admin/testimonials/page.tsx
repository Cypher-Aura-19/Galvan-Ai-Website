"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Testimonial = {
  _id?: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  title: string;
  content: string;
  longContent?: string;
  rating: number;
  featured?: boolean;
  tags?: string[]; // Added for tags
};

const emptyTestimonial: Testimonial = {
  name: "",
  role: "",
  company: "",
  avatar: "",
  title: "",
  content: "",
  longContent: "",
  rating: 5,
  featured: false,
  tags: [], // Initialize tags
};

type View = "menu" | "add" | "get" | "edit";

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Testimonial>(emptyTestimonial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState<View>("menu");
  const [tagInput, setTagInput] = useState(""); // Added for tags
  const router = useRouter();

  useEffect(() => {
    if (view === "get") fetchTestimonials();
  }, [view]);

  async function fetchTestimonials() {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setTestimonials(data);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (name === "rating") {
      setForm(f => ({ ...f, rating: Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function startEdit(testimonial: Testimonial) {
    setEditingId(testimonial._id!);
    setForm({ ...testimonial });
    setView("edit");
  }

  function resetForm() {
    setForm(emptyTestimonial);
    setEditingId(null);
    setError("");
    setSuccess("");
    setView("menu");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
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
    if (!form.company.trim()) {
      setError("Company is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.avatar.trim()) {
      setError("Avatar is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.title.trim()) {
      setError("Title is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.content.trim()) {
      setError("Content is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (typeof form.rating !== "number" || form.rating < 1 || form.rating > 5) {
      setError("Rating must be a number between 1 and 5");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, _id: editingId } : form;
    try {
      const res = await fetch("/api/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(editingId ? "Testimonial updated successfully!" : "Testimonial added successfully!");
        setTimeout(() => {
          setView("menu");
          setEditingId(null);
          setForm(emptyTestimonial);
          fetchTestimonials();
        }, 2000);
      } else {
        toast.error(data.error || "Failed to save testimonial");
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
    const res = await fetch("/api/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    if (res.ok) {
      toast.success("Testimonial deleted successfully!");
      fetchTestimonials();
    } else {
      toast.error("Failed to delete testimonial");
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
              <svg className="w-8 h-8 text-pink-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              <div>
                <div className="text-lg font-bold text-white">Welcome to Testimonials Management</div>
                <div className="text-zinc-400 text-sm">Add, edit, and manage your testimonials with advanced controls and beautiful UI.</div>
              </div>
            </div>
          </div>
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-pink-900/90 to-pink-700/60 rounded-2xl p-5 shadow-2xl border border-pink-900">
                <svg className="w-14 h-14 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-1 bg-gradient-to-r from-pink-400 via-white to-pink-600 bg-clip-text text-transparent drop-shadow-xl">Testimonials Management</h1>
                <p className="text-zinc-400 text-lg font-medium">Manage your testimonials and client feedback.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setView("add")} className="px-8 py-3 bg-gradient-to-r from-pink-700 to-pink-500 hover:from-pink-800 hover:to-pink-600 rounded-2xl text-white font-bold shadow-2xl border border-pink-900 transition-all text-lg flex items-center gap-2 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Testimonial
              </button>
              <button onClick={() => setView("get")} className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold shadow-2xl border border-zinc-800 transition-all text-lg flex items-center gap-2 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                View Testimonials
              </button>
            </div>
          </div>
          {/* Info Cards Section */}
          <div className="flex flex-wrap gap-8 mb-12">
            <div className="flex items-center gap-4 bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-8 min-w-[240px] shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <svg className="w-12 h-12 text-pink-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              <div>
                <div className="text-3xl font-extrabold text-pink-200 drop-shadow">{testimonials.length}</div>
                <div className="text-zinc-400 text-base font-semibold">Total Testimonials</div>
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
                  <h2 className="text-3xl font-bold text-white">{view === "edit" ? "Edit" : "Add"} Testimonial</h2>
                  <div className="w-20"></div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {success && <div className="text-green-500 mb-4 text-center bg-green-900/20 border border-green-600/30 rounded-lg p-3">{success}</div>}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Client Name</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter client's full name..."
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Role/Position</label>
                        <input
                          name="role"
                          value={form.role}
                          onChange={handleChange}
                          placeholder="e.g., CEO, CTO, Manager"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Company</label>
                        <input
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="Company name..."
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Avatar Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Client Avatar
                    </h3>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("File size must be less than 5MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => setForm(f => ({ ...f, avatar: reader.result as string }));
                          reader.readAsDataURL(file);
                        }}
                        className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 transition-all"
                      />
                      {form.avatar && (
                        <div className="relative group">
                          <img
                            src={form.avatar}
                            alt="Avatar Preview"
                            className="h-16 w-16 rounded-full border-2 border-zinc-700 object-cover shadow-lg group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Testimonial Details Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      Testimonial Details
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Testimonial Title</label>
                        <input
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="Brief title for the testimonial..."
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-zinc-300 mb-2 font-semibold">Rating</label>
                          <div className="flex items-center gap-2">
                            {[1,2,3,4,5].map(star => (
                              <span
                                key={star}
                                onClick={() => setForm(f => ({ ...f, rating: star }))}
                                className={`cursor-pointer text-3xl transition-colors ${form.rating >= star ? 'text-yellow-400' : 'text-zinc-500 hover:text-yellow-300'}`}
                                role="button"
                                aria-label={`Set rating to ${star}`}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setForm(f => ({ ...f, rating: star })); }}
                              >
                                ★
                              </span>
                            ))}
                            <span className="text-zinc-400 ml-2">({form.rating}/5)</span>
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
                            <input
                              type="checkbox"
                              name="featured"
                              checked={!!form.featured}
                              onChange={handleChange}
                              className="w-5 h-5 accent-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="font-semibold text-lg">Featured Testimonial</span>
                            <span className="text-zinc-500 text-sm">(Will be highlighted)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      Testimonial Content
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Short Content</label>
                        <textarea
                          name="content"
                          value={form.content}
                          onChange={handleChange}
                          placeholder="Brief testimonial content (will be displayed in cards)..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-vertical"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Long Content (Optional)</label>
                        <textarea
                          name="longContent"
                          value={form.longContent || ""}
                          onChange={handleChange}
                          placeholder="Detailed testimonial content (for full view)..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-vertical"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {form.tags?.map((tag, i) => (
                        <span key={i} className="flex items-center bg-pink-600/20 text-pink-200 px-4 py-2 rounded-full text-sm font-semibold border border-pink-600/30 shadow-lg">
                          {tag}
                          <button
                            type="button"
                            className="ml-2 text-pink-300 hover:text-red-400 transition-colors"
                            onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, idx) => idx !== i) }))}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => {
                          if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                            e.preventDefault();
                            setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
                            setTagInput("");
                          }
                        }}
                        placeholder="Add tag and press Enter or comma"
                        className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tagInput.trim()) {
                            setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
                            setTagInput("");
                          }
                        }}
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl text-white font-semibold shadow-lg transition-all"
                      >
                        Add
                      </button>
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
                      {view === "edit" ? "Update Testimonial" : "Create Testimonial"}
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
          {view === "get" && testimonials.length === 0 && (
            <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[400px]">
              <div className="bg-black border border-zinc-800 rounded-3xl shadow-2xl p-16 flex flex-col items-center w-full">
                <img src="/galvan-logo.svg" alt="Galvan AI Logo" className="h-24 mb-8 drop-shadow-xl" />
                <h2 className="text-4xl font-extrabold mb-3 text-center text-white tracking-tight">No Testimonials Yet</h2>
                <p className="text-zinc-400 text-xl text-center max-w-2xl mb-2">Start by adding your first testimonial to showcase your client feedback here. Your testimonials will appear in this beautiful, modern dashboard.</p>
              </div>
            </div>
          )}
          {view === "get" && testimonials.length > 0 && (
            <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 rounded-3xl shadow-2xl border border-zinc-800 max-w-full overflow-x-auto mb-12">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-zinc-950/90 to-zinc-900/80 border-b border-zinc-800 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    Testimonials ({testimonials.length})
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 text-sm">
                      {testimonials.filter(t => t.featured).length} Featured
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
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          Avatar
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          Client Info
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                          </svg>
                          Testimonial
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          Rating
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                          </svg>
                          Status
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
                    {testimonials.map((testimonial, idx) => (
                      <tr key={testimonial._id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="py-6 px-6">
                          <div className="relative group">
                            <img
                              src={testimonial.avatar || "/placeholder-user.jpg"}
                              alt={testimonial.name}
                              className="h-16 w-16 rounded-full object-cover border-2 border-zinc-700 shadow-lg group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="space-y-1">
                            <div className="font-bold text-white text-lg">{testimonial.name}</div>
                            <div className="text-zinc-300 text-sm">{testimonial.role}</div>
                            <div className="text-zinc-400 text-sm">{testimonial.company}</div>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="space-y-2 max-w-md">
                            <div className="font-semibold text-white text-sm">{testimonial.title}</div>
                            <div className="text-zinc-300 text-sm line-clamp-2">
                              {testimonial.content.length > 100 
                                ? `${testimonial.content.substring(0, 100)}...` 
                                : testimonial.content
                              }
                            </div>
                            {testimonial.tags && testimonial.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {testimonial.tags.slice(0, 3).map((tag, i) => (
                                  <span key={i} className="px-2 py-1 bg-pink-600/20 text-pink-200 text-xs rounded-full border border-pink-600/30">
                                    {tag}
                                  </span>
                                ))}
                                {testimonial.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-zinc-600/20 text-zinc-300 text-xs rounded-full">
                                    +{testimonial.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <svg
                                key={star}
                                className={`w-5 h-5 ${star <= testimonial.rating ? 'text-yellow-400 fill-current' : 'text-zinc-600'}`}
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                            <span className="text-zinc-400 text-sm ml-2">({testimonial.rating}/5)</span>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-2">
                            {testimonial.featured ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600/20 text-green-300 text-sm rounded-full border border-green-600/30">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                Featured
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-600/20 text-zinc-400 text-sm rounded-full border border-zinc-600/30">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                                </svg>
                                Regular
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(testimonial)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white font-semibold text-sm shadow-lg transition-all flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(testimonial._id)}
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
                  <span>Total Testimonials: {testimonials.length}</span>
                  <span>Featured: {testimonials.filter(t => t.featured).length}</span>
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