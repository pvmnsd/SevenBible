import WrapperDatabaseApi from "src-e/wrappers/DatabaseApi/DatabaseApi";
import BetterSqlite from "better-sqlite3";
import path from 'path'

export class Database extends WrapperDatabaseApi {
  static _instance = {}
  static _connections = {}
  _path
  _filename
  _directory = 'modules'
  _keepConnections
  _native
  _readonly

  constructor(filename, path, {keepConnections = false, native = false, readonly = true} = {}) {
    super()
    this._filename = filename
    this._path = path
    this._keepConnections = keepConnections
    this._native = native
    this._readonly = readonly


    if (this._native) {
      this._setConnection()
      return this
    }


    if (this._keepConnections) {
      if (!this.constructor._instance[filename]) {
        this._setConnection()
        this.constructor._instance[filename] = this
      }

      if (!this.constructor._connections[filename]) {
        this.constructor._connections[filename] = 0
      }
      this.constructor._connections[filename]++

    }
    return this.constructor._instance[filename]

  }

  _setConnection = () => {
    this.database = new BetterSqlite(
      path.join(this._directory, ...this._path, this._filename),
      {readonly: this._readonly}
    )
  }

  disconnect() {
    this.constructor._connections[this._filename]--
    if (this.constructor._connections[this._filename] === 0) {
      this.constructor._instance[this._filename].close()
      delete this.constructor._instance[this._filename]
      delete this.constructor._connections[this._filename]
    }
  }
}
