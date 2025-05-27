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
          res.setHeader('Content-Security-Policy', 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: blob:; " +
            "font-src 'self' data:; " +
            "connect-src 'self' ws: wss: http: https:; " +
            "frame-src 'self';"
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
          const tryPorts = [3002, 3001, 3000, 8080, 4000, 5000];
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
              console.warn('[Vite] Could not auto-detect backend server port. Using default port 3002.');
              options.target = 'http://localhost:3002';
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
        // Ensure that inline scripts and styles are allowed in the build
        inlineDynamicImports: true,
      },
    },
  },
});
