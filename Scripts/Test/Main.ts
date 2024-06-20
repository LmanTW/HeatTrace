import path from 'path'
import fs from 'fs'

import build from '../Build/Build'

// Start The Test
async function start () {
  await build()

  const { HeatTrace } = await import('../../Assets/HeatTrace.js')

  const Engine = new HeatTrace({
    width: 512 * 1,
    height: 384 * 1,

    videoFPS: 15
  })
  
  await Engine.initialize()

  await Engine.loadReplays(fs.readdirSync(path.join(__dirname, 'Replays')).map((fileName) => {
    return fs.readFileSync(path.join(__dirname, 'Replays', fileName))
  }), (info) => console.log(info))

  await Engine.renderVideo(path.join(__dirname, 'Frames'), 0, (info) => console.log(info))

  // fs.writeFileSync(path.join(__dirname, 'Result.png'), await Engine.renderImage((info) => console.log(info)))
}

start()
