import {GetPreparedCategoriesArgs} from "app/types/api-args/categories";
import { PreparedCategory} from "app/types/api-modified/categories";
import getVerses from "src-electron/api/bible/api/getVerses";
import getBibleBooks from "src-electron/api/bible/api/getBibleBooks";
import {extractShortName} from "src-electron/helpers/bookNames";

export default (args: GetPreparedCategoriesArgs) => {
  const {
    bibleFileName,
    categories
  } = args
  const booksList = getBibleBooks(bibleFileName)

  let res: PreparedCategory[] = []

  categories.forEach((category, i) => {
    const preparedCategory: PreparedCategory = {...category, bookmarks: []}

    category.bookmarks.forEach((bookmark, j) => {
      const bibleVerses = getVerses({
        filename: bibleFileName,
        bookNumber: bookmark.bookNumber!,
        chapterNumber: bookmark.startChapterNumber!,
        selectedVerseFrom: bookmark.startVerseNumber!,
        selectedVerseTo: bookmark.endVerseNumber,
      })
      preparedCategory.bookmarks.push({
        ...bookmark,
        bookShortName: extractShortName(booksList, bookmark.bookNumber!),
        texts: bibleVerses
        // rowid: i.toString() + j,
        // categoryName: category.name
      })
    })
    res.push(preparedCategory)
  })
  return res

}
