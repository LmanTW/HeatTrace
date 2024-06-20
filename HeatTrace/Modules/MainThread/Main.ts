// HeatTrace
export default class {
  private _Core!: HeatTraceCore

  constructor (options?: HeatTraceOptions_Optional) {
    this._Core = new HeatTraceCore(options)
  }

  // Initialize HeatTrace
  public async initialize (): Promise<void> {
    await this._Core.initialize()
  } 

  // Load Replays
  public async loadReplays (replaysData: Buffer[], callback?: (info: { total: number, loaded: number }) => any): Promise<{ error: boolean, message?: string, data?: { failed: number }}> {
    return await this._Core.loadReplays(replaysData, callback)
  }

  // Render Image
  public async renderImage (callback?: (info: { type: 'calculatingHeatmap' | 'rendering', total: number, finished: number }) => any): Promise<any> {
    return await this._Core.renderImage(callback)
  }

  // Render A Video
  public async renderVideo (dataPath: string, startFrame: number, progress?: (info: { totalFrames: number, finishedFrames: number, type: 'calculatingHeatmap' | 'rendering', total: number, finished: number }) => any): Promise<any> {
    await this._Core.renderVideo(dataPath, startFrame, progress)
  }
}

import { HeatTraceCore, HeatTraceOptions_Optional } from './Core'
