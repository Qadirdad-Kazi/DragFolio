import { Portfolio, Template, Section, Theme } from '@/types';

// Base API URL
const API_URL = 'http://localhost:3001/api';
console.log('Using API URL:', API_URL);

// Helper to get the auth token
const getToken = () => localStorage.getItem('token');

// Helper for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const url = `${API_URL}${endpoint}`;
  console.log(`Making API request to: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Add cache control to prevent caching issues
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API request failed: ${url}`, errorData);
      throw new Error(errorData.message || 'API request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    throw error;
  }
};

// Portfolio API
export const portfolioApi = {
  // Get all portfolios for the current user
  getAll: () => apiRequest('/portfolios'),
  
  // Get a specific portfolio
  getById: (id: string) => apiRequest(`/portfolios/${id}`),
  
  // Create a new portfolio
  create: (data: Partial<Portfolio> & { template?: string }) => {
    console.log('Creating portfolio with data:', data);
    return apiRequest('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Update a portfolio
  update: (id: string, data: Partial<Portfolio>) => apiRequest(`/portfolios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete a portfolio
  delete: (id: string) => apiRequest(`/portfolios/${id}`, {
    method: 'DELETE',
  }),
  
  // Update portfolio sections
  updateSections: (id: string, sections: Section[]) => apiRequest(`/portfolios/${id}/sections`, {
    method: 'PUT',
    body: JSON.stringify({ sections }),
  }),
  
  // Update portfolio theme
  updateTheme: (id: string, theme: Theme) => apiRequest(`/portfolios/${id}/theme`, {
    method: 'PUT',
    body: JSON.stringify({ theme }),
  }),
  
  // Export portfolio as HTML/ZIP
  export: (id: string) => apiRequest(`/portfolios/${id}/export`, {
    method: 'GET',
  }),
  
  // Deploy to subdomain
  deploy: (id: string, subdomain: string) => apiRequest(`/portfolios/${id}/deploy`, {
    method: 'POST',
    body: JSON.stringify({ subdomain }),
  }),
};

// Template API
export const templateApi = {
  // Get all templates
  getAll: () => apiRequest('/templates'),
  
  // Get templates by category
  getByCategory: (category: string) => apiRequest(`/templates?category=${category}`),
  
  // Get a specific template
  getById: (id: string) => apiRequest(`/templates/${id}`),
  
  // Create a new template (admin only)
  create: (data: Partial<Template>) => apiRequest('/templates', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update a template (admin only)
  update: (id: string, data: Partial<Template>) => apiRequest(`/templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete a template (admin only)
  delete: (id: string) => apiRequest(`/templates/${id}`, {
    method: 'DELETE',
  }),
};

// User API
export const userApi = {
  // Get current user profile
  getProfile: () => apiRequest('/users/profile'),
  
  // Update user profile
  updateProfile: (data: any) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Get all users (admin only)
  getAll: () => apiRequest('/users'),
  
  // Get user by ID (admin only)
  getById: (id: string) => apiRequest(`/users/${id}`),
  
  // Update user (admin only)
  update: (id: string, data: any) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete user (admin only)
  delete: (id: string) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Upload API
export const uploadApi = {
  // Upload an image
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = getToken();
    
    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Image upload failed');
    }
    
    return response.json();
  },
};

// Analytics API
export const analyticsApi = {
  // Get portfolio analytics
  getPortfolioStats: (id: string) => apiRequest(`/analytics/portfolio/${id}`),
  
  // Get overall analytics (admin only)
  getOverallStats: () => apiRequest('/analytics/overall'),
};

export default {
  portfolio: portfolioApi,
  template: templateApi,
  user: userApi,
  upload: uploadApi,
  analytics: analyticsApi,
};
