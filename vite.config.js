import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/convert': {  
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/upload-vacation-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/get-vacation-request': { 
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/update-vacation-status': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/delete-vacation-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/upload-leave-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/get-leave-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/update-leave-status': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/delete-leave-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

