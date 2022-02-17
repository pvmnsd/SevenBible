import {BookNumbers} from "app/types/bookNumbers";

export interface BibleRef {
  filename?: string,
  bookNumber?: BookNumbers,
  chapterNumber?: number,
  verseNumber?: number
}
