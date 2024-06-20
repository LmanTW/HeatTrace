import Jimp from 'jimp'

// Render A Heatmap To Am Image
export default async (format: 'png' | 'jpeg', width: number, height: number, heatmap: Float64Array, style: HeatTraceStyle): Promise<Buffer> => {
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

    new Jimp(width, height, (_, image) => {
      image.bitmap.data = Buffer.from(pixels)

      if (format === 'png') image.getBuffer(Jimp.MIME_PNG, (_, data) => resolve(data))
      else image.getBuffer(Jimp.MIME_JPEG, (_, data) => resolve(data))
    })
  }) 
}

import mapRange from '../Tools/MapRange'
import Color from '../Tools/Color'

import { HeatTraceStyle } from '../MainThread/Core'
