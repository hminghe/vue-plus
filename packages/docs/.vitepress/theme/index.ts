import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { handleRedirects } from './redirects'

import './styles/main.css'
import './styles/demo.css'
import './styles/utils.css'
import './styles/vars.css'
import './styles/code.css'
import './styles/element-plus.css'
import 'uno.css'

import Demo from './components/Demo.vue'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: any) {
    ctx.app.use(ElementPlus, {
      locale: zhCn,
    })
    ctx.app.component('Demo', Demo)

    if (typeof window !== 'undefined') {
      handleRedirects(ctx.router)
    }
  },
}
