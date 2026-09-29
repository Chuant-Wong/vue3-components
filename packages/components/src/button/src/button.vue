<template>
  <button
    :class="[
      ns.b(),
      ns.m(props.type),
      ns.m(props.size),
      ns.is('plain', props.plain),
      ns.is('round', props.round),
      ns.is('circle', props.circle),
      ns.is('disabled', props.disabled),
      ns.is('loading', props.loading),
    ]"
    :type="props.nativeType"
    :disabled="props.disabled || props.loading"
    :autofocus="props.autofocus"
  >
    <svg
      v-if="props.loading"
      class="vc-button__loading-icon"
      viewBox="0 0 1024 1024"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M512 64a448 448 0 1 0 448 448 384 384 0 0 1-448-448z"
        opacity=".3"
      />
      <path d="M512 64a448 448 0 0 1 448 448 384 384 0 0 0-448-448z" />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { useNamespace } from '@vc/hooks'
import type { ButtonProps } from '../button'

defineOptions({ name: 'VcButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'default',
  plain: false,
  round: false,
  circle: false,
  disabled: false,
  loading: false,
  nativeType: 'button',
  autofocus: false,
})

const ns = useNamespace('button')
</script>
