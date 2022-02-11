import {BookNumbers} from "src-electron/types/bookNumbers";

export interface BookmarkCategory {
  backgroundHighlighting: boolean,
  bookmarks: Bookmark,
  colorIndex: number,
  isDefault: boolean,
  name: string,
  quickBookmarkAdding: boolean
}

export interface Bookmark {
  bookNumber: BookNumbers,
  dateCreated: string,
  dateModified: string,
  description: string,
  endChapterNumber: number,
  endVerseNumber: number,
  isForRussianNumbering: boolean,
  startChapterNumber: number,
  startVerseNumber: number
}
