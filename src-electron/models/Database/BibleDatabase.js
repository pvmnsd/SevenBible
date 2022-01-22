import {ModuleDatabase} from "src-e/models/Database/ModuleDatabase";

export class BibleDatabase extends ModuleDatabase {
  static _instance = {}
  static _connections = {}
  static ext = '.SQLite3'
  static path = ['books']

  constructor(filename, settings){
    super(filename, settings, BibleDatabase.ext, BibleDatabase.path)
  }
}
