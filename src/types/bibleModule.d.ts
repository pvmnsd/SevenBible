import {BibleBooks} from "src-electron/types/bible";
import {BookCategories} from "src-electron/types/bookCategory";

export interface BibleBooksFront extends BibleBooks{
  bookCategory?: BookCategories
}
