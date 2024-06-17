import { Component } from './Main'

import measureText from '../../Tools/MeasureText'
import placeText from '../../Tools/PlaceText'

// Select Menu
class SelectMenu extends Component {
  private _options!: Option[]
  private _selected: number = 0

  private _x!: number
  private _y!: number
  private _width!: number
  private _height!: number

  private _style!: ComponentStyle

  constructor (options: Option[], x: number, y: number, style?: ComponentStyle) {
    super()

    if (options.length === 0) throw new Error('No Options Provided')

    this._options = options

    this._x = x
    this._y = y

    this._style = style || {}
  }

  // Set The Options
  public setOptions (options: Option[]): void {
    if (options.length === 0) throw new Error('No Options Provided')

    this._options = options
  }

  // Render The Component
  public render(width: number, height: number, lines: string[]): void {
    this._measure()

    let x!: number
    let y!: number

    if (this._style.horizontalAlign === 'left' || this._style.horizontalAlign === undefined) x = this._x
    else if (this._style.horizontalAlign === 'center') x = ((width / 2) - (this._width / 2)) + this._x
    else if (this._style.horizontalAlign === 'right') x = (width - this._width) + this._x

    if (this._style.verticalAlign === 'top' || this._style.verticalAlign === undefined) y = this._y
    else if (this._style.verticalAlign === 'center') y = ((height / 2) - (this._height / 2)) + this._y
    else if (this._style.verticalAlign === 'bottom') y = (height - this._height) + this._y

    const prefix_notSelected = (this._style.prefix_notSelected === undefined) ? '' : this._style.prefix_notSelected
    const suffix_notSelected = (this._style.suffix_notSelected === undefined) ? '' : this._style.suffix_notSelected
    const prefix_selected = (this._style.prefix_selected === undefined) ? '> ' : this._style.prefix_selected
    const suffix_selected = (this._style.suffix_selected === undefined) ? ' <' : this._style.suffix_selected

    this._options.forEach((option, index) => {
      let optionX!: number

      let string = (index === this._selected) ? `${prefix_selected}${option.name(true)}${suffix_selected}` : `${prefix_notSelected}${option.name(false)}${suffix_notSelected}`

      let optionAlign = this._style.optionAlign || option.optionAlign

      if (optionAlign === 'left' || optionAlign === undefined) optionX = x 
      else if (optionAlign === 'center') optionX = x + ((this._width / 2) - (measureText(string) / 2))
      else if (optionAlign === 'right') optionX = x + ((this._width / 2) - measureText(string))

      lines[Math.round(y + index)] = placeText(string, Math.round(optionX))
    })
  }

  // Handle Keydown Event
  public keydown (key: Buffer): void {
    const hex = key.toString('hex')

    if (hex === '1b5b41') {
      this._selected--

      if (this._selected < 0) {
        if (this._style.loop) this._selected = this._options.length - 1
        else this._selected = 0
      }
    } else if (hex === '1b5b42') {
      this._selected++

      if (this._selected >= this._options.length) {
        if (this._style.loop) this._selected = 0
        else this._selected = this._options.length - 1
      }
    } else if (this._options[this._selected].selected !== undefined) {
      if (hex === '0d') this._options[this._selected].selected!(this, 'none')
      else if (hex === '1b5b44') this._options[this._selected].selected!(this,'left')
      else if (hex === '1b5b43') this._options[this._selected].selected!(this,'right')
    }
  } 

  // Measure The Component
  private _measure (): void {
    let maxWidth: number = 0

    const prefix_selected = (this._style.prefix_selected === undefined) ? '> ' : this._style.prefix_selected
    const suffix_selected = (this._style.suffix_selected === undefined) ? ' <' : this._style.suffix_selected

    this._options.forEach((option, index) => {
      const width = measureText(`${prefix_selected}${option.name(index === this._selected)}${suffix_selected}`)

      if (width > maxWidth) maxWidth = width
    })

    this._width = maxWidth
    this._height = this._options.length
  }
}

// Component Style
interface ComponentStyle {
  prefix_notSelected?: string,
  suffix_notSelected?: string,
  prefix_selected?: string,
  suffix_selected?: string,

  horizontalAlign?: 'left' | 'center' | 'right',
  verticalAlign?: 'top' | 'center' | 'bottom',

  optionAlign?: 'left' | 'center' | 'right',

  loop?: boolean
}

// Option
interface Option {
  name: (selected: boolean) => string,
  selected?: (selectMenu: SelectMenu, direction: 'left' | 'none' | 'right') => any,

  optionAlign?: 'left' | 'center' | 'right'
}

export default SelectMenu
