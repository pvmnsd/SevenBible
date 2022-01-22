import fs from "fs-extra";
import path from "path";

export default (themeName) => {
  return fs.readJSON(path.join(global.dir, 'user', 'themes', themeName) + '.json')
}
