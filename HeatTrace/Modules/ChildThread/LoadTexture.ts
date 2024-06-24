import Jimp from 'jimp'
import fs from 'fs'

// Load A Texture
export default async (filePath: string, scaleType: 'min' | 'max', width: number, height: number, effects: TextureEffects): Promise<{ error: boolean, message?: string, texture?: Texture }> => {
  return new Promise((resolve) => {
    if (!fs.existsSync(filePath)) resolve({ error: true, message: `Texture File Not Found: "${filePath}"` })
    else {
      new Jimp(filePath, (error, image) => {
        if (error === null) {
          const size = calculateImageScale(scaleType, image.getWidth(), image.getHeight(), width, height)

          image.resize(size.width, size.height)

          const sharedBuffer = new SharedArrayBuffer(image.bitmap.data.length)

          const pixels = new Uint8Array(sharedBuffer)

          for (let i = 0; i < image.bitmap.data.length; i += 4) {
            pixels[i] = image.bitmap.data[i]
            pixels[i + 1] = image.bitmap.data[i + 1]
            pixels[i + 2] = image.bitmap.data[i + 2]
            pixels[i + 3] = 255

            if (effects.brightness !== undefined) {
              pixels[i] = limitValue(pixels[i] - (pixels[i] * (1 - effects.brightness)), 0, 255)
              pixels[i + 1] = limitValue(pixels[i + 1] - (pixels[i + 1] * (1 - effects.brightness)), 0, 255) 
              pixels[i + 2] = limitValue(pixels[i + 2] - (pixels[i + 2] * (1 - effects.brightness)), 0, 255)
            }
          }

          resolve({
            error: false,

            texture: {
              width: size.width,
              height: size.height,

              data: sharedBuffer 
            }
          })
        } else resolve({ error: true, message: `Failed To Load Texture: "${filePath}"` })
      })
    }
  })
}

// Calculate Image Scale
function calculateImageScale (type: 'min' | 'max', srcWidth: number, srcHeight: number, width: number, height: number): { width: number, height: number } {
  // "min" The size will be smaller than the max size. (For example: Scaling an image to fix into a box)
  // "max" The size will be larger than the max size. (For example: Scaling an image to use as a background)

  const ratio = (type === 'min') ? Math.min(width / srcWidth, height / srcHeight) : Math.max(width / srcWidth, height / srcHeight)

  return { width: Math.round(srcWidth * ratio), height: Math.round(srcHeight * ratio) }
}

import limitValue from '../Tools/LimitValue'

import { Texture, TextureEffects } from '../MainThread/Managers/TextureManager'
