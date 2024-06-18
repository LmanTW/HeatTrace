const page: Page = {
  id: 'home',

  initialize: async (Page) => {
    return [
      new Components.Text(Text.bold(Text.yellow('- Heat Trace -')), 0, -2, { horizontalAlign: 'center', verticalAlign: 'center' }),
      new Components.SelectMenu([
        { name: () => 'Render', selected: () => Page.Core.PageManager.switchPage('render') },
        { name: () => 'Settings', selected: () => Page.Core.PageManager.switchPage('settings') },
        { name: () => 'Exit', selected: () => Page.Core.stop() }
      ], 0, 1, { horizontalAlign: 'center', verticalAlign: 'center', optionAlign: 'center' }),
      new Components.Text(Text.green('Press [Enter] to select, [Up / Down] to move.'), 0, -1, { horizontalAlign: 'center', verticalAlign: 'bottom' })
    ]
  }
}

export default page

import { Text } from '../../../Tools/Text'

import { Page } from '../../Managers/PageManager'
import Components from '../Components'
