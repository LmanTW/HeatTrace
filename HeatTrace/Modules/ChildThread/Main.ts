import worker from 'worker_threads'

import calculateHeatmap from './CalculateHeatmap'
import loadReplay from './LoadReplay'

// Start The Worker
export default () => {
  worker.parentPort!.on('message', async (msg) => {
    if (msg.type === 'assignJob') {
      if (batches[msg.batchID] === undefined) batches[msg.batchID] = []

      if (msg.batchType === 'loadReplays') batches[msg.batchID].push(await loadReplay(msg.data))
      else if (msg.batchType === 'calculateHeatmap') batches[msg.batchID].push(calculateHeatmap(msg.data.width, msg.data.height, msg.data.start, msg.data.end, msg.data.replay, 1))
      else if (msg.batchType === 'combineHeatmaps') {
        const pixels = new Uint32Array(msg.data.width * msg.data.height)

        msg.data.heatmaps.forEach((heatmap: Uint32Array) => {
          for (let i = 0; i < heatmap.length; i += 3) {
            pixels[heatmap[i] + (heatmap[i + 1] * msg.data.width)] += heatmap[i + 2]
          }
        })

        batches[msg.batchID].push(pixels)
      } 

      worker.parentPort!.postMessage({ type: 'jobFinished', batchID: msg.batchID, jobID: msg.jobID })
    } else if (msg.type === 'request') {
      let response: any

      let data = msg.data

      if (data.type === 'finishBatch') {
        if (batches[data.batchID] !== undefined) {
          response = batches[data.batchID]

          delete batches[data.batchID]
        }
      }

      worker.parentPort!.postMessage({ type: 'response', data: response, requestID: msg.requestID })
    }
  })

  worker.parentPort!.postMessage({ type: 'ready' })
}

const batches: { [key :string]: any[] } = {}
