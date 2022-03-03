import fs from "fs-extra";
import path from "path";
import {BookmarkCategory} from "app/types/bookmark";

const pathToCategories = path.join('user', 'bookmarks')
const ext = '.mbb.json'

export const getBookmarkCategories =  (filename: string): BookmarkCategory[] => {
  return fs.readJSONSync(path.join(dir, pathToCategories, filename + ext)).categories
}

export const writeBookmarkCategories = (filename: string, object: any): void => {
  fs.writeJSONSync(path.join(dir, pathToCategories, filename + ext), {categories: object} )
}
