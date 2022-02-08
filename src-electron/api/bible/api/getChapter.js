import getDirection from "src-e/helpers/getDirection";
import {BibleDatabase} from "src-e/models/Database/BibleDatabase";
import {SubheadingsDatabase} from "src-e/models/Database/SubheadingsDatabase";
import {CommentariesDatabase} from "src-e/models/Database/CommentariesDatabase";

export default (args) => {
  {
    const bibleDatabase = new BibleDatabase(args.filename)
    const res = {}
    try {
      let sql = 'SELECT text FROM verses WHERE book_number = ? AND chapter = ?'
      res.texts = bibleDatabase.prepare(sql).all(args.bookNumber, args.chapterNumber)
      sql = "SELECT long_name as bookFullName, short_name as bookShortName from books WHERE book_number = ?"
      res.bookNames = bibleDatabase.prepare(sql).get(args.bookNumber)
    } catch {
    }

    // subheadings
    if (args.showSubheadings) {
      try {
        const sql = 'SELECT verse, title from stories where book_number = ? AND chapter = ?'
        res.stories = bibleDatabase.prepare(sql).all(args.bookNumber, args.chapterNumber)
      } catch {
      }

      if (!res.stories || !args.embededOverwriteOthers) {
        res.subheadings = []
        args.activeModulesSubheadings.forEach(moduleName => {
          try {
            const subheadingsDatabase = new SubheadingsDatabase(moduleName, {native: true})

            let sql = 'SELECT * FROM info'
            const info = Object.fromEntries(subheadingsDatabase.prepare(sql).raw().all())
            const direction = args.bookNumber >= 470 ? getDirection(info).nt : getDirection(info).ot

            sql = 'SELECT verse, subheading from subheadings WHERE book_number = ? AND chapter = ?'
            const data = subheadingsDatabase.prepare(sql).all(args.bookNumber, args.chapterNumber).map(item => ({
              ...item,
              direction
            }))

            res.subheadings.push(...data)
            subheadingsDatabase.close()
          } catch {
          }
        })
      }
    }

    if (args.showCommentaries) {
      res.commentaries = {}
      args.activeModulesCommentaries.forEach(moduleName => {
        try {
          const commentariesDatabase = new CommentariesDatabase(moduleName, {native: true})
          const sql = 'SELECT * from commentaries WHERE book_number = ? AND chapter_number_from = ?'
          const commentaries = commentariesDatabase.prepare(sql).all(args.bookNumber, args.chapterNumber)
          if (commentaries.length) res.commentaries[moduleName] = commentaries
          commentariesDatabase.close()
        } catch {}
      })
    }

    return res
  }
}
