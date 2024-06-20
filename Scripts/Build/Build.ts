import { build } from 'tsup'
import path from 'path'
import fs from 'fs'

// Build HeatTrace
export default async (): Promise<void> => {
  if (!fs.existsSync(path.join(__dirname, 'Cache'))) fs.mkdirSync(path.join(__dirname, 'Cache'))

  process.stdout.write(' 📦 Bundling HeatTrace\n')

  process.stdout.write('    ↳ Bundling HeatTrace-API\n')

  await build({
    silent: true,

    entry: [path.resolve(__dirname, '../../HeatTrace/API.ts')],
    outDir: path.join(__dirname, 'Cache'),

    format: 'cjs',
    minify: 'terser',

    dts: true,

    skipNodeModulesBundle: true
  })

  process.stdout.write(' 📦 \x1b[32mSuccessfully Bundled HeatTrace\x1b[0m\n\n')

  fs.renameSync(path.join(__dirname, 'Cache', 'API.js'), path.resolve(__dirname, '../../Assets/HeatTrace.js'))
  fs.renameSync(path.join(__dirname, 'Cache', 'API.d.ts'), path.resolve(__dirname, '../../Assets/HeatTrace.d.ts'))

  fs.rmSync(path.join(__dirname, 'Cache'), { recursive: true })
}
