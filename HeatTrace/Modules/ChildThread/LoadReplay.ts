import { decompress } from 'lzma-native'

import BinaryReader from '../Tools/BinaryReader'

// Load Replay
export default async (data: Buffer): Promise<{ error: boolean, message?: string, data?: { beatmapHash: string, xPositions: Float64Array, yPositions: Float64Array, timeStamps: Float64Array }}> => {
  return new Promise((resolve) => {
    const reader = new BinaryReader(data)

    // Check if the game mode is standard
    if (reader.readByte() === 0) {
      reader.readInteger() // Version

      const beatmapHash = reader.readString() // Beatmap Hash

      reader.readString() // Player Name
      reader.readString() // Replay Hash

      reader.readShort() // Great
      reader.readShort() // Ok
      reader.readShort() // Meh
      reader.readShort() // Gekis
      reader.readShort() // Katus
      reader.readShort() // Misses

      reader.readInteger() // Score
      reader.readShort() // Greatest Combo
      reader.readByte() // Perfect

      reader.readInteger() // Mods
      reader.readString() // Life Bar Graph
      reader.readLong() // Time Stamp

      const length = reader.readInteger()

      const compressedData = new Uint8Array(length) 

      for (let i = 0; i < length; i++) compressedData[i] = reader.readByte()

      decompress(Buffer.from(compressedData), undefined, (result) => {
        if (result === null) resolve({ error: true, message: 'Failed To Decompress Cursor Data' })
        else {
          const chunks = result.toString().split(',')

          const xPositions = new Float64Array(chunks.length)
          const yPositions = new Float64Array(chunks.length)
          const timeStamps = new Float64Array(chunks.length)

          let time: number = 0

          chunks.forEach((frame, index) => {
            const fragments = frame.split('|')

            time += +fragments[0]

            xPositions[index] = +fragments[1]
            yPositions[index] = +fragments[2]
            timeStamps[index] = time
          })

          resolve({
            error: false,

            data: {
              beatmapHash,

              xPositions,
              yPositions,
              timeStamps
            } 
          })
        } 
      })
    } else resolve({ error: true, message: 'Unsupported Game Mode' })
  }) 
}
