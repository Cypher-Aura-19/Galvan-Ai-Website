import { apiRequest, API_CONFIG } from './config';

export interface AdminUser {
  username: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AdminUser;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Login function - using Next.js API route that proxies to Flask backend
export const loginAdmin = async (username: string, password: string): Promise<LoginResponse> => {
  // Create form data for the API route
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await apiRequest(API_CONFIG.ENDPOINTS.ADMIN_LOGIN, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data = await response.json();
  return data;
};

// Logout function
export const logoutAdmin = async (): Promise<LogoutResponse> => {
  const response = await apiRequest(API_CONFIG.ENDPOINTS.ADMIN_LOGOUT, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
};

// Check if user is authenticated by calling the dashboard API
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD, {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.authenticated;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Session management utilities
export const setLoginTime = (): void => {
  sessionStorage.setItem('adminLoginTime', Date.now().toString());
};

export const getLoginTime = (): number | null => {
  const time = sessionStorage.getItem('adminLoginTime');
  return time ? parseInt(time) : null;
};

export const clearLoginTime = (): void => {
  sessionStorage.removeItem('adminLoginTime');
};

export const isSessionValid = (): boolean => {
  const loginTime = getLoginTime();
  if (!loginTime) return false;

  const currentTime = Date.now();
  const sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours
  return (currentTime - loginTime) < sessionTimeout;
}; 