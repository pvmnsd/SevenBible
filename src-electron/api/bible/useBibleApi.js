import {ipcMain} from "electron";
import getChapter from "src-e/api/bible/api/getChapter";
import getTopBarState from "src-e/api/bible/api/getTopBarState";
import getModuleInfo from "src-e/api/bible/api/getModuleInfo";
import getChaptersCount from "src-e/api/bible/api/getChaptersCount";
import getIntroduction from "src-e/api/bible/api/getIntroduction";
import getCompared from "src-e/api/bible/api/getCompared";
import {connectDatabase, disconnectDatabase} from "src-e/api/bible/api/databaseConnection";
import findBibleTexts from "src-e/api/bible/api/findTextInBible/findBibleTexts.mjs";

export default () => {
  ipcMain.handle('get-chapter', (event, args) => getChapter(args))
  ipcMain.handle('get-top-bar-state', (event, args) => getTopBarState(args))
  ipcMain.handle('get-bible-module-info', (event, args) => getModuleInfo(args))
  ipcMain.handle('get-count-of-chapters', (event, args) => getChaptersCount(args))
  ipcMain.handle('find-texts-in-bible', (event, args) => findBibleTexts(args))
  ipcMain.handle('get-introductions', (event, args) => getIntroduction(args))
  ipcMain.handle('get-compared-translations', (event, args) => getCompared(args))
  ipcMain.on('connect-bible-database', (event, filename) => connectDatabase(filename))
  ipcMain.on('disconnect-bible-database', (event, filename) => disconnectDatabase(filename))
}
