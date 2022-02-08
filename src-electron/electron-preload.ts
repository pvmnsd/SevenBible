import {contextBridge, ipcRenderer} from 'electron'
import path from 'path'
import fs from 'fs'
import {BibleBooks, BibleInfo} from "src-electron/types/bible";
import {Commentaries} from "src-electron/types/commentaries";


window.dir = process.env.dir!

const bible = {
  connectDatabase: (filename: string) => ipcRenderer.send('connect-bible-database', filename),
  disconnectDatabase: (filename: string) => ipcRenderer.send('disconnect-bible-database', filename),
  getChapter: (args: any) => ipcRenderer.invoke('get-chapter', args),
  getTopBarState: (args: any) => ipcRenderer.invoke('get-top-bar-state', args),
  getBibleInfo: (args: any): Promise<BibleInfo> => ipcRenderer.invoke('get-bible-info', args),
  getBibleBooks: (args: any): Promise<BibleBooks> => ipcRenderer.invoke('get-bible-books', args),
  getChaptersCount: (args: any) => ipcRenderer.invoke('get-count-of-chapters', args),
  getFindedTexts: (args: any) => ipcRenderer.invoke('find-texts-in-bible', args),
  getIntroduction: (args: any) => ipcRenderer.invoke('get-introductions', args),
  getCompared: (args: any) => ipcRenderer.invoke('get-compared-translations', args)
}

const strong = {
  connectDatabase: (filename: string) => ipcRenderer.send('connect-strong-database', filename),
  disconnectDatabase: (filename: string) => ipcRenderer.send('disconnect-strong-database', filename),
  getStrongNumbersInfo: (args: any) => ipcRenderer.invoke('get-strong-numbers-info', args),
  getFindedVerseByStrong: (args: any) => ipcRenderer.invoke('find-verse-by-strong', args),
}

const commentaries ={
  connectDatabase: (filename: string) => ipcRenderer.send('connect-commentaries-database', filename),
  disconnectDatabase: (filename: string) => ipcRenderer.send('disconnect-commentaries-database', filename),
  getCommentaries: (args: any) => ipcRenderer.invoke('get-commentaries', args),
  getFootnotes: (args: any): Promise<Commentaries[]> => ipcRenderer.invoke('get-footnotes', args),
  getCompared: (args: any): Promise<Commentaries[]> => ipcRenderer.invoke('commentaries:get-compared', args)
}

const crossreferences = {
  getCrossreferences: (args: any) => ipcRenderer.invoke('get-crossreferences', args)
}

const electron = {
  onCloseApp: (callback: () => void) => ipcRenderer.once('close-app', callback),
  closeApp: () => ipcRenderer.send('close-app'),
  close: () => ipcRenderer.send('close'),
  getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),
  minimize: () => ipcRenderer.send('minimize'),
  toggleMaximize: () => ipcRenderer.send('toggle-maximize'),
}

const system = {
  fsReaddirSync: (_path: string[]) => fs.readdirSync(path.join(window.dir, ..._path)),
  fsExistsSync: (_path: string[]) => fs.existsSync(path.join(window.dir, ..._path)),
  getSettings: () => fs.readFileSync(path.join(window.dir, 'user', 'settings', 'settings.json'), {encoding: 'utf8'}),
  getUserThemes: () => ipcRenderer.invoke('get-themes'),
  readUserTheme: (themeName: string) => ipcRenderer.invoke('read-user-theme', themeName),
  getFontList: () => ipcRenderer.invoke('get-font-list'),
  saveProgramSettings: (state: string) => ipcRenderer.invoke('save-program-settings', state),
}

export const API = {
  bible,
  strong,
  commentaries,
  crossreferences,
  electron,
  system
}

contextBridge.exposeInMainWorld('api', API)
