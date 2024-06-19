import path from 'path'
import fs from 'fs'

const page: Page = {
  id: 'rendering_image',

  initialize: async (Page) => {
    let tasks = new Components.Tasks([
      { id: 'prepareThreads', state: 'inProgress', name: 'Preparing Threads' },
      { id: 'loadReplays', state: 'waiting', name: 'Load Replays' },
      { id: 'calculateHeatmap', state: 'waiting', name: 'Calculate Heatmap' },
      { id: 'renderImage', state: 'waiting', name: 'Render Image' }
    ], 0, 0, { horizontalAlign: 'center', verticalAlign: 'center' })


    const settings = Page.Core.settings

    const Engine = new HeatTrace({
      width: +settings.resolution.split('x')[0],
      height: +settings.resolution.split('x')[1],
      fps: settings.fps,

      threads: settings.threads
    })

    Engine.initialize().then(async () => {
      tasks.setTask('prepareThreads', 'finished', 'Threads Prepared')
      tasks.setTask('loadReplays', 'inProgress', 'Loading Replays 0% (0 / 0)')

      const replays: Buffer[] = []

      fs.readdirSync(path.join(Page.Core.dataPath, 'Replays')).forEach((fileName) => {
        if (path.extname(fileName) === '.osr') replays.push(fs.readFileSync(path.join(Page.Core.dataPath, 'Replays', fileName)))
      })

      const result = await Engine.loadReplays(replays, (info) => tasks.setTask('loadReplays', 'inProgress', `Loading Replays ${Math.round((100 / info.total) * info.loaded)}% (${info.loaded} / ${info.total})`))

      if (result.error) {
      } else {
        tasks.setTask('loadReplays', 'finished', `Replays Loaded (${Text.red(`Failed: ${replays.length - result.data!.length}`)})`)
        tasks.setTask('calculateHeatmap', 'inProgress', 'Calculating Heatmap 0% (0 / 0)')

        await Engine.calculateHeatmap(result.data!, 0, result.beatmapLength!, (info) => tasks.setTask('calculateHeatmap', 'inProgress', `Calculating Heatmap ${Math.round((100 / info.total) * info.finished)}% (${info.finished} / ${info.total})`))

        tasks.setTask('calculateHeatmap', 'finished', 'Heatmap Calculated')
        tasks.setTask('renderImage', 'inProgress', 'Rendering Image')
      } 
    })

    return [
      tasks
    ]
  }
}

export default page

import { Text } from '../../../Tools/Text'

import { Page } from '../../Managers/PageManager'
import { Components } from '../UserInterface'
import { HeatTrace } from '../../HeatTrace'
