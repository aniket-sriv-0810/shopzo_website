// JWT Authentication Utility
import axios from 'axios';

// Token storage keys
const TOKEN_KEY = 'shopzo_token';
const USER_KEY = 'user';

// Token management functions
export const tokenManager = {
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set token in localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if token exists
  hasToken: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

// User data management functions
export const userManager = {
  // Get user data from localStorage
  getUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(USER_KEY);
        return null;
      }
    }
    return null;
  },

  // Set user data in localStorage
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Remove user data from localStorage
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  }
};

// Create axios instance with JWT interceptors
export const createAuthenticatedAxios = () => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  // Request interceptor to add JWT token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        tokenManager.removeToken();
        userManager.removeUser();
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Default authenticated axios instance
export const authAxios = createAuthenticatedAxios();

// Authentication functions
export const auth = {
  // Login function
  login: async (credentials, userType = 'user') => {
    try {
      const endpoint = userType === 'vendor' ? '/api/vendor/login' : '/api/user/login';
      const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, credentials);
      
      if (response.data.success && response.data.data.token) {
        const { token, user } = response.data.data;
        
        // Store token and user data
        tokenManager.setToken(token);
        userManager.setUser(user);
        
        return { success: true, user, token };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        details: error.response?.data?.details
      };
    }
  },

  // Logout function
  logout: async () => {
    try {
      // Call logout endpoint (optional, since JWT is stateless)
      const userType = userManager.getUser()?.type || 'user';
      const endpoint = userType === 'vendor' ? '/api/vendor/logout' : '/api/user/logout';
      
      // Don't wait for response since logout is handled client-side
      authAxios.post(endpoint).catch(() => {
        // Ignore errors for logout endpoint
      });
      
      // Clear local storage
      tokenManager.removeToken();
      userManager.removeUser();
      
      return { success: true };
    } catch (error) {
      // Even if server call fails, clear local storage
      tokenManager.removeToken();
      userManager.removeUser();
      return { success: true };
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        return { isAuthenticated: false, user: null };
      }

      const response = await authAxios.get('/api/user/auth');
      
      if (response.data.isAuthenticated && response.data.user) {
        const user = response.data.user;
        userManager.setUser(user);
        return { isAuthenticated: true, user };
      }
      
      return { isAuthenticated: false, user: null };
    } catch (error) {
      // Token might be expired or invalid
      tokenManager.removeToken();
      userManager.removeUser();
      return { isAuthenticated: false, user: null };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return userManager.getUser();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return tokenManager.hasToken() && userManager.getUser() !== null;
  }
};

export default auth;