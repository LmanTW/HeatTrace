// Result Of Load Replays
interface Result_LoadReplays {
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
interface Result_CalculateHeatmaps {
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
interface Result_RenderImage {
  type: 'renderImage',

  data: SharedArrayBuffer // Uint8Array
}

// Combined Result Of Load Replays
type Result_Combined_LoadReplays = Result_LoadReplays

// Combined Result Of Calculate Heatmaps
interface Result_Combined_CalculateHeatmaps {
  type: 'calculateHeatmaps',

  data: SharedArrayBuffer // Float64Array,

  cursors: { replayHash: string, playerName: string, x: number, y: number }[]
}

// Combined Result Of Render Image 
type Result_Combined_RenderImage = Result_RenderImage 

type Result = Result_LoadReplays | Result_CalculateHeatmaps | Result_RenderImage 
type Result_Combined = Result_Combined_LoadReplays | Result_Combined_CalculateHeatmaps | Result_Combined_RenderImage

export {
  Result, Result_Combined,

  Result_LoadReplays, Result_CalculateHeatmaps, Result_RenderImage,
  Result_Combined_LoadReplays, Result_Combined_CalculateHeatmaps, Result_Combined_RenderImage
}
