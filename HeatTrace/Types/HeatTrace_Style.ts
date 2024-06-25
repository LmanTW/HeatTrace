// HeatTrace Style
interface HeatTrace_Style {
  heatBoost: number,

  traceSize: number,
  traceOpacity: [number, number],
  traceLength: number, // Seconeds

  colors: Color.RGB[],

  cursor: {
    type: 'none' | 'color' | 'image',
    distribution: 'player' | 'replay',

    size: number,
    opacity: number

    colors: Color.RGB[],
    images: string[],

    imageAlign: 'start' | 'center'
  },

  background: {
    type: 'none' | 'color' | 'image',

    brightness: number,

    color: Color.RGB,
    image: string,
  } 
}

// Optional HeatTrace Style
interface HeatTrace_Style_Optional {
  heatBoost?: number,

  traceSize?: number,
  traceOpacity?: [number, number],
  traceLength?: number, // Seconeds

  colors?: Color.RGB[],

  cursor?: {
    type?: 'none' | 'color' | 'image',
    distribution?: 'player' | 'replay',

    size?: number,
    opacity?: number

    colors?: Color.RGB[],
    images?: string[]
  },

  background?: {
    type?: 'none' | 'color' | 'image',

    brightness?: number,

    color?: Color.RGB,
    image?: string 
  }
}

export { HeatTrace_Style, HeatTrace_Style_Optional }

import Color from '../Modules/Tools/Color'
