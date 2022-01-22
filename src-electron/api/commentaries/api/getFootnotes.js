import {CommentariesDatabase} from "src-e/models/Database/CommentariesDatabase";

export default (args) => {
  {
    let commentariesDatabase = new CommentariesDatabase(args.filename, {native: true})
    const sql = 'SELECT marker, text FROM commentaries WHERE book_number = ? AND chapter_number_from = ?'
    const res = Object.fromEntries(commentariesDatabase.prepare(sql).raw().all(args.bookNumber, args.chapterNumber))
    commentariesDatabase.close()
    return res
  }
}
