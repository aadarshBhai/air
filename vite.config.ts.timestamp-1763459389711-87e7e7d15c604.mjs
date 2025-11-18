// vite.config.ts
import { defineConfig } from "file:///C:/Users/aadar/Downloads/air/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/aadar/Downloads/air/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/aadar/Downloads/air/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\aadar\\Downloads\\air";
var vite_config_default = defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    plugins: [react(), isDev && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    server: {
      host: "::",
      port: 8080,
      proxy: isDev ? {
        // Proxy API requests to the backend server
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false
        }
      } : void 0
    },
    define: {
      // Make environment variables available at build time
      "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL || "http://localhost:5000")
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhYWRhclxcXFxEb3dubG9hZHNcXFxcYWlyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhYWRhclxcXFxEb3dubG9hZHNcXFxcYWlyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hYWRhci9Eb3dubG9hZHMvYWlyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGlzRGV2ID0gbW9kZSA9PT0gJ2RldmVsb3BtZW50JztcbiAgXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW3JlYWN0KCksIGlzRGV2ICYmIGNvbXBvbmVudFRhZ2dlcigpXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiBcIjo6XCIsXG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgcHJveHk6IGlzRGV2ID8ge1xuICAgICAgICAvLyBQcm94eSBBUEkgcmVxdWVzdHMgdG8gdGhlIGJhY2tlbmQgc2VydmVyXG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIH1cbiAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIC8vIE1ha2UgZW52aXJvbm1lbnQgdmFyaWFibGVzIGF2YWlsYWJsZSBhdCBidWlsZCB0aW1lXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX1VSTCc6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LlZJVEVfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDo1MDAwJyksXG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUixTQUFTLG9CQUFvQjtBQUM3UyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sUUFBUSxTQUFTO0FBRXZCLFNBQU87QUFBQSxJQUNMLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sT0FBTztBQUFBLElBQzdELFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE9BQU8sUUFBUTtBQUFBO0FBQUEsUUFFYixRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxRQUFRO0FBQUEsUUFDVjtBQUFBLE1BQ0YsSUFBSTtBQUFBLElBQ047QUFBQSxJQUNBLFFBQVE7QUFBQTtBQUFBLE1BRU4sZ0NBQWdDLEtBQUssVUFBVSxRQUFRLElBQUksZ0JBQWdCLHVCQUF1QjtBQUFBLElBQ3BHO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
