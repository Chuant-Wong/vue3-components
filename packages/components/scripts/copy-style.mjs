import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

// 将 theme-chalk 构建产物复制为主包 dist/style.css，用户可 import 'vue3-components/dist/style.css'
// 基于脚本文件位置解析，避免依赖执行时 cwd
const src = resolve(here, '../../theme-chalk/dist/index.css')
const dest = resolve(here, '../dist/style.css')

await mkdir(dirname(dest), { recursive: true })
await copyFile(src, dest)
console.log('built style.css')
