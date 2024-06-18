import worker from 'worker_threads'

import App from './Modules/MainThread/App/Main'

export { App }

if (!worker.isMainThread) {
  console.log(true)
}
