import {BibleDatabase} from "src-electron/models/Database/BibleDatabase";
import {BibleInfo} from "src-electron/types/bible";

export default (filename: string): BibleInfo => {
  {
    const bibleDatabase = new BibleDatabase(filename)
    const sql = 'SELECT * FROM info'
    const info: BibleInfo = Object.fromEntries(bibleDatabase.prepare(sql).raw().all())
    return info
  }
}
