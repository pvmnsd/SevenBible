import {ipcMain} from "electron";
import getCommentaries from "src-electron/api/commentaries/api/getCommentaries";
import getFootnotes from "src-electron/api/commentaries/api/getFootnotes";
import {connectDatabase, disconnectDatabase} from "src-electron/api/commentaries/api/databaseConnection";
import getCompared from "src-electron/api/commentaries/api/getCompared";

export default () => {
  ipcMain.handle('get-commentaries', (event, args) => getCommentaries(args))
  ipcMain.handle('get-footnotes', (event, args) => getFootnotes(args))
  ipcMain.on('connect-commentaries-database', (event, filename) => connectDatabase(filename))
  ipcMain.on('disconnect-commentaries-database', (event, filename) => disconnectDatabase(filename))
  ipcMain.handle('commentaries:get-compared', (event, args) => getCompared(args))
}
