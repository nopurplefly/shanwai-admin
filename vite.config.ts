import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import {visualizer} from 'rollup-plugin-visualizer'
export default defineConfig(({mode})=>({
  plugins: [vue(),
    // 自动 import ElMessage / ElLoading 这类"函数式" API
    AutoImport({ resolvers: [ElementPlusResolver()], imports: ['vue'] }),
    // 模板里用到哪个 el-xxx 就自动引入组件 + 对应 CSS
    Components({ resolvers: [ElementPlusResolver()] }),
    mode === 'analyze'?
    visualizer({
      filename:'dist/stats.html',
      gzipSize:true,
      brotliSize:true,
      template:'treemap'
    }):null,
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:10086',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}))
