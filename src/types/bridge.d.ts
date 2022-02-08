import {API} from "src-e/electron-preload";

declare global {
  interface Window {
    api: typeof API
  }
}
