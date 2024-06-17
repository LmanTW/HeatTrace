// Start The Main Thread
export default () => {
  const ui = new UserInterface()

  ui.addPage(page_settings)
  ui.addPage(page_render)
  ui.addPage(page_home)

  ui.switchPage('home')
}

import { UserInterface, Text } from './UserInterface'

import page_settings from './Pages/Settings'
import page_render from './Pages/Render'
import page_home from './Pages/Home'
