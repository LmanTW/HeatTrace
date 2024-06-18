import check from './Check'
import build from './Build'

// Start The Build Process
async function start (): Promise<void> {
  if (check()) {
    await build()
  } 
}

start()
