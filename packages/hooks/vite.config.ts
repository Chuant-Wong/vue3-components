import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VcHooks',
      formats: ['es'],
      fileName: () => 'vc-hooks.es.js',
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
})
