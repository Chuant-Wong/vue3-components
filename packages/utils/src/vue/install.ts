import type { App, Component, Plugin } from 'vue'

/** 带安装器的组件类型 */
export type SFCWithInstall<T> = T & Plugin

/**
 * 为组件附加 install 方法，支持 app.use() 全量注册与具名引入
 * @param comp 组件对象（需已通过 defineOptions 声明 name）
 */
export const withInstall = <T extends Component>(comp: T): SFCWithInstall<T> => {
  (comp as SFCWithInstall<T>).install = (app: App) => {
    app.component(comp.name as string, comp as Component)
  }
  return comp as SFCWithInstall<T>
}
