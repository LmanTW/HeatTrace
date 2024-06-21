import Jimp from 'jimp'

// Render A Heatmap To Am Image
export default async (format: 'png' | 'jpeg', width: number, height: number, heatmap: Float64Array, cursors: { replayHash: string, playerName: string, x: number, y: number }[], style: HeatTraceStyle): Promise<Buffer> => {
  return new Promise((resolve) => {
    const pixels = new Uint8Array((width * height) * 4)

    heatmap.forEach((heat, index) => {
      index = index * 4

      const color = Color.getGradientColor(mapRange(heat * style.heatBoost, 0, 1, 0, 1), style.colors)

      pixels[index] = color.r
      pixels[index + 1] = color.g
      pixels[index + 2] = color.b
      pixels[index + 3] = 255
    })

    const distribution: Map<string, Color.RGB> = new Map()

    if (style.cursor) {
      cursors.forEach((cursor) => {
        const key = (style.cursor.distribution === 'player') ? cursor.playerName : cursor.replayHash

        if (!distribution.has(key)) distribution.set(key, style.cursor.colors[stringToNumber(key) % (style.cursor.colors.length - 1)])

        const color = distribution.get(key)!

        fillCircle(cursor.x, cursor.y, ((width + height) / 250) * style.cursor.size).forEach((pixel) => {
          if ((pixel.x > 0 && pixel.x < width) && (pixel.y > 0 && pixel.y < height)) {
            const index = (pixel.x + (width * pixel.y)) * 4

            pixels[index] = color.r
            pixels[index + 1] = color.g
            pixels[index + 2] = color.b
          }
        })
      })
    }

    new Jimp(width, height, (_, image) => {
      image.bitmap.data = Buffer.from(pixels)

      if (format === 'png') image.getBuffer(Jimp.MIME_PNG, (_, data) => resolve(data))
      else image.getBuffer(Jimp.MIME_JPEG, (_, data) => resolve(data))
    })
  }) 
}

// Strin To Number
function stringToNumber (string: string): number {
  let count: number = 0

  for (let i = 0; i < string.length; i++) count += string.charCodeAt(i) 

  return count
}

// Fill A Circle
function fillCircle(centerX: number, centerY: number, radius: number): { x: number, y: number }[] {
  const pixels: { x: number, y: number }[] = []

  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      if (x * x + y * y <= radius * radius) pixels.push({ x: Math.round(centerX + x), y: Math.round(centerY + y) })
    }
  }

  return pixels
}

import mapRange from '../Tools/MapRange'
import Color from '../Tools/Color'

import { HeatTraceStyle } from '../MainThread/Core'
