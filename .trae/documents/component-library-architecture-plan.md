# vue3-components 组件库架构实现计划

> 目标：Vue 3 组件库，采用 **pnpm monorepo + Vite Lib 模式构建**，首期包含核心架构、Button 示例组件、VitePress 文档站。

---

## 一、Summary

- **monorepo 分包**：`utils`（工具）、`hooks`（组合式函数）、`theme-chalk`（SCSS 主题）、`components`（组件主包）、`docs`（文档站）
- **Element Plus 核心模式**：`withInstall` 安装器、`useNamespace` BEM 命名 hook、SCSS BEM mixins、CSS 变量主题、组件/样式分离
- **构建**：Vite Library 模式产出 ES/CJS + `vite-plugin-dts` 类型；SCSS 用 node 脚本编译
- **文档**：VitePress + 自定义 `:::demo` 容器（仿 Element Plus 文档体验，源码 alias 直连组件源码实现 HMR）

## 二、Current State Analysis

- 约束：Windows + PowerShell 环境；用户编码规范：单引号、2 空格缩进、JSDoc 注释

## 三、架构总览

```
vue3-components/
├── package.json                    # 根工作区：统一 scripts
├── pnpm-workspace.yaml
├── .npmrc
├── .gitignore
├── tsconfig.json                   # 单一根 tsconfig（供 IDE / vue-tsc / dts 使用）
├── packages/
│   ├── utils/                      # @vc/utils：纯 TS 工具（withInstall、类型工具）
│   ├── hooks/                      # @vc/hooks：useNamespace 等（依赖 vue）
│   ├── theme-chalk/                # @vc/theme-chalk：SCSS 主题（BEM mixins + CSS 变量）
│   └── components/                 # vue3-components：主包，Button 示例组件
└── docs/                           # VitePress 文档站（alias 直连源码）
```

**依赖方向**：`components` → `hooks` → `utils`；`theme-chalk` 独立（纯样式，被 docs 引用）；`docs` → `components` + `theme-chalk`。

**命名约定**：
- npm scope：`@vc/*`；主发布包名：`vue3-components`
- CSS 前缀：`vc-`（如 `vc-button`），与 `useNamespace` 和 SCSS `$namespace: 'vc'` 保持一致

## 四、Proposed Changes

### 4.1 工程根

**`package.json`**
```json
{
  "name": "vue3-components-root",
  "private": true,
  "type": "module",
  "engines": { "node": ">=18" },
  "scripts": {
    "dev": "pnpm -C docs dev",
    "docs:build": "pnpm -C docs build",
    "docs:preview": "pnpm -C docs preview",
    "build": "pnpm -r --filter='./packages/*' build",
    "clean": "pnpm -r --filter='./packages/*' exec rimraf dist"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "latest",
    "typescript": "~5.6.0",
    "vite": "^7.0.0",
    "vue": "^3.5.0",
    "vue-tsc": "latest"
  }
}
```
> 根只装共享工具链；各包装自己的构建依赖。版本执行时以 `pnpm add` 实际解析为准（vite 7 / plugin-vue 6 / vitepress 2.x 若不兼容则回退 vite 6 / vitepress 1.x，以 `pnpm docs:dev` 能启动为准）。

**`pnpm-workspace.yaml`**
```yaml
packages:
  - packages/*
  - docs
```

**`.npmrc`**
```
strict-peer-dependencies=false
auto-install-peers=true
```

**`.gitignore`**：`node_modules/`、`dist/`、`docs/.vitepress/dist/`、`docs/.vitepress/cache/`、`*.local`、`.DS_Store`

