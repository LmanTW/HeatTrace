import worker from 'worker_threads'

import renderImage from './RenderImage'
import { loadReplay } from './Replay'

// Start The Worker
function startWorker () {
  worker.parentPort!.on('message', async (msg: Message) => {
    if (msg.type === 'assignJob') {
      const data = msg.data
      let result!: Result

      if (msg.batchType === 'loadReplays') {
        const replay = await loadReplay(data)

        if (replay.gameMode !== 'standard') result = { type: 'loadReplays', error: true, message: 'Unsupport Game Mode' }
        else if (replay.cursor === undefined) result = { type: 'loadReplays', error: true, message: 'Failed To Decompress Cursor Data' }
        else result = { type: 'loadReplays', error: false, data: { beatmapHash: replay.beatmapHash, replayHash: replay.replayHash, playerName: replay.playerName, xPositions: replay.cursor.xPositions, yPositions: replay.cursor.yPositions, timeStamps: replay.cursor.timeStamps }}
      } else if (msg.batchType === 'calculateHeatmaps') {
        const heatmap = Heatmap.calculateHeatmap(data.width, data.height, data.start, data.end, data.cursorData, data.style)

        const sharedBuffer = new SharedArrayBuffer(heatmap.data.length * 4)

        new Uint32Array(sharedBuffer).set(heatmap.data, 0)

        result = {
          type: 'calculateHeatmaps',

          width: heatmap.width,
          height: heatmap.height,

          data: sharedBuffer,

          replayHash: heatmap.replayHash,
          playerName: heatmap.playerName,

          cursorX: heatmap.cursorX,
          cursorY: heatmap.cursorY 
        }
      } else if (msg.batchType === 'renderImage') {
        const image = await renderImage(data.format, data.width, data.height, data.heatmap, data.cursors, data.style)

        const sharedBuffer = new SharedArrayBuffer(image.length)

        new Uint8Array(sharedBuffer).set(image, 0)

        result = { type: 'renderImage', data: sharedBuffer } 
      }

      sendMessage({ type: 'jobFinished', batchID: msg.batchID, jobID: msg.jobID, data: result })
    } else if (msg.type === 'addResult') BatchBuffer.addResult(msg.batchID, msg.data)

    else if (msg.type === 'request') {
      const request = msg.data
      let response: any = undefined

      if (request.type === 'createBatchBuffer') BatchBuffer.createBuffer(request.batchID, request.batchType, request.total)

      sendMessage({ type: 'response', data: response, requestID: msg.requestID })
    }
  })

  sendMessage({ type: 'ready' })
}

// Send Message To The Main Thread
function sendMessage (message: Message): void {
  worker.parentPort!.postMessage(message)
}

// Message
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
  type: 'addResult',

  batchID: string,

  data: Result 
} | {
  type: 'batchResults',

  batchID: string,

  data: Result_Combined[] 
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

export { startWorker, sendMessage, Message, Request }

import { Heatmap, HeatmapData_Combined } from './Heatmap'
import { Result, Result_Combined } from './Types/Result'
import BatchBuffer from './BatchBuffer'
