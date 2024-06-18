// App
export default class {
  private _Core!: AppCore

  constructor () {
    this._Core = new AppCore()
  }

  public state () {return this._Core.state}

  // Start The APP
  public start (): void {
    this._Core.start()
  }
}

import AppCore from './Core'
