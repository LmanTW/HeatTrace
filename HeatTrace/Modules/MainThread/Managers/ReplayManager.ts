// Replay Manager
export default class {
  private _Core!: HeatTrace_Core

  private _cursorsData: CursorData[] = []

  private _frames: number = 0
  private _frameInterval: number = 0

  constructor (Core: HeatTrace_Core) {
    this._Core = Core
  }

  public get cursorsData () {return this._cursorsData}
  public get frames () {return this._frames}
  public get frameInterval () {return this._frameInterval}

  // Load Replays
  public async loadReplays (replays: Buffer[], progress?: (info: { total: number, finished: number }) => any): Promise<{ error: boolean, message?: string, data?: { loaded: number, failed: number }}> {
    if (this._Core.state !== 'initialized') throw new Error(`Cannot Load Replays: ${this._Core.state}`)

    const jobs: Job_Data[] = replays.map((replay) => {
      return {
        type: 'loadReplay',

        data: replay,

        maxCursorTravelDistance: this._Core.options.maxCursorTravelDistance
      }
    })

    const results = await this._Core.WorkerManager.createBatch(jobs, progress) as Job_Result_LoadReplay[]

    let beatmapHash!: string
    let maxLength: number = 0

    let loaded: number = 0
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

        loaded++
      }
    }

    this._cursorsData = cursorsData

    this._frameInterval = (1000 / this._Core.options.videoFPS) / this._Core.options.videoSpeed
    this._frames = Math.round(maxLength / this._frameInterval)

    return {
      error: false,

      data: {
        loaded,
        failed,
      }
    }
  }

  // Unload All Replays 
  public unloadReplays (): void {
    this._cursorsData = []
  }
}

import { Job_Result_LoadReplay } from '../../../Types/Job_Result'
import { Job_Data } from '../../../Types/Job_Data'

import { CursorData } from '../../ChildThread/CursorData'
import HeatTrace_Core from '../Core'
