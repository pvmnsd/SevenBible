import WrapperDatabase from "src-e/wrappers/Database/Database";
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
          this.constructor._instance[filename] = this._getConnection()
        }

        if (!this.constructor._connections[filename]) {
          this.constructor._connections[filename] = 0
        }
        this.constructor._connections[filename]++

      }
      return this.constructor._instance[filename]
    }
  }

  _getConnection = () => new WrapperDatabase(path.join(this._directory, ...this._path, this._filename), {readonly: this._readonly})

  disconnect() {
    this.constructor._connections[this._filename]--
    if (this.constructor._connections[this._filename] === 0) {
      this.constructor._instance[this._filename].close()
      delete this.constructor._instance[this._filename]
      delete this.constructor._connections[this._filename]
    }
  }

  prepare(sql) {
    return {
      pluck: () => ({
        all: (...args) => this.db.prepare(sql).pluck().all(args),
        get: (...args) => this.db.prepare(sql).pluck().get(args),
      }),
      all: (...args) => this.db.prepare(sql).all(args),
      get: (...args) => this.db.prepare(sql).get(args),
    }
  }
}
