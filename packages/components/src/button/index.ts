import { withInstall } from '@vc/utils'
import Button from './src/button.vue'

/** 带 install 的 Button 组件，支持 app.use(VcButton) 或 app.use() 时全量注册 */
export const VcButton = withInstall(Button)
export default VcButton

export * from './button'
