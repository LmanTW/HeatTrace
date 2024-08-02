import Jimp from 'jimp'

// Render
class Render {
  // Render The Background
  public static renderBackground (width: number, height: number, textures: { [key: string]: Texture }, style: HeatTrace_Style): Layer {
    const sharedBuffer = new SharedArrayBuffer(Math.round((width * height) * 4))
    // Each pixel have 4 values. (r, g, b, a)

    const pixels = new Uint8Array(sharedBuffer)

    if (style.background.type === 'color') {
      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = limitValue(style.background.color.r + (255 * style.background.brightness), 0, 255)
        pixels[i + 1] = limitValue(style.background.color.g + (255 * style.background.brightness), 0, 255) 
        pixels[i + 2] = limitValue(style.background.color.b + (255 * style.background.brightness), 0, 255) 
        pixels[i + 3] = 255
      }
    } else if (style.background.type === 'image') {
      const texture = textures[style.background.image]

      const x = (width / 2) - (texture.width / 2)
      const y = (height / 2) - (texture.height / 2)

      this._drawTexture(pixels, width, height, texture, Math.round(x), Math.round(y), 255)
    }

    return { layer: 0, pixels: sharedBuffer }
  }

  // Rener The Heatmap
  public static renderHeatmap (heatmap: SharedArrayBuffer, style: HeatTrace_Style): Layer {
    const heatmapPixels = new Float64Array(heatmap)

    const sharedBuffer = new SharedArrayBuffer(heatmapPixels.length * 4)
    // Each pixel have 4 values. (r, g, b, a)

    const pixels = new Uint8Array(sharedBuffer)

    heatmapPixels.forEach((heat, index) => {
      if (heat > 0) {
        heat = mapRange(heat * style.heatBoost, 0, 1, 0, 1)

        index = index * 4

        const color = Color.getGradientColor(heat, style.colors)

        pixels[index] = limitValue(color.r, 0, 255) 
        pixels[index + 1] = limitValue(color.g, 0, 255) 
        pixels[index + 2] = limitValue(color.b, 0, 255)
        pixels[index + 3] = limitValue(Math.round(mapRange(heat, 0, 1, style.traceOpacity[0] * 255, style.traceOpacity[1] * 255)), 0, 255) 
      }
    })

    return { layer: 1, pixels: sharedBuffer }
  }

  // Render The Cursors
  public static renderCursors (width: number, height: number, cursorsInfo: CursorInfo[], textures: { [key: string]: Texture }, style: HeatTrace_Style): Layer {
    const sharedBuffer = new SharedArrayBuffer(Math.round((width * height) * 4))
    // Each pixel have 4 values. (r, g, b, a)

    const pixels = new Uint8Array(sharedBuffer)

    const length = (style.cursor.type === 'color') ? style.cursor.colors.length : style.cursor.images.length

    cursorsInfo.forEach((cursorInfo) => {
      const key = (style.cursor.distribution === 'player') ? cursorInfo.playerName : cursorInfo.replayHash

      let value = stringToNumber(key) % (length)

      if (value >= length) value = length - 1

      if (style.cursor.type === 'color') {
        const cursorSize = Math.round(((width + height) / 300) * style.cursor.size)

        this._drawCircle(
          pixels,

          width,
          height,

          Math.round(mapRange(cursorInfo.x, 0, 512, 0, width)),
          Math.round(mapRange(cursorInfo.y, 0, 384, 0, height)),

          cursorSize,

          style.cursor.colors[value],
          style.cursor.opacity * 255
        )
      } else if (style.cursor.type === 'image') {
        let x = mapRange(cursorInfo.x, 0, 512, 0, width)
        let y = mapRange(cursorInfo.y, 0, 384, 0, height)

        const texture = textures[style.cursor.images[value]]

        if (style.cursor.imageAlign === 'center') {
          x -= texture.width / 2
          y -= texture.height / 2
        }

        this._drawTexture(
          pixels,

          width,
          height,

          texture,

          Math.round(x),
          Math.round(y),

          style.cursor.opacity * 255
        )
      }
    })

    return { layer: 2, pixels: sharedBuffer }
  }

  // Render The Image
  public static async renderImage (format: 'png' | 'jpeg' | 'raw', quality: number, width: number, height: number, layers: Layer[]): Promise<SharedArrayBuffer> {
    return new Promise((resolve) => {
      const pixels = new Uint8Array(Math.round((width * height) * 4))

      layers.sort((a, b) => a.layer - b.layer).forEach((layer) => {
        const layerPixels = new Uint8Array(layer.pixels)

        for (let i = 0; i < layerPixels.length; i += 4) {
          if (layerPixels[i + 3] > 0) {
            const maxAlpha = Math.max(pixels[i + 3], layerPixels[i + 3])

            const alpha = mapRange(layerPixels[i + 3], 0, maxAlpha, 0, 1)

            pixels[i] = limitValue(pixels[i] + ((layerPixels[i] - pixels[i]) * alpha), 0, 255)
            pixels[i + 1] = limitValue(pixels[i + 1] + ((layerPixels[i + 1] - pixels[i + 1]) * alpha), 0, 255)
            pixels[i + 2] = limitValue(pixels[i + 2] + ((layerPixels[i + 2] - pixels[i + 2]) * alpha), 0, 255)
            pixels[i + 3] = limitValue(alpha * 255, 0, 255) 
          }
        }
      })

      for (let i = 0; i < pixels.length; i += 4) pixels[i + 3] = 255

      if (format === 'raw') {
        const sharedBuffer = new SharedArrayBuffer((width * height) * 4)

        new Uint8Array(sharedBuffer).set(pixels, 0)

        resolve(sharedBuffer)
      } else {
        new Jimp(width, height, (_, image) => {
          image.bitmap.data = Buffer.from(pixels)

          image.quality(quality * 100)

          if (format === 'png') {
            image.getBuffer(Jimp.MIME_PNG, (_, data) => {
              const sharedBuffer = new SharedArrayBuffer(data.length)

              new Uint8Array(sharedBuffer).set(data, 0)

              resolve(sharedBuffer)
            })
          } else {
            image.getBuffer(Jimp.MIME_JPEG, (_, data) => {
              const sharedBuffer = new SharedArrayBuffer(data.length)

              new Uint8Array(sharedBuffer).set(data, 0)

              resolve(sharedBuffer)
            })
          }
        })
      }
    }) 
  }

  // Draw A Circle
  private static _drawCircle (pixels: Uint8Array, width: number, height: number, x: number, y: number, radius: number, color: Color.RGB, opacity: number): void {
    for (let currentX = -radius; currentX <= radius; currentX++) {
      for (let currentY = -radius; currentY <= radius; currentY++) {
        if ((currentX * currentX) + (currentY * currentY) <= radius * radius) {
          const pixelX = Math.round(x + currentX)
          const pixelY = Math.round(y + currentY)

          if ((pixelX >= 0 && pixelX < width) && (pixelY >= 0 && pixelY < height)) {
            const index = (pixelX + (pixelY * width)) * 4

            pixels[index] = limitValue(color.r, 0, 255) 
            pixels[index + 1] = limitValue(color.g, 0, 255) 
            pixels[index + 2] = limitValue(color.b, 0, 255) 
            pixels[index + 3] = limitValue(opacity, 0, 255) 
          } 
        }
      }
    }
  }

  // Draw A Texture
  private static _drawTexture (pixels: Uint8Array, width: number, height: number, texture: Texture, x: number, y: number, opacity: number): void {
    const texturePixels = new Uint8Array(texture.data)

    let pixelIndex: number = 0
    
    for (let currentY = y; currentY < y + texture.height; currentY++) {
      for (let currentX = x; currentX < x + texture.width; currentX++) {
        if ((currentX >= 0 && currentX < width) && (currentY >= 0 && currentY < height)) {
          const index = (currentX + (currentY * width)) * 4

          if (texturePixels[pixelIndex + 3] > 0) {
            pixels[index] = limitValue(texturePixels[pixelIndex], 0, 255)
            pixels[index + 1] = limitValue(texturePixels[pixelIndex + 1], 0, 255)
            pixels[index + 2] = limitValue(texturePixels[pixelIndex + 2], 0, 255)
            pixels[index + 3] = limitValue(opacity, 0, 255)
          }
        }

        pixelIndex += 4
      }
    }
  }
}

// Strin To Number
function stringToNumber (string: string): number {
  let count: number = 0

  for (let i = 0; i < string.length; i++) count += string.charCodeAt(i) 

  return count
}

// Layer
interface Layer {
  layer: number,

  pixels: SharedArrayBuffer // Uint8Array
}

export { Render, Layer }

import { HeatTrace_Style } from '../../Types/HeatTrace_Style'

import limitValue from '../Tools/LimitValue'
import mapRange from '../Tools/MapRange'
import Color from '../Tools/Color'

import { Texture } from '../MainThread/Managers/TextureManager'
import { CursorInfo } from './CursorData'
