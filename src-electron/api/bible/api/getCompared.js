import path from "path";
import fs from "fs-extra";
import getDirection from "src-e/helpers/getDirection";
import {BibleDatabase} from "src-e/models/Database/BibleDatabase";

export default (args) => {
  {
    let ph = path.join(global.dir, 'modules', 'books')
    const booksDir = fs.readdirSync(ph).map(moduleName => (/[^.]+?(?=\.)/.exec(moduleName))[0])

    const res = []
    let sql
    booksDir.forEach(moduleName => {
      try {
        sql = 'SELECT text, verse FROM verses WHERE book_number = ?  AND chapter = ? AND verse = ?'
        const bibleDatabase = new BibleDatabase(moduleName, {native: true})
        const data = bibleDatabase.prepare(sql).get(args.bookNumber, args.chapterNumber, args.verseNumber)
        if (data) {
          sql = 'SELECT * from info'
          const info = Object.fromEntries(bibleDatabase.prepare(sql).raw().all())
          data.moduleDescription = info.description
          data.moduleName = moduleName
          data.direction = getDirection(info)
          res.push(data)
        }
        bibleDatabase.close()
      } catch {}
    })

    return res
  }
}
