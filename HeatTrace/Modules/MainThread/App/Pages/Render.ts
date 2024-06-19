import path from 'path'

const page: Page = {
  id: 'render',

  initialize: async (Page) => {
    let renderType: 'image' | 'video' = 'image'

    return [
      new Components.Text(Text.bold('- Render -'), 0, -2, { horizontalAlign: 'center', verticalAlign: 'center' }),
      new Components.Text(`Put your replays in: ${Text.green(path.join(Page.Core.dataPath, 'Data', 'Replays'))}`, 0, 0, { horizontalAlign: 'center', verticalAlign: 'center' }),
      new Components.SelectMenu([
        { name: () => {
          if (renderType === 'image') return `Render: ${Text.purple('Image')}`

          return `Render: ${Text.purple('Video')}`
        }, selected: (direction) => {
          if (direction === 'none') Page.Core.PageManager.switchPage((renderType === 'image') ? 'rendering_image' : 'rendering_video')
          else renderType = (renderType === 'image') ? 'video' : 'image'
        }},
        { name: () => 'Back', selected: () => Page.Core.PageManager.switchPage('home')},
      ], 0, 2, { horizontalAlign: 'center', verticalAlign: 'center', optionAlign: 'center' }),
      new Components.Text(Text.green('Press [Left / Right] to change.'), 0, -1, { horizontalAlign: 'center', verticalAlign: 'bottom' })
    ]
  }
}

export default page

import { Text } from '../../../Tools/Text'

import { Page } from '../../Managers/PageManager'
import { Components } from '../UserInterface'
