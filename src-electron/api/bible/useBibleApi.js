import {ipcMain} from "electron";
import getChapter from "src-electron/api/bible/api/getChapter";
import getTopBarState from "src-electron/api/bible/api/getTopBarState";
import getBibleInfo from "src-electron/api/bible/api/getBibleInfo";
import getChaptersCount from "src-electron/api/bible/api/getChaptersCount";
import getIntroduction from "src-electron/api/bible/api/getIntroduction";
import getCompared from "src-electron/api/bible/api/getCompared";
import {connectDatabase, disconnectDatabase} from "src-electron/api/bible/api/databaseConnection";
import findBibleTexts from "src-electron/api/bible/api/findTextInBible/findBibleTexts.mjs";
import getBibleBooks from "src-electron/api/bible/api/getBibleBooks";

export default () => {
  ipcMain.handle('get-chapter', (event, args) => getChapter(args))
  ipcMain.handle('get-top-bar-state', (event, args) => getTopBarState(args))
  ipcMain.handle('get-bible-info', (event, args) => getBibleInfo(args))
  ipcMain.handle('get-bible-books', (event, args) => getBibleBooks(args))
  ipcMain.handle('get-count-of-chapters', (event, args) => getChaptersCount(args))
  ipcMain.handle('find-texts-in-bible', (event, args) => findBibleTexts(args))
  ipcMain.handle('get-introductions', (event, args) => getIntroduction(args))
  ipcMain.handle('get-compared-translations', (event, args) => getCompared(args))
  ipcMain.on('connect-bible-database', (event, filename) => connectDatabase(filename))
  ipcMain.on('disconnect-bible-database', (event, filename) => disconnectDatabase(filename))
}
