import {VerseNumberClickEvent} from "src/types/events";

export interface App {
  appearance: {
    theme: string,
    font: string
  },
  control: {
    verseNumberClickEvent: VerseNumberClickEvent
  },
  win: WindowBounds,
  bookmarks: Bookmarks
}

export interface WindowBounds {
  x: number,
  y: number,
  width: number,
  height: number
}

export interface Bookmarks {
  filename: string
}
