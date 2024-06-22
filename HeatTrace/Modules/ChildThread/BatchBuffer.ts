// Batch Buffer
export default class {
  // Create A Batch Buffer
  public static createBuffer (batchID: string, type: string, total: number): void {
    if (type === 'calculateHeatmaps') batchesBuffer[batchID] = { type: 'calculateHeatmaps', total: total, finished: 0, data: { cursors: [] }}
    else batchesBuffer[batchID] = { type: type as any, total: total, finished: 0, data: [] }
  }

  // Add A Data
  public static addResult (batchID: string, result: Result): void {
    if (batchesBuffer[batchID] === undefined) throw new Error(`Batch Buffer Not Found: "${batchID}"`)

    const batchBuffer = batchesBuffer[batchID]

    if (batchBuffer.type === 'calculateHeatmaps' && result.type === 'calculateHeatmaps') {
      if (batchBuffer.data.data === undefined) batchBuffer.data.data = new Uint32Array(result.width * result.height)
        
      Heatmap.applyHeatmap(result.width, batchBuffer.data.data, new Uint32Array(result.data))

      batchBuffer.data.cursors.push({ replayHash: result.replayHash, playerName: result.playerName, x: result.cursorX, y: result.cursorY })
    } else (batchBuffer.data as any[]).push(result)

    batchBuffer.finished++

    if (batchBuffer.finished >= batchBuffer.total) {
      if (batchBuffer.type === 'calculateHeatmaps') {
        const heatmap = Heatmap.normalizeHeatmap(batchBuffer.data.data!)

        const sharedBuffer = new SharedArrayBuffer(heatmap.length * 8)

        new Float64Array(sharedBuffer).set(heatmap, 0)

        sendMessage({ type: 'batchResults', batchID: batchID, data: [{
          type: 'calculateHeatmaps',

          data: sharedBuffer,

          cursors: batchBuffer.data.cursors
        }]})
      } else sendMessage({ type: 'batchResults', batchID, data: batchBuffer.data })

      delete batchesBuffer[batchID]
    }
  }
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

  data: Result_Combined_LoadReplays[]
} | {
  type: 'renderImage',

  total: number,
  finished: number,

  data: Result_Combined_RenderImage[]
}

import { Result, Result_Combined_LoadReplays, Result_Combined_RenderImage } from './Types/Result'
import { sendMessage } from './Main'
import { Heatmap } from './Heatmap'

const batchesBuffer: { [key: string]: BatchBuffer } = {}
