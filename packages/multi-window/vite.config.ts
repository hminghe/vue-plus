import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@vue-plus/multi-window': `${path.resolve(__dirname, 'src')}`,
    },
  },

  build: {
    // lib: {
    //   entry: path.resolve(__dirname, 'src/index.ts'),
    //   name: 'index',
    // },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', '@vueuse/core', 'pinia', 'vue-router'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'vue': 'Vue',
          '@vueuse/core': 'VueUse',
          'vue-router': 'VueRouter',
          'pinia': 'Pinia',
        },
      },
    },
  },
})
