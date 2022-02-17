import {BibleBooks} from "src-electron/types/bible";
import {BookCategories} from "app/types/bookCategory";

export interface BibleBooksFront extends BibleBooks{
  bookCategory?: BookCategories
}
