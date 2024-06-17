import readline from 'node:readline'
import stream from 'node:stream'
import wcwidth from 'wcwidth'

/** The DynamicCLI itself */
class DynamicCLI {
  private _options!: DynamicCliOptions

  private _layout: any[] = [Components.pageTabs(), Components.blank(), Components.pageContent(), Components.blank(), Components.input()]
  private _style: Style = {
    background: BackgroundColor.reset,

    background_notSelected: BackgroundColor.gray,
    text_notSelected: TextColor.white,
    background_selected: BackgroundColor.white,
    text_selected: TextColor.gray,
  }

  public interval!: any
  public interface!: undefined | readline.Interface

  private _size: { width: undefined | number, height: undefined | number } = { width: undefined, height: undefined }
  private _pages: { [key: string]: Page } = {}
  private _data: { input: string, currentPage: undefined | string } = { input: '', currentPage: undefined }
  private _listeners: { [key: string]: Listener } = {}

  private _oldRenderContent: string[] = []

  constructor (options?: DynamicCliOptions) {
    if (options === undefined) options = {}

    this._options = options

    if (options.render === undefined || options.render) {
      process.stdout.write(`\u001B[?25l${`\n`.repeat(process.stdout.rows)}`)

      this.interval = setInterval(
        () => process.stdout.write(this.render().map((change) => `\x1B[H${(change.line > 0) ? `\x1B[${change.line}B` : ''}\x1B[2K${change.content}`).join('')),
        options.renderInterval || 25
      )
    }

    if (options.allowInput === undefined || options.allowInput) {
      const writableStream = new stream.Writable({
        write: () => {}
      })

      this.interface = readline.createInterface({
        input: process.stdin,
        output: writableStream,

        terminal: true,
        historySize: 0
      })

      process.stdin.on('data', (data) => this._handleInput(data))
    }
  }

  public get options (): DynamicCliOptions {return this._options}
  public get size (): { width: number, height: number } {return this._getSize()}
  public get pages (): string[] {return Object.keys(this._pages)}
  public get input (): string {return this._data.input}
  public get currentPage (): undefined | string {return this._data.currentPage}
  public get cursorY (): undefined | number {
    const page = this._pages[this._data.currentPage as any]

    if (page === undefined) return undefined
    else page.cursorY
  }
 
  /** Stop the CLI */
  public stop () {
    if (this.interval === undefined) throw new Error('Cannot Stop The CLI')

    clearInterval(this.interval)

    if (this.interface !== undefined) {
      this.interface.close()

      process.stdin.off('data', this._handleInput)

      this.interface = undefined
    }

    this.interval = undefined

    process.stdout.write(`\u001B[?25h`)
  }

  /** Set the size of the CLI  */
  public setSize (width: undefined | number, height: undefined | number): DynamicCLI {
    this._size = { width, height }

    return this
  }

  /** Set the layout of the CLI */
  public setLayout (layout: { type: 'blank' | 'text' | 'pageTabs' | 'pageContent' | 'input', [key: string]: any }[]): DynamicCLI {
    this._layout = layout

    return this
  }

  /** Set the style of the CLI */
  public setStyle (style: Style): DynamicCLI {
    this._style = style

    return this
  }

  /** Create a page */
  public createPage (id: string, name: string, callback: () => string[]): DynamicCLI {
    if (this._pages[id] !== undefined) throw new Error(`Page Already Exist: "${id}"`)

    this._pages[id] = {
      name,
      callback,

      content: [],

      cursorY: 0,
      scrollY: 0
    }

    if (this._data.currentPage === undefined) {
      this._data.currentPage = id

      this._oldRenderContent = []
    }

    return this
  }

  /** Delete a page */
  public deletePage (id: string): void {
    if (this._pages[id] === undefined) throw new Error(`Page Not Found: "${id}"`)

    if (this._data.currentPage !== undefined) {
      const currentPageIndex = Object.keys(this._pages).indexOf(this._data.currentPage)

      delete this._pages[id]

      const pages = Object.keys(this._pages)

      if (pages.length === 0) this._data.currentPage = undefined
      else if (currentPageIndex >= pages.length) this._data.currentPage = pages[pages.length - 1]

      this._oldRenderContent = []
    } else delete this._pages[id]
  }

  /** Set the input */
  public setInput (string: string): void {
    this._data.input = string
  }

  /** Simulate user input */
  public simulateInput (key: Buffer): void {
    this._handleInput(key)
  }

  /** Switch the page */
  public switchPage (id: string): void {
    if (this._pages[id] === undefined) throw new Error(`Page Not Found: "${id}"`)

    this._data.currentPage = id
  }

  /** Listen to an event */
  public listen (type: 'scroll', callback: (info: { page: string, cursorY: number, scrollY: number }) => any): void
  public listen (type: 'switchPage', callback: (pageID: string) => any): void
  public listen (type: 'enter', callback: (input: string) => any): void
  public listen (type: 'input' | 'keydown', callback: (key: Buffer) => any): void
  public listen (type: string, callback: (...args: any) => any): string {
    const id = generateID(5, Object.keys(this._listeners))

    this._listeners[id] = { type, callback }

    return id
  }

  /** Remove a listener */
  public removeListener (id: string): void {
    if (this._listeners[id] === undefined) throw new Error(`Listener Not Found: "${id}"`)

    delete this._listeners[id]
  }

  /** Remove all listeners */
  public removeAllListeners (): void {
    this._listeners = {}
  }

  /** Render the CLI */
  public render (): { line: number, content: string }[] {
    let lines: any[] = []

    this._layout.forEach((component) => lines = lines.concat(this._renderComponent(component)))

    const size = this._getSize()

    while (lines.length < size.height - 1) lines.push('')

    const changes: { line: number, content: string }[] = []

    this._oldRenderContent = lines.slice(0, size.height - 1).map((line, index) => {
      let characters = this._sperateColor(line.replaceAll('\n', '\\n'))
      let planText = characters.map((character) => character.text).join('')

      if (wcwidth(planText) < size.width) characters.push({ sequence: this._style.background, text: ' '.repeat(size.width - wcwidth(planText)) })
      else {
        while (wcwidth(planText) > size.width) {
          characters = characters.slice(0, characters.length-1)
          planText = planText.substring(0, planText.length-1)
        }
      }

      const string = `${this._style.background}${characters.map((character) => `${(character.sequence === undefined) ? '' : character.sequence}${character.text}`).join('')}`

      if (string !== this._oldRenderContent[index]) changes.push({ line: index, content: string })

      return string
    })

    return changes 
  }

  /** Render a component */
  private _renderComponent (component: any): string[] {
    if (component.type === 'blank') return [this._style.background]
    else if (component.type === 'text') return [component.callback()]

    if (component.type === 'pageTabs') {
      const tabs: string[] = []

      Object.keys(this._pages).forEach((id) => {
        if (id === this._data.currentPage) tabs.push(`${this._style.background_selected} ${this._style.text_selected}${this._pages[id].name} ${this._style.background}`)
        else tabs.push(`${this._style.background_notSelected} ${this._style.text_notSelected}${this._pages[id].name} ${this._style.background}`) 
      })

      return [` ${tabs.join(' ')} `]
    } else if (component.type === 'pageContent') {
      const size = this._getSize()

      const lines: string[] = []

      if (this._data.currentPage !== undefined) {
        const page = this._pages[this._data.currentPage]

        page.content = page.callback()

        const pagePrefix_notSelected = (this._options.pagePrefix_notSelected === undefined) ? ` <lineNumber> | ` : this._options.pagePrefix_notSelected
        const pagePrefix_selected = (this._options.pagePrefix_selected === undefined) ? `${this._style.background_selected} ${this._style.text_selected}<lineNumber>${TextColor.reset}${this._style.background} | ` : this._options.pagePrefix_selected

        for (let i = page.scrollY; i < page.scrollY + (size.height - this._layout.length) && i < page.content.length; i++) {
          const lineNumber: string = (i + 1).toString().padStart(2, ' ')

          if (page.cursorY === i) lines.push(`${pagePrefix_selected.replaceAll('<lineNumber>', lineNumber)}${page.content[i]}`) 
          else lines.push(`${pagePrefix_notSelected.replaceAll('<lineNumber>', lineNumber)}${page.content[i]}`)
        }
      }

      while (lines.length < size.height - this._layout.length) lines.push('')

      return lines
    }

    if (component.type === 'input') {
      const size = this._getSize()

      let string: string = ` ${(this._data.input.length > 0) ? `${this._style.background_selected}${this._style.text_selected}` : `${this._style.background_notSelected}${this._style.text_notSelected}`} `

      if (this._data.input.length > 0) string += this._data.input
      else string += component.placeholder || `⇧⇩ Scroll | ⇦⇨ Switch Page | Type to give input`

      string += ' '.repeat(size.width - wcwidth(this._sperateColor(string).map((character) => character.text).join('') + ' ')) + this._style.background

      return [string]
    }

    return []
  }

  /** Get the size of the CLI */
  private _getSize (): { width: number, height: number } {
    return { width: this._size.width || process.stdout.columns, height: this._size.height || process.stdout.rows }
  }

  /** Seperate the color from the text */
  private _sperateColor (text: string): { sequence?: string, text: string }[] {
    const characters: { sequence?: string, text: string }[] = []

    let sequence: string = '' 
  
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\x1b') {
        const oldIndex = i

        while (text[i] !== 'm' && i < text.length) {
          sequence += text[i]

          i++
        }

        if (text[i] === 'm') sequence += 'm'
        else i = oldIndex
      } else {
        if (sequence === undefined) characters.push({ text: text[i] })
        else {
          characters.push({ sequence, text: text[i] })
  
          sequence = '' 
        }
      }
    }

