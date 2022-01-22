import runInThread from "src-e/helpers/runInThread";

export default (args) => {
    return runInThread([__dirname, './findBibleTextWorker.mjs'], args)
}
