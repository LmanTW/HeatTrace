// Result Of Load Replays
interface JobResult_LoadReplays {
  type: 'loadReplays',

  error: boolean,
  message?: string

  data?: {
    beatmapHash: string,
    replayHash: string,

    playerName: string,

    xPositions: Float64Array,
    yPositions: Float64Array, 
    timeStamps: Float64Array, 
  }
}

// Result Of Calculate Heatmaps
interface JobResult_CalculateHeatmaps {
  type: 'calculateHeatmaps',

  width: number,
  height: number,

  data: SharedArrayBuffer, // Uint32Array

  replayHash: string,
  playerName: string,

  cursorX: number,
  cursorY: number
}

// Result Of Render Image
interface JobResult_RenderImage {
  type: 'renderImage',

  format: 'png' | 'jpeg',

  width: number,
  height: number

  layer: number,

  data: SharedArrayBuffer // Uint8Array
}

// Combined Result Of Load Replays
type JobResult_Combined_LoadReplays = JobResult_LoadReplays

// Combined Result Of Calculate Heatmaps
interface JobResult_Combined_CalculateHeatmaps {
  type: 'calculateHeatmaps',

  data: SharedArrayBuffer // Float64Array,

  cursors: { replayHash: string, playerName: string, x: number, y: number }[]
}

// Combined Result Of Render Image 
interface JobResult_Combined_RenderImage {
  type: 'renderImage',

  data: SharedArrayBuffer // Uint8Array
} 

type JobResult = JobResult_LoadReplays | JobResult_CalculateHeatmaps | JobResult_RenderImage 
type JobResult_Combined = JobResult_Combined_LoadReplays | JobResult_Combined_CalculateHeatmaps | JobResult_Combined_RenderImage

export {
  JobResult, JobResult_Combined,

  JobResult_LoadReplays, JobResult_CalculateHeatmaps, JobResult_RenderImage,
  JobResult_Combined_LoadReplays, JobResult_Combined_CalculateHeatmaps, JobResult_Combined_RenderImage
}

import { Layer } from '../Render'
