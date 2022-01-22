import BetterSqlite from 'better-sqlite3'
import path from 'path'

export class Database {
  static _instance = {}
  static _connections = {}
  _path
  _filename
  _directory = 'modules'
  _keepConnections
  _native
  _readonly
  db

  constructor(filename, path, {keepConnections = false, native = false, readonly = true} = {}) {
    this._filename = filename
    this._path = path
    this._keepConnections = keepConnections
    this._native = native
    this._readonly = readonly

    if (this.constructor.name === Database.name) {

      this._createConnection()
    } else {
      {
        if (this._native) {
          return this._getConnection()
        }
      }

      if (this._keepConnections) {
        if (!this.constructor._instance[filename]) {
          this.constructor._instance[filename] = this
          this._createConnection()
        }

        if (!this.constructor._connections[filename]) {
          this.constructor._connections[filename] = 0
        }
        this.constructor._connections[filename]++

      }
      return this.constructor._instance[filename]
    }
  }

  _createConnection() {
    try {
      this.db = this._getConnection()
    } catch (e) {
      console.error(`error while connecting`, e)
    }
  }

  _getConnection = () => new BetterSqlite(path.join(this._directory, ...this._path, this._filename), {readonly: this._readonly})

  disconnect() {
    this.constructor._connections[this._filename]--
    if (this.constructor._connections[this._filename] === 0) {
      this.db.close()
      delete this.constructor._instance[this._filename]
      delete this.constructor._connections[this._filename]
    }
  }

  get Filename() {
    return this._filename
  }
}
