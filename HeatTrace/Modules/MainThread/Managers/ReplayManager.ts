// Replay Manager
export default class {
  private _Core!: HeatTrace_Core

  private _cursorsData: CursorData[] = []

  constructor (Core: HeatTrace_Core) {
    this._Core = Core
  }

  // Load Replays
  public async loadReplays (replays: Buffer[], progress?: (info: { total: number, finished: number }) => any): Promise<{ error: boolean, message?: string, data?: { maxLength: number, loaded: number, failed: number }}> {
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

    return {
      error: false,

      data: {
        maxLength,

        loaded: replays.length,
        failed,
      }}
  } 
}

import { Job_Result_LoadReplay } from '../../../Types/Job_Result'
import { Job_Data } from '../../../Types/Job_Data'

import { CursorData } from '../../ChildThread/CursorData'
import HeatTrace_Core from '../Core'