    return characters
  }

  /** Handle user input */
  private _handleInput (key: Buffer): void {
    const hex = key.toString('hex')

    if ([...keys.upArrow, ...keys.downArrow, ...keys.leftArrow, ...keys.rightArrow].includes(hex)) {
      if (this._data.currentPage !== undefined) {
        const page = this._pages[this._data.currentPage]

        if (keys.upArrow.includes(hex) && (this._options.allowScroll === undefined || this._options.allowScroll === true)) {
          if (page.cursorY > page.scrollY) page.cursorY--
          else if (page.scrollY > 0) {
            page.cursorY--
            page.scrollY--
          }

          this._callEvent('scroll', { page: this._data.currentPage, cursorY: page.cursorY, scrollY: page.scrollY })
        } else if (keys.downArrow.includes(hex) && (this._options.allowScroll === undefined || this._options.allowScroll === true)) {
          const size = this._getSize()

          if (page.cursorY - page.scrollY < (size.height - this._layout.length) - 1 && page.cursorY < page.content.length - 1) page.cursorY++
          else if (page.cursorY < page.content.length - 1) {
            page.cursorY++
            page.scrollY++
          }

          this._callEvent('scroll', { page: this._data.currentPage, cursorY: page.cursorY, scrollY: page.scrollY })
        } else if (keys.leftArrow.includes(hex) && (this._options.allowSwitchPage === undefined || this._options.allowSwitchPage === true)) {
          const pages = Object.keys(this._pages)

          if (pages.indexOf(this._data.currentPage) < 1) this._data.currentPage = pages[pages.length - 1]
          else this._data.currentPage = pages[pages.indexOf(this._data.currentPage) - 1]

          this._callEvent('switchPage', this._data.currentPage)
        } else if (keys.rightArrow.includes(hex) && (this._options.allowSwitchPage === undefined || this._options.allowSwitchPage === true)) {
          const pages = Object.keys(this._pages)

          if (pages.indexOf(this._data.currentPage) > pages.length - 2) this._data.currentPage = pages[0]
          else this._data.currentPage = pages[pages.indexOf(this._data.currentPage) + 1]

          this._callEvent('switchPage', this._data.currentPage)
        }
      }
    } else if (keys.enter.includes(hex)) {
      if (this._data.input.length > 0) {
        this._callEvent('enter', this._data.input)

        this._data.input = ''
      } else if (this._data.currentPage !== undefined) this._callEvent('select', { page: this._data.currentPage, cursorY: this._pages[this._data.currentPage].cursorY })
    } else if (keys.backspace.includes(hex)) {
      if (this._data.input.length > 0) this._data.input = this._data.input.substring(0, this._data.input.length - 1)

      this._callEvent('input', this._data.input)
    } else {
      const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]*$/

      if (regex.test(key.toString())) this._data.input += key.toString()

      this._callEvent('input', key)
    }

    this._callEvent('keydown', key)
  }

  /** Call an event */
  private _callEvent (type: string, data: any): void {
    Object.keys(this._listeners).forEach((id) => {
      if (this._listeners[id].type === type) this._listeners[id].callback(data)
    })
  }
}

