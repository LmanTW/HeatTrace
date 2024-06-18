// User Interface
export default class {
  private _Core!: AppCore

  private _state: 'idle' | 'rendering' = 'idle'
  private _cli: undefined | DynamicCLI = undefined

  constructor (Core: AppCore) {
    this._Core = Core 
  }

  // Start The User Interface
  public start (): void {
    if (this._state !== 'idle') throw new Error(`Cannot Start The User Interface: ${this._state}`)

    this._state = 'rendering'

    this._cli = new DynamicCLI({
      renderInterval: 10,

      pagePrefix_notSelected: '',
      pagePrefix_selected: '',

      allowScroll: false,
      allowSwitchPage: false
    })

    this._cli
      .setLayout([{ type: 'pageContent' }])

      .createPage('page', 'page', () => {
        if (this._Core.PageManager.currentPage === undefined) return []
        else return this._Core.PageManager.render(process.stdout.columns, process.stdout.rows)
      })

      .listen('keydown', (key) => this._Core.PageManager.keydown(key))
  }

  // Stop The User Interface
  public stop (): void {
    if (this._state !== 'rendering') throw new Error(`Cannot Stop The User Interface: ${this._state}`)

    this._state = 'idle'

    this._cli!.stop()
  }
}

import { DynamicCLI } from '../../Tools/DynamicCLI'

import AppCore from './Core'
