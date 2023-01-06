import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform.js'

export default defineConfig(() => {
  return {
    plugins: [
      MarkdownTransform(),

      vueJsx(),

      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: './.vitepress/auto-imports.d.ts',
      }),

      Components({
        resolvers: [
          ElementPlusResolver(),
        ],
        include: [/\.vue$/, /\.vue\?vue/, /\.jsx$/],
        dts: './.vitepress/components.d.ts',
      }),

      UnoCSS(),
    ],

  }
})
