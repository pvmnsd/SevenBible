import {ipcMain} from "electron";
import makeBookmark from "src-electron/api/categories/api/makeBookmark";
import {getBookmarkCategories} from "src-electron/api/categories/api/categoriesFS";
import removeBookmark from "src-electron/api/categories/api/removeBookmark";
import getPreparedCategories from "src-electron/api/categories/api/getPreparedCategories";
import createCategory from "src-electron/api/categories/api/createCategory";
import deleteCategory from "src-electron/api/categories/api/deleteCategory";

export default () => {
  ipcMain.handle('make-bookmark', (event, args) => makeBookmark(args))
  ipcMain.handle('get-bookmark-categories', (event, filename) => getBookmarkCategories(filename))
  ipcMain.handle('remove-bookmark', (event, args) => removeBookmark(args))
  ipcMain.handle('get-prepared-categories', (event, args) => getPreparedCategories(args))
  ipcMain.handle('create-category', (event, args) => createCategory(args))
  ipcMain.handle('delete-category', (event, args) => deleteCategory(args))
}
