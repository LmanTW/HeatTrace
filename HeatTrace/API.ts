import worker from 'worker_threads'

import Color from './Modules/Tools/Color'

import { loadReplay, Replay } from './Modules/ChildThread/Replay'
import { HeatTraceOptions, HeatTraceOptions_Optional, HeatTraceStyle, HeatTraceStyle_Optional } from './Modules/MainThread/Core'
import { startWorker } from './Modules/ChildThread/Main'
import HeatTrace from './Modules/MainThread/Main'

if (!worker.isMainThread && worker.workerData.type === 'HeatTrace') startWorker()

export {
  Color,

  HeatTrace,
  HeatTraceOptions, HeatTraceOptions_Optional,
  HeatTraceStyle, HeatTraceStyle_Optional,

  loadReplay, Replay
}
