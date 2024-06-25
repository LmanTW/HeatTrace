// HeatTrace Options
interface HeatTrace_Options {
  width: number,
  height: number,
  
  style: HeatTrace_Style,
  
  imageFormat: 'png' | 'jpeg' | 'raw',
  imageQuality: number,

  videoFPS: number,
  videoSpeed: number,

  threads: number,

  maxFrameQueue: number,
  maxCursorTravelDistance: number, // Pixels
}

// Optional HeatTrace Options 
interface HeatTrace_Options_Optional {
  width?: number,
  height?: number,

  style?: HeatTrace_Style_Optional,
  
  imageFormat?: 'png' | 'jpeg' | 'raw',
  imageQuality?: number,

  videoFPS?: number,
  videoSpeed?: number,

  threads?: number,

  maxFrameQueue?: number,
  maxCursorTravelDistance?: number // Pixels
}

export { HeatTrace_Options, HeatTrace_Options_Optional }

import { HeatTrace_Style, HeatTrace_Style_Optional } from './HeatTrace_Style'
