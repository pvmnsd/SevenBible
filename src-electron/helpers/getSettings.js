import fs from 'fs-extra'
import {join} from 'path'
import {settingsScheme} from "src-electron/objects/settingsScheme"

export const getSettings = () => {
  try {
    const settings = fs.readFileSync(join(global.dir, 'user', 'settings', 'settings.json'), {encoding: "utf8"})
    return JSON.parse(settings)
  } catch (e) {
    fs.outputJson(join(global.dir, 'user', 'settings', 'settings.json'), settingsScheme)
    return settingsScheme
  }
}
