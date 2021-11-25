import {contextBridge, ipcRenderer} from 'electron'
import {BrowserWindow, app} from '@electron/remote'
import path from 'path'
import fs from 'fs'
import {getFonts} from 'font-list'

const dir = process.env.DEBUGGING ? '' : path.join(app.getAppPath(), '..')

contextBridge.exposeInMainWorld('electron', {
  invoke: (apiKey, settings) => ipcRenderer.invoke(apiKey, settings),
  send: (apiKey, settings) => ipcRenderer.send(apiKey, settings),
  closeApp: () => ipcRenderer.send('close-app'),
  onCloseApp: callback => ipcRenderer.once('close-app', callback),
  saveProgramSettings: state => ipcRenderer.invoke('save-program-settings', state),
})
contextBridge.exposeInMainWorld('system', {
  fsReaddirSync: (_path) => fs.readdirSync(path.join(dir, ..._path)),
  fsExistsSync: (_path) => fs.existsSync(path.join(dir, ..._path)),
  getAllFonts: () => getFonts()
})

contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize: () => BrowserWindow.getFocusedWindow().minimize(),
  toggleMaximize() {
    const win = BrowserWindow.getFocusedWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  },
  close: () => BrowserWindow.getFocusedWindow().close()
})

