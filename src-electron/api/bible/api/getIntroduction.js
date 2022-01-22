import {BibleDatabase} from "src-e/models/Database/BibleDatabase";

export default (args) => {
  {
    const bibleDatabase = new BibleDatabase(args.filename)
    const sql = args.chapterNumber === 1 ? 'SELECT * from introductions where book_number in (0, ?)' : 'SELECT * from introductions where book_number in (?)'
    let res = []
    try {
      res = bibleDatabase.db.prepare(sql).all(args.bookNumber)
    } catch {
    }

    return res
  }
}