**`tsconfig.json`**（单一根配置，include 全部源码供 IDE 与 dts 使用）
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "baseUrl": ".",
    "paths": {
      "@vc/utils": ["packages/utils/src/index.ts"],
      "@vc/hooks": ["packages/hooks/src/index.ts"],
      "@vc/components": ["packages/components/index.ts"],
      "@vc/components/*": ["packages/components/*"],
      "@vc/theme-chalk": ["packages/theme-chalk/src/index.scss"]
    }
  },
  "include": [
    "packages/*/src/**/*.ts",
    "packages/*/src/**/*.vue",
    "packages/*/index.ts",
    "docs/.vitepress/**/*.ts",
    "docs/.vitepress/**/*.vue"
  ]
}
```

---

### 4.2 packages/utils（@vc/utils）

**`packages/utils/package.json`**
- `name: "@vc/utils"`，`version: 0.0.1`，`type: module`
- `main/module/types/exports` 指向 `dist/es.js` / `dist/index.d.ts`
- `scripts.build: "vite build"`；`devDependencies: vite`
- `files: ["dist"]`

**`packages/utils/vite.config.ts`**
```ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: { entry: 'src/index.ts', name: 'VcUtils', formats: ['es'] },
    // 无外部依赖，无需 external
  },
})
```
> utils 纯 TS 无 vue 依赖，不需要 dts 插件（用 vue-tsc 单独产出太重，首期 dts 统一由主包 vite-plugin-dts 生成——见 4.5 决策 D4）。

**`packages/utils/src/vue/install.ts`** — 核心安装器
```ts
import type { App, Component, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

/**
 * 为组件附加 install 方法，支持 app.use() 全量注册与具名引入
 */
export const withInstall = <T extends Component>(comp: T): SFCWithInstall<T> => {
  (comp as SFCWithInstall<T>).install = (app: App) => {
    app.component(comp.name as string, comp)
  }
  return comp as SFCWithInstall<T>
}
```

**`packages/utils/src/index.ts`** — 导出 `withInstall`、`SFCWithInstall` 类型

---

### 4.3 packages/hooks（@vc/hooks）

**`packages/hooks/package.json`**：同 utils 模式；`peerDependencies: { vue: "^3.5.0" }`；依赖 `@vc/utils: "workspace:*"`

**`packages/hooks/vite.config.ts`**：lib 模式 `formats: ['es']`，`rollupOptions.external: ['vue', '@vc/utils']`

**`packages/hooks/src/use-namespace/index.ts`** — BEM 命名核心（仿 element-plus 简化版）
```ts
import { computed, unref } from 'vue'

export const defaultNamespace = 'vc'
const statePrefix = 'is-'

const _bem = (namespace: string, block: string, blockSuffix?: string, element?: string, modifier?: string) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) cls += `-${blockSuffix}`
  if (element) cls += `__${element}`
  if (modifier) cls += `--${modifier}`
  return cls
}

export const useNamespace = (block: string) => {
  const namespace = defaultNamespace
  const b = () => _bem(namespace, block)
  const e = (element: string) => (element ? _bem(namespace, block, undefined, element) : '')
  const m = (modifier: string) => (modifier ? _bem(namespace, block, undefined, undefined, modifier) : '')
  const em = (element: string, modifier: string) => (element && modifier ? _bem(namespace, block, undefined, element, modifier) : '')
  const is = (name: string, state?: boolean | unknown) => (name && state === undefined || state ? `${statePrefix}${name}` : '')
  // cssVar: 生成组件级 CSS 变量对象
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) styles[`--${namespace}-${key}`] = object[key]
    return styles
  }
  return { namespace, b, e, m, em, is, cssVar }
}
```
> 保留 element-plus 的 API 形状（b/e/m/em/is/cssVar），后续组件全部基于它生成 class。

**`packages/hooks/src/index.ts`** — 导出 `useNamespace`

---

### 4.4 packages/theme-chalk（@vc/theme-chalk）

**`packages/theme-chalk/package.json`**
- `name: "@vc/theme-chalk"`，`exports`：`{ ".": { "import": "./src/index.scss" }, "./*": "./*" }`（源码直接暴露 scss，供构建与文档 alias 引用）
- `scripts.build: "node scripts/build-css.mjs"`
- `devDependencies: { sass: "^1.80.0" }`
- `files: ["dist", "src"]`

**目录与文件**：
```
src/
├── common/var.scss        # 全局 CSS 变量（:root）
├── mixins/config.scss     # $namespace 与 BEM mixin 声明
├── mixins/mixins.scss     # b/e/m/when mixin 实现
├── button.scss            # Button 组件样式
├── base.scss              # reset/基础样式
└── index.scss             # 全量引入入口（@use 各组件）
scripts/build-css.mjs      # sass 编译脚本
```

**`src/mixins/config.scss`**
```scss
@use 'sass:map';
@use './mixins.scss' as *;

$namespace: 'vc' !default;
```

**`src/mixins/mixins.scss`** — BEM mixin（与 useNamespace 输出严格对应）
```scss
@use 'sass:map';
@use './config.scss' as *;

