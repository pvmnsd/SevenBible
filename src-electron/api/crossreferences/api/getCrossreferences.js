import fs from "fs-extra";
import path from "path";
import {CrossreferencesDatabase} from "src-electron/models/Database/CrossreferencesDatabase";
import {BibleDatabase} from "src-electron/models/Database/BibleDatabase";

export default (args) => {
  {
    const crossreferencesDir = fs.readdirSync(path.join(global.dir, 'modules', 'crossreferences'))
    const sql = 'SELECT book_to, chapter_to, verse_to_start, verse_to_end, votes, rowid FROM cross_references WHERE book = ? AND chapter = ? AND verse = ?'
    const result = []
    const bibleDatabase = new BibleDatabase(args.filename)
    crossreferencesDir.forEach(filename => {
      const crossreferencesDatabase = new CrossreferencesDatabase(filename, {native: true})
      const foundedRefs = crossreferencesDatabase.prepare(sql).all(args.bookNumber, args.chapterNumber, args.verse)
      crossreferencesDatabase.close()

      const sql1 = 'SELECT verse, text FROM verses WHERE book_number = @bookNumber AND chapter = @chapterNumber AND verse BETWEEN @verseStart AND @verseEnd'
      const prepared = bibleDatabase.prepare(sql1)
      for (const foundedRef of foundedRefs) {
        const unique = result.some(ref => ref.book_to === foundedRef.book_to &&
          ref.chapter_to === foundedRef.chapter_to &&
          ref.verse_to_start === foundedRef.verse_to_start &&
          ref.verse_to_end === foundedRef.verse_to_end)
        if (!unique) {
          const texts = prepared.all({
            bookNumber: foundedRef.book_to,
            chapterNumber: foundedRef.chapter_to,
            verseStart: foundedRef.verse_to_start,
            verseEnd: foundedRef.verse_to_end === 0 ? foundedRef.verse_to_start : foundedRef.verse_to_end
          })
          if (!texts.length)
            continue
          foundedRef.texts = texts
          foundedRef.module_name = filename.split('.')[0]
          foundedRef.expanded = false
          foundedRef.bookShortName = bibleDatabase.prepare(`SELECT short_name FROM books WHERE book_number = ?`).pluck().get(foundedRef.book_to)
          result.push(foundedRef)
        }
      }
    })
    return result
  }
}
