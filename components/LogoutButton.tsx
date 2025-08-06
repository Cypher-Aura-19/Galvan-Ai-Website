"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin, clearLoginTime } from "@/lib/auth";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className = "", children }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await logoutAdmin();
      clearLoginTime();
      router.push("/admin/login");
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local session and redirect
      clearLoginTime();
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 ${className}`}
    >
      {isLoading ? "Logging out..." : children || "Logout"}
    </button>
  );
} 