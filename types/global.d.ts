import {API} from "src-electron/electron-preload";

declare global {
  var dir: string
  interface Window {
    api: typeof API,
    dir: string
  }
  interface String{
    format: (...args: any[]) => void
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
  interface BooleanConstructor {
    parse: (str: string | undefined, fallback?: boolean) => boolean
  }
}
