// Render A Frame
export default async (Core: HeatTrace_Core, frame: number, progress?: (info: { type: 'calculatingHeatmaps' | 'renderingLayers', total: number, finished: number }) => any) => {
  const heatmap = await calculateHeatmap(Core, frame, (info) => {
    if (progress !== undefined) progress({ type: 'calculatingHeatmaps', total: info.total, finished: info.finished })
  })

  const jobs: Job_Data[] = [{
    type: 'renderLayer',

    layerData: {
      type: 'heatmap',

      heatmap: heatmap.heatmap
    },

    style: Core.options.style
  }]

  if (Core.options.style.background.type !== 'none') {
    jobs.push({
      type: 'renderLayer',

      layerData: {
        type: 'background',

        width: Core.options.width,
        height: Core.options.height,

        textures: Core.TextureManager.textures
      },

      style: Core.options.style
    })
  }

  const results = await Core.WorkerManager.createBatch(jobs, (info) => {
    if (progress !== undefined) progress({ type: 'renderingLayers', total: info.total, finished: info.finished })
  }) as Job_Result_RenderLayer[]

  return results.map((result) => result.layer)
}

// Calculate The Heatmap
async function calculateHeatmap (Core: HeatTrace_Core, frame: number, progress?: (info: { total: number, finished: number }) => any): Promise<{ heatmap: SharedArrayBuffer, cursorsInfo: CursorInfo[] }> {
  if (Core.state !== 'initialized') throw new Error(`Cannot Calculate The Heatmap: ${Core.state}`)

  const sharedBuffer = new SharedArrayBuffer((Core.options.width * Core.options.height) * 4)
  // Create a grid of pixels that represents the heat.
  // Multiply by 4 because it's for an Uint32Array. (Each item uses 4 bytes)
    
  const end = frame * Core.ReplayManager.frameInterval

  const jobs: Job_Data[] = Core.ReplayManager.cursorsData.map((cursorData) => {
    return {
      type: 'calculateHeatmap',

      width: Core.options.width,
      height: Core.options.height,

      start: end - (Core.options.style.traceLength * 1000),
      end,

      heatmap: sharedBuffer,
      cursorData: cursorData,

      style: Core.options.style
    }
  })

  const results = await Core.WorkerManager.createBatch(jobs, progress) as Job_Result_CalculateHeatmap[]
    
  const heatmap = (await Core.WorkerManager.createBatch([
    {
      type: 'normalizeHeatmap',

      heatmap: sharedBuffer
    }
  ]) as Job_Result_NormalizeHeatmap[])[0].normalizedHeatmap

  return { heatmap, cursorsInfo: results.map((result) => result.cursorInfo) }
}

import { Job_Result_CalculateHeatmap, Job_Result_NormalizeHeatmap, Job_Result_RenderLayer, Job_Result_RenderImage } from '../../Types/Job_Result'
import { Job_Data } from '../../Types/Job_Data'

import { CursorInfo } from '../ChildThread/CursorData'
import HeatTrace_Core from './Core'
