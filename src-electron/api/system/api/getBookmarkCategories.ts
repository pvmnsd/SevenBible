import fs from "fs-extra";
import path from "path";

export default () => {
  const _path = path.join(dir, 'user', 'bookmarks', 'bookmarks.mbb.json')
  return fs.readJSONSync(_path)
}
