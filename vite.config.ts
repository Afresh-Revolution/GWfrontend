import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
// @ts-expect-error: The @tailwindcss/vite module may not provide types, but plugin is required.
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
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
        target: process.env.VITE_API_URL || "https://gwbackend.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
})
