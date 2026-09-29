import type { VcButton } from './src/button'

declare module 'vue' {
  export interface GlobalComponents {
    VcButton: typeof VcButton
  }
}

export {}
