import { useEffect } from 'react';

export const useAdminSession = () => {
  useEffect(() => {
    const checkSession = () => {
      const storedLoginTime = sessionStorage.getItem('adminLoginTime');
      if (!storedLoginTime) {
        // No session found, redirect to login
        window.location.href = '/admin/login';
        return;
      }

      const loginTime = parseInt(storedLoginTime);
      const currentTime = Date.now();
      const sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
      
      if (currentTime - loginTime > sessionTimeout) {
        // Session expired, logout and redirect
        sessionStorage.removeItem('adminLoginTime');
        fetch("/api/admin/logout", { method: "POST" });
        window.location.href = '/admin/login';
      }
    };

    // Check session immediately
    checkSession();

    // Set up interval to check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    // Set up visibility change event
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    // Set up beforeunload event to clear session on browser close
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('adminLoginTime');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const logout = async () => {
    sessionStorage.removeItem('adminLoginTime');
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return { logout };
}; 