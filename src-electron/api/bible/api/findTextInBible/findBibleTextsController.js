import runInThread from "src-electron/helpers/runInThread";

export default (args) => {
    return runInThread([__dirname, './findBibleTextWorker.mjs'], args)
}
