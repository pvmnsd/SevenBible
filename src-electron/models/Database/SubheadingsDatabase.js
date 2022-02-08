import {ModuleDatabase} from "src-electron/models/Database/ModuleDatabase";

export class SubheadingsDatabase extends ModuleDatabase {
  static _instance = {}
  static _connections = {}
  static ext = '.subheadings.SQLite3'
  static path = ['subheadings']

  constructor(filename, settings){
    super(filename, settings, SubheadingsDatabase.ext, SubheadingsDatabase.path)
  }
}
