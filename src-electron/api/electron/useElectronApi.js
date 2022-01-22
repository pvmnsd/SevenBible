import {BrowserWindow, ipcMain} from "electron";
import toggleMaximize from "src-e/api/electron/api/toggleMaximize";

export default () => {
  ipcMain.on('close', () => BrowserWindow.getFocusedWindow().close())
  ipcMain.on('minimize', () => BrowserWindow.getFocusedWindow().minimize())
  ipcMain.on('toggle-maximize', () => toggleMaximize())
  ipcMain.handle('get-window-bounds', () => {
    return BrowserWindow.fromId(1).getBounds()
  })
}
