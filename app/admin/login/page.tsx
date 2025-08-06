"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, setLoginTime } from "@/lib/auth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Set up session management
  useEffect(() => {
    // Store login timestamp when component mounts
    const loginTime = Date.now();
    sessionStorage.setItem('adminLoginTime', loginTime.toString());
    
    // Set up beforeunload event to clear session on browser close
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('adminLoginTime');
    };

    // Set up visibility change event to check session on tab switch
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const storedLoginTime = sessionStorage.getItem('adminLoginTime');
        if (storedLoginTime) {
          const loginTime = parseInt(storedLoginTime);
          const currentTime = Date.now();
          const sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
          
          if (currentTime - loginTime > sessionTimeout) {
            // Session expired, redirect to login
            sessionStorage.removeItem('adminLoginTime');
            window.location.href = '/admin/login';
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      const response = await loginAdmin(username, password);
      if (response.success) {
        // Show success message
        setSuccess("Login successful! Redirecting to dashboard...");
        
        // Store login timestamp
        setLoginTime();
        
        // Wait a moment to show success message, then redirect
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl p-10 space-y-8 border border-zinc-800">
        <div className="flex flex-col items-center mb-2">
          <img src="/Galvan AI logo transparent.png" alt="Galvan AI Logo" className="h-16 mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Login</h1>
          <p className="text-zinc-400 text-base mt-1">Sign in to your admin dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-zinc-200 mb-2 text-sm font-medium" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-zinc-200 mb-2 text-sm font-medium" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="current-password"
              placeholder="Your password"
            />
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-400 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-400 text-sm font-medium">{success}</span>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-yellow-400 hover:from-blue-700 hover:to-yellow-500 text-black font-bold rounded-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 