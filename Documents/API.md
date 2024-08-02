# HeatTrace API
The JavaScript / Typescript API of HeatTrace.

## Installation
1. Download [HeatTrace.js](../Assets/HeatTrace.js) into your project.

> [!NOTE]
> You can also download [HeatTrace.d.ts](../Assets/HeatTrace.d.ts) for TypeScript support.

2. Install the dependencies: `lzma-native`, `jimp`, `ffmpeg-static`, `fluent-ffmpeg`.

* Npm:`npm install lzma-native jimp ffmpeg-static fluent-ffmpeg`
* Yarn: `yarn install lzma-native jimp ffmpeg-static fluent-ffmpeg`
* Pnpm: `pnpm add lzma-native jimp ffmpeg-static fluent-ffmpeg`

## Contents
* [HeatTrace](#heattrace)
  * [Getters](#getters)
  * [initialize()](#initialize)
  * [terminate()](#terminate)
  * [loadReplays()](#loadreplays)
  * [renderImage()](#renderimage)
  * [renderVideo()](#rendervideo)
* [Other](#other)
  * [loadReplay()](#loadreplay)
* [Types](#types)
  * [HeatTrace_Options](#heattrace_options)
  * [HeatTrace_Options_Optional](#heattrace_options_optional)
  * [HeatTrace_Style](#heattrace_style)
  * [HeatTrace_Style_Optional](#heattrace_style_optional)
  * [Replay](#replay)
  * [RawCursorData](#rawcursordata)

# HeatTrace
```ts
import { HeatTrace } from './HeatTrace.js'

new HeaTrace(<options>) // Create a new HeatTrace instance.
```
* `options?: HeatTrace_Options_Optional` | Options for HeatTrace. ([\<HeatTrace_Options\>](#heattrace_options))

## Getters
* `state: string` | The state of the HeatTrace instance.
* `options: HeatTrace_Options` | The options of the HeatTrace instance.

## initialize()
```ts
.initialize(<progress>) // Initialize the HeatTrace instance.
```
* `progress?: (<info>) => any` | The progress callback function.
  * `info: { type: 'loadingTextures' | 'startingWorkers' }` | The info of the progress.

> `return Promise<{ error: boolean, message?: string }>`

## terminate()
```ts
.terminate() // Terminate the HeatTrace instance.
```

> `return Promise<void>`

## loadReplays()
```ts
.loadReplays(<replays>, <progress>) // Load replays.
```
* `replays: Buffer[]` | The replays you want to load. (The raw buffer data of the replay files.)
* `progress?: (<info>) => any` | The progress callback function.
  * `info: { total: number, finished: number }` | The info of the progress.

> `return Promise<{ error: boolean, message?: string, data?: { loaded: number, failed: number }}>`

## renderImage()
```ts
.renderImage(<frame>, <progress>) // Render an image.
```
* `frame?: undefined | number` | The frame to render. `Default: The Last Frame`
* `progress?: (<info>) => any` | The progress callback function.
  * `info: { type: 'calculatingHeatmaps' | 'renderingLayers' | 'encodingImage', total: number, finished: number }` | The info of the progress.

> `return Promise<Uint8Array>`

## renderVideo()
```ts
.renderVideo(<cachePath>, <start>, <end>, <progress>) // Render a video.
```
* `cachePath: string` | The path of a directory to save video frames and the encoded video. 
* `start?: undefined | number` | The start frame. `Default: 1` 
* `end?: undefined | number` | The end frame. `Default: The Last Frame`
* `progress?: (<info>) => any` | The progress callback function.
  * `info: { type: 'renderingFrames' | 'encodingVideo', total: number, finished: number }` | The info of the progress.

# Other
Other utilities that HeatTrace provides.

## loadReplay()
```ts
import { loadReplay } from './HeatTrace.js'

loadReplay(<data>) // Load A Replay
```
* `data: Buffer` | The raw buffer data of the replay file.

> `return Promise<Replay>` ([\<Replay\>](#replay))

# Types
TypeScript types of HeatTrace.

## HeatTrace_Options
```ts
{
  width: number, // Default: 512
  height: number, // Default: 384
  
  style: HeatTrace_Style,
  
  imageFormat: 'png' | 'jpeg' | 'raw', // Default: "png"
  imageQuality: number, // Default: 1

  videoFPS: number, // Default: 30
  videoSpeed: number, // Default: 1 

  threads: number, // Default: Total Threads / 2

  maxFrameQueue: number, // Default: 1
  // The amount of frames that can be process simultaneously.
  // (If HeatTrace is not using all the threads you gives when rendering video, you can increase this value.)
  maxCursorTravelDistance: number, // Default: 200 (Pixels)
  // The distance of how far can the cursor travel each time the cursor moves.
  // (This is to fix some weird data in the replay files, you can try changing this if the cursor data is weird.)
}
```

## HeatTrace_Options_Optional
It's just [<HeatTrace_Options>](#heattrace_options) but everything is optional.

## HeatTrace_Style
```ts
{
  heatBoost: number, // Default: 3 

  traceSize: number, // Default: 1
  traceOpacity: [number, number], // Default: [1, 1]
  // The start opacity and the end opacity of the trace.
  traceLength: number, // Default: Infinity (Seconeds)

  colors: { r: number, g: number, b: number }[], // Default: [#000000, #6A040F, #D00000, #E85D04, #FAA307, #FFFFFF]
  // The colors of the trace.

  cursor: {
    type: 'none' | 'color' | 'image', // Default: "none""
    distribution: 'player' | 'replay', // Default: "replay"

    size: number, // Default: 1
    opacity: number, // Opacity: 1

    colors: { r: number, g: number, b: number }[], // Default: [#D62828, #F77F00, #FCBF49, #EAE2B7]
    images: string[], // Default: []
    // Absolute path of image files.

    imageAlign: 'start' | 'center' // Default: "start"
  },

  background: {
    type: 'none' | 'color' | 'image', // Default: "none"

    brightness: number, // Default: 1

    color: { r: number, g: number, b: number }, // Default: #000000
    image: string, // Default: ""
    // Absolute path of an image.
  }
}
```

## HeatTrace_Style_Optional
It's just [<HeatTrace_Style>](#heattrace_style) but everyting is optional.

## Replay
```ts
{
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
```

## RawCursorData
```ts
{
  xPositions: Float64Array,
  yPositions: Float64Array,
  timeStamps: Float64Array
}
```
