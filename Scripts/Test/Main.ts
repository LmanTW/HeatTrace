import path from 'path'
import fs from 'fs'

import build from '../Build/Build'

// Start The Test
async function start (): Promise<void> {
  await build(false)

  const { HeatTrace } = await import('../../Assets/HeatTrace.js')

  const Engine = new HeatTrace({
    width: 512 * 1,
    height: 384 * 1, 

    style: {
      traceSize: 1,

      cursor: {
        type: 'color'
      },

      background: {
        type: 'image',

        image: path.join(__dirname, 'Background.jpeg')
      }
    }
  })

  await Engine.initialize((info) => console.log(info))

  const replays = fs.readdirSync(path.join(__dirname, 'Replays')).map((fileName) => fs.readFileSync(path.join(__dirname, 'Replays', fileName)))

  await Engine.loadReplays(replays, (info) => console.log('Load Replays', info))

  await Engine.renderVideo(path.join(__dirname, 'Cache'), undefined, undefined, (info) => console.log('Render Video', info))

  // fs.writeFileSync(path.join(__dirname, 'Result.png'), await Engine.renderImage(undefined, (info) => console.log('Render Image', info)))

  await Engine.terminate()
}

start()
