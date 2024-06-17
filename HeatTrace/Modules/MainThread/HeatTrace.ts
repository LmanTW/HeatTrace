// Heat Trace
export default class {
  private _state: 'idle' | 'initializing' | 'initialized' = 'idle'
  private _options!: Options

  private _replays: [] = []

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
  public async loadReplays (replays: string[]): Promise<void> {
    if (this._state !== 'initialized') throw new Error(`Cannot Load Replays: ${this._state}`)
  }
}

// Options
interface Options {
  width: number,
  height: number,
  fps: number,

  threads: number 
}

import WorkerManager from './Managers/WorkerManager'
