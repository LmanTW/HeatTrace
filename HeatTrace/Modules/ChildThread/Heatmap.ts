// Heatmap
class Heatmap {
  // Calculate The Heatmap
  public static calculateHeatmap (width: number, height: number, start: number, end: number, cursorsData: CursorData, style: HeatTraceStyle): HeatmapData {
    const pixels: Map<string, number> = new Map()

    const traceSize = Math.round(((width + height) / 750) * style.traceSize) 

    let cursorX: number = 0
    let cursorY: number = 0

    cursorsData.timeStamps.forEach((time, index) => {
      if (index > 0 && (time >= start && time <= end)) {
        cursorX = cursorsData.xPositions[index]
        cursorY = cursorsData.yPositions[index]
  
        calculateLine(
          Math.round(mapRange(cursorsData.xPositions[index - 1], 0, 512, 0, width)),
          Math.round(mapRange(cursorsData.yPositions[index - 1], 0, 384, 0, height)),
          Math.round(mapRange(cursorsData.xPositions[index], 0, 512, 0, width)),
          Math.round(mapRange(cursorsData.yPositions[index], 0, 384, 0, height))
        ).forEach((pixel) => {
          if (traceSize > 1) {
            for (let x = pixel.x - traceSize; x < pixel.x + traceSize; x++) {
              for (let y = pixel.y - traceSize; y < pixel.y + traceSize; y++) changePixel(pixels, x, y)
            } 
          } else changePixel(pixels, pixel.x, pixel.y)
        })
      }
    })

    const result = new Uint32Array(pixels.size * 3)

    let index: number = 0

    pixels.forEach((value, key) => {
      const chunks = key.split(',')
  
      const x = parseInt(chunks[0])
      const y = parseInt(chunks[1])

      result[index] = x
      result[index + 1] = y
      result[index + 2] = value
  
      index += 3
    })

    return { width, height, data: result, replayHash: cursorsData.replayHash, playerName: cursorsData.playerName, cursorX, cursorY }
  }

  // Apply A Heatmaps
  public static applyHeatmap (width: number, height: number, heatmap: Uint32Array, pixels: Uint32Array): void {
    for (let i = 0; i < pixels.length; i += 3) {
      if ((pixels[i] >= 0 && pixels[i] <= width) && (pixels[i + 1] >= 0 && pixels[i + 1] <= height)) heatmap[pixels[i] + (width * pixels[i + 1])] += pixels[i + 2]
    }
  }

  // Normalize A Heatmap
  public static normalizeHeatmap (heatmapSum: Uint32Array): Float64Array {
    let maxHeat: number = 1

    heatmapSum.forEach((heat) => {
      if (heat > maxHeat) maxHeat = heat
    })

    const normalizeHeatmap = new Float64Array(heatmapSum.length)
  
    heatmapSum.forEach((heat, index) => normalizeHeatmap[index] = mapRange(heat, 0, maxHeat, 0, 1))

    return normalizeHeatmap 
  }
}

// Calculate Line
function calculateLine (x0: number, y0: number, x1: number, y1: number): { x: number, y: number }[] {
  const pixels: { x: number, y: number }[] = []

  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
  let err = dx - dy

  while (x0 !== x1 || y0 !== y1) {
    pixels.push({ x: x0, y: y0 })
  
    let e2 = 2 * err

    if (e2 > -dy) { err -= dy; x0 += sx }
    if (e2 < dx) { err += dx; y0 += sy }
  }

  pixels.push({ x: x1, y: y1 })

  return pixels
}

// Change Pixel
function changePixel (pixels: Map<string, number>, x: number, y: number): void {
  const key = `${x},${y}`

  if (pixels.has(key)) pixels.set(key, pixels.get(key)! + 1)
  else pixels.set(key, 1)
}

// Cursor Data
interface CursorData {
  replayHash: string,
  playerName: string,

  xPositions: Float64Array,
  yPositions: Float64Array,
  timeStamps: Float64Array 
}

// Heatmap Data
interface HeatmapData {
  width: number,
  height: number,

  data: Uint32Array,

  replayHash: string,
  playerName: string,

  cursorX: number,
  cursorY: number
}

// Heatmap Data Combined
interface HeatmapData_Combined {
  data: Float64Array,

  cursors: { replayHash: string, playerName: string, x: number, y: number }[]
}

export { Heatmap, CursorData, HeatmapData, HeatmapData_Combined }

import mapRange from '../Tools/MapRange'

import { HeatTraceStyle } from '../MainThread/Core'

