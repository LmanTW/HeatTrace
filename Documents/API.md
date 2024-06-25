# HeatTrace API
The API of HeatTrace.

## Installation
Download [HeatTrace.js](../Assets/HeatTrace.js) into your project. (You can also download [HeatTrace.d.ts](../Assets/HeatTrace.d.ts) for TypeScript support)

* [HeatTrace](#heattrace)
  * [Getters](#getters)
  * [initialize()](#initialize)
  * [terminate()](#terminate)
  * [loadReplays()](#loadReplays)
  * [renderImage()](#renderImage)
  * [renderVideo()](#renderVideo)

# HeatTrace
```ts
import { HeatTrace } from './HeatTrace.js'

new HeaTrace(<options>) // Create a new HeatTrace instance.
```
* `options: HeatTrace_Options_Optional` | Options for HeatTrace.

## Getters
* `state <string>` | The state of the HeatTrace instance.
* `options <HeatTrace_Options>` | The options of the HeatTrace instance.

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
