import {BibleDatabase} from "src-e/models/Database/BibleDatabase";
import {BibleBooks, BibleBooksAll} from "src-e/types/bible";

export default (args: any) => {
  const bibleDatabase = new BibleDatabase(args.filename)

  try {
    const sql = 'SELECT book_number, short_name, long_name FROM books_all WHERE is_present'
    return  bibleDatabase.prepare(sql).all() as BibleBooksAll

  } catch {
    try {
      const sql = 'SELECT book_number, short_name, long_name FROM books'
      return bibleDatabase.prepare(sql).all() as BibleBooks
    } catch {}
  }

}
