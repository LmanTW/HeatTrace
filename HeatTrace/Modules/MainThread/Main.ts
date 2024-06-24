// HeatTrace
export default class {
  private _Core!: HeatTrace_Core

  constructor (options?: HeatTrace_Options_Optional) {
    this._Core = new HeatTrace_Core(options || {})
  }

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
  public async renderImage (frame?: undefined | number, progress?: (info: { type: 'calculatingHeatmaps' | 'renderingImage', total: number, finished: number }) => any): Promise<any> {
    return await this._Core.renderImage(frame, progress)
  }
}

import HeatTrace_Core from './Core'

import { HeatTrace_Options_Optional } from '../../Types/HeatTrace_Options'
