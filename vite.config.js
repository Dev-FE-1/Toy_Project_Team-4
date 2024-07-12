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
      },
      '/upload-official-leave-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/get-official-leave-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/update-official-leave-status': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/delete-official-leave-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/upload-attendance-correction-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/get-attendance-correction-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/update-attendance-correction-status': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/delete-attendance-correction-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/upload-document-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/get-document-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/update-document-request-status': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/cancel-document-request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

