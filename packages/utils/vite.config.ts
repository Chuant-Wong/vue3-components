import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VcUtils',
      formats: ['es'],
      fileName: () => 'vc-utils.es.js',
    },
  },
})
