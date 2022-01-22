import {BibleDatabase} from "src-e/models/Database/BibleDatabase";

export default (args) => {
  {
    const res = {
      arrows: {
        before: null,
        next: null
      }
    }
    // before
    let sql = `SELECT book_number, chapter FROM verses WHERE chapter < ${args.chapterNumber} AND book_number = ${args.bookNumber} ORDER BY chapter DESC`
    const bibleDatabase = new BibleDatabase(args.filename)
    let data = bibleDatabase.db.prepare(sql).get()
    if (data) {
      res.arrows.before = {
        ref: {
          bookNumber: data.book_number,
          chapterNumber: data.chapter
        },
        disabled: false
      }
    } else {
      sql = `SELECT book_number, chapter FROM verses WHERE book_number < ${args.bookNumber} ORDER BY book_number DESC`
      data = bibleDatabase.db.prepare(sql).get()

      if (data) {
        res.arrows.before = {
          ref: {
            bookNumber: data.book_number,
            chapterNumber: data.chapter
          },
          disabled: false
        }
      } else {
        res.arrows.before = {disabled: true}
      }
    }

    // next
    sql = `SELECT book_number, chapter FROM verses WHERE chapter > ${args.chapterNumber} AND book_number = ${args.bookNumber}`
    data = bibleDatabase.db.prepare(sql).get()

    if (data) {
      res.arrows.next = {
        ref: {
          bookNumber: data.book_number,
          chapterNumber: data.chapter
        },
        disabled: false
      }
    } else {
      sql = `SELECT book_number FROM verses WHERE book_number > ${args.bookNumber}`
      data = bibleDatabase.db.prepare(sql).get()
      if (data) {
        res.arrows.next = {
          ref: {
            bookNumber: data.book_number,
            chapterNumber: 1
          },
          disabled: false
        }
      } else {
        res.arrows.next = {disabled: true}
      }
    }

    return res
  }
}
