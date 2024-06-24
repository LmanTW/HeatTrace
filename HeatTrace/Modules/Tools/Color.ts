// Color
namespace Color {
  export interface RGB { r: number, g: number, b: number }

  // Get Gradient Color 
  export function getGradientColor (value: number, colors: Color.RGB[]): Color.RGB {
    // Don't really know how this works, I just borrowed this from ChatGPT.

    const step = 1 / (colors.length - 1)
    
    let colorIndex = Math.floor(value / step) 

    if (colorIndex >= colors.length) colorIndex = colors.length - 1

    const startColor = colors[colorIndex]
    const endColor = colors[colorIndex + 1] || colors[colorIndex]

    const t = (value % step) / step

    let r = Math.round(startColor.r + (endColor.r - startColor.r) * t)
    let g = Math.round(startColor.g + (endColor.g - startColor.g) * t)
    let b = Math.round(startColor.b + (endColor.b - startColor.b) * t)

    return {
      r: Math.min(r, 255),
      g: Math.min(g, 255),
      b: Math.min(b, 255)
    }
  }
}

export default Color
