import worker from 'worker_threads'

// Worker Manager
class WorkerManager {
  private _workers: { [key: string]: Worker } = {}

  private _batches: { [key: string]: Batch } = {}
  private _jobs: { [key: string]: Job } = {}

  // Start Workers
  public async startWorkers (amount: number, textures: { [key: string]: Texture }): Promise<void> {
    const tasks: Promise<void>[] = []

    for (let i = 0; i < amount; i++) {
      const id = generateID(5, Object.keys(this._workers))

      this._workers[id] = {
        state: 'starting',

        worker: new worker.Worker(__filename, { workerData: { type: 'HeatTrace', textures }})
        // HeatTrace will be bundled into one single JavaScript file after the build process.
        // This means that the worker process will also be included in the same file.
        // You can check out API.ts if you're confused. And if you're still confused after that, I'm sorry.
      }

      tasks.push(this._handleWorker(id))
    }

    await Promise.all(tasks)
  }

  // Stop All The Workers
  public async stopWorkers (): Promise<void> {
    for (let id of Object.keys(this._workers)) {
      await this._workers[id].worker.terminate()

      delete this._workers[id]
    }
  }
  
  // Create A Batch
  public async createBatch (jobsData: Job_Data[], progress?: (info: { total: number, finished: number }) => any): Promise<Job_Result[]> {
    return new Promise((resolve) => {
      if (jobsData.length === 0) resolve([])
      else {
        const batch: Batch = {
          totalJobs: jobsData.length,
          jobs: {},

          results: [],

          progressCallback: progress,
          finishCallback: resolve
        }

        jobsData.forEach((jobData) => {
          batch.jobs[generateID(5, Object.keys(batch.jobs))] = {
            state: 'waiting',

            data: jobData
          }
        })

        this._batches[generateID(5, Object.keys(this._batches))] = batch

        if (batch.progressCallback !== undefined) batch.progressCallback({ total: batch.totalJobs, finished: 0 })

        this._assignJobs()
      } 
    })
  } 

  // Create A Job
  public async createJob (job: Job_Data): Promise<Job_Result> {
    return new Promise((resolve) => {
      this._jobs[generateID(5, Object.keys(this._jobs))] = {
        state: 'waiting',

        data: job,

        callback: resolve
      }

      this._assignJobs()
    })
  }

  // Assign Jobs
  private _assignJobs (): void {
    for (let workerID of Object.keys(this._workers)) {
      const worker = this._workers[workerID]

      if (worker.state === 'idle') {
        const job = this._getJob()

        if (job === undefined) break

        let jobData!: Job_Data

        if (job.batchID === undefined) {
          this._jobs[job.jobID].state = 'inProgress'

          jobData = this._jobs[job.jobID].data
        } else {
          const batch = this._batches[job.batchID]

          batch.jobs[job.jobID].state = 'inProgress'

          jobData = batch.jobs[job.jobID].data
        } 

        worker.state = 'working'

        this._sendMessage(workerID, {
          type: 'assignJob',

          batchID: job.batchID,

          jobID: job.jobID,
          jobData
        })
      }
    }
  }

  // Get A Job
  private _getJob (): undefined | { batchID?: string, jobID: string } {
    // Can't because I suck :(
    
    for (let jobID of Object.keys(this._jobs)) {
      if (this._jobs[jobID].state === 'waiting') return { jobID }
    }

    for (let batchID of Object.keys(this._batches)) {
      const batch = this._batches[batchID]

      for (let jobID of Object.keys(batch.jobs)) {
        if (batch.jobs[jobID].state === 'waiting') return { batchID, jobID }
      }
    }

    return undefined
  }

  // Send A Message
  private _sendMessage (workerID: string, message: Message): void {
    this._workers[workerID].worker.postMessage(message)
  }

  // Handle A Worker
  private async _handleWorker (id: string): Promise<void> {
    return new Promise((resolve) => {
      const worker = this._workers[id]

      worker.worker.on('message', (msg: Message) => {
        if (msg.type === 'readied') {
          worker.state = 'idle'

          resolve()
        }

        else if (msg.type === 'jobFinished') {
          if (msg.batchID === undefined) {
            const job = this._jobs[msg.jobID]

            if (job.callback !== undefined) job.callback(msg.jobResult)

            delete this._jobs[msg.jobID]
          } else {
            const batch = this._batches[msg.batchID]

            delete batch.jobs[msg.jobID]

            batch.results.push(msg.jobResult)

            if (batch.progressCallback !== undefined) batch.progressCallback({ total: batch.totalJobs, finished: batch.results.length })

            if (batch.results.length >= batch.totalJobs) {
              batch.finishCallback(batch.results)

              delete this._batches[msg.batchID]
            } 
          }

          worker.state = 'idle'

          this._assignJobs()
        }
      })
    })
  }
}

// Worker
interface Worker {
  state: 'starting' | 'idle' | 'working',

  worker: worker.Worker
}

// Batch
interface Batch {
  totalJobs: number,
  jobs: { [key: string]: Job },

  results: Job_Result[],

  progressCallback?: (info: { total: number, finished: number }) => any,
  finishCallback: (result: any[]) => any
}

// Job
interface Job {
  state: 'waiting' | 'inProgress',

  data: Job_Data,

  callback?: (result: Job_Result) => any
  // Only work for jobs that are not in a batch.
}

export { WorkerManager }

import { Job_Result } from '../../../Types/Job_Result'
import { Job_Data } from '../../../Types/Job_Data'
import { Message } from '../../../Types/Message'

import generateID from '../../Tools/GenerateID'

import { Texture } from './TextureManager'
