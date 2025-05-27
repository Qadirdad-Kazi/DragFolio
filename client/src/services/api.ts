import { Portfolio, Template, Section, Theme } from '@/types';

// Determine the base API URL dynamically with auto-detection
const determineApiUrl = () => {
  // Check if we're in production (deployed) or development
  const isProd = import.meta.env.PROD;
  
  // If in production, use relative URL to avoid hardcoding domains
  if (isProd) {
    return '/api';
  }
  
  // In development, use the /api prefix that will be handled by Vite's proxy
  // This allows the port to be auto-detected by the Vite proxy configuration
  return '/api';
};

// Base API URL
const API_URL = determineApiUrl();
console.log('Using API URL:', API_URL);

// Helper to get the auth token
const getToken = () => localStorage.getItem('token');

// Maximum number of retries for API requests
const MAX_RETRIES = 2;

// Retry delay in milliseconds (increases with each retry)
const RETRY_DELAY = 1000;

// Helper for API requests with retry logic
const apiRequest = async (endpoint: string, options: RequestInit = {}, retryCount = 0) => {
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
      // Add credentials to support cookies for session-based auth
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API request failed: ${url}`, errorData);
      
      // Check if we should retry (server errors 5xx or network issues)
      if (retryCount < MAX_RETRIES && (response.status >= 500 || response.status === 0)) {
        console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})...`);
        
        // Exponential backoff: wait longer with each retry
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry the request
        return apiRequest(endpoint, options, retryCount + 1);
      }
      
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // For successful responses, parse and return the JSON
    return response.json();
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    
    // Retry on network errors if we haven't exceeded max retries
    if (retryCount < MAX_RETRIES && error instanceof TypeError) {
      console.log(`Network error, retrying request (${retryCount + 1}/${MAX_RETRIES})...`);
      
      // Exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      return apiRequest(endpoint, options, retryCount + 1);
    }
    
    throw error;
  }
};

