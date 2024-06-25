import worker from 'worker_threads'

import { Job_Result } from '../../Types/Job_Result'
import { Message } from '../../Types/Message'

import { getCursorData } from './CursorData'
import loadTexture from './LoadTexture'
import { loadReplay } from './Replay'
import { Render } from './Render'
import Heatmap from './Heatmap'

// Start The Worker
export default () => {
  worker.parentPort!.on('message', async (msg: Message) => {
    if (msg.type === 'assignJob') {
      const jobData = msg.jobData
      let result!: Job_Result

      if (jobData.type === 'loadTexture') {
        const data = await loadTexture(
          jobData.filePath,

          jobData.scaleType,
          jobData.width,
          jobData.height,

          jobData.effect
        )

        result = {
          type: 'loadTexture',

          error: data.error,
          message: data.message,

          data: {
            filePath: jobData.filePath,

            texture: data.texture!
          }
        }
      } else if (jobData.type === 'loadReplay') {
        const replay = await loadReplay(jobData.data)

        if (replay.gameMode !== 'standard') result = { type: 'loadReplay', error: true, message: 'Unsupport Game Mode' }
        else if (replay.cursor === undefined) result = { type: 'loadReplay', error: true, message: 'Failed To Decompress Cursor Data' }
        else {
          result = {
            type: 'loadReplay',

            error: false,

            data: {
              beatmapHash: replay.beatmapHash,

              cursorData: getCursorData(replay.playerName, replay.replayHash, replay.cursor, jobData.maxCursorTravelDistance)
            }
          }
        }
      } else if (jobData.type === 'calculateHeatmap') {
        result = {
          type: 'calculateHeatmap',

          cursorInfo: Heatmap.calculateHeatmap(
            jobData.width, jobData.height,

            jobData.start, jobData.end,

            jobData.heatmap,
            jobData.cursorData,

            jobData.style
          )
        }
      } else if (jobData.type === 'normalizeHeatmap') {
        result = {
          type: 'normalizeHeatmap',

          normalizedHeatmap: Heatmap.normalizeHeatmap(jobData.heatmap)
        }
      } else if (jobData.type === 'renderLayer') {
        const layerData = jobData.layerData

        if (layerData.type === 'background') {
          result = {
            type: 'renderLayer',

            layer: Render.renderBackground(layerData.width, layerData.height, layerData.textures, jobData.style)
          }
        } else if (layerData.type === 'heatmap') {
          result = {
            type: 'renderLayer',

            layer: Render.renderHeatmap(layerData.heatmap, jobData.style)
          }
        }
      } else if (jobData.type === 'renderImage') {
        result = {
          type: 'renderImage',

          data: await Render.renderImage(jobData.format, jobData.width, jobData.height, jobData.layers) 
        }
      }

      sendMessage({
        type: 'jobFinished',

        batchID: msg.batchID,

        jobID: msg.jobID,
        jobResult: result
      })
    } 
  })

  sendMessage({ type: 'readied' })
}

// Send A Message
function sendMessage (message: Message): void {
  worker.parentPort!.postMessage(message)
}
