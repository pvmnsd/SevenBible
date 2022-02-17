import fs from "fs-extra";
import path from "path";
import {BookmarkCategory} from "app/types/bookmark";

export default (): BookmarkCategory[] => {
  const _path = path.join(dir, 'user', 'bookmarks', 'bookmarks.mbb.json')
  return fs.readJSONSync(_path).categories
}
