"use client";
import AdminSidebar from "./AdminSidebar";
import { useAdminSession } from "@/hooks/useAdminSession";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Initialize session management
  useAdminSession();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-0">{children}</main>
    </div>
  );
} 