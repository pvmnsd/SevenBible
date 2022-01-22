import {ipcMain} from "electron";
import getCommentaries from "src-e/api/commentaries/api/getCommentaries";
import getFootnotes from "src-e/api/commentaries/api/getFootnotes";
import {connectDatabase, disconnectDatabase} from "src-e/api/commentaries/api/databaseConnection";

export default () => {
  ipcMain.handle('get-commentaries', (event, args) => getCommentaries(args))
  ipcMain.handle('get-footnotes', (event, args) => getFootnotes(args))
  ipcMain.on('connect-commentaries-database', (event, filename) => connectDatabase(filename))
  ipcMain.on('disconnect-commentaries-database', (event, filename) => disconnectDatabase(filename))
}
