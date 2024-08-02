import path from 'path'
import fs from 'fs'

import build from '../Build/Build'

// Start The Test
async function start (): Promise<void> {
  await build(false)

  const { HeatTrace } = await import('../../Assets/HeatTrace.js')

  const Engine = new HeatTrace({
    threads: 2,

    width: 512 * 2.5,
    height: 384 * 2.5,

    style: {
      traceSize: 2,
      traceLength: 5,

      cursor: {
        type: 'image',
        distribution: 'replay',

        size: 40,

        images: [path.join(__dirname, 'cursor.png')],

        imageAlign: 'center'
      } 
    },

    maxFrameQueue: 2
  })

  await Engine.initialize((info) => console.log(info))

  const replays = fs.readdirSync(path.join(__dirname, 'Replays')).map((fileName) => fs.readFileSync(path.join(__dirname, 'Replays', fileName)))

  await Engine.loadReplays(replays, (info) => console.log('Load Replays', info))

  await Engine.renderVideo(path.join(__dirname, 'Cache'), undefined, undefined, (info) => console.log('Render Video', info))

  // fs.writeFileSync(path.join(__dirname, 'Result.png'), await Engine.renderImage(250, (info) => console.log('Render Image', info)))

  await Engine.terminate()
}

start()
