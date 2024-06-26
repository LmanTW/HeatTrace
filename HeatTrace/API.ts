import worker from 'worker_threads'

import { HeatTrace_Options, HeatTrace_Options_Optional } from './Types/HeatTrace_Options'
import { HeatTrace_Style, HeatTrace_Style_Optional } from './Types/HeatTrace_Style'

import { loadReplay, Replay } from './Modules/ChildThread/Replay'
import startWorker from './Modules/ChildThread/Main'
import HeatTrace from './Modules/MainThread/Main'

// This is the third iteration of the codebase.
// I have rewritten it THREE TIMES because I suck.

if (!worker.isMainThread) startWorker()
// HeatTrace will be bundled into one single JavaScript file after the build process.
// This means that the worker process will also be included in the same file.

export {
  HeatTrace,
  HeatTrace_Options, HeatTrace_Options_Optional,
  HeatTrace_Style, HeatTrace_Style_Optional,

  loadReplay,
  Replay
}
