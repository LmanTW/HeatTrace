// Message
type Message = {
  type: 'ready' | 'readied'
} | {
  type: 'assignJob',

  batchID?: string,

  jobID: string,
  jobData: Job_Data
} | {
  type: 'jobFinished',

  batchID?: string,
  // Possibly undefined if the job is not in a batch.
  
  jobID: string,
  jobResult: Job_Result
}

export { Message }

import { Job_Result } from './Job_Result'
import { Job_Data } from './Job_Data'
