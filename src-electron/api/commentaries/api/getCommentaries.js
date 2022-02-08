import {CommentariesDatabase} from "src-electron/models/Database/CommentariesDatabase";

export default (args) => {
  {
    const commentariesDatabase = new CommentariesDatabase(args.filename)

    const sql = `SELECT chapter_number_from as chapter, verse_number_from as verseNumber, text
                 FROM commentaries
                 WHERE book_number = ?
                   AND chapter_number_from = ?`
    const res = commentariesDatabase.prepare(sql).all(args.bookNumber, args.chapterNumber)

    return res
  }
}
