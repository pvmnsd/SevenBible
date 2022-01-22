import {BibleDatabase} from "src-e/models/Database/BibleDatabase";

export default (args) => {
  {
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
    const bibleDatabase = new BibleDatabase(args.filename)
    if (args.separator === 'AND') {
      let sql = `SELECT v.*, v.rowid b.short_name as bookShortName FROM verses v, books b WHERE v.book_number ${parsedNumbers[0].testament} AND v.book_number = b.book_number `
      parsedNumbers.forEach(item => sql += `AND v.text like '%<S>${item.number}</S>%' `)
      res = bibleDatabase.db.prepare(sql).all()
      res.forEach(item => item.strongNumbersPrefix = parsedNumbers[0].testament === '<=460' ? 'H' : 'G')
    }
    else if (args.separator === 'OR') {
      const texts = {}
      parsedNumbers.forEach(parsedNumber => {
        const sql = `SELECT v.*, v.rowid, b.short_name as bookShortName FROM verses v, books b WHERE v.book_number ${parsedNumber.testament} AND v.book_number = b.book_number AND v.text like '%<S>${parsedNumber.number}</S>%'`
        const findedTexts = bibleDatabase.db.prepare(sql).all()
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
  }
}
