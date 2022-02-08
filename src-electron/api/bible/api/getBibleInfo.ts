import {BibleDatabase} from "src-e/models/Database/BibleDatabase";
import {BibleInfo} from "src-e/types/bible";

export default (args: any) => {
  {
    const bibleDatabase = new BibleDatabase(args.filename)
    const sql = 'SELECT * FROM info'
    const info: BibleInfo = Object.fromEntries(bibleDatabase.prepare(sql).raw().all())
    return info
  }
}
