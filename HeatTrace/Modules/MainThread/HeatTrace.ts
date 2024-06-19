// Heat Trace
export default class {
  private _state: 'idle' | 'initializing' | 'initialized' = 'idle'
  private _options!: Options

  private _replays: { xPositions: Float64Array, yPositions: Float64Array, timeStamps: Float64Array }[] = []

  private WorkerManager!: WorkerManager

  constructor (options: Options) {
    this._options = options

    this.WorkerManager = new WorkerManager()
  }

  // Initialize
  public async initialize (): Promise<void> {
    if (this._state !== 'idle') throw new Error(`Cannot Initialize HeatTrace: ${this._state}`)

    this._state = 'initializing'

    await this.WorkerManager.startWorkers(this._options.threads)

    this._state = 'initialized'
  }

  // Load Replays
  public async loadReplays (replays: Buffer[], callback?: (info: { total: number, loaded: number }) => any): Promise<{ error: boolean, message?: string, data?: Replay[] }> {
    if (this._state !== 'initialized') throw new Error(`Cannot Load Replays: ${this._state}`)

    const results = await this.WorkerManager.addBatch('loadReplays', replays, (info) => {
      if (callback !== undefined) callback({ total: info.total, loaded: info.finished })
    })

    const data: Replay[] = []

    let beatmapHash!: string

    for (let result of results) {
      if (!result.error) {
        if (beatmapHash === undefined) beatmapHash = result.data.beatmapHash
        else if (result.data.beatmapHash !== beatmapHash) return { error: true, message: 'Found Replays With Different Beatmaps' }

        data.push({ xPositions: result.data.xPositions, yPositions: result.data.yPositions, timeStamps: result.data.timeStamps })
      }
    }

    return { error: false, data }
  }

  // Calculate The Heatmap
  public async calculateHeatmap (replays: Replay[]): Promise<void> {
    if (this._state !== 'initialized') throw new Error(`Cannot Calculate The Heatmap: ${this._state}`)

    await this.WorkerManager.addBatch('')
  }
}

// Options
interface Options {
  width: number,
  height: number,
  fps: number,

  threads: number 
}

// Replay
interface Replay {
  xPositions: Float64Array,
  yPositions: Float64Array,
  timeStamps: Float64Array
}

import WorkerManager from './Managers/WorkerManager'
