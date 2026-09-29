<template>
  <div class="demo-block">
    <div class="demo-block__source">
      <slot />
    </div>
    <details class="demo-block__detail">
      <summary>查看源码</summary>
      <div class="demo-block__highlight">
        <pre><code>{{ decodedSource }}</code></pre>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** URL 编码的 demo 源码 */
  source?: string
}>()

const decodedSource = computed(() =>
  props.source ? decodeURIComponent(props.source) : ''
)
</script>

<style scoped>
.demo-block {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider, #dcdfe6);
  border-radius: 8px;
  overflow: hidden;
}

.demo-block__source {
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.demo-block__detail {
  border-top: 1px solid var(--vp-c-divider, #dcdfe6);
  background: var(--vp-c-bg-soft, #f6f8fa);
}

.demo-block__detail summary {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-text-2, #606266);
  user-select: none;
}

.demo-block__detail summary:hover {
  color: var(--vc-color-primary, #409eff);
}

.demo-block__highlight {
  padding: 0 16px 16px;
}

.demo-block__highlight pre {
  margin: 0;
  padding: 12px;
  background: var(--vp-c-bg-alt, #282c34);
  border-radius: 4px;
  overflow: auto;
}

.demo-block__highlight code {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-1, #e2e8f0);
}
</style>
