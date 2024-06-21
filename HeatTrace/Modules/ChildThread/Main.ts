import worker from 'worker_threads'

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
        else result = { error: false, data: { beatmapHash: replay.beatmapHash, replayHash: replay.replayHash, playerName: replay.playerName, xPositions: replay.cursor.xPositions, yPositions: replay.cursor.yPositions, timeStamps: replay.cursor.timeStamps }}
      } else if (msg.batchType === 'calculateHeatmaps') result = Heatmap.calculateHeatmap(data.width, data.height, data.start, data.end, data.cursorData, data.style)
      else if (msg.batchType === 'renderImage') result = await renderImage(data.format, data.width, data.height, data.heatmap, data.cursors, data.style)

      sendMessage({ type: 'jobFinished', batchID: msg.batchID, jobID: msg.jobID, data: result })
    } else if (msg.type === 'addBuffer') {
      if (batchesBuffer[msg.batchID] === undefined) throw new Error(`Batch Buffer Not Found: "${msg.batchID}"`)

      const batchBuffer = batchesBuffer[msg.batchID]

      if (batchBuffer.type === 'calculateHeatmaps') {
        if (batchBuffer.data.data === undefined) batchBuffer.data.data = new Uint32Array(msg.data.width * msg.data.height)
        
        Heatmap.applyHeatmap(msg.data.width, msg.data.height, batchBuffer.data.data, msg.data.data)

        batchBuffer.data.cursors.push({ replayHash: msg.data.replayHash, playerName: msg.data.playerName, x: msg.data.cursorX, y: msg.data.cursorY })
      } else batchBuffer.data.push(msg.data)

      batchBuffer.finished++

      if (batchBuffer.finished >= batchBuffer.total) {
        if (batchBuffer.type === 'calculateHeatmaps') {
          sendMessage({ type: 'batchResults', batchID: msg.batchID, data: [{
            data: Heatmap.normalizeHeatmap(batchBuffer.data.data!),

            cursors: batchBuffer.data.cursors
          }]})
        } else sendMessage({ type: 'batchResults', batchID: msg.batchID, data: batchBuffer.data })

        delete batchesBuffer[msg.batchID]
      }
    }

    else if (msg.type === 'request') {
      const request = msg.data
      let response: any = undefined

      if (request.type === 'createBatchBuffer') {
        if (request.batchType === 'calculateHeatmaps') batchesBuffer[request.batchID] = { type: 'calculateHeatmaps', total: request.total, finished: 0, data: { cursors: [] }}
        else batchesBuffer[request.batchID] = { type: request.batchType as any, total: request.total, finished: 0, data: [] }
      }

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
  type: 'addBuffer',

  batchID: string,

  data: any
} | {
  type: 'batchResults',

  batchID: string,

  data: any[]
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

// Batch Buffer
type BatchBuffer = {
  type: 'calculateHeatmaps',

  total: number,
  finished: number,

  data: {
    data?: Uint32Array,

    cursors: { replayHash: string, playerName: string, x: number, y: number }[]
  } 
} | {
  type: 'loadReplays',

  total: number,
  finished: number,

  data: any[]
}

export { startWorker, Message, Request }

import { Heatmap } from './Heatmap'

const batchesBuffer: { [key: string]: BatchBuffer } = {}
