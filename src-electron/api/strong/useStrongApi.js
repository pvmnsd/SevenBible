import {ipcMain} from "electron";
import getStrongNumbersInfo from "src-electron/api/strong/api/getStrongNumbersInfo";
import getVersesByStrong from "src-electron/api/strong/api/getVersesByStrong";
import {connectDatabase, disconnectDatabase} from "src-electron/api/strong/api/databaseConnection";

export default () => {
  ipcMain.handle('get-strong-numbers-info', (event, args) => getStrongNumbersInfo(args))
  ipcMain.handle('find-verse-by-strong', (event, args) => getVersesByStrong(args))
  ipcMain.on('connect-strong-database', (event, filename) => connectDatabase(filename))
  ipcMain.on('disconnect-strong-database', (event, filename) => disconnectDatabase(filename))
}
