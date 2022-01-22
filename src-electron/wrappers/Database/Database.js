import BetterSqlite from "better-sqlite3";

export default class Database{
  #database

  constructor(path, options = {}) {
    this.#database = new BetterSqlite(path, options)
  }

  prepare(sql){
    return new PreparedDatabase(this.#database, sql)
  }
  close(){
    this.#database.close()
  }
}
class PreparedDatabase {
  database
  sql
  constructor(database, sql) {
    this.database = database
    this.sql = sql
  }
  pluck(){
    return new PluckedDatabase(this.database, this.sql)
  }
  raw(){
    return new RawwedDatabase(this.database, this.sql)
  }
  get(){
    return this.database.prepare(this.sql).get(...arguments)
  }
  all(){
    return this.database.prepare(this.sql).all(...arguments)
  }
}
class PluckedDatabase extends PreparedDatabase{
  constructor(database, sql) {
    super(database, sql);
  }
  get(){
    return this.database.prepare(this.sql).pluck().get(...arguments)
  }
  all() {
    return this.database.prepare(this.sql).pluck().all(...arguments)
  }
}
class RawwedDatabase extends PreparedDatabase {
  constructor(database, sql) {
    super(database, sql);
  }
  get(){
    return this.database.prepare(this.sql).raw().get(...arguments)
  }
  all() {
    return this.database.prepare(this.sql).raw().all(...arguments)
  }
}
