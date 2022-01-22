import {Database} from "src-e/models/Database/Database";

export class ModuleDatabase extends Database {

  constructor(filename, settings, ext, path) {
    if (/\.SQLite3/.test(filename) === false)
      filename = filename + ext
    super(filename, path, settings)
  }
}
