import {StrongDatabase} from "src-e/models/Database/StrongDatabase";

export default (args) => {
  {
    const strongDatabase = new StrongDatabase(args.filename)
    const res = {}
    args.strongNumbers.forEach(number => {
      let sql = 'SELECT strong_number FROM cognate_strong_numbers WHERE group_id in(SELECT group_id FROM cognate_strong_numbers WHERE strong_number = ?)'
      let data = strongDatabase.prepare(sql).pluck().all(number)
      res[number] = {}
      res[number].cognate = data

      sql = 'SELECT definition FROM dictionary WHERE topic=UPPER(?)'
      data = strongDatabase.prepare(sql).get(number)
      res[number].definition = data.definition
    })
    return res
  }
}
