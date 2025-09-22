import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  optimizeDeps: {
    include: ['@vue/devtools-api', 'vue-demi', 'pinia']
  },
  build: {
    target: 'es6',
    cssCodeSplit: false
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  }
})
