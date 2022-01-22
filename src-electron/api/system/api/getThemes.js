import fs from "fs-extra";
import path from "path";

export default () => {
  return fs.readdirSync(path.join(global.dir, 'user', 'themes'))
    .map(theme => theme.split('.')[0])
}
