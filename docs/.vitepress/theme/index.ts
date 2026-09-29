import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
// alias 直连源码：packages/components/index.ts，改动组件即时 HMR
import Vue3Components from '@vc/components'
// theme-chalk exports 指向 src/index.scss，由 vite 直接编译源码样式
import '@vc/theme-chalk'
import DemoBlock from './DemoBlock.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(Vue3Components)
    app.component('DemoBlock', DemoBlock)
  },
} satisfies Theme
