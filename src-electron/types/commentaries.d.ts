import {BookNumbers} from "app/types/bookNumbers";
import {InfoTable} from "src-electron/types/infoTable";

type nullable = 0 | null

export interface CommentariesInfo extends InfoTable{
  is_footnotes?: "true" | "false"
}
export interface Commentaries {
  book_number: BookNumbers,
  chapter_number_from: number,
  verse_number_from: number,
  chapter_number_to: number | nullable,
  verse_number_to: number | nullable,
  marker: string,
  text: string
}
