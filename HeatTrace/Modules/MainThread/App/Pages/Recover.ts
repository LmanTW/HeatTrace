const page: Page = {
  id: 'recover',

  initialize: async (Page) => {
    return [
      new Components.Text(Text.bold('- Recover -'), 0, -2, { horizontalAlign: 'center', verticalAlign: 'center' }),
      new Components.Text('Found an unfinished project, do you want to recover it to continue rendering?', 0, -1, { horizontalAlign: 'center', verticalAlign: 'center' }),
      new Components.SelectMenu([
        { name: () => 'Recover' },
        { name: () => 'Back', selected: () => {
          Page.Core.PageManager.switchPage('home')
        }}
      ], 0, 1, { horizontalAlign: 'center', verticalAlign: 'center' })
    ]
  }
}

export default page

import { Text } from '../../../Tools/Text'

import { Page } from '../../Managers/PageManager'
import { Components } from '../UserInterface'
