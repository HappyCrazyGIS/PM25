import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cesium({
      rebuildCesium: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 代理所有到 /amap 的请求到 https://restapi.amap.com
      '/amap': {
        target: 'https://restapi.amap.com', // 目标地址
        changeOrigin: true, // 必须设置为true，以便代理服务器发送请求时更改Origin头信息
        rewrite: (path) => path.replace(/^\/amap/, ''), // 将请求地址中的 /amap 替换为空，因为实际的API地址中不包含 /amap
        secure: false,
        xfwd: true
      }
    }
  }
})
