import path from 'path'
import fs from 'fs'

import build from '../Build/Build'

// Start The Test
async function start () {
  await build()

  const { HeatTrace } = await import('../../Assets/HeatTrace.js')

  const Engine = new HeatTrace({
    threads: 2,

    width: 512 * 2,
    height: 384 * 2,

    videoFPS: 30,

    style: {
      heatBoost: 3,

      cursor: {
        distribution: 'replay'
      }
    }
  })
  
  await Engine.initialize()

  await Engine.loadReplays(fs.readdirSync(path.join(__dirname, 'Replays')).map((fileName) => {
    return fs.readFileSync(path.join(__dirname, 'Replays', fileName))
  }), (info) => console.log(info))

  const filePath = await Engine.renderVideo(path.join(__dirname, 'Cache'), 0, (info) => console.log(info))

  fs.renameSync(filePath, path.join(__dirname, 'Result.mp4'))

  // fs.writeFileSync(path.join(__dirname, 'Result.png'), await Engine.renderImage((info) => console.log(info)))
}

start()
