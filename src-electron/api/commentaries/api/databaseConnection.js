import {CommentariesDatabase} from "src-electron/models/Database/CommentariesDatabase";

export const connectDatabase = (filename) => new CommentariesDatabase(filename, {keepConnections: true})


export const disconnectDatabase = (filename) => new CommentariesDatabase(filename).disconnect()
