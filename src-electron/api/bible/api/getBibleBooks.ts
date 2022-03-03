import {BibleDatabase} from "src-electron/models/Database/BibleDatabase";
import {BibleBooks, BibleBooksAll} from "src-electron/types/bible";

export default (filename: string): BibleBooks[] => {
  const bibleDatabase = new BibleDatabase(filename)

  let bibleBooks: BibleBooks[]

  try {
    const sql = 'SELECT book_number, short_name, long_name FROM books_all WHERE is_present'
    bibleBooks =  bibleDatabase.prepare(sql).all()

  } catch {
    try {
      const sql = 'SELECT book_number, short_name, long_name FROM books'
      bibleBooks = bibleDatabase.prepare(sql).all()
    } catch {}
  }

  return bibleBooks!
}
