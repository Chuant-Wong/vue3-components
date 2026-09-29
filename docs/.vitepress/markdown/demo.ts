import type MarkdownIt from 'markdown-it'
import type Renderer from 'markdown-it/lib/renderer'

/**
 * demo 容器插件：拦截 ```demo 代码块
 * 块内模板既作为 DemoBlock 的运行示例（Vue 编译执行），又通过 source 属性传入用于源码展示
 */
export function demoPlugin(md: MarkdownIt): void {
  const defaultFence =
    md.renderer.rules.fence ||
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options))

  const fence: Renderer.RenderRule = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (token.info.trim() !== 'demo') {
      return defaultFence(tokens, idx, options, env, self)
    }

    const source = token.content
    const encoded = encodeURIComponent(source)

    // 块内模板直接输出为 demo-block 的默认插槽内容，由 Vue 编译运行
    return `<demo-block source="${encoded}">${source}</demo-block>`
  }

  md.renderer.rules.fence = fence
}
