import { Portfolio, Template, Section, Theme } from '@/types';

// Helper to determine the API URL based on environment
const determineApiUrl = () => {
  // Always prioritize the environment variable
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl) {
    console.log('Using API URL from environment:', envApiUrl);
    // Remove trailing slash to avoid double slashes
    return envApiUrl.replace(/\/+$/, '');
  }
  
  const isProd = import.meta.env.MODE === 'production';
  console.log('Environment mode:', isProd ? 'production' : 'development');
  
  // If in production and no explicit API URL is set, log a warning
  if (isProd) {
    console.warn('WARNING: VITE_API_URL environment variable is not set in production!');
    console.warn('Using fallback relative URL /api - this may not work correctly');
  }
  
  // In development or as fallback, use the /api prefix
  console.log('Using API URL: /api');
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

// Simple in-memory cache for GET requests
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 60 * 1000; // 60 seconds cache lifetime

// Helper for API requests with retry logic and caching
const apiRequest = async (endpoint: string, options: RequestInit = {}, retryCount = 0) => {
  const baseUrl = API_URL;
  const url = `${baseUrl}${endpoint}`;
  const isGet = !options.method || options.method === 'GET';
  const cacheKey = `${url}-${JSON.stringify(options.body || '')}`;
  
  // Check cache for GET requests
  if (isGet && apiCache[cacheKey]) {
    const cachedData = apiCache[cacheKey];
    const now = Date.now();
    
    // Return cached data if it's still fresh
    if (now - cachedData.timestamp < CACHE_TTL) {
      console.log(`Using cached data for: ${url}`);
      return cachedData.data;
    } else {
      // Clear expired cache
      delete apiCache[cacheKey];
    }
  }
  
  console.log(`Making API request to: ${url}`);
  console.log(`API URL base: ${baseUrl}, endpoint: ${endpoint}`);
  console.log(`Environment API URL: ${import.meta.env.VITE_API_URL || 'not set'}`);
  
  // Set default headers with performance optimizations
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers as Record<string, string> || {})
  };
  
  // Add authorization header if token exists
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add performance tracking header
  headers['X-Client-Performance-Metrics'] = 'enabled';
  
  try {
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'omit' // Don't send credentials to avoid CORS issues
    });
    
    // Log response status
    console.log(`API response status: ${response.status} ${response.statusText}`);
    
    // Check if response is ok
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      
      // Try to get more detailed error information
      let errorMessage = '';
      try {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        errorMessage = errorText;
      } catch (e) {
        errorMessage = `HTTP Error: ${response.status}`;
      }
      
      // Check if we should retry (server errors 5xx or network issues)
      if (retryCount < MAX_RETRIES && (response.status >= 500 || response.status === 0)) {
        console.log(`Retrying API request (${retryCount + 1}/${MAX_RETRIES}): ${url}`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        
        // Retry the request
        return apiRequest(endpoint, options, retryCount + 1);
      }
      
      // If we shouldn't retry or have exceeded max retries, throw the error
      throw new Error(`API Error: ${response.status} - ${errorMessage}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Cache the result for GET requests
    if (isGet) {
      apiCache[cacheKey] = {
        data,
        timestamp: Date.now()
      };
    }
    
    return data;
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    
    // Check if we should retry on network errors
    if (retryCount < MAX_RETRIES && error instanceof TypeError) {
      console.log(`Retrying API request due to network error (${retryCount + 1}/${MAX_RETRIES}): ${url}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      
      // Retry the request
      return apiRequest(endpoint, options, retryCount + 1);
    }
    
    // If it's a server error and we've exhausted retries, throw a more descriptive error
    throw error;
  }
};

