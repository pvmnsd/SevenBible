import {BookNumbers} from "src-e/types/bookNumbers";
import {BookColors} from "src-e/types/bookColors";
import {InfoTable} from "src-e/types/infoTable";

type boolstr = 'true' | 'false'
type strongprefix = 'H'| 'G'

export interface BibleInfo extends InfoTable{
  chapter_string?: string,
  chapter_string_ot?: string,
  chapter_string_nt?: string,
  chapter_string_ps?: string,
  introduction_string?: string,
  strong_numbers?: boolstr,
  right_to_left?: boolstr,
  right_to_left_ot?: boolstr,
  right_to_left_nt?: boolstr,
  book_list_right_to_left?: boolstr,
  book_list_right_to_left_ot?: boolstr,
  book_list_right_to_left_nt?: boolstr
  strong_numbers_prefix?: strongprefix
}

export interface BibleBooks {
  book_number: BookNumbers,
  book_color?: BookColors,
  short_name: string,
  long_name: string
}

export interface  BibleBooksAll extends BibleBooks{
  is_present: boolean
}

export interface BibleVerses {
  book_number: BookNumbers,
  chapter: number,
  verse: number,
  text: string
}

export interface BibleIntroductions {
  book_number: BookNumbers,
  introduction: string
}

export interface BibleStories {
  book_number: BookNumbers,
  chapter: number,
  verse: number,
  order_if_several: number | null,
  title: string
}
