import { measureText, placeText, Text } from '../../../Tools/Text'

import { Component, ComponentStyle } from './Main'

export default class extends Component {
  private _tasks!: Task[]

  private _x!: number
  private _y!: number
  private _width!: number
  private _height!: number

  private _style!: TaskStyle

  constructor (tasks: Task[], x: number, y: number, style?: TaskStyle) {
    super()

    if (tasks.length === 0) throw new Error('No Tasks Provided')

    this._tasks = tasks

    this._x = x
    this._y = y

    this._style = style || {}

    this._measure()
  }

  // Set A Task
  public setTask (id: string, state?: 'waiting' | 'inProgress' | 'finished', name?: string): void {
    this._tasks.forEach((task) => {
      if (task.id === id) {
        if (state !== undefined) task.state = state
        if (name !== undefined) {
          task.name = name

          this._measure()
        }
      }
    })
  }

  // Render The Component
  public render (width: number, height: number, lines: string[]): void {
    let x!: number
    let y!: number

    if (this._style.horizontalAlign === 'left' || this._style.horizontalAlign === undefined) x = Math.round(this._x) 
    else if (this._style.horizontalAlign === 'center') x = Math.round((width / 2) - (this._width / 2)) + this._x
    else if (this._style.horizontalAlign === 'right') x = Math.round(width - this._width) + this._x

    if (this._style.verticalAlign === 'top' || this._style.verticalAlign === undefined) y = Math.round(this._y) 
    else if (this._style.verticalAlign === 'center') y = Math.round((height / 2) - (this._height / 2)) + this._y
    else if (this._style.verticalAlign === 'bottom') y = Math.round(height - this._height) + this._y

    this._tasks.forEach((task, index) => {
      const taskY = Math.round(y + index)

      if (taskY >= 0 && taskY < height) {
        let taskX!: number
        let string!: string

        if (task.state === 'waiting') string = `◇ ${task.name}`
        else if (task.state === 'inProgress') string = Text.yellow(`${animationFrames[Math.round((performance.now() / 100) % (animationFrames.length - 1))]} ${task.name}`)
        else if (task.state === 'finished') string = Text.green(`✓ ${task.name}`)

        if (this._style.taskAlign === 'left' || this._style.taskAlign === undefined) taskX = x 
        else if (this._style.taskAlign === 'center') taskX = x + Math.round((this._width / 2) - (measureText(string) / 2))
        else if (this._style.taskAlign === 'right') taskX = x + Math.round((this._width / 2) - measureText(string))

        lines[taskY] = placeText(width, lines[taskY], string, taskX)
      }
    })
  }

  // Keydown
  public keydown (): void {}

  // Measure The Component
  private _measure (): void {
    let maxWidth: number = 0

    this._tasks.forEach((task, index) => {
      const width = measureText(task.name.split('\n')[0]) + 1

      if (width > maxWidth) maxWidth = width
    })

    this._width = maxWidth
    this._height = this._tasks.length
  }
} 

// Tasks Style
interface TaskStyle extends ComponentStyle {
  taskAlign?: 'left' | 'center' | 'right'
}

// Task
interface Task {
  id: string, 

  state: 'waiting' | 'inProgress' | 'finished',

  name: string
}

const animationFrames: string[] = ['⠙', '⠸', '⢰', '⣠', '⣄', '⡆', '⠇', '⠋']
