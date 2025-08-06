"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Job = {
  _id?: string;
  id?: number;
  title: string;
  company: string;
  location: string;
  type: string;
  department: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  salary_range?: string;
  experience_level?: string;
  skills_required?: string[];
  application_deadline?: string;
  is_active?: boolean;
};

const emptyJob: Job = {
  title: "",
  company: "",
  location: "",
  type: "",
  department: "",
  description: "",
  requirements: [],
  responsibilities: [],
  benefits: [],
  salary_range: "",
  experience_level: "",
  skills_required: [],
  application_deadline: "",
  is_active: true,
};

type View = "menu" | "add" | "get" | "edit";

export default function JobsManagementPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Job>(emptyJob);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState<View>("menu");
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (view === "get") fetchJobs();
  }, [view]);

  async function fetchJobs() {
    setLoading(true);
    const res = await fetch("/api/careers");
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleArrayChange(name: keyof Job, value: string) {
    setForm(f => ({ ...f, [name]: value.split(",").map(s => s.trim()).filter(Boolean) }));
  }

  function startEdit(job: Job) {
    setEditingId(job._id!);
    setForm({ ...job });
    setView("edit");
  }

  function resetForm() {
    setForm(emptyJob);
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
    if (!form.company.trim()) {
      setError("Company is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.department.trim()) {
      setError("Department is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.location.trim()) {
      setError("Location is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.type.trim()) {
      setError("Type is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.experience_level.trim()) {
      setError("Experience level is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.salary_range.trim()) {
      setError("Salary range is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.application_deadline.trim()) {
      setError("Application deadline is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required");
      setTimeout(() => setError("") , 2000);
      setLoading(false);
      return;
    }
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, _id: editingId } : form;
    try {
      const res = await fetch("/api/careers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      console.log("API response:", data);
      if (res.ok) {
        toast.success(editingId ? "Job updated successfully!" : "Job added successfully!");
        setTimeout(() => {
          setView("menu");
          setEditingId(null);
          setForm(emptyJob);
          fetchJobs();
        }, 2000);
      } else {
        toast.error(data.error || "Failed to save job");
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
    const res = await fetch("/api/careers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    if (res.ok) {
      toast.success("Job deleted successfully!");
      fetchJobs();
    } else {
      toast.error("Failed to delete job");
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
              <svg className="w-8 h-8 text-yellow-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2zm-6 8h4"/></svg>
              <div>
                <div className="text-lg font-bold text-white">Welcome to Jobs Management</div>
                <div className="text-zinc-400 text-sm">Add, edit, and manage your job postings with advanced controls and beautiful UI.</div>
              </div>
            </div>
          </div>
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-900/90 to-yellow-700/60 rounded-2xl p-5 shadow-2xl border border-yellow-900">
                <svg className="w-14 h-14 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2zm-6 8h4"/></svg>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-600 bg-clip-text text-transparent drop-shadow-xl">Jobs Management</h1>
                <p className="text-zinc-400 text-lg font-medium">Manage job postings and career opportunities.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setView("add")} className="px-8 py-3 bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-800 hover:to-yellow-600 rounded-2xl text-white font-bold shadow-2xl border border-yellow-900 transition-all text-lg flex items-center gap-2 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Job
              </button>
              <button onClick={() => setView("get")} className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold shadow-2xl border border-zinc-800 transition-all text-lg flex items-center gap-2 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                View Jobs
              </button>
            </div>
          </div>
          {/* Info Cards Section */}
          <div className="flex flex-wrap gap-8 mb-12">
            <div className="flex items-center gap-4 bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-8 min-w-[240px] shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <svg className="w-12 h-12 text-yellow-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2zm-6 8h4"/></svg>
              <div>
                <div className="text-3xl font-extrabold text-yellow-200 drop-shadow">{jobs.length}</div>
                <div className="text-zinc-400 text-base font-semibold">Total Jobs</div>
              </div>
            </div>
            {/* Add more info cards here if desired */}
          </div>
          <div className="mb-12 border-t border-zinc-800/80" />
          {view === "add" || view === "edit" ? (
            <div className="bg-zinc-900 rounded-xl p-6 shadow-xl border border-zinc-800 max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {view === "edit" ? "Edit Job" : "Add New Job"}
                </h2>
                <p className="text-zinc-400">
                  {view === "edit" ? "Update job information below" : "Fill in the job details below"}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-900/20 border border-red-600/30 rounded-lg text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-900/20 border border-green-600/30 rounded-lg text-green-200">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Basic Information</h3>
                  </div>
                  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Job Title *</label>
                      <input 
                        name="title" 
                        value={form.title} 
                        onChange={handleChange} 
                        placeholder="e.g., Senior Full-Stack Developer" 
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Company *</label>
                      <input 
                        name="company" 
                        value={form.company} 
                        onChange={handleChange} 
                        placeholder="e.g., Galvan AI" 
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Department *</label>
                      <input 
                        name="department" 
                        value={form.department} 
                        onChange={handleChange} 
                        placeholder="e.g., Engineering" 
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Location *</label>
                      <input 
                        name="location" 
                        value={form.location} 
                        onChange={handleChange} 
                        placeholder="e.g., San Francisco, CA (Hybrid)" 
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Job Type *</label>
                      <select 
                        name="type" 
                        value={form.type} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        required
                      >
                        <option value="">Select job type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                  </select>
                    </div>
                    
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Experience Level *</label>
                      <input 
                        name="experience_level" 
                        value={form.experience_level} 
                        onChange={handleChange} 
                        placeholder="e.g., Senior, Mid-level, Entry" 
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Salary Range *</label>
                      <input 
                        name="salary_range" 
                        value={form.salary_range} 
                        onChange={handleChange} 
                        placeholder="e.g., $80,000 - $120,000" 
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Application Deadline *</label>
                      <input 
                        type="date" 
                        name="application_deadline" 
                        value={form.application_deadline} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Job Description Section */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Job Description</h3>
                  </div>
                  
                  <div>
                    <label className="block text-zinc-300 mb-2 font-medium">Description *</label>
                    <textarea 
                      name="description" 
                      value={form.description} 
                      onChange={handleChange} 
                      placeholder="Provide a detailed description of the job role, responsibilities, and what the company is looking for..." 
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-vertical" 
                      required 
                    />
                  </div>
                </div>

                {/* Requirements Section */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Requirements</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.requirements?.map((req, i) => (
                      <span key={i} className="flex items-center bg-purple-700/40 text-purple-100 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                        {req}
                        <button type="button" className="ml-2 text-purple-300 hover:text-red-400 transition" onClick={() => setForm(f => ({ ...f, requirements: f.requirements?.filter((_, idx) => idx !== i) }))}>&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={requirementInput}
                      onChange={e => setRequirementInput(e.target.value)}
                      onKeyDown={e => {
                        if ((e.key === "Enter" || e.key === ",") && requirementInput.trim()) {
                          e.preventDefault();
                          setForm(f => ({ ...f, requirements: [...f.requirements!, requirementInput.trim()] }));
                          setRequirementInput("");
                        }
                      }}
                      placeholder="Add requirement and press Enter"
                      className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                    <button type="button" onClick={() => { if (requirementInput.trim()) { setForm(f => ({ ...f, requirements: [...f.requirements!, requirementInput.trim()] })); setRequirementInput(""); } }} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold shadow-lg transition-all">Add</button>
                  </div>
                </div>

                {/* Responsibilities Section */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Responsibilities</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.responsibilities?.map((resp, i) => (
                      <span key={i} className="flex items-center bg-blue-700/40 text-blue-100 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                        {resp}
                        <button type="button" className="ml-2 text-blue-300 hover:text-red-400 transition" onClick={() => setForm(f => ({ ...f, responsibilities: f.responsibilities?.filter((_, idx) => idx !== i) }))}>&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={responsibilityInput}
                      onChange={e => setResponsibilityInput(e.target.value)}
                      onKeyDown={e => {
                        if ((e.key === "Enter" || e.key === ",") && responsibilityInput.trim()) {
                          e.preventDefault();
                          setForm(f => ({ ...f, responsibilities: [...f.responsibilities!, responsibilityInput.trim()] }));
                          setResponsibilityInput("");
                        }
                      }}
                      placeholder="Add responsibility and press Enter"
                      className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <button type="button" onClick={() => { if (responsibilityInput.trim()) { setForm(f => ({ ...f, responsibilities: [...f.responsibilities!, responsibilityInput.trim()] })); setResponsibilityInput(""); } }} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-lg transition-all">Add</button>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Benefits</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.benefits?.map((benefit, i) => (
                      <span key={i} className="flex items-center bg-green-700/40 text-green-100 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                        {benefit}
                        <button type="button" className="ml-2 text-green-300 hover:text-red-400 transition" onClick={() => setForm(f => ({ ...f, benefits: f.benefits?.filter((_, idx) => idx !== i) }))}>&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={benefitInput}
                      onChange={e => setBenefitInput(e.target.value)}
                      onKeyDown={e => {
                        if ((e.key === "Enter" || e.key === ",") && benefitInput.trim()) {
                          e.preventDefault();
                          setForm(f => ({ ...f, benefits: [...f.benefits!, benefitInput.trim()] }));
                          setBenefitInput("");
                        }
                      }}
                      placeholder="Add benefit and press Enter"
                      className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                    <button type="button" onClick={() => { if (benefitInput.trim()) { setForm(f => ({ ...f, benefits: [...f.benefits!, benefitInput.trim()] })); setBenefitInput(""); } }} className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-lg transition-all">Add</button>
                  </div>
                </div>

                {/* Status Section */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Job Status</h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                    <input
                        name="is_active" 
                        type="checkbox" 
                        checked={form.is_active} 
                        onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} 
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded" 
                      />
                      <label className="text-zinc-300 font-medium">Active Job Posting</label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white font-bold flex items-center justify-center transition-all shadow-lg" disabled={loading}>
                    {loading && <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
                    {view === "edit" ? "Update Job" : "Create Job"}
                  </button>
                  <button type="button" onClick={resetForm} className="px-8 py-3 bg-zinc-700 hover:bg-zinc-800 rounded-lg text-white font-bold transition-all">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[400px]">
              <div className="bg-black border border-zinc-800 rounded-3xl shadow-2xl p-16 flex flex-col items-center w-full">
                <img src="/galvan-logo.svg" alt="Galvan AI Logo" className="h-24 mb-8 drop-shadow-xl" />
                <h2 className="text-4xl font-extrabold mb-3 text-center text-white tracking-tight">No Jobs Yet</h2>
                <p className="text-zinc-400 text-xl text-center max-w-2xl mb-2">Start by adding your first job to showcase your opportunities here. Your jobs will appear in this beautiful, modern dashboard.</p>
              </div>
            </div>
          )}
          {view === "get" && jobs.length > 0 && (
            <div className="bg-zinc-900/90 rounded-3xl shadow-2xl border border-zinc-800 max-w-full mb-12">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 px-8 py-6 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Job Postings</h3>
                    <p className="text-zinc-400">Manage and monitor all your career opportunities</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-800/50 rounded-lg px-4 py-2 border border-zinc-700">
                      <span className="text-zinc-300 text-sm font-medium">{jobs.length} Total Jobs</span>
                    </div>
                    <div className="bg-green-900/20 rounded-lg px-4 py-2 border border-green-600/30">
                      <span className="text-green-200 text-sm font-medium">{jobs.filter(j => j.is_active).length} Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table with Custom Scrollbar */}
              <div className="overflow-x-auto custom-scrollbar">
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    height: 12px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2937;
                    border-radius: 6px;
                    margin: 0 8px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
                    border-radius: 6px;
                    border: 2px solid #1f2937;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(90deg, #2563eb, #1e40af);
                  }
                  .custom-scrollbar::-webkit-scrollbar-corner {
                    background: #1f2937;
                  }
                `}</style>
                <table className="min-w-full" style={{ minWidth: '1200px' }}>
                <thead className="bg-zinc-950/80 sticky top-0 z-10">
                  <tr className="text-zinc-400 border-b border-zinc-800">
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '200px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                          </svg>
                          Job Title
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '150px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Company
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '140px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Department
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '180px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Location
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '120px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Type
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '120px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Experience
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '150px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          Salary
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '130px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Deadline
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '100px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Status
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '160px' }}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                          </svg>
                          Actions
                        </div>
                      </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {jobs.map((j, idx) => (
                      <tr key={j._id} className={idx % 2 === 0 ? "bg-zinc-900/50" : "bg-zinc-800/50" + " hover:bg-zinc-700/50 transition-all duration-200"}>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-blue-300 text-base">{j.title}</span>
                            <span className="text-zinc-500 text-sm">ID: {j._id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-zinc-200 font-medium">{j.company}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-purple-600/20 text-purple-200 text-sm rounded-lg border border-purple-600/30 font-medium">
                            {j.department}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span className="text-zinc-300">{j.location}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-indigo-600/20 text-indigo-200 text-sm rounded-lg border border-indigo-600/30 font-medium whitespace-nowrap">
                            {j.type}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-orange-600/20 text-orange-200 text-sm rounded-lg border border-orange-600/30 font-medium whitespace-nowrap">
                            {j.experience_level}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-green-300 font-semibold">{j.salary_range}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-zinc-300">{j.application_deadline}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1">
                            {j.is_active ? (
                              <span className="px-3 py-1 bg-green-600/20 text-green-200 text-sm rounded-lg border border-green-600/30 font-medium flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                Active
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-red-600/20 text-red-200 text-sm rounded-lg border border-red-600/30 font-medium flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                        <div className="flex gap-2">
                            <button 
                              onClick={() => startEdit(j)} 
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(j._id)} 
                              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
              <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 px-8 py-4 border-t border-zinc-800">
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Showing {jobs.length} job postings</span>
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
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