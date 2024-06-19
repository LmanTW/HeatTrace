import os from 'os'

const defaultSettings: Settings = {
  resolution: '1024x768',
  fps: 30,

  threads: Math.round(os.cpus().length / 2) 
}

const defaultProjectData: ProjectData = {}

// Settings
interface Settings {
  resolution: '512x384' | '1024x768' | '2048x1536' | '4096x3072',
  fps: 15 | 30 | 60 | 120,

  threads: number
}

// Project Data
interface ProjectData {
  hash?: string,

  data?: {
    settings: Settings
  }
}

export { defaultSettings, defaultProjectData, Settings, ProjectData }
