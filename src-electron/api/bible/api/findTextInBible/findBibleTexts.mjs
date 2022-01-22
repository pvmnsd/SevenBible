import path from 'path'
import Database from 'better-sqlite3'
import {BibleDatabase} from "src-e/models/Database/BibleDatabase.js";

export default (args) => {
  const fundedTexts = []

  const dbSearch = new Database(path.join(global.dir, 'modules', 'search', `${args.filename}.SQLite3.search`), {readonly: true})

  let sql = `SELECT book_number, chapter, verse FROM texts WHERE bare_lowercase_words like('%${args.searchString}%')`
  const fundedRefs = dbSearch.prepare(sql).all()
  dbSearch.close()

  const bibleDatabase = new BibleDatabase(args.filename, {native: true})
  fundedRefs.forEach(ref => {
    sql = 'SELECT *, (SELECT long_name FROM books WHERE book_number = @bookNumber) as long_name, rowid FROM verses WHERE book_number = @bookNumber AND chapter = @chapterNumber AND verse = @verseNumber'
    fundedTexts.push(bibleDatabase.prepare(sql).get({
      bookNumber: ref.book_number,
      verseNumber: ref.verse,
      chapterNumber: ref.chapter
    }))
  })
  bibleDatabase.close()
  return fundedTexts
}

