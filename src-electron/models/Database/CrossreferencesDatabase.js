import {ModuleDatabase} from "src-e/models/Database/ModuleDatabase";

export class CrossreferencesDatabase extends ModuleDatabase {
  static _instance = {}
  static _connections = {}
  static ext = '.crossreferences.SQLite3'
  static path = ['crossreferences']

  constructor(filename, settings){
    super(filename, settings, CrossreferencesDatabase.ext, CrossreferencesDatabase.path)
  }
}
