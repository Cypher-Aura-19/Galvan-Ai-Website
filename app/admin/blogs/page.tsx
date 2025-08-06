"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";

type BlogPost = {
  _id?: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
  readTime: string;
  publishDate: string;
  category: string;
  image: string;
  tags: string[];
  featured?: boolean;
  intro: string;
  keyConcepts: string[];
  implementation: string;
  bestPractices: string[];
  conclusion: string;
};

type Category = {
  id: string;
  name: string;
  count: number;
};

const emptyBlogPost: BlogPost = {
  title: "",
  excerpt: "",
  author: { name: "", avatar: "", role: "", bio: "" },
  readTime: "",
  publishDate: "",
  category: "",
  image: "",
  tags: [],
  featured: false,
  intro: "",
  keyConcepts: [],
  implementation: "",
  bestPractices: [],
  conclusion: "",
};

type View = "menu" | "add" | "get" | "edit";

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<BlogPost>(emptyBlogPost);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState<View>("menu");
  const [tagInput, setTagInput] = useState("");
  const [keyConceptInput, setKeyConceptInput] = useState("");
  const [bestPracticeInput, setBestPracticeInput] = useState("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (view === "get") fetchPosts();
  }, [view]);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch("/api/blog-posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("author.")) {
      const key = name.split(".")[1];
      setForm(f => ({ ...f, author: { ...f.author, [key]: value } }));
    } else if (name === "featured") {
      setForm(f => ({ ...f, featured: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleArrayChange(name: keyof BlogPost, value: string) {
    setForm(f => ({ ...f, [name]: value.split(",").map(s => s.trim()).filter(Boolean) }));
  }

  function startEdit(post: BlogPost) {
    setEditingId(post._id!);
    setForm({ ...post });
    setView("edit");
  }

  function resetForm() {
    setForm(emptyBlogPost);
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
    if (!form.title.trim()) {
      setError("Title is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.excerpt.trim()) {
      setError("Excerpt is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.author.name.trim()) {
      setError("Author name is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.author.avatar.trim()) {
      setError("Author avatar is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.author.role.trim()) {
      setError("Author role is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.author.bio.trim()) {
      setError("Author bio is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.readTime.trim()) {
      setError("Read time is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.publishDate.trim()) {
      setError("Publish date is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.category.trim()) {
      setError("Category is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.image.trim()) {
      setError("Image is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!Array.isArray(form.tags)) {
      setError("Tags must be an array");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.intro.trim()) {
      setError("Intro is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!Array.isArray(form.keyConcepts) || form.keyConcepts.length === 0) {
      setError("At least one key concept is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.implementation.trim()) {
      setError("Implementation is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!Array.isArray(form.bestPractices) || form.bestPractices.length === 0) {
      setError("At least one best practice is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.conclusion.trim()) {
      setError("Conclusion is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, _id: editingId } : form;
    try {
      const res = await fetch("/api/blog-posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(editingId ? "Blog post updated successfully!" : "Blog post added successfully!");
        setTimeout(() => {
          setView("menu");
          setEditingId(null);
          setForm(emptyBlogPost);
          fetchPosts();
        }, 2000);
      } else {
        toast.error(data.error || "Failed to save blog post");
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
    const res = await fetch("/api/blog-posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    if (res.ok) {
      toast.success("Blog post deleted successfully!");
      fetchPosts();
    } else {
      toast.error("Failed to delete blog post");
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
                <div className="text-lg font-bold text-white">Welcome to Blogs Management</div>
                <div className="text-zinc-400 text-sm">Add, edit, and manage your blog posts with advanced controls and beautiful UI.</div>
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
                <h1 className="text-5xl font-extrabold tracking-tight mb-1 bg-gradient-to-r from-blue-400 via-white to-blue-600 bg-clip-text text-transparent drop-shadow-xl">Blogs Management</h1>
                <p className="text-zinc-400 text-lg font-medium">Manage your blog posts and categories.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setView("add")} className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 rounded-2xl text-white font-bold shadow-2xl border border-blue-900 transition-all text-lg flex items-center gap-2 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Blog
              </button>
              <button onClick={() => setView("get")} className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold shadow-2xl border border-zinc-800 transition-all text-lg flex items-center gap-2 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                View Blogs
              </button>
            </div>
          </div>
          {/* Info Cards Section */}
          <div className="flex flex-wrap gap-8 mb-12">
            <div className="flex items-center gap-4 bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-8 min-w-[240px] shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <svg className="w-12 h-12 text-blue-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
              <div>
                <div className="text-3xl font-extrabold text-blue-200 drop-shadow">{posts.length}</div>
                <div className="text-zinc-400 text-base font-semibold">Total Blogs</div>
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
                  <h2 className="text-3xl font-bold text-white">{view === "edit" ? "Edit" : "Add"} Blog Post</h2>
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
                    <div className="space-y-4">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Blog Title</label>
                        <input 
                          name="title" 
                          value={form.title} 
                          onChange={handleChange} 
                          placeholder="Enter blog title..." 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Excerpt</label>
                        <input 
                          name="excerpt" 
                          value={form.excerpt} 
                          onChange={handleChange} 
                          placeholder="Brief description of the blog post..." 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Author Information Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Author Information
                    </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Author Name</label>
                        <input 
                          name="author.name" 
                          value={form.author.name} 
                          onChange={handleChange} 
                          placeholder="Author's full name" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Author Role</label>
                        <input 
                          name="author.role" 
                          value={form.author.role} 
                          onChange={handleChange} 
                          placeholder="e.g., Senior Developer, Tech Lead" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                          required 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-zinc-300 mb-2 font-semibold">Author Bio</label>
                        <textarea 
                          name="author.bio" 
                          value={form.author.bio} 
                          onChange={handleChange} 
                          placeholder="Brief biography of the author..." 
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-vertical" 
                          required 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-zinc-300 mb-2 font-semibold">Author Avatar</label>
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
                        reader.onload = () => setForm(f => ({ ...f, author: { ...f.author, avatar: reader.result as string } }));
                        reader.readAsDataURL(file);
                      }}
                            className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all"
                    />
                    {form.author.avatar && (
                            <div className="relative group">
                              <img 
                                src={form.author.avatar} 
                                alt="Avatar Preview" 
                                className="h-16 w-16 rounded-full border-2 border-zinc-700 object-cover shadow-lg group-hover:scale-105 transition-transform" 
                              />
                              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blog Details Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      Blog Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Read Time</label>
                        <input 
                          name="readTime" 
                          value={form.readTime} 
                          onChange={handleChange} 
                          placeholder="e.g., 8 min read" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Publish Date</label>
                        <input 
                          type="date" 
                          name="publishDate" 
                          value={form.publishDate} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Category</label>
                        <input 
                          name="category" 
                          value={form.category} 
                          onChange={handleChange} 
                          placeholder="e.g., Web Development, AI/ML" 
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                          required 
                        />
                      </div>
                </div>
                </div>

                  {/* Blog Image Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      Blog Image
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
                      reader.onload = () => setForm(f => ({ ...f, image: reader.result as string }));
                      reader.readAsDataURL(file);
                    }}
                        className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 transition-all"
                  />
                  {form.image && (
                        <div className="relative group">
                          <img 
                            src={form.image} 
                            alt="Blog Image Preview" 
                            className="h-20 w-32 rounded-xl border-2 border-zinc-700 object-cover shadow-lg group-hover:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                  )}
                </div>
                  </div>

                  {/* Tags Section */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                    {form.tags.map((tag, i) => (
                        <span key={i} className="flex items-center bg-blue-600/20 text-blue-200 px-4 py-2 rounded-full text-sm font-semibold border border-blue-600/30 shadow-lg">
                        {tag}
                          <button 
                            type="button" 
                            className="ml-2 text-blue-300 hover:text-red-400 transition-colors" 
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
                        className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => { 
                          if (tagInput.trim()) { 
                            setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); 
                            setTagInput(""); 
                          } 
                        }} 
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      Blog Content
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Introduction</label>
                        <textarea 
                          name="intro" 
                          value={form.intro} 
                          onChange={handleChange} 
                          placeholder="Write the introduction to your blog post..." 
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-vertical" 
                          required 
                        />
                </div>

                      {/* Key Concepts */}
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Key Concepts</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                    {form.keyConcepts.map((concept, i) => (
                            <span key={i} className="flex items-center bg-green-600/20 text-green-200 px-4 py-2 rounded-full text-sm font-semibold border border-green-600/30 shadow-lg">
                        {concept}
                              <button 
                                type="button" 
                                className="ml-2 text-green-300 hover:text-red-400 transition-colors" 
                                onClick={() => setForm(f => ({ ...f, keyConcepts: f.keyConcepts.filter((_, idx) => idx !== i) }))}
                              >
                                ×
                              </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={keyConceptInput}
                      onChange={e => setKeyConceptInput(e.target.value)}
                      onKeyDown={e => {
                        if ((e.key === "Enter" || e.key === ",") && keyConceptInput.trim()) {
                          e.preventDefault();
                          setForm(f => ({ ...f, keyConcepts: [...f.keyConcepts, keyConceptInput.trim()] }));
                          setKeyConceptInput("");
                        }
                      }}
                            placeholder="Add key concept and press Enter or comma"
                            className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          />
                          <button 
                            type="button" 
                            onClick={() => { 
                              if (keyConceptInput.trim()) { 
                                setForm(f => ({ ...f, keyConcepts: [...f.keyConcepts, keyConceptInput.trim()] })); 
                                setKeyConceptInput(""); 
                              } 
                            }} 
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold shadow-lg transition-all"
                          >
                            Add
                          </button>
                  </div>
                </div>

                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Implementation</label>
                        <textarea 
                          name="implementation" 
                          value={form.implementation} 
                          onChange={handleChange} 
                          placeholder="Describe the implementation details..." 
                          rows={6}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-vertical" 
                          required 
                        />
                      </div>

                      {/* Best Practices */}
                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Best Practices</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                    {form.bestPractices.map((practice, i) => (
                            <span key={i} className="flex items-center bg-yellow-600/20 text-yellow-200 px-4 py-2 rounded-full text-sm font-semibold border border-yellow-600/30 shadow-lg">
                        {practice}
                              <button 
                                type="button" 
                                className="ml-2 text-yellow-300 hover:text-red-400 transition-colors" 
                                onClick={() => setForm(f => ({ ...f, bestPractices: f.bestPractices.filter((_, idx) => idx !== i) }))}
                              >
                                ×
                              </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={bestPracticeInput}
                      onChange={e => setBestPracticeInput(e.target.value)}
                      onKeyDown={e => {
                        if ((e.key === "Enter" || e.key === ",") && bestPracticeInput.trim()) {
                          e.preventDefault();
                          setForm(f => ({ ...f, bestPractices: [...f.bestPractices, bestPracticeInput.trim()] }));
                          setBestPracticeInput("");
                        }
                      }}
                            placeholder="Add best practice and press Enter or comma"
                            className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          />
                          <button 
                            type="button" 
                            onClick={() => { 
                              if (bestPracticeInput.trim()) { 
                                setForm(f => ({ ...f, bestPractices: [...f.bestPractices, bestPracticeInput.trim()] })); 
                                setBestPracticeInput(""); 
                              } 
                            }} 
                            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white font-semibold shadow-lg transition-all"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-300 mb-2 font-semibold">Conclusion</label>
                        <textarea 
                          name="conclusion" 
                          value={form.conclusion} 
                          onChange={handleChange} 
                          placeholder="Write the conclusion of your blog post..." 
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-vertical" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                    <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="featured" 
                        checked={!!form.featured} 
                        onChange={handleChange} 
                        className="w-5 h-5 accent-blue-600 rounded focus:ring-2 focus:ring-blue-500" 
                      />
                      <span className="font-semibold text-lg">Featured Blog Post</span>
                      <span className="text-zinc-500 text-sm">(Will be highlighted on the blog page)</span>
                    </label>
                </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-6 justify-center pt-6">
                    <button 
                      type="submit" 
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl text-white font-bold flex items-center justify-center text-lg shadow-lg transition-all disabled:opacity-50" 
                      disabled={loading}
                    >
                    {loading && <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
                      {view === "edit" ? "Update Blog Post" : "Create Blog Post"}
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
          {view === "get" && posts.length === 0 && (
            <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[400px]">
              <div className="bg-black border border-zinc-800 rounded-3xl shadow-2xl p-16 flex flex-col items-center w-full">
                <img src="/galvan-logo.svg" alt="Galvan AI Logo" className="h-24 mb-8 drop-shadow-xl" />
                <h2 className="text-4xl font-extrabold mb-3 text-center text-white tracking-tight">No Blogs Yet</h2>
                <p className="text-zinc-400 text-xl text-center max-w-2xl mb-2">Start by adding your first blog post to showcase your content here. Your blogs will appear in this beautiful, modern dashboard.</p>
              </div>
            </div>
          )}
          {view === "get" && posts.length > 0 && (
            <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 rounded-3xl shadow-2xl border border-zinc-800 max-w-full overflow-x-auto mb-12">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-zinc-950/90 to-zinc-900/80 border-b border-zinc-800 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="7" width="18" height="13" rx="2"/>
                      <path d="M16 3v4M8 3v4M3 11h18"/>
                    </svg>
                    Blog Posts ({posts.length})
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 text-sm">
                      {posts.filter(p => p.featured).length} Featured
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
                          Image
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Title & Excerpt
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          Author
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                          </svg>
                          Category & Tags
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          Date & Read Time
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
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                          </svg>
                          Actions
                        </div>
                      </th>
                  </tr>
                </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {posts.map((post, idx) => (
                      <tr key={post._id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="py-6 px-6">
                          <div className="relative group">
                            <img
                              src={post.image || "/placeholder-blog.jpg"}
                              alt={post.title}
                              className="h-20 w-32 rounded-xl object-cover border-2 border-zinc-700 shadow-lg group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="space-y-2 max-w-md">
                            <div className="font-bold text-white text-lg line-clamp-1">{post.title}</div>
                            <div className="text-zinc-300 text-sm line-clamp-2">
                              {post.excerpt.length > 120 
                                ? `${post.excerpt.substring(0, 120)}...` 
                                : post.excerpt
                              }
                            </div>
                            {post.keyConcepts && post.keyConcepts.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {post.keyConcepts.slice(0, 2).map((concept, i) => (
                                  <span key={i} className="px-2 py-1 bg-green-600/20 text-green-200 text-xs rounded-full border border-green-600/30">
                                    {concept}
                                  </span>
                                ))}
                                {post.keyConcepts.length > 2 && (
                                  <span className="px-2 py-1 bg-zinc-600/20 text-zinc-300 text-xs rounded-full">
                                    +{post.keyConcepts.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative group">
                              <img
                                src={post.author.avatar || "/placeholder-user.jpg"}
                                alt={post.author.name}
                                className="h-12 w-12 rounded-full object-cover border-2 border-zinc-700 shadow-lg group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-semibold text-white text-sm">{post.author.name}</div>
                              <div className="text-zinc-400 text-xs">{post.author.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="space-y-2">
                            <div className="inline-flex items-center px-3 py-1 bg-purple-600/20 text-purple-200 text-sm rounded-full border border-purple-600/30">
                              {post.category}
                            </div>
                            {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((tag, i) => (
                                  <span key={i} className="px-2 py-1 bg-blue-600/20 text-blue-200 text-xs rounded-full border border-blue-600/30">
                                    {tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-zinc-600/20 text-zinc-300 text-xs rounded-full">
                                    +{post.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="space-y-1">
                            <div className="text-white text-sm font-medium">{post.publishDate}</div>
                            <div className="text-zinc-400 text-xs">{post.readTime}</div>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-2">
                            {post.featured ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-600/20 text-pink-300 text-sm rounded-full border border-pink-600/30">
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
                              onClick={() => startEdit(post)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white font-semibold text-sm shadow-lg transition-all flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(post._id)}
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
                  <span>Total Blog Posts: {posts.length}</span>
                  <span>Featured: {posts.filter(p => p.featured).length}</span>
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