@mixin b($block) {
  .#{$namespace}-#{$block} { @content; }
}
@mixin e($element) {
  &__#{$element} { @content; }
}
@mixin m($modifier) {
  &--#{$modifier} { @content; }
}
@mixin when($state) {
  &.is-#{$state} { @content; }
}
```
> 注意循环引用：`config.scss` 引 `mixins.scss`，`mixins.scss` 引 `config.scss` —— element-plus 用 `forward` 解决。实现时用 `@forward './config.scss' show $namespace;` 放在 mixins.scss，config 不反向引用，业务文件只需 `@use '../mixins/config.scss' as *;` 即可同时拿到 mixin 与变量。**执行时按此方式处理，避免循环 @use 报错。**

**`src/common/var.scss`** — CSS 变量主题（element-plus 核心设计）
```scss
:root {
  --vc-color-primary: #409eff;
  --vc-color-success: #67c23a;
  --vc-color-warning: #e6a23c;
  --vc-color-danger: #f56c6c;
  --vc-color-error: #f56c6c;
  --vc-color-info: #909399;
  --vc-text-color-primary: #303133;
  --vc-text-color-regular: #606266;
  --vc-border-color: #dcdfe6;
  --vc-fill-color-blank: #ffffff;
  --vc-border-radius-base: 4px;
  --vc-border-radius-round: 20px;
  --vc-button-font-size: 14px;
  // size 体系（供 size mixin 使用）
  --vc-component-size-large: 40px;
  --vc-component-size-default: 32px;
  --vc-component-size-small: 24px;
}
```

**`src/button.scss`** — 使用 BEM mixin + CSS 变量实现：默认/朴素(plain)/圆角(round)/圆形(circle)/disabled/loading 状态、type（primary/success/warning/danger/info/default）× size（large/default/small）矩阵。以 CSS 变量做主题色映射（如 `.vc-button--primary { --vc-button-bg-color: var(--vc-color-primary); ... }`）。

**`src/index.scss`**
```scss
@use './common/var.scss' as *;
@use './base.scss';
@use './button.scss';
```

**`scripts/build-css.mjs`** — 遍历 `src/*.scss`，用 sass modern API（`sass.compile`）逐个编译到 `dist/`（`index.css`、`button.css`…），`import` 路径改为 `dist/xxx.css`（第一期组件少，直接编译全量 + 每组件两份即可，约 40 行脚本）。

---

### 4.5 packages/components（vue3-components 主包）

**`packages/components/package.json`**
- `name: "vue3-components"`，`version: 0.0.1`，`type: module`
- `main: dist/vue3-components.es.js`，`module: dist/vue3-components.es.js`，`types: dist/index.d.ts`
- `exports`：`{ ".": { "import": "./dist/vue3-components.es.js", "require": "./dist/vue3-components.cjs.js" }, "./dist/style.css": "./dist/style.css" }`
- `files: ["dist"]`
- `peerDependencies: { vue: "^3.5.0" }`
- `dependencies: { "@vc/hooks": "workspace:*", "@vc/utils": "workspace:*" }`
- `scripts.build: "vite build"`

**`packages/components/vite.config.ts`**
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: '.',
      include: ['index.ts', 'component.ts', 'global.d.ts', 'src/**/*.ts', 'src/**/*.vue',
                '../utils/src/**/*.ts', '../hooks/src/**/*.ts'],  // 跨包类型一并产出
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: 'index.ts',
      name: 'Vue3Components',
      formats: ['es', 'cjs'],
      fileName: (format) => `vue3-components.${format === 'es' ? 'es' : 'cjs'}.js`,
    },
    rollupOptions: {
      external: ['vue', '@vc/utils', '@vc/hooks'],
      output: { globals: { vue: 'Vue' } },
    },
  },
})
```
> **决策 D4（dts 策略）**：utils/hooks 首期不产出独立 d.ts，主包构建时用 vite-plugin-dts 的 `include` 把两包源码类型一并编入 `dist`，用户只需装 `vue3-components` 一个包。

**`packages/components/index.ts`** — 总入口
```ts
import { installer } from './component'
import Button from './src/button'

export * from '@vc/utils'
export * from '@vc/hooks'
export { Button }
export default installer   // app.use(Vue3Components)
```

**`packages/components/component.ts`** — 组件清单 + installer（element-plus 模式）
```ts
import type { App, Plugin } from 'vue'
import Button from './src/button'

const components = [Button]

const installer = (app: App) => {
  components.forEach((c) => app.use(c))
}

