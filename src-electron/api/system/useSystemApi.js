import {ipcMain} from "electron";
import {getFonts} from "font-list";
import saveProgramSettings from "src-electron/api/system/api/saveProgramSettings";
import getThemes from "src-electron/api/system/api/getThemes";
import readUserTheme from "src-electron/api/system/api/readUserTheme";

export default () => {
  ipcMain.handle('save-program-settings', (_, state) => saveProgramSettings(state))
  ipcMain.handle('get-themes', () => getThemes())
  ipcMain.handle('read-user-theme', (event, themeName) => readUserTheme(themeName))
  ipcMain.handle('get-font-list', () => getFonts())
}
