import {BookNumbers} from "src-electron/types/bookNumbers";

export interface BibleRef {
  filename?: string,
  bookNumber?: BookNumbers,
  chapterNumber?: number,
  verseNumber?: number
}
