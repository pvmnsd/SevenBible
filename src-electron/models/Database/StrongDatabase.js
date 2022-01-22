import {ModuleDatabase} from "src-e/models/Database/ModuleDatabase";

export class StrongDatabase extends ModuleDatabase {
  static _instance = {}
  static _connections = {}
  static ext = '.dictionary.SQLite3'
  static path = ['dictionaries', 'strong']

  constructor(filename, settings){
    super(filename, settings, StrongDatabase.ext, StrongDatabase.path)
  }
}
