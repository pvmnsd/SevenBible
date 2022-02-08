import {BibleDatabase} from "src-e/models/Database/BibleDatabase";

export const connectDatabase = (filename) => {
  console.log(filename)
  new BibleDatabase(filename, {keepConnections: true})
}

export const disconnectDatabase = (filename) => {
  console.log(filename)
  new BibleDatabase(filename).disconnect()
}


