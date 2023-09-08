import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'import.meta.env.VITE_BACKEND_BASE_URL': JSON.stringify('https://amiya-bot-service.hsyhhssyy.net'),
  },
})
