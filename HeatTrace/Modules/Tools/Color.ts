// Color
namespace Color {
  export interface RGB { r: number, g: number, b: number }

  // Get Gradient Color 
  export function getGradientColor (value: number, colors: Color.RGB[]): Color.RGB {
    // Don't really know how this works, borrowed this from ChatGPT lol.

    const step = 1 / (colors.length - 1)
    
    let colorIndex = Math.floor(value / step) 

    if (colorIndex >= colors.length) colorIndex = colors.length - 1

    const startColor = colors[colorIndex]
    const endColor = colors[colorIndex + 1] || colors[colorIndex]

    const t = (value % step) / step

    return interpolateColor(startColor, endColor, t)
  }
}

// Interpolate Color
function interpolateColor(color1: Color.RGB, color2: Color.RGB, value: number): Color.RGB {
  let r = Math.round(color1.r + (color2.r - color1.r) * value)
  let g = Math.round(color1.g + (color2.g - color1.g) * value)
  let b = Math.round(color1.b + (color2.b - color1.b) * value)

  if (r > 255) r = 255
  if (g > 255) g = 255
  if (b > 255) b = 255

  return { r, g, b }
}

export default Color
