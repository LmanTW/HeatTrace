import Jimp from 'jimp'
import fs from 'fs'

// Texture Manager
class TextureManager {
  private _Core!: HeatTrace_Core

  private _textures: { [key: string]: Texture } = {}

  constructor (Core: HeatTrace_Core) {
    this._Core = Core
  }

  public get textures () {return this._textures}

  // Load The Textures
  public async loadTextures (): Promise<{ error: boolean, message?: string }> {
    const jobs: Job_Data[] = []

    const style = this._Core.options.style

    if (this._Core.options.style.cursor.type === 'image') {
      const cursorSize = ((this._Core.options.width + this._Core.options.height) / 350) * style.cursor.size

      for (let filePath of style.cursor.images) {
        jobs.push({
          type: 'loadTexture',

          filePath,
          
          scaleType: 'min',
          width: cursorSize,
          height: cursorSize,

          effect: {} 
        }) 
      }
    }

    if (this._Core.options.style.background.type === 'image') {
      jobs.push({
        type: 'loadTexture',

        filePath: style.background.image,

        scaleType: 'max',
        width: this._Core.options.width,
        height: this._Core.options.height,

        effect: { brightness: style.background.brightness }
      })
    }

    const textures: { [key: string]: Texture } = {}

    const results = await this._Core.WorkerManager.createBatch(jobs) as Job_Result_LoadTexture[]

    for (let result of results) {
      if (result.error) return { error: true, message: result.message }
      else textures[result.data!.filePath] = result.data!.texture
    }

    this._textures = textures

    return { error: false }
  }

  // Unload All Textures
  public unloadTextures (): void {
    this._textures = {}
  }
}

// Texture
interface Texture {
  width: number,
  height: number,

  data: SharedArrayBuffer // Uint8Array
}

// Texture Filter
interface TextureEffects {
  brightness?: number,
}

export { TextureManager, Texture, TextureEffects }

import { Job_Result_LoadTexture } from '../../../Types/Job_Result'
import { Job_Data } from '../../../Types/Job_Data'

import HeatTrace_Core from '../Core'

