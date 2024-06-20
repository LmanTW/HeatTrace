// Combine Heatmaps
export default (width: number, height: number, heatmaps: Uint32Array[]): Float64Array => {
  const heatmapSum = new Uint32Array(width * height)

  heatmaps.forEach((heatData) => {
    for (let i = 0; i < heatData.length; i += 3) {
      heatmapSum[heatData[i] + (width * heatData[i + 1])] += heatData[i + 2]
    }
  })

  let maxHeat: number = 0

  heatmapSum.forEach((heat) => {
    if (heat > maxHeat) maxHeat = heat
  })

  const heatmap = new Float64Array(width * height)

  heatmapSum.forEach((heat, index) => heatmap[index] = mapRange(heat, 0, maxHeat, 0, 1))

  return heatmap
}

import mapRange from '../Tools/MapRange'
