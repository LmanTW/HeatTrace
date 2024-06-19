import worker from 'worker_threads'

// Worker Manager
export default class {
  private _workers: { [key: string]: Worker } = {}
  private _requests: { [key: string]: (data: any) => any } = {}

  private _batches: { [key: string]: Batch } = {}

  // Start The Workers
  public async startWorkers (amount: number): Promise<void> {
    const tasks: Promise<void>[] = []

    for (let i = 0; i < amount; i++) {
      const id = generateID(5, Object.keys(this._workers))

      this._workers[id] = {
        state: 'starting',

        worker: new worker.Worker(__filename, { workerData: { HeatTrace: true } })
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
  public async addBatch (type: string, jobs: any[], callback?: (info: { total: number, finished: number }) => any): Promise<any[]> {
    return new Promise((resolve) => {
      const batch: Batch = {
        type,

        totalJobs: jobs.length,
        jobs: {},
        result: [],

        progressCallback: callback,
        finishCallback: resolve
      }

      jobs.forEach((data) => batch.jobs[generateID(5, Object.keys(batch.jobs))] = { state: 'waiting', data })

      this._batches[generateID(5, Object.keys(this._batches))] = batch

      this._assignJobs()
    })
  }

  // Send A Request
  public async sendRequest (id: string, data: object): Promise<any> {
    if (this._workers[id] === undefined) throw new Error(`Worker Not Found: "${id}"`)

    return new Promise((resolve) => {
      const requestID = generateID(5, Object.keys(this._requests))

      this._requests[requestID] = resolve

      this._workers[id].worker.postMessage({ type: 'request', data, requestID })
    })
  }

  // Assign Jobs
  private _assignJobs (): void {
    for (let id of Object.keys(this._workers)) {
      if (this._workers[id].state === 'readied') {
        const job = this._getJob()

        if (job === undefined) break

        this._workers[id].state = 'working'
        this._batches[job.batchID].jobs[job.jobID].state = 'inProgress'

        this._workers[id].worker.postMessage({ type: 'assignJob', batchID: job.batchID, batchType: this._batches[job.batchID].type, jobID: job.jobID, data: this._batches[job.batchID].jobs[job.jobID].data })
      }
    }
  }

  // Get A Job 
  private _getJob (): undefined | { batchID: string, jobID: string } {
    // Can't because I suck :(
    
    for (let batchID of Object.keys(this._batches)) {
      const batch = this._batches[batchID]

      for (let jobID of Object.keys(batch.jobs)) {
        if (batch.jobs[jobID].state === 'waiting') return { batchID, jobID }
      }

      break
    }

    return undefined
  }

  // Finish A Batch
  private async _finishBatch (batchID: string): Promise<void> {
    const allResults: any = []

    await Promise.all(Object.keys(this._workers).map(async (id) => {
      const results = await this.sendRequest(id, { type: 'finishBatch', batchID }) as any[]

      if (results !== undefined) results.forEach((result) => allResults.push(result))
    }))

    this._batches[batchID].finishCallback(allResults)

    delete this._batches[batchID]
  }

  // Handle Workers
  private async _handleWorker (id: string): Promise<void> {
    return new Promise((resolve) => {
      const worker = this._workers[id]

      worker.worker.on('message', (msg) => {
        if (msg.type === 'ready') {
          worker.state = 'readied'

          resolve()
        } else if (msg.type === 'response') {
          this._requests[msg.requestID](msg.data)

          delete this._requests[msg.requestID]
        }

        else if (msg.type === 'jobFinished') {
          worker.state = 'readied'

          const batch = this._batches[msg.batchID]

          delete batch.jobs[msg.jobID]

          if (batch.progressCallback !== undefined) batch.progressCallback({ total: batch.totalJobs, finished: batch.totalJobs - Object.keys(batch.jobs).length })

          if (Object.keys(batch.jobs).length === 0) this._finishBatch(msg.batchID)

          this._assignJobs()
        }
      })
    }) 
  }
}

// Worker
interface Worker {
  state: 'starting' | 'readied' | 'working',

  worker: worker.Worker
}

// Batch
interface Batch {
  type: string, 

  totalJobs: number,
  jobs: { [key: string]: Job },
  result: any[]

  progressCallback?: (info: { total: number, finished: number }) => any
  finishCallback: (result: any[]) => any
}

// Job
interface Job {
  state: 'waiting' | 'inProgress',

  data: any
}

import generateID from '../../Tools/GenerateID'

