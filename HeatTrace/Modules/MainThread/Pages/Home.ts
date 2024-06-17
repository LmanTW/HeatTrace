const page: Page = {
  id: 'home',

  initialize: async (ui) => {
    return [
      new Components.Text(Text.bold(Text.yellow('- Heat Trace -')), 0, -2, { horizontalAlign: 'center', verticalAlign: 'center' }),
      new Components.SelectMenu([
        { name: () => 'Render', selected: () => ui.switchPage('render') },
        { name: () => 'Settings', selected: () => ui.switchPage('settings') },
        { name: () => 'Exit', selected: () => {
          ui.stop()

          process.stdout.write('\x1B[2J\x1B[H')

          process.exit()
        }}
      ], 0, 1, { horizontalAlign: 'center', verticalAlign: 'center', optionAlign: 'center' }),
      new Components.Text(Text.green('Press [Enter] to select, [Up / Down] to move.'), 0, -1, { horizontalAlign: 'center', verticalAlign: 'bottom' })
    ]
  }
}

export default page

import Components from '../Components/Components'
import { Page, Text } from '../UserInterface'