// Portfolio API
export const portfolioApi = {
  // Get all portfolios for the current user
  getAll: () => {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }
    // Extract userId from token (the token uses 'id' instead of 'userId')
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    if (!userId) {
      throw new Error('Invalid token: No user id found');
    }
    return apiRequest(`/portfolios?userId=${userId}`);
  },
  
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
  delete: async (id: string) => {
    try {
      // Validate the ID format - MongoDB ObjectIds are 24-character hex strings
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid portfolio ID: ID must be a string');
      }
      
      // Extract the ID from MongoDB format if needed
      let portfolioId = id;
      
      // If it's a MongoDB ObjectId string like "_id": "68363187bb0958f29f0ccd8f"
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        portfolioId = id; // Already in the correct format
      } 
      // If it's a MongoDB ObjectId in string format like ObjectId("68363187bb0958f29f0ccd8f")
      else if (id.match(/^ObjectId\(['"]([0-9a-fA-F]{24})['"](,\s*\{.*\})?\)$/)) {
        portfolioId = id.replace(/^ObjectId\(['"]([0-9a-fA-F]{24})['"](,\s*\{.*\})?\)$/, '$1');
      }
      // If it doesn't match either format, it's likely invalid
      else {
        throw new Error(`Invalid portfolio ID format: ${id}`);
      }
      
      console.log('Deleting portfolio with validated ID:', portfolioId);
      
      const result = await apiRequest(`/portfolios/${portfolioId}`, {
        method: 'DELETE',
      });
      console.log('Portfolio deleted successfully:', portfolioId);
      return result;
    } catch (error) {
      console.error(`Error deleting portfolio ${id}:`, error);
      throw error;
    }
  },
  
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

// Template cache to avoid unnecessary API calls
let templateCache: { templates: Template[] | null; timestamp: number } = { templates: null, timestamp: 0 };

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Template API with caching
export const templateApi = {
  // Get all templates with caching
  getAll: async () => {
    // Check if we have a valid cache
    const now = Date.now();
    if (templateCache.templates && (now - templateCache.timestamp) < CACHE_EXPIRATION) {
      console.log('Using cached templates');
      return templateCache.templates;
    }
    
    try {
      // Fetch fresh data
      console.log('Fetching fresh templates from API');
      const templates = await apiRequest('/templates');
      
      // Update cache
      templateCache = { templates, timestamp: now };
      return templates;
    } catch (error) {
      // If we have a cache but it's expired, still use it on error
      if (templateCache.templates) {
        console.warn('Failed to fetch fresh templates, using expired cache');
        return templateCache.templates;
      }
      // No cache available, rethrow the error
      throw error;
    }
  },
  
  // Force refresh the template cache
  refreshCache: async () => {
    console.log('Forcing template cache refresh');
    templateCache = { templates: null, timestamp: 0 };
    return templateApi.getAll();
  },
  
  // Get templates by category with caching
  getByCategory: async (category: string) => {
    const templates = await templateApi.getAll();
    return templates.filter((template: Template) => template.category === category);
  },
  
  // Get a specific template with caching and enhanced error handling
  getById: async (id: string): Promise<Template> => {
    if (!id) {
      console.error('Invalid template ID provided:', id);
      throw new Error('Invalid template ID: Template ID is required');
    }
    
    console.log(`Fetching template with ID: ${id}`);
    
    // Try to find in cache first
    if (templateCache.templates) {
      console.log('Checking template cache...');
      const cachedTemplate = templateCache.templates.find((t: Template) => t.id === id);
      if (cachedTemplate) {
        console.log('Template found in cache:', cachedTemplate.name);
        return cachedTemplate;
      }
      console.log('Template not found in cache, fetching from API');
    } else {
      console.log('Template cache empty, fetching from API');
    }
    
    try {
      // If not in cache or cache is empty, fetch from API
      const template = await apiRequest(`/templates/${id}`);
      
      if (!template) {
        throw new Error(`Template with ID ${id} not found`);
      }
      
      console.log('Template fetched successfully:', template.name);
      
      // Update the cache with this single template if we have a cache already
      if (templateCache.templates) {
        // Find the index of the template in the cache if it exists
        const existingIndex = templateCache.templates.findIndex((t: Template) => t.id === id);
        
        // Create a new array to avoid mutating the original
        const updatedTemplates = [...templateCache.templates];
        
        if (existingIndex >= 0) {
          // Replace the existing template
          updatedTemplates[existingIndex] = template;
        } else {
          // Add the new template
          updatedTemplates.push(template);
        }
        
        // Update the cache with the new array
        templateCache = { 
          templates: updatedTemplates, 
          timestamp: templateCache.timestamp // Keep the original timestamp
        };
      }
      
      return template;
    } catch (error) {
      console.error(`Error fetching template with ID ${id}:`, error);
      throw new Error(`Failed to fetch template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  // Create a new template (admin only)
  create: async (data: Partial<Template>) => {
    const newTemplate = await apiRequest('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Invalidate cache after creating
    templateCache = { templates: null, timestamp: 0 };
    return newTemplate;
  },
  
  // Update a template (admin only)
  update: async (id: string, data: Partial<Template>) => {
    const updatedTemplate = await apiRequest(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    // Invalidate cache after updating
    templateCache = { templates: null, timestamp: 0 };
    return updatedTemplate;
  },
  
  // Delete a template (admin only)
  delete: async (id: string) => {
    if (!id) {
      console.error('Invalid template ID provided for deletion:', id);
      throw new Error('Invalid template ID: Template ID is required for deletion');
    }
    
    try {
      console.log('Deleting template with ID:', id);
      const result = await apiRequest(`/templates/${id}`, {
        method: 'DELETE',
      });
      
      console.log('Template deleted successfully:', id);
      
      // Invalidate cache after deleting
      templateCache = { templates: null, timestamp: 0 };
      return result;
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      throw error;
    }
  },
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
