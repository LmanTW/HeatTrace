// Timer Manager
export default class {
  private _interval: undefined | NodeJS.Timeout = undefined

  private _timers: { [key: string]: Timer } = {}

  // Create A Timeout
  public createTimeout (ms: number, callback: () => any): string {
    const id = generateID(5, Object.keys(this._timers))

    this._timers[id] = {
      times: 1,
      interval: ms,

      callback2: callback,

      count: 0,
      lastUpdateTime: performance.now()
    }

    if (this._interval === undefined) this._start()

    return id
  }

  // Create An Interval 
  public createInterval (interval: number, callback: (count?: number) => any): string {
    const id = generateID(5, Object.keys(this._timers))

    this._timers[id] = {
      times: Infinity,
      interval,

      callback,

      count: 0,
      lastUpdateTime: performance.now()
    }

    if (this._interval === undefined) this._start()

    return id
  }

  // Create A Loop
  public createLoop (times: number, interval: number, callback: (count?: number) => any, callback2?: () => any): string {
    const id = generateID(5, Object.keys(this._timers))

    this._timers[id] = {
      times,
      interval,

      callback,
      callback2,
        
      count: 0,
      lastUpdateTime: performance.now()
    }

    if (this._interval === undefined) this._start()

    return id
  }

  // Delete A Timer
  public deleteTimer (id: string): void {
    if (this._timers[id] === undefined) throw new Error(`Timer Not Found: "${id}"`)

    delete this._timers[id]

    if (Object.keys(this._timers).length === 0) {
      clearInterval(this._interval)

      this._interval = undefined
    }
  }

  // Delete All Timers
  public deleteAllTimers (): void {
    Object.keys(this._timers).forEach((id) => this.deleteTimer(id))
  }

  // Start The Timer
  private _start (): undefined {
    this._interval = setInterval(() => {
      const time = performance.now()

      Object.keys(this._timers).forEach((id) => {
        const timer = this._timers[id]

        if (timer !== undefined && time - timer.lastUpdateTime >= timer.interval) {
          if (timer.callback !== undefined) timer.callback(timer.count)

          timer.lastUpdateTime = time

          if (timer.times !== Infinity) {
            timer.count++

            if (timer.count === timer.times) {
              if (timer.callback2 !== undefined) timer.callback2()

              delete this._timers[id]
            }
          }
        }
      })
    }, 1)
  }
}

// Timer
interface Timer {
  times: number,
  interval: number,

  callback?: (count?: number) => any,
  callback2?: () => any,

  count: number,
  lastUpdateTime: number
}

import generateID from '../../Tools/GenerateID'
