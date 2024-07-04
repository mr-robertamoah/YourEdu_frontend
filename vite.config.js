import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
      preprocessorOptions: {
          scss: {
              additionalData: `
                  @use "sass:math";
                  @import "./src/sass/_variables.scss";
                  @import "./src/sass/app.scss";
              `
          }
      }
  },
  assetsInclude: [
    '**/*.mkv'
  ]
})
