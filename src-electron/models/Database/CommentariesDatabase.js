import {ModuleDatabase} from "src-e/models/Database/ModuleDatabase";

export class CommentariesDatabase extends ModuleDatabase{
  static _instance = {}
  static _connections = {}
  static ext = '.commentaries.SQLite3'
  static path = ['commentaries']

  constructor(filename, settings){
    super(filename, settings, CommentariesDatabase.ext, CommentariesDatabase.path)
  }
}
