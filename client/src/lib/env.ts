// Environment variables with fallbacks
export const env = {
  REACT_APP_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  NODE_ENV: import.meta.env.MODE || 'development',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
};
