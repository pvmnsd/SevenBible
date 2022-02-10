import {BibleDatabase} from "src-electron/models/Database/BibleDatabase";

export default (args: any) => {
  const {
    filename,
    bookNumber,
    chapterNumber,
    selectedVerseFrom,
    selectedVerseTo
  } = args

  const bibleDatabase = new BibleDatabase(filename)
  const sql = `SELECT *
               FROM verses
               WHERE book_number = ${bookNumber}
                 AND chapter = ${chapterNumber}
                 AND verse BETWEEN ${selectedVerseFrom} and ${selectedVerseTo ?? selectedVerseFrom}`

  const verses = bibleDatabase.prepare(sql).all()

  return verses
}
