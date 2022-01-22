import {ipcMain} from "electron";
import getCrossreferences from "src-e/api/crossreferences/api/getCrossreferences";

export default () => {
  ipcMain.handle('get-crossreferences', (event, args) => getCrossreferences(args))
}
