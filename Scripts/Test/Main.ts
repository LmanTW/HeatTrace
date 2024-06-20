import path from 'path'
import fs from 'fs'

import build from '../Build/Build'

// Start The Test
async function start () {
  await build()

  const { HeatTrace } = await import('../../Assets/HeatTrace.js')

  const Engine = new HeatTrace({
    width: 512 * 2,
    height: 384 * 2,
  })
  
  await Engine.initialize()

  await Engine.loadReplays(fs.readdirSync(path.join(__dirname, 'Replays')).map((fileName) => {
    return fs.readFileSync(path.join(__dirname, 'Replays', fileName))
  }), (info) => console.log(info))

  fs.writeFileSync(path.join(__dirname, 'Result.png'), Buffer.from(await Engine.renderImage((info) => console.log(info))))
}

start()
