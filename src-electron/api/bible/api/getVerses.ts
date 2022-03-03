import {BibleDatabase} from "src-electron/models/Database/BibleDatabase";
import {BibleVerses} from "src-electron/types/bible";
import {PreparedVerse} from "app/types/api-modified/bible";
import {GetVersesArgs} from "app/types/api-args/bible";

export default (args: GetVersesArgs): PreparedVerse[] => {
  const {
    filename,
    bookNumber,
    chapterNumber,
    selectedVerseFrom,
    selectedVerseTo
  } = args

  const bibleDatabase = new BibleDatabase(filename)
  const sql = `SELECT v.*, b.short_name
               FROM verses v,
                    books b
               WHERE v.book_number = ${bookNumber}
                 AND v.chapter = ${chapterNumber}
                 AND v.verse BETWEEN ${selectedVerseFrom} and ${selectedVerseTo ?? selectedVerseFrom}
                 AND b.book_number = v.book_number`

  const verses: PreparedVerse[] = bibleDatabase.prepare(sql).all()

  return verses
}
