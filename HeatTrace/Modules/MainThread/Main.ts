// HeatTrace
export default class {
  private _Core!: HeatTrace_Core

  constructor (options?: HeatTrace_Options_Optional) {
    this._Core = new HeatTrace_Core(options || {})
  }

  public get state () {return this._Core.state}
  public get options () {return this._Core.options}

  // Initialize HeatTrace
  public async initialize (progress?: (info: { type: 'loadingTextures' | 'startingWorkers' }) => any): Promise<{ error: boolean, message?: string }> {
    return await this._Core.initialize(progress)
  }

  // Terminate HeatTrace
  public async terminate (): Promise<void> {
    await this._Core.terminate()
  }

  // Load Replays
  public async loadReplays (replays: Buffer[], progress?: (info: { total: number, finished: number }) => any): Promise<{ error: boolean, message?: string, data?: { loaded: number, failed: number }}> { 
    return await this._Core.loadReplays(replays, progress)
  }

  // Render An Image
  public async renderImage (frame?: undefined | number, progress?: (info: { type: 'calculatingHeatmaps' | 'renderingLayers' | 'encodingImage', total: number, finished: number }) => any): Promise<any> {
    return await this._Core.renderImage(frame, progress)
  }

    // Render A Video
  public async renderVideo (cachePath: string, start?: undefined | number, end?: undefined | number, progress?: (info: { total: number, finished: number }) => any): Promise<string> {
    return await this._Core.renderVideo(cachePath, start, end, progress)
  }
}

import HeatTrace_Core from './Core'

import { HeatTrace_Options_Optional } from '../../Types/HeatTrace_Options'
