import {API} from "src-electron/electron-preload";

declare global {
  interface Window {
    api: typeof API
  }
}

