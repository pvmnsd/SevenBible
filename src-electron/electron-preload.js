import {contextBridge, ipcRenderer} from 'electron'
import path from 'path'
import fs from 'fs'

global.dir = process.env.DIR

contextBridge.exposeInMainWorld('bible', {
  connectDatabase: (filename) => ipcRenderer.send('connect-bible-database', filename),
  disconnectDatabase: (filename) => ipcRenderer.send('disconnect-bible-database', filename),
  getChapter: (args) => ipcRenderer.invoke('get-chapter', args),
  getTopBarState: (args) => ipcRenderer.invoke('get-top-bar-state', args),
  getModuleInfo: (args) => ipcRenderer.invoke('get-bible-module-info', args),
  getChaptersCount: (args) => ipcRenderer.invoke('get-count-of-chapters', args),
  getFindedTexts: (args) => ipcRenderer.invoke('find-texts-in-bible', args),
  getIntroduction: (args) => ipcRenderer.invoke('get-introductions', args),
  getCompared: (args) => ipcRenderer.invoke('get-compared-translations', args)
})
contextBridge.exposeInMainWorld('strong', {
  connectDatabase: (filename) => ipcRenderer.send('connect-strong-database', filename),
  disconnectDatabase: (filename) => ipcRenderer.send('disconnect-strong-database', filename),
  getStrongNumbersInfo: (args) => ipcRenderer.invoke('get-strong-numbers-info', args),
  getFindedVerseByStrong: (args) => ipcRenderer.invoke('find-verse-by-strong', args),
})
contextBridge.exposeInMainWorld('commentaries', {
  connectDatabase: (filename) => ipcRenderer.send('connect-commentaries-database', filename),
  disconnectDatabase: (filename) => ipcRenderer.send('disconnect-commentaries-database', filename),
  getCommentaries: (args) => ipcRenderer.invoke('get-commentaries', args),
  getFootnotes: (args) => ipcRenderer.invoke('get-footnotes', args)
})
contextBridge.exposeInMainWorld('crossreferences', {
  getCrossreferences: (args) => ipcRenderer.invoke('get-crossreferences', args)
})
contextBridge.exposeInMainWorld('electron', {
  onCloseApp: callback => ipcRenderer.once('close-app', callback),
  closeApp: () => ipcRenderer.send('close-app'),
  close: () => ipcRenderer.send('close'),
  getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),
  minimize: () => ipcRenderer.send('minimize'),
  toggleMaximize: () => ipcRenderer.send('toggle-maximize'),
})
contextBridge.exposeInMainWorld('system', {
  fsReaddirSync: (_path) => fs.readdirSync(path.join(global.dir, ..._path)),
  fsExistsSync: (_path) => fs.existsSync(path.join(global.dir, ..._path)),
  getSettings: () => fs.readFileSync(path.join(global.dir, 'user', 'settings', 'settings.json'), {encoding: 'utf8'}),
  getUserThemes: () => ipcRenderer.invoke('get-themes'),
  readUserTheme: themeName => ipcRenderer.invoke('read-user-theme', themeName),
  getFontList: () => ipcRenderer.invoke('get-font-list'),
  saveProgramSettings: state => ipcRenderer.invoke('save-program-settings', state),
})
