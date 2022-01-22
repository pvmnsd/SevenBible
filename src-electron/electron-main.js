import {app, BrowserWindow, nativeTheme, ipcMain} from 'electron'
import path from 'path'
import fs from 'fs'
import os from 'os'
import {getSettings} from "./helpers/getSettings"
import useApi from "src-e/api/useApi";

const dir = process.env.DEBUGGING ? '' : path.resolve(app.getPath('userData'))
global.dir = dir
process.env.DIR = dir.toString()
const {app: {win}} = getSettings()


// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) {
}


useApi()

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'),
    center: true,
    useContentSize: true,
    frame: false,
    minHeight: 600,
    minWidth: 600,
    ...win,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  // enable(mainWindow.webContents)

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
    ipcMain.once('close-app', () => {
      mainWindow.destroy()
    })
    mainWindow.webContents.send('close-app')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