// Portfolio API
export const portfolioApi = {
  // Get all portfolios for the current user
  getAll: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }
      // Extract userId from token (the token uses 'id' instead of 'userId')
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      if (!userId) {
        throw new Error('Invalid token: No user id found');
      }
      return await apiRequest(`/portfolios?userId=${userId}`);
    } catch (error: unknown) {
      console.error('Error fetching portfolios:', error instanceof Error ? error.message : String(error));
      // Return an empty array instead of throwing to prevent app crashes
      return [];
    }
  },
  
  // Get a specific portfolio
  getById: async (id: string) => {
    try {
      if (!id) {
        throw new Error('Portfolio ID is required');
      }
      
      // Clean the ID - remove any quotes, spaces, or other characters that might cause issues
      let portfolioId = String(id).trim();
      
      // Remove any quotes that might be present
      portfolioId = portfolioId.replace(/["']/g, '');
      
      // Remove any ObjectId wrapper if present
      if (portfolioId.includes('ObjectId')) {
        // Extract just the ID part from ObjectId format
        const match = portfolioId.match(/ObjectId\(["']?([0-9a-fA-F]+)["']?\)/);
        if (match && match[1]) {
          portfolioId = match[1];
        }
      }
      
      console.log('Getting portfolio with cleaned ID:', portfolioId);
      
      const result = await apiRequest(`/portfolios/${portfolioId}`);
      console.log('Portfolio retrieved successfully:', portfolioId);
      return result;
    } catch (error) {
      console.error(`Error getting portfolio ${id}:`, error);
      throw error;
    }
  },
  
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
      // Basic validation
      if (!id) {
        throw new Error('Invalid portfolio ID: ID is required');
      }
      
      // Clean the ID - remove any quotes, spaces, or other characters that might cause issues
      let portfolioId = String(id).trim();
      
      // Remove any quotes that might be present
      portfolioId = portfolioId.replace(/["']/g, '');
      
      // Remove any ObjectId wrapper if present
      if (portfolioId.includes('ObjectId')) {
        // Extract just the ID part from ObjectId format
        const match = portfolioId.match(/ObjectId\(["']?([0-9a-fA-F]+)["']?\)/);
        if (match && match[1]) {
          portfolioId = match[1];
        }
      }
      
      if (!portfolioId) {
        throw new Error('Invalid portfolio ID: Empty ID after cleaning');
      }
      
      console.log('Attempting to delete portfolio with cleaned ID:', portfolioId);
      
      try {
        // Make the delete request
        const result = await apiRequest(`/portfolios/${portfolioId}`, {
          method: 'DELETE',
        });
        
        console.log('Portfolio deleted successfully:', portfolioId);
        return result;
      } catch (apiError) {
        // Handle API-specific errors
        console.error(`API error deleting portfolio ${portfolioId}:`, apiError);
        
        // Add a small delay and try again once - this helps with transient issues
        console.log('Retrying deletion after a short delay...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const retryResult = await apiRequest(`/portfolios/${portfolioId}`, {
          method: 'DELETE',
        });
        
        console.log('Portfolio deleted successfully on retry:', portfolioId);
        return retryResult;
      }
    } catch (error) {
      console.error(`Error deleting portfolio ${id}:`, error);
      
      // Enhance error message for better debugging
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          throw new Error(`Portfolio not found with ID: ${id}`);
        } else if (error.message.includes('401') || error.message.includes('403')) {
          throw new Error('Not authorized to delete this portfolio');
        } else if (error.message.includes('SyntaxError')) {
          throw new Error(`Invalid portfolio ID format: ${id}. Please try refreshing the page.`);
        }
      }
      
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
  
  // Deployment functionality removed
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
      const response = await apiRequest('/templates');
      console.log('Templates API response:', response);
      
      // Extract the templates array from the response
      let templates = [];
      if (response && response.templates) {
        templates = response.templates;
      } else if (Array.isArray(response)) {
        templates = response;
      } else {
        console.warn('Unexpected templates API response format:', response);
        // Create mock templates for development
        templates = [
          { id: 1, name: 'Portfolio Template 1', description: 'A modern portfolio layout', isPublic: true },
          { id: 2, name: 'Resume Template', description: 'Professional resume layout', isPublic: true },
          { id: 3, name: 'Project Showcase', description: 'Template for showcasing projects', isPublic: true }
        ];
      }
      
      // Update cache
      templateCache = { templates, timestamp: now };
      return templates;
    } catch (error: unknown) {
      // If we have a cache but it's expired, still use it on error
      if (templateCache.templates) {
        console.warn('Failed to fetch fresh templates, using expired cache');
        return templateCache.templates;
      }

      // Log the error with more details
      console.error('Error fetching templates:', error instanceof Error ? error.message : String(error));
      
      // Return mock templates instead of empty array for better UX
      return [
        { id: 1, name: 'Portfolio Template 1', description: 'A modern portfolio layout', isPublic: true },
        { id: 2, name: 'Resume Template', description: 'Professional resume layout', isPublic: true },
        { id: 3, name: 'Project Showcase', description: 'Template for showcasing projects', isPublic: true }
      ];
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
