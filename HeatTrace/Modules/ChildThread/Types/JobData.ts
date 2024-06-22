// Job Data Of Load Replays
interface JobData_LoadReplays {
  type: 'loadReplays',

  data: Buffer
}

// Job Data Of Calculate Heatmaps
interface JobData_CalculateHeatmaps {
  type: 'calculateHeatmaps',

  width: number,
  height: number,

  start: number,
  end: number,

  cursorData: CursorData,

  style: HeatTraceStyle 
}

// Job Data Of Render Heatmap
interface JobData_RenderHeatmap {
  type: 'renderHeatmap',

  format: 'png' | 'jpeg',

  width: number,
  height: number,

  heatmap: SharedArrayBuffer,
      
  style: HeatTraceStyle 
}

// Job Data Of Render Cursor
interface JobData_RenderCursor {
  type: 'renderCursor',

  format: 'png' | 'jpeg',

  width: number,
  height: number,

  textures: { [key: string]: Texture },

  cursors: { replayHash: string, playerName: string, x: number, y: number }[],

  style: HeatTraceStyle
}

type JobData = JobData_LoadReplays | JobData_CalculateHeatmaps | JobData_RenderHeatmap | JobData_RenderCursor

export { JobData }

import { Texture } from '../../MainThread/Managers/TextureManager'
import { HeatTraceStyle } from '../../MainThread/Core'
import { CursorData } from '../Heatmap'
