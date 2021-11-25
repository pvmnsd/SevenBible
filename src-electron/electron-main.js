import {app, BrowserWindow, nativeTheme, dialog, ipcMain} from 'electron'
import {initialize, enable} from '@electron/remote/main'
import path from 'path'
import fs from 'fs'
import os from 'os'
import useHandlers from './handlers'
import settings from '/user/settings/settings.json'
import {colors} from "quasar";
const {programSettings: {win}} = settings

initialize()

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) {
}

useHandlers()


let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'),
    center: true,
    useContentSize: true,
    frame: false,
    ...win,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  enable(mainWindow.webContents)

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('close', (e) => {
    e.preventDefault()
    ipcMain.once('close-app', () => app.exit())
    mainWindow.webContents.send('close-app')
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

// app.on('window-all-closed', () => {
//   if (platform !== 'darwin') {
//     app.quit()
//   }
// })


app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
