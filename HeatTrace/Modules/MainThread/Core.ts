import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import os from 'os'
import fs from 'fs'

// HeatTrace Core
class HeatTraceCore {
  private _state: 'none' | 'initializing' | 'initialized' = 'none'
  private _options!: HeatTraceOptions

  private _cursorsData: CursorData[] = []
  
  private _frameInterval: number = 0
  private _frames: number = 0

  public WorkerManager = new WorkerManager()

  constructor (options?: HeatTraceOptions_Optional) {
    if (options === undefined) options = {}

    const style = options.style || {}

    const cursor = style.cursor || {}
    const background = style.background || {}

    this._options = {
      width: options.width || 512,
      height: options.height || 384, 

      style: {
        traceSize: style.traceSize || 1,
        heatBoost: style.heatBoost || 1.75,

        cursor: {
          type: cursor.type || 'color',
          distribution: cursor.distribution || 'player',

          size: cursor.size || 1,

          colors: [
            { r: 214, g: 40, b: 40 },
            { r: 247, g: 127, b: 0 },
            { r: 252, g: 191, b: 73 },
            { r: 234, g: 226, b: 183 }
          ],
          images: []
        },

        background: {
          type: background.type || 'none',

          color: { r: 0, g: 0, b: 0 },
          image: ''
        },

        colors: style.colors || [
          { r: 0, g: 0, b: 0 },
          { r: 106, g: 4, b: 15 },
          { r: 208, g: 0, b: 0 },
          { r: 232, g: 93, b: 4 },
          { r: 250, g: 163, b: 7 },
          { r: 255, g: 255, b: 255 }
        ] 
      },

      imageFormat: options.imageFormat || 'png',

      videoFPS: options.videoFPS || 30,
      videoSpeed: options.videoSpeed || 1,

      threads: os.cpus().length / 2 
    }

    this.WorkerManager = new WorkerManager()
  }

  public get state () {return this._state}
  public get options () {return this._options}

  // Initialize HeatTrace
  public async initialize (): Promise<void> {
    if (this._state !== 'none') throw new Error(`Cannot Initialize HeatTrace: ${this._state}`)

    this._state = 'initializing'

    await this.WorkerManager.startWorkers(this._options.threads)
    
    this._state = 'initialized'
  }

  // Load Replays
  public async loadReplays (replaysData: Buffer[], callback?: (info: { total: number, loaded: number }) => any): Promise<{ error: boolean, message?: string, data?: { failed: number }}> {
    if (this._state !== 'initialized') throw new Error(`Cannot Load Replays: ${this._state}`)

    const replays = await this.WorkerManager.createBatch('loadReplays', replaysData, (info) => {
      if (callback !== undefined) callback({ total: info.total, loaded: info.finished })
    })

    const cursorsData: { replayHash: string, playerName: string, xPositions: Float64Array, yPositions: Float64Array, timeStamps: Float64Array }[] = []

    let beatmapHash: undefined | string = undefined 
    let length: number = 0
    let failed: number = 0

    for (let replay of replays) {
      if (replay.error) failed++
      else {
        if (beatmapHash === undefined) beatmapHash = replay.data.beatmapHash
        else if (replay.data.beatmapHash !== beatmapHash) return { error: true, message: 'Found Replays With Different Beatmaps' }

        if (replay.data.timeStamps[replay.data.timeStamps.length - 1] > length) length = replay.data.timeStamps[replay.data.timeStamps.length - 1]

        cursorsData.push({ replayHash: replay.data.replayHash, playerName: replay.data.playerName, xPositions: replay.data.xPositions, yPositions: replay.data.yPositions, timeStamps: replay.data.timeStamps })
      }
    }

    this._cursorsData = cursorsData 

    this._frameInterval = (1000 / this._options.videoFPS) / this.options.videoSpeed
    this._frames = Math.round(length / this._frameInterval)

    return { error: false, data: { failed }}
  }

  // Render An Image
  public async renderImage (progress?: (info: { type: 'calculatingHeatmap' | 'rendering', total: number, finished: number }) => any): Promise<Uint8Array> {
    if (this._state !== 'initialized') throw new Error(`Cannot Calculate An Image: ${this._state}`)

    const heatmap = await this._calculateHeatmap(0, Infinity, (info) => {
      if (progress !== undefined) progress({ type: 'calculatingHeatmap', total: info.total, finished: info.finished })
    })

    if (progress !== undefined) progress({ type: 'rendering', total: 1, finished: 0 })

    const image = (await this.WorkerManager.createBatch('renderImage', [{
      format: this._options.imageFormat,

      width: this._options.width,
      height: this._options.height,

      heatmap: heatmap.data,
      cursors: [],
      
      style: this._options.style
    }]))[0]

    if (progress !== undefined) progress({ type: 'rendering', total: 1, finished: 1 })

    return image
  }

