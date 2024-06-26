import { decompress } from 'lzma-native'

// Load A Replay
async function loadReplay (data: Buffer): Promise<Replay> {
  return new Promise((resolve) => {
    const reader = new Reader(data)

    const gameMode = reader.readByte()

    const version = reader.readInteger() // Version

    const beatmapHash = reader.readString() // Beatmap Hash

    const playerName = reader.readString() // Player Name
    const replayHash = reader.readString() // Replay Hash

    const great = reader.readShort() // Great
    const ok = reader.readShort() // Ok
    const meh = reader.readShort() // Meh
    const gekis = reader.readShort() // Gekis
    const katus = reader.readShort() // Katus
    const misses = reader.readShort() // Misses

    const score = reader.readInteger() // Score
    const greatestCombo = reader.readShort() // Greatest Combo
    const perfect = reader.readByte() // Perfect

    reader.readInteger() // Mods
    reader.readString() // Life Bar Graph
    reader.readLong() // Time Stamp

    const length = reader.readInteger()

    const compressedData = new Uint8Array(length) 

    for (let i = 0; i < length; i++) compressedData[i] = reader.readByte()

    const replay: Replay = {
      version,
      gameMode: ['standard', 'taiko', 'catch', 'mania'][gameMode] as any,
          
      beatmapHash,
      replayHash,

      playerName,

      great,
      ok,
      meh,
      gekis,
      katus,
      misses,

      score,
      greatestCombo,
      perfect: perfect === 1
    }

    decompress(Buffer.from(compressedData), undefined, (result) => {
      if (result === null) resolve(replay)
      else {
        const frames = result.toString().split(',')

        const xPositions = new Float64Array(frames.length)
        const yPositions = new Float64Array(frames.length)
        const timeStamps = new Float64Array(frames.length)

        let time: number = 0

        frames.forEach((frame, index) => {
          const fragments = frame.split('|')

          time += +fragments[0]

          xPositions[index] = +fragments[1]
          yPositions[index] = +fragments[2]
          timeStamps[index] = time
        })

        replay.cursor = {
          xPositions,
          yPositions,
          timeStamps
        }

        resolve(replay)
      }
    }) 
  }) 
}

// Replay
interface Replay {
  version: number,
  gameMode: 'standard' | 'taiko' | 'catch' | 'mania',

  beatmapHash: string,
  replayHash: string,

  playerName: string,

  great: number,
  ok: number,
  meh: number,
  gekis: number,
  katus: number,
  misses: number,

  score: number,
  greatestCombo: number,
  perfect: boolean,

  cursor?: RawCursorData
  // Possibly undefiend if the decompression failed.
}

export { loadReplay, Replay }

import Reader from '../Tools/Reader'

import { RawCursorData } from './CursorData'
