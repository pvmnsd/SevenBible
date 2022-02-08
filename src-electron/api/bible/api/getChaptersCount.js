import {BibleDatabase} from "src-electron/models/Database/BibleDatabase";

export default (args) => {
  const bibleDatabase = new BibleDatabase(args.filename)
  const sql = 'SELECT COUNT(*) FROM verses WHERE book_number=? AND verse=1'
  return bibleDatabase.prepare(sql).pluck().all(args.bookNumber)[0]
}
