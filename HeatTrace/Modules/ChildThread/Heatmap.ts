// Heatmap
class Heatmap {
  // Calculate The Heatmap
  public static calculateHeatmap (width: number, height: number, start: number, end: number, cursorData: CursorData, style: HeatTraceStyle): HeatmapData {
    const pixels: Map<string, number> = new Map()

    const traceSize = Math.round(((width + height) / 750) * style.traceSize) 

    let cursorX: undefined | number = undefined 
    let cursorY: undefined | number = undefined 

    cursorData.timeStamps.forEach((time, index) => {
      if (index > 1 && (time >= start && time <= end)) {
        const x = mapRange(cursorData.xPositions[index], 0, 512, 0, width)
        const y = mapRange(cursorData.yPositions[index], 0, 384, 0, height)

        if (cursorX === undefined || cursorY === undefined) {
          cursorX = x
          cursorY = y
        } else {
          if (Math.hypot(cursorX - x, cursorY - y) > ((width + height) / 10)) return

          cursorX = x
          cursorY = y
        }
  
        calculateLine(
          Math.round(mapRange(cursorData.xPositions[index - 1], 0, 512, 0, width)),
          Math.round(mapRange(cursorData.yPositions[index - 1], 0, 384, 0, height)),
          Math.round(mapRange(x, 0, 512, 0, width)),
          Math.round(mapRange(y, 0, 384, 0, height))
        ).forEach((pixel) => {
          if (traceSize > 1) {
            for (let x = pixel.x - traceSize; x < pixel.x + traceSize; x++) {
              for (let y = pixel.y - traceSize; y < pixel.y + traceSize; y++) {
                if ((x >= 0 && x < width) && (y >= 0 && y < height)) changePixel(pixels, x, y)
              }
            } 
          } else {
            if ((pixel.x >= 0 && pixel.x < width) && (pixel.y >= 0 && pixel.y < height)) changePixel(pixels, pixel.x, pixel.y)
          }
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

    return {
      width,
      height,

      data: result,

      replayHash: cursorData.replayHash,
      playerName: cursorData.playerName,

      cursorX: cursorX || cursorData.xPositions[1],
      cursorY: cursorY || cursorData.yPositions[1]
    }
  }

  // Apply A Heatmaps
  public static applyHeatmap (width: number, heatmap: Uint32Array, pixels: Uint32Array): void {
    // pixels is an array of pixels with their position and value: x, y value, x, y, value, x, y, value, etc...

    for (let i = 0; i < pixels.length; i += 3) heatmap[pixels[i] + (width * pixels[i + 1])] += pixels[i + 2]
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

