import {contextBridge, ipcRenderer} from 'electron'
import {app} from '@electron/remote'
import path from 'path'
import fs from 'fs'

const dir = process.env.DEBUGGING ? '' : path.join(app.getPath('userData'))

contextBridge.exposeInMainWorld('electron', {
  invoke: (apiKey, settings) => ipcRenderer.invoke(apiKey, settings),
  send: (apiKey, settings) => ipcRenderer.send(apiKey, settings),
  closeApp: () => ipcRenderer.send('close-app'),
  onCloseApp: callback => ipcRenderer.once('close-app', callback),
  saveProgramSettings: state => ipcRenderer.invoke('save-program-settings', state),
  close: () => ipcRenderer.send('close'),
  minimize: () => ipcRenderer.send('minimize'),
  toggleMaximize: () => ipcRenderer.send('toggle-maximize'),
  getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),
  getUserThemes: () => ipcRenderer.invoke('get-themes'),
  readUserTheme: themeName => ipcRenderer.invoke('read-user-theme', themeName),
  getFontList: () => ipcRenderer.invoke('get-font-list')
})
contextBridge.exposeInMainWorld('system', {
  fsReaddirSync: (_path) => fs.readdirSync(path.join(dir, ..._path)),
  fsExistsSync: (_path) => fs.existsSync(path.join(dir, ..._path)),
  getSettings: () => fs.readFileSync(path.join(dir, 'user', 'settings', 'settings.json'), {encoding: 'utf8'}),
  getFirstExistsModuleName: (_path) => fs.readdirSync(path.join(dir, ..._path))[0].split('.')[0]
})
