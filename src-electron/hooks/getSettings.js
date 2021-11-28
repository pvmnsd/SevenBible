import {writeFileSync, readFileSync} from 'fs'
import {join} from 'path'
import {settingsScheme} from "src-e/objects/settingsScheme"

export const getSettings = () => {
  try {
    const settings = readFileSync(join(global.dir, 'user', 'settings', 'settings.json'), {encoding: "utf8"})
    return JSON.parse(settings)
  } catch (e) {
    const settingsStr = JSON.stringify(settingsScheme, null, 2)
    writeFileSync(join(dir, 'user', 'settings', 'settings.json'), settingsStr)
    return settingsScheme
  }
}
