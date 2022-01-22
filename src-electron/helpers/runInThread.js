import {Worker} from "worker_threads"
import path from "path"


export default (_path, args) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(..._path), {
      workerData: {...args, dir: global.dir}
    })
    worker.once('message', resolve)
    worker.once('error', reject)
  })
}
