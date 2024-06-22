import Jimp from 'jimp'

// Texture Manager
class TextureManager {
  private _textures: { [key: string]: Texture } = {}

  public get textures () {return this._textures}

  // Add A Texture
  public addTexture (filePath: string, scaleType: 'min' | 'max', width: number, height: number): Promise<{ error: boolean }> {
    if (this._textures[filePath] !== undefined) throw new Error(`Texture Already Exists: "${filePath}"`)

    return new Promise((resolve) => {
      new Jimp(filePath, (error, image) => {
        if (error === null) {

          const size = calculateImageScale(scaleType, image.getWidth(), image.getHeight(), width, height)

          image.resize(size.width, size.height)
  
          const sharedBuffer = new SharedArrayBuffer(image.bitmap.data.length)
  
          new Uint8Array(sharedBuffer).set(image.bitmap.data, 0)

          this._textures[filePath] = {
            width: image.bitmap.width,
            height: image.bitmap.height,

            data: sharedBuffer
          } 

          resolve({ error: false })
        } else resolve({ error: true })
      })
    }) 
  }
}

// Calculate Image Scale
function calculateImageScale (type: 'min' | 'max', srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number): { width: number, height: number } {
  const ratio = (type === 'min') ? Math.min(maxWidth / srcWidth, maxHeight / srcHeight) : Math.max(maxWidth / srcWidth, maxHeight / srcHeight)

  return { width: srcWidth * ratio, height: srcHeight * ratio }
}

// Texture
interface Texture {
  width: number,
  height: number,

  data: SharedArrayBuffer // Uint8Array
}

export { TextureManager, Texture }
