import path from 'path'

const page: Page = {
  id: 'render',

  initialize: async (Page) => {
    let renderType: 'image' | 'video' = 'image'

    return [
      new Components.Text(Text.bold(Text.cyan('- Render -')), 0, -2, { horizontalAlign: 'center', verticalAlign: 'center' }),
      new Components.Text(`Put your replays in: ${Text.green(path.join(Page.Core.dataPath, 'Data', 'Replays'))}`, 0, 0, { horizontalAlign: 'center', verticalAlign: 'center' }),
      new Components.SelectMenu([
        { name: () => {
          if (renderType === 'image') return `Render: ${Text.purple('Image')}`

          return `Render: ${Text.purple('Video')}`
        }, selected: (direction) => {
          if (direction === 'none') Page.Core.PageManager.switchPage('rendering', renderType)
          else renderType = (renderType === 'image') ? 'video' : 'image'
        }},
        { name: () => 'Back', selected: () => Page.Core.PageManager.switchPage('home')},
      ], 0, 2, { horizontalAlign: 'center', verticalAlign: 'center', optionAlign: 'center' }),
      new Components.Text(Text.green('Press [Left / Right] to change.'), 0, -1, { horizontalAlign: 'center', verticalAlign: 'bottom' })
    ]
  },

  subPages: [
    {
      id: 'rendering',

      initialize: async (Page, renderType) => {
        let text = new Components.Text('', 0, -1, { horizontalAlign: 'center', verticalAlign: 'center' }) 

        let frame: number = 0
        let state: string = 'Parsing Replays'
        let detil: string = '1 / 100'

        // Set The Text
        function setText (): void {
          text.setContent(`${Text.green(`${animationFrames[frame]} ${state}`)}\n↳ ${detil}`)
        }

        setText()

        Page.TimerManager.createInterval(100, () => {
          frame++

          if (frame >= animationFrames.length) frame = 0 

          setText()
        })



        const settings = Page.Core.settings

        const Engine = new HeatTrace({
          width: +settings.resolution.split('x')[0],
          height: +settings.resolution.split('x')[1],
          fps: settings.fps,

          threads: settings.threads
        })

        await Engine.initialize()

        await Engine.loadReplays([])

        return [
          text
        ]
      }
    }
  ]
}

export default page

import { Text } from '../../../Tools/Text'

import { Page } from '../../Managers/PageManager'
import HeatTrace from '../../HeatTrace'
import Components from '../Components'

const animationFrames: string[] = ['⠙', '⠸', '⢰', '⣠', '⣄', '⡆', '⠇', '⠋']
