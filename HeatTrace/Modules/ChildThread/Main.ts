import worker from 'worker_threads'

import loadReplay from './LoadReplay'

// Start The Worker
export default () => {
  worker.parentPort!.on('message', async (msg) => {
    if (msg.type === 'assignJob') {
      if (batches[msg.batchID] === undefined) batches[msg.batchID] = []

      if (msg.batchType === 'loadReplays') {
        batches[msg.batchID].push(await loadReplay(msg.data))

        worker.parentPort!.postMessage({ type: 'jobFinished', batchID: msg.batchID, jobID: msg.jobID })
      }
    } else if (msg.type === 'request') {
      let response: any

      let data = msg.data

      if (data.type === 'finishBatch') {
        response = batches[data.batchID]

        delete batches[data.batchID]
      }

      worker.parentPort!.postMessage({ type: 'response', data: response, requestID: msg.requestID })
    }
  })

  worker.parentPort!.postMessage({ type: 'ready' })
}

const batches: { [key :string]: any[] } = {}
