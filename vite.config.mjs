import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import fs from 'fs';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  base: '/',
  publicDir: 'public',    // 指定静态资源目录
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      }
    }
  },
  server: {
    https: {
      key: fs.readFileSync('./src/assets/key/key.pem'),
      cert: fs.readFileSync('./src/assets/key/cert.pem'),
    },
    host: '0.0.0.0', // 或 host: '0.0.0.0'
    port: 5173,
    disableHostCheck: true,
    headers: {
      // 允许所有来源的 CORS 请求
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      // 开发环境下最宽松的 CSP 配置
      'Content-Security-Policy': `
         default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
         img-src * data: blob: 'unsafe-inline';
         connect-src * 'unsafe-inline';
         script-src * 'unsafe-inline' 'unsafe-eval';
         style-src * 'unsafe-inline';
         font-src * data:;
         frame-src *;
       `.replace(/\s+/g, ' ').trim(),
      // 禁用缓存，确保始终获取最新资源
      'Cache-Control': 'no-store',
    }
  }
})