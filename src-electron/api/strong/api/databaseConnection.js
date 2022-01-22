import {StrongDatabase} from "src-e/models/Database/StrongDatabase";

export const connectDatabase = (filename) => {new StrongDatabase(filename, {keepConnections: true})}

export const disconnectDatabase = (filename) => new StrongDatabase(filename).disconnect()

