# HeatTrace API
The API of HeatTrace.

## Installation
Download [HeatTrace.js](../Assets/HeatTrace.js) into your project.

> [!NOTE]
> You can also download [HeatTrace.d.ts](../Assets/HeatTrace.d.ts) for TypeScript support.

## Contents
* [HeatTrace](#heattrace)
  * [Getters](#getters)
  * [initialize()](#initialize)
  * [terminate()](#terminate)
  * [loadReplays()](#loadReplays)
  * [renderImage()](#renderImage)
  * [renderVideo()](#renderVideo)
* [Types](#types)
  * [HeatTrace_Options](#heattrace_options)
  * [HeatTrace_Options_Optional](#heattrace_options_optional)

# HeatTrace
```ts
import { HeatTrace } from './HeatTrace.js'

new HeaTrace(<options>) // Create a new HeatTrace instance.
```
* `options: HeatTrace_Options_Optional` | Options for HeatTrace. ([<HeatTrace_Options>](#heattrace_options))

## Getters
* `state: string` | The state of the HeatTrace instance.
* `options: HeatTrace_Options` | The options of the HeatTrace instance.

## initialize()
```ts
.initialize(<progress>) // Initialize the HeatTrace instance.
```
* `progress?: <({ type: 'loadingTextures' | 'startingWorkers' }) => any>` | The progress callback function.

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
* `replays: Buffer[]` | The replays you want to load. (The raw buffer data of the file.)
* `progress?: (info: { total: number, finished: number }) => any` | The progress callback function.

> `return Promise<{ error: boolean, message?: string, data?: { loaded: number, failed: number }}>`

## renderImage()
```ts
.renderImage(<frame>, <progress>) // Render an image.
```
* `frame?: undefined | number` | The frame to render. `Default: The Last Frame`
* `progress?: (info: { type: 'calculatingHeatmaps' | 'renderingLayers' | 'encodingImage', total: number, finished: number }) => any` | The progress callback function.

> `return Promise<Uint8Array>`

## renderVideo()
```ts
.renderVideo(<cachePath>, <start>, <end>, <progress>) // Render a video.
```
* `cachePath: string` | The path of a directory to save video frames and the encoded video. 
* `start?: undefined | number` | The start frame. `Default: 1` 
* `end?: undefined | number` | The end frame. `Default: The Last Frame`
* `progress?: (info: { type: 'renderingFrames' | 'encodingVideo', total: number, finished: number }) => any` | The progress callback function.

# Types
Types for HeatTrace.

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
