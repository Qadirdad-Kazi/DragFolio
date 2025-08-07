import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          // Remove strict Content-Security-Policy for development
          // Using a more permissive CSP for development
          const apiUrl = process.env.VITE_API_URL || `http://localhost:${process.env.PORT || '3001'}`;
          res.setHeader('Content-Security-Policy', 
            `default-src 'self'; ` +
            `script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://replit.com https://replit.com/public/js/replit-dev-banner.js; ` +
            `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ` +
            `img-src 'self' data: blob: https://images.unsplash.com; ` +
            `font-src 'self' data: https://fonts.gstatic.com; ` +
            `connect-src 'self' ws: wss: http: https: ${apiUrl} ${apiUrl}/api; ` +
            `frame-src 'self' https://replit.com;`
          );
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: [
        path.resolve(__dirname, '../AR-Web'),
        path.resolve(__dirname, '.')
      ]
    },
    proxy: {
      '/api': {
        // Auto-detect port by trying common backend ports
        configure: (proxy, options) => {
          const tryPorts = [3001, 3002, 3000, 8080, 4000, 5000];
          let foundPort = null;
          
          // Function to check if a port is available
          const checkPort = async (port) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 500);
              
              const response = await fetch(`http://localhost:${port}/health`, {
                signal: controller.signal
              }).catch(() => null);
              
              clearTimeout(timeoutId);
              return response && response.ok;
            } catch (e) {
              return false;
            }
          };
          
          // Try to find a working port on startup
          (async () => {
            for (const port of tryPorts) {
              if (await checkPort(port)) {
                console.log(`[Vite] Auto-detected backend server on port ${port}`);
                options.target = `http://localhost:${port}`;
                foundPort = port;
                break;
              }
            }
            
            if (!foundPort) {
              console.warn('[Vite] Could not auto-detect backend server port. Using default port 3001.');
              options.target = 'http://localhost:3001';
            }
          })();
        },
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Configure manual chunks for better code splitting
        manualChunks: {
          vendor: [
            'react', 
            'react-dom',
            '@mui/material',
            'react-dnd',
            'react-dnd-html5-backend',
            'jspdf'
          ],
        },
      },
    },
    // Generate source maps for better debugging
    sourcemap: true,
    // Optimize the build for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    // Ensure dynamic imports are properly handled
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  // Define environment variables for the build
  define: {
    'process.env': {},
  },
});
