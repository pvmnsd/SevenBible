import {contextBridge, ipcRenderer} from 'electron'
import {BrowserWindow, /*app*/} from '@electron/remote'
import path from 'path'
import fs from 'fs'
import fontList from 'font-list'

contextBridge.exposeInMainWorld('electron', {
  invoke: (apiKey, settings) => ipcRenderer.invoke(apiKey, settings),
  send: (apiKey, settings) => ipcRenderer.send(apiKey, settings)
})
contextBridge.exposeInMainWorld('system', {
  fsReaddirSync: (_path) => fs.readdirSync(_path),
  pathResolve: (_path) => path.resolve(..._path),
  pathJoin: (_path) => path.join(..._path),
  fsExistsSync: (_path) => fs.existsSync(_path),
  getAllFonts: () => fontList.getFonts()
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

