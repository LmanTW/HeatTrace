// Combine Heatmaps
export default (width: number, height: number, heatmaps: { data: Uint32Array, replayHash: string, playerName: string, cursorX: number, cursorY: number }[]): { data: Float64Array, cursors: { replayHash: string, playerName: string, x: number, y: number }[] } => {
  const cursors: { replayHash: string, playerName: string, x: number, y: number }[] = []

  const heatmapSum = new Uint32Array(width * height) 

  heatmaps.forEach((heatmap) => {
    cursors.push({ replayHash: heatmap.replayHash, playerName: heatmap.playerName, x: heatmap.cursorX, y: heatmap.cursorY })

    for (let i = 0; i < heatmap.data.length; i += 3) {
      heatmapSum[heatmap.data[i] + (width * heatmap.data[i + 1])] += heatmap.data[i + 2]
    }
  })

  let maxHeat: number = 1

  heatmapSum.forEach((heat) => {
    if (heat > maxHeat) maxHeat = heat
  })

  const heatmap = new Float64Array(width * height)

  heatmapSum.forEach((heat, index) => heatmap[index] = mapRange(heat, 0, maxHeat, 0, 1))

  return { data: heatmap, cursors }
}

import mapRange from '../Tools/MapRange'
