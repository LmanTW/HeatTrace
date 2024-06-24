// Job Result Of Load Texture
interface Job_Result_LoadTexture {
  type: 'loadTexture',

  error: boolean,
  message?: string,

  data: {
    filePath: string,
    texture: Texture
  }
}

// Job Result Of Load Replay
interface Job_Result_LoadReplay {
  type: 'loadReplay',

  error: boolean,
  message?: string,

  data?: {
    beatmapHash: string,
   
    cursorData: CursorData
  } 
}

// Job Result Of Calculate Heatmap
interface Job_Result_CalculateHeatmap {
  type: 'calculateHeatmap',

  cursorInfo: CursorInfo
}

// Job Result Of Normalize Heatmap
interface Job_Result_NormalizeHeatmap {
  type: 'normalizeHeatmap',

  normalizedHeatmap: SharedArrayBuffer // Float64Array
}

// Job Result Of Render Layer
interface Job_Result_RenderLayer {
  type: 'renderLayer',

  layer: Layer
}

// Job Result Of Render Image
interface Job_Result_RenderImage {
  type: 'renderImage',

  data: SharedArrayBuffer // Uint8Array
}

type Job_Result = Job_Result_LoadTexture
  | Job_Result_LoadReplay
  | Job_Result_CalculateHeatmap
  | Job_Result_NormalizeHeatmap
  | Job_Result_RenderLayer
  | Job_Result_RenderImage

export {
  Job_Result,

  Job_Result_LoadTexture,
  Job_Result_LoadReplay,
  Job_Result_CalculateHeatmap,
  Job_Result_NormalizeHeatmap,
  Job_Result_RenderLayer,
  Job_Result_RenderImage
}

import { CursorData, CursorInfo } from '../Modules/ChildThread/CursorData'
import { Texture } from '../Modules/MainThread/Managers/TextureManager'
import { Layer } from '../Modules/ChildThread/Render'
