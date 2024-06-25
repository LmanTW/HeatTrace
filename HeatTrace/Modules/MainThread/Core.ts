import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'

// HeatTrace Core
export default class {
  private _state: 'none' | 'initializing' | 'initialized' | 'terminating' = 'none'
  private _options!: HeatTrace_Options

  public WorkerManager!: WorkerManager
  public TextureManager!: TextureManager
  public ReplayManager!: ReplayManager

  constructor (options: HeatTrace_Options_Optional) {
    this._options = getCompleteOptions(options)

    checkOptions(this._options)

    this.WorkerManager = new WorkerManager()
    this.TextureManager = new TextureManager(this)
    this.ReplayManager = new ReplayManager(this)
  }

  public get state () {return this._state}
  public get options () {return this._options}

  // Initialize HeatTrace
  public async initialize (progress?: (info: { type: 'loadingTextures' | 'startingWorkers' }) => any): Promise<{ error: boolean, message?: string }> {
    if (this._state !== 'none') throw new Error(`Cannot Initialize HeatTrace: ${this._state}`)

    this._state = 'initializing'

    if (progress !== undefined) progress({ type: 'startingWorkers' })

    await this.WorkerManager.startWorkers(this._options.threads, this.TextureManager.textures)

    if (progress !== undefined) progress({ type: 'loadingTextures' })

    await this.TextureManager.loadTextures()

    this._state = 'initialized'

    return { error: false }
  }

  // Terminate HeatTrace
  public async terminate (): Promise<void> {
    if (this._state !== 'initialized') throw new Error(`Cannot Load Terminate HeatTrace: ${this._state}`)

    this._state = 'terminating'

    await this.WorkerManager.stopWorkers()
    this.TextureManager.unloadTextures()
    this.ReplayManager.unloadReplays()

    this._state = 'none'
  }

  // Load Replays
  public async loadReplays (replays: Buffer[], progress?: (info: { total: number, finished: number }) => any): Promise<{ error: boolean, message?: string, data?: { loaded: number, failed: number }}> {
    if (this._state !== 'initialized') throw new Error(`Cannot Load Replays: ${this._state}`)

    const result = await this.ReplayManager.loadReplays(replays, progress)

    if (result.error) return { error: true, message: result.message }

    return { error: false, data: { loaded: result.data!.loaded, failed: result.data!.failed }}
  }

  // Render An Image
  public async renderImage (frame?: undefined | number, progress?: (info: { type: 'calculatingHeatmaps' | 'renderingLayers' | 'encodingImage', total: number, finished: number }) => any): Promise<Uint8Array> {
    if (this._state !== 'initialized') throw new Error(`Cannot Render An Image: ${this._state}`)

    checkValues([
      { name: 'frame', value: frame, min: 1, max: this.ReplayManager.frames }
    ]) 

    const image = new Uint8Array((await this.WorkerManager.createBatch([{
      type: 'renderImage',
      
      format: this._options.imageFormat,

      width: this._options.width,
      height: this._options.height,
      
      layers: await renderLayers(this, defaultValue(frame, this.ReplayManager.frames), progress)
    }], (info) => {
      if (progress !== undefined) progress({ type: 'encodingImage', total: info.total, finished: info.finished })
    }) as Job_Result_RenderImage[])[0].data)

    return image 
  }

  // Render A Video
  public async renderVideo (cachePath: string, start?: undefined | number, end?: undefined | number, progress?: (info: { type: 'renderingFrames' | 'encodingVideo', total: number, finished: number }) => any): Promise<string> {
    if (this._state !== 'initialized') throw new Error(`Cannot Render An Image: ${this._state}`)

    start = defaultValue(start, 1)
    end = defaultValue(end, this.ReplayManager.frames)

    checkValues([
      { name: 'start', value: start, min: 1, max: end },
      { name: 'end', value: end, min: Math.max(start, 1), max: this.ReplayManager.frames }
    ])

    return new Promise(async (resolve) => {
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath)
      if (!fs.existsSync(path.join(cachePath, 'Frames'))) fs.mkdirSync(path.join(cachePath, 'Frames')) 

      if (progress !== undefined) progress({ type: 'renderingFrames', total: end - start, finished: 0 })
  
      for (let i = start; i < end; i++) {
        if (progress !== undefined) progress({ type: 'renderingFrames', total: end - start, finished: i - start })

        const image = new Uint8Array((await this.WorkerManager.createBatch([
          {
            type: 'renderImage',
          
            format: 'png',

            width: this._options.width,
            height: this._options.height,
  
            layers: await renderLayers(this, i)
          }
        ]) as Job_Result_RenderImage[])[0].data)

        fs.writeFileSync(path.join(cachePath, 'Frames', `${i.toString().padStart(5, '0')}.png`), image)
      }

      if (progress !== undefined) progress({ type: 'encodingVideo', total: 0, finished: 0 })

      ffmpeg(path.join(cachePath, 'Frames', '%05d.png'))
        .setFfmpegPath(ffmpegPath!)

        .output(path.join(cachePath, 'Result.mp4')) 

        .inputFPS(this._options.videoFPS)
        .outputOptions('-pix_fmt yuv420p')
        .outputOptions(`-threads ${this._options.threads}`)

        .once('end', () => {
          if (progress !== undefined) progress({ type: 'encodingVideo', total: 0, finished: 0 })

          resolve(path.join(cachePath, 'Result.mp4'))
        })

        .run() 
    })
  }
}

import { HeatTrace_Options, HeatTrace_Options_Optional } from '../../Types/HeatTrace_Options' 
import {Job_Result_RenderImage } from '../../Types/Job_Result'

import defaultValue from '../Tools/DefaultValue'
import checkValues from '../Tools/CheckValues'

import { checkOptions, getCompleteOptions } from './Options'
import { TextureManager } from './Managers/TextureManager'
import { WorkerManager } from './Managers/WorkerManager'
import ReplayManager from './Managers/ReplayManager'
import renderLayers from './RenderLayers'

