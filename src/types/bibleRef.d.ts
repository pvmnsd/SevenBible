import {BookNumbers} from "src-e/types/bookNumbers";

export interface BibleRef {
  filename?: string,
  bookNumber?: BookNumbers,
  chapterNumber?: number,
  verseNumber?: number
}
