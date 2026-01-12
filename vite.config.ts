import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow access from network
    port: 3000,
    allowedHosts: [
      "gwfrontend.onrender.com",
      ".onrender.com", // Allow all Render subdomains
      "localhost",
    ],
    proxy: {
      "/api": {
        target: "https://gwbackend.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
