import {ipcMain, app} from 'electron'
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3-with-prebuilds'

const dir = process.env.DEBUGGING ? '' : path.join(app.getAppPath(), '..')

function getDirection(info) {
  return info.right_to_left === 'true' ? {
      nt: 'rtl',
      ot: 'rtl'
    }
    : info.right_to_left_nt === 'true' ? {
        nt: 'rtl',
        ot: 'ltr'
      }
      : info.right_to_left_ot === 'true' ? {
          nt: 'ltr',
          ot: 'rtl'
        }
        : {
          nt: 'ltr',
          ot: 'ltr'
        }
}


const databases = {}

function useHandlers() {

  const openDbConnectionIfNotExists = bookFileName => {
    if (!databases[bookFileName]) {
      databases[bookFileName] = new Database(path.join(dir, 'modules', 'books', bookFileName+'.SQLite3'), {readonly: true})
    }
  }
  const closeDbConnection = (bookFileName, activeBibleModules) => {
    if (!(activeBibleModules.includes(bookFileName))) {
      databases[bookFileName].close()
      delete databases[bookFileName]
    }
  }

  ipcMain.handle('change-db-connection', (event, args) => {
    openDbConnectionIfNotExists(args.bookFileName)
    closeDbConnection(args.oldBookFileName, args.activeBibleModules)
  })

  ipcMain.handle('close-db-connection', (event, args) => {
    closeDbConnection(args.bookFileName, args.activeBibleModules)
  })

  ipcMain.handle('get-chapter', (event, args) => {
    openDbConnectionIfNotExists(args.bookFileName)
    const res = {}
    try {
      const sql = 'SELECT text FROM verses WHERE book_number = ? AND chapter = ?'
      res.texts = databases[args.bookFileName].prepare(sql).all(args.bookNumber, args.chapterNumber)
    } catch {
    }

    // subheadings
    if (args.showSubheadings) {
      try {
        const sql = 'SELECT verse, title from stories where book_number = ? AND chapter = ?'
        res.stories = databases[args.bookFileName].prepare(sql).all(args.bookNumber, args.chapterNumber)
      } catch {
      }

      if (!res.stories || !args.embededOverwriteOthers) {
        res.subheadings = []
        args.activeModulesSubheadings.forEach(moduleName => {
          try {
            const ph = path.join(dir, 'modules', 'subheadings', `${moduleName}.subheadings.SQLite3`)
            const subheadingDb = new Database(ph, {readonly: true})

            let sql = 'SELECT * FROM info'
            const info = Object.fromEntries(subheadingDb.prepare(sql).raw().all())
            const direction = args.bookNumber >= 470 ? getDirection(info).nt : getDirection(info).ot

            sql = 'SELECT verse, subheading from subheadings WHERE book_number = ? AND chapter = ?'
            const data = subheadingDb.prepare(sql).all(args.bookNumber, args.chapterNumber).map(item => ({
              ...item,
              direction
            }))

            res.subheadings.push(...data)
            subheadingDb.close()
          } catch {
          }
        })
      }
    }

    if (args.showCommentaries) {
      res.commentaries = {}
      args.activeModulesCommentaries.forEach(moduleName => {
        try {
          const ph = path.join(dir, 'modules', 'commentaries', `${moduleName}.commentaries.SQLite3`)
          const commentariesDb = new Database(ph, {readonly: true})
          const sql = 'SELECT text, verse_number_from, verse_number_to from commentaries WHERE book_number = ? AND chapter_number_from = ?'
          const commentaries = commentariesDb.prepare(sql).all(args.bookNumber, args.chapterNumber)
          if (commentaries.length) res.commentaries[moduleName] = commentaries
          commentariesDb.close()
        } catch {
        }
      })
    }

    return res
  })

  ipcMain.handle('get-top-bar-state', (event, args) => {
    openDbConnectionIfNotExists(args.bookFileName)
    // Состояние срелок навигации
    const res = {
      arrows: {
        before: null,
        next: null
      }
    }
    // before
    let sql = `SELECT book_number, chapter FROM verses WHERE chapter < ${args.chapterNumber} AND book_number = ${args.bookNumber} ORDER BY chapter DESC`
    let data = databases[args.bookFileName].prepare(sql).get()
    if (data) {
      res.arrows.before = {
        ref: {
          bookNumber: data.book_number,
          chapterNumber: data.chapter
        },
        disabled: false
      }
    } else {
      sql = `SELECT book_number, chapter FROM verses WHERE book_number < ${args.bookNumber} ORDER BY book_number DESC`
      data = databases[args.bookFileName].prepare(sql).get()

      if (data) {
        res.arrows.before = {
          ref: {
            bookNumber: data.book_number,
            chapterNumber: data.chapter
          },
          disabled: false
        }
      } else {
        res.arrows.before = {disabled: true}
      }
    }

    // next
    sql = `SELECT book_number, chapter FROM verses WHERE chapter > ${args.chapterNumber} AND book_number = ${args.bookNumber}`
    data = databases[args.bookFileName].prepare(sql).get()

    if (data) {
      res.arrows.next = {
        ref: {
          bookNumber: data.book_number,
          chapterNumber: data.chapter
        },
        disabled: false
      }
    } else {
      sql = `SELECT book_number FROM verses WHERE book_number > ${args.bookNumber}`
      data = databases[args.bookFileName].prepare(sql).get()
      if (data) {
        res.arrows.next = {
          ref: {
            bookNumber: data.book_number,
            chapterNumber: 1
          },
          disabled: false
        }
      } else {
        res.arrows.next = {disabled: true}
      }
    }

    return res
  })

  ipcMain.handle('get-bible-module-info', (event, args) => {
    openDbConnectionIfNotExists(args.bookFileName)
    const res = {
      booksList: null,
      info: {}
    }

    // book-list
    try {
      const sql = 'SELECT book_number, short_name, long_name FROM books_all WHERE is_present'
      res.booksList = databases[args.bookFileName].prepare(sql).all()
    } catch {
    }
    if (!res.booksList) {
      try {
        const sql = 'SELECT book_number, short_name, long_name FROM books'
        res.booksList = databases[args.bookFileName].prepare(sql).all()
      } catch {
      }
    }

    // info
    try {
      const sql = 'SELECT * FROM info'
      res.info = Object.fromEntries(databases[args.bookFileName].prepare(sql).raw().all())
    } catch {
    }

    return res
  })

  ipcMain.handle('get-count-of-chapters', (event, args) => {
    const sql = 'SELECT COUNT(*) FROM verses WHERE book_number=? AND verse=1'
    return databases[args.bookFileName].prepare(sql).pluck().all(args.bookNumber)[0]
  })

  ipcMain.handle('find-texts-in-bible', (event, args) => {
    const fundedTexts = []
    const dbSearch = new Database(path.join(dir, 'modules', 'search', `${args.bookFileName}.SQLite3.search`), {readonly: true})

    let sql = `SELECT book_number, chapter, verse FROM texts WHERE bare_lowercase_words like('%${args.searchString}%')`
    const fundedRefs = dbSearch.prepare(sql).all()
    dbSearch.close()

    fundedRefs.forEach(ref => {
      sql = 'SELECT * FROM verses WHERE book_number = ? AND chapter = ? AND verse = ?'
      fundedTexts.push(databases[args.bookFileName].prepare(sql).get(ref.book_number, ref.chapter, ref.verse))
    })
    return fundedTexts
  })

  ipcMain.handle('get-strong-numbers-info', (event, args) => {
    const strongDb = new Database(path.join(dir, 'modules', 'dictionaries', 'strong', `${args.strongFileName}.dictionary.SQLite3`), {readonly: true})
    const res = {}
    args.strongNumbers.forEach(number => {
      let sql = 'SELECT strong_number FROM cognate_strong_numbers WHERE group_id in(SELECT group_id FROM cognate_strong_numbers WHERE strong_number = ?)'
      let data = strongDb.prepare(sql).pluck().all(number)
      res[number] = {}
      res[number].cognate = data

      sql = 'SELECT definition FROM dictionary WHERE topic=UPPER(?)'
      data = strongDb.prepare(sql).get(number)
      res[number].definition = data.definition
    })
    strongDb.close()
    return res
  })

  ipcMain.handle('find-verse-by-strong', (event, args) => {
    const parsedNumbers = args.strongNumbers.map(current => {
      const strongNumbersPrefix = current[0].toUpperCase()
      return {
        strongNumbersPrefix,
        number: current.substr(1),
        testament: args.fixedStrongNumbersPrefix && args.fixedStrongNumbersPrefix !== strongNumbersPrefix ? '<0'
          : args.fixedStrongNumbersPrefix ? '>0'
            : strongNumbersPrefix === 'H' ? '<=460'
              : strongNumbersPrefix === 'G' ? '>=470'
                : '<0'
      }
    })
    let res = []
    if (args.separator === 'AND') {
      let sql = `SELECT * from verses WHERE book_number ${parsedNumbers[0].testament} `
      parsedNumbers.forEach(item => sql += `AND text like '%<S>${item.number}</S>%' `)
      res = databases[args.bookFileName].prepare(sql).all()
      res.forEach(item => item.strongNumbersPrefix = parsedNumbers[0].testament === '<=460' ? 'H' : 'G')
    } else if (args.separator === 'OR') {
      const texts = {}
      parsedNumbers.forEach(parsedNumber => {
        const sql = `SELECT * from verses WHERE book_number ${parsedNumber.testament} AND text like '%<S>${parsedNumber.number}</S>%'`
        const findedTexts = databases[args.bookFileName].prepare(sql).all()
        findedTexts.forEach(item => {
          const prop = item.book_number + '-' + item.chapter + '-' + item.verse
          if (!(prop in texts)) {
            item.strongNumbersPrefix = parsedNumber.testament === '<=460' ? 'H' : 'G'
            texts[prop] = item
          }
        })
      })
      res = Object.values(texts)
    }

    return res
  })

  ipcMain.handle('get-crossreferences', (event, args) => {
    const crossreferencesDir = fs.readdirSync(path.join(dir, 'modules', 'crossreferences'))
    const sql = 'SELECT book_to, chapter_to, verse_to_start, verse_to_end, votes FROM cross_references WHERE book = ? AND chapter = ? AND verse = ?'
    const result = []
    const i = 0
    crossreferencesDir.forEach(fileName => {
      const crf = new Database(path.join(dir, 'modules', 'crossreferences', fileName), {readonly: true})
      const foundedRefs = crf.prepare(sql).all(args.bookNumber, args.chapterNumber, args.verse)

      const sql1 = 'SELECT verse, text from verses WHERE book_number = ? AND chapter = ? AND verse BETWEEN ? AND ?'
      const prepared = databases[args.bookFileName].prepare(sql1)
      for (const foundedRef of foundedRefs) {
        const unique = result.some(ref => ref.book_to === foundedRef.book_to &&
          ref.chapter_to === foundedRef.chapter_to &&
          ref.verse_to_start === foundedRef.verse_to_start &&
          ref.verse_to_end === foundedRef.verse_to_end)
        if (!unique) {
          const texts = prepared.all(foundedRef.book_to, foundedRef.chapter_to, foundedRef.verse_to_start, foundedRef.verse_to_end === 0 ? foundedRef.verse_to_start : foundedRef.verse_to_end)
          if (!texts.length) {
            continue
          }
          foundedRef.texts = texts
          foundedRef.module_name = fileName.split('.')[0]
          foundedRef.expanded = false
          result.push(foundedRef)
        }
      }
    })
    return result
  })

  ipcMain.handle('get-introductions', (event, args) => {
    const sql = args.chapterNumber === 1 ? 'SELECT * from introductions where book_number in (0, ?)' : 'SELECT * from introductions where book_number in (?)'
    let res = []
    try {
      res = databases[args.bookFileName].prepare(sql).all(args.bookNumber)
    } catch {
    }

    return res
  })

  ipcMain.handle('get-compared-translations', (event, args) => {
    let ph = path.join(dir, 'modules', 'books')
    const booksDir = fs.readdirSync(ph).map(moduleName => (/[^.]+?(?=\.)/.exec(moduleName))[0])

    const res = []
    let sql
    booksDir.forEach(moduleName => {
      try {
        sql = 'SELECT text, verse FROM verses WHERE book_number = ?  AND chapter = ? AND verse = ?'
        ph = path.join(dir, 'modules', 'books', moduleName + '.SQLite3')
        const bibleDb = new Database(ph, {readonly: true})
        const data = bibleDb.prepare(sql).get(args.bookNumber, args.chapterNumber, args.verseNumber)

        if (data) {
          sql = 'SELECT * from info'
          const info = Object.fromEntries(bibleDb.prepare(sql).raw().all())
          data.moduleDescription = info.description
          data.moduleName = moduleName
          data.direction = getDirection(info)
          res.push(data)
          bibleDb.close()
        }
      } catch {
      }
    })

    return res
  })

  ipcMain.handle('get-footnotes', (event, args) => {
    const ph = path.join(dir, 'modules', 'commentaries', args.moduleName + '.commentaries.SQLite3')
    let commentaryDb, res
    try {
      commentaryDb = new Database(ph, {readonly: true})
      const sql = 'SELECT marker, text FROM commentaries WHERE book_number = ? AND chapter_number_from = ?'
      res = Object.fromEntries(commentaryDb.prepare(sql).raw().all(args.bookNumber, args.chapterNumber))
    } catch {
    }
    commentaryDb?.close()
    return res
  })

  ipcMain.handle('get-commentaries', (event, args) => {
    const commentariesDb = new Database(path.join(dir, 'modules', 'commentaries',args.commentaryFileName + '.commentaries.SQLite3'), {readonly: true})
    let res = null
    try {
      const sql = `SELECT verse_number_from as verseNumber, text FROM commentaries WHERE book_number = ? AND chapter_number_from = ?`
      res = commentariesDb.prepare(sql).all(args.bookNumber, args.chapterNumber)
    }catch{}
    commentariesDb.close()
    return res
  })
}

export default useHandlers
