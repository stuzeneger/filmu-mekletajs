import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // @ → src
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/filmu-mekletajs/public/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
  test: {
    globals: true,         // ļauj izmantot describe, it, expect bez import
    environment: 'jsdom',  // nepieciešams Vue komponentu renderēšanai
    include: ['tests/unit/**/*.test.ts'] // meklēt testus šajā mapē
  }
})
