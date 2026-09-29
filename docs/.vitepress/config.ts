import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { demoPlugin } from './markdown/demo'

const root = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(root, '../../packages')

export default {
  title: 'Vue3 Components',
  description: '一个类 Element Plus 的 Vue 3 组件库',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/installation', activeMatch: '/guide/' },
      { text: '组件', link: '/components/button', activeMatch: '/components/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quickstart' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [{ text: 'Button 按钮', link: '/components/button' }],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/vue3-components' }],
  },
  vite: {
    resolve: {
      // alias 直连各包源码：文档站开发时组件源码改动即时 HMR（无需先构建）
      alias: {
        '@vc/utils': resolve(pkgRoot, 'utils/src/index.ts'),
        '@vc/hooks': resolve(pkgRoot, 'hooks/src/index.ts'),
        '@vc/components': resolve(pkgRoot, 'components/index.ts'),
      },
    },
  },
  markdown: {
    config(md) {
      md.use(demoPlugin)
    },
  },
}
