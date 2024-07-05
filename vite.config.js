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
      } // 추가된 부분
    }
  }
})

