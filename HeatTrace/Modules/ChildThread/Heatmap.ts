// Heatmap
export default class {
  // Calculate The Heatmap
  public static calculateHeatmap (width: number, height: number, start: number, end: number, heatmap: SharedArrayBuffer, cursorData: CursorData, style: HeatTrace_Style): CursorInfo {
    // Calculate the cursor data and add the "heat value" onto the heatmap.
    
    const pixels = new Uint32Array(width * height)

    const traceSize = Math.round(((width + height) / 900) * style.traceSize)

    let cursorX = cursorData.xPositions[0]
    let cursorY = cursorData.yPositions[0]

    const changed: Map<string, boolean> = new Map()

    for (let i = 0; i < cursorData.timeStamps.length - 1; i++) {
      if (cursorData.timeStamps[i] >= start && cursorData.timeStamps[i] <= end) {
        cursorX = cursorData.xPositions[i]
        cursorY = cursorData.yPositions[i]

        changed.clear() 

        calculateLine(
          Math.round(mapRange(cursorX, 0, 512, 0, width)),
          Math.round(mapRange(cursorY, 0, 384, 0, height)),
          Math.round(mapRange(cursorData.xPositions[i + 1], 0, 512, 0, width)),
          Math.round(mapRange(cursorData.yPositions[i + 1], 0, 384, 0, height))
        ).forEach((pixel) => {
          if (traceSize > 1) {
            if (traceSize % 2 === 0) {
              const start = (traceSize / 2) - 1
              const end = (traceSize / 2)

              for (let x = pixel.x - start; x <= pixel.x + end; x++) {
                for (let y = pixel.y - start; y <= pixel.y + end; y++) {
                  if ((x >= 0 && x < width) && (y >= 0 && y < height)) {
                    if (!changed.has(`${x},${y}`)) {
                      pixels[x + (y * width)]++
  
                      changed.set(`${x},${y}`, true)
                    }
                  }
                }
              }
            } else {
              const radius = (traceSize - 1) / 2

              for (let x = pixel.x - radius; x <= pixel.x + radius; x++) {
                for (let y = pixel.y - radius; y <= pixel.y + radius; y++) {
                  if ((x >= 0 && x < width) && (y >= 0 && y < height)) {
                    if (!changed.has(`${x},${y}`)) {
                      pixels[x + (y * width)]++
  
                      changed.set(`${x},${y}`, true)
                    }
                  }
                }
              }
            } 
          } else {
            if ((pixel.x >= 0 && pixel.x < width) && (pixel.y >= 0 && pixel.y < height)) pixels[pixel.x + (pixel.y * width)]++
          }
        })
      } else if (cursorData.timeStamps[i] > end) break
    }

    const sharedPixels = new Uint32Array(heatmap)

    pixels.forEach((heat, index) => {
      if (heat > 0) Atomics.add(sharedPixels, index, heat)
    }) 

    return { playerName: cursorData.playerName, replayHash: cursorData.replayHash, x: cursorX, y: cursorY }
  }

  // Normalize The Heatmap
  public static normalizeHeatmap (heatmap: SharedArrayBuffer): SharedArrayBuffer {
    const pixels = new Uint32Array(heatmap)

    let maxHeat: number = 1

    pixels.forEach((heat) => {
      if (heat > maxHeat) maxHeat = heat 
    })

    const sharedBuffer = new SharedArrayBuffer(pixels.length * 8)
    // Create a grid of pixels that represents the normalized heat.
    // Multiply by 8 because it's for an Uint32Array. (Each item uses 8 bytes)

    const normalizedPixels = new Float64Array(sharedBuffer)

    pixels.forEach((heat, index) => normalizedPixels[index] = mapRange(heat, 0, maxHeat, 0, 1))

    return sharedBuffer
  }
}

// Calculate The Line Between Two Points
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

import { HeatTrace_Style } from '../../Types/HeatTrace_Style'

import mapRange from '../Tools/MapRange'

import { CursorData, CursorInfo } from './CursorData'
