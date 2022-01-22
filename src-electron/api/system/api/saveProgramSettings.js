import fs from "fs-extra";
import path from "path";

export default (state) => {
  return fs.writeFileSync(path.join(global.dir, 'user', 'settings', 'settings.json'), state)
}
