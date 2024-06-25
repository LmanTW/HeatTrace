import os from 'os'

// Get Complete Options
function getCompleteOptions (options: HeatTrace_Options_Optional): HeatTrace_Options {
  const style = defaultValue(options.style, {})

  const cursor = defaultValue(style.cursor, {})
  const background = defaultValue(style.background, {})

  return {
    width: Math.round(defaultValue(options.width, 512)),
    height: Math.round(defaultValue(options.height, 384)),

    style: {
      heatBoost: defaultValue(style.heatBoost, 3),

      traceSize: defaultValue(style.traceSize, 1),
      traceOpacity: defaultValue(style.traceOpacity, [1, 1]),
      traceLength: defaultValue(style.traceLength, Infinity),

      colors: defaultValue(style.colors, [
        { r: 0, g: 0, b: 0 },
        { r: 106, g: 4, b: 15 },
        { r: 208, g: 0, b: 0 },
        { r: 232, g: 93, b: 4 },
        { r: 250, g: 163, b: 7 },
        { r: 255, g: 255, b: 255 }
      ]),

      cursor: {
        type: defaultValue(cursor.type, 'none'),
        distribution: defaultValue(cursor.distribution, 'player'),

        size: defaultValue(cursor.size, 1),
        opacity: defaultValue(cursor.opacity, 1),

        colors: defaultValue(cursor.colors, [
          { r: 214, g: 40, b: 40 },
          { r: 247, g: 127, b: 0 },
          { r: 252, g: 191, b: 73 },
          { r: 234, g: 226, b: 183 }
        ]),
        images: defaultValue(cursor.images, [])
      },

      background: {
        type: defaultValue(background.type, 'none'),

        brightness: defaultValue(background.brightness, 1),

        color: defaultValue(background.color, { r: 0, g: 0, b: 0 }),
        image: defaultValue(background.image, '') 
      }
    },

    imageFormat: defaultValue(options.imageFormat, 'png'),
    imageQuality: defaultValue(options.imageQuality, 1),

    videoFPS: defaultValue(options.videoFPS, 30),
    videoSpeed: defaultValue(options.videoSpeed, 1),

    threads: defaultValue(options.threads, os.cpus().length / 2),

    maxFrameQueue: defaultValue(options.maxFrameQueue, 1),
    maxCursorTravelDistance: defaultValue(options.maxCursorTravelDistance, 200) 
  }
}

// Check Options
function checkOptions (options: HeatTrace_Options): void {
  checkValues([
    { name: 'options.width', value: options.width, min: 1 },
    { name: 'options.height', value: options.height, min: 1 },

    { name: 'options.style.traceSize', value: options.style.traceSize, min: 0 },
    { name: 'options.style.traceOpacity[0]', value: options.style.traceOpacity[0], min: 0, max: 1 },
    { name: 'options.style.traceOpacity[1]', value: options.style.traceOpacity[1], min: 0, max: 1 },
    { name: 'options.style.traceLength', value: options.style.traceLength, min: 0 },

    { name: 'options.style.cursor.size', value: options.style.cursor.size, min: 0 },
    { name: 'options.style.cursor.opacity', value: options.style.cursor.opacity, min: 0, max: 1 },
 
    { name: 'options.style.background.brightness', value: options.style.background.brightness, min: 0 },

    { name: 'options.imageQuality', value: options.imageQuality, min: 0.1, max: 1 },

    { name: 'options.videoFPS', value: options.videoFPS, min: 1 },
    { name: 'options.videoSpeed', value: options.videoFPS, min: 0.1 },

    { name: 'options.threads', value: options.threads, min: 1 },

    { name: 'options.maxFrameQueue', value: options.maxFrameQueue, min: 1 },
    { name: 'options.maxCursorTravelDistance', value: options.maxCursorTravelDistance, min: 0 }
  ])

  options.style.colors.forEach((color, index) => {
    checkValues([
      { name: `options.style.colors[${index}].r`, value: color.r, min: 0, max: 255 },
      { name: `options.style.colors[${index}].g`, value: color.g, min: 0, max: 255 },
      { name: `options.style.colors[${index}].b`, value: color.b, min: 0, max: 255 }
    ])
  })

  options.style.cursor.colors.forEach((color, index) => {
    checkValues([
      { name: `options.style.cursor.colors[${index}].r`, value: color.r, min: 0, max: 255 },
      { name: `options.style.cursor.colors[${index}].g`, value: color.g, min: 0, max: 255 },
      { name: `options.style.cursor.colors[${index}].b`, value: color.b, min: 0, max: 255 }
    ])
  })

  checkValues([
    { name: 'options.style.background.color.r', value: options.style.background.color.r, min: 0, max: 255 },
    { name: 'options.style.background.color.g', value: options.style.background.color.g, min: 0, max: 255 },
    { name: 'options.style.background.color.b', value: options.style.background.color.b, min: 0, max: 255 }
  ])
}

export { getCompleteOptions, checkOptions }

import { HeatTrace_Options, HeatTrace_Options_Optional } from '../../Types/HeatTrace_Options' 
import { HeatTrace_Style_Optional } from '../../Types/HeatTrace_Style'

import defaultValue from '../Tools/DefaultValue'
import checkValues from '../Tools/CheckValues'
