import path from 'path'
import fs from 'fs'

import build from '../Build/Build'

// Start The Test
async function start (): Promise<void> {
  await build(false)

  const { HeatTrace } = await import('../../Assets/HeatTrace.js')

  const Engine = new HeatTrace({
    width: 512 * 2,
    height: 384 * 2,

    style: {
      traceSize: 1,
      traceLength: 5,

      cursor: {
        type: 'color'
      } 
    },

    maxCursorTravelDistance: 2,
    maxFrameQueue: 5
  })

  await Engine.initialize((info) => console.log(info))

  const replays = fs.readdirSync(path.join(__dirname, 'Replays')).map((fileName) => fs.readFileSync(path.join(__dirname, 'Replays', fileName)))

  await Engine.loadReplays(replays, (info) => console.log('Load Replays', info))

  await Engine.renderVideo(path.join(__dirname, 'Cache'), undefined, undefined, (info) => console.log('Render Video', info))

  // fs.writeFileSync(path.join(__dirname, 'Result.png'), await Engine.renderImage(undefined, (info) => console.log('Render Image', info)))

  await Engine.terminate()
}

start()
