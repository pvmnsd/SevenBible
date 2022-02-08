import {CommentariesDatabase} from "src-electron/models/Database/CommentariesDatabase";

export default (args) => {
  {
    let commentariesDatabase = new CommentariesDatabase(args.filename, {native: true})
    const sql = 'SELECT * FROM commentaries WHERE book_number = ? AND chapter_number_from = ?'
    const res = commentariesDatabase.prepare(sql).all(args.bookNumber, args.chapterNumber)
    commentariesDatabase.close()
    return res
  }
}
