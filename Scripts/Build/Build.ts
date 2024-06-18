import { build } from 'tsup'
import path from 'path'
import fs from 'fs'

// Build
export default async (): Promise<void> => {
  if (!fs.existsSync(path.join(__dirname, 'Cache'))) fs.mkdirSync(path.join(__dirname, 'Cache'))

  Log.add(` 📦 Bundling HeatTrace\n`)

  await build({
    silent: true,

    entry: [path.resolve(__dirname, '../../HeatTrace/APP.ts')],
    outDir: path.join(__dirname, 'Cache'),

    target: 'node18',
    minify: 'terser'
  })

  fs.renameSync(path.join(__dirname, 'Cache', 'APP.js'), path.resolve(__dirname, '../../Assets/HeatTrace_APP.js'))

  Log.add(` 📦 ${TextColor.green}Successfully Bundled HeatTrace\n\n${TextColor.reset}`)
}

import { Log, TextColor } from './Log'
