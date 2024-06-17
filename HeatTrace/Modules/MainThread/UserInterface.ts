// User Interface
class UserInterface {
  private _cli!: DynamicCLI

  private _pages: { [key: string]: { page: Page, components: Component[] }} = {}
  private _currentPage: undefined | string = undefined

  public TimerManager!: TimerManager

  constructor () {
    this._cli = new DynamicCLI({
      renderInterval: 10,

      pagePrefix_notSelected: '',
      pagePrefix_selected: '',

      allowScroll: false,
      allowSwitchPage: false
    })

    this.TimerManager = new TimerManager()

    this._cli
      .setLayout([{ type: 'pageContent' }])

      .createPage('page', 'page', () => {
        if (this._currentPage === undefined) return []
        else {
          const lines: string[] = []

          for (let i = 0; i < this._cli.size.height!; i++) lines.push('')

          this._pages[this._currentPage].components.forEach((component) => component.render(process.stdout.columns, process.stdout.rows, lines))

          return lines
        }
      })

      .listen('keydown', (key) => {
        if (this._currentPage !== undefined) {
          this._pages[this._currentPage].components.forEach((component) => {
            if (component.keydown !== undefined) component.keydown(key) 
          })
        }
      })
  }

  public get width () {return this._cli.size.width}
  public get height () {return this._cli.size.height}

  // Stop The Interface
  public stop (): void {
    this._cli.stop()
  }

  // Add A Page
  public addPage (page: Page): void {
    if (this._pages[page.id] !== undefined) throw new Error(`Page Already Exists: "${page.id}"`)

    this._pages[page.id] = { page, components: [] }

    if (page.subPages !== undefined) page.subPages.forEach((subPage) => this.addPage(subPage))

    if (this._currentPage === undefined) this.switchPage(page.id) 
  }

  // Switch Page
  public async switchPage (id: string, data?: any): Promise<void> {
    if (this._pages[id] === undefined) throw new Error(`Page Not Found: "${id}"`)

    this.TimerManager.deleteAllTimers()

    this._pages[id].components = await this._pages[id].page.initialize(this, data)

    this._currentPage = id
  }
}

// Page
interface Page {
  id: string,

  initialize: (ui: UserInterface, data: any) => Promise<Component[]>,

  subPages?: Page[]
}

// Text
class Text {
  public static bold (text: string) {return `\x1b[1m${text}\x1b[22m`}
  public static underline (text: string) {return `\x1b[4m${text}\x1b[24m`}
  public static strikethrough (text: string) {return `\x1b[9m${text}\x1b[29m`}

  public static red (text: string) {return `\x1b[31m${text}\x1b[0m`}
  public static yellow (text: string) {return `\x1b[33m${text}\x1b[0m`}
  public static green (text: string) {return `\x1b[32m${text}\x1b[0m`}
  public static cyan (text: string) {return `\x1b[36m${text}\x1b[0m`}
  public static blue (text: string) {return `\x1b[34m${text}\x1b[0m`}
  public static purple (text: string) {return `\x1b[35m${text}\x1b[0m`}

  public static brightRed (text: string) {return `\x1b[91m${text}\x1b[0m`}
  public static brightYellow (text: string) {return `\x1b[93m${text}\x1b[0m`}
  public static brightGreen (text: string) {return `\x1b[92m${text}\x1b[0m`}
  public static brightCyan (text: string) {return `\x1b[96m${text}\x1b[0m`}
  public static brightBlue (text: string) {return `\x1b[94m${text}\x1b[0m`}
  public static brightPurple (text: string) {return `\x1b[95m${text}\x1b[0m`}

  public static white (text: string) {return `\x1b[37m${text}\x1b[0m`}
  public static black (text: string) {return `\x1b[30m${text}\x1b[0m`}
  public static gray (text: string) {return `\x1b[30m${text}\x1b[0m`}
}

// Background
class Background {
  public static red (text: string) {return `\x1b[41m${text}\x1b[0m`}
  public static yellow (text: string) {return `\x1b[43m${text}\x1b[0m`}
  public static green (text: string) {return `\x1b[42m${text}\x1b[0m`}
  public static cyan (text: string) {return `\x1b[46m${text}\x1b[0m`}
  public static blue (text: string) {return `\x1b[44m${text}\x1b[0m`}
  public static purple (text: string) {return `\x1b[45m${text}\x1b[0m`}

  public static white (text: string) {return `\x1b[47m${text}\x1b[0m`}
  public static black (text: string) {return `\x1b[40m${text}\x1b[0m`}
}

export { UserInterface, Page, Text, Background }

import { DynamicCLI } from '../Tools/DynamicCLI'

import TimerManager from './Managers/TimerManager'
import { Component } from './Components/Main'
