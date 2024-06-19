// Calculate Heat Map
export default (width: number, height: number, start: number, end: number, replay: { xPositions: Float64Array, yPositions: Float64Array, timeStamps: Float64Array }, lineWidth: number): Uint32Array => {
  const pixels: Map<string, number> = new Map()

  replay.timeStamps.forEach((time, index) => {
    if (index > 0 && (time >= start && time <= end)) {
      calculateLine(
        Math.round(mapRange(replay.xPositions[index - 1], 0, 512, 0, width)),
        Math.round(mapRange(replay.yPositions[index - 1], 0, 384, 0, height)),
        Math.round(mapRange(replay.xPositions[index], 0, 512, 0, width)),
        Math.round(mapRange(replay.yPositions[index], 0, 384, 0, height))
      ).forEach((pixel) => {
        if (lineWidth > 1) {
          for (let x = pixel.x - lineWidth; x < pixel.x + lineWidth; x++) {
            for (let y = pixel.y - lineWidth; y < pixel.y + lineWidth; y++) changePixel(x, y)
          } 
        } else changePixel(pixel.x, pixel.y) 
      })
    }
  })

  // Change Pixel
  function changePixel (x: number, y: number): void {
    const key = `${x},${y}`

    if (pixels.has(key)) pixels.set(key, pixels.get(key)! + 1)
    else pixels.set(key, 1)
  }

  const result = new Uint32Array(pixels.size * 3)

  let index: number = 0

  pixels.forEach((value, key) => {
    const chunks = key.split(',')
  
    const x = parseInt(chunks[0])
    const y = parseInt(chunks[1])

    result[index] = x
    result[index + 1] = y
    result[index + 2] = value
  })

  return result
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

import mapRange from '../Tools/MapRange'
