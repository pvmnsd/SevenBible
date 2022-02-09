import {API} from "src-electron/electron-preload";

declare global {
  interface Window {
    api: typeof API
  }
  interface String{
    format: () => void
  }
  interface StringConstructor{
    hasReplacer: (string: string) => boolean
  }
  interface ObjectConstructor {
    getValue: (path: string, object: any) => any,
    setValue: (path: string, object: any, value: any) => void
  }
  interface Array<T> {
    remove: (value: any) => void
  }
}