export default {
  install: installer,
  version: '0.0.1',
} as Plugin  // 执行时改为带类型的 installer 对象，export { installer }
```

**`packages/components/global.d.ts`** — 全局类型增强（模板补全）
```ts
import type { Button } from './index'
declare module 'vue' {
  export interface GlobalComponents {
    VcButton: typeof Button
  }
}
export {}
```

**`packages/components/src/button/index.ts`**
```ts
import { withInstall } from '@vc/utils'
import Button from './src/button.vue'

export const VcButton = withInstall(Button)
export default VcButton
```

**`packages/components/src/button/src/button.vue`** — 示例组件（完整实现）
- Props（`withDefaults(defineProps<ButtonProps>())`）：`type?: 'primary'|'success'|'warning'|'danger'|'info'`（default: `'default'`）、`size?: 'large'|'default'|'small'`、`plain/round/circle/disabled/loading?: boolean`、`nativeType?: 'button'|'submit'|'reset'`（default `'button'`）、`autofocus?: boolean`
- 用 `useNamespace('button')` 生成 class：`ns.b()`、`ns.m(type)`、`ns.m(size)`、`ns.is('disabled', disabled)`、`ns.is('loading', loading)`
- loading 时渲染内置 svg spinner + `ns.is('loading')`
- 透传 attrs（`inheritAttrs: false` 不需要，原生属性直接落到 button 标签）；disabled/loading 时阻止 click（loading 时 `disabled`）
- `<slot />` 内容，`defineExpose` 不需要
- **不引入样式**（组件与样式分离，Element Plus 模式）

---

### 4.6 docs（VitePress 文档站）

**`docs/package.json`**
- `name: "@vc/docs"`，`private: true`
- `dependencies: { "vue3-components": "workspace:*", "@vc/theme-chalk": "workspace:*", "@vc/hooks": "workspace:*", "@vc/utils": "workspace:*", "vue": "^3.5.0" }`
- `devDependencies: { vitepress: "latest", vite: "^7.0.0", "@vitejs/plugin-vue": "latest" }`
- `scripts: { dev: "vitepress dev", build: "vitepress build", preview: "vitepress preview" }`

**`docs/.vitepress/config.ts`** — 核心是 **alias 直连源码实现 HMR**
```ts
import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

