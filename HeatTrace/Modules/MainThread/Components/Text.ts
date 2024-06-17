import measureText from '../../Tools/MeasureText'
import placeText from '../../Tools/PlaceText'

import { Component } from './Main'

// Text
export default class extends Component {
  private _content!: string

  private _x!: number
  private _y!: number
  private _width!: number
  private _height!: number

  private _style!: ComponentStyle

  constructor (content: string, x: number, y: number, style?: ComponentStyle) {
    super()

    this._content = content
    
    this._x = x
    this._y = y

    this._style = style || {}

    this._measure()
  }

  // Set The Content
  public setContent (content: string): void {
    this._content = content

    this._measure()
  }

  // Render The Component
  public render (width: number, height: number, lines: string[]): void {
    let x!: number
    let y!: number

    if (this._style.horizontalAlign === 'left' || this._style.horizontalAlign === undefined) x = this._x
    else if (this._style.horizontalAlign === 'center') x = ((width / 2) - (this._width / 2)) + this._x
    else if (this._style.horizontalAlign === 'right') x = (width - this._width) + this._x

    if (this._style.verticalAlign === 'top' || this._style.verticalAlign === undefined) y = this._y
    else if (this._style.verticalAlign === 'center') y = ((height / 2) - (this._height / 2)) + this._y
    else if (this._style.verticalAlign === 'bottom') y = (height - this._height) + this._y

    this._content.split('\n').forEach((line, index) => lines[Math.round(y + index)] = placeText(line, Math.round(x)))
  }

  // Measure The Component
  private _measure (): void {
    let maxWidth: number = 0

    const lines = this._content.split('\n')

    lines.forEach((line) => {
      const width = measureText(line)

      if (width > maxWidth) maxWidth = width
    })

    this._width = maxWidth
    this._height = lines.length
  }
}

// Component Style
interface ComponentStyle {
  horizontalAlign?: 'left' | 'center' | 'right',
  verticalAlign?: 'top' | 'center' | 'bottom'
}
