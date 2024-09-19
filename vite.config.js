import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 关键代码

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      // 选项写法
      '/mapServer': {
        target: 'http://127.0.0.1:701/mapServer',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mapServer/, '')
      },
      '/geoserver': {
        target: 'http://49.64.169.155:8089/geoserver',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geoserver/, '')
      },
      '/geo49': {
        target: 'http://49.64.169.155:8091/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geo49/, '')
      },
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
