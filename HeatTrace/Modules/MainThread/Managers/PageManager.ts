// Page Manager
class PageManager {
  private _currentPage: undefined | string = undefined
  private _pages: { [key: string]: PageData } = {}

  public PageInstance!: PageInstance
  
  constructor (Core: AppCore) {
    this.PageInstance = new PageInstance(Core)
  }

  public get currentPage () {return this._currentPage}

  // Add A Page
  public addPage (page: Page): PageManager {
    if (this._pages[page.id] !== undefined) throw new Error(`Page Alreadt Added: "${page.id}"`)

    this._pages[page.id] = { initialize: page.initialize, components: [] } 

    if (page.subPages !== undefined) page.subPages.forEach((subPage) => this.addPage(subPage))  

    return this
  }

  // Switch A Page
  public async switchPage (id: string): Promise<void> {
    if (this._pages[id] === undefined) throw new Error(`Page Not Found: "${id}"`)

    this.PageInstance.TimerManager.deleteAllTimers()

    this._pages[id].components = await this._pages[id].initialize(this.PageInstance)

    this._currentPage = id
  }

  // Render The Current Page
  public render (width: number, height: number): string[] {
    const lines: string[] = []

    for (let i = 0; i < height; i++) lines.push(' '.repeat(width))

    if (this._currentPage === undefined) return lines

    this._pages[this._currentPage].components.forEach((component) => component.render(width, height, lines))

    return lines
  }

  // Key Down
  public keydown (key: Buffer): void {
    if (this._currentPage !== undefined) this._pages[this._currentPage].components.forEach((component) => component.keydown(key))
  }
}

// Page Instance
class PageInstance {
  public Core!: AppCore

  public TimerManager = new TimerManager()

  constructor (Core: AppCore) {
    this.Core = Core 
  }
}

// Page
interface Page {
  id: string,

  initialize: (Page: PageInstance) => Promise<Component[]>,

  subPages?: Page[]
}

// Page Data
interface PageData {
  initialize: (Page: PageInstance) => Promise<Component[]>,

  components: Component[]
}

export { PageManager, Page, PageInstance }

import TimerManager from '../Managers/TimerManager'
import { Component } from '../App/Components/Main'
import AppCore from '../App/Core'