/** All available components */
class Components {
  public static blank (): Component {return { type: 'blank' }}
  public static text (callback: () => string): Component {return { type: 'text', callback }}
  public static pageTabs (): Component {return { type: 'pageTabs' }}
  public static pageContent (): Component {return { type: 'pageContent' }}
  public static input (placeholder?: string): Component {return { type: 'input', placeholder }}
}

/** Generate ID*/
function generateID (length: number, keys: string[]): string {
  let id = generateAnID(length)

  while (keys.includes(id)) id = generateAnID(length)

  return id
}

/** Generate an ID */
function generateAnID (length: number): string {
  let string: string = ''

  for (let i = 0; i < length; i++) string += letters[getRandom(0, letters.length - 1)]

  return string
}

/** Get a random number */
function getRandom (min: number, max: number): number {
  return Math.floor(Math.random() * max) + min 
}

/** All available text colors */
const TextColor: { [key: string]: string } = {
  reset: '\x1b[0m',

  red: '\x1b[31m',
  brightRed: '\x1b[92m',

  yellow: '\x1b[33m',
  brightYellow: '\x1b[93m',

  green: '\x1b[32m',
  brightGreen: '\x1b[92m',

  cyan: '\x1b[36m',
  brightCyan: '\x1b[96m',

  blue: '\x1b[34m',
  brightBlue: '\x1b[94m',

  purple: '\x1b[35m',
  brightPurple: '\x1b[95m',

  white: '\x1b[97m',
  black: '\x1b[30m',
  gray: '\x1b[90m'
}

