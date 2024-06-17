import path from 'path'
import os from 'os'
import fs from 'fs'

// Data Manager
class DataManager {
  public static get dataPath () {return dataPath}

  // Check Data Files
  public static check (): void {
    if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath)

    if (!fs.existsSync(path.join(dataPath, 'Data'))) fs.mkdirSync(path.join(dataPath, 'Data'))
    if (!fs.existsSync(path.join(dataPath, 'Replays'))) fs.mkdirSync(path.join(dataPath, 'Replays'))

    if (!fs.existsSync(path.join(dataPath, 'Data', 'Settings.json'))) fs.writeFileSync(path.join(dataPath, 'Data', 'Settings.json'), JSON.stringify(defaultSettings))
    if (!fs.existsSync(path.join(dataPath, 'Data', 'ProjectData.json'))) fs.writeFileSync(path.join(dataPath, 'Data', 'ProjectData.json'), JSON.stringify({}))
  }

  // Get The Settings
  public static getSettings (): Settings {
    this.check()

    return JSON.parse(fs.readFileSync(path.join(dataPath, 'Data', 'Settings.json'), 'utf8'))
  }

  // Save The Settings
  public static saveSettings (settings: Settings): void {
    this.check()

    fs.writeFileSync(path.join(dataPath, 'Data', 'Settings.json'), JSON.stringify(settings))
  }

  // Get The Replays
  public static getReplays (): string[] {
    this.check()

    const replays: string[] = []

    fs.readdirSync(path.join(dataPath, 'Replays')).forEach((fileName) => {
      if (path.extname(fileName) === '.osr') replays.push(path.join(dataPath, 'Replays', fileName))
    })

    return replays
  }
}

const dataPath = path.join(os.homedir(), 'HeatTrace')

const defaultSettings: Settings = {
  resolution: '1024x768',
  fps: 30,

  threads: Math.round(os.cpus().length / 2) 
}

// Settings
interface Settings {
  resolution: '512x384' | '1024x768' | '2048x1536' | '4096x3072',
  fps: 15 | 30 | 60 | 120,

  threads: number
}

// Project Data
interface ProjectData {
  hash: string 
}

export { DataManager }
