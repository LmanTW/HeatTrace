// Message
type Message = {
  type: 'ready'
} | {
  type: 'assignJob',

  batchID: string,
  batchType: string,

  jobID: string,

  data: JobData
} | {
  type: 'jobFinished',

  batchID: string,
  jobID: string

  data: any
} | {
  type: 'addResult',

  batchID: string,

  data: JobResult 
} | {
  type: 'batchResults',

  batchID: string,

  data: JobResult_Combined[] 
} | {
  type: 'request' | 'response',

  data: Request,

  requestID: string
}

// Request
type Request = {
  type: 'createBatchBuffer',

  batchID: string,
  batchType: string,

  total: number
}

export { Message, Request }

import { JobResult, JobResult_Combined } from './JobResult'
import { JobData } from './JobData'
