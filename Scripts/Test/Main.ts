import * as pty from 'node-pty'
import path from 'path'

import check from '../Build/Check'
import build from '../Build/Build'

// Start
async function start (): Promise<void> {
  if (check()) {
    await build() 

    const childProcess = pty.spawn('node', [path.resolve(__dirname, '../../Assets/HeatTrace_APP.js')], {
      cols: process.stdout.columns,
      rows: process.stdout.rows
    })

    childProcess.onData((data) => process.stdout.write(data))

    process.stdin.setRawMode(true)
    process.stdin.on('data', (data) => childProcess.write(data.toString())) 

    childProcess.onExit(() => process.exit())
  }
}

start()
