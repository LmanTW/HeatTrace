// Batch Buffer
export default class {
  // Create A Batch Buffer
  public static createBuffer (batchID: string, type: string, total: number): void {
    if (type === 'calculateHeatmaps') batchesBuffer[batchID] = { type: 'calculateHeatmaps', total, finished: 0, data: { cursors: [] }}
    else if (type === 'renderImage') batchesBuffer[batchID] = { type: 'renderImage', total, finished: 0, data: { layers: [] }}
    else batchesBuffer[batchID] = { type: type as any, total, finished: 0, data: [] }
  }

  // Add A Data
  public static async addResult (batchID: string, result: JobResult): Promise<void> {
    if (batchesBuffer[batchID] === undefined) throw new Error(`Batch Buffer Not Found: "${batchID}"`)

    const batchBuffer = batchesBuffer[batchID]

    if (batchBuffer.type === 'calculateHeatmaps' && result.type === 'calculateHeatmaps') {
      if (batchBuffer.data.data === undefined) batchBuffer.data.data = new Uint32Array(result.width * result.height)
      // If the heatmap data is not created yet, create it.
        
      Heatmap.applyHeatmap(result.width, batchBuffer.data.data, new Uint32Array(result.data))
      // Apply the heatmap pixels to the heatmap sum.

      batchBuffer.data.cursors.push({ replayHash: result.replayHash, playerName: result.playerName, x: result.cursorX, y: result.cursorY })
    } else if (batchBuffer.type === 'renderImage' && result.type === 'renderImage') {
      if (batchBuffer.data.format === undefined) {
        batchBuffer.data.format = result.format
    
        batchBuffer.data.width = result.width
        batchBuffer.data.height = result.height
      }

      batchBuffer.data.layers.push({ layer: result.layer, data: new Uint8Array(result.data) })
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
      } else if (batchBuffer.type === 'renderImage') {
        const image = await Render.renderImage(batchBuffer.data.format!, batchBuffer.data.width!, batchBuffer.data.height!, batchBuffer.data.layers)

        const sharedBuffer = new SharedArrayBuffer(image.length)

        new Uint8Array(sharedBuffer).set(image, 0)

        sendMessage({ type: 'batchResults', batchID, data: [{
          type: 'renderImage',
          
          data: sharedBuffer
        }] })
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

  data: JobResult_LoadReplays[]
} | {
  type: 'renderImage',

  total: number,
  finished: number,

  data: {
    format?: 'png' | 'jpeg',

    width?: number,
    height?: number,

    layers: Layer[]
  }
}

import { JobResult, JobResult_LoadReplays } from './Types/JobResult'
import { Render, Layer } from './Render'
import { sendMessage } from './Main'
import { Heatmap } from './Heatmap'

const batchesBuffer: { [key: string]: BatchBuffer } = {}
