import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    // 类型产出：仅主包源码；@vc/utils、@vc/hooks 由各自包发布 d.ts（保留包名引用，不重写为源码路径）
    dts({
      entryRoot: '.',
      include: [
        'index.ts',
        'component.ts',
        'global.d.ts',
        'src/**/*.ts',
        'src/**/*.vue',
      ],
      outDir: 'dist',
      aliasesExclude: ['@vc/utils', '@vc/hooks'],
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
      // element-plus 为 peerDependency（二次封装基座），不打入产物，由宿主应用提供
      external: ['vue', '@vc/utils', '@vc/hooks', 'element-plus', '@element-plus/icons-vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
