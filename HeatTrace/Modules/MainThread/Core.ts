import path from 'path'
import fs from 'fs'

// HeatTrace Core
export default class {
  private _state: 'none' | 'initializing' | 'initialized' | 'terminating' = 'none'
  private _options!: HeatTrace_Options

  public WorkerManager!: WorkerManager
  public TextureManager!: TextureManager
  public ReplayManager!: ReplayManager

  private _cursorsData: CursorData[] = []

  private _frames: number = 0
  private _frameInterval: number = 0

  constructor (options: HeatTrace_Options_Optional) {
    this._options = getCompleteOptions(options)

    checkOptions(this._options)

    this.WorkerManager = new WorkerManager()
    this.TextureManager = new TextureManager(this)
    this.ReplayManager = new ReplayManager(this)
  }

  public get state () {return this._state}
  public get options () {return this._options}
  public get cursorsData () {return this._cursorsData}
  public get frameInterval () {return this._frameInterval}
  public get frames () {return this._frames}

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

    this._state = 'none'
  }

  // Load Replays
  public async loadReplays (replays: Buffer[], progress?: (info: { total: number, finished: number }) => any): Promise<{ error: boolean, message?: string, data?: { loaded: number, failed: number }}> {
    if (this._state !== 'initialized') throw new Error(`Cannot Load Replays: ${this._state}`)

    const result = this.

    const jobs: Job_Data[] = replays.map((replay) => {
      return {
        type: 'loadReplay',

        data: replay,

        maxCursorTravelDistance: this._options.maxCursorTravelDistance
      }
    })

    const results = await this.WorkerManager.createBatch(jobs, progress) as Job_Result_LoadReplay[]

    let beatmapHash!: string
    let maxLength: number = 0

    let failed: number = 0

    const cursorsData: CursorData[] = []

    for (let result of results) {
      if (result.error) failed++
      else {
        if (beatmapHash === undefined) beatmapHash = result.data!.beatmapHash
        else if (result.data!.beatmapHash !== beatmapHash) return { error: true, message: 'Found Replays With Different Beatmaps' }

        const length = result.data!.cursorData.timeStamps[result.data!.cursorData.timeStamps.length - 1]

        if (length > maxLength) maxLength = length 

        cursorsData.push(result.data!.cursorData)
      }
    }

    this._cursorsData = cursorsData

    this._frameInterval = (1000 / this._options.videoFPS) / this._options.videoSpeed
    this._frames = Math.round(maxLength / this._frameInterval)

    return { error: false, data: { loaded: replays.length, failed }}
  }

  // Render An Image
  public async renderImage (frame?: undefined | number, progress?: (info: { type: 'calculatingHeatmaps' | 'renderingLayers' | 'encodingImage', total: number, finished: number }) => any): Promise<Uint8Array> {
    if (this._state !== 'initialized') throw new Error(`Cannot Render An Image: ${this._state}`)

    checkValues([
      { name: 'frame', value: frame, min: 1, max: this._frames }
    ])

    return new Uint8Array((await this.WorkerManager.createBatch([{
      type: 'renderImage',
      
      format: this._options.imageFormat,

      width: this._options.width,
      height: this._options.height,
      
      layers: await renderFrame(this, defaultValue(frame, this._frames), progress)
    }]) as Job_Result_RenderImage[])[0].data)
  }

  // Render A Video
  public async renderVideo (cachePath: string, start?: undefined | number, end?: undefined | number, progress?: (info: { total: number, finished: number }) => any): Promise<void> {
    if (this._state !== 'initialized') throw new Error(`Cannot Render An Image: ${this._state}`)

    start = defaultValue(start, 1)
    end = defaultValue(end, this._frames)

    checkValues([
      { name: 'start', value: start, min: 1, max: Math.min(end, this._frames) },
      { name: 'end', value: end, min: Math.max(defaultValue(start, 1), 1), max: this._frames }
    ])
  
    for (let i = defaultValue(start, 1); i < defaultValue(end, this._frames); i++) {

    }
  }
}

import { HeatTrace_Options, HeatTrace_Options_Optional } from '../../Types/HeatTrace_Options' 
import { Job_Result_LoadReplay, Job_Result_RenderImage } from '../../Types/Job_Result'
import { Job_Data } from '../../Types/Job_Data'

import defaultValue from '../Tools/DefaultValue'
import checkValues from '../Tools/CheckValues'

import { checkOptions, getCompleteOptions } from './Options'
import { TextureManager } from './Managers/TextureManager'
import { WorkerManager } from './Managers/WorkerManager'
import ReplayManager from './Managers/ReplayManager'
import ReplayManager from './Managers/ReplayManager'
import { CursorData } from '../ChildThread/CursorData'
import ReplayManager from './Managers/ReplayManager'
import renderFrame from './RenderFrame'

