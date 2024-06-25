import path from 'path'
import fs from 'fs'

import build from '../Build/Build'

// Start The Test
async function start (): Promise<void> {
  await build(false)

  const { HeatTrace } = await import('../../Assets/HeatTrace.js')

  const Engine = new HeatTrace({
    width: 512 * 3,
    height: 384 * 3,

    style: {
      traceSize: 2,
      traceLength: 5,

      cursor: {
        type: 'image',
        distribution: 'replay',

        images: [
          path.join(__dirname, 'Cursor_1.png'),
          path.join(__dirname, 'Cursor_2.png')
        ]
      } 
    },

    maxFrameQueue: 5
  })

  await Engine.initialize((info) => console.log(info))

  const replays = fs.readdirSync(path.join(__dirname, 'Replays')).map((fileName) => fs.readFileSync(path.join(__dirname, 'Replays', fileName)))

  await Engine.loadReplays(replays, (info) => console.log('Load Replays', info))

  // await Engine.renderVideo(path.join(__dirname, 'Cache'), undefined, undefined, (info) => console.log('Render Video', info))

  fs.writeFileSync(path.join(__dirname, 'Result.png'), await Engine.renderImage(500, (info) => console.log('Render Image', info)))

  await Engine.terminate()
}

start()
