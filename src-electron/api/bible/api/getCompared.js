import path from "path";
import fs from "fs-extra";
import getDirection from "src-e/helpers/getDirection";
import {BibleDatabase} from "src-e/models/Database/BibleDatabase";

export default (args) => {
  {
    const {
      bookNumber,
      chapterNumber,
      versesNumbers
    } = args

    let ph = path.join(global.dir, 'modules', 'books')
    const booksDir = fs.readdirSync(ph).map(moduleName => (/[^.]+?(?=\.)/.exec(moduleName))[0])

    const res = []
    let sql = `SELECT text, verse FROM verses WHERE book_number = ${bookNumber}  AND chapter = ${chapterNumber} AND verse in (${versesNumbers})`

    booksDir.forEach(moduleName => {
      try {
        const item = {}
        const bibleDatabase = new BibleDatabase(moduleName, {native: true})
        const data = bibleDatabase.prepare(sql).all()
        if (data) {
          item.texts = data
          const sql1 = 'SELECT * from info'
          const info = Object.fromEntries(bibleDatabase.prepare(sql1).raw().all())
          item.moduleDescription = info.description
          item.moduleName = moduleName
          item.direction = getDirection(info)
          res.push(item)
        }
        bibleDatabase.close()
      } catch {
      }
    })

    return res
  }
}
