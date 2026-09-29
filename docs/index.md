---
layout: home

hero:
  name: Vue3 Components
  text: 类 Element Plus 的 Vue 3 组件库
  tagline: BEM 命名 / CSS 变量主题 / TypeScript / Vite Lib 构建
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 组件
      link: /components/button

features:
  - title: Element Plus 架构模式
    details: withInstall 安装器、useNamespace BEM hook、SCSS BEM mixins、组件样式分离
  - title: CSS 变量主题
    details: 基于 --vc-* 设计令牌的主题体系，一行变量实现全局换肤
  - title: pnpm monorepo
    details: utils / hooks / theme-chalk / components 分包管理，职责清晰
  - title: Vite Lib 构建
    details: ES Module + CommonJS 产物，vite-plugin-dts 类型一体产出
---

<style>
.home-hero-demo {
  padding: 24px 0;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>

<div class="home-hero-demo">
  <vc-button>默认按钮</vc-button>
  <vc-button type="primary">主要按钮</vc-button>
  <vc-button type="success" round>成功按钮</vc-button>
</div>
