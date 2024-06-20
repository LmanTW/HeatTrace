import os from 'os'

// HeatTrace Core
class HeatTraceCore {
  private _state: 'none' | 'initializing' | 'initialized' = 'none'
  private _options!: HeatTraceOptions
  private _style!: HeatTraceStyle

  private _replaysCursorData: { xPositions: Float64Array, yPositions: Float64Array, timeStamps: Float64Array }[] = []
  private _length: number = 0

  public WorkerManager = new WorkerManager()

  constructor (options?: HeatTraceOptions) {
    this._options = options || {}

    const style = this.options.style || {}

    this._style = {
      traceSize: style.traceSize || 1,
      heatBoost: style.traceSize || 1.75,

      colors: style.colors || [
        { r: 0, g: 0, b: 0 },
        { r: 106, g: 4, b: 15 },
        { r: 208, g: 0, b: 0 },
        { r: 232, g: 93, b: 4 },
        { r: 250, g: 163, b: 7 },
        { r: 255, g: 255, b: 255 }
      ]
    }

    if (this._options.style === undefined) this._options.style = {}
  }

  public get state () {return this._state}
  public get options () {return this._options}

  // Initialize HeatTrace
  public async initialize (): Promise<void> {
    if (this._state !== 'none') throw new Error(`Cannot Initialize HeatTrace: ${this._state}`)

    this._state = 'initializing'

    await this.WorkerManager.startWorkers(this._options.threads || os.cpus().length / 2)
    
    this._state = 'initialized'
  }

  // Load Replays
  public async loadReplays (replaysData: Buffer[], callback?: (info: { total: number, loaded: number }) => any): Promise<{ error: boolean, message?: string, data?: { failed: number }}> {
    if (this._state !== 'initialized') throw new Error(`Cannot Load Replays: ${this._state}`)

    const replays = await this.WorkerManager.createBatch('loadReplays', replaysData, (info) => {
      if (callback !== undefined) callback({ total: info.total, loaded: info.finished })
    })

    const replaysCursorData: { xPositions: Float64Array, yPositions: Float64Array, timeStamps: Float64Array }[] = []

    let beatmapHash: undefined | string = undefined 
    let length: number = 0
    let failed: number = 0

    for (let replay of replays) {
      if (replay.error) failed++
      else {
        if (beatmapHash === undefined) beatmapHash = replay.data.beatmapHash
        else if (replay.data.beatmapHash !== beatmapHash) return { error: true, message: 'Found Replays With Different Beatmaps' }

        if (replay.data.timeStamps[replay.data.timeStamps.length - 1] > length) length = replay.data.timeStamps[replay.data.timeStamps.length - 1]

        replaysCursorData.push({ xPositions: replay.data.xPositions, yPositions: replay.data.yPositions, timeStamps: replay.data.timeStamps })
      }
    }

    this._replaysCursorData = replaysCursorData 
    this._length = length

    return { error: false, data: { failed }}
  }

  // Render An Image
  public async renderImage (callback?: (info: { type: 'calculatingHeatmap' | 'rendering', total: number, finished: number }) => any): Promise<Uint8Array> {
    if (this._state !== 'initialized') throw new Error(`Cannot Calculate The Heatmap: ${this._state}`)

    const heatmap = await this._calculateHeatmap(0, Infinity, (info) => {
      if (callback !== undefined) callback({ type: 'calculatingHeatmap', total: info.total, finished: info.finished })
    })

    if (callback !== undefined) callback({ type: 'rendering', total: 1, finished: 0 })

    const image = (await this.WorkerManager.createBatch('renderImage', [{
      format: this._options.imageFormat || 'png',

      width: this._options.width || 512,
      height: this._options.height || 384,

      heatmap,
      
      style: this._style
    }]))[0]

    if (callback !== undefined) callback({ type: 'rendering', total: 1, finished: 1 })

    return image
  }

  // Render A Video
  public async renderVideo (): Promise<void> {
  }

  // Calculate The Heatmap
  private async _calculateHeatmap (start: number, end: number, callback?: (info: { total: number, finished: number }) => any): Promise<any> {
    if (this._state !== 'initialized') throw new Error(`Cannot Calculate The Heatmap: ${this._state}`)

    const jobs = this._replaysCursorData.map((replayCursorData) => {
      return {
        width: this._options.width || 512,
        height: this._options.height || 384,

        start,
        end,

        replayCursorData,

        style: this._style
      }
    })

    const heatmaps = await this.WorkerManager.createBatch('calculateHeatmaps', jobs, (info) => {
      if (callback !== undefined) callback(info)
    })

    return (await this.WorkerManager.createBatch('combineBeatmaps', [{
      width: this._options.width || 512,
      height: this._options.height || 384,

      heatmaps
    }]))[0]
  }
}

// HeatTrace Options
interface HeatTraceOptions {
  width?: number,
  height?: number,

  style?: HeatTraceStyle_Optional 

  imageFormat?: 'png' | 'jpeg',

  videoFPS?: number,
  videoSpeed?: number,

  threads?: number
}

// HeatTrace Style
interface HeatTraceStyle {
  traceSize: number,
  heatBoost: number,

  colors: Color.RGB[]
}

// HeatTrace Style Optional
interface HeatTraceStyle_Optional {
  traceSize?: number,
  heatBoost?: number,

  colors?: Color.RGB[]
}

export { HeatTraceCore, HeatTraceOptions, HeatTraceStyle, HeatTraceStyle_Optional }

import Color from '../Tools/Color'

import { WorkerManager } from './Managers/WorkerManager'
