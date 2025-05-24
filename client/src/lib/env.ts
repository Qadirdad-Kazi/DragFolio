// Environment variables with fallbacks
export const env = {
  REACT_APP_API_URL: 'http://localhost:3001/api', // Hardcoded to ensure consistency
  NODE_ENV: import.meta.env.MODE || 'development',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
};

console.log('Environment configuration loaded:', env);
