import Jimp from 'jimp'

// Render
class Render {
  // Render The Heatmap
  public static renderHeatmap (width: number, height: number, heatmap: Float64Array, style: HeatTraceStyle): Layer {
    const pixels = new Uint8Array((width * height) * 4)

    heatmap.forEach((heat, index) => {
      index = index * 4

      const color = Color.getGradientColor(mapRange(heat * style.heatBoost, 0, 1, 0, 1), style.colors)

      pixels[index] = color.r
      pixels[index + 1] = color.g
      pixels[index + 2] = color.b
      pixels[index + 3] = 255
    })

    return { layer: 0, data: pixels } 
  }

  // Render The Cursor
  public static renderCursor (width: number, height: number, textures: { [key: string]: Texture }, cursors: { replayHash: string, playerName: string, x: number, y: number }[], style: HeatTraceStyle): Layer {
    const pixels = new Uint8Array((width * height) * 4)

    const length = (style.cursor.type === 'color') ? style.cursor.colors.length : style.cursor.images.length

    cursors.forEach((cursor) => {
      const key = (style.cursor.distribution === 'player') ? cursor.playerName : cursor.replayHash

      let value = stringToNumber(key) % (length)

      if (value >= length) value = length - 1

      if (style.cursor.type === 'color') {
        fillCircle(cursor.x, cursor.y, ((width + height) / 250) * style.cursor.size).forEach((pixel) => {
          if ((pixel.x > 0 && pixel.x < width) && (pixel.y > 0 && pixel.y < height)) {
            const index = (pixel.x + (width * pixel.y)) * 4

            pixels[index] = style.cursor.colors[value].r
            pixels[index + 1] = style.cursor.colors[value].g
            pixels[index + 2] = style.cursor.colors[value].b
            pixels[index + 3] = 255
          }
        })
      } else {
        drawTexture(textures[style.cursor.images[value]], cursor.x, cursor.y).forEach((pixel) => {
          if ((pixel.x > 0 && pixel.x < width) && (pixel.y > 0 && pixel.y < height)) {
            const index = (pixel.x + (width * pixel.y)) * 4

            pixels[index] = pixel.color.r
            pixels[index + 1] = pixel.color.g
            pixels[index + 2] = pixel.color.b
            pixels[index + 3] = 255 
          }
        }) 
      }
    })

    return { layer: 1, data: pixels }
  }

  // Combine Layers
  public static async renderImage (format: 'png' | 'jpeg', width: number, height: number, layers: Layer[]): Promise<Uint8Array> {
    return new Promise((resolve) => {
      const pixels = new Uint8Array((width * height) * 4)

      layers.sort((a, b) => a.layer - b.layer).forEach((layer, index) => {
        if (index === 0) pixels.set(layer.data, 0)
        else {
          for (let i = 0; i < layer.data.length; i += 4) {
            if (layer.data[i + 3] > 0) {
              pixels[i] = layer.data[i]
              pixels[i + 1] = layer.data[i + 1]
              pixels[i + 2] = layer.data[i + 2]
            }
          }
        }
      })

      new Jimp(width, height, (_, image) => {
        image.bitmap.data = Buffer.from(pixels)

        if (format === 'png') image.getBuffer(Jimp.MIME_PNG, (_, data) => resolve(data))
        else image.getBuffer(Jimp.MIME_JPEG, (_, data) => resolve(data))
      })
    })
  }
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

// Draw A Texture
function drawTexture (texture: Texture, x: number, y: number): { color: Color.RGB, x: number, y: number }[] {
  const pixels: { color: Color.RGB, x: number, y: number }[] = []

  const data = new Uint8Array(texture.data)

  for (let currentX = 0; currentX < texture.width; currentX++) {
    for (let currentY = 0; currentY < texture.height; currentY++) {
      const index = (currentX + (texture.width * currentY)) * 4

      if (data[index + 3] > 0) {
        pixels.push({
          color: { r: data[index], g: data[index + 1], b: data[index + 2] },

          x: Math.round(x + currentX),
          y: Math.round(y + currentY) 
        })
      } 
    }
  }

  return pixels
}

// Layer
interface Layer {
  layer: number,

  data: Uint8Array 
}
import { RGBTuple } from 'discord.js'

export { Render, Layer }

import mapRange from '../Tools/MapRange'
import Color from '../Tools/Color'

import { Texture } from '../MainThread/Managers/TextureManager'
import { HeatTraceStyle } from '../MainThread/Core'
