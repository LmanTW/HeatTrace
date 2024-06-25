// Job Data Of Load Texture
interface Job_Data_LoadTexture {
  type: 'loadTexture',

  filePath: string,

  scaleType: 'min' | 'max',
  width: number,
  height: number,

  effect: TextureEffects
}

// Job Data Of Load Replay
interface Job_Data_LoadReplay {
  type: 'loadReplay',

  data: Buffer,

  maxCursorTravelDistance: number 
}

// Job Data Of Calculate Heatmap
interface Job_Data_CalculateHeatmap {
  type: 'calculateHeatmap',

  width: number,
  height: number,

  start: number,
  end: number,

  heatmap: SharedArrayBuffer, // Uint32Array
  cursorData: CursorData,

  style: HeatTrace_Style
}

// Job Data Of Normalize Heatmap
interface Job_Data_NormalizeHeatmap {
  type: 'normalizeHeatmap',

  heatmap: SharedArrayBuffer // Uint32Array
}

// Job Data Of Render Layer 
interface Job_Data_RenderLayer {
  type: 'renderLayer',

  layerData: {
    type: 'background',

    width: number,
    height: number,

    textures: { [key: string]: Texture }
  } | {
    type: 'heatmap',

    heatmap: SharedArrayBuffer
  } | {
    type: 'cursors',

    width: number,
    height: number,

    cursors: CursorInfo[],

    textures: { [key: string]: Texture }
  },

  style: HeatTrace_Style 
}

// Job Data Of Render Image
interface Job_Data_RenderImage {
  type: 'renderImage',

  format: 'png' | 'jpeg' | 'raw',

  width: number,
  height: number,

  layers: Layer[]
}

type Job_Data = Job_Data_LoadTexture
  | Job_Data_LoadReplay
  | Job_Data_CalculateHeatmap
  | Job_Data_NormalizeHeatmap
  | Job_Data_RenderLayer
  | Job_Data_RenderImage

export { Job_Data }

import { HeatTrace_Style } from './HeatTrace_Style'

import { TextureEffects } from '../Modules/MainThread/Managers/TextureManager'
import { CursorData, CursorInfo } from '../Modules/ChildThread/CursorData'
import { Texture } from '../Modules/MainThread/Managers/TextureManager'
import { Layer } from '../Modules/ChildThread/Render'
