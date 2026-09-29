import type { App } from 'vue'
import VcButton from './src/button'

/** 全部组件清单：新增组件在此登记 */
export const components = [VcButton] as const

/**
 * 全量安装器
 * @example app.use(Vue3Components)
 */
export const installer = (app: App) => {
  components.forEach((c) => app.use(c))
}
