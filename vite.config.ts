import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Force deployment: 2025-01-06 19:30:00 UTC
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
