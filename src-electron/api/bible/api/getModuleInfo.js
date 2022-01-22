import {BibleDatabase} from "src-e/models/Database/BibleDatabase";

export default (args) => {
  {
    const res = {
      booksList: null,
      info: {}
    }
    const bibleDatabase = new BibleDatabase(args.filename)

    // book-list
    try {
      const sql = 'SELECT book_number, short_name, long_name FROM books_all WHERE is_present'
      res.booksList = bibleDatabase.prepare(sql).all()
    } catch {
    }
    if (!res.booksList) {
      try {
        const sql = 'SELECT book_number, short_name, long_name FROM books'
        res.booksList = bibleDatabase.prepare(sql).all()
      } catch {
      }
    }

    // info
    try {
      const sql = 'SELECT * FROM info'
      res.info = Object.fromEntries(bibleDatabase.prepare(sql).raw().all())
    } catch {
    }

    return res
  }
}
