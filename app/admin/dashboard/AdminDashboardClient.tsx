"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    name: "Projects",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
    ),
    path: "/admin/projects"
  },
  {
    name: "Project Quotes",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
    ),
    path: "/admin/quotes"
  },
  {
    name: "Blogs",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
    ),
    path: "/admin/blogs"
  },
  {
    name: "Testimonials",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H7zm0 0v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2"/></svg>
    ),
    path: "/admin/testimonials"
  },
  {
    name: "Teams",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
    ),
    path: "/admin/teams"
  },
  {
    name: "Careers",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
    ),
    path: "/admin/jobs"
  },
  {
    name: "Questionnaires",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    ),
    path: "/admin/questionnaires"
  },
  {
    name: "Applications",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
    ),
    path: "/admin/applications"
  },
];

export default function AdminDashboardClient() {
  const router = useRouter();

  function handleNav(item: typeof navItems[number]) {
    if (item.path) {
      router.push(item.path);
    }
  }

  async function handleLogout() {
    try {
      sessionStorage.removeItem('adminLoginTime');
      await fetch("/api/admin/logout", { method: "GET" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = "/admin/login";
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col py-10 px-6 min-h-screen shadow-2xl">
        <div className="flex items-center gap-3 mb-12 px-2">
          <img src="/Galvan AI logo transparent.png" alt="Galvan AI Logo" className="h-10" />
          <span className="text-2xl font-extrabold tracking-tight">Galvan Admin</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <button
              key={item.name}
              className="flex items-center w-full px-4 py-3 rounded-xl font-semibold transition group hover:bg-zinc-900 hover:text-blue-400 text-zinc-200 text-lg gap-3"
              onClick={() => handleNav(item)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
        <div className="mt-12 text-xs text-zinc-500 text-center opacity-70">
          &copy; {new Date().getFullYear()} Galvan AI. All rights reserved.
        </div>
        <button
          onClick={handleLogout}
          className="mt-8 py-3 px-6 w-full bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 rounded-xl text-white font-bold shadow-lg transition-all text-lg"
        >
          Logout
        </button>
      </aside>
      {/* Main Content - Right Panel */}
      <main className="flex-1 flex flex-col items-center justify-center p-10 relative">
        <div className="w-full max-w-3xl bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-3xl shadow-2xl p-12 border border-zinc-800 flex flex-col items-center justify-center">
          <img src="/Galvan AI logo transparent.png" alt="Galvan AI Logo" className="h-20 mb-6 drop-shadow-xl" />
          <h1 className="text-4xl font-extrabold mb-4 text-center tracking-tight">Welcome to the Galvan Admin Dashboard</h1>
          <p className="text-zinc-300 text-lg text-center mb-8 max-w-xl">
            Manage your projects, blogs, testimonials, teams, and careers with ease. Use the navigation on the left to get started.
          </p>
          <div className="flex flex-wrap gap-6 justify-center mt-4">
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center min-w-[160px]">
              <span className="text-2xl font-bold text-blue-400 mb-1">Projects</span>
              <span className="text-zinc-400">All your projects in one place</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center min-w-[160px]">
              <span className="text-2xl font-bold text-green-400 mb-1">Project Quotes</span>
              <span className="text-zinc-400">Manage client inquiries</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center min-w-[160px]">
              <span className="text-2xl font-bold text-pink-400 mb-1">Blogs</span>
              <span className="text-zinc-400">Share your latest updates</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center min-w-[160px]">
              <span className="text-2xl font-bold text-yellow-400 mb-1">Testimonials</span>
              <span className="text-zinc-400">Showcase your success</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center min-w-[160px]">
              <span className="text-2xl font-bold text-cyan-400 mb-1">Teams</span>
              <span className="text-zinc-400">Manage your team members</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center min-w-[160px]">
              <span className="text-2xl font-bold text-purple-400 mb-1">Careers</span>
              <span className="text-zinc-400">Post and manage jobs</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center min-w-[160px]">
              <span className="text-2xl font-bold text-indigo-400 mb-1">Questionnaires</span>
              <span className="text-zinc-400">Design application forms</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center min-w-[160px]">
              <span className="text-2xl font-bold text-orange-400 mb-1">Applications</span>
              <span className="text-zinc-400">Review job applications</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 