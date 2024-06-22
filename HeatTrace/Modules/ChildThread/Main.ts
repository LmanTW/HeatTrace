import worker from 'worker_threads'

import renderImage from './RenderImage'
import { loadReplay } from './Replay'

// Start The Worker
function startWorker () {
  worker.parentPort!.on('message', async (msg: Message) => {
    if (msg.type === 'assignJob') {
      const data = msg.data
      let result!: JobResult

      if (data.type === 'loadReplays') {
        const replay = await loadReplay(data.data)

        if (replay.gameMode !== 'standard') result = { type: 'loadReplays', error: true, message: 'Unsupport Game Mode' }
        else if (replay.cursor === undefined) result = { type: 'loadReplays', error: true, message: 'Failed To Decompress Cursor Data' }
        else result = { type: 'loadReplays', error: false, data: { beatmapHash: replay.beatmapHash, replayHash: replay.replayHash, playerName: replay.playerName, xPositions: replay.cursor.xPositions, yPositions: replay.cursor.yPositions, timeStamps: replay.cursor.timeStamps }}
      } else if (data.type === 'calculateHeatmaps') {
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
      } else if (data.type === 'renderHeatmap' || data.type === 'renderCursor') {
        let layer!: Layer
        
        if (data.type === 'renderHeatmap') layer = Render.renderHeatmap(data.width, data.height, new Float64Array(data.heatmap), data.style)
        else layer = Render.renderCursor(data.width, data.height, data.textures, data.cursors, data.style)

        const sharedBuffer = new SharedArrayBuffer(layer.data.length)

        new Uint8Array(sharedBuffer).set(layer.data, 0)

        result = {
          type: 'renderImage',

          format: data.format,

          width: data.width,
          height: data.height,

          layer: layer.layer,

          data: sharedBuffer 
        }
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

export { startWorker, sendMessage }

import { JobResult } from './Types/JobResult'
import { Message } from './Types/Message'
import { Render, Layer } from './Render'
import BatchBuffer from './BatchBuffer'
import { Heatmap } from './Heatmap'
