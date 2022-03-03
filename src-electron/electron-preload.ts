import {contextBridge, ipcRenderer} from 'electron'
import path from 'path'
import fs from 'fs'
import {BibleBooks, BibleInfo, BibleVerses} from "src-electron/types/bible";
import {Commentaries} from "src-electron/types/commentaries";
import {BookmarkCategory} from "app/types/bookmark";
import {MakeBookmarkArgs} from "app/types/api-args/system";
import {RemoveBookmarkArgs} from "app/types/api-args/system";
import {PreparedCategory} from "app/types/api-modified/categories";
import {CreateCategoryArgs, DeleteCategoryArgs, GetPreparedCategoriesArgs} from "app/types/api-args/categories";
import {GetVersesArgs} from "app/types/api-args/bible";
import {PreparedVerse} from "app/types/api-modified/bible";


window.dir = process.env.dir!

export const API = {
  bible: {
    connectDatabase: (filename: string) => ipcRenderer.send('connect-bible-database', filename),
    disconnectDatabase: (filename: string) => ipcRenderer.send('disconnect-bible-database', filename),
    getChapter: (args: any) => ipcRenderer.invoke('get-chapter', args),
    getTopBarState: (args: any) => ipcRenderer.invoke('get-top-bar-state', args),
    getBibleInfo: (filename: string): Promise<BibleInfo> => ipcRenderer.invoke('get-bible-info', filename),
    getBibleBooks: (filename: string): Promise<BibleBooks> => ipcRenderer.invoke('get-bible-books', filename),
    getChaptersCount: (args: any) => ipcRenderer.invoke('get-count-of-chapters', args),
    getFindedTexts: (args: any) => ipcRenderer.invoke('find-texts-in-bible', args),
    getIntroduction: (args: any) => ipcRenderer.invoke('get-introductions', args),
    getCompared: (args: any) => ipcRenderer.invoke('get-compared-translations', args),
    getVerses: (args: GetVersesArgs): Promise<PreparedVerse[]> => ipcRenderer.invoke('get-bible-verses', args),
  },

  strong: {
    connectDatabase: (filename: string) => ipcRenderer.send('connect-strong-database', filename),
    disconnectDatabase: (filename: string) => ipcRenderer.send('disconnect-strong-database', filename),
    getStrongNumbersInfo: (args: any) => ipcRenderer.invoke('get-strong-numbers-info', args),
    getFindedVerseByStrong: (args: any) => ipcRenderer.invoke('find-verse-by-strong', args),
  },

  commentaries: {
    connectDatabase: (filename: string) => ipcRenderer.send('connect-commentaries-database', filename),
    disconnectDatabase: (filename: string) => ipcRenderer.send('disconnect-commentaries-database', filename),
    getCommentaries: (args: any) => ipcRenderer.invoke('get-commentaries', args),
    getFootnotes: (args: any): Promise<Commentaries[]> => ipcRenderer.invoke('get-footnotes', args),
    getCompared: (args: any): Promise<Commentaries[]> => ipcRenderer.invoke('commentaries:get-compared', args)
  },

  crossreferences: {
    getCrossreferences: (args: any) => ipcRenderer.invoke('get-crossreferences', args)
  },

  electron: {
    onCloseApp: (callback: () => void) => ipcRenderer.once('close-app', callback),
    closeApp: () => ipcRenderer.send('close-app'),
    close: () => ipcRenderer.send('close'),
    getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),
    minimize: () => ipcRenderer.send('minimize'),
    toggleMaximize: () => ipcRenderer.send('toggle-maximize'),
  },

  system: {
    fsReaddirSync: (_path: string[]) => fs.readdirSync(path.join(window.dir, ..._path)),
    fsReadFileSync: (_path: string[]) => fs.readFileSync(path.join(window.dir, ..._path), {encoding: 'utf-8'}),
    fsExistsSync: (_path: string[]) => fs.existsSync(path.join(window.dir, ..._path)),
    getSettings: () => fs.readFileSync(path.join(window.dir, 'user', 'settings', 'settings.json'), {encoding: 'utf8'}),
    getUserThemes: () => ipcRenderer.invoke('get-themes'),
    readUserTheme: (themeName: string) => ipcRenderer.invoke('read-user-theme', themeName),
    getFontList: () => ipcRenderer.invoke('get-font-list'),
    saveProgramSettings: (state: string) => ipcRenderer.invoke('save-program-settings', state),
  },

  categories: {
    makeBookmark: (args: MakeBookmarkArgs): Promise<any> => ipcRenderer.invoke('make-bookmark', args),
    getBookmarkCategories: (filename: string): Promise<BookmarkCategory[]> => ipcRenderer.invoke('get-bookmark-categories', filename),
    removeBookmark: (args: RemoveBookmarkArgs): Promise<void> => ipcRenderer.invoke('remove-bookmark', args),
    getPreparedCategories: (args: GetPreparedCategoriesArgs): Promise<PreparedCategory[]> => ipcRenderer.invoke('get-prepared-categories', args),
    createCategory: (args: CreateCategoryArgs): Promise<void> => ipcRenderer.invoke('create-category', args),
    deleteCategory: (args: DeleteCategoryArgs): Promise<void> => ipcRenderer.invoke('delete-category', args),
  }
}


contextBridge.exposeInMainWorld('api', API)
