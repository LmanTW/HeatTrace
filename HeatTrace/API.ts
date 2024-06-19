import worker from 'worker_threads'

import startWorker from './Modules/ChildThread/Main'
import App from './Modules/MainThread/App/Main'

export { App }

if (!worker.isMainThread && worker.workerData.HeatTrace === true) startWorker() 
