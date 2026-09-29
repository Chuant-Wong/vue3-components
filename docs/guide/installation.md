# 安装

## 环境要求

- Node.js >= 18
- Vue ^3.5
- Element Plus ^2.14（组件库基于 Element Plus 二次封装，作为 peerDependency 由宿主应用提供）

## 包管理器安装

宿主应用需同时安装本组件库与 Element Plus：

::: code-group

```bash [pnpm]
pnpm add vue3-components element-plus
```

```bash [npm]
npm install vue3-components element-plus
```

```bash [yarn]
yarn add vue3-components element-plus
```

:::

## 浏览器直接引入（CDN）

暂不支持，请通过构建工具引入。

## 关于样式

组件库样式独立于组件（组件与样式分离）。由于内部基于 Element Plus 二次封装，宿主需同时引入 EP 样式与本库样式：

```ts
// Element Plus 基础样式（封装组件依赖）
import 'element-plus/dist/index.css'

// 本库样式：方式一，通过 @vc/theme-chalk
// pnpm add @vc/theme-chalk
import '@vc/theme-chalk/dist/index.css'

// 本库样式：方式二，直接使用主包内置副本
import 'vue3-components/dist/style.css'
```

如需按需引入以减小体积，宿主可使用 `unplugin-vue-components` + `ElementPlusResolver` 自动注入 EP 组件样式。

