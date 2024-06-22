import worker from 'worker_threads'

// Worker Manager
class WorkerManager {
  private _workers: { [key: string]: Worker } = {}
  private _requests: { [key: string]: (response: any) => any } = {}

  private _batches: { [key: string]: Batch } = {}

  // Start Workers
  public async startWorkers (amount: number): Promise<void> {
    const tasks: Promise<void>[] = []

    for (let i = 0; i < amount; i++) {
      const id = generateID(5, Object.keys(this._workers))

      this._workers[id] = {
        state: 'starting',

        worker: new worker.Worker(__filename, { workerData: { type: 'HeatTrace' }})
        // HeatTrace will be bundled into one single JavaScript file after the build process.
        // This means that the worker process will also be included in the same file.
        // You can check out API.ts if you're confused. And if you're still confused after that, I'm sorry.
      }

      tasks.push(this._handleWorker(id))
    }

    await Promise.all(tasks)
    // Wait for all the workers to be ready.
  }

  // Stop Workers
  public stopWorkers (): void {
    Object.keys(this._workers).forEach((id) => this._workers[id].worker.terminate())

    this._workers = {}
  }

  // Create A Batch Of Jobs
  public createBatch (type: string, jobs: JobData[], progress?: (info: { total: number, finished: number }) => any): Promise<JobResult_Combined[]> {
    return new Promise(async (resolve) => {
      const workers = Object.keys(this._workers)

      const batch: Batch = {
        type,

        totalJobs: jobs.length,
        jobs: {},

        bufferWorker: workers[workers.length - 1], 

        progressCallback: progress,
        finishCallback: resolve
      }

      jobs.forEach((data) => batch.jobs[generateID(5, Object.keys(batch.jobs))] = { state: 'waiting', data })

      const batchID = generateID(5, Object.keys(this._batches))

      await this.sendRequest(batch.bufferWorker, { type: 'createBatchBuffer', batchID, batchType: type, total: jobs.length })
      // Make sure the batch buffer is created, to make sure no jobs can be finished before the batch buffer is created.

      this._batches[batchID] = batch

      this._assignJobs()
    })
  }

  // Send A Request
  public async sendRequest (workerID: string, data: Request): Promise<any> {
    return new Promise((resolve) => {
      const requestID = generateID(5, Object.keys(this._requests))

      this._requests[requestID] = resolve

      this._sendMessage(workerID, { type: 'request', data, requestID })
    })
  }

  // Send A Message
  private _sendMessage (workerID: string, message: Message): void {
    if (this._workers[workerID] === undefined) throw new Error(`Worker Not Found: "${workerID}"`)

    this._workers[workerID].worker.postMessage(message)
  }

  // Assign Jobs
  private _assignJobs (): void {
    for (let id of Object.keys(this._workers)) {
      const worker = this._workers[id]

      if (worker.state === 'readied') {
        const job = this._getJob()

        if (job === undefined) break

        const batch = this._batches[job.batchID]

        worker.state = 'working'
        batch.jobs[job.jobID].state = 'inProgress'

        this._sendMessage(id, { type: 'assignJob', batchID: job.batchID, batchType: batch.type, jobID: job.jobID, data: batch.jobs[job.jobID].data })
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

  // Handle A Worker
  private async _handleWorker (id: string): Promise<void> {
    if (this._workers[id] === undefined) throw new Error(`Worker Not Found: "${id}"`)

    return new Promise((resolve) => {
      const worker = this._workers[id]

      worker.worker.on('message', async (msg: Message) => {
        if (msg.type === 'ready') {
          worker.state = 'readied'

          resolve()
        }

        else if (msg.type === 'jobFinished') {
          const batch = this._batches[msg.batchID]

          delete batch.jobs[msg.jobID]

          this._sendMessage(batch.bufferWorker, { type: 'addResult', batchID: msg.batchID, data: msg.data })
          // Send the result to the buffer worker.

          if (batch.progressCallback !== undefined) batch.progressCallback({ total: batch.totalJobs, finished: batch.totalJobs - Object.keys(batch.jobs).length })

          worker.state = 'readied'

          this._assignJobs() 
        } else if (msg.type === 'batchResults') {
          const batch = this._batches[msg.batchID]

          batch.finishCallback(msg.data)

          delete this._batches[msg.batchID]
        }

        else if (msg.type === 'response') {
          if (this._requests[msg.requestID] !== undefined) {
            this._requests[msg.requestID](msg.data)

            delete this._requests[msg.requestID]
          }
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

  bufferWorker: string,

  progressCallback?: (info: { total: number, finished: number }) => any,
  finishCallback: (result: any[]) => any
}

// Job
interface Job {
  state: 'waiting' | 'inProgress',

  data: JobData
}

export { WorkerManager }

import generateID from '../../Tools/GenerateID'

import { JobResult_Combined } from '../../ChildThread/Types/JobResult'
import { Message, Request } from '../../ChildThread/Types/Message'
import { JobData } from '../../ChildThread/Types/JobData'
