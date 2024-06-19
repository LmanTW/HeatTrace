import os from 'os'

const page: Page = {
  id: 'settings',

  initialize: async (Page) => {
    Page.Core.loadData()

    const settings = Page.Core.settings

    const resolutions: string[] = ['512x384', '1024x768', '2048x1536', '4096x3072']
    const fps: number[] = [15, 30, 60, 120]

    const totalThreads = os.cpus().length

    return [
      new Components.Text(Text.bold('- Settings -'), 0, 1, { horizontalAlign: 'center' }),
      new Components.SelectMenu([
        { name: () => {
          if (settings.resolution === '512x384') return `Resolution: ${Text.yellow('512x384 (Low)')}`
          else if (settings.resolution === '1024x768') return `Resolution: ${Text.green('1024x768 (Medium)')}`
          else if (settings.resolution === '2048x1536') return `Resolution: ${Text.blue('2048x1536 (High)')}`

          return `Resolution: ${Text.cyan('4096x3072 (Ultra)')}`
        }, selected: (direction) => {
          let currentResolution = resolutions.indexOf(settings.resolution)

          if (direction === 'left') {
            currentResolution--

            if (currentResolution < 0) currentResolution = 0
          } else if (direction === 'right') {
            currentResolution++

            if (currentResolution >= resolutions.length) currentResolution = resolutions.length - 1
          }

          settings.resolution = resolutions[currentResolution] as any
        }},
        { name: () => {
          if (settings.fps === 15) return `FPS: ${Text.yellow('30 (Low)')}`
          else if (settings.fps === 30) return `FPS: ${Text.green('30 (Medium)')}`
          else if (settings.fps === 60) return `FPS: ${Text.blue('60 (High)')}`
          
          return `FPS: ${Text.cyan('120 (Ultra)')}`
        }, selected: (direction) => {
          let currentFPS = fps.indexOf(settings.fps)

          if (direction === 'left') {
            currentFPS--

            if (currentFPS < 0) currentFPS = 0
          } else if (direction === 'right') {
            currentFPS++

            if (currentFPS >= fps.length) currentFPS = fps.length - 1
          }

          settings.fps = fps[currentFPS] as any
        }},
        { name: () => '' },
        { name: () => {
          if (settings.threads >= 32) return `Threads: ${Text.purple(`${settings.threads} / ${totalThreads} (Mega Super Ultra)`)}`
          else if (settings.threads >= 32) return `Threads: ${Text.purple(`${settings.threads} / ${totalThreads} (Super Ultra)`)}`
          else if (settings.threads >= 16) return `Threads: ${Text.cyan(`${settings.threads} / ${totalThreads} (Ultra)`)}`
          else if (settings.threads >= 8) return `Threads: ${Text.blue(`${settings.threads} / ${totalThreads} (High)`)}`
          else if (settings.threads >= 4) return `Threads: ${Text.green(`${settings.threads} / ${totalThreads} (Medium)`)}`
          else if (settings.threads >= 2) return `Threads: ${Text.yellow(`${settings.threads} / ${totalThreads} (Low)`)}`

          return `Threads: ${Text.red(`${settings.threads} / ${totalThreads} (Potato)`)}`
        }, selected: (direction) => {
          if (direction === 'left') {
            settings.threads--

            if (settings.threads < 1) settings.threads = 1
          } else {
            settings.threads++

            if (settings.threads > totalThreads) settings.threads = totalThreads
          }
        }},
        { name: () => '' },
        { name: () => 'Back', selected: () => {
          Page.Core.saveData()

          Page.Core.PageManager.switchPage('home') 
        }, optionAlign: 'center' }
      ], 0, 3, { horizontalAlign: 'center' }),
      new Components.Text(Text.green('Press [Left / Right] to change.'), 0, -1, { horizontalAlign: 'center', verticalAlign: 'bottom' })
    ]
  }
}

export default page

import { Text } from '../../../Tools/Text'

import { Page } from '../../Managers/PageManager'
import { Components } from '../UserInterface'