/** All available background colors */
const BackgroundColor: { [key: string]: string } = {
  reset: '\x1b[0m',

  red: '\x1b[41m',
  brightRed: '\x1b[101m',

  yellow: '\x1b[43m',
  brightYellow: '\x1b[103m',

  green: '\x1b[42m',
  brightGreen: '\x1b[102m',

  cyan: '\x1b[46m',
  brightCyan: '\x1b[106m',

  blue: '\x1b[44m',
  brightBlue: '\x1b[104m',

  purple: '\x1b[104m',
  brightPurple: '\x1b[105m',

  white: '\x1b[107m',
  black: '\x1b[40m',
  gray: '\x1b[100m'
}

/** Options for DynamicCLI */
interface DynamicCliOptions {
  render?: boolean,
  renderInterval?: number,

  pagePrefix_notSelected?: string,
  pagePrefix_selected?: string,

  allowInput?: boolean,
  allowScroll?: boolean,
  allowSwitchPage?: boolean
}

/** A component */
interface Component {
  type: string,

  [key: string]: any
}

/** Style for DynamicCLI */
interface Style {
  background: string,

  background_notSelected: string,
  text_notSelected: string 
  background_selected: string,
  text_selected: string,
}

/** A page */
interface Page {
  name: string,
  callback: () => string[],

  content: string[],

  cursorY: number,
  scrollY: number
}

/** A listener */
interface Listener {
  type: string,

  callback: (...args: any) => any
}

export { DynamicCLI, Component, TextColor, BackgroundColor }

const keys: { [key: string]: string[] } = {
  upArrow: ['1b5b41'],
  downArrow: ['1b5b42'],
  leftArrow: ['1b5b44'],
  rightArrow: ['1b5b43'],

  enter: ['0d'],
  backspace: ['7f', '08'],
}

const letters: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
