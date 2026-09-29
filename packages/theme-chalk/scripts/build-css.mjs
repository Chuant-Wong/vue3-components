import { compile } from 'sass'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'

const srcDir = 'src'
const outDir = 'dist'

// 遍历 src 顶层 scss，逐个编译为 dist/<name>.css（index.css 全量 + 每组件独立 css 支持按需引入）
const files = (await readdir(srcDir)).filter(
  (f) => extname(f) === '.scss' && !f.startsWith('_')
)

await mkdir(outDir, { recursive: true })

for (const file of files) {
  const name = basename(file, '.scss')
  const result = compile(join(srcDir, file), {
    loadPaths: [srcDir],
    style: 'expanded',
  })
  await writeFile(join(outDir, `${name}.css`), result.css, 'utf8')
  console.log(`built ${name}.css`)
}
