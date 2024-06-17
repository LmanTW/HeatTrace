import worker from 'worker_threads'

import startMainThread from './Modules/MainThread/Main'

if (worker.isMainThread) startMainThread()
else {
  console.log(true)
}
