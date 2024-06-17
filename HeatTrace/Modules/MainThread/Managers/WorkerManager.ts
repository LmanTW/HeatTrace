import worker from 'worker_threads'

// Worker Manager
export default class {
  private _workers: { [key: string]: Worker } = {}
  private _batchs: { [key: string]: Batch } = {}

  // Start The Workers
  public async startWorkers (amount: number): Promise<void> {
    const tasks: Promise<void>[] = []

    for (let i = 0; i < amount; i++) {
      const id = generateID(5, Object.keys(this._workers))

      this._workers[id] = {
        state: 'starting',

        worker: new worker.Worker(__filename)
      }

      tasks.push(this._handleWorker(id))
    }

    await Promise.all(tasks)
  }

  // Stop Workers
  public stopWorkers (): void {
    Object.keys(this._workers).forEach((id) => {
      this._workers[id].worker.terminate()

      delete this._workers[id]
    })
  }

  // Add Batch 
  public async addBatch (type: BatchTypes, jobs: any[], callback: (info: { total: number, finished: number }) => any): Promise<any[]> {
    return new Promise((resolve) => {
      const batch: Batch = {
        type,

        jobs: {},
        result: [],

        progressCallback: callback,
        finishCallback: resolve
      }

      jobs.forEach((job) => batch.jobs[generateID(5, Object.keys(batch.jobs))] = job)

      this._assignJobs()
    })
  }

  // Assign Jobs
  private _assignJobs (): void {
    for (let id of Object.keys(this._workers)) {
      if (this._workers[id].state === 'started') {
        const job = this._getJob()

        if (job === undefined) break

        this._batchs[job.batchID].jobs[job.jobID].state = 'inProgress'

        this._workers[id].worker.postMessage({ batchID: job.batchID, jobID: job.jobID, data: this._batchs[job.batchID].jobs[job.jobID].data })
      }
    }

    Object.keys(this._workers).forEach((id) => {
      
    })
  }

  // Get A Job 
  private _getJob (): undefined | { batchID: string, jobID: string } {
    // Can't because I suck :(
    
    for (let batchID of Object.keys(this._batchs)) {
      const batch = this._batchs[batchID]

      for (let jobID of Object.keys(batch.jobs)) {
        if (batch.jobs[jobID].state === 'waiting') return { batchID, jobID }
      }

      break
    }

    return undefined
  }
  

  // Handle Workers
  private async _handleWorker (id: string): Promise<void> {
    return new Promise((resolve) => {
      const worker = this._workers[id]

      worker.worker.on('message', (msg) => {
        if (msg.type === 'ready') resolve()

        console.log(msg)
      })
    }) 
  }
}

// Worker
interface Worker {
  state: 'starting' | 'started' | 'working',

  worker: worker.Worker
}

type BatchTypes = 'loadReplays'

// Batch
interface Batch {
  type: BatchTypes,

  jobs: { [key: string]: Job },
  result: any[]

  progressCallback: (info: { total: number, finished: number }) => any
  finishCallback: (result: any[]) => any
}

// Job
interface Job {
  state: 'waiting' | 'inProgress',

  data: any
}

import generateID from '../../Tools/GenerateID'

