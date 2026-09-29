export const buttonTypes = [
  'primary',
  'success',
  'warning',
  'danger',
  'info',
  'default',
] as const

export const buttonSizes = ['large', 'default', 'small'] as const

export type ButtonType = (typeof buttonTypes)[number]
export type ButtonSize = (typeof buttonSizes)[number]

export interface ButtonProps {
  /** 按钮类型 */
  type?: ButtonType
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 是否朴素按钮 */
  plain?: boolean
  /** 是否圆角按钮 */
  round?: boolean
  /** 是否圆形按钮 */
  circle?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中（加载中自动阻止点击） */
  loading?: boolean
  /** 原生 type 属性 */
  nativeType?: 'button' | 'submit' | 'reset'
  /** 原生 autofocus 属性 */
  autofocus?: boolean
}
