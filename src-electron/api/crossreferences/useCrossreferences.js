import {ipcMain} from "electron";
import getCrossreferences from "src-electron/api/crossreferences/api/getCrossreferences";

export default () => {
  ipcMain.handle('get-crossreferences', (event, args) => getCrossreferences(args))
}
