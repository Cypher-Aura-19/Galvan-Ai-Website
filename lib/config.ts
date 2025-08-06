// API Configuration
export const API_CONFIG = {
  // Next.js API routes that proxy to Flask backend
  BASE_URL: '',
  
  // API endpoints - using Next.js API routes
  ENDPOINTS: {
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_LOGOUT: '/api/admin/logout',
    ADMIN_DASHBOARD: '/api/admin/dashboard',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for API requests
export const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // Include cookies for session management
    headers: {
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
}; 