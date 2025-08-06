"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

export default function CareersPage() {
  return (
    <AdminLayout>
      <div className="py-10 px-4">
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <button onClick={() => window.history.back()} className="absolute top-8 left-8 px-6 py-2 bg-zinc-700 hover:bg-zinc-800 rounded-lg text-white font-bold">Back</button>
          <h1 className="text-3xl font-extrabold mb-4">Careers Management</h1>
          <p className="mb-6">Manage job postings in the <Link href="/admin/jobs" className="text-blue-400 underline">Jobs Management</Link> section.</p>
          <Link href="/admin/jobs" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold">Go to Jobs Management</Link>
        </div>
      </div>
    </AdminLayout>
  );
} 