  // Render A Video
  public async renderVideo (dataPath: string, startFrame: number, progress?: (info: { type: 'calculatingHeatmap' | 'rendering' | 'encoding', total: number, finished: number }) => any): Promise<string> {
    if (this._state !== 'initialized') throw new Error(`Cannot Render A Video: ${this._state}`)

    if (startFrame > this._frames) throw new Error(`Start Frame Is Out Of Range: ${startFrame} / ${this._frames}`)

    return new Promise(async (resolve) => {
      if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath)

      if (!fs.existsSync(path.join(dataPath, 'Frames'))) fs.mkdirSync(path.join(dataPath, 'Frames')) 

      for (let i = startFrame; i < this._frames; i++) {
        if (progress !== undefined) progress({ type: 'calculatingHeatmap', total: this._frames, finished: i })

        const heatmap = await this._calculateHeatmap(0, i * this._frameInterval)

        if (progress !== undefined) progress({ type: 'rendering', total: this._frames, finished: i + 1 })

        const image = (await this.WorkerManager.createBatch('renderImage', [{
          format: 'png',

          width: this._options.width,
          height: this._options.height,

          heatmap: heatmap.data,
          cursors: heatmap.cursors,
      
          style: this._options.style
        }]))[0]

        fs.writeFileSync(path.join(dataPath, 'Frames', `${i.toString().padStart(5, '0')}.png`), image)
      }

      if (progress !== undefined) progress({ type: 'encoding', total: this._frames, finished: this._frames })

      ffmpeg(path.join(dataPath, 'Frames', '%05d.png'))
        .setFfmpegPath(ffmpegPath!)

        .output(path.join(dataPath, 'Result.mp4')) 

        .inputFPS(this._options.videoFPS)
        .outputOptions('-pix_fmt yuv420p')
        .outputOptions(`-threads ${this._options.threads}`)

        .once('end', () => resolve(path.join(dataPath, 'Result.mp4')))

        .run()
    })
  }

  // Calculate The Heatmap
  private async _calculateHeatmap (start: number, end: number, progress?: (info: { total: number, finished: number }) => any): Promise<{ cursors: { x: number, y: number }[], data: Float64Array }> {
    if (this._state !== 'initialized') throw new Error(`Cannot Calculate The Heatmap: ${this._state}`)

    const jobs = this._cursorsData.map((cursorData) => {
      return {
        width: this._options.width,
        height: this._options.height,

        start,
        end,

        cursorData,

        style: this.options.style
      }
    })

    return (await this.WorkerManager.createBatch('calculateHeatmaps', jobs, (info) => {
      if (progress !== undefined) progress(info)
    }))[0]
  }
}

// HeatTrace Options
interface HeatTraceOptions {
  width: number,
  height: number,

  style: HeatTraceStyle,

  imageFormat: 'png' | 'jpeg',

  videoFPS: number,
  videoSpeed: number,

  threads: number
}

// HeatTrace Options Optional
interface HeatTraceOptions_Optional {
  width?: number,
  height?: number,

  style?: HeatTraceStyle_Optional,

  imageFormat?: 'png' | 'jpeg',

  videoFPS?: number,
  videoSpeed?: number,

  threads?: number
}

// HeatTrace Style
interface HeatTraceStyle {
  traceSize: number,
  heatBoost: number,

  cursor: {
    type: 'none' | 'color' | 'image',
    distribution: 'player' | 'replay',

    size: number,

    colors: Color.RGB[],
    images: string[]
  },

  background: {
    type: 'none' | 'color' | 'image',

    color: Color.RGB,
    image: string
  },

  colors: Color.RGB[]
}

// HeatTrace Style Optional
interface HeatTraceStyle_Optional {
  traceSize?: number,
  heatBoost?: number,

  cursor?: {
    type?: 'none' | 'color' | 'image',
    distribution?: 'player' | 'replay'

    size?: number,

    colors?: Color.RGB[],
    images?: string[]
  },

  background?: {
    type?: 'none' | 'color' | 'image',

    color?: Color.RGB[],
    image?: string
  }

  colors?: Color.RGB[],
}

export { HeatTraceCore, HeatTraceOptions, HeatTraceOptions_Optional, HeatTraceStyle, HeatTraceStyle_Optional }

import Color from '../Tools/Color'

import { CursorData } from '../ChildThread/Heatmap'
import { WorkerManager } from './Managers/WorkerManager'
