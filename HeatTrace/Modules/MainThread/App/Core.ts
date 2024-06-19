import path from 'path'
import os from 'os'
import fs from 'fs'

// App Core
export default class {
  private _dataPath = path.join(os.homedir(), 'HeatTrace')
  private _state: 'idle' | 'running' = 'idle'

  public UserInterface!: UserInterface
  public PageManager!: PageManager

  public settings!: Settings
  public projectData!: ProjectData

  constructor () {
    this.UserInterface = new UserInterface(this)
    this.PageManager = new PageManager(this)

    this.loadData()

    this.PageManager
      .addPage(Rendering_Image)
      .addPage(Page_Settings)
      .addPage(Page_Recover)
      .addPage(Page_Render)
      .addPage(Page_Home)
  }

  public get dataPath () {return this._dataPath}
  public get state () {return this._state}

  // Start The APP
  public start (): void {
    if (this._state !== 'idle') throw new Error(`Cannot Start The APP: ${this._state}`)

    this._state = 'running'

    this.PageManager.switchPage('home')

    this.UserInterface.start()
  }

  // Stop the APP
  public stop (): void {
    if (this._state !== 'running') throw new Error(`Cannot Stop The APP: ${this._state}`)

    this._state = 'idle'

    this.UserInterface.stop()
  }

  // Load Data
  public loadData (): void {
    this.check()

    this.settings = JSON.parse(fs.readFileSync(path.join(this._dataPath, 'Data', 'Settings.json'), 'utf8'))
    this.projectData = JSON.parse(fs.readFileSync(path.join(this._dataPath, 'Data', 'ProjectData.json'), 'utf8'))
  }

  // Save Data
  public saveData (): void {
    this.check()

    fs.writeFileSync(path.join(this._dataPath, 'Data', 'Settings.json'), JSON.stringify(this.settings))
    fs.writeFileSync(path.join(this._dataPath, 'Data', 'ProjectData.json'), JSON.stringify(this.projectData))
  }

  // Check Data Files
  public check (): void {
    if (!fs.existsSync(this._dataPath)) fs.mkdirSync(this._dataPath)

    if (!fs.existsSync(path.join(this._dataPath, 'Data'))) fs.mkdirSync(path.join(this._dataPath, 'Data'))
    if (!fs.existsSync(path.join(this._dataPath, 'Replays'))) fs.mkdirSync(path.join(this._dataPath, 'Replays'))
    if (!fs.existsSync(path.join(this._dataPath, 'Results'))) fs.mkdirSync(path.join(this._dataPath, 'Results'))

    if (!fs.existsSync(path.join(this._dataPath, 'Data', 'Settings.json'))) fs.writeFileSync(path.join(this._dataPath, 'Data', 'Settings.json'), JSON.stringify(defaultSettings))
    if (!fs.existsSync(path.join(this._dataPath, 'Data', 'ProjectData.json'))) fs.writeFileSync(path.join(this._dataPath, 'Data', 'ProjectData.json'), JSON.stringify(defaultProjectData))
  }
}

import { defaultSettings, defaultProjectData, Settings, ProjectData } from './Data'
import { PageManager } from '../Managers/PageManager'
import { UserInterface } from './UserInterface'

import Rendering_Image from './Pages/Rendering_Image'
import Page_Settings from './Pages/Settings'
import Page_Recover from './Pages/Recover'
import Page_Render from './Pages/Render'
import Page_Home from './Pages/Home'
