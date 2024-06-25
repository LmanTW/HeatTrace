// This module is mainly for fixing the cursor data, because sometimes the raw cursor data in the replay file can be weird.
// The weird data will cause the cursor to teleport, and I have no idea why it happens.

// Get The Cursor Data
function getCursorData (playerName: string, replayHash: string, rawCursorData: RawCursorData, maxCursorTravelDistance: number): CursorData {
  const xPositions = new Float64Array(rawCursorData.xPositions.length)
  const yPositions = new Float64Array(rawCursorData.yPositions.length)
  const timeStamps = new Float64Array(rawCursorData.timeStamps.length)

  let length: number = 0

  let cursorX: undefined | number = undefined 
  let cursorY: undefined | number = undefined 
  
  rawCursorData.timeStamps.forEach((time, index) => {
    if (cursorX === undefined || cursorY === undefined) {
      if ((rawCursorData.xPositions[index] < 0 || rawCursorData.xPositions[index] > 512) || (rawCursorData.yPositions[index] < 0 || rawCursorData.yPositions[index] > 384)) return

      cursorX = rawCursorData.xPositions[index]
      cursorY = rawCursorData.yPositions[index]
    } else {
      if (Math.hypot(cursorX - rawCursorData.xPositions[index], cursorY - rawCursorData.yPositions[index]) > maxCursorTravelDistance) return

      cursorX = rawCursorData.xPositions[index]
      cursorY = rawCursorData.yPositions[index]
    }

    xPositions[length] = cursorX
    yPositions[length] = cursorY
    timeStamps[length] = time

    length++
  })

  return {
    playerName,
    replayHash,

    xPositions: xPositions.slice(0, length),
    yPositions: yPositions.slice(0, length),
    timeStamps: timeStamps.slice(0, length)
  }
}

// Raw Cursor Data
interface RawCursorData {
  xPositions: Float64Array,
  yPositions: Float64Array,
  timeStamps: Float64Array
}

// Cursor Data
interface CursorData {
  playerName: string,
  replayHash: string,

  xPositions: Float64Array,
  yPositions: Float64Array
  timeStamps: Float64Array
}

// Cursor Info
interface CursorInfo {
  playerName: string,
  replayHash: string,

  x: number,
  y: number
}

export { getCursorData, RawCursorData, CursorData, CursorInfo }
