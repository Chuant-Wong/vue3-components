# 快速开始

## 全量引入

对入口文件做如下修改，即可一次性引入全部组件与全量安装器：

```ts
import { createApp } from 'vue'
import Vue3Components from 'vue3-components'
import 'vue3-components/dist/style.css'
import App from './App.vue'

const app = createApp(App)

app.use(Vue3Components)
app.mount('#app')
```

## 按需引入（具名注册）

只注册需要的组件，获得更小的打包体积：

```ts
import { createApp } from 'vue'
import { VcButton } from 'vue3-components'
import 'vue3-components/dist/style.css'
import App from './App.vue'

const app = createApp(App)

app.use(VcButton)
app.mount('#app')
```

## 直接在 SFC 中导入（摇树友好）

```vue
<script setup lang="ts">
import { VcButton } from 'vue3-components'
</script>

<template>
  <vc-button type="primary">主要按钮</vc-button>
</template>
```

## 全局类型提示

组件库通过 `GlobalComponents` 模块增强提供了模板类型补全，`<vc-button>` 在任何 Vue SFC 中均可获得完整的 Props 类型提示，无需手动导入。
