export const defaultNamespace = 'vc'

const statePrefix = 'is-'

/**
 * BEM class 拼接
 * @example _bem('vc', 'button', undefined, 'label', 'large') => 'vc-button__label--large'
 */
const _bem = (
  namespace: string,
  block: string,
  blockSuffix?: string,
  element?: string,
  modifier?: string
) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) cls += `-${blockSuffix}`
  if (element) cls += `__${element}`
  if (modifier) cls += `--${modifier}`
  return cls
}

/**
 * 生成 BEM 命名空间工具（与 theme-chalk 的 SCSS mixins 严格对应）
 * @example ns.b() // 'vc-button'
 * @example ns.m('primary') // 'vc-button--primary'
 * @example ns.is('disabled', true) // 'is-disabled'
 * @param block 组件块名，如 'button'
 */
export const useNamespace = (block: string) => {
  const namespace = defaultNamespace

  /** 块：vc-button */
  const b = () => _bem(namespace, block)

  /** 元素：vc-button__label */
  const e = (element: string) =>
    element ? _bem(namespace, block, undefined, element) : ''

  /** 修饰符：vc-button--primary */
  const m = (modifier: string) =>
    modifier ? _bem(namespace, block, undefined, undefined, modifier) : ''

  /** 元素+修饰符：vc-button__label--large */
  const em = (element: string, modifier: string) =>
    element && modifier
      ? _bem(namespace, block, undefined, element, modifier)
      : ''

  /** 状态：is-disabled */
  const is = (name: string, state?: boolean | unknown) =>
    (name && state === undefined) || state
      ? `${statePrefix}${name}`
      : ''

  /** 生成组件级 CSS 变量样式对象 */
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      styles[`--${namespace}-${key}`] = object[key]
    }
    return styles
  }

  return { namespace, b, e, m, em, is, cssVar }
}
