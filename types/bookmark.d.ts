import {BookNumbers} from "app/types/bookNumbers";

export interface BookmarkCategory {
  backgroundHighlighting: boolean,
  bookmarks: Bookmark[],
  colorIndex: number,
  isDefault: boolean,
  name: string,
  quickBookmarkAdding: boolean,
  backgroundColor?: string
}

export interface Bookmark {
  bookNumber?: BookNumbers,
  dateCreated?: string,
  dateModified?: string,
  description?: string,
  endChapterNumber?: number,
  endVerseNumber?: number,
  isForRussianNumbering?: boolean,
  startChapterNumber?: number,
  startVerseNumber?: number,
}
