import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    plugins: [react(), isDev && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "::",
      port: 8080,
      proxy: isDev ? {
        // Proxy API requests to the backend server
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      } : undefined,
    },
    define: {
      // Make environment variables available at build time
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://your-backend-url.onrender.com'),
    },
  };
});
