import {parentPort, workerData} from 'worker_threads'
import findBibleText from './findBibleTexts.mjs'

parentPort.postMessage(findBibleText(workerData))