export default defineConfig({
  title: 'Vue3 Components',
  description: '一个类 Element Plus 的 Vue 3 组件库',
  themeConfig: {
    nav: [{ text: '指南', link: '/guide/installation' }, { text: '组件', link: '/components/button' }],
    sidebar: {
      '/guide/': [{ text: '指南', items: [{ text: '安装', link: '/guide/installation' }, { text: '快速开始', link: '/guide/quickstart' }] }],
      '/components/': [{ text: '基础组件', items: [{ text: 'Button 按钮', link: '/components/button' }] }],
    },
  },
  vite: {
    resolve: {
      alias: {
        '@vc/utils': resolve(__dirname, '../../packages/utils/src/index.ts'),
        '@vc/hooks': resolve(__dirname, '../../packages/hooks/src/index.ts'),
        '@vc/components': resolve(__dirname, '../../packages/components/index.ts'),
        // 主题 scss 走源码
      },
    },
  },
  // markdown: { config: (md) => { md.use(demoContainerPlugin) } } —— demo 容器见下
})
```

**`docs/.vitepress/theme/index.ts`** — 主题入口
```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Vue3Components from '@vc/components'   // alias → 源码，开发时 HMR
import '@vc/theme-chalk'                      // 全量 scss（theme-chalk exports 指向 src/index.scss）
import DemoBlock from './DemoBlock.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(Vue3Components)
    app.component('DemoBlock', DemoBlock)
  },
} satisfies Theme
```
> `@vc/theme-chalk` 指向 scss 源码时，vitepress（内置 vite + sass 需 `docs` 安装 sass）直接编译，无需先构建。

**`docs/.vitepress/theme/DemoBlock.vue`** — demo 容器组件
- Props：`title?: string`
- 结构：示例区（边框内边距）+ 源码区（`<details>` 折叠 + `<slot name="code"/>`）
- 样式内联 scoped，仿 element-plus 文档观感

**`docs/.vitepress/markdown/demo.ts`** — `:::demo` 容器插件（markdown-it，VitePress 官方推荐的 demo container 模式）
- 用 `md.use(container, 'demo', ...)` 解析 `:::demo` 块
- 块内 ```` ```vue ```` 代码经 vitepress 内置模板编译注册为匿名组件：在 markdown-it render 阶段输出 `<DemoBlock><template #default><DemoX/></template><template #code>源码</template></DemoBlock>`
- 实现方式（VitePress 官方 advanced 指南模式）：拦截 fence 渲染，将 demo 块内代码存入全局 map，输出占位组件标记；在 `theme/index.ts` 无需感知
- **简化实现**：若编译注册动态组件链路过长，退化方案为——md 中直接写模板 + `<DemoBlock>` 包裹（VitePress 原生支持 md 内 Vue 模板），源码用 ```html 代码块手动呈现。执行时优先实现插件版，若 1 次尝试未成则立即切退化方案（**不反复调试**）。

**文档内容**：
- `docs/index.md` — VitePress 首页（hero + features，含一个 `<vc-button>` 演示）
- `docs/guide/installation.md` — npm/pnpm/yarn 安装说明
- `docs/guide/quickstart.md` — 全量引入（`app.use` + `import 'vue3-components/dist/style.css'`）与按需引入说明
- `docs/components/button.md` — 基础用法/不同类型/朴素/尺寸/禁用/加载 6 组 `:::demo` 示例 + Attributes API 表格

---

## 五、Assumptions & Decisions

| # | 决策 | 理由 |
|---|------|------|
| D1 | pnpm monorepo，5 个包 | 用户确认；Element Plus 官方模式 |
| D2 | Vite Lib 模式（es + cjs bundle） | 用户确认；按需引入首期通过 exports 字段预留，后续演进 preserveModules |
| D3 | CSS 前缀 `vc-`，scope `@vc/*` | 库名 vue3-components 缩写；三方统一（hook/mixin/文档） |
| D4 | utils/hooks 不单独产 d.ts，主包 dts 一并产出 | 减少构建链复杂度；用户只装主包 |
| D5 | 组件与样式分离（组件不 import scss） | Element Plus 模式；支持样式按需与主题替换 |
| D6 | theme-chalk 用 node 脚本 + sass API 构建 | Vite lib 模式不支持 scss 多入口到 css；脚本仅 ~40 行 |
| D7 | docs 通过 alias 直连各包源码 | 开发时改组件源码文档站 HMR，无需先 build |
| D8 | `:::demo` 容器优先插件实现，备选退化方案 | Element Plus 文档核心体验；控制实现风险 |
| D9 | 不含单元测试、不含独立 playground | 用户未选择；VitePress 承担调试职责 |
| D10 | 依赖版本以执行时 `pnpm add` 解析为准（vite 7 优先，不兼容回退 vite 6） | 2026-09 时间点下保证工具链真实可用 |

## 六、Implementation Order

1. **工程根**：`pnpm-workspace.yaml`、根 `package.json`、`.npmrc`、`.gitignore`、`tsconfig.json`，`pnpm install`
2. **utils**：package.json → vite.config.ts → `withInstall` → install 校验（`pnpm -C packages/utils build`）
3. **hooks**：package.json → vite.config.ts → `useNamespace`
4. **theme-chalk**：mixins → var.scss → button.scss → index.scss → build-css.mjs（校验产物 css 生成）
5. **components**：Button 组件 → component.ts / index.ts / global.d.ts → vite build（校验 es/cjs/d.ts 产物）
6. **docs**：package.json → vitepress config（含 alias）→ theme → DemoBlock + demo 插件 → index/guide/button 文档
7. **端到端验证**（见下）

## 七、Verification

1. `pnpm -r --filter='./packages/*' build` 全部成功，检查产物：
   - `packages/components/dist/`：`vue3-components.es.js`、`vue3-components.cjs.js`、`index.d.ts`、`style.css`（若无 style.css 则确认 theme-chalk/dist 产出）
   - `packages/theme-chalk/dist/`：`index.css`、`button.css`
2. `pnpm dev` 启动文档站：
   - 首页渲染正常，hero 演示按钮可用
   - `/components/button` 页 6 组 demo 渲染正常、BEM class 正确（DevTools 检查 `.vc-button.vc-button--primary.is-disabled` 等）
   - 修改 `button.vue` 源码 → 文档站热更新（验证 D7）
3. 全量引入验证：文档站控制台无告警，`app.use(Vue3Components)` 后模板中 `<vc-button>` 有类型补全（`GlobalComponents` 生效）
4. CSS 变量验证：DevTools 修改 `--vc-color-primary`，按钮主题色实时变化（验证 D5 主题体系）
