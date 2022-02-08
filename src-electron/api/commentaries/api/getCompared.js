import path from "path";
import fs from "fs";
import {CommentariesDatabase} from "src-electron/models/Database/CommentariesDatabase";

export default (args) => {
  const {
    bookNumber,
    chapterNumber,
    verseNumber
  } = args
  const sql = `
    select text
    from commentaries
    WHERE book_number = ${bookNumber}
      and CASE
            WHEN chapter_number_to is null OR chapter_number_to is 0
              THEN chapter_number_from = ${chapterNumber} AND verse_number_from = ${verseNumber}
            WHEN chapter_number_from = chapter_number_to THEN chapter_number_from = ${chapterNumber} AND
                                                              ${verseNumber} BETWEEN verse_number_from AND verse_number_to
            WHEN ${chapterNumber} = chapter_number_from THEN ${verseNumber} >= verse_number_from
            when ${chapterNumber} = chapter_number_to THEN ${verseNumber} <= verse_number_to END
  `

  const commentariesModules = fs.readdirSync(path.join(global.dir, 'modules', 'commentaries')).map(name => name.split('.')[0])
  const res = []


  commentariesModules.forEach(moduleName => {
    const commentariesDatabase = new CommentariesDatabase(moduleName, {native: true})
    const data = commentariesDatabase.prepare(sql).get()
    if (data){
      data.filename = moduleName
      res.push(data)
    }
  })
  return res

}
