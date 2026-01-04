import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // IMPORTANT: For GitHub Pages deployment
  base: '/estate-agent-app/',
  
  // Build configuration for production
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for smaller bundle
    rollupOptions: {
      output: {
        // Code splitting for better performance
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['react-widgets', 'react-datepicker', 'react-tabs'],
          'icons-vendor': ['react-icons']
        }
      }
    },
    // Enable minification for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true, // Open browser automatically
    host: true // Allow access from other devices on network
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    host: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-widgets', 'react-datepicker', 'react-tabs', 'react-icons', 'dompurify']
  }
})