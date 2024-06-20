import worker from 'worker_threads'

import calculateHeatmap from './CalculateHeatmap'
import combineHeatmap from './CombineHeatmap'
import renderImage from './RenderImage'
import { loadReplay } from './Replay'

// Start The Worker
function startWorker () {
  worker.parentPort!.on('message', async (msg: Message) => {
    if (msg.type === 'assignJob') {
      const data = msg.data
      let result!: any

      if (msg.batchType === 'loadReplays') {
        const replay = await loadReplay(data)

        if (replay.gameMode !== 'standard') result = { error: true, message: 'Unsupport Game Mode' }
        else if (replay.cursor === undefined) result = { error: true, message: 'Failed To Decompress Cursor Data' }
        else result = { error: false, data: { beatmapHash: replay.beatmapHash, xPositions: replay.cursor.xPositions, yPositions: replay.cursor.yPositions, timeStamps: replay.cursor.timeStamps }}
      } else if (msg.batchType === 'calculateHeatmaps') result = calculateHeatmap(data.width, data.height, data.start, data.end, data.replayCursorData, data.style)
      else if (msg.batchType === 'combineBeatmaps') result = combineHeatmap(data.width, data.height, data.heatmaps)
      else if (msg.batchType === 'renderImage') result = await renderImage(data.format, data.width, data.height, data.heatmap, data.style)

      sendMessage({ type: 'jobFinished', batchID: msg.batchID, jobID: msg.jobID, data: result })
    } else if (msg.type === 'request') {
      const request = msg.data
      let response: any = undefined

      sendMessage({ type: 'response', data: response, requestID: msg.requestID })
    }
  })

  sendMessage({ type: 'ready' })
}

// Send Message To The Main Thread
function sendMessage (message: Message): void {
  worker.parentPort!.postMessage(message)
}

type Message = {
  type: 'ready'
} | {
  type: 'assignJob',

  batchID: string,
  batchType: string,

  jobID: string,
  data: any
} | {
  type: 'jobFinished',

  batchID: string,
  jobID: string

  data: any
} | {
  type: 'request' | 'response',

  data: Request,

  requestID: string
}

type Request = {

}

export { startWorker, Message, Request }
